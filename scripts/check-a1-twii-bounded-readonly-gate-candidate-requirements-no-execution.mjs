import fs from "node:fs";

const docPath = "docs/A1_TWII_BOUNDED_READONLY_GATE_CANDIDATE_REQUIREMENTS_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "A1 TWII Bounded Readonly Gate Candidate Requirements No-Execution",
  "`a1_twii_bounded_readonly_gate_candidate_requirements_ready_no_execution`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "Candidate Gate Shape",
  "`twii_bounded_readonly_gate_candidate_requirements_no_execution`",
  "`TWII` / `index_baseline`",
  "`official_open_data_api`",
  "`daily_after_close_index_baseline`",
  "`readiness_copy_only`",
  "Required Before Any Future Readonly Attempt",
  "Source rights",
  "Field contract",
  "Cadence",
  "Readonly scope",
  "Secret posture",
  "Output posture",
  "Post-run review",
  "Promotion gate",
  "Future Attempt Minimum Packet Fields",
  "`operatorDecision`",
  "`authorizationPhrase`",
  "`executeSwitch`",
  "`sourceRoute`",
  "`maxScope`",
  "`rawPayloadOutput`",
  "`rowPayloadOutput`",
  "`stockIdRowListOutput`",
  "`supabaseWrite`",
  "`dailyPricesMutation`",
  "`publicDataSourcePromotion`",
  "`scoreSourcePromotion`",
  "Fail-Closed Requirements",
  "`accept_twii_bounded_readonly_gate_candidate_requirements_no_execution`",
  "`surface_bounded_readonly_requirements_as_runtime_readiness_then_wait_for_external_execution_decision`",
  "`prepare_exact_source_rights_and_field_contract_evidence_for_future_readonly_attempt`",
  "`review_twii_source_attribution_and_cadence_public_copy_guard`",
  "SQL execution",
  "Supabase connection",
  "Supabase reads",
  "Supabase writes",
  "staging rows",
  "`daily_prices` mutation",
  "endpoint probe",
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
  parsedPackage?.scripts?.["check:a1-twii-bounded-readonly-gate-candidate-requirements-no-execution"] !==
  "node scripts/check-a1-twii-bounded-readonly-gate-candidate-requirements-no-execution.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-bounded-readonly-gate-candidate-requirements-no-execution`);
}

if (!reviewGate.includes("check-a1-twii-bounded-readonly-gate-candidate-requirements-no-execution.mjs")) {
  problems.push(`${reviewGatePath} missing checker script reference`);
}

if (!reviewGate.includes("a1-twii-bounded-readonly-gate-candidate-requirements-no-execution")) {
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
        mode: "a1_twii_bounded_readonly_gate_candidate_requirements_no_execution",
        publicDataSource: "mock",
        scoreSource: "mock",
        nextPmRoute: "surface_bounded_readonly_requirements_as_runtime_readiness_then_wait_for_external_execution_decision",
        nextA1Route: "prepare_exact_source_rights_and_field_contract_evidence_for_future_readonly_attempt",
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
