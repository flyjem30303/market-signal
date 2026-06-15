import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TWII_OPERATOR_NO_SECRET_INTAKE_INSTRUCTIONS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";

const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const projectStatus = read(statusPath);

const intake = runJson("scripts/report-twii-operator-values-intake-readiness-surface-gate-preflight.mjs");
const shape = runJson("scripts/report-twii-operator-values-shape-recheck-gate-preflight.mjs");
const stopline = runJson("scripts/report-twii-final-authorization-stopline-go-no-go-gate.mjs");
const serverOnly = runJson("scripts/report-twii-server-only-pre-execution-integration-gate.mjs");

for (const phrase of [
  "Status: `twii_operator_no_secret_intake_instructions_ready_no_execution`",
  "This document is an instruction surface only.",
  "does not collect values, store values, execute SQL, connect to Supabase, mutate `daily_prices`, accept candidate rows, promote public data, enable real scoring, approve legal terms, or provide investment advice",
  "twii_operator_values_intake_readiness_surface_gate_preflight_ready_no_execution",
  "twii_operator_values_shape_recheck_gate_preflight_ready_no_execution",
  "twii_final_authorization_stopline_go_no_go_gate_ready_no_execution",
  "twii_server_only_pre_execution_integration_gate_ready_no_execution",
  "publicDataSource=mock",
  "scoreSource=mock",
  "runnerExecutableNow=false",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "real operator decision status",
  "real operator attestation",
  "explicit execute switch value",
  "explicit confirmation phrase value",
  "server-only credential presence result",
  "PM may only record presence/shape outcomes",
  "PM must not record the value bodies",
  "decisionPresence",
  "attestationPresence",
  "executeSwitchPresence",
  "confirmationPhrasePresence",
  "serverOnlyCredentialPresence",
  "safeOutcomeSummary",
  "operator_supplies_external_values_then_pm_runs_pre_execution_readiness_recheck",
  "PM must not paste those values back into tracked files"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const forbidden of [
  /from\s+["']@supabase\/supabase-js["']/u,
  /createClient\s*\(/u,
  /\.from\s*\(/u,
  /\.insert\s*\(/u,
  /\.upsert\s*\(/u,
  /\.update\s*\(/u,
  /\.delete\s*\(/u,
  /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /SQL is approved/iu,
  /Supabase write is approved/iu,
  /daily_prices mutation is approved/iu,
  /market data fetch is approved/iu,
  /investment advice approved/iu,
  /guaranteed outcome approved/iu
]) {
  if (forbidden.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${forbidden}`);
}

if (pkg.scripts?.["check:twii-operator-no-secret-intake-instructions"] !== "node scripts/check-twii-operator-no-secret-intake-instructions.mjs") {
  problems.push(`${packagePath} missing check:twii-operator-no-secret-intake-instructions`);
}

for (const phrase of [
  "scripts/check-twii-operator-no-secret-intake-instructions.mjs",
  "twii-operator-no-secret-intake-instructions"
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "TWII Operator No-Secret Intake Instructions",
  "twii_operator_no_secret_intake_instructions_ready_no_execution"
]) {
  if (!projectStatus.includes(phrase)) problems.push(`${statusPath} missing phrase: ${phrase}`);
}

expect(intake.status, "twii_operator_values_intake_readiness_surface_gate_preflight_ready_no_execution", "intake.status");
expect(intake.currentIntakeStatus, "blocked_waiting_external_operator_values", "intake.currentIntakeStatus");
expect(intake.intakeState?.externalOnlyValuesProvidedNow, false, "intake external values");
expect(intake.intakeState?.executionAllowedNow, false, "intake execution");

expect(shape.status, "twii_operator_values_shape_recheck_gate_preflight_ready_no_execution", "shape.status");
expect(shape.currentRecheckStatus, "shape_recheck_ready_waiting_external_values", "shape.currentRecheckStatus");
expect(shape.shapeState?.realValuesProvidedNow, false, "shape real values");
expect(shape.shapeState?.executionAllowedNow, false, "shape execution");

expect(stopline.status, "twii_final_authorization_stopline_go_no_go_gate_ready_no_execution", "stopline.status");
expect(stopline.currentGoNoGoStatus, "final_authorization_stopline_go_no_go_ready_waiting_external_values", "stopline.currentGoNoGoStatus");
expect(stopline.goNoGoState?.runnerExecutableNow, false, "stopline runner");
expect(stopline.goNoGoState?.executionAllowedNow, false, "stopline execution");

expect(serverOnly.status, "twii_server_only_pre_execution_integration_gate_ready_no_execution", "serverOnly.status");
expect(serverOnly.currentIntegrationStatus, "server_only_pre_execution_integration_ready_waiting_external_values", "serverOnly.currentIntegrationStatus");
expect(serverOnly.integrationState?.runnerExecutableNow, false, "serverOnly runner");
expect(serverOnly.integrationState?.executionAllowedNow, false, "serverOnly execution");

const status = problems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "twii_operator_no_secret_intake_instructions_ready_no_execution",
      currentIntakeStatus: intake.currentIntakeStatus ?? null,
      currentShapeRecheckStatus: shape.currentRecheckStatus ?? null,
      currentGoNoGoStatus: stopline.currentGoNoGoStatus ?? null,
      currentServerOnlyStatus: serverOnly.currentIntegrationStatus ?? null,
      publicDataSource: intake.safety?.publicDataSource ?? null,
      scoreSource: intake.safety?.scoreSource ?? null,
      executionAllowedNow: false,
      problems
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} must be ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
}

function runJson(path) {
  const run = spawnSync(process.execPath, [path], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${path} exited ${run.status}`);
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${path} did not emit JSON: ${error.message}`);
    return {};
  }
}
