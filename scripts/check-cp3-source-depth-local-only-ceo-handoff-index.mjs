import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SOURCE_DEPTH_LOCAL_ONLY_CEO_HANDOFF_INDEX_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 source-depth local-only CEO handoff index recorded",
  "REVISE",
  "local-only CEO handoff index",
  "does not approve template copy",
  "does not create a real request packet",
  "does not create real evidence artifact files",
  "does not fill template values",
  "does not create the future evidence checker",
  "does not clear source-depth not_ready",
  "docs/reviews/CP3_SOURCE_DEPTH_NEXT_GOVERNANCE_PRIORITY_MAP_2026-05-29.md",
  "docs/reviews/CP3_SOURCE_DEPTH_NEXT_GOVERNANCE_PRIORITY_MAP_ROLE_REVIEW_2026-05-29.md",
  "docs/reviews/CP3_SOURCE_DEPTH_TIER1_LOCAL_WORK_QUEUE_2026-05-29.md",
  "docs/reviews/CP3_SOURCE_DEPTH_TIER1_LOCAL_WORK_QUEUE_ROLE_REVIEW_2026-05-29.md",
  "docs/reviews/CP3_SOURCE_DEPTH_APPROVAL_PACKET_BOUNDARY_MAP_2026-05-29.md",
  "docs/reviews/CP3_SOURCE_DEPTH_APPROVAL_PACKET_BOUNDARY_MAP_ROLE_REVIEW_2026-05-29.md",
  "Should template-copy approval become an executable task",
  "Should a real request packet be created",
  "Should real evidence artifact files be created",
  "Should template values be filled",
  "Should a future evidence checker be created",
  "Should remote read-only validation be authorized",
  "Should staging migration execution be authorized",
  "Should source-depth production transition be authorized",
  "Should scoreSource=real transition be authorized",
  "Should public claims be authorized with Marketing review",
  "template-copy approval is not approved",
  "real request packet creation is not approved",
  "real evidence artifact creation is not approved",
  "template value filling is not approved",
  "future evidence checker creation is not approved",
  "remote read-only validation is not approved",
  "staging migration execution is not approved",
  "source-depth production transition is not approved",
  "scoreSource=real transition is not approved",
  "public claims are not approved",
  "stop if work requires Supabase access",
  "stop if work requires SQL execution",
  "stop if work requires market data fetching",
  "stop if work requires market row parsing",
  "stop if work requires raw market rows",
  "stop if work requires CSV market data",
  "stop if work requires JSON market data",
  "stop if work requires .env.local secrets",
  "stop if work requires scoreSource=real",
  "stop if work requires clearing source-depth not_ready",
  "stop if work requires public UI wiring",
  "stop if work requires public claims",
  "scripts/check-cp3-source-depth-local-only-ceo-handoff-index.mjs passes",
  "scripts/check-cp3-source-depth-approval-packet-boundary-map-role-review.mjs passes",
  "scripts/check-cp3-source-depth-approval-packet-boundary-map.mjs passes",
  "scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "orientation artifact for a future decision meeting",
  "guide what the CEO reviews next",
  "must not convert pending decision into approval",
  "must not convert pending decision into execution",
  "must not convert pending decision into evidence creation",
  "must not convert pending decision into remote validation",
  "must not convert pending decision into database access",
  "must not convert pending decision into runtime wiring",
  "must not convert pending decision into source-depth production transition",
  "must not convert pending decision into scoreSource=real transition",
  "must not convert pending decision into public claims",
  "handoff index only",
  "do not approve template copy",
  "do not create a real request packet",
  "do not create real evidence artifact files",
  "do not fill template values",
  "do not create future evidence checker",
  "do not add example market data",
  "do not add sample rows",
  "do not add sample JSON",
  "do not add sample CSV",
  "do not add Supabase output",
  "do not add SQL output",
  "do not fetch market data",
  "do not parse market rows",
  "do not run source-depth validator against Supabase",
  "do not connect to Supabase",
  "do not run SQL",
  "do not write Supabase",
  "do not write staging rows",
  "do not write daily_prices",
  "do not create seed SQL",
  "do not store raw market rows",
  "do not commit CSV / JSON market data files",
  "do not set scoreSource=real",
  "do not make public backtest claims",
  "do not clear source-depth not_ready",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "record CP3 source-depth local-only CEO handoff index role review"
];

const forbiddenPhrases = [
  "Status: approved",
  "CEO Decision: APPROVE",
  "Approval Status: approved",
  "template copy approved",
  "real request packet approved",
  "evidence artifacts approved",
  "future evidence checker approved",
  "source_depth_state is reviewable",
  "scoreSource=real approved",
  "source-rights are approved",
  "public claims are approved",
  "Supabase read output:",
  "SQL execution output:",
  "raw OHLCV",
  "daily_prices sample"
];

const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      report: reportPath,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
