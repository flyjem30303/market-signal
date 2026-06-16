import fs from "node:fs";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_OPERATOR_DECISION_GATE.md";
const explicitDecisionPath = "docs/PHASE_1_RUNTIME_PROMOTION_EXPLICIT_GO_NO_GO_DECISION.md";
const packagePath = "package.json";

const problems = [];
const doc = readText(docPath);
const explicitDecision = readText(explicitDecisionPath);
const pkg = JSON.parse(readText(packagePath));

for (const phrase of [
  "Status: `phase_1_runtime_promotion_operator_decision_gate_ready_keep_mock`",
  "Current operator decision: `KEEP_MOCK_AND_MONITOR`",
  "`RUN_PROMOTION_DRY_RUN_ONLY`",
  "`AUTHORIZE_BOUNDED_PUBLIC_SOURCE_PROMOTION`",
  "\"operatorDecision\": \"KEEP_MOCK_AND_MONITOR\"",
  "\"promotionAllowedNow\": false",
  "\"publicDataSource\": \"mock\"",
  "\"scoreSource\": \"mock\"",
  "`phase_1_runtime_promotion_keep_mock_monitoring_or_future_bounded_promotion_packet`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

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
  if (!doc.includes(`\`${field}\``)) problems.push(`${docPath} missing required field: ${field}`);
  if (!doc.includes(`"${field}": null`)) problems.push(`${docPath} payload must keep ${field} null`);
}

for (const phrase of [
  "operator choice is not one of the three allowed choices",
  "`promotionAllowedNow` is `true`",
  "`publicDataSource` is not `mock`",
  "`scoreSource` is not `mock`",
  "any future promotion field is filled in this keep-mock gate"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing fail-closed rule: ${phrase}`);
}

for (const phrase of [
  "run SQL",
  "write Supabase",
  "create staging rows",
  "mutate `daily_prices`",
  "raw market data",
  "print secrets",
  "promote `publicDataSource=supabase`",
  "promote `scoreSource=real`",
  "investment advice"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard boundary: ${phrase}`);
}

if (!explicitDecision.includes("`phase_1_runtime_promotion_operator_decision_gate`")) {
  problems.push(`${explicitDecisionPath} must route to operator decision gate`);
}

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-operator-decision-gate"] !==
  "node scripts/check-phase-1-runtime-promotion-operator-decision-gate.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-operator-decision-gate script`);
}

for (const pattern of [
  /@supabase\/supabase-js/u,
  /createClient\s*\(/u,
  /\.from\s*\(/u,
  /\.insert\s*\(/u,
  /\.update\s*\(/u,
  /\.delete\s*\(/u,
  /\.upsert\s*\(/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /"promotionAllowedNow":\s*true/u,
  /"publicDataSource":\s*"supabase"/u,
  /"scoreSource":\s*"real"/u,
  /SQL execution is approved/iu,
  /Supabase write is approved/iu,
  /guaranteed return/iu,
  /buy now/iu
]) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
}

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_operator_decision_gate_ready_keep_mock"
        : "phase_1_runtime_promotion_operator_decision_gate_blocked",
      operatorDecision: "KEEP_MOCK_AND_MONITOR",
      promotionAllowedNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "phase_1_runtime_promotion_keep_mock_monitoring_or_future_bounded_promotion_packet",
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
    return "{}";
  }
}
