import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];

const blocked = runWithEnv({
  BETA_PLATFORM_VALUES_SKIP_DOTENV: "1",
  BETA_HOSTING_PROJECT_NAME: "",
  BETA_TEMPORARY_URL: ""
});

expect(blocked.json?.status === "blocked_waiting_two_platform_values", "missing values should block");
expect(blocked.json?.ok === false, "missing values should not be ok");
expect(
  blocked.json?.nextAction === "collect_only_BETA_HOSTING_PROJECT_NAME_and_BETA_TEMPORARY_URL_then_response_readiness",
  "missing values should route to two-value collection then response-readiness"
);

const safeProject = "codex-safe-beta";
const safeUrl = "https://codex-safe-beta.vercel.app/";
const accepted = runWithEnv({
  BETA_PLATFORM_VALUES_SKIP_DOTENV: "1",
  BETA_HOSTING_PROJECT_NAME: safeProject,
  BETA_TEMPORARY_URL: safeUrl
});

expect(accepted.json?.status === "beta_platform_values_ready_for_packet_proof", "safe values should be ready");
expect(accepted.json?.ok === true, "safe values should be ok");
expect(accepted.json?.validator?.provider === "vercel", "safe vercel URL should classify provider");
expect(
  accepted.json?.nextCommands?.includes("cmd.exe /c npm run run:public-beta-post-reply-route-once"),
  "accepted values should route to public Beta post-reply one-runner"
);
expect(
  !accepted.json?.nextCommands?.includes("cmd.exe /c npm run run:beta-packet-window-proof-map"),
  "accepted values must not expose packet proof-map as the PM next command"
);
expect(
  accepted.json?.diagnosticCommands?.includes("cmd.exe /c npm run run:beta-packet-window-proof-map"),
  "accepted values should keep packet proof-map available as a diagnostic command"
);
expect(
  blocked.json?.nextCommands?.includes("cmd.exe /c npm run report:public-beta-external-input-response-readiness"),
  "missing values should route to response-readiness after intake"
);
expect(
  !blocked.json?.nextCommands?.includes("cmd.exe /c npm run validate:beta-platform-two-values"),
  "missing values must not expose standalone validator as the routine PM next command"
);
expect(
  blocked.json?.diagnosticCommands?.includes("cmd.exe /c npm run validate:beta-platform-two-values"),
  "missing values should keep validator available as a diagnostic command"
);
expect(!accepted.output.includes(safeProject), "report must not print the hosting project value");
expect(!accepted.output.includes(safeUrl), "report must not print the temporary URL value");

for (const output of [blocked.output, accepted.output]) {
  expect(output.includes('"publicDataSource": "mock"'), "report must keep publicDataSource mock");
  expect(output.includes('"scoreSource": "mock"'), "report must keep scoreSource mock");
  for (const pattern of forbiddenPatterns()) {
    expect(!pattern.test(output), `report output forbidden pattern ${String(pattern)}`);
  }
}

const source = read("scripts/report-beta-platform-proof-status.mjs");
for (const phrase of [
  "compress_beta_platform_next_step_to_public_beta_post_reply_one_runner",
  "run_public_beta_post_reply_one_runner_then_rerun_mainline_current_route",
  "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
  "diagnosticCommands"
]) {
  expect(source.includes(phrase), `report source missing compressed GOAL phrase: ${phrase}`);
}
for (const phrase of [
  "No platform values are printed by this report.",
  "No platform values are stored by this report.",
  "No deployment, hosting mutation, SQL, Supabase read/write, market-data fetch, source promotion, or score promotion is executed."
]) {
  expect(source.includes(phrase), `report source missing stop line: ${phrase}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "beta_platform_proof_status_ready",
      missingValuesStatus: blocked.json.status,
      acceptedValuesStatus: accepted.json.status,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function runWithEnv(extraEnv) {
  const result = spawnSync("node", ["scripts/report-beta-platform-proof-status.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, ...extraEnv },
    timeout: 120000,
    windowsHide: true
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;

  return {
    exitCode: result.status ?? 1,
    json: parseJsonFromStdout(result.stdout ?? ""),
    output
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

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function expect(pass, message) {
  if (!pass) problems.push(message);
}

function forbiddenPatterns() {
  return [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u,
    /raw market payload/iu
  ];
}
