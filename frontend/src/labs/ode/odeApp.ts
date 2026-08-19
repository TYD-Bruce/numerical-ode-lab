import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
  LogarithmicScale,
  type ChartConfiguration,
} from "chart.js";
import type { MethodConfig, SeriesPoint, SolverResult } from "@numerical-t-lab/numerics/ode/solvers";
import { integrateFirstOrder, integrateSecondOrder } from "@numerical-t-lab/numerics/ode/solvers";
import {
  METHOD_CATALOG,
  FIRST_ORDER_CATALOG,
  catalogByFamily,
  displayNameFor,
  type MethodCatalogEntry,
} from "@numerical-t-lab/numerics/ode/method-catalog";
import { formatCoefficients } from "./mathDisplay";
import type { ChartInstruction } from "@numerical-t-lab/contracts/tutor";
import { methodMathContent } from "../../math/ui/methodMathContent";
import { renderReadonlyMath } from "../../math/ui/readonlyMath";
import { validateFixedStepGrid } from "@numerical-t-lab/numerics/ode/grid";
import { serializeMathAst } from "@numerical-t-lab/numerics/expressions/canonical";
import type { MathExpression } from "@numerical-t-lab/numerics/expressions/expression";
import {
  compileProductionExpression,
  createSuccessfulExpressionSnapshot,
  currentReadyExpression,
  persistMathFieldSnapshot,
  persistOptionalMathFieldSnapshot,
  type PersistedMathExpressionState,
  type PersistedOptionalMathExpressionState,
  type ProductionMathProfile,
  type SuccessfulExpressionSnapshot,
} from "./problemExpressions";
import {
  PROBLEM_PRESETS,
  isPresetFormDirty,
  loadProblemPreset,
  problemPresetById,
  undoProblemPreset,
  updatePresetProblemFields,
  type PresetFormState,
  type ProblemPresetId,
  type TrackedProblemFields,
} from "./problemPresets";
import type { EditableMathFieldHandle } from "../../math/ui/editableMathField";
import {
  mountExpressionErrorSummary,
  type ExpressionErrorSummaryHandle,
} from "../../math/ui/expressionErrorSummary";
import {
  ConvergenceStudyFailure,
  checkConvergenceStudyConsistency,
  runConvergenceStudy,
  validateConsistencyPermission,
  type ConvergenceStudyConfig,
} from "@numerical-t-lab/numerics/convergence";
import {
  canRunConfirmedWarning,
  cancelWarningConfirmation,
  convergenceEligibility,
  createSuccessfulFirstOrderRunSnapshot,
  currentStudyFingerprint,
  editConvergenceSetup,
  finishWarningAttempt,
  reconcileConvergenceUiState,
  recordConvergenceFailure,
  recordConvergenceSuccess,
  requestWarningConfirmation,
  setConvergenceConsistency,
  setConvergenceDrawerOpen,
  setConvergenceMetric,
  setTeachingAccordion,
  type ConvergenceUiState,
  type SuccessfulFirstOrderRunSnapshot,
} from "./convergenceStudyState";
import {
  mountConvergenceStudyView,
  resolveNumericalChartTheme,
  type ConvergenceChartFactory,
  type ConvergenceStudyIntent,
  type ConvergenceStudyViewHandle,
} from "./convergenceStudyView";
import type {
  LabLifecycleCallbacks,
  LabSessionMetadata,
  LabTutorBinding,
  ResumeSummary,
} from "../../app/contracts";
import { THEME_CHANGE_EVENT } from "../../app/theme";
import type { LabGlossaryBinding } from "../../glossary/glossaryController";
import {
  runCoefficientValidation,
  runSanityCheck,
} from "./coefficientValidation";
import {
  computeOdeLabMeaningful,
  createBeginnerStarterSession,
  createOdeResumeSummary,
  createReadonlySolverResult,
  getExperimentIdentity,
  getConvergenceState,
  setConvergenceState,
  type OdeProblemInputs,
  type OdeSessionState,
  type OdeSelectedMethod,
  type ReadonlySolverResult,
} from "./odeSession";
import { createOdeTutorBinding } from "./odeTutorBinding";
import {
  createOdeGlossaryRuntime,
  type OdeGlossaryRenderTransaction,
  type OdeWave1AnnotationId,
} from "./odeGlossary";
import {
  createLabHeader,
  createLabShell,
} from "../../components/lab-presentation/labShell";
import { createStageSection } from "../../components/lab-presentation/stageSection";
import { createEvidenceBlock } from "../../components/lab-presentation/evidenceBlock";
import { createPrimaryResult } from "../../components/lab-presentation/primaryResult";
import { createProblemContext } from "../../components/lab-presentation/problemContext";
import {
  applyLabActionRole,
  createNumericalTable,
} from "../../components/lab-presentation/supportingElements";
import { createTeachingBlock } from "../../components/lab-presentation/teachingBlock";
import {
  createWorkflowNavigation,
  disposeWorkflowNavigation,
  type LabStageRole,
} from "../../components/lab-presentation/workflowNavigation";
import "./odeApp.css";

runCoefficientValidation();
runSanityCheck();

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  LogarithmicScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export type SelectedMethod = OdeSelectedMethod;

interface PersistedForm {
  t0: string;
  tEnd: string;
  h: string;
  firstExpression: PersistedMathExpressionState;
  secondExpression: PersistedMathExpressionState;
  exactSolutionEnabled: boolean;
  exactExpression: PersistedOptionalMathExpressionState;
  y0: string;
  u0: string;
  v0: string;
  order: string;
}

const activeOdeMounts = new WeakMap<HTMLElement, object>();

export interface MountOdeAppOptions {
  readonly target: HTMLElement;
  readonly initialSession: OdeSessionState;
  readonly navigate?: (path: string) => void;
  readonly lifecycle?: Pick<
    LabLifecycleCallbacks<OdeSessionState>,
    "updateSession" | "recordMeaningfulInteraction" | "applyConfirmedReset"
  >;
  readonly now?: () => number;
  readonly loadEditableMathField?: () => Promise<
    Pick<
      typeof import("../../math/ui/editableMathField"),
      "mountEditableMathField"
    >
  >;
}

export interface MountedOdeApp {
  getSession(): OdeSessionState;
  getResumeSummary(): ResumeSummary | undefined;
  getTutorBinding(): LabTutorBinding<unknown>;
  getGlossaryBinding(): LabGlossaryBinding;
  dispose(): void;
}

export function mountOdeApp(options: MountOdeAppOptions): MountedOdeApp {
  const app = options.target;
  if (activeOdeMounts.has(app)) {
    throw new Error("The ODE Lab target already owns a mounted application.");
  }
  const mountToken = {};
  activeOdeMounts.set(app, mountToken);
  const glossaryRuntime = createOdeGlossaryRuntime();
  let disposed = false;
  let uiGeneration = 0;
  let step = options.initialSession.step;
  let session = options.initialSession.workflow;
  let selected: SelectedMethod | null = options.initialSession.selectedMethod;
  let chart: Chart | null = null;
  let primaryChartKind: "single" | "second" | "compare" | null = null;
  let lastResult: ReadonlySolverResult | null =
    options.initialSession.output.single?.result ?? null;
  let lastResultExpression: SuccessfulExpressionSnapshot | null =
    options.initialSession.output.single?.expression ?? null;
  let lastCompare = options.initialSession.output.comparison
    ? {
      ...options.initialSession.output.comparison,
    }
    : null;
  let presetFormState: PresetFormState = options.initialSession.form;
  let secondOrderForm =
    options.initialSession.selectedMethod?.order === undefined
      ? options.initialSession.secondOrderForm
      : {
        ...options.initialSession.secondOrderForm,
        methodOrderDraft: String(options.initialSession.selectedMethod.order),
      };
  let lastProblemInputs: OdeProblemInputs | null =
    options.initialSession.output.single?.problemInputs ?? null;
  let comparePickError = options.initialSession.comparePickError;
  let activeExpressionField: EditableMathFieldHandle | null = null;
  let activeExactExpressionField: EditableMathFieldHandle | null = null;
  let activeExpressionSummary: ExpressionErrorSummaryHandle | null = null;
  let lastFirstOrderRunSnapshot: SuccessfulFirstOrderRunSnapshot | null =
    options.initialSession.output.single?.firstOrderRun ?? null;
  let convergenceStates = options.initialSession.convergenceByFingerprint;
  let activeConvergenceView: ConvergenceStudyViewHandle | null = null;
  let lastMeaningfulInteraction: number | undefined;
  let activeResetDialog: HTMLElement | null = null;
  let resetTrigger: HTMLElement | null = null;
  let resetBackground: Array<{
    readonly element: HTMLElement;
    readonly wasInert: boolean;
  }> = [];

  function restorePureSession(next: OdeSessionState): void {
    step = next.step;
    session = next.workflow;
    selected = next.selectedMethod;
    lastResult = next.output.single?.result ?? null;
    lastResultExpression = next.output.single?.expression ?? null;
    lastCompare = next.output.comparison
      ? { ...next.output.comparison }
      : null;
    presetFormState = next.form;
    secondOrderForm = next.secondOrderForm;
    lastProblemInputs = next.output.single?.problemInputs ?? null;
    comparePickError = next.comparePickError;
    lastFirstOrderRunSnapshot = next.output.single?.firstOrderRun ?? null;
    convergenceStates = next.convergenceByFingerprint;
    lastMeaningfulInteraction = undefined;
  }

  function applyTutorChartInstruction(instruction: ChartInstruction): void {
    if (!chart || instruction.type === "none") return;
    if (instruction.type === "zoom_range") {
      chart.options.scales = chart.options.scales ?? {};
      const x = (chart.options.scales as { x?: { min?: number; max?: number } }).x ?? {};
      if (instruction.tMin !== undefined) x.min = instruction.tMin;
      if (instruction.tMax !== undefined) x.max = instruction.tMax;
      (chart.options.scales as { x: typeof x }).x = x;
      chart.update();
      return;
    }
    if (instruction.type === "line_chart") {
      for (const dataset of chart.data.datasets) {
        if (instruction.includePoints !== undefined && dataset.type === "line") {
          dataset.pointRadius = instruction.includePoints ? 3 : 0;
        }
      }
      chart.update();
    }
  }

  const tutorBindingControl = createOdeTutorBinding({
    getSource: () => {
      if (!lastResult || !lastProblemInputs || session.mode === "compare") {
        return { enabled: false };
      }
      const convergenceState = lastFirstOrderRunSnapshot
        ? getConvergenceState(
          convergenceStates,
          lastFirstOrderRunSnapshot.runFingerprint
        )
        : undefined;
      return {
        enabled: true,
        result: lastResult,
        problem: lastProblemInputs,
        ...(convergenceState ? { convergenceState } : {}),
      };
    },
    prepareForOpen: () => {
      const keyboard = (window as unknown as {
        mathVirtualKeyboard?: { hide?: (options?: { animate?: boolean }) => void };
      }).mathVirtualKeyboard;
      keyboard?.hide?.({ animate: false });
    },
    applyChartInstruction: applyTutorChartInstruction,
  });

  function replaceTrackedField(update: Partial<TrackedProblemFields>): void {
    presetFormState = updatePresetProblemFields(presetFormState, {
      ...presetFormState.current,
      ...update,
    });
  }

  const persisted = {} as PersistedForm;
  Object.defineProperties(persisted, {
    t0: {
      get: () => presetFormState.current.t0,
      set: (value: string) => replaceTrackedField({ t0: value }),
    },
    tEnd: {
      get: () => presetFormState.current.tEnd,
      set: (value: string) => replaceTrackedField({ tEnd: value }),
    },
    h: {
      get: () => presetFormState.current.runStepSize,
      set: (value: string) => replaceTrackedField({ runStepSize: value }),
    },
    firstExpression: {
      get: () => presetFormState.current.rhs,
      set: (value: PersistedMathExpressionState) => replaceTrackedField({ rhs: value }),
    },
    exactSolutionEnabled: {
      get: () => presetFormState.current.exactSolutionEnabled,
      set: (value: boolean) => replaceTrackedField({ exactSolutionEnabled: value }),
    },
    exactExpression: {
      get: () => presetFormState.current.exactSolution,
      set: (value: PersistedOptionalMathExpressionState) =>
        replaceTrackedField({ exactSolution: value }),
    },
    y0: {
      get: () => presetFormState.current.y0,
      set: (value: string) => replaceTrackedField({ y0: value }),
    },
    secondExpression: {
      get: () => secondOrderForm.expression,
      set: (value: PersistedMathExpressionState) => {
        secondOrderForm = { ...secondOrderForm, expression: value };
      },
    },
    u0: {
      get: () => secondOrderForm.u0,
      set: (value: string) => {
        secondOrderForm = { ...secondOrderForm, u0: value };
      },
    },
    v0: {
      get: () => secondOrderForm.v0,
      set: (value: string) => {
        secondOrderForm = { ...secondOrderForm, v0: value };
      },
    },
    order: {
      get: () => secondOrderForm.methodOrderDraft,
      set: (value: string) => {
        secondOrderForm = { ...secondOrderForm, methodOrderDraft: value };
      },
    },
  });

  function catalogEntry(sel: SelectedMethod): MethodCatalogEntry {
    return catalogByFamily(sel.family);
  }

  function methodLabel(sel: SelectedMethod): string {
    return displayNameFor(sel.family, sel.order);
  }

  function selectedMeta(): MethodCatalogEntry | null {
    return selected ? catalogEntry(selected) : null;
  }

  function configFromSelection(sel: SelectedMethod): MethodConfig {
    const cat = catalogEntry(sel);
    const order = cat.hasOrderSelector
      ? Number(sel.order ?? cat.orderDefault ?? 2)
      : undefined;
    return { family: sel.family, order };
  }

  function persistFromFirstOrderFd(fd: FormData): void {
    replaceTrackedField({
      t0: String(fd.get("t0") ?? "0"),
      tEnd: String(fd.get("tEnd") ?? "5"),
      runStepSize: String(fd.get("h") ?? "0.05"),
      y0: String(fd.get("y0") ?? "1"),
    });
    persisted.order = String(fd.get("order") ?? persisted.order ?? "2");
  }

  function persistFromSecondOrderFd(fd: FormData): void {
    replaceTrackedField({
      t0: String(fd.get("t0") ?? "0"),
      tEnd: String(fd.get("tEnd") ?? "5"),
      runStepSize: String(fd.get("h") ?? "0.05"),
    });
    persisted.u0 = String(fd.get("u0") ?? "1");
    persisted.v0 = String(fd.get("v0") ?? "0");
  }

  function trackedFields(): TrackedProblemFields {
    return {
      rhs: persisted.firstExpression,
      exactSolutionEnabled: persisted.exactSolutionEnabled,
      exactSolution: persisted.exactExpression,
      t0: persisted.t0,
      y0: persisted.y0,
      tEnd: persisted.tEnd,
      runStepSize: persisted.h,
    };
  }

  function applyTrackedFields(fields: TrackedProblemFields): void {
    persisted.firstExpression = fields.rhs;
    persisted.exactSolutionEnabled = fields.exactSolutionEnabled;
    persisted.exactExpression = fields.exactSolution;
    persisted.t0 = fields.t0;
    persisted.y0 = fields.y0;
    persisted.tEnd = fields.tEnd;
    persisted.h = fields.runStepSize;
  }

  function markMeaningfulInteraction(): void {
    const at = (options.now ?? Date.now)();
    lastMeaningfulInteraction = at;
    options.lifecycle?.recordMeaningfulInteraction?.(at);
  }

  function recordTrackedEdit(meaningfulInteraction = true): void {
    presetFormState = updatePresetProblemFields(presetFormState, trackedFields());
    refreshExperimentIdentityPresentation();
    if (meaningfulInteraction) markMeaningfulInteraction();
    emitSessionUpdate();
  }

  function experimentIdentityPresentation(): {
    label: "Beginner starter" | "Custom experiment";
    description: string;
  } {
    return getExperimentIdentity(createSessionSnapshot(false)) === "beginner-starter"
      ? {
        label: "Beginner starter",
        description:
          "This example is ready to run. Use it as-is, choose another preset, or enter your own problem.",
      }
      : {
        label: "Custom experiment",
        description: "You have changed the starter problem.",
      };
  }

  function refreshExperimentIdentityPresentation(): void {
    const status = app.querySelector<HTMLElement>("[data-experiment-identity]");
    if (!status) return;
    const presentation = experimentIdentityPresentation();
    status.dataset.experimentIdentity = presentation.label === "Beginner starter"
      ? "beginner-starter"
      : "custom-experiment";
    const label = status.querySelector<HTMLElement>("[data-experiment-label]");
    const description = status.querySelector<HTMLElement>(
      "[data-experiment-description]"
    );
    if (label) label.textContent = presentation.label;
    if (description) description.textContent = presentation.description;
  }

  function readPersistedFromFormEl(form: HTMLFormElement): void {
    const fd = new FormData(form);
    if (fd.has("y0")) persistFromFirstOrderFd(fd);
    else persistFromSecondOrderFd(fd);
  }

  function disposeExpressionUi(): void {
    activeExpressionField?.dispose();
    activeExactExpressionField?.dispose();
    activeExpressionSummary?.dispose();
    activeExpressionField = null;
    activeExactExpressionField = null;
    activeExpressionSummary = null;
  }

  function disposeConvergenceUi(): void {
    activeConvergenceView?.dispose();
    activeConvergenceView = null;
  }

  function disposePrimaryChart(): void {
    chart?.destroy();
    chart = null;
    primaryChartKind = null;
  }

  function refreshPrimaryChartTheme(): void {
    if (!chart || !primaryChartKind) return;
    const theme = resolveNumericalChartTheme();
    const datasets = chart.data.datasets as Array<{
      borderColor?: string;
      backgroundColor?: string;
      fill?: boolean | string;
    }>;
    datasets.forEach((dataset, index) => {
      dataset.borderColor =
        index === 0
          ? theme.primary
          : primaryChartKind === "compare"
            ? theme.compare
            : theme.secondary;
      if (dataset.fill) dataset.backgroundColor = theme.fill;
    });

    const visualOptions = chart.options as unknown as {
      plugins?: {
        legend?: { labels?: { color?: string } };
        title?: { color?: string };
        tooltip?: {
          backgroundColor?: string;
          titleColor?: string;
          bodyColor?: string;
          borderColor?: string;
        };
      };
      scales?: Record<
        string,
        {
          title?: { color?: string };
          ticks?: { color?: string };
          grid?: { color?: string };
        }
      >;
    };
    const plugins = visualOptions.plugins;
    if (plugins?.legend?.labels) plugins.legend.labels.color = theme.text;
    if (plugins?.title) plugins.title.color = theme.text;
    if (plugins?.tooltip) {
      plugins.tooltip.backgroundColor = theme.tooltipBackground;
      plugins.tooltip.titleColor = theme.tooltipText;
      plugins.tooltip.bodyColor = theme.tooltipText;
      plugins.tooltip.borderColor = theme.tooltipBorder;
    }
    for (const scale of Object.values(visualOptions.scales ?? {})) {
      if (scale.title) scale.title.color = theme.muted;
      if (scale.ticks) scale.ticks.color = theme.muted;
      if (scale.grid) scale.grid.color = theme.grid;
    }
    chart.update("none");
  }

  const onThemeChange = (): void => {
    if (disposed) return;
    refreshPrimaryChartTheme();
    activeConvergenceView?.refreshTheme?.();
  };

  function closeResetDialog(returnFocus: boolean): void {
    const dialog = activeResetDialog;
    if (!dialog) return;
    activeResetDialog = null;
    dialog.remove();
    for (const item of resetBackground) {
      if (!item.wasInert) item.element.removeAttribute("inert");
    }
    resetBackground = [];
    if (returnFocus && resetTrigger?.isConnected) {
      try {
        resetTrigger.focus({ preventScroll: true });
      } catch {
        resetTrigger.focus();
      }
    }
    resetTrigger = null;
  }

  function confirmNewExperiment(clearTutorConversation: boolean): void {
    const freshSession = createBeginnerStarterSession();
    const at = (options.now ?? Date.now)();
    const metadata: LabSessionMetadata = {
      labMeaningful: false,
      tutorMeaningful: false,
      meaningful: false,
      resumeSummary: createOdeResumeSummary(freshSession, 0),
    };
    options.lifecycle?.applyConfirmedReset?.({
      session: freshSession,
      metadata,
      clearTutorConversation,
      at,
    });
    restorePureSession(freshSession);
    render();
    const focusGeneration = uiGeneration;
    queueMicrotask(() => {
      if (!isCurrentGeneration(focusGeneration)) return;
      const heading = app.querySelector<HTMLElement>("[data-route-focus]");
      try {
        heading?.focus({ preventScroll: true });
      } catch {
        heading?.focus();
      }
    });
  }

  function openResetDialog(trigger: HTMLElement): void {
    if (disposed || activeResetDialog) return;
    resetTrigger = trigger;
    const backdrop = document.createElement("div");
    backdrop.className = "new-experiment-backdrop";
    backdrop.dataset.newExperimentDialog = "";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-labelledby", "new-experiment-title");
    const dialog = document.createElement("section");
    dialog.className = "new-experiment-dialog";
    const title = document.createElement("h2");
    title.id = "new-experiment-title";
    title.textContent = "Reset the current experiment?";
    const explanation = document.createElement("p");
    explanation.textContent =
      "Drafts, results, and analysis for this experiment will be cleared.";
    const label = document.createElement("label");
    label.className = "new-experiment-checkbox";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.dataset.clearTutor = "";
    label.append(
      checkbox,
      document.createTextNode("Also clear this module's Tutor conversation")
    );
    const actions = document.createElement("div");
    actions.className = "new-experiment-actions";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "btn ghost";
    cancel.dataset.resetCancel = "";
    cancel.textContent = "Cancel";
    const confirm = document.createElement("button");
    confirm.type = "button";
    confirm.className = "btn danger";
    confirm.dataset.resetConfirm = "";
    confirm.textContent = "New experiment";
    actions.append(cancel, confirm);
    dialog.append(title, explanation, label, actions);
    backdrop.append(dialog);
    activeResetDialog = backdrop;
    resetBackground = [...document.body.children]
      .filter((element): element is HTMLElement => element instanceof HTMLElement)
      .map((element) => ({
        element,
        wasInert: element.hasAttribute("inert"),
      }));
    for (const item of resetBackground) item.element.setAttribute("inert", "");
    document.body.append(backdrop);

    cancel.addEventListener("click", () => closeResetDialog(true));
    confirm.addEventListener("click", () => {
      const clearTutorConversation = checkbox.checked;
      closeResetDialog(false);
      confirmNewExperiment(clearTutorConversation);
    });
    backdrop.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeResetDialog(true);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...backdrop.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      )];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    cancel.focus();
  }

  function isCurrentGeneration(generation: number, owner?: Element): boolean {
    return (
      !disposed &&
      activeOdeMounts.get(app) === mountToken &&
      generation === uiGeneration &&
      (owner === undefined || owner.isConnected)
    );
  }

  function orderFieldHtml(cat: MethodCatalogEntry): string {
    if (!cat.hasOrderSelector) return "";
    const min = cat.orderMin ?? 1;
    const max = cat.orderMax ?? 8;
    const val = persisted?.order ?? String(cat.orderDefault ?? 2);
    return `
    <label class="field">
      <span>Theoretical order p</span>
      <input name="order" type="number" min="${min}" max="${max}" step="1" value="${val}" required />
    </label>
    <p class="hint multistep-note">For multistep methods, startup values are generated by Runge-Kutta 4.</p>
  `;
  }

  function glossaryTermNode(
    glossaryRender: OdeGlossaryRenderTransaction,
    annotationId: OdeWave1AnnotationId
  ): Node {
    return glossaryRender.createTerm(annotationId).node;
  }

  function renderContextLede(
    shell: HTMLElement,
    glossaryRender: OdeGlossaryRenderTransaction
  ): void {
    const lede = shell.querySelector<HTMLElement>(
      "[data-ode-glossary-lede]"
    )!;
    lede.append(
      document.createTextNode(
        "Explore fixed-step methods for a first-order "
      ),
      glossaryTermNode(glossaryRender, "ODE-W1-ANN-001"),
      document.createTextNode(" posed as an "),
      glossaryTermNode(glossaryRender, "ODE-W1-ANN-002"),
      document.createTextNode(
        ", then analyze numerical error, observed convergence, and method behavior as the time-step size changes."
      )
    );
  }

  function renderMethodGlossaryHelper(
    glossaryRender: OdeGlossaryRenderTransaction
  ): HTMLElement {
    const helper = document.createElement("p");
    helper.className = "hint ode-method-glossary-helper";
    helper.dataset.odeMethodGlossaryHelper = "";
    helper.append(
      glossaryTermNode(glossaryRender, "ODE-W1-ANN-008"),
      document.createTextNode(
        ": the next numerical approximation is computed directly from quantities already known before the update."
      )
    );
    return helper;
  }

  function addFieldGlossaryCompanion(
    input: HTMLInputElement,
    glossaryRender: OdeGlossaryRenderTransaction,
    annotationId: OdeWave1AnnotationId,
    owner: "initial-condition" | "step-size"
  ): void {
    const label = input.closest<HTMLLabelElement>("label");
    if (!label) throw new Error(`Missing ${owner} field label.`);
    const wrapper = document.createElement("div");
    wrapper.className = "field-glossary-companion";
    wrapper.dataset.odeGlossaryField = owner;
    label.before(wrapper);
    wrapper.append(
      label,
      glossaryTermNode(glossaryRender, annotationId)
    );
  }

  function addTimeGridGlossaryHelper(
    hInput: HTMLInputElement,
    glossaryRender: OdeGlossaryRenderTransaction
  ): void {
    const field =
      hInput.closest<HTMLElement>("[data-ode-glossary-field]") ??
      hInput.closest<HTMLLabelElement>("label");
    if (!field) throw new Error("Missing time-step field owner.");
    const helper = document.createElement("p");
    helper.className = "hint wide ode-time-grid-glossary-helper";
    helper.dataset.odeTimeGridGlossaryHelper = "";
    helper.append(
      document.createTextNode("The current fixed-step "),
      glossaryTermNode(glossaryRender, "ODE-W1-ANN-005"),
      document.createTextNode(
        " includes the aligned start and end times."
      )
    );
    field.after(helper);
  }

  function addExactSolutionGlossaryHeading(
    toggle: HTMLInputElement,
    glossaryRender: OdeGlossaryRenderTransaction
  ): void {
    const label = toggle.closest<HTMLLabelElement>("label");
    if (!label) throw new Error("Missing exact-solution checkbox label.");
    const heading = document.createElement("p");
    heading.className = "wide ode-exact-solution-glossary-heading";
    heading.dataset.odeExactSolutionGlossaryHeading = "";
    heading.append(glossaryTermNode(glossaryRender, "ODE-W1-ANN-007"));
    label.before(heading);
  }

  function replaceSelectedMethodHeading(
    wrap: HTMLElement,
    selectedMethod: SelectedMethod,
    glossaryRender: OdeGlossaryRenderTransaction
  ): void {
    const annotationId =
      selectedMethod.family === "forward_euler"
        ? "ODE-W1-ANN-009"
        : selectedMethod.family === "backward_euler"
          ? "ODE-W1-ANN-010"
          : undefined;
    if (!annotationId) return;
    const heading = wrap.querySelector<HTMLElement>(
      "[data-selected-method-heading]"
    );
    if (!heading) throw new Error("Missing selected method heading.");
    heading.replaceChildren(glossaryTermNode(glossaryRender, annotationId));
  }

  function sameMethodSelection(
    left: SelectedMethod,
    right: SelectedMethod
  ): boolean {
    const leftOrder = left.order ?? catalogByFamily(left.family).orderDefault;
    const rightOrder = right.order ?? catalogByFamily(right.family).orderDefault;
    return left.family === right.family && leftOrder === rightOrder;
  }

  function hasSuccessfulOutput(): boolean {
    if (lastCompare) {
      return (
        session.mode === "compare" &&
        sameMethodSelection(session.a, lastCompare.a) &&
        sameMethodSelection(session.b, lastCompare.b)
      );
    }
    const selectedCatalog = selected
      ? catalogByFamily(selected.family)
      : undefined;
    return Boolean(
      lastResult &&
        lastResultExpression &&
        session.mode === "single" &&
        selected &&
        selected.family === lastResult.metadata.family &&
        (!selectedCatalog?.hasOrderSelector ||
          (selected.order ?? selectedCatalog.orderDefault) ===
            lastResult.metadata.order)
    );
  }

  function canNavigateToData(): boolean {
    return (
      session.mode === "compare" ||
      (session.mode === "single" && selected !== null)
    );
  }

  function focusWorkflowStepAfterRender(
    workflowStep: "method" | "data" | "output"
  ): void {
    const focusGeneration = uiGeneration;
    queueMicrotask(() => {
      if (!isCurrentGeneration(focusGeneration)) return;
      app
        .querySelector<HTMLButtonElement>(
          `[data-workflow-step="${workflowStep}"]`
        )
        ?.focus({ preventScroll: true });
    });
  }

  function goToWorkflowStep(
    workflowStep: "method" | "data" | "output"
  ): void {
    const current =
      step === "choose" ? "method" : step === "configure" ? "data" : "output";
    if (workflowStep === current) return;
    if (workflowStep === "method") {
      step = "choose";
      render();
      focusWorkflowStepAfterRender("method");
      return;
    }
    if (workflowStep === "data") {
      if (!canNavigateToData()) return;
      step = "configure";
      render();
      focusWorkflowStepAfterRender("data");
      return;
    }
    if (!hasSuccessfulOutput()) return;
    step = "results";
    render();
    focusWorkflowStepAfterRender("output");
  }

  function createOdeWorkflowNavigation(): HTMLElement {
    const current =
      step === "choose" ? "method" : step === "configure" ? "data" : "output";
    const steps: readonly {
      key: "method" | "data" | "output";
      label: string;
      role: LabStageRole;
      available: boolean;
    }[] = [
      { key: "method", label: "Method", role: "method", available: true },
      {
        key: "data",
        label: "Data",
        role: "data",
        available: canNavigateToData(),
      },
      {
        key: "output",
        label: "Output",
        role: "output",
        available: hasSuccessfulOutput(),
      },
    ];
    return createWorkflowNavigation({
      label: "Initial Value Problems workflow",
      steps: steps.map((workflowStep) => ({
        ...workflowStep,
        current: current === workflowStep.key,
        onActivate: () => goToWorkflowStep(workflowStep.key),
      })),
    });
  }

  function render(): void {
    if (disposed) return;
    const generation = ++uiGeneration;
    const glossaryRender = glossaryRuntime.beginRender();
    try {
      const meta = selectedMeta();
      disposeExpressionUi();
      disposeConvergenceUi();
      disposePrimaryChart();
      disposeWorkflowNavigation(
        app.querySelector<HTMLElement>("[data-workflow-navigation]")
      );
      app.replaceChildren();

      const comparePicking = session.mode === "compare_pick";
      let workflowNote = "";
      if (comparePicking && session.mode === "compare_pick") {
        workflowNote =
          session.first === null
            ? "Choose the first first-order method, then a second method. You will enter one shared model y′ = f(t, y)."
            : `First method: ${methodLabel(session.first)}. Choose a different second method.`;
      }
      const experimentIdentity = experimentIdentityPresentation();
      const compactExperimentIdentity = step === "results";

      const breadcrumb = document.createElement("nav");
      breadcrumb.setAttribute("aria-label", "Breadcrumb");
      const overview = document.createElement("a");
      overview.href = "/ode";
      overview.textContent = "Numerical ODE";
      const separator = document.createElement("span");
      separator.setAttribute("aria-hidden", "true");
      separator.textContent = "/";
      breadcrumb.append(
        overview,
        separator,
        document.createTextNode("Initial Value Problems Lab")
      );
      const eyebrow = document.createElement("p");
      eyebrow.textContent = "AI-Assisted Educational Solver";
      const title = document.createElement("h1");
      title.tabIndex = -1;
      title.dataset.routeFocus = "true";
      title.textContent = "Initial Value Problems Lab";
      const reset = applyLabActionRole(
        document.createElement("button"),
        "secondary"
      );
      reset.type = "button";
      reset.classList.add("btn", "ghost", "new-experiment-trigger");
      reset.dataset.newExperiment = "true";
      reset.textContent = "New experiment";
      reset.addEventListener("click", () => openResetDialog(reset));
      const lede = document.createElement("p");
      lede.dataset.odeGlossaryLede = "true";
      const identity = document.createElement("div");
      identity.classList.toggle("is-compact", compactExperimentIdentity);
      identity.dataset.experimentIdentity =
        experimentIdentity.label === "Beginner starter"
          ? "beginner-starter"
          : "custom-experiment";
      const identityLabel = document.createElement("strong");
      identityLabel.dataset.experimentLabel = "true";
      identityLabel.textContent = experimentIdentity.label;
      identity.append(identityLabel);
      if (!compactExperimentIdentity) {
        const identityDescription = document.createElement("p");
        identityDescription.dataset.experimentDescription = "true";
        identityDescription.textContent = experimentIdentity.description;
        identity.append(identityDescription);
      }
      const headerDetails: HTMLElement[] = [];
      if (workflowNote) {
        const note = document.createElement("p");
        note.textContent = workflowNote;
        headerDetails.push(note);
      }
      const inputNote = document.createElement("p");
      inputNote.textContent =
        "Enter the equation in familiar mathematical notation. First-order fields use t and y; Leap-Frog acceleration uses t and u.";
      headerDetails.push(inputNote);
      if (comparePickError) {
        const error = document.createElement("p");
        error.className = "compare-error";
        error.setAttribute("role", "alert");
        error.textContent = comparePickError;
        headerDetails.push(error);
      }

      const stageRole: LabStageRole =
        step === "choose" ? "method" : step === "configure" ? "data" : "output";
      const stageLabel =
        stageRole === "method" ? "Method" : stageRole === "data" ? "Data" : "Output";
      const stage = createStageSection({ role: stageRole, label: stageLabel });
      stage.dataset.workflowPanel = stageLabel.toLowerCase();
      stage.dataset.workflowStage = stageRole;
      let outputMountPending = false;

      if (step === "choose") {
        stage.append(renderChoosePanel(glossaryRender));
      } else if (step === "configure") {
        if (session.mode === "compare") {
          stage.append(
            renderCompareForm(
              catalogEntry(session.a),
              catalogEntry(session.b),
              session.a,
              session.b,
              glossaryRender
            )
          );
        } else if (meta && selected) {
          stage.append(renderForm(meta, selected, glossaryRender));
        } else {
          step = "choose";
          stage.dataset.stageRole = "method";
          stage.dataset.workflowPanel = "method";
          stage.dataset.workflowStage = "method";
          stage.querySelector<HTMLElement>("[data-stage-label]")!.textContent = "Method";
          stage.append(renderChoosePanel(glossaryRender));
        }
      } else if (step === "results") {
        if (lastCompare) {
          outputMountPending = true;
          stage.append(
            renderCompareResultsShell(
              catalogEntry(lastCompare.a),
              catalogEntry(lastCompare.b),
              lastCompare.resultA,
              lastCompare.resultB,
              lastCompare.expression,
              glossaryRender
            )
          );
        } else if (
          meta &&
          lastResult &&
          lastResultExpression &&
          lastProblemInputs
        ) {
          outputMountPending = true;
          stage.append(
            renderResultsShell(
              meta,
              lastResult,
              lastResultExpression,
              lastProblemInputs,
              glossaryRender
            )
          );
        } else {
          step = "configure";
          stage.dataset.stageRole = "data";
          stage.dataset.workflowPanel = "data";
          stage.dataset.workflowStage = "data";
          stage.querySelector<HTMLElement>("[data-stage-label]")!.textContent = "Data";
          stage.append(renderChoosePanel(glossaryRender));
        }
      } else {
        step = "choose";
        stage.dataset.stageRole = "method";
        stage.dataset.workflowPanel = "method";
        stage.dataset.workflowStage = "method";
        stage.querySelector<HTMLElement>("[data-stage-label]")!.textContent = "Method";
        stage.append(renderChoosePanel(glossaryRender));
      }

      const shell = createLabShell({
        header: createLabHeader({
          breadcrumb,
          eyebrow,
          title,
          lede,
          identity,
          actions: [reset],
          details: headerDetails,
        }),
        workflow: createOdeWorkflowNavigation(),
        stage,
        className: "shell ode-lab-shell",
      });
      renderContextLede(shell, glossaryRender);
      app.append(shell);
      glossaryRender.commitImmediateScopes();
      if (!outputMountPending) glossaryRender.commitOutputScope();
      if (isCurrentGeneration(generation)) emitSessionUpdate();
    } catch (cause) {
      glossaryRender.abort();
      throw cause;
    }
  }

  function renderChoosePanel(
    glossaryRender: OdeGlossaryRenderTransaction
  ): HTMLElement {
    if (session.mode === "compare_pick") {
      const bar = document.createElement("div");
      bar.className = "choose-actions";
      bar.innerHTML = `<button type="button" class="btn ghost" data-cancel-compare>Cancel compare</button>`;
      bar.querySelector("[data-cancel-compare]")!.addEventListener("click", () => {
        session = { mode: "single" };
        comparePickError = "";
        markMeaningfulInteraction();
        render();
      });
      const heading = document.createElement("h2");
      heading.textContent = "Choose a method";
      const teaching = createTeachingBlock({
        heading,
        lead: renderMethodGlossaryHelper(glossaryRender),
        examples: [bar, renderCompareMethodGrid()],
      });
      teaching.classList.add("choose-panel", "ode-method-teaching");
      return teaching;
    }

    const bar = document.createElement("div");
    bar.className = "choose-actions";
    bar.innerHTML = `
    <button type="button" class="btn secondary" data-compare>Compare two methods</button>
    <p class="compare-hint">One shared y′ = f(t, y) setup (first-order methods only).</p>
  `;
    bar.querySelector("[data-compare]")!.addEventListener("click", () => {
      session = { mode: "compare_pick", first: null };
      comparePickError = "";
      markMeaningfulInteraction();
      render();
    });
    const heading = document.createElement("h2");
    heading.textContent = "Choose a method";
    const teaching = createTeachingBlock({
      heading,
      lead: renderMethodGlossaryHelper(glossaryRender),
      examples: [bar, renderSingleMethodGrid()],
    });
    teaching.classList.add("choose-panel", "ode-method-teaching");
    return teaching;
  }

  function renderMethodCard(
    cat: MethodCatalogEntry,
    onClick: () => void,
    selectedState?: boolean
  ): HTMLButtonElement {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    if (selectedState !== undefined) {
      card.setAttribute("aria-pressed", String(selectedState));
      card.classList.toggle("is-selected", selectedState);
    }
    const tag =
      cat.mode === "first"
        ? "First-order y′ = f(t, y)"
        : "Second-order u″ = a(t, u)";
    card.innerHTML = `
    <h3>${cat.displayName}</h3>
    <p>${cat.blurb}</p>
    <span class="tag">${tag}</span>
  `;
    card.addEventListener("click", onClick);
    return card;
  }

  function renderSingleMethodGrid(): HTMLElement {
    const grid = document.createElement("div");
    grid.className = "grid-methods";
    METHOD_CATALOG.forEach((cat) => {
      grid.append(
        renderMethodCard(cat, () => {
          session = { mode: "single" };
          selected = {
            family: cat.family,
            order: cat.orderDefault,
          };
          step = "configure";
          markMeaningfulInteraction();
          render();
        })
      );
    });
    return grid;
  }

  function renderCompareMethodGrid(): HTMLElement {
    const grid = document.createElement("div");
    grid.className = "grid-methods";
    FIRST_ORDER_CATALOG.forEach((cat) => {
      const isSelected =
        session.mode === "compare_pick" &&
        session.first?.family === cat.family &&
        (session.first.order ?? cat.orderDefault) === cat.orderDefault;
      grid.append(
        renderMethodCard(cat, () => {
          if (session.mode !== "compare_pick") return;
          const pick: SelectedMethod = {
            family: cat.family,
            order: cat.orderDefault,
          };
          if (session.first === null) {
            comparePickError = "";
            session = { mode: "compare_pick", first: pick };
            markMeaningfulInteraction();
            render();
            return;
          }
          const sameConfig =
            session.first.family === pick.family &&
            (session.first.order ?? cat.orderDefault) ===
            (pick.order ?? cat.orderDefault);
          if (sameConfig) {
            comparePickError =
              "Pick a different method (or change order p in the next step).";
            render();
            return;
          }
          comparePickError = "";
          session = { mode: "compare", a: session.first, b: pick };
          step = "configure";
          markMeaningfulInteraction();
          render();
        }, isSelected)
      );
    });
    return grid;
  }

  function firstOrderInputDefaults() {
    const p = persisted;
    return {
      t0: p.t0,
      tEnd: p.tEnd,
      h: p.h,
      y0: p.y0,
      order: p.order,
    };
  }

  function secondOrderInputDefaults() {
    const p = persisted;
    return {
      t0: p.t0,
      tEnd: p.tEnd,
      h: p.h,
      u0: p.u0,
      v0: p.v0,
    };
  }

  async function mountProductionExpressionField(
    wrap: HTMLElement,
    profile: ProductionMathProfile,
    onStateChanged?: () => void
  ): Promise<EditableMathFieldHandle | undefined> {
    const generation = uiGeneration;
    const persistedState =
      profile === "rhs" ? persisted.firstExpression : persisted.secondExpression;
    const fieldId = profile === "rhs" ? "rhs-expression" : "second-order-rhs-expression";
    const fieldLabel =
      profile === "rhs"
        ? "Right-hand side of y prime"
        : "Leap-Frog acceleration right-hand side";
    const host = wrap.querySelector<HTMLElement>("[data-expression-field]")!;
    host.textContent = "Loading mathematical editor…";
    let mountEditableMathField: typeof import("../../math/ui/editableMathField")["mountEditableMathField"];
    try {
      ({ mountEditableMathField } = await (
        options.loadEditableMathField?.() ?? import("../../math/ui/editableMathField")
      ));
    } catch {
      if (isCurrentGeneration(generation, wrap)) {
        host.textContent = "The mathematical editor could not be loaded.";
      }
      return undefined;
    }
    if (!isCurrentGeneration(generation, wrap)) return undefined;
    activeExpressionField = mountEditableMathField(host, {
      fieldId,
      fieldLabel,
      profile,
      equationPrefix:
        profile === "rhs"
          ? { visual: "y′ =", accessible: "y prime equals" }
          : { visual: "u″ =", accessible: "u double prime equals" },
      initialConfirmed: persistedState.confirmed,
      initialDraftLatex: persistedState.draftLatex,
      initialValidation:
        persistedState.validationKind === "incomplete" ? "gentle" : "strict",
      description:
        profile === "rhs"
          ? "Use only t and y. Enter textbook-style mathematics."
          : "Use only t and u for the Leap-Frog acceleration.",
      onDraftStateChange(snapshot) {
        if (profile === "rhs") {
          persisted.firstExpression = persistMathFieldSnapshot(
            profile,
            snapshot,
            persisted.firstExpression
          );
        } else {
          persisted.secondExpression = persistMathFieldSnapshot(
            profile,
            snapshot,
            persisted.secondExpression
          );
        }
        if (profile === "rhs") recordTrackedEdit();
        else {
          markMeaningfulInteraction();
          emitSessionUpdate();
        }
        activeExpressionSummary?.render([]);
        onStateChanged?.();
      },
      onLegacyPasteError(error) {
        const formError = wrap.querySelector<HTMLParagraphElement>("#form-error");
        if (formError) {
          formError.textContent = error.message;
          formError.hidden = false;
        }
        activeExpressionSummary?.render(
          [
            {
              fieldId,
              fieldLabel,
              message: error.message,
              focus: () => activeExpressionField?.focus(),
            },
          ],
          true
        );
      },
    });
    return activeExpressionField;
  }

  async function mountExactSolutionField(
    wrap: HTMLElement,
    onStateChanged?: () => void
  ): Promise<EditableMathFieldHandle | undefined> {
    const generation = uiGeneration;
    const host = wrap.querySelector<HTMLElement>("[data-exact-expression-field]")!;
    host.textContent = "Loading mathematical editor…";
    let mountEditableMathField: typeof import("../../math/ui/editableMathField")["mountEditableMathField"];
    try {
      ({ mountEditableMathField } = await (
        options.loadEditableMathField?.() ?? import("../../math/ui/editableMathField")
      ));
    } catch {
      if (isCurrentGeneration(generation, wrap)) {
        host.textContent = "The mathematical editor could not be loaded.";
      }
      return undefined;
    }
    if (!isCurrentGeneration(generation, wrap)) return undefined;
    activeExactExpressionField = mountEditableMathField(host, {
      fieldId: "exact-solution-expression",
      fieldLabel: "Exact solution y of t",
      profile: "exact_solution",
      equationPrefix: { visual: "y(t) =", accessible: "y of t equals" },
      initialConfirmed: persisted.exactExpression.confirmed,
      initialDraftLatex: persisted.exactExpression.draftLatex,
      initialValidation:
        persisted.exactExpression.validationKind === "incomplete" ? "gentle" : "strict",
      description: "Use only t, t₀, and y₀. The exact solution is not used by the numerical solver.",
      onDraftStateChange(snapshot) {
        persisted.exactExpression = persistOptionalMathFieldSnapshot(
          snapshot,
          persisted.exactExpression
        );
        recordTrackedEdit();
        activeExpressionSummary?.render([]);
        onStateChanged?.();
      },
      onLegacyPasteError(error) {
        activeExpressionSummary?.render(
          [{
            fieldId: "exact-solution-expression",
            fieldLabel: "Exact solution y of t",
            message: error.message,
            focus: () => activeExactExpressionField?.focus(),
          }],
          true
        );
      },
    });
    return activeExactExpressionField;
  }

  function requireCurrentExpression(field: EditableMathFieldHandle) {
    const snapshot = field.validateStrict();
    const expression = currentReadyExpression(snapshot);
    if (expression) {
      activeExpressionSummary?.render([]);
      return expression;
    }
    const issue = field.getIssue();
    activeExpressionSummary?.render(issue ? [issue] : [], true);
    activeExpressionSummary?.element.focus();
    return undefined;
  }

  function requireCurrentExpressions(
    rhsField: EditableMathFieldHandle,
    exactField: EditableMathFieldHandle | undefined,
    exactEnabled: boolean
  ): { rhs: MathExpression; exact?: MathExpression } | undefined {
    const rhsSnapshot = rhsField.validateStrict();
    const rhs = currentReadyExpression(rhsSnapshot);
    const exactSnapshot = exactEnabled ? exactField?.validateStrict() : undefined;
    const exact = exactSnapshot ? currentReadyExpression(exactSnapshot) : undefined;
    const issues = [rhsField.getIssue(), exactEnabled ? exactField?.getIssue() : undefined]
      .filter((issue): issue is NonNullable<typeof issue> => Boolean(issue));
    if (!rhs || (exactEnabled && !exact)) {
      activeExpressionSummary?.render(issues, true);
      activeExpressionSummary?.element.focus();
      return undefined;
    }
    activeExpressionSummary?.render([]);
    return { rhs, exact };
  }

  function presetOptionsHtml(): string {
    return PROBLEM_PRESETS.map(
      (preset) => `<option value="${preset.id}">${preset.name}</option>`
    ).join("");
  }

  function currentSingleRunHasUnexecutedEdits(isSecond: boolean): boolean {
    if (!lastResult || !lastResultExpression || !lastProblemInputs) return false;
    if (isSecond) {
      if (lastProblemInputs.kind !== "second_order") return true;
      return (
        persisted.secondExpression.validationKind !== "ready" ||
        persisted.secondExpression.draftLatex !== lastResultExpression.expression.latex ||
        Number(persisted.t0) !== lastProblemInputs.t0 ||
        Number(persisted.tEnd) !== lastProblemInputs.tEnd ||
        Number(persisted.h) !== lastProblemInputs.h ||
        Number(persisted.u0) !== lastProblemInputs.u0 ||
        Number(persisted.v0) !== lastProblemInputs.v0
      );
    }
    if (lastProblemInputs.kind !== "first_order") return true;
    const currentRhs = persisted.firstExpression.confirmed;
    const rhsChanged =
      persisted.firstExpression.validationKind !== "ready" ||
      serializeMathAst(currentRhs.canonicalAst, "rhs") !==
      serializeMathAst(lastResultExpression.expression.canonicalAst, "rhs");
    const currentExact = persisted.exactExpression.confirmed;
    const savedExact = lastResultExpression.exactSolution;
    const exactChanged =
      persisted.exactSolutionEnabled !== lastResultExpression.exactSolutionEnabled ||
      (persisted.exactSolutionEnabled &&
        (persisted.exactExpression.validationKind !== "ready" ||
          !currentExact ||
          !savedExact ||
          serializeMathAst(currentExact.canonicalAst, "exact_solution") !==
          serializeMathAst(savedExact.canonicalAst, "exact_solution")));
    return (
      rhsChanged ||
      exactChanged ||
      presetFormState.presetId !== lastResultExpression.presetId ||
      presetFormState.customizationSourcePresetId !==
      lastResultExpression.customizationSourcePresetId ||
      Number(persisted.t0) !== lastProblemInputs.t0 ||
      Number(persisted.tEnd) !== lastProblemInputs.tEnd ||
      Number(persisted.h) !== lastProblemInputs.h ||
      Number(persisted.y0) !== lastProblemInputs.y0
    );
  }

  function requireFiniteField(value: number, label: string): void {
    if (!Number.isFinite(value)) throw new Error(`${label} must be finite.`);
  }

  const convergenceChartFactory: ConvergenceChartFactory = {
    create: (canvas, configuration) =>
      new Chart(canvas, configuration as unknown as ChartConfiguration),
  };

  function convergenceStateFor(
    snapshot: SuccessfulFirstOrderRunSnapshot
  ): ConvergenceUiState {
    const state = getConvergenceState(convergenceStates, snapshot.runFingerprint);
    const reconciled = reconcileConvergenceUiState(state, snapshot);
    if (reconciled !== state) {
      convergenceStates = setConvergenceState(
        convergenceStates,
        snapshot.runFingerprint,
        reconciled
      );
    }
    return reconciled;
  }

  function storeConvergenceState(
    snapshot: SuccessfulFirstOrderRunSnapshot,
    state: ConvergenceUiState,
    meaningfulInteraction = false
  ): void {
    convergenceStates = setConvergenceState(
      convergenceStates,
      snapshot.runFingerprint,
      state
    );
    if (meaningfulInteraction) markMeaningfulInteraction();
    emitSessionUpdate();
  }

  function convergenceConfig(
    snapshot: SuccessfulFirstOrderRunSnapshot,
    state: ConvergenceUiState,
    allowConsistencyWarning: boolean
  ): ConvergenceStudyConfig | undefined {
    if (!state.preview || !snapshot.exactSolutionEnabled || !snapshot.exactSolution) {
      return undefined;
    }
    return {
      method: snapshot.method,
      rhs: snapshot.rhs,
      exactSolution: snapshot.exactSolution,
      t0: snapshot.t0,
      y0: snapshot.y0,
      tEnd: snapshot.tEnd,
      baseStepSize: Number(state.baseStepSizeDraft),
      refinementLevels: Number(state.refinementLevelsDraft),
      runFingerprint: snapshot.runFingerprint,
      allowConsistencyWarning,
    };
  }

  function controlledConvergenceFailure(error: unknown): ConvergenceStudyFailure {
    if (error instanceof ConvergenceStudyFailure) return error;
    return new ConvergenceStudyFailure(
      "exact_evaluation_failure",
      error instanceof Error
        ? `The convergence study could not run because ${error.message}`
        : "The convergence study could not run because an unexpected evaluation failure occurred."
    );
  }

  function attemptConvergenceStudy(
    snapshot: SuccessfulFirstOrderRunSnapshot,
    allowConsistencyWarning: boolean
  ): void {
    let state = convergenceStateFor(snapshot);
    const fingerprint = currentStudyFingerprint(state);
    try {
      if (!fingerprint) {
        if (state.previewFailure) {
          state = recordConvergenceFailure(state, state.previewFailure);
          storeConvergenceState(snapshot, state);
        }
        return;
      }
      if (allowConsistencyWarning && !canRunConfirmedWarning(state, fingerprint)) {
        throw new ConvergenceStudyFailure(
          "warning_confirmation_required",
          "Confirm the numerical consistency warning for the current study settings before running."
        );
      }
      const config = convergenceConfig(snapshot, state, allowConsistencyWarning);
      if (!config) return;
      const consistencyCheck = checkConvergenceStudyConsistency(config);
      state = setConvergenceConsistency(state, fingerprint, consistencyCheck);
      storeConvergenceState(snapshot, state);
      if (consistencyCheck.status === "warning" && !allowConsistencyWarning) {
        storeConvergenceState(snapshot, requestWarningConfirmation(state, fingerprint));
        return;
      }
      validateConsistencyPermission(consistencyCheck, allowConsistencyWarning);
      const result = runConvergenceStudy(config);
      storeConvergenceState(
        snapshot,
        recordConvergenceSuccess(state, result),
        true
      );
    } catch (error) {
      state = convergenceStateFor(snapshot);
      storeConvergenceState(snapshot, recordConvergenceFailure(
        state,
        controlledConvergenceFailure(error)
      ));
    } finally {
      if (allowConsistencyWarning) {
        state = convergenceStateFor(snapshot);
        storeConvergenceState(snapshot, finishWarningAttempt(state));
      }
    }
  }

  function handleConvergenceIntent(
    snapshot: SuccessfulFirstOrderRunSnapshot,
    intent: ConvergenceStudyIntent
  ): void {
    let state = convergenceStateFor(snapshot);
    switch (intent.type) {
      case "drawer":
        state = setConvergenceDrawerOpen(state, intent.open);
        break;
      case "base_step":
        state = editConvergenceSetup(state, snapshot, { baseStepSizeDraft: intent.value });
        break;
      case "levels":
        state = editConvergenceSetup(state, snapshot, { refinementLevelsDraft: intent.value });
        break;
      case "metric":
        state = setConvergenceMetric(state, intent.metric);
        break;
      case "accordion":
        state = setTeachingAccordion(state, intent.id, intent.open);
        break;
      case "cancel_warning":
        state = cancelWarningConfirmation(state);
        break;
      case "run":
        attemptConvergenceStudy(snapshot, false);
        return;
      case "run_anyway":
        attemptConvergenceStudy(snapshot, true);
        return;
    }
    storeConvergenceState(snapshot, state);
  }

  function renderForm(
    meta: MethodCatalogEntry,
    sel: SelectedMethod,
    glossaryRender: OdeGlossaryRenderTransaction
  ): HTMLElement {
    const formGeneration = uiGeneration;
    const wrap = document.createElement("div");
    wrap.className = "form-wrap";
    const isSecond = meta.mode === "second";
    const fo = firstOrderInputDefaults();
    const so = secondOrderInputDefaults();
    const t0v = isSecond ? so.t0 : fo.t0;
    const tEndv = isSecond ? so.tEnd : fo.tEnd;
    const hv = isSecond ? so.h : fo.h;
    const title = meta.displayName;

    wrap.innerHTML = `
    <div class="form-head">
      <button type="button" class="btn ghost" data-back-methods>← All methods (keep my numbers)</button>
      <h2 data-selected-method-heading>${title}</h2>
      ${lastResult && lastResultExpression ? '<button type="button" class="btn secondary" data-return-output>Return to current output</button>' : ""}
    </div>
    <p class="unrun-edits-note" data-unrun-edits hidden>Your edits have not been run yet.</p>
    <form class="form" id="ode-form">
      ${!isSecond ? orderFieldHtml(meta) : ""}
      ${!isSecond
        ? `
      <section class="preset-panel wide" aria-labelledby="preset-heading">
        <div class="preset-select-row">
          <label class="field" for="problem-preset">
            <span id="preset-heading">Load problem preset</span>
            <select id="problem-preset" data-preset-select>
              <option value="">Choose a preset</option>
              ${presetOptionsHtml()}
            </select>
          </label>
          <button type="button" class="btn ghost" data-undo-preset hidden>Undo preset</button>
        </div>
        <div class="preset-confirmation" data-preset-confirmation hidden>
          <p>Loading this preset will replace the current problem fields.</p>
          <div class="preset-confirmation-actions">
            <button type="button" class="btn ghost" data-cancel-preset>Cancel</button>
            <button type="button" class="btn secondary" data-confirm-preset>Load preset</button>
          </div>
        </div>
        <p class="preset-identity" data-preset-identity></p>
        <div class="preset-guidance" data-preset-guidance hidden>
          <p data-preset-summary></p>
          <p data-preset-observation></p>
          <p data-preset-methods></p>
          <p class="preset-warning" data-preset-warning></p>
          <p data-preset-explicit-guidance hidden></p>
          <div class="preset-math-preview">
            <div><span>Equation</span><div data-preset-rhs-math></div></div>
            <div><span>Exact solution</span><div data-preset-exact-math></div></div>
          </div>
        </div>
      </section>
      `
        : ""
      }
      <label class="field">
        <span>Start time t₀</span>
        <input name="t0" type="number" value="${t0v}" step="any" required />
      </label>
      <label class="field">
        <span>End time</span>
        <input name="tEnd" type="number" value="${tEndv}" step="any" required />
      </label>
      <label class="field">
        <span>Time-step size h</span>
        <input name="h" type="number" value="${hv}" min="1e-9" step="any" required />
      </label>
      ${isSecond
        ? `
      <label class="field">
        <span>Initial position u₀</span>
        <input name="u0" type="number" value="${so.u0}" step="any" required />
      </label>
      <label class="field">
        <span>Initial velocity u′₀</span>
        <input name="v0" type="number" value="${so.v0}" step="any" required />
      </label>
      <div class="field wide" data-expression-field></div>
      `
        : `
      <label class="field">
        <span>Initial value y₀</span>
        <input name="y0" type="number" value="${fo.y0}" step="any" required />
      </label>
      <div class="field wide" data-expression-field></div>
      <label class="exact-solution-switch wide">
        <input type="checkbox" data-exact-solution-toggle ${persisted.exactSolutionEnabled ? "checked" : ""} />
        <span>I know the exact solution</span>
      </label>
      <div class="exact-solution-field wide" data-exact-solution-region ${persisted.exactSolutionEnabled ? "" : "hidden"}>
        <div class="field wide" data-exact-expression-field></div>
        <p class="hint">Optional. Use only t, t₀, and y₀. It is checked for expression validity but does not alter the numerical integration.</p>
      </div>
      `
      }
      <p class="hint">${isSecond
        ? "Examples: −u, −2u, or cos(t) − u."
        : "Examples: −y, t − y, sin(t) − 0.1y, or e raised to t."
      }</p>
      <div class="wide" data-expression-summary></div>
      <div class="actions">
        <button type="submit" class="btn primary">Run simulation</button>
      </div>
      <p class="error" id="form-error" hidden></p>
    </form>
  `;

    if (!isSecond) {
      const guidance = wrap.querySelector<HTMLElement>(
        "[data-preset-guidance]"
      )!;
      const summary = guidance.querySelector<HTMLParagraphElement>(
        "[data-preset-summary]"
      )!;
      const observation = guidance.querySelector<HTMLParagraphElement>(
        "[data-preset-observation]"
      )!;
      const methods = guidance.querySelector<HTMLParagraphElement>(
        "[data-preset-methods]"
      )!;
      const warning = guidance.querySelector<HTMLParagraphElement>(
        "[data-preset-warning]"
      )!;
      const explicit = guidance.querySelector<HTMLParagraphElement>(
        "[data-preset-explicit-guidance]"
      )!;
      const previews = guidance.querySelector<HTMLElement>(
        ".preset-math-preview"
      )!;
      const heading = document.createElement("h3");
      heading.textContent = "Preset guidance";
      const teaching = createTeachingBlock({
        heading,
        lead: summary,
        examples: [observation, methods, explicit, previews],
        limitation: warning,
      });
      teaching.classList.add("ode-preset-teaching");
      guidance.replaceChildren(teaching);
    }

    replaceSelectedMethodHeading(wrap, sel, glossaryRender);
    const hInput = wrap.querySelector<HTMLInputElement>('[name="h"]')!;
    addFieldGlossaryCompanion(
      hInput,
      glossaryRender,
      "ODE-W1-ANN-004",
      "step-size"
    );
    addTimeGridGlossaryHelper(hInput, glossaryRender);
    if (!isSecond) {
      addFieldGlossaryCompanion(
        wrap.querySelector<HTMLInputElement>('[name="y0"]')!,
        glossaryRender,
        "ODE-W1-ANN-003",
        "initial-condition"
      );
      addExactSolutionGlossaryHeading(
        wrap.querySelector<HTMLInputElement>(
          "[data-exact-solution-toggle]"
        )!,
        glossaryRender
      );
    }

    const summaryHost = wrap.querySelector<HTMLElement>("[data-expression-summary]")!;
    activeExpressionSummary = mountExpressionErrorSummary(summaryHost);

    const refreshUnrunNotice = (): void => {
      const note = wrap.querySelector<HTMLElement>("[data-unrun-edits]");
      if (note) note.hidden = !currentSingleRunHasUnexecutedEdits(isSecond);
    };

    const refreshPresetPresentation = (): void => {
      if (isSecond) return;
      const select = wrap.querySelector<HTMLSelectElement>("[data-preset-select]")!;
      const identity = wrap.querySelector<HTMLElement>("[data-preset-identity]")!;
      const undo = wrap.querySelector<HTMLButtonElement>("[data-undo-preset]")!;
      select.value = presetFormState.presetId ?? "";
      undo.hidden = !presetFormState.undoSnapshot;
      const sourceId = presetFormState.presetId ?? presetFormState.customizationSourcePresetId;
      identity.textContent = presetFormState.presetId
        ? `Loaded preset: ${problemPresetById(presetFormState.presetId).name}`
        : presetFormState.customizationSourcePresetId
          ? `Customised from: ${problemPresetById(presetFormState.customizationSourcePresetId).name}`
          : "";
      const guidance = wrap.querySelector<HTMLElement>("[data-preset-guidance]")!;
      guidance.hidden = !sourceId;
      if (!sourceId) return;
      const preset = problemPresetById(sourceId);
      wrap.querySelector<HTMLElement>("[data-preset-summary]")!.textContent = preset.teachingSummary;
      wrap.querySelector<HTMLElement>("[data-preset-observation]")!.textContent =
        `What to observe: ${preset.observationGuidance}`;
      wrap.querySelector<HTMLElement>("[data-preset-methods]")!.textContent =
        `Suggested methods: ${preset.suggestedMethods.map((family) => displayNameFor(family)).join(", ")}.`;
      const warning = wrap.querySelector<HTMLElement>("[data-preset-warning]")!;
      warning.hidden = !preset.warning;
      warning.textContent = preset.warning;
      const explicit = wrap.querySelector<HTMLElement>("[data-preset-explicit-guidance]")!;
      explicit.hidden = !preset.explicitStepGuidance;
      explicit.textContent = preset.explicitStepGuidance ?? "";
      const rhsMath = wrap.querySelector<HTMLElement>("[data-preset-rhs-math]")!;
      const exactMath = wrap.querySelector<HTMLElement>("[data-preset-exact-math]")!;
      renderReadonlyMath(rhsMath, {
        latex: `y'=${preset.rhs.latex}`,
        displayText: `y prime equals ${preset.rhs.displayText}`,
        ariaLabel: `y prime equals ${preset.rhs.displayText}`,
      });
      renderReadonlyMath(exactMath, {
        latex: `y(t)=${preset.exactSolution.latex}`,
        displayText: `y of t equals ${preset.exactSolution.displayText}`,
        ariaLabel: `y of t equals ${preset.exactSolution.displayText}`,
      });
    };

    const expressionField = mountProductionExpressionField(
      wrap,
      isSecond ? "second_order_rhs" : "rhs",
      () => {
        refreshPresetPresentation();
        refreshUnrunNotice();
      }
    );
    const exactExpressionField = isSecond
      ? Promise.resolve(undefined)
      : mountExactSolutionField(wrap, () => {
        refreshPresetPresentation();
        refreshUnrunNotice();
      });

    const syncTrackedFormFields = (meaningfulInteraction = true): void => {
      if (isSecond) return;
      const form = wrap.querySelector<HTMLFormElement>("#ode-form")!;
      persistFromFirstOrderFd(new FormData(form));
      persisted.exactSolutionEnabled =
        wrap.querySelector<HTMLInputElement>("[data-exact-solution-toggle]")!.checked;
      recordTrackedEdit(meaningfulInteraction);
    };

    const applyPresetStateToUi = async (): Promise<void> => {
      if (isSecond) return;
      applyTrackedFields(presetFormState.current);
      const form = wrap.querySelector<HTMLFormElement>("#ode-form")!;
      for (const [name, value] of [
        ["t0", persisted.t0],
        ["tEnd", persisted.tEnd],
        ["h", persisted.h],
        ["y0", persisted.y0],
      ] as const) {
        form.querySelector<HTMLInputElement>(`[name="${name}"]`)!.value = value;
      }
      const toggle = wrap.querySelector<HTMLInputElement>("[data-exact-solution-toggle]")!;
      toggle.checked = persisted.exactSolutionEnabled;
      wrap.querySelector<HTMLElement>("[data-exact-solution-region]")!.hidden = !toggle.checked;
      const [rhsHandle, exactHandle] = await Promise.all([expressionField, exactExpressionField]);
      if (!isCurrentGeneration(formGeneration, wrap)) return;
      rhsHandle?.restoreState(
        persisted.firstExpression.draftLatex,
        persisted.firstExpression.confirmed,
        persisted.firstExpression.validationKind === "incomplete" ? "gentle" : "strict"
      );
      exactHandle?.restoreState(
        persisted.exactExpression.draftLatex,
        persisted.exactExpression.confirmed,
        persisted.exactExpression.validationKind === "incomplete" ? "gentle" : "strict"
      );
      activeExpressionSummary?.render([]);
      refreshPresetPresentation();
      refreshUnrunNotice();
      recordTrackedEdit(false);
    };

    if (!isSecond) {
      let pendingPresetId: ProblemPresetId | undefined;
      const confirmation = wrap.querySelector<HTMLElement>("[data-preset-confirmation]")!;
      const select = wrap.querySelector<HTMLSelectElement>("[data-preset-select]")!;
      select.addEventListener("change", () => {
        if (!select.value) return;
        syncTrackedFormFields(false);
        pendingPresetId = select.value as ProblemPresetId;
        if (isPresetFormDirty(presetFormState)) {
          confirmation.hidden = false;
          select.value = presetFormState.presetId ?? "";
          return;
        }
        presetFormState = loadProblemPreset(presetFormState, pendingPresetId);
        pendingPresetId = undefined;
        markMeaningfulInteraction();
        void applyPresetStateToUi();
      });
      wrap.querySelector("[data-cancel-preset]")!.addEventListener("click", () => {
        pendingPresetId = undefined;
        confirmation.hidden = true;
        select.value = presetFormState.presetId ?? "";
      });
      wrap.querySelector("[data-confirm-preset]")!.addEventListener("click", () => {
        if (!pendingPresetId) return;
        presetFormState = loadProblemPreset(presetFormState, pendingPresetId);
        pendingPresetId = undefined;
        confirmation.hidden = true;
        markMeaningfulInteraction();
        void applyPresetStateToUi();
      });
      wrap.querySelector("[data-undo-preset]")!.addEventListener("click", () => {
        presetFormState = undoProblemPreset(presetFormState);
        markMeaningfulInteraction();
        void applyPresetStateToUi();
      });
      const exactToggle = wrap.querySelector<HTMLInputElement>("[data-exact-solution-toggle]")!;
      exactToggle.addEventListener("change", () => {
        persisted.exactSolutionEnabled = exactToggle.checked;
        recordTrackedEdit();
        wrap.querySelector<HTMLElement>("[data-exact-solution-region]")!.hidden = !exactToggle.checked;
        activeExpressionSummary?.render([]);
        refreshPresetPresentation();
        refreshUnrunNotice();
      });
      for (const input of wrap.querySelectorAll<HTMLInputElement>(
        '[name="t0"], [name="tEnd"], [name="h"], [name="y0"], [name="order"]'
      )) {
        input.addEventListener("input", () => {
          if (input.name === "order" && selected) {
            selected = { ...selected, order: Number(input.value) };
          }
          syncTrackedFormFields();
          refreshPresetPresentation();
          refreshUnrunNotice();
        });
      }
      refreshPresetPresentation();
    } else {
      for (const input of wrap.querySelectorAll<HTMLInputElement>(
        '[name="t0"], [name="tEnd"], [name="h"], [name="u0"], [name="v0"]'
      )) {
        input.addEventListener("input", () => {
          persistFromSecondOrderFd(
            new FormData(wrap.querySelector<HTMLFormElement>("#ode-form")!)
          );
          refreshUnrunNotice();
          markMeaningfulInteraction();
          emitSessionUpdate();
        });
      }
    }
    refreshUnrunNotice();

    wrap.querySelector("[data-return-output]")?.addEventListener("click", () => {
      const form = wrap.querySelector<HTMLFormElement>("#ode-form")!;
      readPersistedFromFormEl(form);
      if (!isSecond) {
        persisted.exactSolutionEnabled =
          wrap.querySelector<HTMLInputElement>("[data-exact-solution-toggle]")!.checked;
        recordTrackedEdit(false);
      }
      step = "results";
      render();
    });

    wrap.querySelector("[data-back-methods]")!.addEventListener("click", () => {
      const form = wrap.querySelector<HTMLFormElement>("#ode-form");
      if (form) readPersistedFromFormEl(form);
      step = "choose";
      selected = null;
      lastResult = null;
      lastResultExpression = null;
      lastCompare = null;
      lastProblemInputs = null;
      lastFirstOrderRunSnapshot = null;
      session = { mode: "single" };
      markMeaningfulInteraction();
      render();
    });

    wrap.querySelector("#ode-form")!.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const form = ev.target as HTMLFormElement;
      const err = wrap.querySelector<HTMLParagraphElement>("#form-error")!;
      err.hidden = true;
      try {
        const fd = new FormData(form);
        const t0 = Number(fd.get("t0"));
        const tEnd = Number(fd.get("tEnd"));
        const h = Number(fd.get("h"));
        validateFixedStepGrid(t0, tEnd, h);
        if (isSecond) {
          requireFiniteField(Number(fd.get("u0")), "Initial position u₀");
          requireFiniteField(Number(fd.get("v0")), "Initial velocity u′₀");
        } else {
          requireFiniteField(Number(fd.get("y0")), "Initial value y₀");
        }
        const mountedExpressionField = await expressionField;
        if (!isCurrentGeneration(formGeneration, wrap)) return;
        if (!mountedExpressionField) {
          throw new Error("The mathematical editor is not available. Return to Step 2 and try again.");
        }
        let expression: MathExpression;
        let exactExpression: MathExpression | undefined;
        if (isSecond) {
          const ready = requireCurrentExpression(mountedExpressionField);
          if (!ready) return;
          expression = ready;
        } else {
          persistFromFirstOrderFd(fd);
          persisted.exactSolutionEnabled =
            wrap.querySelector<HTMLInputElement>("[data-exact-solution-toggle]")!.checked;
          recordTrackedEdit(false);
          const mountedExactField = await exactExpressionField;
          if (!isCurrentGeneration(formGeneration, wrap)) return;
          if (persisted.exactSolutionEnabled && !mountedExactField) {
            throw new Error("The exact-solution editor is not available. Return to Step 2 and try again.");
          }
          const ready = requireCurrentExpressions(
            mountedExpressionField,
            mountedExactField,
            persisted.exactSolutionEnabled
          );
          if (!ready) return;
          expression = ready.rhs;
          exactExpression = ready.exact;
        }

        let result: SolverResult;
        if (isSecond) {
          persistFromSecondOrderFd(fd);
          const u0 = Number(fd.get("u0"));
          const v0 = Number(fd.get("v0"));
          const a = compileProductionExpression(expression, "second_order_rhs");
          result = integrateSecondOrder({ t0, u0, v0, tEnd, h, a });
        } else {
          const y0 = Number(fd.get("y0"));
          const order = Number(fd.get("order"));
          const configuredSelection = { ...sel, order };
          selected = configuredSelection;
          const f = compileProductionExpression(expression, "rhs");
          result = integrateFirstOrder(configFromSelection(configuredSelection), {
            t0,
            y0,
            tEnd,
            h,
            f,
          });
        }

        const expressionSnapshot = createSuccessfulExpressionSnapshot(
          expression,
          isSecond ? "second_order_rhs" : "rhs",
          isSecond
            ? {}
            : {
              exactSolutionEnabled: persisted.exactSolutionEnabled,
              exactSolution: exactExpression,
              presetId: presetFormState.presetId,
              customizationSourcePresetId: presetFormState.customizationSourcePresetId,
            }
        );
        const readonlyResult = createReadonlySolverResult(result);
        lastCompare = null;
        lastResult = readonlyResult;
        lastResultExpression = expressionSnapshot;
        if (isSecond) {
          lastFirstOrderRunSnapshot = null;
        } else {
          lastFirstOrderRunSnapshot = createSuccessfulFirstOrderRunSnapshot({
            metadata: result.metadata,
            rhs: expressionSnapshot.expression,
            exactSolutionEnabled: expressionSnapshot.exactSolutionEnabled,
            exactSolution: expressionSnapshot.exactSolution,
            t0,
            y0: Number(fd.get("y0")),
            tEnd,
            runStepSize: h,
            presetId: expressionSnapshot.presetId,
            customizationSourcePresetId: expressionSnapshot.customizationSourcePresetId,
          });
          storeConvergenceState(
            lastFirstOrderRunSnapshot,
            reconcileConvergenceUiState(
              getConvergenceState(
                convergenceStates,
                lastFirstOrderRunSnapshot.runFingerprint
              ),
              lastFirstOrderRunSnapshot
            )
          );
        }
        lastProblemInputs = isSecond
          ? {
            kind: "second_order",
            equationDisplay: expressionSnapshot.equationDisplay,
            t0,
            tEnd,
            h,
            u0: Number(fd.get("u0")),
            v0: Number(fd.get("v0")),
          }
          : {
            kind: "first_order",
            equationDisplay: expressionSnapshot.equationDisplay,
            t0,
            tEnd,
            h,
            y0: Number(fd.get("y0")),
          };
        markMeaningfulInteraction();
        tutorBindingControl.requestConversationReset();
        step = "results";
        render();
        focusPrimaryResultAfterRender();
      } catch (e) {
        err.textContent = e instanceof Error ? e.message : String(e);
        err.hidden = false;
      }
    });

    return wrap;
  }

  function renderCompareForm(
    metaA: MethodCatalogEntry,
    metaB: MethodCatalogEntry,
    selA: SelectedMethod,
    selB: SelectedMethod,
    glossaryRender: OdeGlossaryRenderTransaction
  ): HTMLElement {
    const formGeneration = uiGeneration;
    const wrap = document.createElement("div");
    wrap.className = "form-wrap";
    const fo = firstOrderInputDefaults();

    wrap.innerHTML = `
    <div class="form-head">
      <button type="button" class="btn ghost" data-back-methods>← Change method pair</button>
      <h2>Compare: ${metaA.displayName} vs ${metaB.displayName}</h2>
      ${lastCompare ? '<button type="button" class="btn secondary" data-return-output>Return to current output</button>' : ""}
    </div>
    <p class="hint">Set order p for each multistep method before running (defaults from method cards).</p>
    <form class="form" id="ode-form">
      <label class="field">
        <span>Order p — ${metaA.displayName}</span>
        <input name="orderA" type="number" min="${metaA.orderMin ?? 1}" max="${metaA.orderMax ?? 8}" value="${selA.order ?? metaA.orderDefault ?? 2}" ${metaA.hasOrderSelector ? "required" : "disabled"} />
      </label>
      <label class="field">
        <span>Order p — ${metaB.displayName}</span>
        <input name="orderB" type="number" min="${metaB.orderMin ?? 1}" max="${metaB.orderMax ?? 8}" value="${selB.order ?? metaB.orderDefault ?? 2}" ${metaB.hasOrderSelector ? "required" : "disabled"} />
      </label>
      <label class="field">
        <span>Start time t₀</span>
        <input name="t0" type="number" value="${fo.t0}" step="any" required />
      </label>
      <label class="field">
        <span>End time</span>
        <input name="tEnd" type="number" value="${fo.tEnd}" step="any" required />
      </label>
      <label class="field">
        <span>Time-step size h</span>
        <input name="h" type="number" value="${fo.h}" min="1e-9" step="any" required />
      </label>
      <label class="field">
        <span>Initial value y₀</span>
        <input name="y0" type="number" value="${fo.y0}" step="any" required />
      </label>
      <div class="field wide" data-expression-field></div>
      <p class="hint">The same right-hand side is used by both methods.</p>
      <div class="wide" data-expression-summary></div>
      <p class="hint multistep-note">For multistep methods, startup values are generated by Runge-Kutta 4.</p>
      <div class="actions">
        <button type="submit" class="btn primary">Run comparison</button>
      </div>
      <p class="error" id="form-error" hidden></p>
    </form>
  `;

    const hInput = wrap.querySelector<HTMLInputElement>('[name="h"]')!;
    addFieldGlossaryCompanion(
      hInput,
      glossaryRender,
      "ODE-W1-ANN-004",
      "step-size"
    );
    addTimeGridGlossaryHelper(hInput, glossaryRender);

    activeExpressionSummary = mountExpressionErrorSummary(
      wrap.querySelector<HTMLElement>("[data-expression-summary]")!
    );
    const expressionField = mountProductionExpressionField(wrap, "rhs");

    for (const input of wrap.querySelectorAll<HTMLInputElement>(
      '[name="orderA"], [name="orderB"], [name="t0"], [name="tEnd"], [name="h"], [name="y0"]'
    )) {
      input.addEventListener("input", () => {
        const formData = new FormData(
          wrap.querySelector<HTMLFormElement>("#ode-form")!
        );
        persistFromFirstOrderFd(formData);
        if (session.mode === "compare") {
          session = {
            mode: "compare",
            a: {
              ...session.a,
              order: metaA.hasOrderSelector
                ? Number(formData.get("orderA"))
                : session.a.order,
            },
            b: {
              ...session.b,
              order: metaB.hasOrderSelector
                ? Number(formData.get("orderB"))
                : session.b.order,
            },
          };
        }
        recordTrackedEdit();
      });
    }

    wrap.querySelector("[data-return-output]")?.addEventListener("click", () => {
      const form = wrap.querySelector<HTMLFormElement>("#ode-form")!;
      persistFromFirstOrderFd(new FormData(form));
      recordTrackedEdit(false);
      step = "results";
      render();
    });

    wrap.querySelector("[data-back-methods]")!.addEventListener("click", () => {
      const form = wrap.querySelector<HTMLFormElement>("#ode-form");
      if (form) {
        persistFromFirstOrderFd(new FormData(form));
        recordTrackedEdit(false);
      }
      step = "choose";
      lastCompare = null;
      lastResult = null;
      lastResultExpression = null;
      lastProblemInputs = null;
      lastFirstOrderRunSnapshot = null;
      session = { mode: "compare_pick", first: null };
      markMeaningfulInteraction();
      render();
    });

    wrap.querySelector("#ode-form")!.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const form = ev.target as HTMLFormElement;
      const err = wrap.querySelector<HTMLParagraphElement>("#form-error")!;
      err.hidden = true;
      if (session.mode !== "compare") return;
      try {
        const fd = new FormData(form);
        persistFromFirstOrderFd(fd);
        recordTrackedEdit(false);
        const t0 = Number(fd.get("t0"));
        const tEnd = Number(fd.get("tEnd"));
        const h = Number(fd.get("h"));
        const y0 = Number(fd.get("y0"));
        validateFixedStepGrid(t0, tEnd, h);
        requireFiniteField(y0, "Initial value y₀");
        const mountedExpressionField = await expressionField;
        if (!isCurrentGeneration(formGeneration, wrap)) return;
        if (!mountedExpressionField) {
          throw new Error("The mathematical editor is not available. Return to Step 2 and try again.");
        }
        const expression = requireCurrentExpression(mountedExpressionField);
        if (!expression) return;
        const f = compileProductionExpression(expression, "rhs");

        const a: SelectedMethod = {
          ...session.a,
          order: metaA.hasOrderSelector
            ? Number(fd.get("orderA"))
            : typeof metaA.orderOfAccuracy === "number"
              ? metaA.orderOfAccuracy
              : undefined,
        };
        const b: SelectedMethod = {
          ...session.b,
          order: metaB.hasOrderSelector
            ? Number(fd.get("orderB"))
            : typeof metaB.orderOfAccuracy === "number"
              ? metaB.orderOfAccuracy
              : undefined,
        };

        const base = { t0, y0, tEnd, h, f };
        const resultA = integrateFirstOrder(configFromSelection(a), base);
        const resultB = integrateFirstOrder(configFromSelection(b), base);
        const expressionSnapshot = createSuccessfulExpressionSnapshot(expression, "rhs");
        session = { mode: "compare", a, b };
        lastResult = null;
        lastResultExpression = null;
        lastProblemInputs = null;
        lastFirstOrderRunSnapshot = null;
        lastCompare = {
          a,
          b,
          resultA: createReadonlySolverResult(resultA),
          resultB: createReadonlySolverResult(resultB),
          expression: expressionSnapshot,
        };
        markMeaningfulInteraction();
        tutorBindingControl.requestConversationReset();
        step = "results";
        render();
        focusPrimaryResultAfterRender();
      } catch (e) {
        err.textContent = e instanceof Error ? e.message : String(e);
        err.hidden = false;
      }
    });

    return wrap;
  }

  function goToMethodListKeepInputs(): void {
    step = "choose";
    selected = null;
    lastResult = null;
    lastResultExpression = null;
    lastCompare = null;
    lastProblemInputs = null;
    lastFirstOrderRunSnapshot = null;
    session = { mode: "single" };
    markMeaningfulInteraction();
    render();
  }

  function formatImplicitResidual(value: number): string {
    if (value === 0) return "0";
    const magnitude = Math.abs(value);
    if (magnitude < 1e-4 || magnitude >= 1e4) {
      return value.toExponential(3);
    }
    return value.toPrecision(6);
  }

  function createHeading(
    level: 2 | 3 | 4,
    text: string
  ): HTMLHeadingElement {
    const heading = document.createElement(`h${level}`) as HTMLHeadingElement;
    heading.textContent = text;
    return heading;
  }

  function createMetricsList(
    entries: readonly { readonly label: string; readonly value: string }[],
    className?: string
  ): HTMLDListElement {
    const list = document.createElement("dl");
    if (className) list.className = className;
    for (const entry of entries) {
      const item = document.createElement("div");
      const term = document.createElement("dt");
      term.textContent = entry.label;
      const value = document.createElement("dd");
      value.textContent = entry.value;
      item.append(term, value);
      list.append(item);
    }
    return list;
  }

  function formatContextNumber(value: number): string {
    return Number.isInteger(value)
      ? String(value)
      : String(Number(value.toPrecision(12)));
  }

  function createSingleProblemContext(
    expression: SuccessfulExpressionSnapshot,
    inputs: OdeProblemInputs
  ): HTMLElement {
    const statement = document.createElement("div");
    renderReadonlyMath(statement, expression.equation, { display: "block" });
    const parameters =
      inputs.kind === "first_order"
        ? [
          { label: "Start time t₀", value: formatContextNumber(inputs.t0) },
          { label: "End time", value: formatContextNumber(inputs.tEnd) },
          { label: "Time-step size h", value: formatContextNumber(inputs.h) },
          { label: "Initial value y₀", value: formatContextNumber(inputs.y0!) },
        ]
        : [
          { label: "Start time t₀", value: formatContextNumber(inputs.t0) },
          { label: "End time", value: formatContextNumber(inputs.tEnd) },
          { label: "Time-step size h", value: formatContextNumber(inputs.h) },
          {
            label: "Initial position u₀",
            value: formatContextNumber(inputs.u0!),
          },
          {
            label: "Initial velocity u′₀",
            value: formatContextNumber(inputs.v0!),
          },
        ];
    return createProblemContext({
      heading: createHeading(3, "Problem context"),
      statement,
      parameters,
    });
  }

  function createComparisonProblemContext(
    expression: SuccessfulExpressionSnapshot,
    series: readonly SeriesPoint[]
  ): HTMLElement {
    const first = series[0]!;
    const last = series[series.length - 1]!;
    const stepSize = series.length > 1 ? series[1]!.t - first.t : 0;
    const statement = document.createElement("div");
    renderReadonlyMath(statement, expression.equation, { display: "block" });
    return createProblemContext({
      heading: createHeading(3, "Shared problem context"),
      statement,
      parameters: [
        { label: "Start time t₀", value: formatContextNumber(first.t) },
        { label: "End time", value: formatContextNumber(last.t) },
        { label: "Time-step size h", value: formatContextNumber(stepSize) },
        { label: "Initial value y₀", value: formatContextNumber(first.y) },
      ],
    });
  }

  function createMethodEvidence(
    meta: ReadonlySolverResult["metadata"]
  ): HTMLElement {
    const metrics = createMetricsList(
      [
        { label: "Method", value: meta.displayName },
        { label: "Theoretical order p", value: String(meta.order) },
        { label: "Type", value: meta.isImplicit ? "Implicit" : "Explicit" },
        ...(meta.startupMethod
          ? [{ label: "Startup", value: meta.startupMethod }]
          : []),
      ],
      "meta-dl ode-metric-dl"
    );
    const block = createEvidenceBlock({
      level: "standard",
      heading: createHeading(3, "Method details"),
      metrics,
    });
    block.classList.add("ode-method-evidence");

    const diagnostics = meta.implicitDiagnostics;
    if (diagnostics) {
      const solverName =
        diagnostics.nonlinearMethod === "fixed_point" ? "Fixed-point" : "Newton";
      const diagnosticsList = createMetricsList(
        [
          { label: "Nonlinear solver", value: solverName },
          {
            label: "Total nonlinear iterations",
            value: String(diagnostics.totalIterations),
          },
          {
            label: "Maximum iterations in one step",
            value: String(diagnostics.maxIterationsPerStep),
          },
          {
            label: "Final residual",
            value: formatImplicitResidual(diagnostics.finalResidual),
          },
          {
            label: "Maximum residual",
            value: formatImplicitResidual(diagnostics.maxResidual),
          },
          { label: "Failed steps", value: String(diagnostics.failedSteps) },
        ],
        "meta-dl ode-metric-dl implicit-diagnostics"
      );
      const note = document.createElement("p");
      note.className = "implicit-diagnostics-note";
      note.textContent =
        "Nonlinear-solver convergence is different from absolute stability of the numerical method. A stable implicit scheme can still fail if its nonlinear equation is not solved successfully.";
      block.append(
        createHeading(4, "Implicit solve diagnostics"),
        diagnosticsList,
        note
      );
    }

    const formula = document.createElement("div");
    formula.className = "formula-block";
    formula.dataset.methodFormula = "true";
    formula.textContent = meta.formulaDisplay;
    block.append(createHeading(4, "Formula"), formula);

    const coeffText = formatCoefficients(
      meta.coefficients?.alpha,
      meta.coefficients?.beta
    );
    if (coeffText) {
      const coefficients = document.createElement("div");
      coefficients.className = "formula-inline";
      coefficients.textContent = coeffText;
      block.append(createHeading(4, "Coefficients"), coefficients);
    }
    if (meta.notes.length) {
      const notes = document.createElement("ul");
      notes.className = "edu-notes";
      for (const note of meta.notes) {
        const item = document.createElement("li");
        item.textContent = note;
        notes.append(item);
      }
      block.append(createHeading(4, "Notes"), notes);
    }
    return block;
  }

  function createChartEvidence(): HTMLElement {
    const frame = document.createElement("div");
    frame.className = "ode-chart-frame";
    const canvas = document.createElement("canvas");
    canvas.id = "plot";
    canvas.height = 120;
    canvas.setAttribute("aria-label", "Numerical approximation vs time chart");
    frame.append(canvas);
    return createEvidenceBlock({
      level: "standard",
      heading: createHeading(3, "Numerical approximation vs time"),
      chart: frame,
    });
  }

  function createSingleValuesEvidence(
    series: readonly SeriesPoint[],
    mode: "first" | "second"
  ): HTMLElement {
    const table = createNumericalTable({
      caption: "Last 12 values",
      rowHeader: "t",
      columns: [
        { label: mode === "second" ? "u" : "y", numeric: true },
        ...(mode === "second" ? [{ label: "u′", numeric: true }] : []),
      ],
      rows: series.slice(-12).map((point) => ({
        label: point.t.toFixed(5),
        cells: [
          point.y.toFixed(8),
          ...(mode === "second" ? [point.v?.toFixed(8) ?? ""] : []),
        ],
      })),
    });
    table.classList.add("ode-values-table");
    return createEvidenceBlock({
      level: "standard",
      heading: createHeading(3, "Stored values"),
      numericalTable: table,
    });
  }

  function createCompareValuesEvidence(
    seriesA: readonly SeriesPoint[],
    seriesB: readonly SeriesPoint[],
    metaA: ReadonlySolverResult["metadata"],
    metaB: ReadonlySolverResult["metadata"]
  ): HTMLElement {
    const tailA = seriesA.slice(-12);
    const offset = seriesA.length - tailA.length;
    const table = createNumericalTable({
      caption: "Last 12 stored grid points (both methods)",
      rowHeader: "t",
      columns: [
        { label: `y — ${metaA.displayName}`, numeric: true },
        { label: `y — ${metaB.displayName}`, numeric: true },
        { label: "|Δy|", numeric: true },
      ],
      rows: tailA.map((pointA, index) => {
        const pointB = seriesB[offset + index]!;
        return {
          label: pointA.t.toFixed(5),
          cells: [
            pointA.y.toFixed(8),
            pointB.y.toFixed(8),
            Math.abs(pointA.y - pointB.y).toExponential(4),
          ],
        };
      }),
    });
    table.classList.add("ode-values-table");
    return createEvidenceBlock({
      level: "standard",
      heading: createHeading(3, "Stored comparison values"),
      numericalTable: table,
    });
  }

  function focusPrimaryResultAfterRender(): void {
    const focusGeneration = uiGeneration;
    queueMicrotask(() => {
      if (!isCurrentGeneration(focusGeneration)) return;
      const heading = app.querySelector<HTMLElement>(
        ".lab-primary-result-heading"
      );
      try {
        heading?.focus({ preventScroll: true });
      } catch {
        heading?.focus();
      }
    });
  }

  function renderMethodFormulas(
    container: Element,
    methods: Array<Pick<MethodCatalogEntry, "family" | "formulaDisplay">>
  ): void {
    container.querySelectorAll<HTMLElement>("[data-method-formula]").forEach((target, index) => {
      const formula = methods[index] ? methodMathContent(methods[index]!).formula : undefined;
      if (formula) renderReadonlyMath(target, formula, { display: "block" });
    });
  }

  function renderResultsShell(
    meta: MethodCatalogEntry,
    result: ReadonlySolverResult,
    expression: SuccessfulExpressionSnapshot,
    problemInputs: OdeProblemInputs,
    glossaryRender: OdeGlossaryRenderTransaction
  ): HTMLElement {
    const generation = uiGeneration;
    const wrap = document.createElement("div");
    wrap.className = "results-wrap";
    wrap.innerHTML = `
    <div class="form-head">
      <button type="button" class="btn ghost" data-back>← Edit inputs</button>
      <button type="button" class="btn ghost" data-methods>All methods (keep my numbers)</button>
    </div>
    <div class="results-main" id="results-body"></div>
  `;
    wrap.querySelector("[data-back]")!.addEventListener("click", () => {
      step = "configure";
      render();
    });
    wrap.querySelector("[data-methods]")!.addEventListener("click", () => {
      goToMethodListKeepInputs();
    });
    queueMicrotask(() => {
      if (!isCurrentGeneration(generation, wrap)) {
        glossaryRender.abort();
        return;
      }
      try {
        mountResults(
          meta,
          result,
          expression,
          problemInputs,
          glossaryRender
        );
        glossaryRender.commitOutputScope();
      } catch (cause) {
        glossaryRender.abort();
        throw cause;
      }
    });
    return wrap;
  }

  function renderCompareResultsShell(
    metaA: MethodCatalogEntry,
    metaB: MethodCatalogEntry,
    resultA: ReadonlySolverResult,
    resultB: ReadonlySolverResult,
    expression: SuccessfulExpressionSnapshot,
    glossaryRender: OdeGlossaryRenderTransaction
  ): HTMLElement {
    const generation = uiGeneration;
    const wrap = document.createElement("div");
    wrap.className = "results-wrap";
    wrap.innerHTML = `
    <div class="form-head">
      <button type="button" class="btn ghost" data-back>← Edit inputs</button>
      <button type="button" class="btn ghost" data-pair>Change method pair</button>
      <button type="button" class="btn ghost" data-methods>All methods (keep my numbers)</button>
    </div>
    <div class="results-main" id="results-body"></div>
  `;
    wrap.querySelector("[data-back]")!.addEventListener("click", () => {
      step = "configure";
      render();
    });
    wrap.querySelector("[data-pair]")!.addEventListener("click", () => {
      step = "choose";
      lastCompare = null;
      lastResult = null;
      lastResultExpression = null;
      lastProblemInputs = null;
      lastFirstOrderRunSnapshot = null;
      session = { mode: "compare_pick", first: null };
      render();
    });
    wrap.querySelector("[data-methods]")!.addEventListener("click", () => {
      goToMethodListKeepInputs();
    });
    queueMicrotask(() => {
      if (!isCurrentGeneration(generation, wrap)) {
        glossaryRender.abort();
        return;
      }
      try {
        mountCompareResults(metaA, metaB, resultA, resultB, expression);
        glossaryRender.commitOutputScope();
      } catch (cause) {
        glossaryRender.abort();
        throw cause;
      }
    });
    return wrap;
  }

  function mountResults(
    meta: MethodCatalogEntry,
    result: ReadonlySolverResult,
    expression: SuccessfulExpressionSnapshot,
    problemInputs: OdeProblemInputs,
    glossaryRender: OdeGlossaryRenderTransaction
  ): void {
    const body = app.querySelector("#results-body");
    if (!body) return;

    const series = result.points;
    const last = series[series.length - 1]!;
    const resultHeading = createHeading(
      2,
      `${result.metadata.displayName} · results`
    );
    resultHeading.tabIndex = -1;
    resultHeading.dataset.resultFocus = "true";
    const answerLabel = document.createElement("p");
    answerLabel.dataset.finalNumericalApproximation = "true";
    answerLabel.append(glossaryTermNode(glossaryRender, "ODE-W1-ANN-006"));
    const answerValue = document.createElement("span");
    answerValue.className = "ode-primary-numeric-value";
    answerValue.textContent = last.y.toFixed(8);
    const metrics = createMetricsList([
      { label: "Grid points stored", value: String(series.length) },
      { label: "Final time", value: last.t.toFixed(6) },
      ...(meta.mode === "second" && last.v !== undefined
        ? [{ label: "Final u′", value: last.v.toFixed(8) }]
        : []),
    ]);
    const primary = createPrimaryResult({
      heading: resultHeading,
      problemContext: createSingleProblemContext(expression, problemInputs),
      primaryAnswer: { label: answerLabel, content: answerValue },
      metrics,
    });
    const convergenceHost = document.createElement("div");
    convergenceHost.dataset.convergenceStudyHost = "true";
    const content: Node[] = [primary, createMethodEvidence(result.metadata)];
    if (meta.mode === "first") content.push(convergenceHost);
    content.push(
      createChartEvidence(),
      createSingleValuesEvidence(series, meta.mode)
    );
    body.replaceChildren(...content);

    renderMethodFormulas(body, [meta]);

    if (convergenceHost && lastFirstOrderRunSnapshot) {
      const snapshot = lastFirstOrderRunSnapshot;
      const eligibility = convergenceEligibility({ kind: "first_order", snapshot });
      if (eligibility.showDrawer) {
        convergenceStateFor(snapshot);
        activeConvergenceView = mountConvergenceStudyView(convergenceHost, {
          snapshot,
          getState: () => convergenceStateFor(snapshot),
          onIntent: (intent) => handleConvergenceIntent(snapshot, intent),
          chartFactory: convergenceChartFactory,
        });
      }
    }

    drawSingleChart(meta, series);
  }

  function drawSingleChart(
    meta: MethodCatalogEntry,
    series: readonly SeriesPoint[]
  ): void {
    const canvas = app.querySelector<HTMLCanvasElement>("#plot");
    if (!canvas) return;
    chart?.destroy();
    const ts = series.map((p) => p.t.toFixed(3));
    const ys = series.map((p) => p.y);
    const valueLabel = meta.mode === "second" ? "u" : "y";
    const theme = resolveNumericalChartTheme();

    const datasets =
      meta.mode === "second" && series.some((p) => p.v !== undefined)
        ? [
          {
            label: "u(t)",
            data: ys,
            borderColor: theme.primary,
            tension: 0.15,
            fill: false,
            pointRadius: 0,
          },
          {
            label: "u′(t)",
            data: series.map((p) => p.v ?? NaN),
            borderColor: theme.secondary,
            tension: 0.15,
            fill: false,
            pointRadius: 0,
          },
        ]
        : [
          {
            label: `${valueLabel}(t)`,
            data: ys,
            borderColor: theme.primary,
            backgroundColor: theme.fill,
            tension: 0.15,
            fill: true,
            pointRadius: 0,
          },
        ];

    chart = new Chart(canvas, {
      type: "line",
      data: { labels: ts, datasets },
      options: chartOptions(series, meta.mode === "second" ? "u , u′" : valueLabel),
    });
    primaryChartKind = meta.mode === "second" ? "second" : "single";
  }

  function chartOptions(
    series: readonly SeriesPoint[],
    yTitle: string
  ): object {
    const theme = resolveNumericalChartTheme();
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: theme.text } },
        title: {
          display: true,
          text: "Numerical approximation vs time",
          color: theme.text,
          font: { size: 16, weight: "600" },
        },
        tooltip: {
          backgroundColor: theme.tooltipBackground,
          titleColor: theme.tooltipText,
          bodyColor: theme.tooltipText,
          borderColor: theme.tooltipBorder,
          borderWidth: 1,
          callbacks: {
            title: (items: { dataIndex?: number }[]) => {
              const i = items[0]?.dataIndex ?? 0;
              return `t = ${series[i]?.t.toFixed(6)}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: "t", color: theme.muted },
          ticks: { color: theme.muted, maxTicksLimit: 8 },
          grid: { color: theme.grid },
        },
        y: {
          title: { display: true, text: yTitle, color: theme.muted },
          ticks: { color: theme.muted },
          grid: { color: theme.grid },
        },
      },
    };
  }

  function mountCompareResults(
    metaA: MethodCatalogEntry,
    metaB: MethodCatalogEntry,
    resultA: ReadonlySolverResult,
    resultB: ReadonlySolverResult,
    expression: SuccessfulExpressionSnapshot
  ): void {
    const body = app.querySelector("#results-body");
    if (!body) return;

    const seriesA = resultA.points;
    const seriesB = resultB.points;
    const la = seriesA[seriesA.length - 1]!;
    const lb = seriesB[seriesB.length - 1]!;
    const diff = Math.abs(la.y - lb.y);

    if (seriesA.length !== seriesB.length) {
      const error = document.createElement("p");
      error.className = "compare-error";
      error.textContent =
        "The two result series have different lengths, so the comparison plot was not created. Rerun both methods on the same aligned grid.";
      body.replaceChildren(error);
      return;
    }

    const heading = createHeading(
      2,
      `Comparison · ${resultA.metadata.displayName} vs ${resultB.metadata.displayName}`
    );
    heading.tabIndex = -1;
    heading.dataset.resultFocus = "true";
    const labelA = document.createElement("p");
    labelA.textContent =
      `Final numerical approximation — ${resultA.metadata.displayName}`;
    const valueA = document.createElement("span");
    valueA.className = "ode-primary-numeric-value";
    valueA.textContent = la.y.toFixed(8);
    const labelB = document.createElement("p");
    labelB.textContent =
      `Final numerical approximation — ${resultB.metadata.displayName}`;
    const valueB = document.createElement("span");
    valueB.className = "ode-primary-numeric-value";
    valueB.textContent = lb.y.toFixed(8);
    const primary = createPrimaryResult({
      heading,
      problemContext: createComparisonProblemContext(expression, seriesA),
      primaryAnswer: { label: labelA, content: valueA },
      comparisonAnswer: { label: labelB, content: valueB },
      metrics: createMetricsList([
        { label: "Stored grid points (each)", value: String(seriesA.length) },
        { label: "Final time", value: la.t.toFixed(6) },
        {
          label: "Absolute difference between final numerical approximations",
          value: diff.toExponential(4),
        },
      ]),
    });
    const methodEvidence = document.createElement("div");
    methodEvidence.className = "compare-meta-grid";
    methodEvidence.append(
      createMethodEvidence(resultA.metadata),
      createMethodEvidence(resultB.metadata)
    );
    body.replaceChildren(
      primary,
      methodEvidence,
      createChartEvidence(),
      createCompareValuesEvidence(
        seriesA,
        seriesB,
        resultA.metadata,
        resultB.metadata
      )
    );

    renderMethodFormulas(body, [metaA, metaB]);

    const canvas = app.querySelector<HTMLCanvasElement>("#plot");
    if (!canvas) return;
    chart?.destroy();
    const theme = resolveNumericalChartTheme();
    chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: seriesA.map((p) => p.t.toFixed(3)),
        datasets: [
          {
            label: resultA.metadata.displayName,
            data: seriesA.map((p) => p.y),
            borderColor: theme.primary,
            tension: 0.15,
            pointRadius: 0,
          },
          {
            label: resultB.metadata.displayName,
            data: seriesB.map((p) => p.y),
            borderColor: theme.compare,
            tension: 0.15,
            pointRadius: 0,
          },
        ],
      },
      options: chartOptions(seriesA, "y"),
    });
    primaryChartKind = "compare";
  }

  function captureMountedDrafts(): void {
    if (disposed || step !== "configure") return;
    const expressionState = activeExpressionField?.getState();
    if (expressionState) {
      if (selectedMeta()?.mode === "second") {
        persisted.secondExpression = persistMathFieldSnapshot(
          "second_order_rhs",
          expressionState,
          persisted.secondExpression
        );
      } else {
        persisted.firstExpression = persistMathFieldSnapshot(
          "rhs",
          expressionState,
          persisted.firstExpression
        );
      }
    }
    const exactState = activeExactExpressionField?.getState();
    if (exactState) {
      persisted.exactExpression = persistOptionalMathFieldSnapshot(
        exactState,
        persisted.exactExpression
      );
    }
    const form = app.querySelector<HTMLFormElement>("#ode-form");
    if (!form) return;
    readPersistedFromFormEl(form);
    if (session.mode === "single" && selected) {
      const order = form.querySelector<HTMLInputElement>('[name="order"]');
      if (order) selected = { ...selected, order: Number(order.value) };
    } else if (session.mode === "compare") {
      const orderA = form.querySelector<HTMLInputElement>('[name="orderA"]');
      const orderB = form.querySelector<HTMLInputElement>('[name="orderB"]');
      session = {
        mode: "compare",
        a: { ...session.a, ...(orderA ? { order: Number(orderA.value) } : {}) },
        b: { ...session.b, ...(orderB ? { order: Number(orderB.value) } : {}) },
      };
    }
    const exactToggle = app.querySelector<HTMLInputElement>(
      "[data-exact-solution-toggle]"
    );
    if (exactToggle) persisted.exactSolutionEnabled = exactToggle.checked;
  }

  function createSessionSnapshot(captureDrafts: boolean): OdeSessionState {
    if (captureDrafts) captureMountedDrafts();
    const output: OdeSessionState["output"] = lastCompare
      ? Object.freeze({
        comparison: Object.freeze({ ...lastCompare }),
      })
      : lastResult && lastResultExpression && lastProblemInputs
        ? Object.freeze({
          single: Object.freeze({
            result: lastResult,
            expression: lastResultExpression,
            ...(lastFirstOrderRunSnapshot
              ? { firstOrderRun: lastFirstOrderRunSnapshot }
              : {}),
            problemInputs: lastProblemInputs,
          }),
        })
        : Object.freeze({});
    return Object.freeze({
      version: 1 as const,
      step,
      workflow: Object.freeze({ ...session }) as OdeSessionState["workflow"],
      selectedMethod: selected ? Object.freeze({ ...selected }) : null,
      form: presetFormState,
      secondOrderForm,
      comparePickError,
      output,
      convergenceByFingerprint: convergenceStates,
    });
  }

  function emitSessionUpdate(): void {
    if (disposed || !options.lifecycle) return;
    const snapshot = createSessionSnapshot(false);
    const labMeaningful = computeOdeLabMeaningful(snapshot);
    const metadata: LabSessionMetadata = {
      labMeaningful,
      tutorMeaningful: false,
      meaningful: labMeaningful,
      resumeSummary: createOdeResumeSummary(
        snapshot,
        lastMeaningfulInteraction ?? 0
      ),
      ...(lastMeaningfulInteraction === undefined
        ? {}
        : { lastMeaningfulInteraction }),
    };
    options.lifecycle.updateSession(snapshot, metadata);
  }

  render();
  window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);

  return Object.freeze({
    getSession(): OdeSessionState {
      return createSessionSnapshot(!disposed);
    },
    getResumeSummary(): ResumeSummary | undefined {
      return createOdeResumeSummary(
        createSessionSnapshot(!disposed),
        lastMeaningfulInteraction ?? 0
      );
    },
    getTutorBinding(): LabTutorBinding<unknown> {
      return tutorBindingControl.binding;
    },
    getGlossaryBinding(): LabGlossaryBinding {
      return glossaryRuntime.binding;
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      uiGeneration += 1;
      closeResetDialog(false);
      disposeExpressionUi();
      disposeConvergenceUi();
      disposePrimaryChart();
      disposeWorkflowNavigation(
        app.querySelector<HTMLElement>("[data-workflow-navigation]")
      );
      window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
      glossaryRuntime.dispose();
      tutorBindingControl.dispose();
      if (activeOdeMounts.get(app) === mountToken) {
        activeOdeMounts.delete(app);
        app.replaceChildren();
      }
    },
  });
}
