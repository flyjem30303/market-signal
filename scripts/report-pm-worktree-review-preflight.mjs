import { spawnSync } from "node:child_process";

const statusRun = run(["git", "status", "--short"]);
const repoProofRun = run(["cmd.exe", "/c", "npm", "run", "run:beta-executable-packet-repo-proof"]);
const gitLines = (statusRun.stdout ?? "").split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
const repoProof = parseJson(repoProofRun.stdout ?? "");
const groups = classifyGitLines(gitLines);

const hasChanges = gitLines.length > 0;
const untrackedCount = gitLines.filter((line) => line.startsWith("?? ")).length;
const modifiedCount = gitLines.length - untrackedCount;
const unrelated = groups.unrelatedOrNeedsPmDecision;
const excluded = groups.excludedFromBetaLaunchPacket;
const pmAcceptanceSummary = buildPmAcceptanceSummary(groups);

const report = {
  status: hasChanges ? "pm_review_required_before_packet_creation" : "clean_worktree_ready_for_packet_creation",
  ok: true,
  packetCandidateAllowed: !hasChanges,
  nextRoute: chooseNextRoute(hasChanges, pmAcceptanceSummary),
  worktree: {
    modifiedCount,
    totalChangedFiles: gitLines.length,
    untrackedCount,
    worktreeState: hasChanges ? "needs_pm_review_before_packet_creation" : "clean"
  },
  groups,
  pmAcceptanceSummary,
  pmDecisionSurface: buildPmDecisionSurface(groups.unrelatedOrNeedsPmDecision, excluded),
  repoProof: {
    exitCode: repoProofRun.exitCode,
    status: repoProof?.status ?? "unknown",
    worktreeState: repoProof?.worktreeState ?? "unknown"
  },
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  recommendations: [
    hasChanges && pmAcceptanceSummary.unresolvedCount === 0
      ? "PM can treat the current changed files as a coherent Beta readiness backup candidate before packet creation."
      : hasChanges
        ? "PM should review whether all changed files belong to the current Beta readiness slice before any packet candidate."
      : "PM may rerun the packet-window proof map when platform values are present.",
    unrelated.length > 0
      ? "Review unrelated or unclear files separately; do not include them in a launch packet without PM decision."
      : "No unresolved unrelated or unclear file path was detected by this local classifier.",
    excluded.length > 0
      ? "Excluded project-tracking files are retained in the worktree but are not launch packet blockers."
      : "No project-tracking file was excluded from the Beta launch packet by this classifier.",
    "Git backup or commit is a separate chairman/PM action; this report does not stage or commit files."
  ],
  stopLines: [
    "No git add, commit, push, reset, or checkout is executed by this report.",
    "No deployment is authorized by this report.",
    "No SQL is executed by this report.",
    "No Supabase connection, read, or write is executed by this report.",
    "No raw market data is fetched, stored, ingested, or committed by this report.",
    "publicDataSource remains mock and scoreSource remains mock."
  ]
};

console.log(JSON.stringify(report, null, 2));

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
    if (isExcludedFromBetaLaunchPacket(filePath)) {
      groups.excludedFromBetaLaunchPacket.push(line);
    } else if (isA1DataEvidenceSupport(filePath)) {
      groups.a1DataEvidenceSupport.push(line);
    } else if (isBetaDeploymentAndPacketChain(filePath)) {
      groups.betaDeploymentAndPacketChain.push(line);
    } else if (isProjectStatusAndTooling(filePath)) {
      groups.projectStatusAndTooling.push(line);
    } else if (isPublicRuntimeAndTrustSurface(filePath)) {
      groups.publicRuntimeAndTrustSurface.push(line);
    } else {
      groups.unrelatedOrNeedsPmDecision.push(line);
    }
  }

  return groups;
}

function chooseNextRoute(hasChanges, summary) {
  if (!hasChanges) return "rerun_packet_window_proof_map";
  if (summary.unresolvedCount === 0) return "pm_backs_up_current_beta_readiness_worktree_then_reruns_packet_window_proof_map";
  return "pm_reviews_unresolved_items_before_backup_or_packet_candidate";
}

function buildPmAcceptanceSummary(groups) {
  const betaReadinessGroups = [
    "a1DataEvidenceSupport",
    "betaDeploymentAndPacketChain",
    "projectStatusAndTooling",
    "publicRuntimeAndTrustSurface"
  ];
  const acceptedGroupCounts = Object.fromEntries(
    betaReadinessGroups.map((groupName) => [groupName, groups[groupName].length])
  );
  const acceptedCount = Object.values(acceptedGroupCounts).reduce((total, count) => total + count, 0);
  const excludedCount = groups.excludedFromBetaLaunchPacket.length;
  const unresolvedCount = groups.unrelatedOrNeedsPmDecision.length;

  return {
    recommendedPmOutcome: unresolvedCount === 0
      ? "accept_current_beta_readiness_worktree_for_backup_then_packet_candidate"
      : "hold_packet_candidate_until_unresolved_items_are_classified",
    acceptedForBetaReadinessBackupCount: acceptedCount,
    acceptedForBetaReadinessBackupGroups: acceptedGroupCounts,
    excludedFromBetaLaunchPacketCount: excludedCount,
    unresolvedCount,
    canProceedToBackupDecision: unresolvedCount === 0,
    canProceedToPacketCandidate: false,
    packetCandidateBlocker: unresolvedCount === 0
      ? "worktree_backup_or_pm_snapshot_still_required_before_packet_candidate"
      : "unresolved_worktree_items_still_require_pm_classification"
  };
}

function isExcludedFromBetaLaunchPacket(filePath) {
  return filePath === "docs/PROJECT_STARTUP_DOC_TRACKING.md";
}

function isA1DataEvidenceSupport(filePath) {
  return /A1_TWII_EVIDENCE|a1-twii-evidence|a1-twii-four-slot|a1-twii-local-evidence|a1-twii-outcome-gate|a1-twii-pm-intake|a1-twii-post-reply|source-rights|SOURCE_RIGHTS/iu.test(filePath);
}

function isBetaDeploymentAndPacketChain(filePath) {
  return /BETA_|VERCEL_|beta-|vercel-|packet-window|platform-two-value|deployment-quickstart|pm-worktree-review-preflight/iu.test(filePath);
}

function isProjectStatusAndTooling(filePath) {
  return /^(PROJECT_STATUS\.md|docs[\\/](RUNTIME_AUTONOMY_HANDOFF|LAUNCH_ENGINEERING_WORKSTREAM_BOARD|GOAL_PARALLEL_WORKSTREAM_ADJUSTMENT)\.md|package\.json|scripts[\\/](check-launch-engineering-workstream-board|check-goal-parallel-workstream-adjustment|check-runtime-autonomy-handoff|check-review-gates|recover-next-dev-server)\.mjs|scripts[\\/]recover-next-dev-server\.ps1)$/iu.test(filePath);
}

function buildPmDecisionSurface(items, excludedItems) {
  const excludedFromBetaLaunchPacket = excludedItems.map((line) => {
    const filePath = line.replace(/^(?:[ MADRCU?!]{1,2})\s+/u, "");
    return {
      filePath,
      gitStatusLine: line,
      reason: "project-governance-note-retained-outside-beta-launch-packet"
    };
  });

  if (items.length === 0) {
    return {
      decisionNeeded: false,
      recommendedDecision: excludedItems.length > 0
        ? "exclude_non_beta_packet_items_and_continue_pm_review"
        : "all_changed_files_fit_current_beta_readiness_scope",
      unresolvedItems: [],
      excludedFromBetaLaunchPacket
    };
  }

  return {
    decisionNeeded: true,
    recommendedDecision: "exclude_or_separately_accept_unrelated_or_unclear_items_before_packet_candidate",
    unresolvedItems: items.map((line) => {
      const filePath = line.replace(/^(?:[ MADRCU?!]{1,2})\s+/u, "");
      return {
        filePath,
        gitStatusLine: line,
        suggestedHandling: suggestHandling(filePath)
      };
    }),
    excludedFromBetaLaunchPacket
  };
}

function suggestHandling(filePath) {
  if (filePath === "docs/PROJECT_STARTUP_DOC_TRACKING.md") {
    return "project-governance-note; exclude from Beta launch packet unless PM explicitly accepts it as project tracking support";
  }

  return "requires PM classification before packet candidate";
}

function isPublicRuntimeAndTrustSurface(filePath) {
  return (
    /src[\\/]app[\\/]briefing[\\/]page\.tsx/iu.test(filePath) ||
    /src[\\/]components[\\/](home-runtime-status-panel|public-beta-launch-readiness-panel|stock-runtime-at-a-glance|trust-runtime-boundary-notice)\.tsx/iu.test(filePath) ||
    /src[\\/]lib[\\/](briefing-market-action-summary|public-beta-launch-readiness|runtime-product-summary)\.ts/iu.test(filePath) ||
    /src[\\/]app[\\/]globals\.css/iu.test(filePath) ||
    /a2-public-copy-readability-candidates/iu.test(filePath) ||
    /check-(briefing-market-action-summary|home-runtime-status-panel|public-beta-launch-readiness-panel|public-visible-language-quality|runtime-mock-disclosure-readability|stock-runtime-at-a-glance|trust-runtime-boundary-notice)/iu.test(filePath)
  );
}

function run(command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout: 180000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    stderr: (result.stderr ?? "").trim(),
    stdout: (result.stdout ?? "").trim()
  };
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  if (start < 0) return null;

  try {
    return JSON.parse(stdout.slice(start));
  } catch {
    return null;
  }
}
