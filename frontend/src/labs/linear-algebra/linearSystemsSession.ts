import {
  LINEAR_SYSTEMS_MAX_DIMENSION,
  LINEAR_SYSTEMS_MIN_DIMENSION,
  solveLinearSystem,
  type LinearSystemSolveError,
  type LinearSystemSolveSuccess,
} from "@numerical-t-lab/numerics/linear-algebra/linear-systems-numerics";
import {
  createLinearSystemsInputFingerprint,
  linearSystemsPresetById,
  matchLinearSystemsPreset,
  type LinearSystemsPresetId,
} from "@numerical-t-lab/numerics/linear-algebra/linear-systems-presets";
import type { ResumeSummary } from "../../app/contracts";

export type LinearSystemsWorkflowStep =
  | "method"
  | "data"
  | "output"
  | "diagnostics";

export interface LinearSystemsDraft {
  readonly dimension: number;
  readonly A: readonly (readonly string[])[];
  readonly b: readonly string[];
}

export type LinearSystemsResultStatus = "absent" | "current" | "stale";

export interface LinearSystemsSessionState {
  readonly version: 1;
  readonly step: LinearSystemsWorkflowStep;
  readonly dimension: number;
  readonly ADraft: readonly (readonly string[])[];
  readonly bDraft: readonly string[];
  readonly selectedPresetId: LinearSystemsPresetId | null;
  readonly inputFingerprint: string | null;
  readonly latestSuccessfulResult?: LinearSystemSolveSuccess;
  readonly resultStatus: LinearSystemsResultStatus;
  readonly meaningful: boolean;
}

export type LinearSystemsSessionFailureCode =
  | "draft_shape_mismatch"
  | "incomplete_numeric_draft"
  | "non_finite_numeric_draft"
  | "invalid_numeric_draft";

export type LinearSystemsDraftIssueCode =
  | "shape"
  | "incomplete"
  | "malformed"
  | "non_finite";

export interface LinearSystemsDraftIssue {
  readonly code: LinearSystemsDraftIssueCode;
  readonly message: string;
  readonly field?: "A" | "b";
  readonly row?: number;
  readonly column?: number;
}

export interface LinearSystemsSessionFailure {
  readonly code: LinearSystemsSessionFailureCode;
  readonly message: string;
}

export type LinearSystemsSessionRunOutcome =
  | {
      readonly ok: true;
      readonly session: LinearSystemsSessionState;
      readonly result: LinearSystemSolveSuccess;
    }
  | {
      readonly ok: false;
      readonly session: LinearSystemsSessionState;
      readonly error: LinearSystemsSessionFailure | LinearSystemSolveError;
    };

interface ParsedDraft {
  readonly A: number[][];
  readonly b: number[];
}

type DraftParseOutcome =
  | { readonly ok: true; readonly parsed: ParsedDraft }
  | { readonly ok: false; readonly error: LinearSystemsSessionFailure };

const NUMERIC_LITERAL = /^[+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:[eE][+-]?\d+)?$/;

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreeze(child);
    }
    Object.freeze(value);
  }
  return value;
}

function sessionFailure(
  code: LinearSystemsSessionFailureCode,
  message: string
): LinearSystemsSessionFailure {
  return Object.freeze({ code, message });
}

function parseNumericLiteral(value: string): number | undefined {
  const trimmed = value.trim();
  if (!NUMERIC_LITERAL.test(trimmed)) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function validateLinearSystemsDraft(
  draft: LinearSystemsDraft
): readonly LinearSystemsDraftIssue[] {
  if (
    !Number.isInteger(draft.dimension) ||
    draft.dimension < LINEAR_SYSTEMS_MIN_DIMENSION ||
    draft.dimension > LINEAR_SYSTEMS_MAX_DIMENSION ||
    draft.A.length !== draft.dimension ||
    draft.b.length !== draft.dimension ||
    draft.A.some((row) => row.length !== draft.dimension)
  ) {
    return Object.freeze([
      Object.freeze({
        code: "shape" as const,
        message:
          "The matrix and right-hand side drafts must match a square dimension from 2 through 6.",
      }),
    ]);
  }

  const issues: LinearSystemsDraftIssue[] = [];
  const inspect = (
    value: string,
    field: "A" | "b",
    row: number,
    column?: number
  ): void => {
    const trimmed = value.trim();
    const location =
      field === "A"
        ? `Matrix A, row ${row + 1}, column ${(column ?? 0) + 1}`
        : `Vector b, row ${row + 1}`;
    if (trimmed.length === 0) {
      issues.push({
        code: "incomplete",
        field,
        row,
        ...(column === undefined ? {} : { column }),
        message: `${location} is incomplete. Enter a decimal number.`,
      });
      return;
    }
    if (!NUMERIC_LITERAL.test(trimmed)) {
      issues.push({
        code: "malformed",
        field,
        row,
        ...(column === undefined ? {} : { column }),
        message: `${location} must use decimal or scientific notation.`,
      });
      return;
    }
    if (!Number.isFinite(Number(trimmed))) {
      issues.push({
        code: "non_finite",
        field,
        row,
        ...(column === undefined ? {} : { column }),
        message: `${location} must be finite.`,
      });
    }
  };

  draft.A.forEach((row, rowIndex) =>
    row.forEach((value, column) => inspect(value, "A", rowIndex, column))
  );
  draft.b.forEach((value, row) => inspect(value, "b", row));
  return deepFreeze(issues);
}

function parseDraft(draft: LinearSystemsDraft): DraftParseOutcome {
  if (
    !Number.isInteger(draft.dimension) ||
    draft.A.length !== draft.dimension ||
    draft.b.length !== draft.dimension ||
    draft.A.some((row) => row.length !== draft.dimension)
  ) {
    return {
      ok: false,
      error: sessionFailure(
        "draft_shape_mismatch",
        "The matrix and right-hand side drafts must match the selected square dimension."
      ),
    };
  }

  const issue = validateLinearSystemsDraft(draft)[0];
  if (issue) {
    const code: LinearSystemsSessionFailureCode =
      issue.code === "incomplete"
        ? "incomplete_numeric_draft"
        : issue.code === "non_finite"
          ? "non_finite_numeric_draft"
          : "invalid_numeric_draft";
    return {
      ok: false,
      error: sessionFailure(code, issue.message),
    };
  }

  const A: number[][] = [];
  for (const row of draft.A) {
    const parsedRow: number[] = [];
    for (const value of row) {
      const parsed = parseNumericLiteral(value);
      if (parsed === undefined) {
        return {
          ok: false,
          error: sessionFailure(
            "invalid_numeric_draft",
            "Every matrix and right-hand side entry must be a finite decimal number."
          ),
        };
      }
      parsedRow.push(parsed);
    }
    A.push(parsedRow);
  }

  const b: number[] = [];
  for (const value of draft.b) {
    const parsed = parseNumericLiteral(value);
    if (parsed === undefined) {
      return {
        ok: false,
        error: sessionFailure(
          "invalid_numeric_draft",
          "Every matrix and right-hand side entry must be a finite decimal number."
        ),
      };
    }
    b.push(parsed);
  }
  return { ok: true, parsed: { A, b } };
}

function draftFromPreset(id: LinearSystemsPresetId): LinearSystemsDraft {
  const preset = linearSystemsPresetById(id);
  return {
    dimension: preset.A.length,
    A: preset.A.map((row) => row.map(String)),
    b: preset.b.map(String),
  };
}

function resultStatusFor(
  latestSuccessfulResult: LinearSystemSolveSuccess | undefined,
  inputFingerprint: string | null
): LinearSystemsResultStatus {
  if (!latestSuccessfulResult) return "absent";
  return inputFingerprint === latestSuccessfulResult.inputFingerprint
    ? "current"
    : "stale";
}

function buildSession(
  draft: LinearSystemsDraft,
  latestSuccessfulResult?: LinearSystemSolveSuccess,
  step: LinearSystemsWorkflowStep = "method"
): LinearSystemsSessionState {
  const copiedDraft = {
    dimension: draft.dimension,
    A: draft.A.map((row) => [...row]),
    b: [...draft.b],
  };
  const parsed = parseDraft(copiedDraft);
  const inputFingerprint = parsed.ok
    ? createLinearSystemsInputFingerprint(parsed.parsed.A, parsed.parsed.b)
    : null;
  const selectedPresetId = parsed.ok
    ? matchLinearSystemsPreset(parsed.parsed.A, parsed.parsed.b)?.id ?? null
    : null;
  const starterFingerprint = linearSystemsPresetById("starter_3x3").inputFingerprint;
  const meaningful =
    latestSuccessfulResult !== undefined ||
    inputFingerprint === null ||
    inputFingerprint !== starterFingerprint ||
    step === "output" ||
    step === "diagnostics";

  return deepFreeze({
    version: 1 as const,
    step,
    dimension: copiedDraft.dimension,
    ADraft: copiedDraft.A,
    bDraft: copiedDraft.b,
    selectedPresetId,
    inputFingerprint,
    ...(latestSuccessfulResult ? { latestSuccessfulResult } : {}),
    resultStatus: resultStatusFor(latestSuccessfulResult, inputFingerprint),
    meaningful,
  });
}

function draftsEqual(
  session: LinearSystemsSessionState,
  draft: LinearSystemsDraft
): boolean {
  return (
    session.dimension === draft.dimension &&
    session.ADraft.length === draft.A.length &&
    session.bDraft.length === draft.b.length &&
    session.ADraft.every(
      (row, rowIndex) =>
        row.length === draft.A[rowIndex]?.length &&
        row.every((value, column) => value === draft.A[rowIndex]?.[column])
    ) &&
    session.bDraft.every((value, index) => value === draft.b[index])
  );
}

export function createLinearSystemsSession(
  presetId: LinearSystemsPresetId = "starter_3x3"
): LinearSystemsSessionState {
  return buildSession(draftFromPreset(presetId));
}

export function loadLinearSystemsPreset(
  session: LinearSystemsSessionState,
  presetId: LinearSystemsPresetId
): LinearSystemsSessionState {
  return buildSession(
    draftFromPreset(presetId),
    session.latestSuccessfulResult,
    session.step
  );
}

export function replaceLinearSystemsDraft(
  session: LinearSystemsSessionState,
  draft: LinearSystemsDraft
): LinearSystemsSessionState {
  if (draftsEqual(session, draft)) return session;
  return buildSession(draft, session.latestSuccessfulResult, session.step);
}

export function resizeLinearSystemsDraft(
  session: LinearSystemsSessionState,
  dimension: number
): LinearSystemsSessionState {
  if (
    !Number.isInteger(dimension) ||
    dimension < LINEAR_SYSTEMS_MIN_DIMENSION ||
    dimension > LINEAR_SYSTEMS_MAX_DIMENSION
  ) {
    return session;
  }
  if (dimension === session.dimension) return session;
  const A = Array.from({ length: dimension }, (_, row) =>
    Array.from(
      { length: dimension },
      (_, column) => session.ADraft[row]?.[column] ?? ""
    )
  );
  const b = Array.from(
    { length: dimension },
    (_, row) => session.bDraft[row] ?? ""
  );
  return buildSession(
    { dimension, A, b },
    session.latestSuccessfulResult,
    "data"
  );
}

export function setLinearSystemsWorkflowStep(
  session: LinearSystemsSessionState,
  step: LinearSystemsWorkflowStep
): LinearSystemsSessionState {
  if (session.step === step) return session;
  return buildSession(
    {
      dimension: session.dimension,
      A: session.ADraft,
      b: session.bDraft,
    },
    session.latestSuccessfulResult,
    step
  );
}

export function runLinearSystemsSession(
  session: LinearSystemsSessionState
): LinearSystemsSessionRunOutcome {
  const parsed = parseDraft({
    dimension: session.dimension,
    A: session.ADraft,
    b: session.bDraft,
  });
  if (!parsed.ok) {
    return Object.freeze({ ok: false as const, session, error: parsed.error });
  }

  const solve = solveLinearSystem(parsed.parsed);
  if (!solve.ok) {
    return Object.freeze({ ok: false as const, session, error: solve.error });
  }

  const nextSession = buildSession(
    {
      dimension: session.dimension,
      A: session.ADraft,
      b: session.bDraft,
    },
    solve.result,
    "output"
  );
  return Object.freeze({
    ok: true as const,
    session: nextSession,
    result: solve.result,
  });
}

export function computeLinearSystemsLabMeaningful(
  session: LinearSystemsSessionState
): boolean {
  return session.meaningful;
}

export function createLinearSystemsResumeSummary(
  session: LinearSystemsSessionState,
  timestamp: number
): ResumeSummary {
  const stepLabel: ResumeSummary["stepLabel"] =
    session.step === "method"
      ? "Method"
      : session.step === "data"
        ? "Data"
        : session.step === "output"
          ? "Output"
          : "Diagnostics";
  return Object.freeze({
    moduleId: "linear_algebra" as const,
    route: "/linear-algebra/linear-systems",
    labTitle: "Linear Systems Lab",
    stepLabel,
    methodLabel: "Gaussian elimination with partial pivoting",
    ...(session.resultStatus === "absent"
      ? {}
      : {
          resultLabel:
            session.resultStatus === "current"
              ? ("Result current" as const)
              : ("Result stale" as const),
        }),
    lastMeaningfulInteraction: timestamp,
  });
}
