import fs from "node:fs";

const migrationPath = "supabase/migrations/0003_twse_stock_day_staging.sql";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const candidatePath = "data/candidates/tw-equity-staging-candidate.json";

const migration = fs.readFileSync(migrationPath, "utf8");
const runner = fs.readFileSync(runnerPath, "utf8");
const candidate = JSON.parse(fs.readFileSync(candidatePath, "utf8"));

const candidateRunId = candidate?.candidateRun?.run_id ?? "";
const candidatePriceRunIds = Array.isArray(candidate?.candidatePrices)
  ? new Set(candidate.candidatePrices.map((row) => row?.run_id))
  : new Set();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

const localEvidence = {
  candidateInputPriceRows: Array.isArray(candidate?.candidatePrices) ? candidate.candidatePrices.length : 0,
  candidateInputRunRows: candidate?.candidateRun ? 1 : 0,
  candidatePriceRunIdsAllMatchRunId: candidatePriceRunIds.size === 1 && candidatePriceRunIds.has(candidateRunId),
  candidateRunIdIsUuidShaped: uuidPattern.test(candidateRunId),
  candidateTargetRelationMatchesRunnerTarget:
    candidate?.targetRelation === "staging_twse_stock_day_runs,staging_twse_stock_day_prices",
  migrationDeclaresPricesRunIdUuid: migration.includes("run_id uuid not null references public.staging_twse_stock_day_runs"),
  migrationDeclaresRunsRunIdUuid: migration.includes("run_id uuid primary key"),
  migrationDeclaresPricesTable: migration.includes("create table if not exists public.staging_twse_stock_day_prices"),
  migrationDeclaresRunsTable: migration.includes("create table if not exists public.staging_twse_stock_day_runs"),
  migrationEnablesPricesRls: migration.includes("alter table public.staging_twse_stock_day_prices enable row level security"),
  migrationEnablesRunsRls: migration.includes("alter table public.staging_twse_stock_day_runs enable row level security"),
  runnerTargetsPricesTable: runner.includes("staging_twse_stock_day_prices"),
  runnerTargetsRunsTable: runner.includes("staging_twse_stock_day_runs"),
  runnerValidatorRequiresUuidRunId: runner.includes("candidate_run_run_id_must_be_uuid")
};

const report = {
  status: "tw_equity_supabase_staging_write_repair_evidence_record_local_mismatch_found_no_remote_action",
  decision: "LOCAL_PAYLOAD_CONTRACT_REPAIR_REQUIRED_BEFORE_ANY_REMOTE_REPAIR_OR_THIRD_ATTEMPT",
  checklistClassification: {
    c1RestInsertSchemaExposure: "pending_remote_metadata_evidence",
    c2PostgrestSchemaCache: "pending_dashboard_or_api_metadata_evidence",
    c3ObjectAndSchemaNameMatch: "local_match_accepted",
    c4RlsAndPolicyPosture: "local_rls_enabled_remote_policy_unknown",
    c5ReadOnlyVersusInsertPathMatch: "local_target_path_match_remote_metadata_parity_unknown",
    c6InsertPayloadAndColumnContract: localEvidence.candidateRunIdIsUuidShaped
      ? "local_payload_contract_uuid_shape_accepted"
      : "local_payload_contract_mismatch_run_id_not_uuid"
  },
  localEvidence,
  nextAction:
    "Create TW_EQUITY_RUN_ID_UUID_CONTRACT_REPAIR_GATE and repair the local validator/generator/candidate contract before any remote repair or third write attempt.",
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
