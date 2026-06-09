import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const designPath = "docs/TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_RUNNER_DESIGN.md";
const templatePath = "docs/TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_POST_RUN_REVIEW_TEMPLATE.md";
const docPath = "docs/PM_TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_RUNNER_READINESS.md";
const reportPath = "scripts/report-pm-twii-bounded-data-acceptance-attempt-runner-readiness.mjs";
const checkerPath = "scripts/check-pm-twii-bounded-data-acceptance-attempt-runner-readiness.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const design = read(designPath);
const template = read(templatePath);
const doc = read(docPath);
const reportSource = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "TWII Bounded Data Acceptance Attempt Runner Design",
  "twii_bounded_data_acceptance_attempt_runner_design_ready_no_execution",
  "mode no-write-preview",
  "candidateRowsAcceptedNow=false",
  "dailyPricesMutated=false",
  "supabaseConnectionAttempted=false",
  "sqlExecuted=false",
  "rowCoverageScoringAllowed=false",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!design.includes(phrase)) problems.push(`${designPath} missing: ${phrase}`);
}

for (const phrase of [
  "TWII Bounded Data Acceptance Attempt Post-Run Review Template",
  "twii_bounded_data_acceptance_attempt_post_run_review_template_ready",
  "`candidateRowsAcceptedNow=false`",
  "`dailyPricesMutated=false`",
  "`supabaseConnectionAttempted=false`",
  "`sqlExecuted=false`",
  "`rowCoverageScoringAllowed=false`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]) {
  if (!template.includes(phrase)) problems.push(`${templatePath} missing: ${phrase}`);
}

for (const phrase of [
  "PM TWII Bounded Data Acceptance Attempt Runner Readiness",
  "pm_twii_bounded_data_acceptance_attempt_runner_readiness_ready_no_execution",
  "Ready means PM may propose a later implementation GOAL for a no-write preview runner",
  "No TWII bounded data acceptance attempt is implemented or executed in this slice"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "pm_twii_bounded_data_acceptance_attempt_runner_readiness_ready_no_execution",
  "pm_twii_bounded_data_acceptance_attempt_runner_readiness_blocked_contract_incomplete",
  "ready_for_later_no_write_preview_runner_implementation_goal_only",
  "runnerImplementedNow: false",
  "runnerExecutionAllowedNow: false",
  "dataAcceptanceAttemptAllowedNow: false",
  "candidateRowsAcceptedNow: false",
  "rowCoverageScoringAllowed: false",
  "supabaseOperationAllowed: false",
  "candidateRowsAccepted: false",
  "scoreSourceRealAllowed: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:pm-twii-bounded-data-acceptance-attempt-runner-readiness"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:pm-twii-bounded-data-acceptance-attempt-runner-readiness`);
}
if (pkg.scripts?.["check:pm-twii-bounded-data-acceptance-attempt-runner-readiness"] !== `node ${checkerPath}`) {
  problems.push(`${packagePath} missing check:pm-twii-bounded-data-acceptance-attempt-runner-readiness`);
}

for (const phrase of [
  "Latest TWII bounded data acceptance attempt runner design slice",
  "docs/TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_RUNNER_DESIGN.md",
  "docs/TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_POST_RUN_REVIEW_TEMPLATE.md",
  "docs/PM_TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_RUNNER_READINESS.md",
  "pm_twii_bounded_data_acceptance_attempt_runner_readiness_ready_no_execution"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_RUNNER_DESIGN.md` is `accepted` as TWII bounded data acceptance attempt runner design",
  "`docs/TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_POST_RUN_REVIEW_TEMPLATE.md` is `accepted` as TWII bounded data acceptance attempt post-run review template",
  "`docs/PM_TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_RUNNER_READINESS.md` is `accepted` as PM TWII bounded data acceptance attempt runner readiness",
  "twii_bounded_data_acceptance_attempt_runner_design_ready_no_execution",
  "pm_twii_bounded_data_acceptance_attempt_runner_readiness_ready_no_execution"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-pm-twii-bounded-data-acceptance-attempt-runner-readiness.mjs",
  "name: \"pm-twii-bounded-data-acceptance-attempt-runner-readiness\"",
  "\"pm-twii-bounded-data-acceptance-attempt-runner-readiness\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const result = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(result.stdout ?? "");
if (result.status !== 0) problems.push(`${reportPath} must exit 0`);
if (report.status !== "pm_twii_bounded_data_acceptance_attempt_runner_readiness_ready_no_execution") problems.push("readiness report must be ready_no_execution");
if (report.authorizationBoundary?.runnerImplementedNow !== false) problems.push("report must not implement runner now");
if (report.authorizationBoundary?.runnerExecutionAllowedNow !== false) problems.push("report must not allow runner execution now");
if (report.authorizationBoundary?.dataAcceptanceAttemptAllowedNow !== false) problems.push("report must not allow acceptance attempt now");
assertSafety(report, "readiness report");

for (const [filePath, text] of [
  [designPath, design],
  [templatePath, template],
  [docPath, doc],
  [reportPath, reportSource],
  ["readiness output", JSON.stringify(report)]
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
      guardedStatus: "pm_twii_bounded_data_acceptance_attempt_runner_readiness_ready_no_execution"
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
    "remoteTwiiProbeExecuted",
    "candidateArtifactCreated",
    "sourceDerivedCandidateRowsCreated",
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "stagingRowsCreated",
    "dailyPricesMutated",
    "marketDataFetched",
    "marketDataIngested",
    "sourcePayloadsPrinted",
    "rowPayloadsPrinted",
    "stockIdPayloadsPrinted",
    "secretsPrinted",
    "serviceRoleKeyPrinted",
    "candidateRowsAccepted",
    "publicPromotionAllowed",
    "rowCoveragePointsAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push("readiness report output is not valid JSON");
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
    /scoreSource":\s*"real"/u,
    /candidateRowsAcceptedNow=true/u,
    /dailyPricesMutated=true/u,
    /sqlExecuted=true/u
  ];
}
