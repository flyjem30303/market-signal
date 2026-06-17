import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "src/lib/twse-openapi-stage-8-score-source-real-promotion-gate.ts";
const sourceStatusPath = "src/lib/repositories/market-signal-source-status.ts";
const stage7FormulaPath = "src/lib/twse-openapi-stage-7-real-score-formula.ts";
const stage7CliPath = "scripts/run-twse-openapi-stage-7-real-score-formula-gate-once.mjs";
const cliPath = "scripts/run-twse-openapi-stage-8-score-source-real-promotion-gate-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const roadmapPath = "docs/REAL_RUNTIME_PROMOTION_8_STAGE_ROADMAP.md";

const problems = [];

const gate = read(gatePath);
const sourceStatus = read(sourceStatusPath);
const stage7Formula = read(stage7FormulaPath);
const stage7Cli = read(stage7CliPath);
const cli = read(cliPath);
const pkg = readJson(packagePath);
const reviewGate = read(reviewGatePath);
const status = read(statusPath);
const roadmap = read(roadmapPath);

for (const phrase of [
  "TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_PROMOTION_BOUNDARY",
  "TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_APPROVAL",
  "buildTwseOpenApiStage8ScoreSourcePromotionSnapshot",
  "classifyTwseOpenApiStage8ScoreSourcePromotionDecision",
  "scoreSource: \"real\"",
  "publicScoreSource: \"real\"",
  "publicDataSource: \"supabase\"",
  "formulaStatus",
  "disclaimerVisible",
  "sourceDisclosureVisible",
  "updateTimeVisible",
  "noBuySellAdvice: true",
  "nextRoute: \"real_runtime_phase_1_complete\""
]) {
  if (!gate.includes(phrase)) problems.push(`${gatePath} missing: ${phrase}`);
}

for (const phrase of [
  "MARKET_SIGNAL_SCORE_SOURCE_GATE",
  "NEXT_PUBLIC_SCORE_SOURCE",
  "stage_8_score_source_real_approved",
  "publicScoreSource: scorePromotion.publicScoreSource",
  "resolvedScoreSource: scorePromotion.scoreSource",
  "scoreSource_real_promotion_gate_missing"
]) {
  if (!sourceStatus.includes(phrase)) problems.push(`${sourceStatusPath} missing: ${phrase}`);
}

for (const phrase of [
  "Daily change component",
  "Moving-average posture component",
  "Volume change component",
  "Volatility component",
  "Dispersion component"
]) {
  if (!stage7Formula.includes(phrase)) problems.push(`${stage7FormulaPath} missing readable phrase: ${phrase}`);
  if (!stage7Cli.includes(phrase)) problems.push(`${stage7CliPath} missing readable phrase: ${phrase}`);
}

for (const phrase of [
  "TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_PROMOTION_BOUNDARY",
  "stage_8_score_source_real_promotion_complete",
  "real_runtime_phase_1_complete",
  "stage_8_score_source_real_approved",
  "scoreSource: \"real\"",
  "publicScoreSource: \"real\"",
  "noBuySellAdvice: true",
  "rawPayloadEcho: false",
  "rowPayloadEcho: false",
  "secretsPrinted: false"
]) {
  if (!cli.includes(phrase)) problems.push(`${cliPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["run:twse-openapi-stage-8-score-source-real-promotion-gate-once"] !==
  "node scripts/run-twse-openapi-stage-8-score-source-real-promotion-gate-once.mjs"
) {
  problems.push(`${packagePath} missing run:twse-openapi-stage-8-score-source-real-promotion-gate-once script`);
}

if (
  pkg.scripts?.["check:twse-openapi-stage-8-score-source-real-promotion-gate"] !==
  "node scripts/check-twse-openapi-stage-8-score-source-real-promotion-gate.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-stage-8-score-source-real-promotion-gate script`);
}

for (const phrase of [
  "scripts/check-twse-openapi-stage-8-score-source-real-promotion-gate.mjs",
  "twse-openapi-stage-8-score-source-real-promotion-gate"
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "stage_8_score_source_real_promotion_complete",
  "real_runtime_phase_1_complete"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!roadmap.includes(phrase)) problems.push(`${roadmapPath} missing: ${phrase}`);
}

if (fs.existsSync(cliPath)) {
  const defaultRun = spawnSync(process.execPath, [cliPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 15000
  });
  const defaultJson = parseJsonOutput(`${defaultRun.stdout ?? ""}\n${defaultRun.stderr ?? ""}`.trim());
  if (defaultRun.status !== 0 || defaultJson?.status !== "ok") {
    problems.push("stage 8 default command should complete as fail-closed proof");
  }
  if (defaultJson?.promotion?.scoreSource !== "mock" || defaultJson?.promotion?.publicScoreSource !== "mock") {
    problems.push("stage 8 default command must fail closed to mock score source");
  }

  const promoted = spawnSync(process.execPath, [cliPath, "--scenario", "promoted"], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 15000
  });
  const promotedJson = parseJsonOutput(`${promoted.stdout ?? ""}\n${promoted.stderr ?? ""}`.trim());
  if (promoted.status !== 0 || promotedJson?.promotion?.scoreSource !== "real") {
    problems.push("stage 8 promoted scenario should resolve scoreSource to real");
  }
  if (promotedJson?.promotion?.publicScoreSource !== "real") {
    problems.push("stage 8 promoted scenario should expose publicScoreSource real");
  }
  if (promotedJson?.promotion?.publicDataSource !== "supabase") {
    problems.push("stage 8 promoted scenario requires publicDataSource supabase");
  }
  if (promotedJson?.promotion?.noBuySellAdvice !== true) {
    problems.push("stage 8 promoted scenario must carry no-buy-sell-advice boundary");
  }
}

for (const pattern of [
  /SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*["'][^"']+/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*[:=]\s*["'][^"']+/u,
  /rawPayloadEcho:\s*true/u,
  /rowPayloadEcho:\s*true/u,
  /secretsPrinted:\s*true/u,
  /\.insert\(/u,
  /\.upsert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.rpc\(/u
]) {
  if (pattern.test(gate) || pattern.test(cli) || pattern.test(sourceStatus)) {
    problems.push(`stage 8 files contain forbidden pattern: ${pattern}`);
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
      guardedStatus: "stage_8_score_source_real_promotion_complete",
      nextRoute: "real_runtime_phase_1_complete",
      gatePath
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
