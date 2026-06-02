import { getFreshnessReadonlyLatestEvidenceSummary } from "@/lib/freshness-readonly-latest-evidence";
import { getHomeRuntimeActionSummary } from "@/lib/home-runtime-action-summary";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";
import { getRuntimeReadinessSummary, type RuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";

export type RuntimeStateConsistencySummary = {
  consistencyState: "mock_consistent";
  headline: string;
  publicDataSource: "mock";
  readinessState: RuntimeReadinessSummary["status"];
  rowCoverageState: "local_ready_remote_paused";
  scoreSource: "mock";
  sourceDepthState: "not_ready";
  statusLine: string;
  stopLine: string;
};

export function getRuntimeStateConsistencySummary(): RuntimeStateConsistencySummary {
  const actionSummary = getHomeRuntimeActionSummary();
  const readiness = getRuntimeReadinessSummary();
  const rowCoverage = getRowCoverageSecondAttemptReadiness();
  const sourceDepth = getSourceDepthBlockerSummary();
  const freshnessEvidence = getFreshnessReadonlyLatestEvidenceSummary();

  return {
    consistencyState: "mock_consistent",
    headline: "Runtime state is consistent: public mock, readiness readying, source depth not_ready",
    publicDataSource: "mock",
    readinessState: readiness.status,
    rowCoverageState: rowCoverage.readiness,
    scoreSource: "mock",
    sourceDepthState: sourceDepth.sourceDepthState,
    statusLine: `${actionSummary.nextAction}: freshness ${freshnessEvidence.evidenceStatus}, row coverage ${rowCoverage.readiness}, source depth ${sourceDepth.sourceDepthState}.`,
    stopLine:
      "Keep every public surface aligned to mock publicDataSource and mock scoreSource until row coverage, source rights, source depth, model credibility, and post-run review gates pass."
  };
}
