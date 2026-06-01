import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_ROW_COVERAGE_COUNT_UNAVAILABLE_LOCAL_DIAGNOSTIC_PLAN_2026-06-01.md";
const postRunPath = "docs/reviews/CP3_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_ONE_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md";
const databaseTypesPath = "src/lib/supabase/database.types.ts";
const dataSchemaPath = "docs/DATA_SCHEMA.md";
const runnerPath = "scripts/run-row-coverage-readonly-once.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";

const content = readFileSync(target, "utf8");
const postRun = readFileSync(postRunPath, "utf8");
const databaseTypes = readFileSync(databaseTypesPath, "utf8");
const dataSchema = readFileSync(dataSchemaPath, "utf8");
const runner = readFileSync(runnerPath, "utf8");
const reviewGate = readFileSync(reviewGatePath, "utf8");

const requiredPhrases = [
  "CP3 Row Coverage Count Unavailable Local Diagnostic Plan",
  "CP3 row coverage count_unavailable local diagnostic plan recorded",
  "DIAGNOSE_COUNT_UNAVAILABLE_LOCALLY_BEFORE_SECOND_REMOTE_ATTEMPT",
  "does not run a second remote attempt",
  "does not connect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not write staging rows",
  "does not write `daily_prices`",
  "does not modify `.env.local`",
  "does not fetch or ingest market data",
  "does not print secrets",
  "does not output row payloads",
  "does not set `scoreSource=real`",
  "does not award row coverage points",
  "does not approve public claims",
  "EVIDENCE-001 first remote-capable row coverage attempt returned status blocked",
  "EVIDENCE-003 first attempt returned observedTotalRows 0",
  "EVIDENCE-004 first attempt returned missingRows 360",
  "EVIDENCE-005 first attempt returned count_unavailable for TWII, 0050, 006208, 2330, 2382, and 2308",
  "EVIDENCE-006 generated Supabase types define daily_prices.stock_id",
  "EVIDENCE-008 generated Supabase types do not define daily_prices.symbol",
  "EVIDENCE-011 generated Supabase types define stocks.symbol",
  "EVIDENCE-013 current runner queries daily_prices with .select(\"symbol\", { count: \"exact\", head: true })",
  "EVIDENCE-014 current runner filters daily_prices with .eq(\"symbol\", symbol)",
  "FINDING-001 primary suspected cause is query contract mismatch",
  "FINDING-002 runner currently assumes daily_prices has symbol",
  "FINDING-003 local schema evidence says daily_prices uses stock_id",
  "FINDING-004 local schema evidence says symbol lives on stocks",
  "FINDING-006 this finding is local-only and does not prove remote RLS, policy, or relation state",
  "CAUSE-003 daily_prices may exist but RLS or grants may block count queries",
  "CAUSE-006 expected symbols may need stock_id lookup through stocks before daily_prices coverage counting",
  "FIX-001 do not retry the same symbol-column query",
  "FIX-003 resolve symbols to stock ids through stocks before daily_prices count",
  "FIX-004 count daily_prices by stock_id instead of symbol",
  "FIX-007 do not print stock_id values unless a separate redaction policy approves them",
  "FIX-010 require a new one-attempt gate before any second remote attempt",
  "ENGINEERING-FINDING-001 daily_prices.symbol is not present in generated types",
  "ENGINEERING-FINDING-002 daily_prices.stock_id and stocks.symbol are present in generated types",
  "DATA-FINDING-002 missing mapping for an asset should be reported separately from missing price rows",
  "SECURITY-FINDING-001 diagnostics must not print keys, prefixes, suffixes, lengths, stock_id payloads, or raw rows",
  "NEXT-SLICE-002 update runner to resolve stock_id from stocks by symbol before counting daily_prices",
  "NEXT-SLICE-003 update static checker to require stock_id counting and reject daily_prices.symbol assumptions",
  "NEXT-SLICE-005 do not run a second remote attempt until a new one-attempt execution gate is recorded",
  "scripts/check-row-coverage-count-unavailable-local-diagnostic-plan.mjs passes",
  "scripts/check-row-coverage-remote-capable-runner-one-attempt-post-run-review.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "no second remote attempt occurs",
  "SQL execution remains blocked",
  "Supabase writes remain blocked"
];

const evidencePhrases = [
  {
    content: postRun,
    file: postRunPath,
    phrase: "REMOTE_ATTEMPT_RECORDED_COVERAGE_REMAINS_BLOCKED"
  },
  {
    content: postRun,
    file: postRunPath,
    phrase: "PROBLEM-001 TWII count_unavailable"
  },
  {
    content: databaseTypes,
    file: databaseTypesPath,
    phrase: "daily_prices: {"
  },
  {
    content: databaseTypes,
    file: databaseTypesPath,
    phrase: "stock_id: string;"
  },
  {
    content: databaseTypes,
    file: databaseTypesPath,
    phrase: "stocks: {"
  },
  {
    content: databaseTypes,
    file: databaseTypesPath,
    phrase: "symbol: string;"
  },
  {
    content: dataSchema,
    file: dataSchemaPath,
    phrase: "## daily_prices"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: ".select(\"symbol\", { count: \"exact\", head: true })"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: ".eq(\"symbol\", symbol)"
  },
  {
    content: reviewGate,
    file: reviewGatePath,
    phrase: "scripts/check-row-coverage-remote-capable-runner-one-attempt-post-run-review.mjs"
  }
];

const forbiddenPhrases = [
  "second remote attempt approved",
  "second attempt executed",
  "SQL execution is approved",
  "Supabase writes are approved",
  "scoreSource=real approved",
  "ROW_COVERAGE_POINTS_AWARDED",
  "CP3_READY_NOW",
  "public claims are approved",
  "print stock_id values now",
  "raw rows copied"
];

const missing = [
  ...requiredPhrases.filter((phrase) => !content.includes(phrase)).map((phrase) => `${target}: ${phrase}`),
  ...evidencePhrases
    .filter(({ content, phrase }) => !content.includes(phrase))
    .map(({ file, phrase }) => `${file}: ${phrase}`)
];
const forbidden = forbiddenPhrases.filter((phrase) => content.includes(phrase));
const reviewGateRunsRunner = /command:\s*\[node,\s*"scripts\/run-row-coverage-readonly-once\.mjs"\]/.test(reviewGate);

if (reviewGateRunsRunner) {
  forbidden.push(`${reviewGatePath}: review gate must not execute row coverage runner`);
}

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
