import { spawnSync } from "node:child_process";
import fs from "node:fs";

const validatorPath = "scripts/validate-supabase-readonly.mjs";
const packageJsonPath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredEnvNames = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_READONLY_VALIDATE_CONFIRMATION"
];

const requiredObjects = [
  "daily_prices",
  "twse_stock_day_staging",
  "market_assets",
  "model_runs",
  "data_freshness"
];

const childEnv = { ...process.env };
for (const name of requiredEnvNames) {
  delete childEnv[name];
}

const result = spawnSync(process.execPath, [validatorPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: childEnv,
  shell: false
});

const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
const failures = [];
let parsed = null;

try {
  parsed = JSON.parse(output);
} catch (error) {
  failures.push(`validator output is not JSON: ${error.message}`);
}

if (result.status !== 1) failures.push(`expected fail-closed exit code 1, got ${result.status}`);
if (result.signal) failures.push(`validator ended with signal ${result.signal}`);

if (parsed) {
  expectEqual(parsed.confirmation, "missing_or_invalid", "confirmation");
  expectEqual(parsed.connection, "not_run", "connection");
  expectEqual(parsed.mode, "read_only_remote_validation", "mode");
  expectEqual(parsed.reason, "missing_required_environment", "reason");
  expectEqual(parsed.status, "blocked", "status");
  expectEqual(parsed.rowLimit, 5, "rowLimit");

  for (const name of requiredEnvNames.filter((name) => name !== "SUPABASE_READONLY_VALIDATE_CONFIRMATION")) {
    expectEqual(parsed.env?.[name], "missing", `env.${name}`);
  }

  for (const flag of [
    "filesWritten",
    "mutations",
    "publicClaimsChanged",
    "rowPayloadsPrinted",
    "rpcCalled",
    "scoreSourceRealChanged",
    "secretsPrinted",
    "sourceDepthReadyChanged",
    "sqlExecuted"
  ]) {
    expectEqual(parsed[flag], false, flag);
  }

  const objectNames = Array.isArray(parsed.objects) ? parsed.objects.map((object) => object.name) : [];
  if (JSON.stringify(objectNames) !== JSON.stringify(requiredObjects)) {
    failures.push(`objects order mismatch: ${JSON.stringify(objectNames)}`);
  }

  for (const object of parsed.objects ?? []) {
    if (object.reachable !== "not_run" || object.countStatus !== "not_run") {
      failures.push(`object ${object.name} must remain not_run in fail-closed local contract`);
    }
  }
}

const validatorSource = fs.readFileSync(validatorPath, "utf8");
for (const phrase of [
  "errorCategory",
  "errorCode",
  "errorCodeState",
  "object_missing_or_schema_cache",
  "access_policy_or_credential_scope",
  "project_url_or_network"
]) {
  if (!validatorSource.includes(phrase)) failures.push(`validator source missing sanitized classifier token: ${phrase}`);
}

for (const forbidden of ["message:", "details:", "hint:", "error.message", "error.details", "error.hint"]) {
  if (validatorSource.includes(forbidden)) failures.push(`validator source must not expose raw error field: ${forbidden}`);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const packageScript = packageJson.scripts?.["check:supabase-readonly-validator-output-contract"];

if (packageScript !== "node scripts/check-supabase-readonly-validator-output-contract.mjs") {
  failures.push(`package script mismatch: ${packageScript ?? "missing"}`);
}

if (!reviewGate.includes("scripts/check-supabase-readonly-validator-output-contract.mjs")) {
  failures.push("review gate does not include output contract checker");
}

console.log(
  JSON.stringify(
    {
      checkedMode: "fail_closed_without_env_or_confirmation",
      failures,
      status: failures.length === 0 ? "ok" : "blocked",
      validator: validatorPath
    },
    null,
    2
  )
);

if (failures.length > 0) {
  process.exitCode = 1;
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(`${label} expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}
