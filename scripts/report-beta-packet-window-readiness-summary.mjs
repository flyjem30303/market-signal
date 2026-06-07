import { spawnSync } from "node:child_process";

const validator = runJson(["cmd.exe", "/c", "npm", "run", "validate:beta-platform-two-values"]);
const proofMap = runJson(["cmd.exe", "/c", "npm", "run", "run:beta-packet-window-proof-map"]);

const validatorReport = validator.json ?? {};
const proofMapReport = proofMap.json ?? {};
const status = classifyReadiness(validatorReport, proofMapReport);

console.log(
  JSON.stringify(
    {
      mode: "beta_packet_window_readiness_summary",
      status,
      ok: status === "ready_for_pm_reviewed_artifact_record",
      ceoDecision: "summarize_packet_window_readiness_without_deployment_or_artifact_creation",
      pmNextCommand: nextCommandFor(status),
      validator: {
        status: validatorReport.status ?? "unknown",
        packetCandidateAllowed: Boolean(validatorReport.packetCandidateAllowed),
        hostingProjectNameProvided: Boolean(validatorReport.values?.hostingProjectNameProvided),
        temporaryBetaUrlProvided: Boolean(validatorReport.values?.temporaryBetaUrlProvided),
        valuesAreNotPrinted: true
      },
      proofMap: {
        status: proofMapReport.status ?? "unknown",
        stoppedAt: proofMapReport.stoppedAt ?? null,
        deploymentAuthorized: Boolean(proofMapReport.deploymentAuthorized),
        nextRoute: proofMapReport.nextRoute ?? "unknown",
        stepCount: Array.isArray(proofMapReport.steps) ? proofMapReport.steps.length : 0
      },
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      safety: {
        artifactCreated: false,
        deploymentAuthorized: false,
        deploymentExecuted: false,
        hostingResourceMutated: false,
        marketDataFetched: false,
        platformEnvMutated: false,
        publicSourcePromoted: false,
        reviewedArtifactAccepted: false,
        scoreSourceRealEnabled: false,
        secretsPrinted: false,
        sqlExecuted: false,
        supabaseConnected: false,
        supabaseWritten: false
      },
      sourceReports: {
        validator: commandStatus(validator),
        proofMap: commandStatus(proofMap)
      },
      stopLines: [
        "No deployment is authorized by this report.",
        "No hosting resource is created or mutated by this report.",
        "No platform environment value is printed by this report.",
        "No reviewed artifact is created or accepted by this report.",
        "No SQL is executed by this report.",
        "No Supabase connection, read, or write is executed by this report.",
        "No staging rows or daily_prices rows are created or modified by this report.",
        "No raw market data is fetched, stored, ingested, or committed by this report.",
        "No secrets, raw payloads, row payloads, or stock id payloads are printed by this report.",
        "publicDataSource remains mock and scoreSource remains mock."
      ]
    },
    null,
    2
  )
);

function classifyReadiness(validatorReport, proofMapReport) {
  if (validatorReport.status === "blocked_waiting_values") return "blocked_waiting_two_platform_values";
  if (validatorReport.status === "rejected_unsafe_values") return "blocked_unsafe_platform_values";
  if (proofMapReport.status === "reviewed_artifact_template_ready_pending_pm_review") {
    return "ready_for_pm_reviewed_artifact_record";
  }
  if (proofMapReport.status === "repo_proof_blocked") return "blocked_repo_proof";
  if (proofMapReport.status === "candidate_template_blocked") return "blocked_candidate_template";
  if (proofMapReport.status === "reviewed_artifact_template_blocked") {
    return "blocked_reviewed_artifact_template";
  }
  return "blocked_packet_window_chain_not_ready";
}

function nextCommandFor(status) {
  if (status === "blocked_waiting_two_platform_values") {
    return "cmd.exe /c npm run validate:beta-platform-two-values";
  }
  if (status === "blocked_unsafe_platform_values") {
    return "cmd.exe /c npm run validate:beta-platform-two-values";
  }
  if (status === "ready_for_pm_reviewed_artifact_record") {
    return "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --outcome accepted --reviewedBy PM --note \"PM accepts the no-secret packet-window proof map for pre-execution packet preparation only\" --apply";
  }
  return "cmd.exe /c npm run run:beta-packet-window-proof-map";
}

function runJson(command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: process.env,
    timeout: 360000,
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
