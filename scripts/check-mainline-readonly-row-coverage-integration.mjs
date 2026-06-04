import fs from "node:fs";
import { spawnSync } from "node:child_process";

const reportPath = "scripts/report-mainline-readonly-row-coverage-integration.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const source = fs.readFileSync(reportPath, "utf8");
const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const problems = [];

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (run.status !== 0) {
  problems.push(`${reportPath} exited ${String(run.status)} ${run.stderr.trim()}`);
}

let report;
try {
  report = JSON.parse(run.stdout);
} catch (error) {
  problems.push(`${reportPath} did not emit JSON: ${error instanceof Error ? error.message : String(error)}`);
}

if (report) {
  if (report.mode !== "mainline_readonly_row_coverage_integration") problems.push("unexpected mode");
  if (report.status !== "local_ready_remote_still_separate") problems.push(`unexpected status ${report.status}`);

  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "ingestionStarted",
    "marketDataFetched",
    "rowPayloadsPrinted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseWritesEnabled"
  ]) {
    if (report.safety?.[flag] !== false) problems.push(`safety.${flag} must be false`);
  }

  if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
    problems.push("safety must keep publicDataSource and scoreSource mock");
  }

  if (report.nextAttemptContract?.requiresSeparateNamedAction !== true) {
    problems.push("next attempt must require a separately named action");
  }
  if (report.nextAttemptContract?.maxAttempts !== 1) problems.push("maxAttempts must be 1");
  if (report.nextAttemptContract?.sanitizedAggregateOutputOnly !== true) {
    problems.push("next attempt must allow sanitized aggregate output only");
  }
  if (report.nextAttemptContract?.immediatePostRunReviewRequired !== true) {
    problems.push("post-run review must be immediate");
  }
  if (report.nextAttemptContract?.noRuntimePromotionFromAttemptAlone !== true) {
    problems.push("attempt alone must not promote runtime state");
  }
  if (report.nextAttemptContract?.noRetryInSameSlice !== true) problems.push("same-slice retry must be blocked");

  const readyIds = new Set((report.ready ?? []).map((item) => item.id));
  for (const id of [
    "bounded-readonly-readiness-recheck",
    "mainline-readonly-packet-bridge",
    "row-coverage-readonly-preexecution-packet",
    "bounded-row-coverage-readonly-attempt-decision"
  ]) {
    if (!readyIds.has(id)) problems.push(`missing ready item ${id}`);
  }

  for (const phrase of [
    "Continue runtime engineering unless CEO explicitly names exactly one bounded Supabase readonly row coverage attempt.",
    "ready to present, not execute",
    "SQL execution",
    "Supabase writes",
    "staging row writes",
    "daily_prices writes",
    "raw market data fetch or ingestion",
    "printing secrets",
    "printing row payloads or stock_id lists",
    "publicDataSource=supabase",
    "scoreSource=real",
    "row coverage points",
    "data-quality score lift",
    "CP3_READY_NOW",
    "does not connect to Supabase",
    "execute readonly attempts"
  ]) {
    if (!JSON.stringify(report).includes(phrase)) problems.push(`missing report phrase ${phrase}`);
  }
}

for (const phrase of [
  "scripts/report-bounded-readonly-readiness-recheck.mjs",
  "scripts/report-mainline-readonly-packet-bridge.mjs",
  "scripts/report-row-coverage-readonly-preexecution-packet.mjs",
  "scripts/report-bounded-row-coverage-readonly-attempt-decision.mjs",
  "local_ready_remote_still_separate",
  "requiresSeparateNamedAction",
  "noRuntimePromotionFromAttemptAlone"
]) {
  if (!source.includes(phrase)) problems.push(`missing source phrase ${phrase}`);
}

if (!packageJson.includes("\"report:mainline-readonly-row-coverage-integration\": \"node scripts/report-mainline-readonly-row-coverage-integration.mjs\"")) {
  problems.push("package.json missing report script");
}
if (!packageJson.includes("\"check:mainline-readonly-row-coverage-integration\": \"node scripts/check-mainline-readonly-row-coverage-integration.mjs\"")) {
  problems.push("package.json missing check script");
}
if (!reviewGate.includes("scripts/check-mainline-readonly-row-coverage-integration.mjs")) {
  problems.push("review gate missing checker");
}

for (const pattern of [
  /run-row-coverage-readonly-once/,
  /validate-supabase-readonly/,
  /@supabase\/supabase-js/,
  /createClient/,
  /fetch\(/,
  /\.from\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /\.upsert\(/,
  /process\.env/,
  /publicDataSource:\s*"supabase"/,
  /scoreSource:\s*"real"/,
  /sqlExecuted:\s*true/,
  /supabaseWritesEnabled:\s*true/
]) {
  if (pattern.test(source)) problems.push(`forbidden source pattern ${String(pattern)}`);
}

console.log(
  JSON.stringify(
    {
      problems,
      status: problems.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (problems.length > 0) process.exitCode = 1;
