import fs from "node:fs";
import { spawnSync } from "node:child_process";

const runnerPath = "src/lib/twse-openapi-stage-4-bounded-write-readback-runner.ts";
const cliPath = "scripts/run-twse-openapi-stage-4-bounded-write-readback-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const roadmapPath = "docs/REAL_RUNTIME_PROMOTION_8_STAGE_ROADMAP.md";

const problems = [];

const runner = read(runnerPath);
const cli = read(cliPath);
const pkg = readJson(packagePath);
const reviewGate = read(reviewGatePath);
const status = read(statusPath);
const roadmap = read(roadmapPath);

for (const phrase of [
  "TWSE_OPENAPI_STAGE4_BOUNDED_WRITE_BOUNDARY",
  "TWSE_OPENAPI_STAGE4_WRITE_AUTHORIZATION_ID",
  "TWSE_OPENAPI_STAGE4_ALLOW_WRITE",
  "buildTwseOpenApiStage4WritePlan",
  "runTwseOpenApiStage4BoundedWrite",
  "stage4_bounded_write_blocked_without_exact_authorization",
  "writeMode: \"insert_missing_only\"",
  "readbackMode: \"aggregate_only\"",
  "rawPayloadEcho: false",
  "rowPayloadEcho: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "nextRoute: \"twse_openapi_supabase_readonly_gate\""
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

for (const phrase of [
  "TWSE_OPENAPI_STAGE4_BOUNDED_WRITE_BOUNDARY",
  "stage4_bounded_write_blocked_without_exact_authorization",
  "stage_4_bounded_supabase_write_and_post_run_review_complete",
  "twse_openapi_supabase_readonly_gate",
  "rawPayloadEcho: false",
  "rowPayloadEcho: false"
]) {
  if (!cli.includes(phrase)) problems.push(`${cliPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["run:twse-openapi-stage-4-bounded-write-readback-once"] !==
  "node scripts/run-twse-openapi-stage-4-bounded-write-readback-once.mjs"
) {
  problems.push(`${packagePath} missing run:twse-openapi-stage-4-bounded-write-readback-once script`);
}

if (
  pkg.scripts?.["check:twse-openapi-stage-4-bounded-write-readback-runner"] !==
  "node scripts/check-twse-openapi-stage-4-bounded-write-readback-runner.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-stage-4-bounded-write-readback-runner script`);
}

for (const phrase of [
  "scripts/check-twse-openapi-stage-4-bounded-write-readback-runner.mjs",
  "twse-openapi-stage-4-bounded-write-readback-runner"
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "stage_4_bounded_supabase_write_and_post_run_review_complete",
  "twse_openapi_supabase_readonly_gate"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!roadmap.includes(phrase)) problems.push(`${roadmapPath} missing: ${phrase}`);
}

if (fs.existsSync(cliPath)) {
  const dryRun = spawnSync(process.execPath, [cliPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 15000
  });
  const dryRunOutput = `${dryRun.stdout ?? ""}\n${dryRun.stderr ?? ""}`.trim();
  const dryRunJson = parseJsonOutput(dryRunOutput);
  if (dryRun.status !== 0 || dryRunJson?.status !== "ok") {
    problems.push(`stage 4 dry-run command failed: ${dryRunOutput}`);
  }
  if (dryRunJson?.boundary?.publicDataSource !== "mock" || dryRunJson?.boundary?.scoreSource !== "mock") {
    problems.push("stage 4 dry-run did not preserve mock source/score boundary");
  }
  if (dryRunJson?.writePlan?.writeMode !== "insert_missing_only") {
    problems.push("stage 4 dry-run missing insert_missing_only write plan");
  }
  if (dryRunJson?.postRunReview?.readbackMode !== "aggregate_only") {
    problems.push("stage 4 dry-run missing aggregate_only readback review");
  }
  if (dryRunJson?.postRunReview?.rawPayloadEcho !== false || dryRunJson?.postRunReview?.rowPayloadEcho !== false) {
    problems.push("stage 4 dry-run must not echo raw or row payloads");
  }

  const blockedWrite = spawnSync(process.execPath, [cliPath, "--execute"], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 15000
  });
  const blockedOutput = `${blockedWrite.stdout ?? ""}\n${blockedWrite.stderr ?? ""}`.trim();
  const blockedJson = parseJsonOutput(blockedOutput);
  if (blockedWrite.status === 0 || blockedJson?.status !== "blocked") {
    problems.push(`stage 4 execute guard should block without authorization: ${blockedOutput}`);
  }
  if (!String(blockedJson?.reason ?? "").includes("stage4_bounded_write_blocked_without_exact_authorization")) {
    problems.push("stage 4 execute guard did not report exact authorization blocker");
  }
}

for (const pattern of [
  /SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*["'][^"']+/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*[:=]\s*["'][^"']+/u,
  /publicDataSource:\s*"supabase"/u,
  /scoreSource:\s*"real"/u,
  /rawPayloadEcho:\s*true/u,
  /rowPayloadEcho:\s*true/u
]) {
  if (pattern.test(runner) || pattern.test(cli)) problems.push(`stage 4 files contain forbidden pattern: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "stage_4_bounded_supabase_write_and_post_run_review_complete",
      nextRoute: "twse_openapi_supabase_readonly_gate",
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

function readJson(filePath) {
  const text = read(filePath);
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${filePath} is not valid JSON: ${error.message}`);
    return {};
  }
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
