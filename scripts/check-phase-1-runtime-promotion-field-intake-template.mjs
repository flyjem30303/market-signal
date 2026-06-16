import fs from "node:fs";
import { spawnSync } from "node:child_process";

const templatePath = "data/evidence-intake/phase-1-runtime-promotion-field-intake.template.json";
const runnerPath = "scripts/run-phase-1-runtime-promotion-dry-run-packet.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const outPath = "tmp/phase-1-runtime-promotion-field-intake-template-check.json";
const problems = [];

const templateText = read(templatePath);
const template = parseJson(templateText, templatePath);
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

expect(template.packetMode, "phase_1_runtime_promotion_dry_run_packet", "template.packetMode");
expect(template.operatorDecision, "RUN_PROMOTION_DRY_RUN_ONLY", "template.operatorDecision");
expect(template.promotionAllowedNow, false, "template.promotionAllowedNow");
expect(template.dryRunOnlyAllowedNow, true, "template.dryRunOnlyAllowedNow");
expect(template.publicDataSource, "mock", "template.publicDataSource");
expect(template.scoreSource, "mock", "template.scoreSource");
expect(template.requiredFieldCompleteness, "incomplete", "template.requiredFieldCompleteness");

for (const field of requiredFields) {
  expect(template[field], null, `template.${field}`);
  if (!template.fieldOwners?.[field]) problems.push(`fieldOwners missing ${field}`);
  if (!template.fieldInstructions?.[field]) problems.push(`fieldInstructions missing ${field}`);
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(templateText)) problems.push(`${templatePath} contains forbidden pattern ${pattern}`);
}

const run = spawnSync(process.execPath, [runnerPath, "--packet", templatePath, "--out", outPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

if (run.status !== 0) problems.push(`${runnerPath} exited ${run.status}`);
const result = parseJson(run.stdout, "runner stdout");
expect(result.status, "phase_1_runtime_promotion_dry_run_packet_blocked_missing_required_fields", "result.status");
expect(result.failClosed, true, "result.failClosed");
expect(result.publicDataSource, "mock", "result.publicDataSource");
expect(result.scoreSource, "mock", "result.scoreSource");

for (const field of requiredFields) {
  if (!result.missingRequiredFields?.includes(field)) problems.push(`runner missingRequiredFields should include ${field}`);
}

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-field-intake-template"] !==
  "node scripts/check-phase-1-runtime-promotion-field-intake-template.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-field-intake-template script`);
}

if (!reviewGate.includes("phase-1-runtime-promotion-field-intake-template")) {
  problems.push(`${reviewGatePath} missing phase-1-runtime-promotion-field-intake-template registration`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "phase_1_runtime_promotion_field_intake_template_ready_keep_mock",
      runnerStatus: result.status,
      nextRoute: "phase_1_runtime_promotion_packet_field_intake_or_keep_mock_runtime",
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
    /guaranteed return/iu,
    /buy now/iu
  ];
}
