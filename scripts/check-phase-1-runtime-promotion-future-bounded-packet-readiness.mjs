import fs from "node:fs";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_FUTURE_BOUNDED_PACKET_READINESS.md";
const operatorGatePath = "docs/PHASE_1_RUNTIME_PROMOTION_OPERATOR_DECISION_GATE.md";
const packagePath = "package.json";

const problems = [];
const doc = readText(docPath);
const operatorGate = readText(operatorGatePath);
const pkg = JSON.parse(readText(packagePath));

for (const phrase of [
  "Status: `phase_1_runtime_promotion_future_bounded_packet_readiness_keep_mock`",
  "Current decision: `KEEP_MOCK_AND_MONITOR`",
  "\"packetMode\": \"future_bounded_promotion_packet_readiness\"",
  "\"operatorDecision\": \"KEEP_MOCK_AND_MONITOR\"",
  "\"promotionAllowedNow\": false",
  "\"dryRunOnlyAllowedNow\": true",
  "\"publicDataSource\": \"mock\"",
  "\"scoreSource\": \"mock\"",
  "\"requiredFieldCompleteness\": \"incomplete\"",
  "`phase_1_runtime_promotion_dry_run_packet_or_keep_mock_monitoring`",
  "The next safe engineering action is dry-run validation of field shape only."
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const field of requiredFields()) {
  if (!doc.includes(`\`${field}\``)) problems.push(`${docPath} missing required field: ${field}`);
  if (!doc.includes(`"${field}": null`)) problems.push(`${docPath} payload must keep ${field} null`);
}

for (const phrase of [
  "required field presence",
  "source disclosure wording",
  "freshness fallback wording",
  "rollback command shape",
  "readback command shape",
  "production smoke command shape",
  "post-promotion review owner presence",
  "must not execute any command that changes runtime state"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing dry-run scope phrase: ${phrase}`);
}

for (const phrase of [
  "`promotionAllowedNow` is `true`",
  "`publicDataSource` is not `mock`",
  "`scoreSource` is not `mock`",
  "`requiredFieldCompleteness` is not `incomplete`",
  "any required future promotion field is non-null",
  "actual runtime mutation"
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
  "change Vercel, Supabase, DNS, or production environment values",
  "investment advice"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard boundary: ${phrase}`);
}

if (!operatorGate.includes("`phase_1_runtime_promotion_keep_mock_monitoring_or_future_bounded_promotion_packet`")) {
  problems.push(`${operatorGatePath} must route to future bounded promotion packet readiness`);
}

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-future-bounded-packet-readiness"] !==
  "node scripts/check-phase-1-runtime-promotion-future-bounded-packet-readiness.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-future-bounded-packet-readiness script`);
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
  /"requiredFieldCompleteness":\s*"complete"/u,
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
        ? "phase_1_runtime_promotion_future_bounded_packet_readiness_keep_mock"
        : "phase_1_runtime_promotion_future_bounded_packet_readiness_blocked",
      operatorDecision: "KEEP_MOCK_AND_MONITOR",
      promotionAllowedNow: false,
      dryRunOnlyAllowedNow: true,
      requiredFieldCompleteness: "incomplete",
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "phase_1_runtime_promotion_dry_run_packet_or_keep_mock_monitoring",
      requiredFields: requiredFields(),
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

function requiredFields() {
  return [
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
}
