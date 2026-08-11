import { describe, expect, it } from "vitest";

import {
  LINEAR_SYSTEMS_PRESETS,
  createLinearSystemsInputFingerprint,
  linearSystemsPresetById,
  matchLinearSystemsPreset,
} from "./linearSystemsPresets";

describe("Linear Systems presets", () => {
  it("defines exactly the two approved presets", () => {
    expect(
      LINEAR_SYSTEMS_PRESETS.map(({ id, name, A, b, xRef }) => ({
        id,
        name,
        A,
        b,
        xRef,
      }))
    ).toEqual([
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
    ]);
  });

  it("deep-freezes preset structures returned to callers", () => {
    const preset = linearSystemsPresetById("starter_3x3");
    expect(Object.isFrozen(LINEAR_SYSTEMS_PRESETS)).toBe(true);
    expect(Object.isFrozen(preset)).toBe(true);
    expect(Object.isFrozen(preset.A)).toBe(true);
    expect(Object.isFrozen(preset.A[0])).toBe(true);
    expect(Object.isFrozen(preset.b)).toBe(true);
    expect(Object.isFrozen(preset.xRef)).toBe(true);
    expect(() => ((preset.A[0] as number[])[0] = 99)).toThrow();
    expect(linearSystemsPresetById("starter_3x3").A[0]![0]).toBe(3);
  });

  it("matches only an exact approved numerical input fingerprint", () => {
    const preset = linearSystemsPresetById("row_swap_required");
    expect(matchLinearSystemsPreset(preset.A, preset.b)?.id).toBe("row_swap_required");
    expect(
      matchLinearSystemsPreset(
        preset.A.map((row, index) =>
          index === 0 ? row.map((value, column) => (column === 0 ? 1 : value)) : [...row]
        ),
        preset.b
      )
    ).toBeUndefined();
  });

  it("creates deterministic fingerprints sensitive to dimensions and values", () => {
    const first = linearSystemsPresetById("starter_3x3");
    expect(createLinearSystemsInputFingerprint(first.A, first.b)).toBe(first.inputFingerprint);
    expect(
      createLinearSystemsInputFingerprint(
        [
          [3, 1],
          [2, 4],
        ],
        [6, 9]
      )
    ).not.toBe(first.inputFingerprint);
    expect(
      createLinearSystemsInputFingerprint(
        [
          [3, 1, -1],
          [2, 4, 1],
          [-1, 2, 5],
        ],
        [6, 9, -1]
      )
    ).not.toBe(first.inputFingerprint);
  });
});
