import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TWII_REPORT_ONLY_DRY_RUN_CHAIN_GATE.md";
const recordPath = "data/source-gates/twii-report-only-dry-run-chain-gate.json";
const pmIntakeRecordPath = "data/source-gates/twii-sanitized-candidate-artifact-pm-intake.json";
const candidatePath = "data/candidates/twii-sanitized-candidate.json";
const reportPath = "scripts/report-twii-report-only-dry-run-chain-gate.mjs";
const checkerPath = "scripts/check-twii-report-only-dry-run-chain-gate.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const record = readJson(recordPath);
const pmIntake = readJson(pmIntakeRecordPath);
const candidate = readJson(candidatePath);
const reportSource = read(reportPath);
const status = read(statusPath);
const pkg = readJson(packagePath);
const reviewGate = read(reviewGatePath);
const report = runJson(reportPath);

const forbiddenPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env\.SUPABASE/u,
  /SQL is approved/iu,
  /Supabase write is approved/iu,
  /daily_prices mutation is approved/iu,
  /market-data fetch is approved/iu,
  /row coverage scoring is approved/iu,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
];

for (const phrase of [
  "Status: `twii_report_only_dry_run_chain_gate_completed_no_write_aggregate_only`",
  "Decision: `accept_twii_report_only_dry_run_chain_gate_for_next_execution_packet_readiness_only`",
  "PM intake status: `twii_sanitized_candidate_artifact_pm_intake_accepted_for_no_write_dry_run_chain`",
  "Candidate artifact path: `data/candidates/twii-sanitized-candidate.json`",
  "Executed local reports: `decision-gate`, `local-runner`, `post-run-review`",
  "Next PM route: `twii_bounded_execution_packet_readiness_gate`",
  "publicDataSource remains `mock`",
  "scoreSource remains `mock`",
  "This chain gate does not authorize SQL, Supabase connection, Supabase read/write, staging rows, `daily_prices` mutation, market-data fetch, source-derived candidate row generation, row coverage scoring, public source promotion, or real scoring."
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

const expectedRecord = {
  status: "twii_report_only_dry_run_chain_gate_completed_no_write_aggregate_only",
  decision: "accept_twii_report_only_dry_run_chain_gate_for_next_execution_packet_readiness_only",
  acceptedScope: "report_only_no_write_chain_gate_only",
  candidateArtifactPath: candidatePath,
  pmIntakeStatus: "twii_sanitized_candidate_artifact_pm_intake_accepted_for_no_write_dry_run_chain",
  decisionGateStatus: "twii_report_only_dry_run_decision_gate_ready_for_named_attempt_decision",
  localRunnerStatus: "twii_report_only_local_runner_completed_aggregate_only",
  postRunReviewStatus: "twii_report_only_local_runner_post_run_review_completed_aggregate_only",
  expectedRows: 60,
  candidateRows: 60,
  duplicateRows: 0,
  rejectedRows: 0,
  missingRows: 0,
  publicDataSource: "mock",
  scoreSource: "mock",
  twiiExecutionAllowedNow: false,
  nextPMRoute: "twii_bounded_execution_packet_readiness_gate",
  sqlAllowed: false,
  supabaseAllowed: false,
  dailyPricesMutationAllowed: false,
  marketDataFetchAllowed: false,
  sourceDerivedCandidateGenerationAllowed: false,
  rowCoverageAwardAllowed: false,
  runtimePromotionAllowed: false
};

for (const [key, expected] of Object.entries(expectedRecord)) {
  if (record?.[key] !== expected) {
    problems.push(`${recordPath} expected ${key}=${JSON.stringify(expected)} but found ${JSON.stringify(record?.[key])}`);
  }
}

if (pmIntake?.status !== expectedRecord.pmIntakeStatus) {
  problems.push(`${pmIntakeRecordPath} must be accepted for no-write dry-run chain`);
}
if (candidate?.artifactId !== "twii-sanitized-candidate-20260609") problems.push(`${candidatePath} artifactId mismatch`);
if (candidate?.aggregateValidation?.candidateRows !== 60) problems.push(`${candidatePath} candidateRows must be 60`);
for (const flag of ["rawPayloadIncluded", "rowPayloadIncluded", "stockIdPayloadIncluded", "secretsIncluded"]) {
  if (candidate?.[flag] !== false) problems.push(`${candidatePath} ${flag} must be false`);
}

for (const phrase of [
  "twii_report_only_dry_run_chain_gate_completed_no_write_aggregate_only",
  "scripts/report-twii-report-only-dry-run-decision-gate.mjs",
  "scripts/report-twii-report-only-local-runner.mjs",
  "scripts/report-twii-report-only-local-runner-post-run-review.mjs",
  "A1_TWII_CANDIDATE_ARTIFACT_PATH",
  "twiiExecutionAllowedNow: false",
  "sqlAllowed: false",
  "supabaseAllowed: false",
  "dailyPricesMutationAllowed: false",
  "marketDataFetchAllowed: false",
  "rowCoverageAwardAllowed: false",
  "runtimePromotionAllowed: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing phrase: ${phrase}`);
}

if (report?.status !== expectedRecord.status) problems.push(`${reportPath} must report ${expectedRecord.status}`);
if (report?.candidateArtifactPath !== candidatePath) problems.push(`${reportPath} candidateArtifactPath mismatch`);
if (report?.pmIntakeStatus !== expectedRecord.pmIntakeStatus) problems.push(`${reportPath} pmIntakeStatus mismatch`);
if (report?.decisionGateStatus !== expectedRecord.decisionGateStatus) problems.push(`${reportPath} decisionGateStatus mismatch`);
if (report?.localRunnerStatus !== expectedRecord.localRunnerStatus) problems.push(`${reportPath} localRunnerStatus mismatch`);
if (report?.postRunReviewStatus !== expectedRecord.postRunReviewStatus) problems.push(`${reportPath} postRunReviewStatus mismatch`);
if (report?.candidateRows !== 60) problems.push(`${reportPath} candidateRows must be 60`);
assertSafety(report, "report output");

for (const [path, source, phrase] of [
  [statusPath, status, "TWII Report-Only Dry-Run Chain Gate"],
  [statusPath, status, expectedRecord.status],
  [reviewGatePath, reviewGate, checkerPath],
  [reviewGatePath, reviewGate, "twii-report-only-dry-run-chain-gate"]
]) {
  if (!source.includes(phrase)) problems.push(`${path} missing phrase: ${phrase}`);
}

if (pkg?.scripts?.["report:twii-report-only-dry-run-chain-gate"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-report-only-dry-run-chain-gate script`);
}
if (pkg?.scripts?.["check:twii-report-only-dry-run-chain-gate"] !== `node ${checkerPath}`) {
  problems.push(`${packagePath} missing check:twii-report-only-dry-run-chain-gate script`);
}

for (const [path, source] of [
  [docPath, doc],
  [recordPath, fs.existsSync(recordPath) ? fs.readFileSync(recordPath, "utf8") : ""],
  [reportPath, reportSource],
  ["report output", JSON.stringify(report ?? {})]
]) {
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source)) problems.push(`${path} contains forbidden pattern: ${pattern}`);
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: record.status,
      candidateArtifactPath: record.candidateArtifactPath,
      candidateRows: record.candidateRows,
      nextPMRoute: record.nextPMRoute,
      publicDataSource: record.publicDataSource,
      scoreSource: record.scoreSource,
      twiiExecutionAllowedNow: record.twiiExecutionAllowedNow,
      problems: []
    },
    null,
    2
  )
);

function assertSafety(source, label) {
  if (source?.publicDataSource !== "mock" || source?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "twiiExecutionAllowedNow",
    "sqlAllowed",
    "supabaseAllowed",
    "dailyPricesMutationAllowed",
    "marketDataFetchAllowed",
    "sourceDerivedCandidateGenerationAllowed",
    "rowCoverageAwardAllowed",
    "runtimePromotionAllowed"
  ]) {
    if (source?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`${filePath} invalid JSON: ${error.message}`);
    return null;
  }
}

function runJson(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return null;
  }
  const result = spawnSync(process.execPath, [filePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (result.status !== 0) {
    problems.push(`${filePath} failed with exit ${result.status}: ${result.stderr || result.stdout}`);
    return null;
  }
  const start = result.stdout.indexOf("{");
  if (start < 0) {
    problems.push(`${filePath} did not print JSON`);
    return null;
  }
  try {
    return JSON.parse(result.stdout.slice(start));
  } catch (error) {
    problems.push(`${filePath} output invalid JSON: ${error.message}`);
    return null;
  }
}
