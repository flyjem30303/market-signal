import fs from "node:fs";

const docPath = "docs/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_ACCEPTANCE_OR_BLOCKED_RECORD.md";
const dataGatePath = "docs/DATA_GATE_READINESS_AFTER_LOCAL_ROUTE_HEALTH_REFRESH.md";
const twiiIntakePath = "docs/A1_TWII_OFFICIAL_SOURCE_INTAKE_FIELDS_OR_VENDOR_TERMS_REVIEW_PACKET.md";
const twiiFieldPath = "docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md";
const twiiOutcomePath = "docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md";
const evidencePath = "docs/A1_TWII_SOURCE_RIGHTS_EVIDENCE_INTAKE_OR_VENDOR_FALLBACK_DECISION_SUPPORT.md";
const etfOutcomePath = "docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];

const doc = read(docPath);

const requiredDocPhrases = [
  "Status: `twii_source_rights_field_contract_acceptance_or_blocked_record_blocked_external_evidence_pending`",
  "record_twii_source_rights_field_contract_block_and_route_parallel_work",
  "twii_source_rights_and_field_contract_acceptance_or_blocked_record",
  "blocked_external_rights_field_contract_and_asset_mapping_pending",
  "does not approve TWII source rights",
  "Level 1 MVP coverage remains `182/360`",
  "TW equity first closed loop remains accepted at `180/180`",
  "TWII remains `0/60`, missing `60` rows",
  "ETF remains `2/120`, missing `118` rows",
  "TWII first candidate remains `official-exchange-index`",
  "TWII fallback candidates remain `licensed-market-data-vendor` and `internal-approved-feed`",
  "TWII route remains `not_approved_for_probe_or_ingestion`",
  "Public runtime remains `publicDataSource=mock`",
  "Score source remains `scoreSource=mock`",
  "PM classifies the current TWII source-rights and field-contract state as `blocked`, not `accepted`",
  "`blocked_external_evidence_pending`",
  "`blocked_field_contract_pending`",
  "`blocked_asset_mapping_pending`",
  "`accepted_as_future_requirement_only`",
  "PM rejects the route for execution now",
  "Do not prepare `twii_sanitized_candidate_artifact_gate` until source rights, field contract, and asset mapping are accepted",
  "Continue launch/runtime work that does not depend on TWII rights",
  "twii_sanitized_candidate_artifact_gate_after_rights_field_contract_and_asset_mapping_acceptance",
  "twii_vendor_or_internal_feed_fallback_selection_or_etf_source_rights_fallback_decision_support",
  "executable_packet_candidate_after_platform_project_and_beta_url",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

const requiredCrossFilePhrases = [
  [dataGatePath, "twii_source_rights_and_field_contract_acceptance_or_blocked_record"],
  [twiiIntakePath, "a1_twii_official_source_intake_fields_or_vendor_terms_review_packet_ready_not_filled"],
  [twiiIntakePath, "not_filled_official_source_evidence_pending"],
  [twiiFieldPath, "Mapping to an internal stock id or market asset id remains unresolved"],
  [twiiFieldPath, "TWII mapping to `daily_prices` remains a field-contract question"],
  [twiiOutcomePath, "twii_source_rights_outcome_gate_blocked_external_rights_pending"],
  [twiiOutcomePath, "`no_current_execution_acceptance`"],
  [evidencePath, "official_lane_intake_ready_fallback_route_prepared_rights_still_blocked"],
  [etfOutcomePath, "etf_source_rights_outcome_decision_gate_blocked_external_rights_pending"],
  [boardPath, "`docs/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_ACCEPTANCE_OR_BLOCKED_RECORD.md` is `blocked` as PM mainline acceptance-or-blocked record"],
  [boardPath, "twii_vendor_or_internal_feed_fallback_selection_or_etf_source_rights_fallback_decision_support"],
  [statusPath, "Latest TWII source rights field contract acceptance-or-blocked record slice"],
  [statusPath, "twii_source_rights_field_contract_acceptance_or_blocked_record_blocked_external_evidence_pending"],
  [packagePath, "\"check:twii-source-rights-field-contract-acceptance-or-blocked-record\""],
  [reviewGatePath, "scripts/check-twii-source-rights-field-contract-acceptance-or-blocked-record.mjs"],
  [reviewGatePath, "twii-source-rights-field-contract-acceptance-or-blocked-record"]
];

for (const [path, phrase] of requiredCrossFilePhrases) {
  if (!read(path).includes(phrase)) problems.push(`${path} missing phrase: ${phrase}`);
}

const forbiddenPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env/u,
  /source rights are approved/iu,
  /field contract is approved/iu,
  /asset mapping is approved/iu,
  /TWII probe execution is approved/iu,
  /candidate artifact generation is approved/iu,
  /SQL execution is approved/iu,
  /Supabase connection is approved/iu,
  /Supabase writes are approved/iu,
  /daily_prices mutation is approved/iu,
  /row coverage points awarded/iu,
  /publicDataSource=supabase is approved/iu,
  /scoreSource=real is approved/iu,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
}

const pkg = JSON.parse(read(packagePath));
if (
  pkg.scripts?.["check:twii-source-rights-field-contract-acceptance-or-blocked-record"] !==
  "node scripts/check-twii-source-rights-field-contract-acceptance-or-blocked-record.mjs"
) {
  problems.push(`${packagePath} missing check:twii-source-rights-field-contract-acceptance-or-blocked-record script`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "blocked",
      docPath,
      blockedReason: "twii_rights_field_contract_and_asset_mapping_pending",
      nextRoute: "twii_vendor_or_internal_feed_fallback_selection_or_etf_source_rights_fallback_decision_support"
    },
    null,
    2
  )
);

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}
