import fs from "node:fs";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const scriptPath = "scripts/report-supabase-readonly-execution-preview.mjs";
const checkerPath = "scripts/check-supabase-readonly-execution-preview.mjs";
const reviewGate = fs.readFileSync("scripts/check-review-gates.mjs", "utf8");
const source = fs.readFileSync(scriptPath, "utf8");
const normalized = source.toLowerCase();

const required = [
  "mode: \"supabase_readonly_execution_preview\"",
  "ready_for_manual_ceo_run",
  "willRunRemoteValidator: false",
  "automatedRemoteRun: false",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "mutations: false",
  "secretsPrinted: false",
  "rowPayloadsPrinted: false",
  "scoreSourceRealEnabled: false",
  "scripts/report-supabase-readonly-decision.mjs",
  "SUPABASE_READONLY_VALIDATE_CONFIRMATION",
  "CP3_SUPABASE_READONLY_REMOTE_VALIDATE",
  "npm run db:readonly-validate",
  "do not run this preview as approval",
  "do not run if confirmation is not process-scoped"
];

const forbidden = [
  "@supabase/supabase-js",
  "createclient",
  "fetch(",
  ".from(",
  ".select(",
  ".insert(",
  ".upsert(",
  ".update(",
  ".delete(",
  ".rpc(",
  "insert into",
  "delete from",
  "truncate",
  "drop table",
  "alter table",
  "create table",
  "writefilesync",
  "appendfilesync",
  "process.env"
];

const directExecutionPatterns = [
  /spawnSync\([^)]*db:readonly-validate/s,
  /execSync\([^)]*db:readonly-validate/s,
  /spawn\([^)]*db:readonly-validate/s
];

const packageScript = packageJson.scripts?.["report:supabase-readonly-execution-preview"];
const packageScriptOk = packageScript === "node scripts/report-supabase-readonly-execution-preview.mjs";
const reviewGateRunsChecker = reviewGate.includes(checkerPath);
const reviewGateDoesNotRunReporter = !reviewGate.includes(scriptPath);
const missing = required.filter((phrase) => !source.includes(phrase));
const blocked = forbidden.filter((phrase) => normalized.includes(phrase));
const directExecution = directExecutionPatterns
  .filter((pattern) => pattern.test(source))
  .map((pattern) => pattern.toString());
const failures = [
  ...missing.map((phrase) => `missing:${phrase}`),
  ...blocked.map((phrase) => `forbidden:${phrase}`),
  ...directExecution.map((pattern) => `directExecution:${pattern}`),
  ...(packageScriptOk ? [] : [`packageScript:${packageScript ?? "missing"}`]),
  ...(reviewGateRunsChecker ? [] : ["reviewGateMissingChecker"]),
  ...(reviewGateDoesNotRunReporter ? [] : ["reviewGateRunsExecutionPreviewReporter"])
];

console.log(
  JSON.stringify(
    {
      failures,
      packageScript,
      report: scriptPath,
      status: failures.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (failures.length > 0) {
  process.exitCode = 1;
}
