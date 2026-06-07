import { spawnSync } from "node:child_process";

const steps = [
  {
    command: ["cmd.exe", "/c", "npm", "run", "validate:beta-platform-two-values"],
    name: "two-value-validator",
    readyStatus: "accepted_two_value_shape_only"
  },
  {
    command: ["cmd.exe", "/c", "npm", "run", "run:beta-packet-window-candidate-dry-run"],
    name: "packet-window-dry-run",
    readyStatus: "packet_window_candidate_ready_shape_only"
  },
  {
    command: ["cmd.exe", "/c", "npm", "run", "render:beta-packet-window-candidate-template"],
    name: "candidate-template-renderer",
    readyStatus: "packet_window_candidate_template_ready_shape_only"
  },
  {
    command: ["cmd.exe", "/c", "npm", "run", "render:beta-packet-window-reviewed-artifact-record-template"],
    name: "reviewed-artifact-record-template-renderer",
    readyStatus: "reviewed_artifact_record_template_ready_pending_pm_review"
  }
];

const results = [];

for (const step of steps) {
  const result = run(step);
  results.push(result);

  if (result.exitCode !== 0 || result.status !== step.readyStatus) {
    const status = classifyStopStatus(result.status);
    printSummary({
      status,
      ok: false,
      deploymentAuthorized: false,
      nextRoute: nextRouteFor(status),
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      stoppedAt: step.name,
      steps: results.map(summarizeStep),
      notes: [
        "Proof map stopped at the first non-ready step.",
        "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
      ]
    });
    process.exit(result.exitCode === 0 ? 0 : 1);
  }
}

printSummary({
  status: "reviewed_artifact_template_ready_pending_pm_review",
  ok: true,
  deploymentAuthorized: false,
  nextRoute: "pm_records_accepted_or_rejected_in_separate_reviewed_artifact",
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  stoppedAt: null,
  steps: results.map(summarizeStep),
  notes: [
    "The local proof map reached a no-secret reviewed artifact template.",
    "PM review is still required; this is not accepted by default and is not deployment authorization.",
    "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
  ]
});

function run(step) {
  const result = spawnSync(step.command[0], step.command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: process.env,
    timeout: 360000,
    windowsHide: true
  });
  const json = parseJsonFromStdout(result.stdout ?? "");

  return {
    exitCode: result.status ?? 1,
    name: step.name,
    packetCandidateAllowed: json?.packetCandidateAllowed ?? false,
    recordTemplateAllowed: json?.recordTemplateAllowed ?? false,
    status: json?.status ?? "output_unreadable",
    stderr: (result.stderr ?? "").trim(),
    stdout: (result.stdout ?? "").trim(),
    timedOut: result.error?.code === "ETIMEDOUT"
  };
}

function classifyStopStatus(status) {
  if (status === "blocked_waiting_values") return "blocked_waiting_values";
  if (status === "rejected_unsafe_values") return "rejected_unsafe_values";
  if (status === "repo_proof_blocked") return "repo_proof_blocked";
  if (status === "packet_window_candidate_template_ready_shape_only") return "reviewed_artifact_template_blocked";
  if (status === "reviewed_artifact_record_template_ready_pending_pm_review") {
    return "reviewed_artifact_template_ready_pending_pm_review";
  }
  return "candidate_template_blocked";
}

function nextRouteFor(status) {
  if (status === "blocked_waiting_values") return "keep_waiting_for_safe_two_values";
  if (status === "rejected_unsafe_values") return "request_corrected_non_secret_platform_values";
  if (status === "repo_proof_blocked") return "repair_repo_or_runtime_proof";
  if (status === "reviewed_artifact_template_ready_pending_pm_review") {
    return "pm_records_accepted_or_rejected_in_separate_reviewed_artifact";
  }
  return "repair_packet_window_template_chain";
}

function summarizeStep(result) {
  return {
    exitCode: result.exitCode,
    name: result.name,
    packetCandidateAllowed: result.packetCandidateAllowed,
    recordTemplateAllowed: result.recordTemplateAllowed,
    status: result.status,
    timedOut: result.timedOut
  };
}

function parseJsonFromStdout(stdout) {
  const start = stdout.indexOf("{");
  if (start < 0) return null;

  try {
    return JSON.parse(stdout.slice(start));
  } catch {
    return null;
  }
}

function printSummary(summary) {
  console.log(JSON.stringify(summary, null, 2));
}
