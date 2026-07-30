import {
  createGlossaryValidationPolicy,
  defineGlossaryEntry,
  defineGlossaryModuleExtension,
  type GlossaryEntryInput,
  type GlossaryModuleExtensionInput,
} from "../glossary/glossaryBuilders";
import type {
  GlossaryEntry,
  GlossaryModuleExtension,
} from "../glossary/glossaryRuntimeTypes";

const strictContent = createGlossaryValidationPolicy({ mode: "strict" });

function requiredEntry(input: GlossaryEntryInput): GlossaryEntry {
  const entry = defineGlossaryEntry(input, strictContent);
  if (entry === undefined) {
    throw new Error(`Invalid ODE Glossary entry: ${input.id}`);
  }
  return entry;
}

function requiredExtension(
  input: GlossaryModuleExtensionInput
): GlossaryModuleExtension {
  const extension = defineGlossaryModuleExtension(input, strictContent);
  if (extension === undefined) {
    throw new Error(`Invalid Glossary module extension: ${input.moduleId}`);
  }
  return extension;
}

export const odeGlossaryEntries: readonly GlossaryEntry[] = Object.freeze([
  requiredEntry({
    id: "ordinary_differential_equation",
    label: "Ordinary differential equation (ODE)",
    aliases: ["ODE", "ordinary differential equation"],
    definition:
      "An ordinary differential equation relates an unknown function of one independent variable to one or more of its derivatives.",
    fullDefinition:
      "An ordinary differential equation relates an unknown function of one independent variable to one or more of its derivatives. The current Lab treats time as that variable and uses the scalar first-order form y'(t)=f(t,y(t)). More general ODEs may be higher-order equations or systems, and they are not all supported here.",
    intuition:
      "It is a rule describing how a state changes. The rule is the equation; a function satisfying that rule is a solution.",
    whyItMatters:
      "Every numerical method currently available in this Lab uses the entered right-hand side f(t,y) to advance its numerical approximations. The Lab does not decide existence or uniqueness and does not support every ODE form.",
    formula: {
      latex: "y'(t)=f(t,y(t))",
      accessibleText: "y prime of t equals f evaluated at t and y of t.",
      display: "block",
    },
    assumptionsAndLimits:
      "Scalar, first-order, fixed-interval current Lab scope; autonomous and time-dependent right-hand sides are allowed. No existence, uniqueness, exact-solvability, or universal Lab-support claim.",
    misconception: {
      statement: "the ODE is the curve shown in the chart.",
      correction:
        "the ODE is the governing equation; the chart shows numerical approximations computed by the selected method or methods.",
    },
    relatedTerms: [
      { kind: "term", termId: "initial_condition" },
      { kind: "term", termId: "initial_value_problem" },
      { kind: "term", termId: "exact_solution" },
      { kind: "future", label: "partial differential equation" },
    ],
    commonlyConfusedTerms: [
      { kind: "future", label: "a solution of an ODE" },
      { kind: "future", label: "a PDE" },
      { kind: "future", label: "a general ODE system" },
    ],
    moduleNote:
      "Read this equation together with the starting value and interval entered in Data.",
    tutorTopic:
      "Identify the time variable, state, derivative, and right-hand side in the current equation without asserting an exact solution.",
  }),
  requiredEntry({
    id: "initial_condition",
    label: "Initial condition",
    aliases: [],
    definition:
      "An initial condition specifies the value the solution must have at the starting time.",
    fullDefinition:
      "An initial condition specifies that the solution must have the value y_0 at the starting time t_0. In the current scalar first-order Lab, it is written y(t_0)=y_0. It supplies the starting data for the numerical computation; it is not an error estimate or a boundary condition from a boundary-value problem.",
    intuition:
      "It tells the method where to start: at time t_0, with value y_0.",
    whyItMatters:
      "Changing y_0 changes the initial value problem even when the differential equation remains the same. The first stored numerical approximation is initialized with this supplied value.",
    formula: {
      latex: "y(t_0)=y_0",
      accessibleText: "y of t zero equals y zero.",
      display: "block",
    },
    assumptionsAndLimits:
      "The current card covers one scalar value at one starting time; it makes no existence or uniqueness promise.",
    misconception: {
      statement:
        "the initial condition measures how wrong the first numerical value is.",
      correction:
        "it supplies the starting value; it is not an approximation error.",
    },
    relatedTerms: [
      { kind: "term", termId: "ordinary_differential_equation" },
      { kind: "term", termId: "initial_value_problem" },
      { kind: "term", termId: "time_grid" },
    ],
    commonlyConfusedTerms: [
      { kind: "future", label: "boundary condition" },
      { kind: "future", label: "initial time" },
      { kind: "future", label: "first numerical error" },
    ],
    moduleNote:
      "Data separately exposes Start time t_0 and Initial value y_0; together they state the condition.",
    tutorTopic:
      "Connect the current start time and initial value to the first numerical value without calling the condition a boundary condition.",
  }),
  requiredEntry({
    id: "initial_value_problem",
    label: "Initial value problem (IVP)",
    aliases: ["IVP", "initial value problem", "initial-value problem"],
    definition:
      "An initial value problem combines a differential equation with the solution value at a starting time.",
    fullDefinition:
      "An initial value problem gives a differential equation together with the value of its solution at a starting time: y'(t)=f(t,y(t)) and y(t_0)=y_0. This pair states the mathematical problem. A numerical method is a separate procedure used to approximate its solution, and existence or uniqueness requires additional assumptions.",
    intuition:
      "It supplies both the rule for change and the place to start.",
    whyItMatters:
      "The differential equation, starting time t_0, and starting value y_0 define the initial value problem. The selected interval tells the Lab where to approximate its solution. Choosing Forward Euler or another numerical method does not change the mathematical problem.",
    formula: {
      latex: "y'(t)=f(t,y(t)),\\qquad y(t_0)=y_0",
      accessibleText:
        "y prime of t equals f evaluated at t and y of t, with y of t zero equal to y zero.",
      display: "block",
    },
    assumptionsAndLimits:
      "Current support is scalar, first-order, and fixed-interval. The input form represents an IVP but is not itself the exact mathematical solution.",
    misconception: {
      statement: "Forward Euler is an initial value problem.",
      correction:
        "Forward Euler is one numerical method for approximating the solution of an IVP.",
    },
    prerequisiteTermIds: [
      "ordinary_differential_equation",
      "initial_condition",
    ],
    relatedTerms: [
      { kind: "term", termId: "step_size" },
      { kind: "term", termId: "time_grid" },
      { kind: "term", termId: "numerical_approximation" },
      { kind: "term", termId: "exact_solution" },
    ],
    commonlyConfusedTerms: [
      { kind: "future", label: "a solver or numerical method" },
      { kind: "future", label: "boundary value problem" },
      { kind: "future", label: "input form" },
    ],
    moduleNote:
      "The current Lab does not implement boundary value problems or general ODE systems.",
    tutorTopic:
      "Explain the current equation, t_0, and y_0 as one problem and keep the method separate.",
  }),
  requiredEntry({
    id: "step_size",
    label: "Time-step size",
    aliases: ["step size", "time step"],
    definition:
      "The time-step size h is the constant time interval between consecutive points on the current uniform grid.",
    fullDefinition:
      "The time-step size is h=t_{n+1}-t_n. The current Lab uses one constant positive value of h and requires the interval length to equal an integer number of time steps. Over the same interval, a smaller h produces more steps, but it does not by itself guarantee a more accurate or stable result.",
    intuition:
      "It controls how far the method advances in time during each update.",
    whyItMatters:
      "The selected h sets the spacing of the time grid and strongly affects the amount of computation. Its effect on error and stability must be checked using the method, problem, and available numerical evidence.",
    formula: {
      latex: "h=t_{n+1}-t_n,\\qquad h>0",
      accessibleText:
        "h equals t sub n plus one minus t sub n, and h is positive.",
      display: "block",
    },
    assumptionsAndLimits:
      "Constant positive h, aligned endpoints, and released step budget. No adaptive or nonuniform-grid support claim.",
    misconception: {
      statement: "making h smaller always fixes the numerical result.",
      correction:
        "refinement increases the number of steps, but accuracy and stability still depend on the problem, method, arithmetic, and whether the relevant assumptions hold.",
    },
    prerequisiteTermIds: ["initial_value_problem"],
    relatedTerms: [
      { kind: "term", termId: "time_grid" },
      { kind: "term", termId: "numerical_approximation" },
      { kind: "future", label: "absolute stability" },
      { kind: "future", label: "grid spacing" },
    ],
    commonlyConfusedTerms: [
      { kind: "future", label: "number of steps" },
      { kind: "future", label: "number of stored points" },
      { kind: "future", label: "PDE spatial grid spacing" },
    ],
    moduleNote:
      "This is ODE time-step size, not PDE spatial grid spacing.",
    tutorTopic:
      "Explain the current h, step count, and likely refinement effects without promising improvement.",
  }),
  requiredEntry({
    id: "time_grid",
    label: "Time grid",
    aliases: [],
    definition:
      "The time grid is the ordered sequence of times where the method stores numerical approximations.",
    fullDefinition:
      "A time grid is the ordered sequence t_0,t_1,...,t_N at which a numerical ODE method stores approximations. In the current fixed-step Lab, t_n=t_0+nh. There are N time steps between N+1 stored grid points, and the current grid includes both aligned endpoints.",
    intuition:
      "It is the sequence of time locations where the computed values live.",
    whyItMatters:
      "The plot, table, comparison, and exact-reference calculations align values using these time points. The current Lab uses one uniform time grid rather than an adaptive or nonuniform grid.",
    formula: {
      latex: "t_n=t_0+nh,\\qquad 0\\le n\\le N",
      accessibleText:
        "t sub n equals t zero plus n times h, for n from zero through N.",
      display: "block",
    },
    assumptionsAndLimits:
      "Constant h>0, finite endpoints, alignment, both endpoints stored, and the released point budget.",
    misconception: {
      statement: "N steps means N stored points.",
      correction:
        "a grid with N steps from t_0 through t_N contains N+1 stored points.",
    },
    prerequisiteTermIds: ["step_size"],
    relatedTerms: [
      { kind: "term", termId: "initial_condition" },
      { kind: "term", termId: "numerical_approximation" },
    ],
    commonlyConfusedTerms: [
      { kind: "term", termId: "step_size" },
      { kind: "future", label: "number of steps" },
      { kind: "future", label: "stored-point count" },
      { kind: "future", label: "PDE spatial grid" },
    ],
    moduleNote:
      "The card describes the released uniform time grid; it does not advertise adaptive or arbitrary grids.",
    tutorTopic:
      "Relate t_0, t_N, h, step count, and stored-point count without changing the alignment contract.",
  }),
  requiredEntry({
    id: "exact_solution",
    label: "Exact solution",
    aliases: [],
    definition:
      "An exact solution is a function that satisfies the differential equation and initial condition on the stated interval.",
    fullDefinition:
      "An exact solution satisfies both the differential equation and the initial condition throughout the stated interval. In the current Lab an optional analytical expression can supply reference values for error calculations. The existing consistency check samples numerical agreement; it is not a proof that the entered expression is exact.",
    intuition:
      "It is the mathematical function used as a reference, not another run of a numerical method.",
    whyItMatters:
      "When a supplied exact-solution expression is available, the Lab evaluates it at time-grid points to calculate exact-reference errors and support the Convergence Study. Numerical integration can still run without an exact solution, but those comparisons are then unavailable.",
    formula: {
      latex: "y'(t)=f(t,y(t)),\\qquad y(t_0)=y_0",
      accessibleText:
        "y prime of t equals f evaluated at t and y of t, with y of t zero equal to y zero.",
      display: "block",
    },
    assumptionsAndLimits:
      "The function must satisfy the equation and initial condition on the interval. Matching y(t_0)=y_0 alone is insufficient. The user's expression is not formally proved exact.",
    misconception: {
      statement:
        "passing the Lab's consistency check proves the expression is exact.",
      correction:
        "the check is numerical evidence at sampled values, not a mathematical proof.",
    },
    prerequisiteTermIds: ["initial_value_problem"],
    relatedTerms: [
      { kind: "term", termId: "numerical_approximation" },
      { kind: "future", label: "global error" },
      { kind: "future", label: "reference solution" },
      { kind: "future", label: "nodal error" },
    ],
    commonlyConfusedTerms: [
      { kind: "term", termId: "numerical_approximation" },
      { kind: "future", label: "reference solution" },
      {
        kind: "future",
        label: "a function that matches only the initial condition",
      },
    ],
    moduleNote:
      "Presets may supply an analytical expression, and custom input may supply one; neither changes the numerical integration itself.",
    tutorTopic:
      "Explain reference-value use and the proof limitation without treating the expression as automatically certified.",
  }),
  requiredEntry({
    id: "forward_euler_method",
    label: "Forward Euler method",
    aliases: ["Forward Euler", "forward Euler", "Euler method"],
    definition:
      "Forward Euler computes the next approximation from the current time, the current approximation, and the derivative evaluated there.",
    fullDefinition:
      "Forward Euler is an explicit one-step method that uses the current time t_n and approximation u_n to compute u_{n+1}=u_n+h f(t_n,u_n). Its theoretical order is 1 under the usual regularity and stability assumptions. It is simple and useful for learning, but for some problems its absolute-stability restriction forces the use of small time-step sizes.",
    intuition:
      "It follows the current tangent direction for one time step.",
    whyItMatters:
      "Its direct update makes it a clear baseline for seeing how method choice and time-step size affect computed values. It is also the Beginner Starter method.",
    formula: {
      latex: "u_{n+1}=u_n+h f(t_n,u_n)",
      accessibleText:
        "u sub n plus one equals u sub n plus h times f evaluated at t sub n and u sub n.",
      display: "block",
    },
    assumptionsAndLimits:
      "Theoretical order 1 needs the usual regularity and stability assumptions. Observed order need not equal 1 in every finite run, and smaller h is not a universal remedy.",
    misconception: {
      statement:
        "every Forward Euler run must show observed order exactly 1.",
      correction:
        "1 is the theoretical order under the usual assumptions; finite observed evidence can differ or be unavailable.",
    },
    prerequisiteTermIds: [
      "initial_value_problem",
      "step_size",
      "time_grid",
      "explicit_scheme",
    ],
    relatedTerms: [
      { kind: "term", termId: "numerical_approximation" },
      { kind: "future", label: "absolute stability" },
      { kind: "future", label: "observed order" },
    ],
    commonlyConfusedTerms: [
      { kind: "term", termId: "backward_euler_method" },
      { kind: "future", label: "theoretical order versus observed order" },
      { kind: "future", label: "explicitness versus stability" },
    ],
    moduleNote:
      "In this Lab, Forward Euler is the Beginner Starter method. Its update uses one right-hand-side evaluation per fixed time step, and the Lab does not adapt h automatically.",
    tutorTopic:
      "Walk through one update using the current equation and values, then qualify any order or stability statement.",
  }),
  requiredEntry({
    id: "backward_euler_method",
    label: "Backward Euler method",
    aliases: ["Backward Euler", "backward Euler"],
    definition:
      "Backward Euler defines the next approximation through an equation involving the unknown next value.",
    fullDefinition:
      "Backward Euler is an implicit one-step method: u_{n+1}=u_n+h f(t_{n+1},u_{n+1}). Because the unknown next approximation appears on both sides, each step must be solved. Its theoretical order is 1 under the usual assumptions, and it is A-stable for the scalar test equation. A-stability does not guarantee accuracy, and it does not guarantee that the nonlinear solve will succeed.",
    intuition:
      "The next value appears inside its own update equation, so the method cannot simply evaluate known quantities and move on.",
    whyItMatters:
      "The current implementation may use nonlinear iteration and reports its diagnostics separately. That iteration evidence must not be confused with a mathematical absolute-stability property.",
    formula: {
      latex: "u_{n+1}=u_n+h f(t_{n+1},u_{n+1})",
      accessibleText:
        "u sub n plus one equals u sub n plus h times f evaluated at t sub n plus one and u sub n plus one.",
      display: "block",
    },
    assumptionsAndLimits:
      "Theoretical order 1 requires the usual regularity and stability assumptions. The A-stability statement refers to the scalar test equation. The nonlinear solve may fail; if it succeeds, that does not by itself establish accuracy, and nonlinear convergence remains separate from the method's A-stability.",
    misconception: {
      statement:
        "if the nonlinear iteration converges, Backward Euler must be accurate and stable for that run.",
      correction:
        "iteration success, accuracy, and absolute stability are different questions.",
    },
    prerequisiteTermIds: [
      "initial_value_problem",
      "step_size",
      "time_grid",
    ],
    relatedTerms: [
      { kind: "term", termId: "numerical_approximation" },
      { kind: "future", label: "implicit scheme" },
      { kind: "future", label: "absolute stability" },
      { kind: "future", label: "A-stability" },
      { kind: "future", label: "stiffness" },
    ],
    commonlyConfusedTerms: [
      { kind: "future", label: "implicit scheme" },
      { kind: "future", label: "nonlinear-solver convergence" },
      { kind: "future", label: "absolute stability" },
      { kind: "future", label: "accuracy" },
    ],
    moduleNote:
      "In this Lab, Backward Euler is the basic implicit example. Because the next approximation appears inside f, the implementation may require nonlinear iteration. Those iteration diagnostics describe the step solve, not the method's absolute-stability property.",
    tutorTopic:
      "Explain why the update is implicit, how this implementation iterates, and why nonlinear convergence is different from absolute stability.",
  }),
]);

export const odeGlossaryExtension = requiredExtension({
  moduleId: "ode",
  overrides: [
    {
      termId: "numerical_approximation",
      whyItMattersHere:
        "In this Lab, u_n is the value produced by the selected method at time t_n, so u_n≈y(t_n).",
      prerequisiteTermIds: ["initial_value_problem", "time_grid"],
      relatedTerms: [
        { kind: "term", termId: "exact_solution" },
        { kind: "future", label: "nodal error" },
        { kind: "future", label: "residual" },
        { kind: "future", label: "global error" },
      ],
      commonlyConfusedTerms: [
        { kind: "term", termId: "exact_solution" },
        { kind: "future", label: "error" },
        { kind: "future", label: "residual" },
      ],
      moduleNote:
        "In this Lab, u_n denotes the stored numerical approximation at time t_n. When an exact solution is supplied, y(t_n) provides a separate reference value for comparison.",
    },
    {
      termId: "explicit_scheme",
      contextualDefinition:
        "In this Lab, Forward Euler is the simplest example: u_{n+1}=u_n+h f(t_n,u_n).",
      whyItMattersHere:
        "Forward Euler is explicit, while Backward Euler is implicit. This distinction describes how each next approximation is obtained; it does not by itself decide which method is more accurate or suitable for a particular problem.",
      formula: {
        latex: "u_{n+1}=u_n+h f(t_n,u_n)",
        accessibleText:
          "u sub n plus one equals u sub n plus h times f evaluated at t sub n and u sub n.",
        display: "block",
      },
      prerequisiteTermIds: ["numerical_approximation", "step_size"],
      relatedTerms: [
        { kind: "term", termId: "forward_euler_method" },
        { kind: "term", termId: "backward_euler_method" },
        { kind: "future", label: "implicit scheme" },
      ],
      commonlyConfusedTerms: [
        { kind: "future", label: "accuracy order" },
        { kind: "future", label: "absolute stability" },
        {
          kind: "future",
          label: "explicit closed form for an exact solution",
        },
      ],
      moduleNote:
        "Forward Euler is the Wave 1 example. Other explicit methods may use additional evaluations or previously stored values, but they still form the next approximation from quantities already known.",
    },
  ],
});
