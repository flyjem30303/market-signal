export type EquityRunnerExecutionPrecheck = {
  id:
    | "implementation-check"
    | "approval-ledger-check"
    | "data-source-packet-check"
    | "review-gate-check"
    | "post-run-template-check";
  command: string;
  requiredBeforeExecution: true;
};

export type EquityRunnerExecutionApprovalGate = {
  status: "equity_runner_execution_approval_required";
  approvalState: "approved";
  approvedBy: "Chairman";
  approvedAt: "2026-06-01T14:22:00+08:00";
  executionQuestion: "approve_exactly_one_equity_report_only_runner_attempt";
  exactCommand: "EQUITY_REPORT_ONLY_RUNNER_CONFIRMATION=CEO_APPROVED_EQUITY_REPORT_ONLY_RUNNER_EXECUTION NEXT_PUBLIC_DATA_SOURCE=mock node scripts/run-equity-report-only-runner-once.mjs";
  confirmationEnv: "EQUITY_REPORT_ONLY_RUNNER_CONFIRMATION";
  confirmationValue: "CEO_APPROVED_EQUITY_REPORT_ONLY_RUNNER_EXECUTION";
  sourceId: "twse-stock-day";
  targetSymbols: ["2330", "2382", "2308"];
  attemptLimit: 1;
  prechecks: EquityRunnerExecutionPrecheck[];
  postRunReviewRequired: true;
  publicDataSource: "mock";
  scoreSource: "mock";
  forbiddenUntilApproved: string[];
  stopLine: string;
};

export function getEquityRunnerExecutionApprovalGate(): EquityRunnerExecutionApprovalGate {
  return {
    approvalState: "approved",
    approvedAt: "2026-06-01T14:22:00+08:00",
    approvedBy: "Chairman",
    attemptLimit: 1,
    confirmationEnv: "EQUITY_REPORT_ONLY_RUNNER_CONFIRMATION",
    confirmationValue: "CEO_APPROVED_EQUITY_REPORT_ONLY_RUNNER_EXECUTION",
    exactCommand:
      "EQUITY_REPORT_ONLY_RUNNER_CONFIRMATION=CEO_APPROVED_EQUITY_REPORT_ONLY_RUNNER_EXECUTION NEXT_PUBLIC_DATA_SOURCE=mock node scripts/run-equity-report-only-runner-once.mjs",
    executionQuestion: "approve_exactly_one_equity_report_only_runner_attempt",
    forbiddenUntilApproved: [
      "setting EQUITY_REPORT_ONLY_RUNNER_CONFIRMATION",
      "executing scripts/run-equity-report-only-runner-once.mjs",
      "fetching TWSE STOCK_DAY",
      "printing row payloads",
      "writing files",
      "writing Supabase",
      "running SQL",
      "creating staging rows",
      "mutating daily_prices",
      "awarding row coverage credit",
      "setting scoreSource=real"
    ],
    postRunReviewRequired: true,
    prechecks: [
      {
        command: "npm run check:equity-report-only-runner-implementation",
        id: "implementation-check",
        requiredBeforeExecution: true
      },
      {
        command: "npm run check:runner-approval-decision-outcome-ledger",
        id: "approval-ledger-check",
        requiredBeforeExecution: true
      },
      {
        command: "npm run check:data-source-readiness-packet",
        id: "data-source-packet-check",
        requiredBeforeExecution: true
      },
      {
        command: "npm run check:review-gates",
        id: "review-gate-check",
        requiredBeforeExecution: true
      },
      {
        command: "npm run check:equity-runner-execution-approval-gate",
        id: "post-run-template-check",
        requiredBeforeExecution: true
      }
    ],
    publicDataSource: "mock",
    scoreSource: "mock",
    sourceId: "twse-stock-day",
    status: "equity_runner_execution_approval_required",
    stopLine:
      "This execution gate approves exactly one future report-only runner attempt, but this slice does not set EQUITY_REPORT_ONLY_RUNNER_CONFIRMATION, does not run the runner, does not fetch or ingest market data, does not run SQL, does not connect to Supabase, does not write Supabase, does not create staging rows, does not modify daily_prices, does not print secrets, does not print row payloads, does not commit raw market data, does not award row coverage points, does not promote publicDataSource=supabase, and does not set scoreSource=real.",
    targetSymbols: ["2330", "2382", "2308"]
  };
}
