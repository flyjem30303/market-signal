import { spawnSync } from "node:child_process";

const draftCommand = "cmd.exe /c npm run report:a1-twii-local-evidence-candidate-draft";
const draft = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-twii-local-evidence-candidate-draft"]);
const candidateSlots = Array.isArray(draft.json?.candidateSlots) ? draft.json.candidateSlots : [];
const repairRequests = candidateSlots.map(buildRepairRequest);

const report = {
  status: "a1_twii_local_evidence_bounded_repair_request_ready",
  ok: true,
  mode: "a1_twii_local_evidence_bounded_repair_request",
  ceoDecision: "convert_a1_local_draft_to_minimal_repair_questions",
  purpose:
    "Turn the existing local no-secret TWII draft into narrow A1 repair questions, so PM can request only the missing evidence needed for classification.",
  sourceDraft: {
    status: draft.json?.status ?? "unavailable",
    command: draftCommand,
    candidateSlotCount: candidateSlots.length
  },
  repairRequests,
  copyableA1Request: repairRequests.flatMap((item) => [
    `evidenceSlotId: ${item.evidenceSlotId}`,
    `sourceReferenceLabel: <${item.requestedSourceReferenceLabel}>`,
    `safeEvidenceSummary: <${item.requestedSafeEvidenceSummary}>`,
    `remainingRisk: <${item.requestedRemainingRisk}>`,
    ""
  ]),
  pmUseRule:
    "Use this only to request bounded no-secret repairs from A1. It does not record evidence, approve source rights, open TWII execution, or emit apply commands.",
  recommendedNextCommands: [
    "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
    "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
    "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once"
  ],
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  safety: {
    applyCommandEmitted: false,
    candidateArtifactGenerated: false,
    connectionAttempted: false,
    evidenceRecorded: false,
    hostingMutated: false,
    marketDataFetched: false,
    publicSourcePromoted: false,
    rawPayloadPrinted: false,
    rowCoverageAwarded: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sourceRightsApproved: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false
  },
  stopLines: [
    "This report does not record A1 evidence.",
    "This report does not approve source rights.",
    "This report does not generate TWII candidates.",
    "This report does not emit apply commands.",
    "This report does not fetch, store, ingest, or commit raw market data.",
    "This report does not print secrets, raw payloads, row payloads, or stock id payloads.",
    "This report does not connect to Supabase, run SQL, write Supabase, create staging rows, or modify daily_prices.",
    "publicDataSource remains mock and scoreSource remains mock."
  ]
};

console.log(JSON.stringify(report, null, 2));

function buildRepairRequest(slot) {
  const common = {
    evidenceSlotId: slot.evidenceSlotId,
    currentDraftClassification: slot.suggestedPmClassification,
    nextGateCandidate: slot.nextGateCandidate,
    currentSafeSummary: slot.safeEvidenceSummary,
    currentRemainingRisk: slot.remainingRisk,
    noSecretRequired: true,
    forbiddenContent:
      "Do not paste copied contract text, credentials, private links, source extracts, raw market data, row payloads, stock-id payloads, dashboard URLs, or secrets."
  };

  if (slot.evidenceSlotId === "vendor-terms-evidence") {
    return {
      ...common,
      requestedSourceReferenceLabel: "no-secret reviewed TWII rights or terms label",
      requestedSafeEvidenceSummary:
        "State whether automated access, internal storage, retention, attribution, delayed/missing wording, derived display, rate limits, and commercial/internal use are allowed or still unresolved.",
      requestedRemainingRisk:
        "Name the smallest remaining rights blocker that prevents PM from classifying this slot accepted."
    };
  }

  if (slot.evidenceSlotId === "internal-feed-owner-evidence") {
    return {
      ...common,
      requestedSourceReferenceLabel: "no-secret internal feed owner or approval-path label",
      requestedSafeEvidenceSummary:
        "Identify the owner role or approval path that can authorize project use, or explicitly say no owner/approval path is available.",
      requestedRemainingRisk:
        "State whether this slot remains blocked because owner authority is unavailable."
    };
  }

  if (slot.evidenceSlotId === "field-contract-evidence") {
    return {
      ...common,
      requestedSourceReferenceLabel: "no-secret TWII field-contract decision label",
      requestedSafeEvidenceSummary:
        "Confirm the minimum TWII fields, calendar/session, timezone, precision, optional OHLC/turnover handling, revision policy, and daily_prices mapping decision.",
      requestedRemainingRisk:
        "Name the smallest unresolved field-contract decision that prevents TWII candidate or daily_prices mapping."
    };
  }

  return {
    ...common,
    requestedSourceReferenceLabel: "no-secret TWII index asset-mapping label",
    requestedSafeEvidenceSummary:
      "Confirm the approved TWII index identifier and internal mapping path without exposing stock-id payloads or row payloads.",
    requestedRemainingRisk:
      "State whether safe index mapping is still unresolved before coverage rows or scoring can recognize TWII."
  };
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
    json: parseJson(result.stdout ?? "")
  };
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  if (start < 0) return null;
  try {
    return JSON.parse(stdout.slice(start));
  } catch {
    return null;
  }
}
