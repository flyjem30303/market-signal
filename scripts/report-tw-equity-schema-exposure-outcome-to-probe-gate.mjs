import fs from "node:fs";

const outcomePath = "data/source-gates/tw-equity-schema-exposure-repair-outcomes.json";
const expectedOutcomeId = "tw-equity-postgrest-schema-exposure-cache-repair";
const outcomeData = JSON.parse(fs.readFileSync(outcomePath, "utf8"));
const outcomes = Array.isArray(outcomeData.outcomes) ? outcomeData.outcomes : [];
const outcome = outcomes.find((item) => item.id === expectedOutcomeId);

const status =
  outcome?.outcome === "accepted"
    ? "tw_equity_schema_exposure_outcome_to_probe_gate_ready_for_one_bounded_probe_rerun"
    : outcome?.outcome === "rejected"
      ? "tw_equity_schema_exposure_outcome_to_probe_gate_blocked_repair_rejected"
      : "tw_equity_schema_exposure_outcome_to_probe_gate_blocked_outcome_pending";

const report = {
  status,
  mode: "tw_equity_schema_exposure_outcome_to_probe_gate",
  acceptedInput: {
    outcomePath,
    expectedOutcomeId,
    observedOutcome: outcome?.outcome ?? "missing",
    recordedBy: outcome?.recordedBy ?? null,
    recordedAt: outcome?.recordedAt ?? null
  },
  decision: {
    oneBoundedOpenApiProbeRerunAllowed: outcome?.outcome === "accepted",
    thirdStagingWriteAttemptAllowed: false,
    reason:
      outcome?.outcome === "accepted"
        ? "manual_non_data_changing_schema_exposure_repair_outcome_accepted"
        : outcome?.outcome === "rejected"
          ? "manual_schema_exposure_repair_outcome_rejected"
          : "manual_schema_exposure_repair_outcome_not_recorded"
  },
  exactNextCommandWhenAccepted:
    "TW_EQUITY_POSTGREST_SCHEMA_EXPOSURE_PROBE_CONFIRMATION=CEO_APPROVED_TW_EQUITY_POSTGREST_SCHEMA_EXPOSURE_PROBE_ONCE npm run report:tw-equity-postgrest-schema-exposure-probe-once",
  safety: {
    connectionAttempted: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    migrationExecuted: false,
    publicDataSource: "mock",
    publicPromotionAllowed: false,
    rawOpenApiPrinted: false,
    rawPayloadsPrinted: false,
    rowCoveragePointsAllowed: false,
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealAllowed: false,
    secretsPrinted: false,
    sqlExecuted: false,
    stagingRowsCreated: false,
    supabaseReadAttempted: false,
    supabaseWriteAttempted: false
  },
  stillDoesNotAuthorize: [
    "SQL execution",
    "migration execution",
    "Supabase writes",
    "third staging write attempt",
    "staging rows",
    "daily_prices mutation",
    "market data fetch",
    "market data ingestion",
    "raw OpenAPI payload output",
    "row payload output",
    "secret output",
    "publicDataSource=supabase",
    "scoreSource=real",
    "row coverage credit"
  ],
  nextPmAction:
    outcome?.outcome === "accepted"
      ? "Prepare exactly one bounded PostgREST OpenAPI schema exposure probe rerun as a separate execution slice."
      : outcome?.outcome === "rejected"
        ? "Create a new repair packet or collect new operator evidence before any remote probe or write."
        : "Complete the non-data-changing schema exposure/cache repair runbook and record accepted/rejected outcome first."
};

console.log(JSON.stringify(report, null, 2));

