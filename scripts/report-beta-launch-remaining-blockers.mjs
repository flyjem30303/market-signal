import { spawnSync } from "node:child_process";

const deployment = runJson(["cmd.exe", "/c", "npm", "run", "report:beta-deployment-quickstart"]);
const worktree = runJson(["cmd.exe", "/c", "npm", "run", "report:pm-worktree-review-preflight"]);
const a1Judgement = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-source-rights-reviewed-outcome-surface"]);
const a1PmIntakeDecisionSummary = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-twii-pm-intake-decision-summary"]);
const routeProof = runJson(["cmd.exe", "/c", "npm", "run", "check:public-beta-core-route-quick-proof"]);

const deploymentReport = deployment.json ?? {};
const worktreeReport = worktree.json ?? {};
const a1Report = a1Judgement.json ?? {};
const a1PmIntakeDecisionSummaryReport = a1PmIntakeDecisionSummary.json ?? {};
const routeProofReport = routeProof.json ?? {};

const blockers = [
  buildWorktreeSnapshotBlocker(worktreeReport),
  buildPlatformValuesBlocker(deploymentReport),
  buildA1EvidenceBlocker(a1Report, a1PmIntakeDecisionSummaryReport)
];
const openBlockers = blockers.filter((blocker) => blocker.status === "blocked");

const report = {
  status: openBlockers.length > 0 ? "blocked_waiting_two_public_beta_inputs" : "ready_for_beta_packet_window_proof_map",
  ok: true,
  mode: "public_beta_remaining_blockers_one_page",
  ceoDecision: "treat_git_snapshot_as_safeguard_not_public_beta_input",
  completionFocus: "public_beta_pre_launch_executable_state",
  summary: {
    blockerCount: openBlockers.length,
    readyCount: blockers.length - openBlockers.length,
    totalBlockers: blockers.length,
    nextBestAction: chooseNextBestAction(blockers)
  },
  afterPlatformValuesProofPath: buildAfterPlatformValuesProofPath(),
  postReplyOneRunnerProof: buildPostReplyOneRunnerProof(),
  blockers,
  a1PmIntakeDecisionSummary: buildA1PmIntakeDecisionSummary(a1PmIntakeDecisionSummaryReport),
  runtimeReadyEvidence: {
    routeProofStatus: routeProofReport.status ?? "unknown",
    routeCount: Array.isArray(routeProofReport.checked?.routes) ? routeProofReport.checked.routes.length : 0,
    allRoutesHttp200: Array.isArray(routeProofReport.checked?.routes)
      ? routeProofReport.checked.routes.every((route) => route.statusCode === 200)
      : false,
    publicDataSource: routeProofReport.runtimeBoundary?.publicDataSource ?? "mock",
    scoreSource: routeProofReport.runtimeBoundary?.scoreSource ?? "mock"
  },
  nextCommands: [
    "cmd.exe /c npm run report:pm-worktree-review-preflight",
    "cmd.exe /c npm run report:public-beta-external-input-request",
    "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface",
    "cmd.exe /c npm run report:beta-mainline-current-route"
  ],
  stopLines: [
    "No git add, commit, push, reset, or checkout is executed by this report.",
    "No deployment is authorized by this report.",
    "No hosting resource is created or mutated by this report.",
    "No platform environment value is printed by this report.",
    "No SQL is executed by this report.",
    "No Supabase connection, read, or write is executed by this report.",
    "No staging rows or daily_prices rows are created or modified by this report.",
    "No raw market data is fetched, stored, ingested, or committed by this report.",
    "No secrets, raw payloads, row payloads, or stock id payloads are printed by this report.",
    "publicDataSource remains mock and scoreSource remains mock."
  ],
  sourceReports: {
    betaDeploymentQuickstart: commandStatus(deployment),
    pmWorktreeReviewPreflight: commandStatus(worktree),
    a1SourceRightsReviewedOutcomeSurface: commandStatus(a1Judgement),
    a1TwiiPmIntakeDecisionSummary: commandStatus(a1PmIntakeDecisionSummary),
    publicBetaCoreRouteQuickProof: commandStatus(routeProof)
  }
};

console.log(JSON.stringify(report, null, 2));

function buildWorktreeSnapshotBlocker(worktreeReport) {
  const summary = worktreeReport.pmAcceptanceSummary ?? {};
  const canProceedToBackupDecision = summary.canProceedToBackupDecision === true;
  const packetCandidateAllowed = worktreeReport.packetCandidateAllowed === true;
  const worktreeIsClassified = canProceedToBackupDecision && Number(summary.unresolvedCount ?? 0) === 0;
  return {
    id: "pm_git_snapshot_or_backup",
    label: "PM/Git snapshot safeguard",
    status: packetCandidateAllowed || worktreeIsClassified ? "ready" : "safeguard_deferred",
    currentState: {
      acceptedForBetaReadinessBackupCount: Number(summary.acceptedForBetaReadinessBackupCount ?? 0),
      excludedFromBetaLaunchPacketCount: Number(summary.excludedFromBetaLaunchPacketCount ?? 0),
      unresolvedCount: Number(summary.unresolvedCount ?? 0),
      worktreeState: worktreeReport.worktree?.worktreeState ?? "unknown",
      hardBlocker: false
    },
    requiredInput: worktreeIsClassified
      ? "No required public Beta input; Git backup remains a recommended safeguard, not a hard blocker."
      : canProceedToBackupDecision
        ? "PM/Git snapshot or backup decision for the coherent Beta readiness worktree."
        : "Git snapshot remains deferred while public Beta hard blockers are handled.",
    nextCommand: "cmd.exe /c npm run report:pm-worktree-review-preflight",
    canMoveWithoutUserInput: true
  };
}

function buildPlatformValuesBlocker(deploymentReport) {
  const missing = deploymentReport.pmNow?.missingPlatformValues ?? [];
  return {
    id: "beta_platform_two_values",
    label: "Beta platform values",
    status: missing.length === 0 ? "ready" : "blocked",
    currentState: {
      missingValues: missing,
      operatorShortcutMode: deploymentReport.operatorShortcut?.mode ?? "unknown",
      valuesAreNotPrinted: deploymentReport.currentEvidence?.platformValues?.valuesAreNotPrinted === true
    },
    requiredInput: missing.length === 0
      ? "Two shape-safe platform values are present."
      : "Operator replies with only BETA_HOSTING_PROJECT_NAME and BETA_TEMPORARY_URL.",
    nextCommand: "cmd.exe /c npm run report:public-beta-external-input-request",
    canMoveWithoutUserInput: false
  };
}

function buildA1EvidenceBlocker(a1Report, a1PmIntakeDecisionSummaryReport) {
  const judgement = a1Report.judgementSummary ?? {};
  const pending = Number(
    a1PmIntakeDecisionSummaryReport.currentState?.pendingCount ??
    judgement.counts?.pending ??
    a1Report.pendingCount ??
    0
  );
  const canOpenOutcomeGate =
    a1PmIntakeDecisionSummaryReport.currentState?.canOpenTwiiOutcomeGate === true ||
    judgement.canOpenOutcomeGate === true;
  return {
    id: "a1_twii_four_slot_evidence",
    label: "A1 TWII evidence",
    status: canOpenOutcomeGate ? "ready" : "blocked",
    currentState: {
      pending,
      acceptedCount: Number(a1PmIntakeDecisionSummaryReport.currentState?.acceptedCount ?? 0),
      boundedRepairRequestCount: Number(a1PmIntakeDecisionSummaryReport.boundedRepairIntake?.repairRequestCount ?? 0),
      canOpenOutcomeGate,
      currentDecision:
        a1PmIntakeDecisionSummaryReport.currentDecision ??
        judgement.nextPmAction ??
        "request_a1_bounded_no_secret_repairs_before_pm_classification",
      slotIds: Array.isArray(a1PmIntakeDecisionSummaryReport.currentState?.pendingSlotIds)
        ? a1PmIntakeDecisionSummaryReport.currentState.pendingSlotIds
        : Array.isArray(judgement.slots)
          ? judgement.slots.map((slot) => slot.id)
          : []
    },
    requiredInput: canOpenOutcomeGate
      ? "All four TWII evidence slots are accepted enough for a separate outcome gate candidate."
      : "A1 returns the bounded no-secret repair fields for vendor terms, internal owner, field contract, and asset mapping.",
    nextCommand: "cmd.exe /c npm run report:a1-twii-pm-intake-decision-summary",
    canMoveWithoutUserInput: false
  };
}

function buildA1PmIntakeDecisionSummary(report) {
  return {
    status: report.status ?? "unknown",
    currentDecision:
      report.currentDecision ??
      "request_a1_bounded_no_secret_repairs_before_pm_classification",
    pendingCount: Number(report.currentState?.pendingCount ?? 4),
    acceptedCount: Number(report.currentState?.acceptedCount ?? 0),
    canOpenTwiiOutcomeGate: report.currentState?.canOpenTwiiOutcomeGate === true,
    repairRequestCount: Number(report.boundedRepairIntake?.repairRequestCount ?? 0),
    boundedRepairCommand:
      report.boundedRepairIntake?.command ??
      "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request",
    postReplyOneRunnerCommand:
      report.pmClassificationAfterA1Reply?.oneRunnerCommand ??
      "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once"
  };
}

function chooseNextBestAction(blockers) {
  const platform = blockers.find((blocker) => blocker.id === "beta_platform_two_values");
  const a1 = blockers.find((blocker) => blocker.id === "a1_twii_four_slot_evidence");

  if (platform?.status === "blocked") return "collect_two_safe_beta_platform_values";
  if (a1?.status === "blocked") return "collect_a1_twii_four_slot_no_secret_evidence";
  return "run_beta_packet_window_proof_map";
}

function buildAfterPlatformValuesProofPath() {
  const gitSafeguardBlocksPublicBeta = false;

  return {
    status: gitSafeguardBlocksPublicBeta === false
      ? "ready_after_two_safe_platform_values"
      : "needs_local_recheck_before_packet_window",
    nextCommands: [
      "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
      "cmd.exe /c npm run run:public-beta-post-reply-route-once",
      "cmd.exe /c npm run report:beta-mainline-current-route"
    ],
    expectedProofMapOutcomeWithSafeValues: "reviewed_artifact_template_ready_pending_pm_review",
    currentLimiter: "platform_values_pending",
    repoSafeguardReady: false,
    gitSafeguardBlocksPublicBeta,
    hardBlocker: false,
    publicDataSource: "mock",
    scoreSource: "mock"
  };
}

function buildPostReplyOneRunnerProof() {
  return {
    status: "focused_gate_registered_lightweight_proof_summary",
    focusedGateName: "public-beta-post-reply-route-once",
    proofCommand: "cmd.exe /c npm run check:public-beta-post-reply-route-once",
    routineRunnerCommand: "cmd.exe /c npm run run:public-beta-post-reply-route-once",
    safePlatformFixtureScenario: {
      expectedStatus: "public_beta_post_reply_route_ready_for_packet_review_a1_pending",
      expectedStepIds: [
        "external-input-response-readiness",
        "platform-two-value-proof-map-once"
      ],
      expectedPacketReviewCommand:
        "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --dry-run"
    },
    ledgerModified: false,
    valuesAreFixtureOnly: true,
    safety: {
      deploymentAuthorized: false,
      deploymentExecuted: false,
      evidenceRecorded: false,
      hostingMutated: false,
      marketDataFetched: false,
      packetArtifactWritten: false,
      rowCoverageAwarded: false,
      scoreSourceRealEnabled: false,
      secretsPrinted: false,
      sourceRightsApproved: false,
      sqlExecuted: false,
      supabaseReadsEnabled: false,
      supabaseWritesEnabled: false,
      valuesStored: false
    },
    runtimeBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    }
  };
}

function runJson(command, extraEnv = {}) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, ...extraEnv },
    timeout: 420000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    json: parseJson(result.stdout ?? ""),
    stderr: (result.stderr ?? "").trim()
  };
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

function commandStatus(run) {
  return {
    exitCode: run.exitCode,
    parsedJson: Boolean(run.json),
    stderrPrinted: run.stderr.length > 0
  };
}
