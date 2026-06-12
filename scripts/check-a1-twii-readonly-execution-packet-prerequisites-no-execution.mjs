import fs from "node:fs";

const docPath = "docs/A1_TWII_READONLY_EXECUTION_PACKET_PREREQUISITES_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "A1 TWII Readonly Execution Packet Prerequisites No-Execution",
  "`a1_twii_readonly_execution_packet_prerequisites_ready_no_execution`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "docs/A1_TWII_EXACT_SOURCE_RIGHTS_AND_FIELD_CONTRACT_EVIDENCE_NO_FETCH.md",
  "a1_twii_exact_source_rights_and_field_contract_evidence_ready_no_fetch",
  "docs/TWII_OPERATOR_READONLY_DECISION_PACKET_NO_EXECUTION.md",
  "twii_operator_readonly_decision_packet_ready_no_execution",
  "`authorize_one_bounded_readonly_attempt`",
  "`request_evidence_repair`",
  "`defer_readonly_attempt`",
  "`twii_one_bounded_readonly_attempt`",
  "`TWII index baseline aggregate reachability/count only`",
  "`attemptLimit`",
  "`serverOnlyRuntime`",
  "`sqlExecution`",
  "`supabaseWrite`",
  "`dailyPricesMutation`",
  "`rawPayloadOutput`",
  "`rowPayloadOutput`",
  "`stockIdRowListOutput`",
  "`marketDataFetch`",
  "`publicDataSourcePromotion`",
  "`scoreSourcePromotion`",
  "`postRunReviewRequired`",
  "sanitized aggregate-only result shape",
  "`wait_for_explicit_operator_decision_before_execution_packet`",
  "`prepare_separate_twii_readonly_execution_packet_no_write`",
  "`twii_operator_decision_public_copy_guard`",
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
  "runner execution",
  "parser execution",
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
  /sqlExecution`\s*\|\s*`true/iu,
  /supabaseWrite`\s*\|\s*`true/iu,
  /dailyPricesMutation`\s*\|\s*`true/iu,
  /rawPayloadOutput`\s*\|\s*`true/iu,
  /rowPayloadOutput`\s*\|\s*`true/iu,
  /stockIdRowListOutput`\s*\|\s*`true/iu,
  /marketDataFetch`\s*\|\s*`true/iu,
  /publicDataSourcePromotion`\s*\|\s*`true/iu,
  /scoreSourcePromotion`\s*\|\s*`true/iu,
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
  parsedPackage?.scripts?.["check:a1-twii-readonly-execution-packet-prerequisites-no-execution"] !==
  "node scripts/check-a1-twii-readonly-execution-packet-prerequisites-no-execution.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-readonly-execution-packet-prerequisites-no-execution`);
}

if (!reviewGate.includes("check-a1-twii-readonly-execution-packet-prerequisites-no-execution.mjs")) {
  problems.push(`${reviewGatePath} missing checker script reference`);
}

if (!reviewGate.includes("a1-twii-readonly-execution-packet-prerequisites-no-execution")) {
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
        mode: "a1_twii_readonly_execution_packet_prerequisites_no_execution",
        publicDataSource: "mock",
        scoreSource: "mock",
        nextPmRoute: "wait_for_explicit_operator_decision_before_execution_packet",
        futurePmRouteIfAuthorized: "prepare_separate_twii_readonly_execution_packet_no_write",
        nextA2Route: "twii_operator_decision_public_copy_guard"
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
