import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const candidatePath = process.env.A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH ?? "data/candidates/tw-equity-staging-candidate.json";
const expected = {
  authorizationId: "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  confirmation: "CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE",
  lane: "tw-equity",
  maxRows: 180,
  postRunReview: "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md",
  sessions: 60,
  symbols: "2330,2382,2308",
  targetRelation: "staging_twse_stock_day_runs,staging_twse_stock_day_prices"
};

const resolvedCandidatePath = path.resolve(process.cwd(), candidatePath);
const candidateArtifactProvided = fs.existsSync(resolvedCandidatePath);
const validation = candidateArtifactProvided ? validateCandidateArtifact(candidatePath) : notProvidedValidation();
const candidateArtifactAccepted = candidateArtifactProvided && validation.statusCode === 0 && validation.output?.candidateInputAccepted === true;

const report = {
  status: candidateArtifactAccepted
    ? "a1_tw_equity_candidate_artifact_accepted_for_pm_execution_review"
    : "a1_tw_equity_candidate_artifact_intake_blocked_candidate_artifact_not_provided",
  owner: "PM integration, A1 supplies artifact",
  candidateArtifactPath: candidatePath,
  candidateArtifactProvided,
  candidateArtifactAccepted,
  expectedArtifactContract: {
    authorizationId: expected.authorizationId,
    targetRelation: expected.targetRelation,
    sourceId: "twse-stock-day",
    symbols: expected.symbols.split(","),
    maxRows: expected.maxRows,
    requiredTopLevelFields: [
      "authorizationId",
      "targetRelation",
      "sourceId",
      "symbols",
      "maxRows",
      "sourcePayloadIncluded",
      "sourceUrlPayloadIncluded",
      "secretsIncluded",
      "candidateRun",
      "candidatePrices"
    ],
    forbiddenTopLevelFields: [
      "rawSourcePayload",
      "sourcePayload",
      "sourceRows",
      "rawRows",
      "sourceUrlPayload",
      "html",
      "csv",
      "secret",
      "secrets"
    ]
  },
  validation,
  nextAction: candidateArtifactAccepted
    ? "CEO may review whether to name exactly one bounded staging write attempt using the accepted artifact."
    : "A1 must provide the sanitized candidate artifact at the recorded path or set A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH to its local path.",
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

function notProvidedValidation() {
  return {
    status: "blocked",
    statusCode: 1,
    problems: ["candidate_artifact_not_provided"],
    connectionAttempted: false,
    writeAttempted: false,
    mutations: false
  };
}

function validateCandidateArtifact(inputPath) {
  const args = [
    runnerPath,
    "--authorization-id",
    expected.authorizationId,
    "--lane",
    expected.lane,
    "--symbols",
    expected.symbols,
    "--sessions",
    String(expected.sessions),
    "--target",
    expected.targetRelation,
    "--max-rows",
    String(expected.maxRows),
    "--post-run-review",
    expected.postRunReview,
    "--rollback-dry-run",
    "--candidate-input",
    inputPath
  ];

  const result = spawnSync(process.execPath, args, {
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
  const output = parseJson(result.stdout);

  return {
    status: result.status === 0 ? "accepted" : "blocked",
    statusCode: result.status,
    candidateInputAccepted: output.candidateInputAccepted === true,
    candidateInputPriceRows: output.candidateInputPriceRows ?? 0,
    candidateInputRunRows: output.candidateInputRunRows ?? 0,
    connectionAttempted: output.connectionAttempted === true,
    writeAttempted: output.writeAttempted === true,
    mutations: output.mutations === true,
    problems: output.problems ?? [],
    output
  };
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
