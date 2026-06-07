import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-beta-mainline-current-route.mjs";
const checkPath = "scripts/check-beta-mainline-current-route.mjs";
const docPath = "docs/BETA_MAINLINE_CURRENT_ROUTE_REPORT.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const missing = [];
const blocked = [];

for (const file of [reportPath, checkPath, docPath, packagePath, reviewGatePath]) {
  if (!fs.existsSync(file)) missing.push(`${file}: file exists`);
}

const reportSource = read(reportPath);
const doc = read(docPath);
const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredReportPhrases = [
  "keep_beta_mainline_moving_with_a1_a2_parallel_routes",
  "report:beta-platform-unblock-kit",
  "report:a1-source-rights-next-action",
  "report:a1-source-rights-readiness-summary",
  "report:a1-exact-source-rights-evidence-worksheet",
  "report:a1-source-rights-evidence-batch-brief",
  "report:a1-source-rights-reviewed-outcome-surface",
  "report:a2-public-copy-readability-candidates",
  "blocked_waiting_two_platform_values",
  "ready_to_run_beta_packet_window_proof_map",
  "ready_to_render_pre_execution_packet_candidate",
  "platform_values_are_the_only_pm_mainline_external_blocker",
  "refresh_focused_local_runtime_proof_only_when_runtime_or_route_health_changed",
  "keep_a1_on_exact_twii_etf_source_rights_evidence_intake",
  "keep_a2_on_urgent_public_copy_regression_repairs_only",
  "do_not_reopen_broad_deployment_governance",
  "do_not_expand_a2_visual_polish_before_platform_values",
  "do_not_create_packet_window_artifact_before_two_platform_values_validate",
  "No deployment is authorized by this report.",
  "No platform environment value is printed by this report.",
  "No SQL is executed by this report.",
  "No Supabase connection, read, or write is executed by this report.",
  "No raw market data is fetched, stored, ingested, or committed by this report.",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
];

const forbiddenReportPhrases = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "deploymentAuthorized: true",
  "publicDataSource: \"supabase\"",
  "scoreSource: \"real\"",
  ".insert(",
  ".update(",
  ".delete(",
  "fetch("
];

for (const phrase of requiredReportPhrases) {
  if (!reportSource.includes(phrase)) missing.push(`${reportPath}: ${phrase}`);
}

for (const phrase of forbiddenReportPhrases) {
  if (reportSource.includes(phrase)) blocked.push(`${reportPath}: forbidden phrase ${phrase}`);
}

const requiredDocPhrases = [
  "Status: `beta_mainline_current_route_report_ready`",
  "CEO decision: `keep_beta_mainline_moving_with_a1_a2_parallel_routes`",
  "cmd.exe /c npm run report:beta-mainline-current-route",
  "cmd.exe /c npm run check:beta-mainline-current-route",
  "cmd.exe /c npm run report:a1-exact-source-rights-evidence-worksheet",
  "`BETA_HOSTING_PROJECT_NAME`",
  "`BETA_TEMPORARY_URL`",
  "A1",
  "A2",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "No deployment is authorized",
  "No SQL is executed",
  "No Supabase connection, read, or write is executed",
  "No raw market data is fetched"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) missing.push(`${docPath}: ${phrase}`);
}

if (packageJson.scripts?.["report:beta-mainline-current-route"] !== "node scripts/report-beta-mainline-current-route.mjs") {
  missing.push(`${packagePath}: report:beta-mainline-current-route`);
}

if (packageJson.scripts?.["check:beta-mainline-current-route"] !== "node scripts/check-beta-mainline-current-route.mjs") {
  missing.push(`${packagePath}: check:beta-mainline-current-route`);
}

for (const phrase of [
  "scripts/check-beta-mainline-current-route.mjs",
  "name: \"beta-mainline-current-route\"",
  "\"beta-mainline-current-route\""
]) {
  if (!reviewGate.includes(phrase)) missing.push(`${reviewGatePath}: ${phrase}`);
}

const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 300000
});

if (reportRun.status !== 0) {
  blocked.push(`${reportPath}: exited ${String(reportRun.status)} ${reportRun.stderr.trim()}`);
}

const report = parseJson(reportRun.stdout ?? "");
if (!report) {
  blocked.push(`${reportPath}: stdout is not valid JSON`);
} else {
  if (
    ![
      "blocked_waiting_two_platform_values",
      "blocked_unsafe_platform_values",
      "ready_to_run_beta_packet_window_proof_map",
      "ready_to_render_pre_execution_packet_candidate"
    ].includes(report.status)
  ) {
    blocked.push(`report.status: ${String(report.status)}`);
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock") blocked.push("report.runtimeBoundary.publicDataSource must be mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") blocked.push("report.runtimeBoundary.scoreSource must be mock");
  if (report.platformValues?.valuesAreNotPrinted !== true) blocked.push("report.platformValues.valuesAreNotPrinted must be true");
  if (report.platformOperatorHandoff?.mode !== "placeholder_only_no_values_printed") {
    blocked.push("report.platformOperatorHandoff.mode must be placeholder_only_no_values_printed");
  }
  if (!Array.isArray(report.platformOperatorHandoff?.replyTemplate)) {
    missing.push("report.platformOperatorHandoff.replyTemplate");
  } else {
    const replyTemplate = report.platformOperatorHandoff.replyTemplate.join("\n");
    if (!replyTemplate.includes("BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-slug>")) {
      missing.push("report.platformOperatorHandoff.replyTemplate project placeholder");
    }
    if (!replyTemplate.includes("BETA_TEMPORARY_URL=https://<public-beta-hostname>/")) {
      missing.push("report.platformOperatorHandoff.replyTemplate url placeholder");
    }
  }
  if (report.platformOperatorHandoff?.valuesAreNotStoredInRepo !== true) {
    blocked.push("report.platformOperatorHandoff.valuesAreNotStoredInRepo must be true");
  }
  if (report.platformOperatorHandoff?.nextValidationCommand !== "cmd.exe /c npm run validate:beta-platform-two-values") {
    blocked.push("report.platformOperatorHandoff.nextValidationCommand must route to the two-value validator");
  }
  if (!report.platformOperatorHandoff?.afterValuesCommand?.includes("run:beta-packet-window-proof-map")) {
    missing.push("report.platformOperatorHandoff.afterValuesCommand");
  }
  if (!report.platformOperatorHandoff?.afterProofMapCommand?.includes("record:beta-packet-window-reviewed-artifact-outcome")) {
    missing.push("report.platformOperatorHandoff.afterProofMapCommand");
  }
  if (!Array.isArray(report.stopLines) || report.stopLines.length < 9) missing.push("report.stopLines");
  if (!report.pmMainline?.nextCommand) missing.push("report.pmMainline.nextCommand");
  if (!report.runtimeHealth) missing.push("report.runtimeHealth");
  if (report.runtimeHealth?.status !== "ok") {
    blocked.push("report.runtimeHealth.status must be ok");
  }
  if (report.runtimeHealth?.guardedStatus !== "beta_runtime_fast_health_gate_ready") {
    blocked.push("report.runtimeHealth.guardedStatus must be beta_runtime_fast_health_gate_ready");
  }
  if (report.runtimeHealth?.outcome !== "fast_runtime_health_available_for_beta_mainline") {
    blocked.push("report.runtimeHealth.outcome must remain fast_runtime_health_available_for_beta_mainline");
  }
  if (report.runtimeHealth?.routeCount !== 9) {
    blocked.push("report.runtimeHealth.routeCount must be 9");
  }
  if (report.runtimeHealth?.allRoutesHttp200 !== true) {
    blocked.push("report.runtimeHealth.allRoutesHttp200 must be true");
  }
  if (report.runtimeHealth?.runtimeBoundary?.publicDataSource !== "mock") {
    blocked.push("report.runtimeHealth.runtimeBoundary.publicDataSource must be mock");
  }
  if (report.runtimeHealth?.runtimeBoundary?.scoreSource !== "mock") {
    blocked.push("report.runtimeHealth.runtimeBoundary.scoreSource must be mock");
  }
  if (report.status === "blocked_waiting_two_platform_values") {
    if (report.pmDefaultWhenBlocked?.active !== true) blocked.push("report.pmDefaultWhenBlocked.active must be true while platform values are missing");
    if (!Array.isArray(report.pmDefaultWhenBlocked?.allowedLocalLanes) || report.pmDefaultWhenBlocked.allowedLocalLanes.length !== 3) {
      missing.push("report.pmDefaultWhenBlocked.allowedLocalLanes");
    }
    if (!Array.isArray(report.pmDefaultWhenBlocked?.avoid) || report.pmDefaultWhenBlocked.avoid.length !== 3) {
      missing.push("report.pmDefaultWhenBlocked.avoid");
    }
  }
  if (!report.parallelRoutes?.a1?.exactLedger) missing.push("report.parallelRoutes.a1.exactLedger");
  if (!report.parallelRoutes?.a1?.readiness) missing.push("report.parallelRoutes.a1.readiness");
  if (report.parallelRoutes?.a1?.readiness?.status !== "blocked_waiting_a1_exact_source_rights_evidence") {
    blocked.push("report.parallelRoutes.a1.readiness.status must remain blocked while exact evidence is pending");
  }
  if (report.parallelRoutes?.a1?.readiness?.nextCommand !== "cmd.exe /c npm run report:a1-exact-source-rights-evidence-worksheet") {
    blocked.push("report.parallelRoutes.a1.readiness.nextCommand must route to the worksheet report");
  }
  if (report.parallelRoutes?.a1?.readiness?.twiiPendingCount !== 4) {
    blocked.push("report.parallelRoutes.a1.readiness.twiiPendingCount must currently be 4");
  }
  if (report.parallelRoutes?.a1?.readiness?.etfPendingCount !== 6) {
    blocked.push("report.parallelRoutes.a1.readiness.etfPendingCount must currently be 6");
  }
  if (report.parallelRoutes?.a1?.nextCommand !== "cmd.exe /c npm run report:a1-exact-source-rights-evidence-worksheet") {
    blocked.push("report.parallelRoutes.a1.nextCommand must route to the exact source-rights evidence worksheet report");
  }
  if (report.parallelRoutes?.a1?.priorityDecision?.route !== "twii_source_rights_unblock_first_etf_parallel_rights_option") {
    blocked.push("report.parallelRoutes.a1.priorityDecision.route must keep TWII first and ETF parallel");
  }
  if (report.parallelRoutes?.a1?.priorityDecision?.nextAssignment !== "twii_source_rights_unblock_decision_record_candidate") {
    blocked.push("report.parallelRoutes.a1.priorityDecision.nextAssignment must name the TWII unblock decision record candidate");
  }
  if (report.parallelRoutes?.a1?.priorityDecision?.executable !== false) {
    blocked.push("report.parallelRoutes.a1.priorityDecision.executable must remain false");
  }
  if (!report.parallelRoutes?.a1?.worksheetBatch) missing.push("report.parallelRoutes.a1.worksheetBatch");
  if (report.parallelRoutes?.a1?.worksheetBatch?.recommendedBatch?.batchId !== "twii_source_rights_unblock_first_batch") {
    blocked.push("report.parallelRoutes.a1.worksheetBatch.recommendedBatch.batchId must keep the TWII source-rights unblock batch visible");
  }
  if (report.parallelRoutes?.a1?.worksheetBatch?.recommendedBatch?.lane !== "TWII") {
    blocked.push("report.parallelRoutes.a1.worksheetBatch.recommendedBatch.lane must remain TWII");
  }
  if (report.parallelRoutes?.a1?.worksheetBatch?.recommendedBatch?.executable !== false) {
    blocked.push("report.parallelRoutes.a1.worksheetBatch.recommendedBatch.executable must remain false");
  }
  if (!Array.isArray(report.parallelRoutes?.a1?.worksheetBatch?.recommendedBatch?.slotIds) || report.parallelRoutes.a1.worksheetBatch.recommendedBatch.slotIds.length !== 4) {
    missing.push("report.parallelRoutes.a1.worksheetBatch.recommendedBatch.slotIds");
  }
  if (report.parallelRoutes?.a1?.worksheetBatch?.pendingByLane?.TWII?.length !== 4) {
    blocked.push("report.parallelRoutes.a1.worksheetBatch.pendingByLane.TWII must currently have 4 pending slots");
  }
  if (report.parallelRoutes?.a1?.worksheetBatch?.pendingByLane?.ETF?.length !== 6) {
    blocked.push("report.parallelRoutes.a1.worksheetBatch.pendingByLane.ETF must currently have 6 pending slots");
  }
  if (!report.parallelRoutes?.a1?.batchBrief) missing.push("report.parallelRoutes.a1.batchBrief");
  if (report.parallelRoutes?.a1?.batchBrief?.status !== "twii_batch_brief_ready_pending_no_secret_evidence") {
    blocked.push("report.parallelRoutes.a1.batchBrief.status must be twii_batch_brief_ready_pending_no_secret_evidence");
  }
  if (report.parallelRoutes?.a1?.batchBrief?.batchId !== "twii_source_rights_unblock_first_batch") {
    blocked.push("report.parallelRoutes.a1.batchBrief.batchId must keep TWII first batch visible");
  }
  if (report.parallelRoutes?.a1?.batchBrief?.lane !== "TWII") {
    blocked.push("report.parallelRoutes.a1.batchBrief.lane must be TWII");
  }
  if (report.parallelRoutes?.a1?.batchBrief?.pendingCount !== 4) {
    blocked.push("report.parallelRoutes.a1.batchBrief.pendingCount must currently be 4");
  }
  if (report.parallelRoutes?.a1?.batchBrief?.executable !== false) {
    blocked.push("report.parallelRoutes.a1.batchBrief.executable must remain false");
  }
  if (!Array.isArray(report.parallelRoutes?.a1?.batchBrief?.slotIds) || report.parallelRoutes.a1.batchBrief.slotIds.length !== 4) {
    missing.push("report.parallelRoutes.a1.batchBrief.slotIds");
  }
  for (const field of ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]) {
    if (!report.parallelRoutes?.a1?.batchBrief?.outputShape?.includes(field)) {
      missing.push(`report.parallelRoutes.a1.batchBrief.outputShape.${field}`);
    }
  }
  if (report.parallelRoutes?.a1?.batchBrief?.nextAfterEvidenceReview !== "cmd.exe /c npm run report:a1-source-rights-readiness-summary") {
    blocked.push("report.parallelRoutes.a1.batchBrief.nextAfterEvidenceReview must route to A1 readiness summary");
  }
  for (const flag of ["evidenceRecorded", "marketDataFetched", "supabaseReadsEnabled", "supabaseWritesEnabled"]) {
    if (report.parallelRoutes?.a1?.batchBrief?.safety?.[flag] !== false) {
      blocked.push(`report.parallelRoutes.a1.batchBrief.safety.${flag} must remain false`);
    }
  }
  if (!report.parallelRoutes?.a1?.reviewedOutcomeSurface) {
    missing.push("report.parallelRoutes.a1.reviewedOutcomeSurface");
  }
  if (report.parallelRoutes?.a1?.reviewedOutcomeSurface?.status !== "pm_reviewed_outcome_surface_ready_waiting_no_secret_evidence") {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.status must be pm_reviewed_outcome_surface_ready_waiting_no_secret_evidence");
  }
  if (report.parallelRoutes?.a1?.reviewedOutcomeSurface?.activeLane !== "TWII") {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.activeLane must be TWII");
  }
  if (report.parallelRoutes?.a1?.reviewedOutcomeSurface?.pendingCount !== 4) {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.pendingCount must currently be 4");
  }
  if (report.parallelRoutes?.a1?.reviewedOutcomeSurface?.reviewedSlotCount !== 4) {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.reviewedSlotCount must currently be 4");
  }
  if (report.parallelRoutes?.a1?.reviewedOutcomeSurface?.decisionRoutes?.accepted !== "twii_source_rights_outcome_gate") {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.decisionRoutes.accepted must route to TWII source-rights outcome gate");
  }
  if (report.parallelRoutes?.a1?.reviewedOutcomeSurface?.decisionRoutes?.rejected !== "blocked") {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.decisionRoutes.rejected must remain blocked");
  }
  if (report.parallelRoutes?.a1?.reviewedOutcomeSurface?.decisionRoutes?.needs_bounded_repair !== "needs_bounded_repair") {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.decisionRoutes.needs_bounded_repair must route to bounded repair");
  }
  if (report.parallelRoutes?.a1?.reviewedOutcomeSurface?.decisionRoutes?.blocked !== "blocked") {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.decisionRoutes.blocked must remain blocked");
  }
  if (report.parallelRoutes?.a1?.reviewedOutcomeSurface?.nextAfterAnyDryRun !== "cmd.exe /c npm run report:a1-source-rights-readiness-summary") {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.nextAfterAnyDryRun must route to A1 readiness summary");
  }
  for (const flag of ["evidenceRecorded", "marketDataFetched", "supabaseReadsEnabled", "supabaseWritesEnabled"]) {
    if (report.parallelRoutes?.a1?.reviewedOutcomeSurface?.safety?.[flag] !== false) {
      blocked.push(`report.parallelRoutes.a1.reviewedOutcomeSurface.safety.${flag} must remain false`);
    }
  }
  if (!report.parallelRoutes?.a2) missing.push("report.parallelRoutes.a2");
  if (report.parallelRoutes?.a2?.decisionSupport?.nextRecommendedSlice !== "a2-checker-hardening") {
    blocked.push("report.parallelRoutes.a2.decisionSupport.nextRecommendedSlice must route to a2-checker-hardening while no urgent first-screen candidates exist");
  }
  if (report.parallelRoutes?.a2?.priorityCounts?.P2 !== report.parallelRoutes?.a2?.firstScreenCandidates) {
    blocked.push("report.parallelRoutes.a2.priorityCounts.P2 must match current P2 first-screen candidates");
  }
  if (!report.sourceReports?.betaPlatformUnblockKit?.parsedJson) missing.push("report.sourceReports.betaPlatformUnblockKit.parsedJson");
  if (!report.sourceReports?.a1SourceRightsNextAction?.parsedJson) missing.push("report.sourceReports.a1SourceRightsNextAction.parsedJson");
  if (!report.sourceReports?.a1SourceRightsReadinessSummary?.parsedJson) {
    missing.push("report.sourceReports.a1SourceRightsReadinessSummary.parsedJson");
  }
  if (!report.sourceReports?.a1ExactSourceRightsEvidenceWorksheet?.parsedJson) {
    missing.push("report.sourceReports.a1ExactSourceRightsEvidenceWorksheet.parsedJson");
  }
  if (!report.sourceReports?.a1SourceRightsEvidenceBatchBrief?.parsedJson) {
    missing.push("report.sourceReports.a1SourceRightsEvidenceBatchBrief.parsedJson");
  }
  if (!report.sourceReports?.a1SourceRightsReviewedOutcomeSurface?.parsedJson) {
    missing.push("report.sourceReports.a1SourceRightsReviewedOutcomeSurface.parsedJson");
  }
  if (!report.sourceReports?.a2PublicCopyReadabilityCandidates?.parsedJson) {
    missing.push("report.sourceReports.a2PublicCopyReadabilityCandidates.parsedJson");
  }
  if (!report.sourceReports?.betaRuntimeFastHealth?.parsedJson) {
    missing.push("report.sourceReports.betaRuntimeFastHealth.parsedJson");
  }
}

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(filePath) {
  if (!fs.existsSync(filePath)) return "";
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
