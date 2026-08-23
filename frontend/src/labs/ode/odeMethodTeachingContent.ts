import type { MethodFamily } from "@numerical-t-lab/numerics/ode/solvers";

export interface OdeMethodConcept {
  readonly id: string;
  readonly title: string;
  readonly definition: string;
}

const CONCEPT_DEFINITIONS = {
  numerical_approximation: {
    id: "numerical_approximation",
    title: "Numerical approximation",
    definition:
      "A stored computed state is evidence from the chosen update and grid, not the unknown exact trajectory itself.",
  },
  fixed_step_grid: {
    id: "fixed_step_grid",
    title: "Fixed-step grid",
    definition:
      "The current Lab advances with one positive step size on an interval containing an integer number of steps.",
  },
  current_slope: {
    id: "current_slope",
    title: "Current slope",
    definition:
      "The right-hand side evaluated at the current stored time and approximation supplies the local slope used by an update.",
  },
  endpoint_relation: {
    id: "endpoint_relation",
    title: "Endpoint relation",
    definition:
      "An implicit endpoint relation contains the unknown next approximation inside the right-hand side and must be solved.",
  },
  stage_evaluation: {
    id: "stage_evaluation",
    title: "Stage evaluation",
    definition:
      "A stage probes the right-hand side inside one step; it is temporary work rather than a stored accepted solution point.",
  },
  derivative_estimation: {
    id: "derivative_estimation",
    title: "Derivative estimation",
    definition:
      "The Taylor 2 kernel estimates how the entered right-hand side changes with time and state; BDF instead approximates the solution derivative from history.",
  },
  slope_history: {
    id: "slope_history",
    title: "Slope history",
    definition:
      "Adams methods retain previously evaluated right-hand-side slopes in an ordered window.",
  },
  solution_history: {
    id: "solution_history",
    title: "Solution history",
    definition:
      "BDF forms its derivative relation from an ordered window of stored solution approximations.",
  },
  rk4_startup: {
    id: "rk4_startup",
    title: "RK4 startup values",
    definition:
      "For order greater than one, the current multistep kernels compute the missing starting values with RK4.",
  },
  predictor_corrector: {
    id: "predictor_corrector",
    title: "Predictor and corrector",
    definition:
      "The Adams-Bashforth prediction initializes the Adams-Moulton solve but is not the accepted corrected value.",
  },
  nonlinear_residual: {
    id: "nonlinear_residual",
    title: "Nonlinear residual",
    definition:
      "The residual measures how closely an implicit step satisfies its algebraic relation; its convergence is distinct from accuracy and method stability.",
  },
  staggered_state: {
    id: "staggered_state",
    title: "Staggered state",
    definition:
      "Leap-Frog advances velocity on half steps, position on whole steps, and reconstructs a full-step velocity for stored output.",
  },
  exact_reference: {
    id: "exact_reference",
    title: "Exact reference",
    definition:
      "An optional valid exact expression supports comparison evidence for first-order runs and never replaces the numerical integration.",
  },
  refinement_observed_order: {
    id: "refinement_observed_order",
    title: "Refinement and observed order",
    definition:
      "Observed order is measured from eligible error evidence across refined fixed grids and need not equal theoretical metadata in every finite study.",
  },
  stability_accuracy: {
    id: "stability_accuracy",
    title: "Stability and accuracy",
    definition:
      "Qualitative behavior, absolute stability, nonlinear-solver convergence, and approximation error answer different questions.",
  },
} as const satisfies Record<string, OdeMethodConcept>;

export type OdeMethodConceptId = keyof typeof CONCEPT_DEFINITIONS;

export interface OdeFormulaAnatomyPart {
  readonly label: string;
  readonly meaning: string;
}

export interface OdeMethodAdvancedDetail {
  readonly id: string;
  readonly title: string;
  readonly text: string;
}

export type OdeMethodTeachingDiagramKind =
  | "one_step"
  | "endpoint_relation"
  | "stage_path"
  | "slope_history"
  | "predictor_corrector"
  | "solution_history"
  | "staggered_state";

export interface OdeMethodTeachingDiagramStep {
  readonly id: string;
  readonly label: string;
  readonly title: string;
  readonly detail: string;
}

export interface OdeMethodTeachingDiagram {
  readonly kind: OdeMethodTeachingDiagramKind;
  readonly title: string;
  readonly caption: string;
  readonly steps: readonly OdeMethodTeachingDiagramStep[];
}

export interface OdeMethodTeachingContent {
  readonly coreIdea: string;
  readonly accessibleVerbalization: string;
  readonly formulaAnatomy: readonly OdeFormulaAnatomyPart[];
  readonly orderedProcess: readonly string[];
  readonly requiredState: readonly string[];
  readonly startupHistoryRequirement: string;
  readonly perStepWork: string;
  readonly strength: string;
  readonly watchPoint: string;
  readonly accuracyStabilityBoundary: string;
  readonly whatToObserve: string;
  readonly outputEvidenceGuidance: string;
  readonly convergenceGuidance: string;
  readonly commonMisconception: {
    readonly incorrect: string;
    readonly correction: string;
  };
  readonly advancedDetails: readonly OdeMethodAdvancedDetail[];
  readonly selectedConceptIds: readonly OdeMethodConceptId[];
  readonly staticDiagram?: OdeMethodTeachingDiagram;
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

export const ODE_METHOD_CONCEPTS: Readonly<
  Record<OdeMethodConceptId, OdeMethodConcept>
> = deepFreeze(CONCEPT_DEFINITIONS);

const REVIEWED_CONTENT: Record<MethodFamily, OdeMethodTeachingContent> = {
  forward_euler: {
    coreIdea:
      "Follow the slope at the current stored approximation for one fixed time step.",
    accessibleVerbalization:
      "Take the current numerical approximation, add the fixed step size times the current right-hand-side slope, and store the new approximation at the next grid time.",
    formulaAnatomy: [
      {
        label: "Current approximation",
        meaning: "The stored numerical value at the current grid time.",
      },
      {
        label: "Current slope",
        meaning: "The entered right-hand side evaluated at the current time and approximation.",
      },
      {
        label: "Proposed change",
        meaning: "The fixed step size multiplied by the current slope.",
      },
    ],
    orderedProcess: [
      "Read the current grid time and stored approximation.",
      "Evaluate the entered right-hand side once at that current state.",
      "Multiply the slope by the fixed step size.",
      "Add the proposed change to the current approximation.",
      "Store the result at the next grid time.",
    ],
    requiredState: [
      "current grid time",
      "current numerical approximation",
      "one current evaluation of f(t, y)",
    ],
    startupHistoryRequirement:
      "The initial value is sufficient; no separate startup method or history window is used.",
    perStepWork:
      "The current kernel performs one right-hand-side evaluation per fixed step and no nonlinear solve.",
    strength:
      "It gives the clearest current connection between a local slope, a step size, and one stored update.",
    watchPoint:
      "A coarse explicit step can distort decay, create oscillation, or make values grow on the current preset examples.",
    accuracyStabilityBoundary:
      "Theoretical order 1 does not guarantee observed order 1 for every finite run, and explicit formation alone does not establish a stability conclusion.",
    whatToObserve:
      "Inspect trajectory shape, the final approximation, stored values, and eligible exact-reference refinement evidence as the step size changes.",
    outputEvidenceGuidance:
      "Current Output can show method metadata, the trajectory, final approximation, and stored grid values without implicit diagnostics.",
    convergenceGuidance:
      "A successful first-order single run can enter Convergence only with a valid enabled exact reference; refinement supplies measured error evidence, not a guarantee.",
    commonMisconception: {
      incorrect: "Forward Euler draws the exact tangent curve.",
      correction:
        "It uses one current slope to form one discrete approximation, and repeated updates need not follow the exact curve.",
    },
    advancedDetails: [
      {
        id: "forward_euler_interpretation_boundary",
        title: "Interpretation boundary",
        text: "Preset-specific coarse-step behavior can motivate stability analysis, but a plotted shape alone does not prove stability or accuracy.",
      },
    ],
    staticDiagram: {
      kind: "one_step",
      title: "From one current slope to one stored update",
      caption:
        "The current slope supplies a proposed change; only the completed update becomes the next stored approximation.",
      steps: [
        {
          id: "current_state",
          label: "Current state",
          title: "Begin at tₙ, uₙ",
          detail: "Use the approximation already stored on the fixed grid.",
        },
        {
          id: "current_slope",
          label: "Current slope",
          title: "Sample f(tₙ, uₙ)",
          detail: "Evaluate the entered right-hand side once at that state.",
        },
        {
          id: "step_change",
          label: "One step",
          title: "Scale the slope by h",
          detail: "The product h times the current slope is the proposed change.",
        },
        {
          id: "next_approximation",
          label: "Stored update",
          title: "Form uₙ₊₁",
          detail: "Add the change and store one next approximation.",
        },
      ],
    },
    selectedConceptIds: [
      "numerical_approximation",
      "current_slope",
      "fixed_step_grid",
      "exact_reference",
      "refinement_observed_order",
      "stability_accuracy",
    ],
  },
  backward_euler: {
    coreIdea:
      "Choose the next approximation so the step is consistent with the entered derivative rule at the new endpoint.",
    accessibleVerbalization:
      "The unknown new endpoint value appears both as the next approximation and inside the right-hand side, so the current UI-default Newton solve must satisfy that endpoint relation.",
    formulaAnatomy: [
      {
        label: "Known current value",
        meaning: "The approximation already stored at the start of the step.",
      },
      {
        label: "Unknown endpoint value",
        meaning: "The next approximation appears inside the endpoint slope as well as on the left side.",
      },
      {
        label: "Endpoint slope",
        meaning: "The right-hand side is evaluated at the new grid time and the unknown new value.",
      },
    ],
    orderedProcess: [
      "Form a Forward Euler prediction from the current stored state.",
      "Build the endpoint residual for the unknown next approximation.",
      "Use the current UI-default Newton iteration to reduce that residual to the kernel tolerance.",
      "Store the converged endpoint value, or report a controlled nonlinear-solve failure.",
    ],
    requiredState: [
      "current grid time and approximation",
      "new endpoint time",
      "entered right-hand side",
      "one implicit residual solve",
    ],
    startupHistoryRequirement:
      "The initial value is sufficient; no multistep history or separate startup method is used.",
    perStepWork:
      "Each step includes one explicit prediction and a scalar UI-default Newton solve with run diagnostics.",
    strength:
      "It is the current basic example of an implicit endpoint relation and of separating solve diagnostics from time-stepping claims.",
    watchPoint:
      "Newton can fail, and a converged endpoint equation can still yield an inaccurate approximation for the selected step size.",
    accuracyStabilityBoundary:
      "Backward Euler is A-stable for the scalar test equation. That qualified property does not guarantee accuracy, suitability for every stiff problem, or Newton success.",
    whatToObserve:
      "Inspect trajectory behavior and exact-reference error where available, then read Newton iteration and residual diagnostics as separate evidence.",
    outputEvidenceGuidance:
      "Current Output adds the nonlinear method, iteration totals, maximum iterations, final and maximum residuals, and failed-step count to the common result evidence.",
    convergenceGuidance:
      "Eligible first-order Convergence measures approximation error under refinement; Newton convergence is not substituted for that evidence.",
    commonMisconception: {
      incorrect: "If Newton converges, Backward Euler is accurate and stable for this run.",
      correction:
        "Nonlinear convergence, absolute stability, and approximation accuracy are separate questions.",
    },
    advancedDetails: [
      {
        id: "backward_euler_residual",
        title: "Endpoint residual",
        text: "The kernel solves the difference between the proposed endpoint value and the implicit endpoint update, using the explicit prediction only as a starting value.",
      },
    ],
    staticDiagram: {
      kind: "endpoint_relation",
      title: "The endpoint value must satisfy its own slope relation",
      caption:
        "A Forward Euler predictor is only the starting guess; Newton solves the endpoint relation before the next value is accepted.",
      steps: [
        {
          id: "known_state",
          label: "Known state",
          title: "Begin from uₙ",
          detail: "The current approximation is already stored.",
        },
        {
          id: "predictor",
          label: "Starting guess",
          title: "Form an explicit predictor",
          detail: "This estimate initializes the solve; it is not the accepted result.",
        },
        {
          id: "endpoint_relation",
          label: "Unknown endpoint",
          title: "Require the new slope relation",
          detail: "The unknown next value appears inside the endpoint slope.",
        },
        {
          id: "newton_solve",
          label: "Residual solve",
          title: "Use Newton",
          detail: "Accept the endpoint value only after controlled convergence.",
        },
      ],
    },
    selectedConceptIds: [
      "endpoint_relation",
      "nonlinear_residual",
      "fixed_step_grid",
      "exact_reference",
      "refinement_observed_order",
      "stability_accuracy",
    ],
  },
  taylor: {
    coreIdea:
      "Add a second-order local change using derivative information that the Lab estimates internally from the entered right-hand side.",
    accessibleVerbalization:
      "Start with the current slope, add its first-order change, then add one half of the step size squared times the internally estimated change of that slope along the solution path.",
    formulaAnatomy: [
      {
        label: "Current slope",
        meaning: "The entered right-hand side evaluated at the current numerical state.",
      },
      {
        label: "Time contribution",
        meaning: "How the right-hand side changes with time at the current state.",
      },
      {
        label: "State contribution",
        meaning: "How the right-hand side changes with state, multiplied by the current slope.",
      },
      {
        label: "Second-order change",
        meaning: "One half of the squared step size times the combined derivative contribution.",
      },
    ],
    orderedProcess: [
      "Evaluate the entered right-hand side at the current time and approximation.",
      "Estimate the time-direction change of the right-hand side internally.",
      "Estimate the state-direction change of the right-hand side internally.",
      "Combine those estimates along the solution path.",
      "Add the first- and second-order changes and store the next approximation.",
    ],
    requiredState: [
      "current grid time and approximation",
      "the learner's entered right-hand side f(t, y)",
      "internally estimated derivative information",
    ],
    startupHistoryRequirement:
      "The initial value is sufficient; no history window or separate startup method is used.",
    perStepWork:
      "The current implementation performs five right-hand-side evaluations per step: one current evaluation and two centered pairs.",
    strength:
      "It exposes how derivative information can refine a local update without asking the learner to enter analytic partial derivatives.",
    watchPoint:
      "The derivative information is numerically estimated, so finite-difference and floating-point effects can influence finite-run evidence.",
    accuracyStabilityBoundary:
      "Theoretical order 2 is conditional and is not a universal observed-order promise; no broad Taylor stability claim is published.",
    whatToObserve:
      "Compare trajectory and exact-reference error with Forward Euler or RK4 on the same grid, then inspect reliable refinement evidence where eligible.",
    outputEvidenceGuidance:
      "Current Output shows order, formula, trajectory, final approximation, and stored values but no separate derivative-estimate diagnostic.",
    convergenceGuidance:
      "Eligible first-order Convergence can test measured error behavior; it does not expose the internal derivative scale as a control.",
    commonMisconception: {
      incorrect: "The learner must enter analytic time and state partial derivatives.",
      correction:
        "The learner supplies only the right-hand side, and the current Lab estimates internally the derivative information needed by Taylor 2.",
    },
    advancedDetails: [
      {
        id: "taylor_centered_estimates",
        title: "Internal derivative estimates",
        text: "The current kernel uses centered approximations of f_t in the time direction and f_y in the state direction. Its fixed finite-difference scale is an implementation detail, not an editable control or new public numerical contract.",
      },
      {
        id: "taylor_work_count",
        title: "Current work count",
        text: "One current sample plus two centered pairs gives five right-hand-side evaluations for each completed step.",
      },
    ],
    selectedConceptIds: [
      "numerical_approximation",
      "derivative_estimation",
      "fixed_step_grid",
      "exact_reference",
      "refinement_observed_order",
      "stability_accuracy",
    ],
  },
  rk4: {
    coreIdea:
      "Sample four slopes inside one time step and combine them with the implemented unequal weights.",
    accessibleVerbalization:
      "Evaluate a start slope, two midpoint slopes, and an endpoint slope, then add one sixth of the step size times the first slope, twice each midpoint slope, and the endpoint slope.",
    formulaAnatomy: [
      {
        label: "Start stage",
        meaning: "A slope evaluation at the current stored state.",
      },
      {
        label: "Two midpoint stages",
        meaning: "Temporary slope probes built from successive half-step trial states.",
      },
      {
        label: "Endpoint stage",
        meaning: "A temporary slope probe at the new grid time.",
      },
      {
        label: "Weighted combination",
        meaning: "The middle stages receive twice the weight of the start and endpoint stages.",
      },
    ],
    orderedProcess: [
      "Evaluate the start stage at the current stored state.",
      "Use that slope to evaluate the first midpoint stage.",
      "Use the first midpoint slope to evaluate a second midpoint stage.",
      "Use the second midpoint slope to evaluate the endpoint stage.",
      "Combine the four stage evaluations and store one new approximation.",
    ],
    requiredState: [
      "current grid time and approximation",
      "four temporary stage slopes",
      "one stored accepted value after the complete weighted update",
    ],
    startupHistoryRequirement:
      "The initial value is sufficient and no persistent history is used; the same step routine supplies current multistep startup values.",
    perStepWork:
      "The current kernel performs exactly four right-hand-side evaluations per fixed step and no nonlinear solve.",
    strength:
      "It shows how several local right-hand-side samples can form one higher-order explicit update without derivative input fields.",
    watchPoint:
      "The four stages are temporary probes, not accepted solution points, and theoretical order does not remove the need to inspect the selected grid.",
    accuracyStabilityBoundary:
      "Theoretical order 4 for smooth problems describes refinement behavior under assumptions, not guaranteed accuracy or stability for one coarse run.",
    whatToObserve:
      "Compare trajectory and exact-reference error with lower-order methods at the same step size, then inspect eligible refinement evidence.",
    outputEvidenceGuidance:
      "Current Output shows method metadata, formula, trajectory, final approximation, and stored values; it does not expose temporary stages as output points.",
    convergenceGuidance:
      "Eligible first-order Convergence can measure order/error behavior, while the same RK4 routine remains the startup owner for ordered multistep methods.",
    commonMisconception: {
      incorrect: "Every RK4 stage is an accepted numerical solution value.",
      correction:
        "The four stage evaluations are temporary probes combined to create one accepted next approximation.",
    },
    advancedDetails: [
      {
        id: "rk4_stage_boundary",
        title: "Stage boundary",
        text: "The current kernel uses four stage evaluations in start, midpoint, midpoint, and endpoint order; those temporary stages are not accepted solution points.",
      },
    ],
    staticDiagram: {
      kind: "stage_path",
      title: "Four slope samples feed one weighted update",
      caption:
        "RK4 samples temporary slopes at the start, midpoint, midpoint, and endpoint; their weighted combination creates one accepted next approximation.",
      steps: [
        {
          id: "k1",
          label: "Start",
          title: "Temporary slope k₁",
          detail: "Sample at the current stored state.",
        },
        {
          id: "k2",
          label: "Midpoint",
          title: "Temporary slope k₂",
          detail: "Probe a half-step trial state built from k₁.",
        },
        {
          id: "k3",
          label: "Midpoint",
          title: "Temporary slope k₃",
          detail: "Probe a new half-step trial state built from k₂.",
        },
        {
          id: "k4",
          label: "Endpoint",
          title: "Temporary slope k₄",
          detail: "Probe an endpoint trial state built from k₃.",
        },
        {
          id: "weighted_update",
          label: "Conclusion",
          title: "One accepted next approximation",
          detail: "Combine the four slopes with the implemented weights.",
        },
      ],
    },
    selectedConceptIds: [
      "numerical_approximation",
      "stage_evaluation",
      "fixed_step_grid",
      "exact_reference",
      "refinement_observed_order",
      "stability_accuracy",
    ],
  },
  adams_bashforth: {
    coreIdea:
      "Reuse a weighted history of already known slopes to advance directly to the next approximation.",
    accessibleVerbalization:
      "Add the fixed step size times an order-dependent weighted sum of the current and previous stored slopes to the current approximation.",
    formulaAnatomy: [
      {
        label: "Current solution value",
        meaning: "The already accepted approximation u_n anchors the next update.",
      },
      {
        label: "Fixed step size",
        meaning: "The factor h scales the complete history contribution.",
      },
      {
        label: "Slope history",
        meaning: "An ordered window of right-hand-side values already evaluated at stored solution points.",
      },
      {
        label: "Generated weights",
        meaning: "Order-specific coefficients supplied by the current polynomial authority.",
      },
      {
        label: "Direct next value",
        meaning: "Only known slopes appear in the update, so no endpoint equation is solved.",
      },
    ],
    orderedProcess: [
      "Establish enough history for the configured order p, using RK4 startup approximations when p is greater than 1.",
      "Read the p stored slopes required by the current update.",
      "Form the generated weighted slope-history contribution.",
      "Advance directly from the current approximation to the new solution value.",
      "Evaluate one new right-hand-side slope at the accepted new value.",
      "Shift the slope and solution history windows for the next step.",
    ],
    requiredState: [
      "p stored slope entries",
      "the corresponding solution history",
      "generated Adams-Bashforth coefficients for the supplied order",
    ],
    startupHistoryRequirement:
      "The fixed grid must satisfy N >= p. For p greater than 1, RK4 computes p minus 1 startup approximations to fill history; they are part of the produced trajectory and can affect finite-run evidence. Order p equal to 1 needs no preliminary startup value.",
    perStepWork:
      "After startup, the current kernel performs one new right-hand-side evaluation plus a weighted sum over p stored slopes, with no nonlinear solve.",
    strength:
      "It makes slope-history reuse concrete and supplies the explicit predictor used by Adams-Moulton.",
    watchPoint:
      "Changing order changes the generated weights, history length, minimum-grid requirement, and theoretical order; startup values remain computed evidence.",
    accuracyStabilityBoundary:
      "Theoretical order p is conditional and is not an observed-order promise or a broad stability ranking.",
    whatToObserve:
      "Inspect configured order, RK4 startup metadata, generated coefficients, trajectory, and eligible exact-reference refinement evidence.",
    outputEvidenceGuidance:
      "Current Output includes configured order, startup metadata, generated beta coefficients, trajectory, final approximation, and stored values.",
    convergenceGuidance:
      "Eligible first-order Convergence uses the supplied current order and requires enough steps at every refined level.",
    commonMisconception: {
      incorrect: "Order eight can start from only the initial value without extra computation.",
      correction:
        "Order p greater than one requires p minus 1 RK4 startup values and a fixed grid with at least p steps.",
    },
    advancedDetails: [
      {
        id: "adams_bashforth_history",
        title: "History and startup",
        text: "The implementation retains slope history and consumes coefficients generated for the configured order; the teaching registry does not copy a coefficient table. RK4 startup values are computed approximations, not exact history.",
      },
    ],
    staticDiagram: {
      kind: "slope_history",
      title: "Known slopes feed one explicit history update",
      caption:
        "Several previously known slopes form a weighted history contribution, which creates one new solution value; its newly evaluated slope then enters the history window.",
      steps: [
        {
          id: "stored_slopes",
          label: "Known history",
          title: "Stored slopes",
          detail: "Use the current and previous right-hand-side evaluations.",
        },
        {
          id: "weighted_history",
          label: "Order-dependent relation",
          title: "Weight the slope history",
          detail: "Generated beta weights depend on the configured order.",
        },
        {
          id: "new_solution",
          label: "Explicit update",
          title: "Form the new solution value",
          detail: "No unknown endpoint slope appears inside the update.",
        },
        {
          id: "new_slope",
          label: "Refresh history",
          title: "Evaluate one new slope",
          detail: "The accepted new state supplies the next stored slope.",
        },
      ],
    },
    selectedConceptIds: [
      "slope_history",
      "rk4_startup",
      "fixed_step_grid",
      "exact_reference",
      "refinement_observed_order",
      "stability_accuracy",
    ],
  },
  adams_moulton: {
    coreIdea:
      "Combine stored slopes with the slope at the unknown next value, using an Adams-Bashforth predictor as the initial guess for the implicit corrector.",
    accessibleVerbalization:
      "First predict a next value from known slope history with Adams-Bashforth at the same configured order, then use the current UI-default Newton solve to satisfy the implicit corrector containing the endpoint slope. The predictor is not the accepted corrected value.",
    formulaAnatomy: [
      {
        label: "Stored slope history",
        meaning: "Previously evaluated right-hand-side values contribute known terms.",
      },
      {
        label: "Unknown endpoint slope",
        meaning: "The new approximation appears inside the right-hand side at the new time.",
      },
      {
        label: "Predictor",
        meaning: "The order-matched Adams-Bashforth value is an initial guess, not the accepted corrected value.",
      },
    ],
    orderedProcess: [
      "Establish p-step slope history for the configured order.",
      "When p is greater than 1, compute p minus 1 RK4 startup approximations to fill that history.",
      "Form the same-order Adams-Bashforth predictor from known slopes.",
      "Construct the Adams-Moulton endpoint relation containing the unknown next slope.",
      "Use the predictor as the initial guess for the current UI-default Newton residual solve.",
      "Accept the corrected value only after controlled nonlinear convergence.",
      "Evaluate and store the new slope, then advance the history window.",
    ],
    requiredState: [
      "p stored history entries",
      "generated Adams-Moulton and Adams-Bashforth coefficients",
      "one endpoint residual solve",
    ],
    startupHistoryRequirement:
      "The fixed grid must satisfy N >= p. For p greater than 1, RK4 computes p minus 1 startup approximations to fill slope history; they remain part of the produced trajectory and can affect finite-run evidence. Order p equal to 1 needs no preliminary startup value.",
    perStepWork:
      "After startup, each step performs a history-weighted prediction and a scalar UI-default Newton solve for the corrector.",
    strength:
      "It makes the distinction between an explicit prediction and an accepted implicit correction directly observable.",
    watchPoint:
      "The predictor does not remove the solve. Newton can fail, and Newton convergence does not establish accuracy or method stability.",
    accuracyStabilityBoundary:
      "Theoretical order p is conditional; no broad Adams-Moulton stability or accuracy ranking is published.",
    whatToObserve:
      "Compare with Adams-Bashforth at the same supplied order and grid, then inspect startup, coefficients, trajectory, and Newton diagnostics.",
    outputEvidenceGuidance:
      "Current Output includes configured order, RK4 startup, generated beta coefficients, and nonlinear iteration/residual diagnostics.",
    convergenceGuidance:
      "Eligible first-order Convergence uses the supplied current order; predictor and Newton success remain separate from measured approximation error.",
    commonMisconception: {
      incorrect: "The Adams-Bashforth predictor is the accepted Adams-Moulton result.",
      correction:
        "The predictor is only the initial guess; the accepted corrected value satisfies the implicit relation within the nonlinear tolerance.",
    },
    advancedDetails: [
      {
        id: "adams_moulton_nonlinear_boundary",
        title: "Predictor and solve boundary",
        text: "Current UI runs use Newton for the corrector and report its diagnostics. Predictor quality, Newton convergence, approximation accuracy, and method stability remain distinct.",
      },
    ],
    staticDiagram: {
      kind: "predictor_corrector",
      title: "A prediction starts—but does not replace—the correction",
      caption:
        "Known slope history forms an Adams-Bashforth starting guess while the endpoint relation defines the required correction; Newton brings those paths together at the accepted corrected value.",
      steps: [
        {
          id: "slope_history",
          label: "Known history",
          title: "Stored slopes",
          detail: "The current and previous slopes are already available.",
        },
        {
          id: "ab_predictor",
          label: "Prediction branch",
          title: "Same-order AB predictor",
          detail: "This value is the starting guess, not the accepted result.",
        },
        {
          id: "endpoint_relation",
          label: "Correction branch",
          title: "Implicit endpoint relation",
          detail: "The unknown next value appears inside the endpoint slope.",
        },
        {
          id: "newton_correction",
          label: "Rejoin",
          title: "Newton residual solve",
          detail: "The predictor seeds the controlled implicit correction.",
        },
        {
          id: "accepted_correction",
          label: "Accepted state",
          title: "Corrected next value",
          detail: "Only the converged corrector result enters the trajectory.",
        },
      ],
    },
    selectedConceptIds: [
      "slope_history",
      "rk4_startup",
      "predictor_corrector",
      "endpoint_relation",
      "nonlinear_residual",
      "stability_accuracy",
    ],
  },
  bdf: {
    coreIdea:
      "Approximate the derivative at the new time from solution history, then require that derivative relation to match the right-hand side at the unknown next value.",
    accessibleVerbalization:
      "Combine the unknown new approximation and previous solution values with generated derivative weights, then use the current UI-default Newton solve so that combination equals the step size times the endpoint right-hand side.",
    formulaAnatomy: [
      {
        label: "Solution history",
        meaning: "The current BDF relation uses stored solution approximations rather than Adams slope history.",
      },
      {
        label: "Generated derivative weights",
        meaning: "Order-specific alpha coefficients combine the new and previous solution values.",
      },
      {
        label: "Unknown endpoint value",
        meaning: "The new approximation also appears inside the endpoint right-hand side.",
      },
    ],
    orderedProcess: [
      "Establish p stored solution-history entries for the configured order.",
      "When p is greater than 1, compute p minus 1 RK4 startup approximations to fill that history.",
      "Form the known contribution from previous solution values.",
      "Construct the implicit residual at the new grid time with generated BDF coefficients.",
      "Use the current approximation—the first entry in the solution-history window—as the initial guess.",
      "Apply the current UI-default Newton solve to the endpoint residual.",
      "Accept the converged new solution value.",
      "Shift the solution-history window for the next step.",
    ],
    requiredState: [
      "p stored solution-history values",
      "generated BDF alpha coefficients",
      "one endpoint residual solve",
    ],
    startupHistoryRequirement:
      "The fixed grid must satisfy N >= p. For p greater than 1, RK4 computes p minus 1 startup approximations to fill solution history; they remain part of the produced trajectory and can affect finite-run evidence. Order p equal to 1 needs no preliminary startup value.",
    perStepWork:
      "After startup, each step forms a solution-history sum and performs a scalar UI-default Newton solve.",
    strength:
      "It contrasts derivative approximation from solution history with the slope-history construction used by Adams methods.",
    watchPoint:
      "Supported order, startup quality, and nonlinear solution are separate constraints; a converged endpoint solve does not certify the time-stepping error.",
    accuracyStabilityBoundary:
      "Theoretical order p is conditional and is not an observed-order promise. No broad BDF stability ranking is published, and Newton convergence is not an accuracy certificate.",
    whatToObserve:
      "Inspect the supplied order, solution-history coefficients, RK4 startup metadata, trajectory, Newton residuals, and eligible exact-reference refinement evidence.",
    outputEvidenceGuidance:
      "Current Output includes configured order, RK4 startup, generated alpha coefficients, and nonlinear iteration/residual diagnostics.",
    convergenceGuidance:
      "Eligible first-order Convergence compares measured error under refinement with the supplied theoretical order; startup and nonlinear diagnostics remain separate evidence.",
    commonMisconception: {
      incorrect: "A converged BDF Newton solve proves that the time-stepping result is accurate.",
      correction:
        "Newton convergence establishes only that the implicit algebraic relation met its solve tolerance; approximation accuracy requires separate evidence.",
    },
    advancedDetails: [
      {
        id: "bdf_coefficients_and_solve",
        title: "Generated coefficients and endpoint solve",
        text: "The numerical owner generates alpha coefficients for the configured order and applies them in the endpoint residual. Method teaching does not copy a coefficient table or expose nonlinear settings as controls.",
      },
    ],
    staticDiagram: {
      kind: "solution_history",
      title: "Solution values define a new-time derivative relation",
      caption:
        "Stored solution-value history feeds a derivative approximation at the new time, where the unknown endpoint must satisfy the ODE before the new solution value is accepted.",
      steps: [
        {
          id: "stored_solutions",
          label: "Solution history",
          title: "Previous solution values",
          detail: "The history rail contains approximations, not stored slopes.",
        },
        {
          id: "derivative_relation",
          label: "Generated relation",
          title: "Approximate the new-time derivative",
          detail: "Alpha weights combine the unknown new value with prior values.",
        },
        {
          id: "endpoint_condition",
          label: "Implicit condition",
          title: "Match the endpoint right-hand side",
          detail: "The unknown new value also appears inside f at the new time.",
        },
        {
          id: "accepted_solution",
          label: "Accepted state",
          title: "Store the converged solution value",
          detail: "Newton convergence is checked before history advances.",
        },
      ],
    },
    selectedConceptIds: [
      "solution_history",
      "rk4_startup",
      "derivative_estimation",
      "nonlinear_residual",
      "refinement_observed_order",
      "stability_accuracy",
    ],
  },
  leapfrog: {
    coreIdea:
      "Advance velocity on half steps and position on whole steps so the two state components leap past one another.",
    accessibleVerbalization:
      "Initialize a half-step velocity from u0, v0, and a(t, u); update that half-step velocity with current acceleration, update position to the next whole step, and reconstruct the full-step velocity stored for output.",
    formulaAnatomy: [
      {
        label: "Whole-step position",
        meaning: "The scalar position-like state is stored at each grid time.",
      },
      {
        label: "Half-step velocity",
        meaning: "The update variable for velocity lies halfway between whole grid times.",
      },
      {
        label: "Stored full-step velocity",
        meaning: "A new-time acceleration evaluation reconstructs the velocity reported with each output point.",
      },
      {
        label: "Acceleration profile",
        meaning: "The current expression a(t, u) may use time and position, not velocity.",
      },
    ],
    orderedProcess: [
      "Begin from the initial position u0 and initial velocity v0.",
      "Initialize the half-step velocity from those initial values and the acceleration at the initial state.",
      "Update the half-step velocity using acceleration at the current whole-step time and position.",
      "Use that half-step velocity to update position to the next whole-step time.",
      "Evaluate acceleration at the new time and position.",
      "Reconstruct and store the full-step velocity used for output evidence.",
    ],
    requiredState: [
      "initial position u0",
      "initial velocity v0",
      "scalar acceleration expression a(t, u)",
      "staggered half-step velocity",
    ],
    startupHistoryRequirement:
      "The kernel initializes one half-step velocity directly from the two initial values and initial acceleration; it uses no RK4 startup or first-order history selector.",
    perStepWork:
      "Current acceleration updates the half-step velocity, and new-state acceleration reconstructs the stored full-step velocity; there is no nonlinear solve.",
    strength:
      "It makes the current second-order state boundary and the relation between staggered computation and two-component stored output concrete.",
    watchPoint:
      "The current product does not support velocity-dependent acceleration, general second-order systems, first-order Compare, exact-reference input, or Convergence for this profile.",
    accuracyStabilityBoundary:
      "Theoretical order 2 is not a guarantee for one finite run, and no general long-time conservation or broad stability claim is published.",
    whatToObserve:
      "Inspect both the position and velocity trajectories, their final values, and the stored paired output for supported acceleration examples.",
    outputEvidenceGuidance:
      "Current single Output reports final position, final velocity, both plotted trajectories, method metadata, and stored paired values.",
    convergenceGuidance:
      "The current Leap-Frog profile has no exact-reference input or Convergence entry and is not part of first-order Compare.",
    commonMisconception: {
      incorrect: "Leap-Frog is another method for the same first-order input form.",
      correction:
        "This is the staggered update used by the current Lab for a separate scalar second-order profile requiring position and velocity initial data.",
    },
    advancedDetails: [
      {
        id: "leapfrog_stored_velocity",
        title: "Stored velocity reconstruction",
        text: "The current Lab updates half-step velocity, advances whole-step position, and then reconstructs full-step velocity for stored/output evidence. That reconstruction is subordinate to the central staggered update and is not a second same-level integration rule.",
      },
    ],
    staticDiagram: {
      kind: "staggered_state",
      title: "Position and velocity occupy offset points on the step",
      caption:
        "The whole-step position advances from the current grid time to the next while the updated half-step velocity sits between them; a separate new-time reconstruction supplies the full-step velocity stored for output.",
      steps: [
        {
          id: "whole_position_current",
          label: "Whole step",
          title: "Current position uₙ",
          detail: "Position is stored at the current grid time.",
        },
        {
          id: "half_velocity_next",
          label: "Half step",
          title: "Updated velocity vₙ₊₁⁄₂",
          detail: "Current acceleration advances the staggered velocity.",
        },
        {
          id: "whole_position_next",
          label: "Whole step",
          title: "Next position uₙ₊₁",
          detail: "The half-step velocity advances position to the new time.",
        },
        {
          id: "stored_velocity_next",
          label: "Output reconstruction",
          title: "Stored velocity vₙ₊₁",
          detail: "New-state acceleration reconstructs the reported full-step velocity.",
        },
      ],
    },
    selectedConceptIds: [
      "numerical_approximation",
      "staggered_state",
      "fixed_step_grid",
      "stability_accuracy",
    ],
  },
};

interface ConfiguredOrderAdvancedDetail {
  readonly order: number;
  readonly detail: OdeMethodAdvancedDetail;
}

const CONFIGURED_ORDER_ADVANCED_DETAILS: Readonly<
  Partial<Record<MethodFamily, readonly ConfiguredOrderAdvancedDetail[]>>
> = deepFreeze({
  bdf: [
    {
      order: 6,
      detail: {
        id: "bdf6_startup_limitation",
        title: "Current BDF6 startup limitation",
        text: "BDF6 retains theoretical order 6. Existing focused current-product evidence approaches approximately order 5 because the fixed RK4 startup introduces order-five error into the end-to-end trajectory. This implementation-specific limitation does not redefine BDF6 theory or establish a stability conclusion.",
      },
    },
  ],
});

export function configuredOrderAdvancedDetailsFor(
  family: MethodFamily,
  currentOrder: number | undefined
): readonly OdeMethodAdvancedDetail[] {
  if (currentOrder === undefined) return Object.freeze([]);
  return Object.freeze(
    (CONFIGURED_ORDER_ADVANCED_DETAILS[family] ?? [])
      .filter((record) => record.order === currentOrder)
      .map((record) => record.detail)
  );
}

export const ODE_METHOD_TEACHING_CONTENT: Readonly<
  Record<MethodFamily, OdeMethodTeachingContent>
> = deepFreeze(REVIEWED_CONTENT);

export function teachingContentFor(
  family: MethodFamily
): OdeMethodTeachingContent {
  const content = (
    ODE_METHOD_TEACHING_CONTENT as Partial<
      Record<MethodFamily, OdeMethodTeachingContent>
    >
  )[family];
  if (!content) {
    throw new Error(`Missing reviewed ODE method teaching content: ${family}`);
  }
  return content;
}
