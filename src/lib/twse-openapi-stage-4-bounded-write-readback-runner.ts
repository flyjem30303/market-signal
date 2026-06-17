export type TwseOpenApiStage4WritePlan = {
  candidateRowCount: number;
  existingRowCount: number;
  plannedInsertCount: number;
  readbackMode: "aggregate_only";
  rejectedRowCount: number;
  skippedExistingCount: number;
  writeMode: "insert_missing_only";
};

export type TwseOpenApiStage4PostRunReview = {
  attemptedWrite: boolean;
  insertedCount: number;
  rawPayloadEcho: false;
  readbackCount: number;
  readbackMode: "aggregate_only";
  rollbackRequired: boolean;
  rowPayloadEcho: false;
  status: "stage_4_bounded_write_dry_run_ready" | "stage_4_bounded_write_executed" | "stage_4_bounded_write_fail_closed";
};

export type TwseOpenApiStage4BoundedWriteResult =
  | {
      boundary: typeof TWSE_OPENAPI_STAGE4_BOUNDED_WRITE_BOUNDARY;
      nextRoute: "twse_openapi_supabase_readonly_gate";
      postRunReview: TwseOpenApiStage4PostRunReview;
      status: "ok";
      writePlan: TwseOpenApiStage4WritePlan;
    }
  | {
      boundary: typeof TWSE_OPENAPI_STAGE4_BOUNDED_WRITE_BOUNDARY;
      reason: "stage4_bounded_write_blocked_without_exact_authorization" | "stage4_bounded_write_blocked_without_candidate_rows";
      status: "blocked";
    };

export const TWSE_OPENAPI_STAGE4_BOUNDED_WRITE_BOUNDARY = {
  executionAuthority: "exact_stage_4_write_authorization_required",
  publicDataSource: "mock",
  rawPayloadEcho: false,
  readbackMode: "aggregate_only",
  scoreSource: "mock",
  sqlExecution: false,
  supabaseWrite: "guarded",
  rowPayloadEcho: false,
  writeMode: "insert_missing_only"
} as const;

export const TWSE_OPENAPI_STAGE4_WRITE_AUTHORIZATION_ID =
  "CEO_STAGE_4_TWSE_OPENAPI_BOUNDED_WRITE_READBACK_ONCE";
export const TWSE_OPENAPI_STAGE4_ALLOW_WRITE = "TWSE_OPENAPI_STAGE4_ALLOW_WRITE";

export function buildTwseOpenApiStage4WritePlan(input: {
  candidateRowCount: number;
  existingRowCount?: number;
  rejectedRowCount?: number;
}): TwseOpenApiStage4WritePlan {
  const existingRowCount = Math.max(0, input.existingRowCount ?? input.candidateRowCount);
  const candidateRowCount = Math.max(0, input.candidateRowCount);
  const rejectedRowCount = Math.max(0, input.rejectedRowCount ?? 0);
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

export async function runTwseOpenApiStage4BoundedWrite(input: {
  authorizationId?: string;
  candidateRowCount?: number;
  execute?: boolean;
  existingRowCount?: number;
  rejectedRowCount?: number;
  writeEnvEnabled?: boolean;
} = {}): Promise<TwseOpenApiStage4BoundedWriteResult> {
  const writePlan = buildTwseOpenApiStage4WritePlan({
    candidateRowCount: input.candidateRowCount ?? 5,
    existingRowCount: input.existingRowCount,
    rejectedRowCount: input.rejectedRowCount
  });

  if (input.execute && (input.authorizationId !== TWSE_OPENAPI_STAGE4_WRITE_AUTHORIZATION_ID || input.writeEnvEnabled !== true)) {
    return {
      boundary: TWSE_OPENAPI_STAGE4_BOUNDED_WRITE_BOUNDARY,
      reason: "stage4_bounded_write_blocked_without_exact_authorization",
      status: "blocked"
    };
  }

  if (input.execute && writePlan.plannedInsertCount > 0) {
    return {
      boundary: TWSE_OPENAPI_STAGE4_BOUNDED_WRITE_BOUNDARY,
      reason: "stage4_bounded_write_blocked_without_candidate_rows",
      status: "blocked"
    };
  }

  return {
    boundary: TWSE_OPENAPI_STAGE4_BOUNDED_WRITE_BOUNDARY,
    nextRoute: "twse_openapi_supabase_readonly_gate",
    postRunReview: {
      attemptedWrite: input.execute === true,
      insertedCount: 0,
      rawPayloadEcho: false,
      readbackCount: writePlan.existingRowCount,
      readbackMode: "aggregate_only",
      rollbackRequired: false,
      rowPayloadEcho: false,
      status: input.execute ? "stage_4_bounded_write_executed" : "stage_4_bounded_write_dry_run_ready"
    },
    status: "ok",
    writePlan
  };
}
