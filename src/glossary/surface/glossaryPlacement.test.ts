import { describe, expect, it } from "vitest";
import { placeGlossarySurface } from "./glossaryPlacement";

const viewport = { width: 1000, height: 800 };
const surface = { width: 360, height: 300 };

describe("Glossary placement", () => {
  it("prefers the bottom with the approved gap and bounds", () => {
    expect(placeGlossarySurface({
      triggerConnected: true,
      trigger: { left: 300, right: 400, top: 100, bottom: 130 },
      surface,
      viewport,
    })).toEqual({
      side: "bottom",
      left: 300,
      top: 138,
      maxWidth: 420,
      maxHeight: 560,
    });
  });

  it("flips above when the lower space is insufficient", () => {
    const placement = placeGlossarySurface({
      triggerConnected: true,
      trigger: { left: 300, right: 400, top: 700, bottom: 730 },
      surface,
      viewport,
    });

    expect(placement).toMatchObject({
      side: "top",
      left: 300,
      top: 392,
    });
  });

  it("shifts left and right within the 12px viewport margin", () => {
    expect(placeGlossarySurface({
      triggerConnected: true,
      trigger: { left: 900, right: 980, top: 100, bottom: 130 },
      surface,
      viewport,
    })?.left).toBe(628);
    expect(placeGlossarySurface({
      triggerConnected: true,
      trigger: { left: -20, right: 40, top: 100, bottom: 130 },
      surface,
      viewport,
    })?.left).toBe(12);
  });

  it("uses the approved width and height caps on narrow and tall viewports", () => {
    expect(placeGlossarySurface({
      triggerConnected: true,
      trigger: { left: 20, right: 100, top: 80, bottom: 110 },
      surface: { width: 600, height: 900 },
      viewport: { width: 390, height: 600 },
    })).toMatchObject({
      maxWidth: 366,
      maxHeight: 420,
      left: 12,
    });
  });

  it("refuses detached and far-offscreen triggers", () => {
    expect(placeGlossarySurface({
      triggerConnected: false,
      trigger: { left: 20, right: 80, top: 50, bottom: 80 },
      surface,
      viewport,
    })).toBeUndefined();
    expect(placeGlossarySurface({
      triggerConnected: true,
      trigger: { left: 20, right: 80, top: 900, bottom: 930 },
      surface,
      viewport,
    })).toBeUndefined();
  });
});
