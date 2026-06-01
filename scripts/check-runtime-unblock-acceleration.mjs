import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-runtime-unblock-acceleration.mjs";
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
  if (output.mode !== "runtime_unblock_acceleration") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (!["blocked_on_oral_outcomes", "ready_for_separate_readonly_decision"].includes(output.status)) {
    blocked.push(`output.status: ${String(output.status)}`);
  }

  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "ingestionStarted",
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

  if (!Array.isArray(output.currentBlockers) || output.currentBlockers.length < 3) {
    blocked.push("output.currentBlockers: expected at least three blockers");
  }

  const commands = (output.fastestSafePath ?? []).map((step) => step.command).join("\n");
  for (const phrase of [
    "record:narrow-approval-outcome",
    "legal-source-terms-review",
    "investment-non-advisory-interpretation-review",
    "check:narrow-approval-post-review-gate",
    "report:supabase-readonly-final-prep"
  ]) {
    if (!commands.includes(phrase)) missing.push(`commands: ${phrase}`);
  }

  for (const phrase of ["scoreSource=real", "Supabase writes", "market data ingestion"]) {
    if (!JSON.stringify(output).includes(phrase)) missing.push(`output boundary: ${phrase}`);
  }
}

const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);
for (const [file, phrase] of [
  [packagePath, "\"report:runtime-unblock-acceleration\": \"node scripts/report-runtime-unblock-acceleration.mjs\""],
  [packagePath, "\"check:runtime-unblock-acceleration\": \"node scripts/check-runtime-unblock-acceleration.mjs\""],
  [reviewGatePath, "scripts/check-runtime-unblock-acceleration.mjs"]
]) {
  const content = file === packagePath ? packageJson : reviewGate;
  if (!content.includes(phrase)) missing.push(`${file}: ${phrase}`);
}

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: blocked.length === 0 && missing.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (blocked.length > 0 || missing.length > 0) process.exitCode = 1;

function read(file) {
  return fs.readFileSync(file, "utf8");
}
