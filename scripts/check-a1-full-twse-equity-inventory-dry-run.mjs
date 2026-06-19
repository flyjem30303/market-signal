import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];
const reportPath = "scripts/report-a1-full-twse-equity-inventory-dry-run.mjs";
const packagePath = "package.json";
const planPath = "docs/A1_FULL_TWSE_EQUITY_HISTORICAL_COVERAGE_SAFE_IMPLEMENTATION_PLAN.md";

const reportSource = read(reportPath);
const packageJson = JSON.parse(read(packagePath));
const plan = read(planPath);

if (packageJson.scripts?.["report:a1-full-twse-equity-inventory-dry-run"] !== `node ${reportPath}`) {
  problems.push("package.json missing report:a1-full-twse-equity-inventory-dry-run");
}

if (packageJson.scripts?.["check:a1-full-twse-equity-inventory-dry-run"] !== "node scripts/check-a1-full-twse-equity-inventory-dry-run.mjs") {
  problems.push("package.json missing check:a1-full-twse-equity-inventory-dry-run");
}

for (const phrase of [
  "Phase A: Full-Universe Inventory Dry Run",
  "cmd.exe /c npm run report:a1-full-twse-equity-inventory-dry-run",
  "cmd.exe /c npm run check:a1-full-twse-equity-inventory-dry-run"
]) {
  if (!plan.includes(phrase)) problems.push(`${planPath} missing ${phrase}`);
}

for (const forbidden of [
  /\bfetch\s*\(/u,
  /@supabase\/supabase-js/u,
  /createClient\s*\(/u,
  /\.from\s*\(/u,
  /\.insert\s*\(/u,
  /\.upsert\s*\(/u,
  /SUPABASE_SERVICE_ROLE_KEY/u,
  /sb_secret_/u,
  /sb_publishable_/u
]) {
  if (forbidden.test(reportSource)) problems.push(`${reportPath} contains forbidden executable boundary: ${forbidden}`);
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
  if (output.mode !== "a1_full_twse_equity_inventory_dry_run") problems.push("unexpected report mode");
  if (output.inventory?.activeListedStockCount !== 1083) problems.push("active listed stock count should be 1083 from local seed");
  if (output.inventory?.requestedMonths !== 3) problems.push("default requestedMonths should be 3");
  if (output.inventory?.theoreticalRequestCount !== 3249) problems.push("theoretical request count should be 3249");
  if (output.inventory?.estimatedTradingSessionRows !== 71478) problems.push("estimated trading session rows should be 71478");
  if (output.inventory?.batchCount !== 22) problems.push("batch count should be 22 for batch size 50");
  if (output.sourceEvidence?.stockIdsPrinted !== false) problems.push("stock IDs must not be printed");
  if (output.sourceEvidence?.rowPayloadsPrinted !== false) problems.push("row payloads must not be printed");
  if (output.runtimeBoundary?.marketFetchAttempted !== false) problems.push("market fetch boundary opened");
  if (output.runtimeBoundary?.supabaseConnectionAttempted !== false) problems.push("Supabase connection boundary opened");
  if (output.runtimeBoundary?.supabaseWrite !== false) problems.push("Supabase write boundary opened");
  if (output.runtimeBoundary?.dailyPricesMutation !== false) problems.push("daily_prices mutation boundary opened");
  if (output.runtimeBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (output.runtimeBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  if (/\b(2330|2308|2382|2454|2317)\b/u.test(result.stdout)) problems.push("report output must not include stock IDs");
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "a1_full_twse_equity_inventory_dry_run_check",
      verified: {
        localSeedInventory: 1083,
        defaultMonths: 3,
        theoreticalRequestCount: 3249,
        estimatedTradingSessionRows: 71478,
        batchCount: 22,
        noFetch: true,
        noSupabase: true,
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
