import fs from "node:fs";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_FINAL_OPERATOR_INPUT_SURFACE.md";
const templatePath = "data/evidence-intake/phase-1-runtime-promotion-final-operator-input.template.json";
const finalBlockerPath = "src/lib/phase-1-runtime-promotion-final-blocker-contract.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = readText(docPath);
const templateText = readText(templatePath);
const template = parseJson(templateText, templatePath);
const finalBlocker = readText(finalBlockerPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);

const confirmationKeys = [
  "phase1UniverseReviewed",
  "sourceDepthAcceptedForPhase1Scope",
  "dataQualityAcceptedForPhase1Scope",
  "boundedExecutionPacketReviewed",
  "aggregateReadbackReviewed",
  "rollbackOrQuarantineReviewed",
  "postRunReviewReviewed",
  "publicRuntimeFactorySwitchReviewed",
  "claimAndDisclosureBoundaryReviewed",
  "noSecretsOrPayloadsIncluded",
  "noDirectMutationRequested"
];

for (const phrase of [
  "Status: `phase_1_runtime_promotion_final_operator_input_surface_ready_no_execution`",
  "Decision: `KEEP_MOCK_FINAL_INPUT_SURFACE_READY`",
  "`TWII`",
  "Taiwan listed-stock daily close",
  "ETF coverage, including `0050` and `006208`, is deferred to Phase 1.1",
  "Source depth accepted for Phase 1 scope",
  "Data quality accepted for local Phase 1 scoring",
  "Row coverage accepted for the narrowed Phase 1 universe",
  "NO_GO_KEEP_MOCK",
  "GO_PREPARE_BOUNDED_PACKET_ONLY",
  "No allowed outcome may directly execute mutation",
  "phase_1_runtime_promotion_narrowed_bounded_packet_readiness_no_execution",
  "keep_mock_and_request_repair"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const key of confirmationKeys) {
  if (!doc.includes(`\`${key}\``)) problems.push(`${docPath} missing confirmation ${key}`);
  if (template.confirmations?.[key] !== false) problems.push(`${templatePath} confirmation ${key} must default false`);
}

for (const stop of [
  "SQL execution",
  "Supabase read/write",
  "staging-row creation",
  "`daily_prices` mutation",
  "raw market-data fetch",
  "raw payload",
  "production environment mutation",
  "public runtime factory switch",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "real-time precision claim",
  "complete-market coverage claim",
  "investment-advice claim"
]) {
  if (!doc.includes(stop)) problems.push(`${docPath} missing stop condition: ${stop}`);
}

expect(template.responseMode, "phase_1_runtime_promotion_final_operator_input", "template.responseMode");
expect(template.responseLabel, "PHASE_1_FINAL_OPERATOR_INPUT_SURFACE_TEMPLATE_NO_EXECUTION", "template.responseLabel");
expect(template.phase1Universe, "twii_plus_listed_stock_daily_close", "template.phase1Universe");
expect(template.operatorOutcome, "NO_GO_KEEP_MOCK", "template.operatorOutcome");
expect(template.confirmationCompleteness, "incomplete", "template.confirmationCompleteness");
expect(template.promotionAllowedNow, false, "template.promotionAllowedNow");
expect(template.writeGateExecutableNow, false, "template.writeGateExecutableNow");
expect(template.publicDataSource, "mock", "template.publicDataSource");
expect(template.scoreSource, "mock", "template.scoreSource");
expect(template.nextRoute, "keep_mock_and_request_repair", "template.nextRoute");

if (!Array.isArray(template.allowedOutcomes) || !template.allowedOutcomes.includes("GO_PREPARE_BOUNDED_PACKET_ONLY")) {
  problems.push(`${templatePath} missing allowed GO_PREPARE_BOUNDED_PACKET_ONLY outcome`);
}

for (const phrase of [
  "narrowed TWII plus listed-stock bounded packet inputs",
  "historical ETF-scoped packet",
  "current Phase 1 candidate artifact"
]) {
  if (!finalBlocker.includes(phrase)) problems.push(`${finalBlockerPath} missing final input surface linkage: ${phrase}`);
}

if (
  packageJson.scripts?.["check:phase-1-runtime-promotion-final-operator-input-surface"] !==
  "node scripts/check-phase-1-runtime-promotion-final-operator-input-surface.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-final-operator-input-surface script`);
}

if (!reviewGate.includes("scripts/check-phase-1-runtime-promotion-final-operator-input-surface.mjs")) {
  problems.push(`${reviewGatePath} missing final operator input surface checker`);
}

if (!reviewGate.includes('"phase-1-runtime-promotion-final-operator-input-surface"')) {
  problems.push(`${reviewGatePath} missing focused final operator input surface gate name`);
}

for (const [label, text] of [
  [docPath, doc],
  [templatePath, templateText],
  [finalBlockerPath, finalBlocker]
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
        ? "phase_1_runtime_promotion_final_operator_input_surface_ready_no_execution"
        : "phase_1_runtime_promotion_final_operator_input_surface_blocked",
      decision: "KEEP_MOCK_FINAL_INPUT_SURFACE_READY",
      promotionAllowedNow: false,
      writeGateExecutableNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "phase_1_runtime_promotion_narrowed_bounded_packet_readiness_no_execution",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function readText(filePath) {
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
    /"writeGateExecutableNow"\s*:\s*true/u,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
