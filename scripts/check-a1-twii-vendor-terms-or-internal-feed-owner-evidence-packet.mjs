import fs from "node:fs";

const docPath = "docs/A1_TWII_VENDOR_TERMS_OR_INTERNAL_FEED_OWNER_EVIDENCE_PACKET.md";
const fallbackPath = "docs/TWII_VENDOR_INTERNAL_OR_ETF_FALLBACK_SELECTION.md";
const blockedRecordPath = "docs/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_ACCEPTANCE_OR_BLOCKED_RECORD.md";
const intakePath = "docs/A1_TWII_OFFICIAL_SOURCE_INTAKE_FIELDS_OR_VENDOR_TERMS_REVIEW_PACKET.md";
const evidencePath = "docs/A1_TWII_SOURCE_RIGHTS_EVIDENCE_INTAKE_OR_VENDOR_FALLBACK_DECISION_SUPPORT.md";
const etfPath = "docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);

for (const phrase of [
  "Status: `a1_twii_vendor_terms_or_internal_feed_owner_evidence_packet_ready_not_filled`",
  "prepare_twii_vendor_internal_feed_evidence_packet_after_official_lane_block",
  "twii_vendor_terms_or_internal_feed_owner_evidence_packet",
  "fillable_vendor_internal_evidence_ready_not_filled",
  "does not approve vendor terms",
  "Level 1 MVP coverage remains `182/360`",
  "TW equity first closed loop remains accepted at `180/180`",
  "TWII remains `0/60`, missing `60` rows",
  "ETF remains `2/120`, missing `118` rows",
  "Official TWII lane remains `blocked_external_evidence_pending`",
  "Vendor fallback lane is `selected_for_A1_terms_evidence_intake`",
  "Internal feed fallback lane is `selected_for_A1_owner_evidence_intake`",
  "ETF fallback lane remains `kept_as_parallel_backup_data_lane`",
  "Runtime remains `publicDataSource=mock`",
  "Score remains `scoreSource=mock`",
  "`VENDOR-TWII-001`",
  "`VENDOR-TWII-010`",
  "`INTERNAL-TWII-001`",
  "`INTERNAL-TWII-009`",
  "not_filled_vendor_twii_terms_pending",
  "not_filled_internal_twii_feed_owner_pending",
  "accepted_for_twii_source_rights_outcome_gate_only",
  "blocked_external_vendor_or_internal_owner_pending",
  "twii_source_rights_outcome_gate_after_vendor_or_internal_evidence_acceptance",
  "continue_executable_packet_candidate_after_platform_project_and_beta_url",
  "launch_runtime_mainline_until_external_source_rights_change",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [path, phrase] of [
  [fallbackPath, "twii_vendor_terms_or_internal_feed_owner_evidence_packet"],
  [fallbackPath, "selected_for_A1_terms_evidence_intake"],
  [blockedRecordPath, "blocked_external_rights_field_contract_and_asset_mapping_pending"],
  [intakePath, "not_filled_vendor_terms_pending"],
  [intakePath, "not_filled_internal_feed_owner_pending"],
  [evidencePath, "fallback_candidate_ready_for_vendor_terms_review"],
  [evidencePath, "fallback_candidate_ready_for_internal_owner_review"],
  [etfPath, "legal_and_redistribution_terms_unapproved"],
  [boardPath, "`docs/A1_TWII_VENDOR_TERMS_OR_INTERNAL_FEED_OWNER_EVIDENCE_PACKET.md` is `accepted` as A1 no-secret vendor/internal evidence packet"],
  [boardPath, "launch_runtime_mainline_until_external_source_rights_change"],
  [statusPath, "Latest A1 TWII vendor terms or internal feed owner evidence packet slice"],
  [statusPath, "a1_twii_vendor_terms_or_internal_feed_owner_evidence_packet_ready_not_filled"],
  [packagePath, "\"check:a1-twii-vendor-terms-or-internal-feed-owner-evidence-packet\""],
  [reviewGatePath, "scripts/check-a1-twii-vendor-terms-or-internal-feed-owner-evidence-packet.mjs"],
  [reviewGatePath, "a1-twii-vendor-terms-or-internal-feed-owner-evidence-packet"]
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
  /vendor terms are approved/iu,
  /internal feed ownership is approved/iu,
  /source rights are approved/iu,
  /field contract is approved/iu,
  /asset mapping is approved/iu,
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
  pkg.scripts?.["check:a1-twii-vendor-terms-or-internal-feed-owner-evidence-packet"] !==
  "node scripts/check-a1-twii-vendor-terms-or-internal-feed-owner-evidence-packet.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-vendor-terms-or-internal-feed-owner-evidence-packet script`);
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
      guardedStatus: "a1_twii_vendor_terms_or_internal_feed_owner_evidence_packet_ready_not_filled",
      outcome: "fillable_vendor_internal_evidence_ready_not_filled",
      nextRoute: "continue_executable_packet_candidate_after_platform_project_and_beta_url"
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
