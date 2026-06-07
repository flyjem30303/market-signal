import fs from "node:fs";

const problems = [];

const docPath = "docs/A1_SOURCE_RIGHTS_UNBLOCK_PRIORITY_PACKET.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const coveragePath = "docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md";
const twiiPacketPath = "docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md";
const twiiOutcomePath = "docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md";
const twiiFieldPath = "docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md";
const etfPacketPath = "docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md";
const etfOutcomePath = "docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md";
const runtimeAlignmentPath = "docs/RUNTIME_SUMMARY_ALIGNMENT_FROM_FIRST_CLOSED_LOOP.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const coverage = read(coveragePath);
const twiiPacket = read(twiiPacketPath);
const twiiOutcome = read(twiiOutcomePath);
const twiiField = read(twiiFieldPath);
const etfPacket = read(etfPacketPath);
const etfOutcome = read(etfOutcomePath);
const runtimeAlignment = read(runtimeAlignmentPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `a1_source_rights_unblock_priority_packet_ready_local_only_not_executable`",
  "CEO decision: `prioritize_twii_source_rights_unblock_before_etf_while_preserving_etf_parallel_option`",
  "twii_source_rights_unblock_first_etf_parallel_rights_option",
  "source_rights_priority_ready_execution_blocked",
  "docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md",
  "docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md",
  "docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md",
  "docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md",
  "docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md",
  "docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md",
  "docs/RUNTIME_SUMMARY_ALIGNMENT_FROM_FIRST_CLOSED_LOOP.md",
  "Full Level 1 MVP coverage is `182/360`",
  "Remaining missing rows are `178`",
  "TW equity is accepted at `180/180`",
  "TWII is `0/60`, missing `60`",
  "ETF is `2/120`, missing `118`",
  "publicDataSource=mock",
  "scoreSource=mock",
  "priority_1_narrowest_unblock",
  "priority_2_larger_gap_parallel_option",
  "not_approved_for_probe_or_ingestion",
  "legal_and_redistribution_terms_unapproved",
  "## TWII Unblock Criteria",
  "## ETF Parallel Option Criteria",
  "accepted_for_rights_decision_only",
  "rejected_for_execution_pending_rights",
  "needs_bounded_repair",
  "blocked_external_rights_pending",
  "A1 next assignment: `twii_source_rights_unblock_decision_record_candidate`",
  "ETF remains a parallel watch lane",
  "## Hard Stops",
  "The next route is `twii_source_rights_unblock_decision_record_candidate`, not execution"
];

for (const phrase of requiredDocPhrases) {
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
    twiiPacketPath,
    twiiPacket,
    [
      "Status: `a1_twii_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`",
      "Selected first candidate: `official-exchange-index`",
      "Review state: `not_approved_for_probe_or_ingestion`"
    ]
  ],
  [
    twiiOutcomePath,
    twiiOutcome,
    [
      "Status: `twii_source_rights_outcome_gate_blocked_external_rights_pending`",
      "rejected_for_execution_pending_external_rights_and_field_contract",
      "not_approved_for_probe_or_ingestion"
    ]
  ],
  [
    twiiFieldPath,
    twiiField,
    [
      "Status: `a1_twii_index_field_contract_decision_support_ready_local_only_not_executable`",
      "Level 1 MVP overall: `182/360`"
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
  "Latest A1 source-rights unblock priority packet slice",
  "a1_source_rights_unblock_priority_packet_ready_local_only_not_executable",
  "prioritize_twii_source_rights_unblock_before_etf_while_preserving_etf_parallel_option",
  "source_rights_priority_ready_execution_blocked",
  "twii_source_rights_unblock_decision_record_candidate"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/A1_SOURCE_RIGHTS_UNBLOCK_PRIORITY_PACKET.md` is `accepted` as A1/PM source-rights unblock priority packet",
  "a1_source_rights_unblock_priority_packet_ready_local_only_not_executable",
  "prioritize_twii_source_rights_unblock_before_etf_while_preserving_etf_parallel_option",
  "source_rights_priority_ready_execution_blocked",
  "twii_source_rights_unblock_decision_record_candidate"
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
      guardedStatus: "a1_source_rights_unblock_priority_packet_ready_local_only_not_executable",
      outcome: "source_rights_priority_ready_execution_blocked",
      nextRoute: "twii_source_rights_unblock_decision_record_candidate",
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
