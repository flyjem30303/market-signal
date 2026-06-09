import { spawnSync } from "node:child_process";

const problems = [];

const template = runJson(["scripts/report-twii-supabase-write-gate-packet-template.mjs"]);
if (template.status !== "twii_supabase_write_gate_packet_template_ready_local_only") {
  problems.push("write_gate_packet_template_not_ready");
}
if (template.outcome !== "write_gate_packet_shape_accepted_for_future_authorization_review_only") {
  problems.push("write_gate_packet_template_outcome_not_accepted");
}
assertTemplateSafety(template);

const requiredRunnerBoundary = [
  "validated_twii_supabase_write_gate_packet",
  "execute_switch_required",
  "confirmation_phrase_required",
  "service_role_server_only_no_print",
  "public_url_configuration_only_no_secret_log",
  "rollback_dry_run_required_before_mutation",
  "post_write_aggregate_readback_path_required",
  "post_write_review_command_required",
  "target_table_daily_prices_only",
  "target_lane_twii_only",
  "target_scope_twii_index_daily_prices_missing_rows_only",
  "max_rows_60",
  "duplicate_policy_reject_duplicates",
  "promotion_blocked_same_run",
  "row_coverage_scoring_blocked_same_run"
];

const credentialHandlingPolicy = {
  credentialValuesReadableNow: false,
  credentialPresenceCheckAllowedLater: true,
  credentialValuesPrintable: false,
  serviceRoleBrowserAllowed: false,
  serviceRoleServerOnlyRequired: true,
  errorsMustUseSafeProblemCodes: true
};

const currentBoundary = {
  runnerCreatedNow: false,
  writeGateExecutableNow: false,
  sqlExecutableNow: false,
  supabaseConnectionAllowedNow: false,
  dailyPricesMutationAllowedNow: false,
  candidateRowsAcceptedNow: false,
  rowCoverageScoringAllowedNow: false,
  publicPromotionAllowedNow: false,
  scoreSourceRealAllowedNow: false
};

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_write_gate_runner_boundary_ready_local_only" : "blocked",
  outcome: ok ? "runner_boundary_and_credential_handling_ready_for_future_implementation_review" : "blocked",
  mode: "twii_write_gate_runner_boundary",
  owner: "CEO/PM",
  upstream: {
    packetTemplateStatus: template.status ?? null,
    packetTemplateOutcome: template.outcome ?? null
  },
  requiredRunnerBoundary,
  credentialHandlingPolicy,
  futureFailClosedRequirements: [
    "missing_execute_switch",
    "missing_confirmation_phrase",
    "invalid_packet_shape",
    "unresolved_rights_or_field_contract_or_asset_mapping",
    "missing_rollback_dry_run",
    "missing_post_write_readback",
    "missing_post_write_review",
    "requested_promotion_or_row_coverage_scoring",
    "payload_or_secret_output_requested"
  ],
  currentBoundary,
  nextAction: ok
    ? "A later GOAL may design a non-executing runner skeleton that enforces these boundaries; do not connect or write yet."
    : "Repair write-gate packet template readiness before runner boundary work.",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function runJson(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  try {
    return JSON.parse(result.stdout ?? "{}");
  } catch {
    problems.push(`${args[0]} did not return JSON`);
    return {};
  }
}

function assertTemplateSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("packet_template_must_stay_mock");
  }
  if (output.currentBoundary?.writeGateExecutableNow !== false) {
    problems.push("packet_template_must_not_make_write_gate_executable");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`packetTemplate.safety.${key}_must_be_false`);
  }
}

