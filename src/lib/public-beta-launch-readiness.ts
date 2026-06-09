export type PublicBetaLaunchReadinessTone = "ready" | "blocked" | "hold";

export type PublicBetaLaunchReadinessItem = {
  detail: string;
  id: string;
  label: string;
  status: string;
  tone: PublicBetaLaunchReadinessTone;
};

export type PublicBetaPlatformValueGuide = {
  afterValidation: string[];
  allowed: string[];
  blocked: string[];
  commandAfterFill: string;
  fields: string[];
  replyTemplate: string[];
  sourceHint: string;
  title: string;
};

export type PublicBetaA1EvidenceTask = {
  id: string;
  pmQuestion: string;
  requiredOutput: string[];
  status: "pending";
};

export type PublicBetaA1ClassificationQueueItem = {
  currentRemainingRisk: string;
  evidenceSlotId: string;
  firstPmCommandAfterReply: string;
  oneRunnerCommandAfterReply: string;
  pmClassificationOptions: string[];
  secondPmCommandAfterReply: string;
  thirdPmCommandAfterReply: string;
};

export type PublicBetaA1BoundedRepairRequest = {
  currentDraftClassification: "needs_bounded_repair" | "blocked";
  evidenceSlotId: string;
  requestedRemainingRisk: string;
  requestedSafeEvidenceSummary: string;
  requestedSourceReferenceLabel: string;
};

export type PublicBetaA1MiniPacketGuide = {
  afterA1Reply: string[];
  boundedRepairRequest: {
    command: string;
    copyableA1Request: string[];
    repairRequests: PublicBetaA1BoundedRepairRequest[];
    status: string;
    title: string;
  };
  commandAfterFill: string;
  fields: string[];
  fastTriagePacket: {
    afterAnyDryRun: string;
    completionRule: string;
    firstCommand: string;
    requiredDecisionPerSlot: string[];
    slotCount: number;
    status: string;
    stillNotAllowed: string[];
    title: string;
  };
  mode: "four_slot_no_secret_reply";
  packetPath: string;
  pmClassificationQuickMap: {
    afterAnyDryRunCommand: string;
    classificationOptions: string[];
    firstGuardCommand: string;
    rules: {
      accepted: string;
      blocked: string;
      needs_bounded_repair: string;
      rejected: string;
    };
    status: string;
    stillNotAllowed: string[];
    title: string;
  };
  pmClassificationQueue: PublicBetaA1ClassificationQueueItem[];
  pmQueueRule: string;
  pmReviewRule: string;
  replyShape: string[];
  slotIds: string[];
  status: string;
  tasks: PublicBetaA1EvidenceTask[];
  title: string;
};

export type PublicBetaWorktreeGuide = {
  acceptedCount: number;
  backupBlocker: string;
  command: string;
  excludedCount: number;
  nextRoute: string;
  status: string;
  title: string;
  unresolvedCount: number;
};

export type PublicBetaDataReadinessGuide = {
  coverage: string;
  ingestionStatus: string;
  nextCommand: string;
  readonlyStatus: string;
  sourceRightsStatus: string;
  title: string;
};

export type PublicBetaHardBlockerAction = {
  commands: string[];
  id: string;
  nextProof: string;
  requiredInput: string[];
  status: "waiting";
  title: string;
};

export type PublicBetaExternalInputRequestGuide = {
  afterReplyCommand: string;
  afterReplyNextExecutableStep: {
    command: string;
    lane: string;
    reason: string;
  };
  a1FailFastPolicy: {
    pendingNextCommand: string;
    rule: string;
    skippedUntilEvidencePresent: string[];
    status: string;
  };
  command: string;
  description: string;
  replyIntakeDryRun: {
    a1PmPreviewCommand: string;
    command: string;
    completeReplyNextCommand: string;
    fileTextEchoed: false;
    purpose: string;
    requiredEnvVar: string;
    routeCommand: string;
    templateCommand: string;
    unsafeReplyFallbackCommand: string;
    valueEchoed: false;
    workflowProofCommand: string;
  };
  missingOnlyReplyPacket: {
    afterAnyReplyFirstCommand: string;
    blockCount: number;
    blocks: {
      id: string;
      lines: string[];
      owner: string;
      title: string;
    }[];
    status: "missing_external_reply_blocks_present";
    title: string;
  };
  oneScreenReplyPacket: {
    a1Block: {
      afterReply: string[];
      failFastRule: string;
      lines: string[];
      owner: string;
      pendingSlotIds: string[];
      requiredPerSlot: string[];
      title: string;
    };
    completeWhen: string[];
    platformBlock: {
      afterReply: string[];
      lines: string[];
      owner: string;
      title: string;
    };
    purpose: string;
    title: string;
  };
  replyChecklist: {
    a1RequiredPerSlot: string[];
    a1SlotIds: string[];
    afterAnyReplyFirstCommand: string;
    fallbackResponseReadinessCommand?: string;
    platformLines: string[];
    stillNotAllowed: string[];
  };
  replyPacketContract: {
    a1OneRunnerAfterEvidenceReply: string;
    completeReplyRequires: {
      blockId: string;
      completionRule: string;
      requiredFields?: string[];
      requiredFieldsPerSlot?: string[];
      requiredSlotCount?: number;
    }[];
    doneSignals: string[];
    firstCommandAfterAnyReply: string;
    fallbackResponseReadinessCommand?: string;
    forbiddenContent: string[];
    oneRunnerAfterShapeSafeReply: string;
    status: string;
    stillNotAllowed: string[];
    title: string;
  };
  requestBlocks: string[];
  status: string;
  title: string;
};

export type PublicBetaMockLaunchProofBundle = {
  commands: string[];
  hardStop: string;
  status: string;
  title: string;
};

export type PublicBetaOperationalGoalGuide = {
  blockers: string[];
  executionRule: string;
  status: string;
  title: string;
  verificationRule: string;
};

export type PublicBetaLaunchReadinessSummary = {
  a1MiniPacketGuide: PublicBetaA1MiniPacketGuide;
  asOfCommit: string;
  blockedItems: string[];
  completionPercent: number;
  dataReadinessGuide: PublicBetaDataReadinessGuide;
  externalInputRequestGuide: PublicBetaExternalInputRequestGuide;
  hardBlockerActions: PublicBetaHardBlockerAction[];
  headline: string;
  items: PublicBetaLaunchReadinessItem[];
  mockLaunchProofBundle: PublicBetaMockLaunchProofBundle;
  nextCommand: string;
  nextDecision: string;
  operationalGoalGuide: PublicBetaOperationalGoalGuide;
  platformValueGuide: PublicBetaPlatformValueGuide;
  runtimeBoundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
  };
  stopLine: string;
  subhead: string;
  worktreeGuide: PublicBetaWorktreeGuide;
};

const a1OutputFields = ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"];
const responseReadinessCommand = "cmd.exe /c npm run report:public-beta-external-input-response-readiness";
const a1PostReplyOneRunnerCommand = "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once";
const a1BoundedRepairRequestCommand = "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request";
const publicBetaPostReplyOneRunnerCommand = "cmd.exe /c npm run run:public-beta-post-reply-route-once";
const externalInputCopyPacketCommand = "cmd.exe /c npm run report:public-beta-external-input-copy-packet";
const externalInputFullRequestCommand = "cmd.exe /c npm run report:public-beta-external-input-request";
const externalA1ReplyPmClassificationPreviewCommand =
  "cmd.exe /c npm run report:public-beta-a1-reply-pm-classification-preview";
const externalReplyFileTemplateCommand = "cmd.exe /c npm run report:public-beta-external-reply-file-template";
const externalReplyIntakeDryRunCommand = "cmd.exe /c npm run report:public-beta-external-reply-intake-dry-run";
const externalReplyFileRouteCommand = "cmd.exe /c npm run report:public-beta-external-reply-file-route";
const externalReplyFileWorkflowProofCommand = "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof";

export function getPublicBetaLaunchReadinessSummary(): PublicBetaLaunchReadinessSummary {
  return {
    a1MiniPacketGuide: {
      afterA1Reply: [
        responseReadinessCommand,
        a1BoundedRepairRequestCommand,
        a1PostReplyOneRunnerCommand,
        "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
        "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
        "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface",
        "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
      ],
      boundedRepairRequest: {
        command: a1BoundedRepairRequestCommand,
        copyableA1Request: [
          "evidenceSlotId: vendor-terms-evidence",
          "sourceReferenceLabel: <no-secret reviewed TWII rights or terms label>",
          "safeEvidenceSummary: <state whether automated access, storage, retention, attribution, delayed/missing wording, derived display, rate limits, and commercial/internal use are allowed or unresolved>",
          "remainingRisk: <smallest rights blocker preventing PM acceptance>",
          "evidenceSlotId: internal-feed-owner-evidence",
          "sourceReferenceLabel: <no-secret internal feed owner or approval-path label>",
          "safeEvidenceSummary: <identify the owner role or approval path, or say none is available>",
          "remainingRisk: <whether owner authority remains blocked>",
          "evidenceSlotId: field-contract-evidence",
          "sourceReferenceLabel: <no-secret TWII field-contract decision label>",
          "safeEvidenceSummary: <confirm fields, calendar/session, timezone, precision, optional OHLC/turnover, revision policy, and daily_prices mapping>",
          "remainingRisk: <smallest unresolved field-contract decision>",
          "evidenceSlotId: asset-mapping-evidence",
          "sourceReferenceLabel: <no-secret TWII index asset-mapping label>",
          "safeEvidenceSummary: <confirm approved TWII index identifier and internal mapping without stock-id or row payloads>",
          "remainingRisk: <whether safe index mapping remains unresolved>"
        ],
        repairRequests: [
          {
            currentDraftClassification: "needs_bounded_repair",
            evidenceSlotId: "vendor-terms-evidence",
            requestedRemainingRisk: "Name the smallest remaining rights blocker that prevents PM from classifying this slot accepted.",
            requestedSafeEvidenceSummary:
              "State whether automated access, internal storage, retention, attribution, delayed/missing wording, derived display, rate limits, and commercial/internal use are allowed or still unresolved.",
            requestedSourceReferenceLabel: "no-secret reviewed TWII rights or terms label"
          },
          {
            currentDraftClassification: "blocked",
            evidenceSlotId: "internal-feed-owner-evidence",
            requestedRemainingRisk: "State whether this slot remains blocked because owner authority is unavailable.",
            requestedSafeEvidenceSummary:
              "Identify the owner role or approval path that can authorize project use, or explicitly say no owner/approval path is available.",
            requestedSourceReferenceLabel: "no-secret internal feed owner or approval-path label"
          },
          {
            currentDraftClassification: "needs_bounded_repair",
            evidenceSlotId: "field-contract-evidence",
            requestedRemainingRisk: "Name the smallest unresolved field-contract decision that prevents TWII candidate or daily_prices mapping.",
            requestedSafeEvidenceSummary:
              "Confirm the minimum TWII fields, calendar/session, timezone, precision, optional OHLC/turnover handling, revision policy, and daily_prices mapping decision.",
            requestedSourceReferenceLabel: "no-secret TWII field-contract decision label"
          },
          {
            currentDraftClassification: "needs_bounded_repair",
            evidenceSlotId: "asset-mapping-evidence",
            requestedRemainingRisk: "State whether safe index mapping is still unresolved before coverage rows or scoring can recognize TWII.",
            requestedSafeEvidenceSummary:
              "Confirm the approved TWII index identifier and internal mapping path without exposing stock-id payloads or row payloads.",
            requestedSourceReferenceLabel: "no-secret TWII index asset-mapping label"
          }
        ],
        status: "a1_twii_local_evidence_bounded_repair_request_ready",
        title: "A1 bounded repair request"
      },
      commandAfterFill: responseReadinessCommand,
      fields: a1OutputFields,
      fastTriagePacket: {
        afterAnyDryRun: "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
        completionRule:
          "All four TWII slots must be separately accepted before PM may consider the TWII source-rights outcome gate candidate.",
        firstCommand: "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
        requiredDecisionPerSlot: ["accepted", "rejected", "needs_bounded_repair", "blocked"],
        slotCount: 4,
        status: "ready_waiting_a1_no_secret_reply",
        stillNotAllowed: [
          "do_not_apply_from_this_packet",
          "do_not_record_evidence_from_this_packet",
          "do_not_approve_source_rights_from_this_packet",
          "do_not_award_row_coverage_from_this_packet",
          "do_not_fetch_market_data_from_this_packet"
        ],
        title: "A1 TWII PM fast triage packet"
      },
      mode: "four_slot_no_secret_reply",
      packetPath: "docs/A1_TWII_EVIDENCE_INTAKE_MINI_PACKET.md",
      pmClassificationQuickMap: {
        afterAnyDryRunCommand: "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
        classificationOptions: ["accepted", "rejected", "needs_bounded_repair", "blocked"],
        firstGuardCommand: "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
        rules: {
          accepted:
            "Complete, no-secret, responsive, and narrow enough for a separate TWII source-rights outcome-gate review.",
          rejected:
            "Unsafe, copied, wrong, includes forbidden content, or does not answer the requested slot.",
          needs_bounded_repair:
            "One narrow no-secret clarification can repair the slot without reopening broad source governance.",
          blocked:
            "Owner, rights, field contract, or asset mapping proof is unavailable or cannot be summarized safely."
        },
        status: "ready_for_pm_after_a1_no_secret_reply",
        stillNotAllowed: [
          "do_not_emit_apply_command",
          "do_not_record_evidence_from_this_report",
          "do_not_approve_source_rights_from_this_report",
          "do_not_award_row_coverage_from_this_report",
          "do_not_fetch_market_data_from_this_report"
        ],
        title: "A1 PM classification quick map"
      },
      pmClassificationQueue: [
        {
          currentRemainingRisk: "Source-rights outcome gate remains blocked.",
          evidenceSlotId: "vendor-terms-evidence",
          firstPmCommandAfterReply: responseReadinessCommand,
          oneRunnerCommandAfterReply: a1PostReplyOneRunnerCommand,
          pmClassificationOptions: ["accepted", "rejected", "needs_bounded_repair", "blocked"],
          secondPmCommandAfterReply: "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
          thirdPmCommandAfterReply: "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route"
        },
        {
          currentRemainingRisk: "Internal feed branch remains blocked.",
          evidenceSlotId: "internal-feed-owner-evidence",
          firstPmCommandAfterReply: responseReadinessCommand,
          oneRunnerCommandAfterReply: a1PostReplyOneRunnerCommand,
          pmClassificationOptions: ["accepted", "rejected", "needs_bounded_repair", "blocked"],
          secondPmCommandAfterReply: "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
          thirdPmCommandAfterReply: "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route"
        },
        {
          currentRemainingRisk: "Sanitized TWII candidate artifact shape remains blocked.",
          evidenceSlotId: "field-contract-evidence",
          firstPmCommandAfterReply: responseReadinessCommand,
          oneRunnerCommandAfterReply: a1PostReplyOneRunnerCommand,
          pmClassificationOptions: ["accepted", "rejected", "needs_bounded_repair", "blocked"],
          secondPmCommandAfterReply: "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
          thirdPmCommandAfterReply: "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route"
        },
        {
          currentRemainingRisk: "TWII row coverage route remains blocked.",
          evidenceSlotId: "asset-mapping-evidence",
          firstPmCommandAfterReply: responseReadinessCommand,
          oneRunnerCommandAfterReply: a1PostReplyOneRunnerCommand,
          pmClassificationOptions: ["accepted", "rejected", "needs_bounded_repair", "blocked"],
          secondPmCommandAfterReply: "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
          thirdPmCommandAfterReply: "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route"
        }
      ],
      pmQueueRule:
        "PM may classify only pending queue slots after response-readiness and the no-secret shape guard pass; prefer the one-runner command after A1 replies; this view never emits apply commands.",
      pmReviewRule:
        "PM only classifies accepted, rejected, needs_bounded_repair, or blocked. Do not open the outcome gate until all four TWII slots are accepted.",
      replyShape: [
        "evidenceSlotId: <one TWII slot id>",
        "sourceReferenceLabel: <no-secret reviewed source label>",
        "safeEvidenceSummary: <one to three sentences; no copied contract text, credentials, private links, or source extracts>",
        "remainingRisk: <one to two sentences; state what still blocks execution>"
      ],
      slotIds: [
        "vendor-terms-evidence",
        "internal-feed-owner-evidence",
        "field-contract-evidence",
        "asset-mapping-evidence"
      ],
      status: "4/4 pending",
      tasks: [
        {
          id: "vendor-terms-evidence",
          pmQuestion: "Confirm whether vendor terms allow public Beta use of TWII-derived data without exposing contract text.",
          requiredOutput: a1OutputFields,
          status: "pending"
        },
        {
          id: "internal-feed-owner-evidence",
          pmQuestion: "Confirm who owns or approves the internal feed path for TWII source-rights evidence.",
          requiredOutput: a1OutputFields,
          status: "pending"
        },
        {
          id: "field-contract-evidence",
          pmQuestion: "Confirm the field-level contract for TWII values that could become row coverage.",
          requiredOutput: a1OutputFields,
          status: "pending"
        },
        {
          id: "asset-mapping-evidence",
          pmQuestion: "Confirm the TWII asset mapping rule before any coverage row is counted.",
          requiredOutput: a1OutputFields,
          status: "pending"
        }
      ],
      title: "A1 TWII evidence task board"
    },
    asOfCommit: "59b2a54",
    blockedItems: [
      "Beta platform values are still missing: BETA_HOSTING_PROJECT_NAME and BETA_TEMPORARY_URL.",
      "A1 TWII evidence remains 4/4 pending, so the source-rights outcome gate is not open."
    ],
    completionPercent: 67,
    dataReadinessGuide: {
      coverage: "Level-1 MVP coverage: 182/360; TWII 0/60; ETF 2/120; TW equity 180/180.",
      ingestionStatus: "Ingestion/backfill has not been executed. Current work remains no-write, report-only, and sanitized readiness.",
      nextCommand: "cmd.exe /c npm run report:row-coverage-readonly-preexecution-packet",
      readonlyStatus: "Readonly pre-execution packet: ready_to_present_not_execute.",
      sourceRightsStatus: "Source-rights evidence is still blocked by the four A1 TWII slots; no row coverage points are opened yet.",
      title: "Data readiness frontier"
    },
    externalInputRequestGuide: {
      afterReplyCommand: externalReplyFileRouteCommand,
      afterReplyNextExecutableStep: {
        command: externalReplyFileRouteCommand,
        lane: "external_reply_file_route",
        reason:
          "After any platform or A1 reply, the shortest executable route is the reply-file route; it chooses template, bounded repair, workflow proof, or the lower-level response-readiness path without PM manually splitting steps."
      },
      a1FailFastPolicy: {
        pendingNextCommand: "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
        rule:
          "A1 classification is intentionally skipped until all four no-secret TWII evidence slots are present; the post-reply runner reports this as a safe missing-input state, not a runtime failure.",
        skippedUntilEvidencePresent: [
          "a1-no-secret-shape-guard",
          "a1-pm-classification-route",
          "a1-reviewed-outcome-surface",
          "a1-source-rights-readiness-summary"
        ],
        status: "a1_twii_four_slot_no_secret_evidence_missing_skip_a1_chain"
      },
      command: externalInputCopyPacketCommand,
      description:
        "Smallest no-secret copy packet for the two remaining external blocker groups. Use the full external-input request only when more detail is needed; after any reply, run the response-readiness report before packet-window or A1 gate work.",
      replyIntakeDryRun: {
        a1PmPreviewCommand: externalA1ReplyPmClassificationPreviewCommand,
        command: externalReplyIntakeDryRunCommand,
        completeReplyNextCommand: externalReplyFileWorkflowProofCommand,
        fileTextEchoed: false,
        purpose:
          "When PM/A1 has filled the copy packet into a local text file, set PUBLIC_BETA_EXTERNAL_REPLY_PATH and run this dry-run intake, then use the workflow proof to bridge into the post-reply one-runner without storing values.",
        requiredEnvVar: "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
        routeCommand: externalReplyFileRouteCommand,
        templateCommand: externalReplyFileTemplateCommand,
        unsafeReplyFallbackCommand: externalInputCopyPacketCommand,
        valueEchoed: false,
        workflowProofCommand: externalReplyFileWorkflowProofCommand
      },
      missingOnlyReplyPacket: {
        afterAnyReplyFirstCommand: responseReadinessCommand,
        blockCount: 2,
        blocks: [
          {
            id: "beta_platform_two_values",
            lines: [
              "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>",
              "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"
            ],
            owner: "PM or hosting operator",
            title: "Missing now - Beta platform two values"
          },
          {
            id: "a1_twii_four_slot_no_secret_evidence",
            lines: [
              "vendor-terms-evidence",
              "internal-feed-owner-evidence",
              "field-contract-evidence",
              "asset-mapping-evidence"
            ],
            owner: "A1 Data / Supabase / Market Evidence",
            title: "Missing now - A1 TWII four evidence slots"
          }
        ],
        status: "missing_external_reply_blocks_present",
        title: "Only missing now"
      },
      oneScreenReplyPacket: {
        a1Block: {
          afterReply: [
            externalReplyFileRouteCommand,
            responseReadinessCommand,
            a1BoundedRepairRequestCommand,
            a1PostReplyOneRunnerCommand,
            "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
            "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
            "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface",
            "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
          ],
          failFastRule:
            "If any A1 TWII slot is still missing, the one-runner stops after response-readiness and returns to report:a1-twii-four-slot-reply-request.",
          lines: [
            "evidenceSlotId: vendor-terms-evidence",
            "sourceReferenceLabel: <no-secret reviewed terms label>",
            "safeEvidenceSummary: <one to three sentences; no copied contract text, credentials, private links, source extracts, raw market data, row payloads, or stock-id payloads>",
            "remainingRisk: <one to two sentences; say what still blocks execution or approval>",
            "",
            "evidenceSlotId: internal-feed-owner-evidence",
            "sourceReferenceLabel: <no-secret owner or approval-path label>",
            "safeEvidenceSummary: <one to three sentences; no copied contract text, credentials, private links, source extracts, raw market data, row payloads, or stock-id payloads>",
            "remainingRisk: <one to two sentences; say what still blocks execution or approval>",
            "",
            "evidenceSlotId: field-contract-evidence",
            "sourceReferenceLabel: <no-secret field-contract label>",
            "safeEvidenceSummary: <one to three sentences; no copied contract text, credentials, private links, source extracts, raw market data, row payloads, or stock-id payloads>",
            "remainingRisk: <one to two sentences; say what still blocks execution or approval>",
            "",
            "evidenceSlotId: asset-mapping-evidence",
            "sourceReferenceLabel: <no-secret asset-mapping label>",
            "safeEvidenceSummary: <one to three sentences; no copied contract text, credentials, private links, source extracts, raw market data, row payloads, or stock-id payloads>",
            "remainingRisk: <one to two sentences; say what still blocks execution or approval>"
          ],
          owner: "A1 Data / Supabase / Market Evidence",
          pendingSlotIds: [
            "vendor-terms-evidence",
            "internal-feed-owner-evidence",
            "field-contract-evidence",
            "asset-mapping-evidence"
          ],
          requiredPerSlot: a1OutputFields,
          title: "Block 2 - A1 TWII four-slot no-secret evidence"
        },
        completeWhen: [
          "both beta platform lines are filled with safe non-secret values",
          "all four A1 TWII slot summaries are provided in no-secret shape",
          "response-readiness passes before the post-reply runner"
        ],
        platformBlock: {
          afterReply: [externalReplyFileRouteCommand, responseReadinessCommand, publicBetaPostReplyOneRunnerCommand],
          lines: [
            "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>",
            "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"
          ],
          owner: "PM or hosting operator",
          title: "Block 1 - Beta platform two values"
        },
        purpose: "Copy this one screen into the PM/A1 handoff. Fill placeholders only; keep secrets and raw payloads out.",
        title: "PM one-screen reply packet"
      },
      replyChecklist: {
        a1RequiredPerSlot: a1OutputFields,
        a1SlotIds: [
          "vendor-terms-evidence",
          "internal-feed-owner-evidence",
          "field-contract-evidence",
          "asset-mapping-evidence"
        ],
        afterAnyReplyFirstCommand: externalReplyFileRouteCommand,
        fallbackResponseReadinessCommand: responseReadinessCommand,
        platformLines: [
          "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>",
          "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"
        ],
        stillNotAllowed: [
          "Do not print or store platform values in repo.",
          "Do not record A1 evidence from this report.",
          "Do not approve source rights from this report.",
          "Do not deploy from this report."
        ]
      },
      replyPacketContract: {
        a1OneRunnerAfterEvidenceReply: a1PostReplyOneRunnerCommand,
        completeReplyRequires: [
          {
            blockId: "beta_platform_two_values",
            completionRule:
              "Both platform lines must be present and shape-safe: project name is a plain slug and temporary URL is public https only.",
            requiredFields: ["BETA_HOSTING_PROJECT_NAME", "BETA_TEMPORARY_URL"]
          },
          {
            blockId: "a1_twii_four_slot_no_secret_evidence",
            completionRule:
              "All four TWII slots must include the four no-secret fields before PM can run the A1 classification chain.",
            requiredFieldsPerSlot: a1OutputFields,
            requiredSlotCount: 4
          }
        ],
        doneSignals: [
          "platform_two_values_shape_valid",
          "a1_four_twii_slots_present_in_no_secret_shape",
          "response_readiness_routes_to_post_reply_one_runner"
        ],
        firstCommandAfterAnyReply: externalReplyFileRouteCommand,
        fallbackResponseReadinessCommand: responseReadinessCommand,
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
        oneRunnerAfterShapeSafeReply: publicBetaPostReplyOneRunnerCommand,
        status: "pm_reply_packet_contract_ready",
        stillNotAllowed: [
          "do_not_store_platform_values_in_repo",
          "do_not_record_a1_evidence_from_this_request",
          "do_not_deploy_from_this_request",
          "do_not_promote_publicDataSource_or_scoreSource_from_this_request"
        ],
        title: "PM reply packet contract"
      },
      requestBlocks: [
        "beta_platform_two_values",
        "a1_twii_four_slot_no_secret_evidence"
      ],
      status: "ready_waiting_external_replies",
      title: "External input request"
    },
    hardBlockerActions: [
      {
        commands: [
          externalInputCopyPacketCommand,
          externalInputFullRequestCommand,
          responseReadinessCommand,
          publicBetaPostReplyOneRunnerCommand,
          "cmd.exe /c npm run report:beta-mainline-current-route"
        ],
        id: "beta_platform_two_values",
        nextProof:
          "When both values are present, run response-readiness, then the combined post-reply one-runner, then return to the PM mainline route.",
        requiredInput: ["BETA_HOSTING_PROJECT_NAME", "BETA_TEMPORARY_URL"],
        status: "waiting",
        title: "Beta platform two values"
      },
      {
        commands: [
          "cmd.exe /c npm run report:a1-twii-evidence-completion-status",
          a1PostReplyOneRunnerCommand,
          "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
          "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
          "cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route"
        ],
        id: "a1_twii_four_slot_evidence",
        nextProof: "When all four no-secret slots are accepted, open the source-rights outcome gate candidate route.",
        requiredInput: [
          "vendor-terms-evidence",
          "internal-feed-owner-evidence",
          "field-contract-evidence",
          "asset-mapping-evidence"
        ],
        status: "waiting",
        title: "A1 TWII four-slot no-secret evidence"
      }
    ],
    headline: "Public Beta pre-launch executable state",
    items: [
      {
        detail:
          "Home, briefing, weekly, stock, methodology, disclaimer, terms, and privacy routes are covered by fast health and core route quick proof.",
        id: "runtime_core_routes",
        label: "Runtime route health",
        status: "Ready",
        tone: "ready"
      },
      {
        detail:
          "Deployment readiness is now narrowed to two non-secret platform values and the packet proof route. No deployment has been executed.",
        id: "beta_platform_values_and_packet",
        label: "Beta deployment readiness",
        status: "Blocked",
        tone: "blocked"
      },
      {
        detail:
          "PM worktree review is classified with no unresolved items. Git snapshot remains a recommended safeguard, not a current public Beta hard blocker.",
        id: "pm_worktree_snapshot",
        label: "PM worktree snapshot",
        status: "Safeguard ready",
        tone: "ready"
      },
      {
        detail:
          "A1 still needs four no-secret TWII evidence slots before any source-rights outcome gate or row coverage point can open.",
        id: "a1_source_rights_and_coverage_frontier",
        label: "A1 data/source-rights frontier",
        status: "4 pending",
        tone: "blocked"
      },
      {
        detail:
          "Public trust copy is stable and keeps the site honest: mock-only, no investment advice, and no real-data promotion.",
        id: "a2_public_trust_copy",
        label: "Public trust copy",
        status: "Ready",
        tone: "ready"
      },
      {
        detail:
          "Promotion gate remains closed. Public data source and score source stay mock until source-rights, coverage, quality, and runtime gates pass.",
        id: "promotion_boundary",
        label: "Mock / real boundary",
        status: "Held",
        tone: "hold"
      }
    ],
    mockLaunchProofBundle: {
      commands: [
        "cmd.exe /c npm run report:public-beta-mock-launch-proof-bundle",
        "cmd.exe /c npm run check:public-beta-mock-launch-proof-bundle",
        "cmd.exe /c npm run check:public-beta-production-build-proof",
        "cmd.exe /c npm run check:public-beta-core-route-quick-proof"
      ],
      hardStop:
        "Mock-only proof bundle: no deployment, SQL, Supabase read/write, market-data fetch, source promotion, or score promotion.",
      status: "ready_external_inputs_pending",
      title: "Public Beta mock launch proof bundle"
    },
    nextCommand: externalInputCopyPacketCommand,
    nextDecision:
      "CEO/PM next route: use the external-input copy packet, collect the two platform values and A1 four-slot no-secret evidence, then run response-readiness and the combined post-reply one-runner.",
    operationalGoalGuide: {
      blockers: [
        "BETA_HOSTING_PROJECT_NAME",
        "BETA_TEMPORARY_URL",
        "A1 TWII four-slot no-secret source-rights evidence"
      ],
      executionRule:
        "Operational GOAL v3: close only the active external blocker chain; advance platform values, packet proof, A1 evidence classification, or runtime route health.",
      status: "fast_track_active",
      title: "Operational GOAL v3 execution first",
      verificationRule:
        "Focused checks prove each slice; reviewed-artifact recording stays dry-run until a separate PM apply decision; full review gate is reserved for milestone integration."
    },
    platformValueGuide: {
      afterValidation: [
        responseReadinessCommand,
        publicBetaPostReplyOneRunnerCommand,
        "cmd.exe /c npm run report:beta-mainline-current-route"
      ],
      allowed: [
        "One hosting project or site name, for example taiwan-market-signal-beta.",
        "One public https Beta URL, for example https://project-name.vercel.app/.",
        "Plain public hosting values only; no key, token, secret, or dashboard URL."
      ],
      blocked: [
        "Supabase API URL or Supabase dashboard URL.",
        "token, secret, key, password, invite, or private preview token.",
        "localhost, URL with query string, or URL with hash."
      ],
      commandAfterFill: responseReadinessCommand,
      fields: ["BETA_HOSTING_PROJECT_NAME", "BETA_TEMPORARY_URL"],
      replyTemplate: [
        "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>",
        "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"
      ],
      sourceHint: "Get these from Vercel, Netlify, or Cloudflare Pages. Do not get them from Supabase.",
      title: "Beta platform values"
    },
    runtimeBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    stopLine: "No secrets, no raw market data, no Supabase write, no real source, and no real score before promotion gates pass.",
    subhead:
      "CEO/PM mainline is narrowed to two external inputs and one packet proof route. Governance stays lightweight unless a launch gate requires it.",
    worktreeGuide: {
      acceptedCount: 111,
      backupBlocker: "git_snapshot_is_recommended_safeguard_not_current_public_beta_hard_blocker",
      command: "cmd.exe /c npm run report:pm-worktree-review-preflight",
      excludedCount: 1,
      nextRoute: "collect_external_input_response_then_run_public_beta_post_reply_one_runner",
      status: "Safeguard ready; no unresolved worktree items",
      title: "PM worktree review",
      unresolvedCount: 0
    }
  };
}
