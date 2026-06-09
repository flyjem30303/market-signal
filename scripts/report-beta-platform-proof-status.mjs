import { spawnSync } from "node:child_process";

const validator = run(["cmd.exe", "/c", "npm", "run", "validate:beta-platform-two-values"]);
const validatorJson = parseJsonFromStdout(validator.stdout);
const validatorStatus = validatorJson?.status ?? "validator_output_unreadable";
const ok = validatorStatus === "accepted_two_value_shape_only";

const status =
  ok
    ? "beta_platform_values_ready_for_packet_proof"
    : validatorStatus === "rejected_unsafe_values"
      ? "beta_platform_values_rejected_unsafe_shape"
      : "blocked_waiting_two_platform_values";

const postReplyOneRunnerCommand = "cmd.exe /c npm run run:public-beta-post-reply-route-once";
const responseReadinessCommand = "cmd.exe /c npm run report:public-beta-external-input-response-readiness";

const report = {
  status,
  ok,
  mode: "beta_platform_proof_status",
  ceoDecision: "compress_beta_platform_next_step_to_public_beta_post_reply_one_runner",
  validator: {
    exitCode: validator.exitCode,
    status: validatorStatus,
    provider: validatorJson?.values?.provider ?? "pending",
    hostingProjectNameProvided: Boolean(validatorJson?.values?.hostingProjectNameProvided),
    temporaryBetaUrlProvided: Boolean(validatorJson?.values?.temporaryBetaUrlProvided),
    loadedFromEnvLocal: Boolean(validatorJson?.values?.loadedFromEnvLocal),
    problemCount: Array.isArray(validatorJson?.problems) ? validatorJson.problems.length : 0
  },
  nextAction: ok
    ? "run_public_beta_post_reply_one_runner_then_rerun_mainline_current_route"
    : status === "beta_platform_values_rejected_unsafe_shape"
      ? "replace_with_only_two_safe_public_beta_platform_values"
      : "collect_only_BETA_HOSTING_PROJECT_NAME_and_BETA_TEMPORARY_URL_then_response_readiness",
  nextCommands: ok
    ? [
      postReplyOneRunnerCommand,
      "cmd.exe /c npm run report:beta-mainline-current-route"
    ]
    : [
      "cmd.exe /c npm run report:beta-platform-two-value-intake-command",
      responseReadinessCommand
    ],
  diagnosticCommands: [
    "cmd.exe /c npm run validate:beta-platform-two-values",
    "cmd.exe /c npm run run:beta-packet-window-proof-map"
  ],
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  stopLines: [
    "No platform values are printed by this report.",
    "No platform values are stored by this report.",
    "No deployment, hosting mutation, SQL, Supabase read/write, market-data fetch, source promotion, or score promotion is executed."
  ]
};

console.log(JSON.stringify(report, null, 2));

process.exit(status === "beta_platform_values_rejected_unsafe_shape" ? 1 : 0);

function run(command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: process.env,
    timeout: 120000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    stderr: (result.stderr ?? "").trim(),
    stdout: (result.stdout ?? "").trim()
  };
}

function parseJsonFromStdout(stdout) {
  const start = stdout.indexOf("{");
  if (start < 0) return null;

  try {
    return JSON.parse(stdout.slice(start));
  } catch {
    return null;
  }
}
