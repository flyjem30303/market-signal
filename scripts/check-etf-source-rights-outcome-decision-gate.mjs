import fs from "node:fs";

const problems = [];

const docPath = "docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md";
const routePath = "docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md";
const readinessPath = "docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md";
const rightsPath = "src/lib/etf-source-rights-review-packet.ts";
const a1SupportPath = "docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const route = read(routePath);
const readiness = read(readinessPath);
const rights = read(rightsPath);
const a1Support = read(a1SupportPath);
const board = read(boardPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `etf_source_rights_outcome_decision_gate_blocked_external_rights_pending`",
  "CEO opens the ETF source-rights outcome decision gate",
  "does not approve any ETF source lane yet",
  "`rejected_for_execution_pending_external_rights`",
  "`legal_and_redistribution_terms_unapproved`",
  "`etf_daily_prices_coverage_completion_route_ready_source_rights_blocked`",
  "`etf_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`",
  "`etf_source_rights_review_packet_prepared`",
  "Target symbols: `0050`, `006208`",
  "Combined ETF coverage: `2/120`",
  "Missing ETF rows: `118`",
  "`0050`: `1/60`, missing `59`",
  "`006208`: `1/60`, missing `59`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`twse-mis-etf-surface`",
  "`issuer-official-pages`",
  "`licensed-vendor`",
  "`blocked_for_ingestion`",
  "`candidate_requires_review`",
  "No lane is accepted by this gate",
  "## Narrow Decision Question",
  "Which source lane, if any, can PM/CEO accept",
  "## Required Acceptance Evidence",
  "Internal storage",
  "Retention",
  "Redistribution",
  "Attribution",
  "Derived analysis",
  "Rate limits",
  "Delayed / missing wording",
  "Aggregate-only review",
  "ETF `daily_prices` market-price OHLCV/turnover coverage remains separate from NAV",
  "This gate decides that no ETF execution is currently allowed",
  "ETF sanitized candidate artifact gate for the remaining `118` missing rows",
  "Blocked-route alternative map comparing ETF, TWII, and launch/runtime non-data routes",
  "TWII source-rights and candidate readiness branch for `TWII` `0/60`",
  "PM remains the only integration owner",
  "This checker intentionally reports status `blocked`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "does not run SQL",
  "does not connect to Supabase",
  "does not write Supabase",
  "does not create staging rows",
  "does not modify `daily_prices`",
  "does not fetch raw market data",
  "does not ingest raw market data",
  "does not store raw market data",
  "does not commit raw market data",
  "does not produce ETF candidates",
  "does not output secrets",
  "does not output raw payload",
  "does not output row payload",
  "does not output stock id payload",
  "does not give row coverage points",
  "does not promote `publicDataSource=supabase`",
  "does not set `scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

for (const phrase of [
  "Status: `etf_daily_prices_coverage_completion_route_ready_source_rights_blocked`",
  "ETF sub-scope: `2/120`",
  "remaining ETF rows: `118`",
  "`0050`: `1/60`",
  "`006208`: `1/60`",
  "legal_and_redistribution_terms_unapproved",
  "may not proceed to candidate generation or write execution until a source-rights decision accepts"
]) {
  if (!route.includes(phrase)) problems.push(`${routePath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `etf_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`",
  "Current observed ETF rows: `2/120`",
  "Missing ETF rows: `118`",
  "`legal_and_redistribution_terms_unapproved`",
  "`twse-mis-etf-surface`",
  "`issuer-official-pages`",
  "`licensed-vendor`",
  "Future staging/write/readback work is not executable from this packet"
]) {
  if (!readiness.includes(phrase)) problems.push(`${readinessPath} missing: ${phrase}`);
}

for (const phrase of [
  "etf_source_rights_review_packet_prepared",
  "targetSymbols: [\"0050\", \"006208\"]",
  "legal_and_redistribution_terms_unapproved",
  "twse-mis-etf-surface",
  "issuer-official-pages",
  "licensed-vendor",
  "blocked_for_ingestion",
  "candidate_requires_review",
  "ETF row coverage credit remains blocked",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!rights.includes(phrase)) problems.push(`${rightsPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `a1_etf_source_rights_outcome_decision_support_ready_blocked_pending`",
  "No lane is accepted by this packet",
  "Maintain `legal_and_redistribution_terms_unapproved`",
  "`blocked_pending_external_rights_evidence`",
  "blocked-route alternative map",
  "TWII readiness branch"
]) {
  if (!a1Support.includes(phrase)) problems.push(`${a1SupportPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md` is `accepted` for PM mainline review",
  "`docs/A2_ROUTE_LEVEL_LAUNCH_COPY_PLACEMENT_CRITERIA.md` is `accepted` for PM mainline review",
  "`docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md` is `blocked` as a PM mainline execution gate",
  "PM should reassign A1 to a blocked-route alternative map or TWII readiness branch"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest ETF source-rights outcome decision gate slice",
  "etf_source_rights_outcome_decision_gate_blocked_external_rights_pending",
  "rejected_for_execution_pending_external_rights",
  "A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md",
  "A2_ROUTE_LEVEL_LAUNCH_COPY_PLACEMENT_CRITERIA.md"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:etf-source-rights-outcome-decision-gate"] !==
  "node scripts/check-etf-source-rights-outcome-decision-gate.mjs"
) {
  problems.push(`${packagePath} missing check:etf-source-rights-outcome-decision-gate script`);
}

for (const phrase of [
  "scripts/check-etf-source-rights-outcome-decision-gate.mjs",
  "expectStatus: \"blocked\"",
  "name: \"etf-source-rights-outcome-decision-gate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const forbiddenDocPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env/u,
  /source rights (are )?approved/iu,
  /rights (are )?passed/iu,
  /legal_and_redistribution_terms_approved/u,
  /candidate generation is approved/u,
  /SQL execution is approved/u,
  /Supabase connection is approved/u,
  /Supabase writes are approved/u,
  /staging rows are approved/u,
  /daily_prices mutation is approved/u,
  /raw market data fetch is approved/u,
  /row coverage points awarded/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
];

for (const pattern of forbiddenDocPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden token: ${pattern}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "blocked",
      decisionStatus: "etf_source_rights_outcome_decision_gate_blocked_external_rights_pending",
      currentOutcome: "rejected_for_execution_pending_external_rights",
      docPath
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}
