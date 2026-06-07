import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/RUNTIME_SUMMARY_ALIGNMENT_FROM_FIRST_CLOSED_LOOP.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const handoffPath = "docs/RUNTIME_DATA_PROMOTION_HANDOFF_CHECKLIST.md";
const rollupPath = "docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md";
const policyPath = "docs/RUNTIME_PROMOTION_POLICY_FROM_FIRST_CLOSED_LOOP.md";
const coveragePath = "docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md";
const postReadonlyPath = "src/lib/post-readonly-runtime-state.ts";
const runtimeSummaryPath = "src/lib/runtime-promotion-readiness-summary.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const handoff = read(handoffPath);
const rollup = read(rollupPath);
const policy = read(policyPath);
const coverage = read(coveragePath);
const postReadonly = read(postReadonlyPath);
const runtimeSummary = read(runtimeSummaryPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `runtime_summary_alignment_from_first_closed_loop_applied_mock_boundary_preserved`",
  "CEO decision: `align_runtime_summary_to_accepted_first_closed_loop_without_real_promotion`",
  "runtime_summary_aligned_then_coverage_gate_or_operator_values",
  "runtime_summary_aligned_real_promotion_blocked",
  "docs/RUNTIME_DATA_PROMOTION_HANDOFF_CHECKLIST.md",
  "docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md",
  "docs/RUNTIME_PROMOTION_POLICY_FROM_FIRST_CLOSED_LOOP.md",
  "docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md",
  "src/lib/post-readonly-runtime-state.ts",
  "src/lib/runtime-promotion-readiness-summary.ts",
  "data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked",
  "180/180",
  "182/360",
  "178",
  "publicDataSource=mock",
  "scoreSource=mock",
  "not_ready_for_real_data_promotion",
  "observedRows: 182",
  "missingRows: 178",
  "The old `5/360` value remains valid only in historical readonly-attempt records",
  "## Product Meaning",
  "## Hard Stops",
  "The next route is `coverage_gate_or_operator_values_after_runtime_summary_alignment`, not real promotion"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [filePath, content, phrases] of [
  [
    handoffPath,
    handoff,
    [
      "Status: `runtime_data_promotion_handoff_checklist_ready_mock_boundary_preserved`",
      "runtime_summary_alignment_from_first_closed_loop_evidence_or_coverage_gate",
      "182/360",
      "178"
    ]
  ],
  [
    rollupPath,
    rollup,
    [
      "Status: `data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked`",
      "observed rows: `182`",
      "missing rows: `178`"
    ]
  ],
  [
    policyPath,
    policy,
    [
      "Status: `runtime_promotion_policy_from_first_closed_loop_ready_mock_boundary_preserved`",
      "full MVP rows: `182/360`",
      "missing rows: `178`"
    ]
  ],
  [
    coveragePath,
    coverage,
    [
      "Status: `a1_mvp_coverage_closure_route_support_ready_local_only_not_executable`",
      "Current observed coverage: `182/360`",
      "Missing rows: `178`"
    ]
  ]
]) {
  for (const phrase of phrases) {
    if (!content.includes(phrase)) problems.push(`${filePath} missing: ${phrase}`);
  }
}

for (const phrase of [
  "observedRows: 182",
  "missingRows: 178",
  "expectedRows: 360",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "coverageStatus: \"blocked\"",
  "aggregate_count_incomplete",
  "state: \"readonly_verified_mock_only\"",
  "stopLine:"
]) {
  if (!postReadonly.includes(phrase)) problems.push(`${postReadonlyPath} missing aligned runtime phrase: ${phrase}`);
}

for (const phrase of [
  "observedRows: 182",
  "missingRows: 178",
  "expectedRows: 360",
  "not_ready_for_real_data_promotion",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!runtimeSummary.includes(phrase)) problems.push(`${runtimeSummaryPath} missing aligned summary phrase: ${phrase}`);
}

for (const phrase of [
  "Latest runtime summary alignment from first closed loop slice",
  "runtime_summary_alignment_from_first_closed_loop_applied_mock_boundary_preserved",
  "align_runtime_summary_to_accepted_first_closed_loop_without_real_promotion",
  "runtime_summary_aligned_real_promotion_blocked",
  "coverage_gate_or_operator_values_after_runtime_summary_alignment"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/RUNTIME_SUMMARY_ALIGNMENT_FROM_FIRST_CLOSED_LOOP.md` is `accepted` as PM mainline runtime summary alignment",
  "runtime_summary_alignment_from_first_closed_loop_applied_mock_boundary_preserved",
  "align_runtime_summary_to_accepted_first_closed_loop_without_real_promotion",
  "runtime_summary_aligned_real_promotion_blocked",
  "coverage_gate_or_operator_values_after_runtime_summary_alignment"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:runtime-summary-alignment-from-first-closed-loop"] !==
  "node scripts/check-runtime-summary-alignment-from-first-closed-loop.mjs"
) {
  problems.push(`${packagePath} missing check:runtime-summary-alignment-from-first-closed-loop script`);
}

for (const phrase of [
  "scripts/check-runtime-summary-alignment-from-first-closed-loop.mjs",
  "expectStatus: \"ok\"",
  "name: \"runtime-summary-alignment-from-first-closed-loop\"",
  "\"runtime-summary-alignment-from-first-closed-loop\""
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

const tsc = spawnSync(process.execPath, ["node_modules/typescript/bin/tsc", "--noEmit"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (tsc.status !== 0) {
  problems.push(`typescript failed: ${(tsc.stderr || tsc.stdout).trim()}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "runtime_summary_alignment_from_first_closed_loop_applied_mock_boundary_preserved",
      outcome: "runtime_summary_aligned_real_promotion_blocked",
      nextRoute: "coverage_gate_or_operator_values_after_runtime_summary_alignment",
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
