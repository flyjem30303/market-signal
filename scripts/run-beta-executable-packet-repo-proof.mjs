import { spawnSync } from "node:child_process";

const commands = [
  {
    command: ["git", "branch", "--show-current"],
    name: "git-branch"
  },
  {
    command: ["git", "rev-parse", "--short", "HEAD"],
    name: "git-commit"
  },
  {
    command: ["git", "status", "--short"],
    name: "git-status"
  },
  {
    command: ["cmd.exe", "/c", "npm", "run", "check:beta-runtime-fast-health"],
    name: "beta-runtime-fast-health"
  },
  {
    command: ["cmd.exe", "/c", "npm", "run", "check:public-route-loop"],
    name: "public-route-loop"
  },
  {
    command: ["cmd.exe", "/c", "npx", "tsc", "--noEmit"],
    name: "typescript"
  }
];

const results = commands.map(runCommand);
const failed = results.filter((result) => result.exitCode !== 0 || result.timedOut);
const gitStatus = results.find((result) => result.name === "git-status")?.stdout ?? "";
const worktreeState = gitStatus.trim().length === 0 ? "clean" : "needs_pm_review_before_packet_creation";

const result = {
  status: failed.length === 0 ? "ok" : "blocked",
  guardedStatus: "beta_executable_packet_repo_proof_runner_gate_ready",
  outcome: "repo_proof_runner_ready_packet_still_blocked_external_platform_values_pending",
  packetCandidateAllowed: false,
  blocker: "platform_generated_values_pending",
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  worktreeState,
  notes: [
    "Repo proof is refreshed locally.",
    "Executable packet remains blocked until hosting project name and temporary Beta URL exist.",
    "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
  ],
  results: results.map((item) => ({
    exitCode: item.exitCode,
    name: item.name,
    timedOut: item.timedOut,
    stdout: item.name.startsWith("git-") ? item.stdout : summarizeStdout(item.stdout)
  }))
};

console.log(JSON.stringify(result, null, 2));

if (failed.length > 0) {
  process.exitCode = 1;
}

function runCommand(item) {
  const result = spawnSync(item.command[0], item.command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout: 120000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    name: item.name,
    stderr: (result.stderr ?? "").trim(),
    stdout: (result.stdout ?? "").trim(),
    timedOut: result.error?.code === "ETIMEDOUT"
  };
}

function summarizeStdout(stdout) {
  const trimmed = stdout.trim();
  if (!trimmed) return "";

  try {
    const parsed = JSON.parse(trimmed.slice(trimmed.indexOf("{")));
    return JSON.stringify({
      status: parsed.status,
      guardedStatus: parsed.guardedStatus,
      outcome: parsed.outcome
    });
  } catch {
    return trimmed.split(/\r?\n/u).slice(-3).join("\n");
  }
}
