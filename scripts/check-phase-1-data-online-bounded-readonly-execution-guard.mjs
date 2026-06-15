import fs from "node:fs";

const runnerPath = "scripts/run-phase-1-data-online-bounded-readonly-attempt-once.mjs";
const postRunPath = "scripts/report-phase-1-data-online-bounded-readonly-post-run-review.mjs";
const packagePath = "package.json";
const problems = [];

const runner = readText(runnerPath);
const postRun = readText(postRunPath);
const packageJson = parseJson(readText(packagePath), packagePath);

for (const token of [
  "await import(\"@supabase/supabase-js\")",
  "createClient(",
  "persistSession: false",
  ".from(\"daily_prices\")",
  "head: true",
  "count: \"exact\"",
  "phase_1_data_online_bounded_readonly_completed_aggregate_probe",
  "phase_1_data_online_bounded_readonly_blocked_aggregate_probe",
  "attempt_summary_already_exists",
  "remoteAttempted: true",
  "supabaseReadsEnabled: remoteProbe.remoteAttempted",
  "rowPayloadsPrinted: false",
  "secretsPrinted: false"
]) {
  if (!runner.includes(token)) problems.push(`${runnerPath} missing ${token}`);
}

for (const token of [
  "phase_1_data_online_bounded_readonly_completed_aggregate_probe",
  "phase_1_data_online_bounded_readonly_post_run_review_accepted_aggregate_probe",
  "accepted_aggregate_readonly_probe_no_write",
  "supabaseReadAllowedByThisReview: false",
  "supabaseWriteAllowed: false",
  "dailyPricesMutationAllowed: false"
]) {
  if (!postRun.includes(token)) problems.push(`${postRunPath} missing ${token}`);
}

if (
  packageJson.scripts?.["check:phase-1-data-online-bounded-readonly-execution-guard"] !==
  "node scripts/check-phase-1-data-online-bounded-readonly-execution-guard.mjs"
) {
  problems.push("package.json missing check:phase-1-data-online-bounded-readonly-execution-guard");
}

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_data_online_bounded_readonly_execution_guard_ready"
        : "phase_1_data_online_bounded_readonly_execution_guard_blocked",
      remoteAttempted: false,
      executionOccurred: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      problems
    },
    null,
    2
  )
);
if (!ok) process.exit(1);

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}
