import fs from "node:fs";

const docPath = "docs/TWII_REAL_HANDOFF_INTAKE_CHECKLIST.md";
const doc = fs.readFileSync(docPath, "utf8");

const requiredPhrases = [
  "Status: `twii_real_handoff_intake_checklist_ready`",
  "A1 Data Handoff",
  "D Source Rights Handoff",
  "PM Integration Handoff",
  "candidateArtifactPath",
  "aggregateValidation",
  "sanitizedAggregateOnly=true",
  "rawPayloadIncluded=false",
  "rowPayloadIncluded=false",
  "stockIdPayloadIncluded=false",
  "secretsIncluded=false",
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence",
  "render:twii-bounded-data-acceptance-named-packet-scaffold",
  "report:twii-bounded-data-acceptance-named-attempt-packet",
  "run:twii-scaffold-to-packet-driven-chain-smoke-proof",
  "publicDataSource=mock",
  "scoreSource=mock"
];

const missing = requiredPhrases.filter((phrase) => !doc.includes(phrase));
const ready = missing.length === 0;

const report = {
  status: ready ? "twii_real_handoff_intake_checklist_ready" : "blocked",
  outcome: ready ? "accepted_as_local_no_write_intake_checklist" : "blocked",
  docPath,
  owners: {
    a1: "Data / Supabase / Market Evidence",
    d: "Legal / Source Rights Review",
    pm: "Integration owner"
  },
  nextAllowedStep: ready
    ? "A1/D/PM may use this checklist to prepare a real sanitized artifact handoff for local no-write chain intake only."
    : "Repair missing checklist sections before using it for handoff intake.",
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
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  missing
};

console.log(JSON.stringify(report, null, 2));

if (!ready) process.exit(1);
