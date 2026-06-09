import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-public-beta-external-input-request.mjs";
const checkPath = "scripts/check-public-beta-external-input-request.mjs";
const docPath = "docs/PUBLIC_BETA_EXTERNAL_INPUT_REQUEST.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "public_beta_external_input_request"],
  [reportPath, reportSource, "compress_external_blockers_to_two_reply_blocks"],
  [reportPath, reportSource, "beta_platform_two_values"],
  [reportPath, reportSource, "a1_twii_four_slot_no_secret_evidence"],
  [reportPath, reportSource, "pmCopyableReplyChecklist"],
  [reportPath, reportSource, "pmReplyPacketContract"],
  [reportPath, reportSource, "pm_reply_packet_contract_ready"],
  [reportPath, reportSource, "completeReplyRequires"],
  [reportPath, reportSource, "forbiddenContent"],
  [reportPath, reportSource, "pmClassificationQuickMap"],
  [reportPath, reportSource, "ready_for_pm_after_a1_no_secret_reply"],
  [reportPath, reportSource, "afterAnyReplyFirstCommand"],
  [reportPath, reportSource, "fallbackResponseReadinessCommand"],
  [reportPath, reportSource, "report:public-beta-external-reply-file-route"],
  [reportPath, reportSource, "do_not_deploy_from_this_report"],
  [reportPath, reportSource, "report:public-beta-external-input-response-readiness"],
  [reportPath, reportSource, "run:public-beta-post-reply-route-once"],
  [reportPath, reportSource, "fails fast after response-readiness"],
  [reportPath, reportSource, "report:a1-twii-four-slot-reply-request"],
  [reportPath, reportSource, "No values are stored by this report."],
  [reportPath, reportSource, "publicDataSource remains mock and scoreSource remains mock."],
  [docPath, doc, "Status: `public_beta_external_input_request_ready`"],
  [docPath, doc, "Block 1 - Beta Platform Two Values"],
  [docPath, doc, "Block 2 - A1 TWII Four-Slot No-Secret Evidence"],
  [docPath, doc, "cmd.exe /c npm run run:public-beta-post-reply-route-once"],
  [docPath, doc, "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once"],
  [docPath, doc, "Fail-fast rule"],
  [docPath, doc, "PM Reply Packet Contract"],
  [docPath, doc, "Status: `pm_reply_packet_contract_ready`"],
  [docPath, doc, "`beta_platform_two_values`: `BETA_HOSTING_PROJECT_NAME` and `BETA_TEMPORARY_URL`"],
  [docPath, doc, "`a1_twii_four_slot_no_secret_evidence`: all four TWII slots"],
  [docPath, doc, "Forbidden content"],
  [docPath, doc, "First command after any reply"],
  [docPath, doc, "Fallback response-readiness command"],
  [docPath, doc, "cmd.exe /c npm run report:public-beta-external-reply-file-route"],
  [docPath, doc, "One-runner after shape-safe reply"],
  [docPath, doc, "A1 one-runner after evidence reply"],
  [docPath, doc, "`response_readiness_routes_to_post_reply_one_runner`"],
  [docPath, doc, "`do_not_promote_publicDataSource_or_scoreSource_from_this_request`"],
  [docPath, doc, "PM classification quick map"],
  [docPath, doc, "`accepted`: complete, no-secret, responsive"],
  [docPath, doc, "`needs_bounded_repair`: one narrow no-secret clarification"],
  [docPath, doc, "stops after response-readiness"],
  [docPath, doc, "cmd.exe /c npm run report:a1-twii-four-slot-reply-request"],
  [docPath, doc, "publicDataSource=mock"],
  [docPath, doc, "scoreSource=mock"],
  [checkPath, checkSource, "public_beta_external_input_request_ready"],
  [packagePath, JSON.stringify(pkg), "report:public-beta-external-input-request"],
  [packagePath, JSON.stringify(pkg), "check:public-beta-external-input-request"],
  [statusPath, status, "Latest public Beta external input request slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["report:public-beta-external-input-request"] !==
  "node scripts/report-public-beta-external-input-request.mjs"
) {
  problems.push(`${packagePath} missing report:public-beta-external-input-request`);
}

if (
  pkg.scripts?.["check:public-beta-external-input-request"] !==
  "node scripts/check-public-beta-external-input-request.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-external-input-request`);
}

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:public-beta-external-input-request"], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: { ...process.env, BETA_PLATFORM_VALUES_SKIP_DOTENV: "1" },
  timeout: 420000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push("report:public-beta-external-input-request should exit 0");
if (!report) {
  problems.push("report:public-beta-external-input-request should emit JSON");
} else {
  if (report.status !== "public_beta_external_input_request_ready") {
    problems.push(`unexpected report status ${String(report.status)}`);
  }
  if (report.mode !== "public_beta_external_input_request") {
    problems.push("mode should be public_beta_external_input_request");
  }
  if (!Array.isArray(report.requestBlocks) || report.requestBlocks.length !== 2) {
    problems.push("requestBlocks must contain exactly two blocks");
  }
  if (!report.pmCopyableReplyChecklist) {
    problems.push("pmCopyableReplyChecklist must be present");
  }
  if (!report.pmOneScreenReplyPacket) {
    problems.push("pmOneScreenReplyPacket must be present");
  }
  if (!report.pmReplyPacketContract) {
    problems.push("pmReplyPacketContract must be present");
  }

  const blocks = new Map(report.requestBlocks?.map((block) => [block.id, block]) ?? []);
  const platform = blocks.get("beta_platform_two_values");
  const a1 = blocks.get("a1_twii_four_slot_no_secret_evidence");

  if (!platform) problems.push("missing beta_platform_two_values request block");
  if (!a1) problems.push("missing a1_twii_four_slot_no_secret_evidence request block");

  if (!platform?.requiredFields?.includes("BETA_HOSTING_PROJECT_NAME")) {
    problems.push("platform request must include BETA_HOSTING_PROJECT_NAME");
  }
  if (!platform?.requiredFields?.includes("BETA_TEMPORARY_URL")) {
    problems.push("platform request must include BETA_TEMPORARY_URL");
  }
  if (!report.pmCopyableReplyChecklist?.platformLines?.includes("BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>")) {
    problems.push("pmCopyableReplyChecklist must include BETA_HOSTING_PROJECT_NAME placeholder");
  }
  if (!report.pmCopyableReplyChecklist?.platformLines?.includes("BETA_TEMPORARY_URL=https://<public-beta-hostname>/")) {
    problems.push("pmCopyableReplyChecklist must include BETA_TEMPORARY_URL placeholder");
  }
  if (!report.pmOneScreenReplyPacket?.platformBlock?.lines?.includes("BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>")) {
    problems.push("pmOneScreenReplyPacket.platformBlock must include BETA_HOSTING_PROJECT_NAME placeholder");
  }
  if (!report.pmOneScreenReplyPacket?.platformBlock?.lines?.includes("BETA_TEMPORARY_URL=https://<public-beta-hostname>/")) {
    problems.push("pmOneScreenReplyPacket.platformBlock must include BETA_TEMPORARY_URL placeholder");
  }
  if (!report.pmOneScreenReplyPacket?.platformBlock?.afterReply?.includes("cmd.exe /c npm run report:public-beta-external-reply-file-route")) {
    problems.push("pmOneScreenReplyPacket.platformBlock must route first to external reply file route");
  }
  if (!report.pmOneScreenReplyPacket?.platformBlock?.afterReply?.includes("cmd.exe /c npm run run:public-beta-post-reply-route-once")) {
    problems.push("pmOneScreenReplyPacket.platformBlock must route to run:public-beta-post-reply-route-once");
  }
  if (!platform?.pmAfterReply?.includes("cmd.exe /c npm run report:public-beta-external-reply-file-route")) {
    problems.push("platform request must route to report:public-beta-external-reply-file-route");
  }
  if (!platform?.pmAfterReply?.includes("cmd.exe /c npm run report:public-beta-external-input-response-readiness")) {
    problems.push("platform request must route to report:public-beta-external-input-response-readiness");
  }
  if (!platform?.pmAfterReply?.includes("cmd.exe /c npm run run:public-beta-post-reply-route-once")) {
    problems.push("platform request must route to run:public-beta-post-reply-route-once");
  }
  const platformResponseIndex =
    platform?.pmAfterReply?.indexOf("cmd.exe /c npm run report:public-beta-external-input-response-readiness") ?? -1;
  const platformOnceRunnerIndex =
    platform?.pmAfterReply?.indexOf("cmd.exe /c npm run run:public-beta-post-reply-route-once") ?? -1;
  const platformRouteIndex =
    platform?.pmAfterReply?.indexOf("cmd.exe /c npm run report:public-beta-external-reply-file-route") ?? -1;
  if (!(platformRouteIndex >= 0 && platformResponseIndex > platformRouteIndex && platformOnceRunnerIndex > platformResponseIndex)) {
    problems.push("platform pmAfterReply should order reply-file route before response-readiness before the post-reply one-runner");
  }

  for (const field of ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]) {
    if (!a1?.requiredFields?.includes(field)) problems.push(`A1 request missing field ${field}`);
  }
  for (const slot of [
    "vendor-terms-evidence",
    "internal-feed-owner-evidence",
    "field-contract-evidence",
    "asset-mapping-evidence"
  ]) {
    if (!a1?.pendingSlotIds?.includes(slot)) problems.push(`A1 request missing slot ${slot}`);
    if (!report.pmCopyableReplyChecklist?.a1SlotIds?.includes(slot)) {
      problems.push(`pmCopyableReplyChecklist missing A1 slot ${slot}`);
    }
    if (!report.pmOneScreenReplyPacket?.a1Block?.pendingSlotIds?.includes(slot)) {
      problems.push(`pmOneScreenReplyPacket missing A1 slot ${slot}`);
    }
  }
  for (const field of ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]) {
    if (!report.pmCopyableReplyChecklist?.a1RequiredPerSlot?.includes(field)) {
      problems.push(`pmCopyableReplyChecklist.a1RequiredPerSlot missing ${field}`);
    }
    if (!report.pmOneScreenReplyPacket?.a1Block?.requiredPerSlot?.includes(field)) {
      problems.push(`pmOneScreenReplyPacket.a1Block.requiredPerSlot missing ${field}`);
    }
  }
  if (!report.pmOneScreenReplyPacket?.a1Block?.afterReply?.includes("cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once")) {
    problems.push("pmOneScreenReplyPacket.a1Block must route to A1 post-reply one-runner");
  }
  if (
    report.pmOneScreenReplyPacket?.a1Block?.failFastRule !==
    "If any A1 TWII slot is still missing, the one-runner stops after response-readiness and returns to report:a1-twii-four-slot-reply-request."
  ) {
    problems.push("pmOneScreenReplyPacket.a1Block.failFastRule should describe the A1 one-runner fail-fast path");
  }
  if (!report.pmOneScreenReplyPacket?.completeWhen?.includes("response-readiness passes before the post-reply runner")) {
    problems.push("pmOneScreenReplyPacket.completeWhen should preserve response-readiness before runner");
  }
  if (report.pmReplyPacketContract) {
    if (report.pmReplyPacketContract.status !== "pm_reply_packet_contract_ready") {
      problems.push("pmReplyPacketContract.status should be ready");
    }
    if (!Array.isArray(report.pmReplyPacketContract.completeReplyRequires) || report.pmReplyPacketContract.completeReplyRequires.length !== 2) {
      problems.push("pmReplyPacketContract.completeReplyRequires must contain two blocks");
    }
    const contractBlocks = new Map(
      report.pmReplyPacketContract.completeReplyRequires?.map((block) => [block.blockId, block]) ?? []
    );
    const platformContract = contractBlocks.get("beta_platform_two_values");
    const a1Contract = contractBlocks.get("a1_twii_four_slot_no_secret_evidence");
    if (!platformContract?.requiredFields?.includes("BETA_HOSTING_PROJECT_NAME")) {
      problems.push("pmReplyPacketContract platform block must require BETA_HOSTING_PROJECT_NAME");
    }
    if (!platformContract?.requiredFields?.includes("BETA_TEMPORARY_URL")) {
      problems.push("pmReplyPacketContract platform block must require BETA_TEMPORARY_URL");
    }
    if (a1Contract?.requiredSlotCount !== 4) {
      problems.push("pmReplyPacketContract A1 block must require four slots");
    }
    for (const field of ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]) {
      if (!a1Contract?.requiredFieldsPerSlot?.includes(field)) {
        problems.push(`pmReplyPacketContract A1 block missing field ${field}`);
      }
    }
    for (const forbidden of [
      "secrets",
      "dashboard URLs",
      "Supabase URLs",
      "private preview tokens",
      "copied contract text",
      "raw market data",
      "row payloads",
      "stock-id payloads"
    ]) {
      if (!report.pmReplyPacketContract.forbiddenContent?.includes(forbidden)) {
        problems.push(`pmReplyPacketContract.forbiddenContent missing ${forbidden}`);
      }
    }
    if (
    report.pmReplyPacketContract.firstCommandAfterAnyReply !==
      "cmd.exe /c npm run report:public-beta-external-reply-file-route"
  ) {
      problems.push("pmReplyPacketContract.firstCommandAfterAnyReply must be external reply file route");
    }
    if (
      report.pmReplyPacketContract.fallbackResponseReadinessCommand !==
      "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
    ) {
      problems.push("pmReplyPacketContract.fallbackResponseReadinessCommand must be response-readiness");
    }
    if (
      report.pmReplyPacketContract.oneRunnerAfterShapeSafeReply !==
      "cmd.exe /c npm run run:public-beta-post-reply-route-once"
    ) {
      problems.push("pmReplyPacketContract.oneRunnerAfterShapeSafeReply must route to public Beta post-reply one-runner");
    }
    if (
      report.pmReplyPacketContract.a1OneRunnerAfterEvidenceReply !==
      "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once"
    ) {
      problems.push("pmReplyPacketContract.a1OneRunnerAfterEvidenceReply must route to A1 one-runner");
    }
    for (const signal of [
      "platform_two_values_shape_valid",
      "a1_four_twii_slots_present_in_no_secret_shape",
      "response_readiness_routes_to_post_reply_one_runner"
    ]) {
      if (!report.pmReplyPacketContract.doneSignals?.includes(signal)) {
        problems.push(`pmReplyPacketContract.doneSignals missing ${signal}`);
      }
    }
    for (const boundary of [
      "do_not_store_platform_values_in_repo",
      "do_not_record_a1_evidence_from_this_request",
      "do_not_deploy_from_this_request",
      "do_not_promote_publicDataSource_or_scoreSource_from_this_request"
    ]) {
      if (!report.pmReplyPacketContract.stillNotAllowed?.includes(boundary)) {
        problems.push(`pmReplyPacketContract.stillNotAllowed missing ${boundary}`);
      }
    }
  }
  if (report.pmCopyableReplyChecklist?.afterAnyReplyFirstCommand !== "cmd.exe /c npm run report:public-beta-external-reply-file-route") {
    problems.push("pmCopyableReplyChecklist.afterAnyReplyFirstCommand must be external reply file route");
  }
  if (
    report.pmCopyableReplyChecklist?.fallbackResponseReadinessCommand !==
    "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
  ) {
    problems.push("pmCopyableReplyChecklist.fallbackResponseReadinessCommand must be response-readiness");
  }
  for (const signal of [
    "platform_values_shape_valid_inside_public_beta_post_reply_one_runner",
    "post_reply_once_runner_routes_packet_window_or_a1_outcome_gate",
    "a1_four_slot_shape_guard_passes",
    "a1_pm_classification_route_available_for_all_four_slots"
  ]) {
    if (!report.pmCopyableReplyChecklist?.completionSignals?.includes(signal)) {
      problems.push(`pmCopyableReplyChecklist.completionSignals missing ${signal}`);
    }
  }
  for (const boundary of [
    "do_not_print_or_store_platform_values_in_repo",
    "do_not_record_a1_evidence_from_this_report",
    "do_not_approve_source_rights_from_this_report",
    "do_not_deploy_from_this_report"
  ]) {
    if (!report.pmCopyableReplyChecklist?.stillNotAllowed?.includes(boundary)) {
      problems.push(`pmCopyableReplyChecklist.stillNotAllowed missing ${boundary}`);
    }
  }
  if (!a1?.pmAfterReply?.includes("cmd.exe /c npm run check:a1-twii-evidence-response-shape")) {
    problems.push("A1 request must route to check:a1-twii-evidence-response-shape");
  }
  if (!a1?.pmAfterReply?.includes("cmd.exe /c npm run report:public-beta-external-input-response-readiness")) {
    problems.push("A1 request must route to report:public-beta-external-input-response-readiness");
  }
  if (!a1?.pmAfterReply?.includes("cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route")) {
    problems.push("A1 request must route to report:a1-twii-evidence-pm-classification-route");
  }
  if (a1?.pmClassificationQuickMap?.status !== "ready_for_pm_after_a1_no_secret_reply") {
    problems.push("A1 request should include PM classification quick map status");
  }
  if (
    a1?.pmClassificationQuickMap?.firstGuardCommand !==
    "cmd.exe /c npm run check:a1-twii-evidence-response-shape"
  ) {
    problems.push("A1 classification quick map should start with response-shape guard");
  }
  if (
    a1?.pmClassificationQuickMap?.afterAnyDryRunCommand !==
    "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
  ) {
    problems.push("A1 classification quick map should rerun readiness after dry-run");
  }
  if (report.pmOneScreenReplyPacket?.a1Block?.pmClassificationQuickMap?.status !== "ready_for_pm_after_a1_no_secret_reply") {
    problems.push("pmOneScreenReplyPacket.a1Block should include PM classification quick map");
  }
  for (const option of ["accepted", "rejected", "needs_bounded_repair", "blocked"]) {
    if (!a1?.pmClassificationQuickMap?.classificationOptions?.includes(option)) {
      problems.push(`A1 classification quick map missing option ${option}`);
    }
    if (!a1?.pmClassificationQuickMap?.rules?.[option]) {
      problems.push(`A1 classification quick map missing rule ${option}`);
    }
  }
  for (const boundary of [
    "do_not_emit_apply_command",
    "do_not_record_evidence_from_this_report",
    "do_not_approve_source_rights_from_this_report",
    "do_not_award_row_coverage_from_this_report",
    "do_not_fetch_market_data_from_this_report"
  ]) {
    if (!a1?.pmClassificationQuickMap?.stillNotAllowed?.includes(boundary)) {
      problems.push(`A1 classification quick map stillNotAllowed missing ${boundary}`);
    }
  }
  if (
    a1?.pmAfterReplyBehavior !==
    "The A1 post-reply one-runner fails fast after response-readiness while any of the four no-secret evidence slots are still missing. It runs shape guard, classification route, reviewed outcome surface, and readiness summary only after A1 evidence is present."
  ) {
    problems.push("A1 request should describe the fail-fast one-runner behavior");
  }
  const a1ResponseIndex =
    a1?.pmAfterReply?.indexOf("cmd.exe /c npm run report:public-beta-external-input-response-readiness") ?? -1;
  const a1RouteIndex = a1?.pmAfterReply?.indexOf("cmd.exe /c npm run report:public-beta-external-reply-file-route") ?? -1;
  const a1ShapeIndex = a1?.pmAfterReply?.indexOf("cmd.exe /c npm run check:a1-twii-evidence-response-shape") ?? -1;
  const a1ClassificationIndex =
    a1?.pmAfterReply?.indexOf("cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route") ?? -1;
  if (!(a1RouteIndex >= 0 && a1ResponseIndex > a1RouteIndex && a1ShapeIndex > a1ResponseIndex && a1ClassificationIndex > a1ShapeIndex)) {
    problems.push("A1 pmAfterReply should order reply-file route before response-readiness before shape guard before PM classification");
  }

  if (report.currentBlockerSummary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (report.currentBlockerSummary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  if (report.currentBlockerSummary?.blockerCount !== 2) {
    problems.push("currentBlockerSummary.blockerCount must be 2 external input blocks");
  }
  if (report.currentBlockerSummary?.nextBestAction !== "collect_beta_platform_values_and_a1_twii_four_slot_no_secret_evidence") {
    problems.push("currentBlockerSummary.nextBestAction must stay on external input collection");
  }
  if (
    report.currentBlockerSummary?.sourceNextBestAction !==
    "collect_beta_platform_values_and_a1_twii_four_slot_no_secret_evidence"
  ) {
    problems.push("currentBlockerSummary.sourceNextBestAction must stay on combined external input collection");
  }
  if (!report.currentBlockerSummary?.hardBlockers?.includes("beta_platform_two_values")) {
    problems.push("currentBlockerSummary.hardBlockers must include beta_platform_two_values");
  }
  if (!report.currentBlockerSummary?.hardBlockers?.includes("a1_twii_four_slot_no_secret_evidence")) {
    problems.push("currentBlockerSummary.hardBlockers must include a1_twii_four_slot_no_secret_evidence");
  }
  if (!report.currentBlockerSummary?.ignoredSafeguards?.includes("pm_git_snapshot_or_backup")) {
    problems.push("currentBlockerSummary.ignoredSafeguards must include pm_git_snapshot_or_backup");
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push("runtime boundary publicDataSource must be mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push("runtime boundary scoreSource must be mock");

  for (const [flag, expected] of Object.entries({
    deploymentAuthorized: false,
    evidenceRecorded: false,
    hostingMutated: false,
    marketDataFetched: false,
    rawPayloadPrinted: false,
    rowCoverageAwarded: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    valuesStored: false
  })) {
    if (report.safety?.[flag] !== expected) problems.push(`safety.${flag} must be ${String(expected)}`);
  }

  for (const sourceReport of [
    "betaPlatformTwoValueIntakeCommand",
    "a1TwiiFourSlotReplyRequest",
    "betaLaunchRemainingBlockers"
  ]) {
    if (!report.sourceReports?.[sourceReport]?.parsedJson) {
      problems.push(`sourceReports.${sourceReport} should parse`);
    }
  }
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(reportSource)) problems.push(`${reportPath} forbidden pattern ${String(pattern)}`);
  if (pattern.test(doc)) problems.push(`${docPath} forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "public_beta_external_input_request_ready",
      requestBlockCount: report.requestBlocks.length,
      publicDataSource: report.runtimeBoundary.publicDataSource,
      scoreSource: report.runtimeBoundary.scoreSource
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
    /git",\s*"add"/iu,
    /git",\s*"commit"/iu,
    /git",\s*"push"/iu,
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /https:\/\/[a-z0-9-]+\.supabase\.co/iu,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\bfetch\s*\(/u,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu
  ];
}
