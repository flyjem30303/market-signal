import fs from "node:fs";

const docPath = "docs/A1_TWII_TERMS_FIELD_CADENCE_ATTRIBUTION_NO_FETCH_PACKET.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "A1 TWII Terms Field Cadence Attribution No-Fetch Packet",
  "`a1_twii_terms_field_cadence_attribution_no_fetch_packet_ready_pm_intake`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "Source Route Context",
  "`TWII` / `index_baseline`",
  "`official_open_data_api`",
  "`terms_field_cadence_attribution_review_required`",
  "Terms Review Packet",
  "`source_terms_status=terms_field_cadence_attribution_review_required`",
  "Field Contract Packet",
  "`trade_date`",
  "`close_value`",
  "`instrument_code`",
  "`instrument_name`",
  "`field_contract_status=twii_minimum_fields_review_required`",
  "Cadence Packet",
  "`cadence_status=daily_after_close_candidate_fail_closed`",
  "Attribution Packet",
  "`attribution_status=public_copy_required_before_real_display`",
  "`accept_twii_terms_field_cadence_attribution_no_fetch_packet_for_runtime_readiness_copy`",
  "`wire_twii_terms_field_cadence_attribution_status_into_runtime_readiness_copy`",
  "`prepare_twii_bounded_readonly_gate_candidate_requirements_no_execution`",
  "`review_twii_source_attribution_and_cadence_public_copy_guard`",
  "SQL execution",
  "Supabase connection",
  "Supabase writes",
  "staging rows",
  "`daily_prices` mutation",
  "endpoint probe",
  "market-data fetch",
  "market-data ingest",
  "market-data storage",
  "market-data commit",
  "parser implementation",
  "candidate artifact generation",
  "raw payload output",
  "row payload output",
  "stock-id row-list output",
  "secret output",
  "row coverage points",
  "public source promotion",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const forbiddenPatterns = [
  /\bfetch\(/iu,
  /\bcreateClient\(/iu,
  /@supabase\/supabase-js/iu,
  /\.from\(/iu,
  /\.insert\(/iu,
  /\.upsert\(/iu,
  /\binsert\s+into\b/iu,
  /\bupdate\s+daily_prices\b/iu,
  /publicDataSource\s*=\s*"supabase"/iu,
  /scoreSource\s*=\s*"real"/iu,
  /rawMarketDataFetch\s*=\s*true/iu,
  /supabaseWrite\s*=\s*true/iu,
  /dailyPricesMutation\s*=\s*true/iu,
  /\braw\s+payload\s+sample\b/iu,
  /\bmarket\s+row\s+sample\b/iu,
  /\bstock-id\s+row\s+list\s+included\b/iu,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} forbidden pattern: ${pattern}`);
}

let parsedPackage = {};
try {
  parsedPackage = JSON.parse(packageJson);
} catch {
  problems.push(`${packagePath} invalid JSON`);
}

if (
  parsedPackage?.scripts?.["check:a1-twii-terms-field-cadence-attribution-no-fetch-packet"] !==
  "node scripts/check-a1-twii-terms-field-cadence-attribution-no-fetch-packet.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-terms-field-cadence-attribution-no-fetch-packet`);
}

if (!reviewGate.includes("check-a1-twii-terms-field-cadence-attribution-no-fetch-packet.mjs")) {
  problems.push(`${reviewGatePath} missing checker script reference`);
}

if (!reviewGate.includes("a1-twii-terms-field-cadence-attribution-no-fetch-packet")) {
  problems.push(`${reviewGatePath} missing checker gate name`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exitCode = 1;
} else {
  console.log(
    JSON.stringify(
      {
        status: "ok",
        mode: "a1_twii_terms_field_cadence_attribution_no_fetch_packet",
        publicDataSource: "mock",
        scoreSource: "mock",
        nextPmRoute: "wire_twii_terms_field_cadence_attribution_status_into_runtime_readiness_copy",
        nextA1Route: "prepare_twii_bounded_readonly_gate_candidate_requirements_no_execution",
        nextA2Route: "review_twii_source_attribution_and_cadence_public_copy_guard"
      },
      null,
      2
    )
  );
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`${path} missing`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
}
