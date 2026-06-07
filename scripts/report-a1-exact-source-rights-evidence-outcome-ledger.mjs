import fs from "node:fs";

const outcomePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const docPath = "docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_OUTCOME_LEDGER.md";
const outcomes = readOutcomes(outcomePath);

const twii = outcomes.filter((item) => item.lane === "TWII");
const etf = outcomes.filter((item) => item.lane === "ETF");
const counts = countByClassification(outcomes);
const twiiAllAccepted = twii.length === 4 && twii.every((item) => item.classification === "accepted");
const etfAllAccepted = etf.length === 6 && etf.every((item) => item.classification === "accepted");

const status = twiiAllAccepted
  ? "ready_for_twii_source_rights_outcome_gate_only"
  : etfAllAccepted
    ? "ready_for_etf_source_rights_outcome_gate_only"
    : counts.pending === outcomes.length
      ? "awaiting_a1_exact_source_rights_evidence"
      : counts.rejected > 0 || counts.blocked > 0 || counts.unavailable > 0
        ? "a1_exact_source_rights_evidence_blocked"
        : counts.needs_bounded_repair > 0
          ? "a1_exact_source_rights_evidence_needs_bounded_repair"
          : "partial_a1_exact_source_rights_evidence_recorded";

console.log(
  JSON.stringify(
    {
      mode: "a1_exact_source_rights_evidence_outcome_ledger",
      status,
      doc: docPath,
      outcomeData: outcomePath,
      canOpenTwiiSourceRightsOutcomeGate: twiiAllAccepted,
      canOpenEtfSourceRightsOutcomeGate: etfAllAccepted,
      nextAllowedRoute: twiiAllAccepted
        ? "twii_source_rights_outcome_gate"
        : etfAllAccepted
          ? "etf_source_rights_outcome_gate"
          : "continue_public_beta_runtime_mainline_mock_visible",
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      safety: {
        automatedRemoteRun: false,
        candidateArtifactGenerated: false,
        connectionAttempted: false,
        ingestionStarted: false,
        marketDataFetched: false,
        publicSourcePromoted: false,
        rowCoverageAwarded: false,
        scoreSourceRealEnabled: false,
        secretsPrinted: false,
        sourcePayloadStored: false,
        sqlExecuted: false,
        supabaseReadsEnabled: false,
        supabaseWritesEnabled: false
      },
      counts: {
        ...counts,
        total: outcomes.length,
        twiiTotal: twii.length,
        etfTotal: etf.length
      },
      outcomes,
      stillBlocked: [
        "source-rights approval",
        "TWII candidate generation",
        "ETF candidate generation",
        "SQL execution",
        "Supabase connection",
        "Supabase reads",
        "Supabase writes",
        "staging rows",
        "daily_prices mutation",
        "market-data fetch",
        "market-data ingestion",
        "row coverage points",
        "publicDataSource=supabase",
        "scoreSource=real"
      ]
    },
    null,
    2
  )
);

function readOutcomes(filePath) {
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(parsed.outcomes)) throw new Error("Outcome file must include outcomes array");
  return parsed.outcomes;
}

function countByClassification(items) {
  const counts = {
    accepted: 0,
    blocked: 0,
    needs_bounded_repair: 0,
    pending: 0,
    rejected: 0,
    unavailable: 0
  };

  for (const item of items) {
    if (Object.hasOwn(counts, item.classification)) counts[item.classification] += 1;
  }

  return counts;
}
