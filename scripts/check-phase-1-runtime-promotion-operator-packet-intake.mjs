import fs from "node:fs";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const packetPath =
  args.packet ?? "data/evidence-intake/phase-1-runtime-promotion-field-intake.example.json";
const runnerPath = "scripts/run-phase-1-runtime-promotion-dry-run-packet.mjs";
const outPath = args.out ?? "tmp/phase-1-runtime-promotion-operator-packet-intake-check.json";
const problems = [];

const packetText = read(packetPath);
const packet = parseJson(packetText, packetPath);

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

if (packet.exampleOnly === true) problems.push("operator packet must not be exampleOnly");
if (packet.packetLabel === "EXAMPLE_ONLY_NOT_FOR_OPERATOR_USE") {
  problems.push("operator packet must not use the example-only packet label");
}
if (packetText.includes("EXAMPLE_ONLY")) problems.push("operator packet must not contain EXAMPLE_ONLY values");
if (packetText.includes('"runtimeFlagName": null')) problems.push("operator packet must not be the template");

for (const [key, expected] of Object.entries({
  packetMode: "phase_1_runtime_promotion_dry_run_packet",
  operatorDecision: "RUN_PROMOTION_DRY_RUN_ONLY",
  promotionAllowedNow: false,
  dryRunOnlyAllowedNow: true,
  publicDataSource: "mock",
  scoreSource: "mock",
  requiredFieldCompleteness: "complete"
})) {
  if (packet[key] !== expected) problems.push(`${key} must be ${JSON.stringify(expected)}`);
}

for (const field of requiredFields) {
  if (typeof packet[field] !== "string" || packet[field].trim() === "") {
    problems.push(`${field} must be a non-empty reviewed value`);
  }
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(packetText)) problems.push(`${packetPath} contains forbidden pattern ${pattern}`);
}

const run = spawnSync(process.execPath, [runnerPath, "--packet", packetPath, "--out", outPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

if (run.status !== 0) problems.push(`${runnerPath} exited ${run.status}`);
const result = parseJson(run.stdout, "runner stdout");

if (result.status !== "phase_1_runtime_promotion_dry_run_packet_shape_ready_no_execution") {
  problems.push(`runner status must be shape_ready_no_execution, got ${JSON.stringify(result.status)}`);
}
if (result.publicDataSource !== "mock") problems.push("runner must keep publicDataSource mock");
if (result.scoreSource !== "mock") problems.push("runner must keep scoreSource mock");
if (result.promotionAllowedNow !== false) problems.push("runner must keep promotionAllowedNow false");
if (result.dryRunOnlyAllowedNow !== true) problems.push("runner must keep dryRunOnlyAllowedNow true");

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_operator_packet_intake_ready_no_execution"
        : "phase_1_runtime_promotion_operator_packet_intake_blocked",
      packetPath,
      runnerStatus: result.status ?? null,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: ok
        ? "phase_1_runtime_promotion_operator_review_before_any_mutation"
        : "keep_mock_and_supply_non_example_operator_packet_fields",
      problems
    },
    null,
    2
  )
);

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const current = rawArgs[index];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    const next = rawArgs[index + 1];
    if (next && !next.startsWith("--")) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = "true";
    }
  }
  return parsed;
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
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
