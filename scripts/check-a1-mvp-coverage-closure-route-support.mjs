import fs from "node:fs";

const problems = [];

const docPath = "docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md";
const scoringGatePath = "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md";
const etfRoutePath = "docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md";
const twiiReadinessPath = "docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md";
const twiiFieldPath = "docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md";
const etfReadinessPath = "docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md";
const etfDecisionPath = "docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md";
const packagePath = "package.json";

const doc = read(docPath);
const scoringGate = read(scoringGatePath);
const etfRoute = read(etfRoutePath);
const twiiReadiness = read(twiiReadinessPath);
const twiiField = read(twiiFieldPath);
const etfReadiness = read(etfReadinessPath);
const etfDecision = read(etfDecisionPath);
const pkg = JSON.parse(read(packagePath));

for (const phrase of [
  "Status: `a1_mvp_coverage_closure_route_support_ready_local_only_not_executable`",
  "from current Level 1 MVP coverage `182/360` to target `360/360`",
  "Target: `360/360`",
  "Current observed coverage: `182/360`",
  "Missing rows: `178`",
  "Full-scope status: `blocked_incomplete`",
  "TW equity sub-scope: `180/180`, accepted complete",
  "`TWII` is `0/60`, missing `60`",
  "`0050` is `1/60`, missing `59`",
  "`006208` is `1/60`, missing `59`",
  "Combined ETF sub-scope: `2/120`, missing `118`",
  "TWII reaches accepted `60/60`",
  "ETF reaches accepted `120/120`",
  "Selected first candidate: `official-exchange-index`",
  "Selection status: `accepted_for_rights_and_field_contract_review_only`",
  "Review state: `not_approved_for_probe_or_ingestion`",
  "TWII source-rights prerequisites",
  "TWII field-contract prerequisites",
  "TWII candidate artifact prerequisites",
  "TWII bounded execution prerequisites",
  "TWII post-run review, readback, and scoring prerequisites",
  "ETF source-rights prerequisites",
  "ETF field-contract prerequisites",
  "ETF candidate artifact prerequisites",
  "ETF bounded execution prerequisites",
  "ETF post-run review, readback, and scoring prerequisites",
  "`legal_and_redistribution_terms_unapproved`",
  "`twse-mis-etf-surface`",
  "`issuer-official-pages`",
  "`licensed-vendor`",
  "source-rights outcome",
  "field-contract",
  "candidate artifact",
  "bounded execution",
  "post-run review",
  "readback",
  "scoring gate",
  "Future exact-command gate only",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
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
  "does not output secrets",
  "does not output raw payload",
  "does not output row payload",
  "does not output stock id payload",
  "does not generate TWII candidates",
  "does not generate ETF candidates",
  "does not give row coverage points",
  "does not promote `publicDataSource=supabase`",
  "does not set `scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing stop line: ${phrase}`);
}

for (const phrase of [
  "observed rows: `182`",
  "missing rows: `178`",
  "full-scope status: `blocked_incomplete`",
  "expected rows: `180`",
  "observed rows: `180`",
  "`TWII`: `0/60`",
  "`0050`: `1/60`",
  "`006208`: `1/60`"
]) {
  if (!scoringGate.includes(phrase)) problems.push(`${scoringGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "ETF sub-scope: `2/120`",
  "remaining ETF rows: `118`",
  "legal_and_redistribution_terms_unapproved",
  "Sanitized ETF candidate artifact with exactly `118` missing candidate rows",
  "ETF post-run review",
  "ETF post-write row coverage readback",
  "Row coverage scoring gate update"
]) {
  if (!etfRoute.includes(phrase)) problems.push(`${etfRoutePath} missing: ${phrase}`);
}

for (const [pathName, text, phrases] of [
  [
    twiiReadinessPath,
    twiiReadiness,
    [
      "Status: `a1_twii_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`",
      "Full MVP row coverage: `182/360`",
      "`TWII`: `0/60`",
      "Selected first candidate: `official-exchange-index`",
      "not_approved_for_probe_or_ingestion",
      "TWII source-rights outcome gate",
      "TWII sanitized candidate artifact gate"
    ]
  ],
  [
    twiiFieldPath,
    twiiField,
    [
      "Status: `a1_twii_index_field_contract_decision_support_ready_local_only_not_executable`",
      "`index_close`",
      "Calendar And Session Rules",
      "Expected timezone: `Asia/Taipei`",
      "Stock id payload is forbidden"
    ]
  ],
  [
    etfReadinessPath,
    etfReadiness,
    [
      "Status: `etf_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`",
      "Current observed ETF rows: `2/120`",
      "Missing ETF rows: `118`",
      "ETF source-rights outcome gate",
      "ETF sanitized candidate artifact gate"
    ]
  ],
  [
    etfDecisionPath,
    etfDecision,
    [
      "Status: `a1_etf_source_rights_outcome_decision_support_ready_blocked_pending`",
      "Combined ETF coverage: `2/120`",
      "Missing ETF rows: `118`",
      "legal_and_redistribution_terms_unapproved",
      "blocked_pending_external_rights_evidence"
    ]
  ]
]) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) problems.push(`${pathName} missing: ${phrase}`);
  }
}

if (
  pkg.scripts?.["check:a1-mvp-coverage-closure-route-support"] !==
  "node scripts/check-a1-mvp-coverage-closure-route-support.mjs"
) {
  problems.push(`${packagePath} missing check:a1-mvp-coverage-closure-route-support script`);
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

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}
