import fs from "node:fs";
import { spawnSync } from "node:child_process";

const outcomePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const twiiSlots = [
  {
    id: "vendor-terms-evidence",
    question: "Do reviewed terms allow the intended internal use and derived display path?",
    labelHint: "no-secret reviewed terms label"
  },
  {
    id: "internal-feed-owner-evidence",
    question: "If using an internal feed, who owns it and who can authorize project use?",
    labelHint: "no-secret owner or approval-path label"
  },
  {
    id: "field-contract-evidence",
    question: "Are the TWII fields required by the model contract approved and stable enough to map?",
    labelHint: "no-secret field-contract label"
  },
  {
    id: "asset-mapping-evidence",
    question: "Is the TWII index symbol or asset mapping approved for coverage rows?",
    labelHint: "no-secret asset-mapping label"
  }
];
const requiredFields = [
  "evidenceSlotId",
  "sourceReferenceLabel",
  "safeEvidenceSummary",
  "remainingRisk"
];
const responseReadinessCommand = "cmd.exe /c npm run report:public-beta-external-input-response-readiness";
const a1PostReplyOneRunnerCommand = "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once";
const localEvidenceCandidateDraftCommand = "cmd.exe /c npm run report:a1-twii-local-evidence-candidate-draft";
const localEvidenceBoundedRepairRequestCommand = "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request";
const localEvidenceCandidateDraftReadyStatus = "a1_twii_local_evidence_candidate_draft_ready_for_pm_classification";
const localEvidenceBoundedRepairRequestReadyStatus = "a1_twii_local_evidence_bounded_repair_request_ready";

const outcomes = readOutcomes(outcomePath);
const localEvidenceCandidateDraft = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-twii-local-evidence-candidate-draft"]);
const localEvidenceBoundedRepairRequest = runJson([
  "cmd.exe",
  "/c",
  "npm",
  "run",
  "report:a1-twii-local-evidence-bounded-repair-request"
]);
const outcomesById = new Map(outcomes.map((item) => [item.id, item]));
const slots = twiiSlots.map((slot) => {
  const outcome = outcomesById.get(slot.id);
  const classification = outcome?.classification ?? "missing";
  const pmQuestionResolved = outcome?.pmQuestionResolved === true;
  const accepted = classification === "accepted" && pmQuestionResolved;

  return {
    id: slot.id,
    question: slot.question,
    currentClassification: classification,
    pmQuestionResolved,
    status: accepted ? "accepted_ready_for_outcome_gate" : "needs_a1_no_secret_reply",
    sourceReferenceLabelHint: slot.labelHint,
    replyTemplate: {
      evidenceSlotId: slot.id,
      sourceReferenceLabel: `<${slot.labelHint}>`,
      safeEvidenceSummary: "<one to three sentences; no copied contract text, private links, credentials, source extracts, row payloads, or raw market data>",
      remainingRisk: "<one to two sentences; state what still blocks execution, display, field mapping, retention, redistribution, or approval>"
    }
  };
});
const pendingSlots = slots.filter((slot) => slot.status !== "accepted_ready_for_outcome_gate");
const acceptedSlots = slots.filter((slot) => slot.status === "accepted_ready_for_outcome_gate");

const report = {
  mode: "a1_twii_four_slot_reply_request",
  status:
    pendingSlots.length === 0
      ? "a1_twii_four_slot_reply_already_classified"
      : "a1_twii_four_slot_reply_request_ready",
  ok: true,
  ceoDecision: "compress_a1_next_action_to_one_four_slot_no_secret_reply",
  owner: "A1 Data / Supabase / Market Evidence",
  integrator: "PM mainline",
  outcomeData: outcomePath,
  counts: {
    accepted: acceptedSlots.length,
    pending: pendingSlots.length,
    required: twiiSlots.length
  },
  requestForA1: {
    instruction:
      "Return only the pending TWII slot summaries in the required no-secret shape. Do not paste contract text, credentials, private URLs, source extracts, raw market data, row payloads, or stock-id payloads.",
    requiredFields,
    pendingSlotIds: pendingSlots.map((slot) => slot.id),
    copyableReplyTemplate: pendingSlots.flatMap((slot) => [
      `evidenceSlotId: ${slot.id}`,
      `sourceReferenceLabel: <${slot.sourceReferenceLabelHint}>`,
      "safeEvidenceSummary: <one to three sentences; no copied contract text, credentials, private links, source extracts, raw market data, row payloads, or stock-id payloads>",
      "remainingRisk: <one to two sentences; say what still blocks execution or approval>",
      ""
    ])
  },
  localEvidenceCandidateDraft: {
    status:
      localEvidenceCandidateDraft.json?.status ??
      "a1_twii_local_evidence_candidate_draft_unavailable",
    readyStatus: localEvidenceCandidateDraftReadyStatus,
    command: localEvidenceCandidateDraftCommand,
    candidateSlotCount: Array.isArray(localEvidenceCandidateDraft.json?.candidateSlots)
      ? localEvidenceCandidateDraft.json.candidateSlots.length
      : 0,
    suggestedPmClassifications: Array.isArray(localEvidenceCandidateDraft.json?.candidateSlots)
      ? localEvidenceCandidateDraft.json.candidateSlots.map((slot) => ({
        evidenceSlotId: slot.evidenceSlotId,
        suggestedPmClassification: slot.suggestedPmClassification,
        nextGateCandidate: slot.nextGateCandidate
      }))
      : [],
    rule:
      "Use the local draft only as a PM classification aid; it does not record evidence, approve source rights, or open TWII execution."
  },
  localEvidenceBoundedRepairRequest: {
    status:
      localEvidenceBoundedRepairRequest.json?.status ??
      "a1_twii_local_evidence_bounded_repair_request_unavailable",
    readyStatus: localEvidenceBoundedRepairRequestReadyStatus,
    command: localEvidenceBoundedRepairRequestCommand,
    repairRequestCount: Array.isArray(localEvidenceBoundedRepairRequest.json?.repairRequests)
      ? localEvidenceBoundedRepairRequest.json.repairRequests.length
      : 0,
    copyableA1Request: Array.isArray(localEvidenceBoundedRepairRequest.json?.copyableA1Request)
      ? localEvidenceBoundedRepairRequest.json.copyableA1Request
      : [],
    rule:
      "Use the bounded repair request only to ask A1 for the smallest no-secret fixes needed for PM classification."
  },
  pmClassificationQuickMap: {
    status: "ready_for_pm_after_a1_no_secret_reply",
    firstGuardCommand: "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
    classificationOptions: [
      "accepted",
      "rejected",
      "needs_bounded_repair",
      "blocked"
    ],
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
  },
  pmAfterA1ReplyFirstCommand: responseReadinessCommand,
  pmAfterA1ReplyOneRunnerCommand: a1PostReplyOneRunnerCommand,
  pmAfterA1Reply: [
    responseReadinessCommand,
    localEvidenceCandidateDraftCommand,
    localEvidenceBoundedRepairRequestCommand,
    a1PostReplyOneRunnerCommand,
    "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
    "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
    "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface",
    "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
  ],
  slots,
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  safety: {
    applyCommandEmitted: false,
    candidateArtifactGenerated: false,
    connectionAttempted: false,
    evidenceRecorded: false,
    ingestionStarted: false,
    marketDataFetched: false,
    publicSourcePromoted: false,
    rawPayloadPrinted: false,
    rowCoverageAwarded: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false
  },
  stopLines: [
    "No A1 evidence is recorded by this report.",
    "No --apply command is emitted by this report.",
    "No source-rights approval is granted by this report.",
    "No candidate artifact is generated by this report.",
    "No row coverage points are awarded by this report.",
    "No SQL is executed by this report.",
    "No Supabase connection, read, or write is executed by this report.",
    "No raw market data is fetched, stored, ingested, or committed by this report.",
    "publicDataSource remains mock and scoreSource remains mock."
  ]
};

console.log(JSON.stringify(report, null, 2));

function readOutcomes(filePath) {
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(parsed.outcomes)) throw new Error("Outcome file must include outcomes array");
  return parsed.outcomes;
}

function runJson(command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout: 120000,
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
