import { spawnSync } from "node:child_process";

const candidatePath = process.env.A1_TWII_CANDIDATE_ARTIFACT_PATH;
const decisionGate = runDecisionGate(candidatePath);
const decisionReady =
  decisionGate.statusCode === 0 &&
  decisionGate.output?.status === "twii_report_only_dry_run_decision_gate_ready_for_named_attempt_decision";

const report = {
  status: decisionReady
    ? "pm_twii_report_only_dry_run_preflight_ready_to_request_ceo_named_attempt"
    : "pm_twii_report_only_dry_run_preflight_blocked_candidate_artifact_not_ready",
  ok: true,
  mode: "pm_twii_report_only_dry_run_preflight",
  owner: "PM",
  decisionReady,
  decisionGateSummary: {
    statusCode: decisionGate.statusCode,
    status: decisionGate.output?.status ?? "blocked",
    pmIntakeReady: decisionGate.output?.pmIntakeReady === true,
    decisionMeaning: decisionGate.output?.decisionMeaning ?? "blocked_until_decision_gate_ready"
  },
  pmAction: decisionReady
    ? "Ask CEO to name exactly one future bounded TWII report-only dry-run attempt with aggregate-only output and same-slice post-run review."
    : "Route A1 back to candidate artifact self-check and PM intake review before asking CEO for a named attempt.",
  nextCommand: decisionReady
    ? "cmd.exe /c npm run report:twii-report-only-dry-run-decision-gate"
    : "cmd.exe /c npm run report:a1-twii-candidate-artifact-self-check",
  authorizationBoundary: {
    reportOnlyRunnerExecutionAllowedNow: false,
    reportOnlyRunnerImplementationAllowedNow: false,
    stagingWriteExecutionAllowed: false,
    supabaseOperationAllowed: false,
    dailyPricesMutationAllowed: false,
    rowCoverageScoringAllowed: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    candidateArtifactCreated: false,
    sourceDerivedCandidateRowsCreated: false,
    reportOnlyRunnerExecuted: false,
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    stagingRowsCreated: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    sourcePayloadsPrinted: false,
    rowPayloadsPrinted: false,
    stockIdPayloadsPrinted: false,
    secretsPrinted: false,
    serviceRoleKeyPrinted: false,
    publicPromotionAllowed: false,
    rowCoveragePointsAllowed: false,
    scoreSourceRealAllowed: false
  }
};

console.log(JSON.stringify(report, null, 2));

function runDecisionGate(inputPath) {
  const env = { ...process.env };
  if (inputPath) env.A1_TWII_CANDIDATE_ARTIFACT_PATH = inputPath;
  const result = spawnSync(process.execPath, ["scripts/report-twii-report-only-dry-run-decision-gate.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
    shell: false,
    timeout: 120000,
    windowsHide: true
  });

  return {
    statusCode: result.status ?? 1,
    output: parseJson(result.stdout ?? "")
  };
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
