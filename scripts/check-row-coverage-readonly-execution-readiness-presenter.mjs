import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-row-coverage-readonly-execution-readiness-presenter.mjs";
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
  if (output.mode !== "row_coverage_readonly_execution_readiness_presenter") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "ready_for_ceo_oral_decision_not_execution") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.commandReference?.stillRequiresExplicitExecutionRequest !== true) {
    blocked.push("output.commandReference.stillRequiresExplicitExecutionRequest must be true");
  }
  if (output.sourcePacket?.decisionGateOk !== true) {
    blocked.push("output.sourcePacket.decisionGateOk must be true");
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

  const serialized = JSON.stringify(output);
  for (const phrase of [
    "ready_for_ceo_oral_decision_not_execution",
    "Row coverage readonly is locally ready for a CEO oral decision",
    "This is not execution and does not connect to Supabase",
    "exactly one bounded readonly attempt",
    "continue runtime hardening",
    "run exactly one bounded Supabase readonly row coverage attempt",
    "post-run review",
    "publicDataSource remains mock",
    "scoreSource remains mock",
    "no SQL",
    "no Supabase writes",
    "no market-data ingestion",
    "no retry",
    "CP3_ROW_COVERAGE_READONLY_VALIDATE",
    "attempt status",
    "observed total row count",
    "missing row count",
    "publicDataSource=supabase",
    "scoreSource=real",
    "row coverage points",
    "CP3_READY_NOW",
    "investment-grade claims"
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
    "\"report:row-coverage-readonly-execution-readiness-presenter\": \"node scripts/report-row-coverage-readonly-execution-readiness-presenter.mjs\""
  ],
  [
    packagePath,
    packageJson,
    "\"check:row-coverage-readonly-execution-readiness-presenter\": \"node scripts/check-row-coverage-readonly-execution-readiness-presenter.mjs\""
  ],
  [reviewGatePath, reviewGate, "scripts/check-row-coverage-readonly-execution-readiness-presenter.mjs"],
  [reviewGatePath, reviewGate, "row-coverage-readonly-execution-readiness-presenter"],
  [reportPath, report, "scripts/report-row-coverage-readonly-preexecution-packet.mjs"]
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
  if (run.stdout.includes(phrase) || report.includes(phrase)) forbidden.push(`presenter: ${phrase}`);
}

if (/command:\s*\[node,\s*"scripts\/run-row-coverage-readonly-once\.mjs"\]/.test(reviewGate)) {
  forbidden.push(`${reviewGatePath}: review gate must not execute row coverage runner`);
}

if (/@supabase\/supabase-js|createClient|\.from\(|\.insert\(|\.update\(|\.delete\(|\.upsert\(|process\.env\./.test(report)) {
  forbidden.push(`${reportPath}: presenter must not connect to Supabase or read credentials`);
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
