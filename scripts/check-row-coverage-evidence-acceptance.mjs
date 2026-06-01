import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-row-coverage-evidence-acceptance.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8"
});

const blocked = [];
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
  if (output.mode !== "row_coverage_evidence_acceptance") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "accepted_for_next_decision") {
    blocked.push(`output.status: ${String(output.status)}`);
  }

  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "ingestionStarted",
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
    "accepted_as_prerequisite_context",
    "accepted_as_classification_rules",
    "accepted_as_sanitized_output_examples",
    "accepted_as_local_ready_remote_paused",
    "accepted_as_clean_equity_report_only_sample",
    "row coverage evidence is accepted as local decision-quality material, not as runtime readiness",
    "clean equity report-only sample as local decision-quality evidence only",
    "bounded-row-coverage-readonly-attempt-decision",
    "publicDataSource=supabase",
    "scoreSource=real",
    "row coverage points",
    "post-run review before any readiness change"
  ]) {
    if (!serialized.includes(phrase)) missing.push(`output: ${phrase}`);
  }
}

const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

for (const [file, content, phrase] of [
  [
    packagePath,
    packageJson,
    "\"report:row-coverage-evidence-acceptance\": \"node scripts/report-row-coverage-evidence-acceptance.mjs\""
  ],
  [
    packagePath,
    packageJson,
    "\"check:row-coverage-evidence-acceptance\": \"node scripts/check-row-coverage-evidence-acceptance.mjs\""
  ],
  [
    packagePath,
    packageJson,
    "\"check:equity-row-coverage-evidence-acceptance-gate\": \"node scripts/check-equity-row-coverage-evidence-acceptance-gate.mjs\""
  ],
  [reviewGatePath, reviewGate, "scripts/check-row-coverage-evidence-acceptance.mjs"],
  [reviewGatePath, reviewGate, "scripts/check-equity-row-coverage-evidence-acceptance-gate.mjs"]
]) {
  if (!content.includes(phrase)) missing.push(`${file}: ${phrase}`);
}

const forbiddenPhrases = [
  "RUN_REMOTE_NOW",
  "EXECUTION_COMPLETED",
  "SQL execution is approved",
  "Supabase writes are approved",
  "market ingestion is approved",
  "scoreSource=real approved",
  "ROW_COVERAGE_POINTS_AWARDED",
  "CP3_READY_NOW"
];
const forbidden = forbiddenPhrases.filter((phrase) => run.stdout.includes(phrase));
const reviewGateRunsRunner = /command:\s*\[node,\s*"scripts\/run-row-coverage-readonly-once\.mjs"\]/.test(reviewGate);

if (reviewGateRunsRunner) {
  forbidden.push(`${reviewGatePath}: review gate must not execute row coverage runner`);
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
