import fs from "node:fs";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const scriptPath = "scripts/report-supabase-readonly-final-prep.mjs";
const checkerPath = "scripts/check-supabase-readonly-final-prep.mjs";
const reviewGate = fs.readFileSync("scripts/check-review-gates.mjs", "utf8");
const source = fs.readFileSync(scriptPath, "utf8");
const normalized = source.toLowerCase();

const required = [
  "mode: \"supabase_readonly_final_prep\"",
  "Supabase readonly final prep",
  "scripts/report-supabase-readonly-local-preflight.mjs",
  "scripts/report-supabase-readonly-decision.mjs",
  "scripts/report-supabase-readonly-execution-preview.mjs",
  "ready_for_ceo_oral_review",
  "CEO gives oral summary and asks Chairman to approve exactly one manual read-only attempt",
  "PM fixes local blockers before CEO asks for a manual read-only attempt",
  "exactCommandPreview",
  "postRunReviewTarget",
  "requiredConfirmation",
  "CP3_SUPABASE_READONLY_REMOTE_VALIDATE",
  "willRunRemoteValidator: false",
  "remoteValidatorExecuted: false",
  "automatedRemoteRun: false",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "mutations: false",
  "secretsPrinted: false",
  "rowPayloadsPrinted: false",
  "scoreSourceRealEnabled: false",
  "filesWritten: false"
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
  "process.env",
  "scripts/validate-supabase-readonly.mjs"
];

const directExecutionPatterns = [
  /spawnSync\([^)]*db:readonly-validate/s,
  /execSync\([^)]*db:readonly-validate/s,
  /spawn\([^)]*db:readonly-validate/s,
  /"npm",\s*\["run",\s*"db:readonly-validate"/s
];

const packageScript = packageJson.scripts?.["report:supabase-readonly-final-prep"];
const packageCheckScript = packageJson.scripts?.["check:supabase-readonly-final-prep"];
const packageScriptOk = packageScript === "node scripts/report-supabase-readonly-final-prep.mjs";
const packageCheckScriptOk = packageCheckScript === "node scripts/check-supabase-readonly-final-prep.mjs";
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
  ...(packageCheckScriptOk ? [] : [`packageCheckScript:${packageCheckScript ?? "missing"}`]),
  ...(reviewGateRunsChecker ? [] : ["reviewGateMissingChecker"]),
  ...(reviewGateDoesNotRunReporter ? [] : ["reviewGateRunsFinalPrepReporter"])
];

console.log(
  JSON.stringify(
    {
      failures,
      packageCheckScript,
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
