import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_WRITE_IMPLEMENTATION_DESIGN_TO_CODE_BOUNDARY.md";
const readinessPath = "docs/TW_EQUITY_WRITE_CAPABLE_RUNNER_IMPLEMENTATION_READINESS_GATE.md";
const migrationPath = "supabase/migrations/0003_twse_stock_day_staging.sql";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
const readiness = read(readinessPath);
const migration = read(migrationPath);
const runner = read(runnerPath);
const writeImplementationCreated = runner.includes("tw_equity_staging_write_fail_closed_write_capable_runner");
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "TW Equity Write Implementation Design-To-Code Boundary",
  "tw_equity_write_implementation_design_to_code_boundary_ready_not_mutating",
  "docs/TW_EQUITY_WRITE_CAPABLE_RUNNER_IMPLEMENTATION_READINESS_GATE.md",
  "scripts/run-tw-equity-staging-write-once.mjs",
  "supabase/migrations/0003_twse_stock_day_staging.sql",
  "smallest local design-to-code boundary",
  "must still refuse Supabase mutation",
  "Candidate Input Artifact Contract",
  "must not fetch market data directly",
  "sourceId` equals `twse-stock-day",
  "no raw source payload is included",
  "each candidate price row has a non-empty `source_row_hash`",
  "Rollback Dry-Run Count Contract",
  "destructiveRollbackAllowed=false",
  "`candidateInputArtifact`",
  "`candidateInputAccepted`",
  "`rollbackDryRunCountReady`",
  "`writeImplementationReady=false`",
  "candidate input is not accepted",
  "rollback dry-run count is not ready",
  "write implementation is not created",
  "No SQL, Supabase connection, Supabase write"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [path, text, phrase] of [
  [readinessPath, readiness, "tw_equity_write_capable_runner_local_preflight_implemented_not_write_capable"],
  [migrationPath, migration, "source_row_hash text not null"],
  [runnerPath, runner, "candidateInputArtifact"],
  [runnerPath, runner, "candidateInputAccepted"],
  [runnerPath, runner, "rollbackDryRunCountReady"],
  [runnerPath, runner, "missing_candidate_input_artifact_contract"],
  [runnerPath, runner, writeImplementationCreated ? "writeImplementationReady: true" : "writeImplementationReady: false"]
]) {
  if (!text.includes(phrase)) problems.push(`${path} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity write implementation design-to-code boundary slice",
  "docs/TW_EQUITY_WRITE_IMPLEMENTATION_DESIGN_TO_CODE_BOUNDARY.md",
  "tw_equity_write_implementation_design_to_code_boundary_ready_not_mutating",
  "candidate input artifact contract and rollback dry-run count contract are defined",
  "runner exposes candidateInputArtifact, candidateInputAccepted, rollbackDryRunCountReady, and writeImplementationReady=false",
  "candidate input is not accepted and no Supabase mutation is implemented"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-write-implementation-design-to-code-boundary"] !==
  "node scripts/check-tw-equity-write-implementation-design-to-code-boundary.mjs"
) {
  problems.push("package.json missing check:tw-equity-write-implementation-design-to-code-boundary");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-write-implementation-design-to-code-boundary.mjs")) {
    problems.push(`${path} missing write implementation design-to-code boundary checker`);
  }
  if (!text.includes("tw-equity-write-implementation-design-to-code-boundary")) {
    problems.push(`${path} missing tw-equity-write-implementation-design-to-code-boundary name`);
  }
}

if (!reviewGate.includes('"tw-equity-write-implementation-design-to-code-boundary"')) {
  problems.push("review gate core set missing tw-equity-write-implementation-design-to-code-boundary");
}

const forbiddenPatterns = writeImplementationCreated
  ? [
      /\.update\(/u,
      /\.delete\(/u,
      /\.upsert\(/u,
      /\bfetch\s*\(/u,
      /\bwriteFile/u,
      /\bappendFile/u,
      /sb_secret_/u,
      /sb_publishable_/u
    ]
  : [
      /@supabase\/supabase-js/u,
      /createClient/u,
      /\.from\(/u,
      /\.insert\(/u,
      /\.update\(/u,
      /\.delete\(/u,
      /\.upsert\(/u,
      /\bfetch\s*\(/u,
      /\bwriteFile/u,
      /\bappendFile/u,
      /sb_secret_/u,
      /sb_publishable_/u
    ];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(runner)) problems.push(`${runnerPath} contains forbidden write-capable token: ${pattern}`);
}

const executeAttempt = spawnSync(process.execPath, [
  runnerPath,
  "--authorization-id",
  "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  "--lane",
  "tw-equity",
  "--symbols",
  "2330,2382,2308",
  "--sessions",
  "60",
  "--target",
  "staging_twse_stock_day_runs,staging_twse_stock_day_prices",
  "--max-rows",
  "180",
  "--post-run-review",
  "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md",
  "--execute"
], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (executeAttempt.status === 0) {
  problems.push(`${runnerPath} --execute must remain blocked`);
} else {
  const parsed = JSON.parse(executeAttempt.stdout);
  if (parsed.candidateInputAccepted !== false) problems.push("--execute must keep candidateInputAccepted false");
  if (parsed.rollbackDryRunCountReady !== false) problems.push("--execute must keep rollbackDryRunCountReady false");
  if (parsed.writeImplementationReady !== writeImplementationCreated) {
    problems.push(`--execute writeImplementationReady expected ${writeImplementationCreated}`);
  }
  if (parsed.connectionAttempted !== false) problems.push("--execute must keep connectionAttempted false");
  if (parsed.mutations !== false) problems.push("--execute must keep mutations false");
  if (!parsed.problems?.includes("missing_candidate_input_artifact_contract")) {
    problems.push("--execute output missing candidate input contract blocker");
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
}
