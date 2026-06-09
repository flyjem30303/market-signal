import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const runnerPath = "scripts/run-public-beta-post-reply-route-once.mjs";
const checkPath = "scripts/check-public-beta-post-reply-route-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const ledgerPath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";

const runner = read(runnerPath);
const check = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const projectStatus = read(statusPath);
const ledgerBefore = read(ledgerPath);

for (const [filePath, source, phrase] of [
  [runnerPath, runner, "public_beta_post_reply_route_ready_for_packet_review_and_a1_outcome_gate"],
  [runnerPath, runner, "report:public-beta-external-input-response-readiness"],
  [runnerPath, runner, "missingOnlyReplyPacket"],
  [runnerPath, runner, "externalReplyChecklistStatus"],
  [runnerPath, runner, "run:beta-platform-two-value-proof-map-once"],
  [runnerPath, runner, "run:a1-twii-post-reply-pm-classification-once"],
  [runnerPath, runner, "a1FailFastPolicy"],
  [runnerPath, runner, "a1_twii_four_slot_no_secret_evidence_missing_skip_a1_chain"],
  [runnerPath, runner, "The combined post-reply runner does not run the A1 classification chain until the four no-secret TWII evidence slots are present"],
  [runnerPath, runner, "record:beta-packet-window-reviewed-artifact-outcome -- --dry-run"],
  [runnerPath, runner, "This runner does not write packet artifacts; it only returns a dry-run recorder command."],
  [runnerPath, runner, "publicDataSource remains mock and scoreSource remains mock."],
  [checkPath, check, "public_beta_post_reply_route_once_guard_ready"],
  [packagePath, JSON.stringify(pkg), "run:public-beta-post-reply-route-once"],
  [packagePath, JSON.stringify(pkg), "check:public-beta-post-reply-route-once"],
  [reviewGatePath, reviewGate, "name: \"public-beta-post-reply-route-once\""],
  [reviewGatePath, reviewGate, "scripts/check-public-beta-post-reply-route-once.mjs"],
  [statusPath, projectStatus, "Latest public Beta post-reply route one-runner slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["run:public-beta-post-reply-route-once"] !==
  "node scripts/run-public-beta-post-reply-route-once.mjs"
) {
  problems.push(`${packagePath} missing run:public-beta-post-reply-route-once`);
}
if (
  pkg.scripts?.["check:public-beta-post-reply-route-once"] !==
  "node scripts/check-public-beta-post-reply-route-once.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-post-reply-route-once`);
}

const acceptedFixturePath = writeAcceptedTwiiFixture();
const scenarios = [
  {
    env: {},
    expectedStatus: "blocked_waiting_external_input_response",
    expectedStepIds: ["external-input-response-readiness"],
    name: "missing-external-inputs"
  },
  {
    env: safePlatformEnv(),
    expectedStatus: "public_beta_post_reply_route_ready_for_packet_review_a1_pending",
    expectedStepIds: ["external-input-response-readiness", "platform-two-value-proof-map-once"],
    name: "safe-platform-a1-pending"
  },
  {
    env: {
      A1_TWII_EVIDENCE_COMPLETION_OUTCOME_PATH: acceptedFixturePath
    },
    expectedStatus: "public_beta_post_reply_route_ready_for_a1_outcome_gate_platform_pending",
    expectedStepIds: ["external-input-response-readiness", "a1-twii-post-reply-pm-classification-once"],
    name: "a1-ready-platform-pending"
  },
  {
    env: {
      ...safePlatformEnv(),
      A1_TWII_EVIDENCE_COMPLETION_OUTCOME_PATH: acceptedFixturePath
    },
    expectedStatus: "public_beta_post_reply_route_ready_for_packet_review_and_a1_outcome_gate",
    expectedStepIds: [
      "external-input-response-readiness",
      "platform-two-value-proof-map-once",
      "a1-twii-post-reply-pm-classification-once"
    ],
    name: "all-ready"
  }
];

for (const scenario of scenarios) {
  const result = spawnSync("cmd.exe", ["/c", "npm", "run", "run:public-beta-post-reply-route-once"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      BETA_PLATFORM_VALUES_SKIP_DOTENV: "1",
      ...scenario.env
    },
    timeout: 900000,
    windowsHide: true
  });
  const report = parseJson(result.stdout ?? "");

  if (result.status !== 0) problems.push(`${scenario.name} runner should exit 0`);
  if (!report) {
    problems.push(`${scenario.name} runner should emit JSON`);
    continue;
  }
  if (report.status !== scenario.expectedStatus) {
    problems.push(`${scenario.name} expected ${scenario.expectedStatus}, got ${report.status}`);
  }
  if (scenario.name === "missing-external-inputs") {
    if (report.a1FailFastPolicy?.status !== "a1_twii_four_slot_no_secret_evidence_missing_skip_a1_chain") {
      problems.push(`${scenario.name} should expose the A1 missing-evidence fail-fast policy`);
    }
    if (report.a1FailFastPolicy?.pendingNextCommand !== "cmd.exe /c npm run report:a1-twii-four-slot-reply-request") {
      problems.push(`${scenario.name} A1 fail-fast policy should route to the four-slot reply request`);
    }
    if (report.a1FailFastPolicy?.shouldRunA1 !== false) {
      problems.push(`${scenario.name} A1 fail-fast policy should not run A1 chain while evidence is missing`);
    }
    if (report.a1LocalEvidenceCandidateDraft?.status !== "a1_twii_local_evidence_candidate_draft_ready_for_pm_classification") {
      problems.push(`${scenario.name} should pass through the A1 local evidence candidate draft status`);
    }
    if (report.a1LocalEvidenceCandidateDraft?.candidateSlotCount !== 4) {
      problems.push(`${scenario.name} should pass through four A1 local evidence candidate draft slots`);
    }
    for (const skippedId of [
      "a1-no-secret-shape-guard",
      "a1-pm-classification-route",
      "a1-reviewed-outcome-surface",
      "a1-source-rights-readiness-summary"
    ]) {
      if (!report.a1FailFastPolicy?.skippedUntilEvidencePresent?.includes(skippedId)) {
        problems.push(`${scenario.name} A1 fail-fast policy should list skipped step ${skippedId}`);
      }
    }
    if (report.missingOnlyReplyPacket?.status !== "missing_external_reply_blocks_present") {
      problems.push(`${scenario.name} should pass through missingOnlyReplyPacket`);
    }
    if (report.missingOnlyReplyPacket?.blockCount !== 2) {
      problems.push(`${scenario.name} should report two missing external reply blocks`);
    }
    for (const blockId of ["beta_platform_two_values", "a1_twii_four_slot_no_secret_evidence"]) {
      if (!report.missingOnlyReplyPacket?.missingBlockIds?.includes(blockId)) {
        problems.push(`${scenario.name} missing missingOnlyReplyPacket block ${blockId}`);
      }
    }
    const readinessStep = report.steps?.find((step) => step.id === "external-input-response-readiness");
    if (readinessStep?.a1LocalEvidenceCandidateDraftStatus !== "a1_twii_local_evidence_candidate_draft_ready_for_pm_classification") {
      problems.push(`${scenario.name} readiness step should summarize the A1 local evidence candidate draft status`);
    }
    if (readinessStep?.a1LocalEvidenceCandidateDraftSlotCount !== 4) {
      problems.push(`${scenario.name} readiness step should summarize four A1 local draft slots`);
    }
    for (const command of [
      "cmd.exe /c npm run report:public-beta-external-input-copy-packet",
      "cmd.exe /c npm run report:a1-twii-four-slot-reply-request"
    ]) {
      if (!report.nextCommands?.includes(command)) {
        problems.push(`${scenario.name} nextCommands should include ${command}`);
      }
    }
    for (const command of [
      "run:a1-twii-post-reply-pm-classification-once",
      "run:beta-platform-two-value-proof-map-once",
      "record:beta-packet-window-reviewed-artifact-outcome"
    ]) {
      if (report.nextCommands?.some((nextCommand) => nextCommand.includes(command))) {
        problems.push(`${scenario.name} nextCommands should not include premature ${command}`);
      }
    }
  }
  for (const stepId of scenario.expectedStepIds) {
    if (!report.steps?.some((step) => step.id === stepId && step.exitCode === 0 && step.parsedJson === true)) {
      problems.push(`${scenario.name} missing successful step ${stepId}`);
    }
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push(`${scenario.name} publicDataSource must remain mock`);
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push(`${scenario.name} scoreSource must remain mock`);
  for (const [flag, expected] of Object.entries({
    deploymentAuthorized: false,
    deploymentExecuted: false,
    evidenceRecorded: false,
    hostingMutated: false,
    marketDataFetched: false,
    packetArtifactWritten: false,
    rowCoverageAwarded: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sourceRightsApproved: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    valuesStored: false
  })) {
    if (report.safety?.[flag] !== expected) problems.push(`${scenario.name} safety.${flag} must be ${String(expected)}`);
  }
  if (scenario.name === "safe-platform-a1-pending" || scenario.name === "all-ready") {
    if (!report.nextCommand?.includes("record:beta-packet-window-reviewed-artifact-outcome -- --dry-run")) {
      problems.push(`${scenario.name} should return the reviewed artifact recorder as dry-run only`);
    }
  }
  if (scenario.name === "safe-platform-a1-pending") {
    if (report.a1FailFastPolicy?.status !== "a1_twii_four_slot_no_secret_evidence_missing_skip_a1_chain") {
      problems.push(`${scenario.name} should keep A1 fail-fast policy pending while only platform values are ready`);
    }
    if (report.a1FailFastPolicy?.shouldRunA1 !== false) {
      problems.push(`${scenario.name} should not run A1 chain while A1 evidence is pending`);
    }
  }
  if (scenario.name === "a1-ready-platform-pending" || scenario.name === "all-ready") {
    if (report.a1FailFastPolicy?.status !== "a1_twii_four_slot_no_secret_evidence_ready_allow_a1_chain") {
      problems.push(`${scenario.name} should expose A1-ready policy`);
    }
    if (report.a1FailFastPolicy?.shouldRunA1 !== true) {
      problems.push(`${scenario.name} should run A1 chain when A1 evidence is ready`);
    }
    if ((report.a1FailFastPolicy?.skippedUntilEvidencePresent?.length ?? 0) !== 0) {
      problems.push(`${scenario.name} should not list skipped A1 steps when A1 evidence is ready`);
    }
  }
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(result.stdout ?? "")) problems.push(`${scenario.name} stdout contains forbidden pattern ${String(pattern)}`);
  }
}

if (sha256(ledgerBefore) !== sha256(read(ledgerPath))) {
  problems.push("post-reply route checker fixtures must not modify the real A1 evidence ledger");
}

for (const [filePath, source] of [[runnerPath, runner]]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "public_beta_post_reply_route_once_guard_ready",
      scenarioCount: scenarios.length,
      ledgerModified: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function safePlatformEnv() {
  return {
    BETA_HOSTING_PROJECT_NAME: "taiwan-market-signal-beta",
    BETA_TEMPORARY_URL: "https://taiwan-market-signal-beta.vercel.app/"
  };
}

function writeAcceptedTwiiFixture() {
  const parsed = JSON.parse(ledgerBefore);
  const requiredTwiiIds = new Set([
    "vendor-terms-evidence",
    "internal-feed-owner-evidence",
    "field-contract-evidence",
    "asset-mapping-evidence"
  ]);
  const fixture = {
    ...parsed,
    outcomes: parsed.outcomes.map((outcome) =>
      requiredTwiiIds.has(outcome.id)
        ? {
          ...outcome,
          classification: "accepted",
          pmQuestionResolved: true,
          recordedBy: "checker_fixture_only",
          recordedAt: "2026-06-08T00:00:00.000Z",
          sourceReferenceLabel: `${outcome.id}-safe-fixture-label`,
          safeEvidenceSummary:
            "Checker-only no-secret fixture summary for post-reply route validation; no contract text, private links, raw payloads, row payloads, or credentials.",
          remainingRisk:
            "Execution remains blocked until PM opens and accepts a separate TWII source-rights outcome gate.",
          nextGateCandidate: "twii_source_rights_outcome_gate"
        }
        : outcome
    )
  };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "public-beta-post-reply-a1-fixture-"));
  const filePath = path.join(dir, "a1-exact-source-rights-evidence-intake-outcomes.json");
  fs.writeFileSync(filePath, JSON.stringify(fixture, null, 2), "utf8");
  return filePath;
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(filePath, "utf8");
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

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function forbiddenPatterns() {
  return [
    /git",\s*"add"/iu,
    /git",\s*"commit"/iu,
    /git",\s*"push"/iu,
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\bfetch\s*\(/u,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu,
    /deployment completed/iu,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu
  ];
}
