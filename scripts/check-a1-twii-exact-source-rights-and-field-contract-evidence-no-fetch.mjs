import fs from "node:fs";

const docPath = "docs/A1_TWII_EXACT_SOURCE_RIGHTS_AND_FIELD_CONTRACT_EVIDENCE_NO_FETCH.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "A1 TWII Exact Source Rights And Field Contract Evidence No-Fetch",
  "`a1_twii_exact_source_rights_and_field_contract_evidence_ready_no_fetch`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "Weighted Stock Price Index Historical Data",
  "https://data.gov.tw/en/datasets/11755",
  "Securities and Futures Bureau, Financial Supervisory Commission, Executive Yuan, R.O.C.",
  "Every day",
  "Open Government Data License, version 1.0",
  "free",
  "https://openapi.twse.com.tw/v1/swagger.json",
  "2026-06-01 12:06",
  "https://data.gov.tw/en/datasets/11669",
  "https://data.gov.tw/dataset/11548",
  "`trade_date`",
  "`close_value`",
  "`instrument_code`",
  "`instrument_name`",
  "`source_url_label`",
  "`source_updated_at`",
  "`twii_exact_source_rights_and_field_contract_evidence_ready_for_pm_review_not_execution`",
  "`accept_twii_exact_source_rights_and_field_contract_evidence_no_fetch`",
  "`review_exact_twii_evidence_then_prepare_operator_readonly_decision_packet_or_repair`",
  "`prepare_twii_operator_readonly_decision_packet_no_execution_if_pm_accepts_evidence`",
  "`prepare_twii_source_attribution_cadence_phrase_set_patch_if_pm_requests`",
  "SQL execution",
  "Supabase connection",
  "Supabase reads",
  "Supabase writes",
  "staging rows",
  "`daily_prices` mutation",
  "endpoint probe",
  "OpenAPI call",
  "CSV download",
  "market-data fetch",
  "market-data ingest",
  "market-data storage",
  "market-data commit",
  "runner creation",
  "parser implementation",
  "candidate market-row artifact generation",
  "raw payload output",
  "row payload output",
  "stock-id row-list output",
  "secret output",
  "row coverage points",
  "public source promotion",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "real-time market-data claims",
  "official endorsement claims",
  "investment advice claims"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const forbiddenPatterns = [
  /\bfetch\(/iu,
  /\bcreateClient\(/iu,
  /@supabase\/supabase-js/iu,
  /\.from\(/iu,
  /\.select\(/iu,
  /\.insert\(/iu,
  /\.upsert\(/iu,
  /\binsert\s+into\b/iu,
  /\bselect\s+\*\s+from\b/iu,
  /\bupdate\s+daily_prices\b/iu,
  /publicDataSource\s*=\s*"supabase"/iu,
  /scoreSource\s*=\s*"real"/iu,
  /rawPayloadOutput\s*:\s*true/iu,
  /rowPayloadOutput\s*:\s*true/iu,
  /stockIdRowListOutput\s*:\s*true/iu,
  /supabaseWrite\s*:\s*true/iu,
  /dailyPricesMutation\s*:\s*true/iu,
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
  parsedPackage?.scripts?.["check:a1-twii-exact-source-rights-and-field-contract-evidence-no-fetch"] !==
  "node scripts/check-a1-twii-exact-source-rights-and-field-contract-evidence-no-fetch.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-exact-source-rights-and-field-contract-evidence-no-fetch`);
}

if (!reviewGate.includes("check-a1-twii-exact-source-rights-and-field-contract-evidence-no-fetch.mjs")) {
  problems.push(`${reviewGatePath} missing checker script reference`);
}

if (!reviewGate.includes("a1-twii-exact-source-rights-and-field-contract-evidence-no-fetch")) {
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
        mode: "a1_twii_exact_source_rights_and_field_contract_evidence_no_fetch",
        publicDataSource: "mock",
        scoreSource: "mock",
        nextPmRoute: "review_exact_twii_evidence_then_prepare_operator_readonly_decision_packet_or_repair",
        nextA1Route: "prepare_twii_operator_readonly_decision_packet_no_execution_if_pm_accepts_evidence",
        nextA2Route: "prepare_twii_source_attribution_cadence_phrase_set_patch_if_pm_requests"
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
