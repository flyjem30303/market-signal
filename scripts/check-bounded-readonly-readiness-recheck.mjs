import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-bounded-readonly-readiness-recheck.mjs";
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
  if (output.mode !== "bounded_readonly_readiness_recheck") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "local_ready_remote_still_separate") {
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

  const checkIds = new Set((output.checks ?? []).map((item) => item.id));
  for (const id of [
    "bounded-row-coverage-readonly-attempt-decision",
    "row-coverage-bounded-readonly-attempt-post-run-review",
    "post-equity-row-coverage-readonly-attempt-decision-packet",
    "post-equity-row-coverage-readonly-attempt-post-run-review",
    "public-runtime-boundary-coverage",
    "localhost-full-health"
  ]) {
    if (!checkIds.has(id)) missing.push(`output.checks: ${id}`);
  }

  const serialized = JSON.stringify(output);
  for (const phrase of [
    "local_ready_remote_still_separate",
    "CEO must separately name any Supabase readonly attempt before remote execution",
    "continue runtime work unless CEO explicitly names the next bounded readonly attempt",
    "record exactly one attempt",
    "record sanitized aggregate status only",
    "do not promote runtime readiness from remote output without a later accepted gate",
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
  [packagePath, packageJson, "\"report:bounded-readonly-readiness-recheck\": \"node scripts/report-bounded-readonly-readiness-recheck.mjs\""],
  [packagePath, packageJson, "\"check:bounded-readonly-readiness-recheck\": \"node scripts/check-bounded-readonly-readiness-recheck.mjs\""],
  [reviewGatePath, reviewGate, "scripts/check-bounded-readonly-readiness-recheck.mjs"]
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
