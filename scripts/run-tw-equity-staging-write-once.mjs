const EXPECTED = {
  authorizationId: "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  lane: "tw-equity",
  maxRows: 180,
  postRunReview: "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md",
  sessions: 60,
  symbols: "2330,2382,2308",
  target: "tw_equity_daily_prices_staging"
};

const args = parseArgs(process.argv.slice(2));
const problems = [];

if (args.authorizationId !== EXPECTED.authorizationId) problems.push("authorization_id_mismatch");
if (args.lane !== EXPECTED.lane) problems.push("lane_mismatch");
if (args.symbols !== EXPECTED.symbols) problems.push("symbols_mismatch");
if (Number(args.sessions) !== EXPECTED.sessions) problems.push("sessions_mismatch");
if (args.target !== EXPECTED.target) problems.push("target_relation_mismatch");
if (Number(args.maxRows) !== EXPECTED.maxRows) problems.push("max_rows_mismatch");
if (args.postRunReview !== EXPECTED.postRunReview) problems.push("post_run_review_mismatch");

const executionRequested = args.execute === "true" || args.execute === true;

if (executionRequested) {
  problems.push("execution_blocked_by_target_relation_reconciliation");
  problems.push("runner_skeleton_has_no_supabase_write_implementation");
}

const status = problems.length === 0 ? "ready_for_manual_execution_gate_not_executed" : "blocked";

console.log(
  JSON.stringify(
    {
      authorizationId: args.authorizationId ?? "missing",
      canAwardRowCoveragePoints: false,
      canClaimRealDataLive: false,
      canPromotePublicSource: false,
      canSetScoreSourceReal: false,
      connectionAttempted: false,
      exactCommandMatched: problems.length === 0,
      executionAttempted: false,
      executionRequested,
      filesWritten: false,
      lane: args.lane ?? "missing",
      marketDataFetched: false,
      marketDataIngested: false,
      maxRows: Number(args.maxRows) || 0,
      mode: "tw_equity_staging_write_fail_closed_runner_skeleton",
      mutations: false,
      postRunReview: args.postRunReview ?? "missing",
      problems,
      publicDataSource: "mock",
      publicRedistributionBlocked: true,
      rowPayloadsPrinted: false,
      scoreSource: "mock",
      secretsPrinted: false,
      serviceRoleKeyPrinted: false,
      sourcePayloadsPrinted: false,
      sqlExecuted: false,
      status,
      symbols: args.symbols ? args.symbols.split(",") : [],
      targetRelation: args.target ?? "missing"
    },
    null,
    2
  )
);

process.exitCode = problems.length === 0 ? 0 : 1;

function parseArgs(tokens) {
  const parsed = {};

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith("--")) continue;

    const key = toCamelCase(token.slice(2));
    const next = tokens[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }

    parsed[key] = next;
    index += 1;
  }

  return parsed;
}

function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
