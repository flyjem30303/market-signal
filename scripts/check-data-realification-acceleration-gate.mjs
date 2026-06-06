import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/DATA_REALIFICATION_ACCELERATION_GATE.md";
const reportPath = "scripts/report-data-realification-acceleration-gate.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
const reportScript = read(reportPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);
const report = runReport(reportPath);

for (const phrase of [
  "Data Realification Acceleration Gate",
  "data_realification_acceleration_gate_ready_for_named_authorization",
  "aggregate row coverage is incomplete",
  "prepare_backfill_ingestion_design_gate",
  "TW equity source review is waiting for a specific human source/legal classification",
  "Governance Compression Rule",
  "record a specific human source/legal classification",
  "run exactly one bounded readonly diagnostic with a changed purpose",
  "prepare one controlled source-specific report-only dry run",
  "prepare one staging-first write authorization packet",
  "Lane 1: Source classification",
  "Lane 2: Coverage diagnostics",
  "Lane 3: Backfill and ingestion route",
  "Lane 4: Public runtime disclosure",
  "CEO recommends PM move to Lane 3 next",
  "first staging-first TW equity coverage authorization packet",
  "TW_EQUITY_STAGING_FIRST_AUTHORIZATION_PACKET",
  "Do not execute the packet in the same slice",
  "run SQL",
  "connect to Supabase for a new remote attempt",
  "write Supabase",
  "create staging rows",
  "fetch market data",
  "promote public Supabase data-source mode",
  "set `scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

if (report.status !== "data_realification_acceleration_gate_ready_for_named_authorization") {
  problems.push(`${reportPath} reported unexpected status: ${report.status}`);
}

if (report.immediateNextSlice !== "TW_EQUITY_STAGING_FIRST_AUTHORIZATION_PACKET") {
  problems.push(`${reportPath} missing immediate next slice`);
}

if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
  problems.push(`${reportPath} must keep mock publicDataSource and scoreSource`);
}

for (const phrase of [
  "Latest data realification acceleration gate slice",
  "docs/DATA_REALIFICATION_ACCELERATION_GATE.md",
  "scripts/report-data-realification-acceleration-gate.mjs",
  "data_realification_acceleration_gate_ready_for_named_authorization",
  "CEO recommends PM move to Lane 3",
  "TW_EQUITY_STAGING_FIRST_AUTHORIZATION_PACKET"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:data-realification-acceleration-gate"] !== "node scripts/report-data-realification-acceleration-gate.mjs") {
  problems.push("package.json missing report:data-realification-acceleration-gate");
}

if (pkg.scripts?.["check:data-realification-acceleration-gate"] !== "node scripts/check-data-realification-acceleration-gate.mjs") {
  problems.push("package.json missing check:data-realification-acceleration-gate");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-data-realification-acceleration-gate.mjs")) {
    problems.push(`${path} missing data realification acceleration gate checker`);
  }
  if (!text.includes("data-realification-acceleration-gate")) {
    problems.push(`${path} missing data-realification-acceleration-gate name`);
  }
}

if (!reviewGate.includes('"data-realification-acceleration-gate"')) {
  problems.push("review gate core set missing data-realification-acceleration-gate");
}

const forbiddenPatterns = [
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /staging rows are approved/u,
  /daily_prices mutation is approved/u,
  /market-data fetch is approved/u,
  /market-data ingestion is approved/u,
  /publicDataSource=supabase approved/u,
  /scoreSource=real approved/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /ROW_COVERAGE_POINTS_AWARDED/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u,
  /raw payload sample/iu
];

for (const [path, text] of [
  [docPath, doc],
  [reportPath, reportScript]
]) {
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(text)) problems.push(`${path} contains forbidden token: ${pattern}`);
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}

function runReport(path) {
  const run = spawnSync(process.execPath, [path], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  if (run.status !== 0) {
    problems.push(`${path} failed: ${run.stderr.trim()}`);
    return {};
  }

  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${path} did not return JSON: ${error.message}`);
    return {};
  }
}
