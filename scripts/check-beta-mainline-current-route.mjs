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
  if (!Array.isArray(report.stopLines) || report.stopLines.length < 9) missing.push("report.stopLines");
  if (!report.pmMainline?.nextCommand) missing.push("report.pmMainline.nextCommand");
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
  if (!report.parallelRoutes?.a2) missing.push("report.parallelRoutes.a2");
  if (!report.sourceReports?.betaPlatformUnblockKit?.parsedJson) missing.push("report.sourceReports.betaPlatformUnblockKit.parsedJson");
  if (!report.sourceReports?.a1SourceRightsNextAction?.parsedJson) missing.push("report.sourceReports.a1SourceRightsNextAction.parsedJson");
  if (!report.sourceReports?.a2PublicCopyReadabilityCandidates?.parsedJson) {
    missing.push("report.sourceReports.a2PublicCopyReadabilityCandidates.parsedJson");
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
