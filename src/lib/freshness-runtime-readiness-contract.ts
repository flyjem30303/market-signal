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
    displayBaseline: "目前仍使用模擬新鮮度狀態；Supabase runtime read 預設關閉，公開資料來源維持 mock。",
    displayCandidate:
      "下一個候選只限讀取 data_runs 的新鮮度摘要；data_freshness 仍是遠端候選，不會成為 runtime 依賴。",
    displayHeadline: "新鮮度唯讀檢查可進入流程討論，但尚未執行",
    displayNextDefaultAction:
      "先跑本機預檢並維持 mock/disabled 預設；只有 CEO 明確點名一次唯讀嘗試時才進入遠端讀取。",
    displayStatus: "可做流程決策，尚未授權執行",
    displayStopLine:
      "這張卡不允許自動遠端讀取、SQL、寫入、匯入、公開資料來源升級、資料列覆蓋加分或真實評分來源。",
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
