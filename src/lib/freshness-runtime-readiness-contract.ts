export type FreshnessRuntimeReadinessStatus = "ready_for_process_only_decision" | "blocked_by_default";

export type FreshnessRuntimeReadinessPrecheck = {
  command: string;
  reason: string;
  required: true;
};

export type FreshnessRuntimeReadinessContract = {
  activationEnvironment: {
    confirmation: "CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT";
    dataFreshnessSource: "supabase";
    nextPublicDataSource: "mock";
    supabaseRuntimeReads: "enabled";
  };
  baselineEnvironment: {
    dataFreshnessSource: "mock";
    nextPublicDataSource: "mock";
    supabaseRuntimeReads: "disabled";
  };
  blockedActions: string[];
  dataFreshnessObject: "blocked_remote_candidate";
  dataRunsObject: "only_runtime_read_candidate";
  failureBehavior: "fallback_to_mock_snapshot";
  mode: "freshness_runtime_readiness_contract";
  nextDefaultAction: string;
  prechecks: FreshnessRuntimeReadinessPrecheck[];
  publicDataSource: "mock";
  scoreSource: "mock";
  status: FreshnessRuntimeReadinessStatus;
  stopLine: string;
};

export function getFreshnessRuntimeReadinessContract(): FreshnessRuntimeReadinessContract {
  return {
    activationEnvironment: {
      confirmation: "CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT",
      dataFreshnessSource: "supabase",
      nextPublicDataSource: "mock",
      supabaseRuntimeReads: "enabled"
    },
    baselineEnvironment: {
      dataFreshnessSource: "mock",
      nextPublicDataSource: "mock",
      supabaseRuntimeReads: "disabled"
    },
    blockedActions: [
      "automatic Supabase runtime reads",
      "SQL execution",
      "Supabase writes",
      "staging row writes",
      "daily_prices writes",
      "runtime repository dependency on data_freshness",
      "market-data fetch or ingestion",
      "publicDataSource=supabase",
      "scoreSource=real"
    ],
    dataFreshnessObject: "blocked_remote_candidate",
    dataRunsObject: "only_runtime_read_candidate",
    failureBehavior: "fallback_to_mock_snapshot",
    mode: "freshness_runtime_readiness_contract",
    nextDefaultAction:
      "Run local prechecks, keep defaults mock/disabled, then CEO may name one process-only freshness runtime read attempt.",
    prechecks: [
      {
        command: "node scripts/check-cp3-freshness-runtime-wrapper-local-smoke.mjs",
        reason: "Confirms the wrapper only creates a Supabase client when source=supabase and reads=enabled.",
        required: true
      },
      {
        command: "node scripts/check-cp3-freshness-runtime-read-once-guarded-runner.mjs",
        reason: "Confirms missing confirmation fails closed before remote attempt.",
        required: true
      },
      {
        command: "node scripts/check-freshness-runtime-read-once-pre-remote-behavior.mjs",
        reason: "Confirms unsafe env combinations do not reach the remote path.",
        required: true
      },
      {
        command: "node scripts/check-review-gates.mjs",
        reason: "Confirms project-wide guards still accept the bounded readiness state.",
        required: true
      }
    ],
    publicDataSource: "mock",
    scoreSource: "mock",
    status: "ready_for_process_only_decision",
    stopLine:
      "Freshness runtime readiness does not approve automatic remote reads, SQL, writes, ingestion, public source promotion, row coverage credit, freshness quality claims, or scoreSource=real."
  };
}
