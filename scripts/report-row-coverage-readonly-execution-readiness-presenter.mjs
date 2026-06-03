import { spawnSync } from "node:child_process";

const packetRun = spawnSync(process.execPath, ["scripts/report-row-coverage-readonly-preexecution-packet.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8"
});

let packet;
try {
  packet = JSON.parse(packetRun.stdout);
} catch {
  packet = undefined;
}

const ready = packetRun.status === 0 && packet?.status === "ready_to_present_not_execute";

const presenter = {
  mode: "row_coverage_readonly_execution_readiness_presenter",
  status: ready ? "ready_for_ceo_oral_decision_not_execution" : "blocked_needs_packet_repair",
  generatedAt: new Date().toISOString(),
  chairBrief: ready
    ? [
        "Row coverage readonly is locally ready for a CEO oral decision.",
        "This is not execution and does not connect to Supabase.",
        "The only executable remote path remains exactly one bounded readonly attempt after same-slice prechecks pass.",
        "Post-run review must happen immediately before any readiness, source, score, or row coverage change."
      ]
    : ["Row coverage readonly is not ready for oral execution decision because the preexecution packet is blocked."],
  ceoRecommendation: ready
    ? "If the chairman asks to proceed, CEO should restate this brief, run the immediate prechecks, then name exactly one bounded readonly attempt. Otherwise continue runtime hardening."
    : "Repair the preexecution packet before any oral execution decision.",
  pmExecutionCue: ready
    ? "PM should treat an explicit CEO phrase as required: run exactly one bounded Supabase readonly row coverage attempt, then stop for post-run review."
    : "PM should not prepare an execution cue until packet readiness returns to ready_to_present_not_execute.",
  oralDecisionQuestion:
    "Do we authorize exactly one bounded Supabase readonly row coverage attempt after immediate local prechecks pass?",
  mustSayBeforeExecution: [
    "publicDataSource remains mock",
    "scoreSource remains mock",
    "no SQL",
    "no Supabase writes",
    "no market-data ingestion",
    "no secrets or row payloads printed",
    "no retry",
    "post-run review is the immediate next action"
  ],
  commandReference: {
    packageCommand: packet?.executionCommandPreview?.packageCommand ?? "npm run run:row-coverage-readonly",
    confirmationToken:
      packet?.executionCommandPreview?.confirmationToken ?? "CP3_ROW_COVERAGE_READONLY_VALIDATE",
    stillRequiresExplicitExecutionRequest: true
  },
  expectedSanitizedEvidence: [
    "attempt status",
    "observed total row count",
    "expected total row count",
    "missing row count",
    "sanitized blocker reason",
    "safety flags"
  ],
  stillBlockedUntilPostRunReview: [
    "publicDataSource=supabase",
    "scoreSource=real",
    "row coverage points",
    "CP3_READY_NOW",
    "investment-grade claims"
  ],
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    marketDataFetched: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  sourcePacket: {
    mode: packet?.mode ?? "unavailable",
    status: packet?.status ?? "unavailable",
    decisionGateOk: packet?.localDecisionGate?.decisionGateOk === true
  },
  stopLine:
    "This presenter is for CEO/PM oral readiness only; it does not execute Supabase, run SQL, write data, fetch market data, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
};

console.log(JSON.stringify(presenter, null, 2));
