import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/TWII_BOUNDED_READONLY_PREFLIGHT_SINGLE_ATTEMPT_EXECUTION_PACKET.md";
const boundaryReportPath =
  "scripts/report-twii-bounded-readonly-preflight-real-readonly-runner-boundary.mjs";
const attemptId = "twii-bounded-readonly-preflight-20260609-a";
const confirmationToken = "CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE";
const authorizationPhrase = "CEO_AUTHORIZES_ONE_TWII_BOUNDED_READONLY_PREFLIGHT_ATTEMPT_20260609_A";
const candidateArtifactPath = "data/candidates/twii-sanitized-candidate.json";
const outDir = "tmp/twii-bounded-readonly-preflight-20260609-a";
const boundarySummaryPath = `${outDir}/twii-bounded-readonly-preflight-boundary-${attemptId}.json`;

const problems = [];
const doc = read(docPath);

for (const phrase of [
  "Status: `twii_bounded_readonly_preflight_single_attempt_execution_packet_ready_not_executed`",
  "twii_bounded_readonly_preflight_real_readonly_runner_boundary_ready_no_remote_attempt",
  "ready_for_single_remote_readonly_attempt_authorization_not_executed",
  "twii_bounded_readonly_preflight_real_readonly_boundary_dry_run_ready",
  "accepted_real_readonly_boundary_dry_run_no_remote_attempt",
  authorizationPhrase,
  attemptId,
  confirmationToken,
  candidateArtifactPath,
  "ready_for_one_bounded_readonly_attempt_authorization_not_executed",
  "--dry-run-real-readonly-boundary",
  "--execute",
  "authorization-phrase",
  "No SQL",
  "No Supabase connection in this packet",
  "No Supabase read in this packet",
  "No Supabase write",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const boundary = runJson([boundaryReportPath]);
if (boundary.status !== "twii_bounded_readonly_preflight_real_readonly_runner_boundary_ready_no_remote_attempt") {
  problems.push("real-readonly runner boundary must remain ready no remote attempt");
}
if (boundary.outcome !== "ready_for_single_remote_readonly_attempt_authorization_not_executed") {
  problems.push("real-readonly runner boundary outcome must remain authorization not executed");
}
assertBoundarySafety(boundary.safety, "boundary safety");

const ready = problems.length === 0;
const report = {
  status: ready ? "twii_bounded_readonly_preflight_single_attempt_execution_packet_ready_not_executed" : "blocked",
  outcome: ready ? "ready_for_one_bounded_readonly_attempt_authorization_not_executed" : "blocked",
  docPath,
  attemptId,
  authorizationPhrase,
  confirmationToken,
  candidateArtifactPath,
  outDir,
  preRunBoundaryDryRunCommand:
    "cmd.exe /c npm run run:twii-bounded-readonly-preflight-once -- --attempt-id twii-bounded-readonly-preflight-20260609-a --candidate-artifact-path data\\candidates\\twii-sanitized-candidate.json --mode aggregate-only-readonly --confirm CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE --dry-run-real-readonly-boundary --out-dir tmp\\twii-bounded-readonly-preflight-20260609-a",
  futureExecuteCommand:
    "cmd.exe /c npm run run:twii-bounded-readonly-preflight-once -- --attempt-id twii-bounded-readonly-preflight-20260609-a --candidate-artifact-path data\\candidates\\twii-sanitized-candidate.json --mode aggregate-only-readonly --confirm CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE --execute --authorization-phrase CEO_AUTHORIZES_ONE_TWII_BOUNDED_READONLY_PREFLIGHT_ATTEMPT_20260609_A --out-dir tmp\\twii-bounded-readonly-preflight-20260609-a",
  postRunReviewCommand:
    "cmd.exe /c npm run report:twii-bounded-readonly-preflight-post-run-review -- --summary-path tmp\\twii-bounded-readonly-preflight-20260609-a\\twii-bounded-readonly-preflight-boundary-twii-bounded-readonly-preflight-20260609-a.json",
  boundarySummaryPath,
  nextRecommendedSlice: "twii_bounded_readonly_preflight_authorize_and_run_once_if_ceo_accepts",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlAllowed: false,
    supabaseConnectionAllowedInThisPacket: false,
    supabaseReadAllowedInThisPacket: false,
    supabaseWriteAllowed: false,
    marketDataFetchAllowed: false,
    marketDataIngestAllowed: false,
    dailyPricesMutationAllowed: false,
    stagingRowsAllowed: false,
    candidateRowsAcceptanceAllowed: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutputAllowed: false,
    rowPayloadOutputAllowed: false,
    stockIdPayloadOutputAllowed: false,
    secretOutputAllowed: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ready) process.exit(1);

function runJson(args) {
  const run = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  let parsed = {};
  try {
    parsed = JSON.parse(run.stdout ?? "{}");
  } catch {
    problems.push(`${args[0]} stdout is not valid JSON`);
  }
  if (run.status !== 0) problems.push(`${args[0]} failed`);
  return parsed;
}

function assertBoundarySafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlAllowed",
    "supabaseConnectionAllowedInThisBoundary",
    "supabaseReadAllowedInThisBoundary",
    "supabaseWriteAllowed",
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
    if (safety?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
