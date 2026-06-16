import fs from "node:fs";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_OPERATOR_AUTHORIZATION_RESPONSE_INTAKE_VALIDATOR.md";
const responsePath =
  args.response ?? "data/evidence-intake/phase-1-runtime-promotion-operator-authorization-response.accepted-example.json";
const templateCheckerPath = "scripts/check-phase-1-runtime-promotion-operator-authorization-response-template.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = read(docPath);
const responseText = read(responsePath);
const response = parseJson(responseText, responsePath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const templateCheck = runJson(templateCheckerPath);

const confirmationKeys = [
  "runtimeFlagNameReviewed",
  "futureTargetValueReviewed",
  "rollbackOwnerAvailable",
  "rollbackShapeReviewed",
  "readbackCommandShapeReviewed",
  "productionSmokeCommandShapeReviewed",
  "postRunReviewOwnerAvailable",
  "publicFallbackCopyReviewed",
  "freshnessFallbackCopyReviewed",
  "noSecretValuesPrintedOrRequested",
  "noRawRowPayloadsPrintedOrRequested",
  "noInvestmentAdviceOrRealtimeGuarantee"
];

const routeByOutcome = {
  REJECT_KEEP_MOCK: "keep_mock_and_request_repair",
  APPROVE_DRY_RUN_ONLY: "phase_1_runtime_promotion_dry_run_only_authorized_no_execution",
  APPROVE_BOUNDED_ATTEMPT_PREP_ONLY: "phase_1_runtime_promotion_pre_execution_packet_no_execution"
};

for (const phrase of [
  "Status: `phase_1_runtime_promotion_operator_authorization_response_intake_validator_ready_no_execution`",
  "Decision: `KEEP_MOCK_RESPONSE_INTAKE_READY`",
  "`responseMode=phase_1_runtime_promotion_operator_authorization_response`",
  "`responseLabel=PHASE_1_OPERATOR_AUTHORIZATION_RESPONSE_FILLED_NO_EXECUTION`",
  "`confirmationCompleteness=complete`",
  "`promotionAllowedNow=false`",
  "`dryRunOnlyAllowedNow=true`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`phase_1_runtime_promotion_dry_run_only_authorized_no_execution`",
  "`phase_1_runtime_promotion_pre_execution_packet_no_execution`",
  "`keep_mock_and_request_repair`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "SQL execution",
  "Supabase read/write",
  "staging-row creation",
  "`daily_prices` mutation",
  "market-data fetch",
  "raw payload",
  "production environment mutation",
  "runtime flag mutation",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "real-time precision claim",
  "complete-market coverage claim",
  "investment-advice claim"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

expect(templateCheck.status, "ok", "templateCheck.status");
expect(
  templateCheck.guardedStatus,
  "phase_1_runtime_promotion_operator_authorization_response_template_ready_no_execution",
  "templateCheck.guardedStatus"
);

expect(response.responseMode, "phase_1_runtime_promotion_operator_authorization_response", "response.responseMode");
expect(response.responseLabel, "PHASE_1_OPERATOR_AUTHORIZATION_RESPONSE_FILLED_NO_EXECUTION", "response.responseLabel");
expect(response.promotionAllowedNow, false, "response.promotionAllowedNow");
expect(response.dryRunOnlyAllowedNow, true, "response.dryRunOnlyAllowedNow");
expect(response.publicDataSource, "mock", "response.publicDataSource");
expect(response.scoreSource, "mock", "response.scoreSource");
expect(response.confirmationCompleteness, "complete", "response.confirmationCompleteness");

if (!Object.hasOwn(routeByOutcome, response.operatorOutcome)) {
  problems.push(`response.operatorOutcome is not allowed: ${JSON.stringify(response.operatorOutcome)}`);
} else {
  expect(response.nextRoute, routeByOutcome[response.operatorOutcome], "response.nextRoute");
}

for (const key of confirmationKeys) {
  if (response.confirmations?.[key] !== true) problems.push(`response.confirmations.${key} must be true`);
}

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-operator-authorization-response-intake-validator"] !==
  "node scripts/check-phase-1-runtime-promotion-operator-authorization-response-intake-validator.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-operator-authorization-response-intake-validator script`);
}

if (!reviewGate.includes("phase-1-runtime-promotion-operator-authorization-response-intake-validator")) {
  problems.push(`${reviewGatePath} missing operator authorization response intake validator registration`);
}

for (const [label, text] of [
  [docPath, doc],
  [responsePath, responseText]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
  }
}

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_operator_authorization_response_intake_validator_ready_no_execution"
        : "phase_1_runtime_promotion_operator_authorization_response_intake_validator_blocked",
      responsePath,
      operatorOutcome: response.operatorOutcome ?? null,
      promotionAllowedNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: ok ? response.nextRoute : "keep_mock_and_request_repair",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

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
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}

function runJson(scriptPath) {
  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${scriptPath} exited ${run.status}`);
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${scriptPath} did not emit JSON: ${error.message}`);
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
    /\b(setx|vercel\s+env|supabase\s+db|psql|insert|update|delete|upsert|alter\s+table|drop\s+table)\b/iu,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
