import fs from "node:fs";

const helperPath = "src/lib/runtime-execution-readiness-summary.ts";
const homePath = "src/components/home-runtime-status-panel.tsx";
const stockPath = "src/components/stock-runtime-at-a-glance.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, homePath, stockPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [helperPath, "RuntimeExecutionReadinessSummary"],
  [helperPath, "getRuntimeExecutionReadinessSummary"],
  [helperPath, "runtime_execution_readiness_summary"],
  [helperPath, "ready_for_ceo_oral_decision_not_execution"],
  [helperPath, "Row coverage readonly is locally ready for a CEO oral decision"],
  [helperPath, "it is not execution and it does not connect to Supabase"],
  [helperPath, "Authorize exactly one bounded Supabase readonly row coverage attempt"],
  [helperPath, "Continue mock runtime hardening"],
  [helperPath, "publicDataSource=supabase"],
  [helperPath, "scoreSource=real"],
  [helperPath, "row coverage points"],
  [helperPath, "CP3_READY_NOW"],
  [helperPath, "publicDataSource: dataReadiness.safety.publicDataSource"],
  [helperPath, "scoreSource: dataReadiness.safety.scoreSource"],
  [helperPath, "does not execute Supabase"],
  [helperPath, "run SQL"],
  [helperPath, "fetch market data"],
  [helperPath, "set scoreSource=real"],
  [homePath, "getRuntimeExecutionReadinessSummary"],
  [homePath, "const executionReadiness = getRuntimeExecutionReadinessSummary()"],
  [homePath, "runtime-execution-readiness-card"],
  [homePath, "Execution readiness"],
  [homePath, "executionReadiness.state"],
  [homePath, "executionReadiness.chairBrief"],
  [homePath, "executionReadiness.decisionQuestion"],
  [homePath, "executionReadiness.commandLabel"],
  [homePath, "executionReadiness.publicDataSource"],
  [homePath, "executionReadiness.scoreSource"],
  [stockPath, "getRuntimeExecutionReadinessSummary"],
  [stockPath, "const executionReadiness = getRuntimeExecutionReadinessSummary()"],
  [stockPath, "runtime-execution-readiness-card"],
  [stockPath, "Execution readiness"],
  [stockPath, "executionReadiness.state"],
  [stockPath, "executionReadiness.chairBrief"],
  [stockPath, "executionReadiness.decisionQuestion"],
  [stockPath, "executionReadiness.commandLabel"],
  [stockPath, "executionReadiness.publicDataSource"],
  [stockPath, "executionReadiness.scoreSource"],
  [cssPath, ".runtime-execution-readiness-card"],
  [packagePath, "\"check:runtime-execution-readiness-summary\": \"node scripts/check-runtime-execution-readiness-summary.mjs\""],
  [reviewGatePath, "scripts/check-runtime-execution-readiness-summary.mjs"],
  [reviewGatePath, "runtime-execution-readiness-summary"]
];

const forbidden = [
  [helperPath, "@supabase/supabase-js"],
  [helperPath, "createClient"],
  [helperPath, "fetch("],
  [helperPath, ".from("],
  [helperPath, ".insert("],
  [helperPath, ".update("],
  [helperPath, ".delete("],
  [helperPath, ".upsert("],
  [helperPath, "process.env"],
  [helperPath, "node:fs"],
  [helperPath, "publicDataSource: \"supabase\""],
  [helperPath, "scoreSource: \"real\""],
  [homePath, "scoreSource: \"real\""],
  [stockPath, "scoreSource: \"real\""],
  [homePath, "publicDataSource: \"supabase\""],
  [stockPath, "publicDataSource: \"supabase\""]
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
