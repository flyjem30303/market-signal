import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/A1_SOURCE_RIGHTS_UNBLOCK_PRIORITY_PACKET.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const coveragePath = "docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md";
const stoplinePath = "docs/TWII_FINAL_AUTHORIZATION_STOPLINE_GO_NO_GO_GATE.md";
const selectorPath = "docs/PHASE_1_DATA_ONLINE_EXECUTION_SELECTOR.md";
const etfPacketPath = "docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md";
const etfOutcomePath = "docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md";
const runtimeAlignmentPath = "docs/RUNTIME_SUMMARY_ALIGNMENT_FROM_FIRST_CLOSED_LOOP.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const coverage = read(coveragePath);
const stopline = read(stoplinePath);
const selector = read(selectorPath);
const etfPacket = read(etfPacketPath);
const etfOutcome = read(etfOutcomePath);
const runtimeAlignment = read(runtimeAlignmentPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const selectorReport = runJson("scripts/check-phase-1-data-online-execution-selector.mjs");
const etfSelectorReport = runJson("scripts/check-phase-1-etf-parallel-coverage-repair-selector.mjs", { allowBlocked: false });
const etfOutcomeRun = runJson("scripts/check-etf-source-rights-outcome-decision-gate.mjs", { allowBlocked: true });

for (const phrase of [
  "Status: `a1_source_rights_unblock_priority_packet_ready_local_only_not_executable`",
  "CEO decision: `prioritize_etf_source_rights_unblock_while_twii_waits_at_final_operator_stopline`",
  "etf_source_rights_unblock_first_twii_operator_stopline_parallel",
  "source_rights_priority_ready_execution_blocked",
  "docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md",
  "docs/TWII_FINAL_AUTHORIZATION_STOPLINE_GO_NO_GO_GATE.md",
  "docs/PHASE_1_DATA_ONLINE_EXECUTION_SELECTOR.md",
  "docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md",
  "docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md",
  "docs/RUNTIME_SUMMARY_ALIGNMENT_FROM_FIRST_CLOSED_LOOP.md",
  "Full Level 1 MVP coverage is `182/360`",
  "Remaining missing rows are `178`",
  "TW equity is accepted at `180/180`",
  "TWII is `0/60`, missing `60`, but it is waiting at `twii_final_authorization_stopline_go_no_go_gate`",
  "ETF is `2/120`, missing `118`",
  "publicDataSource=mock",
  "scoreSource=mock",
  "operator_stopline_waiting_not_a1_source_rights_task",
  "priority_1_source_rights_unblock",
  "legal_and_redistribution_terms_unapproved",
  "## ETF Unblock Criteria",
  "accepted_for_rights_decision_only",
  "rejected_for_execution_pending_rights",
  "needs_bounded_repair",
  "blocked_external_rights_pending",
  "A1 next assignment: `prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch`",
  "TWII remains a PM/operator stopline lane",
  "## Hard Stops",
  "The next route is `prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch`, not execution"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [filePath, content, phrases] of [
  [
    coveragePath,
    coverage,
    [
      "Status: `a1_mvp_coverage_closure_route_support_ready_local_only_not_executable`",
      "Current observed coverage: `182/360`",
      "Combined ETF coverage: `2/120`",
      "TWII`: `0/60`"
    ]
  ],
  [
    stoplinePath,
    stopline,
    [
      "Status: `twii_final_authorization_stopline_go_no_go_gate_ready_no_execution`",
      "currentGoNoGoStatus=final_authorization_stopline_go_no_go_ready_waiting_external_values",
      "executionAllowedNow=false"
    ]
  ],
  [
    selectorPath,
    selector,
    [
      "Current subroute: `twii_final_authorization_stopline_go_no_go_gate`",
      "Next route: `wait_for_real_operator_values_execute_switch_confirmation_credentials_and_pre_execution_checks`"
    ]
  ],
  [
    etfPacketPath,
    etfPacket,
    [
      "Status: `etf_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`",
      "Current observed ETF rows: `2/120`",
      "legal_and_redistribution_terms_unapproved"
    ]
  ],
  [
    etfOutcomePath,
    etfOutcome,
    [
      "Status: `a1_etf_source_rights_outcome_decision_support_ready_blocked_pending`",
      "legal_and_redistribution_terms_unapproved"
    ]
  ],
  [
    runtimeAlignmentPath,
    runtimeAlignment,
    [
      "Status: `runtime_summary_alignment_from_first_closed_loop_applied_mock_boundary_preserved`",
      "182/360",
      "scoreSource=mock"
    ]
  ]
]) {
  for (const phrase of phrases) {
    if (!content.includes(phrase)) problems.push(`${filePath} missing: ${phrase}`);
  }
}

for (const phrase of [
  "Latest A1 source-rights unblock priority packet refresh",
  "a1_source_rights_unblock_priority_packet_ready_local_only_not_executable",
  "prioritize_etf_source_rights_unblock_while_twii_waits_at_final_operator_stopline",
  "source_rights_priority_ready_execution_blocked",
  "prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/A1_SOURCE_RIGHTS_UNBLOCK_PRIORITY_PACKET.md` is `accepted` as refreshed A1/PM source-rights unblock priority packet",
  "a1_source_rights_unblock_priority_packet_ready_local_only_not_executable",
  "prioritize_etf_source_rights_unblock_while_twii_waits_at_final_operator_stopline",
  "source_rights_priority_ready_execution_blocked",
  "prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:a1-source-rights-unblock-priority-packet"] !==
  "node scripts/check-a1-source-rights-unblock-priority-packet.mjs"
) {
  problems.push(`${packagePath} missing check:a1-source-rights-unblock-priority-packet script`);
}

for (const phrase of [
  "scripts/check-a1-source-rights-unblock-priority-packet.mjs",
  "expectStatus: \"ok\"",
  "name: \"a1-source-rights-unblock-priority-packet\"",
  "\"a1-source-rights-unblock-priority-packet\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

if (selectorReport.currentSubroute !== "twii_final_authorization_stopline_go_no_go_gate") {
  problems.push("phase 1 selector must identify TWII final authorization stopline as currentSubroute");
}

if (selectorReport.twiiExecutionAllowedNow !== false || selectorReport.finalStoplineExecutionAllowedNow !== false) {
  problems.push("TWII execution must remain blocked at the stopline");
}

if (etfSelectorReport.currentDecision?.nextA1Route !== "prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch") {
  problems.push("ETF parallel selector must route A1 to ETF source-rights evidence preparation");
}

if (etfOutcomeRun.status !== "blocked" || etfOutcomeRun.currentOutcome !== "rejected_for_execution_pending_external_rights") {
  problems.push("ETF source-rights outcome gate must remain intentionally blocked");
}

for (const pattern of [
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
]) {
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
      guardedStatus: "a1_source_rights_unblock_priority_packet_ready_local_only_not_executable",
      outcome: "source_rights_priority_ready_execution_blocked",
      twiiCurrentSubroute: selectorReport.currentSubroute,
      nextA1Route: "prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch",
      etfSourceRightsOutcome: etfOutcomeRun.currentOutcome,
      publicDataSource: selectorReport.publicDataSource,
      scoreSource: selectorReport.scoreSource,
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

function runJson(scriptPath, options = {}) {
  const run = spawnSync(process.execPath, [scriptPath], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 4
  });
  if (run.status !== 0 && !options.allowBlocked) problems.push(`${scriptPath} exited ${run.status}`);
  try {
    return JSON.parse(run.stdout || run.stderr);
  } catch {
    problems.push(`${scriptPath} did not emit JSON`);
    return {};
  }
}
