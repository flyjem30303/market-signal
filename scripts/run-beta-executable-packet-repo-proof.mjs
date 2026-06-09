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
const gitLines = gitStatus.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
const pmSnapshot = buildPmSnapshot(gitLines);
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
  pmSnapshot,
  notes: [
    "Repo proof is refreshed locally.",
    "Executable packet remains blocked until hosting project name and temporary Beta URL exist.",
    "When Git backup is deferred, a classified no-Git PM snapshot can satisfy the worktree safeguard for the packet-window dry run.",
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

function buildPmSnapshot(lines) {
  const groups = classifyGitLines(lines);
  const unresolvedCount = groups.unrelatedOrNeedsPmDecision.length;
  const betaReadinessCount =
    groups.a1DataEvidenceSupport.length +
    groups.betaDeploymentAndPacketChain.length +
    groups.projectStatusAndTooling.length +
    groups.publicRuntimeAndTrustSurface.length;

  return {
    status:
      unresolvedCount === 0
        ? "classified_beta_readiness_worktree_safeguard_ready"
        : "unresolved_worktree_items_require_pm_classification",
    betaReadinessCount,
    excludedFromBetaLaunchPacketCount: groups.excludedFromBetaLaunchPacket.length,
    unresolvedCount,
    allowedAsNoGitSafeguard: unresolvedCount === 0,
    note:
      unresolvedCount === 0
        ? "All changed files are classified as current Beta readiness support or explicitly excluded from the Beta launch packet."
        : "Some changed files still need PM classification before packet-window dry run readiness."
  };
}

function classifyGitLines(lines) {
  const groups = {
    a1DataEvidenceSupport: [],
    betaDeploymentAndPacketChain: [],
    excludedFromBetaLaunchPacket: [],
    projectStatusAndTooling: [],
    publicRuntimeAndTrustSurface: [],
    unrelatedOrNeedsPmDecision: []
  };

  for (const line of lines) {
    const filePath = line.replace(/^(?:[ MADRCU?!]{1,2})\s+/u, "");
    if (filePath === "docs/PROJECT_STARTUP_DOC_TRACKING.md") {
      groups.excludedFromBetaLaunchPacket.push(line);
    } else if (
      /A1_TWII_EVIDENCE|a1-twii-evidence|a1-twii-four-slot|a1-twii-local-evidence|a1-twii-outcome-gate|a1-twii-pm-intake|a1-twii-post-reply|source-rights|SOURCE_RIGHTS/iu.test(
        filePath
      )
    ) {
      groups.a1DataEvidenceSupport.push(line);
    } else if (/BETA_|VERCEL_|beta-|vercel-|packet-window|platform-two-value|deployment-quickstart|pm-worktree-review-preflight/iu.test(filePath)) {
      groups.betaDeploymentAndPacketChain.push(line);
    } else if (/^(PROJECT_STATUS\.md|docs[\\/](RUNTIME_AUTONOMY_HANDOFF|LAUNCH_ENGINEERING_WORKSTREAM_BOARD|GOAL_PARALLEL_WORKSTREAM_ADJUSTMENT)\.md|package\.json|scripts[\\/](check-launch-engineering-workstream-board|check-goal-parallel-workstream-adjustment|check-runtime-autonomy-handoff|check-review-gates)\.mjs|scripts[\\/]recover-next-dev-server\.ps1)$/iu.test(filePath)) {
      groups.projectStatusAndTooling.push(line);
    } else if (
      /src[\\/]app[\\/]briefing[\\/]page\.tsx/iu.test(filePath) ||
      /src[\\/]components[\\/](home-runtime-status-panel|public-beta-launch-readiness-panel|stock-runtime-at-a-glance|trust-runtime-boundary-notice)\.tsx/iu.test(filePath) ||
      /src[\\/]lib[\\/](briefing-market-action-summary|public-beta-launch-readiness|runtime-product-summary)\.ts/iu.test(filePath) ||
      /src[\\/]app[\\/]globals\.css/iu.test(filePath) ||
      /a2-public-copy-readability-candidates/iu.test(filePath) ||
      /check-(briefing-market-action-summary|home-runtime-status-panel|public-beta-launch-readiness-panel|public-visible-language-quality|runtime-mock-disclosure-readability|stock-runtime-at-a-glance|trust-runtime-boundary-notice)/iu.test(filePath)
    ) {
      groups.publicRuntimeAndTrustSurface.push(line);
    } else {
      groups.unrelatedOrNeedsPmDecision.push(line);
    }
  }

  return groups;
}
