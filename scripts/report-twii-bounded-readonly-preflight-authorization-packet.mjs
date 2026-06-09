import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/TWII_BOUNDED_READONLY_PREFLIGHT_AUTHORIZATION_PACKET.md";
const runnerStubReportPath = "scripts/report-twii-bounded-readonly-preflight-runner-stub.mjs";
const candidateDesignReportPath = "scripts/report-twii-bounded-readonly-preflight-candidate-design.mjs";
const attemptId = "twii-bounded-readonly-preflight-20260609-a";
const confirmationToken = "CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE";
const candidateArtifactPath = "data/candidates/twii-sanitized-candidate.json";
const summaryPath =
  "tmp/twii-bounded-readonly-preflight-20260609-a/twii-bounded-readonly-preflight-stub-twii-bounded-readonly-preflight-20260609-a.json";

const problems = [];
const doc = read(docPath);

for (const phrase of [
  "Status: `twii_bounded_readonly_preflight_authorization_packet_ready_not_executed`",
  "twii_bounded_readonly_preflight_runner_stub_ready_fail_closed",
  "twii_bounded_readonly_preflight_candidate_design_ready",
  attemptId,
  confirmationToken,
  candidateArtifactPath,
  "ready_for_ceo_single_bounded_readonly_authorization_not_executed",
  "No SQL",
  "No Supabase connection in this packet",
  "No Supabase write",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const runnerStub = runJson([runnerStubReportPath]);
if (runnerStub.status !== "twii_bounded_readonly_preflight_runner_stub_ready_fail_closed") {
  problems.push("runner stub must remain ready fail-closed");
}
if (runnerStub.outcome !== "accepted_fail_closed_runner_stub_no_remote_attempt") {
  problems.push("runner stub outcome must remain accepted fail-closed");
}
assertRunnerStubSafety(runnerStub.safety, "runner stub safety");

const candidateDesign = runJson([candidateDesignReportPath]);
if (candidateDesign.status !== "twii_bounded_readonly_preflight_candidate_design_ready") {
  problems.push("candidate design must remain ready");
}
if (candidateDesign.outcome !== "accepted_as_design_only_readonly_preflight_candidate") {
  problems.push("candidate design outcome must remain design-only accepted");
}
assertCandidateDesignSafety(candidateDesign.safety, "candidate design safety");

const ready = problems.length === 0;
const report = {
  status: ready ? "twii_bounded_readonly_preflight_authorization_packet_ready_not_executed" : "blocked",
  outcome: ready ? "ready_for_ceo_single_bounded_readonly_authorization_not_executed" : "blocked",
  docPath,
  attemptId,
  confirmationToken,
  candidateArtifactPath,
  mode: "aggregate-only-readonly",
  executionCommand:
    "cmd.exe /c npm run run:twii-bounded-readonly-preflight-once -- --attempt-id twii-bounded-readonly-preflight-20260609-a --candidate-artifact-path data\\candidates\\twii-sanitized-candidate.json --mode aggregate-only-readonly --confirm CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE --out-dir tmp\\twii-bounded-readonly-preflight-20260609-a",
  postRunReviewCommand:
    "cmd.exe /c npm run report:twii-bounded-readonly-preflight-post-run-review -- --summary-path tmp\\twii-bounded-readonly-preflight-20260609-a\\twii-bounded-readonly-preflight-stub-twii-bounded-readonly-preflight-20260609-a.json",
  postRunReviewRequired: true,
  summaryPath,
  nextDecision:
    "CEO/Chairman may explicitly authorize exactly one bounded readonly attempt in a separate execution slice.",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlAllowed: false,
    supabaseConnectionAllowedInThisPacket: false,
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

function assertRunnerStubSafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlAllowed",
    "supabaseConnectionAllowed",
    "supabaseReadAllowedByThisStub",
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

function assertCandidateDesignSafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlAllowed",
    "supabaseConnectionAllowedInThisDesign",
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
