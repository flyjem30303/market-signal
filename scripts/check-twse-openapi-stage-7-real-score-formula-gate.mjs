import fs from "node:fs";
import { spawnSync } from "node:child_process";

const formulaPath = "src/lib/twse-openapi-stage-7-real-score-formula.ts";
const cliPath = "scripts/run-twse-openapi-stage-7-real-score-formula-gate-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const roadmapPath = "docs/REAL_RUNTIME_PROMOTION_8_STAGE_ROADMAP.md";

const problems = [];

const formula = read(formulaPath);
const cli = read(cliPath);
const pkg = readJson(packagePath);
const reviewGate = read(reviewGatePath);
const status = read(statusPath);
const roadmap = read(roadmapPath);

for (const phrase of [
  "TWSE_OPENAPI_STAGE7_REAL_SCORE_FORMULA_BOUNDARY",
  "buildTwseOpenApiStage7RealScore",
  "dailyChangeScore",
  "movingAveragePostureScore",
  "volumeChangeScore",
  "volatilityScore",
  "dispersionScore",
  "compositeScore",
  "healthScore",
  "riskScore",
  "readableReasons",
  "noBuySellAdvice: true",
  "scoreSource: \"mock\"",
  "nextRoute: \"scoreSource_real_promotion_gate\""
]) {
  if (!formula.includes(phrase)) problems.push(`${formulaPath} missing: ${phrase}`);
}

for (const phrase of [
  "TWSE_OPENAPI_STAGE7_REAL_SCORE_FORMULA_BOUNDARY",
  "stage_7_real_score_formula_complete",
  "scoreSource_real_promotion_gate",
  "dailyChangeScore",
  "movingAveragePostureScore",
  "volumeChangeScore",
  "volatilityScore",
  "dispersionScore",
  "readableReasons",
  "scoreSource: \"mock\"",
  "rawPayloadEcho: false",
  "rowPayloadEcho: false",
  "secretsPrinted: false"
]) {
  if (!cli.includes(phrase)) problems.push(`${cliPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["run:twse-openapi-stage-7-real-score-formula-gate-once"] !==
  "node scripts/run-twse-openapi-stage-7-real-score-formula-gate-once.mjs"
) {
  problems.push(`${packagePath} missing run:twse-openapi-stage-7-real-score-formula-gate-once script`);
}

if (
  pkg.scripts?.["check:twse-openapi-stage-7-real-score-formula-gate"] !==
  "node scripts/check-twse-openapi-stage-7-real-score-formula-gate.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-stage-7-real-score-formula-gate script`);
}

for (const phrase of [
  "scripts/check-twse-openapi-stage-7-real-score-formula-gate.mjs",
  "twse-openapi-stage-7-real-score-formula-gate"
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "stage_7_real_score_formula_complete",
  "scoreSource_real_promotion_gate"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!roadmap.includes(phrase)) problems.push(`${roadmapPath} missing: ${phrase}`);
}

if (fs.existsSync(cliPath)) {
  const result = spawnSync(process.execPath, [cliPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 15000
  });
  const json = parseJsonOutput(`${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim());
  if (result.status !== 0 || json?.status !== "ok") {
    problems.push("stage 7 formula proof command should complete");
  }
  if (json?.score?.scoreSource !== "mock") {
    problems.push("stage 7 must not promote scoreSource to real");
  }
  if (json?.score?.noBuySellAdvice !== true) {
    problems.push("stage 7 must carry no-buy-sell-advice boundary");
  }
  if (!Array.isArray(json?.score?.readableReasons) || json.score.readableReasons.length < 4) {
    problems.push("stage 7 score proof must include readable reasons");
  }
  for (const key of ["dailyChangeScore", "movingAveragePostureScore", "volumeChangeScore", "volatilityScore", "dispersionScore"]) {
    const value = json?.score?.components?.[key];
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      problems.push(`stage 7 component ${key} must be a 0-100 number`);
    }
  }
  for (const key of ["compositeScore", "healthScore", "riskScore"]) {
    const value = json?.score?.[key];
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      problems.push(`stage 7 score ${key} must be a 0-100 number`);
    }
  }
}

for (const pattern of [
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
  if (pattern.test(formula) || pattern.test(cli)) {
    problems.push(`stage 7 files contain forbidden pattern: ${pattern}`);
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
      guardedStatus: "stage_7_real_score_formula_complete",
      nextRoute: "scoreSource_real_promotion_gate",
      formulaPath
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
