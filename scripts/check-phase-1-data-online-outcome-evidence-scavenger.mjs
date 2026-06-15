import fs from "node:fs";

const docPath = "docs/PHASE_1_DATA_ONLINE_OUTCOME_EVIDENCE_SCAVENGER.md";
const ledgerPath = "data/source-gates/phase-1-data-online-a1-a2-handoff-outcomes.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const ledger = parseJson(readText(ledgerPath), "ledger");
const packageJson = parseJson(readText(packagePath), "package.json");
const reviewGate = readText(reviewGatePath);

const candidates = [
  {
    id: "a1_twii_operator_presence_shape_outcome",
    requiredEvidence: [
      "docs/TWII_BOUNDED_OPERATOR_AUTHORIZATION_PACKET_GATE.md",
      "docs/TWII_FINAL_AUTHORIZATION_STOPLINE_GO_NO_GO_GATE.md",
      "data/source-gates/twii-bounded-execution-packet-readiness-gate.json"
    ],
    safeSummary:
      "Existing TWII no-secret operator packet and stopline artifacts define the bounded operator decision shape but do not provide operator values or execution approval."
  },
  {
    id: "a1_etf_source_rights_acceptance_evidence_outcome",
    requiredEvidence: [
      "docs/A1_ETF_MARKET_PRICE_SOURCE_SCOPE_NO_FETCH.md",
      "docs/A1_ETF_MARKET_PRICE_FIELD_CONTRACT_NO_FETCH.md",
      "scripts/check-etf-market-price-mock-runtime-handoff.mjs",
      "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md"
    ],
    safeSummary:
      "Existing ETF no-fetch source scope, field contract, and mock runtime handoff artifacts define the evidence shape but do not accept row coverage or source promotion."
  },
  {
    id: "a2_twii_etf_public_copy_guard_outcome",
    requiredEvidence: [
      "scripts/check-phase-1-core-public-copy-readable.mjs",
      "scripts/check-phase-1-public-beta-public-visible-residue-cleanup.mjs",
      "scripts/check-public-runtime-boundary-coverage.mjs"
    ],
    safeSummary:
      "Existing public-copy gates prove the runtime copy avoids internal residue and keeps mock/real-data boundaries visible, but do not authorize real-data claims."
  }
];

validateDoc();
validateLedger();
validateEvidence();
validateRegistration();

const status = problems.length === 0 ? "ok" : "blocked";
const report = {
  status,
  guardedStatus:
    status === "ok"
      ? "phase_1_data_online_outcome_evidence_scavenger_ready_review_only"
      : "phase_1_data_online_outcome_evidence_scavenger_blocked",
  outcomeEvidence: candidates.map((candidate) => ({
    id: candidate.id,
    evidencePresent: candidate.requiredEvidence.every((filePath) => fs.existsSync(filePath)),
    requiredEvidence: candidate.requiredEvidence,
    suggestedNextStatus: "review_required_before_acceptance",
    safeSummary: candidate.safeSummary
  })),
  publicDataSource: ledger.publicDataSource ?? null,
  scoreSource: ledger.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (status !== "ok") process.exit(1);

function validateDoc() {
  const tokens = [
    "phase_1_data_online_outcome_evidence_scavenger_ready_review_only",
    "review_required_before_acceptance",
    "This scavenger does not accept outcomes by itself",
    "`a1_twii_operator_presence_shape_outcome`",
    "`a1_etf_source_rights_acceptance_evidence_outcome`",
    "`a2_twii_etf_public_copy_guard_outcome`",
    "No SQL",
    "No Supabase read or write",
    "No market-row fetch",
    "No raw payload output",
    "No source promotion",
    "No score promotion",
    "publicDataSource=mock",
    "scoreSource=mock"
  ];
  for (const token of tokens) if (!doc.includes(token)) problems.push(`doc missing ${token}`);
}

function validateLedger() {
  if (ledger.publicDataSource !== "mock") problems.push("ledger publicDataSource must remain mock");
  if (ledger.scoreSource !== "mock") problems.push("ledger scoreSource must remain mock");
  if (ledger.executionAllowedNow !== false) problems.push("ledger executionAllowedNow must remain false");
  if (ledger.supabaseWriteAllowedNow !== false) problems.push("ledger supabaseWriteAllowedNow must remain false");
  if (ledger.rowCoverageAwardAllowedNow !== false) problems.push("ledger rowCoverageAwardAllowedNow must remain false");
  const ids = new Set((ledger.outcomes ?? []).map((item) => item.id));
  for (const candidate of candidates) if (!ids.has(candidate.id)) problems.push(`ledger missing ${candidate.id}`);
}

function validateEvidence() {
  for (const candidate of candidates) {
    for (const filePath of candidate.requiredEvidence) {
      if (!fs.existsSync(filePath)) problems.push(`${candidate.id} missing evidence ${filePath}`);
    }
  }
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-data-online-outcome-evidence-scavenger"] !==
    "node scripts/check-phase-1-data-online-outcome-evidence-scavenger.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-outcome-evidence-scavenger");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-outcome-evidence-scavenger.mjs")) {
    problems.push("review gate missing outcome evidence scavenger checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-outcome-evidence-scavenger"')) {
    problems.push("focused review gate missing outcome evidence scavenger");
  }
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}
