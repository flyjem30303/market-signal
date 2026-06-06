import fs from "node:fs";

const problems = [];

const summaryPath = "docs/TW_EQUITY_SOURCE_REVIEW_READINESS_SUMMARY.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const summary = read(summaryPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Source Review Readiness Summary",
  "tw_equity_source_review_readiness_summary_waiting_human_classification",
  "docs/TW_EQUITY_SOURCE_APPROVAL_DECISION_PACKET.md",
  "docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_PACKET.md",
  "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json",
  "scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs",
  "scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs",
  "docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_APPLY_RUNBOOK.md",
  "docs/reviews/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_APPLY_RUNBOOK_ROLE_REVIEW_2026-06-06.md",
  "not_source_approved",
  "Provider-specific terms review outcome is not yet recorded",
  "waiting for a specific human source/legal classification",
  "Classification means one of the source/legal outcome classes",
  "front-end category chips",
  "Source approval",
  "Provider terms approval",
  "Source license approval",
  "Redistribution approval",
  "Retention approval",
  "Public display approval",
  "Derived-score use approval",
  "Supabase connection, reads, or writes",
  "TWSE source retrieval",
  "Market-data fetch, ingestion, or source-derived row storage",
  "Public source promotion",
  "Row coverage points",
  "`scoreSource=real`",
  "Option A",
  "Option B",
  "Option C",
  "CEO recommends Option B now",
  "runtime/mock MVP hardening",
  "Do not execute the apply runbook without a specific human classification",
  "Do not fetch market data",
  "Do not run SQL",
  "Do not connect to Supabase",
  "Do not write Supabase",
  "Do not promote `publicDataSource`"
]) {
  if (!summary.includes(phrase)) problems.push(`${summaryPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity source review readiness summary slice",
  "docs/TW_EQUITY_SOURCE_REVIEW_READINESS_SUMMARY.md",
  "tw_equity_source_review_readiness_summary_waiting_human_classification",
  "CEO recommends Option B",
  "source review lane has reached a natural waiting point"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-source-review-readiness-summary"] !==
  "node scripts/check-tw-equity-source-review-readiness-summary.mjs"
) {
  problems.push("package.json missing check:tw-equity-source-review-readiness-summary");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-source-review-readiness-summary.mjs")) {
    problems.push(`${path} missing TW equity source review readiness summary checker`);
  }
  if (!text.includes("tw-equity-source-review-readiness-summary")) {
    problems.push(`${path} missing tw-equity-source-review-readiness-summary name`);
  }
}

if (!reviewGate.includes('"tw-equity-source-review-readiness-summary"')) {
  problems.push("review gate core set missing tw-equity-source-review-readiness-summary");
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
  if (pattern.test(summary)) problems.push(`${summaryPath} contains forbidden token: ${pattern}`);
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
