import { spawnSync } from "node:child_process";

const mainline = runJson(["cmd.exe", "/c", "npm", "run", "report:beta-mainline-current-route"]);
const packetWindow = runJson(["cmd.exe", "/c", "npm", "run", "report:beta-packet-window-readiness-summary"]);

const mainlineReport = mainline.json ?? {};
const packetWindowReport = packetWindow.json ?? {};
const goalReadiness = mainlineReport.goalReadiness ?? {};
const status = classifyStatus(mainlineReport, packetWindowReport);

const report = {
  mode: "beta_pre_execution_packet_readiness",
  status,
  ok: status === "ready_to_render_pre_execution_packet_candidate",
  ceoDecision: "compress_packet_pre_execution_readiness_into_one_pm_route",
  nextExecutableStep: nextExecutableStepFor(status, mainlineReport, packetWindowReport),
  pmNextCommand: nextCommandFor(status, mainlineReport, packetWindowReport),
  currentBlockers: buildCurrentBlockers(mainlineReport, packetWindowReport, goalReadiness),
  mainline: {
    status: mainlineReport.status ?? "unknown",
    currentRoute: mainlineReport.pmMainline?.currentRoute ?? "unknown",
    nextCommand: mainlineReport.pmMainline?.nextCommand ?? "unknown",
    afterCurrentCommand: mainlineReport.pmMainline?.afterCurrentCommand ?? "unknown",
    pmDefaultWhenBlocked: mainlineReport.pmDefaultWhenBlocked?.active === true
  },
  packetWindow: {
    status: packetWindowReport.status ?? "unknown",
    nextCommand: packetWindowReport.pmNextCommand ?? "unknown",
    validatorStatus: packetWindowReport.validator?.status ?? "unknown",
    proofMapStatus: packetWindowReport.proofMap?.status ?? "unknown",
    proofMapStoppedAt: packetWindowReport.proofMap?.stoppedAt ?? null,
    reviewedArtifactAccepted: packetWindowReport.safety?.reviewedArtifactAccepted === true
  },
  goalReadiness: {
    status: goalReadiness.status ?? "unknown",
    readyItems: Array.isArray(goalReadiness.completionItems)
      ? goalReadiness.completionItems.filter((item) => item.status === "ready").map((item) => item.id)
      : [],
    heldItems: Array.isArray(goalReadiness.completionItems)
      ? goalReadiness.completionItems.filter((item) => item.status === "held").map((item) => item.id)
      : [],
    blockedItems: Array.isArray(goalReadiness.blockedItems) ? goalReadiness.blockedItems : [],
    nextBestActions: Array.isArray(goalReadiness.nextBestActions) ? goalReadiness.nextBestActions : []
  },
  packetExecutionSequence: [
    {
      step: "validate_two_safe_platform_values",
      command: "cmd.exe /c npm run validate:beta-platform-two-values",
      opensWhen: "BETA_HOSTING_PROJECT_NAME and BETA_TEMPORARY_URL are present and safe-shape-valid"
    },
    {
      step: "run_packet_window_proof_map",
      command: "cmd.exe /c npm run run:beta-packet-window-proof-map",
      opensWhen: "two safe platform values validate"
    },
    {
      step: "record_pm_reviewed_artifact_outcome",
      command:
        "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --dry-run --outcome accepted --reviewedBy PM --note \"PM dry-run verifies the no-secret packet-window reviewed artifact before any apply decision.\"",
      opensWhen: "packet-window proof map reaches the no-secret reviewed artifact template"
    },
    {
      step: "render_pre_execution_packet_candidate",
      command: "cmd.exe /c npm run render:beta-pre-execution-packet-candidate",
      opensWhen: "accepted reviewed artifact exists"
    }
  ],
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  safety: {
    artifactCreated: false,
    candidateRendered: false,
    deploymentAuthorized: false,
    deploymentExecuted: false,
    evidenceRecorded: false,
    hostingResourceMutated: false,
    marketDataFetched: false,
    platformEnvMutated: false,
    publicSourcePromoted: false,
    reviewedArtifactAccepted: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseConnected: false,
    supabaseRead: false,
    supabaseWritten: false
  },
  sourceReports: {
    betaMainlineCurrentRoute: commandStatus(mainline),
    betaPacketWindowReadinessSummary: commandStatus(packetWindow)
  },
  stopLines: [
    "No deployment is authorized by this report.",
    "No hosting resource is created or mutated by this report.",
    "No platform environment value is printed by this report.",
    "No reviewed artifact is created or accepted by this report.",
    "No pre-execution packet candidate is rendered by this report.",
    "No SQL is executed by this report.",
    "No Supabase connection, read, or write is executed by this report.",
    "No staging rows or daily_prices rows are created or modified by this report.",
    "No raw market data is fetched, stored, ingested, or committed by this report.",
    "No secrets, raw payloads, row payloads, or stock id payloads are printed by this report.",
    "publicDataSource remains mock and scoreSource remains mock."
  ]
};

console.log(JSON.stringify(report, null, 2));

function classifyStatus(mainlineReport, packetWindowReport) {
  if (mainlineReport.status === "ready_to_render_pre_execution_packet_candidate") {
    return "ready_to_render_pre_execution_packet_candidate";
  }
  if (packetWindowReport.status === "ready_for_pm_reviewed_artifact_record") {
    return "ready_for_pm_reviewed_artifact_record";
  }
  if (mainlineReport.status === "ready_to_run_beta_packet_window_proof_map") {
    return "ready_to_run_beta_packet_window_proof_map";
  }
  if (mainlineReport.status === "blocked_unsafe_platform_values" || packetWindowReport.status === "blocked_unsafe_platform_values") {
    return "blocked_unsafe_platform_values";
  }
  if (mainlineReport.status === "blocked_waiting_external_input_response") {
    return "blocked_waiting_external_input_response";
  }
  if (mainlineReport.status === "blocked_waiting_two_platform_values" || packetWindowReport.status === "blocked_waiting_two_platform_values") {
    return "blocked_waiting_two_platform_values";
  }
  return "blocked_pre_execution_packet_not_ready";
}

function nextCommandFor(status, mainlineReport, packetWindowReport) {
  return nextExecutableStepFor(status, mainlineReport, packetWindowReport).command;
}

function nextExecutableStepFor(status, mainlineReport, packetWindowReport) {
  if (status === "ready_to_render_pre_execution_packet_candidate") {
    return {
      lane: "pre_execution_packet_candidate",
      command: "cmd.exe /c npm run render:beta-pre-execution-packet-candidate",
      reason: "An accepted reviewed artifact exists, so PM can render the pre-execution packet candidate."
    };
  }
  if (status === "ready_for_pm_reviewed_artifact_record") {
    return packetWindowReport.nextExecutableStep ?? {
      lane: "pm_reviewed_artifact_outcome",
      command:
        packetWindowReport.pmNextCommand ??
        "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --dry-run --outcome accepted --reviewedBy PM --note \"PM dry-run verifies the no-secret packet-window reviewed artifact before any apply decision.\"",
      reason: "The packet-window proof map reached the reviewed artifact template, so PM records accepted or rejected."
    };
  }
  if (status === "ready_to_run_beta_packet_window_proof_map") {
    return {
      lane: "packet_window_proof_map",
      command: "cmd.exe /c npm run run:beta-packet-window-proof-map",
      reason: "The platform values are shape-valid, so PM can run the packet-window proof map."
    };
  }
  if (status === "blocked_waiting_external_input_response") {
    return {
      lane: "external_input_request",
      command: mainlineReport.pmMainline?.nextCommand ?? "cmd.exe /c npm run report:public-beta-external-input-request",
      reason: "The pre-execution packet is blocked by the current combined external-input response: platform values plus A1 TWII four-slot no-secret evidence."
    };
  }
  return packetWindowReport.nextExecutableStep ?? {
    lane: "external_input_request",
    command: mainlineReport.pmMainline?.nextCommand ?? "cmd.exe /c npm run report:public-beta-external-input-request",
    reason: "The pre-execution packet is blocked by missing external inputs; use the single external-input request."
  };
}

function buildCurrentBlockers(mainlineReport, packetWindowReport, goalReadiness) {
  const blockers = [];
  if (mainlineReport.platformValues?.hostingProjectNameProvided !== true) {
    blockers.push("BETA_HOSTING_PROJECT_NAME");
  }
  if (mainlineReport.platformValues?.temporaryBetaUrlProvided !== true) {
    blockers.push("BETA_TEMPORARY_URL");
  }
  for (const item of Array.isArray(goalReadiness.blockedItems) ? goalReadiness.blockedItems : []) {
    if (!blockers.includes(item)) blockers.push(item);
  }
  if (packetWindowReport.proofMap?.stoppedAt && !blockers.includes(packetWindowReport.proofMap.stoppedAt)) {
    blockers.push(packetWindowReport.proofMap.stoppedAt);
  }
  return blockers;
}

function runJson(command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: process.env,
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
