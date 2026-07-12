import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./main.ts", import.meta.url), "utf8");
const styles = readFileSync(new URL("./style.css", import.meta.url), "utf8");

function between(start: string, end: string): string {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from + start.length);
  expect(from).toBeGreaterThanOrEqual(0);
  expect(to).toBeGreaterThan(from);
  return source.slice(from, to);
}

describe("main convergence orchestration boundary", () => {
  it("creates successful snapshots from actual solver metadata and frozen expressions", () => {
    const submit = between("const expressionSnapshot = createSuccessfulExpressionSnapshot", "resetTutorConversation();");
    expect(submit).toContain("metadata: result.metadata");
    expect(submit).toContain("rhs: expressionSnapshot.expression");
    expect(submit).toContain("exactSolution: expressionSnapshot.exactSolution");
    expect(submit).toContain("runStepSize: h");
    expect(submit).toContain("presetId: expressionSnapshot.presetId");
  });

  it("uses independent study drafts and the Phase C runner", () => {
    const config = between("function convergenceConfig", "function controlledConvergenceFailure");
    expect(config).toContain("baseStepSize: Number(state.baseStepSizeDraft)");
    expect(config).toContain("refinementLevels: Number(state.refinementLevelsDraft)");
    const attempt = between("function attemptConvergenceStudy", "function handleConvergenceIntent");
    expect(attempt).toContain("checkConvergenceStudyConsistency(config)");
    expect(attempt).toContain("runConvergenceStudy(config)");
    expect(attempt).toContain("recordConvergenceSuccess");
    expect(attempt).toContain("recordConvergenceFailure");
    expect(attempt).toContain("finishWarningAttempt");
  });

  it("mounts the drawer only in single first-order results", () => {
    const single = between("function mountResults", "function drawSingleChart");
    expect(single).toContain('meta.mode === "first"');
    expect(single).toContain("mountConvergenceStudyView");
    const compare = between("function mountCompareResults", "render();");
    expect(compare).not.toContain("mountConvergenceStudyView");
    expect(compare).not.toContain("data-convergence-study-host");
  });

  it("reads current convergence Tutor evidence per question only for single first-order output", () => {
    const singleShell = between("function renderResultsShell", "function renderCompareResultsShell");
    expect(singleShell).toContain("getConvergenceStudy");
    expect(singleShell).toContain("getTutorConvergenceStudy");
    expect(singleShell).toContain("convergenceStates.get(tutorRunSnapshot.runFingerprint)");

    const compareShell = between("function renderCompareResultsShell", "function mountResults");
    expect(compareShell).not.toContain("getConvergenceStudy");
    expect(compareShell).not.toContain("getTutorConvergenceStudy");
  });

  it("keeps the successful run snapshot when a later original Run attempt fails", () => {
    const form = between("function renderForm", "function renderCompareForm");
    const catchStart = form.lastIndexOf("} catch (e) {");
    expect(catchStart).toBeGreaterThanOrEqual(0);
    const failedRunHandler = form.slice(catchStart);
    expect(failedRunHandler).not.toContain("lastFirstOrderRunSnapshot =");
    expect(failedRunHandler).not.toContain("convergenceStates.delete");
    expect(failedRunHandler).not.toContain("lastResult =");
  });

  it("keeps the ordinary and convergence chart owners separate", () => {
    expect(source).toContain("let chart: Chart | null = null");
    expect(source).toContain("let activeConvergenceView: ConvergenceStudyViewHandle | null = null");
    expect(source).toContain("activeConvergenceView?.dispose()");
    expect(source).toContain("chartFactory: convergenceChartFactory");
  });

  it("retains existing Return to current output navigation without rerunning", () => {
    expect(source).toContain("data-return-output");
    const form = between("function renderForm", "function renderCompareForm");
    const returnStart = form.indexOf('wrap.querySelector("[data-return-output]")');
    const returnEnd = form.indexOf('wrap.querySelector("[data-back-methods]")', returnStart);
    const returnHandler = form.slice(returnStart, returnEnd);
    expect(returnHandler).toContain('step = "results"');
    expect(returnHandler).not.toContain("integrateFirstOrder(");
    expect(returnHandler).not.toContain("runConvergenceStudy(");
  });

  it("contains new chart and table overflow without widening the page", () => {
    expect(styles).toMatch(/\.convergence-chart-scroll[\s\S]*overflow-x:\s*auto/);
    expect(styles).toMatch(/\.convergence-chart-region[\s\S]*min-width:\s*520px/);
    expect(styles).not.toMatch(/body\s*\{[^}]*min-width:/);
  });
});
