import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];
const runnerPath = "scripts/run-a1-full-twse-equity-candidate-cleanup-once.mjs";
const pkg = JSON.parse(read("package.json"));
const runnerSource = read(runnerPath);

if (pkg.scripts?.["run:a1-full-twse-equity-candidate-cleanup-once"] !== `node ${runnerPath}`) {
  problems.push("package.json missing run:a1-full-twse-equity-candidate-cleanup-once");
}

if (pkg.scripts?.["check:a1-full-twse-equity-candidate-cleanup"] !== "node scripts/check-a1-full-twse-equity-candidate-cleanup.mjs") {
  problems.push("package.json missing check:a1-full-twse-equity-candidate-cleanup");
}

for (const required of [
  "duplicateSymbolDateRowsRemoved",
  "candidate_artifact_cleaned_no_staging_write",
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
  /\bfetch\s*\(/u,
  /@supabase\/supabase-js/u,
  /createClient\s*\(/u,
  /\.from\s*\(/u,
  /\.insert\s*\(/u,
  /\.upsert\s*\(/u,
  /SUPABASE_SERVICE_ROLE_KEY/u,
  /sb_secret_/u
]) {
  if (forbidden.test(runnerSource)) problems.push(`${runnerPath} contains forbidden boundary ${forbidden}`);
}

const result = spawnSync(process.execPath, [runnerPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (result.status !== 0) {
  problems.push(`${runnerPath} failed: ${(result.stderr || result.stdout).trim()}`);
} else {
  const output = JSON.parse(result.stdout);
  if (output.status !== "a1_full_twse_equity_candidate_artifact_cleaned") problems.push("cleanup status mismatch");
  if (output.duplicateSymbolDateRowsRemoved < 0) problems.push("duplicateSymbolDateRowsRemoved must be non-negative");
  if (output.rowsAfterCleanup > output.rowsBeforeCleanup) problems.push("cleanup must not increase rows");
  if (output.supabaseConnectionAttempted !== false) problems.push("cleanup must not connect Supabase");
  if (output.dailyPricesMutation !== false) problems.push("cleanup must not mutate daily_prices");
  if (output.stockIdListPrinted !== false) problems.push("cleanup must not print stock ID lists");
  if (output.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (output.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  if (/\b(1101|1102|2330|2308|2382|2454|2317)\b/u.test(result.stdout)) {
    problems.push("cleanup output must not include stock IDs");
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
      mode: "a1_full_twse_equity_candidate_cleanup_check",
      verified: {
        cleanupRunnerExists: true,
        noFetch: true,
        noSupabase: true,
        noSql: true,
        noDailyPricesMutation: true,
        noStockIdOutput: true
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
