import fs from "node:fs";

const problems = [];

const routePath = "docs/TW_EQUITY_SOURCE_CLASSIFICATION_MINIMAL_EXECUTION_ROUTE.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const route = read(routePath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "TW Equity Source Classification Minimal Execution Route",
  "tw_equity_source_classification_minimal_execution_route_applied_still_blocked",
  "Classification is not a UI category chip",
  "source/legal outcome",
  "permitted-use",
  "attribution",
  "redistribution",
  "retention",
  "rate-limit-and-outage",
  "delay-incompleteness-public-display",
  "derived-score-use",
  "accepted_for_local_planning_only",
  "accepted_for_internal_only",
  "accepted_for_delayed_public_display",
  "accepted_for_derived_metrics_only",
  "rejected",
  "unknown_keep_blocked",
  "recordedBy",
  "recordedAt",
  "node scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs",
  "node scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs --dry-run",
  "node scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs --apply",
  "node scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs",
  "node scripts/check-record-tw-equity-provider-specific-terms-review-outcome.mjs",
  "node scripts/check-tw-equity-source-review-readiness-summary.mjs",
  "node scripts/check-tw-equity-staging-first-preflight-runner.mjs",
  "node scripts/check-review-gates.mjs",
  "CEO recommends starting with `permitted-use`",
  "do not create the future write runner until a concrete classification exists",
  "docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_APPLY_RUNBOOK.md",
  "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json",
  "scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs",
  "scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs",
  "docs/TW_EQUITY_SOURCE_REVIEW_READINESS_SUMMARY.md",
  "docs/TW_EQUITY_STAGING_FIRST_WRITE_AUTHORIZATION_PACKET_V1.md",
  "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_TEMPLATE_V1.md",
  "SQL",
  "Supabase connection, reads, or writes",
  "Staging rows",
  "Production `daily_prices` mutation",
  "Market-data fetch or ingestion",
  "Public source promotion",
  "Row coverage points",
  "`scoreSource=real`",
  "received human classifications on 2026-06-06",
  "6` planning classifications",
  "1` `unknown_keep_blocked` classification"
]) {
  if (!route.includes(phrase)) problems.push(`${routePath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity source classification minimal execution route slice",
  "docs/TW_EQUITY_SOURCE_CLASSIFICATION_MINIMAL_EXECUTION_ROUTE.md",
  "tw_equity_source_classification_minimal_execution_route_applied_still_blocked",
  "classification is not a UI category chip",
  "permitted-use",
  "do not create the future write runner until a concrete classification exists"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-source-classification-minimal-execution-route"] !==
  "node scripts/check-tw-equity-source-classification-minimal-execution-route.mjs"
) {
  problems.push("package.json missing check:tw-equity-source-classification-minimal-execution-route");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-source-classification-minimal-execution-route.mjs")) {
    problems.push(`${path} missing TW equity source classification minimal execution route checker`);
  }
  if (!text.includes("tw-equity-source-classification-minimal-execution-route")) {
    problems.push(`${path} missing tw-equity-source-classification-minimal-execution-route name`);
  }
}

if (!reviewGate.includes('"tw-equity-source-classification-minimal-execution-route"')) {
  problems.push("review gate core set missing tw-equity-source-classification-minimal-execution-route");
}

const forbiddenPatterns = [
  /source approval is complete/u,
  /source is approved/u,
  /provider terms are approved/u,
  /source license is approved/u,
  /SQL execution is approved/u,
  /Supabase reads are approved/u,
  /Supabase writes are approved/u,
  /market ingestion is approved/u,
  /publicDataSource=supabase/u,
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
  if (pattern.test(route)) problems.push(`${routePath} contains forbidden token: ${pattern}`);
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
