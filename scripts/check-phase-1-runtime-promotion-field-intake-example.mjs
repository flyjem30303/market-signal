import fs from "node:fs";
import { spawnSync } from "node:child_process";

const examplePath = "data/evidence-intake/phase-1-runtime-promotion-field-intake.example.json";
const runnerPath = "scripts/run-phase-1-runtime-promotion-dry-run-packet.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const outPath = "tmp/phase-1-runtime-promotion-field-intake-example-check.json";
const problems = [];

const exampleText = read(examplePath);
const example = parseJson(exampleText, examplePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredFields = [
  "runtimeFlagName",
  "runtimeFlagTargetValue",
  "rollbackOwner",
  "rollbackCommand",
  "readbackCommand",
  "productionSmokeCommand",
  "postPromotionReviewOwner",
  "publicCopyFallbackLine",
  "freshnessFallbackLine"
];

expect(example.packetMode, "phase_1_runtime_promotion_dry_run_packet", "example.packetMode");
expect(example.packetLabel, "EXAMPLE_ONLY_NOT_FOR_OPERATOR_USE", "example.packetLabel");
expect(example.exampleOnly, true, "example.exampleOnly");
expect(example.operatorDecision, "RUN_PROMOTION_DRY_RUN_ONLY", "example.operatorDecision");
expect(example.promotionAllowedNow, false, "example.promotionAllowedNow");
expect(example.dryRunOnlyAllowedNow, true, "example.dryRunOnlyAllowedNow");
expect(example.publicDataSource, "mock", "example.publicDataSource");
expect(example.scoreSource, "mock", "example.scoreSource");
expect(example.requiredFieldCompleteness, "complete", "example.requiredFieldCompleteness");

for (const field of requiredFields) {
  if (typeof example[field] !== "string" || example[field].trim() === "") problems.push(`${field} must be a non-empty string`);
  if (!String(example[field]).includes("EXAMPLE_ONLY")) problems.push(`${field} must be explicitly example-only`);
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(exampleText)) problems.push(`${examplePath} contains forbidden pattern ${pattern}`);
}

const run = spawnSync(process.execPath, [runnerPath, "--packet", examplePath, "--out", outPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

if (run.status !== 0) problems.push(`${runnerPath} exited ${run.status}`);
const result = parseJson(run.stdout, "runner stdout");
expect(result.status, "phase_1_runtime_promotion_dry_run_packet_shape_ready_no_execution", "result.status");
expect(result.ok, true, "result.ok");
expect(result.failClosed, false, "result.failClosed");
expect(result.promotionAllowedNow, false, "result.promotionAllowedNow");
expect(result.dryRunOnlyAllowedNow, true, "result.dryRunOnlyAllowedNow");
expect(result.publicDataSource, "mock", "result.publicDataSource");
expect(result.scoreSource, "mock", "result.scoreSource");
expect(result.nextRoute, "phase_1_runtime_promotion_operator_review_before_any_mutation", "result.nextRoute");

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-field-intake-example"] !==
  "node scripts/check-phase-1-runtime-promotion-field-intake-example.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-field-intake-example script`);
}

if (!reviewGate.includes("phase-1-runtime-promotion-field-intake-example")) {
  problems.push(`${reviewGatePath} missing phase-1-runtime-promotion-field-intake-example registration`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "phase_1_runtime_promotion_field_intake_example_ready_no_execution",
      runnerStatus: result.status,
      exampleOnly: true,
      nextRoute: "phase_1_runtime_promotion_operator_review_before_any_mutation",
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text, label) {
  const start = text.indexOf("{");
  if (start < 0) {
    problems.push(`${label} does not contain JSON`);
    return {};
  }
  try {
    return JSON.parse(text.slice(start));
  } catch (error) {
    problems.push(`${label} is not valid JSON: ${error.message}`);
    return {};
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /"promotionAllowedNow"\s*:\s*true/u,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /\b(setx|vercel\s+env|supabase\s+db|psql|insert|update|delete|upsert|alter\s+table|drop\s+table)\b/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
