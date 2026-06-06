import fs from "node:fs";

const problems = [];

const docPath = "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_DESIGN.md";
const sourceRightsPath = "docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md";
const dryRunPath = "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const sourceRights = read(sourceRightsPath);
const dryRun = read(dryRunPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

const requiredDocPhrases = [
  "TW Equity Local Report-Only Runner Design",
  "tw_equity_local_report_only_runner_design_ready_not_executable",
  "docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md",
  "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md",
  "`2330`",
  "`2382`",
  "`2308`",
  "Expected trading sessions: `60`",
  "Expected rows: `180`",
  "Latest observed rows: `3`",
  "Latest missing rows: `177`",
  "not source approved",
  "external provider terms pending",
  "Redistribution status: not approved",
  "Retention status: not approved",
  "staging_first",
  "Production `daily_prices` blocked",
  "publicDataSource mock",
  "scoreSource mock",
  "\"laneId\": \"tw-equity\"",
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
  "\"filesWritten\": false",
  "\"mutations\": false",
  "\"sqlExecuted\": false",
  "\"supabaseWrites\": false",
  "\"marketFetchAttempted\": false",
  "\"marketIngestionAttempted\": false",
  "\"secretsPrinted\": false",
  "\"sourcePayloadsPrinted\": false",
  "\"sourceDerivedRowsStored\": false",
  "\"publicDataSource\": \"mock\"",
  "\"scoreSource\": \"mock\"",
  "no-network expectation",
  "no-file-write expectation except stdout",
  "does not approve",
  "Supabase connection",
  "TWSE fetch",
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
  [
    sourceRightsPath,
    sourceRights,
    [
      "TW Equity Source-Rights Packet",
      "tw_equity_source_rights_packet_ready_local_review_not_source_approved",
      "not source approved",
      "external provider terms pending"
    ]
  ],
  [
    dryRunPath,
    dryRun,
    [
      "TW Equity Report-Only Dry-Run Packet",
      "tw_equity_report_only_dry_run_packet_ready_not_executable",
      "expectedTradingSessions",
      "expectedRows"
    ]
  ]
]) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) problems.push(`${path} missing: ${phrase}`);
  }
}

const requiredStatusPhrases = [
  "Latest TW equity local report-only runner design slice",
  "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_DESIGN.md",
  "tw_equity_local_report_only_runner_design_ready_not_executable",
  "sample output only",
  "no-network",
  "no-Supabase",
  "no-SQL"
];

for (const phrase of requiredStatusPhrases) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-local-report-only-runner-design"] !==
  "node scripts/check-tw-equity-local-report-only-runner-design.mjs"
) {
  problems.push("package.json missing check:tw-equity-local-report-only-runner-design script");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-local-report-only-runner-design.mjs")) {
    problems.push(`${path} missing tw equity local report-only runner design checker`);
  }
  if (!text.includes("tw-equity-local-report-only-runner-design")) {
    problems.push(`${path} missing tw-equity-local-report-only-runner-design name`);
  }
}

if (!reviewGate.includes('"tw-equity-local-report-only-runner-design"')) {
  problems.push("review gate core set missing tw-equity-local-report-only-runner-design");
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
  /runner executed/u,
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
