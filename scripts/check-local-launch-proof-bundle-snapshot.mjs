import fs from "node:fs";

const problems = [];

const docPath = "docs/LOCAL_LAUNCH_PROOF_BUNDLE_SNAPSHOT.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const localPreflightPath = "docs/LOCAL_LAUNCH_PREFLIGHT_WITHOUT_EXTERNAL_OPERATOR_VALUES.md";
const safeFillPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_SAFE_FILL_RECHECK.md";
const recordPath = "docs/BETA_DEPLOYMENT_NO_SECRET_OPERATOR_VALUES_RECORD.md";
const completionPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_COMPLETION_GATE.md";
const betaPreflightPath = "docs/BETA_LAUNCH_PREFLIGHT_PACKET.md";
const publicBetaPath = "docs/PUBLIC_BETA_READINESS_GATE.md";
const formalLaunchPath = "docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md";
const routeCopyPath = "docs/ROUTE_LOCAL_PUBLIC_COPY_ALIGNMENT.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const localPreflight = read(localPreflightPath);
const safeFill = read(safeFillPath);
const record = read(recordPath);
const completion = read(completionPath);
const betaPreflight = read(betaPreflightPath);
const publicBeta = read(publicBetaPath);
const formalLaunch = read(formalLaunchPath);
const routeCopy = read(routeCopyPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `local_launch_proof_bundle_snapshot_ready_external_values_pending`",
  "CEO decision: `capture_local_launch_proof_bundle_before_executable_packet`",
  "local_launch_proof_bundle_snapshot_then_operator_values_or_packet_candidate",
  "local_proof_bundle_ready_external_operator_values_pending",
  "docs/LOCAL_LAUNCH_PREFLIGHT_WITHOUT_EXTERNAL_OPERATOR_VALUES.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_SAFE_FILL_RECHECK.md",
  "docs/BETA_DEPLOYMENT_NO_SECRET_OPERATOR_VALUES_RECORD.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_COMPLETION_GATE.md",
  "docs/BETA_LAUNCH_PREFLIGHT_PACKET.md",
  "docs/PUBLIC_BETA_READINESS_GATE.md",
  "docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md",
  "docs/ROUTE_LOCAL_PUBLIC_COPY_ALIGNMENT.md",
  "local_launch_preflight_without_external_operator_values_ready_external_values_pending",
  "local_preflight_ready_external_operator_values_pending",
  "beta_deployment_operator_values_safe_fill_recheck_ready_external_values_pending",
  "beta_deployment_operator_values_completion_gate_ready_blocked_external_values_pending",
  "beta_deployment_no_secret_operator_values_record_ready_not_filled",
  "beta_launch_preflight_packet_ready_not_deployed",
  "public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked",
  "formal_launch_deployment_readiness_gate_ready_not_deployed",
  "publicDataSource=mock",
  "scoreSource=mock",
  "## Current Local Proof Bundle",
  "cmd.exe /c npm run check:local-launch-preflight-without-external-operator-values",
  "cmd.exe /c npm run check:beta-deployment-operator-values-safe-fill-recheck",
  "cmd.exe /c npm run check:beta-deployment-no-secret-operator-values-record",
  "cmd.exe /c npm run check:beta-launch-preflight-packet",
  "cmd.exe /c npm run check:public-beta-readiness-gate",
  "cmd.exe /c npm run check:formal-launch-deployment-readiness-gate",
  "cmd.exe /c npm run check:route-local-public-copy-alignment",
  "cmd.exe /c npm run check:public-visible-language-quality",
  "cmd.exe /c npm run check:public-route-loop",
  "cmd.exe /c npm run check:json",
  "node scripts/check-review-gates.mjs",
  "git diff --check",
  "node scripts/check-localhost-full-health.mjs",
  "cmd.exe /c npx tsc --noEmit",
  "cmd.exe /c npm run build",
  "## Snapshot Classification",
  "accepted_local_snapshot",
  "refresh_at_packet_creation",
  "external_operator_value_pending",
  "accepted_defer_or_external_pending",
  "A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`",
  "## Hard Stops",
  "The next route is `operator_values_or_executable_packet_candidate_after_local_proof_bundle_snapshot`, not deployment"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [filePath, content, phrases] of [
  [
    localPreflightPath,
    localPreflight,
    [
      "Status: `local_launch_preflight_without_external_operator_values_ready_external_values_pending`",
      "local_preflight_ready_external_operator_values_pending",
      "external_operator_values_or_executable_packet_candidate_after_local_preflight"
    ]
  ],
  [
    safeFillPath,
    safeFill,
    [
      "Status: `beta_deployment_operator_values_safe_fill_recheck_ready_external_values_pending`",
      "external_operator_values_still_pending_executable_packet_blocked"
    ]
  ],
  [
    recordPath,
    record,
    ["Status: `beta_deployment_no_secret_operator_values_record_ready_not_filled`"]
  ],
  [
    completionPath,
    completion,
    ["Status: `beta_deployment_operator_values_completion_gate_ready_blocked_external_values_pending`"]
  ],
  [
    betaPreflightPath,
    betaPreflight,
    ["Status: `beta_launch_preflight_packet_ready_not_deployed`"]
  ],
  [
    publicBetaPath,
    publicBeta,
    ["Status: `public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked`"]
  ],
  [
    formalLaunchPath,
    formalLaunch,
    ["Status: `formal_launch_deployment_readiness_gate_ready_not_deployed`"]
  ],
  [
    routeCopyPath,
    routeCopy,
    ["Status: `route_local_public_copy_alignment_ready_mock_boundary_preserved`", "publicDataSource=mock", "scoreSource=mock"]
  ]
]) {
  for (const phrase of phrases) {
    if (!content.includes(phrase)) problems.push(`${filePath} missing: ${phrase}`);
  }
}

for (const phrase of [
  "Latest local launch proof bundle snapshot slice",
  "local_launch_proof_bundle_snapshot_ready_external_values_pending",
  "capture_local_launch_proof_bundle_before_executable_packet",
  "local_proof_bundle_ready_external_operator_values_pending",
  "operator_values_or_executable_packet_candidate_after_local_proof_bundle_snapshot"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/LOCAL_LAUNCH_PROOF_BUNDLE_SNAPSHOT.md` is `accepted` as PM mainline local proof bundle snapshot",
  "local_launch_proof_bundle_snapshot_ready_external_values_pending",
  "capture_local_launch_proof_bundle_before_executable_packet",
  "local_proof_bundle_ready_external_operator_values_pending",
  "operator_values_or_executable_packet_candidate_after_local_proof_bundle_snapshot"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:local-launch-proof-bundle-snapshot"] !==
  "node scripts/check-local-launch-proof-bundle-snapshot.mjs"
) {
  problems.push(`${packagePath} missing check:local-launch-proof-bundle-snapshot script`);
}

for (const phrase of [
  "scripts/check-local-launch-proof-bundle-snapshot.mjs",
  "expectStatus: \"ok\"",
  "name: \"local-launch-proof-bundle-snapshot\"",
  "\"local-launch-proof-bundle-snapshot\""
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
      guardedStatus: "local_launch_proof_bundle_snapshot_ready_external_values_pending",
      outcome: "local_proof_bundle_ready_external_operator_values_pending",
      nextRoute: "operator_values_or_executable_packet_candidate_after_local_proof_bundle_snapshot",
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
