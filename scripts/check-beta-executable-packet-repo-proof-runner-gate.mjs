import fs from "node:fs";

const problems = [];

const docPath = "docs/BETA_EXECUTABLE_PACKET_REPO_PROOF_RUNNER_GATE.md";
const runnerPath = "scripts/run-beta-executable-packet-repo-proof.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const fastHealthPath = "docs/BETA_RUNTIME_FAST_HEALTH_GATE.md";
const candidatePath = "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md";

const doc = read(docPath);
const runner = read(runnerPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);
const board = read(boardPath);

for (const phrase of [
  "Status: `beta_executable_packet_repo_proof_runner_gate_ready`",
  "CEO decision: `make_repo_derived_packet_proof_executable_without_waiting_for_platform_values`",
  "beta_executable_packet_repo_proof_runner_gate",
  "repo_proof_runner_ready_packet_still_blocked_external_platform_values_pending",
  "cmd.exe /c npm run run:beta-executable-packet-repo-proof",
  "git branch --show-current",
  "git rev-parse --short HEAD",
  "git status --short",
  "cmd.exe /c npm run check:beta-runtime-fast-health",
  "cmd.exe /c npm run check:public-route-loop",
  "cmd.exe /c npx tsc --noEmit",
  "packetCandidateAllowed: false",
  "platform_generated_value_pending",
  "external_operator_value_pending",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "packetCandidateAllowed: false",
  "platform_generated_values_pending",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "check:beta-runtime-fast-health",
  "check:public-route-loop",
  "tsc",
  "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["run:beta-executable-packet-repo-proof"] !== "node scripts/run-beta-executable-packet-repo-proof.mjs") {
  problems.push(`${packagePath} missing run:beta-executable-packet-repo-proof script`);
}

if (
  pkg.scripts?.["check:beta-executable-packet-repo-proof-runner-gate"] !==
  "node scripts/check-beta-executable-packet-repo-proof-runner-gate.mjs"
) {
  problems.push(`${packagePath} missing check:beta-executable-packet-repo-proof-runner-gate script`);
}

for (const phrase of [
  "scripts/check-beta-executable-packet-repo-proof-runner-gate.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-executable-packet-repo-proof-runner-gate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

for (const [filePath, phrase] of [
  [fastHealthPath, "beta_runtime_fast_health_gate_ready"],
  [candidatePath, "beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending"],
  [statusPath, "Latest beta executable packet repo proof runner gate slice"],
  [statusPath, "beta_executable_packet_repo_proof_runner_gate_ready"],
  [boardPath, "`docs/BETA_EXECUTABLE_PACKET_REPO_PROOF_RUNNER_GATE.md` is `accepted` as PM mainline repo proof runner gate"],
  [boardPath, "repo_proof_runner_ready_packet_still_blocked_external_platform_values_pending"]
]) {
  if (!read(filePath).includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

for (const phrase of [
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
  "`scoreSource=real`",
  "investment advice claim",
  "public launch completion claim"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

const forbiddenPatterns = [
  /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /vercel deploy/iu,
  /npm run deploy/iu,
  /RUN_DEPLOY_NOW/u,
  /DEPLOYMENT_COMPLETED/u,
  /production deployment completed/iu,
  /preview deployment completed/iu,
  /deployment command executed/iu,
  /hosting project created/iu,
  /platform env mutated/iu,
  /SQL execution is approved/iu,
  /Supabase writes are approved/iu,
  /row coverage points awarded/iu,
  /complete MVP coverage achieved/iu,
  /publicDataSource=supabase is approved/iu,
  /scoreSource=real is approved/iu
];

for (const [filePath, source] of [
  [docPath, doc],
  [runnerPath, runner]
]) {
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source)) problems.push(`${filePath} contains forbidden pattern: ${pattern}`);
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
      guardedStatus: "beta_executable_packet_repo_proof_runner_gate_ready",
      outcome: "repo_proof_runner_ready_packet_still_blocked_external_platform_values_pending",
      runner: "run:beta-executable-packet-repo-proof"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }

  return fs.readFileSync(filePath, "utf8");
}
