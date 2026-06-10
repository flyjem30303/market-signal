import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-twii-bounded-write-attempt-runner-fail-closed-scaffold.mjs";

const run = spawnSync(process.execPath, [runnerPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

const runnerOutput = parseJson(run.stdout ?? "");
const ok =
  run.status === 0 &&
  runnerOutput.status === "twii_bounded_write_attempt_runner_fail_closed_scaffold_blocked_no_execution";

const report = {
  status: ok ? "twii_bounded_write_attempt_runner_fail_closed_scaffold_ready_no_execution" : "blocked",
  outcome: ok
    ? "bounded_write_attempt_runner_scaffold_ready_and_fail_closed"
    : "bounded_write_attempt_runner_scaffold_blocked",
  runnerExitCode: run.status,
  runnerStatus: runnerOutput.status ?? null,
  runnerOutcome: runnerOutput.outcome ?? null,
  mode: "twii_bounded_write_attempt_runner_fail_closed_scaffold_report",
  owner: "CEO/PM",
  acceptedMeaning:
    "The runner scaffold can be invoked locally and still refuses real execution. It does not approve SQL, Supabase connection/write, daily_prices mutation, row acceptance, scoring, promotion, or real score.",
  target: runnerOutput.target ?? {},
  runnerState: runnerOutput.runnerState ?? {},
  controls: runnerOutput.controls ?? {},
  safety: runnerOutput.safety ?? {},
  upstream: runnerOutput.upstream ?? {},
  blockedExecutionReasons: runnerOutput.blockedExecutionReasons ?? [],
  problems: runnerOutput.problems ?? ["runner_output_missing"]
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
