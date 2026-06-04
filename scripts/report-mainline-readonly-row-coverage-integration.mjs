import { spawnSync } from "node:child_process";

const boundedReadiness = runJson("scripts/report-bounded-readonly-readiness-recheck.mjs");
const packetBridge = runJson("scripts/report-mainline-readonly-packet-bridge.mjs");
const preexecutionPacket = runJson("scripts/report-row-coverage-readonly-preexecution-packet.mjs");
const attemptDecision = runJson("scripts/report-bounded-row-coverage-readonly-attempt-decision.mjs");

const localReady =
  boundedReadiness.status === "local_ready_remote_still_separate" &&
  packetBridge.status === "ready_to_present_not_execute" &&
  preexecutionPacket.status === "ready_to_present_not_execute" &&
  attemptDecision.status === "ready_for_explicit_one_attempt_decision";

const report = {
  mode: "mainline_readonly_row_coverage_integration",
  status: localReady ? "local_ready_remote_still_separate" : "blocked_needs_local_repair",
  generatedAt: new Date().toISOString(),
  ceoRecommendation: localReady
    ? "Continue runtime engineering unless CEO explicitly names exactly one bounded Supabase readonly row coverage attempt."
    : "Repair local readiness failures before discussing any Supabase readonly attempt.",
  pmExecutionDirection: localReady
    ? "Keep mainline moving with runtime work; present this integration only when deciding whether to run one bounded readonly attempt."
    : "Fix the failed local report/checker and rerun this integration gate.",
  ready: [
    {
      id: "bounded-readonly-readiness-recheck",
      status: boundedReadiness.status,
      meaning: "Local recheck says remote remains a separately named action."
    },
    {
      id: "mainline-readonly-packet-bridge",
      status: packetBridge.status,
      meaning: "Mainline can present the bounded readonly packet without executing it."
    },
    {
      id: "row-coverage-readonly-preexecution-packet",
      status: preexecutionPacket.status,
      meaning: "Row coverage packet is ready to present, not execute."
    },
    {
      id: "bounded-row-coverage-readonly-attempt-decision",
      status: attemptDecision.status,
      meaning: "Local decision gate can support one separately named bounded attempt."
    }
  ],
  blocked: [
    "SQL execution",
    "Supabase writes",
    "staging row writes",
    "daily_prices writes",
    "raw market data fetch or ingestion",
    "printing secrets",
    "printing row payloads or stock_id lists",
    "publicDataSource=supabase",
    "scoreSource=real",
    "row coverage points",
    "data-quality score lift",
    "CP3_READY_NOW"
  ],
  nextAttemptContract: {
    requiresSeparateNamedAction: true,
    maxAttempts: 1,
    commandDriftStopsExecution: true,
    sanitizedAggregateOutputOnly: true,
    immediatePostRunReviewRequired: true,
    noRuntimePromotionFromAttemptAlone: true,
    noRetryInSameSlice: true,
    confirmationToken: preexecutionPacket.executionCommandPreview?.confirmationToken ?? "CP3_ROW_COVERAGE_READONLY_VALIDATE"
  },
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    marketDataFetched: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  sourceReports: [
    "scripts/report-bounded-readonly-readiness-recheck.mjs",
    "scripts/report-mainline-readonly-packet-bridge.mjs",
    "scripts/report-row-coverage-readonly-preexecution-packet.mjs",
    "scripts/report-bounded-row-coverage-readonly-attempt-decision.mjs"
  ],
  stopLine:
    "This integration report does not connect to Supabase, run SQL, write data, fetch market data, print secrets, execute readonly attempts, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));

function runJson(script) {
  const run = spawnSync(process.execPath, [script], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  if (run.status !== 0) {
    throw new Error(`${script} failed: ${run.stderr.trim()}`);
  }

  return JSON.parse(run.stdout);
}
