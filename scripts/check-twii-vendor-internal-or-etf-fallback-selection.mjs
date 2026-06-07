import fs from "node:fs";

const docPath = "docs/TWII_VENDOR_INTERNAL_OR_ETF_FALLBACK_SELECTION.md";
const blockedRecordPath = "docs/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_ACCEPTANCE_OR_BLOCKED_RECORD.md";
const evidencePath = "docs/A1_TWII_SOURCE_RIGHTS_EVIDENCE_INTAKE_OR_VENDOR_FALLBACK_DECISION_SUPPORT.md";
const intakePath = "docs/A1_TWII_OFFICIAL_SOURCE_INTAKE_FIELDS_OR_VENDOR_TERMS_REVIEW_PACKET.md";
const etfPath = "docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md";
const dataGatePath = "docs/DATA_GATE_READINESS_AFTER_LOCAL_ROUTE_HEALTH_REFRESH.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);

for (const phrase of [
  "Status: `twii_vendor_internal_or_etf_fallback_selection_ready_no_execution`",
  "split_data_blocker_into_vendor_internal_fallback_and_launch_runtime_mainline",
  "twii_vendor_or_internal_feed_fallback_selection_or_etf_source_rights_fallback_decision_support",
  "fallback_selection_ready_data_execution_still_blocked",
  "does not approve source rights",
  "Level 1 MVP coverage remains `182/360`",
  "TWII remains `0/60`, missing `60` rows",
  "ETF remains `2/120`, missing `118` rows",
  "TW equity first closed loop remains accepted at `180/180`",
  "TWII official lane remains `blocked_external_evidence_pending`",
  "TWII field contract remains `blocked_field_contract_pending`",
  "TWII asset mapping remains `blocked_asset_mapping_pending`",
  "ETF remains blocked by `legal_and_redistribution_terms_unapproved`",
  "Public runtime remains `publicDataSource=mock`",
  "Score source remains `scoreSource=mock`",
  "`selected_for_A1_terms_evidence_intake`",
  "`selected_for_A1_owner_evidence_intake`",
  "`kept_as_parallel_backup_data_lane`",
  "`kept_open_but_not_mainline_wait_state`",
  "`continue_without_real_data_promotion`",
  "twii_vendor_terms_or_internal_feed_owner_evidence_packet",
  "executable_packet_candidate_after_platform_project_and_beta_url",
  "etf_source_rights_fallback_decision_support",
  "Until these are accepted, all data execution remains blocked",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [path, phrase] of [
  [blockedRecordPath, "blocked_external_rights_field_contract_and_asset_mapping_pending"],
  [blockedRecordPath, "twii_vendor_or_internal_feed_fallback_selection_or_etf_source_rights_fallback_decision_support"],
  [evidencePath, "fallback_candidate_ready_for_vendor_terms_review"],
  [evidencePath, "fallback_candidate_ready_for_internal_owner_review"],
  [intakePath, "not_filled_vendor_terms_pending"],
  [intakePath, "not_filled_internal_feed_owner_pending"],
  [etfPath, "legal_and_redistribution_terms_unapproved"],
  [dataGatePath, "TWII as the first readiness lane"],
  [boardPath, "`docs/TWII_VENDOR_INTERNAL_OR_ETF_FALLBACK_SELECTION.md` is `accepted` as PM fallback selection"],
  [boardPath, "twii_vendor_terms_or_internal_feed_owner_evidence_packet"],
  [statusPath, "Latest TWII vendor/internal or ETF fallback selection slice"],
  [statusPath, "twii_vendor_internal_or_etf_fallback_selection_ready_no_execution"],
  [packagePath, "\"check:twii-vendor-internal-or-etf-fallback-selection\""],
  [reviewGatePath, "scripts/check-twii-vendor-internal-or-etf-fallback-selection.mjs"],
  [reviewGatePath, "twii-vendor-internal-or-etf-fallback-selection"]
]) {
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
  /executable source lane selected/iu,
  /candidate generation is approved/iu,
  /TWII probe execution is approved/iu,
  /ETF fetch is approved/iu,
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
  pkg.scripts?.["check:twii-vendor-internal-or-etf-fallback-selection"] !==
  "node scripts/check-twii-vendor-internal-or-etf-fallback-selection.mjs"
) {
  problems.push(`${packagePath} missing check:twii-vendor-internal-or-etf-fallback-selection script`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      docPath,
      guardedStatus: "twii_vendor_internal_or_etf_fallback_selection_ready_no_execution",
      nextA1Route: "twii_vendor_terms_or_internal_feed_owner_evidence_packet",
      nextPMRoute: "executable_packet_candidate_after_platform_project_and_beta_url"
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
