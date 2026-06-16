import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const packetPath = args.packet ?? "data/evidence-intake/phase-1-runtime-promotion-dry-run-packet.template.json";
const outPath = args.out ?? "tmp/phase-1-runtime-promotion-dry-run-packet-result.json";
const problems = [];
const unsafe = [];

const packetText = readText(packetPath);
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

for (const [key, expected] of [
  ["packetMode", "phase_1_runtime_promotion_dry_run_packet"],
  ["promotionAllowedNow", false],
  ["dryRunOnlyAllowedNow", true],
  ["publicDataSource", "mock"],
  ["scoreSource", "mock"]
]) {
  if (packet[key] !== expected) problems.push(`${key} must be ${JSON.stringify(expected)}`);
}

if (!["KEEP_MOCK_AND_MONITOR", "RUN_PROMOTION_DRY_RUN_ONLY"].includes(packet.operatorDecision)) {
  problems.push("operatorDecision must be KEEP_MOCK_AND_MONITOR or RUN_PROMOTION_DRY_RUN_ONLY");
}

for (const field of requiredFields) {
  if (!(field in packet)) problems.push(`${field} is required`);
}

const missingRequiredFields = requiredFields.filter((field) => !isNonEmptyString(packet[field]));
const fieldCompleteness = missingRequiredFields.length === 0 ? "complete" : "incomplete";
if (packet.requiredFieldCompleteness !== fieldCompleteness) {
  problems.push(`requiredFieldCompleteness must be ${fieldCompleteness}`);
}

forbiddenPatterns().forEach((pattern) => {
  if (pattern.test(packetText)) unsafe.push(`packet contains forbidden pattern ${pattern}`);
});

for (const field of requiredFields) {
  const value = packet[field];
  if (typeof value === "string" && mutatingCommandPattern().test(value)) {
    unsafe.push(`${field} appears to request runtime mutation`);
  }
}

const failClosed = problems.length > 0 || unsafe.length > 0 || missingRequiredFields.length > 0;
const status =
  unsafe.length > 0 || problems.length > 0
    ? "phase_1_runtime_promotion_dry_run_packet_rejected_unsafe_or_invalid"
    : missingRequiredFields.length > 0
      ? "phase_1_runtime_promotion_dry_run_packet_blocked_missing_required_fields"
      : "phase_1_runtime_promotion_dry_run_packet_shape_ready_no_execution";

const result = {
  status,
  ok: status === "phase_1_runtime_promotion_dry_run_packet_shape_ready_no_execution",
  failClosed,
  packetPath,
  outputPath: outPath,
  operatorDecision: packet.operatorDecision ?? null,
  promotionAllowedNow: false,
  dryRunOnlyAllowedNow: true,
  requiredFieldCompleteness: fieldCompleteness,
  missingRequiredFields,
  publicDataSource: "mock",
  scoreSource: "mock",
  safety: {
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
  },
  nextRoute:
    status === "phase_1_runtime_promotion_dry_run_packet_shape_ready_no_execution"
      ? "phase_1_runtime_promotion_operator_review_before_any_mutation"
      : "keep_mock_and_supply_missing_promotion_packet_fields",
  stopLine:
    "Dry-run validates field shape only. No SQL, Supabase read/write, env mutation, runtime flag mutation, market-data fetch, daily_prices mutation, public source promotion, or scoreSource=real occurred.",
  problems,
  unsafe
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));

if (unsafe.length > 0 || problems.length > 0) process.exit(1);

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

function parseJson(text, label) {
  try {
    return JSON.parse(text);
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

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
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

function mutatingCommandPattern() {
  return /\b(setx|vercel\s+env|supabase\s+db|psql|insert|update|delete|upsert|alter\s+table|drop\s+table)\b/iu;
}
