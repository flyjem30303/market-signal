import fs from "node:fs";

const docPath = "docs/TWII_A1_D_HANDOFF_REPLY_TEMPLATE.md";
const doc = fs.readFileSync(docPath, "utf8");

const requiredPhrases = [
  "Status: `twii_a1_d_handoff_reply_template_ready`",
  "A1 Reply Block",
  "D Reply Blocks",
  "PM Intake Block",
  "candidateArtifactPath",
  "artifactHandoffStatus",
  "sanitizedAggregateOnly: true",
  "rawPayloadIncluded: false",
  "rowPayloadIncluded: false",
  "stockIdPayloadIncluded: false",
  "secretsIncluded: false",
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence",
  "pmClassificationRequest",
  "accepted | needs_bounded_repair | blocked | rejected",
  "packetScaffoldCommand",
  "namedPacketGateCommand",
  "smokeProofCommand",
  "publicDataSource=mock",
  "scoreSource=mock"
];

const missing = requiredPhrases.filter((phrase) => !doc.includes(phrase));
const ready = missing.length === 0;

const report = {
  status: ready ? "twii_a1_d_handoff_reply_template_ready" : "blocked",
  outcome: ready ? "accepted_as_no_secret_handoff_reply_template" : "blocked",
  docPath,
  owners: {
    a1: "Data / Supabase / Market Evidence",
    d: "Legal / Source Rights Review",
    pm: "Integration owner"
  },
  nextAllowedStep: ready
    ? "A1 and D may use this no-secret template to return handoff replies for PM classification before any local no-write named packet scaffold."
    : "Repair the reply template before using it for A1/D handoff.",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlAllowed: false,
    supabaseAllowed: false,
    marketDataFetchAllowed: false,
    marketDataIngestAllowed: false,
    dailyPricesMutationAllowed: false,
    stagingRowsAllowed: false,
    candidateRowsAcceptanceAllowed: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutputAllowed: false,
    rowPayloadOutputAllowed: false,
    stockIdPayloadOutputAllowed: false,
    secretOutputAllowed: false,
    copiedTermsTextAllowed: false,
    privateDashboardLinksAllowed: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  missing
};

console.log(JSON.stringify(report, null, 2));

if (!ready) process.exit(1);
