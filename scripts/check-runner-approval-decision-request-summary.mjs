import fs from "node:fs";

const summaryPath = "src/lib/runner-approval-decision-request-summary.ts";
const readinessPath = "src/lib/data-source-readiness-packet.ts";
const componentPath = "src/components/project-progress-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [summaryPath, readinessPath, componentPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [summaryPath, "getRunnerApprovalDecisionRequestSummary"],
  [summaryPath, "runner_approval_decision_request_summarized"],
  [summaryPath, "approve_one_report_only_runner_implementation_slice"],
  [summaryPath, "request_approval_for_one_bounded_report_only_runner_implementation"],
  [summaryPath, "approvalState: \"not_approved\""],
  [summaryPath, "sourceId: \"twse-stock-day\""],
  [summaryPath, "targetSymbols: [\"2330\", \"2382\", \"2308\"]"],
  [summaryPath, "runMode: \"report_only\""],
  [summaryPath, "request-approval"],
  [summaryPath, "defer-and-continue-packets"],
  [summaryPath, "reject-runner-path"],
  [summaryPath, "chairReviewRequired: true"],
  [summaryPath, "publicDataSource: \"mock\""],
  [summaryPath, "scoreSource: \"mock\""],
  [summaryPath, "does not run SQL"],
  [summaryPath, "connect to Supabase"],
  [summaryPath, "write Supabase"],
  [summaryPath, "fetch or ingest market data"],
  [summaryPath, "implement a reporter"],
  [summaryPath, "execute a dry run"],
  [summaryPath, "create staging rows"],
  [summaryPath, "modify daily_prices"],
  [summaryPath, "print secrets"],
  [summaryPath, "print row payloads"],
  [summaryPath, "commit raw market data"],
  [summaryPath, "promote publicDataSource=supabase"],
  [summaryPath, "award row coverage points"],
  [summaryPath, "set scoreSource=real"],
  [readinessPath, "getRunnerApprovalDecisionRequestSummary"],
  [readinessPath, "runnerApprovalDecisionRequestSummary: RunnerApprovalDecisionRequestSummary"],
  [readinessPath, "runnerApprovalDecisionRequestSummary: getRunnerApprovalDecisionRequestSummary()"],
  [componentPath, "project-progress-runner-decision-request"],
  [componentPath, "runnerApprovalDecisionRequestSummary.options.map"],
  [componentPath, "runnerApprovalDecisionRequestSummary.stopLine"],
  [cssPath, ".project-progress-runner-decision-request"],
  [
    packagePath,
    "\"check:runner-approval-decision-request-summary\": \"node scripts/check-runner-approval-decision-request-summary.mjs\""
  ],
  [reviewGatePath, "scripts/check-runner-approval-decision-request-summary.mjs"]
];

const forbidden = [
  [summaryPath, "@supabase/supabase-js"],
  [summaryPath, "createClient"],
  [summaryPath, "fetch("],
  [summaryPath, ".from("],
  [summaryPath, ".insert("],
  [summaryPath, ".update("],
  [summaryPath, ".delete("],
  [summaryPath, "process.env"],
  [summaryPath, "publicDataSource: \"supabase\""],
  [summaryPath, "scoreSource: \"real\""],
  [componentPath, "run SQL"],
  [componentPath, "fetch("]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
