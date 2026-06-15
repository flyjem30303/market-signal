import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-twii-etf-missing-rows-backfill-readiness.json";
const rowCoveragePath = "data/evidence-intake/phase-1-row-coverage-readonly-result-20260615-a.json";
const aggregateReadonlyPath = "data/evidence-intake/phase-1-bounded-readonly-attempt-result-20260615-a.json";
const candidatePath = "data/candidates/twii-sanitized-candidate.json";
const docPath = "docs/PHASE_1_TWII_ETF_MISSING_ROWS_BACKFILL_READINESS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const rowCoverage = parseJson(readText(rowCoveragePath), rowCoveragePath);
const aggregateReadonly = parseJson(readText(aggregateReadonlyPath), aggregateReadonlyPath);
const candidate = parseJson(readText(candidatePath), candidatePath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);

expect(artifact.status, "phase_1_twii_etf_missing_rows_backfill_readiness_ready_not_executable", "status");
expect(artifact.packetMode, "phase_1_twii_etf_missing_rows_backfill_readiness", "packetMode");
expect(artifact.recommendation, "prioritize_twii_no_write_candidate_review_before_etf", "recommendation");
expect(artifact.coverage?.expectedTotalRows, rowCoverage.expectedTotalRows, "coverage.expectedTotalRows");
expect(artifact.coverage?.observedTotalRows, rowCoverage.observedTotalRows, "coverage.observedTotalRows");
expect(artifact.coverage?.missingRows, rowCoverage.missingRows, "coverage.missingRows");
expect(artifact.coverage?.missingRows, 178, "coverage.missingRows fixed evidence");

const twiiLane = findLane("TWII");
expect(twiiLane?.observedRows, 0, "TWII.observedRows");
expect(twiiLane?.missingRows, 60, "TWII.missingRows");
expect(twiiLane?.candidateArtifactPath, candidatePath, "TWII.candidateArtifactPath");
expect(twiiLane?.candidateStatus, "present_pending_pm_review", "TWII.candidateStatus");
expect(twiiLane?.nextRoute, "twii_no_write_candidate_review_then_write_gate_preflight", "TWII.nextRoute");
expect(twiiLane?.executionReady, false, "TWII.executionReady");
expect(twiiLane?.writeGateReady, false, "TWII.writeGateReady");

const etfLane = findLane("ETF");
expect(JSON.stringify(etfLane?.symbols), JSON.stringify(["0050", "006208"]), "ETF.symbols");
expect(etfLane?.observedRows, 2, "ETF.observedRows");
expect(etfLane?.missingRows, 118, "ETF.missingRows");
expect(etfLane?.sourceRightsStatus, "blocked_legal_and_redistribution_terms_unapproved", "ETF.sourceRightsStatus");
expect(etfLane?.candidateStatus, "blocked_no_candidate_generation", "ETF.candidateStatus");
expect(etfLane?.nextRoute, "etf_source_rights_and_field_contract_resolution", "ETF.nextRoute");
expect(etfLane?.executionReady, false, "ETF.executionReady");
expect(etfLane?.writeGateReady, false, "ETF.writeGateReady");

const equityLane = findLane("TW_EQUITY");
expect(JSON.stringify(equityLane?.symbols), JSON.stringify(["2330", "2382", "2308"]), "TW_EQUITY.symbols");
expect(equityLane?.observedRows, 180, "TW_EQUITY.observedRows");
expect(equityLane?.missingRows, 0, "TW_EQUITY.missingRows");
expect(equityLane?.nextRoute, "hold_no_backfill_needed", "TW_EQUITY.nextRoute");

for (const [label, flag] of Object.entries({
  "candidate.sanitizedAggregateOnly": candidate.sanitizedAggregateOnly,
  "candidate.rawPayloadIncluded": candidate.rawPayloadIncluded === false,
  "candidate.rowPayloadIncluded": candidate.rowPayloadIncluded === false,
  "candidate.stockIdPayloadIncluded": candidate.stockIdPayloadIncluded === false,
  "candidate.secretsIncluded": candidate.secretsIncluded === false,
  "candidate.expectedRows": candidate.expectedRows === 60,
  "candidate.validationStatus": candidate.aggregateValidation?.validationStatus === "pending_pm_review",
  "aggregateReadonly.noWrite": aggregateReadonly.safety?.supabaseWriteAttempted === false,
  "rowCoverage.noWrite": rowCoverage.safety?.supabaseWriteAttempted === false
})) {
  if (!flag) problems.push(`${label} safety/readiness check failed`);
}

for (const key of [
  "sourceRightsAccepted",
  "targetTableBoundaryAccepted",
  "dryRunReportAccepted",
  "rollbackRetentionAccepted",
  "postRunReviewAccepted"
]) {
  if (!artifact.requiredBeforeAnyWrite?.includes(key)) problems.push(`requiredBeforeAnyWrite missing ${key}`);
}

for (const [key, value] of Object.entries(artifact.safety ?? {})) {
  if (key === "publicDataSource" || key === "scoreSource") continue;
  if (value !== false) problems.push(`safety.${key} must be false`);
}
expect(artifact.safety?.publicDataSource, "mock", "safety.publicDataSource");
expect(artifact.safety?.scoreSource, "mock", "safety.scoreSource");

for (const phrase of [
  "phase_1_twii_etf_missing_rows_backfill_readiness_ready_not_executable",
  "TWII",
  "ETF",
  "178",
  "TWII `0/60`",
  "ETF `2/120`",
  "publicDataSource=mock",
  "scoreSource=mock",
  "No SQL",
  "No Supabase write"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

if (
  packageJson.scripts?.["check:phase-1-twii-etf-missing-rows-backfill-readiness"] !==
  "node scripts/check-phase-1-twii-etf-missing-rows-backfill-readiness.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-twii-etf-missing-rows-backfill-readiness`);
}

if (!reviewGate.includes("scripts/check-phase-1-twii-etf-missing-rows-backfill-readiness.mjs")) {
  problems.push(`${reviewGatePath} missing checker command`);
}
if (!reviewGate.includes('"phase-1-twii-etf-missing-rows-backfill-readiness"')) {
  problems.push(`${reviewGatePath} missing focused gate name`);
}

for (const [label, text] of [
  [artifactPath, artifactRaw],
  [docPath, doc]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${String(pattern)}`);
  }
}

const status = problems.length === 0 ? "ok" : "blocked";
console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: status === "ok" ? artifact.status : "phase_1_twii_etf_missing_rows_backfill_readiness_blocked",
      coverage: artifact.coverage ?? null,
      recommendation: artifact.recommendation ?? null,
      publicDataSource: artifact.safety?.publicDataSource ?? null,
      scoreSource: artifact.safety?.scoreSource ?? null,
      problems
    },
    null,
    2
  )
);
if (status !== "ok") process.exit(1);

function findLane(lane) {
  return (artifact.lanes ?? []).find((item) => item.lane === lane);
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
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

function forbiddenPatterns() {
  return [
    /\bsb_secret_/iu,
    /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
    /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
    /https:\/\/[a-z0-9.-]+supabase/iu,
    /"stock_id"\s*:/u,
    /"rawPayload"\s*:/u,
    /"rowBody"\s*:/u,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
