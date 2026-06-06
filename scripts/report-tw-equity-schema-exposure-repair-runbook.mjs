import fs from "node:fs";

const runbookPath = "docs/TW_EQUITY_SCHEMA_EXPOSURE_REPAIR_RUNBOOK.md";
const outcomePath = "data/source-gates/tw-equity-schema-exposure-repair-outcomes.json";

const outcomeData = JSON.parse(fs.readFileSync(outcomePath, "utf8"));
const outcomes = Array.isArray(outcomeData.outcomes) ? outcomeData.outcomes : [];
const repairOutcome = outcomes.find((item) => item.id === "tw-equity-postgrest-schema-exposure-cache-repair");

const accepted = repairOutcome?.outcome === "accepted";
const rejected = repairOutcome?.outcome === "rejected";

const status = accepted
  ? "tw_equity_schema_exposure_repair_runbook_outcome_accepted_probe_rerun_ready"
  : rejected
    ? "tw_equity_schema_exposure_repair_runbook_outcome_rejected_probe_blocked"
    : "tw_equity_schema_exposure_repair_runbook_ready_awaiting_manual_outcome";

const report = {
  status,
  mode: "tw_equity_schema_exposure_repair_runbook",
  artifacts: {
    runbookPath,
    outcomePath
  },
  currentRootCauseCandidate: "postgrest_schema_exposure_or_schema_cache_mismatch",
  outcome: {
    id: repairOutcome?.id ?? null,
    outcome: repairOutcome?.outcome ?? "missing",
    recordedBy: repairOutcome?.recordedBy ?? null,
    recordedAt: repairOutcome?.recordedAt ?? null,
    decisionNote: repairOutcome?.decisionNote ?? null
  },
  allowedNextStep: accepted
    ? "prepare_one_bounded_postgrest_openapi_schema_exposure_probe_rerun_as_separate_slice"
    : null,
  blockedNextStep: rejected
    ? "create_new_schema_exposure_repair_packet_before_any_remote_probe_or_write"
    : "await_accepted_or_rejected_manual_outcome_record",
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
    supabaseWriteAttempted: false,
    thirdWriteAttemptAllowed: false
  },
  nextPmAction: accepted
    ? "Prepare one bounded PostgREST OpenAPI schema exposure probe rerun. Do not proceed directly to staging write."
    : rejected
      ? "Create a new repair decision packet or request operator clarification before any remote probe or write."
      : "Collect the manual accepted/rejected outcome for the non-data-changing schema exposure/cache repair runbook."
};

console.log(JSON.stringify(report, null, 2));

