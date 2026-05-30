import fs from "node:fs";

const reportPath = "docs/reviews/CP3_MOCK_ONLY_RUNTIME_IMPLEMENTATION_REVIEW_CHECKPOINT_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 mock-only runtime implementation review checkpoint recorded",
  "reviewed src/lib/cp3-mock-only-runtime-state.ts",
  "reviewed src/components/cp3-runtime-state-panel.tsx",
  "reviewed scripts/check-cp3-mock-only-runtime-panel.mjs",
  "reviewed local routes /stocks/2330 /stocks/TWII /briefing",
  "post-implementation review only",
  "does not approve Supabase connection",
  "does not approve SQL execution",
  "does not approve market-data fetch",
  "does not approve market-row parsing",
  "does not approve Supabase writes",
  "does not approve staging rows",
  "does not approve daily_prices writes",
  "does not approve seed SQL",
  "does not approve scoreSource=real",
  "does not clear source-depth not_ready",
  "does not approve public claims",
  "FINDING-001 mock-only runtime disclosure is wired into stock detail routes",
  "FINDING-002 stock routes expose Runtime Disclosure, score source, source depth, public claim state, data quality, and blocker labels",
  "FINDING-003 runtime state keeps scoreSource=mock",
  "FINDING-004 runtime state keeps source-depth not_ready",
  "FINDING-005 runtime state keeps source-rights not_ready",
  "FINDING-006 runtime state keeps public claims not_ready",
  "FINDING-007 local route checks returned HTTP 200 for /stocks/2330 /stocks/TWII /briefing",
  "FINDING-008 in-app browser automation was blocked by local sandbox behavior, so route verification used local HTTP checks",
  "FINDING-009 no Supabase, SQL, market-data fetch, market-row parsing, staging rows, daily_prices, seed SQL, or scoreSource=real action occurred",
  "CEO accepts the mock-only runtime implementation as sufficient for the first runtime slice",
  "CEO keeps current runtime public data source mock",
  "CEO keeps scoreSource=real blocked",
  "CEO keeps source-depth production gate not_ready",
  "CEO directs PM to prepare Supabase read-only validation authorization gate next",
  "CEO rejects direct Supabase connection until the read-only validation authorization gate is recorded and separately approved",
  "CEO rejects SQL execution until a later SQL execution authorization gate is recorded and separately approved",
  "CEO rejects real market-data ingestion until source-depth and rights gates are ready",
  "NEXT-SLICE-001 prepare Supabase read-only validation authorization gate",
  "NEXT-SLICE-002 the next safe slice may define exact read-only validation command scope",
  "NEXT-SLICE-003 the next safe slice may define required env key presence checks without printing secrets",
  "NEXT-SLICE-004 the next safe slice may define tables or views to inspect read-only later",
  "NEXT-SLICE-005 the next safe slice must not connect to Supabase",
  "NEXT-SLICE-006 the next safe slice must not run SQL",
  "NEXT-SLICE-007 the next safe slice must not write Supabase",
  "NEXT-SLICE-008 the next safe slice must not write staging rows",
  "NEXT-SLICE-009 the next safe slice must not write daily_prices",
  "NEXT-SLICE-010 the next safe slice must not fetch market data",
  "NEXT-SLICE-011 the next safe slice must not parse market rows",
  "NEXT-SLICE-012 the next safe slice must not set scoreSource=real",
  "NEXT-SLICE-013 the next safe slice must not clear source-depth not_ready",
  "NEXT-SLICE-014 the next safe slice must not make public claims",
  "scripts/check-cp3-mock-only-runtime-implementation-review-checkpoint.mjs passes",
  "scripts/check-cp3-mock-only-runtime-panel.mjs passes",
  "scripts/check-cp3-bounded-mock-only-runtime-implementation-approval-gate.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 source-depth production gate remains not_ready",
  "Supabase and SQL execution remain blocked",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "Supabase connection is approved",
  "SQL execution is approved",
  "market-data fetch is approved",
  "market-row parsing is approved",
  "Supabase writes are approved",
  "staging rows are written",
  "daily_prices rows are written",
  "seed SQL is created",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public claims are approved",
  "production-ready approved",
  "may connect to Supabase",
  "may run SQL",
  "may write Supabase",
  "may set scoreSource=real"
];

const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
