import fs from "node:fs";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-runtime-promotion-dry-run-packet.mjs";
const templatePath = "data/evidence-intake/phase-1-runtime-promotion-dry-run-packet.template.json";
const packagePath = "package.json";
const outPath = "tmp/phase-1-runtime-promotion-dry-run-packet-check.json";
const problems = [];

const run = spawnSync(process.execPath, [runnerPath, "--packet", templatePath, "--out", outPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

if (run.status !== 0) problems.push(`${runnerPath} exited ${run.status}`);
const result = parseJson(run.stdout, "runner stdout");
const saved = parseJson(readText(outPath), outPath);
const pkg = JSON.parse(readText(packagePath));
const runner = readText(runnerPath);
const template = readText(templatePath);

expect(result.status, "phase_1_runtime_promotion_dry_run_packet_blocked_missing_required_fields", "result.status");
expect(result.failClosed, true, "result.failClosed");
expect(result.promotionAllowedNow, false, "result.promotionAllowedNow");
expect(result.dryRunOnlyAllowedNow, true, "result.dryRunOnlyAllowedNow");
expect(result.publicDataSource, "mock", "result.publicDataSource");
expect(result.scoreSource, "mock", "result.scoreSource");
expect(result.requiredFieldCompleteness, "incomplete", "result.requiredFieldCompleteness");
expect(saved.status, result.status, "saved.status");

for (const field of [
  "runtimeFlagName",
  "runtimeFlagTargetValue",
  "rollbackOwner",
  "rollbackCommand",
  "readbackCommand",
  "productionSmokeCommand",
  "postPromotionReviewOwner",
  "publicCopyFallbackLine",
  "freshnessFallbackLine"
]) {
  if (!result.missingRequiredFields?.includes(field)) problems.push(`missingRequiredFields should include ${field}`);
  if (!template.includes(`"${field}": null`)) problems.push(`${templatePath} should keep ${field} null`);
}

for (const [key, expected] of Object.entries({
  sqlExecuted: false,
  supabaseConnectionAttempted: false,
  supabaseReadsEnabled: false,
  supabaseWritesEnabled: false,
  stagingRowsCreated: false,
  dailyPricesMutated: false,
  marketDataFetched: false,
  marketDataIngested: false,
  rawPayloadOutput: false,
  rowPayloadOutput: false,
  stockIdPayloadOutput: false,
  secretsOutput: false,
  envMutated: false,
  publicDataSourcePromoted: false,
  scoreSourcePromoted: false,
  productionValuesMutated: false
})) {
  expect(result.safety?.[key], expected, `result.safety.${key}`);
}

if (
  pkg.scripts?.["run:phase-1-runtime-promotion-dry-run-packet"] !==
  "node scripts/run-phase-1-runtime-promotion-dry-run-packet.mjs"
) {
  problems.push(`${packagePath} missing run:phase-1-runtime-promotion-dry-run-packet script`);
}
if (
  pkg.scripts?.["check:phase-1-runtime-promotion-dry-run-packet"] !==
  "node scripts/check-phase-1-runtime-promotion-dry-run-packet.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-dry-run-packet script`);
}

for (const [label, text] of [
  [templatePath, template]
]) {
  for (const pattern of [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /"promotionAllowedNow"\s*:\s*true/u,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /guaranteed return/iu,
    /buy now/iu
  ]) {
    if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
  }
}

for (const pattern of [
  /@supabase\/supabase-js/u,
  /createClient\s*\(/u,
  /\.from\s*\(/u,
  /\.insert\s*\(/u,
  /\.update\s*\(/u,
  /\.delete\s*\(/u,
  /\.upsert\s*\(/u
]) {
  if (pattern.test(runner)) problems.push(`${runnerPath} contains forbidden external execution pattern ${pattern}`);
}

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_dry_run_packet_fail_closed_verified"
        : "phase_1_runtime_promotion_dry_run_packet_check_blocked",
      runnerStatus: result.status ?? null,
      outputPath: outPath,
      promotionAllowedNow: false,
      dryRunOnlyAllowedNow: true,
      publicDataSource: "mock",
      scoreSource: "mock",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

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

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "{}";
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}
