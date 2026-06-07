import fs from "node:fs";

const problems = [];

const docPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_COMPLETION_GATE.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const sourcePaths = [
  "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_MINIMAL_SHEET.md",
  "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_FILL_GUIDE.md",
  "docs/BETA_DEPLOYMENT_INTAKE_CHECKLIST.md",
  "docs/BETA_DEPLOYMENT_EXECUTION_PACKET_DRAFT.md",
  "docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md",
  "docs/ROUTE_LOCAL_PUBLIC_COPY_ALIGNMENT.md",
  "docs/MVP_LAUNCH_PRD.md",
  "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md"
];

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const sources = Object.fromEntries(sourcePaths.map((filePath) => [filePath, read(filePath)]));

const requiredDocPhrases = [
  "Status: `beta_deployment_operator_values_completion_gate_ready_blocked_external_values_pending`",
  "CEO decision: `classify_operator_values_completion_before_executable_packet`",
  "operator_values_completion_gate_then_executable_packet_candidate_recheck",
  "blocked_external_operator_values_pending",
  "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_MINIMAL_SHEET.md",
  "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_FILL_GUIDE.md",
  "docs/BETA_DEPLOYMENT_INTAKE_CHECKLIST.md",
  "docs/BETA_DEPLOYMENT_EXECUTION_PACKET_DRAFT.md",
  "docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md",
  "docs/ROUTE_LOCAL_PUBLIC_COPY_ALIGNMENT.md",
  "docs/MVP_LAUNCH_PRD.md",
  "beta_deployment_operator_values_minimal_sheet_ready_not_filled",
  "beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending",
  "beta_deployment_operator_input_packet_ready_not_filled",
  "beta_deployment_operator_fill_guide_ready_not_filled",
  "beta_deployment_intake_checklist_ready_not_filled",
  "beta_deployment_execution_packet_draft_not_executable",
  "future_deployment_execution_gate_ready_not_executed",
  "route_local_public_copy_alignment_ready_mock_boundary_preserved",
  "publicDataSource=mock",
  "scoreSource=mock",
  "vercel_or_equivalent_managed_nextjs_host",
  "platform_preview_or_beta_url_first_custom_domain_later",
  "defer_custom_domain_until_platform_url_passes_beta_health",
  "## Completion Classification",
  "repo_refreshable_values_ready_not_final",
  "accepted_mock_boundary_values",
  "accepted_public_surface_alignment",
  "external_operator_value_pending",
  "never_fill_in_repo",
  "executable_packet_candidate_blocked_until_operator_values_filled",
  "blocked_external_operator_input_pending",
  "A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`",
  "## Never Fill In Repo",
  "## Hard Stops",
  "cmd.exe /c npm run check:beta-deployment-operator-values-completion-gate",
  "cmd.exe /c npm run check:beta-deployment-operator-values-minimal-sheet",
  "cmd.exe /c npm run check:beta-deployment-executable-packet-candidate-gate",
  "cmd.exe /c npm run check:route-local-public-copy-alignment",
  "cmd.exe /c npm run check:public-visible-language-quality",
  "cmd.exe /c npm run check:public-route-loop",
  "node scripts/check-review-gates.mjs",
  "git diff --check",
  "scripts/check-beta-deployment-operator-values-completion-gate.mjs",
  "The next route is `operator_values_record_fill_or_executable_packet_candidate_recheck`, not deployment"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const sourceExpectations = {
  "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_MINIMAL_SHEET.md": [
    "Status: `beta_deployment_operator_values_minimal_sheet_ready_not_filled`",
    "operator_values_sheet_fill_then_executable_packet_candidate",
    "external_operator_value_pending",
    "repo_refreshable_not_final"
  ],
  "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md": [
    "Status: `beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending`",
    "blocked_operator_values_pending",
    "fill_operator_values_then_create_executable_packet_candidate"
  ],
  "docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md": [
    "Status: `beta_deployment_operator_input_packet_ready_not_filled`",
    "TBD_PROVIDER_NAME",
    "TBD_TEMPORARY_BETA_URL"
  ],
  "docs/BETA_DEPLOYMENT_OPERATOR_FILL_GUIDE.md": [
    "Status: `beta_deployment_operator_fill_guide_ready_not_filled`",
    "blocked_external_operator_input_pending"
  ],
  "docs/BETA_DEPLOYMENT_INTAKE_CHECKLIST.md": [
    "Status: `beta_deployment_intake_checklist_ready_not_filled`",
    "operator_intake_values_pending_then_executable_packet_candidate"
  ],
  "docs/BETA_DEPLOYMENT_EXECUTION_PACKET_DRAFT.md": [
    "Status: `beta_deployment_execution_packet_draft_not_executable`",
    "NOT_EXECUTABLE_OPERATOR_INPUTS_PENDING"
  ],
  "docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md": [
    "Status: `future_deployment_execution_gate_ready_not_executed`",
    "vercel_or_equivalent_managed_nextjs_host"
  ],
  "docs/ROUTE_LOCAL_PUBLIC_COPY_ALIGNMENT.md": [
    "Status: `route_local_public_copy_alignment_ready_mock_boundary_preserved`",
    "publicDataSource=mock",
    "scoreSource=mock"
  ],
  "docs/MVP_LAUNCH_PRD.md": [
    "publicDataSource=mock",
    "scoreSource=mock"
  ]
};

for (const [filePath, phrases] of Object.entries(sourceExpectations)) {
  for (const phrase of phrases) {
    if (!sources[filePath].includes(phrase)) problems.push(`${filePath} missing source expectation: ${phrase}`);
  }
}

const requiredNeverFill = [
  "deployment token",
  "API token",
  "private preview token",
  "private dashboard token",
  "registrar credential",
  "SSL private key",
  "env value",
  "service role key",
  "Supabase secret",
  "raw payload",
  "row payload",
  "stock id payload",
  "private invite token",
  "payment credential"
];

for (const phrase of requiredNeverFill) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing never-fill item: ${phrase}`);
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
  "Latest beta deployment operator values completion gate slice",
  "beta_deployment_operator_values_completion_gate_ready_blocked_external_values_pending",
  "classify_operator_values_completion_before_executable_packet",
  "blocked_external_operator_values_pending",
  "operator_values_record_fill_or_executable_packet_candidate_recheck"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/BETA_DEPLOYMENT_OPERATOR_VALUES_COMPLETION_GATE.md` is `accepted` as PM mainline operator values completion gate",
  "beta_deployment_operator_values_completion_gate_ready_blocked_external_values_pending",
  "classify_operator_values_completion_before_executable_packet",
  "blocked_external_operator_values_pending",
  "operator_values_record_fill_or_executable_packet_candidate_recheck"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:beta-deployment-operator-values-completion-gate"] !==
  "node scripts/check-beta-deployment-operator-values-completion-gate.mjs"
) {
  problems.push(`${packagePath} missing check:beta-deployment-operator-values-completion-gate script`);
}

for (const phrase of [
  "scripts/check-beta-deployment-operator-values-completion-gate.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-deployment-operator-values-completion-gate\"",
  "\"beta-deployment-operator-values-completion-gate\""
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
      guardedStatus: "beta_deployment_operator_values_completion_gate_ready_blocked_external_values_pending",
      outcome: "blocked_external_operator_values_pending",
      nextRoute: "operator_values_record_fill_or_executable_packet_candidate_recheck",
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
