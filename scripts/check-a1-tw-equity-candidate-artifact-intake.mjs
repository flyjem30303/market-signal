import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-a1-tw-equity-candidate-artifact-intake.mjs";
const checkerPath = "scripts/check-a1-tw-equity-candidate-artifact-intake.mjs";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const reportSource = read(reportPath);
const checkerSource = read(checkerPath);
const runner = read(runnerPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "a1_tw_equity_candidate_artifact_intake_blocked_candidate_artifact_not_provided",
  "a1_tw_equity_candidate_artifact_accepted_for_pm_execution_review",
  "A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH",
  "data/candidates/tw-equity-staging-candidate.json",
  "A1 must provide the sanitized candidate artifact",
  "CEO may review whether to name exactly one bounded staging write attempt",
  "sourcePayloadIncluded",
  "sourceUrlPayloadIncluded",
  "secretsIncluded",
  "candidateRun",
  "candidatePrices",
  "rawSourcePayload",
  "sourcePayload",
  "rawRows",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "realSupabaseWrites: false",
  "marketDataFetched: false",
  "marketDataIngested: false",
  "scoreSourceRealAllowed: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const phrase of [
  "validateCandidateInputArtifact",
  "candidateInputAccepted",
  "candidatePrices",
  "sourcePayloadIncluded"
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest A1 TW equity candidate artifact intake slice",
  "scripts/report-a1-tw-equity-candidate-artifact-intake.mjs",
  "a1_tw_equity_candidate_artifact_intake_blocked_candidate_artifact_not_provided",
  "PM now has a local intake gate for A1 candidate artifacts",
  "default candidate path is `data/candidates/tw-equity-staging-candidate.json`",
  "No candidate artifact, market-data fetch, Supabase connection, SQL, write, staging row, source payload output, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:a1-tw-equity-candidate-artifact-intake"] !== "node scripts/report-a1-tw-equity-candidate-artifact-intake.mjs") {
  problems.push("package.json missing report:a1-tw-equity-candidate-artifact-intake");
}
if (pkg.scripts?.["check:a1-tw-equity-candidate-artifact-intake"] !== "node scripts/check-a1-tw-equity-candidate-artifact-intake.mjs") {
  problems.push("package.json missing check:a1-tw-equity-candidate-artifact-intake");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-a1-tw-equity-candidate-artifact-intake.mjs")) {
    problems.push(`${pathName} missing A1 TW equity candidate artifact intake checker`);
  }
  if (!text.includes("a1-tw-equity-candidate-artifact-intake")) {
    problems.push(`${pathName} missing a1-tw-equity-candidate-artifact-intake name`);
  }
}

if (!reviewGate.includes('"a1-tw-equity-candidate-artifact-intake"')) {
  problems.push("review gate core set missing a1-tw-equity-candidate-artifact-intake");
}

for (const [pathName, text] of [[reportPath, reportSource]]) {
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
if (report.status !== "a1_tw_equity_candidate_artifact_intake_blocked_candidate_artifact_not_provided") {
  problems.push("missing artifact report must be blocked_candidate_artifact_not_provided");
}
if (report.candidateArtifactProvided !== false) problems.push("missing artifact report must not claim provided artifact");
if (report.candidateArtifactAccepted !== false) problems.push("missing artifact report must not claim accepted artifact");
if (report.validation?.connectionAttempted !== false) problems.push("missing artifact intake must not connect");
if (report.validation?.writeAttempted !== false) problems.push("missing artifact intake must not write");
if (report.validation?.mutations !== false) problems.push("missing artifact intake must not mutate");
if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
  problems.push("intake safety must keep publicDataSource and scoreSource mock");
}
for (const key of [
  "sqlExecuted",
  "realSupabaseConnectionAttempted",
  "realSupabaseWrites",
  "stagingRowsCreated",
  "dailyPricesMutated",
  "marketDataFetched",
  "marketDataIngested",
  "rawPayloadsPrinted",
  "rowPayloadsPrinted",
  "secretsPrinted",
  "serviceRoleKeyPrinted",
  "publicPromotionAllowed",
  "rowCoveragePointsAllowed",
  "scoreSourceRealAllowed"
]) {
  if (report.safety?.[key] !== false) problems.push(`intake safety ${key} must be false`);
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
