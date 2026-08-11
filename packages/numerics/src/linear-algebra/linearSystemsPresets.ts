export type LinearSystemsPresetId = "starter_3x3" | "row_swap_required";

export type LinearSystemsMatrix = readonly (readonly number[])[];
export type LinearSystemsVector = readonly number[];

export interface LinearSystemsPreset {
  readonly id: LinearSystemsPresetId;
  readonly name: string;
  readonly A: LinearSystemsMatrix;
  readonly b: LinearSystemsVector;
  readonly xRef: LinearSystemsVector;
  readonly inputFingerprint: string;
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreeze(child);
    }
    Object.freeze(value);
  }
  return value;
}

function numberToken(value: number): string {
  if (Object.is(value, -0)) return "-0";
  if (Number.isNaN(value)) return "NaN";
  if (value === Number.POSITIVE_INFINITY) return "+Infinity";
  if (value === Number.NEGATIVE_INFINITY) return "-Infinity";
  return String(value);
}

/**
 * Fingerprints parsed numerical input, including dimensions and signed zero.
 * It is an identity token, not a hash or a numerical equivalence test.
 */
export function createLinearSystemsInputFingerprint(
  A: LinearSystemsMatrix,
  b: LinearSystemsVector
): string {
  return JSON.stringify({
    rows: A.length,
    columns: A.map((row) => row.length),
    A: A.map((row) => row.map(numberToken)),
    b: b.map(numberToken),
  });
}

type PresetDefinition = Omit<LinearSystemsPreset, "inputFingerprint">;

const PRESET_DEFINITIONS: readonly PresetDefinition[] = [
  {
    id: "starter_3x3",
    name: "Starter 3×3",
    A: [
      [3, 1, -1],
      [2, 4, 1],
      [-1, 2, 5],
    ],
    b: [6, 9, -2],
    xRef: [1, 2, -1],
  },
  {
    id: "row_swap_required",
    name: "Row swap required",
    A: [
      [0, 2, 1],
      [1, -2, -3],
      [2, 3, 1],
    ],
    b: [0, -3, 1],
    xRef: [1, -1, 2],
  },
];

export const LINEAR_SYSTEMS_PRESETS: readonly LinearSystemsPreset[] = deepFreeze(
  PRESET_DEFINITIONS.map((preset) => ({
    ...preset,
    inputFingerprint: createLinearSystemsInputFingerprint(preset.A, preset.b),
  }))
);

const PRESETS_BY_ID = new Map(
  LINEAR_SYSTEMS_PRESETS.map((preset) => [preset.id, preset])
);

const PRESETS_BY_FINGERPRINT = new Map(
  LINEAR_SYSTEMS_PRESETS.map((preset) => [preset.inputFingerprint, preset])
);

export function linearSystemsPresetById(
  id: LinearSystemsPresetId
): LinearSystemsPreset {
  const preset = PRESETS_BY_ID.get(id);
  if (!preset) throw new Error(`Unknown Linear Systems preset: ${id}`);
  return preset;
}

export function matchLinearSystemsPreset(
  A: LinearSystemsMatrix,
  b: LinearSystemsVector
): LinearSystemsPreset | undefined {
  return PRESETS_BY_FINGERPRINT.get(createLinearSystemsInputFingerprint(A, b));
}
