import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-mock-runtime-hardening-priority.mjs";
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
  if (output.mode !== "mock_runtime_hardening_priority") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "runtime_hardening_selected") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.decision?.laneRatio?.mockRuntimeHardening !== 70) {
    blocked.push(`output.decision.laneRatio.mockRuntimeHardening: ${String(output.decision?.laneRatio?.mockRuntimeHardening)}`);
  }
  if (output.decision?.laneRatio?.supabaseReadonlyPreparation !== 30) {
    blocked.push(
      `output.decision.laneRatio.supabaseReadonlyPreparation: ${String(output.decision?.laneRatio?.supabaseReadonlyPreparation)}`
    );
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
    "bounded-row-coverage-readonly-attempt-decision",
    "project-progress-snapshot",
    "ceo-progress-brief",
    "localhost-full-health"
  ]) {
    if (!prerequisiteIds.has(id)) missing.push(`output.prerequisites: ${id}`);
  }

  const serialized = JSON.stringify(output);
  for (const phrase of [
    "prioritize mock runtime hardening before Supabase row coverage attempt",
    "requires a separately named remote action",
    "source rights, model credibility, data quality, and public-claim gates",
    "clarify public mock/runtime boundary",
    "do not set publicDataSource=supabase",
    "do not set scoreSource=real",
    "build, localhost full health, and review gates"
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
    "\"report:mock-runtime-hardening-priority\": \"node scripts/report-mock-runtime-hardening-priority.mjs\""
  ],
  [
    packagePath,
    packageJson,
    "\"check:mock-runtime-hardening-priority\": \"node scripts/check-mock-runtime-hardening-priority.mjs\""
  ],
  [reviewGatePath, reviewGate, "scripts/check-mock-runtime-hardening-priority.mjs"]
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
  "publicDataSource=supabase approved"
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
