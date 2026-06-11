export type RowCoverageSecondAttemptReadiness = {
  attemptState: "remote_paused";
  commandMap: {
    approvalToken: "CP3_ROW_COVERAGE_READONLY_VALIDATE";
    packageCommand: "npm run run:row-coverage-readonly";
    powershellCommand: "$env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION=\"CP3_ROW_COVERAGE_READONLY_VALIDATE\"; & 'C:\\Program Files\\nodejs\\node.exe' scripts\\run-row-coverage-readonly-once.mjs";
    postRunReview: "create sanitized post-run review before any readiness change";
  };
  goNoGo: {
    go: string[];
    noGo: string[];
    decisionRequired: string;
  };
  headline: string;
  latestAttempt: {
    coverageStatus: "暫不升級";
    expectedTotalRows: 360;
    missingRows: 178;
    observedTotalRows: 182;
    reason: "資料覆蓋率尚未達標";
    remoteAttempted: true;
  };
  nextDecision: string;
  publicDataSource: "mock";
  readiness: "local_ready_remote_paused";
  scoreSource: "mock";
  stage: "row_coverage_second_attempt";
  stopLine: string;
  unresolved: string[];
};

export function getRowCoverageSecondAttemptReadiness(): RowCoverageSecondAttemptReadiness {
  return {
    attemptState: "remote_paused",
    commandMap: {
      approvalToken: "CP3_ROW_COVERAGE_READONLY_VALIDATE",
      packageCommand: "npm run run:row-coverage-readonly",
      postRunReview: "create sanitized post-run review before any readiness change",
      powershellCommand:
        "$env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION=\"CP3_ROW_COVERAGE_READONLY_VALIDATE\"; & 'C:\\Program Files\\nodejs\\node.exe' scripts\\run-row-coverage-readonly-once.mjs"
    },
    goNoGo: {
      decisionRequired: "下一次外部資料檢查必須先限定範圍、停止條件與結果覆核方式，避免把未完整覆蓋的資料誤當成正式訊號。",
      go: ["本機檢查通過", "輸出欄位已定義", "檢查後必須留下可追溯結果"],
      noGo: ["不執行 SQL", "不寫入 Supabase", "不匯入原始市場資料", "不切換 publicDataSource=supabase", "不切換 scoreSource=real"]
    },
    headline: "週報資料覆蓋率仍在補齊中",
    latestAttempt: {
      coverageStatus: "暫不升級",
      expectedTotalRows: 360,
      missingRows: 178,
      observedTotalRows: 182,
      reason: "資料覆蓋率尚未達標",
      remoteAttempted: true
    },
    nextDecision: "下一步優先補齊 Batch 1 覆蓋缺口，讓週報能從示範閱讀流程走向可驗證資料流程。",
    publicDataSource: "mock",
    readiness: "local_ready_remote_paused",
    scoreSource: "mock",
    stage: "row_coverage_second_attempt",
    stopLine:
      "在來源權利、覆蓋率、品質檢查與回退條件都通過前，公開頁面仍維持示範資料與 mock 分數。",
    unresolved: [
      "TWII 最近 60 個交易日仍待補齊",
      "0050 最近 60 個交易日仍待補齊",
      "006208 最近 60 個交易日仍待補齊",
      "覆蓋率分數尚未開放",
      "正式資料升級尚未開放",
      "寫入與回補流程需要另行通過資料升級條件"
    ]
  };
}
