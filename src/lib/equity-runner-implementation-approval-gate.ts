export type EquityRunnerImplementationApprovalRequirement = {
  id:
    | "ceo-authorization"
    | "legal-source-access"
    | "no-database-client"
    | "report-only-output"
    | "single-run-command"
    | "post-run-review";
  owner: "CEO" | "Legal" | "Engineering" | "Data" | "PM";
  status: "required_before_approval";
  requirement: string;
};

export type EquityRunnerImplementationApprovalGate = {
  status: "equity_runner_implementation_approval_required";
  requestedNextMove: "implement_report_only_runner";
  approvalState: "not_approved";
  scope: {
    sourceId: "twse-stock-day";
    targetSymbols: ["2330", "2382", "2308"];
    runMode: "report_only";
  };
  requirements: EquityRunnerImplementationApprovalRequirement[];
  forbiddenUntilApproved: string[];
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
};

export function getEquityRunnerImplementationApprovalGate(): EquityRunnerImplementationApprovalGate {
  return {
    approvalState: "not_approved",
    forbiddenUntilApproved: [
      "writing runner code",
      "executing a dry run",
      "fetching TWSE STOCK_DAY",
      "importing Supabase clients",
      "reading or writing Supabase",
      "creating staging rows",
      "mutating daily_prices",
      "printing raw rows",
      "committing raw market data",
      "awarding row coverage credit",
      "setting scoreSource=real"
    ],
    publicDataSource: "mock",
    requestedNextMove: "implement_report_only_runner",
    requirements: [
      {
        id: "ceo-authorization",
        owner: "CEO",
        requirement:
          "Approve one bounded implementation slice for a report-only runner before any runner code is written.",
        status: "required_before_approval"
      },
      {
        id: "legal-source-access",
        owner: "Legal",
        requirement:
          "Approve automated source access, fair-use posture, attribution, storage limits, and no-redistribution handling.",
        status: "required_before_approval"
      },
      {
        id: "no-database-client",
        owner: "Engineering",
        requirement:
          "Require the runner implementation to avoid Supabase imports, SQL strings, database clients, and persistence paths.",
        status: "required_before_approval"
      },
      {
        id: "report-only-output",
        owner: "Data",
        requirement:
          "Limit output to aggregate metadata, validation counters, HTTP summaries, schema-key summaries, and final decision state.",
        status: "required_before_approval"
      },
      {
        id: "single-run-command",
        owner: "Engineering",
        requirement:
          "Require an explicit one-shot command with no schedule, no automation loop, no retries beyond approved limits, and sanitized logs.",
        status: "required_before_approval"
      },
      {
        id: "post-run-review",
        owner: "PM",
        requirement:
          "Require a post-run review before any source promotion, row coverage credit, public claim, model score, or next execution.",
        status: "required_before_approval"
      }
    ],
    scope: {
      runMode: "report_only",
      sourceId: "twse-stock-day",
      targetSymbols: ["2330", "2382", "2308"]
    },
    scoreSource: "mock",
    status: "equity_runner_implementation_approval_required",
    stopLine:
      "This approval gate does not run SQL, connect to Supabase, write Supabase, fetch or ingest market data, implement a reporter, execute a dry run, create staging rows, modify daily_prices, print secrets, print row payloads, commit raw market data, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
  };
}
