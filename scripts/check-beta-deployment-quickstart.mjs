import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-beta-deployment-quickstart.mjs";
const checkPath = "scripts/check-beta-deployment-quickstart.mjs";
const docPath = "docs/BETA_DEPLOYMENT_QUICKSTART.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const doc = read(docPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:beta-deployment-quickstart"], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: { ...process.env, BETA_PLATFORM_VALUES_SKIP_DOTENV: "1" },
  timeout: 420000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push("report:beta-deployment-quickstart should exit 0");
if (!report) {
  problems.push("report:beta-deployment-quickstart should emit JSON");
} else {
  if (report.guardedStatus !== "beta_deployment_quickstart_ready") {
    problems.push("guardedStatus should be beta_deployment_quickstart_ready");
  }
  if (report.mode !== "pm_public_beta_deployment_quickstart") {
    problems.push("mode should be pm_public_beta_deployment_quickstart");
  }
  if (report.pmNow?.command !== "cmd.exe /c npm run report:public-beta-external-input-request") {
    problems.push("missing-value quickstart should route PM to the public beta external input request");
  }
  if (report.nextExecutableStep?.lane !== "external_input_request") {
    problems.push("missing-value quickstart should expose external_input_request as nextExecutableStep");
  }
  if (report.nextExecutableStep?.command !== "cmd.exe /c npm run report:public-beta-external-input-request") {
    problems.push("missing-value quickstart nextExecutableStep should route to public beta external input request");
  }
  if (report.pmNow?.intakeCommand !== "cmd.exe /c npm run report:beta-platform-two-value-intake-command") {
    problems.push("missing-value quickstart should expose the ephemeral two-value intake command report");
  }
  for (const key of ["BETA_HOSTING_PROJECT_NAME", "BETA_TEMPORARY_URL"]) {
    if (!report.pmNow?.missingPlatformValues?.includes(key)) {
      problems.push(`missing-value quickstart should include ${key}`);
    }
  }
  if (report.pmNow?.doNotCollectMoreThanTheseValues !== true) {
    problems.push("quickstart should prevent broad platform value collection while two values are missing");
  }
  if (report.operatorShortcut?.mode !== "ninety_second_operator_handoff") {
    problems.push("operatorShortcut should expose the ninety-second operator handoff");
  }
  if (!report.operatorShortcut?.operatorReplyTemplate?.includes("BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>")) {
    problems.push("operatorShortcut should include the project-name reply template");
  }
  if (!report.operatorShortcut?.operatorReplyTemplate?.includes("BETA_TEMPORARY_URL=https://<public-beta-hostname>/")) {
    problems.push("operatorShortcut should include the temporary URL reply template");
  }
  if (report.operatorShortcut?.afterReplyCommand !== "cmd.exe /c npm run report:public-beta-external-input-response-readiness") {
    problems.push("operatorShortcut should route first to external-input response readiness");
  }
  if (report.operatorShortcut?.afterReplyProofRunnerCommand !== "cmd.exe /c npm run run:public-beta-post-reply-route-once") {
    problems.push("operatorShortcut should expose the public Beta post-reply one-runner");
  }
  if (report.currentEvidence?.runtimeBoundary?.publicDataSource !== "mock") {
    problems.push("publicDataSource must remain mock");
  }
  if (report.currentEvidence?.runtimeBoundary?.scoreSource !== "mock") {
    problems.push("scoreSource must remain mock");
  }
  if (report.currentEvidence?.platformValues?.valuesAreNotPrinted !== true) {
    problems.push("quickstart should keep platform values unprinted");
  }
  if (report.sourceReports?.betaLaunchNextAction?.delegatedToManualPmRoute !== "cmd.exe /c npm run report:beta-launch-next-action") {
    problems.push("betaLaunchNextAction should be delegated to the manual PM route instead of run inside quickstart");
  }
  if (report.sourceReports?.betaPreExecutionPacketReadiness?.delegatedToManualPmRoute !== "cmd.exe /c npm run report:beta-pre-execution-packet-readiness") {
    problems.push("betaPreExecutionPacketReadiness should be delegated to the manual PM route instead of run inside quickstart");
  }
  if (report.sourceReports?.publicBetaCoreRouteQuickProof?.delegatedToFocusedGate !== "cmd.exe /c npm run check:public-beta-core-route-quick-proof") {
    problems.push("publicBetaCoreRouteQuickProof should be delegated to the focused gate instead of run inside quickstart");
  }
  if (report.currentEvidence?.coreRouteQuickProofIsDelegatedTo !== "cmd.exe /c npm run check:public-beta-core-route-quick-proof") {
    problems.push("coreRouteQuickProof should be delegated to the focused route gate");
  }
  if (!report.afterPmNow?.some((step) => step.command === "cmd.exe /c npm run run:public-beta-post-reply-route-once")) {
    problems.push("quickstart afterPmNow should include the public Beta post-reply one-runner");
  }
  if (report.afterPmNow?.some((step) => step.command === "cmd.exe /c npm run run:beta-platform-two-value-proof-map-once")) {
    problems.push("quickstart afterPmNow should not expose the lower-level platform proof runner as the routine PM step");
  }
}

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "pm_public_beta_deployment_quickstart"],
  [reportPath, reportSource, "use_quickstart_as_single_pm_entry_and_do_not_reopen_broad_governance"],
  [reportPath, reportSource, "ninety_second_operator_handoff"],
  [reportPath, reportSource, "operatorReplyTemplate"],
  [reportPath, reportSource, "report:beta-launch-next-action"],
  [reportPath, reportSource, "report:beta-pre-execution-packet-readiness"],
  [reportPath, reportSource, "check:public-beta-core-route-quick-proof"],
  [reportPath, reportSource, "delegatedToManualPmRoute"],
  [reportPath, reportSource, "delegatedToFocusedGate"],
  [reportPath, reportSource, "platform_values_present_ready_for_public_beta_post_reply_one_runner"],
  [reportPath, reportSource, "run:public-beta-post-reply-route-once"],
  [reportPath, reportSource, "report:beta-platform-two-value-intake-command"],
  [reportPath, reportSource, "report:public-beta-external-input-request"],
  [reportPath, reportSource, "report:public-beta-external-input-response-readiness"],
  [reportPath, reportSource, "nextExecutableStep"],
  [reportPath, reportSource, "show_ephemeral_two_value_intake_command"],
  [reportPath, reportSource, "doNotCollectMoreThanTheseValues"],
  [reportPath, reportSource, "No deployment is authorized by this quickstart."],
  [checkPath, checkSource, "beta_deployment_quickstart_ready"],
  [docPath, doc, "Status: `beta_deployment_quickstart_ready`"],
  [docPath, doc, "cmd.exe /c npm run report:beta-deployment-quickstart"],
  [docPath, doc, "cmd.exe /c npm run check:beta-deployment-quickstart"],
  [docPath, doc, "cmd.exe /c npm run check:public-beta-core-route-quick-proof"],
  [docPath, doc, "cmd.exe /c npm run run:public-beta-post-reply-route-once"],
  [docPath, doc, "BETA_HOSTING_PROJECT_NAME"],
  [docPath, doc, "BETA_TEMPORARY_URL"],
  [docPath, doc, "Where To Get The Two Values"],
  [docPath, doc, "90-Second Operator Handoff"],
  [docPath, doc, "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>"],
  [docPath, doc, "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"],
  [docPath, doc, "CEO default: use Vercel first"],
  [docPath, doc, "https://...vercel.app/"],
  [docPath, doc, "https://...netlify.app/"],
  [docPath, doc, "https://...pages.dev/"],
  [docPath, doc, "A custom domain is not required for this Beta two-value step."],
  [docPath, doc, "Do not substitute a Supabase API URL"],
  [docPath, doc, "Do not reopen broad deployment governance."],
  [docPath, doc, "`publicDataSource=mock`"],
  [docPath, doc, "`scoreSource=mock`"],
  [statusPath, status, "Latest beta deployment quickstart slice"],
  [statusPath, status, "beta_deployment_quickstart_ready"],
  [reviewGatePath, reviewGate, "name: \"beta-deployment-quickstart\""],
  [reviewGatePath, reviewGate, "\"beta-deployment-quickstart\""]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["report:beta-deployment-quickstart"] !== "node scripts/report-beta-deployment-quickstart.mjs") {
  problems.push(`${packagePath} missing report:beta-deployment-quickstart`);
}
if (pkg.scripts?.["check:beta-deployment-quickstart"] !== "node scripts/check-beta-deployment-quickstart.mjs") {
  problems.push(`${packagePath} missing check:beta-deployment-quickstart`);
}

for (const [filePath, source] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["report output", run.stdout ?? ""]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} forbidden pattern ${String(pattern)}`);
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
      guardedStatus: "beta_deployment_quickstart_ready",
      pmCommand: report.pmNow.command,
      nextExecutableStep: report.nextExecutableStep,
      missingPlatformValues: report.pmNow.missingPlatformValues,
      publicDataSource: report.currentEvidence.runtimeBoundary.publicDataSource,
      scoreSource: report.currentEvidence.runtimeBoundary.scoreSource
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
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /\bvercel\s+deploy\b/iu,
    /npm run deploy/iu,
    /RUN_DEPLOY_NOW/u,
    /DEPLOYMENT_COMPLETED/u,
    /production deployment completed/iu,
    /preview deployment completed/iu,
    /deployment command executed/iu,
    /hosting project created/iu,
    /platform env mutated/iu,
    /SQL execution is approved/iu,
    /Supabase reads are approved/iu,
    /Supabase writes are approved/iu,
    /raw market data approved/iu,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu
  ];
}
