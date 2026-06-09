import fs from "node:fs";
import { spawnSync } from "node:child_process";

const betaValues = run(["cmd.exe", "/c", "npm", "run", "validate:beta-platform-two-values"], withoutBetaValuesIfUnset());
const validator = parseJson(betaValues.stdout);
const sourceLedger = readJson("data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json", { outcomes: [] });
const acceptedReviewedArtifact = findAcceptedReviewedArtifact();
const postReplyOneRunnerCommand = "cmd.exe /c npm run run:public-beta-post-reply-route-once";

const platformStatus = validator?.status ?? "validator_output_unreadable";
const sourceSummary = summarizeSourceLedger(sourceLedger);
const nextAction = chooseNextAction(platformStatus, acceptedReviewedArtifact, sourceSummary);

const report = {
  status: nextAction.status,
  ok: true,
  ceoDecision: "route_beta_launch_next_action_by_current_gate_state",
  pmMainlineNextAction: nextAction.pmMainlineNextAction,
  pmCommand: nextAction.pmCommand,
  a1NextAction: sourceSummary.canOpenTwiiRightsGate
    ? "prepare_separate_twii_source_rights_outcome_gate_candidate"
    : "collect_a1_twii_four_slot_no_secret_evidence_then_response_readiness_and_pm_classify",
  a1Command: sourceSummary.canOpenTwiiRightsGate
    ? "cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route"
    : "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
  a2NextAction:
    "keep_public_beta_trust_copy_stable_and_only_patch_launch_blocking_copy_if_runtime_surface_changes",
  currentState: {
    platformValues: {
      status: platformStatus,
      hostingProjectNameProvided: Boolean(validator?.values?.hostingProjectNameProvided),
      temporaryBetaUrlProvided: Boolean(validator?.values?.temporaryBetaUrlProvided),
      valuesAreNotPrinted: true
    },
    reviewedArtifact: {
      acceptedArtifactExists: acceptedReviewedArtifact.exists,
      latestAcceptedArtifactPath: acceptedReviewedArtifact.path
    },
    a1TwiiFourSlotEvidence: sourceSummary,
    runtimeBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    }
  },
  stopLines: [
    "No deployment is authorized by this report.",
    "No SQL is executed by this report.",
    "No Supabase connection or write is executed by this report.",
    "No staging rows or daily_prices rows are created or modified by this report.",
    "No raw market data is fetched, stored, ingested, or committed by this report.",
    "No secrets, raw payloads, row payloads, or stock id payloads are printed by this report.",
    "publicDataSource remains mock and scoreSource remains mock."
  ],
  notes: [
    "This report is a routing report, not a deployment packet and not a data-source promotion gate.",
    "When platform values or A1 TWII evidence are missing, PM should use the single external-input request instead of reopening broad deployment planning.",
    "A1 source-rights work stays narrowed to the four TWII no-secret evidence slots while PM waits for the current external-input reply."
  ]
};

console.log(JSON.stringify(report, null, 2));

function chooseNextAction(platformStatus, acceptedArtifact, sourceSummary) {
  if (acceptedArtifact.exists) {
    return {
      status: "ready_to_render_pre_execution_packet_candidate",
      pmMainlineNextAction: "render_pre_execution_packet_candidate_from_accepted_reviewed_artifact",
      pmCommand: "cmd.exe /c npm run render:beta-pre-execution-packet-candidate"
    };
  }

  if (platformStatus === "accepted_two_value_shape_only") {
    return {
      status: "ready_to_run_public_beta_post_reply_one_runner",
      pmMainlineNextAction: "run_public_beta_post_reply_one_runner_then_record_reviewed_artifact_outcome_if_packet_review_reached",
      pmCommand: postReplyOneRunnerCommand
    };
  }

  if (platformStatus === "rejected_unsafe_values") {
    return {
      status: "blocked_unsafe_platform_values",
      pmMainlineNextAction: "request_corrected_safe_hosting_project_name_and_public_temporary_beta_url",
      pmCommand: "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
    };
  }

  return {
    status: sourceSummary.canOpenTwiiRightsGate
      ? "blocked_waiting_two_platform_values"
      : "blocked_waiting_external_input_response",
    pmMainlineNextAction: "use_single_external_input_request_for_platform_values_and_a1_evidence",
    pmCommand: "cmd.exe /c npm run report:public-beta-external-input-request"
  };
}

function summarizeSourceLedger(ledger) {
  const outcomes = Array.isArray(ledger.outcomes) ? ledger.outcomes : [];
  const twiiOutcomes = outcomes.filter((outcome) => outcome.lane === "TWII");
  const pending = twiiOutcomes.filter((outcome) => outcome.classification === "pending");
  const accepted = twiiOutcomes.filter((outcome) => outcome.classification === "accepted");
  const blocked = twiiOutcomes.filter((outcome) => outcome.classification === "blocked");
  const needsBoundedRepair = twiiOutcomes.filter((outcome) => outcome.classification === "needs_bounded_repair");
  const rejected = twiiOutcomes.filter((outcome) => outcome.classification === "rejected");
  const allAccepted = twiiOutcomes.length > 0 && accepted.length === twiiOutcomes.length;

  return {
    status: allAccepted ? "twii_four_slot_evidence_ready_for_gate_review" : "twii_four_slot_evidence_pending",
    pendingEvidenceCount: pending.length,
    acceptedEvidenceCount: accepted.length,
    blockedEvidenceCount: blocked.length,
    needsBoundedRepairEvidenceCount: needsBoundedRepair.length,
    rejectedEvidenceCount: rejected.length,
    requiredEvidenceCount: twiiOutcomes.length,
    pendingEvidenceIds: pending.map((outcome) => outcome.id),
    requiredEvidenceIds: twiiOutcomes.map((outcome) => outcome.id),
    nextCommand: allAccepted
      ? "cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route"
      : "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
    afterReplyFirstCommand: "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
    canOpenTwiiRightsGate: allAccepted
  };
}

function findAcceptedReviewedArtifact() {
  const dir = "docs/reviews";
  if (!fs.existsSync(dir)) return { exists: false, path: null };

  const files = fs
    .readdirSync(dir)
    .filter((name) => /^BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_.*\.md$/u.test(name))
    .map((name) => `${dir}/${name}`)
    .sort();

  for (const filePath of files.toReversed()) {
    const content = fs.readFileSync(filePath, "utf8");
    if (
      content.includes("reviewOutcome: `accepted`") ||
      content.includes("Review outcome: `accepted`") ||
      content.includes("outcome: `accepted`")
    ) {
      return { exists: true, path: filePath };
    }
  }

  return { exists: false, path: null };
}

function run(command, env) {
  return spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
    timeout: 120000,
    windowsHide: true
  });
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

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function withoutBetaValuesIfUnset() {
  return { ...process.env };
}
