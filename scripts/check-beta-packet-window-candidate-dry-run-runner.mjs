import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/BETA_PACKET_WINDOW_CANDIDATE_DRY_RUN_RUNNER.md";
const runnerPath = "scripts/run-beta-packet-window-candidate-dry-run.mjs";
const validatorDocPath = "docs/BETA_PLATFORM_TWO_VALUE_VALIDATOR.md";
const repoProofDocPath = "docs/BETA_EXECUTABLE_PACKET_REPO_PROOF_RUNNER_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const doc = read(docPath);
const runner = read(runnerPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `beta_packet_window_candidate_dry_run_runner_ready_waiting_values`",
  "CEO decision: `wire_two_value_validation_to_repo_proof_before_packet_window`",
  "beta_packet_window_candidate_dry_run_runner",
  "dry_run_runner_ready_external_values_still_pending",
  "cmd.exe /c npm run run:beta-packet-window-candidate-dry-run",
  "validate:beta-platform-two-values",
  "run:beta-executable-packet-repo-proof",
  "blocked_waiting_values",
  "rejected_unsafe_values",
  "repo_proof_blocked",
  "packet_window_candidate_ready_shape_only",
  "packetCandidateAllowed",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "betaPlatformValuesEnv",
  "loadBetaPlatformValues",
  "validate:beta-platform-two-values",
  "run:beta-executable-packet-repo-proof",
  "accepted_two_value_shape_only",
  "blocked_waiting_values",
  "rejected_unsafe_values",
  "repo_proof_blocked",
  "packet_window_candidate_ready_shape_only",
  "packetCandidateAllowed: ready",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "loadedFromEnvLocal",
  "worktreeState"
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["run:beta-packet-window-candidate-dry-run"] !== "node scripts/run-beta-packet-window-candidate-dry-run.mjs") {
  problems.push(`${packagePath} missing run:beta-packet-window-candidate-dry-run script`);
}

if (
  pkg.scripts?.["check:beta-packet-window-candidate-dry-run-runner"] !==
  "node scripts/check-beta-packet-window-candidate-dry-run-runner.mjs"
) {
  problems.push(`${packagePath} missing check:beta-packet-window-candidate-dry-run-runner script`);
}

for (const phrase of [
  "scripts/check-beta-packet-window-candidate-dry-run-runner.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-packet-window-candidate-dry-run-runner\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

for (const [filePath, phrase] of [
  [validatorDocPath, "beta_platform_two_value_validator_ready_waiting_values"],
  [repoProofDocPath, "beta_executable_packet_repo_proof_runner_gate_ready"],
  [statusPath, "Latest beta packet window candidate dry-run runner slice"],
  [statusPath, "beta_packet_window_candidate_dry_run_runner_ready_waiting_values"],
  [boardPath, "`docs/BETA_PACKET_WINDOW_CANDIDATE_DRY_RUN_RUNNER.md` is `accepted` as PM mainline packet-window dry-run runner"],
  [boardPath, "dry_run_runner_ready_external_values_still_pending"]
]) {
  if (!read(filePath).includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

const absentRun = spawnSync(process.execPath, [runnerPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: skipDotenv(withoutBetaValues(process.env)),
  windowsHide: true
});

if (absentRun.status !== 0) problems.push(`${runnerPath} absent-value dry run should exit 0`);
if (!absentRun.stdout.includes('"status": "blocked_waiting_values"')) {
  problems.push(`${runnerPath} absent-value dry run did not report blocked_waiting_values`);
}
if (!absentRun.stdout.includes('"repoProof": null')) {
  problems.push(`${runnerPath} absent-value dry run should not run repo proof`);
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
      guardedStatus: "beta_packet_window_candidate_dry_run_runner_ready_waiting_values",
      outcome: "dry_run_runner_ready_external_values_still_pending",
      runner: "run:beta-packet-window-candidate-dry-run"
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

function withoutBetaValues(env) {
  const next = { ...env };
  delete next.BETA_HOSTING_PROJECT_NAME;
  delete next.BETA_TEMPORARY_URL;
  return next;
}

function skipDotenv(env) {
  return {
    ...env,
    BETA_PLATFORM_VALUES_SKIP_DOTENV: "1"
  };
}
