export type RunnerApprovalDecisionOption = {
  id: "request-approval" | "defer-and-continue-packets" | "reject-runner-path";
  recommendation: "primary" | "secondary" | "fallback";
  outcome: string;
  risk: string;
};

export type RunnerApprovalDecisionRequestSummary = {
  status: "runner_approval_decision_request_summarized";
  decisionQuestion: "approve_one_report_only_runner_implementation_slice";
  currentRecommendation: "request_approval_for_one_bounded_report_only_runner_implementation";
  approvalState: "not_approved";
  requestedScope: {
    sourceId: "twse-stock-day";
    targetSymbols: ["2330", "2382", "2308"];
    runMode: "report_only";
  };
  options: RunnerApprovalDecisionOption[];
  chairReviewRequired: true;
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
};

export function getRunnerApprovalDecisionRequestSummary(): RunnerApprovalDecisionRequestSummary {
  return {
    approvalState: "not_approved",
    chairReviewRequired: true,
    currentRecommendation: "request_approval_for_one_bounded_report_only_runner_implementation",
    decisionQuestion: "approve_one_report_only_runner_implementation_slice",
    options: [
      {
        id: "request-approval",
        outcome:
          "CEO asks the chairman to approve exactly one bounded report-only runner implementation slice.",
        recommendation: "primary",
        risk:
          "Fastest path to runtime evidence, but it must remain code-only until approval is explicit and logged."
      },
      {
        id: "defer-and-continue-packets",
        outcome:
          "Team continues local-only packets and role reviews without implementing the report-only runner.",
        recommendation: "secondary",
        risk:
          "Lowest execution risk, but progress toward real runtime evidence remains slow and governance-heavy."
      },
      {
        id: "reject-runner-path",
        outcome:
          "Team rejects this runner route and returns to source-selection or Supabase-readonly preparation.",
        recommendation: "fallback",
        risk:
          "Avoids market-source execution risk, but leaves equity row coverage blocked until a new route is selected."
      }
    ],
    publicDataSource: "mock",
    requestedScope: {
      runMode: "report_only",
      sourceId: "twse-stock-day",
      targetSymbols: ["2330", "2382", "2308"]
    },
    scoreSource: "mock",
    status: "runner_approval_decision_request_summarized",
    stopLine:
      "This decision request does not run SQL, connect to Supabase, write Supabase, fetch or ingest market data, implement a reporter, execute a dry run, create staging rows, modify daily_prices, print secrets, print row payloads, commit raw market data, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
  };
}
