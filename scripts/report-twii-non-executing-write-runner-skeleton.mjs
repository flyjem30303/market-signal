import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const outPath = args.out ?? path.join("tmp", "twii-non-executing-write-runner-skeleton-report.json");
const runnerArgs = [];
if (args["packet-path"]) runnerArgs.push("--packet-path", args["packet-path"]);
if (args.execute) runnerArgs.push("--execute", String(args.execute));
if (args.confirmation) runnerArgs.push("--confirmation", args.confirmation);

const result = spawnSync(process.execPath, ["scripts/run-twii-non-executing-write-runner-skeleton.mjs", ...runnerArgs], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

const runnerOutput = parseJson(result.stdout ?? "");
const report = {
  status:
    runnerOutput.status === "blocked_non_executing_skeleton_only"
      ? "twii_non_executing_write_runner_skeleton_ready_fail_closed"
      : "blocked",
  outcome:
    runnerOutput.status === "blocked_non_executing_skeleton_only"
      ? "runner_skeleton_fail_closed_before_real_write"
      : "blocked",
  runnerExitCode: result.status,
  runnerStatus: runnerOutput.status ?? null,
  runnerOutcome: runnerOutput.outcome ?? null,
  mode: "twii_non_executing_write_runner_skeleton_report",
  owner: "CEO/PM",
  acceptedMeaning:
    "The skeleton can reach its local stop line and still refuses real execution. It does not approve SQL, Supabase connection/write, daily_prices mutation, row acceptance, scoring, promotion, or real score.",
  safety: runnerOutput.safety ?? {},
  currentBoundary: runnerOutput.currentBoundary ?? {},
  problems: runnerOutput.problems ?? ["runner_output_missing"]
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (report.status === "blocked") process.exit(1);

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const current = rawArgs[index];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    const next = rawArgs[index + 1];
    if (next && !next.startsWith("--")) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = true;
    }
  }
  return parsed;
}

