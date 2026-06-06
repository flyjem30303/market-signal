import fs from "node:fs";

const outcomePath = "data/source-gates/tw-equity-schema-exposure-repair-outcomes.json";
const reviewPath = "docs/reviews/TW_EQUITY_POSTGREST_SCHEMA_EXPOSURE_PROBE_POST_RUN_REVIEW_2026-06-06.md";
const outcomeData = JSON.parse(fs.readFileSync(outcomePath, "utf8"));
const review = fs.readFileSync(reviewPath, "utf8");

const outcome = Array.isArray(outcomeData.outcomes)
  ? outcomeData.outcomes.find((item) => item.id === "tw-equity-postgrest-schema-exposure-cache-repair")
  : null;
const repairOutcomeAccepted = outcome?.outcome === "accepted";
const probeAttempted = review.includes("Exactly one bounded PostgREST OpenAPI schema exposure probe was attempted");
const openApiReachable = review.includes("OpenAPI reachable: `true`");
const openApiParsed = review.includes("OpenAPI parsed: `true`");
const runsMissing = review.includes("staging_twse_stock_day_runs_not_exposed_in_openapi_schema");
const pricesMissing = review.includes("staging_twse_stock_day_prices_not_exposed_in_openapi_schema");
const exposureIncomplete = review.includes("tw_equity_postgrest_schema_exposure_probe_schema_exposure_incomplete");

const status =
  repairOutcomeAccepted && probeAttempted && openApiReachable && openApiParsed && runsMissing && pricesMissing
    ? "tw_equity_post_repair_schema_exposure_probe_result_exposure_still_incomplete_third_write_blocked"
    : "tw_equity_post_repair_schema_exposure_probe_result_not_ready";

const report = {
  status,
  mode: "tw_equity_post_repair_schema_exposure_probe_result",
  acceptedEvidence: {
    exposureIncomplete,
    openApiParsed,
    openApiReachable,
    pricesMissingFromOpenApi: pricesMissing,
    probeAttempted,
    repairOutcomeAccepted,
    runsMissingFromOpenApi: runsMissing
  },
  decision: {
    thirdStagingWriteAttemptAllowed: false,
    nextRoute:
      status === "tw_equity_post_repair_schema_exposure_probe_result_exposure_still_incomplete_third_write_blocked"
        ? "inspect_data_api_table_exposure_permissions_or_table_api_visibility_before_any_third_write_decision"
        : "complete_repair_outcome_and_post_repair_probe_review_first"
  },
  safety: {
    connectionAttemptedByThisReport: false,
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
    supabaseWriteAttempted: false
  },
  nextPmAction:
    "Create a table-level Data API visibility and permission diagnostic decision before any third bounded staging write attempt."
};

console.log(JSON.stringify(report, null, 2));

