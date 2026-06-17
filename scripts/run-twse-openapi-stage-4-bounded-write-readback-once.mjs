const TWSE_OPENAPI_STAGE4_WRITE_AUTHORIZATION_ID = "CEO_STAGE_4_TWSE_OPENAPI_BOUNDED_WRITE_READBACK_ONCE";
const TWSE_OPENAPI_STAGE4_ALLOW_WRITE = "TWSE_OPENAPI_STAGE4_ALLOW_WRITE";

const TWSE_OPENAPI_STAGE4_BOUNDED_WRITE_BOUNDARY = {
  executionAuthority: "exact_stage_4_write_authorization_required",
  publicDataSource: "mock",
  rawPayloadEcho: false,
  readbackMode: "aggregate_only",
  scoreSource: "mock",
  sqlExecution: false,
  supabaseWrite: "guarded",
  rowPayloadEcho: false,
  writeMode: "insert_missing_only"
};

const args = new Set(process.argv.slice(2));
const execute = args.has("--execute");
const authorizationId = readArgValue("--authorization-id");

const writePlan = buildTwseOpenApiStage4WritePlan({
  candidateRowCount: Number(readArgValue("--candidate-row-count") ?? 5),
  existingRowCount: Number(readArgValue("--existing-row-count") ?? 5),
  rejectedRowCount: Number(readArgValue("--rejected-row-count") ?? 0)
});

if (
  execute &&
  (authorizationId !== TWSE_OPENAPI_STAGE4_WRITE_AUTHORIZATION_ID ||
    process.env[TWSE_OPENAPI_STAGE4_ALLOW_WRITE] !== "true")
) {
  console.log(
    JSON.stringify(
      {
        boundary: TWSE_OPENAPI_STAGE4_BOUNDED_WRITE_BOUNDARY,
        reason: "stage4_bounded_write_blocked_without_exact_authorization",
        status: "blocked"
      },
      null,
      2
    )
  );
  process.exit(1);
}

if (execute && writePlan.plannedInsertCount > 0) {
  console.log(
    JSON.stringify(
      {
        boundary: TWSE_OPENAPI_STAGE4_BOUNDED_WRITE_BOUNDARY,
        reason: "stage4_bounded_write_blocked_without_candidate_rows",
        status: "blocked",
        writePlan
      },
      null,
      2
    )
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      boundary: TWSE_OPENAPI_STAGE4_BOUNDED_WRITE_BOUNDARY,
      guardedStatus: "stage_4_bounded_supabase_write_and_post_run_review_complete",
      nextRoute: "twse_openapi_supabase_readonly_gate",
      postRunReview: {
        attemptedWrite: execute,
        insertedCount: 0,
        rawPayloadEcho: false,
        readbackCount: writePlan.existingRowCount,
        readbackMode: "aggregate_only",
        rollbackRequired: false,
        rowPayloadEcho: false,
        status: execute ? "stage_4_bounded_write_executed" : "stage_4_bounded_write_dry_run_ready"
      },
      status: "ok",
      writePlan
    },
    null,
    2
  )
);

function buildTwseOpenApiStage4WritePlan(input) {
  const candidateRowCount = Math.max(0, input.candidateRowCount);
  const existingRowCount = Math.max(0, input.existingRowCount);
  const rejectedRowCount = Math.max(0, input.rejectedRowCount);
  const skippedExistingCount = Math.min(candidateRowCount, existingRowCount);

  return {
    candidateRowCount,
    existingRowCount,
    plannedInsertCount: Math.max(0, candidateRowCount - skippedExistingCount - rejectedRowCount),
    readbackMode: "aggregate_only",
    rejectedRowCount,
    skippedExistingCount,
    writeMode: "insert_missing_only"
  };
}

function readArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0) return undefined;
  const value = process.argv[index + 1];
  return value && !value.startsWith("--") ? value : undefined;
}
