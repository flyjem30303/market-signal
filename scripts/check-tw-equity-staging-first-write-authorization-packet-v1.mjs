import fs from "node:fs";

const problems = [];

const docPath = "docs/TW_EQUITY_STAGING_FIRST_WRITE_AUTHORIZATION_PACKET_V1.md";
const preflightPath = "scripts/report-tw-equity-staging-first-preflight.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
const preflight = read(preflightPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "TW Equity Staging-First Write Authorization Packet V1",
  "tw_equity_staging_first_write_authorization_packet_v1_ready_not_authorized",
  "scripts/report-tw-equity-staging-first-preflight.mjs",
  "blocked_until_source_classification_and_write_authorization",
  "`tw-equity`",
  "`2330`, `2382`, `2308`",
  "`60`",
  "`180`",
  "`3`",
  "`177`",
  "`waiting_human_source_legal_classification`",
  "`tw_equity_daily_prices_staging`",
  "Future Exact Command Shape",
  "node scripts/run-tw-equity-staging-write-once.mjs",
  "This command does not exist yet and must not be created or executed from this packet",
  "Required Authorization Fields",
  "authorization id",
  "exact command",
  "maximum rows allowed: `180`",
  "source classification reference",
  "service-role posture",
  "RLS posture",
  "rollback owner",
  "retention window",
  "post-run review artifact path",
  "no retry without a new approval",
  "Required Pre-Execution Checks",
  "node scripts/check-data-realification-acceleration-gate.mjs",
  "node scripts/check-tw-equity-staging-first-authorization-packet.mjs",
  "node scripts/check-tw-equity-staging-first-preflight-runner.mjs",
  "node scripts/check-review-gates.mjs",
  "Rollback Contract",
  "Rollback must be scoped by `authorization id` and target relation",
  "Retention Contract",
  "Post-Run Review Acceptance Fields",
  "promotion attempted: false",
  "Do not create the future write runner until source classification and explicit write authorization are present"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "status: problems.length === 0 ? \"blocked_until_source_classification_and_write_authorization\"",
  "targetRelationProposal: \"tw_equity_daily_prices_staging\"",
  "expectedRows: 180",
  "latestMissingRows: 177",
  "supabaseWrites: false",
  "marketDataFetched: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!preflight.includes(phrase)) problems.push(`${preflightPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity staging-first write authorization packet v1 slice",
  "docs/TW_EQUITY_STAGING_FIRST_WRITE_AUTHORIZATION_PACKET_V1.md",
  "tw_equity_staging_first_write_authorization_packet_v1_ready_not_authorized",
  "run-tw-equity-staging-write-once.mjs",
  "must not be created or executed yet"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-staging-first-write-authorization-packet-v1"] !==
  "node scripts/check-tw-equity-staging-first-write-authorization-packet-v1.mjs"
) {
  problems.push("package.json missing check:tw-equity-staging-first-write-authorization-packet-v1");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-first-write-authorization-packet-v1.mjs")) {
    problems.push(`${path} missing TW equity staging-first write authorization packet v1 checker`);
  }
  if (!text.includes("tw-equity-staging-first-write-authorization-packet-v1")) {
    problems.push(`${path} missing tw-equity-staging-first-write-authorization-packet-v1 name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-first-write-authorization-packet-v1"')) {
  problems.push("review gate core set missing tw-equity-staging-first-write-authorization-packet-v1");
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
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden token: ${pattern}`);
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
