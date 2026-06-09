import { spawnSync } from "node:child_process";

const steps = [];

const readiness = runStep("external-input-response-readiness", [
  "cmd.exe",
  "/c",
  "npm",
  "run",
  "report:public-beta-external-input-response-readiness"
]);
steps.push(readiness);

if (readiness.exitCode !== 0 || !readiness.parsedJson) {
  print({
    status: "public_beta_post_reply_route_blocked_response_readiness_failed",
    ok: false,
    missingOnlyReplyPacket: readiness.missingOnlyReplyPacket,
    externalReplyChecklistStatus: readiness.externalReplyChecklistStatus,
    a1LocalEvidenceCandidateDraft: readiness.a1LocalEvidenceCandidateDraft,
    nextCommand: "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
    nextCommands: readiness.nextCommands,
    a1FailFastPolicy: a1FailFastPolicy({ readinessStatus: readiness.status, shouldRunA1: false }),
    steps: steps.map(summarizeStep),
    runtimeBoundary: runtimeBoundary(),
    safety: safetyBoundary(),
    stopLines: stopLines()
  });
  process.exit(readiness.exitCode === 0 ? 1 : readiness.exitCode);
}

const shouldRunPlatform = [
  "platform_values_ready_a1_evidence_pending",
  "external_input_response_ready_for_packet_and_a1_outcome_gate"
].includes(readiness.status);
const shouldRunA1 = [
  "a1_evidence_ready_platform_values_pending",
  "external_input_response_ready_for_packet_and_a1_outcome_gate"
].includes(readiness.status);

if (shouldRunPlatform) {
  const platform = runStep("platform-two-value-proof-map-once", [
    "cmd.exe",
    "/c",
    "npm",
    "run",
    "run:beta-platform-two-value-proof-map-once"
  ]);
  steps.push(platform);

  if (platform.exitCode !== 0 || !platform.parsedJson || platform.status !== "platform_two_value_packet_window_chain_ready_pending_pm_review") {
    print({
      status: classifyBlockedPlatformStatus(platform.status),
      ok: false,
      nextCommand: platform.nextCommand ?? "cmd.exe /c npm run run:beta-platform-two-value-proof-map-once",
      a1FailFastPolicy: a1FailFastPolicy({ readinessStatus: readiness.status, shouldRunA1 }),
      steps: steps.map(summarizeStep),
      runtimeBoundary: runtimeBoundary(),
      safety: safetyBoundary(),
      stopLines: stopLines()
    });
    process.exit(platform.exitCode === 0 ? 0 : platform.exitCode);
  }
}

if (shouldRunA1) {
  const a1 = runStep("a1-twii-post-reply-pm-classification-once", [
    "cmd.exe",
    "/c",
    "npm",
    "run",
    "run:a1-twii-post-reply-pm-classification-once"
  ]);
  steps.push(a1);

  if (
    a1.exitCode !== 0 ||
    !a1.parsedJson ||
    a1.status !== "a1_twii_post_reply_chain_ready_for_outcome_gate_candidate"
  ) {
    print({
      status: "public_beta_post_reply_route_blocked_a1_chain",
      ok: false,
      nextCommand: a1.nextCommand ?? "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
      a1FailFastPolicy: a1FailFastPolicy({ readinessStatus: readiness.status, shouldRunA1 }),
      steps: steps.map(summarizeStep),
      runtimeBoundary: runtimeBoundary(),
      safety: safetyBoundary(),
      stopLines: stopLines()
    });
    process.exit(a1.exitCode === 0 ? 0 : a1.exitCode);
  }
}

const status = chooseStatus({ readinessStatus: readiness.status, shouldRunA1, shouldRunPlatform });

print({
  status,
  ok: true,
  missingOnlyReplyPacket: readiness.missingOnlyReplyPacket,
  externalReplyChecklistStatus: readiness.externalReplyChecklistStatus,
  a1LocalEvidenceCandidateDraft: readiness.a1LocalEvidenceCandidateDraft,
  nextCommand: chooseNextCommand(status),
  nextCommands: chooseNextCommands({ readiness, status }),
  a1FailFastPolicy: a1FailFastPolicy({ readinessStatus: readiness.status, shouldRunA1 }),
  steps: steps.map(summarizeStep),
  runtimeBoundary: runtimeBoundary(),
  safety: safetyBoundary(),
  stopLines: stopLines()
});

function chooseStatus({ readinessStatus, shouldRunA1, shouldRunPlatform }) {
  if (shouldRunPlatform && shouldRunA1) return "public_beta_post_reply_route_ready_for_packet_review_and_a1_outcome_gate";
  if (shouldRunPlatform) return "public_beta_post_reply_route_ready_for_packet_review_a1_pending";
  if (shouldRunA1) return "public_beta_post_reply_route_ready_for_a1_outcome_gate_platform_pending";
  if (readinessStatus === "blocked_waiting_external_input_response") return "blocked_waiting_external_input_response";
  return "public_beta_post_reply_route_waiting_for_supported_ready_state";
}

function chooseNextCommand(status) {
  if (status === "public_beta_post_reply_route_ready_for_packet_review_and_a1_outcome_gate") {
    return "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --dry-run --outcome accepted --reviewedBy PM --note \"PM dry-run verifies the no-secret packet-window reviewed artifact before any apply decision.\"";
  }
  if (status === "public_beta_post_reply_route_ready_for_packet_review_a1_pending") {
    return "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --dry-run --outcome accepted --reviewedBy PM --note \"PM dry-run verifies the no-secret packet-window reviewed artifact before any apply decision.\"";
  }
  if (status === "public_beta_post_reply_route_ready_for_a1_outcome_gate_platform_pending") {
    return "cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route";
  }
  return "cmd.exe /c npm run report:public-beta-external-input-request";
}

function chooseNextCommands({ readiness, status }) {
  if (status === "blocked_waiting_external_input_response" && Array.isArray(readiness.nextCommands)) {
    return readiness.nextCommands;
  }
  return [chooseNextCommand(status)];
}

function a1FailFastPolicy({ readinessStatus, shouldRunA1 }) {
  const a1EvidenceReady = [
    "a1_evidence_ready_platform_values_pending",
    "external_input_response_ready_for_packet_and_a1_outcome_gate"
  ].includes(readinessStatus);
  const missingA1Evidence = !a1EvidenceReady;

  return {
    status: missingA1Evidence
      ? "a1_twii_four_slot_no_secret_evidence_missing_skip_a1_chain"
      : "a1_twii_four_slot_no_secret_evidence_ready_allow_a1_chain",
    a1RunnerCommand: "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
    pendingNextCommand: "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
    shouldRunA1,
    skippedUntilEvidencePresent: missingA1Evidence
      ? [
        "a1-no-secret-shape-guard",
        "a1-pm-classification-route",
        "a1-reviewed-outcome-surface",
        "a1-source-rights-readiness-summary"
      ]
      : [],
    rule:
      "The combined post-reply runner does not run the A1 classification chain until the four no-secret TWII evidence slots are present; the A1 runner also fails fast after response-readiness when those slots are missing."
  };
}

function classifyBlockedPlatformStatus(status) {
  if (status === "blocked_waiting_platform_values_or_a1_reply") return "blocked_waiting_external_input_response";
  if (status === "blocked_waiting_two_platform_values") return "blocked_waiting_two_platform_values";
  if (status === "blocked_unsafe_platform_values") return "blocked_unsafe_platform_values";
  return "public_beta_post_reply_route_blocked_platform_chain";
}

function runStep(id, command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: process.env,
    timeout: 600000,
    windowsHide: true
  });
  const json = parseJson(result.stdout ?? "");

  return {
    command: command.join(" "),
    exitCode: result.status ?? 1,
    id,
    a1LocalEvidenceCandidateDraft: json?.a1LocalEvidenceCandidateDraft ?? null,
    externalReplyChecklistStatus: json?.externalReplyChecklistStatus ?? null,
    missingOnlyReplyPacket: json?.missingOnlyReplyPacket ?? null,
    nextCommand: json?.nextCommand ?? json?.nextExecutableStep?.command ?? json?.nextCommands?.[0] ?? null,
    nextCommands: Array.isArray(json?.nextCommands) ? json.nextCommands : [],
    parsedJson: Boolean(json),
    status: json?.status ?? "output_unreadable",
    stderrPrinted: (result.stderr ?? "").trim().length > 0,
    timedOut: result.error?.code === "ETIMEDOUT"
  };
}

function summarizeStep(step) {
  return {
    command: step.command,
    exitCode: step.exitCode,
    id: step.id,
    a1LocalEvidenceCandidateDraftStatus: step.a1LocalEvidenceCandidateDraft?.status ?? null,
    a1LocalEvidenceCandidateDraftSlotCount: step.a1LocalEvidenceCandidateDraft?.candidateSlotCount ?? null,
    missingBlockCount: step.missingOnlyReplyPacket?.blockCount ?? null,
    missingBlockIds: step.missingOnlyReplyPacket?.missingBlockIds ?? [],
    missingOnlyReplyPacketStatus: step.missingOnlyReplyPacket?.status ?? null,
    nextCommand: step.nextCommand,
    nextCommands: step.nextCommands,
    parsedJson: step.parsedJson,
    status: step.status,
    stderrPrinted: step.stderrPrinted,
    timedOut: step.timedOut
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

function runtimeBoundary() {
  return {
    publicDataSource: "mock",
    scoreSource: "mock"
  };
}

function safetyBoundary() {
  return {
    deploymentAuthorized: false,
    deploymentExecuted: false,
    evidenceRecorded: false,
    hostingMutated: false,
    marketDataFetched: false,
    packetArtifactWritten: false,
    platformValuesPrinted: false,
    rowCoverageAwarded: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sourceRightsApproved: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    valuesStored: false
  };
}

function stopLines() {
  return [
    "This runner does not print or store platform values.",
    "This runner does not deploy or mutate hosting resources.",
    "This runner does not execute SQL or connect to Supabase.",
    "This runner does not record A1 evidence or approve source rights.",
    "This runner does not write packet artifacts; it only returns a dry-run recorder command.",
    "This runner does not fetch, store, ingest, or commit raw market data.",
    "publicDataSource remains mock and scoreSource remains mock."
  ];
}

function print(payload) {
  console.log(JSON.stringify(payload, null, 2));
}
