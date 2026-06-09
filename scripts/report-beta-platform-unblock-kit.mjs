import { spawnSync } from "node:child_process";
import fs from "node:fs";

const validator = runJson(["cmd.exe", "/c", "npm", "run", "validate:beta-platform-two-values"]);
const quickstart = runJson(["cmd.exe", "/c", "npm", "run", "report:beta-deployment-quickstart"]);
const routePreview = runJson(["cmd.exe", "/c", "npm", "run", "report:beta-platform-values-route-preview"]);
const pmWorktreeReview = runJson(["cmd.exe", "/c", "npm", "run", "report:pm-worktree-review-preflight"]);
const sourceLedger = readJson("data/source-gates/twii-vendor-internal-evidence-outcomes.json", { outcomes: [] });

const platformStatus = validator.json?.status ?? "validator_output_unreadable";
const missingValues = [
  validator.json?.values?.hostingProjectNameProvided ? null : "BETA_HOSTING_PROJECT_NAME",
  validator.json?.values?.temporaryBetaUrlProvided ? null : "BETA_TEMPORARY_URL"
].filter(Boolean);
const sourceSummary = summarizeSourceLedger(sourceLedger);
const readyToRunProofMap = platformStatus === "accepted_two_value_shape_only";
const pmSafeguardReady = pmWorktreeReview.json?.pmAcceptanceSummary?.unresolvedCount === 0;
const pmPacketCandidateBlocker =
  pmWorktreeReview.json?.pmAcceptanceSummary?.packetCandidateBlocker ??
  routePreview.json?.proofMap?.repoProofWorktreeState ??
  "needs_pm_review_before_packet_creation";
const pmWorktreeState = pmSafeguardReady
  ? "classified_beta_readiness_worktree_safeguard_ready_continue_to_platform_values"
  : (pmWorktreeReview.json?.worktree?.worktreeState ?? routePreview.json?.proofMap?.repoProofWorktreeState ?? "needs_pm_review_before_packet_creation");
const postReplyOneRunnerCommand = "cmd.exe /c npm run run:public-beta-post-reply-route-once";
const responseReadinessCommand = "cmd.exe /c npm run report:public-beta-external-input-response-readiness";
const acceptedReviewedArtifact = findAcceptedReviewedArtifact();

const report = {
  status: readyToRunProofMap ? "beta_platform_values_ready_for_packet_window" : "blocked_waiting_two_platform_values",
  ok: true,
  ceoDecision: "keep_beta_mainline_waiting_only_for_two_safe_platform_values_then_post_reply_one_runner",
  pmMainline: {
    currentRoute: readyToRunProofMap
      ? "run_public_beta_post_reply_one_runner"
      : "use_single_external_input_request_for_platform_values_and_a1_evidence",
    nextCommand: readyToRunProofMap
      ? postReplyOneRunnerCommand
      : "cmd.exe /c npm run report:public-beta-external-input-request",
    afterCurrentCommand: readyToRunProofMap
      ? "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --dry-run --outcome accepted --reviewedBy PM --note \"PM dry-run verifies the no-secret packet-window reviewed artifact before any apply decision.\""
      : responseReadinessCommand,
    afterValuesCommand: postReplyOneRunnerCommand,
    afterProofMapCommand:
      "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --dry-run --outcome accepted --reviewedBy PM --note \"PM dry-run verifies the no-secret packet-window reviewed artifact before any apply decision.\"",
    manualDecisionReports: [
      "cmd.exe /c npm run report:beta-mainline-current-route",
      "cmd.exe /c npm run report:beta-pre-execution-packet-readiness"
    ]
  },
  platformValues: {
    missingValues,
    status: platformStatus,
    hostingProjectNameProvided: Boolean(validator.json?.values?.hostingProjectNameProvided),
    temporaryBetaUrlProvided: Boolean(validator.json?.values?.temporaryBetaUrlProvided),
    valuesAreNotPrinted: true,
    acceptedShapeOnly: readyToRunProofMap
  },
  operatorHandoff: {
    mode: "placeholder_only_no_values_printed",
    replyTemplate: [
      "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>",
      "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"
    ],
    safeShapeReminder: [
      "Project name: lowercase letters, numbers, and hyphens only; no URL, dashboard word, token, secret, key, password, or invite.",
      "Temporary URL: public https URL only; no query, hash, username, password, localhost, dashboard host, Supabase host, or private preview token."
    ],
    nextResponseReadinessCommand: responseReadinessCommand,
    postReplyOnceRunnerCommand: postReplyOneRunnerCommand,
    valuesAreNotStoredInRepo: true
  },
  proofReadiness: {
    packetProofMapCommand: "cmd.exe /c npm run run:beta-packet-window-proof-map",
    platformOnceRunnerCommand: "cmd.exe /c npm run run:beta-platform-two-value-proof-map-once",
    diagnosticValidationCommand: "cmd.exe /c npm run validate:beta-platform-two-values",
    diagnosticOnly: "standalone_validator_and_proof_map_are_for_failed_runner_debugging_not_pm_routine_next_step",
    routePreviewStatus: routePreview.json?.status ?? "route_preview_output_unreadable",
    repoProofStatus: pmSafeguardReady ? "repo_safeguard_ready_platform_values_pending" : (routePreview.json?.proofMap?.status ?? "repo_proof_blocked"),
    packetCandidateAllowed: Boolean(routePreview.json?.proofMap?.packetCandidateAllowed),
    blocker: pmSafeguardReady ? "platform_values_pending" : pmPacketCandidateBlocker,
    worktreeState: pmWorktreeState,
    safeguardReady: pmSafeguardReady,
    unresolvedWorktreeItems: pmWorktreeReview.json?.pmAcceptanceSummary?.unresolvedCount ?? null,
    currentCommit: null
  },
  quickstart: {
    status: quickstart.json?.guardedStatus ?? "quickstart_output_unreadable",
    pmCommand: quickstart.json?.pmNow?.command ?? "cmd.exe /c npm run report:public-beta-external-input-request",
    nextExecutableStep: quickstart.json?.nextExecutableStep ?? null,
    intakeCommand: quickstart.json?.pmNow?.intakeCommand ?? "cmd.exe /c npm run report:beta-platform-two-value-intake-command"
  },
  reviewedArtifact: {
    acceptedArtifactExists: acceptedReviewedArtifact.exists,
    latestAcceptedArtifactPath: acceptedReviewedArtifact.path,
    decisionRoute: acceptedReviewedArtifact.exists
      ? "render_pre_execution_packet_candidate_from_accepted_reviewed_artifact"
      : "record_after_no_secret_platform_once_runner_reaches_review_template"
  },
  parallelLanes: {
    a1: sourceSummary.canOpenTwiiRightsGate
      ? "prepare_twii_source_rights_outcome_gate"
      : "continue_twii_vendor_internal_evidence_or_etf_source_rights_fallback",
    a2: "keep_public_beta_trust_copy_stable_and_patch_only_launch_blocking_copy_if_runtime_surface_changes",
    i: "provide_only_plain_hosting_project_name_and_public_temporary_beta_url"
  },
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  stopLines: [
    "No deployment is authorized.",
    "No hosting resource is created or mutated.",
    "No platform environment value is printed.",
    "No SQL is executed.",
    "No Supabase connection or write is executed.",
    "No staging rows or daily_prices rows are created or modified.",
    "No raw market data is fetched, stored, ingested, or committed.",
    "No secrets, raw payloads, row payloads, or stock id payloads are printed.",
    "publicDataSource remains mock and scoreSource remains mock."
  ]
};

console.log(JSON.stringify(report, null, 2));

function runJson(command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: process.env,
    timeout: 60000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    json: parseJson(result.stdout ?? ""),
    stderr: (result.stderr ?? "").trim(),
    stdout: (result.stdout ?? "").trim()
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

function findAcceptedReviewedArtifact() {
  const dir = "docs/reviews";
  if (!fs.existsSync(dir)) return { exists: false, path: null };

  const files = fs
    .readdirSync(dir)
    .filter((name) => /^BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_\d{4}-\d{2}-\d{2}(?:_\d{2})?\.md$/u.test(name))
    .map((name) => `${dir}/${name}`)
    .sort();

  for (const filePath of files.toReversed()) {
    const content = fs.readFileSync(filePath, "utf8");
    if (isAcceptedReviewedArtifact(content)) return { exists: true, path: filePath };
  }

  return { exists: false, path: null };
}

function isAcceptedReviewedArtifact(content) {
  return [
    "Status: `accepted`",
    "- Outcome: `accepted`",
    "reviewOutcome: `accepted`",
    "Review outcome: `accepted`",
    "outcome: `accepted`"
  ].some((phrase) => content.includes(phrase));
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function summarizeSourceLedger(ledger) {
  const outcomes = Array.isArray(ledger.outcomes) ? ledger.outcomes : [];
  const pending = outcomes.filter((outcome) => outcome.classification === "pending");
  const accepted = outcomes.filter((outcome) => outcome.classification === "accepted");

  return {
    acceptedEvidenceCount: accepted.length,
    canOpenTwiiRightsGate: pending.length === 0 && outcomes.length > 0,
    pendingEvidenceCount: pending.length,
    requiredEvidenceCount: outcomes.length
  };
}
