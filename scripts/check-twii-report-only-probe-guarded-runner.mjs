import { spawnSync } from "node:child_process";
import fs from "node:fs";

const runnerPath = "scripts/run-twii-report-only-probe-once.mjs";
const acceptancePath = "docs/reviews/TWII_REPORT_ONLY_PROBE_ACCEPTANCE_GATE_2026-06-01.md";
const commandMapPath = "docs/reviews/TWII_REPORT_ONLY_PROBE_COMMAND_MAP_2026-06-01.md";
const postRunTemplatePath = "docs/reviews/TWII_REPORT_ONLY_PROBE_POST_RUN_REVIEW_TEMPLATE_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const runner = fs.readFileSync(runnerPath, "utf8");
const acceptance = fs.readFileSync(acceptancePath, "utf8");
const commandMap = fs.readFileSync(commandMapPath, "utf8");
const postRunTemplate = fs.readFileSync(postRunTemplatePath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "const REQUIRED_CONFIRMATION = \"CEO_APPROVED_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT\"",
  "process.env.TWII_REPORT_ONLY_PROBE_CONFIRMATION !== REQUIRED_CONFIRMATION",
  "failureClass: \"missing_execution_confirmation\"",
  "remoteAttempted: false",
  "NEXT_PUBLIC_DATA_SOURCE !== \"mock\"",
  "const SOURCE_ID = \"official-exchange-index\"",
  "const TARGET_SYMBOL = \"TWII\"",
  "https://www.twse.com.tw/rwd/zh/TAIEX/MI_5MINS_HIST",
  "const PROBE_DATE = \"20260501\"",
  "async function runProbe()",
  "function summarizeRows",
  "function classifyResult",
  "function printSanitized",
  "process.exitCode = result.status === \"ready_for_review\" ? 0 : 1",
  "process.exitCode = 1",
  "await settleBeforeExit()",
  "function settleBeforeExit()",
  "rowPayloadsPrinted: false",
  "stockIdPayloadsPrinted: false",
  "secretsPrinted: false",
  "sqlExecuted: false",
  "writesAttempted: false",
  "marketDataFilesWritten: false",
  "rowCoverageCreditAwarded: false",
  "scoreSourceRealEnabled: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!runner.includes(phrase)) {
    missing.push(`${runnerPath}: ${phrase}`);
  }
}

for (const phrase of [
  "ACCEPT_TWII_REPORT_ONLY_PROBE_DECISION_PACKET_FOR_IMPLEMENTATION_PREPARATION_ONLY",
  "execution_state: not_executed"
]) {
  if (!acceptance.includes(phrase)) {
    missing.push(`${acceptancePath}: ${phrase}`);
  }
}

for (const phrase of [
  "TWII_REPORT_ONLY_PROBE_RUNNER_READY_FOR_SEPARATE_ONE_ATTEMPT_EXECUTION_DECISION",
  "runner: scripts/run-twii-report-only-probe-once.mjs",
  "confirmation_token: CEO_APPROVED_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT"
]) {
  if (!commandMap.includes(phrase)) {
    missing.push(`${commandMapPath}: ${phrase}`);
  }
}

for (const phrase of [
  "POST_RUN_REVIEW_TEMPLATE_READY_BEFORE_TWII_REPORT_ONLY_PROBE_EXECUTION",
  "status: pending_run",
  "rowPayloadsPrinted: false"
]) {
  if (!postRunTemplate.includes(phrase)) {
    missing.push(`${postRunTemplatePath}: ${phrase}`);
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
  /process\.exit\(/,
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
  if (failClosedJson.failureClass !== "missing_execution_confirmation") {
    blocked.push(`expected missing_execution_confirmation, got ${String(failClosedJson.failureClass)}`);
  }
  if (failClosedJson.remoteAttempted !== false) blocked.push("remoteAttempted must be false");
  if (failClosedJson.connectionAttempted !== false) blocked.push("connectionAttempted must be false");
  for (const flag of [
    "marketDataFilesWritten",
    "rowCoverageCreditAwarded",
    "rowPayloadsPrinted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "stockIdPayloadsPrinted",
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

if (packageJson.scripts?.["run:twii-report-only-probe"] !== "node scripts/run-twii-report-only-probe-once.mjs") {
  missing.push(`${packagePath}: run:twii-report-only-probe`);
}
if (
  packageJson.scripts?.["check:twii-report-only-probe-guarded-runner"] !==
  "node scripts/check-twii-report-only-probe-guarded-runner.mjs"
) {
  missing.push(`${packagePath}: check:twii-report-only-probe-guarded-runner`);
}
if (!reviewGate.includes("scripts/check-twii-report-only-probe-guarded-runner.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-report-only-probe-guarded-runner.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, failClosed: { exitCode: failClosed.status, output: failClosedJson }, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
