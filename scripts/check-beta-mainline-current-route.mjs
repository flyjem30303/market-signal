import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-beta-mainline-current-route.mjs";
const checkPath = "scripts/check-beta-mainline-current-route.mjs";
const helperPath = "scripts/lib/public-beta-goal-readiness-rollup.mjs";
const docPath = "docs/BETA_MAINLINE_CURRENT_ROUTE_REPORT.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const missing = [];
const blocked = [];

for (const file of [reportPath, checkPath, helperPath, docPath, packagePath, reviewGatePath]) {
  if (!fs.existsSync(file)) missing.push(`${file}: file exists`);
}

const reportSource = read(reportPath);
const helperSource = read(helperPath);
const doc = read(docPath);
const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredReportPhrases = [
  "keep_beta_mainline_moving_with_a1_a2_parallel_routes",
  "report:beta-platform-unblock-kit",
  "report:beta-launch-next-action",
  "pmRouteRouter",
  "buildPmRouteRouter",
  "a1FourSlotEvidence",
  "collect_a1_twii_four_slot_no_secret_evidence_then_response_readiness_and_pm_classify",
  "run:public-beta-post-reply-route-once",
  "report:a1-source-rights-next-action",
  "report:a1-source-rights-readiness-summary",
  "report:a1-exact-source-rights-evidence-worksheet",
  "check:a1-twii-evidence-intake-mini-packet",
  "report:a1-twii-four-slot-reply-request",
  "report:a1-twii-evidence-completion-status",
  "completionStatus",
  "pmClassificationQueue",
  "pmQueueRule",
  "pmOneRunnerCommand",
  "pmIntakeShortcut",
  "ninety_second_pm_intake",
  "report:a1-source-rights-evidence-batch-brief",
  "replyRequest",
  "pmClassificationRoute",
  "pmIntakeDecisionSummary",
  "report:a1-twii-pm-intake-decision-summary",
  "request_a1_bounded_no_secret_repairs_before_pm_classification",
  "classificationOptions",
  "report:a1-twii-evidence-pm-classification-route",
  "externalInputRequest",
  "pmOneScreenReplyPacket",
  "pmCopyableReplyChecklist",
  "pmReplyPacketContract",
  "pm_reply_packet_contract_ready",
  "completeReplyRequires",
  "forbiddenContent",
  "report:public-beta-external-input-request",
  "report:public-beta-external-input-response-readiness",
  "two_reply_blocks_no_secret",
  "beta_platform_two_values",
  "a1_twii_four_slot_no_secret_evidence",
  "report:a1-source-rights-reviewed-outcome-surface",
  "judgementSummary",
  "pmNarrowRequest",
  "four_slot_no_secret_reply",
  "report:a2-public-copy-readability-candidates",
  "check:public-beta-core-route-quick-proof",
  "report:public-beta-mock-launch-proof-bundle",
  "mockLaunchProofBundle",
  "remainingBlockers",
  "report:beta-launch-remaining-blockers",
  "postReplyOneRunnerProof",
  "focused_gate_registered_lightweight_proof_summary",
  "check:public-beta-post-reply-route-once",
  "a1PmIntakeDecisionSummary",
  "report:pm-worktree-review-preflight",
  "buildPublicBetaGoalReadinessRollup",
  "goalReadiness",
  "coreRouteQuickProof",
  "pmWorktreeReview",
  "buildWorktreeSafeguardSummary",
  "recommendedPmOutcome",
  "canProceedToBackupDecision",
  "safeguardReady",
  "hardBlocker",
  "packetCandidateBlocker",
  "git_snapshot_is_recommended_safeguard_not_current_public_beta_hard_blocker",
  "collect_external_input_response_then_run_public_beta_post_reply_one_runner",
  "excludedFromBetaLaunchPacket",
  "blocked_waiting_two_platform_values",
  "blocked_waiting_external_input_response",
  "ready_to_run_beta_packet_window_proof_map",
  "ready_to_render_pre_execution_packet_candidate",
  "platform_values_are_the_only_pm_mainline_external_blocker",
  "platform_values_and_a1_twii_evidence_are_the_current_external_blockers",
  "refresh_focused_local_runtime_proof_only_when_runtime_or_route_health_changed",
  "keep_a1_on_twii_four_slot_no_secret_evidence_request",
  "keep_a2_on_urgent_public_copy_regression_repairs_only",
  "do_not_reopen_broad_deployment_governance",
  "do_not_expand_a2_visual_polish_before_platform_values",
  "do_not_create_packet_window_artifact_before_the_combined_post_reply_one_runner_reaches_pm_review",
  "No deployment is authorized by this report.",
  "No platform environment value is printed by this report.",
  "No SQL is executed by this report.",
  "No Supabase connection, read, or write is executed by this report.",
  "No raw market data is fetched, stored, ingested, or committed by this report.",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
];

const requiredHelperPhrases = [
  "public_beta_goal_readiness_rollup",
  "public_beta_goal_not_ready_continue_parallel_work",
  "runtime_core_routes",
  "beta_platform_values_and_packet",
  "a1_source_rights_and_coverage_frontier",
  "parallelRoutes.a1.replyRequest",
  "report:public-beta-external-input-request",
  "a2_public_trust_copy",
  "promotion_boundary",
  "deploymentAuthorized: false",
  "marketDataFetched: false",
  "supabaseReadsEnabled: false",
  "supabaseWritesEnabled: false"
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

for (const phrase of requiredHelperPhrases) {
  if (!helperSource.includes(phrase)) missing.push(`${helperPath}: ${phrase}`);
}

for (const phrase of forbiddenReportPhrases) {
  if (reportSource.includes(phrase) || helperSource.includes(phrase)) {
    blocked.push(`${reportPath}/${helperPath}: forbidden phrase ${phrase}`);
  }
}

const requiredDocPhrases = [
  "Status: `beta_mainline_current_route_report_ready`",
  "CEO decision: `keep_beta_mainline_moving_with_a1_a2_parallel_routes`",
  "cmd.exe /c npm run report:beta-mainline-current-route",
  "cmd.exe /c npm run check:beta-mainline-current-route",
  "cmd.exe /c npm run check:public-beta-core-route-quick-proof",
  "cmd.exe /c npm run report:pm-worktree-review-preflight",
  "cmd.exe /c npm run report:beta-launch-next-action",
  "cmd.exe /c npm run report:public-beta-external-input-request",
  "pmRouteRouter",
  "externalInputRequest",
  "externalInputRequest.pmOneScreenReplyPacket",
  "externalInputRequest.pmReplyPacketContract",
  "Block 1 - Beta platform two values",
  "Block 2 - A1 TWII four-slot no-secret evidence",
  "`vendor-terms-evidence`",
  "`internal-feed-owner-evidence`",
  "`field-contract-evidence`",
  "`asset-mapping-evidence`",
  "Fail-fast rule",
  "Status: `pm_reply_packet_contract_ready`",
  "Forbidden content",
  "First command after any reply",
  "One-runner after shape-safe reply",
  "A1 one-runner after evidence reply",
  "`response_readiness_routes_to_post_reply_one_runner`",
  "promoting `publicDataSource` / `scoreSource`",
  "beta_platform_two_values",
  "a1_twii_four_slot_no_secret_evidence",
  "check:a1-twii-evidence-response-shape",
  "report:a1-twii-evidence-pm-classification-route",
  "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
  "goalReadiness",
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
      "blocked_waiting_external_input_response",
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
    if (!replyTemplate.includes("BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>")) {
      missing.push("report.platformOperatorHandoff.replyTemplate project placeholder");
    }
    if (!replyTemplate.includes("BETA_TEMPORARY_URL=https://<public-beta-hostname>/")) {
      missing.push("report.platformOperatorHandoff.replyTemplate url placeholder");
    }
  }
  if (report.platformOperatorHandoff?.valuesAreNotStoredInRepo !== true) {
    blocked.push("report.platformOperatorHandoff.valuesAreNotStoredInRepo must be true");
  }
  if (
    report.platformOperatorHandoff?.nextResponseReadinessCommand !==
    "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
  ) {
    blocked.push("report.platformOperatorHandoff.nextResponseReadinessCommand must route to response-readiness");
  }
  if (report.platformOperatorHandoff?.nextValidationCommand) {
    blocked.push("report.platformOperatorHandoff.nextValidationCommand must not be exposed as the routine PM next command");
  }
  if (report.platformOperatorHandoff?.diagnosticValidationCommand !== "cmd.exe /c npm run validate:beta-platform-two-values") {
    blocked.push("report.platformOperatorHandoff.diagnosticValidationCommand must retain the two-value validator as diagnostics");
  }
  if (
    report.platformOperatorHandoff?.postReplyOnceRunnerCommand !==
    "cmd.exe /c npm run run:public-beta-post-reply-route-once"
  ) {
    blocked.push("report.platformOperatorHandoff.postReplyOnceRunnerCommand must route to the public Beta post-reply one-runner");
  }
  if (report.platformOperatorHandoff?.afterValuesCommand !== "cmd.exe /c npm run run:public-beta-post-reply-route-once") {
    missing.push("report.platformOperatorHandoff.afterValuesCommand");
  }
  if (!report.platformOperatorHandoff?.afterProofMapCommand?.includes("record:beta-packet-window-reviewed-artifact-outcome")) {
    missing.push("report.platformOperatorHandoff.afterProofMapCommand");
  }
  if (!report.platformOperatorHandoff?.afterProofMapCommand?.includes("--dry-run")) {
    blocked.push("report.platformOperatorHandoff.afterProofMapCommand must be dry-run until PM explicitly accepts apply");
  }
  if (report.platformOperatorHandoff?.afterProofMapCommand?.includes("--apply")) {
    blocked.push("report.platformOperatorHandoff.afterProofMapCommand must not expose routine apply");
  }
  if (!Array.isArray(report.stopLines) || report.stopLines.length < 9) missing.push("report.stopLines");
  if (!report.pmMainline?.nextCommand) missing.push("report.pmMainline.nextCommand");
  if (!report.pmRouteRouter) {
    missing.push("report.pmRouteRouter");
  } else {
    if (report.pmRouteRouter.command !== "cmd.exe /c npm run report:beta-launch-next-action") {
      blocked.push("report.pmRouteRouter.command must point to the beta launch next-action router");
    }
    if (report.pmRouteRouter.pmCommand !== "cmd.exe /c npm run report:public-beta-external-input-copy-packet") {
      blocked.push("report.pmRouteRouter.pmCommand must keep the external-input copy packet as the missing-value route");
    }
    if (
      ![
        "cmd.exe /c npm run report:public-beta-external-input-request",
        "cmd.exe /c npm run render:beta-pre-execution-packet-candidate"
      ].includes(report.pmRouteRouter.fallbackFullRequestCommand)
    ) {
      blocked.push("report.pmRouteRouter.fallbackFullRequestCommand must keep either the full external-input request or accepted-artifact packet candidate renderer as fallback");
    }
    if (
      ![
        "collect_a1_twii_four_slot_no_secret_evidence_then_response_readiness_and_pm_classify",
        "resolve_a1_twii_two_blocked_two_bounded_repair_slots_before_outcome_gate"
      ].includes(report.pmRouteRouter.a1NextAction)
    ) {
      blocked.push("report.pmRouteRouter.a1NextAction must stay narrowed to A1 TWII source-rights evidence or repair");
    }
    if (
      ![
        "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
        "cmd.exe /c npm run report:a1-twii-pm-intake-decision-summary"
      ].includes(report.pmRouteRouter.a1Command)
    ) {
      blocked.push("report.pmRouteRouter.a1Command must point to the A1 four-slot reply request or PM intake decision summary");
    }
    if (report.pmRouteRouter.a1FourSlotEvidence?.pendingEvidenceCount !== 0) {
      blocked.push("report.pmRouteRouter.a1FourSlotEvidence.pendingEvidenceCount must currently be 0 after PM review");
    }
    if (report.pmRouteRouter.a1FourSlotEvidence?.blockedEvidenceCount !== 0) {
      blocked.push("report.pmRouteRouter.a1FourSlotEvidence.blockedEvidenceCount must currently be 0 after PM downgraded hard blocks to bounded repairs");
    }
    if (report.pmRouteRouter.a1FourSlotEvidence?.needsBoundedRepairCount !== 4) {
      blocked.push("report.pmRouteRouter.a1FourSlotEvidence.needsBoundedRepairCount must currently be 4");
    }
    if (report.pmRouteRouter.a1FourSlotEvidence?.requiredEvidenceCount !== 4) {
      blocked.push("report.pmRouteRouter.a1FourSlotEvidence.requiredEvidenceCount must be 4");
    }
    if (
      report.pmRouteRouter.a1FourSlotEvidence?.afterReplyFirstCommand !==
      "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
    ) {
      blocked.push("report.pmRouteRouter.a1FourSlotEvidence.afterReplyFirstCommand must route through response-readiness first");
    }
    for (const flag of [
      "deploymentAuthorized",
      "evidenceRecorded",
      "marketDataFetched",
      "scoreSourceRealEnabled",
      "secretsPrinted",
      "sqlExecuted",
      "supabaseWritesEnabled"
    ]) {
      if (report.pmRouteRouter.safety?.[flag] !== false) {
        blocked.push(`report.pmRouteRouter.safety.${flag} must remain false`);
      }
    }
  }
  if (!report.externalInputRequest) missing.push("report.externalInputRequest");
  if (report.externalInputRequest) {
    if (report.externalInputRequest.status !== "public_beta_external_input_request_ready") {
      blocked.push("report.externalInputRequest.status must be public_beta_external_input_request_ready");
    }
    if (report.externalInputRequest.command !== "cmd.exe /c npm run report:public-beta-external-input-copy-packet") {
      blocked.push("report.externalInputRequest.command must route to the public Beta external input copy packet");
    }
    if (report.externalInputRequest.fallbackFullRequestCommand !== "cmd.exe /c npm run report:public-beta-external-input-request") {
      blocked.push("report.externalInputRequest.fallbackFullRequestCommand must keep the full request as fallback");
    }
    if (!report.externalInputRequest.replyIntakeDryRun) {
      missing.push("report.externalInputRequest.replyIntakeDryRun");
    } else {
      if (
        report.externalInputRequest.replyIntakeDryRun.a1PmPreviewCommand !==
        "cmd.exe /c npm run report:public-beta-a1-reply-pm-classification-preview"
      ) {
        blocked.push("report.externalInputRequest.replyIntakeDryRun.a1PmPreviewCommand must route to the A1 PM classification preview");
      }
      if (report.externalInputRequest.replyIntakeDryRun.command !== "cmd.exe /c npm run report:public-beta-external-reply-intake-dry-run") {
        blocked.push("report.externalInputRequest.replyIntakeDryRun.command must route to the external reply intake dry-run");
      }
      if (
        report.externalInputRequest.replyIntakeDryRun.routeCommand !==
        "cmd.exe /c npm run report:public-beta-external-reply-file-route"
      ) {
        blocked.push("report.externalInputRequest.replyIntakeDryRun.routeCommand must route to the external reply file route");
      }
      if (report.externalInputRequest.replyIntakeDryRun.requiredEnvVar !== "PUBLIC_BETA_EXTERNAL_REPLY_PATH") {
        blocked.push("report.externalInputRequest.replyIntakeDryRun.requiredEnvVar must be PUBLIC_BETA_EXTERNAL_REPLY_PATH");
      }
      if (
        report.externalInputRequest.replyIntakeDryRun.templateCommand !==
        "cmd.exe /c npm run report:public-beta-external-reply-file-template"
      ) {
        blocked.push("report.externalInputRequest.replyIntakeDryRun.templateCommand must route to the external reply file template");
      }
      if (
        report.externalInputRequest.replyIntakeDryRun.workflowProofCommand !==
        "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof"
      ) {
        blocked.push("report.externalInputRequest.replyIntakeDryRun.workflowProofCommand must route to the external reply file workflow proof");
      }
      if (report.externalInputRequest.replyIntakeDryRun.fileTextEchoed !== false) {
        blocked.push("report.externalInputRequest.replyIntakeDryRun.fileTextEchoed must be false");
      }
      if (report.externalInputRequest.replyIntakeDryRun.valueEchoed !== false) {
        blocked.push("report.externalInputRequest.replyIntakeDryRun.valueEchoed must be false");
      }
      if (
        report.externalInputRequest.replyIntakeDryRun.completeReplyNextCommand !==
        "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof"
      ) {
        blocked.push("report.externalInputRequest.replyIntakeDryRun.completeReplyNextCommand must route to the external reply file workflow proof");
      }
      if (report.externalInputRequest.replyIntakeDryRun.unsafeReplyFallbackCommand !== "cmd.exe /c npm run report:public-beta-external-input-copy-packet") {
        blocked.push("report.externalInputRequest.replyIntakeDryRun.unsafeReplyFallbackCommand must return to the copy packet");
      }
    }
    if (report.externalInputRequest.mode !== "two_reply_blocks_no_secret") {
      blocked.push("report.externalInputRequest.mode must be two_reply_blocks_no_secret");
    }
    if (!Array.isArray(report.externalInputRequest.requestBlocks) || report.externalInputRequest.requestBlocks.length !== 2) {
      missing.push("report.externalInputRequest.requestBlocks");
    }
    if (!report.externalInputRequest.pmCopyableReplyChecklist) {
      missing.push("report.externalInputRequest.pmCopyableReplyChecklist");
    }
    if (!report.externalInputRequest.pmOneScreenReplyPacket) {
      missing.push("report.externalInputRequest.pmOneScreenReplyPacket");
    }
    if (!report.externalInputRequest.pmReplyPacketContract) {
      missing.push("report.externalInputRequest.pmReplyPacketContract");
    }
    const externalBlocks = new Map(report.externalInputRequest.requestBlocks?.map((block) => [block.id, block]) ?? []);
    const platformBlock = externalBlocks.get("beta_platform_two_values");
    const a1Block = externalBlocks.get("a1_twii_four_slot_no_secret_evidence");
    if (!platformBlock) missing.push("report.externalInputRequest.requestBlocks.beta_platform_two_values");
    if (!a1Block) missing.push("report.externalInputRequest.requestBlocks.a1_twii_four_slot_no_secret_evidence");
    if (!platformBlock?.requiredFields?.includes("BETA_HOSTING_PROJECT_NAME")) {
      missing.push("report.externalInputRequest.platform.requiredFields.BETA_HOSTING_PROJECT_NAME");
    }
    if (!platformBlock?.requiredFields?.includes("BETA_TEMPORARY_URL")) {
      missing.push("report.externalInputRequest.platform.requiredFields.BETA_TEMPORARY_URL");
    }
    if (!report.externalInputRequest.pmCopyableReplyChecklist?.platformLines?.some((line) => line.startsWith("BETA_HOSTING_PROJECT_NAME="))) {
      missing.push("report.externalInputRequest.pmCopyableReplyChecklist.platformLines.BETA_HOSTING_PROJECT_NAME");
    }
    if (!report.externalInputRequest.pmCopyableReplyChecklist?.platformLines?.some((line) => line.startsWith("BETA_TEMPORARY_URL=https://"))) {
      missing.push("report.externalInputRequest.pmCopyableReplyChecklist.platformLines.BETA_TEMPORARY_URL");
    }
    if (!platformBlock?.afterReply?.includes("cmd.exe /c npm run report:public-beta-external-input-response-readiness")) {
      missing.push("report.externalInputRequest.platform.afterReply.responseReadiness");
    }
    if (!platformBlock?.afterReply?.includes("cmd.exe /c npm run run:public-beta-post-reply-route-once")) {
      missing.push("report.externalInputRequest.platform.afterReply.publicBetaPostReplyOneRunner");
    }
    for (const field of ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]) {
      if (!a1Block?.requiredFields?.includes(field)) {
        missing.push(`report.externalInputRequest.a1.requiredFields.${field}`);
      }
      if (!report.externalInputRequest.pmCopyableReplyChecklist?.a1RequiredPerSlot?.includes(field)) {
        missing.push(`report.externalInputRequest.pmCopyableReplyChecklist.a1RequiredPerSlot.${field}`);
      }
    }
    for (const slot of [
      "vendor-terms-evidence",
      "internal-feed-owner-evidence",
      "field-contract-evidence",
      "asset-mapping-evidence"
    ]) {
      if (!a1Block?.pendingSlotIds?.includes(slot)) {
        missing.push(`report.externalInputRequest.a1.pendingSlotIds.${slot}`);
      }
      if (!report.externalInputRequest.pmCopyableReplyChecklist?.a1SlotIds?.includes(slot)) {
        missing.push(`report.externalInputRequest.pmCopyableReplyChecklist.a1SlotIds.${slot}`);
      }
    }
    if (
      report.externalInputRequest.pmCopyableReplyChecklist?.afterAnyReplyFirstCommand !==
      "cmd.exe /c npm run report:public-beta-external-reply-file-route"
    ) {
      blocked.push("report.externalInputRequest.pmCopyableReplyChecklist.afterAnyReplyFirstCommand must be external reply file route");
    }
    if (
      report.externalInputRequest.pmCopyableReplyChecklist?.fallbackResponseReadinessCommand !==
      "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
    ) {
      blocked.push("report.externalInputRequest.pmCopyableReplyChecklist.fallbackResponseReadinessCommand must be response-readiness");
    }
    if (report.externalInputRequest.pmOneScreenReplyPacket) {
      const oneScreen = report.externalInputRequest.pmOneScreenReplyPacket;
      if (!oneScreen.platformBlock?.lines?.some((line) => line.startsWith("BETA_HOSTING_PROJECT_NAME="))) {
        missing.push("report.externalInputRequest.pmOneScreenReplyPacket.platformBlock.BETA_HOSTING_PROJECT_NAME");
      }
      if (!oneScreen.platformBlock?.lines?.some((line) => line.startsWith("BETA_TEMPORARY_URL=https://"))) {
        missing.push("report.externalInputRequest.pmOneScreenReplyPacket.platformBlock.BETA_TEMPORARY_URL");
      }
      if (!oneScreen.platformBlock?.afterReply?.includes("cmd.exe /c npm run report:public-beta-external-input-response-readiness")) {
        missing.push("report.externalInputRequest.pmOneScreenReplyPacket.platformBlock.afterReply.responseReadiness");
      }
      if (!oneScreen.platformBlock?.afterReply?.includes("cmd.exe /c npm run run:public-beta-post-reply-route-once")) {
        missing.push("report.externalInputRequest.pmOneScreenReplyPacket.platformBlock.afterReply.publicBetaOneRunner");
      }
      for (const slot of [
        "vendor-terms-evidence",
        "internal-feed-owner-evidence",
        "field-contract-evidence",
        "asset-mapping-evidence"
      ]) {
        if (!oneScreen.a1Block?.pendingSlotIds?.includes(slot)) {
          missing.push(`report.externalInputRequest.pmOneScreenReplyPacket.a1Block.pendingSlotIds.${slot}`);
        }
      }
      for (const field of ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]) {
        if (!oneScreen.a1Block?.requiredPerSlot?.includes(field)) {
          missing.push(`report.externalInputRequest.pmOneScreenReplyPacket.a1Block.requiredPerSlot.${field}`);
        }
      }
      if (!oneScreen.a1Block?.afterReply?.includes("cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once")) {
        missing.push("report.externalInputRequest.pmOneScreenReplyPacket.a1Block.afterReply.a1OneRunner");
      }
      if (
        oneScreen.a1Block?.failFastRule !==
        "If any A1 TWII slot is still missing, the one-runner stops after response-readiness and returns to report:a1-twii-four-slot-reply-request."
      ) {
        blocked.push("report.externalInputRequest.pmOneScreenReplyPacket.a1Block.failFastRule must describe A1 fail-fast behavior");
      }
      if (!oneScreen.completeWhen?.includes("response-readiness passes before the post-reply runner")) {
        missing.push("report.externalInputRequest.pmOneScreenReplyPacket.completeWhen.responseReadiness");
      }
    }
    for (const boundary of [
      "do_not_print_or_store_platform_values_in_repo",
      "do_not_record_a1_evidence_from_this_report",
      "do_not_approve_source_rights_from_this_report",
      "do_not_deploy_from_this_report"
    ]) {
      if (!report.externalInputRequest.pmCopyableReplyChecklist?.stillNotAllowed?.includes(boundary)) {
        missing.push(`report.externalInputRequest.pmCopyableReplyChecklist.stillNotAllowed.${boundary}`);
      }
    }
    if (report.externalInputRequest.pmReplyPacketContract) {
      const contract = report.externalInputRequest.pmReplyPacketContract;
      if (contract.status !== "pm_reply_packet_contract_ready") {
        blocked.push("report.externalInputRequest.pmReplyPacketContract.status must be ready");
      }
      if (!Array.isArray(contract.completeReplyRequires) || contract.completeReplyRequires.length !== 2) {
        missing.push("report.externalInputRequest.pmReplyPacketContract.completeReplyRequires");
      }
      const contractBlocks = new Map(contract.completeReplyRequires?.map((block) => [block.blockId, block]) ?? []);
      const platformContract = contractBlocks.get("beta_platform_two_values");
      const a1Contract = contractBlocks.get("a1_twii_four_slot_no_secret_evidence");
      if (!platformContract?.requiredFields?.includes("BETA_HOSTING_PROJECT_NAME")) {
        missing.push("report.externalInputRequest.pmReplyPacketContract.platform.BETA_HOSTING_PROJECT_NAME");
      }
      if (!platformContract?.requiredFields?.includes("BETA_TEMPORARY_URL")) {
        missing.push("report.externalInputRequest.pmReplyPacketContract.platform.BETA_TEMPORARY_URL");
      }
      if (a1Contract?.requiredSlotCount !== 4) {
        blocked.push("report.externalInputRequest.pmReplyPacketContract.a1.requiredSlotCount must be 4");
      }
      for (const field of ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]) {
        if (!a1Contract?.requiredFieldsPerSlot?.includes(field)) {
          missing.push(`report.externalInputRequest.pmReplyPacketContract.a1.requiredFieldsPerSlot.${field}`);
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
        if (!contract.forbiddenContent?.includes(forbidden)) {
          missing.push(`report.externalInputRequest.pmReplyPacketContract.forbiddenContent.${forbidden}`);
        }
      }
      if (
        contract.firstCommandAfterAnyReply !==
        "cmd.exe /c npm run report:public-beta-external-reply-file-route"
      ) {
        blocked.push("report.externalInputRequest.pmReplyPacketContract.firstCommandAfterAnyReply must be external reply file route");
      }
      if (
        contract.fallbackResponseReadinessCommand !==
        "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
      ) {
        blocked.push("report.externalInputRequest.pmReplyPacketContract.fallbackResponseReadinessCommand must be response-readiness");
      }
      if (contract.oneRunnerAfterShapeSafeReply !== "cmd.exe /c npm run run:public-beta-post-reply-route-once") {
        blocked.push("report.externalInputRequest.pmReplyPacketContract.oneRunnerAfterShapeSafeReply must be public Beta one-runner");
      }
      if (
        contract.a1OneRunnerAfterEvidenceReply !==
        "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once"
      ) {
        blocked.push("report.externalInputRequest.pmReplyPacketContract.a1OneRunnerAfterEvidenceReply must be A1 one-runner");
      }
      for (const signal of [
        "platform_two_values_shape_valid",
        "a1_four_twii_slots_present_in_no_secret_shape",
        "response_readiness_routes_to_post_reply_one_runner"
      ]) {
        if (!contract.doneSignals?.includes(signal)) {
          missing.push(`report.externalInputRequest.pmReplyPacketContract.doneSignals.${signal}`);
        }
      }
      for (const boundary of [
        "do_not_store_platform_values_in_repo",
        "do_not_record_a1_evidence_from_this_request",
        "do_not_deploy_from_this_request",
        "do_not_promote_publicDataSource_or_scoreSource_from_this_request"
      ]) {
        if (!contract.stillNotAllowed?.includes(boundary)) {
          missing.push(`report.externalInputRequest.pmReplyPacketContract.stillNotAllowed.${boundary}`);
        }
      }
    }
    if (!a1Block?.afterReply?.includes("cmd.exe /c npm run check:a1-twii-evidence-response-shape")) {
      missing.push("report.externalInputRequest.a1.afterReply.shapeGuard");
    }
    if (!a1Block?.afterReply?.includes("cmd.exe /c npm run report:public-beta-external-input-response-readiness")) {
      missing.push("report.externalInputRequest.a1.afterReply.responseReadiness");
    }
    for (const flag of [
      "deploymentAuthorized",
      "evidenceRecorded",
      "hostingMutated",
      "marketDataFetched",
      "rawPayloadPrinted",
      "scoreSourceRealEnabled",
      "secretsPrinted",
      "sqlExecuted",
      "supabaseReadsEnabled",
      "supabaseWritesEnabled",
      "valuesStored"
    ]) {
      if (report.externalInputRequest.safety?.[flag] !== false) {
        blocked.push(`report.externalInputRequest.safety.${flag} must remain false`);
      }
    }
  }
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
  if (!report.coreRouteQuickProof) missing.push("report.coreRouteQuickProof");
  if (report.coreRouteQuickProof?.status !== "ok") {
    blocked.push("report.coreRouteQuickProof.status must be ok");
  }
  if (report.coreRouteQuickProof?.routeCount !== 9) {
    blocked.push("report.coreRouteQuickProof.routeCount must be 9");
  }
  if (report.coreRouteQuickProof?.allRoutesHttp200 !== true) {
    blocked.push("report.coreRouteQuickProof.allRoutesHttp200 must be true");
  }
  if (report.coreRouteQuickProof?.missingCount !== 0) {
    blocked.push("report.coreRouteQuickProof.missingCount must be 0");
  }
  if (report.coreRouteQuickProof?.blockedCount !== 0) {
    blocked.push("report.coreRouteQuickProof.blockedCount must be 0");
  }
  if (report.coreRouteQuickProof?.runtimeBoundary?.publicDataSource !== "mock") {
    blocked.push("report.coreRouteQuickProof.runtimeBoundary.publicDataSource must be mock");
  }
  if (report.coreRouteQuickProof?.runtimeBoundary?.scoreSource !== "mock") {
    blocked.push("report.coreRouteQuickProof.runtimeBoundary.scoreSource must be mock");
  }
  if (!report.mockLaunchProofBundle) missing.push("report.mockLaunchProofBundle");
  if (report.mockLaunchProofBundle?.status !== "public_beta_mock_launch_proof_bundle_ready_external_inputs_pending") {
    blocked.push("report.mockLaunchProofBundle.status must be public_beta_mock_launch_proof_bundle_ready_external_inputs_pending");
  }
  if (report.mockLaunchProofBundle?.ok !== true) {
    blocked.push("report.mockLaunchProofBundle.ok must be true");
  }
  if (report.mockLaunchProofBundle?.checkedCount !== 6) {
    blocked.push("report.mockLaunchProofBundle.checkedCount must be 6");
  }
  if (report.mockLaunchProofBundle?.allRequiredChecksPassed !== true) {
    blocked.push("report.mockLaunchProofBundle.allRequiredChecksPassed must be true");
  }
  if (report.mockLaunchProofBundle?.remainingHardBlockers !== 2) {
    blocked.push("report.mockLaunchProofBundle.remainingHardBlockers must be 2");
  }
  if (
    report.mockLaunchProofBundle?.nextAction !==
    "use_single_external_input_request_then_response_readiness"
  ) {
    blocked.push("report.mockLaunchProofBundle.nextAction must route to single external-input request");
  }
  if (report.mockLaunchProofBundle?.nextExecutableStep?.lane !== "external_input_request") {
    missing.push("report.mockLaunchProofBundle.nextExecutableStep external input lane");
  }
  if (!report.mockLaunchProofBundle?.nextCommands?.includes("cmd.exe /c npm run report:public-beta-external-input-request")) {
    missing.push("report.mockLaunchProofBundle.nextCommands public beta external input request");
  }
  if (!report.mockLaunchProofBundle?.nextCommands?.includes("cmd.exe /c npm run report:public-beta-external-input-response-readiness")) {
    missing.push("report.mockLaunchProofBundle.nextCommands public beta external input response readiness");
  }
  if (report.mockLaunchProofBundle?.runtimeBoundary?.publicDataSource !== "mock") {
    blocked.push("report.mockLaunchProofBundle.runtimeBoundary.publicDataSource must be mock");
  }
  if (report.mockLaunchProofBundle?.runtimeBoundary?.scoreSource !== "mock") {
    blocked.push("report.mockLaunchProofBundle.runtimeBoundary.scoreSource must be mock");
  }
  if (!report.remainingBlockers) {
    missing.push("report.remainingBlockers");
  } else {
    if (report.remainingBlockers.status !== "blocked_waiting_two_public_beta_inputs") {
      blocked.push("report.remainingBlockers.status must show current public Beta inputs are still blocking");
    }
    if (report.remainingBlockers.blockerCount !== 2) {
      blocked.push("report.remainingBlockers.blockerCount must be 2 after Git is classified as safeguard-ready");
    }
    if (report.remainingBlockers.nextBestAction !== "collect_two_safe_beta_platform_values") {
      blocked.push("report.remainingBlockers.nextBestAction must keep platform values as first hard blocker");
    }
    for (const id of ["pm_git_snapshot_or_backup", "beta_platform_two_values", "a1_twii_four_slot_evidence"]) {
      if (!report.remainingBlockers.blockers?.some((blocker) => blocker.id === id)) {
        missing.push(`report.remainingBlockers.blockers.${id}`);
      }
    }
    if (
      report.remainingBlockers.a1PmIntakeDecisionSummary?.currentDecision !==
      "request_a1_bounded_no_secret_repairs_before_pm_classification"
    ) {
      blocked.push("report.remainingBlockers.a1PmIntakeDecisionSummary.currentDecision must route to bounded no-secret repairs");
    }
    if (report.remainingBlockers.a1PmIntakeDecisionSummary?.pendingCount !== 4) {
      blocked.push("report.remainingBlockers.a1PmIntakeDecisionSummary.pendingCount must be 4");
    }
    if (report.remainingBlockers.a1PmIntakeDecisionSummary?.repairRequestCount !== 4) {
      blocked.push("report.remainingBlockers.a1PmIntakeDecisionSummary.repairRequestCount must be 4");
    }
    if (!report.remainingBlockers.postReplyOneRunnerProof) {
      missing.push("report.remainingBlockers.postReplyOneRunnerProof");
    } else {
      if (report.remainingBlockers.postReplyOneRunnerProof.status !== "focused_gate_registered_lightweight_proof_summary") {
        blocked.push("report.remainingBlockers.postReplyOneRunnerProof.status must be lightweight proof summary");
      }
      if (report.remainingBlockers.postReplyOneRunnerProof.focusedGateName !== "public-beta-post-reply-route-once") {
        blocked.push("report.remainingBlockers.postReplyOneRunnerProof.focusedGateName must be public-beta-post-reply-route-once");
      }
      if (
        report.remainingBlockers.postReplyOneRunnerProof.proofCommand !==
        "cmd.exe /c npm run check:public-beta-post-reply-route-once"
      ) {
        blocked.push("report.remainingBlockers.postReplyOneRunnerProof.proofCommand must point to focused proof checker");
      }
      if (
        report.remainingBlockers.postReplyOneRunnerProof.routineRunnerCommand !==
        "cmd.exe /c npm run run:public-beta-post-reply-route-once"
      ) {
        blocked.push("report.remainingBlockers.postReplyOneRunnerProof.routineRunnerCommand must point to the one-runner");
      }
      if (
        report.remainingBlockers.postReplyOneRunnerProof.safePlatformFixtureScenario?.expectedStatus !==
        "public_beta_post_reply_route_ready_for_packet_review_a1_pending"
      ) {
        blocked.push("report.remainingBlockers.postReplyOneRunnerProof should preserve the safe-platform/A1-pending path");
      }
      if (
        !report.remainingBlockers.postReplyOneRunnerProof.safePlatformFixtureScenario?.expectedPacketReviewCommand?.includes(
          "record:beta-packet-window-reviewed-artifact-outcome -- --dry-run"
        )
      ) {
        blocked.push("report.remainingBlockers.postReplyOneRunnerProof should keep packet review dry-run only");
      }
      if (report.remainingBlockers.postReplyOneRunnerProof.valuesAreFixtureOnly !== true) {
        blocked.push("report.remainingBlockers.postReplyOneRunnerProof.valuesAreFixtureOnly must be true");
      }
      if (report.remainingBlockers.postReplyOneRunnerProof.ledgerModified !== false) {
        blocked.push("report.remainingBlockers.postReplyOneRunnerProof.ledgerModified must be false");
      }
    }
    if (report.remainingBlockers.runtimeBoundary?.publicDataSource !== "mock") {
      blocked.push("report.remainingBlockers.runtimeBoundary.publicDataSource must remain mock");
    }
    if (report.remainingBlockers.runtimeBoundary?.scoreSource !== "mock") {
      blocked.push("report.remainingBlockers.runtimeBoundary.scoreSource must remain mock");
    }
  }
  if (!report.pmWorktreeReview) missing.push("report.pmWorktreeReview");
  if (!["pm_review_required_before_packet_creation", "clean_worktree_ready_for_packet_creation"].includes(report.pmWorktreeReview?.status)) {
    blocked.push("report.pmWorktreeReview.status must be a known worktree review status");
  }
  if (report.pmWorktreeReview?.runtimeBoundary?.publicDataSource !== "mock") {
    blocked.push("report.pmWorktreeReview.runtimeBoundary.publicDataSource must be mock");
  }
  if (report.pmWorktreeReview?.runtimeBoundary?.scoreSource !== "mock") {
    blocked.push("report.pmWorktreeReview.runtimeBoundary.scoreSource must be mock");
  }
  if (typeof report.pmWorktreeReview?.totalChangedFiles !== "number") {
    missing.push("report.pmWorktreeReview.totalChangedFiles");
  }
  if (typeof report.pmWorktreeReview?.canProceedToBackupDecision !== "boolean") {
    missing.push("report.pmWorktreeReview.canProceedToBackupDecision");
  }
  if (typeof report.pmWorktreeReview?.safeguardReady !== "boolean") {
    missing.push("report.pmWorktreeReview.safeguardReady");
  }
  if (typeof report.pmWorktreeReview?.hardBlocker !== "boolean") {
    missing.push("report.pmWorktreeReview.hardBlocker");
  }
  if (!report.pmWorktreeReview?.recommendedPmOutcome) {
    missing.push("report.pmWorktreeReview.recommendedPmOutcome");
  }
  if (!report.pmWorktreeReview?.packetCandidateBlocker) {
    missing.push("report.pmWorktreeReview.packetCandidateBlocker");
  }
  if (typeof report.pmWorktreeReview?.groupCounts?.excludedFromBetaLaunchPacket !== "number") {
    missing.push("report.pmWorktreeReview.groupCounts.excludedFromBetaLaunchPacket");
  }
  if (typeof report.pmWorktreeReview?.groupCounts?.projectStatusAndTooling !== "number") {
    missing.push("report.pmWorktreeReview.groupCounts.projectStatusAndTooling");
  }
  if (report.pmWorktreeReview?.groupCounts?.unrelatedOrNeedsPmDecision === 0) {
    if (report.pmWorktreeReview.safeguardReady !== true) {
      blocked.push("report.pmWorktreeReview.safeguardReady must be true when no unresolved worktree items remain");
    }
    if (report.pmWorktreeReview.hardBlocker !== false) {
      blocked.push("report.pmWorktreeReview.hardBlocker must be false when no unresolved worktree items remain");
    }
    if (report.pmWorktreeReview.nextRoute !== "collect_external_input_response_then_run_public_beta_post_reply_one_runner") {
      blocked.push("report.pmWorktreeReview.nextRoute must move to the combined external input response and public Beta post-reply one-runner when worktree is classified");
    }
    if (report.pmWorktreeReview.packetCandidateBlocker !== "git_snapshot_is_recommended_safeguard_not_current_public_beta_hard_blocker") {
      blocked.push("report.pmWorktreeReview.packetCandidateBlocker must treat Git snapshot as a safeguard, not a hard blocker");
    }
  }
  if (!report.sourceReports?.pmWorktreeReviewPreflight?.parsedJson) {
    blocked.push("report.sourceReports.pmWorktreeReviewPreflight must parse");
  }
  if (!report.sourceReports?.betaLaunchNextAction?.parsedJson) {
    blocked.push("report.sourceReports.betaLaunchNextAction must parse");
  }
  if (["blocked_waiting_two_platform_values", "blocked_waiting_external_input_response"].includes(report.status)) {
    if (report.pmMainline?.nextCommand !== "cmd.exe /c npm run report:public-beta-external-input-copy-packet") {
      blocked.push("report.pmMainline.nextCommand must route to the external input copy packet while external inputs are missing");
    }
    if (report.pmMainline?.afterCurrentCommand !== "cmd.exe /c npm run report:public-beta-external-reply-file-route") {
      blocked.push("report.pmMainline.afterCurrentCommand must route to external reply file route after external input collection");
    }
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
  if (report.parallelRoutes?.a1?.readiness?.nextCommand !== "cmd.exe /c npm run report:a1-twii-four-slot-reply-request") {
    blocked.push("report.parallelRoutes.a1.readiness.nextCommand must route to the A1 four-slot reply request");
  }
  if (report.parallelRoutes?.a1?.readiness?.twiiPendingCount !== 4) {
    blocked.push("report.parallelRoutes.a1.readiness.twiiPendingCount must currently be 4");
  }
  if (report.parallelRoutes?.a1?.readiness?.etfPendingCount !== 6) {
    blocked.push("report.parallelRoutes.a1.readiness.etfPendingCount must currently be 6");
  }
  if (report.parallelRoutes?.a1?.nextCommand !== "cmd.exe /c npm run report:a1-twii-four-slot-reply-request") {
    blocked.push("report.parallelRoutes.a1.nextCommand must route to the A1 four-slot reply request");
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
  if (!report.parallelRoutes?.a1?.miniPacket) missing.push("report.parallelRoutes.a1.miniPacket");
  if (report.parallelRoutes?.a1?.miniPacket?.status !== "ok") {
    blocked.push("report.parallelRoutes.a1.miniPacket.status must be ok");
  }
  if (report.parallelRoutes?.a1?.miniPacket?.guardedStatus !== "a1_twii_evidence_intake_mini_packet_ready_pending_fill") {
    blocked.push("report.parallelRoutes.a1.miniPacket.guardedStatus must keep the TWII mini packet pending-fill status");
  }
  if (report.parallelRoutes?.a1?.miniPacket?.pmIntakeShortcut?.mode !== "ninety_second_pm_intake") {
    blocked.push("report.parallelRoutes.a1.miniPacket.pmIntakeShortcut.mode must be ninety_second_pm_intake");
  }
  for (const field of ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]) {
    if (!report.parallelRoutes?.a1?.miniPacket?.pmIntakeShortcut?.fields?.includes(field)) {
      missing.push(`report.parallelRoutes.a1.miniPacket.pmIntakeShortcut.fields.${field}`);
    }
  }
  if (report.parallelRoutes?.a1?.miniPacket?.packet !== "docs/A1_TWII_EVIDENCE_INTAKE_MINI_PACKET.md") {
    blocked.push("report.parallelRoutes.a1.miniPacket.packet must point to the TWII mini packet");
  }
  if (!Array.isArray(report.parallelRoutes?.a1?.miniPacket?.twiiPendingSlots) || report.parallelRoutes.a1.miniPacket.twiiPendingSlots.length !== 4) {
    missing.push("report.parallelRoutes.a1.miniPacket.twiiPendingSlots");
  }
  if (report.parallelRoutes?.a1?.miniPacket?.publicDataSource !== "mock") {
    blocked.push("report.parallelRoutes.a1.miniPacket.publicDataSource must remain mock");
  }
  if (report.parallelRoutes?.a1?.miniPacket?.scoreSource !== "mock") {
    blocked.push("report.parallelRoutes.a1.miniPacket.scoreSource must remain mock");
  }
  if (report.parallelRoutes?.a1?.miniPacket?.executable !== false) {
    blocked.push("report.parallelRoutes.a1.miniPacket.executable must remain false");
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
  if (!report.parallelRoutes?.a1?.replyRequest) {
    missing.push("report.parallelRoutes.a1.replyRequest");
  }
  if (report.parallelRoutes?.a1?.replyRequest?.status !== "a1_twii_four_slot_reply_request_ready") {
    blocked.push("report.parallelRoutes.a1.replyRequest.status must be a1_twii_four_slot_reply_request_ready");
  }
  if (report.parallelRoutes?.a1?.replyRequest?.pendingCount !== 4) {
    blocked.push("report.parallelRoutes.a1.replyRequest.pendingCount must currently be 4");
  }
  if (
    !Array.isArray(report.parallelRoutes?.a1?.replyRequest?.pendingSlotIds) ||
    report.parallelRoutes.a1.replyRequest.pendingSlotIds.length !== 4
  ) {
    missing.push("report.parallelRoutes.a1.replyRequest.pendingSlotIds");
  }
  for (const field of ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]) {
    if (!report.parallelRoutes?.a1?.replyRequest?.requiredFields?.includes(field)) {
      missing.push(`report.parallelRoutes.a1.replyRequest.requiredFields.${field}`);
    }
  }
  for (const command of [
    "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
    "cmd.exe /c npm run report:a1-twii-local-evidence-candidate-draft",
    "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request",
    "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
    "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface",
    "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
  ]) {
    if (!report.parallelRoutes?.a1?.replyRequest?.pmAfterA1Reply?.includes(command)) {
      missing.push(`report.parallelRoutes.a1.replyRequest.pmAfterA1Reply.${command}`);
    }
  }
  const localDraft = report.parallelRoutes?.a1?.replyRequest?.localEvidenceCandidateDraft;
  if (!localDraft) {
    missing.push("report.parallelRoutes.a1.replyRequest.localEvidenceCandidateDraft");
  } else {
    if (localDraft.status !== "a1_twii_local_evidence_candidate_draft_ready_for_pm_classification") {
      blocked.push("report.parallelRoutes.a1.replyRequest.localEvidenceCandidateDraft.status must be PM-classifiable");
    }
    if (localDraft.command !== "cmd.exe /c npm run report:a1-twii-local-evidence-candidate-draft") {
      blocked.push("report.parallelRoutes.a1.replyRequest.localEvidenceCandidateDraft.command must route to the local evidence draft report");
    }
    if (localDraft.candidateSlotCount !== 4) {
      blocked.push("report.parallelRoutes.a1.replyRequest.localEvidenceCandidateDraft.candidateSlotCount must be 4");
    }
    if (!Array.isArray(localDraft.suggestedPmClassifications) || localDraft.suggestedPmClassifications.length !== 4) {
      missing.push("report.parallelRoutes.a1.replyRequest.localEvidenceCandidateDraft.suggestedPmClassifications");
    } else {
      for (const item of localDraft.suggestedPmClassifications) {
        if (!["needs_bounded_repair", "blocked"].includes(item.suggestedPmClassification)) {
          blocked.push(
            `report.parallelRoutes.a1.replyRequest.localEvidenceCandidateDraft.${item.evidenceSlotId}.suggestedPmClassification must stay repair/block only`
          );
        }
      }
    }
  }
  const boundedRepair = report.parallelRoutes?.a1?.replyRequest?.localEvidenceBoundedRepairRequest;
  if (!boundedRepair) {
    missing.push("report.parallelRoutes.a1.replyRequest.localEvidenceBoundedRepairRequest");
  } else {
    if (boundedRepair.status !== "a1_twii_local_evidence_bounded_repair_request_ready") {
      blocked.push("report.parallelRoutes.a1.replyRequest.localEvidenceBoundedRepairRequest.status must be ready");
    }
    if (boundedRepair.command !== "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request") {
      blocked.push("report.parallelRoutes.a1.replyRequest.localEvidenceBoundedRepairRequest.command must route to the bounded repair report");
    }
    if (boundedRepair.repairRequestCount !== 4) {
      blocked.push("report.parallelRoutes.a1.replyRequest.localEvidenceBoundedRepairRequest.repairRequestCount must be 4");
    }
    if (!Array.isArray(boundedRepair.copyableA1Request) || boundedRepair.copyableA1Request.length < 16) {
      missing.push("report.parallelRoutes.a1.replyRequest.localEvidenceBoundedRepairRequest.copyableA1Request");
    }
  }
  for (const flag of ["evidenceRecorded", "marketDataFetched", "sqlExecuted", "supabaseReadsEnabled", "supabaseWritesEnabled"]) {
    if (report.parallelRoutes?.a1?.replyRequest?.safety?.[flag] !== false) {
      blocked.push(`report.parallelRoutes.a1.replyRequest.safety.${flag} must remain false`);
    }
  }
  if (!report.parallelRoutes?.a1?.completionStatus) {
    missing.push("report.parallelRoutes.a1.completionStatus");
  } else {
    if (
      report.parallelRoutes.a1.completionStatus.status !==
      "blocked_waiting_a1_twii_four_slot_no_secret_evidence"
    ) {
      blocked.push("report.parallelRoutes.a1.completionStatus.status must wait for A1 four-slot no-secret evidence");
    }
    if (report.parallelRoutes.a1.completionStatus.counts?.accepted !== 0) {
      blocked.push("report.parallelRoutes.a1.completionStatus.counts.accepted must currently be 0");
    }
    if (report.parallelRoutes.a1.completionStatus.counts?.pending !== 4) {
      blocked.push("report.parallelRoutes.a1.completionStatus.counts.pending must currently be 4");
    }
    if (report.parallelRoutes.a1.completionStatus.counts?.required !== 4) {
      blocked.push("report.parallelRoutes.a1.completionStatus.counts.required must be 4");
    }
    if (
      report.parallelRoutes.a1.completionStatus.pmQueueRule !==
      "PM may classify only pending queue slots after response-readiness and the no-secret shape guard pass; prefer the one-runner command after A1 replies; this report never emits apply commands."
    ) {
      blocked.push("report.parallelRoutes.a1.completionStatus.pmQueueRule must keep PM classification after response-readiness, shape guard, and no-apply");
    }
    if (
      report.parallelRoutes.a1.completionStatus.pmOneRunnerCommand !==
      "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once"
    ) {
      blocked.push("report.parallelRoutes.a1.completionStatus.pmOneRunnerCommand must expose the A1 post-reply one-runner");
    }
    if (
      !Array.isArray(report.parallelRoutes.a1.completionStatus.pendingSlotIds) ||
      report.parallelRoutes.a1.completionStatus.pendingSlotIds.length !== 4
    ) {
      missing.push("report.parallelRoutes.a1.completionStatus.pendingSlotIds");
    }
    if (
      !Array.isArray(report.parallelRoutes.a1.completionStatus.pmClassificationQueue) ||
      report.parallelRoutes.a1.completionStatus.pmClassificationQueue.length !== 4
    ) {
      missing.push("report.parallelRoutes.a1.completionStatus.pmClassificationQueue");
    }
    const expectedA1CompletionStatuses = {
      "vendor-terms-evidence": "needs_bounded_repair",
      "internal-feed-owner-evidence": "needs_bounded_repair",
      "field-contract-evidence": "needs_bounded_repair",
      "asset-mapping-evidence": "needs_bounded_repair"
    };
    for (const slot of ["vendor-terms-evidence", "internal-feed-owner-evidence", "field-contract-evidence", "asset-mapping-evidence"]) {
      if (!report.parallelRoutes.a1.completionStatus.pendingSlotIds?.includes(slot)) {
        missing.push(`report.parallelRoutes.a1.completionStatus.pendingSlotIds.${slot}`);
      }
      const queueItem = report.parallelRoutes.a1.completionStatus.pmClassificationQueue?.find(
        (item) => item.evidenceSlotId === slot
      );
      if (!queueItem) {
        missing.push(`report.parallelRoutes.a1.completionStatus.pmClassificationQueue.${slot}`);
        continue;
      }
      if (queueItem.currentStatus !== expectedA1CompletionStatuses[slot]) {
        blocked.push(`report.parallelRoutes.a1.completionStatus.pmClassificationQueue.${slot}.currentStatus must be ${expectedA1CompletionStatuses[slot]}`);
      }
      if (queueItem.oneRunnerCommandAfterReply !== "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once") {
        blocked.push(`report.parallelRoutes.a1.completionStatus.pmClassificationQueue.${slot}.oneRunnerCommandAfterReply must be one-runner`);
      }
      if (queueItem.firstPmCommandAfterReply !== "cmd.exe /c npm run report:public-beta-external-input-response-readiness") {
        blocked.push(`report.parallelRoutes.a1.completionStatus.pmClassificationQueue.${slot}.firstPmCommandAfterReply must be response-readiness`);
      }
      if (queueItem.secondPmCommandAfterReply !== "cmd.exe /c npm run check:a1-twii-evidence-response-shape") {
        blocked.push(`report.parallelRoutes.a1.completionStatus.pmClassificationQueue.${slot}.secondPmCommandAfterReply must be shape guard`);
      }
      if (queueItem.thirdPmCommandAfterReply !== "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route") {
        blocked.push(`report.parallelRoutes.a1.completionStatus.pmClassificationQueue.${slot}.thirdPmCommandAfterReply must be PM classification`);
      }
      for (const option of ["accepted", "rejected", "needs_bounded_repair", "blocked"]) {
        if (!queueItem.pmClassificationOptions?.includes(option)) {
          missing.push(`report.parallelRoutes.a1.completionStatus.pmClassificationQueue.${slot}.pmClassificationOptions.${option}`);
        }
      }
    }
  }
  if (!report.parallelRoutes?.a1?.pmClassificationRoute) {
    missing.push("report.parallelRoutes.a1.pmClassificationRoute");
  }
  if (report.parallelRoutes?.a1?.pmClassificationRoute?.status !== "a1_twii_pm_classification_route_ready_waiting_no_secret_evidence") {
    blocked.push("report.parallelRoutes.a1.pmClassificationRoute.status must stay ready waiting no-secret evidence");
  }
  for (const option of ["accepted", "rejected", "needs_bounded_repair", "blocked"]) {
    if (!report.parallelRoutes?.a1?.pmClassificationRoute?.classificationOptions?.includes(option)) {
      missing.push(`report.parallelRoutes.a1.pmClassificationRoute.classificationOptions.${option}`);
    }
  }
  for (const slot of ["vendor-terms-evidence", "internal-feed-owner-evidence", "field-contract-evidence", "asset-mapping-evidence"]) {
    if (!report.parallelRoutes?.a1?.pmClassificationRoute?.slotIds?.includes(slot)) {
      missing.push(`report.parallelRoutes.a1.pmClassificationRoute.slotIds.${slot}`);
    }
  }
  if (report.parallelRoutes?.a1?.pmClassificationRoute?.dryRunPreviewCount !== 4) {
    blocked.push("report.parallelRoutes.a1.pmClassificationRoute.dryRunPreviewCount must be 4");
  }
  if (report.parallelRoutes?.a1?.pmClassificationRoute?.firstCommand !== "cmd.exe /c npm run check:a1-twii-evidence-response-shape") {
    blocked.push("report.parallelRoutes.a1.pmClassificationRoute.firstCommand must be the response-shape guard");
  }
  if (report.parallelRoutes?.a1?.pmClassificationRoute?.afterAnyDryRun !== "cmd.exe /c npm run report:a1-source-rights-readiness-summary") {
    blocked.push("report.parallelRoutes.a1.pmClassificationRoute.afterAnyDryRun must rerun readiness summary");
  }
  for (const boundary of [
    "do_not_emit_apply_command",
    "do_not_record_evidence_from_this_report",
    "do_not_approve_source_rights_from_this_report",
    "do_not_award_row_coverage_from_this_report"
  ]) {
    if (!report.parallelRoutes?.a1?.pmClassificationRoute?.stillNotAllowed?.includes(boundary)) {
      missing.push(`report.parallelRoutes.a1.pmClassificationRoute.stillNotAllowed.${boundary}`);
    }
  }
  for (const flag of ["applyCommandEmitted", "evidenceRecorded", "sourceRightsApproved", "rowCoverageAwarded"]) {
    if (report.parallelRoutes?.a1?.pmClassificationRoute?.safety?.[flag] !== false) {
      blocked.push(`report.parallelRoutes.a1.pmClassificationRoute.safety.${flag} must remain false`);
    }
  }
  if (!report.parallelRoutes?.a1?.pmIntakeDecisionSummary) {
    missing.push("report.parallelRoutes.a1.pmIntakeDecisionSummary");
  } else {
    const intake = report.parallelRoutes.a1.pmIntakeDecisionSummary;
    if (intake.status !== "a1_twii_pm_intake_decision_summary_ready_waiting_bounded_repairs") {
      blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.status must show bounded repairs are still needed");
    }
    if (intake.currentDecision !== "request_a1_bounded_no_secret_repairs_before_pm_classification") {
      blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.currentDecision must route PM to bounded A1 repairs");
    }
    if (intake.pendingCount !== 4) {
      blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.pendingCount must remain 4 before A1 reply");
    }
    if (intake.acceptedCount !== 0) {
      blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.acceptedCount must remain 0 before A1 reply");
    }
    if (intake.canOpenTwiiOutcomeGate !== false) {
      blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.canOpenTwiiOutcomeGate must remain false");
    }
    if (intake.boundedRepairCommand !== "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request") {
      blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.boundedRepairCommand must route to bounded repair report");
    }
    if (intake.repairRequestCount !== 4) {
      blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.repairRequestCount must be 4");
    }
    if (intake.oneRunnerCommand !== "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once") {
      blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.oneRunnerCommand must route to the A1 post-reply runner");
    }
    if (!intake.postReplyOneRunnerProof) {
      missing.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.postReplyOneRunnerProof");
    } else {
      if (intake.postReplyOneRunnerProof.status !== "focused_gate_registered_lightweight_proof_summary") {
        blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.postReplyOneRunnerProof.status must be lightweight proof summary");
      }
      if (intake.postReplyOneRunnerProof.focusedGateName !== "a1-twii-post-reply-pm-classification-once") {
        blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.postReplyOneRunnerProof.focusedGateName must be A1 post-reply gate");
      }
      if (
        intake.postReplyOneRunnerProof.proofCommand !==
        "cmd.exe /c npm run check:a1-twii-post-reply-pm-classification-once"
      ) {
        blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.postReplyOneRunnerProof.proofCommand must be A1 focused checker");
      }
      if (
        intake.postReplyOneRunnerProof.routineRunnerCommand !==
        "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once"
      ) {
        blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.postReplyOneRunnerProof.routineRunnerCommand must be A1 one-runner");
      }
      if (
        intake.postReplyOneRunnerProof.currentPendingScenario?.expectedStatus !==
        "blocked_waiting_a1_twii_four_slot_no_secret_evidence"
      ) {
        blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.postReplyOneRunnerProof current scenario must be pending A1 evidence");
      }
      if (
        intake.postReplyOneRunnerProof.acceptedFixtureScenario?.expectedStatus !==
        "a1_twii_post_reply_chain_ready_for_outcome_gate_candidate"
      ) {
        blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.postReplyOneRunnerProof accepted fixture must reach outcome gate candidate");
      }
      if (intake.postReplyOneRunnerProof.ledgerModified !== false) {
        blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.postReplyOneRunnerProof.ledgerModified must be false");
      }
      if (intake.postReplyOneRunnerProof.valuesAreFixtureOnly !== true) {
        blocked.push("report.parallelRoutes.a1.pmIntakeDecisionSummary.postReplyOneRunnerProof.valuesAreFixtureOnly must be true");
      }
    }
    for (const command of [
      "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request",
      "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
      "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
      "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
    ]) {
      if (!intake.nextCommands?.includes(command)) {
        missing.push(`report.parallelRoutes.a1.pmIntakeDecisionSummary.nextCommands.${command}`);
      }
    }
    for (const flag of ["evidenceRecorded", "marketDataFetched", "sourceRightsApproved", "sqlExecuted", "supabaseWritesEnabled"]) {
      if (intake.safety?.[flag] !== false) {
        blocked.push(`report.parallelRoutes.a1.pmIntakeDecisionSummary.safety.${flag} must remain false`);
      }
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
  if (report.parallelRoutes?.a1?.reviewedOutcomeSurface?.judgementSummary?.canOpenOutcomeGate !== false) {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.judgementSummary.canOpenOutcomeGate must remain false");
  }
  if (report.parallelRoutes?.a1?.reviewedOutcomeSurface?.judgementSummary?.counts?.pending !== 4) {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.judgementSummary.counts.pending must currently be 4");
  }
  if (
    report.parallelRoutes?.a1?.reviewedOutcomeSurface?.judgementSummary?.nextPmAction !==
    "wait_for_a1_four_slot_no_secret_evidence_then_dry_run_pm_classification"
  ) {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.judgementSummary.nextPmAction must route to A1 four-slot evidence intake");
  }
  if (report.parallelRoutes?.a1?.reviewedOutcomeSurface?.pmNarrowRequest?.mode !== "four_slot_no_secret_reply") {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.pmNarrowRequest.mode must be four_slot_no_secret_reply");
  }
  if (
    !Array.isArray(report.parallelRoutes?.a1?.reviewedOutcomeSurface?.pmNarrowRequest?.askA1For) ||
    report.parallelRoutes.a1.reviewedOutcomeSurface.pmNarrowRequest.askA1For.length !== 4
  ) {
    missing.push("report.parallelRoutes.a1.reviewedOutcomeSurface.pmNarrowRequest.askA1For");
  }
  for (const field of ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]) {
    if (!report.parallelRoutes?.a1?.reviewedOutcomeSurface?.pmNarrowRequest?.requiredFields?.includes(field)) {
      missing.push(`report.parallelRoutes.a1.reviewedOutcomeSurface.pmNarrowRequest.requiredFields.${field}`);
    }
  }
  if (
    !report.parallelRoutes?.a1?.reviewedOutcomeSurface?.pmNarrowRequest?.afterA1Reply?.includes(
      "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
    )
  ) {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.pmNarrowRequest.afterA1Reply must include response-readiness");
  }
  if (
    !report.parallelRoutes?.a1?.reviewedOutcomeSurface?.pmNarrowRequest?.afterA1Reply?.includes(
      "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once"
    )
  ) {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.pmNarrowRequest.afterA1Reply must include A1 post-reply one-runner");
  }
  if (
    !report.parallelRoutes?.a1?.reviewedOutcomeSurface?.pmNarrowRequest?.afterA1Reply?.includes(
      "cmd.exe /c npm run check:a1-twii-evidence-response-shape"
    )
  ) {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.pmNarrowRequest.afterA1Reply must include response-shape guard");
  }
  if (
    !report.parallelRoutes?.a1?.reviewedOutcomeSurface?.pmNarrowRequest?.afterA1Reply?.includes(
      "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route"
    )
  ) {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.pmNarrowRequest.afterA1Reply must include PM classification route");
  }
  const reviewedShapeIndex =
    report.parallelRoutes?.a1?.reviewedOutcomeSurface?.pmNarrowRequest?.afterA1Reply?.indexOf(
      "cmd.exe /c npm run check:a1-twii-evidence-response-shape"
    ) ?? -1;
  const reviewedResponseReadinessIndex =
    report.parallelRoutes?.a1?.reviewedOutcomeSurface?.pmNarrowRequest?.afterA1Reply?.indexOf(
      "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
    ) ?? -1;
  const reviewedOneRunnerIndex =
    report.parallelRoutes?.a1?.reviewedOutcomeSurface?.pmNarrowRequest?.afterA1Reply?.indexOf(
      "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once"
    ) ?? -1;
  const reviewedClassificationIndex =
    report.parallelRoutes?.a1?.reviewedOutcomeSurface?.pmNarrowRequest?.afterA1Reply?.indexOf(
      "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route"
    ) ?? -1;
  if (!(reviewedResponseReadinessIndex >= 0 && reviewedOneRunnerIndex > reviewedResponseReadinessIndex && reviewedShapeIndex > reviewedOneRunnerIndex)) {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.pmNarrowRequest.afterA1Reply must order response-readiness before A1 one-runner before shape guard");
  }
  if (!(reviewedShapeIndex >= 0 && reviewedClassificationIndex > reviewedShapeIndex)) {
    blocked.push("report.parallelRoutes.a1.reviewedOutcomeSurface.pmNarrowRequest.afterA1Reply must order shape guard before PM classification");
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
  if (report.parallelRoutes?.a2?.decisionSupport?.nextRecommendedSlice !== "none_until_launch_blocking_regression") {
    blocked.push("report.parallelRoutes.a2.decisionSupport.nextRecommendedSlice must defer A2 while no urgent first-screen candidates exist");
  }
  if (report.parallelRoutes?.a2?.decisionSupport?.nextRecommendedPriority !== "deferred") {
    blocked.push("report.parallelRoutes.a2.decisionSupport.nextRecommendedPriority must be deferred while A2 has no launch-blocking public-copy candidates");
  }
  if (report.parallelRoutes?.a2?.launchBlockingStatus?.status !== "clear") {
    blocked.push("report.parallelRoutes.a2.launchBlockingStatus.status must be clear while A2 has no launch-blocking public-copy candidates");
  }
  if (report.parallelRoutes?.a2?.launchBlockingStatus?.hardBlocker !== false) {
    blocked.push("report.parallelRoutes.a2.launchBlockingStatus.hardBlocker must be false");
  }
  if (report.parallelRoutes?.a2?.launchBlockingStatus?.allowedNextAction !== "keep_stable_only_unless_launch_blocking_regression") {
    blocked.push("report.parallelRoutes.a2.launchBlockingStatus.allowedNextAction must keep A2 as stability watch only");
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
  if (!report.sourceReports?.a1TwiiFourSlotReplyRequest?.parsedJson) {
    missing.push("report.sourceReports.a1TwiiFourSlotReplyRequest.parsedJson");
  }
  if (!report.sourceReports?.a1TwiiEvidenceCompletionStatus?.parsedJson) {
    missing.push("report.sourceReports.a1TwiiEvidenceCompletionStatus.parsedJson");
  }
  if (!report.sourceReports?.a1TwiiEvidencePmClassificationRoute?.parsedJson) {
    missing.push("report.sourceReports.a1TwiiEvidencePmClassificationRoute.parsedJson");
  }
  if (!report.sourceReports?.a1TwiiPmIntakeDecisionSummary?.parsedJson) {
    missing.push("report.sourceReports.a1TwiiPmIntakeDecisionSummary.parsedJson");
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
  if (!report.sourceReports?.publicBetaMockLaunchProofBundle?.parsedJson) {
    missing.push("report.sourceReports.publicBetaMockLaunchProofBundle.parsedJson");
  }
  if (!report.sourceReports?.betaLaunchRemainingBlockers?.parsedJson) {
    missing.push("report.sourceReports.betaLaunchRemainingBlockers.parsedJson");
  }
  if (!report.goalReadiness) {
    missing.push("report.goalReadiness");
  } else {
    if (report.goalReadiness.mode !== "public_beta_goal_readiness_rollup") {
      blocked.push("report.goalReadiness.mode must be public_beta_goal_readiness_rollup");
    }
    if (report.goalReadiness.status !== "public_beta_goal_not_ready_continue_parallel_work") {
      blocked.push("report.goalReadiness.status must currently continue parallel work");
    }
    if (report.goalReadiness.currentRoute?.pmMainlineStatus !== report.status) {
      blocked.push("report.goalReadiness.currentRoute.pmMainlineStatus must match current mainline blocker");
    }
    if (report.goalReadiness.currentRoute?.pmDefaultWhenBlocked !== false) {
      blocked.push("report.goalReadiness.currentRoute.pmDefaultWhenBlocked must be false once mainline has an executable route");
    }
    const goalItems = new Map(report.goalReadiness.completionItems?.map((item) => [item.id, item]) ?? []);
    if (goalItems.get("runtime_core_routes")?.status !== "ready") {
      blocked.push("report.goalReadiness runtime_core_routes must be ready");
    }
    if (goalItems.get("beta_platform_values_and_packet")?.status !== "blocked") {
      blocked.push("report.goalReadiness beta_platform_values_and_packet must be blocked");
    }
    if (goalItems.get("a1_source_rights_and_coverage_frontier")?.status !== "blocked") {
      blocked.push("report.goalReadiness a1_source_rights_and_coverage_frontier must be blocked");
    }
    if (goalItems.get("a2_public_trust_copy")?.status !== "ready") {
      blocked.push("report.goalReadiness a2_public_trust_copy must be ready");
    }
    if (goalItems.get("promotion_boundary")?.status !== "held") {
      blocked.push("report.goalReadiness promotion_boundary must be held");
    }
    for (const id of ["beta_platform_values_and_packet", "a1_source_rights_and_coverage_frontier"]) {
      if (!report.goalReadiness.blockedItems?.includes(id)) {
        blocked.push(`report.goalReadiness.blockedItems must include ${id}`);
      }
    }
    if (!report.goalReadiness.nextBestActions?.includes("cmd.exe /c npm run run:public-beta-post-reply-route-once")) {
      blocked.push("report.goalReadiness.nextBestActions must include the public Beta post-reply one-runner");
    }
    if (report.goalReadiness.nextBestActions?.includes("cmd.exe /c npm run run:beta-platform-two-value-proof-map-once")) {
      blocked.push("report.goalReadiness.nextBestActions must not expose the lower-level platform proof runner as the routine next action");
    }
    if (!report.goalReadiness.nextBestActions?.includes("cmd.exe /c npm run report:a1-source-rights-evidence-batch-brief")) {
      blocked.push("report.goalReadiness.nextBestActions must include A1 batch brief");
    }
    if (!report.goalReadiness.nextBestActions?.includes("cmd.exe /c npm run report:a1-twii-four-slot-reply-request")) {
      blocked.push("report.goalReadiness.nextBestActions must include A1 four-slot reply request");
    }
    if (!report.goalReadiness.nextBestActions?.includes("cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface")) {
      blocked.push("report.goalReadiness.nextBestActions must include A1 reviewed outcome surface");
    }
    if (report.goalReadiness.runtimeBoundary?.publicDataSource !== "mock") {
      blocked.push("report.goalReadiness.runtimeBoundary.publicDataSource must be mock");
    }
    if (report.goalReadiness.runtimeBoundary?.scoreSource !== "mock") {
      blocked.push("report.goalReadiness.runtimeBoundary.scoreSource must be mock");
    }
    for (const flag of ["deploymentAuthorized", "marketDataFetched", "secretsPrinted", "sqlExecuted", "supabaseReadsEnabled", "supabaseWritesEnabled"]) {
      if (report.goalReadiness.safety?.[flag] !== false) {
        blocked.push(`report.goalReadiness.safety.${flag} must remain false`);
      }
    }
  }
}

const a1ReviewedBlockedRepairState =
  report.pmRouteRouter?.a1FourSlotEvidence?.blockedEvidenceCount === 0 &&
  report.pmRouteRouter?.a1FourSlotEvidence?.needsBoundedRepairCount === 4 &&
  report.parallelRoutes?.a1?.reviewedOutcomeSurface?.judgementSummary?.counts?.blocked === 0 &&
  report.parallelRoutes?.a1?.reviewedOutcomeSurface?.judgementSummary?.counts?.needs_bounded_repair === 4 &&
  report.parallelRoutes?.a1?.reviewedOutcomeSurface?.judgementSummary?.counts?.pending === 0 &&
  report.parallelRoutes?.a1?.completionStatus?.counts?.accepted === 0 &&
  report.parallelRoutes?.a1?.completionStatus?.counts?.pending === 4 &&
  report.parallelRoutes?.a1?.pmIntakeDecisionSummary?.status ===
    "a1_twii_pm_intake_decision_summary_ready_waiting_bounded_repairs";

const obsoleteA1PendingOnlyMessages = new Set([
  "report.pmRouteRouter.a1FourSlotEvidence.pendingEvidenceCount must currently be 4",
  "report.pmRouteRouter.a1FourSlotEvidence.blockedEvidenceCount must currently be 0 after PM downgraded hard blocks to bounded repairs",
  "report.pmRouteRouter.a1FourSlotEvidence.needsBoundedRepairCount must currently be 4",
  "report.parallelRoutes.a1.worksheetBatch.recommendedBatch.batchId must keep the TWII source-rights unblock batch visible",
  "report.parallelRoutes.a1.worksheetBatch.recommendedBatch.lane must remain TWII",
  "report.parallelRoutes.a1.worksheetBatch.pendingByLane.TWII must currently have 4 pending slots",
  "report.parallelRoutes.a1.miniPacket.status must be ok",
  "report.parallelRoutes.a1.miniPacket.guardedStatus must keep the TWII mini packet pending-fill status",
  "report.parallelRoutes.a1.batchBrief.status must be twii_batch_brief_ready_pending_no_secret_evidence",
  "report.parallelRoutes.a1.batchBrief.batchId must keep TWII first batch visible",
  "report.parallelRoutes.a1.batchBrief.lane must be TWII",
  "report.parallelRoutes.a1.batchBrief.pendingCount must currently be 4",
  "report.parallelRoutes.a1.reviewedOutcomeSurface.status must be pm_reviewed_outcome_surface_ready_waiting_no_secret_evidence",
  "report.parallelRoutes.a1.reviewedOutcomeSurface.status must be pm_reviewed_outcome_surface_waiting_next_lane",
  "report.parallelRoutes.a1.reviewedOutcomeSurface.activeLane must be TWII",
  "report.parallelRoutes.a1.reviewedOutcomeSurface.activeLane must be none",
  "report.parallelRoutes.a1.reviewedOutcomeSurface.pendingCount must currently be 4",
  "report.parallelRoutes.a1.reviewedOutcomeSurface.pendingCount must currently be 0",
  "report.parallelRoutes.a1.reviewedOutcomeSurface.judgementSummary.counts.pending must currently be 4",
  "report.parallelRoutes.a1.reviewedOutcomeSurface.judgementSummary.counts.pending must currently be 0",
  "report.parallelRoutes.a1.reviewedOutcomeSurface.reviewedSlotCount must currently be 4"
]);
const obsoleteA1PendingOnlyMissing = new Set([
  "report.parallelRoutes.a1.worksheetBatch.recommendedBatch.slotIds",
  "report.parallelRoutes.a1.miniPacket.twiiPendingSlots",
  "report.parallelRoutes.a1.batchBrief.slotIds",
  "report.parallelRoutes.a1.reviewedOutcomeSurface.pmNarrowRequest.askA1For"
]);

const effectiveBlocked = a1ReviewedBlockedRepairState
  ? blocked.filter((message) => !obsoleteA1PendingOnlyMessages.has(message))
  : blocked;
const effectiveMissing = a1ReviewedBlockedRepairState
  ? missing.filter((message) => !obsoleteA1PendingOnlyMissing.has(message))
  : missing;

console.log(
  JSON.stringify(
    {
      blocked: effectiveBlocked,
      missing: effectiveMissing,
      status: effectiveMissing.length === 0 && effectiveBlocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (effectiveMissing.length > 0 || effectiveBlocked.length > 0) {
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
