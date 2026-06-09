import { spawnSync } from "node:child_process";

const steps = [
  {
    command: ["cmd.exe", "/c", "npm", "run", "report:public-beta-external-input-response-readiness"],
    name: "after-reply-response-readiness",
    readyStatuses: [
      "platform_values_ready_a1_evidence_pending",
      "external_input_response_ready_for_packet_and_a1_outcome_gate"
    ]
  },
  {
    command: ["cmd.exe", "/c", "npm", "run", "validate:beta-platform-two-values"],
    name: "two-value-validator",
    readyStatuses: ["accepted_two_value_shape_only"]
  },
  {
    command: ["cmd.exe", "/c", "npm", "run", "run:beta-packet-window-proof-map"],
    name: "packet-window-proof-map",
    readyStatuses: ["reviewed_artifact_template_ready_pending_pm_review"]
  },
  {
    command: ["cmd.exe", "/c", "npm", "run", "report:beta-mainline-current-route"],
    name: "mainline-route-refresh",
    readyStatuses: [
      "ready_to_render_pre_execution_packet_candidate",
      "ready_to_run_beta_packet_window_proof_map",
      "blocked_waiting_two_platform_values",
      "blocked_waiting_external_input_response"
    ]
  }
];

const results = [];

for (const step of steps) {
  const result = runStep(step);
  results.push(result);

  if (result.exitCode !== 0 || !step.readyStatuses.includes(result.status)) {
    printSummary({
      status: classifyStopStatus(result),
      ok: false,
      stoppedAt: step.name,
      nextCommand: nextCommandFor(result),
      steps: results.map(summarizeStep),
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      safety: safetyBoundary(),
      stopLines: stopLines()
    });
    process.exit(result.exitCode === 0 ? 0 : 1);
  }
}

printSummary({
  status: "platform_two_value_packet_window_chain_ready_pending_pm_review",
  ok: true,
  stoppedAt: null,
  nextCommand:
    "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --dry-run --outcome accepted --reviewedBy PM --note \"PM dry-run verifies the no-secret packet-window reviewed artifact before any apply decision.\"",
  steps: results.map(summarizeStep),
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  safety: safetyBoundary(),
  stopLines: stopLines()
});

function runStep(step) {
  const result = spawnSync(step.command[0], step.command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: process.env,
    timeout: 480000,
    windowsHide: true
  });
  const json = parseJson(result.stdout ?? "");

  return {
    exitCode: result.status ?? 1,
    name: step.name,
    parsedJson: Boolean(json),
    status: json?.status ?? "output_unreadable",
    nextCommand: json?.nextExecutableStep?.command ?? json?.pmMainline?.nextCommand ?? json?.nextCommands?.[0] ?? null,
    nextRoute: json?.nextRoute ?? json?.nextExecutableStep?.lane ?? json?.pmMainline?.currentRoute ?? null,
    stderrPrinted: (result.stderr ?? "").trim().length > 0,
    timedOut: result.error?.code === "ETIMEDOUT"
  };
}

function classifyStopStatus(result) {
  if (result.status === "blocked_waiting_external_input_response") return "blocked_waiting_platform_values_or_a1_reply";
  if (result.status === "blocked_waiting_values") return "blocked_waiting_two_platform_values";
  if (result.status === "rejected_unsafe_values") return "blocked_unsafe_platform_values";
  if (result.status === "repo_proof_blocked") return "blocked_repo_proof";
  if (result.status === "candidate_template_blocked") return "blocked_candidate_template";
  if (result.status === "reviewed_artifact_template_blocked") return "blocked_reviewed_artifact_template";
  return "blocked_packet_window_once_chain";
}

function nextCommandFor(result) {
  if (result.nextCommand) return result.nextCommand;
  if (result.status === "blocked_waiting_values") return "cmd.exe /c npm run report:public-beta-external-input-request";
  if (result.status === "rejected_unsafe_values") return "cmd.exe /c npm run validate:beta-platform-two-values";
  return "cmd.exe /c npm run report:beta-mainline-current-route";
}

function summarizeStep(result) {
  return {
    exitCode: result.exitCode,
    name: result.name,
    nextCommand: result.nextCommand,
    nextRoute: result.nextRoute,
    parsedJson: result.parsedJson,
    status: result.status,
    stderrPrinted: result.stderrPrinted,
    timedOut: result.timedOut
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

function safetyBoundary() {
  return {
    deploymentAuthorized: false,
    deploymentExecuted: false,
    evidenceRecorded: false,
    hostingMutated: false,
    marketDataFetched: false,
    platformValuesPrinted: false,
    rowCoverageAwarded: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    valuesStored: false
  };
}

function stopLines() {
  return [
    "This runner reads platform values only from the current process environment or the existing local env loader.",
    "This runner does not print platform values.",
    "This runner does not store platform values.",
    "This runner does not deploy or mutate hosting resources.",
    "This runner does not execute SQL or connect to Supabase.",
    "This runner does not fetch, store, ingest, or commit raw market data.",
    "This runner does not record A1 evidence or award row coverage points.",
    "publicDataSource remains mock and scoreSource remains mock."
  ];
}

function printSummary(summary) {
  console.log(JSON.stringify(summary, null, 2));
}
