import fs from "node:fs";

const problems = [];

const docPath = "docs/A1_TWII_SOURCE_RIGHTS_UNBLOCK_DECISION_RECORD_CANDIDATE.md";
const priorityPath = "docs/A1_SOURCE_RIGHTS_UNBLOCK_PRIORITY_PACKET.md";
const readinessPath = "docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md";
const outcomePath = "docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md";
const fieldPath = "docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const priority = read(priorityPath);
const readiness = read(readinessPath);
const outcome = read(outcomePath);
const field = read(fieldPath);
const status = read(statusPath);
const board = read(boardPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `a1_twii_source_rights_unblock_decision_record_candidate_ready_local_only_not_approved`",
  "Decision route: `twii_source_rights_unblock_decision_record_candidate`",
  "decision_record_candidate_ready_rights_still_blocked",
  "Level 1 MVP coverage: `182/360`",
  "Missing rows: `178`",
  "TW equity sub-scope: `180/180`",
  "TWII sub-scope: `0/60`, missing `60`",
  "ETF sub-scope: `2/120`, missing `118`",
  "TWII first source candidate: `official-exchange-index`",
  "TWII fallback candidates: `licensed-market-data-vendor`, `internal-approved-feed`",
  "accepted_for_rights_and_field_contract_review_only",
  "not_approved_for_probe_or_ingestion",
  "publicDataSource=mock",
  "scoreSource=mock",
  "## Decision Record Candidate",
  "Source authority",
  "Future access method",
  "Internal storage",
  "Retention and deletion",
  "Redistribution limits",
  "Attribution wording",
  "Derived analysis use",
  "Rate limits and fair use",
  "Commercial and global use",
  "Field-contract basis",
  "Aggregate-only review",
  "rejected_for_execution_pending_source_rights_decision_record_acceptance",
  "## Acceptance Threshold",
  "accepted_for_source_rights_outcome_gate_only",
  "rejected_for_execution_pending_source_rights",
  "needs_bounded_repair",
  "blocked_external_rights_pending",
  "twii_index_field_contract_acceptance_or_sanitized_candidate_artifact_gate",
  "A1 next assignment:",
  "twii_source_rights_evidence_intake_or_vendor_fallback_decision_support",
  "A2 next assignment:",
  "twii_rights_pending_public_copy_guardrail",
  "## Hard Stops",
  "The next route is `twii_source_rights_evidence_intake_or_vendor_fallback_decision_support`"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "twii_source_rights_unblock_decision_record_candidate",
  "priority_1_narrowest_unblock",
  "not_approved_for_probe_or_ingestion"
]) {
  if (!priority.includes(phrase)) problems.push(`${priorityPath} missing: ${phrase}`);
}

for (const [filePath, content, phrases] of [
  [
    readinessPath,
    readiness,
    [
      "Status: `a1_twii_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`",
      "Selected first candidate: `official-exchange-index`",
      "Review state: `not_approved_for_probe_or_ingestion`"
    ]
  ],
  [
    outcomePath,
    outcome,
    [
      "Status: `twii_source_rights_outcome_gate_candidate_ready_for_pm_review`",
      "candidate_ready_no_execution_authority",
      "No item grants execution authority"
    ]
  ],
  [
    fieldPath,
    field,
    [
      "Status: `a1_twii_index_field_contract_decision_support_ready_local_only_not_executable`",
      "Level 1 MVP overall: `182/360`",
      "Expected timezone: `Asia/Taipei`"
    ]
  ]
]) {
  for (const phrase of phrases) {
    if (!content.includes(phrase)) problems.push(`${filePath} missing: ${phrase}`);
  }
}

for (const phrase of [
  "Latest A1 TWII source-rights unblock decision record candidate slice",
  "a1_twii_source_rights_unblock_decision_record_candidate_ready_local_only_not_approved",
  "decision_record_candidate_ready_rights_still_blocked",
  "twii_source_rights_evidence_intake_or_vendor_fallback_decision_support",
  "scoreSource=mock"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/A1_TWII_SOURCE_RIGHTS_UNBLOCK_DECISION_RECORD_CANDIDATE.md` is `accepted` as A1/PM TWII source-rights decision record candidate",
  "a1_twii_source_rights_unblock_decision_record_candidate_ready_local_only_not_approved",
  "decision_record_candidate_ready_rights_still_blocked",
  "twii_source_rights_evidence_intake_or_vendor_fallback_decision_support"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:a1-twii-source-rights-unblock-decision-record-candidate"] !==
  "node scripts/check-a1-twii-source-rights-unblock-decision-record-candidate.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-source-rights-unblock-decision-record-candidate script`);
}

for (const phrase of [
  "scripts/check-a1-twii-source-rights-unblock-decision-record-candidate.mjs",
  "expectStatus: \"ok\"",
  "name: \"a1-twii-source-rights-unblock-decision-record-candidate\"",
  "\"a1-twii-source-rights-unblock-decision-record-candidate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const hardStops = [
  "does not authorize:",
  "SQL execution",
  "Supabase connection",
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
  "TWII candidate generation",
  "parser implementation",
  "external endpoint probe",
  "source-rights approval",
  "field-contract approval",
  "row coverage points",
  "public source promotion",
  "`publicDataSource=supabase`",
  "real score promotion",
  "`scoreSource=real`"
];

for (const phrase of hardStops) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

const forbiddenPatterns = [
  /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /source rights (are )?approved/iu,
  /field contract (is )?approved/iu,
  /candidate generation is approved/iu,
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /row coverage points awarded/u,
  /public launch complete/iu
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
      guardedStatus: "a1_twii_source_rights_unblock_decision_record_candidate_ready_local_only_not_approved",
      outcome: "decision_record_candidate_ready_rights_still_blocked",
      nextRoute: "twii_source_rights_evidence_intake_or_vendor_fallback_decision_support",
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
