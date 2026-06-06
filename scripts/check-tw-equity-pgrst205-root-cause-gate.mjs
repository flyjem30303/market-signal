import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_PGRST205_ROOT_CAUSE_GATE.md";
const reportPath = "scripts/report-tw-equity-pgrst205-root-cause-gate.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity PGRST205 Root-Cause Gate",
  "tw_equity_pgrst205_root_cause_gate_canonical_objects_readable_no_write_retry",
  "CANONICAL_STAGING_OBJECTS_NOW_READABLE_RETRY_STILL_REQUIRES_SEPARATE_DECISION",
  "run_insert_failed_PGRST205",
  "object_not_available_or_schema_cache",
  "Execution count: `1`",
  "Exit code: `0`",
  "\"connectionAttempted\": true",
  "\"name\": \"staging_twse_stock_day_runs\"",
  "\"name\": \"staging_twse_stock_day_prices\"",
  "\"reachable\": \"ok\"",
  "\"mutations\": false",
  "\"publicDataSource\": \"mock\"",
  "\"scoreSource\": \"mock\"",
  "\"secretsPrinted\": false",
  "\"sqlExecuted\": false",
  "\"stagingRowsCreated\": false",
  "\"supabaseWriteRetried\": false",
  "No Supabase URL, service-role key, anon key, raw row payloads",
  "STOP-001 no write retry was executed",
  "no write retry is approved by this gate",
  "NEXT-SLICE-001 create a separate bounded staging write retry decision packet"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "CONFIRMATION_VALUE",
  "CEO_APPROVED_TW_EQUITY_PGRST205_READONLY_DIAGNOSTIC_ONCE",
  "TW_EQUITY_PGRST205_READONLY_CONFIRMATION",
  "staging_twse_stock_day_runs",
  "staging_twse_stock_day_prices",
  "twse_stock_day_staging",
  "readonlyHeadCount",
  ".select(object.expectedColumns, { count: \"exact\", head: true })",
  "supabaseWriteRetried: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "secretsPrinted: false",
  "sqlExecuted: false",
  "filesWrittenByReport: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const forbiddenPattern of [
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /\.rpc\(/u,
  /\bfetch\s*\(/u,
  /sb_secret_/u,
  /sb_publishable_/u
]) {
  if (forbiddenPattern.test(reportSource)) problems.push(`${reportPath} contains forbidden token: ${forbiddenPattern}`);
}

for (const phrase of [
  "Latest TW equity PGRST205 root-cause gate slice",
  "docs/TW_EQUITY_PGRST205_ROOT_CAUSE_GATE.md",
  "scripts/report-tw-equity-pgrst205-root-cause-gate.mjs",
  "scripts/check-tw-equity-pgrst205-root-cause-gate.mjs",
  "tw_equity_pgrst205_root_cause_gate_canonical_objects_readable_no_write_retry",
  "canonical staging objects are now readable through bounded read-only diagnostics",
  "No write retry, SQL, successful Supabase write, staging row, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:tw-equity-pgrst205-root-cause-gate"] !== `node ${reportPath}`) {
  problems.push("package.json missing report:tw-equity-pgrst205-root-cause-gate");
}
if (pkg.scripts?.["check:tw-equity-pgrst205-root-cause-gate"] !== "node scripts/check-tw-equity-pgrst205-root-cause-gate.mjs") {
  problems.push("package.json missing check:tw-equity-pgrst205-root-cause-gate");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-pgrst205-root-cause-gate.mjs")) {
    problems.push(`${pathName} missing TW equity PGRST205 root-cause checker`);
  }
  if (!text.includes("tw-equity-pgrst205-root-cause-gate")) {
    problems.push(`${pathName} missing tw-equity-pgrst205-root-cause-gate name`);
  }
}

if (!reviewGate.includes('"tw-equity-pgrst205-root-cause-gate"')) {
  problems.push("review gate core set missing tw-equity-pgrst205-root-cause-gate");
}

const defaultReport = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (defaultReport.status !== 0) {
  problems.push(`${reportPath} must exit 0 without confirmation`);
} else {
  const report = parseJson(defaultReport.stdout);
  if (report.status !== "tw_equity_pgrst205_root_cause_gate_not_run_confirmation_required") {
    problems.push(`${reportPath} must default to confirmation-required not-run status`);
  }
  if (report.connectionAttempted !== false) problems.push(`${reportPath} default run must not connect`);
  if (report.safety?.mutations !== false) problems.push(`${reportPath} default safety mutations must be false`);
  if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
    problems.push(`${reportPath} default safety must remain mock`);
  }
}

for (const [pathName, text] of [
  [docPath, doc],
  [reportPath, reportSource]
]) {
  if (/sb_secret_/u.test(text) || /sb_publishable_/u.test(text)) {
    problems.push(`${pathName} must not contain literal Supabase key material`);
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push("report output is not valid JSON");
    return {};
  }
}
