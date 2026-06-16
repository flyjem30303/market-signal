import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_OPERATOR_AUTHORIZATION_RESPONSE_TEMPLATE.md";
const templatePath = "data/evidence-intake/phase-1-runtime-promotion-operator-authorization-response.template.json";
const requestPacketPath = "docs/PHASE_1_RUNTIME_PROMOTION_OPERATOR_AUTHORIZATION_REQUEST_PACKET.md";
const requestCheckerPath = "scripts/check-phase-1-runtime-promotion-operator-authorization-request-packet.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = read(docPath);
const templateText = read(templatePath);
const template = JSON.parse(templateText);
const requestPacket = read(requestPacketPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const requestCheck = runJson(requestCheckerPath);

const allowedOutcomes = ["REJECT_KEEP_MOCK", "APPROVE_DRY_RUN_ONLY", "APPROVE_BOUNDED_ATTEMPT_PREP_ONLY"];
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

for (const phrase of [
  "Status: `phase_1_runtime_promotion_operator_authorization_response_template_ready_no_execution`",
  "Decision: `KEEP_MOCK_RESPONSE_TEMPLATE_READY`",
  "`REJECT_KEEP_MOCK`",
  "`APPROVE_DRY_RUN_ONLY`",
  "`APPROVE_BOUNDED_ATTEMPT_PREP_ONLY`",
  "No response outcome may directly execute mutation",
  "`operatorOutcome=REJECT_KEEP_MOCK`",
  "`confirmationCompleteness=incomplete`",
  "`promotionAllowedNow=false`",
  "`dryRunOnlyAllowedNow=true`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`nextRoute=keep_mock_and_request_repair`",
  "`phase_1_runtime_promotion_dry_run_only_authorized_no_execution`",
  "`phase_1_runtime_promotion_pre_execution_packet_no_execution`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const key of confirmationKeys) {
  if (!doc.includes(`\`${key}\``)) problems.push(`${docPath} missing confirmation ${key}`);
  if (template.confirmations?.[key] !== false) problems.push(`${templatePath} confirmation ${key} must default false`);
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

expect(template.responseMode, "phase_1_runtime_promotion_operator_authorization_response", "template.responseMode");
expect(template.responseLabel, "PHASE_1_OPERATOR_AUTHORIZATION_RESPONSE_TEMPLATE_NO_EXECUTION", "template.responseLabel");
if (!allowedOutcomes.includes(template.operatorOutcome)) problems.push("template.operatorOutcome must be an allowed outcome");
expect(template.operatorOutcome, "REJECT_KEEP_MOCK", "template.operatorOutcome");
expect(template.promotionAllowedNow, false, "template.promotionAllowedNow");
expect(template.dryRunOnlyAllowedNow, true, "template.dryRunOnlyAllowedNow");
expect(template.publicDataSource, "mock", "template.publicDataSource");
expect(template.scoreSource, "mock", "template.scoreSource");
expect(template.confirmationCompleteness, "incomplete", "template.confirmationCompleteness");
expect(template.nextRoute, "keep_mock_and_request_repair", "template.nextRoute");

expect(requestCheck.status, "ok", "requestCheck.status");
expect(
  requestCheck.guardedStatus,
  "phase_1_runtime_promotion_operator_authorization_request_packet_ready_no_execution",
  "requestCheck.guardedStatus"
);

if (!requestPacket.includes("`phase_1_runtime_promotion_operator_authorization_response_template`")) {
  problems.push(`${requestPacketPath} must route to operator authorization response template`);
}

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-operator-authorization-response-template"] !==
  "node scripts/check-phase-1-runtime-promotion-operator-authorization-response-template.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-operator-authorization-response-template script`);
}

if (!reviewGate.includes("phase-1-runtime-promotion-operator-authorization-response-template")) {
  problems.push(`${reviewGatePath} missing operator authorization response template registration`);
}

for (const [label, text] of [
  [docPath, doc],
  [templatePath, templateText],
  [requestPacketPath, requestPacket]
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
        ? "phase_1_runtime_promotion_operator_authorization_response_template_ready_no_execution"
        : "phase_1_runtime_promotion_operator_authorization_response_template_blocked",
      decision: "KEEP_MOCK_RESPONSE_TEMPLATE_READY",
      promotionAllowedNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "phase_1_runtime_promotion_operator_authorization_response_intake_validator",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return filePath.endsWith(".json") ? "{}" : "";
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
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
