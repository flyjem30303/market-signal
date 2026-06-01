import { spawnSync } from "node:child_process";
import fs from "node:fs";

const runnerPath = "scripts/run-row-coverage-readonly-once.mjs";
const packageJsonPath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const runner = fs.readFileSync(runnerPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const problems = [];

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
  problems.push(`fail-closed output is not JSON: ${error.message}`);
}

if (failClosed.status !== 1) problems.push(`expected fail-closed exit 1, got ${failClosed.status}`);
if (failClosedJson) {
  if (failClosedJson.status !== "blocked") problems.push(`expected blocked status, got ${failClosedJson.status}`);
  if (failClosedJson.reason !== "missing_confirmation") {
    problems.push(`expected missing_confirmation reason, got ${failClosedJson.reason}`);
  }
  if (failClosedJson.remoteAttempted !== false) problems.push("remoteAttempted must be false");
  for (const flag of [
    "canAwardRowCoveragePoints",
    "canClaimCoverage",
    "canSetScoreSourceReal",
    "connectionAttempted",
    "filesWritten",
    "mutations",
    "rowPayloadsPrinted",
    "secretsPrinted",
    "sqlExecuted"
  ]) {
    if (failClosedJson[flag] !== false) problems.push(`${flag} must be false in fail-closed output`);
  }
}

const requiredPhrases = [
  "import { createClient } from \"@supabase/supabase-js\"",
  "const REQUIRED_CONFIRMATION = \"CP3_ROW_COVERAGE_READONLY_VALIDATE\"",
  "const ALLOWED_SYMBOLS = [\"TWII\", \"0050\", \"006208\", \"2330\", \"2382\", \"2308\"]",
  "const DOTENV_LOCAL_ALLOWED_KEYS = [",
  "\"NEXT_PUBLIC_SUPABASE_URL\"",
  "\"NEXT_PUBLIC_SUPABASE_ANON_KEY\"",
  "\"SUPABASE_SERVICE_ROLE_KEY\"",
  "\"NEXT_PUBLIC_DATA_SOURCE\"",
  "const EXPECTED_SYMBOL_COUNT = 6",
  "const REQUIRED_TRADING_SESSIONS = 60",
  "const EXPECTED_TOTAL_ROWS = EXPECTED_SYMBOL_COUNT * REQUIRED_TRADING_SESSIONS",
  "process.env.ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION !== REQUIRED_CONFIRMATION",
  "loadProcessEnvFromDotEnvLocal();",
  "function loadProcessEnvFromDotEnvLocal()",
  "path.join(root, \".env.local\")",
  "fs.existsSync(envPath)",
  "fs.readFileSync(envPath, \"utf8\")",
  "if (!process.env[key] && parsed[key])",
  "process.env[key] = parsed[key]",
  "function parseDotEnv(text)",
  "function normalizeDotEnvValue(value)",
  "reason: \"missing_confirmation\"",
  "remoteAttempted: false",
  "loadTsModule(\"src/lib/row-coverage-readonly-local-preflight.ts\")",
  "getRowCoverageReadonlyLocalPreflight(process.env)",
  "reason: \"preflight_blocked\"",
  "const remoteResult = await validateRemoteRowCoverage(preflight)",
  "async function validateRemoteRowCoverage(preflight)",
  "createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY",
  "persistSession: false",
  ".from(\"stocks\")",
  ".select(\"id, symbol\")",
  ".in(\"symbol\", ALLOWED_SYMBOLS)",
  "const stockIdBySymbol = new Map()",
  "stockIdBySymbol.set(stock.symbol, stock.id)",
  "stock_mapping_unavailable",
  "stock_mapping_missing",
  ".from(\"daily_prices\")",
  ".select(\"stock_id\", { count: \"exact\", head: true })",
  ".eq(\"stock_id\", stockId)",
  "mode: \"row_coverage_readonly_remote_validation\"",
  "calendarStatus: \"not_run\"",
  "symbolsChecked: counts.map((item) => ({",
  "remoteAttempted: true",
  "printSanitized({",
  "canAwardRowCoveragePoints: false",
  "canClaimCoverage: false",
  "canSetScoreSourceReal: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "sqlExecuted: false",
  "mutations: false",
  "secretsPrinted: false",
  "rowPayloadsPrinted: false",
  "filesWritten: false"
];
const forbiddenPatterns = [
  /fetch\s*\(/i,
  /\.insert\s*\(/i,
  /\.update\s*\(/i,
  /\.delete\s*\(/i,
  /\.upsert\s*\(/i,
  /\.rpc\s*\(/i,
  /\.storage\b/i,
  /insert\s+into/i,
  /delete\s+from/i,
  /update\s+public\./i,
  /truncate/i,
  /drop\s+table/i,
  /alter\s+table/i,
  /create\s+table/i,
  /console\.(log|error|warn)\([^)]*process\.env/i,
  /writeFileSync/i,
  /appendFileSync/i,
  /slice\s*\(\s*0\s*,\s*\d+\s*\)/i,
  /\.length\b.*(KEY|TOKEN|SECRET|SUPABASE)/i
];

for (const phrase of requiredPhrases) {
  if (!runner.includes(phrase)) problems.push(`missing:${phrase}`);
}
for (const pattern of forbiddenPatterns) {
  if (pattern.test(runner)) problems.push(`forbidden:${pattern}`);
}

const supabaseImportCount = (runner.match(/@supabase\/supabase-js/g) ?? []).length;
const createClientCount = (runner.match(/\bcreateClient\b/g) ?? []).length;
const targetRelationCount = (runner.match(/"daily_prices"/g) ?? []).length;
if (supabaseImportCount !== 1) problems.push(`expected one approved Supabase import, got ${supabaseImportCount}`);
if (createClientCount !== 2) problems.push(`expected createClient import and call only, got ${createClientCount}`);
if (!runner.includes("persistSession: false")) problems.push("Supabase client must disable persistSession");
if (targetRelationCount !== 1) problems.push(`expected one daily_prices target relation, got ${targetRelationCount}`);
if (!runner.includes("head: true")) problems.push("row coverage query must remain head-only");
if (runner.includes(".select(\"symbol\", { count: \"exact\", head: true })")) {
  problems.push("runner must not count daily_prices by symbol");
}
if (runner.includes(".eq(\"symbol\", symbol)")) {
  problems.push("runner must not filter daily_prices by symbol");
}
if (!runner.includes(".eq(\"stock_id\", stockId)")) {
  problems.push("runner must count daily_prices by stock_id");
}
if (runner.includes("runner_skeleton_no_remote_execution")) {
  problems.push("runner skeleton reason must be removed after remote-capable implementation");
}

const packageRunScript = packageJson.scripts?.["run:row-coverage-readonly"];
const packageCheckScript = packageJson.scripts?.["check:row-coverage-readonly-guarded-runner"];
if (packageRunScript !== "node scripts/run-row-coverage-readonly-once.mjs") {
  problems.push(`run script mismatch: ${packageRunScript ?? "missing"}`);
}
if (packageCheckScript !== "node scripts/check-row-coverage-readonly-guarded-runner.mjs") {
  problems.push(`check script mismatch: ${packageCheckScript ?? "missing"}`);
}
if (!reviewGate.includes("scripts/check-row-coverage-readonly-guarded-runner.mjs")) {
  problems.push("review gate does not include row coverage readonly guarded runner checker");
}
if (reviewGate.includes("scripts/run-row-coverage-readonly-once.mjs")) {
  problems.push("review gate must not execute the guarded runner");
}

console.log(
  JSON.stringify(
    {
      failClosed: {
        exitCode: failClosed.status,
        output: failClosedJson
      },
      problems,
      status: problems.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (problems.length > 0) {
  process.exit(1);
}
