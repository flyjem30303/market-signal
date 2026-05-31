import { spawnSync } from "node:child_process";
import fs from "node:fs";

const runnerPath = "scripts/run-row-coverage-readonly-once.mjs";
const packageJsonPath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const runner = fs.readFileSync(runnerPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const problems = [];

const failClosed = spawnSync(process.execPath, [runnerPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: {
    PATH: process.env.PATH,
    SystemRoot: process.env.SystemRoot,
    TEMP: process.env.TEMP,
    TMP: process.env.TMP
  },
  shell: false
});

let failClosedJson = null;
try {
  failClosedJson = JSON.parse(failClosed.stdout);
} catch (error) {
  problems.push(`fail-closed output is not JSON: ${error.message}`);
}

if (failClosed.status !== 1) problems.push(`expected fail-closed exit 1, got ${failClosed.status}`);
if (failClosedJson) {
  if (failClosedJson.status !== "blocked") problems.push(`expected blocked status, got ${failClosedJson.status}`);
  if (failClosedJson.reason !== "missing_confirmation") {
    problems.push(`expected missing_confirmation reason, got ${failClosedJson.reason}`);
  }
  if (failClosedJson.remoteAttempted !== false) problems.push("remoteAttempted must be false");
  for (const flag of [
    "canAwardRowCoveragePoints",
    "canClaimCoverage",
    "canSetScoreSourceReal",
    "connectionAttempted",
    "filesWritten",
    "mutations",
    "rowPayloadsPrinted",
    "secretsPrinted",
    "sqlExecuted"
  ]) {
    if (failClosedJson[flag] !== false) problems.push(`${flag} must be false in fail-closed output`);
  }
}

const requiredPhrases = [
  "const REQUIRED_CONFIRMATION = \"CP3_ROW_COVERAGE_READONLY_VALIDATE\"",
  "process.env.ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION !== REQUIRED_CONFIRMATION",
  "reason: \"missing_confirmation\"",
  "remoteAttempted: false",
  "loadTsModule(\"src/lib/row-coverage-readonly-local-preflight.ts\")",
  "getRowCoverageReadonlyLocalPreflight(process.env)",
  "reason: \"preflight_blocked\"",
  "reason: \"runner_skeleton_no_remote_execution\"",
  "printSanitized({",
  "canAwardRowCoveragePoints: false",
  "canClaimCoverage: false",
  "canSetScoreSourceReal: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "sqlExecuted: false",
  "mutations: false",
  "secretsPrinted: false",
  "rowPayloadsPrinted: false",
  "filesWritten: false"
];
const forbiddenPatterns = [
  /@supabase\/supabase-js/i,
  /createClient/i,
  /fetch\s*\(/i,
  /\.from\s*\(/i,
  /\.select\s*\(/i,
  /\.insert\s*\(/i,
  /\.update\s*\(/i,
  /\.delete\s*\(/i,
  /\.upsert\s*\(/i,
  /\.rpc\s*\(/i,
  /insert\s+into/i,
  /delete\s+from/i,
  /update\s+public\./i,
  /truncate/i,
  /drop\s+table/i,
  /alter\s+table/i,
  /create\s+table/i,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
  /SUPABASE_SERVICE_ROLE_KEY/
];

for (const phrase of requiredPhrases) {
  if (!runner.includes(phrase)) problems.push(`missing:${phrase}`);
}
for (const pattern of forbiddenPatterns) {
  if (pattern.test(runner)) problems.push(`forbidden:${pattern}`);
}

const packageRunScript = packageJson.scripts?.["run:row-coverage-readonly"];
const packageCheckScript = packageJson.scripts?.["check:row-coverage-readonly-guarded-runner"];
if (packageRunScript !== "node scripts/run-row-coverage-readonly-once.mjs") {
  problems.push(`run script mismatch: ${packageRunScript ?? "missing"}`);
}
if (packageCheckScript !== "node scripts/check-row-coverage-readonly-guarded-runner.mjs") {
  problems.push(`check script mismatch: ${packageCheckScript ?? "missing"}`);
}
if (!reviewGate.includes("scripts/check-row-coverage-readonly-guarded-runner.mjs")) {
  problems.push("review gate does not include row coverage readonly guarded runner checker");
}
if (reviewGate.includes("scripts/run-row-coverage-readonly-once.mjs")) {
  problems.push("review gate must not execute the guarded runner");
}

console.log(
  JSON.stringify(
    {
      failClosed: {
        exitCode: failClosed.status,
        output: failClosedJson
      },
      problems,
      status: problems.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (problems.length > 0) {
  process.exit(1);
}
