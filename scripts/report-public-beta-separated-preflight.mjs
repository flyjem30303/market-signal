import { spawnSync } from "node:child_process";

const steps = [];

steps.push(runStep("preflight-start-dev-recovery", ["cmd.exe", "/c", "npm", "run", "dev:recover"]));
steps.push(runStepWithRetries("pre-build-runtime-health", ["cmd.exe", "/c", "npm", "run", "check:beta-runtime-fast-health"], 6, 5000));
steps.push(runStep("initial-mock-route-bundle", ["cmd.exe", "/c", "npm", "run", "check:public-beta-mock-launch-proof-bundle"]));
steps.push(runStep("production-build-proof", ["cmd.exe", "/c", "npm", "run", "check:public-beta-production-build-proof"]));
steps.push(runStep("dev-recovery-after-build", ["cmd.exe", "/c", "npm", "run", "dev:recover"]));
steps.push(runStepWithRetries("post-recovery-runtime-health", ["cmd.exe", "/c", "npm", "run", "check:beta-runtime-fast-health"], 6, 5000));
steps.push(runStep("post-recovery-mock-route-bundle", ["cmd.exe", "/c", "npm", "run", "check:public-beta-mock-launch-proof-bundle"]));

const failed = steps.filter((step) => !step.pass);
const finalBundle = steps.find((step) => step.name === "post-recovery-mock-route-bundle")?.json;
const remainingHardBlockers = finalBundle?.remainingHardBlockers ?? 2;

const report = {
  status: failed.length === 0
    ? "public_beta_separated_preflight_ready_external_inputs_pending"
    : "public_beta_separated_preflight_blocked",
  ok: failed.length === 0,
  mode: "public_beta_separated_preflight",
  ceoDecision: "keep_route_proof_and_build_proof_separated_to_avoid_next_cache_instability",
  sequencePolicy: {
    start: "recover_next_dev_server_before_route_proof",
    beforeBuild: "prove_local_mock_routes_first",
    build: "run_production_build_as_separate_deployment_preflight",
    afterBuild: "recover_next_dev_server_then_reprove_routes",
    reason: "next_build_mutates_dot_next_and_can_destabilize_dev_server_route_health"
  },
  localProof: {
    passed: steps.filter((step) => step.pass).map((step) => step.name),
    failed: failed.map((step) => step.name),
    checkedCount: steps.length,
    allRequiredChecksPassed: failed.length === 0
  },
  remainingHardBlockers,
  nextAction: failed.length === 0
    ? "collect_two_platform_values_or_a1_four_slot_evidence_then_rerun_targeted_status"
    : "repair_failed_separated_preflight_step_before_external_progress",
  nextCommands: failed.length === 0
    ? [
        "cmd.exe /c npm run report:beta-platform-proof-status",
        "cmd.exe /c npm run report:a1-twii-evidence-completion-status"
      ]
    : failed.map((step) => step.command),
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  stopLines: [
    "This separated preflight proves local deploy-preview readiness, not public launch completion.",
    "Production build proof is intentionally separate from localhost route proof.",
    "No deployment or hosting mutation is executed.",
    "No platform values, secrets, raw payloads, row payloads, or stock id payloads are printed.",
    "No SQL, Supabase read/write, staging row, daily_prices mutation, or market-data fetch is executed.",
    "No source-rights approval, source promotion, score promotion, or investment-advice claim is granted."
  ],
  steps: steps.map((step) => ({
    attempts: step.attempts,
    command: step.command,
    exitCode: step.exitCode,
    name: step.name,
    pass: step.pass,
    status: step.status
  }))
};

console.log(JSON.stringify(report, null, 2));
process.exit(failed.length === 0 ? 0 : 1);

function runStep(name, command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      BETA_RUNTIME_FAST_HEALTH_TIMEOUT_MS: process.env.BETA_RUNTIME_FAST_HEALTH_TIMEOUT_MS ?? "20000",
      PUBLIC_BETA_QUICK_PROOF_TIMEOUT_MS: process.env.PUBLIC_BETA_QUICK_PROOF_TIMEOUT_MS ?? "20000"
    },
    maxBuffer: 1024 * 1024 * 20,
    timeout: 480000,
    windowsHide: true
  });
  const json = parseJson(result.stdout ?? "");
  return {
    attempts: 1,
    command: command.join(" "),
    exitCode: result.status ?? 1,
    json,
    name,
    pass: result.status === 0,
    status: json?.status ?? (result.status === 0 ? "ok" : "blocked")
  };
}

function runStepWithRetries(name, command, maxAttempts, waitMs) {
  let last;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    last = runStep(name, command);
    last.attempts = attempt;
    if (last.pass) return last;
    if (attempt < maxAttempts) wait(waitMs);
  }
  return last;
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return null;
  }
}

function wait(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
