import fs from "node:fs";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_REVIEW_PACKET.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";

const problems = [];
const doc = readText(docPath);
const pkg = JSON.parse(readText(packagePath));
const status = readText(statusPath);

for (const phrase of [
  "Status: `phase_1_runtime_promotion_review_packet_ready_no_go`",
  "Decision: `KEEP_MOCK_RUNTIME_PROMOTION_REVIEW_PACKET_READY`",
  "`promotionAllowedNow=false`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "Data quality",
  "Freshness display",
  "Source disclosure",
  "Rollback / fail-closed",
  "Public copy boundary",
  "`accepted_for_review_packet`",
  "`phase_1_runtime_promotion_explicit_go_no_go_decision`",
  "public UI renders `freshness.description`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const command of [
  "check:data-freshness-quality-mvp-readiness",
  "check:public-freshness-runtime-boundary",
  "check:source-rights-disclosure-acceptance-gate",
  "check:phase-1-write-runner-rollback-or-quarantine-contract-no-execution",
  "check:source-rights-public-copy-acceptance-readiness",
  "check:phase-1-runtime-promotion-preflight-status",
  "check:phase-1-runtime-promotion-review-packet"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command: ${command}`);
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

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-review-packet"] !==
  "node scripts/check-phase-1-runtime-promotion-review-packet.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-review-packet script`);
}

if (!status.includes("phase_1_data_readiness_gate_convergence_verified")) {
  problems.push(`${statusPath} missing latest data readiness convergence status`);
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
  /publicDataSource"\s*:\s*"supabase"/u,
  /scoreSource"\s*:\s*"real"/u,
  /SQL execution is approved/iu,
  /Supabase write is approved/iu,
  /publicDataSource=supabase is approved/iu,
  /scoreSource=real is approved/iu,
  /buy now/iu,
  /guaranteed return/iu
]) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
}

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_review_packet_ready_no_go"
        : "phase_1_runtime_promotion_review_packet_blocked",
      promotionAllowedNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "phase_1_runtime_promotion_explicit_go_no_go_decision",
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
