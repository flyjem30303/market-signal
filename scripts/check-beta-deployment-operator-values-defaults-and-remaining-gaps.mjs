import fs from "node:fs";

const problems = [];

const docPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_DEFAULTS_AND_REMAINING_GAPS.md";
const gapPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_GAP_LIST.md";
const minimalPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_MINIMAL_SHEET.md";
const completionPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_COMPLETION_GATE.md";
const recordPath = "docs/BETA_DEPLOYMENT_NO_SECRET_OPERATOR_VALUES_RECORD.md";
const recheckPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_SAFE_FILL_RECHECK.md";
const candidatePath = "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const gap = read(gapPath);
const minimal = read(minimalPath);
const completion = read(completionPath);
const record = read(recordPath);
const recheck = read(recheckPath);
const candidate = read(candidatePath);
const status = read(statusPath);
const board = read(boardPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `beta_deployment_operator_values_defaults_and_remaining_gaps_ready_not_executable`",
  "CEO decision: `accept_safe_operator_defaults_and_keep_platform_generated_values_pending`",
  "operator_values_defaults_then_executable_packet_candidate_when_platform_values_exist",
  "safe_operator_defaults_recorded_platform_values_pending",
  "publicDataSource=mock",
  "scoreSource=mock",
  "vercel_or_equivalent_managed_nextjs_host",
  "platform_preview_or_beta_url_first_custom_domain_later",
  "## CEO Accepted Safe Defaults",
  "create_preview_or_beta_deployment_after_local_proof_refresh",
  "platform_dashboard_or_out_of_repo_secret_channel",
  "previous_platform_deployment_or_disable_beta_route",
  "project_operations_channel_no_tokenized_link",
  "15_minutes_then_rollback_or_disable_beta",
  "docs/reviews/BETA_DEPLOYMENT_POST_RUN_REVIEW_NEXT.md",
  "## Values Still Pending",
  "external_platform_value_pending",
  "repo_refreshable_not_final",
  "## Updated Packet Readiness Rule",
  "executable_packet_candidate_after_platform_project_and_beta_url",
  "## Hard Stops"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [filePath, content, phrases] of [
  [
    gapPath,
    gap,
    [
      "Status: `beta_deployment_operator_values_gap_list_ready_external_values_pending`",
      "external_operator_values_gap_identified_packet_blocked",
      "DEFER_CUSTOM_DOMAIN_UNTIL_PLATFORM_URL_HEALTH_PASSES"
    ]
  ],
  [
    minimalPath,
    minimal,
    [
      "Status: `beta_deployment_operator_values_minimal_sheet_ready_not_filled`",
      "TBD_HOSTING_PROJECT_NAME",
      "TBD_TEMPORARY_BETA_URL",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]
  ],
  [
    completionPath,
    completion,
    [
      "Status: `beta_deployment_operator_values_completion_gate_ready_blocked_external_values_pending`",
      "blocked_external_operator_values_pending"
    ]
  ],
  [
    recordPath,
    record,
    [
      "Status: `beta_deployment_no_secret_operator_values_record_ready_not_filled`",
      "not_filled_external_operator_values_pending"
    ]
  ],
  [
    recheckPath,
    recheck,
    [
      "Status: `beta_deployment_operator_values_safe_fill_recheck_ready_external_values_pending`",
      "external_operator_values_still_pending_executable_packet_blocked"
    ]
  ],
  [
    candidatePath,
    candidate,
    [
      "Status: `beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending`",
      "blocked_operator_values_pending"
    ]
  ]
]) {
  for (const phrase of phrases) {
    if (!content.includes(phrase)) problems.push(`${filePath} missing: ${phrase}`);
  }
}

for (const phrase of [
  "Latest beta deployment operator values defaults and remaining gaps slice",
  "beta_deployment_operator_values_defaults_and_remaining_gaps_ready_not_executable",
  "safe_operator_defaults_recorded_platform_values_pending",
  "executable_packet_candidate_after_platform_project_and_beta_url",
  "scoreSource=mock"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/BETA_DEPLOYMENT_OPERATOR_VALUES_DEFAULTS_AND_REMAINING_GAPS.md` is `accepted` as PM mainline operator values defaults and remaining gaps packet",
  "beta_deployment_operator_values_defaults_and_remaining_gaps_ready_not_executable",
  "safe_operator_defaults_recorded_platform_values_pending",
  "executable_packet_candidate_after_platform_project_and_beta_url"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:beta-deployment-operator-values-defaults-and-remaining-gaps"] !==
  "node scripts/check-beta-deployment-operator-values-defaults-and-remaining-gaps.mjs"
) {
  problems.push(`${packagePath} missing check:beta-deployment-operator-values-defaults-and-remaining-gaps script`);
}

for (const phrase of [
  "scripts/check-beta-deployment-operator-values-defaults-and-remaining-gaps.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-deployment-operator-values-defaults-and-remaining-gaps\"",
  "\"beta-deployment-operator-values-defaults-and-remaining-gaps\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "does not authorize:",
  "production deployment",
  "preview deployment",
  "deployment command execution",
  "hosting project creation",
  "hosting project mutation",
  "DNS change",
  "SSL configuration change",
  "platform env mutation",
  "secret output",
  "secret storage action",
  "SQL execution",
  "Supabase connection",
  "Supabase write",
  "staging row creation",
  "`daily_prices` mutation",
  "raw market-data fetch",
  "raw market-data ingest",
  "raw market-data storage",
  "raw market-data commit",
  "row coverage points",
  "complete MVP coverage claim",
  "Supabase public-source promotion",
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
  /deployment token/iu,
  /API token/iu,
  /private dashboard token/iu,
  /SSL private key/iu,
  /production deployment completed/iu,
  /preview deployment completed/iu,
  /deployment command executed/iu,
  /hosting project created/iu,
  /platform env mutated/iu,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /public launch complete/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc.replace(/Never write these values[\s\S]*?## A1 \/ A2 Coordination/u, ""))) {
    problems.push(`${docPath} contains forbidden pattern outside never-fill section: ${pattern}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "beta_deployment_operator_values_defaults_and_remaining_gaps_ready_not_executable",
      outcome: "safe_operator_defaults_recorded_platform_values_pending",
      nextRoute: "executable_packet_candidate_after_platform_project_and_beta_url",
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
