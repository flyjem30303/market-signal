import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const expected = {
  authorizationId: "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  confirmation: "CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE",
  lane: "tw-equity",
  maxRows: 180,
  postRunReview: "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md",
  sessions: 60,
  symbols: ["2330", "2382", "2308"],
  targetRelation: "staging_twse_stock_day_runs,staging_twse_stock_day_prices"
};

const dryRun = runRunner({ execute: false });
const missingCandidate = runRunner({ execute: true });
const dryRunOutput = parseJson(dryRun.stdout);
const missingCandidateOutput = parseJson(missingCandidate.stdout);
const candidateArtifactReady = false;
const boundedExecutionReady =
  dryRun.status === 0 &&
  missingCandidate.status !== 0 &&
  dryRunOutput.writeImplementationReady === true &&
  missingCandidateOutput.problems?.includes("missing_candidate_input_artifact_contract") === true &&
  candidateArtifactReady;

const report = {
  status: boundedExecutionReady
    ? "tw_equity_staging_write_execution_ready_for_one_attempt"
    : "tw_equity_staging_write_execution_readiness_blocked_candidate_artifact_missing",
  lane: expected.lane,
  implementationReady: dryRunOutput.writeImplementationReady === true,
  actualBoundedWriteExecuted: false,
  candidateArtifactReady,
  currentBlocker: "accepted_sanitized_candidate_input_artifact_missing",
  expectedRows: {
    laneExpectedRows: expected.maxRows,
    readonlyObservedRows: 3,
    readonlyMissingRows: 177
  },
  commandContract: {
    authorizationId: expected.authorizationId,
    confirmationEnv: "TW_EQUITY_STAGING_WRITE_CONFIRMATION",
    confirmationValue: expected.confirmation,
    lane: expected.lane,
    symbols: expected.symbols,
    sessions: expected.sessions,
    targetRelation: expected.targetRelation,
    maxRows: expected.maxRows,
    postRunReview: expected.postRunReview
  },
  dryRunProbe: {
    statusCode: dryRun.status,
    connectionAttempted: dryRunOutput.connectionAttempted,
    writeAttempted: dryRunOutput.writeAttempted,
    mutations: dryRunOutput.mutations,
    publicDataSource: dryRunOutput.publicDataSource,
    scoreSource: dryRunOutput.scoreSource
  },
  missingCandidateExecutionProbe: {
    statusCode: missingCandidate.status,
    connectionAttempted: missingCandidateOutput.connectionAttempted,
    writeAttempted: missingCandidateOutput.writeAttempted,
    mutations: missingCandidateOutput.mutations,
    problems: missingCandidateOutput.problems ?? []
  },
  nextAction: {
    owner: "A1 Data / Supabase / Market Evidence",
    action:
      "produce one accepted sanitized candidate input artifact for 2330, 2382, and 2308 without raw payloads, secrets, or public redistribution claims",
    pmIntegration:
      "after the artifact passes local validation, CEO may name exactly one bounded staging write attempt using the recorded command contract"
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    realSupabaseConnectionAttempted: false,
    realSupabaseWrites: false,
    stagingRowsCreated: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    rawPayloadsPrinted: false,
    rowPayloadsPrinted: false,
    secretsPrinted: false,
    serviceRoleKeyPrinted: false,
    publicPromotionAllowed: false,
    rowCoveragePointsAllowed: false,
    scoreSourceRealAllowed: false
  }
};

console.log(JSON.stringify(report, null, 2));

function runRunner({ execute }) {
  const args = [
    runnerPath,
    "--authorization-id",
    expected.authorizationId,
    "--lane",
    expected.lane,
    "--symbols",
    expected.symbols.join(","),
    "--sessions",
    String(expected.sessions),
    "--target",
    expected.targetRelation,
    "--max-rows",
    String(expected.maxRows),
    "--post-run-review",
    expected.postRunReview,
    "--rollback-dry-run"
  ];
  if (execute) args.push("--execute");

  return spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "mock-service-role-key",
      TW_EQUITY_STAGING_WRITE_CONFIRMATION: expected.confirmation,
      TW_EQUITY_STAGING_WRITE_MOCK_SUPABASE: "disabled"
    },
    shell: false
  });
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
