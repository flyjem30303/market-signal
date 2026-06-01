import { spawnSync } from "node:child_process";

const packetRun = spawnSync(process.execPath, ["scripts/report-narrow-approval-packet.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (packetRun.status !== 0) {
  throw new Error(`narrow approval packet failed: ${packetRun.stderr.trim()}`);
}

const packet = JSON.parse(packetRun.stdout);
const ledgerRun = spawnSync(process.execPath, ["scripts/report-narrow-approval-outcome-ledger.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (ledgerRun.status !== 0) {
  throw new Error(`narrow approval outcome ledger failed: ${ledgerRun.stderr.trim()}`);
}

const ledger = JSON.parse(ledgerRun.stdout);
const pendingOutcomes = ledger.outcomes.filter((item) => item.outcome === "pending");
const rejectedOutcomes = ledger.outcomes.filter((item) => item.outcome === "rejected");
const blockedUntilOutcomeRecorded = [
  ...pendingOutcomes.map((item) => `${item.owner} approval is not recorded`),
  ...rejectedOutcomes.map((item) => `${item.owner} approval is rejected`),
  "Supabase readonly attempt remains a separate decision",
  "Data quality score lift remains blocked",
  "real runtime activation remains blocked"
];

const gate = {
  mode: "local_narrow_approval_post_review_gate",
  status: ledger.status,
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  sourcePacket: {
    mode: packet.mode,
    status: packet.status,
    scope: packet.approvalRequest.scope
  },
  outcomeLedger: {
    mode: ledger.mode,
    status: ledger.status,
    allRequiredOutcomesAccepted: ledger.allRequiredOutcomesAccepted
  },
  outcomeSlots: ledger.outcomes.map((item) => ({
    id: item.id,
    owner: item.owner,
    outcome: item.outcome === "pending" ? "pending_oral_review" : item.outcome,
    acceptedMeaning: item.acceptedMeaning,
    rejectedMeaning: item.rejectedMeaning,
    stillDoesNotAuthorize: item.stillDoesNotAuthorize
  })),
  blockedUntilOutcomeRecorded,
  nextAfterAcceptedOutcome: [
    "Create or update local accepted-outcome record.",
    "Keep public runtime mock.",
    "Reassess whether a separate bounded Supabase readonly attempt should be requested.",
    "Do not combine approval recording with SQL, ingestion, Supabase write, or scoreSource=real."
  ],
  ceoRecommendation:
    ledger.allRequiredOutcomesAccepted
      ? "Both narrow oral outcomes are recorded as accepted. CEO may separately decide whether to request exactly one bounded Supabase readonly attempt."
      : "Use this gate to record the next oral review outcome. Until the outcome is recorded, treat Legal and Investment as prepared but not approved."
};

console.log(JSON.stringify(gate, null, 2));
