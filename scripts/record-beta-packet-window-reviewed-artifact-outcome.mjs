import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const allowedOutcomes = new Set(["accepted", "rejected"]);
const allowedReviewers = new Set(["CEO", "PM", "Chairman", "I", "A2"]);
const args = parseArgs(process.argv.slice(2));
const outcome = args.outcome;
const reviewedBy = args.reviewedBy ?? "PM";
const note = args.note ?? "";
const apply = args.apply === true;
const recordedAt = args.recordedAt ?? new Date().toISOString();

validateInput();

const proof = run(["cmd.exe", "/c", "npm", "run", "run:beta-packet-window-proof-map"], "proof-map");
const proofJson = parseJsonFromStdout(proof.stdout);
const proofStatus = proofJson?.status ?? "proof_map_output_unreadable";

if (proof.exitCode !== 0 || proofStatus !== "reviewed_artifact_template_ready_pending_pm_review") {
  const status = classifyBlockedStatus(proofStatus);
  print({
    status,
    ok: false,
    artifactWriteAllowed: false,
    artifactPath: null,
    deploymentAuthorized: false,
    runtimeBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    proof: summarizeProof(proof, proofJson),
    nextRoute: status === "blocked_waiting_values" ? "keep_waiting_for_safe_two_values" : "repair_packet_window_chain",
    notes: [
      "Reviewed artifact outcome recording is blocked until the proof map reaches pending PM review.",
      "No artifact file was written.",
      "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
    ]
  });
  process.exit(status === "blocked_waiting_values" ? 0 : 1);
}

const templateRun = run(
  ["cmd.exe", "/c", "npm", "run", "render:beta-packet-window-reviewed-artifact-record-template"],
  "reviewed-artifact-record-template"
);
const templateJson = parseJsonFromStdout(templateRun.stdout);
const templateReady =
  templateRun.exitCode === 0 &&
  templateJson?.status === "reviewed_artifact_record_template_ready_pending_pm_review" &&
  templateJson?.recordTemplateAllowed === true &&
  templateJson?.recordTemplate?.deploymentAuthorized === false &&
  templateJson?.recordTemplate?.publicDataSource === "mock" &&
  templateJson?.recordTemplate?.scoreSource === "mock";

if (!templateReady) {
  print({
    status: "artifact_template_blocked",
    ok: false,
    artifactWriteAllowed: false,
    artifactPath: null,
    deploymentAuthorized: false,
    runtimeBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    proof: summarizeProof(proof, proofJson),
    template: summarizeTemplate(templateRun, templateJson),
    nextRoute: "repair_reviewed_artifact_template_before_recording",
    notes: [
      "The proof map reached PM review, but the reviewed artifact template was not ready.",
      "No artifact file was written.",
      "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
    ]
  });
  process.exit(1);
}

const targetPath = chooseArtifactPath(recordedAt);
const artifact = renderArtifact({
  note,
  outcome,
  pathForDisplay: targetPath,
  proofJson,
  recordedAt,
  reviewedBy,
  templateJson
});

if (apply) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, artifact, "utf8");
}

print({
  status: apply ? "recorded" : "ready_pending_apply",
  ok: true,
  artifactWriteAllowed: true,
  artifactPath: normalizePath(targetPath),
  deploymentAuthorized: false,
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  outcome,
  reviewedBy,
  recordedAt,
  proof: summarizeProof(proof, proofJson),
  template: summarizeTemplate(templateRun, templateJson),
  notes: [
    apply ? "A no-secret reviewed artifact was written." : "Dry-run only; no artifact file was written.",
    "A recorded artifact is a PM review record, not a deployment execution packet.",
    "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
  ]
});

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (arg === "--apply") {
      parsed.apply = true;
      continue;
    }
    if (arg === "--dry-run") {
      parsed.apply = false;
      continue;
    }
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = rawArgs[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${arg}`);
      }
      parsed[key] = value;
      index += 1;
    }
  }
  return parsed;
}

function validateInput() {
  if (!allowedOutcomes.has(outcome)) {
    throw new Error(`Invalid outcome: ${String(outcome)}. Use accepted or rejected.`);
  }
  if (!allowedReviewers.has(reviewedBy)) {
    throw new Error(`Invalid reviewedBy: ${String(reviewedBy)}`);
  }
  if (typeof note !== "string" || note.trim().length < 30) {
    throw new Error("note must be at least 30 characters");
  }
}

function run(command, name) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: process.env,
    timeout: 360000,
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

function classifyBlockedStatus(status) {
  if (status === "blocked_waiting_values") return "blocked_waiting_values";
  if (status === "rejected_unsafe_values") return "rejected_unsafe_values";
  if (status === "repo_proof_blocked") return "repo_proof_blocked";
  if (status === "reviewed_artifact_template_blocked") return "artifact_template_blocked";
  if (status === "candidate_template_blocked") return "artifact_template_blocked";
  return "artifact_template_blocked";
}

function chooseArtifactPath(isoTimestamp) {
  const date = isoTimestamp.slice(0, 10);
  const base = path.join(process.cwd(), "docs", "reviews", `BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_${date}.md`);
  if (!fs.existsSync(base)) return base;

  for (let suffix = 2; suffix < 100; suffix += 1) {
    const candidate = path.join(
      process.cwd(),
      "docs",
      "reviews",
      `BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_${date}_${String(suffix).padStart(2, "0")}.md`
    );
    if (!fs.existsSync(candidate)) return candidate;
  }

  throw new Error("Could not choose a reviewed artifact path");
}

function renderArtifact({ note, outcome, pathForDisplay, proofJson, recordedAt, reviewedBy, templateJson }) {
  const record = templateJson.recordTemplate;
  const lines = [
    "# Beta Packet Window Reviewed Artifact",
    "",
    `Status: \`${outcome}\``,
    "",
    `Date: ${recordedAt}`,
    "",
    "Owner: PM mainline",
    "",
    "## Review Outcome",
    "",
    `- Outcome: \`${outcome}\``,
    `- Reviewed by: \`${reviewedBy}\``,
    `- Source: \`${record.source}\``,
    `- Template status: \`${record.templateStatus}\``,
    `- Artifact path: \`${normalizePath(pathForDisplay)}\``,
    `- Review note: ${note.trim()}`,
    "",
    "## Boundary Evidence",
    "",
    `- Source branch: \`${record.sourceBranch}\``,
    `- Source commit: \`${record.sourceCommit}\``,
    `- Worktree state: \`${record.worktreeState}\``,
    `- publicDataSource: \`${record.publicDataSource}\``,
    `- scoreSource: \`${record.scoreSource}\``,
    `- Hosting project name recorded by validator: \`${String(record.hostingProjectNameRecorded)}\``,
    `- Temporary Beta URL recorded by validator: \`${String(record.temporaryBetaUrlRecorded)}\``,
    `- Pre-execution review required: \`${String(record.preExecutionReviewRequired)}\``,
    `- Deployment authorized: \`${String(record.deploymentAuthorized)}\``,
    "",
    "## Required Follow-Ups",
    "",
    ...record.requiredFollowUps.map((item) => `- ${item}`),
    "",
    "## Proof Map Summary",
    "",
    `- Proof status: \`${proofJson.status}\``,
    `- Next route: \`${proofJson.nextRoute}\``,
    `- Deployment authorized by proof map: \`${String(proofJson.deploymentAuthorized)}\``,
    "",
    "## Hard Stops Still In Force",
    "",
    "- No production deployment.",
    "- No preview deployment.",
    "- No deployment command execution.",
    "- No hosting project creation or mutation.",
    "- No DNS or SSL change.",
    "- No platform environment mutation.",
    "- No secret output or storage action.",
    "- No SQL execution.",
    "- No Supabase connection or write.",
    "- No staging row creation.",
    "- No `daily_prices` mutation.",
    "- No raw market-data fetch, ingest, storage, or commit.",
    "- No row payload, stock id payload, or raw payload output.",
    "- No row coverage points.",
    "- No complete MVP coverage claim.",
    "- No `publicDataSource=supabase`.",
    "- No `scoreSource=real`.",
    "- No investment advice claim.",
    "- No public launch completion claim.",
    ""
  ];

  return `${lines.join("\n")}`;
}

function summarizeProof(command, parsed) {
  return {
    exitCode: command.exitCode,
    name: command.name,
    status: parsed?.status ?? null,
    stoppedAt: parsed?.stoppedAt ?? null,
    deploymentAuthorized: parsed?.deploymentAuthorized ?? false,
    timedOut: command.timedOut
  };
}

function summarizeTemplate(command, parsed) {
  return {
    exitCode: command.exitCode,
    name: command.name,
    status: parsed?.status ?? null,
    recordTemplateAllowed: parsed?.recordTemplateAllowed ?? false,
    deploymentAuthorized: parsed?.recordTemplate?.deploymentAuthorized ?? null,
    publicDataSource: parsed?.recordTemplate?.publicDataSource ?? null,
    scoreSource: parsed?.recordTemplate?.scoreSource ?? null,
    timedOut: command.timedOut
  };
}

function normalizePath(filePath) {
  return path.relative(process.cwd(), filePath).replaceAll(path.sep, "/");
}

function print(payload) {
  console.log(JSON.stringify(payload, null, 2));
}
