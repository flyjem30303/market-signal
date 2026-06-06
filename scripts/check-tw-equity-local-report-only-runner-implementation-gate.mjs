import fs from "node:fs";

const problems = [];

const docPath = "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_IMPLEMENTATION_GATE.md";
const designPath = "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_DESIGN.md";
const sourceRightsPath = "docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md";
const dryRunPath = "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const design = read(designPath);
const sourceRights = read(sourceRightsPath);
const dryRun = read(dryRunPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

const requiredDocPhrases = [
  "TW Equity Local Report-Only Runner Implementation Gate",
  "tw_equity_local_report_only_runner_implementation_gate_ready_not_executed",
  "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_DESIGN.md",
  "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md",
  "docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md",
  "scripts/report-tw-equity-local-report-only-dry-run.mjs",
  "read local packet files",
  "validate packet consistency",
  "build one sanitized sample object",
  "print JSON to stdout",
  "no-network",
  "no-Supabase",
  "no-SQL",
  "no-file-write except stdout",
  "no market-data fetch/ingestion",
  "`status`",
  "`laneId`",
  "`symbols`",
  "`expectedTradingSessions`",
  "`expectedRows`",
  "`latestObservedRows`",
  "`latestMissingRows`",
  "`sourceRightsStatus`",
  "`providerTermsStatus`",
  "`redistributionStatus`",
  "`retentionStatus`",
  "`targetTablePosture`",
  "`productionDailyPricesBlocked`",
  "`validationStatus`",
  "`filesWritten`",
  "`mutations`",
  "`sqlExecuted`",
  "`supabaseConnectionAttempted`",
  "`supabaseWrites`",
  "`marketFetchAttempted`",
  "`marketIngestionAttempted`",
  "`secretsPrinted`",
  "`sourcePayloadsPrinted`",
  "`sourceDerivedRowsStored`",
  "`publicDataSource`",
  "`scoreSource`",
  "\"status\": \"blocked_until_source_approval\"",
  "\"laneId\": \"tw-equity\"",
  "\"symbols\": [\"2330\", \"2382\", \"2308\"]",
  "\"expectedTradingSessions\": 60",
  "\"expectedRows\": 180",
  "\"latestObservedRows\": 3",
  "\"latestMissingRows\": 177",
  "\"sourceRightsStatus\": \"not_source_approved\"",
  "\"providerTermsStatus\": \"external_provider_terms_pending\"",
  "\"redistributionStatus\": \"not_approved\"",
  "\"retentionStatus\": \"not_approved\"",
  "\"targetTablePosture\": \"staging_first\"",
  "\"productionDailyPricesBlocked\": true",
  "\"validationStatus\": \"local_packet_consistency_only\"",
  "\"filesWritten\": false",
  "\"mutations\": false",
  "\"sqlExecuted\": false",
  "\"supabaseConnectionAttempted\": false",
  "\"supabaseWrites\": false",
  "\"marketFetchAttempted\": false",
  "\"marketIngestionAttempted\": false",
  "\"secretsPrinted\": false",
  "\"sourcePayloadsPrinted\": false",
  "\"sourceDerivedRowsStored\": false",
  "\"publicDataSource\": \"mock\"",
  "\"scoreSource\": \"mock\"",
  "contains no remote-network API usage",
  "contains no Supabase client import",
  "contains no environment-secret reads",
  "contains no database write API",
  "contains no filesystem write API",
  "Supabase connection",
  "Supabase writes",
  "production `daily_prices` mutation",
  "TWSE source retrieval",
  "market-data ingestion",
  "source-derived row storage",
  "public source promotion",
  "`scoreSource=real`",
  "row coverage points"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [path, text, phrases] of [
  [designPath, design, ["TW Equity Local Report-Only Runner Design", "tw_equity_local_report_only_runner_design_ready_not_executable"]],
  [sourceRightsPath, sourceRights, ["TW Equity Source-Rights Packet", "not source approved", "external provider terms pending"]],
  [dryRunPath, dryRun, ["TW Equity Report-Only Dry-Run Packet", "expectedTradingSessions", "expectedRows"]]
]) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) problems.push(`${path} missing: ${phrase}`);
  }
}

const requiredStatusPhrases = [
  "Latest TW equity local report-only runner implementation gate slice",
  "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_IMPLEMENTATION_GATE.md",
  "tw_equity_local_report_only_runner_implementation_gate_ready_not_executed",
  "stdout-only sample reporter",
  "future script path",
  "scripts/report-tw-equity-local-report-only-dry-run.mjs"
];

for (const phrase of requiredStatusPhrases) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-local-report-only-runner-implementation-gate"] !==
  "node scripts/check-tw-equity-local-report-only-runner-implementation-gate.mjs"
) {
  problems.push("package.json missing check:tw-equity-local-report-only-runner-implementation-gate script");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-local-report-only-runner-implementation-gate.mjs")) {
    problems.push(`${path} missing tw equity local report-only runner implementation gate checker`);
  }
  if (!text.includes("tw-equity-local-report-only-runner-implementation-gate")) {
    problems.push(`${path} missing tw-equity-local-report-only-runner-implementation-gate name`);
  }
}

if (!reviewGate.includes('"tw-equity-local-report-only-runner-implementation-gate"')) {
  problems.push("review gate core set missing tw-equity-local-report-only-runner-implementation-gate");
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
  /fetch\(/u,
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /market ingestion is approved/u,
  /TWSE fetch is approved/u,
  /source approval is complete/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
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
