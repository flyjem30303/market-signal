import { spawnSync } from "node:child_process";

const postReviewGate = runJson("scripts/report-narrow-approval-post-review-gate.mjs");
const legalRollup = runJson("scripts/report-provider-specific-terms-post-review-rollup.mjs");
const packetBridge = runJson("scripts/report-mainline-readonly-packet-bridge.mjs");
const preexecutionPacket = runJson("scripts/report-row-coverage-readonly-preexecution-packet.mjs");
const attemptDecision = runJson("scripts/report-bounded-row-coverage-readonly-attempt-decision.mjs");

const localReady =
  postReviewGate.outcomeLedger?.allRequiredOutcomesAccepted === true &&
  legalRollup.readyForNextReadonlyDecision === true &&
  packetBridge.status === "ready_to_present_not_execute" &&
  preexecutionPacket.status === "ready_to_present_not_execute" &&
  attemptDecision.status === "ready_for_explicit_one_attempt_decision";

const alignment = {
  mode: "bounded_readonly_final_local_alignment",
  status: localReady ? "ready_for_separately_named_bounded_readonly_decision" : "blocked_needs_local_repair",
  generatedAt: new Date().toISOString(),
  ceoRecommendation: localReady
    ? "All local prerequisites are aligned. CEO may next choose whether to separately name exactly one bounded Supabase readonly row coverage attempt."
    : "Do not discuss remote execution until local prerequisite alignment is repaired.",
  pmExecutionDirection: localReady
    ? "Present this final local alignment only as a decision summary; do not run the remote attempt from this report."
    : "Run the failing local checker/report and repair it before returning to readonly decision talk.",
  localPrerequisites: [
    {
      id: "narrow-approval-post-review-gate",
      status: postReviewGate.status,
      ok: postReviewGate.outcomeLedger?.allRequiredOutcomesAccepted === true,
      meaning: "Legal and Investment oral outcomes are already recorded as accepted for local planning only."
    },
    {
      id: "provider-specific-terms-post-review-rollup",
      status: legalRollup.status,
      ok: legalRollup.readyForNextReadonlyDecision === true,
      meaning: "Legal source-rights context is aligned with the accepted local outcome; no provider terms approval is granted."
    },
    {
      id: "mainline-readonly-packet-bridge",
      status: packetBridge.status,
      ok: packetBridge.status === "ready_to_present_not_execute",
      meaning: "Mainline row coverage packet is ready to present while remote execution stays separate."
    },
    {
      id: "row-coverage-readonly-preexecution-packet",
      status: preexecutionPacket.status,
      ok: preexecutionPacket.status === "ready_to_present_not_execute",
      meaning: "Row coverage readonly packet can be restated before a separately named one-attempt decision."
    },
    {
      id: "bounded-row-coverage-readonly-attempt-decision",
      status: attemptDecision.status,
      ok: attemptDecision.status === "ready_for_explicit_one_attempt_decision",
      meaning: "Local decision gate can support one separately named bounded attempt."
    }
  ],
  nextDecisionContract: {
    requiresSeparateNamedAction: true,
    exactAttemptCount: 1,
    remoteExecutionFromThisReport: false,
    immediatePrechecksRequired: preexecutionPacket.immediatePreExecutionChecks,
    immediatePostRunReviewRequired: true,
    sanitizedAggregateOutputOnly: true,
    commandDriftStopsExecution: true,
    noRuntimePromotionFromAttemptAlone: true,
    noRetryInSameSlice: true,
    confirmationToken: preexecutionPacket.executionCommandPreview?.confirmationToken ?? "CP3_ROW_COVERAGE_READONLY_VALIDATE"
  },
  stillBlocked: [
    "SQL execution",
    "Supabase writes",
    "staging row writes",
    "daily_prices writes",
    "raw market data fetch or ingestion",
    "printing secrets",
    "printing row payloads or internal stock identifiers",
    "provider terms approval",
    "source license approval",
    "publicDataSource=supabase",
    "scoreSource=real",
    "row coverage points",
    "data-quality score lift",
    "runtime promotion",
    "CP3_READY_NOW"
  ],
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    marketDataFetched: false,
    providerTermsFetched: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  sourceReports: [
    "scripts/report-narrow-approval-post-review-gate.mjs",
    "scripts/report-provider-specific-terms-post-review-rollup.mjs",
    "scripts/report-mainline-readonly-packet-bridge.mjs",
    "scripts/report-row-coverage-readonly-preexecution-packet.mjs",
    "scripts/report-bounded-row-coverage-readonly-attempt-decision.mjs"
  ],
  stopLine:
    "This final local alignment does not connect to Supabase, run SQL, write data, fetch market data, fetch provider terms, print secrets, execute readonly attempts, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
};

console.log(JSON.stringify(alignment, null, 2));

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
