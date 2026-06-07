import fs from "node:fs";

const problems = [];

const docPath = "docs/RUNTIME_PROMOTION_POLICY_FROM_FIRST_CLOSED_LOOP.md";
const rollupPath = "docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md";
const rowCoverageGatePath = "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md";
const publicBetaGatePath = "docs/PUBLIC_BETA_READINESS_GATE.md";
const runtimeSummaryPath = "src/lib/runtime-promotion-readiness-summary.ts";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const rollup = read(rollupPath);
const rowCoverageGate = read(rowCoverageGatePath);
const publicBetaGate = read(publicBetaGatePath);
const runtimeSummary = read(runtimeSummaryPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `runtime_promotion_policy_from_first_closed_loop_ready_mock_boundary_preserved`",
  "CEO decision: `use_first_closed_loop_as_beta_evidence_not_runtime_promotion`",
  "publicDataSource=mock",
  "scoreSource=mock",
  "public real-data claim: `blocked`",
  "real score claim: `blocked`",
  "full MVP row coverage readiness: `blocked`",
  "docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md",
  "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md",
  "docs/PUBLIC_BETA_READINESS_GATE.md",
  "src/lib/runtime-promotion-readiness-summary.ts",
  "data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked",
  "accepted_first_closed_loop_complete",
  "`2330`, `2382`, `2308`",
  "TW equity sub-scope rows: `180/180`",
  "full MVP rows: `182/360`",
  "missing rows: `178`",
  "blocked symbols: `TWII` `0/60`, `0050` `1/60`, `006208` `1/60`",
  "## Runtime Policy",
  "first_closed_loop_evidence_allowed",
  "mock_runtime_with_evidence_context",
  "mock_runtime_with_partial_coverage_context",
  "must_disclose_mock_and_partial_coverage",
  "beta_can_prepare_without_real_promotion",
  "## Promotion Decision Rules",
  "full MVP row coverage is complete",
  "partial-coverage public Beta policy",
  "`TWII`, `0050`, and `006208` source-rights and field contracts are accepted",
  "separate runtime promotion gate",
  "separate score promotion gate",
  "## Allowed Work From This Policy",
  "twii_etf_blocked_universe_candidate_and_rights_path",
  "partial_coverage_public_beta_copy_alignment",
  "runtime_policy_to_public_surface_mapping",
  "The next route is `runtime_policy_to_public_surface_mapping_or_blocked_universe_candidate_path`"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const requiredHardStops = [
  "SQL execution",
  "Supabase write",
  "staging row creation",
  "`daily_prices` mutation",
  "raw market-data fetch",
  "raw market-data ingest",
  "raw market-data storage",
  "raw market-data commit",
  "raw payload output",
  "row payload output",
  "stock id payload output",
  "secret output",
  "additional row coverage points",
  "full MVP coverage claim",
  "public source promotion",
  "`publicDataSource=supabase`",
  "real score promotion",
  "`scoreSource=real`",
  "investment advice claim",
  "public launch completion claim"
];

for (const phrase of requiredHardStops) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

for (const [pathName, text, phrase] of [
  [rollupPath, rollup, "Status: `data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked`"],
  [rollupPath, rollup, "sub-scope status: `accepted_first_closed_loop_complete`"],
  [rollupPath, rollup, "Full MVP coverage:"],
  [rollupPath, rollup, "publicDataSource=mock"],
  [rollupPath, rollup, "scoreSource=mock"],
  [rowCoverageGatePath, rowCoverageGate, "Status: `tw_equity_row_coverage_subscope_accepted_overall_coverage_blocked`"],
  [rowCoverageGatePath, rowCoverageGate, "sub-scope status: `accepted_complete`"],
  [rowCoverageGatePath, rowCoverageGate, "full-scope status: `blocked_incomplete`"],
  [publicBetaGatePath, publicBetaGate, "public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked"],
  [publicBetaGatePath, publicBetaGate, "publicDataSource=mock"],
  [publicBetaGatePath, publicBetaGate, "scoreSource=mock"],
  [runtimeSummaryPath, runtimeSummary, "not_ready_for_real_data_promotion"],
  [runtimeSummaryPath, runtimeSummary, "publicDataSource: \"mock\""],
  [runtimeSummaryPath, runtimeSummary, "scoreSource: \"mock\""]
]) {
  if (!text.includes(phrase)) problems.push(`${pathName} missing evidence phrase: ${phrase}`);
}

for (const phrase of [
  "Latest runtime promotion policy from first closed loop slice",
  "docs/RUNTIME_PROMOTION_POLICY_FROM_FIRST_CLOSED_LOOP.md",
  "runtime_promotion_policy_from_first_closed_loop_ready_mock_boundary_preserved",
  "use_first_closed_loop_as_beta_evidence_not_runtime_promotion",
  "first closed loop may be used as Beta evidence but not runtime promotion",
  "runtime_policy_to_public_surface_mapping_or_blocked_universe_candidate_path"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:runtime-promotion-policy-from-first-closed-loop"] !==
  "node scripts/check-runtime-promotion-policy-from-first-closed-loop.mjs"
) {
  problems.push(`${packagePath} missing check:runtime-promotion-policy-from-first-closed-loop`);
}

for (const phrase of [
  "scripts/check-runtime-promotion-policy-from-first-closed-loop.mjs",
  "expectStatus: \"ok\"",
  "name: \"runtime-promotion-policy-from-first-closed-loop\"",
  "\"runtime-promotion-policy-from-first-closed-loop\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const forbiddenApprovalPatterns = [
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /public real-data claim: `accepted`/u,
  /real score claim: `accepted`/u,
  /full MVP row coverage readiness: `accepted`/u,
  /production deployment completed/u,
  /public launch completion claim accepted/u
];

for (const pattern of forbiddenApprovalPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden approval pattern: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "runtime_promotion_policy_from_first_closed_loop_ready_mock_boundary_preserved",
      runtime: "publicDataSource=mock",
      score: "scoreSource=mock",
      nextRoute: "runtime_policy_to_public_surface_mapping_or_blocked_universe_candidate_path"
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
