import fs from "node:fs";
import { spawnSync } from "node:child_process";

const betaValues = run(["cmd.exe", "/c", "npm", "run", "validate:beta-platform-two-values"], withoutBetaValuesIfUnset());
const validator = parseJson(betaValues.stdout);
const sourceLedger = readJson("data/source-gates/twii-vendor-internal-evidence-outcomes.json", { outcomes: [] });
const acceptedReviewedArtifact = findAcceptedReviewedArtifact();

const platformStatus = validator?.status ?? "validator_output_unreadable";
const sourceSummary = summarizeSourceLedger(sourceLedger);
const nextAction = chooseNextAction(platformStatus, acceptedReviewedArtifact);

const report = {
  status: nextAction.status,
  ok: true,
  ceoDecision: "route_beta_launch_next_action_by_current_gate_state",
  pmMainlineNextAction: nextAction.pmMainlineNextAction,
  pmCommand: nextAction.pmCommand,
  a1NextAction: sourceSummary.canOpenTwiiRightsGate
    ? "prepare_twii_source_rights_outcome_gate"
    : "continue_twii_vendor_internal_evidence_collection_or_etf_source_rights_fallback",
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
    twiiSourceRights: sourceSummary,
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
    "When platform values are missing, PM should not reopen broad deployment planning; only the two safe values are needed.",
    "A1 source-rights work can continue in parallel while PM waits for platform values."
  ]
};

console.log(JSON.stringify(report, null, 2));

function chooseNextAction(platformStatus, acceptedArtifact) {
  if (acceptedArtifact.exists) {
    return {
      status: "ready_to_render_pre_execution_packet_candidate",
      pmMainlineNextAction: "render_pre_execution_packet_candidate_from_accepted_reviewed_artifact",
      pmCommand: "cmd.exe /c npm run render:beta-pre-execution-packet-candidate"
    };
  }

  if (platformStatus === "accepted_two_value_shape_only") {
    return {
      status: "ready_to_run_beta_packet_window_proof_map",
      pmMainlineNextAction: "run_beta_packet_window_proof_map_then_record_reviewed_artifact_outcome",
      pmCommand: "cmd.exe /c npm run run:beta-packet-window-proof-map"
    };
  }

  if (platformStatus === "rejected_unsafe_values") {
    return {
      status: "blocked_unsafe_platform_values",
      pmMainlineNextAction: "request_corrected_safe_hosting_project_name_and_public_temporary_beta_url",
      pmCommand: "cmd.exe /c npm run validate:beta-platform-two-values"
    };
  }

  return {
    status: "blocked_waiting_two_platform_values",
    pmMainlineNextAction: "obtain_only_BETA_HOSTING_PROJECT_NAME_and_BETA_TEMPORARY_URL",
    pmCommand: "cmd.exe /c npm run validate:beta-platform-two-values"
  };
}

function summarizeSourceLedger(ledger) {
  const outcomes = Array.isArray(ledger.outcomes) ? ledger.outcomes : [];
  const pending = outcomes.filter((outcome) => outcome.classification === "pending");
  const accepted = outcomes.filter((outcome) => outcome.classification === "accepted");

  return {
    status: pending.length === 0 && outcomes.length > 0 ? "evidence_ready_for_gate_review" : "evidence_pending",
    pendingEvidenceCount: pending.length,
    acceptedEvidenceCount: accepted.length,
    requiredEvidenceCount: outcomes.length,
    pendingEvidenceIds: pending.map((outcome) => outcome.id),
    canOpenTwiiRightsGate: pending.length === 0 && outcomes.length > 0
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
