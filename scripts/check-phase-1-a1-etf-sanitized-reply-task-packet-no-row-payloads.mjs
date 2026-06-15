import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-a1-etf-sanitized-reply-task-packet-no-row-payloads.json";
const reportPath = "scripts/report-phase-1-a1-etf-sanitized-reply-task-packet-no-row-payloads.mjs";
const executionBriefPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-execution-brief-no-row-payloads.json";
const applyGatePath = "data/evidence-intake/phase-1-etf-reply-pm-acceptance-apply-gate-no-row-payloads.json";
const docPath = "docs/PHASE_1_A1_ETF_SANITIZED_REPLY_TASK_PACKET_NO_ROW_PAYLOADS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const executionBrief = parseJson(readText(executionBriefPath), executionBriefPath);
const applyGate = parseJson(readText(applyGatePath), applyGatePath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const status = readText(statusPath);

const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
if (reportRun.status !== 0) problems.push("report script must exit 0");
const reportText = reportRun.stdout ?? "";
const report = parseJson(reportText, "report stdout");

validateSourceState();
validateArtifact();
validateReport();
validateDoc();
validateRegistration();
validateStatus();
validateBoundaries();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_a1_etf_sanitized_reply_task_packet_no_row_payloads_ready"
        : "phase_1_a1_etf_sanitized_reply_task_packet_no_row_payloads_blocked",
      taskDecision: artifact.taskDecision ?? null,
      ownerLane: artifact.ownerLane ?? null,
      expectedRows: artifact.expectedRows ?? null,
      nextPmRouteAfterReply: artifact.nextPmRouteAfterReply ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateSourceState() {
  expect(executionBrief.status, "phase_1_etf_sanitized_candidate_artifact_reply_execution_brief_no_row_payloads_ready", "execution brief status");
  expect(executionBrief.a1CanExecuteNow, true, "execution brief a1CanExecuteNow");
  expect(applyGate.status, "phase_1_etf_reply_pm_acceptance_apply_gate_no_row_payloads_ready", "apply gate status");
  expect(applyGate.applyAllowedNow, false, "apply gate applyAllowedNow");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_a1_etf_sanitized_reply_task_packet_no_row_payloads_ready", "artifact status");
  expect(artifact.taskMode, "a1_etf_sanitized_reply_task_packet_no_row_payloads", "taskMode");
  expect(artifact.taskDecision, "send_to_a1_prepare_aggregate_only_reply", "taskDecision");
  expect(artifact.ownerLane, "A1/Data", "ownerLane");
  expect(artifact.targetLane, "ETF", "targetLane");
  expect(artifact.symbolGroup, "ETF", "symbolGroup");
  expect(artifact.targetScope, "phase_1_core_etf_daily_prices_missing_rows", "targetScope");
  expect(artifact.expectedRows, 118, "expectedRows");
  expect(artifact.candidateMissingRows, 118, "candidateMissingRows");
  expect(artifact.sourceExecutionBriefStatus, "phase_1_etf_sanitized_candidate_artifact_reply_execution_brief_no_row_payloads_ready", "sourceExecutionBriefStatus");
  expect(artifact.sourceApplyGateStatus, "phase_1_etf_reply_pm_acceptance_apply_gate_no_row_payloads_ready", "sourceApplyGateStatus");
  expect(artifact.pmAcceptsNow, false, "pmAcceptsNow");
  expect(artifact.a1MayReplyNow, true, "a1MayReplyNow");
  expect(artifact.nextPmRouteAfterReply, "phase_1_etf_sanitized_candidate_artifact_reply_intake_validator_no_row_payloads", "nextPmRouteAfterReply");
  expectArray(artifact.requiredReplyFields, [
    "candidateArtifactPath",
    "artifactId",
    "lane",
    "symbolGroup",
    "scope",
    "sourceLane",
    "coverageWindowSessions",
    "candidateMissingRows",
    "expectedRows",
    "aggregateValidation",
    "sanitizedAggregateOnly",
    "rawPayloadIncluded",
    "rowPayloadIncluded",
    "stockIdPayloadIncluded",
    "secretsIncluded"
  ], "requiredReplyFields");
  expectDeepEqual(
    artifact.requiredReplyValues,
    {
      lane: "ETF",
      symbolGroup: "ETF",
      scope: "phase_1_core_etf_daily_prices_missing_rows",
      candidateMissingRows: 118,
      expectedRows: 118,
      sanitizedAggregateOnly: true,
      rawPayloadIncluded: false,
      rowPayloadIncluded: false,
      stockIdPayloadIncluded: false,
      secretsIncluded: false
    },
    "requiredReplyValues"
  );
  expectArray(artifact.stoplines, [
    "do_not_include_raw_payload",
    "do_not_include_row_payload",
    "do_not_include_stock_id_payload",
    "do_not_include_secret_or_credential_value",
    "do_not_execute_sql",
    "do_not_write_supabase",
    "do_not_read_or_output_market_rows",
    "do_not_claim_public_real_data_promotion"
  ], "stoplines");
  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validateReport() {
  expect(report.status, "phase_1_a1_etf_sanitized_reply_task_packet_no_row_payloads_ready", "report status");
  expect(report.taskDecision, artifact.taskDecision, "report taskDecision");
  expect(report.ownerLane, "A1/Data", "report ownerLane");
  expect(report.expectedRows, 118, "report expectedRows");
  expect(report.pmAcceptsNow, false, "report pmAcceptsNow");
  if (!reportText.includes("A1 ETF sanitized artifact reply task")) problems.push("report missing copyable task title");
  if (!reportText.includes("candidateMissingRows: 118")) problems.push("report missing candidateMissingRows copy line");
  if (!reportText.includes("rawPayloadIncluded: false")) problems.push("report missing rawPayloadIncluded copy line");
}

function validateDoc() {
  const requiredTokens = [
    "Phase 1 A1 ETF Sanitized Reply Task Packet",
    "phase_1_a1_etf_sanitized_reply_task_packet_no_row_payloads_ready",
    "send_to_a1_prepare_aggregate_only_reply",
    "ownerLane=A1/Data",
    "targetLane=ETF",
    "symbolGroup=ETF",
    "targetScope=phase_1_core_etf_daily_prices_missing_rows",
    "expectedRows=118",
    "candidateMissingRows=118",
    "candidateArtifactPath:",
    "artifactId:",
    "candidateMissingRows: 118",
    "expectedRows: 118",
    "sanitizedAggregateOnly: true",
    "rawPayloadIncluded: false",
    "rowPayloadIncluded: false",
    "stockIdPayloadIncluded: false",
    "secretsIncluded: false",
    "do_not_include_raw_payload",
    "do_not_read_or_output_market_rows",
    "No Supabase write",
    "No public real-data promotion",
    "nextPmRouteAfterReply=phase_1_etf_sanitized_candidate_artifact_reply_intake_validator_no_row_payloads"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["report:phase-1-a1-etf-sanitized-reply-task-packet-no-row-payloads"] !==
    `node ${reportPath}`
  ) {
    problems.push("package.json missing report:phase-1-a1-etf-sanitized-reply-task-packet-no-row-payloads");
  }
  if (
    packageJson.scripts?.["check:phase-1-a1-etf-sanitized-reply-task-packet-no-row-payloads"] !==
    "node scripts/check-phase-1-a1-etf-sanitized-reply-task-packet-no-row-payloads.mjs"
  ) {
    problems.push("package.json missing check:phase-1-a1-etf-sanitized-reply-task-packet-no-row-payloads");
  }
  if (!reviewGate.includes("scripts/check-phase-1-a1-etf-sanitized-reply-task-packet-no-row-payloads.mjs")) {
    problems.push("review gate missing A1 ETF task packet checker");
  }
  if (!reviewGate.includes('"phase-1-a1-etf-sanitized-reply-task-packet-no-row-payloads"')) {
    problems.push("focused review gate missing A1 ETF task packet checker");
  }
}

function validateStatus() {
  const requiredTokens = [
    "Latest Phase 1 A1 ETF sanitized reply task packet slice",
    "docs/PHASE_1_A1_ETF_SANITIZED_REPLY_TASK_PACKET_NO_ROW_PAYLOADS.md",
    "phase_1_a1_etf_sanitized_reply_task_packet_no_row_payloads_ready",
    "send_to_a1_prepare_aggregate_only_reply",
    "ownerLane=A1/Data",
    "expectedRows=118",
    "nextPmRouteAfterReply=phase_1_etf_sanitized_candidate_artifact_reply_intake_validator_no_row_payloads"
  ];
  for (const token of requiredTokens) if (!status.includes(token)) problems.push(`${statusPath} missing ${token}`);
}

function validateBoundaries() {
  const texts = [
    [artifactPath, artifactRaw],
    [docPath, doc],
    ["report stdout", reportText]
  ];
  const forbiddenPatterns = [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\.rpc\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /pmAcceptsNow"\s*:\s*true/u,
    /rawPayloadIncluded:\s*true/u,
    /rowPayloadIncluded:\s*true/u,
    /stockIdPayloadIncluded:\s*true/u,
    /secretsIncluded:\s*true/u
  ];
  for (const [label, text] of texts) {
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
}

function validateSafety(safety, label) {
  expect(safety.publicDataSource, "mock", `${label}.publicDataSource`);
  expect(safety.scoreSource, "mock", `${label}.scoreSource`);
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "supabaseReadAttempted",
    "supabaseWriteAttempted",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "candidateArtifactRowsRead",
    "rowPayloadRead",
    "rawPayloadRead",
    "rowPayloadOutput",
    "rawPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed",
    "investmentAdviceClaimAllowed"
  ]) {
    expect(safety[key], false, `${label}.${key}`);
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function expectDeepEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
  }
}

function expectArray(actual, expected, label) {
  if (!Array.isArray(actual)) {
    problems.push(`${label} must be an array`);
    return;
  }
  const missing = expected.filter((item) => !actual.includes(item));
  const extra = actual.filter((item) => !expected.includes(item));
  if (missing.length > 0 || extra.length > 0) {
    problems.push(`${label} mismatch missing=${JSON.stringify(missing)} extra=${JSON.stringify(extra)}`);
  }
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}
