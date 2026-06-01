import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-post-readonly-evidence-action-gate.mjs";
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
  if (output.mode !== "post_readonly_evidence_action_gate") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "ready_for_acceptance_review") {
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
    "object reachability only",
    "schema shape only",
    "remote execution still paused",
    "publicDataSource=supabase",
    "scoreSource=real",
    "row-coverage-readonly",
    "data-quality-evidence"
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
    "\"report:post-readonly-evidence-action-gate\": \"node scripts/report-post-readonly-evidence-action-gate.mjs\""
  ],
  [
    packagePath,
    packageJson,
    "\"check:post-readonly-evidence-action-gate\": \"node scripts/check-post-readonly-evidence-action-gate.mjs\""
  ],
  [reviewGatePath, reviewGate, "scripts/check-post-readonly-evidence-action-gate.mjs"]
]) {
  if (!content.includes(phrase)) missing.push(`${file}: ${phrase}`);
}

const forbiddenPhrases = [
  "RUN_REMOTE_NOW",
  "SQL execution is approved",
  "Supabase writes are approved",
  "market ingestion is approved",
  "scoreSource=real approved",
  "CP3_READY_NOW"
];
const forbidden = forbiddenPhrases.filter((phrase) => run.stdout.includes(phrase));

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
