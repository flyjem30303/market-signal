import fs from "node:fs";

const SEED_PATH = "data/seeds/stocks.seed.json";
const DEFAULT_MONTHS = 3;
const DEFAULT_SESSIONS_PER_MONTH = 22;
const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_REQUEST_DELAY_MS = 900;
const DEFAULT_BATCH_PAUSE_MS = 30000;

const seed = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
if (!Array.isArray(seed)) throw new Error(`${SEED_PATH} must contain an array`);

const universeCount = seed.filter(isActiveTwseListedCommonStock).length;
const requestedMonths = DEFAULT_MONTHS;
const requestCount = universeCount * requestedMonths;
const batchCount = Math.ceil(universeCount / DEFAULT_BATCH_SIZE);
const estimatedTradingSessionRows = universeCount * requestedMonths * DEFAULT_SESSIONS_PER_MONTH;
const estimatedRequestDelayMs = Math.max(requestCount - 1, 0) * DEFAULT_REQUEST_DELAY_MS;
const estimatedBatchPauseMs = Math.max(batchCount - 1, 0) * DEFAULT_BATCH_PAUSE_MS;
const estimatedWallClockMinutes = Math.ceil((estimatedRequestDelayMs + estimatedBatchPauseMs) / 60000);

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "a1_rate_limited_candidate_generation_plan",
      sourceEvidence: {
        inventorySeedPath: SEED_PATH,
        boundedPilotEvidencePath: "data/evidence-intake/a1-bounded-source-depth-pilot-result-20260618.json",
        seedRows: seed.length,
        universeCount,
        stockIdsPrinted: false,
        rowPayloadsPrinted: false,
        rawPayloadsPrinted: false
      },
      candidatePlan: {
        targetRelation: "staging_twse_stock_day_runs,staging_twse_stock_day_prices",
        candidateArtifactPathPattern: "tmp/a1-full-twse-equity-candidates/YYYYMMDD-HHMMSS-candidate.json",
        sourceRoute: "TWSE exchangeReport/STOCK_DAY",
        requestedMonths,
        sessionsPerMonth: DEFAULT_SESSIONS_PER_MONTH,
        requestCount,
        estimatedTradingSessionRows,
        batchSize: DEFAULT_BATCH_SIZE,
        batchCount,
        requestDelayMs: DEFAULT_REQUEST_DELAY_MS,
        batchPauseMs: DEFAULT_BATCH_PAUSE_MS,
        estimatedWallClockMinutes,
        retryPolicy: {
          maxRetriesPerSymbolMonth: 1,
          retryDelayMs: 3000,
          stopIfHttp429CountAtLeast: 3,
          stopIfFailureRateAbovePercent: 15
        }
      },
      outputContract: {
        sanitizedRowPayloadCandidateAllowedOnlyAfterSeparateExecutionApproval: true,
        sourcePayloadIncluded: false,
        sourceUrlPayloadIncluded: false,
        secretsIncluded: false,
        stockIdListPrinted: false,
        rawPayloadStored: false,
        overwriteExistingCandidateArtifact: false,
        candidateRowsNeedPostRunReviewBeforeStagingWrite: true
      },
      runtimeBoundary: {
        marketFetchAttempted: false,
        sqlExecuted: false,
        supabaseConnectionAttempted: false,
        supabaseWrite: false,
        stagingRowsCreated: false,
        dailyPricesMutation: false,
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      nextGate: {
        recommended: "execute_one_rate_limited_candidate_artifact_generation_attempt_after_explicit_approval",
        requiredBeforeExecution: [
          "candidate_artifact_generation_approval",
          "candidate_artifact_path_approval",
          "rate_limit_policy_acceptance",
          "stop_line_acceptance",
          "no_commit_candidate_artifact_policy"
        ]
      }
    },
    null,
    2
  )
);

function isActiveTwseListedCommonStock(stock) {
  return (
    stock?.country === "TW" &&
    stock?.exchange === "TWSE" &&
    stock?.asset_type === "stock" &&
    stock?.is_etf === false &&
    stock?.is_active === true &&
    typeof stock?.symbol === "string" &&
    /^\d{4}$/.test(stock.symbol)
  );
}
