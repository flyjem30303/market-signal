import fs from "node:fs";

const docPath = "docs/TWII_OPERATOR_READONLY_DECISION_PACKET_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "TWII Operator Readonly Decision Packet No-Execution",
  "`twii_operator_readonly_decision_packet_ready_no_execution`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "docs/A1_TWII_EXACT_SOURCE_RIGHTS_AND_FIELD_CONTRACT_EVIDENCE_NO_FETCH.md",
  "a1_twii_exact_source_rights_and_field_contract_evidence_ready_no_fetch",
  "twii_exact_source_rights_and_field_contract_evidence_ready_for_pm_review_not_execution",
  "https://data.gov.tw/en/datasets/11755",
  "Weighted Stock Price Index Historical Data",
  "Open Government Data License, version 1.0",
  "free",
  "Every day",
  "https://openapi.twse.com.tw/v1/swagger.json",
  "`authorize_one_bounded_readonly_attempt`",
  "`request_evidence_repair`",
  "`defer_readonly_attempt`",
  "`prepare_separate_twii_readonly_execution_packet_no_write`",
  "`return_to_a1_exact_twii_evidence_repair_no_fetch`",
  "`continue_public_beta_runtime_mock_readability`",
  "`operatorDecision`",
  "`sourceEvidencePacket`",
  "`sourceEvidenceStatus`",
  "`readonlyScope`",
  "`attemptLimit`",
  "`writePermission`",
  "`rawPayloadOutput`",
  "`rowPayloadOutput`",
  "`stockIdRowListOutput`",
  "`publicDataSourcePromotion`",
  "`scoreSourcePromotion`",
  "`postRunReviewRequired`",
  "operatorDecisionAcceptedNow=false",
  "executionPacketPreparedNow=false",
  "runnerExecutableNow=false",
  "readonlyAttemptExecutableNow=false",
  "sqlExecutableNow=false",
  "supabaseWriteAllowedNow=false",
  "sourcePromotionAllowedNow=false",
  "scorePromotionAllowedNow=false",
  "`prepare_twii_readonly_execution_packet_prerequisites_if_operator_authorizes_later`",
  "`prepare_twii_operator_decision_public_copy_guard_if_pm_requests`",
  "`review_operator_readonly_decision_packet_then_wait_for_explicit_operator_decision`",
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
  /operatorDecisionAcceptedNow=true/iu,
  /executionPacketPreparedNow=true/iu,
  /runnerExecutableNow=true/iu,
  /readonlyAttemptExecutableNow=true/iu,
  /sqlExecutableNow=true/iu,
  /supabaseWriteAllowedNow=true/iu,
  /sourcePromotionAllowedNow=true/iu,
  /scorePromotionAllowedNow=true/iu,
  /rawPayloadOutput\s*:\s*true/iu,
  /rowPayloadOutput\s*:\s*true/iu,
  /stockIdRowListOutput\s*:\s*true/iu,
  /writePermission\s*:\s*true/iu,
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
  parsedPackage?.scripts?.["check:twii-operator-readonly-decision-packet-no-execution"] !==
  "node scripts/check-twii-operator-readonly-decision-packet-no-execution.mjs"
) {
  problems.push(`${packagePath} missing check:twii-operator-readonly-decision-packet-no-execution`);
}

if (!reviewGate.includes("check-twii-operator-readonly-decision-packet-no-execution.mjs")) {
  problems.push(`${reviewGatePath} missing checker script reference`);
}

if (!reviewGate.includes("twii-operator-readonly-decision-packet-no-execution")) {
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
        mode: "twii_operator_readonly_decision_packet_no_execution",
        publicDataSource: "mock",
        scoreSource: "mock",
        nextPmRoute: "review_operator_readonly_decision_packet_then_wait_for_explicit_operator_decision",
        nextA1Route: "prepare_twii_readonly_execution_packet_prerequisites_if_operator_authorizes_later",
        nextA2Route: "prepare_twii_operator_decision_public_copy_guard_if_pm_requests"
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
