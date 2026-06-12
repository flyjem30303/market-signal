import fs from "node:fs";

const problems = [];

const docPath = "docs/A1_TWII_OFFICIAL_SOURCE_INTAKE_FIELDS_OR_VENDOR_TERMS_REVIEW_PACKET.md";
const supportPath = "docs/A1_TWII_SOURCE_RIGHTS_EVIDENCE_INTAKE_OR_VENDOR_FALLBACK_DECISION_SUPPORT.md";
const decisionPath = "docs/A1_TWII_SOURCE_RIGHTS_UNBLOCK_DECISION_RECORD_CANDIDATE.md";
const outcomePath = "docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md";
const fieldPath = "docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const support = read(supportPath);
const decision = read(decisionPath);
const outcome = read(outcomePath);
const field = read(fieldPath);
const status = read(statusPath);
const board = read(boardPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `a1_twii_official_source_intake_fields_or_vendor_terms_review_packet_ready_not_filled`",
  "Decision route: `twii_official_source_intake_fields_or_vendor_terms_review_packet`",
  "fillable_intake_ready_rights_evidence_not_filled",
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
  "## Official Source Intake Fields",
  "`OFFICIAL-001`",
  "ACCEPTED_SAFE_PUBLIC_REFERENCE_OPEN_DATA_ROUTE_SEPARATE",
  "current automatable candidate route is `official_open_data_api` via data.gov open-data references and TWSE OpenAPI",
  "`OFFICIAL-002`",
  "TERMS_LOCATION_IDENTIFIED_OPEN_DATA_AND_TWSE_BOUNDARY_REFERENCE",
  "Data.gov Open Government Data License",
  "TWSE OpenAPI swagger",
  "`OFFICIAL-003`",
  "BLOCKED_UNCONSENTED_WEBSITE_AUTOMATION_OPENAPI_ROUTE_SEPARATE",
  "separate candidate route is machine access through data.gov-referenced TWSE OpenAPI endpoints",
  "`OFFICIAL-012`",
  "reconciled_official_001_002_003_for_official_open_data_api_candidate_only",
  "## OFFICIAL-001 Evidence Note",
  "accepted: source authority / official public source surface",
  "accepted: `official_open_data_api` as the current candidate route for later bounded validation",
  "not accepted: automated access method",
  "not accepted: internal storage",
  "not accepted: redistribution / public display",
  "not accepted: TWSE website crawling, candidate generation, parser work, market-data fetch, SQL, Supabase, `daily_prices` mutation, public source promotion, or real scoring",
  "## OFFICIAL-002 Evidence Note",
  "Data.gov Open Government Data License: `https://data.gov.tw/license`",
  "Data.gov TWSE dataset reference: `https://data.gov.tw/dataset/11669`",
  "TWSE OpenAPI swagger: `https://openapi.twse.com.tw/v1/swagger.json`",
  "TWSE Terms of Use: `https://www.twse.com.tw/zh/terms/use.html`",
  "TWSE Trading Information use / contracts / fee standards page: `https://www.twse.com.tw/zh/products/information/use.html`",
  "accepted: safe public terms-location references for the open-data candidate and website/contract boundary review",
  "not accepted: interpretation that the terms permit automated download",
  "## OFFICIAL-003 Evidence Note",
  "unconsented automated download, crawler, scraper, script, automated program, or extraction-tool access is not accepted",
  "TWSE website automation remains blocked",
  "data.gov-referenced TWSE OpenAPI machine access is a separate candidate route for bounded metadata / terms / field-contract validation",
  "accepted: data.gov-referenced TWSE OpenAPI is a separate automatable candidate for the next bounded validation gate",
  "not accepted: parser implementation, probe, endpoint test, market-data fetch, raw payload capture, candidate generation, SQL, Supabase, `daily_prices` mutation, public source promotion, or real scoring",
  "## Vendor Terms Review Fields",
  "`VENDOR-001`",
  "`VENDOR-007`",
  "not_filled_vendor_terms_pending",
  "## Internal Feed Owner Review Fields",
  "`INTERNAL-001`",
  "`INTERNAL-006`",
  "not_filled_internal_feed_owner_pending",
  "accepted_for_twii_source_rights_outcome_gate_only",
  "rejected_official_lane_switch_to_vendor_review",
  "rejected_vendor_lane_switch_to_internal_feed_review",
  "blocked_external_rights_pending",
  "needs_bounded_repair",
  "## Hard Stops",
  "The next route is `twii_filled_source_rights_intake_review_or_blocked_fallback_selection`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [filePath, content, phrases] of [
  [
    supportPath,
    support,
    [
      "Status: `a1_twii_source_rights_evidence_intake_or_vendor_fallback_decision_support_ready_local_only_not_executable`",
      "twii_official_source_intake_fields_or_vendor_terms_review_packet",
      "official_lane_intake_ready_fallback_route_prepared_rights_still_blocked"
    ]
  ],
  [
    decisionPath,
    decision,
    [
      "Status: `a1_twii_source_rights_unblock_decision_record_candidate_ready_local_only_not_approved`",
      "twii_source_rights_evidence_intake_or_vendor_fallback_decision_support"
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
      "Expected timezone: `Asia/Taipei`"
    ]
  ]
]) {
  for (const phrase of phrases) {
    if (!content.includes(phrase)) problems.push(`${filePath} missing: ${phrase}`);
  }
}

for (const phrase of [
  "Latest A1 TWII official source intake fields or vendor terms review packet slice",
  "a1_twii_official_source_intake_fields_or_vendor_terms_review_packet_ready_not_filled",
  "fillable_intake_ready_rights_evidence_not_filled",
  "twii_filled_source_rights_intake_review_or_blocked_fallback_selection",
  "scoreSource=mock"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/A1_TWII_OFFICIAL_SOURCE_INTAKE_FIELDS_OR_VENDOR_TERMS_REVIEW_PACKET.md` is `accepted` as A1/PM TWII official-source intake fields and vendor terms review packet",
  "a1_twii_official_source_intake_fields_or_vendor_terms_review_packet_ready_not_filled",
  "fillable_intake_ready_rights_evidence_not_filled",
  "twii_filled_source_rights_intake_review_or_blocked_fallback_selection"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:a1-twii-official-source-intake-fields-or-vendor-terms-review-packet"] !==
  "node scripts/check-a1-twii-official-source-intake-fields-or-vendor-terms-review-packet.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-official-source-intake-fields-or-vendor-terms-review-packet script`);
}

for (const phrase of [
  "scripts/check-a1-twii-official-source-intake-fields-or-vendor-terms-review-packet.mjs",
  "expectStatus: \"ok\"",
  "name: \"a1-twii-official-source-intake-fields-or-vendor-terms-review-packet\"",
  "\"a1-twii-official-source-intake-fields-or-vendor-terms-review-packet\""
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
      guardedStatus: "a1_twii_official_source_intake_fields_or_vendor_terms_review_packet_ready_not_filled",
      outcome: "fillable_intake_ready_rights_evidence_not_filled",
      nextRoute: "twii_filled_source_rights_intake_review_or_blocked_fallback_selection",
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
