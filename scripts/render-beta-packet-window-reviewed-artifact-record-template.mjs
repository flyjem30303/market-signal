import { spawnSync } from "node:child_process";

const renderer = run(["cmd.exe", "/c", "npm", "run", "render:beta-packet-window-candidate-template"], "candidate-template-renderer");
const rendererJson = parseJsonFromStdout(renderer.stdout);
const rendererStatus = rendererJson?.status ?? "renderer_output_unreadable";
const rendererReady =
  renderer.exitCode === 0 &&
  rendererStatus === "packet_window_candidate_template_ready_shape_only" &&
  rendererJson?.packetCandidateAllowed === true;

const runtimeBoundary = {
  publicDataSource: "mock",
  scoreSource: "mock"
};

if (!rendererReady) {
  const status = ["blocked_waiting_values", "rejected_unsafe_values", "repo_proof_blocked"].includes(rendererStatus)
    ? rendererStatus
    : "repo_proof_blocked";

  console.log(
    JSON.stringify(
      {
        status,
        ok: false,
        recordTemplateAllowed: false,
        nextRoute:
          status === "blocked_waiting_values"
            ? "keep_waiting_for_safe_two_values"
            : "repair_candidate_template_before_record_template",
        runtimeBoundary,
        renderer: summarizeRenderer(renderer, rendererJson),
        reviewedArtifactPathPattern: "docs/reviews/BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_YYYY-MM-DD.md",
        recordTemplate: null,
        notes: [
          "Reviewed artifact record template is blocked until the candidate template renderer is ready.",
          "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
        ]
      },
      null,
      2
    )
  );

  process.exit(status === "rejected_unsafe_values" || status === "repo_proof_blocked" ? 1 : 0);
}

const recordTemplate = {
  status: "pending_pm_review",
  allowedOutcomes: ["accepted", "rejected"],
  source: "render:beta-packet-window-candidate-template",
  templateStatus: "packet_window_candidate_template_ready_shape_only",
  sourceBranch: rendererJson?.repoProof?.sourceBranch,
  sourceCommit: rendererJson?.repoProof?.sourceCommit,
  worktreeState: rendererJson?.repoProof?.worktreeState,
  publicDataSource: "mock",
  scoreSource: "mock",
  hostingProjectNameRecorded: Boolean(rendererJson?.platformValues?.hostingProjectName),
  temporaryBetaUrlRecorded: Boolean(rendererJson?.platformValues?.temporaryBetaUrl),
  preExecutionReviewRequired: true,
  deploymentAuthorized: false,
  requiredFollowUps: [
    "PM records accepted or rejected.",
    "A2 reviews public-route readability after URL is reachable.",
    "I confirms secret and environment handling outside repo.",
    "PM confirms rollback and incident owner before any later execution packet."
  ]
};

console.log(
  JSON.stringify(
    {
      status: "reviewed_artifact_record_template_ready_pending_pm_review",
      ok: true,
      recordTemplateAllowed: true,
      nextRoute: "pm_records_accepted_or_rejected_in_separate_reviewed_artifact",
      runtimeBoundary,
      renderer: summarizeRenderer(renderer, rendererJson),
      reviewedArtifactPathPattern: "docs/reviews/BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_YYYY-MM-DD.md",
      recordTemplate,
      notes: [
        "This is a no-secret record template only.",
        "It is not accepted by default and is not a deployment execution packet.",
        "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
      ]
    },
    null,
    2
  )
);

function run(command, name) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: process.env,
    timeout: 300000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    name,
    stderr: (result.stderr ?? "").trim(),
    stdout: (result.stdout ?? "").trim(),
    timedOut: result.error?.code === "ETIMEDOUT"
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

function summarizeRenderer(command, parsed) {
  return {
    exitCode: command.exitCode,
    name: command.name,
    status: parsed?.status ?? null,
    packetCandidateAllowed: parsed?.packetCandidateAllowed ?? false,
    sourceBranch: parsed?.repoProof?.sourceBranch ?? null,
    sourceCommit: parsed?.repoProof?.sourceCommit ?? null,
    worktreeState: parsed?.repoProof?.worktreeState ?? null,
    timedOut: command.timedOut
  };
}
