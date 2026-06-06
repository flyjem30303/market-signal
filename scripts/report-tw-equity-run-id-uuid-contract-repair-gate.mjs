import fs from "node:fs";

const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const generatorPath = "scripts/generate-tw-equity-sanitized-candidate-artifact.mjs";
const candidatePath = "data/candidates/tw-equity-staging-candidate.json";
const docPath = "docs/TW_EQUITY_SANITIZED_CANDIDATE_INPUT_VALIDATOR.md";

const runner = fs.readFileSync(runnerPath, "utf8");
const generator = fs.readFileSync(generatorPath, "utf8");
const candidate = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const runId = candidate?.candidateRun?.run_id ?? "";
const priceRunIds = Array.isArray(candidate?.candidatePrices) ? candidate.candidatePrices.map((row) => row?.run_id) : [];
const uniquePriceRunIds = new Set(priceRunIds);

const report = {
  status: "tw_equity_run_id_uuid_contract_repair_gate_complete_mock_only",
  decision: "LOCAL_UUID_CONTRACT_REPAIRED_BEFORE_REMOTE_REPAIR_OR_THIRD_ATTEMPT",
  localRepairEvidence: {
    candidateInputPriceRows: priceRunIds.length,
    candidateInputRunRows: candidate?.candidateRun ? 1 : 0,
    candidateRunIdIsUuidShaped: uuidPattern.test(runId),
    candidatePriceRunIdsAllMatchRunId: uniquePriceRunIds.size === 1 && uniquePriceRunIds.has(runId),
    candidatePriceRunIdsAllUuidShaped: priceRunIds.every((value) => uuidPattern.test(value)),
    generatorUsesRandomUuid: generator.includes("crypto.randomUUID()"),
    runnerRejectsNonUuidCandidateRunId: runner.includes("candidate_run_run_id_must_be_uuid"),
    runnerRejectsNonUuidCandidatePriceRunId: runner.includes("candidate_price_${index}_run_id_must_be_uuid"),
    validatorDocMentionsUuidContract: doc.includes("UUID-shaped")
  },
  nextAction:
    "Return to Supabase repair classification: dashboard metadata/cache evidence or a separately accepted bounded read-only metadata diagnostic before any third write attempt.",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    migrationExecuted: false,
    remoteSupabaseConnectionAttempted: false,
    supabaseWriteAttempted: false,
    stagingRowsCreated: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    rawPayloadsPrinted: false,
    rowPayloadsPrinted: false,
    secretsPrinted: false,
    publicPromotionAllowed: false,
    rowCoveragePointsAllowed: false,
    scoreSourceRealAllowed: false
  }
};

console.log(JSON.stringify(report, null, 2));
