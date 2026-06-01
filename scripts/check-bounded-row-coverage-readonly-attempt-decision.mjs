import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-bounded-row-coverage-readonly-attempt-decision.mjs";
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
  if (output.mode !== "bounded_row_coverage_readonly_attempt_decision") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "ready_for_explicit_one_attempt_decision") {
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

  const prerequisiteIds = new Set((output.prerequisites ?? []).map((item) => item.id));
  for (const id of [
    "row-coverage-evidence-acceptance",
    "equity-row-coverage-evidence-acceptance-gate",
    "row-coverage-second-attempt-final-local-preflight",
    "row-coverage-second-attempt-sanitized-output-contract",
    "row-coverage-second-attempt-output-sample-validation",
    "row-coverage-second-attempt-post-run-acceptance-gate"
  ]) {
    if (!prerequisiteIds.has(id)) missing.push(`output.prerequisites: ${id}`);
  }

  const serialized = JSON.stringify(output);
  for (const phrase of [
    "ready_for_explicit_one_attempt_decision",
    "accepted clean equity report-only sample as local decision-quality evidence",
    "stillRequiresExplicitExecutionRequest",
    "run exactly one Supabase readonly row coverage attempt",
    "execute remote readonly attempt only as a separately named action",
    "SQL execution",
    "Supabase writes",
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

for (const [file, content, phrase] of [
  [
    packagePath,
    packageJson,
    "\"report:bounded-row-coverage-readonly-attempt-decision\": \"node scripts/report-bounded-row-coverage-readonly-attempt-decision.mjs\""
  ],
  [
    packagePath,
    packageJson,
    "\"check:bounded-row-coverage-readonly-attempt-decision\": \"node scripts/check-bounded-row-coverage-readonly-attempt-decision.mjs\""
  ],
  [reviewGatePath, reviewGate, "scripts/check-bounded-row-coverage-readonly-attempt-decision.mjs"]
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
  if (run.stdout.includes(phrase)) forbidden.push(`output: ${phrase}`);
}

if (/command:\s*\[node,\s*"scripts\/run-row-coverage-readonly-once\.mjs"\]/.test(reviewGate)) {
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
