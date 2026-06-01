import fs from "node:fs";

const gatePath = "src/lib/equity-runner-execution-approval-gate.ts";
const readinessPath = "src/lib/data-source-readiness-packet.ts";
const componentPath = "src/components/project-progress-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [gatePath, readinessPath, componentPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [gatePath, "getEquityRunnerExecutionApprovalGate"],
  [gatePath, "equity_runner_execution_approval_required"],
  [gatePath, "approvalState: \"not_approved\""],
  [gatePath, "approve_exactly_one_equity_report_only_runner_attempt"],
  [gatePath, "EQUITY_REPORT_ONLY_RUNNER_CONFIRMATION"],
  [gatePath, "CEO_APPROVED_EQUITY_REPORT_ONLY_RUNNER_EXECUTION"],
  [gatePath, "NEXT_PUBLIC_DATA_SOURCE=mock"],
  [gatePath, "node scripts/run-equity-report-only-runner-once.mjs"],
  [gatePath, "sourceId: \"twse-stock-day\""],
  [gatePath, "targetSymbols: [\"2330\", \"2382\", \"2308\"]"],
  [gatePath, "attemptLimit: 1"],
  [gatePath, "postRunReviewRequired: true"],
  [gatePath, "npm run check:equity-report-only-runner-implementation"],
  [gatePath, "npm run check:runner-approval-decision-outcome-ledger"],
  [gatePath, "npm run check:data-source-readiness-packet"],
  [gatePath, "npm run check:review-gates"],
  [gatePath, "npm run check:equity-runner-execution-approval-gate"],
  [gatePath, "setting EQUITY_REPORT_ONLY_RUNNER_CONFIRMATION"],
  [gatePath, "executing scripts/run-equity-report-only-runner-once.mjs"],
  [gatePath, "fetching TWSE STOCK_DAY"],
  [gatePath, "printing row payloads"],
  [gatePath, "writing files"],
  [gatePath, "writing Supabase"],
  [gatePath, "running SQL"],
  [gatePath, "creating staging rows"],
  [gatePath, "mutating daily_prices"],
  [gatePath, "awarding row coverage credit"],
  [gatePath, "setting scoreSource=real"],
  [gatePath, "publicDataSource: \"mock\""],
  [gatePath, "scoreSource: \"mock\""],
  [gatePath, "does not approve execution yet"],
  [gatePath, "does not set EQUITY_REPORT_ONLY_RUNNER_CONFIRMATION"],
  [gatePath, "does not run the runner"],
  [gatePath, "does not fetch or ingest market data"],
  [gatePath, "does not run SQL"],
  [gatePath, "does not connect to Supabase"],
  [gatePath, "does not write Supabase"],
  [gatePath, "does not create staging rows"],
  [gatePath, "does not modify daily_prices"],
  [gatePath, "does not print secrets"],
  [gatePath, "does not print row payloads"],
  [gatePath, "does not commit raw market data"],
  [gatePath, "does not award row coverage points"],
  [gatePath, "does not promote publicDataSource=supabase"],
  [gatePath, "does not set scoreSource=real"],
  [readinessPath, "getEquityRunnerExecutionApprovalGate"],
  [readinessPath, "equityRunnerExecutionApprovalGate: EquityRunnerExecutionApprovalGate"],
  [readinessPath, "equityRunnerExecutionApprovalGate: getEquityRunnerExecutionApprovalGate()"],
  [componentPath, "project-progress-runner-execution-gate"],
  [componentPath, "equityRunnerExecutionApprovalGate.prechecks.map"],
  [componentPath, "equityRunnerExecutionApprovalGate.forbiddenUntilApproved.join"],
  [componentPath, "equityRunnerExecutionApprovalGate.stopLine"],
  [cssPath, ".project-progress-runner-execution-gate"],
  [
    packagePath,
    "\"check:equity-runner-execution-approval-gate\": \"node scripts/check-equity-runner-execution-approval-gate.mjs\""
  ],
  [reviewGatePath, "scripts/check-equity-runner-execution-approval-gate.mjs"]
];

const forbidden = [
  [gatePath, "@supabase/supabase-js"],
  [gatePath, "createClient"],
  [gatePath, "fetch("],
  [gatePath, ".from("],
  [gatePath, ".insert("],
  [gatePath, ".update("],
  [gatePath, ".delete("],
  [gatePath, "process.env"],
  [gatePath, "publicDataSource: \"supabase\""],
  [gatePath, "scoreSource: \"real\""],
  [componentPath, "run SQL"],
  [componentPath, "fetch("]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

if (read(reviewGatePath).includes("scripts/run-equity-report-only-runner-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the equity report-only runner`);
}

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
