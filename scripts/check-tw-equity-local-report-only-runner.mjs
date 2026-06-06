import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const scriptPath = "scripts/report-tw-equity-local-report-only-dry-run.mjs";
const gatePath = "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_IMPLEMENTATION_GATE.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const script = read(scriptPath);
const gate = read(gatePath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

const requiredScriptPhrases = [
  "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_IMPLEMENTATION_GATE.md",
  "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_DESIGN.md",
  "docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md",
  "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md",
  "tw_equity_local_report_only_runner_implementation_gate_ready_not_executed",
  "tw_equity_local_report_only_runner_design_ready_not_executable",
  "not source approved",
  "external provider terms pending",
  "laneId: \"tw-equity\"",
  "symbols: [\"2330\", \"2382\", \"2308\"]",
  "expectedTradingSessions: 60",
  "expectedRows: 180",
  "latestObservedRows: 3",
  "latestMissingRows: 177",
  "sourceRightsStatus: \"not_source_approved\"",
  "providerTermsStatus: \"external_provider_terms_pending\"",
  "redistributionStatus: \"not_approved\"",
  "retentionStatus: \"not_approved\"",
  "targetTablePosture: \"staging_first\"",
  "productionDailyPricesBlocked: true",
  "filesWritten: false",
  "mutations: false",
  "sqlExecuted: false",
  "supabaseConnectionAttempted: false",
  "supabaseWrites: false",
  "marketFetchAttempted: false",
  "marketIngestionAttempted: false",
  "secretsPrinted: false",
  "sourcePayloadsPrinted: false",
  "sourceDerivedRowsStored: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
];

for (const phrase of requiredScriptPhrases) {
  if (!script.includes(phrase)) problems.push(`${scriptPath} missing: ${phrase}`);
}

for (const phrase of [
  "TW Equity Local Report-Only Runner Implementation Gate",
  "scripts/report-tw-equity-local-report-only-dry-run.mjs",
  "no-network",
  "no-Supabase",
  "no-SQL",
  "no-file-write except stdout"
]) {
  if (!gate.includes(phrase)) problems.push(`${gatePath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity local report-only runner implementation slice",
  "scripts/report-tw-equity-local-report-only-dry-run.mjs",
  "scripts/check-tw-equity-local-report-only-runner.mjs",
  "blocked_until_source_approval",
  "local_packet_consistency_only"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:tw-equity-local-report-only-dry-run"] !== "node scripts/report-tw-equity-local-report-only-dry-run.mjs") {
  problems.push("package.json missing report:tw-equity-local-report-only-dry-run script");
}

if (pkg.scripts?.["check:tw-equity-local-report-only-runner"] !== "node scripts/check-tw-equity-local-report-only-runner.mjs") {
  problems.push("package.json missing check:tw-equity-local-report-only-runner script");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-local-report-only-runner.mjs")) {
    problems.push(`${path} missing tw equity local report-only runner checker`);
  }
  if (!text.includes("tw-equity-local-report-only-runner")) {
    problems.push(`${path} missing tw-equity-local-report-only-runner name`);
  }
}

if (!reviewGate.includes('"tw-equity-local-report-only-runner"')) {
  problems.push("review gate core set missing tw-equity-local-report-only-runner");
}

const forbiddenScriptPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env/u,
  /\bfetch\s*\(/u,
  /\bwriteFile/u,
  /\bappendFile/u,
  /\bmkdir/u,
  /\brm\s*\(/u,
  /\bunlink/u,
  /\bcreateWriteStream/u,
  /SUPABASE_SERVICE_ROLE_KEY/u,
  /sb_secret_/u,
  /sb_publishable_/u
];

for (const pattern of forbiddenScriptPatterns) {
  if (pattern.test(script)) problems.push(`${scriptPath} contains forbidden token: ${pattern}`);
}

const result = spawnSync(process.execPath, [scriptPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (result.status !== 0) {
  problems.push(`${scriptPath} exited with ${result.status}: ${(result.stderr || result.stdout).trim()}`);
} else {
  try {
    const parsed = JSON.parse(result.stdout);
    validateReport(parsed);
  } catch (error) {
    problems.push(`${scriptPath} did not print valid JSON: ${error.message}`);
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function validateReport(report) {
  const expected = {
    status: "blocked_until_source_approval",
    laneId: "tw-equity",
    expectedTradingSessions: 60,
    expectedRows: 180,
    latestObservedRows: 3,
    latestMissingRows: 177,
    sourceRightsStatus: "not_source_approved",
    providerTermsStatus: "external_provider_terms_pending",
    redistributionStatus: "not_approved",
    retentionStatus: "not_approved",
    targetTablePosture: "staging_first",
    productionDailyPricesBlocked: true,
    validationStatus: "local_packet_consistency_only",
    filesWritten: false,
    mutations: false,
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseWrites: false,
    marketFetchAttempted: false,
    marketIngestionAttempted: false,
    secretsPrinted: false,
    sourcePayloadsPrinted: false,
    sourceDerivedRowsStored: false,
    publicDataSource: "mock",
    scoreSource: "mock"
  };

  for (const [key, value] of Object.entries(expected)) {
    if (report[key] !== value) problems.push(`report ${key} expected ${JSON.stringify(value)} but got ${JSON.stringify(report[key])}`);
  }

  if (JSON.stringify(report.symbols) !== JSON.stringify(["2330", "2382", "2308"])) {
    problems.push(`report symbols mismatch: ${JSON.stringify(report.symbols)}`);
  }

  if (!Array.isArray(report.problems) || report.problems.length !== 0) {
    problems.push(`report problems must be empty array: ${JSON.stringify(report.problems)}`);
  }
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}
