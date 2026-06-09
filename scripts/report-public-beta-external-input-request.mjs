import { spawnSync } from "node:child_process";

const platform = runJson(["cmd.exe", "/c", "npm", "run", "report:beta-platform-two-value-intake-command"]);
const a1 = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-twii-four-slot-reply-request"]);
const blockers = runJson(["cmd.exe", "/c", "npm", "run", "report:beta-launch-remaining-blockers"]);

const platformReport = platform.json ?? {};
const a1Report = a1.json ?? {};
const blockerReport = blockers.json ?? {};
const afterExternalReplyReadinessCommand = "cmd.exe /c npm run report:public-beta-external-input-response-readiness";
const afterAnyReplyOnceRunnerCommand = "cmd.exe /c npm run run:public-beta-post-reply-route-once";
const afterExternalReplyFileRouteCommand = "cmd.exe /c npm run report:public-beta-external-reply-file-route";
const hardBlockerIds = [
  "beta_platform_two_values",
  "a1_twii_four_slot_no_secret_evidence"
];
const platformReplyTemplate = [
  "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>",
  "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"
];
const a1PendingSlotIds = a1Report.requestForA1?.pendingSlotIds ?? [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
];
const a1RequiredFields = [
  "evidenceSlotId",
  "sourceReferenceLabel",
  "safeEvidenceSummary",
  "remainingRisk"
];
const a1CopyableReplyTemplate = a1Report.requestForA1?.copyableReplyTemplate ?? [];
const a1PmClassificationQuickMap = a1Report.pmClassificationQuickMap ?? {
  status: "ready_for_pm_after_a1_no_secret_reply",
  firstGuardCommand: "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
  classificationOptions: ["accepted", "rejected", "needs_bounded_repair", "blocked"],
  rules: {
    accepted:
      "Use only when the slot answer is complete, no-secret, responsive, and narrow enough for a separate TWII source-rights outcome-gate review.",
    rejected:
      "Use when the reply is unsafe, copied, wrong, includes forbidden content, or does not answer the requested slot.",
    needs_bounded_repair:
      "Use when one narrow no-secret clarification can repair the slot without reopening broad source governance.",
    blocked:
      "Use when owner, rights, field contract, or asset mapping proof is unavailable or cannot be summarized safely."
  },
  afterAnyDryRunCommand: "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
  stillNotAllowed: [
    "do_not_emit_apply_command",
    "do_not_record_evidence_from_this_report",
    "do_not_approve_source_rights_from_this_report",
    "do_not_award_row_coverage_from_this_report",
    "do_not_fetch_market_data_from_this_report"
  ]
};
const a1AfterReplyCommands = [
  afterExternalReplyFileRouteCommand,
  afterExternalReplyReadinessCommand,
  ...(
    a1Report.pmAfterA1Reply ?? [
      "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
      "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
      "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface",
      "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
    ]
  )
].filter((command, index, commands) => commands.indexOf(command) === index);

const report = {
  status: "public_beta_external_input_request_ready",
  ok: true,
  mode: "public_beta_external_input_request",
  ceoDecision: "compress_external_blockers_to_two_reply_blocks",
  purpose:
    "Give PM one no-secret request surface for the only external inputs still blocking the public Beta pre-launch executable route.",
  requestBlocks: [
    {
      id: "beta_platform_two_values",
      owner: "PM or hosting operator",
      status: "waiting_external_reply",
      requiredFields: ["BETA_HOSTING_PROJECT_NAME", "BETA_TEMPORARY_URL"],
      replyTemplate: platformReplyTemplate,
      acceptedShape: platformReport.acceptedValueShape ?? {
        hostingProjectName:
          "lowercase letters, numbers, hyphens; no URL, token, secret, key, password, dashboard, or invite words",
        temporaryUrl:
          "public https URL only; no query string, hash, username, password, localhost, Supabase, dashboard, token, secret, key, password, or invite words"
      },
      pmAfterReply: [
        afterExternalReplyFileRouteCommand,
        afterExternalReplyReadinessCommand,
        afterAnyReplyOnceRunnerCommand,
        "cmd.exe /c npm run report:beta-mainline-current-route"
      ]
    },
    {
      id: "a1_twii_four_slot_no_secret_evidence",
      owner: "A1 Data / Supabase / Market Evidence",
      status: "waiting_external_reply",
      requiredFields: a1Report.requestForA1?.requiredFields ?? a1RequiredFields,
      pendingSlotIds: a1PendingSlotIds,
      replyTemplate: a1CopyableReplyTemplate,
      pmAfterReply: a1AfterReplyCommands,
      pmClassificationQuickMap: a1PmClassificationQuickMap,
      pmAfterReplyBehavior:
        "The A1 post-reply one-runner fails fast after response-readiness while any of the four no-secret evidence slots are still missing. It runs shape guard, classification route, reviewed outcome surface, and readiness summary only after A1 evidence is present."
    }
  ],
  pmOneScreenReplyPacket: {
    purpose: "Copy this one screen into the PM/A1 handoff. Fill placeholders only; keep secrets and raw payloads out.",
    platformBlock: {
      title: "Block 1 - Beta platform two values",
      owner: "PM or hosting operator",
      lines: platformReplyTemplate,
      afterReply: [
        afterExternalReplyFileRouteCommand,
        afterExternalReplyReadinessCommand,
        afterAnyReplyOnceRunnerCommand
      ]
    },
    a1Block: {
      title: "Block 2 - A1 TWII four-slot no-secret evidence",
      owner: "A1 Data / Supabase / Market Evidence",
      pendingSlotIds: a1PendingSlotIds,
      requiredPerSlot: a1RequiredFields,
      lines: a1CopyableReplyTemplate,
      afterReply: a1AfterReplyCommands,
      failFastRule:
        "If any A1 TWII slot is still missing, the one-runner stops after response-readiness and returns to report:a1-twii-four-slot-reply-request.",
      pmClassificationQuickMap: a1PmClassificationQuickMap
    },
    completeWhen: [
      "both beta platform lines are filled with safe non-secret values",
      "all four A1 TWII slot summaries are provided in no-secret shape",
      "response-readiness passes before the post-reply runner"
    ]
  },
  pmReplyPacketContract: {
    status: "pm_reply_packet_contract_ready",
    purpose:
      "Define the smallest complete external reply that lets PM run response-readiness and the post-reply one-runner without reopening governance.",
    completeReplyRequires: [
      {
        blockId: "beta_platform_two_values",
        requiredFields: ["BETA_HOSTING_PROJECT_NAME", "BETA_TEMPORARY_URL"],
        completionRule:
          "Both lines must be present and shape-safe; project name is a plain slug and temporary URL is public https only."
      },
      {
        blockId: "a1_twii_four_slot_no_secret_evidence",
        requiredSlotCount: 4,
        requiredFieldsPerSlot: a1RequiredFields,
        completionRule:
          "Each TWII slot must include the four no-secret fields before PM can run the A1 classification chain."
      }
    ],
    forbiddenContent: [
      "secrets",
      "dashboard URLs",
      "Supabase URLs",
      "private preview tokens",
      "copied contract text",
      "raw market data",
      "row payloads",
      "stock-id payloads"
    ],
    firstCommandAfterAnyReply: afterExternalReplyFileRouteCommand,
    fallbackResponseReadinessCommand: afterExternalReplyReadinessCommand,
    oneRunnerAfterShapeSafeReply: afterAnyReplyOnceRunnerCommand,
    a1OneRunnerAfterEvidenceReply: "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
    doneSignals: [
      "platform_two_values_shape_valid",
      "a1_four_twii_slots_present_in_no_secret_shape",
      "response_readiness_routes_to_post_reply_one_runner"
    ],
    stillNotAllowed: [
      "do_not_store_platform_values_in_repo",
      "do_not_record_a1_evidence_from_this_request",
      "do_not_deploy_from_this_request",
      "do_not_promote_publicDataSource_or_scoreSource_from_this_request"
    ]
  },
  pmCopyableReplyChecklist: {
    purpose: "Use this as the single PM/A1 reply checklist; do not include secrets, raw payloads, private links, or contract text.",
    platformLines: platformReplyTemplate,
    a1SlotIds: a1PendingSlotIds,
    a1RequiredPerSlot: [
      "evidenceSlotId",
      "sourceReferenceLabel",
      "safeEvidenceSummary",
      "remainingRisk"
    ],
    afterAnyReplyFirstCommand: afterExternalReplyFileRouteCommand,
    fallbackResponseReadinessCommand: afterExternalReplyReadinessCommand,
    completionSignals: [
      "platform_values_shape_valid_inside_public_beta_post_reply_one_runner",
      "post_reply_once_runner_routes_packet_window_or_a1_outcome_gate",
      "a1_four_slot_shape_guard_passes",
      "a1_pm_classification_route_available_for_all_four_slots"
    ],
    stillNotAllowed: [
      "do_not_print_or_store_platform_values_in_repo",
      "do_not_record_a1_evidence_from_this_report",
      "do_not_approve_source_rights_from_this_report",
      "do_not_deploy_from_this_report"
    ]
  },
  currentBlockerSummary: {
    blockerCount: hardBlockerIds.length,
    hardBlockers: hardBlockerIds,
    nextBestAction: "collect_beta_platform_values_and_a1_twii_four_slot_no_secret_evidence",
    ignoredSafeguards: [
      "pm_git_snapshot_or_backup"
    ],
    sourceRemainingBlockerCount: Number(blockerReport.summary?.blockerCount ?? hardBlockerIds.length),
    sourceNextBestAction: "collect_beta_platform_values_and_a1_twii_four_slot_no_secret_evidence",
    runtimeReady: blockerReport.runtimeReadyEvidence?.allRoutesHttp200 === true,
    publicDataSource: blockerReport.runtimeReadyEvidence?.publicDataSource ?? "mock",
    scoreSource: blockerReport.runtimeReadyEvidence?.scoreSource ?? "mock"
  },
  usageRule:
    "Send only these two reply blocks. Do not include secrets, dashboard URLs, Supabase URLs, private preview tokens, contract text, raw payloads, row payloads, or stock-id payloads.",
  stopLines: [
    "No values are printed by this report.",
    "No values are stored by this report.",
    "No evidence is recorded by this report.",
    "No source-rights approval is granted by this report.",
    "No deployment is authorized by this report.",
    "No hosting resource is created or mutated by this report.",
    "No SQL is executed by this report.",
    "No Supabase connection, read, or write is executed by this report.",
    "No staging rows or daily_prices rows are created or modified by this report.",
    "No raw market data is fetched, stored, ingested, or committed by this report.",
    "No secrets, raw payloads, row payloads, or stock id payloads are printed by this report.",
    "publicDataSource remains mock and scoreSource remains mock."
  ],
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  safety: {
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
  },
  sourceReports: {
    betaPlatformTwoValueIntakeCommand: commandStatus(platform),
    a1TwiiFourSlotReplyRequest: commandStatus(a1),
    betaLaunchRemainingBlockers: commandStatus(blockers)
  }
};

console.log(JSON.stringify(report, null, 2));

function runJson(command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: process.env,
    timeout: 420000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    json: parseJson(result.stdout ?? ""),
    stderr: (result.stderr ?? "").trim()
  };
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

function commandStatus(run) {
  return {
    exitCode: run.exitCode,
    parsedJson: Boolean(run.json),
    stderrPrinted: run.stderr.length > 0
  };
}
