import fs from "node:fs";

const problems = [];

const docPath = "docs/RUNTIME_DATA_PROMOTION_HANDOFF_CHECKLIST.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const rollupPath = "docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md";
const policyPath = "docs/RUNTIME_PROMOTION_POLICY_FROM_FIRST_CLOSED_LOOP.md";
const coveragePath = "docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md";
const scoringPath = "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md";
const proofPath = "docs/LOCAL_LAUNCH_PROOF_BUNDLE_SNAPSHOT.md";
const gapPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_GAP_LIST.md";
const runtimeSummaryPath = "src/lib/runtime-promotion-readiness-summary.ts";
const postReadonlyPath = "src/lib/post-readonly-runtime-state.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const rollup = read(rollupPath);
const policy = read(policyPath);
const coverage = read(coveragePath);
const scoring = read(scoringPath);
const proof = read(proofPath);
const gap = read(gapPath);
const runtimeSummary = read(runtimeSummaryPath);
const postReadonly = read(postReadonlyPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `runtime_data_promotion_handoff_checklist_ready_mock_boundary_preserved`",
  "CEO decision: `align_runtime_promotion_gate_with_data_coverage_route_without_real_promotion`",
  "runtime_data_handoff_then_runtime_summary_alignment_or_coverage_gate",
  "runtime_data_handoff_ready_runtime_summary_alignment_pending",
  "docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md",
  "docs/RUNTIME_PROMOTION_POLICY_FROM_FIRST_CLOSED_LOOP.md",
  "docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md",
  "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md",
  "docs/LOCAL_LAUNCH_PROOF_BUNDLE_SNAPSHOT.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_GAP_LIST.md",
  "src/lib/runtime-promotion-readiness-summary.ts",
  "src/lib/post-readonly-runtime-state.ts",
  "data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked",
  "180/180",
  "182/360",
  "178",
  "TWII` at `0/60",
  "0050` and `006208` at `2/120",
  "publicDataSource=mock",
  "scoreSource=mock",
  "## Runtime Handoff Contract",
  "accepted_first_closed_loop_complete",
  "## Required Data Evidence Before Runtime Promotion",
  "accepted source rights",
  "accepted field contract",
  "bounded candidate artifact",
  "bounded write/readback/post-run review evidence",
  "aggregate row coverage scoring acceptance",
  "separate approval for `publicDataSource=supabase`",
  "separate approval for `scoreSource=real`",
  "## Runtime Summary Alignment Item",
  "src/lib/post-readonly-runtime-state.ts",
  "5/360",
  "Latest accepted rollup and workstream board represent current Level 1 evidence as `182/360`",
  "not_ready_for_real_data_promotion",
  "A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`",
  "## Hard Stops",
  "The next route is `runtime_summary_alignment_from_first_closed_loop_evidence_or_coverage_gate`, not real promotion"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [filePath, content, phrases] of [
  [
    rollupPath,
    rollup,
    [
      "Status: `data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked`",
      "observed rows: `182`",
      "missing rows: `178`",
      "`publicDataSource=mock`",
      "`scoreSource=mock`"
    ]
  ],
  [
    policyPath,
    policy,
    [
      "Status: `runtime_promotion_policy_from_first_closed_loop_ready_mock_boundary_preserved`",
      "full MVP rows: `182/360`",
      "missing rows: `178`",
      "`publicDataSource=mock`",
      "`scoreSource=mock`"
    ]
  ],
  [
    coveragePath,
    coverage,
    [
      "Status: `a1_mvp_coverage_closure_route_support_ready_local_only_not_executable`",
      "Current observed coverage: `182/360`",
      "Missing rows: `178`",
      "TWII` is `0/60`",
      "Combined ETF coverage: `2/120`"
    ]
  ],
  [
    scoringPath,
    scoring,
    ["Status: `tw_equity_row_coverage_subscope_accepted_overall_coverage_blocked`"]
  ],
  [
    proofPath,
    proof,
    ["Status: `local_launch_proof_bundle_snapshot_ready_external_values_pending`"]
  ],
  [
    gapPath,
    gap,
    ["Status: `beta_deployment_operator_values_gap_list_ready_external_values_pending`"]
  ]
]) {
  for (const phrase of phrases) {
    if (!content.includes(phrase)) problems.push(`${filePath} missing: ${phrase}`);
  }
}

for (const phrase of [
  "RuntimePromotionReadinessSummary",
  "not_ready_for_real_data_promotion",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!runtimeSummary.includes(phrase)) problems.push(`${runtimeSummaryPath} missing: ${phrase}`);
}

for (const phrase of [
  "observedRows: 182",
  "missingRows: 178",
  "expectedRows: 360",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!postReadonly.includes(phrase)) problems.push(`${postReadonlyPath} missing aligned runtime baseline: ${phrase}`);
}

for (const phrase of [
  "Latest runtime data promotion handoff checklist slice",
  "runtime_data_promotion_handoff_checklist_ready_mock_boundary_preserved",
  "align_runtime_promotion_gate_with_data_coverage_route_without_real_promotion",
  "runtime_data_handoff_ready_runtime_summary_alignment_pending",
  "runtime_summary_alignment_from_first_closed_loop_evidence_or_coverage_gate"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/RUNTIME_DATA_PROMOTION_HANDOFF_CHECKLIST.md` is `accepted` as PM mainline runtime/data promotion handoff checklist",
  "runtime_data_promotion_handoff_checklist_ready_mock_boundary_preserved",
  "align_runtime_promotion_gate_with_data_coverage_route_without_real_promotion",
  "runtime_data_handoff_ready_runtime_summary_alignment_pending",
  "runtime_summary_alignment_from_first_closed_loop_evidence_or_coverage_gate"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:runtime-data-promotion-handoff-checklist"] !==
  "node scripts/check-runtime-data-promotion-handoff-checklist.mjs"
) {
  problems.push(`${packagePath} missing check:runtime-data-promotion-handoff-checklist script`);
}

for (const phrase of [
  "scripts/check-runtime-data-promotion-handoff-checklist.mjs",
  "expectStatus: \"ok\"",
  "name: \"runtime-data-promotion-handoff-checklist\"",
  "\"runtime-data-promotion-handoff-checklist\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const forbiddenPatterns = [
  /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /\b[A-Za-z0-9_-]{32,}\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/u,
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /full MVP coverage complete/u,
  /investment advice approved/u
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "runtime_data_promotion_handoff_checklist_ready_mock_boundary_preserved",
      outcome: "runtime_data_handoff_ready_runtime_summary_alignment_pending",
      nextRoute: "runtime_summary_alignment_from_first_closed_loop_evidence_or_coverage_gate",
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
