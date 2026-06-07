import fs from "node:fs";

const problems = [];

const docPath = "docs/LOCAL_LAUNCH_PREFLIGHT_WITHOUT_EXTERNAL_OPERATOR_VALUES.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const safeFillPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_SAFE_FILL_RECHECK.md";
const recordPath = "docs/BETA_DEPLOYMENT_NO_SECRET_OPERATOR_VALUES_RECORD.md";
const betaPreflightPath = "docs/BETA_LAUNCH_PREFLIGHT_PACKET.md";
const publicBetaPath = "docs/PUBLIC_BETA_READINESS_GATE.md";
const formalLaunchPath = "docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md";
const routeCopyPath = "docs/ROUTE_LOCAL_PUBLIC_COPY_ALIGNMENT.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const safeFill = read(safeFillPath);
const record = read(recordPath);
const betaPreflight = read(betaPreflightPath);
const publicBeta = read(publicBetaPath);
const formalLaunch = read(formalLaunchPath);
const routeCopy = read(routeCopyPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `local_launch_preflight_without_external_operator_values_ready_external_values_pending`",
  "CEO decision: `continue_local_launch_preflight_while_external_operator_values_pending`",
  "local_launch_preflight_without_external_values_then_operator_values_or_packet_candidate",
  "local_preflight_ready_external_operator_values_pending",
  "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_SAFE_FILL_RECHECK.md",
  "docs/BETA_DEPLOYMENT_NO_SECRET_OPERATOR_VALUES_RECORD.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_COMPLETION_GATE.md",
  "docs/BETA_LAUNCH_PREFLIGHT_PACKET.md",
  "docs/PUBLIC_BETA_READINESS_GATE.md",
  "docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md",
  "docs/ROUTE_LOCAL_PUBLIC_COPY_ALIGNMENT.md",
  "beta_deployment_operator_values_safe_fill_recheck_ready_external_values_pending",
  "external_operator_values_still_pending_executable_packet_blocked",
  "beta_deployment_no_secret_operator_values_record_ready_not_filled",
  "public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked",
  "beta_launch_preflight_packet_ready_not_deployed",
  "formal_launch_deployment_readiness_gate_ready_not_deployed",
  "route_local_public_copy_alignment_ready_mock_boundary_preserved",
  "publicDataSource=mock",
  "scoreSource=mock",
  "## Local Preflight Scope",
  "local_executable",
  "local_executable_if_code_changes",
  "local_executable_at_milestone",
  "external_operator_value_pending",
  "cmd.exe /c npm run check:json",
  "cmd.exe /c npm run check:public-route-loop",
  "cmd.exe /c npm run check:route-local-public-copy-alignment",
  "cmd.exe /c npm run check:public-visible-language-quality",
  "node scripts/check-localhost-full-health.mjs",
  "cmd.exe /c npx tsc --noEmit",
  "cmd.exe /c npm run build",
  "node scripts/check-review-gates.mjs",
  "## Local Proof Bundle",
  "cmd.exe /c npm run check:beta-deployment-operator-values-safe-fill-recheck",
  "cmd.exe /c npm run check:beta-deployment-no-secret-operator-values-record",
  "cmd.exe /c npm run check:beta-launch-preflight-packet",
  "cmd.exe /c npm run check:public-beta-readiness-gate",
  "cmd.exe /c npm run check:formal-launch-deployment-readiness-gate",
  "git diff --check",
  "## Local Acceptance",
  "A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`",
  "## Hard Stops",
  "The next route is `external_operator_values_or_executable_packet_candidate_after_local_preflight`, not deployment"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const requiredScopeItems = [
  "JSON/config syntax",
  "Public route loop",
  "Route-local public copy alignment",
  "Public visible language quality",
  "Local localhost health",
  "TypeScript",
  "Build",
  "Review gate",
  "Mock runtime boundary",
  "Deployment provider",
  "Hosting project",
  "Temporary Beta URL",
  "DNS / SSL",
  "Env owner",
  "Secret owner/channel",
  "Rollback owner/reference",
  "Incident owner/channel",
  "Monitoring target"
];

for (const phrase of requiredScopeItems) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing scope item: ${phrase}`);
}

for (const phrase of [
  "Status: `beta_deployment_operator_values_safe_fill_recheck_ready_external_values_pending`",
  "external_operator_values_still_pending_executable_packet_blocked",
  "external_operator_values_or_continue_local_launch_preflight"
]) {
  if (!safeFill.includes(phrase)) problems.push(`${safeFillPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `beta_deployment_no_secret_operator_values_record_ready_not_filled`",
  "not_filled_external_operator_values_pending"
]) {
  if (!record.includes(phrase)) problems.push(`${recordPath} missing: ${phrase}`);
}

for (const [filePath, content, phrases] of [
  [
    betaPreflightPath,
    betaPreflight,
    ["Status: `beta_launch_preflight_packet_ready_not_deployed`", "ready_for_local_public_beta_preflight_not_production_deployed"]
  ],
  [
    publicBetaPath,
    publicBeta,
    ["Status: `public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked`", "ready_for_local_public_beta_preflight_not_production_deployed"]
  ],
  [
    formalLaunchPath,
    formalLaunch,
    ["Status: `formal_launch_deployment_readiness_gate_ready_not_deployed`", "ready_for_deployment_preflight_review_not_deployed"]
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

const requiredHardStops = [
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
  "Supabase connection for deployment proof",
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
  "row coverage points",
  "complete MVP coverage claim",
  "Supabase public-source promotion",
  "`publicDataSource=supabase`",
  "real score promotion",
  "`scoreSource=real`",
  "investment advice claim",
  "public launch completion claim"
];

for (const phrase of requiredHardStops) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

for (const phrase of [
  "Latest local launch preflight without external operator values slice",
  "local_launch_preflight_without_external_operator_values_ready_external_values_pending",
  "continue_local_launch_preflight_while_external_operator_values_pending",
  "local_preflight_ready_external_operator_values_pending",
  "external_operator_values_or_executable_packet_candidate_after_local_preflight"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/LOCAL_LAUNCH_PREFLIGHT_WITHOUT_EXTERNAL_OPERATOR_VALUES.md` is `accepted` as PM mainline local launch preflight while external operator values remain pending",
  "local_launch_preflight_without_external_operator_values_ready_external_values_pending",
  "continue_local_launch_preflight_while_external_operator_values_pending",
  "local_preflight_ready_external_operator_values_pending",
  "external_operator_values_or_executable_packet_candidate_after_local_preflight"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:local-launch-preflight-without-external-operator-values"] !==
  "node scripts/check-local-launch-preflight-without-external-operator-values.mjs"
) {
  problems.push(`${packagePath} missing check:local-launch-preflight-without-external-operator-values script`);
}

for (const phrase of [
  "scripts/check-local-launch-preflight-without-external-operator-values.mjs",
  "expectStatus: \"ok\"",
  "name: \"local-launch-preflight-without-external-operator-values\"",
  "\"local-launch-preflight-without-external-operator-values\""
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
      guardedStatus: "local_launch_preflight_without_external_operator_values_ready_external_values_pending",
      outcome: "local_preflight_ready_external_operator_values_pending",
      nextRoute: "external_operator_values_or_executable_packet_candidate_after_local_preflight",
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
