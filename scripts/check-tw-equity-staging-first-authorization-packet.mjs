import fs from "node:fs";

const problems = [];

const docPath = "docs/TW_EQUITY_STAGING_FIRST_AUTHORIZATION_PACKET.md";
const accelerationPath = "docs/DATA_REALIFICATION_ACCELERATION_GATE.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
const acceleration = read(accelerationPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "TW Equity Staging-First Authorization Packet",
  "tw_equity_staging_first_authorization_packet_ready_not_executable",
  "docs/DATA_REALIFICATION_ACCELERATION_GATE.md",
  "aggregate-incomplete readonly finding",
  "`tw-equity`",
  "`2330`",
  "`2382`",
  "`2308`",
  "Expected trading sessions: `60`",
  "Expected lane rows: `180`",
  "observed `3` rows",
  "missing `177` rows",
  "waiting for specific human source/legal classification",
  "Proposed future staging target name: `tw_equity_daily_prices_staging`",
  "Production `daily_prices` remains blocked",
  "This packet does not create the staging table and does not generate SQL",
  "Future Authorization Must Name",
  "maximum rows allowed",
  "service-role posture",
  "RLS posture",
  "rollback owner",
  "retention window",
  "post-run review artifact path",
  "Report-Only Preflight Output Contract",
  "source classification status",
  "files written: false",
  "mutations: false",
  "SQL executed: false",
  "Supabase writes: false",
  "market data fetched: false",
  "Acceptance Fields For Post-Run Review",
  "rows written",
  "rows rejected",
  "duplicate handling result",
  "CEO accepts this as the next acceleration packet, not as execution approval",
  "A1 should continue preparing source/legal classification inputs",
  "A2 should keep public copy mock-only and incomplete-data safe",
  "Stop Lines"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

if (!acceleration.includes("TW_EQUITY_STAGING_FIRST_AUTHORIZATION_PACKET")) {
  problems.push(`${accelerationPath} missing immediate packet reference`);
}

for (const phrase of [
  "Latest TW equity staging-first authorization packet slice",
  "docs/TW_EQUITY_STAGING_FIRST_AUTHORIZATION_PACKET.md",
  "tw_equity_staging_first_authorization_packet_ready_not_executable",
  "tw_equity_daily_prices_staging",
  "observed 3 rows and missing 177 rows"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-staging-first-authorization-packet"] !==
  "node scripts/check-tw-equity-staging-first-authorization-packet.mjs"
) {
  problems.push("package.json missing check:tw-equity-staging-first-authorization-packet");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-first-authorization-packet.mjs")) {
    problems.push(`${path} missing TW equity staging-first authorization packet checker`);
  }
  if (!text.includes("tw-equity-staging-first-authorization-packet")) {
    problems.push(`${path} missing tw-equity-staging-first-authorization-packet name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-first-authorization-packet"')) {
  problems.push("review gate core set missing tw-equity-staging-first-authorization-packet");
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
