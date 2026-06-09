import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const docPath = "docs/TWII_CANDIDATE_ACCEPTANCE_PREPARATION.md";
const reportPath = "scripts/report-twii-candidate-acceptance-preparation.mjs";
const checkerPath = "scripts/check-twii-candidate-acceptance-preparation.mjs";
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

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "", "candidate acceptance preparation stdout");
if (run.status !== 0) problems.push("candidate acceptance preparation report must exit 0");
if (report.status !== "twii_candidate_acceptance_preparation_ready") {
  problems.push("candidate acceptance preparation report must be ready");
}
if (report.outcome !== "ready_for_bounded_data_acceptance_authorization_packet") {
  problems.push("candidate acceptance preparation outcome must be ready for authorization packet");
}
assertSafety(report, "candidate acceptance preparation");

if (pkg.scripts?.["report:twii-candidate-acceptance-preparation"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-candidate-acceptance-preparation`);
}
if (pkg.scripts?.["check:twii-candidate-acceptance-preparation"] !== `node ${checkerPath}`) {
  problems.push(`${packagePath} missing check:twii-candidate-acceptance-preparation`);
}

for (const phrase of [
  "TWII Candidate Acceptance Preparation",
  "twii_candidate_acceptance_preparation_ready",
  "ready_for_bounded_data_acceptance_authorization_packet",
  "data\\candidates\\twii-sanitized-candidate.json",
  "No candidate row acceptance",
  "No row coverage scoring",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII candidate acceptance preparation slice",
  "docs/TWII_CANDIDATE_ACCEPTANCE_PREPARATION.md",
  "twii_candidate_acceptance_preparation_ready",
  "ready_for_bounded_data_acceptance_authorization_packet"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_CANDIDATE_ACCEPTANCE_PREPARATION.md` is `accepted` as TWII candidate acceptance preparation",
  "twii_candidate_acceptance_preparation_ready"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-candidate-acceptance-preparation.mjs",
  "name: \"twii-candidate-acceptance-preparation\"",
  "\"twii-candidate-acceptance-preparation\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

scanForbidden([
  [docPath, doc],
  [reportPath, reportSource],
  ["candidate acceptance preparation stdout", run.stdout ?? ""]
]);

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "twii_candidate_acceptance_preparation_ready"
    },
    null,
    2
  )
);

function assertSafety(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseWriteAttempted",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
  }
}

function scanForbidden(entries) {
  for (const [filePath, text] of entries) {
    for (const pattern of [
      /@supabase\/supabase-js/u,
      /createClient/u,
      /\.from\(/u,
      /\.insert\(/u,
      /\.update\(/u,
      /\.delete\(/u,
      /\.upsert\(/u,
      /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
      /publicDataSource=supabase is approved/u,
      /scoreSource=real is approved/u,
      /SQL execution is approved/u,
      /Supabase writes are approved/u,
      /row coverage scoring is approved/u
    ]) {
      if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
    }
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
