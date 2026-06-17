import fs from "node:fs";
import { spawnSync } from "node:child_process";

const runnerPath = "src/lib/twse-openapi-stage-6-public-data-source-promotion-gate.ts";
const sourceStatusPath = "src/lib/repositories/market-signal-source-status.ts";
const cliPath = "scripts/run-twse-openapi-stage-6-public-data-source-promotion-gate-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const roadmapPath = "docs/REAL_RUNTIME_PROMOTION_8_STAGE_ROADMAP.md";

const problems = [];

const runner = read(runnerPath);
const sourceStatus = read(sourceStatusPath);
const cli = read(cliPath);
const pkg = readJson(packagePath);
const reviewGate = read(reviewGatePath);
const status = read(statusPath);
const roadmap = read(roadmapPath);

for (const phrase of [
  "TWSE_OPENAPI_STAGE6_PUBLIC_DATA_SOURCE_PROMOTION_BOUNDARY",
  "MARKET_SIGNAL_SUPABASE_PROMOTION_GATE",
  "stage_6_public_data_source_supabase_approved",
  "buildTwseOpenApiStage6PromotionSnapshot",
  "classifyTwseOpenApiStage6PromotionDecision",
  "failClosedReason",
  "sourceDisclosure",
  "updateTimeRequired",
  "staleDataBehavior: \"fail_closed\"",
  "publicDataSource: \"supabase\"",
  "scoreSource: \"mock\"",
  "nextRoute: \"real_score_formula_gate\""
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

for (const phrase of [
  "TWSE_OPENAPI_STAGE6_PUBLIC_DATA_SOURCE_PROMOTION_BOUNDARY",
  "stage_6_public_data_source_supabase_promotion_complete",
  "real_score_formula_gate",
  "publicDataSource: \"supabase\"",
  "scoreSource: \"mock\"",
  "fail_closed",
  "rawPayloadEcho: false",
  "rowPayloadEcho: false",
  "secretsPrinted: false"
]) {
  if (!cli.includes(phrase)) problems.push(`${cliPath} missing: ${phrase}`);
}

for (const phrase of [
  "MARKET_SIGNAL_SUPABASE_PROMOTION_GATE",
  "stage_6_public_data_source_supabase_approved",
  "resolvedSource: \"supabase\"",
  "publicScoreSource: \"mock\"",
  "stage_6_promotion_gate_missing"
]) {
  if (!sourceStatus.includes(phrase)) problems.push(`${sourceStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["run:twse-openapi-stage-6-public-data-source-promotion-gate-once"] !==
  "node scripts/run-twse-openapi-stage-6-public-data-source-promotion-gate-once.mjs"
) {
  problems.push(`${packagePath} missing run:twse-openapi-stage-6-public-data-source-promotion-gate-once script`);
}

if (
  pkg.scripts?.["check:twse-openapi-stage-6-public-data-source-promotion-gate"] !==
  "node scripts/check-twse-openapi-stage-6-public-data-source-promotion-gate.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-stage-6-public-data-source-promotion-gate script`);
}

for (const phrase of [
  "scripts/check-twse-openapi-stage-6-public-data-source-promotion-gate.mjs",
  "twse-openapi-stage-6-public-data-source-promotion-gate"
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "stage_6_public_data_source_supabase_promotion_complete",
  "real_score_formula_gate"
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
  const dryRunJson = parseJsonOutput(`${dryRun.stdout ?? ""}\n${dryRun.stderr ?? ""}`.trim());
  if (dryRun.status !== 0 || dryRunJson?.status !== "ok") {
    problems.push("stage 6 default command should complete as fail-closed proof");
  }
  if (dryRunJson?.promotion?.resolvedSource !== "mock") {
    problems.push("stage 6 default command must fail closed to mock");
  }
  if (dryRunJson?.promotion?.scoreSource !== "mock") {
    problems.push("stage 6 must keep scoreSource mock");
  }

  const promoted = spawnSync(process.execPath, [cliPath, "--scenario", "promoted"], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 15000
  });
  const promotedJson = parseJsonOutput(`${promoted.stdout ?? ""}\n${promoted.stderr ?? ""}`.trim());
  if (promoted.status !== 0 || promotedJson?.promotion?.resolvedSource !== "supabase") {
    problems.push("stage 6 promoted scenario should resolve public data source to supabase");
  }
  if (promotedJson?.promotion?.scoreSource !== "mock") {
    problems.push("stage 6 promoted scenario must keep scoreSource mock");
  }
  if (promotedJson?.promotion?.sourceDisclosure !== "TWSE OpenAPI via data.gov open data") {
    problems.push("stage 6 promoted scenario must carry public source disclosure");
  }
  if (promotedJson?.promotion?.updateTimeRequired !== true) {
    problems.push("stage 6 promoted scenario must require update-time display");
  }
  if (promotedJson?.promotion?.staleDataBehavior !== "fail_closed") {
    problems.push("stage 6 promoted scenario must fail closed on stale data");
  }
}

for (const pattern of [
  /SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*["'][^"']+/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*[:=]\s*["'][^"']+/u,
  /scoreSource:\s*"real"/u,
  /publicScoreSource:\s*"real"/u,
  /rawPayloadEcho:\s*true/u,
  /rowPayloadEcho:\s*true/u,
  /secretsPrinted:\s*true/u,
  /\.insert\(/u,
  /\.upsert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.rpc\(/u
]) {
  if (pattern.test(runner) || pattern.test(cli) || pattern.test(sourceStatus)) {
    problems.push(`stage 6 files contain forbidden pattern: ${pattern}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "stage_6_public_data_source_supabase_promotion_complete",
      nextRoute: "real_score_formula_gate",
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
