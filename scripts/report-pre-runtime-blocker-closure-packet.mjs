import fs from "node:fs";

const acceptedPacketPaths = [
  {
    id: "data-quality-evidence",
    owner: "Data",
    path: "docs/reviews/DATA_QUALITY_FIELD_VALIDITY_ACCEPTANCE_GATE_2026-06-02.md",
    statusPhrase: "data quality field validity acceptance gate recorded"
  },
  {
    id: "source-rights-and-disclosure",
    owner: "Legal",
    path: "docs/reviews/SOURCE_RIGHTS_DISCLOSURE_ACCEPTANCE_GATE_2026-06-02.md",
    statusPhrase: "source rights disclosure acceptance gate recorded"
  },
  {
    id: "model-credibility",
    owner: "Investment",
    path: "docs/reviews/MODEL_CREDIBILITY_ACCEPTANCE_GATE_2026-06-02.md",
    statusPhrase: "model credibility acceptance gate recorded"
  }
];

const packets = acceptedPacketPaths.map((packet) => {
  const content = fs.readFileSync(packet.path, "utf8");

  return {
    acceptedForRuntimeNextDecisionOnly: content.includes(packet.statusPhrase),
    id: packet.id,
    owner: packet.owner,
    path: packet.path,
    statusPhrase: packet.statusPhrase
  };
});

const packet = {
  mode: "pre_runtime_blocker_closure_packet",
  status: packets.every((item) => item.acceptedForRuntimeNextDecisionOnly)
    ? "three_local_packets_accepted_runtime_next_decision_ready"
    : "blocked_missing_local_packet_acceptance",
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  acceptedPackets: packets,
  stillBlocked: [
    "row coverage runtime promotion",
    "external source-rights approval",
    "model real scoring approval",
    "public claim approval",
    "Supabase readonly execution until separately named",
    "SQL execution",
    "Supabase writes",
    "market-data ingestion",
    "publicDataSource=supabase",
    "scoreSource=real"
  ],
  nextDecisionOptions: [
    {
      id: "mock-runtime-hardening",
      default: true,
      reason: "Safest next execution path because it uses accepted local packets without remote access.",
      allowedWork: ["runtime status disclosure", "mock-only UI state", "local checkers", "post-slice review"]
    },
    {
      id: "bounded-row-coverage-readonly",
      default: false,
      reason: "Useful only when CEO explicitly names one readonly attempt and accepts a post-run review obligation.",
      allowedWork: ["one bounded readonly attempt", "sanitized aggregate evidence", "post-run review"]
    }
  ],
  ceoRecommendation:
    "Use the three accepted local packets as the runtime next-decision context. Default to mock runtime hardening; run bounded row coverage readonly only as a separately named action."
};

console.log(JSON.stringify(packet, null, 2));
