import {
  createGlossaryValidationPolicy,
  defineGlossaryScopeId,
  defineGlossaryTermId,
} from "../glossary/glossaryBuilders";
import {
  createLabGlossaryBinding,
  type LabGlossaryBinding,
} from "../glossary/glossaryController";
import { coreGlossaryEntries } from "../glossary/coreGlossary";
import { createGlossaryRegistry } from "../glossary/glossaryRegistry";
import type {
  GlossaryScopeId,
  GlossaryScopeRerenderTransaction,
  GlossaryTermId,
  GlossaryTermRenderResult,
  ResolvedGlossaryEntry,
} from "../glossary/glossaryRuntimeTypes";
import {
  odeGlossaryEntries,
  odeGlossaryExtension,
} from "./odeGlossaryContent";

const strictContract = createGlossaryValidationPolicy({ mode: "strict" });

function requiredTermId(value: string): GlossaryTermId {
  const id = defineGlossaryTermId(value, strictContract);
  if (id === undefined) throw new Error(`Invalid ODE Glossary term ID: ${value}`);
  return id;
}

function requiredScopeId(value: string): GlossaryScopeId {
  const id = defineGlossaryScopeId(value, strictContract);
  if (id === undefined) {
    throw new Error(`Invalid ODE Glossary scope ID: ${value}`);
  }
  return id;
}

export const ODE_WAVE1_SCOPE_IDS = Object.freeze({
  context: requiredScopeId("ode_wave1_context"),
  method: requiredScopeId("ode_wave1_method"),
  data: requiredScopeId("ode_wave1_data"),
  output: requiredScopeId("ode_wave1_output"),
});

export type OdeWave1ScopeName = keyof typeof ODE_WAVE1_SCOPE_IDS;

export type OdeWave1AnnotationId =
  | "ODE-W1-ANN-001"
  | "ODE-W1-ANN-002"
  | "ODE-W1-ANN-003"
  | "ODE-W1-ANN-004"
  | "ODE-W1-ANN-005"
  | "ODE-W1-ANN-006"
  | "ODE-W1-ANN-007"
  | "ODE-W1-ANN-008"
  | "ODE-W1-ANN-009"
  | "ODE-W1-ANN-010";

export interface OdeWave1Annotation {
  readonly id: OdeWave1AnnotationId;
  readonly termId: GlossaryTermId;
  readonly scope: OdeWave1ScopeName;
  readonly display: string;
}

function annotation(
  id: OdeWave1AnnotationId,
  termId: string,
  scope: OdeWave1ScopeName,
  display: string
): OdeWave1Annotation {
  return Object.freeze({
    id,
    termId: requiredTermId(termId),
    scope,
    display,
  });
}

export const ODE_WAVE1_ANNOTATIONS: readonly OdeWave1Annotation[] =
  Object.freeze([
    annotation(
      "ODE-W1-ANN-001",
      "ordinary_differential_equation",
      "context",
      "ordinary differential equation"
    ),
    annotation(
      "ODE-W1-ANN-002",
      "initial_value_problem",
      "context",
      "initial value problem"
    ),
    annotation(
      "ODE-W1-ANN-003",
      "initial_condition",
      "data",
      "Initial condition"
    ),
    annotation("ODE-W1-ANN-004", "step_size", "data", "Time-step size"),
    annotation("ODE-W1-ANN-005", "time_grid", "data", "time grid"),
    annotation(
      "ODE-W1-ANN-006",
      "numerical_approximation",
      "output",
      "Final numerical approximation"
    ),
    annotation(
      "ODE-W1-ANN-007",
      "exact_solution",
      "data",
      "Exact solution"
    ),
    annotation(
      "ODE-W1-ANN-008",
      "explicit_scheme",
      "method",
      "Explicit scheme"
    ),
    annotation(
      "ODE-W1-ANN-009",
      "forward_euler_method",
      "data",
      "Forward Euler"
    ),
    annotation(
      "ODE-W1-ANN-010",
      "backward_euler_method",
      "data",
      "Backward Euler"
    ),
  ]);

const annotationsById = new Map(
  ODE_WAVE1_ANNOTATIONS.map((record) => [record.id, record])
);

const registry = createGlossaryRegistry({
  coreEntries: Object.freeze([
    ...coreGlossaryEntries,
    ...odeGlossaryEntries,
  ]),
  extensions: Object.freeze([odeGlossaryExtension]),
  policy: strictContract,
});

const cardOrder = [
  "ordinary_differential_equation",
  "initial_condition",
  "initial_value_problem",
  "step_size",
  "time_grid",
  "numerical_approximation",
  "exact_solution",
  "explicit_scheme",
  "forward_euler_method",
  "backward_euler_method",
] as const;

export const ODE_WAVE1_GLOSSARY_CARDS: readonly ResolvedGlossaryEntry[] =
  Object.freeze(
    cardOrder.map((id) => {
      const entry = registry.resolveById("ode", requiredTermId(id));
      if (entry === undefined) {
        throw new Error(`Missing composed ODE Glossary card: ${id}`);
      }
      return entry;
    })
  );

interface ManagedScopeTransaction {
  readonly transaction: GlossaryScopeRerenderTransaction;
  active: boolean;
}

export interface OdeGlossaryRenderTransaction {
  createTerm(annotationId: OdeWave1AnnotationId): GlossaryTermRenderResult;
  commitImmediateScopes(): void;
  commitOutputScope(): void;
  abort(): void;
}

export interface OdeGlossaryRuntime {
  readonly binding: LabGlossaryBinding;
  beginRender(): OdeGlossaryRenderTransaction;
  dispose(): void;
}

export function createOdeGlossaryRuntime(): OdeGlossaryRuntime {
  const binding = createLabGlossaryBinding({
    moduleId: "ode",
    registry,
    policy: strictContract,
  });
  let activeRender: OdeGlossaryRenderTransaction | undefined;
  let disposed = false;

  const runtime: OdeGlossaryRuntime = {
    binding,
    beginRender(): OdeGlossaryRenderTransaction {
      if (disposed) throw new Error("The ODE Glossary runtime is disposed.");
      activeRender?.abort();

      const scopes = Object.fromEntries(
        Object.entries(ODE_WAVE1_SCOPE_IDS).map(([name, id]) => [
          name,
          {
            transaction: binding.beginScopeRerender({ id }),
            active: true,
          } satisfies ManagedScopeTransaction,
        ])
      ) as Record<OdeWave1ScopeName, ManagedScopeTransaction>;
      let active = true;

      const finishScope = (
        name: OdeWave1ScopeName,
        action: "commit" | "abort"
      ): void => {
        const managed = scopes[name];
        if (!managed.active) return;
        managed.active = false;
        managed.transaction[action]();
      };
      const finishIfComplete = (): void => {
        if (Object.values(scopes).some((managed) => managed.active)) return;
        active = false;
        if (activeRender === renderTransaction) activeRender = undefined;
      };

      const renderTransaction: OdeGlossaryRenderTransaction = Object.freeze({
        createTerm(
          annotationId: OdeWave1AnnotationId
        ): GlossaryTermRenderResult {
          if (!active) {
            throw new Error("The ODE Glossary render transaction is closed.");
          }
          const record = annotationsById.get(annotationId);
          if (record === undefined) {
            throw new Error(`Unknown ODE Glossary annotation: ${annotationId}`);
          }
          const managed = scopes[record.scope];
          if (!managed.active) {
            throw new Error(
              `The ODE Glossary ${record.scope} scope is already closed.`
            );
          }
          const registryDisplay =
            annotationId === "ODE-W1-ANN-005"
              ? "Time grid"
              : annotationId === "ODE-W1-ANN-006"
                ? "Numerical approximation"
                : record.display;
          const result = managed.transaction.scope.createTerm({
            termId: record.termId,
            display: registryDisplay,
          });
          if (result.node instanceof HTMLElement) {
            result.node.textContent = record.display;
            result.node.dataset.glossaryAnnotationId = record.id;
            result.node.dataset.glossaryTermId = record.termId;
          }
          return result;
        },
        commitImmediateScopes(): void {
          finishScope("context", "commit");
          finishScope("method", "commit");
          finishScope("data", "commit");
          finishIfComplete();
        },
        commitOutputScope(): void {
          finishScope("output", "commit");
          finishIfComplete();
        },
        abort(): void {
          for (const name of Object.keys(scopes) as OdeWave1ScopeName[]) {
            finishScope(name, "abort");
          }
          finishIfComplete();
        },
      });
      activeRender = renderTransaction;
      return renderTransaction;
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      activeRender?.abort();
      binding.dispose();
    },
  };

  return Object.freeze(runtime);
}
