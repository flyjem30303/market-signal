export type RowCoverageSecondAttemptReadiness = {
  attemptState: "remote_paused";
  headline: string;
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
    headline: "Row coverage readonly gate ready",
    nextDecision: "等待明確授權後，只執行一次 Supabase readonly attempt",
    publicDataSource: "mock",
    readiness: "local_ready_remote_paused",
    scoreSource: "mock",
    stage: "row_coverage_second_attempt",
    stopLine: "不跑 SQL、不寫 Supabase、不給 row coverage 分數、不切 scoreSource=real。",
    unresolved: [
      "第二次 remote attempt 尚未執行",
      "row coverage points 尚未給分",
      "CP3 仍是 not_ready",
      "Git 備份依董事長暫停指令延後"
    ]
  };
}
