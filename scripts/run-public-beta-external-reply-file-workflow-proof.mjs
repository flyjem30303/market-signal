import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const replyPath = process.env.PUBLIC_BETA_EXTERNAL_REPLY_PATH ?? "";
const replyText = replyPath && fs.existsSync(replyPath) ? fs.readFileSync(replyPath, "utf8") : "";
const dryRun = runStep("external-reply-intake-dry-run", [
  "cmd.exe",
  "/c",
  "npm",
  "run",
  "report:public-beta-external-reply-intake-dry-run"
], process.env);

const steps = [dryRun];
const dryRunReady =
  dryRun.exitCode === 0 &&
  dryRun.status === "external_reply_shape_ready_for_post_reply_one_runner" &&
  dryRun.parsedJson === true;

if (!dryRunReady) {
  print({
    status: "public_beta_external_reply_file_workflow_blocked_before_post_reply",
    ok: false,
    mode: "public_beta_external_reply_file_workflow_proof",
    purpose: purpose(),
    nextCommand: "cmd.exe /c npm run report:public-beta-external-reply-file-template",
    steps: steps.map(summarizeStep),
    runtimeBoundary: runtimeBoundary(),
    safety: safetyBoundary(),
    stopLines: stopLines()
  });
  process.exit(0);
}

const parsedReply = {
  platform: parsePlatform(replyText),
  a1Slots: parseA1(replyText)
};
const tempOutcomePath = writeA1OutcomeFixture(parsedReply.a1Slots);
const proofEnv = {
  ...process.env,
  A1_TWII_EVIDENCE_COMPLETION_OUTCOME_PATH: tempOutcomePath,
  BETA_HOSTING_PROJECT_NAME: parsedReply.platform.hostingProjectName,
  BETA_PLATFORM_VALUES_SKIP_DOTENV: "1",
  BETA_TEMPORARY_URL: parsedReply.platform.temporaryBetaUrl
};

const postReply = runStep("public-beta-post-reply-route-once", [
  "cmd.exe",
  "/c",
  "npm",
  "run",
  "run:public-beta-post-reply-route-once"
], proofEnv);
steps.push(postReply);

const ok =
  postReply.exitCode === 0 &&
  postReply.parsedJson === true &&
  postReply.status === "public_beta_post_reply_route_ready_for_packet_review_and_a1_outcome_gate";

print({
  status: ok
    ? "public_beta_external_reply_file_workflow_ready_for_packet_review_and_a1_outcome_gate"
    : "public_beta_external_reply_file_workflow_blocked_in_post_reply_chain",
  ok,
  mode: "public_beta_external_reply_file_workflow_proof",
  purpose: purpose(),
  derivedInputs: {
    a1SlotCount: parsedReply.a1Slots.size,
    platformValuesProvided: {
      hostingProjectName: Boolean(parsedReply.platform.hostingProjectName),
      temporaryBetaUrl: Boolean(parsedReply.platform.temporaryBetaUrl)
    },
    platformValuesPrinted: false,
    replyFileTextPrinted: false,
    tempA1OutcomeFixtureWrittenOutsideRepo: true,
    valuesStoredInRepo: false
  },
  nextCommand: ok
    ? postReply.nextCommand
    : postReply.nextCommand ?? "cmd.exe /c npm run report:public-beta-external-reply-file-template",
  steps: steps.map(summarizeStep),
  runtimeBoundary: runtimeBoundary(),
  safety: safetyBoundary(),
  stopLines: stopLines()
});

function purpose() {
  return "Use one local no-secret reply file to prove the post-reply chain can run with temporary process env values and a temporary A1 outcome fixture. This does not store platform values, record A1 evidence, approve rights, deploy, run SQL, touch Supabase, or fetch market data.";
}

function parsePlatform(text) {
  return {
    hostingProjectName: matchLine(text, "BETA_HOSTING_PROJECT_NAME"),
    temporaryBetaUrl: matchLine(text, "BETA_TEMPORARY_URL")
  };
}

function parseA1(text) {
  const slots = new Map();
  let current = null;

  for (const rawLine of text.split(/\r?\n/u)) {
    const line = rawLine.trim();
    const slotMatch = /^evidenceSlotId:\s*([a-z0-9-]+)\s*$/iu.exec(line);
    if (slotMatch) {
      current = slotMatch[1];
      if (!slots.has(current)) slots.set(current, {});
      continue;
    }
    if (!current || !line.includes(":")) continue;
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim();
    const value = rest.join(":").trim();
    if (!value) continue;
    const slot = slots.get(current) ?? {};
    if (key === "sourceReferenceLabel") slot.sourceReferenceLabel = value;
    if (key === "safeEvidenceSummary") slot.safeEvidenceSummary = value;
    if (key === "remainingRisk") slot.remainingRisk = value;
    slots.set(current, slot);
  }

  return slots;
}

function matchLine(text, key) {
  const pattern = new RegExp(`^${key}=([^\\r\\n]+)$`, "imu");
  const match = pattern.exec(text);
  return match?.[1]?.trim() ?? "";
}

function writeA1OutcomeFixture(slots) {
  const basePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
  const parsed = JSON.parse(fs.readFileSync(basePath, "utf8"));
  const requiredTwiiIds = new Set([
    "vendor-terms-evidence",
    "internal-feed-owner-evidence",
    "field-contract-evidence",
    "asset-mapping-evidence"
  ]);
  const fixture = {
    ...parsed,
    outcomes: parsed.outcomes.map((outcome) => {
      if (!requiredTwiiIds.has(outcome.id)) return outcome;
      const slot = slots.get(outcome.id) ?? {};
      return {
        ...outcome,
        classification: "accepted",
        nextGateCandidate: "twii_source_rights_outcome_gate",
        pmQuestionResolved: true,
        recordedAt: "2026-06-08T00:00:00.000Z",
        recordedBy: "external_reply_file_workflow_temp_fixture_only",
        remainingRisk:
          slot.remainingRisk ??
          "Execution remains blocked until PM opens and accepts a separate TWII source-rights outcome gate.",
        safeEvidenceSummary:
          slot.safeEvidenceSummary ??
          "Temporary no-secret workflow proof summary; no contract text, private links, raw payloads, row payloads, or credentials.",
        sourceReferenceLabel: slot.sourceReferenceLabel ?? `${outcome.id}-temp-workflow-label`
      };
    })
  };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "public-beta-external-reply-workflow-a1-"));
  const filePath = path.join(dir, "a1-exact-source-rights-evidence-intake-outcomes.json");
  fs.writeFileSync(filePath, JSON.stringify(fixture, null, 2), "utf8");
  return filePath;
}

function runStep(id, command, env) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
    timeout: 900000,
    windowsHide: true
  });
  const json = parseJson(result.stdout ?? "");
  return {
    command: command.join(" "),
    exitCode: result.status ?? 1,
    id,
    nextCommand: json?.nextCommand ?? json?.nextExecutableStep?.command ?? null,
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
    nextCommand: step.nextCommand,
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
    rawPayloadPrinted: false,
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
    "This runner does not echo the reply file text.",
    "This runner writes only a temporary A1 outcome fixture outside the repo.",
    "This runner does not record A1 evidence or approve source rights.",
    "This runner does not deploy or mutate hosting resources.",
    "This runner does not execute SQL or connect to Supabase.",
    "This runner does not fetch, store, ingest, or commit raw market data.",
    "publicDataSource remains mock and scoreSource remains mock."
  ];
}

function print(report) {
  console.log(JSON.stringify(report, null, 2));
}
