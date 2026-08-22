import type { MethodFamily } from "@numerical-t-lab/numerics/ode/solvers";

export const ODE_METHOD_TEACHING_AUTHORITY_IDS = [
  "method_catalog",
  "solver_kernel",
  "nonlinear_solver",
  "multistep_coefficients",
  "fixed_grid_contract",
  "safe_method_math",
  "problem_presets",
  "problem_expression_profiles",
  "convergence_contract",
  "bdf6_focused_evidence",
  "ode_glossary_content",
] as const;

export type OdeMethodTeachingAuthorityId =
  (typeof ODE_METHOD_TEACHING_AUTHORITY_IDS)[number];

export interface OdeMethodTeachingAuthorityReference {
  readonly id: OdeMethodTeachingAuthorityId;
  readonly sourcePaths: readonly string[];
  readonly responsibility: string;
}

export type OdeMethodTeachingClaimId =
  | "implemented_process"
  | "qualified_theoretical_order"
  | "current_product_availability"
  | "source_derived_preset_guidance"
  | "qualified_stability_boundary"
  | "implementation_specific_limitation";

export interface OdeMethodTeachingAuditRecord {
  readonly authorityIds: readonly OdeMethodTeachingAuthorityId[];
  readonly review: {
    readonly status: "ready_for_independent_audit";
    readonly claimStatus: "source_backed_qualified";
    readonly claimIds: readonly OdeMethodTeachingClaimId[];
  };
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreeze(child);
    }
  }
  return value;
}

const AUTHORITY_REFERENCES: Record<
  OdeMethodTeachingAuthorityId,
  OdeMethodTeachingAuthorityReference
> = {
  method_catalog: {
    id: "method_catalog",
    sourcePaths: ["packages/numerics/src/ode/methodCatalog.ts"],
    responsibility:
      "Method identity, first-/second-order profile, explicit/implicit classification, formula fallback, and supported/default order metadata.",
  },
  solver_kernel: {
    id: "solver_kernel",
    sourcePaths: ["packages/numerics/src/ode/solvers.ts"],
    responsibility:
      "Implemented updates, startup use, work structure, result metadata, and implicit diagnostics.",
  },
  nonlinear_solver: {
    id: "nonlinear_solver",
    sourcePaths: ["packages/numerics/src/ode/nonlinearSolver.ts"],
    responsibility:
      "Scalar nonlinear methods and the Newton-default convergence/failure contract.",
  },
  multistep_coefficients: {
    id: "multistep_coefficients",
    sourcePaths: ["packages/numerics/src/ode/polynomial.ts"],
    responsibility:
      "Generated Adams-Bashforth, Adams-Moulton, and BDF coefficient authority.",
  },
  fixed_grid_contract: {
    id: "fixed_grid_contract",
    sourcePaths: [
      "packages/numerics/src/ode/grid.ts",
      "docs/contracts/NUMERICAL_CONTRACTS.md",
    ],
    responsibility:
      "Fixed-step alignment, step-count, and released numerical boundary rules.",
  },
  safe_method_math: {
    id: "safe_method_math",
    sourcePaths: ["frontend/src/math/ui/methodMathContent.ts"],
    responsibility:
      "Closed authored readonly formula records and their accessible verbalizations.",
  },
  problem_presets: {
    id: "problem_presets",
    sourcePaths: ["frontend/src/labs/ode/problemPresets.ts"],
    responsibility:
      "First-order preset identities, universal availability, suggested-method links, and observation guidance.",
  },
  problem_expression_profiles: {
    id: "problem_expression_profiles",
    sourcePaths: ["frontend/src/labs/ode/problemExpressions.ts"],
    responsibility:
      "First-order right-hand-side/exact profiles and the second-order acceleration variable boundary.",
  },
  convergence_contract: {
    id: "convergence_contract",
    sourcePaths: [
      "packages/numerics/src/convergence/convergenceStudy.ts",
      "frontend/src/labs/ode/convergenceStudyState.ts",
      "frontend/src/labs/ode/convergenceTeaching.ts",
      "docs/contracts/NUMERICAL_CONTRACTS.md",
    ],
    responsibility:
      "Convergence eligibility, measured-error semantics, classifications, and learner-facing interpretation boundaries.",
  },
  bdf6_focused_evidence: {
    id: "bdf6_focused_evidence",
    sourcePaths: [
      "packages/numerics/src/convergence/convergenceStudyOrder.test.ts",
      "packages/numerics/src/ode/solvers.test.ts",
    ],
    responsibility:
      "Focused current evidence for the BDF6 fixed-RK4-startup observed-order limitation.",
  },
  ode_glossary_content: {
    id: "ode_glossary_content",
    sourcePaths: ["frontend/src/labs/ode/odeGlossaryContent.ts"],
    responsibility:
      "Previously reviewed ODE vocabulary and qualified teaching statements; no Glossary behavior is imported here.",
  },
};

export const ODE_METHOD_TEACHING_AUTHORITIES: Readonly<
  Record<OdeMethodTeachingAuthorityId, OdeMethodTeachingAuthorityReference>
> = deepFreeze(AUTHORITY_REFERENCES);

const AUDIT_RECORDS: Record<MethodFamily, OdeMethodTeachingAuditRecord> = {
  forward_euler: {
    authorityIds: [
      "method_catalog",
      "safe_method_math",
      "solver_kernel",
      "problem_presets",
      "convergence_contract",
      "ode_glossary_content",
    ],
    review: {
      status: "ready_for_independent_audit",
      claimStatus: "source_backed_qualified",
      claimIds: [
        "implemented_process",
        "qualified_theoretical_order",
        "current_product_availability",
        "source_derived_preset_guidance",
      ],
    },
  },
  backward_euler: {
    authorityIds: [
      "method_catalog",
      "safe_method_math",
      "solver_kernel",
      "nonlinear_solver",
      "problem_presets",
      "convergence_contract",
      "ode_glossary_content",
    ],
    review: {
      status: "ready_for_independent_audit",
      claimStatus: "source_backed_qualified",
      claimIds: [
        "implemented_process",
        "qualified_theoretical_order",
        "qualified_stability_boundary",
        "current_product_availability",
      ],
    },
  },
  taylor: {
    authorityIds: [
      "method_catalog",
      "safe_method_math",
      "solver_kernel",
      "problem_presets",
      "problem_expression_profiles",
      "convergence_contract",
    ],
    review: {
      status: "ready_for_independent_audit",
      claimStatus: "source_backed_qualified",
      claimIds: [
        "implemented_process",
        "qualified_theoretical_order",
        "implementation_specific_limitation",
        "current_product_availability",
      ],
    },
  },
  rk4: {
    authorityIds: [
      "method_catalog",
      "safe_method_math",
      "solver_kernel",
      "problem_presets",
      "convergence_contract",
    ],
    review: {
      status: "ready_for_independent_audit",
      claimStatus: "source_backed_qualified",
      claimIds: [
        "implemented_process",
        "qualified_theoretical_order",
        "current_product_availability",
        "source_derived_preset_guidance",
      ],
    },
  },
  adams_bashforth: {
    authorityIds: [
      "method_catalog",
      "safe_method_math",
      "solver_kernel",
      "multistep_coefficients",
      "fixed_grid_contract",
      "problem_presets",
      "convergence_contract",
    ],
    review: {
      status: "ready_for_independent_audit",
      claimStatus: "source_backed_qualified",
      claimIds: [
        "implemented_process",
        "qualified_theoretical_order",
        "current_product_availability",
        "source_derived_preset_guidance",
      ],
    },
  },
  adams_moulton: {
    authorityIds: [
      "method_catalog",
      "safe_method_math",
      "solver_kernel",
      "nonlinear_solver",
      "multistep_coefficients",
      "fixed_grid_contract",
      "problem_presets",
      "convergence_contract",
    ],
    review: {
      status: "ready_for_independent_audit",
      claimStatus: "source_backed_qualified",
      claimIds: [
        "implemented_process",
        "qualified_theoretical_order",
        "qualified_stability_boundary",
        "current_product_availability",
      ],
    },
  },
  bdf: {
    authorityIds: [
      "method_catalog",
      "safe_method_math",
      "solver_kernel",
      "nonlinear_solver",
      "multistep_coefficients",
      "fixed_grid_contract",
      "problem_presets",
      "convergence_contract",
      "bdf6_focused_evidence",
    ],
    review: {
      status: "ready_for_independent_audit",
      claimStatus: "source_backed_qualified",
      claimIds: [
        "implemented_process",
        "qualified_theoretical_order",
        "implementation_specific_limitation",
        "qualified_stability_boundary",
      ],
    },
  },
  leapfrog: {
    authorityIds: [
      "method_catalog",
      "safe_method_math",
      "solver_kernel",
      "fixed_grid_contract",
      "problem_expression_profiles",
      "convergence_contract",
    ],
    review: {
      status: "ready_for_independent_audit",
      claimStatus: "source_backed_qualified",
      claimIds: [
        "implemented_process",
        "qualified_theoretical_order",
        "current_product_availability",
        "qualified_stability_boundary",
      ],
    },
  },
};

export const ODE_METHOD_TEACHING_AUDIT: Readonly<
  Record<MethodFamily, OdeMethodTeachingAuditRecord>
> = deepFreeze(AUDIT_RECORDS);

export function teachingAuditFor(
  family: MethodFamily
): OdeMethodTeachingAuditRecord {
  const record = (
    ODE_METHOD_TEACHING_AUDIT as Partial<
      Record<MethodFamily, OdeMethodTeachingAuditRecord>
    >
  )[family];
  if (!record) {
    throw new Error(`Missing ODE method teaching audit record: ${family}`);
  }
  return record;
}
