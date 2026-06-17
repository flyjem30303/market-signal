import fs from "node:fs";
import { spawnSync } from "node:child_process";

const runnerPath = "src/lib/twse-openapi-stage-5-supabase-readonly-gate.ts";
const cliPath = "scripts/run-twse-openapi-stage-5-supabase-readonly-gate-once.mjs";
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
  "TWSE_OPENAPI_STAGE5_SUPABASE_READONLY_BOUNDARY",
  "TWSE_OPENAPI_STAGE5_READONLY_AUTHORIZATION_ID",
  "TWSE_OPENAPI_STAGE5_ALLOW_READONLY",
  "buildTwseOpenApiStage5ReadonlySnapshot",
  "classifyTwseOpenApiStage5ReadonlyState",
  "stage5_readonly_blocked_without_exact_authorization",
  "readMode: \"aggregate_shape_only\"",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "readonlyApiShape",
  "freshnessState",
  "current",
  "stale",
  "missing",
  "source_error",
  "nextRoute: \"publicDataSource_supabase_promotion_gate\""
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

for (const phrase of [
  "TWSE_OPENAPI_STAGE5_SUPABASE_READONLY_BOUNDARY",
  "stage5_readonly_blocked_without_exact_authorization",
  "stage_5_supabase_readonly_gate_complete",
  "publicDataSource_supabase_promotion_gate",
  "aggregate_shape_only",
  "rawPayloadEcho: false",
  "rowPayloadEcho: false",
  "secretsPrinted: false"
]) {
  if (!cli.includes(phrase)) problems.push(`${cliPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["run:twse-openapi-stage-5-supabase-readonly-gate-once"] !==
  "node scripts/run-twse-openapi-stage-5-supabase-readonly-gate-once.mjs"
) {
  problems.push(`${packagePath} missing run:twse-openapi-stage-5-supabase-readonly-gate-once script`);
}

if (
  pkg.scripts?.["check:twse-openapi-stage-5-supabase-readonly-gate"] !==
  "node scripts/check-twse-openapi-stage-5-supabase-readonly-gate.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-stage-5-supabase-readonly-gate script`);
}

for (const phrase of [
  "scripts/check-twse-openapi-stage-5-supabase-readonly-gate.mjs",
  "twse-openapi-stage-5-supabase-readonly-gate"
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "stage_5_supabase_readonly_gate_complete",
  "publicDataSource_supabase_promotion_gate"
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
    problems.push(`stage 5 dry-run command failed: ${dryRunOutput}`);
  }
  if (dryRunJson?.boundary?.publicDataSource !== "mock" || dryRunJson?.boundary?.scoreSource !== "mock") {
    problems.push("stage 5 dry-run did not preserve mock source/score boundary");
  }
  if (dryRunJson?.readonlyApiShape?.readMode !== "aggregate_shape_only") {
    problems.push("stage 5 dry-run missing aggregate_shape_only read mode");
  }
  if (!["current", "stale", "missing", "source_error"].includes(dryRunJson?.readonlyApiShape?.freshnessState)) {
    problems.push("stage 5 dry-run did not return a distinguishable freshness state");
  }
  if (dryRunJson?.readonlyApiShape?.rawPayloadEcho !== false || dryRunJson?.readonlyApiShape?.rowPayloadEcho !== false) {
    problems.push("stage 5 dry-run must not echo raw or row payloads");
  }
  if (dryRunJson?.readonlyApiShape?.secretsPrinted !== false) {
    problems.push("stage 5 dry-run must not print secrets");
  }

  for (const scenario of ["current", "stale", "missing", "source-error"]) {
    const result = spawnSync(process.execPath, [cliPath, "--scenario", scenario], {
      cwd: process.cwd(),
      encoding: "utf8",
      shell: false,
      timeout: 15000
    });
    const json = parseJsonOutput(`${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim());
    const expected = scenario === "source-error" ? "source_error" : scenario;
    if (result.status !== 0 || json?.readonlyApiShape?.freshnessState !== expected) {
      problems.push(`stage 5 scenario ${scenario} did not produce ${expected}`);
    }
  }

  const blockedRead = spawnSync(process.execPath, [cliPath, "--read-live"], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 15000
  });
  const blockedJson = parseJsonOutput(`${blockedRead.stdout ?? ""}\n${blockedRead.stderr ?? ""}`.trim());
  if (blockedRead.status === 0 || blockedJson?.status !== "blocked") {
    problems.push("stage 5 live readonly guard should block without authorization");
  }
  if (!String(blockedJson?.reason ?? "").includes("stage5_readonly_blocked_without_exact_authorization")) {
    problems.push("stage 5 live readonly guard did not report exact authorization blocker");
  }
}

for (const pattern of [
  /SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*["'][^"']+/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*[:=]\s*["'][^"']+/u,
  /publicDataSource:\s*"supabase"/u,
  /scoreSource:\s*"real"/u,
  /rawPayloadEcho:\s*true/u,
  /rowPayloadEcho:\s*true/u,
  /secretsPrinted:\s*true/u,
  /\.insert\(/u,
  /\.upsert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.rpc\(/u
]) {
  if (pattern.test(runner) || pattern.test(cli)) problems.push(`stage 5 files contain forbidden pattern: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "stage_5_supabase_readonly_gate_complete",
      nextRoute: "publicDataSource_supabase_promotion_gate",
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
