import { spawnSync } from "node:child_process";

const platform = runJson(["cmd.exe", "/c", "npm", "run", "validate:beta-platform-two-values"]);
const a1Shape = runJson(["cmd.exe", "/c", "npm", "run", "check:a1-twii-evidence-response-shape"]);
const a1Completion = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-twii-evidence-completion-status"]);
const a1LocalDraft = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-twii-local-evidence-candidate-draft"]);
const postReplyOneRunnerCommand = "cmd.exe /c npm run run:public-beta-post-reply-route-once";
const externalInputCopyPacketCommand = "cmd.exe /c npm run report:public-beta-external-input-copy-packet";

const platformAccepted = platform.json?.status === "accepted_two_value_shape_only";
const a1Ready = a1Completion.json?.status === "a1_twii_four_slot_evidence_ready_for_outcome_gate_route";

const status = platformAccepted
  ? a1Ready
    ? "external_input_response_ready_for_packet_and_a1_outcome_gate"
    : "platform_values_ready_a1_evidence_pending"
  : a1Ready
    ? "a1_evidence_ready_platform_values_pending"
    : "blocked_waiting_external_input_response";

const nextExecutableStep = chooseNextExecutableStep({ platformAccepted, a1Ready });
const missingOnlyReplyPacket = buildMissingOnlyReplyPacket({ platformAccepted, a1Ready });
const nextCommands = [];

if (!platformAccepted) {
  nextCommands.push(externalInputCopyPacketCommand);
} else {
  nextCommands.push(postReplyOneRunnerCommand);
  nextCommands.push("cmd.exe /c npm run report:beta-mainline-current-route");
}

if (!a1Ready) {
  nextCommands.push("cmd.exe /c npm run report:a1-twii-four-slot-reply-request");
} else {
  nextCommands.push("cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once");
  nextCommands.push("cmd.exe /c npm run check:a1-twii-evidence-response-shape");
  nextCommands.push("cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route");
  nextCommands.push("cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface");
  nextCommands.push("cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route");
}

const report = {
  status,
  ok: true,
  mode: "public_beta_external_input_response_readiness",
  ceoDecision: "use_one_local_after_reply_readiness_report_before_packet_or_a1_gate",
  purpose:
    "After PM receives external replies, summarize whether the platform two-value path and A1 four-slot evidence path are ready for their next gates.",
  platformTwoValues: {
    status: platform.json?.status ?? "unknown",
    ok: platformAccepted,
    provided: {
      hostingProjectName: platform.json?.values?.hostingProjectNameProvided === true,
      temporaryBetaUrl: platform.json?.values?.temporaryBetaUrlProvided === true
    },
    loadedFromEnvLocal: platform.json?.values?.loadedFromEnvLocal === true,
    problems: Array.isArray(platform.json?.problems) ? platform.json.problems : [],
    nextRoute: platform.json?.nextRoute ?? "unknown"
  },
  a1TwiiFourSlotEvidence: {
    status: a1Completion.json?.status ?? "unknown",
    ok: a1Ready,
    shapeGuardStatus: a1Shape.json?.status ?? "unknown",
    counts: a1Completion.json?.counts ?? {
      accepted: 0,
      pending: 4,
      required: 4
    },
    requiredFields: a1Completion.json?.requiredA1ReplyFields ?? [
      "evidenceSlotId",
      "sourceReferenceLabel",
      "safeEvidenceSummary",
      "remainingRisk"
    ],
    nextAction: a1Completion.json?.nextAction ?? "ask_a1_for_only_the_pending_no_secret_slot_summaries"
  },
  a1LocalEvidenceCandidateDraft: {
    status: a1LocalDraft.json?.status ?? "unavailable",
    readyStatus: "a1_twii_local_evidence_candidate_draft_ready_for_pm_classification",
    command: "cmd.exe /c npm run report:a1-twii-local-evidence-candidate-draft",
    candidateSlotCount: Number(a1LocalDraft.json?.candidateSlots?.length ?? 0),
    suggestedPmClassifications: Array.isArray(a1LocalDraft.json?.candidateSlots)
      ? a1LocalDraft.json.candidateSlots.map((slot) => ({
        evidenceSlotId: slot.evidenceSlotId,
        suggestedPmClassification: slot.suggestedPmClassification,
        nextGateCandidate: slot.nextGateCandidate
      }))
      : [],
    rule:
      "Use this local no-secret draft only to guide PM classification/repair planning; it does not record evidence, approve source rights, open TWII execution, fetch market data, or touch Supabase."
  },
  externalReplyChecklistStatus: {
    status: platformAccepted || a1Ready ? "partially_satisfied_or_ready_for_next_gate" : "combined_reply_checklist_still_required",
    requestCommand: externalInputCopyPacketCommand,
    fallbackFullRequestCommand: "cmd.exe /c npm run report:public-beta-external-input-request",
    platformFieldsRequired: platformAccepted ? [] : ["BETA_HOSTING_PROJECT_NAME", "BETA_TEMPORARY_URL"],
    a1PendingSlotCount: a1Ready ? 0 : Number(a1Completion.json?.counts?.pending ?? 4),
    afterAnyReplyFirstCommand: "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
    noSecretRule:
      "Do not include secrets, dashboard URLs, Supabase URLs, private preview tokens, contract text, raw payloads, row payloads, or stock-id payloads."
  },
  missingOnlyReplyPacket,
  nextExecutableStep,
  nextCommands: unique(nextCommands),
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
  stopLines: [
    "This report does not print platform values.",
    "This report does not store platform values.",
    "This report does not record A1 evidence.",
    "This report does not approve source rights.",
    "This report does not create packet-window artifacts.",
    "This report does not deploy or mutate hosting resources.",
    "This report does not execute SQL or connect to Supabase.",
    "This report does not fetch, store, ingest, or commit raw market data.",
    "publicDataSource remains mock and scoreSource remains mock."
  ],
  sourceReports: {
    betaPlatformTwoValueValidator: sourceSummary(platform),
    a1TwiiEvidenceResponseShape: sourceSummary(a1Shape),
    a1TwiiEvidenceCompletionStatus: sourceSummary(a1Completion),
    a1TwiiLocalEvidenceCandidateDraft: sourceSummary(a1LocalDraft)
  }
};

console.log(JSON.stringify(report, null, 2));

function runJson(command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout: 300000,
    windowsHide: true
  });

  return {
    command: command.join(" "),
    status: result.status,
    stderrPrinted: (result.stderr ?? "").trim().length > 0,
    json: parseJson(result.stdout ?? "")
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

function sourceSummary(result) {
  return {
    exitCode: result.status,
    parsedJson: Boolean(result.json),
    stderrPrinted: result.stderrPrinted
  };
}

function unique(values) {
  return [...new Set(values)];
}

function chooseNextExecutableStep({ platformAccepted, a1Ready }) {
  if (platformAccepted) {
    return {
      lane: "pm_mainline_post_reply_packet_window",
      command: postReplyOneRunnerCommand,
      reason:
        "The two platform values are shape-valid, so the next launch-chain step is the combined post-reply one-runner; it will execute the platform proof chain internally.",
      afterSuccess:
        "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --dry-run --outcome accepted --reviewedBy PM --note \"PM dry-run verifies the no-secret packet-window reviewed artifact before any apply decision.\""
    };
  }

  if (a1Ready) {
    return {
      lane: "a1_twii_source_rights_outcome_gate_candidate",
      command: "cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route",
      reason:
        "The four TWII no-secret evidence slots are accepted, but platform values are still missing; continue the A1 outcome-gate route while mainline waits.",
      afterSuccess: "cmd.exe /c npm run report:beta-mainline-current-route"
    };
  }

  return {
    lane: "external_input_copy_packet",
    command: externalInputCopyPacketCommand,
    reason:
      "The two platform values and the four A1 TWII no-secret evidence slots are still missing; use the smallest copyable external-input packet as the shortest path.",
    afterSuccess: "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
  };
}

function buildMissingOnlyReplyPacket({ platformAccepted, a1Ready }) {
  const missingBlocks = [];

  if (!platformAccepted) {
    missingBlocks.push({
      id: "beta_platform_two_values",
      owner: "PM or hosting operator",
      requiredFields: ["BETA_HOSTING_PROJECT_NAME", "BETA_TEMPORARY_URL"],
      copyableLines: [
        "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>",
        "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"
      ],
      acceptedShape:
        "Project name must be a plain slug; URL must be public https. Do not include secrets, dashboard URLs, private preview tokens, query strings, or hashes."
    });
  }

  if (!a1Ready) {
    const pendingSlotIds = Array.isArray(a1Completion.json?.pendingSlotIds)
      ? a1Completion.json.pendingSlotIds
      : [
        "vendor-terms-evidence",
        "internal-feed-owner-evidence",
        "field-contract-evidence",
        "asset-mapping-evidence"
      ];
    missingBlocks.push({
      id: "a1_twii_four_slot_no_secret_evidence",
      owner: "A1 Data / Supabase / Market Evidence",
      pendingSlotIds,
      requiredPerSlot: ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"],
      copyableLines: pendingSlotIds.flatMap((slotId) => [
        `evidenceSlotId: ${slotId}`,
        "sourceReferenceLabel: <no-secret reviewed source label>",
        "safeEvidenceSummary: <one to three sentences; no copied contract text, credentials, private links, source extracts, raw market data, row payloads, or stock-id payloads>",
        "remainingRisk: <one to two sentences; say what still blocks execution or approval>",
        ""
      ])
    });
  }

  return {
    status: missingBlocks.length === 0 ? "complete_no_missing_external_reply_blocks" : "missing_external_reply_blocks_present",
    purpose: "Show only the external reply blocks still missing right now, so PM does not re-open completed lanes.",
    blockCount: missingBlocks.length,
    missingBlockIds: missingBlocks.map((block) => block.id),
    afterAnyReplyFirstCommand: "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
    stillNotAllowed: [
      "do_not_print_or_store_platform_values_in_repo",
      "do_not_record_a1_evidence_from_this_report",
      "do_not_approve_source_rights_from_this_report",
      "do_not_deploy_from_this_report"
    ],
    blocks: missingBlocks
  };
}
