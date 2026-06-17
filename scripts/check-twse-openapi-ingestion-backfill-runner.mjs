import fs from "node:fs";
import { spawnSync } from "node:child_process";

const runnerPath = "src/lib/twse-openapi-ingestion-backfill-runner.ts";
const parserPath = "src/lib/twse-openapi-parser-contract.ts";
const sourcePath = "src/lib/twse-openapi-source-adapter-contract.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const roadmapPath = "docs/REAL_RUNTIME_PROMOTION_8_STAGE_ROADMAP.md";

const problems = [];

const runner = read(runnerPath);
const parser = read(parserPath);
const source = read(sourcePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);
const roadmap = read(roadmapPath);

for (const phrase of [
  "TWSE_OPENAPI_INGESTION_BACKFILL_RUNNER_BOUNDARY",
  "mode: \"dry_run_only\"",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "supabaseWrite: false",
  "sqlExecution: false",
  "buildTwseOpenApiBackfillDryRunPlan",
  "runTwseOpenApiBackfillDryRun",
  "fetchTwseOpenApiRows",
  "sourceTimestamp",
  "candidateRowCount",
  "duplicateCount",
  "rejectedCount",
  "missingSessionCount",
  "routeSummaries",
  "TWSE_OPENAPI_LIVE_FETCH_AUTHORIZATION_ID",
  "TWSE_OPENAPI_ALLOW_LIVE_FETCH",
  "live_fetch_blocked_without_exact_authorization",
  "rawPayloadEcho: false",
  "rowPayloadEcho: false"
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

for (const phrase of [
  "parseTwseOpenApiSyntheticRows",
  "TWSE_OPENAPI_ROUTES",
  "twse_openapi_parser_contract_with_synthetic_fixtures_only",
  "TWSE_OPENAPI_DATA_GOV"
]) {
  if (!parser.includes(phrase) && !source.includes(phrase)) problems.push(`parser/source missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:twse-openapi-ingestion-backfill-runner"] !==
  "node scripts/check-twse-openapi-ingestion-backfill-runner.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-ingestion-backfill-runner script`);
}

for (const phrase of [
  "scripts/check-twse-openapi-ingestion-backfill-runner.mjs",
  "twse-openapi-ingestion-backfill-runner",
  "expectStatus: \"ok\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "stage_3_ingestion_and_backfill_runner_complete",
  "twse_openapi_supabase_bounded_write_and_post_run_review"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!roadmap.includes(phrase)) problems.push(`${roadmapPath} missing: ${phrase}`);
}

const dryRun = spawnSync(process.execPath, ["scripts/run-twse-openapi-ingestion-backfill-dry-run.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 15000
});
const dryRunOutput = `${dryRun.stdout ?? ""}\n${dryRun.stderr ?? ""}`.trim();
const dryRunJson = parseJsonOutput(dryRunOutput);
if (dryRun.status !== 0 || dryRunJson?.status !== "ok") {
  problems.push(`dry-run command failed: ${dryRunOutput}`);
}
if (dryRunJson?.boundary?.publicDataSource !== "mock" || dryRunJson?.boundary?.scoreSource !== "mock") {
  problems.push("dry-run command did not preserve mock source/score boundary");
}
if (!dryRunJson?.dryRun?.candidateRowCount || dryRunJson.dryRun.candidateRowCount < 1) {
  problems.push("dry-run command did not produce candidate rows");
}
if (dryRunJson?.dryRun?.rawPayloadEcho !== false || dryRunJson?.dryRun?.rowPayloadEcho !== false) {
  problems.push("dry-run command must not echo raw or row payloads");
}

const blockedLive = spawnSync(process.execPath, ["scripts/run-twse-openapi-ingestion-backfill-dry-run.mjs", "--fetch-live"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 15000
});
const blockedOutput = `${blockedLive.stdout ?? ""}\n${blockedLive.stderr ?? ""}`.trim();
const blockedJson = parseJsonOutput(blockedOutput);
if (blockedLive.status === 0 || blockedJson?.status !== "blocked") {
  problems.push(`live fetch guard should block without authorization: ${blockedOutput}`);
}
if (!String(blockedJson?.reason ?? "").includes("live_fetch_blocked_without_exact_authorization")) {
  problems.push("live fetch guard did not report exact authorization blocker");
}

for (const pattern of [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /SUPABASE_SERVICE_ROLE_KEY/u,
  /publicDataSource:\s*"supabase"/u,
  /scoreSource:\s*"real"/u,
  /sqlExecution:\s*true/u,
  /supabaseWrite:\s*true/u,
  /rawPayloadEcho:\s*true/u,
  /rowPayloadEcho:\s*true/u
]) {
  if (pattern.test(runner)) problems.push(`${runnerPath} contains forbidden pattern: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "stage_3_ingestion_and_backfill_runner_complete",
      nextRoute: "twse_openapi_supabase_bounded_write_and_post_run_review",
      runnerPath
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function parseJsonOutput(output) {
  const start = output.indexOf("{");
  const end = output.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(output.slice(start, end + 1));
  } catch {
    return null;
  }
}
