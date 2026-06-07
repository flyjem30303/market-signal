import { spawnSync } from "node:child_process";
import fs from "node:fs";

const validator = runJson(["cmd.exe", "/c", "npm", "run", "validate:beta-platform-two-values"]);
const nextAction = runJson(["cmd.exe", "/c", "npm", "run", "report:beta-launch-next-action"]);
const repoProof = runJson(["cmd.exe", "/c", "npm", "run", "run:beta-executable-packet-repo-proof"]);
const sourceLedger = readJson("data/source-gates/twii-vendor-internal-evidence-outcomes.json", { outcomes: [] });

const platformStatus = validator.json?.status ?? "validator_output_unreadable";
const missingValues = [
  validator.json?.values?.hostingProjectNameProvided ? null : "BETA_HOSTING_PROJECT_NAME",
  validator.json?.values?.temporaryBetaUrlProvided ? null : "BETA_TEMPORARY_URL"
].filter(Boolean);
const sourceSummary = summarizeSourceLedger(sourceLedger);
const readyToRunProofMap = platformStatus === "accepted_two_value_shape_only";

const report = {
  status: readyToRunProofMap ? "beta_platform_values_ready_for_packet_window" : "blocked_waiting_two_platform_values",
  ok: true,
  ceoDecision: "keep_beta_mainline_waiting_only_for_two_safe_platform_values",
  pmMainline: {
    currentRoute: readyToRunProofMap ? "run_packet_window_proof_map" : "obtain_two_safe_platform_values",
    nextCommand: readyToRunProofMap
      ? "cmd.exe /c npm run run:beta-packet-window-proof-map"
      : "cmd.exe /c npm run validate:beta-platform-two-values",
    afterValuesCommand: "cmd.exe /c npm run run:beta-packet-window-proof-map",
    afterProofMapCommand:
      "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --outcome accepted --reviewedBy PM --note \"PM accepts the no-secret packet-window proof map for pre-execution packet preparation only\" --apply"
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
      "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-slug>",
      "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"
    ],
    safeShapeReminder: [
      "Project name: lowercase letters, numbers, and hyphens only; no URL, dashboard word, token, secret, key, password, or invite.",
      "Temporary URL: public https URL only; no query, hash, username, password, localhost, dashboard host, Supabase host, or private preview token."
    ],
    nextValidationCommand: "cmd.exe /c npm run validate:beta-platform-two-values",
    valuesAreNotStoredInRepo: true
  },
  proofReadiness: {
    repoProofStatus: repoProof.json?.status ?? "repo_proof_output_unreadable",
    packetCandidateAllowed: Boolean(repoProof.json?.packetCandidateAllowed),
    blocker: repoProof.json?.blocker ?? null,
    worktreeState: repoProof.json?.worktreeState ?? null,
    currentCommit: repoProof.json?.results?.find((item) => item.name === "git-commit")?.stdout ?? null
  },
  reviewedArtifact: nextAction.json?.currentState?.reviewedArtifact ?? {
    acceptedArtifactExists: false,
    latestAcceptedArtifactPath: null
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
    timeout: 180000,
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
