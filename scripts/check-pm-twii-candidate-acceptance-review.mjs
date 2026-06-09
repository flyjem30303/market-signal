import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];
const docPath = "docs/PM_TWII_CANDIDATE_ACCEPTANCE_REVIEW.md";
const reportPath = "scripts/report-pm-twii-candidate-acceptance-review.mjs";
const checkerPath = "scripts/check-pm-twii-candidate-acceptance-review.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

for (const phrase of ["PM TWII Candidate Acceptance Review", "pm_twii_candidate_acceptance_review_ready_local_only", "pm_twii_candidate_acceptance_review_ready_for_later_bounded_data_acceptance_route", "No remote TWII probe, market-data retrieval, market-data ingestion, Supabase connection/read/write, SQL"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
for (const phrase of ["pm_twii_candidate_acceptance_review_ready_for_later_bounded_data_acceptance_route", "pm_twii_candidate_acceptance_review_blocked_candidate_acceptance_gate_not_ready", "candidateRowsAcceptedNow: false", "rowCoverageScoringAllowed: false", "scoreSourceRealAllowed: false"]) if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
if (pkg.scripts?.["report:pm-twii-candidate-acceptance-review"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:pm-twii-candidate-acceptance-review"] !== `node ${checkerPath}`) problems.push(`${packagePath} missing check script`);
for (const phrase of ["docs/PM_TWII_CANDIDATE_ACCEPTANCE_REVIEW.md", "scripts/report-pm-twii-candidate-acceptance-review.mjs", "pm_twii_candidate_acceptance_review_ready_for_later_bounded_data_acceptance_route"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
for (const phrase of ["`docs/PM_TWII_CANDIDATE_ACCEPTANCE_REVIEW.md` is `accepted` as PM TWII candidate acceptance review", "pm_twii_candidate_acceptance_review_ready_local_only"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
for (const phrase of ["scripts/check-pm-twii-candidate-acceptance-review.mjs", "name: \"pm-twii-candidate-acceptance-review\"", "\"pm-twii-candidate-acceptance-review\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);

const missingResult = runReport("__missing__/twii-candidate.json");
if (missingResult.output.status !== "pm_twii_candidate_acceptance_review_blocked_candidate_acceptance_gate_not_ready") problems.push("missing artifact must block PM review");
assertSafety(missingResult.output, "missing PM review");
const fixtureResult = runWithFixture();
if (fixtureResult.output.status !== "pm_twii_candidate_acceptance_review_ready_for_later_bounded_data_acceptance_route") problems.push("fixture must ready PM review");
if (fixtureResult.output.decisionReady !== true) problems.push("fixture PM review decisionReady must be true");
assertSafety(fixtureResult.output, "fixture PM review");
scanForbidden([[docPath, doc], [reportPath, reportSource], ["fixture output", JSON.stringify(fixtureResult.output)]]);

if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: "pm_twii_candidate_acceptance_review_ready_local_only" }, null, 2));

function runReport(inputPath) {
  const result = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", env: { ...process.env, A1_TWII_CANDIDATE_ARTIFACT_PATH: inputPath }, shell: false, timeout: 120000, windowsHide: true });
  return { statusCode: result.status ?? 1, output: parseJson(result.stdout ?? "") };
}
function runWithFixture() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "twii-pm-acceptance-"));
  const fixturePath = path.join(tempDir, "candidate.json");
  fs.writeFileSync(fixturePath, JSON.stringify(validFixture(), null, 2));
  const result = runReport(fixturePath);
  fs.rmSync(tempDir, { recursive: true, force: true });
  return result;
}
function assertSafety(output, label) {
  if (output.authorizationBoundary?.candidateRowsAcceptedNow !== false) problems.push(`${label} must not accept rows`);
  if (output.authorizationBoundary?.rowCoverageScoringAllowed !== false) problems.push(`${label} must not score coverage`);
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") problems.push(`${label} must stay mock/mock`);
  for (const key of ["remoteTwiiProbeExecuted", "candidateArtifactCreated", "sourceDerivedCandidateRowsCreated", "sqlExecuted", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "stagingRowsCreated", "dailyPricesMutated", "marketDataFetched", "marketDataIngested", "sourcePayloadsPrinted", "rowPayloadsPrinted", "stockIdPayloadsPrinted", "secretsPrinted", "serviceRoleKeyPrinted", "publicPromotionAllowed", "rowCoveragePointsAllowed", "scoreSourceRealAllowed"]) if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
}
function validFixture() {
  return { artifactId: "twii-pm-acceptance-fixture", lane: "TWII", assetType: "index", symbol: "TWII", scope: "twii_index_daily_prices_missing_rows", sourceLane: "licensed-market-data-vendor", sourceRightsGateStatus: "twii_source_rights_outcome_gate_candidate_ready_for_pm_review", fieldContractVersion: "twii-v1", coverageWindowSessions: 60, alreadyObservedRows: 0, candidateMissingRows: 60, expectedRows: 60, reviewOutputPolicy: "aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads", sanitizedAggregateOnly: true, rawPayloadIncluded: false, rowPayloadIncluded: false, stockIdPayloadIncluded: false, secretsIncluded: false, aggregateValidation: { expectedRows: 60, candidateRows: 60, duplicateRows: 0, rejectedRows: 0, missingRows: 0, fieldNames: ["trade_date", "index_close", "source_row_hash"], validationStatus: "pending_pm_review" } };
}
function read(filePath) { if (!fs.existsSync(filePath)) { problems.push(`missing file: ${filePath}`); return ""; } return fs.readFileSync(filePath, "utf8"); }
function parseJson(text) { try { return JSON.parse(text); } catch { problems.push("report output is not valid JSON"); return {}; } }
function scanForbidden(entries) {
  for (const [filePath, text] of entries) for (const pattern of [/\bfetch\s*\(/u, /@supabase\/supabase-js/u, /createClient/u, /\.from\(/u, /\.insert\(/u, /\.update\(/u, /\.delete\(/u, /\.upsert\(/u, /publicDataSource":\s*"supabase"/u, /scoreSource":\s*"real"/u]) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
}
