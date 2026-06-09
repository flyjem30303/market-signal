import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];

const reportPath = "scripts/report-a1-source-rights-reviewed-outcome-surface.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const reportSource = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);

if (
  pkg.scripts?.["report:a1-source-rights-reviewed-outcome-surface"] !==
  "node scripts/report-a1-source-rights-reviewed-outcome-surface.mjs"
) {
  problems.push(`${packagePath} missing report:a1-source-rights-reviewed-outcome-surface`);
}

if (
  pkg.scripts?.["check:a1-source-rights-reviewed-outcome-surface"] !==
  "node scripts/check-a1-source-rights-reviewed-outcome-surface.mjs"
) {
  problems.push(`${packagePath} missing check:a1-source-rights-reviewed-outcome-surface`);
}

for (const [filePath, source, phrase] of [
  [statusPath, status, "Latest A1 source-rights reviewed outcome surface slice"],
  [boardPath, board, "`report:a1-source-rights-reviewed-outcome-surface` is `accepted` as the PM/A1 reviewed outcome operation surface"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "a1_source_rights_reviewed_outcome_surface",
  "pm_reviewed_outcome_surface_ready_waiting_no_secret_evidence",
  "judgementSummary",
  "pmNarrowRequest",
  "four_slot_no_secret_reply",
  "copyableReplyShape",
  "check:a1-twii-evidence-response-shape",
  "pending_a1_evidence",
  "wait_for_a1_four_slot_no_secret_evidence_then_dry_run_pm_classification",
  "record:a1-exact-source-rights-evidence-outcome",
  "accepted",
  "rejected",
  "needs_bounded_repair",
  "blocked",
  "--dry-run",
  "evidenceRecorded: false",
  "marketDataFetched: false",
  "supabaseReadsEnabled: false",
  "supabaseWritesEnabled: false",
  "publicDataSource",
  "scoreSource"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing phrase: ${phrase}`);
}

if (reportSource.includes("--apply")) problems.push(`${reportPath} must not emit apply commands`);

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:a1-source-rights-reviewed-outcome-surface"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0 || !report) {
  problems.push("report:a1-source-rights-reviewed-outcome-surface should emit JSON");
} else {
  if (report.status !== "pm_reviewed_outcome_surface_ready_waiting_no_secret_evidence") {
    problems.push(`unexpected status ${report.status}`);
  }
  if (report.activeLane !== "TWII") problems.push("activeLane should remain TWII");
  if (report.pendingCount !== 4) problems.push("pendingCount should currently be 4");
  if (report.judgementSummary?.canOpenOutcomeGate !== false) {
    problems.push("judgementSummary.canOpenOutcomeGate must remain false while TWII evidence is pending");
  }
  if (report.judgementSummary?.counts?.pending !== 4) {
    problems.push("judgementSummary pending count should currently be 4");
  }
  if (report.judgementSummary?.nextPmAction !== "wait_for_a1_four_slot_no_secret_evidence_then_dry_run_pm_classification") {
    problems.push("judgementSummary should route PM to A1 four-slot evidence intake");
  }
  if (!Array.isArray(report.judgementSummary?.slots) || report.judgementSummary.slots.length !== 4) {
    problems.push("judgementSummary.slots should contain four TWII slots");
  } else {
    for (const slot of report.judgementSummary.slots) {
      if (slot.currentDecision !== "pending_a1_evidence") {
        problems.push(`${slot.id} currentDecision should be pending_a1_evidence`);
      }
      if (slot.nextAction !== "ask_a1_to_return_evidenceSlotId_sourceReferenceLabel_safeEvidenceSummary_remainingRisk") {
        problems.push(`${slot.id} nextAction should route A1 to the four-field evidence response`);
      }
    }
  }
  if (report.pmNarrowRequest?.mode !== "four_slot_no_secret_reply") {
    problems.push("pmNarrowRequest should use four_slot_no_secret_reply mode");
  }
  if (!Array.isArray(report.pmNarrowRequest?.askA1For) || report.pmNarrowRequest.askA1For.length !== 4) {
    problems.push("pmNarrowRequest.askA1For should contain four TWII slots");
  }
  for (const field of ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]) {
    if (!report.pmNarrowRequest?.requiredFields?.includes(field)) {
      problems.push(`pmNarrowRequest.requiredFields missing ${field}`);
    }
    if (!report.pmNarrowRequest?.copyableReplyShape?.some((line) => line.startsWith(`${field}:`))) {
      problems.push(`pmNarrowRequest.copyableReplyShape missing ${field}`);
    }
  }
  if (!report.pmNarrowRequest?.afterA1Reply?.includes("cmd.exe /c npm run report:public-beta-external-input-response-readiness")) {
    problems.push("pmNarrowRequest should route through response-readiness first");
  }
  if (!report.pmNarrowRequest?.afterA1Reply?.includes("cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once")) {
    problems.push("pmNarrowRequest should route through the A1 post-reply one-runner");
  }
  if (!report.pmNarrowRequest?.afterA1Reply?.includes("cmd.exe /c npm run check:a1-twii-evidence-response-shape")) {
    problems.push("pmNarrowRequest should route through the response-shape guard");
  }
  if (!report.pmNarrowRequest?.afterA1Reply?.includes("cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route")) {
    problems.push("pmNarrowRequest should route through the A1 PM classification route");
  }
  const shapeIndex =
    report.pmNarrowRequest?.afterA1Reply?.indexOf("cmd.exe /c npm run check:a1-twii-evidence-response-shape") ?? -1;
  const responseReadinessIndex =
    report.pmNarrowRequest?.afterA1Reply?.indexOf("cmd.exe /c npm run report:public-beta-external-input-response-readiness") ?? -1;
  const oneRunnerIndex =
    report.pmNarrowRequest?.afterA1Reply?.indexOf("cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once") ?? -1;
  const classificationIndex =
    report.pmNarrowRequest?.afterA1Reply?.indexOf("cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route") ?? -1;
  if (!(responseReadinessIndex >= 0 && oneRunnerIndex > responseReadinessIndex && shapeIndex > oneRunnerIndex)) {
    problems.push("pmNarrowRequest should order response-readiness before A1 one-runner before response-shape guard");
  }
  if (!(shapeIndex >= 0 && classificationIndex > shapeIndex)) {
    problems.push("pmNarrowRequest should order response-shape guard before PM classification route");
  }
  if (!Array.isArray(report.reviewedOutcomeSlots) || report.reviewedOutcomeSlots.length !== 4) {
    problems.push("reviewedOutcomeSlots should contain four TWII slots");
  } else {
    for (const slot of report.reviewedOutcomeSlots) {
      if (slot.lane !== "TWII") problems.push(`${slot.id} lane must be TWII`);
      if (slot.currentClassification !== "pending") problems.push(`${slot.id} should remain pending`);
      for (const classification of ["accepted", "rejected", "needs_bounded_repair", "blocked"]) {
        const command = slot.dryRunCommands?.[classification] ?? "";
        if (!command.includes("--dry-run")) problems.push(`${slot.id}.${classification} must be dry-run`);
        if (command.includes("--apply")) problems.push(`${slot.id}.${classification} must not apply`);
        if (!command.includes(`--classification ${classification}`)) {
          problems.push(`${slot.id}.${classification} command classification mismatch`);
        }
      }
    }
  }
  if (report.pmDecisionMatrix?.accepted?.nextGateCandidate !== "twii_source_rights_outcome_gate") {
    problems.push("accepted route should point to TWII outcome gate");
  }
  if (report.pmDecisionMatrix?.rejected?.nextGateCandidate !== "blocked") {
    problems.push("rejected route should remain blocked");
  }
  if (report.pmDecisionMatrix?.needs_bounded_repair?.nextGateCandidate !== "needs_bounded_repair") {
    problems.push("needs_bounded_repair route mismatch");
  }
  if (report.pmDecisionMatrix?.blocked?.nextGateCandidate !== "blocked") {
    problems.push("blocked route mismatch");
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock" || report.runtimeBoundary?.scoreSource !== "mock") {
    problems.push("runtime boundary must remain mock/mock");
  }
  for (const flag of [
    "automatedRemoteRun",
    "candidateArtifactGenerated",
    "connectionAttempted",
    "evidenceRecorded",
    "ingestionStarted",
    "marketDataFetched",
    "publicSourcePromoted",
    "rawPayloadPrinted",
    "rowCoverageAwarded",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled"
  ]) {
    if (report.safety?.[flag] !== false) problems.push(`safety.${flag} must be false`);
  }
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(reportSource)) problems.push(`${reportPath} forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "a1_source_rights_reviewed_outcome_surface_ready",
      checkedSlots: 4,
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock"
      }
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
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

function forbiddenPatterns() {
  return [
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\bfetch\s*\(/u,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu,
    /public launch complete/iu
  ];
}
