import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-row-coverage-readonly-preexecution-packet.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8"
});

const blocked = [];
const forbidden = [];
const missing = [];

if (run.status !== 0) {
  blocked.push(`${reportPath}: exited ${String(run.status)} ${run.stderr.trim()}`);
}

let output;
try {
  output = JSON.parse(run.stdout);
} catch (error) {
  blocked.push(`${reportPath}: did not emit JSON ${error instanceof Error ? error.message : String(error)}`);
}

if (output) {
  if (output.mode !== "row_coverage_readonly_preexecution_packet") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "ready_to_present_not_execute") {
    blocked.push(`output.status: ${String(output.status)}`);
  }

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
    if (output.safety?.[flag] !== false) blocked.push(`output.safety.${flag}: ${String(output.safety?.[flag])}`);
  }

  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    blocked.push("output safety must keep publicDataSource and scoreSource mock");
  }

  if (output.executionCommandPreview?.stillRequiresExplicitExecutionRequest !== true) {
    blocked.push("output.executionCommandPreview.stillRequiresExplicitExecutionRequest must be true");
  }
  if (output.postRunReviewRequired?.immediate !== true) {
    blocked.push("output.postRunReviewRequired.immediate must be true");
  }
  if (output.postRunReviewRequired?.beforeAnyReadinessChange !== true) {
    blocked.push("output.postRunReviewRequired.beforeAnyReadinessChange must be true");
  }
  if (output.localDecisionGate?.decisionGateOk !== true) {
    blocked.push("output.localDecisionGate.decisionGateOk must be true");
  }

  const serialized = JSON.stringify(output);
  for (const phrase of [
    "ready_to_present_not_execute",
    "exactly one bounded Supabase readonly row coverage attempt",
    "CP3_ROW_COVERAGE_READONLY_VALIDATE",
    "Any command drift stops execution",
    "node scripts/check-review-gates.mjs",
    "node node_modules/typescript/bin/tsc --noEmit",
    "daily_prices aggregate row coverage only",
    "rawMarketDataAllowed",
    "rowPayloadsAllowed",
    "sqlAllowed",
    "writesAllowed",
    "allowedSanitizedOutput",
    "forbiddenOutput",
    "stock_id values",
    "status ok moves only to sanitized post-run review",
    "no retry",
    "more than one attempt requires a new execution decision gate",
    "no SQL executed",
    "no Supabase writes",
    "no public source promotion",
    "no scoreSource=real",
    "publicDataSource=supabase",
    "scoreSource=real",
    "row coverage points",
    "CP3_READY_NOW"
  ]) {
    if (!serialized.includes(phrase)) missing.push(`output: ${phrase}`);
  }
}

const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const report = fs.readFileSync(reportPath, "utf8");

for (const [file, content, phrase] of [
  [
    packagePath,
    packageJson,
    "\"report:row-coverage-readonly-preexecution-packet\": \"node scripts/report-row-coverage-readonly-preexecution-packet.mjs\""
  ],
  [
    packagePath,
    packageJson,
    "\"check:row-coverage-readonly-preexecution-packet\": \"node scripts/check-row-coverage-readonly-preexecution-packet.mjs\""
  ],
  [reviewGatePath, reviewGate, "scripts/check-row-coverage-readonly-preexecution-packet.mjs"],
  [reviewGatePath, reviewGate, "row-coverage-readonly-preexecution-packet"],
  [reportPath, report, "scripts/report-bounded-row-coverage-readonly-attempt-decision.mjs"]
]) {
  if (!content.includes(phrase)) missing.push(`${file}: ${phrase}`);
}

for (const phrase of [
  "RUN_REMOTE_NOW",
  "EXECUTION_COMPLETED",
  "SQL execution is approved",
  "Supabase writes are approved",
  "market ingestion is approved",
  "scoreSource=real approved",
  "ROW_COVERAGE_POINTS_AWARDED"
]) {
  if (run.stdout.includes(phrase) || report.includes(phrase)) forbidden.push(`packet: ${phrase}`);
}

if (/command:\s*\[node,\s*"scripts\/run-row-coverage-readonly-once\.mjs"\]/.test(reviewGate)) {
  forbidden.push(`${reviewGatePath}: review gate must not execute row coverage runner`);
}

if (/@supabase\/supabase-js|createClient|\.from\(|\.insert\(|\.update\(|\.delete\(|\.upsert\(|process\.env\./.test(report)) {
  forbidden.push(`${reportPath}: report must not connect to Supabase or read credentials`);
}

console.log(
  JSON.stringify(
    {
      blocked,
      forbidden,
      missing,
      status: blocked.length === 0 && forbidden.length === 0 && missing.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (blocked.length > 0 || forbidden.length > 0 || missing.length > 0) {
  process.exitCode = 1;
}
