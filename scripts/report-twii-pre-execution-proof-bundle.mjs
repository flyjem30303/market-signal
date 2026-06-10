import fs from "node:fs";
import { spawnSync } from "node:child_process";

const bundlePath = "data/source-gates/twii-pre-execution-proof-bundle.json";
const selectorReportPath = "scripts/report-twii-explicit-execution-readiness-selector.mjs";
const problems = [];

const bundle = readJson(bundlePath);
const selectorReport = runJsonReport(selectorReportPath, "explicit execution readiness selector");

validateSelector();
validateBundle();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_pre_execution_proof_bundle_ready_no_execution" : "blocked",
  outcome: ok ? "proof_bundle_ready_future_authorization_still_blocked" : "proof_bundle_blocked",
  mode: "twii_pre_execution_proof_bundle",
  owner: "CEO/PM",
  bundlePath,
  selectorReportPath,
  bundleStatus: bundle.bundleStatus ?? null,
  proofsReady: bundle.proofsReady === true,
  missingProofs: bundle.missingProofs ?? [],
  proofSummary: summarizeProofs(),
  currentRoute: "twii_pre_execution_proof_bundle_ready_execution_blocked",
  recommendedNextAction: bundle.recommendedNextAction ?? null,
  requiredBeforeAnyExecution: bundle.requiredBeforeAnyExecution ?? [],
  blockedExecutionReasons: bundle.blockedExecutionReasons ?? [],
  upstream: {
    selectorStatus: selectorReport.status ?? null,
    selectorOutcome: selectorReport.outcome ?? null,
    selectorRecommendedNextAction: selectorReport.recommendedNextAction ?? null,
    executionPacketPath: selectorReport.upstream?.executionPacketPath ?? null
  },
  target: {
    targetTable: bundle.targetTable ?? null,
    targetLane: bundle.targetLane ?? null,
    targetScope: bundle.targetScope ?? null,
    maxRows: bundle.maxRows ?? null
  },
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

function validateSelector() {
  if (selectorReport.status !== "twii_explicit_execution_readiness_selector_ready_no_execution") {
    problems.push("selector status must be ready no execution");
  }
  if (selectorReport.outcome !== "selector_routes_to_proof_bundle_execution_still_blocked") {
    problems.push("selector outcome must route to proof bundle and keep execution blocked");
  }
  if (selectorReport.recommendedNextAction !== "prepare_rollback_readback_postwrite_proof_bundle") {
    problems.push("selector recommendedNextAction must point to proof bundle");
  }
  if (selectorReport.executionAllowedNow !== false) problems.push("selector executionAllowedNow must be false");
  if (selectorReport.writeGateExecutableNow !== false) problems.push("selector writeGateExecutableNow must be false");
  if (selectorReport.implementationAllowedNow !== false) problems.push("selector implementationAllowedNow must be false");
}

function validateBundle() {
  const expected = {
    bundleKind: "twii_pre_execution_proof_bundle",
    selectorReportPath,
    executionPacketPath: "data/source-gates/twii-explicit-execution-packet-draft.json",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    bundleStatus: "ready_for_pm_review_no_execution",
    proofsReady: true,
    recommendedNextAction: "prepare_future_one_time_authorization_packet_after_pm_review",
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  };

  for (const [key, value] of Object.entries(expected)) {
    if (bundle[key] !== value) problems.push(`bundle.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(bundle.bundleId)) problems.push("bundle.bundleId is required");
  if (!Array.isArray(bundle.missingProofs) || bundle.missingProofs.length !== 0) {
    problems.push("bundle.missingProofs must be empty");
  }
  validateProofs();
  validateSafety(bundle.safety ?? {});
}

function validateProofs() {
  const proofIds = new Set((bundle.proofs ?? []).map((proof) => proof.proofId));
  for (const proofId of ["rollback-dry-run-proof", "aggregate-readback-proof", "post-write-review-proof"]) {
    if (!proofIds.has(proofId)) problems.push(`missing proof ${proofId}`);
  }
  for (const proof of bundle.proofs ?? []) {
    if (proof.required !== true) problems.push(`${proof.proofId} must be required`);
    if (proof.readyForPmReview !== true) problems.push(`${proof.proofId} must be ready for PM review`);
    if (!Array.isArray(proof.requiredOutputShape) || proof.requiredOutputShape.length < 4) {
      problems.push(`${proof.proofId} must define requiredOutputShape`);
    }
  }
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("bundle safety must stay mock/mock");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
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
    if (safety[key] !== false) problems.push(`bundle safety.${key} must be false`);
  }
}

function summarizeProofs() {
  return (bundle.proofs ?? []).map((proof) => ({
    proofId: proof.proofId,
    proofKind: proof.proofKind,
    readyForPmReview: proof.readyForPmReview === true
  }));
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

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    problems.push(`cannot read JSON: ${filePath}`);
    return {};
  }
}

function safeText(value) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 260;
}
