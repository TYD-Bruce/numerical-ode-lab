import { describe, expect, it } from "vitest";

import { catalogByFamily } from "./methodCatalog";

describe("ODE method catalog learner copy", () => {
  it("describes the Adams-Moulton UI-default Newton corrector without hiding the predictor boundary", () => {
    const blurb = catalogByFamily("adams_moulton").blurb;

    expect(blurb).toContain("Adams-Bashforth predictor");
    expect(blurb).toContain("Newton");
    expect(blurb.toLowerCase()).not.toContain("fixed-point correction");
  });
});
