import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-a1-tw-equity-candidate-artifact-self-check.mjs";
const checkerPath = "scripts/check-a1-tw-equity-candidate-artifact-self-check.mjs";
const docPath = "docs/A1_TW_EQUITY_CANDIDATE_ARTIFACT_SELF_CHECK.md";
const intakeReportPath = "scripts/report-a1-tw-equity-candidate-artifact-intake.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const reportSource = read(reportPath);
const checkerSource = read(checkerPath);
const doc = read(docPath);
const intakeReport = read(intakeReportPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "a1_tw_equity_candidate_artifact_self_check_blocked_candidate_artifact_not_provided",
  "a1_tw_equity_candidate_artifact_self_check_ready_for_pm_intake_review",
  "A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH",
  "data/candidates/tw-equity-staging-candidate.json",
  "ready_for_pm_intake_review_only",
  "PM intake review",
  "CEO named bounded staging write attempt",
  "sourcePayloadsPrinted: false",
  "rowPayloadsPrinted: false",
  "realSupabaseWrites: false",
  "marketDataFetched: false",
  "marketDataIngested: false",
  "scoreSourceRealAllowed: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const phrase of [
  "A1 TW Equity Candidate Artifact Self-Check",
  "a1_tw_equity_candidate_artifact_self_check_ready_no_candidate_data",
  "node scripts/report-a1-tw-equity-candidate-artifact-self-check.mjs",
  "node scripts/check-a1-tw-equity-candidate-artifact-self-check.mjs",
  "ready_for_pm_intake_review_only",
  "Passing self-check does not authorize staging write execution",
  "No candidate artifact is created in this slice",
  "No market-data fetch, market-data ingestion, Supabase connection, SQL, Supabase write"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

if (!intakeReport.includes("a1_tw_equity_candidate_artifact_accepted_for_pm_execution_review")) {
  problems.push(`${intakeReportPath} missing PM intake accepted status`);
}

for (const phrase of [
  "Latest A1 TW equity candidate artifact self-check slice",
  "docs/A1_TW_EQUITY_CANDIDATE_ARTIFACT_SELF_CHECK.md",
  "scripts/report-a1-tw-equity-candidate-artifact-self-check.mjs",
  "a1_tw_equity_candidate_artifact_self_check_blocked_candidate_artifact_not_provided",
  "A1 can now run the same PM intake contract before handoff",
  "passing self-check only means ready_for_pm_intake_review_only",
  "No candidate artifact, market-data fetch, Supabase connection, SQL, write, staging row, source payload output, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:a1-tw-equity-candidate-artifact-self-check"] !== `node ${reportPath}`) {
  problems.push("package.json missing report:a1-tw-equity-candidate-artifact-self-check");
}
if (pkg.scripts?.["check:a1-tw-equity-candidate-artifact-self-check"] !== `node ${checkerPath}`) {
  problems.push("package.json missing check:a1-tw-equity-candidate-artifact-self-check");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes(checkerPath)) {
    problems.push(`${pathName} missing A1 candidate artifact self-check checker`);
  }
  if (!text.includes("a1-tw-equity-candidate-artifact-self-check")) {
    problems.push(`${pathName} missing a1-tw-equity-candidate-artifact-self-check name`);
  }
}

if (!reviewGate.includes('"a1-tw-equity-candidate-artifact-self-check"')) {
  problems.push("review gate core set missing a1-tw-equity-candidate-artifact-self-check");
}

for (const [pathName, text] of [
  [reportPath, reportSource],
  [docPath, doc]
]) {
  for (const pattern of [
    /\bfetch\s*\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /await import\("@supabase\/supabase-js"\)/u,
    /sb_secret_/u,
    /sb_publishable_/u
  ]) {
    if (pattern.test(text)) problems.push(`${pathName} contains forbidden token: ${pattern}`);
  }
}

const result = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: {
    ...process.env,
    A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH: "__missing__/candidate.json"
  },
  shell: false
});

if (result.status !== 0) problems.push(`${reportPath} must exit 0 even when candidate is missing`);
const report = parseJson(result.stdout);
if (report.status !== "a1_tw_equity_candidate_artifact_self_check_blocked_candidate_artifact_not_provided") {
  problems.push("missing artifact self-check must be blocked_candidate_artifact_not_provided");
}
if (report.candidateArtifactProvided !== false) problems.push("self-check missing artifact must not claim provided artifact");
if (report.readyForPmIntakeReview !== false) problems.push("self-check missing artifact must not claim PM readiness");
if (report.authorizationBoundary?.stagingWriteExecutionAllowed !== false) {
  problems.push("self-check must not authorize staging write execution");
}
if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
  problems.push("self-check safety must keep publicDataSource and scoreSource mock");
}
for (const key of [
  "sqlExecuted",
  "realSupabaseConnectionAttempted",
  "realSupabaseWrites",
  "stagingRowsCreated",
  "dailyPricesMutated",
  "marketDataFetched",
  "marketDataIngested",
  "sourcePayloadsPrinted",
  "rowPayloadsPrinted",
  "secretsPrinted",
  "serviceRoleKeyPrinted",
  "publicPromotionAllowed",
  "rowCoveragePointsAllowed",
  "scoreSourceRealAllowed"
]) {
  if (report.safety?.[key] !== false) problems.push(`self-check safety ${key} must be false`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push("report output is not valid JSON");
    return {};
  }
}
