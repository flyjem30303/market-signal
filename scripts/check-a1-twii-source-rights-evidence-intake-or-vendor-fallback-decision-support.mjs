import fs from "node:fs";

const problems = [];

const docPath = "docs/A1_TWII_SOURCE_RIGHTS_EVIDENCE_INTAKE_OR_VENDOR_FALLBACK_DECISION_SUPPORT.md";
const decisionPath = "docs/A1_TWII_SOURCE_RIGHTS_UNBLOCK_DECISION_RECORD_CANDIDATE.md";
const readinessPath = "docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md";
const outcomePath = "docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md";
const fieldPath = "docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md";
const selectionPath = "src/lib/twii-source-selection-packet.ts";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const decision = read(decisionPath);
const readiness = read(readinessPath);
const outcome = read(outcomePath);
const field = read(fieldPath);
const selection = read(selectionPath);
const status = read(statusPath);
const board = read(boardPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `a1_twii_source_rights_evidence_intake_or_vendor_fallback_decision_support_ready_local_only_not_executable`",
  "Decision route: `twii_source_rights_evidence_intake_or_vendor_fallback_decision_support`",
  "official_lane_intake_ready_fallback_route_prepared_rights_still_blocked",
  "Level 1 MVP coverage: `182/360`",
  "Missing rows: `178`",
  "TW equity sub-scope: `180/180`",
  "TWII sub-scope: `0/60`, missing `60`",
  "ETF sub-scope: `2/120`, missing `118`",
  "First TWII candidate: `official-exchange-index`",
  "Fallback candidate 1: `licensed-market-data-vendor`",
  "Fallback candidate 2: `internal-approved-feed`",
  "Current TWII state: `not_approved_for_probe_or_ingestion`",
  "publicDataSource=mock",
  "scoreSource=mock",
  "## Official Source Evidence Intake",
  "Source authority",
  "Access method",
  "Historical coverage",
  "Field meaning",
  "Calendar basis",
  "Storage rights",
  "Retention limits",
  "Redistribution limits",
  "Attribution wording",
  "Derived use",
  "Commercial/global use",
  "Aggregate-only review",
  "blocked_official_source_evidence_pending",
  "## Fallback Comparison",
  "fallback_candidate_ready_for_vendor_terms_review",
  "fallback_candidate_ready_for_internal_owner_review",
  "official_lane_rejected_or_unresolved_after_evidence_intake",
  "continue_official_intake",
  "switch_to_licensed_vendor_terms_review",
  "switch_to_internal_feed_owner_review",
  "keep_twii_blocked_and_move_to_etf_or_launch_ops",
  "needs_bounded_repair",
  "continue_official_intake_with_fallback_ready",
  "A1 next assignment:",
  "twii_official_source_intake_fields_or_vendor_terms_review_packet",
  "A2 next assignment:",
  "source_rights_pending_public_language_guardrail",
  "## Hard Stops",
  "The next route is `twii_official_source_intake_fields_or_vendor_terms_review_packet`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [filePath, content, phrases] of [
  [
    decisionPath,
    decision,
    [
      "Status: `a1_twii_source_rights_unblock_decision_record_candidate_ready_local_only_not_approved`",
      "twii_source_rights_evidence_intake_or_vendor_fallback_decision_support",
      "decision_record_candidate_ready_rights_still_blocked"
    ]
  ],
  [
    readinessPath,
    readiness,
    [
      "Status: `a1_twii_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`",
      "Fallback candidates: `licensed-market-data-vendor`, `internal-approved-feed`",
      "Review state: `not_approved_for_probe_or_ingestion`"
    ]
  ],
  [
    outcomePath,
    outcome,
    [
      "Status: `twii_source_rights_outcome_gate_candidate_ready_for_pm_review`",
      "candidate_ready_no_execution_authority",
      "licensed-vendor / internal-approved-feed decision support"
    ]
  ],
  [
    fieldPath,
    field,
    [
      "Status: `a1_twii_index_field_contract_decision_support_ready_local_only_not_executable`",
      "Level 1 MVP overall: `182/360`",
      "daily_prices Mapping"
    ]
  ],
  [
    selectionPath,
    selection,
    [
      "official-exchange-index",
      "licensed-market-data-vendor",
      "internal-approved-feed",
      "candidate_unverified",
      "publicDataSource: \"mock\"",
      "scoreSource: \"mock\""
    ]
  ]
]) {
  for (const phrase of phrases) {
    if (!content.includes(phrase)) problems.push(`${filePath} missing: ${phrase}`);
  }
}

for (const phrase of [
  "Latest A1 TWII source-rights evidence intake or vendor fallback decision support slice",
  "a1_twii_source_rights_evidence_intake_or_vendor_fallback_decision_support_ready_local_only_not_executable",
  "official_lane_intake_ready_fallback_route_prepared_rights_still_blocked",
  "twii_official_source_intake_fields_or_vendor_terms_review_packet",
  "scoreSource=mock"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/A1_TWII_SOURCE_RIGHTS_EVIDENCE_INTAKE_OR_VENDOR_FALLBACK_DECISION_SUPPORT.md` is `accepted` as A1/PM TWII source-rights evidence intake and fallback decision support",
  "a1_twii_source_rights_evidence_intake_or_vendor_fallback_decision_support_ready_local_only_not_executable",
  "official_lane_intake_ready_fallback_route_prepared_rights_still_blocked",
  "twii_official_source_intake_fields_or_vendor_terms_review_packet"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:a1-twii-source-rights-evidence-intake-or-vendor-fallback-decision-support"] !==
  "node scripts/check-a1-twii-source-rights-evidence-intake-or-vendor-fallback-decision-support.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-source-rights-evidence-intake-or-vendor-fallback-decision-support script`);
}

for (const phrase of [
  "scripts/check-a1-twii-source-rights-evidence-intake-or-vendor-fallback-decision-support.mjs",
  "expectStatus: \"ok\"",
  "name: \"a1-twii-source-rights-evidence-intake-or-vendor-fallback-decision-support\"",
  "\"a1-twii-source-rights-evidence-intake-or-vendor-fallback-decision-support\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const phrase of [
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
  "executable source-lane selection",
  "field-contract approval",
  "row coverage points",
  "public source promotion",
  "`publicDataSource=supabase`",
  "real score promotion",
  "`scoreSource=real`"
]) {
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
  /executable source lane selected/iu,
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
      guardedStatus: "a1_twii_source_rights_evidence_intake_or_vendor_fallback_decision_support_ready_local_only_not_executable",
      outcome: "official_lane_intake_ready_fallback_route_prepared_rights_still_blocked",
      nextRoute: "twii_official_source_intake_fields_or_vendor_terms_review_packet",
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
