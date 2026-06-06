import fs from "node:fs";

const problems = [];

const docPath = "docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md";
const dryRunPath = "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const dryRun = read(dryRunPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

const requiredDocPhrases = [
  "TW Equity Source-Rights Packet",
  "tw_equity_source_rights_packet_ready_local_review_not_source_approved",
  "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md",
  "`2330`",
  "`2382`",
  "`2308`",
  "local review ready",
  "not source approved",
  "external provider terms pending",
  "Redistribution status: not approved",
  "Retention status: not approved",
  "Public attribution status: draft copy only",
  "publicDataSource mock",
  "scoreSource mock",
  "Production `daily_prices` blocked",
  "permitted use",
  "attribution wording",
  "redistribution limits",
  "retention limits",
  "rate limits",
  "outage handling",
  "delay and incompleteness wording",
  "field coverage",
  "public display scope",
  "derived-score use limits",
  "trade date",
  "symbol",
  "open",
  "high",
  "low",
  "close",
  "volume",
  "source timestamp",
  "source label",
  "validation status",
  "missing sessions must be counted, not filled",
  "data may be delayed",
  "data may be incomplete",
  "source rights are under review",
  "public runtime remains mock-only",
  "no investment advice",
  "no ranking",
  "no recommendation",
  "no model confidence",
  "no performance claim",
  "no professional indicator claim",
  "source-derived row storage",
  "public source promotion",
  "`scoreSource=real`",
  "row coverage points",
  "docs/CP3_TWSE_STOCK_DAY_SOURCE_DEPTH_SMOKE_DESIGN_2026-05-29.md",
  "docs/CP3_TWSE_STOCK_DAY_DRY_RUN_REPORTER_DESIGN_2026-05-29.md",
  "docs/CP3_TWSE_STOCK_DAY_CONTROLLED_INGESTION_DESIGN_2026-05-29.md",
  "docs/CP3_TWSE_STOCK_DAY_STAGING_BOUNDARY_DESIGN_2026-05-29.md",
  "docs/CP3_TWSE_STOCK_DAY_STAGING_POST_MIGRATION_VALIDATION_ROLLBACK_PLAN_2026-05-29.md"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "TW Equity Report-Only Dry-Run Packet",
  "tw_equity_report_only_dry_run_packet_ready_not_executable",
  "`2330`",
  "`2382`",
  "`2308`"
]) {
  if (!dryRun.includes(phrase)) problems.push(`${dryRunPath} missing: ${phrase}`);
}

const requiredStatusPhrases = [
  "Latest TW equity source-rights packet slice",
  "docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md",
  "tw_equity_source_rights_packet_ready_local_review_not_source_approved",
  "not source approved",
  "external provider terms pending",
  "redistribution not approved",
  "retention not approved"
];

for (const phrase of requiredStatusPhrases) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["check:tw-equity-source-rights-packet"] !== "node scripts/check-tw-equity-source-rights-packet.mjs") {
  problems.push("package.json missing check:tw-equity-source-rights-packet script");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-source-rights-packet.mjs")) {
    problems.push(`${path} missing tw equity source-rights checker`);
  }
  if (!text.includes("tw-equity-source-rights-packet")) {
    problems.push(`${path} missing tw-equity-source-rights-packet name`);
  }
}

if (!reviewGate.includes('"tw-equity-source-rights-packet"')) {
  problems.push("review gate core set missing tw-equity-source-rights-packet");
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
  /market ingestion is approved/u,
  /TWSE fetch is approved/u,
  /source approval is complete/u,
  /redistribution approved/u,
  /retention approved/u,
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
