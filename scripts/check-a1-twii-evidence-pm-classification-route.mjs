import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-a1-twii-evidence-pm-classification-route.mjs";
const checkPath = "scripts/check-a1-twii-evidence-pm-classification-route.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "a1_twii_evidence_pm_classification_route"],
  [reportPath, reportSource, "keep_a1_post_reply_review_to_four_slots_and_dry_run_only"],
  [reportPath, reportSource, "check:a1-twii-evidence-response-shape"],
  [reportPath, reportSource, "report:a1-source-rights-reviewed-outcome-surface"],
  [reportPath, reportSource, "record:a1-exact-source-rights-evidence-outcome"],
  [reportPath, reportSource, "dryRunCommandPreviews"],
  [reportPath, reportSource, "acceptedDryRunCommand"],
  [reportPath, reportSource, "rejectedDryRunCommand"],
  [reportPath, reportSource, "needsRepairDryRunCommand"],
  [reportPath, reportSource, "blockedDryRunCommand"],
  [reportPath, reportSource, "pmSingleClassificationChecklist"],
  [reportPath, reportSource, "pmFastTriagePacket"],
  [reportPath, reportSource, "A1 TWII PM fast triage packet"],
  [reportPath, reportSource, "ready_waiting_a1_no_secret_reply"],
  [reportPath, reportSource, "perSlotDryRunOnly"],
  [reportPath, reportSource, "do_not_apply_from_this_packet"],
  [reportPath, reportSource, "do_not_fetch_market_data_from_this_packet"],
  [reportPath, reportSource, "classificationOptions"],
  [reportPath, reportSource, "do_not_emit_apply_command"],
  [reportPath, reportSource, "--dry-run"],
  [reportPath, reportSource, "No --apply command is emitted by this report."],
  [reportPath, reportSource, "publicDataSource remains mock and scoreSource remains mock."],
  [checkPath, checkSource, "a1_twii_pm_classification_route_ready"],
  [packagePath, JSON.stringify(pkg), "report:a1-twii-evidence-pm-classification-route"],
  [packagePath, JSON.stringify(pkg), "check:a1-twii-evidence-pm-classification-route"],
  [reviewGatePath, reviewGate, "name: \"a1-twii-evidence-pm-classification-route\""],
  [reviewGatePath, reviewGate, "scripts/check-a1-twii-evidence-pm-classification-route.mjs"],
  [statusPath, status, "Latest A1 TWII PM classification route slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["report:a1-twii-evidence-pm-classification-route"] !==
  "node scripts/report-a1-twii-evidence-pm-classification-route.mjs"
) {
  problems.push(`${packagePath} missing report:a1-twii-evidence-pm-classification-route`);
}

if (
  pkg.scripts?.["check:a1-twii-evidence-pm-classification-route"] !==
  "node scripts/check-a1-twii-evidence-pm-classification-route.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-evidence-pm-classification-route`);
}

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push(`${reportPath} should exit 0`);
if (!report) {
  problems.push(`${reportPath} should emit JSON`);
} else {
  if (report.status !== "a1_twii_pm_classification_route_ready_waiting_no_secret_evidence") {
    problems.push(`unexpected report status ${String(report.status)}`);
  }
  if (report.mode !== "a1_twii_evidence_pm_classification_route") {
    problems.push("report mode mismatch");
  }
  if (!Array.isArray(report.twiiSlots) || report.twiiSlots.length !== 4) {
    problems.push("report.twiiSlots must contain four slots");
  }
  if (!Array.isArray(report.dryRunCommandPreviews) || report.dryRunCommandPreviews.length !== 4) {
    problems.push("report.dryRunCommandPreviews must contain four TWII slot previews");
  }
  for (const slot of [
    "vendor-terms-evidence",
    "internal-feed-owner-evidence",
    "field-contract-evidence",
    "asset-mapping-evidence"
  ]) {
    if (!report.twiiSlots?.includes(slot)) problems.push(`missing TWII slot ${slot}`);
    const preview = report.dryRunCommandPreviews?.find((item) => item.evidenceSlotId === slot);
    if (!preview) {
      problems.push(`missing dry-run preview for ${slot}`);
    } else {
      for (const field of ["acceptedDryRunCommand", "rejectedDryRunCommand", "needsRepairDryRunCommand", "blockedDryRunCommand"]) {
        if (!preview[field]?.includes("--dry-run")) problems.push(`${slot}.${field} must be dry-run`);
        if (preview[field]?.includes("--apply")) problems.push(`${slot}.${field} must not include apply`);
        if (!preview[field]?.includes("record:a1-exact-source-rights-evidence-outcome")) {
          problems.push(`${slot}.${field} must use the evidence outcome recorder`);
        }
      }
      if (!preview.acceptedDryRunCommand?.includes("--classification accepted")) {
        problems.push(`${slot}.acceptedDryRunCommand must classify accepted`);
      }
      if (!preview.rejectedDryRunCommand?.includes("--classification rejected")) {
        problems.push(`${slot}.rejectedDryRunCommand must classify rejected`);
      }
      if (!preview.needsRepairDryRunCommand?.includes("--classification needs_bounded_repair")) {
        problems.push(`${slot}.needsRepairDryRunCommand must classify needs_bounded_repair`);
      }
      if (!preview.blockedDryRunCommand?.includes("--classification blocked")) {
        problems.push(`${slot}.blockedDryRunCommand must classify blocked`);
      }
    }
  }
  for (const field of ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]) {
    if (!report.requiredA1ReplyFields?.includes(field)) problems.push(`missing required field ${field}`);
  }
  for (const option of ["accepted", "rejected", "needs_bounded_repair", "blocked"]) {
    if (!report.pmSingleClassificationChecklist?.classificationOptions?.includes(option)) {
      problems.push(`pmSingleClassificationChecklist.classificationOptions missing ${option}`);
    }
  }
  for (const field of [
    "classification",
    "pmQuestionResolved",
    "safeSummary",
    "sourceReferenceLabel",
    "remainingRisk",
    "nextGateCandidate"
  ]) {
    if (!report.pmSingleClassificationChecklist?.requiredPerSlot?.includes(field)) {
      problems.push(`pmSingleClassificationChecklist.requiredPerSlot missing ${field}`);
    }
  }
  if (report.pmSingleClassificationChecklist?.firstCommand !== "cmd.exe /c npm run check:a1-twii-evidence-response-shape") {
    problems.push("pmSingleClassificationChecklist.firstCommand must be the A1 response-shape guard");
  }
  if (report.pmSingleClassificationChecklist?.afterAnyDryRun !== "cmd.exe /c npm run report:a1-source-rights-readiness-summary") {
    problems.push("pmSingleClassificationChecklist.afterAnyDryRun must rerun A1 source-rights readiness");
  }
  for (const boundary of [
    "do_not_emit_apply_command",
    "do_not_record_evidence_from_this_report",
    "do_not_approve_source_rights_from_this_report",
    "do_not_award_row_coverage_from_this_report"
  ]) {
    if (!report.pmSingleClassificationChecklist?.stillNotAllowed?.includes(boundary)) {
      problems.push(`pmSingleClassificationChecklist.stillNotAllowed missing ${boundary}`);
    }
  }
  if (report.pmFastTriagePacket?.status !== "ready_waiting_a1_no_secret_reply") {
    problems.push("pmFastTriagePacket.status should be ready_waiting_a1_no_secret_reply");
  }
  if (report.pmFastTriagePacket?.firstCommand !== "cmd.exe /c npm run check:a1-twii-evidence-response-shape") {
    problems.push("pmFastTriagePacket.firstCommand must be the A1 response-shape guard");
  }
  if (report.pmFastTriagePacket?.slotCount !== 4) {
    problems.push("pmFastTriagePacket.slotCount must be 4");
  }
  for (const option of ["accepted", "rejected", "needs_bounded_repair", "blocked"]) {
    if (!report.pmFastTriagePacket?.requiredDecisionPerSlot?.includes(option)) {
      problems.push(`pmFastTriagePacket.requiredDecisionPerSlot missing ${option}`);
    }
  }
  if (!Array.isArray(report.pmFastTriagePacket?.perSlotDryRunOnly) || report.pmFastTriagePacket.perSlotDryRunOnly.length !== 4) {
    problems.push("pmFastTriagePacket.perSlotDryRunOnly must include four dry-run slot entries");
  } else {
    for (const slot of report.pmFastTriagePacket.perSlotDryRunOnly) {
      if (!report.twiiSlots?.includes(slot.id)) problems.push(`pmFastTriagePacket has unexpected slot ${String(slot.id)}`);
      if (slot.dryRunOnly !== true) problems.push(`pmFastTriagePacket ${String(slot.id)} must be dryRunOnly`);
      if (slot.afterDryRun !== "cmd.exe /c npm run report:a1-source-rights-readiness-summary") {
        problems.push(`pmFastTriagePacket ${String(slot.id)} afterDryRun must rerun readiness summary`);
      }
      for (const option of ["accepted", "rejected", "needs_bounded_repair", "blocked"]) {
        if (!slot.allowedClassifications?.includes(option)) {
          problems.push(`pmFastTriagePacket ${String(slot.id)} allowedClassifications missing ${option}`);
        }
      }
    }
  }
  for (const boundary of [
    "do_not_apply_from_this_packet",
    "do_not_record_evidence_from_this_packet",
    "do_not_approve_source_rights_from_this_packet",
    "do_not_award_row_coverage_from_this_packet",
    "do_not_fetch_market_data_from_this_packet"
  ]) {
    if (!report.pmFastTriagePacket?.stillNotAllowed?.includes(boundary)) {
      problems.push(`pmFastTriagePacket.stillNotAllowed missing ${boundary}`);
    }
  }
  const commandText = JSON.stringify(report.pmFlow ?? []);
  if (!commandText.includes("--dry-run")) problems.push("pmFlow must include dry-run recorder command pattern");
  if (commandText.includes("--apply")) problems.push("pmFlow must not include apply commands");
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  for (const [flag, expected] of Object.entries({
    applyCommandEmitted: false,
    candidateArtifactGenerated: false,
    evidenceRecorded: false,
    marketDataFetched: false,
    rowCoverageAwarded: false,
    sourceRightsApproved: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false
  })) {
    if (report.safety?.[flag] !== expected) problems.push(`safety.${flag} must be ${expected}`);
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
      guardedStatus: "a1_twii_pm_classification_route_ready",
      checkedSlots: 4,
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

function forbiddenPatterns() {
  return [
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\bfetch\s*\(/u,
    /publicDataSource:\s*"supabase"/u,
    /scoreSource:\s*"real"/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu
  ];
}
