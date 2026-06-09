import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-sanitized-candidate-artifact-chain-handoff.mjs";
const docPath = "docs/TWII_SANITIZED_CANDIDATE_ARTIFACT_CHAIN_HANDOFF.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";
const tmpDir = "tmp";
const validArtifactPath = path.join(tmpDir, "twii-sanitized-candidate-chain-handoff.valid.json");
const unsafeArtifactPath = path.join(tmpDir, "twii-sanitized-candidate-chain-handoff.unsafe.json");

const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const reportSource = read(reportPath);

fs.mkdirSync(tmpDir, { recursive: true });
fs.writeFileSync(validArtifactPath, `${JSON.stringify(validArtifact(), null, 2)}\n`);

const validRun = spawnSync(
  process.execPath,
  [reportPath, "--candidate-artifact-path", validArtifactPath],
  { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
);
const validReport = parseJson(validRun.stdout ?? "", "valid handoff stdout");
if (validRun.status !== 0) problems.push("valid sanitized artifact handoff must exit 0");
if (validReport.status !== "twii_sanitized_candidate_artifact_chain_handoff_ready_for_named_packet") {
  problems.push("valid sanitized artifact handoff must be ready for named packet");
}
if (validReport.outcome !== "accepted_for_named_attempt_packet_no_write_only") {
  problems.push("valid sanitized artifact handoff outcome must be accepted for named packet no-write only");
}
assertSafety(validReport, "valid handoff report");

const unsafe = validArtifact();
unsafe.rawPayloadIncluded = true;
unsafe.rawPayload = { forbidden: true };
fs.writeFileSync(unsafeArtifactPath, `${JSON.stringify(unsafe, null, 2)}\n`);
const unsafeRun = spawnSync(
  process.execPath,
  [reportPath, "--candidate-artifact-path", unsafeArtifactPath],
  { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
);
const unsafeReport = parseJson(unsafeRun.stdout ?? "", "unsafe handoff stdout");
if (unsafeRun.status === 0) problems.push("unsafe artifact handoff must fail closed");
if (unsafeReport.status !== "blocked" || unsafeReport.outcome !== "blocked") {
  problems.push("unsafe artifact handoff must be blocked");
}

if (
  pkg.scripts?.["report:twii-sanitized-candidate-artifact-chain-handoff"] !==
  `node ${reportPath}`
) {
  problems.push(`${packagePath} missing report:twii-sanitized-candidate-artifact-chain-handoff`);
}
if (
  pkg.scripts?.["check:twii-sanitized-candidate-artifact-chain-handoff"] !==
  "node scripts/check-twii-sanitized-candidate-artifact-chain-handoff.mjs"
) {
  problems.push(`${packagePath} missing check:twii-sanitized-candidate-artifact-chain-handoff`);
}

for (const phrase of [
  "TWII Sanitized Candidate Artifact Chain Handoff",
  "twii_sanitized_candidate_artifact_chain_handoff_ready",
  "twii_sanitized_candidate_artifact_chain_handoff_ready_for_named_packet",
  "accepted_for_named_attempt_packet_no_write_only",
  "packet-driven no-write chain",
  "publicDataSource=mock",
  "scoreSource=mock",
  "No SQL",
  "No Supabase",
  "No daily_prices mutation"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII sanitized candidate artifact chain handoff slice",
  "docs/TWII_SANITIZED_CANDIDATE_ARTIFACT_CHAIN_HANDOFF.md",
  "twii_sanitized_candidate_artifact_chain_handoff_ready"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_SANITIZED_CANDIDATE_ARTIFACT_CHAIN_HANDOFF.md` is `accepted` as TWII sanitized candidate artifact chain handoff",
  "twii_sanitized_candidate_artifact_chain_handoff_ready"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-sanitized-candidate-artifact-chain-handoff.mjs",
  "name: \"twii-sanitized-candidate-artifact-chain-handoff\"",
  "\"twii-sanitized-candidate-artifact-chain-handoff\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["valid handoff stdout", validRun.stdout ?? ""]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "twii_sanitized_candidate_artifact_chain_handoff_ready",
      acceptedStatus: validReport.status,
      blockedFixtureStatus: unsafeReport.status
    },
    null,
    2
  )
);

function validArtifact() {
  return {
    artifactId: "twii-sanitized-candidate-chain-handoff-check",
    lane: "TWII",
    assetType: "index",
    symbol: "TWII",
    scope: "twii_index_daily_prices_missing_rows",
    sourceLane: "official-exchange-index",
    sourceRightsGateStatus: "twii_source_rights_outcome_gate_candidate_ready_for_pm_review",
    fieldContractVersion: "twii-v1",
    coverageWindowSessions: 60,
    alreadyObservedRows: 0,
    candidateMissingRows: 60,
    expectedRows: 60,
    reviewOutputPolicy: "aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads",
    sanitizedAggregateOnly: true,
    rawPayloadIncluded: false,
    rowPayloadIncluded: false,
    stockIdPayloadIncluded: false,
    secretsIncluded: false,
    aggregateValidation: {
      expectedRows: 60,
      candidateRows: 60,
      duplicateRows: 0,
      rejectedRows: 0,
      missingRows: 0,
      fieldNames: ["tradeDate", "open", "high", "low", "close", "volume"],
      validationStatus: "pending_pm_review"
    }
  };
}

function assertSafety(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlAllowed",
    "supabaseAllowed",
    "marketDataFetchAllowed",
    "marketDataIngestAllowed",
    "dailyPricesMutationAllowed",
    "stagingRowsAllowed",
    "candidateRowsAcceptanceAllowed",
    "rowCoverageScoringAllowed",
    "rawPayloadOutputAllowed",
    "rowPayloadOutputAllowed",
    "stockIdPayloadOutputAllowed",
    "secretOutputAllowed",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} is not valid JSON`);
    return {};
  }
}

function forbiddenPatterns() {
  return [
    /\bfetch\s*\(/u,
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u
  ];
}
