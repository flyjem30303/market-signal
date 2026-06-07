import fs from "node:fs";

const problems = [];

const docPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_GAP_LIST.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const proofPath = "docs/LOCAL_LAUNCH_PROOF_BUNDLE_SNAPSHOT.md";
const preflightPath = "docs/LOCAL_LAUNCH_PREFLIGHT_WITHOUT_EXTERNAL_OPERATOR_VALUES.md";
const minimalSheetPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_MINIMAL_SHEET.md";
const completionPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_COMPLETION_GATE.md";
const recordPath = "docs/BETA_DEPLOYMENT_NO_SECRET_OPERATOR_VALUES_RECORD.md";
const safeFillPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_SAFE_FILL_RECHECK.md";
const candidateGatePath = "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const proof = read(proofPath);
const preflight = read(preflightPath);
const minimalSheet = read(minimalSheetPath);
const completion = read(completionPath);
const record = read(recordPath);
const safeFill = read(safeFillPath);
const candidateGate = read(candidateGatePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `beta_deployment_operator_values_gap_list_ready_external_values_pending`",
  "CEO decision: `compress_operator_values_gap_before_executable_packet_candidate`",
  "operator_values_gap_fill_then_executable_packet_candidate",
  "external_operator_values_gap_identified_packet_blocked",
  "docs/LOCAL_LAUNCH_PROOF_BUNDLE_SNAPSHOT.md",
  "docs/LOCAL_LAUNCH_PREFLIGHT_WITHOUT_EXTERNAL_OPERATOR_VALUES.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_MINIMAL_SHEET.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_COMPLETION_GATE.md",
  "docs/BETA_DEPLOYMENT_NO_SECRET_OPERATOR_VALUES_RECORD.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_SAFE_FILL_RECHECK.md",
  "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md",
  "local_launch_proof_bundle_snapshot_ready_external_values_pending",
  "local_proof_bundle_ready_external_operator_values_pending",
  "beta_deployment_operator_values_minimal_sheet_ready_not_filled",
  "beta_deployment_operator_values_completion_gate_ready_blocked_external_values_pending",
  "external_operator_values_still_pending_executable_packet_blocked",
  "beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending",
  "publicDataSource=mock",
  "scoreSource=mock",
  "## PM Auto-Refresh Values",
  "git branch --show-current",
  "git rev-parse --short HEAD",
  "git status --short",
  "repo_refreshable_not_final",
  "## External Values Still Required",
  "Hosting provider",
  "Hosting project",
  "Temporary Beta URL",
  "Exact platform action",
  "Environment variable owner",
  "Secret input owner",
  "Secret handling channel",
  "Rollback owner",
  "Rollback reference",
  "Incident owner",
  "First-response channel",
  "Maximum downtime before rollback",
  "Post-run review path",
  "external_operator_value_pending",
  "## Accepted Defer Values",
  "DEFER_CUSTOM_DOMAIN_UNTIL_PLATFORM_URL_HEALTH_PASSES",
  "DEFER_DNS_SSL_UNTIL_CUSTOM_DOMAIN_SELECTED",
  "## Never Fill In Repo",
  "blocked_external_operator_input_pending",
  "A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`",
  "## Packet Readiness Rule",
  "## Hard Stops",
  "The next route is `fill_safe_operator_values_or_continue_local_launch_runtime_data_work`, not deployment"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [filePath, content, phrases] of [
  [
    proofPath,
    proof,
    [
      "Status: `local_launch_proof_bundle_snapshot_ready_external_values_pending`",
      "local_proof_bundle_ready_external_operator_values_pending",
      "operator_values_or_executable_packet_candidate_after_local_proof_bundle_snapshot"
    ]
  ],
  [
    preflightPath,
    preflight,
    ["Status: `local_launch_preflight_without_external_operator_values_ready_external_values_pending`"]
  ],
  [
    minimalSheetPath,
    minimalSheet,
    ["Status: `beta_deployment_operator_values_minimal_sheet_ready_not_filled`"]
  ],
  [
    completionPath,
    completion,
    ["Status: `beta_deployment_operator_values_completion_gate_ready_blocked_external_values_pending`"]
  ],
  [
    recordPath,
    record,
    ["Status: `beta_deployment_no_secret_operator_values_record_ready_not_filled`"]
  ],
  [
    safeFillPath,
    safeFill,
    ["Status: `beta_deployment_operator_values_safe_fill_recheck_ready_external_values_pending`"]
  ],
  [
    candidateGatePath,
    candidateGate,
    ["Status: `beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending`"]
  ]
]) {
  for (const phrase of phrases) {
    if (!content.includes(phrase)) problems.push(`${filePath} missing: ${phrase}`);
  }
}

for (const phrase of [
  "Latest beta deployment operator values gap list slice",
  "beta_deployment_operator_values_gap_list_ready_external_values_pending",
  "compress_operator_values_gap_before_executable_packet_candidate",
  "external_operator_values_gap_identified_packet_blocked",
  "fill_safe_operator_values_or_continue_local_launch_runtime_data_work"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/BETA_DEPLOYMENT_OPERATOR_VALUES_GAP_LIST.md` is `accepted` as PM mainline short operator values gap list",
  "beta_deployment_operator_values_gap_list_ready_external_values_pending",
  "compress_operator_values_gap_before_executable_packet_candidate",
  "external_operator_values_gap_identified_packet_blocked",
  "fill_safe_operator_values_or_continue_local_launch_runtime_data_work"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:beta-deployment-operator-values-gap-list"] !==
  "node scripts/check-beta-deployment-operator-values-gap-list.mjs"
) {
  problems.push(`${packagePath} missing check:beta-deployment-operator-values-gap-list script`);
}

for (const phrase of [
  "scripts/check-beta-deployment-operator-values-gap-list.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-deployment-operator-values-gap-list\"",
  "\"beta-deployment-operator-values-gap-list\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const forbiddenPatterns = [
  /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /\b[A-Za-z0-9_-]{32,}\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/u,
  /vercel deploy --prod/u,
  /npm run deploy/u,
  /RUN_DEPLOY_NOW/u,
  /DEPLOYMENT_COMPLETED/u,
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /production deployment completed/u,
  /preview deployment completed/u,
  /DNS configured/u,
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
      guardedStatus: "beta_deployment_operator_values_gap_list_ready_external_values_pending",
      outcome: "external_operator_values_gap_identified_packet_blocked",
      nextRoute: "fill_safe_operator_values_or_continue_local_launch_runtime_data_work",
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
