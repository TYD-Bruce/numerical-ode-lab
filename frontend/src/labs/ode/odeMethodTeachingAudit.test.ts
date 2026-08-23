import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { METHOD_CATALOG } from "@numerical-t-lab/numerics/ode/method-catalog";
import {
  ODE_METHOD_TEACHING_AUDIT,
  ODE_METHOD_TEACHING_AUTHORITIES,
  ODE_METHOD_TEACHING_AUTHORITY_IDS,
  teachingAuditFor,
} from "./odeMethodTeachingAudit";
import {
  deriveOdeMethodTeachingProfile,
  type OdeMethodTeachingLearnerProfile,
} from "./odeMethodTeaching";
import { teachingContentFor } from "./odeMethodTeachingContent";

describe("ODE teaching learner/governance boundary", () => {
  it("returns an explicit learner-safe profile and no audit fields", () => {
    const profile: OdeMethodTeachingLearnerProfile =
      deriveOdeMethodTeachingProfile({
        family: "adams_moulton",
        currentOrder: 6,
      });

    expect(profile).toMatchObject({
      identity: { family: "adams_moulton", runnable: true },
      problemProfile: "first_order_ivp",
      formation: "implicit",
      stepStructure: "history",
      coreIdea: expect.any(String),
      accessibleVerbalization: expect.any(String),
      primaryFormula: {
        latex: expect.any(String),
        displayText: expect.any(String),
        ariaLabel: expect.any(String),
      },
      selectedConcepts: expect.any(Array),
    });
    for (const forbidden of [
      "review",
      "claimStatus",
      "claimIds",
      "authorityIds",
      "sourcePaths",
    ]) {
      expect(profile).not.toHaveProperty(forbidden);
    }
  });

  it("keeps recursive learner serialization free of governance and repository markers", () => {
    const serialized = JSON.stringify(
      METHOD_CATALOG.map((entry) =>
        deriveOdeMethodTeachingProfile({
          family: entry.family,
          currentOrder: entry.orderDefault,
        })
      )
    );

    for (const marker of [
      "packages/",
      "frontend/src/",
      ".test.ts",
      "ready_for_independent_audit",
      "source_backed_qualified",
      "P0",
      "P1",
      "P2",
      "P3",
      "Maintainer",
      "Codex",
      "Cursor",
      "agent",
    ]) {
      expect(serialized).not.toContain(marker);
    }
  });

  it("keeps authority and review metadata available only through the audit owner", () => {
    expect(Object.keys(ODE_METHOD_TEACHING_AUDIT)).toEqual(
      METHOD_CATALOG.map((entry) => entry.family)
    );
    expect(Object.keys(ODE_METHOD_TEACHING_AUTHORITIES)).toEqual(
      ODE_METHOD_TEACHING_AUTHORITY_IDS
    );

    for (const entry of METHOD_CATALOG) {
      const audit = teachingAuditFor(entry.family);
      expect(audit.authorityIds.length).toBeGreaterThan(1);
      expect(audit.review).toMatchObject({
        status: "ready_for_independent_audit",
        claimStatus: "source_backed_qualified",
      });
      expect(audit.review.claimIds.length).toBeGreaterThan(0);
    }

    for (const id of ODE_METHOD_TEACHING_AUTHORITY_IDS) {
      const authority = ODE_METHOD_TEACHING_AUTHORITIES[id];
      expect(authority.id).toBe(id);
      expect(authority.sourcePaths.length).toBeGreaterThan(0);
      expect(authority.responsibility).not.toBe("");
      for (const sourcePath of authority.sourcePaths) {
        expect(existsSync(sourcePath), sourcePath).toBe(true);
      }
    }
  });

  it("freezes learner and audit records independently", () => {
    const learner = teachingContentFor("forward_euler");
    const audit = teachingAuditFor("forward_euler");
    const learnerBefore = learner.coreIdea;
    const auditBefore = audit.review.status;

    expect(Object.isFrozen(learner)).toBe(true);
    expect(Object.isFrozen(audit)).toBe(true);
    expect(Object.isFrozen(audit.authorityIds)).toBe(true);
    expect(() => {
      (learner as { coreIdea: string }).coreIdea = "changed";
    }).toThrow();
    expect(() => {
      (audit.review as { status: string }).status = "changed";
    }).toThrow();
    expect(learner.coreIdea).toBe(learnerBefore);
    expect(audit.review.status).toBe(auditBefore);
  });

  it("keeps runtime derivation disconnected from the audit-only module", () => {
    const teachingSource = readFileSync(
      new URL("./odeMethodTeaching.ts", import.meta.url),
      "utf8"
    );
    const teachingViewSource = readFileSync(
      new URL("./odeMethodTeachingView.ts", import.meta.url),
      "utf8"
    );
    const appSource = readFileSync(new URL("./odeApp.ts", import.meta.url), "utf8");

    expect(teachingSource).not.toContain("odeMethodTeachingAudit");
    expect(teachingViewSource).not.toContain("odeMethodTeachingAudit");
    expect(appSource).not.toContain("odeMethodTeachingAudit");
    expect(teachingSource).not.toMatch(
      /const profile[^=]*=\s*\{\s*\.\.\.content,/s
    );
  });
});
