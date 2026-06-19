import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];
const reportPath = "scripts/report-a1-rate-limited-candidate-generation-plan.mjs";
const packagePath = "package.json";
const evidencePath = "data/evidence-intake/a1-bounded-source-depth-pilot-result-20260618.json";
const reportSource = read(reportPath);
const packageJson = JSON.parse(read(packagePath));
const evidence = JSON.parse(read(evidencePath));

if (packageJson.scripts?.["report:a1-rate-limited-candidate-generation-plan"] !== `node ${reportPath}`) {
  problems.push("package.json missing report:a1-rate-limited-candidate-generation-plan");
}

if (packageJson.scripts?.["check:a1-rate-limited-candidate-generation-plan"] !== "node scripts/check-a1-rate-limited-candidate-generation-plan.mjs") {
  problems.push("package.json missing check:a1-rate-limited-candidate-generation-plan");
}

if (evidence.summary?.pilotStatus !== "source_route_plausible") {
  problems.push(`${evidencePath} must record source_route_plausible before candidate planning`);
}

for (const required of [
  "DEFAULT_MONTHS = 3",
  "DEFAULT_BATCH_SIZE = 50",
  "DEFAULT_REQUEST_DELAY_MS = 900",
  "DEFAULT_BATCH_PAUSE_MS = 30000",
  "stockIdsPrinted: false",
  "rowPayloadsPrinted: false",
  "rawPayloadsPrinted: false",
  "marketFetchAttempted: false",
  "supabaseConnectionAttempted: false",
  "supabaseWrite: false",
  "dailyPricesMutation: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!reportSource.includes(required)) problems.push(`${reportPath} missing ${required}`);
}

for (const forbidden of [
  /\bfetch\s*\(/u,
  /@supabase\/supabase-js/u,
  /createClient\s*\(/u,
  /\.from\s*\(/u,
  /\.insert\s*\(/u,
  /\.upsert\s*\(/u,
  /fs\.writeFile/u,
  /SUPABASE_SERVICE_ROLE_KEY/u,
  /sb_secret_/u
]) {
  if (forbidden.test(reportSource)) problems.push(`${reportPath} contains forbidden executable boundary ${forbidden}`);
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
  if (output.mode !== "a1_rate_limited_candidate_generation_plan") problems.push("unexpected report mode");
  if (output.sourceEvidence?.universeCount !== 1083) problems.push("universeCount must be 1083");
  if (output.candidatePlan?.requestedMonths !== 3) problems.push("requestedMonths must be 3");
  if (output.candidatePlan?.requestCount !== 3249) problems.push("requestCount must be 3249");
  if (output.candidatePlan?.estimatedTradingSessionRows !== 71478) problems.push("estimatedTradingSessionRows must be 71478");
  if (output.candidatePlan?.batchCount !== 22) problems.push("batchCount must be 22");
  if (output.candidatePlan?.estimatedWallClockMinutes > 70) problems.push("estimatedWallClockMinutes should stay under 70 for the first plan");
  if (output.outputContract?.sourcePayloadIncluded !== false) problems.push("source payload must stay excluded");
  if (output.outputContract?.stockIdListPrinted !== false) problems.push("stock ID list must not print");
  if (output.runtimeBoundary?.marketFetchAttempted !== false) problems.push("plan must not fetch market data");
  if (output.runtimeBoundary?.supabaseConnectionAttempted !== false) problems.push("plan must not connect Supabase");
  if (output.runtimeBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (output.runtimeBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  if (/\b(1101|1102|2330|2308|2382|2454|2317)\b/u.test(result.stdout)) problems.push("plan output must not include stock IDs");
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "a1_rate_limited_candidate_generation_plan_check",
      verified: {
        universeCount: 1083,
        requestCount: 3249,
        estimatedTradingSessionRows: 71478,
        batchCount: 22,
        noFetch: true,
        noSupabase: true,
        noSql: true,
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
