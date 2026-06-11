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
    missingRows: 178;
    observedTotalRows: 182;
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
    headline: "Row coverage readonly gate reviewed",
    latestAttempt: {
      coverageStatus: "blocked",
      expectedTotalRows: 360,
      missingRows: 178,
      observedTotalRows: 182,
      reason: "aggregate_count_incomplete",
      remoteAttempted: true
    },
    nextDecision: "PM should prepare the Batch 1 coverage repair route; do not retry readonly in the same slice.",
    publicDataSource: "mock",
    readiness: "local_ready_remote_paused",
    scoreSource: "mock",
    stage: "row_coverage_second_attempt",
    stopLine:
      "Do not run SQL, write Supabase, award row coverage points, promote publicDataSource=supabase, or set scoreSource=real from this state.",
    unresolved: [
      "TWII remains 0/60",
      "0050 remains 1/60",
      "006208 remains 1/60",
      "row coverage points remain blocked",
      "CP3 remains not_ready",
      "write/backfill execution requires a separate named gate"
    ]
  };
}
