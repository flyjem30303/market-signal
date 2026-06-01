import { spawnSync } from "node:child_process";
import fs from "node:fs";

const runnerPath = "scripts/run-equity-report-only-runner-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const runner = fs.readFileSync(runnerPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "const REQUIRED_CONFIRMATION = \"CEO_APPROVED_EQUITY_REPORT_ONLY_RUNNER_EXECUTION\"",
  "process.env.EQUITY_REPORT_ONLY_RUNNER_CONFIRMATION !== REQUIRED_CONFIRMATION",
  "reason: \"missing_execution_confirmation\"",
  "remoteAttempted: false",
  "NEXT_PUBLIC_DATA_SOURCE !== \"mock\"",
  "data/source-gates/runner-approval-decision-outcomes.json",
  "report-only-runner-implementation-slice",
  "const ALLOWED_SYMBOLS = [\"2330\", \"2382\", \"2308\"]",
  "const SOURCE_ID = \"twse-stock-day\"",
  "https://www.twse.com.tw/exchangeReport/STOCK_DAY",
  "const START_MONTH = \"2023-03\"",
  "const END_MONTH = \"2026-05\"",
  "const EXPECTED_MONTHS = 39",
  "const MINIMUM_DELAY_MS = 800",
  "async function runReportOnly()",
  "async function fetchMonthSummary",
  "function validateSourceRows",
  "function summarizeSymbol",
  "function printSanitized",
  "rowPayloadsPrinted: false",
  "secretsPrinted: false",
  "sqlExecuted: false",
  "writesAttempted: false",
  "rowCoverageCreditAwarded: false",
  "scoreSourceRealEnabled: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!runner.includes(phrase)) {
    missing.push(`${runnerPath}: ${phrase}`);
  }
}

for (const pattern of [
  /@supabase\/supabase-js/,
  /createClient/,
  /\.from\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /\.upsert\(/,
  /\.rpc\(/,
  /\.storage\b/,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
  /NEXT_PUBLIC_SUPABASE_URL/,
  /writeFileSync/,
  /appendFileSync/,
  /insert\s+into/i,
  /delete\s+from/i,
  /update\s+[a-z_]+\s+set/i,
  /drop\s+table/i,
  /alter\s+table/i,
  /create\s+table/i,
  /console\.(log|error|warn)\([^)]*process\.env/i
]) {
  if (pattern.test(runner)) {
    blocked.push(`${runnerPath}: forbidden source pattern ${String(pattern)}`);
  }
}

const failClosed = spawnSync(process.execPath, [runnerPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: {
    PATH: process.env.PATH,
    SystemRoot: process.env.SystemRoot,
    TEMP: process.env.TEMP,
    TMP: process.env.TMP
  },
  shell: false
});

let failClosedJson = null;
try {
  failClosedJson = JSON.parse(failClosed.stdout);
} catch (error) {
  blocked.push(`fail-closed output is not JSON: ${error instanceof Error ? error.message : String(error)}`);
}

if (failClosed.status !== 1) {
  blocked.push(`expected fail-closed exit 1, got ${String(failClosed.status)}`);
}

if (failClosedJson) {
  if (failClosedJson.status !== "blocked") blocked.push(`expected status blocked, got ${String(failClosedJson.status)}`);
  if (failClosedJson.reason !== "missing_execution_confirmation") {
    blocked.push(`expected missing_execution_confirmation, got ${String(failClosedJson.reason)}`);
  }
  if (failClosedJson.remoteAttempted !== false) blocked.push("remoteAttempted must be false");
  for (const flag of [
    "rowCoverageCreditAwarded",
    "rowPayloadsPrinted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "writesAttempted"
  ]) {
    if (failClosedJson[flag] !== false) {
      blocked.push(`${flag} must be false in fail-closed output`);
    }
  }
  if (failClosedJson.publicDataSource !== "mock" || failClosedJson.scoreSource !== "mock") {
    blocked.push("fail-closed output must keep publicDataSource and scoreSource mock");
  }
  if (JSON.stringify(failClosedJson).includes("open_price") || JSON.stringify(failClosedJson).includes("close_price")) {
    blocked.push("fail-closed output must not include row payload fields");
  }
}

if (packageJson.scripts?.["run:equity-report-only-runner"] !== "node scripts/run-equity-report-only-runner-once.mjs") {
  missing.push(`${packagePath}: run:equity-report-only-runner`);
}
if (
  packageJson.scripts?.["check:equity-report-only-runner-implementation"] !==
  "node scripts/check-equity-report-only-runner-implementation.mjs"
) {
  missing.push(`${packagePath}: check:equity-report-only-runner-implementation`);
}
if (!reviewGate.includes("scripts/check-equity-report-only-runner-implementation.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-equity-report-only-runner-implementation.mjs`);
}
if (reviewGate.includes("scripts/run-equity-report-only-runner-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the equity report-only runner`);
}

console.log(
  JSON.stringify(
    {
      blocked,
      failClosed: {
        exitCode: failClosed.status,
        output: failClosedJson
      },
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
