import { spawnSync } from "node:child_process";

const draftReportPath = "scripts/report-twii-explicit-execution-packet-draft.mjs";
const problems = [];

const draftReport = runJsonReport(draftReportPath, "explicit execution packet draft");

validateDraftReport();

const blockedExecutionReasons = [
  "execute flag remains false",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "implementationAllowedNow=false",
  "rollback/readback/post-write proof bundle is not yet separated as a PM-reviewed gate",
  "future one-time authorization has not been issued in an executable packet"
];

const requiredBeforeAnyExecution = [
  "prepare_rollback_readback_postwrite_proof_bundle",
  "run rollback dry-run proof locally without mutation",
  "run aggregate readback proof locally without remote payload output",
  "run post-write review proof locally without accepting rows",
  "prepare a separate future one-time authorization packet only after those proofs pass",
  "keep promotion and scoring blocked until a later explicit promotion gate"
];

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_explicit_execution_readiness_selector_ready_no_execution" : "blocked",
  outcome: ok
    ? "selector_routes_to_proof_bundle_execution_still_blocked"
    : "selector_blocked",
  mode: "twii_explicit_execution_readiness_selector",
  owner: "CEO/PM",
  currentRoute: ok
    ? "twii_explicit_execution_packet_reviewed_execution_blocked"
    : "repair_explicit_execution_packet_draft",
  recommendedNextAction: ok
    ? "prepare_rollback_readback_postwrite_proof_bundle"
    : "repair_explicit_execution_packet_draft",
  requiredBeforeAnyExecution,
  blockedExecutionReasons,
  upstream: {
    draftReportPath,
    draftStatus: draftReport.status ?? null,
    draftOutcome: draftReport.outcome ?? null,
    executionPacketPath: draftReport.executionPacketPath ?? null,
    candidatePacketPath: draftReport.candidatePacketPath ?? null,
    futureReviewPacketPath: draftReport.futureReviewPacketPath ?? null,
    acceptedPrerequisiteSlots: draftReport.acceptedPrerequisiteSlots ?? null,
    requiredPrerequisiteSlots: draftReport.requiredPrerequisiteSlots ?? null
  },
  target: draftReport.target ?? null,
  executionControls: draftReport.executionControls ?? null,
  executionAllowedNow: false,
  writeGateExecutableNow: false,
  implementationAllowedNow: false,
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    credentialValuesRead: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateDraftReport() {
  if (draftReport.status !== "twii_explicit_execution_packet_draft_ready_no_execution") {
    problems.push("draft report status must be ready no execution");
  }
  if (draftReport.outcome !== "explicit_execution_packet_draft_ready_execution_still_blocked") {
    problems.push("draft report outcome must keep execution blocked");
  }
  if (draftReport.executionAllowedNow !== false) problems.push("draft executionAllowedNow must be false");
  if (draftReport.writeGateExecutableNow !== false) problems.push("draft writeGateExecutableNow must be false");
  if (draftReport.implementationAllowedNow !== false) problems.push("draft implementationAllowedNow must be false");
  if (draftReport.acceptedPrerequisiteSlots !== 6) problems.push("draft acceptedPrerequisiteSlots must be 6");
  if (draftReport.target?.targetTable !== "daily_prices") problems.push("draft targetTable must be daily_prices");
  if (draftReport.target?.targetLane !== "TWII") problems.push("draft targetLane must be TWII");
  if (draftReport.target?.targetScope !== "twii_index_daily_prices_missing_rows") {
    problems.push("draft targetScope must be twii_index_daily_prices_missing_rows");
  }
  if (draftReport.executionControls?.execute !== false) problems.push("draft execute must be false");
  if (draftReport.executionControls?.confirmationPhraseRequired !== true) {
    problems.push("draft confirmationPhraseRequired must be true");
  }
  assertSafety(draftReport.safety ?? {});
}

function runJsonReport(scriptPath, label) {
  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${label} report must exit 0`);
  try {
    return JSON.parse(run.stdout ?? "{}");
  } catch {
    problems.push(`${label} report stdout must be JSON`);
    return {};
  }
}

function assertSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("draft safety must stay mock/mock");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety[key] !== false) problems.push(`draft safety.${key} must be false`);
  }
}
