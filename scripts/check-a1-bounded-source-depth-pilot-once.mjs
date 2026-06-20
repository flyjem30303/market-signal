import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];
const reportPath = "scripts/report-a1-bounded-source-depth-pilot-once.mjs";
const packagePath = "package.json";
const reportSource = read(reportPath);
const packageJson = JSON.parse(read(packagePath));

if (packageJson.scripts?.["report:a1-bounded-source-depth-pilot-once"] !== `node ${reportPath}`) {
  problems.push("package.json missing report:a1-bounded-source-depth-pilot-once");
}

if (packageJson.scripts?.["check:a1-bounded-source-depth-pilot-once"] !== "node scripts/check-a1-bounded-source-depth-pilot-once.mjs") {
  problems.push("package.json missing check:a1-bounded-source-depth-pilot-once");
}

for (const required of [
  "SAMPLE_SIZE = 2",
  "TARGET_MONTH = \"2024-05\"",
  "REQUEST_DELAY_MS = 900",
  "sampleSymbolsPrinted: false",
  "rawPayloadStored: false",
  "rowPayloadStored: false",
  "stockIdPayloadIncluded: false",
  "rowPayloadIncluded: false",
  "rawPayloadIncluded: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!reportSource.includes(required)) problems.push(`${reportPath} missing ${required}`);
}

for (const forbidden of [
  /@supabase\/supabase-js/u,
  /createClient\s*\(/u,
  /\.from\s*\(/u,
  /\.insert\s*\(/u,
  /\.upsert\s*\(/u,
  /fs\.writeFile/u,
  /SUPABASE_SERVICE_ROLE_KEY/u,
  /sb_secret_/u,
  /console\.log\(text/u
]) {
  if (forbidden.test(reportSource)) problems.push(`${reportPath} contains forbidden pattern ${forbidden}`);
}

const result = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (result.status !== 0) {
  problems.push(`${reportPath} failed: ${(result.stderr || result.stdout).trim()}`);
} else {
  const output = JSON.parse(result.stdout);
  if (output.status !== "ok") problems.push("report status must be ok");
  if (output.mode !== "a1_bounded_source_depth_pilot_once") problems.push("unexpected mode");
  if (output.authorization?.sampleSize !== 2) problems.push("sample size must be 2");
  if (output.source?.targetMonth !== "2024-05") problems.push("target month must stay fixed for this bounded attempt");
  if (output.source?.sampleSymbolsPrinted !== false) problems.push("sample symbols must not be printed");
  if (output.source?.rawPayloadStored !== false) problems.push("raw payload must not be stored");
  if (output.source?.rowPayloadStored !== false) problems.push("row payload must not be stored");
  if (output.summary?.sampleCount !== 2) problems.push("summary sampleCount must be 2");
  if (output.runtimeBoundary?.marketFetchAttempted !== true) problems.push("this check should record the bounded market fetch attempt");
  if (output.runtimeBoundary?.sqlExecuted !== false) problems.push("SQL must not execute");
  if (output.runtimeBoundary?.supabaseConnectionAttempted !== false) problems.push("Supabase must not connect");
  if (output.runtimeBoundary?.supabaseWrite !== false) problems.push("Supabase must not write");
  if (output.runtimeBoundary?.stagingRowsCreated !== false) problems.push("staging rows must not be created");
  if (output.runtimeBoundary?.dailyPricesMutation !== false) problems.push("daily_prices must not mutate");
  if (output.runtimeBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (output.runtimeBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  if (/\b(1101|1102|2330|2308|2382|2454|2317)\b/u.test(result.stdout)) problems.push("output must not include stock IDs");
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "a1_bounded_source_depth_pilot_once_check",
      verified: {
        boundedSampleSize: 2,
        targetMonth: "2024-05",
        noSupabase: true,
        noSql: true,
        noWrites: true,
        noRawPayloadOutput: true,
        noStockIdOutput: true,
        publicDataSource: "mock",
        scoreSource: "mock"
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
