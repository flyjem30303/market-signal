import fs from "node:fs";

const gatePath = "src/lib/equity-runner-implementation-approval-gate.ts";
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
  [gatePath, "getEquityRunnerImplementationApprovalGate"],
  [gatePath, "equity_runner_implementation_approval_required"],
  [gatePath, "requestedNextMove: \"implement_report_only_runner\""],
  [gatePath, "approvalState: \"not_approved\""],
  [gatePath, "sourceId: \"twse-stock-day\""],
  [gatePath, "targetSymbols: [\"2330\", \"2382\", \"2308\"]"],
  [gatePath, "runMode: \"report_only\""],
  [gatePath, "ceo-authorization"],
  [gatePath, "legal-source-access"],
  [gatePath, "no-database-client"],
  [gatePath, "report-only-output"],
  [gatePath, "single-run-command"],
  [gatePath, "post-run-review"],
  [gatePath, "required_before_approval"],
  [gatePath, "writing runner code"],
  [gatePath, "executing a dry run"],
  [gatePath, "fetching TWSE STOCK_DAY"],
  [gatePath, "importing Supabase clients"],
  [gatePath, "reading or writing Supabase"],
  [gatePath, "creating staging rows"],
  [gatePath, "mutating daily_prices"],
  [gatePath, "printing raw rows"],
  [gatePath, "committing raw market data"],
  [gatePath, "awarding row coverage credit"],
  [gatePath, "setting scoreSource=real"],
  [gatePath, "publicDataSource: \"mock\""],
  [gatePath, "scoreSource: \"mock\""],
  [gatePath, "does not run SQL"],
  [gatePath, "connect to Supabase"],
  [gatePath, "write Supabase"],
  [gatePath, "fetch or ingest market data"],
  [gatePath, "implement a reporter"],
  [gatePath, "execute a dry run"],
  [gatePath, "create staging rows"],
  [gatePath, "modify daily_prices"],
  [gatePath, "print secrets"],
  [gatePath, "print row payloads"],
  [gatePath, "commit raw market data"],
  [gatePath, "promote publicDataSource=supabase"],
  [gatePath, "award row coverage points"],
  [gatePath, "set scoreSource=real"],
  [readinessPath, "getEquityRunnerImplementationApprovalGate"],
  [readinessPath, "equityRunnerImplementationApprovalGate: EquityRunnerImplementationApprovalGate"],
  [readinessPath, "equityRunnerImplementationApprovalGate: getEquityRunnerImplementationApprovalGate()"],
  [componentPath, "project-progress-equity-runner-approval"],
  [componentPath, "equityRunnerImplementationApprovalGate.requirements.map"],
  [componentPath, "equityRunnerImplementationApprovalGate.forbiddenUntilApproved.join"],
  [componentPath, "equityRunnerImplementationApprovalGate.stopLine"],
  [cssPath, ".project-progress-equity-runner-approval"],
  [
    packagePath,
    "\"check:equity-runner-implementation-approval-gate\": \"node scripts/check-equity-runner-implementation-approval-gate.mjs\""
  ],
  [reviewGatePath, "scripts/check-equity-runner-implementation-approval-gate.mjs"]
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
