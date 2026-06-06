import fs from "node:fs";

const problems = [];

const templatePath = "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_TEMPLATE_V1.md";
const authorizationPath = "docs/TW_EQUITY_STAGING_FIRST_WRITE_AUTHORIZATION_PACKET_V1.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const template = read(templatePath);
const authorization = read(authorizationPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "TW Equity Staging-First Write Post-Run Review Template V1",
  "tw_equity_staging_first_write_post_run_review_template_v1_ready_not_executed",
  "docs/TW_EQUITY_STAGING_FIRST_WRITE_AUTHORIZATION_PACKET_V1.md",
  "blank template only",
  "Authorization id: `not_run`",
  "Exact command: `not_run`",
  "Execution count: `0`",
  "Review status: `template_only_not_executed`",
  "Target relation: `tw_equity_daily_prices_staging`",
  "Lane: `tw-equity`",
  "Symbols: `2330`, `2382`, `2308`",
  "Sessions requested: `60`",
  "Max rows allowed: `180`",
  "Source classification reference: `not_provided`",
  "Rows proposed: `0`",
  "Rows written: `0`",
  "Rows rejected: `0`",
  "Rollback owner: `not_provided`",
  "Rollback status: `not_run`",
  "Retention window: `not_provided`",
  "Retention status: `not_run`",
  "Files written: `false`",
  "Mutations: `false`",
  "SQL execution status: `not_run`",
  "Supabase connection status: `not_run`",
  "Supabase write status: `not_run`",
  "Market-data fetch status: `not_run`",
  "Ingestion status: `not_run`",
  "Source payload output status: `false`",
  "Secret output status: `false`",
  "Public runtime state: `mock`",
  "Score runtime state: `mock`",
  "Public source promotion attempted: `false`",
  "Score-source promotion attempted: `false`",
  "Row coverage points awarded: `false`",
  "Accepted: `false`",
  "Rejected: `false`",
  "template_only_not_executed",
  "Required Checks For A Filled Review",
  "node scripts/check-tw-equity-staging-first-write-authorization-packet-v1.mjs",
  "Stop if a filled review claims success"
]) {
  if (!template.includes(phrase)) problems.push(`${templatePath} missing: ${phrase}`);
}

for (const phrase of [
  "Post-Run Review Acceptance Fields",
  "promotion attempted: false",
  "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_<DATE>.md"
]) {
  if (!authorization.includes(phrase)) problems.push(`${authorizationPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity staging-first write post-run review template v1 slice",
  "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_TEMPLATE_V1.md",
  "tw_equity_staging_first_write_post_run_review_template_v1_ready_not_executed",
  "template_only_not_executed",
  "post-run review fields are ready before the write runner exists"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-staging-first-write-post-run-review-template-v1"] !==
  "node scripts/check-tw-equity-staging-first-write-post-run-review-template-v1.mjs"
) {
  problems.push("package.json missing check:tw-equity-staging-first-write-post-run-review-template-v1");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-first-write-post-run-review-template-v1.mjs")) {
    problems.push(`${path} missing TW equity staging-first write post-run review template v1 checker`);
  }
  if (!text.includes("tw-equity-staging-first-write-post-run-review-template-v1")) {
    problems.push(`${path} missing tw-equity-staging-first-write-post-run-review-template-v1 name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-first-write-post-run-review-template-v1"')) {
  problems.push("review gate core set missing tw-equity-staging-first-write-post-run-review-template-v1");
}

const forbiddenPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env/u,
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /staging rows are approved/u,
  /daily_prices mutation is approved/u,
  /market-data fetch is approved/u,
  /market-data ingestion is approved/u,
  /publicDataSource=supabase approved/u,
  /scoreSource=real approved/u,
  /ROW_COVERAGE_POINTS_AWARDED/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u,
  /raw payload/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(template)) problems.push(`${templatePath} contains forbidden token: ${pattern}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}
