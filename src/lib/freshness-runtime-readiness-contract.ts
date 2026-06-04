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
  displayBaseline: string;
  displayCandidate: string;
  displayHeadline: string;
  displayNextDefaultAction: string;
  displayStatus: string;
  displayStopLine: string;
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
    displayBaseline: "目前公開網站仍使用 mock 新鮮度狀態；Supabase runtime read 預設關閉，公開資料來源與評分來源都維持 mock。",
    displayCandidate:
      "下一步只討論從 data_runs 進行一次唯讀檢查；data_freshness 仍不是 runtime 依賴，也不會被寫入。",
    displayHeadline: "新鮮度唯讀檢查可進入流程討論，但尚未執行",
    displayNextDefaultAction:
      "先完成本機預檢並維持 mock/disabled 預設；只有 CEO 明確點名一次 bounded readonly attempt 時才可進入遠端檢查。",
    displayStatus: "可做流程決策，尚未授權執行",
    displayStopLine:
      "這張合約不允許自動遠端讀取、SQL、寫入、資料匯入、公開來源升級、row coverage 計分、新鮮度品質宣稱或 scoreSource=real。",
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
