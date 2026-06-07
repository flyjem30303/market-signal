import fs from "node:fs";

const problems = [];

const docPath = "docs/RUNTIME_POLICY_PUBLIC_SURFACE_MAPPING.md";
const policyPath = "docs/RUNTIME_PROMOTION_POLICY_FROM_FIRST_CLOSED_LOOP.md";
const rollupPath = "docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md";
const publicBetaGatePath = "docs/PUBLIC_BETA_READINESS_GATE.md";
const publicCopyPath = "src/lib/public-runtime-boundary-copy.ts";
const trustNoticePath = "src/components/trust-runtime-boundary-notice.tsx";
const freshnessStripPath = "src/components/data-freshness-strip.tsx";
const runtimeSummaryPath = "src/lib/runtime-promotion-readiness-summary.ts";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const policy = read(policyPath);
const rollup = read(rollupPath);
const publicBetaGate = read(publicBetaGatePath);
const publicCopy = read(publicCopyPath);
const trustNotice = read(trustNoticePath);
const freshnessStrip = read(freshnessStripPath);
const runtimeSummary = read(runtimeSummaryPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `runtime_policy_public_surface_mapping_ready_mock_boundary_preserved`",
  "CEO decision: `map_first_closed_loop_policy_to_public_surfaces_without_real_promotion`",
  "docs/RUNTIME_PROMOTION_POLICY_FROM_FIRST_CLOSED_LOOP.md",
  "docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md",
  "docs/PUBLIC_BETA_READINESS_GATE.md",
  "src/lib/public-runtime-boundary-copy.ts",
  "src/components/trust-runtime-boundary-notice.tsx",
  "src/components/data-freshness-strip.tsx",
  "src/lib/runtime-promotion-readiness-summary.ts",
  "data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked",
  "accepted_first_closed_loop_complete",
  "`2330`, `2382`, `2308`",
  "TW equity sub-scope rows: `180/180`",
  "full MVP rows: `182/360`",
  "missing rows: `178`",
  "blocked symbols: `TWII` `0/60`, `0050` `1/60`, `006208` `1/60`",
  "runtime stop line: `publicDataSource=mock`",
  "score stop line: `scoreSource=mock`",
  "## Mapping Rules",
  "`/` home",
  "`/stocks/[symbol]` stock detail",
  "`/briefing`",
  "`/weekly`",
  "`/methodology`",
  "`/disclaimer`, `/terms`, `/privacy`",
  "shared trust/freshness/footer/site navigation",
  "bounded_public_surface_copy_patch_from_mapping",
  "PM mainline: `public_surface_copy_patch_from_mapping`",
  "A1 support lane: `twii_etf_blocked_universe_candidate_and_rights_path`",
  "A2 support lane: `partial_coverage_public_beta_copy_alignment`",
  "The next route is `bounded_public_surface_copy_patch_from_mapping_or_blocked_universe_candidate_path`"
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
  [policyPath, policy, "Status: `runtime_promotion_policy_from_first_closed_loop_ready_mock_boundary_preserved`"],
  [policyPath, policy, "CEO decision: `use_first_closed_loop_as_beta_evidence_not_runtime_promotion`"],
  [policyPath, policy, "first_closed_loop_evidence_allowed"],
  [policyPath, policy, "runtime_policy_to_public_surface_mapping"],
  [rollupPath, rollup, "Status: `data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked`"],
  [rollupPath, rollup, "TW equity sub-scope:"],
  [rollupPath, rollup, "final daily_prices rows for sub-scope: `180`"],
  [rollupPath, rollup, "Full MVP coverage:"],
  [rollupPath, rollup, "observed rows: `182`"],
  [rollupPath, rollup, "missing rows: `178`"],
  [rollupPath, rollup, "publicDataSource=mock"],
  [rollupPath, rollup, "scoreSource=mock"],
  [publicBetaGatePath, publicBetaGate, "public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked"],
  [publicBetaGatePath, publicBetaGate, "publicDataSource=mock"],
  [publicBetaGatePath, publicBetaGate, "scoreSource=mock"],
  [publicCopyPath, publicCopy, "Public Beta boundary: mock-only"],
  [publicCopyPath, publicCopy, "publicDataSource=mock; scoreSource=mock"],
  [trustNoticePath, trustNotice, "投資與資料限制：目前仍是 mock-only"],
  [trustNoticePath, trustNotice, "publicDataSource=mock; scoreSource=mock"],
  [freshnessStripPath, freshnessStrip, "Data freshness metadata: mock"],
  [freshnessStripPath, freshnessStrip, "Score source:"],
  [runtimeSummaryPath, runtimeSummary, "not_ready_for_real_data_promotion"],
  [runtimeSummaryPath, runtimeSummary, "publicDataSource: \"mock\""],
  [runtimeSummaryPath, runtimeSummary, "scoreSource: \"mock\""]
]) {
  if (!text.includes(phrase)) problems.push(`${pathName} missing evidence phrase: ${phrase}`);
}

for (const phrase of [
  "Latest runtime policy public surface mapping slice",
  "docs/RUNTIME_POLICY_PUBLIC_SURFACE_MAPPING.md",
  "runtime_policy_public_surface_mapping_ready_mock_boundary_preserved",
  "map_first_closed_loop_policy_to_public_surfaces_without_real_promotion",
  "bounded_public_surface_copy_patch_from_mapping_or_blocked_universe_candidate_path"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:runtime-policy-public-surface-mapping"] !==
  "node scripts/check-runtime-policy-public-surface-mapping.mjs"
) {
  problems.push(`${packagePath} missing check:runtime-policy-public-surface-mapping`);
}

for (const phrase of [
  "scripts/check-runtime-policy-public-surface-mapping.mjs",
  "expectStatus: \"ok\"",
  "name: \"runtime-policy-public-surface-mapping\"",
  "\"runtime-policy-public-surface-mapping\""
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
  /public launch completion claim accepted/u,
  /investment advice claim accepted/u
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
      guardedStatus: "runtime_policy_public_surface_mapping_ready_mock_boundary_preserved",
      runtime: "publicDataSource=mock",
      score: "scoreSource=mock",
      nextRoute: "bounded_public_surface_copy_patch_from_mapping_or_blocked_universe_candidate_path"
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
