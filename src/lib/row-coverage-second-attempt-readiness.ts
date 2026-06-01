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
    coverageStatus: "blocked";
    expectedTotalRows: 360;
    missingRows: 355;
    observedTotalRows: 5;
    reason: "aggregate_count_incomplete";
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
      decisionRequired: "CEO must explicitly name exactly one bounded Supabase readonly row coverage attempt before any remote read.",
      go: [
        "local prerequisite checks are ok",
        "sanitized output contract is defined",
        "post-run review is required immediately after the attempt"
      ],
      noGo: [
        "no SQL execution",
        "no Supabase writes",
        "no raw market data ingestion",
        "no publicDataSource=supabase",
        "no scoreSource=real"
      ]
    },
    headline: "Row coverage readonly gate ready",
    latestAttempt: {
      coverageStatus: "blocked",
      expectedTotalRows: 360,
      missingRows: 355,
      observedTotalRows: 5,
      reason: "aggregate_count_incomplete",
      remoteAttempted: true
    },
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
