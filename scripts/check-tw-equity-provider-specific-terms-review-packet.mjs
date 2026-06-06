import fs from "node:fs";

const problems = [];

const docPath = "docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_PACKET.md";
const sourceApprovalPath = "docs/TW_EQUITY_SOURCE_APPROVAL_DECISION_PACKET.md";
const sourceRightsPath = "docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md";
const runnerPath = "scripts/report-tw-equity-local-report-only-dry-run.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const sourceApproval = read(sourceApprovalPath);
const sourceRights = read(sourceRightsPath);
const runner = read(runnerPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

const requiredDocPhrases = [
  "TW Equity Provider-Specific Terms Review Packet",
  "tw_equity_provider_specific_terms_review_packet_ready_not_approved",
  "docs/TW_EQUITY_SOURCE_APPROVAL_DECISION_PACKET.md",
  "docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md",
  "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md",
  "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_DESIGN.md",
  "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_IMPLEMENTATION_GATE.md",
  "docs/reviews/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_POST_RUN_REVIEW_2026-06-06.md",
  "scripts/report-tw-equity-local-report-only-dry-run.mjs",
  "`2330`",
  "`2382`",
  "`2308`",
  "TWSE STOCK_DAY design references",
  "local_packet_consistency_only",
  "not_source_approved",
  "external_provider_terms_pending",
  "publicDataSource mock",
  "scoreSource mock",
  "Terms Review Owner",
  "Permitted-Use Question",
  "Attribution Question",
  "Redistribution Question",
  "Retention Question",
  "Rate-Limit Question",
  "Outage Handling Question",
  "Delay And Incompleteness Question",
  "Public Display Question",
  "Derived-Score Use Question",
  "accepted_for_local_planning_only",
  "accepted_for_internal_only",
  "accepted_for_delayed_public_display",
  "accepted_for_derived_metrics_only",
  "rejected",
  "unknown_keep_blocked",
  "No-Execution Stop Lines",
  "This packet does not approve",
  "source use",
  "provider terms",
  "source license",
  "redistribution",
  "retention",
  "public display",
  "derived-score use",
  "SQL",
  "Supabase connection",
  "Supabase reads",
  "Supabase writes",
  "staging rows",
  "production `daily_prices` mutation",
  "TWSE source retrieval",
  "market-data ingestion",
  "source-derived row storage",
  "source payload commit",
  "source payload printing",
  "secret printing",
  "public source promotion",
  "row coverage points",
  "`scoreSource=real`",
  "CEO recommends using this packet",
  "local accepted or rejected planning outcome",
  "Do not promote the runtime",
  "still local-only and still not source approved"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [path, text, phrases] of [
  [sourceApprovalPath, sourceApproval, ["CEO recommends Option A", "provider-specific terms review packet", "not_source_approved"]],
  [sourceRightsPath, sourceRights, ["not source approved", "external provider terms pending", "redistribution status remains not approved"]],
  [runnerPath, runner, ["blocked_until_source_approval", "local_packet_consistency_only", "publicDataSource: \"mock\"", "scoreSource: \"mock\""]]
]) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) problems.push(`${path} missing: ${phrase}`);
  }
}

const requiredStatusPhrases = [
  "Latest TW equity provider-specific terms review packet slice",
  "docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_PACKET.md",
  "tw_equity_provider_specific_terms_review_packet_ready_not_approved",
  "local accepted or rejected planning outcome",
  "still local-only and still not source approved"
];

for (const phrase of requiredStatusPhrases) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-provider-specific-terms-review-packet"] !==
  "node scripts/check-tw-equity-provider-specific-terms-review-packet.mjs"
) {
  problems.push("package.json missing check:tw-equity-provider-specific-terms-review-packet script");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-provider-specific-terms-review-packet.mjs")) {
    problems.push(`${path} missing tw equity provider-specific terms review packet checker`);
  }
  if (!text.includes("tw-equity-provider-specific-terms-review-packet")) {
    problems.push(`${path} missing tw-equity-provider-specific-terms-review-packet name`);
  }
}

if (!reviewGate.includes('"tw-equity-provider-specific-terms-review-packet"')) {
  problems.push("review gate core set missing tw-equity-provider-specific-terms-review-packet");
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
  /\bfetch\s*\(/u,
  /source approval is complete/u,
  /source is approved/u,
  /provider terms approved/u,
  /source license approved/u,
  /redistribution approved/u,
  /retention approved/u,
  /public display approved/u,
  /derived-score use approved/u,
  /SQL execution is approved/u,
  /Supabase reads are approved/u,
  /Supabase writes are approved/u,
  /market ingestion is approved/u,
  /TWSE fetch is approved/u,
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
