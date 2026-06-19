import fs from "node:fs";

const PLAN_CHECK_PATH = "scripts/check-a1-rate-limited-candidate-generation-plan.mjs";
const PLAN_REPORT_PATH = "scripts/report-a1-rate-limited-candidate-generation-plan.mjs";
const OUTPUT_DIR = "tmp/a1-full-twse-equity-candidates";
const DEFAULT_OUTPUT_PATTERN = `${OUTPUT_DIR}/YYYYMMDD-HHMMSS-candidate.json`;

const gitignore = fs.readFileSync(".gitignore", "utf8");
const tmpIgnored = gitignore
  .split(/\r?\n/u)
  .map((line) => line.trim())
  .includes("tmp/");

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "a1_rate_limited_candidate_generation_execution_packet",
      decision: "ready_for_explicit_operator_approval_only",
      preflightCommands: [
        `cmd.exe /c npm run check:a1-rate-limited-candidate-generation-plan`,
        `cmd.exe /c npm run check:a1-rate-limited-candidate-generation-execution-packet`,
        `cmd.exe /c npm run check:a1-full-twse-equity-rate-limited-candidate-runner`
      ],
      authorizedRunCommand:
        "cmd.exe /c \"set A1_FULL_TWSE_EQUITY_CANDIDATE_GENERATION_CONFIRM=A1_FULL_TWSE_EQUITY_CANDIDATE_GENERATION_2026_06_18&& npm run run:a1-full-twse-equity-rate-limited-candidate-generation-once\"",
      executionShape: {
        oneAttemptName: "a1_full_twse_equity_3_month_rate_limited_candidate_artifact_generation_once",
        sourceRoute: "TWSE exchangeReport/STOCK_DAY",
        outputPathPattern: DEFAULT_OUTPUT_PATTERN,
        outputDirectoryGitIgnored: tmpIgnored,
        requestedMonths: 3,
        universeCount: 1083,
        requestCount: 3249,
        estimatedTradingSessionRows: 71478,
        batchSize: 50,
        batchCount: 22,
        requestDelayMs: 900,
        batchPauseMs: 30000,
        expectedWallClockMinutes: 60
      },
      operatorMustConfirm: [
        "Run exactly one bounded candidate artifact generation attempt.",
        "Write candidate artifact only under tmp/a1-full-twse-equity-candidates/.",
        "Do not commit generated candidate artifacts.",
        "Stop on repeated HTTP 429, parser drift, unsafe output, or failure rate above 15 percent.",
        "Run post-run review before any staging write discussion."
      ],
      hardStopLines: {
        marketFetchBeforeExplicitApproval: false,
        sqlExecution: false,
        supabaseConnection: false,
        supabaseWrite: false,
        stagingRowsCreated: false,
        dailyPricesMutation: false,
        rawPayloadStorage: false,
        rawPayloadPrint: false,
        sourceUrlPayloadPrint: false,
        stockIdListPrint: false,
        secretsPrint: false,
        publicDataSourcePromotion: false,
        scoreSourceRealPromotion: false
      },
      stillRequiredAfterCandidateArtifact: [
        "candidate artifact post-run review",
        "sanitized row validation",
        "staging write authorization",
        "staging readback",
        "missing-only daily_prices merge authorization",
        "public runtime promotion gate"
      ],
      evidence: {
        planReportPath: PLAN_REPORT_PATH,
        planCheckPath: PLAN_CHECK_PATH,
        boundedPilotEvidencePath: "data/evidence-intake/a1-bounded-source-depth-pilot-result-20260618.json"
      }
    },
    null,
    2
  )
);
