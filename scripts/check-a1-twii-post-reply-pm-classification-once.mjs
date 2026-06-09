import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const runnerPath = "scripts/run-a1-twii-post-reply-pm-classification-once.mjs";
const checkPath = "scripts/check-a1-twii-post-reply-pm-classification-once.mjs";
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
  [runnerPath, runner, "a1_twii_post_reply_pm_classification_once"],
  [runnerPath, runner, "report:public-beta-external-input-response-readiness"],
  [runnerPath, runner, "check:a1-twii-evidence-response-shape"],
  [runnerPath, runner, "report:a1-twii-evidence-pm-classification-route"],
  [runnerPath, runner, "report:a1-source-rights-reviewed-outcome-surface"],
  [runnerPath, runner, "report:a1-source-rights-readiness-summary"],
  [runnerPath, runner, "This runner does not record A1 evidence."],
  [runnerPath, runner, "This runner does not emit an --apply command."],
  [runnerPath, runner, "publicDataSource remains mock and scoreSource remains mock."],
  [checkPath, check, "a1_twii_post_reply_pm_classification_once"],
  [packagePath, JSON.stringify(pkg), "run:a1-twii-post-reply-pm-classification-once"],
  [packagePath, JSON.stringify(pkg), "check:a1-twii-post-reply-pm-classification-once"],
  [reviewGatePath, reviewGate, "name: \"a1-twii-post-reply-pm-classification-once\""],
  [reviewGatePath, reviewGate, "scripts/check-a1-twii-post-reply-pm-classification-once.mjs"],
  [statusPath, projectStatus, "Latest A1 TWII post-reply PM classification one-runner slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["run:a1-twii-post-reply-pm-classification-once"] !==
  "node scripts/run-a1-twii-post-reply-pm-classification-once.mjs"
) {
  problems.push(`${packagePath} missing run:a1-twii-post-reply-pm-classification-once`);
}

if (
  pkg.scripts?.["check:a1-twii-post-reply-pm-classification-once"] !==
  "node scripts/check-a1-twii-post-reply-pm-classification-once.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-post-reply-pm-classification-once`);
}

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "run:a1-twii-post-reply-pm-classification-once"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 500000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push("A1 post-reply PM runner should exit 0 in current pending-evidence state");
if (!report) {
  problems.push("A1 post-reply PM runner should emit JSON");
} else {
  if (report.mode !== "a1_twii_post_reply_pm_classification_once") {
    problems.push("runner mode should be a1_twii_post_reply_pm_classification_once");
  }
  if (report.status !== "blocked_waiting_a1_twii_four_slot_no_secret_evidence") {
    problems.push(`runner status should reflect pending A1 evidence, got ${report.status}`);
  }
  if (report.ok !== true) problems.push("runner ok should be true when local checks pass");
  if (!Array.isArray(report.steps) || report.steps.length !== 1) {
    problems.push("pending runner should fail fast after response-readiness only");
  }
  if (
    !report.steps?.some(
      (step) =>
        step.command === "cmd.exe /c npm run report:public-beta-external-input-response-readiness" &&
        step.exitCode === 0 &&
        step.parsedJson === true
    )
  ) {
    problems.push("pending runner should run response-readiness before stopping");
  }
  if (!Array.isArray(report.skippedSteps) || report.skippedSteps.length !== 4) {
    problems.push("pending runner should report four skipped classification steps");
  }
  for (const id of [
    "a1-no-secret-shape-guard",
    "a1-pm-classification-route",
    "a1-reviewed-outcome-surface",
    "a1-source-rights-readiness-summary"
  ]) {
    if (!report.skippedSteps?.some((step) => step.id === id && step.reason === "a1_twii_four_slot_no_secret_evidence_still_missing")) {
      problems.push(`pending runner missing skipped step ${id}`);
    }
  }
  if (report.missingOnlyReplyPacket?.status !== "missing_external_reply_blocks_present") {
    problems.push("pending runner should pass through missingOnlyReplyPacket");
  }
  if (report.externalReplyChecklistStatus?.status !== "combined_reply_checklist_still_required") {
    problems.push("pending runner should pass through externalReplyChecklistStatus");
  }
  if (report.nextCommand !== "cmd.exe /c npm run report:a1-twii-four-slot-reply-request") {
    problems.push("pending runner nextCommand should return to A1 four-slot reply request");
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  for (const flag of [
    "applyCommandEmitted",
    "candidateArtifactGenerated",
    "deploymentAuthorized",
    "evidenceRecorded",
    "marketDataFetched",
    "rowCoverageAwarded",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sourceRightsApproved",
    "sqlExecuted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled"
  ]) {
    if (report.safety?.[flag] !== false) problems.push(`safety.${flag} must be false`);
  }
}

const ledgerAfter = read(ledgerPath);
if (sha256(ledgerBefore) !== sha256(ledgerAfter)) {
  problems.push("runner must not modify A1 evidence ledger");
}

const acceptedFixturePath = writeAcceptedTwiiFixture();
const acceptedRun = spawnSync("cmd.exe", ["/c", "npm", "run", "run:a1-twii-post-reply-pm-classification-once"], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: {
    ...process.env,
    A1_TWII_EVIDENCE_COMPLETION_OUTCOME_PATH: acceptedFixturePath
  },
  timeout: 500000,
  windowsHide: true
});
const acceptedReport = parseJson(acceptedRun.stdout ?? "");

if (acceptedRun.status !== 0) problems.push("A1 post-reply PM runner accepted fixture should exit 0");
if (!acceptedReport) {
  problems.push("A1 post-reply PM runner accepted fixture should emit JSON");
} else {
  if (acceptedReport.status !== "a1_twii_post_reply_chain_ready_for_outcome_gate_candidate") {
    problems.push(`accepted fixture runner should route to outcome gate candidate, got ${acceptedReport.status}`);
  }
  if (!Array.isArray(acceptedReport.steps) || acceptedReport.steps.length !== 5) {
    problems.push("accepted fixture runner should execute the full five-step chain");
  }
  if (Array.isArray(acceptedReport.skippedSteps) && acceptedReport.skippedSteps.length !== 0) {
    problems.push("accepted fixture runner should not skip classification steps");
  }
  if (acceptedReport.nextCommand !== "cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route") {
    problems.push("accepted fixture runner nextCommand should route to A1 TWII outcome-gate candidate");
  }
  if (!acceptedReport.steps?.some((step) => step.id === "a1-source-rights-readiness-summary" && step.status === "ready_for_separate_source_rights_outcome_gate_candidate")) {
    problems.push("accepted fixture runner should observe ready source-rights readiness summary");
  }
  if (acceptedReport.safety?.evidenceRecorded !== false) problems.push("accepted fixture runner must not record evidence");
  if (acceptedReport.safety?.sourceRightsApproved !== false) problems.push("accepted fixture runner must not approve source rights");
  if (acceptedReport.safety?.candidateArtifactGenerated !== false) problems.push("accepted fixture runner must not generate candidate artifacts");
}

const ledgerAfterAcceptedFixture = read(ledgerPath);
if (sha256(ledgerBefore) !== sha256(ledgerAfterAcceptedFixture)) {
  problems.push("accepted fixture runner must not modify real A1 evidence ledger");
}

for (const [filePath, source] of [
  [runnerPath, runner],
  ["runner stdout", run.stdout ?? ""],
  ["accepted fixture runner stdout", acceptedRun.stdout ?? ""]
]) {
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
      guardedStatus: "a1_twii_post_reply_pm_classification_once_ready",
      currentRunnerStatus: report.status,
      stepCount: report.steps.length,
      ledgerModified: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

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
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /fetch\(/u,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /raw market data approved/iu,
    /deployment completed/iu
  ];
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
            "Checker-only no-secret fixture summary for route validation; no contract text, private links, raw payloads, row payloads, or credentials.",
          remainingRisk:
            "Execution remains blocked until PM opens and accepts a separate TWII source-rights outcome gate.",
          nextGateCandidate: "twii_source_rights_outcome_gate"
        }
        : outcome
    )
  };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "a1-twii-accepted-fixture-"));
  const filePath = path.join(dir, "a1-exact-source-rights-evidence-intake-outcomes.json");
  fs.writeFileSync(filePath, JSON.stringify(fixture, null, 2), "utf8");
  return filePath;
}
