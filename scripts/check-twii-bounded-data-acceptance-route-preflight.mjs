import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TWII_BOUNDED_DATA_ACCEPTANCE_ROUTE_PREFLIGHT.md";
const packetPath = "docs/TWII_BOUNDED_DATA_ACCEPTANCE_AUTHORIZATION_PACKET.md";
const reportPath = "scripts/report-twii-bounded-data-acceptance-route-preflight.mjs";
const checkerPath = "scripts/check-twii-bounded-data-acceptance-route-preflight.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const packet = read(packetPath);
const reportSource = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "TWII Bounded Data Acceptance Route Preflight",
  "twii_bounded_data_acceptance_route_preflight_ready_local_only",
  "twii_bounded_data_acceptance_route_preflight_blocked_candidate_acceptance_review_not_ready",
  "twii_bounded_data_acceptance_route_preflight_ready_for_authorization_packet",
  "does not execute that attempt",
  "No remote TWII probe, market-data retrieval, market-data ingestion, Supabase connection/read/write, SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "TWII Bounded Data Acceptance Authorization Packet",
  "twii_bounded_data_acceptance_authorization_packet_ready_local_only",
  "`acceptanceMode=bounded_data_acceptance_attempt`",
  "`maxCandidateRows=60`",
  "`targetLane=TWII`",
  "`rowCoverageScoringAllowed=false`",
  "`publicPromotionAllowed=false`",
  "`scoreSourceRealAllowed=false`"
]) {
  if (!packet.includes(phrase)) problems.push(`${packetPath} missing: ${phrase}`);
}

for (const phrase of [
  "twii_bounded_data_acceptance_route_preflight_ready_for_authorization_packet",
  "twii_bounded_data_acceptance_route_preflight_blocked_candidate_acceptance_review_not_ready",
  "ready_for_authorization_packet_only",
  "dataAcceptanceAttemptAllowedNow: false",
  "candidateRowsAcceptedNow: false",
  "rowCoverageScoringAllowed: false",
  "supabaseOperationAllowed: false",
  "candidateRowsAccepted: false",
  "scoreSourceRealAllowed: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:twii-bounded-data-acceptance-route-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-bounded-data-acceptance-route-preflight"] !== `node ${checkerPath}`) problems.push(`${packagePath} missing check script`);

for (const phrase of [
  "Latest TWII bounded data acceptance route preflight slice",
  "docs/TWII_BOUNDED_DATA_ACCEPTANCE_ROUTE_PREFLIGHT.md",
  "docs/TWII_BOUNDED_DATA_ACCEPTANCE_AUTHORIZATION_PACKET.md",
  "scripts/report-twii-bounded-data-acceptance-route-preflight.mjs",
  "twii_bounded_data_acceptance_route_preflight_ready_for_authorization_packet"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_DATA_ACCEPTANCE_ROUTE_PREFLIGHT.md` is `accepted` as TWII bounded data acceptance route preflight",
  "`docs/TWII_BOUNDED_DATA_ACCEPTANCE_AUTHORIZATION_PACKET.md` is `accepted` as TWII bounded data acceptance authorization packet",
  "twii_bounded_data_acceptance_route_preflight_ready_local_only"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-data-acceptance-route-preflight.mjs",
  "name: \"twii-bounded-data-acceptance-route-preflight\"",
  "\"twii-bounded-data-acceptance-route-preflight\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const missingResult = runReport("__missing__/twii-candidate.json");
if (missingResult.output.status !== "twii_bounded_data_acceptance_route_preflight_blocked_candidate_acceptance_review_not_ready") problems.push("missing artifact must block preflight");
assertSafety(missingResult.output, "missing preflight");

const fixtureResult = runWithFixture();
if (fixtureResult.output.status !== "twii_bounded_data_acceptance_route_preflight_ready_for_authorization_packet") problems.push("fixture must ready preflight");
if (fixtureResult.output.routeReadiness?.readyForAuthorizationPacket !== true) problems.push("fixture route must be ready for authorization packet");
assertSafety(fixtureResult.output, "fixture preflight");

scanForbidden([[docPath, doc], [packetPath, packet], [reportPath, reportSource], ["fixture output", JSON.stringify(fixtureResult.output)]]);

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status: "ok", guardedStatus: "twii_bounded_data_acceptance_route_preflight_ready_local_only" }, null, 2));

function runReport(inputPath) {
  const result = spawnSync(process.execPath, [reportPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, A1_TWII_CANDIDATE_ARTIFACT_PATH: inputPath },
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  return { statusCode: result.status ?? 1, output: parseJson(result.stdout ?? "") };
}

function runWithFixture() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "twii-acceptance-preflight-"));
  const fixturePath = path.join(tempDir, "candidate.json");
  fs.writeFileSync(fixturePath, JSON.stringify(validFixture(), null, 2));
  const result = runReport(fixturePath);
  fs.rmSync(tempDir, { recursive: true, force: true });
  return result;
}

function assertSafety(output, label) {
  if (output.authorizationBoundary?.dataAcceptanceAttemptAllowedNow !== false) problems.push(`${label} must not allow data acceptance attempt now`);
  if (output.authorizationBoundary?.candidateRowsAcceptedNow !== false) problems.push(`${label} must not accept rows`);
  if (output.authorizationBoundary?.rowCoverageScoringAllowed !== false) problems.push(`${label} must not score coverage`);
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") problems.push(`${label} must stay mock/mock`);
  for (const key of ["remoteTwiiProbeExecuted", "candidateArtifactCreated", "sourceDerivedCandidateRowsCreated", "sqlExecuted", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "stagingRowsCreated", "dailyPricesMutated", "marketDataFetched", "marketDataIngested", "sourcePayloadsPrinted", "rowPayloadsPrinted", "stockIdPayloadsPrinted", "secretsPrinted", "serviceRoleKeyPrinted", "candidateRowsAccepted", "publicPromotionAllowed", "rowCoveragePointsAllowed", "scoreSourceRealAllowed"]) {
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
  }
}

function validFixture() {
  return { artifactId: "twii-bounded-preflight-fixture", lane: "TWII", assetType: "index", symbol: "TWII", scope: "twii_index_daily_prices_missing_rows", sourceLane: "licensed-market-data-vendor", sourceRightsGateStatus: "twii_source_rights_outcome_gate_candidate_ready_for_pm_review", fieldContractVersion: "twii-v1", coverageWindowSessions: 60, alreadyObservedRows: 0, candidateMissingRows: 60, expectedRows: 60, reviewOutputPolicy: "aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads", sanitizedAggregateOnly: true, rawPayloadIncluded: false, rowPayloadIncluded: false, stockIdPayloadIncluded: false, secretsIncluded: false, aggregateValidation: { expectedRows: 60, candidateRows: 60, duplicateRows: 0, rejectedRows: 0, missingRows: 0, fieldNames: ["trade_date", "index_close", "source_row_hash"], validationStatus: "pending_pm_review" } };
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text) {
  try { return JSON.parse(text); } catch { problems.push("report output is not valid JSON"); return {}; }
}

function scanForbidden(entries) {
  for (const [filePath, text] of entries) {
    for (const pattern of [/\bfetch\s*\(/u, /@supabase\/supabase-js/u, /createClient/u, /\.from\(/u, /\.insert\(/u, /\.update\(/u, /\.delete\(/u, /\.upsert\(/u, /publicDataSource":\s*"supabase"/u, /scoreSource":\s*"real"/u]) {
      if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
    }
  }
}
