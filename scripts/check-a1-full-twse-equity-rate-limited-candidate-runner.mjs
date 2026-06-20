import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];
const runnerPath = "scripts/run-a1-full-twse-equity-rate-limited-candidate-generation-once.mjs";
const packagePath = "package.json";
const pkg = JSON.parse(read(packagePath));
const runnerSource = read(runnerPath);

if (
  pkg.scripts?.["run:a1-full-twse-equity-rate-limited-candidate-generation-once"] !==
  `node ${runnerPath}`
) {
  problems.push("package.json missing run:a1-full-twse-equity-rate-limited-candidate-generation-once");
}

if (
  pkg.scripts?.["check:a1-full-twse-equity-rate-limited-candidate-runner"] !==
  "node scripts/check-a1-full-twse-equity-rate-limited-candidate-runner.mjs"
) {
  problems.push("package.json missing check:a1-full-twse-equity-rate-limited-candidate-runner");
}

for (const required of [
  "A1_FULL_TWSE_EQUITY_CANDIDATE_GENERATION_CONFIRM",
  "A1_FULL_TWSE_EQUITY_CANDIDATE_GENERATION_2026_06_18",
  "preflight_blocked_missing_confirmation",
  "tmp/a1-full-twse-equity-candidates",
  "await fetch(",
  "requestDelayMs",
  "batchPauseMs",
  "stopIfHttp429CountAtLeast",
  "failureRateStopPercent",
  "sourcePayloadStored: false",
  "sourceUrlPayloadPrinted: false",
  "stockIdListPrinted: false",
  "supabaseConnectionAttempted: false",
  "dailyPricesMutation: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!runnerSource.includes(required)) problems.push(`${runnerPath} missing ${required}`);
}

for (const forbidden of [
  /@supabase\/supabase-js/u,
  /createClient\s*\(/u,
  /\.from\s*\(/u,
  /\.insert\s*\(/u,
  /\.upsert\s*\(/u,
  /SUPABASE_SERVICE_ROLE_KEY/u,
  /sb_secret_/u,
  /process\.env\.NEXT_PUBLIC_SUPABASE/u
]) {
  if (forbidden.test(runnerSource)) problems.push(`${runnerPath} contains forbidden boundary ${forbidden}`);
}

const result = spawnSync(process.execPath, [runnerPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (result.status !== 0) {
  problems.push(`${runnerPath} default run must exit 0 while blocked: ${(result.stderr || result.stdout).trim()}`);
} else {
  const output = JSON.parse(result.stdout);
  if (output.status !== "preflight_blocked_missing_confirmation") problems.push("default runner must be confirmation-blocked");
  if (output.remoteFetchAttempted !== false) problems.push("default runner must not fetch");
  if (output.filesWritten !== false) problems.push("default runner must not write files");
  if (output.sqlExecuted !== false) problems.push("default runner must not run SQL");
  if (output.supabaseConnectionAttempted !== false) problems.push("default runner must not connect Supabase");
  if (output.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (output.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  if (/\b(1101|1102|2330|2308|2382|2454|2317)\b/u.test(result.stdout)) {
    problems.push("default output must not include stock IDs");
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "a1_full_twse_equity_rate_limited_candidate_runner_check",
      verified: {
        defaultRunBlocked: true,
        authorizedRunnerExists: true,
        noSupabase: true,
        noSql: true,
        noDailyPricesMutation: true,
        noStockIdOutputByDefault: true
      }
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
