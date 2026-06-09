import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-public-beta-external-input-response-readiness.mjs";
const checkPath = "scripts/check-public-beta-external-input-response-readiness.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const ledgerPath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const ledgerBefore = read(ledgerPath);

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "public_beta_external_input_response_readiness"],
  [reportPath, reportSource, "validate:beta-platform-two-values"],
  [reportPath, reportSource, "run:public-beta-post-reply-route-once"],
  [reportPath, reportSource, "check:a1-twii-evidence-response-shape"],
  [reportPath, reportSource, "report:a1-twii-evidence-completion-status"],
  [reportPath, reportSource, "nextExecutableStep"],
  [reportPath, reportSource, "missingOnlyReplyPacket"],
  [reportPath, reportSource, "missing_external_reply_blocks_present"],
  [reportPath, reportSource, "complete_no_missing_external_reply_blocks"],
  [reportPath, reportSource, "externalReplyChecklistStatus"],
  [reportPath, reportSource, "combined_reply_checklist_still_required"],
  [reportPath, reportSource, "afterAnyReplyFirstCommand"],
  [reportPath, reportSource, "report:public-beta-external-input-copy-packet"],
  [reportPath, reportSource, "fallbackFullRequestCommand"],
  [reportPath, reportSource, "pm_mainline_post_reply_packet_window"],
  [reportPath, reportSource, "a1_twii_source_rights_outcome_gate_candidate"],
  [reportPath, reportSource, "external_input_copy_packet"],
  [reportPath, reportSource, "This report does not print platform values."],
  [reportPath, reportSource, "publicDataSource remains mock and scoreSource remains mock."],
  [checkPath, checkSource, "public_beta_external_input_response_readiness_guard_ready"],
  [packagePath, JSON.stringify(pkg), "report:public-beta-external-input-response-readiness"],
  [packagePath, JSON.stringify(pkg), "check:public-beta-external-input-response-readiness"],
  [statusPath, status, "Latest public Beta external input response-readiness slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["report:public-beta-external-input-response-readiness"] !==
  "node scripts/report-public-beta-external-input-response-readiness.mjs"
) {
  problems.push(`${packagePath} missing report:public-beta-external-input-response-readiness`);
}

if (
  pkg.scripts?.["check:public-beta-external-input-response-readiness"] !==
  "node scripts/check-public-beta-external-input-response-readiness.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-external-input-response-readiness`);
}

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:public-beta-external-input-response-readiness"], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: { ...process.env, BETA_PLATFORM_VALUES_SKIP_DOTENV: "1" },
  timeout: 420000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");
const safePlatformRun = spawnSync(
  "cmd.exe",
  ["/c", "npm", "run", "report:public-beta-external-input-response-readiness"],
  {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      BETA_PLATFORM_VALUES_SKIP_DOTENV: "1",
      BETA_HOSTING_PROJECT_NAME: "taiwan-market-signal-beta",
      BETA_TEMPORARY_URL: "https://taiwan-market-signal-beta.vercel.app/"
    },
    timeout: 420000,
    windowsHide: true
  }
);
const safePlatformReport = parseJson(safePlatformRun.stdout ?? "");
const acceptedFixturePath = writeAcceptedTwiiFixture();
const a1ReadyRun = spawnSync(
  "cmd.exe",
  ["/c", "npm", "run", "report:public-beta-external-input-response-readiness"],
  {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      BETA_PLATFORM_VALUES_SKIP_DOTENV: "1",
      A1_TWII_EVIDENCE_COMPLETION_OUTCOME_PATH: acceptedFixturePath
    },
    timeout: 420000,
    windowsHide: true
  }
);
const a1ReadyReport = parseJson(a1ReadyRun.stdout ?? "");
const allReadyRun = spawnSync(
  "cmd.exe",
  ["/c", "npm", "run", "report:public-beta-external-input-response-readiness"],
  {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      BETA_PLATFORM_VALUES_SKIP_DOTENV: "1",
      BETA_HOSTING_PROJECT_NAME: "taiwan-market-signal-beta",
      BETA_TEMPORARY_URL: "https://taiwan-market-signal-beta.vercel.app/",
      A1_TWII_EVIDENCE_COMPLETION_OUTCOME_PATH: acceptedFixturePath
    },
    timeout: 420000,
    windowsHide: true
  }
);
const allReadyReport = parseJson(allReadyRun.stdout ?? "");

if (run.status !== 0) problems.push("report:public-beta-external-input-response-readiness should exit 0");
if (!report) {
  problems.push("report:public-beta-external-input-response-readiness should emit JSON");
} else {
  if (report.mode !== "public_beta_external_input_response_readiness") {
    problems.push("mode should be public_beta_external_input_response_readiness");
  }
  if (
    ![
      "blocked_waiting_external_input_response",
      "platform_values_ready_a1_evidence_pending",
      "a1_evidence_ready_platform_values_pending",
      "external_input_response_ready_for_packet_and_a1_outcome_gate"
    ].includes(report.status)
  ) {
    problems.push(`unexpected report status ${String(report.status)}`);
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push("runtime boundary publicDataSource must be mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push("runtime boundary scoreSource must be mock");
  if (report.platformTwoValues?.status !== "blocked_waiting_values") {
    problems.push("without local platform values, platform status should remain blocked_waiting_values");
  }
  if (report.a1TwiiFourSlotEvidence?.shapeGuardStatus !== "ok") {
    problems.push("A1 response-shape guard should pass as a dry-run local guard");
  }
  if (report.a1LocalEvidenceCandidateDraft?.status !== "a1_twii_local_evidence_candidate_draft_ready_for_pm_classification") {
    problems.push("A1 local evidence candidate draft should be ready for PM classification while evidence is pending");
  }
  if (report.a1LocalEvidenceCandidateDraft?.command !== "cmd.exe /c npm run report:a1-twii-local-evidence-candidate-draft") {
    problems.push("A1 local evidence candidate draft should expose the local draft report command");
  }
  if (report.a1LocalEvidenceCandidateDraft?.candidateSlotCount !== 4) {
    problems.push("A1 local evidence candidate draft should expose four candidate slots");
  }
  if (
    !Array.isArray(report.a1LocalEvidenceCandidateDraft?.suggestedPmClassifications) ||
    report.a1LocalEvidenceCandidateDraft.suggestedPmClassifications.length !== 4
  ) {
    problems.push("A1 local evidence candidate draft should expose four suggested PM classifications");
  }
  if (!Array.isArray(report.nextCommands) || report.nextCommands.length < 2) {
    problems.push("nextCommands should include only the currently executable request actions while blocked");
  }
  if (report.missingOnlyReplyPacket?.status !== "missing_external_reply_blocks_present") {
    problems.push("missingOnlyReplyPacket should report missing blocks while both blocker groups are absent");
  }
  if (report.missingOnlyReplyPacket?.blockCount !== 2) {
    problems.push("missingOnlyReplyPacket.blockCount should be 2 while platform values and A1 evidence are missing");
  }
  if (!report.missingOnlyReplyPacket?.missingBlockIds?.includes("beta_platform_two_values")) {
    problems.push("missingOnlyReplyPacket should include beta_platform_two_values while platform values are missing");
  }
  if (!report.missingOnlyReplyPacket?.missingBlockIds?.includes("a1_twii_four_slot_no_secret_evidence")) {
    problems.push("missingOnlyReplyPacket should include a1_twii_four_slot_no_secret_evidence while A1 evidence is missing");
  }
  if (report.missingOnlyReplyPacket?.afterAnyReplyFirstCommand !== "cmd.exe /c npm run report:public-beta-external-input-response-readiness") {
    problems.push("missingOnlyReplyPacket.afterAnyReplyFirstCommand should return to response-readiness");
  }
  if (!report.nextCommands?.includes("cmd.exe /c npm run report:public-beta-external-input-copy-packet")) {
    problems.push("nextCommands should include the external input copy packet while values are missing");
  }
  if (report.externalReplyChecklistStatus?.status !== "combined_reply_checklist_still_required") {
    problems.push("externalReplyChecklistStatus should require the combined reply checklist while both blocker groups are missing");
  }
  if (report.externalReplyChecklistStatus?.requestCommand !== "cmd.exe /c npm run report:public-beta-external-input-copy-packet") {
    problems.push("externalReplyChecklistStatus.requestCommand should point to the external input copy packet");
  }
  if (report.externalReplyChecklistStatus?.fallbackFullRequestCommand !== "cmd.exe /c npm run report:public-beta-external-input-request") {
    problems.push("externalReplyChecklistStatus.fallbackFullRequestCommand should point to the full external input request");
  }
  if (!report.externalReplyChecklistStatus?.platformFieldsRequired?.includes("BETA_HOSTING_PROJECT_NAME")) {
    problems.push("externalReplyChecklistStatus should require BETA_HOSTING_PROJECT_NAME while missing");
  }
  if (!report.externalReplyChecklistStatus?.platformFieldsRequired?.includes("BETA_TEMPORARY_URL")) {
    problems.push("externalReplyChecklistStatus should require BETA_TEMPORARY_URL while missing");
  }
  if (report.externalReplyChecklistStatus?.a1PendingSlotCount !== 4) {
    problems.push("externalReplyChecklistStatus.a1PendingSlotCount should remain 4 while A1 evidence is missing");
  }
  if (report.externalReplyChecklistStatus?.afterAnyReplyFirstCommand !== "cmd.exe /c npm run report:public-beta-external-input-response-readiness") {
    problems.push("externalReplyChecklistStatus.afterAnyReplyFirstCommand should return to response-readiness");
  }
  if (!report.nextCommands?.includes("cmd.exe /c npm run report:a1-twii-four-slot-reply-request")) {
    problems.push("nextCommands should include the A1 four-slot reply request while evidence is pending");
  }
  if (report.nextCommands?.includes("cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once")) {
    problems.push("blocked nextCommands must not include the A1 post-reply one-runner before A1 evidence is supplied");
  }
  if (report.nextCommands?.includes("cmd.exe /c npm run check:a1-twii-evidence-response-shape")) {
    problems.push("blocked nextCommands must not include the A1 shape guard before A1 evidence is supplied");
  }
  if (report.nextCommands?.includes("cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route")) {
    problems.push("blocked nextCommands must not include the A1 PM classification route before A1 evidence is supplied");
  }
  const blockedAllowedCommands = new Set([
    "cmd.exe /c npm run report:public-beta-external-input-copy-packet",
    "cmd.exe /c npm run report:a1-twii-four-slot-reply-request"
  ]);
  for (const command of report.nextCommands ?? []) {
    if (!blockedAllowedCommands.has(command)) {
      problems.push(`blocked nextCommands should not expose non-request command: ${command}`);
    }
  }
  if (report.nextExecutableStep?.lane !== "external_input_copy_packet") {
    problems.push("nextExecutableStep should stay on external_input_copy_packet while both blocker groups are missing");
  }
  if (report.nextExecutableStep?.command !== "cmd.exe /c npm run report:public-beta-external-input-copy-packet") {
    problems.push("nextExecutableStep command should point to public beta external input copy packet while blocked");
  }
  if (
    report.nextExecutableStep?.afterSuccess !==
    "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
  ) {
    problems.push("nextExecutableStep afterSuccess should return to response-readiness");
  }
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
    "betaPlatformTwoValueValidator",
    "a1TwiiEvidenceResponseShape",
    "a1TwiiEvidenceCompletionStatus"
  ]) {
    if (!report.sourceReports?.[sourceReport]?.parsedJson) {
      problems.push(`sourceReports.${sourceReport} should parse`);
    }
  }
}

if (safePlatformRun.status !== 0 || !safePlatformReport) {
  problems.push("safe platform value response-readiness scenario should emit JSON");
} else {
  if (safePlatformReport.platformTwoValues?.status !== "accepted_two_value_shape_only") {
    problems.push("safe platform scenario should shape-accept the two platform values");
  }
  if (safePlatformReport.nextExecutableStep?.lane !== "pm_mainline_post_reply_packet_window") {
    problems.push("safe platform scenario should route nextExecutableStep to the combined post-reply packet window");
  }
  if (safePlatformReport.nextExecutableStep?.command !== "cmd.exe /c npm run run:public-beta-post-reply-route-once") {
    problems.push("safe platform scenario should route to the public Beta post-reply one-runner");
  }
  if (!safePlatformReport.nextCommands?.includes("cmd.exe /c npm run run:public-beta-post-reply-route-once")) {
    problems.push("safe platform scenario should include the public Beta post-reply one-runner in nextCommands");
  }
  if (safePlatformReport.nextCommands?.includes("cmd.exe /c npm run run:beta-platform-two-value-proof-map-once")) {
    problems.push("safe platform scenario should not expose the lower-level platform proof runner as the routine next command");
  }
  if (safePlatformReport.safety?.deploymentAuthorized !== false) {
    problems.push("safe platform scenario must not authorize deployment");
  }
  if (safePlatformReport.safety?.valuesStored !== false) {
    problems.push("safe platform scenario must not store platform values");
  }
  if (safePlatformReport.externalReplyChecklistStatus?.platformFieldsRequired?.length !== 0) {
    problems.push("safe platform scenario should not require platform fields after shape-accepted values");
  }
  if (safePlatformReport.missingOnlyReplyPacket?.blockCount !== 1) {
    problems.push("safe platform scenario should have one missing-only reply block for A1");
  }
  if (safePlatformReport.missingOnlyReplyPacket?.missingBlockIds?.includes("beta_platform_two_values")) {
    problems.push("safe platform scenario should not include beta platform values in missingOnlyReplyPacket");
  }
  if (!safePlatformReport.missingOnlyReplyPacket?.missingBlockIds?.includes("a1_twii_four_slot_no_secret_evidence")) {
    problems.push("safe platform scenario should keep A1 evidence in missingOnlyReplyPacket");
  }
}

if (a1ReadyRun.status !== 0 || !a1ReadyReport) {
  problems.push("A1 accepted-fixture response-readiness scenario should emit JSON");
} else {
  if (a1ReadyReport.status !== "a1_evidence_ready_platform_values_pending") {
    problems.push(`A1 accepted-fixture scenario should report a1_evidence_ready_platform_values_pending, got ${a1ReadyReport.status}`);
  }
  if (a1ReadyReport.a1TwiiFourSlotEvidence?.status !== "a1_twii_four_slot_evidence_ready_for_outcome_gate_route") {
    problems.push("A1 accepted-fixture scenario should mark A1 four-slot evidence ready");
  }
  if (a1ReadyReport.nextExecutableStep?.lane !== "a1_twii_source_rights_outcome_gate_candidate") {
    problems.push("A1 accepted-fixture scenario should route nextExecutableStep to A1 outcome-gate candidate");
  }
  if (a1ReadyReport.nextExecutableStep?.command !== "cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route") {
    problems.push("A1 accepted-fixture scenario should route to the A1 TWII outcome-gate candidate report");
  }
  if (!a1ReadyReport.nextCommands?.includes("cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route")) {
    problems.push("A1 accepted-fixture scenario should include the A1 outcome-gate candidate route");
  }
  if (!a1ReadyReport.nextCommands?.includes("cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once")) {
    problems.push("A1 accepted-fixture scenario should include the A1 post-reply one-runner after evidence is supplied");
  }
  if (!a1ReadyReport.nextCommands?.includes("cmd.exe /c npm run check:a1-twii-evidence-response-shape")) {
    problems.push("A1 accepted-fixture scenario should include the A1 shape guard after evidence is supplied");
  }
  if (a1ReadyReport.externalReplyChecklistStatus?.a1PendingSlotCount !== 0) {
    problems.push("A1 accepted-fixture scenario should report zero A1 pending slots");
  }
  if (a1ReadyReport.missingOnlyReplyPacket?.blockCount !== 1) {
    problems.push("A1 accepted-fixture scenario should have one missing-only reply block for platform values");
  }
  if (!a1ReadyReport.missingOnlyReplyPacket?.missingBlockIds?.includes("beta_platform_two_values")) {
    problems.push("A1 accepted-fixture scenario should keep platform values in missingOnlyReplyPacket");
  }
  if (a1ReadyReport.missingOnlyReplyPacket?.missingBlockIds?.includes("a1_twii_four_slot_no_secret_evidence")) {
    problems.push("A1 accepted-fixture scenario should not include A1 evidence in missingOnlyReplyPacket");
  }
  if (a1ReadyReport.safety?.evidenceRecorded !== false) {
    problems.push("A1 accepted-fixture scenario must not record evidence");
  }
  if (a1ReadyReport.safety?.rowCoverageAwarded !== false) {
    problems.push("A1 accepted-fixture scenario must not award row coverage");
  }
}

if (allReadyRun.status !== 0 || !allReadyReport) {
  problems.push("all-ready response-readiness scenario should emit JSON");
} else {
  if (allReadyReport.status !== "external_input_response_ready_for_packet_and_a1_outcome_gate") {
    problems.push(`all-ready scenario should report external_input_response_ready_for_packet_and_a1_outcome_gate, got ${allReadyReport.status}`);
  }
  if (allReadyReport.platformTwoValues?.status !== "accepted_two_value_shape_only") {
    problems.push("all-ready scenario should shape-accept platform values");
  }
  if (allReadyReport.a1TwiiFourSlotEvidence?.status !== "a1_twii_four_slot_evidence_ready_for_outcome_gate_route") {
    problems.push("all-ready scenario should mark A1 four-slot evidence ready");
  }
  if (allReadyReport.nextExecutableStep?.lane !== "pm_mainline_post_reply_packet_window") {
    problems.push("all-ready scenario should prioritize the PM mainline combined post-reply packet window next");
  }
  if (allReadyReport.nextExecutableStep?.command !== "cmd.exe /c npm run run:public-beta-post-reply-route-once") {
    problems.push("all-ready scenario should route to the public Beta post-reply one-runner");
  }
  if (allReadyReport.nextCommands?.includes("cmd.exe /c npm run run:beta-platform-two-value-proof-map-once")) {
    problems.push("all-ready scenario should not expose the lower-level platform proof runner as the routine next command");
  }
  if (!allReadyReport.nextCommands?.includes("cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route")) {
    problems.push("all-ready scenario should keep A1 outcome-gate candidate in nextCommands");
  }
  if (!allReadyReport.nextCommands?.includes("cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once")) {
    problems.push("all-ready scenario should include A1 post-reply one-runner after evidence is supplied");
  }
  if (allReadyReport.missingOnlyReplyPacket?.status !== "complete_no_missing_external_reply_blocks") {
    problems.push("all-ready scenario should mark missingOnlyReplyPacket complete");
  }
  if (allReadyReport.missingOnlyReplyPacket?.blockCount !== 0) {
    problems.push("all-ready scenario should have zero missing-only reply blocks");
  }
  if (!Array.isArray(allReadyReport.missingOnlyReplyPacket?.blocks) || allReadyReport.missingOnlyReplyPacket.blocks.length !== 0) {
    problems.push("all-ready scenario should have an empty missingOnlyReplyPacket.blocks array");
  }
  for (const [flag, expected] of Object.entries({
    deploymentAuthorized: false,
    evidenceRecorded: false,
    hostingMutated: false,
    marketDataFetched: false,
    rowCoverageAwarded: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    valuesStored: false
  })) {
    if (allReadyReport.safety?.[flag] !== expected) problems.push(`all-ready safety.${flag} must be ${String(expected)}`);
  }
}

if (read(ledgerPath) !== ledgerBefore) {
  problems.push("response-readiness fixtures must not modify the real A1 evidence ledger");
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
      guardedStatus: "public_beta_external_input_response_readiness_guard_ready",
      reportStatus: report.status,
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
            "Checker-only no-secret fixture summary for response-readiness route validation; no contract text, private links, raw payloads, row payloads, or credentials.",
          remainingRisk:
            "Execution remains blocked until PM opens and accepts a separate TWII source-rights outcome gate.",
          nextGateCandidate: "twii_source_rights_outcome_gate"
        }
        : outcome
    )
  };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "public-beta-response-a1-fixture-"));
  const filePath = path.join(dir, "a1-exact-source-rights-evidence-intake-outcomes.json");
  fs.writeFileSync(filePath, JSON.stringify(fixture, null, 2), "utf8");
  return filePath;
}
