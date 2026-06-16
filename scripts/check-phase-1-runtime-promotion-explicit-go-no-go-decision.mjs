import fs from "node:fs";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_EXPLICIT_GO_NO_GO_DECISION.md";
const reviewPacketPath = "docs/PHASE_1_RUNTIME_PROMOTION_REVIEW_PACKET.md";
const packagePath = "package.json";

const problems = [];
const doc = readText(docPath);
const reviewPacket = readText(reviewPacketPath);
const pkg = JSON.parse(readText(packagePath));

for (const phrase of [
  "Status: `phase_1_runtime_promotion_explicit_go_no_go_decision_ready_no_go`",
  "Decision: `NO_GO_FOR_REAL_RUNTIME_PROMOTION_NOW`",
  "`GO_TO_OPERATOR_DECISION_GATE`",
  "`promotionAllowedNow=false`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`phase_1_runtime_promotion_operator_decision_gate`",
  "`KEEP_MOCK_AND_MONITOR`",
  "`RUN_PROMOTION_DRY_RUN_ONLY`",
  "`AUTHORIZE_BOUNDED_PUBLIC_SOURCE_PROMOTION`",
  "Default CEO recommendation: `KEEP_MOCK_AND_MONITOR`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "Row coverage: complete",
  "Data quality review packet: accepted",
  "Freshness display: accepted",
  "Source disclosure: accepted",
  "Rollback / fail-closed: accepted",
  "Public copy boundary: accepted",
  "Production smoke: public routes are reachable"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing evidence phrase: ${phrase}`);
}

for (const phrase of [
  "run SQL",
  "write Supabase",
  "create staging rows",
  "mutate `daily_prices`",
  "raw market data",
  "print secrets",
  "approve public source promotion",
  "approve real score promotion",
  "investment advice"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

if (!reviewPacket.includes("Status: `phase_1_runtime_promotion_review_packet_ready_no_go`")) {
  problems.push(`${reviewPacketPath} missing ready no-go review packet status`);
}

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-explicit-go-no-go-decision"] !==
  "node scripts/check-phase-1-runtime-promotion-explicit-go-no-go-decision.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-explicit-go-no-go-decision script`);
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
  /promotionAllowedNow=true/u,
  /publicDataSource=supabase is approved/iu,
  /scoreSource=real is approved/iu,
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
        ? "phase_1_runtime_promotion_explicit_go_no_go_decision_ready_no_go"
        : "phase_1_runtime_promotion_explicit_go_no_go_decision_blocked",
      decision: "NO_GO_FOR_REAL_RUNTIME_PROMOTION_NOW",
      nextRoute: "phase_1_runtime_promotion_operator_decision_gate",
      promotionAllowedNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
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
