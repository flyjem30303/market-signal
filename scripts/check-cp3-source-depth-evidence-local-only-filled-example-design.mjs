import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_LOCAL_ONLY_FILLED_EXAMPLE_DESIGN_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 source-depth evidence local-only filled-example design recorded",
  "PROCEED",
  "fictional placeholder content\nonly",
  "not a real evidence artifact",
  "not a source approval",
  "not a legal\napproval",
  "not an authorization request",
  "not a market-data result",
  "not a\nSupabase result",
  "not a runtime implementation plan",
  "not a public claim",
  "does not approve authorization",
  "does not schedule a formal meeting",
  "does not create an authorization packet",
  "does not create a real request packet",
  "does not create real evidence artifact files",
  "does not connect to Supabase",
  "does\nnot run SQL",
  "does not fetch market data",
  "does not parse market rows",
  "does not\nwrite Supabase",
  "does not write staging rows",
  "does not write daily_prices",
  "does\nnot create seed SQL",
  "does not wire runtime code",
  "does not set scoreSource=real",
  "does not clear source-depth not_ready",
  "does not make public claims",
  "PLACEHOLDER-SOURCE-001 source name: Fictional Exchange Daily Bars Sandbox Source",
  "PLACEHOLDER-SOURCE-002 source category: fictional placeholder exchange-operated source",
  "PLACEHOLDER-SOURCE-003 source officialness: locally_ready_for_review as placeholder wording only",
  "PLACEHOLDER-SOURCE-004 source rights: needs_review by Legal",
  "PLACEHOLDER-SOURCE-005 access path: described as non-executed placeholder documentation path",
  "PLACEHOLDER-SOURCE-006 data rows: no rows included",
  "PLACEHOLDER-SOURCE-007 market values: no prices, volumes, dates, or symbols included",
  "PLACEHOLDER-SOURCE-008 Supabase output: no Supabase output included",
  "PLACEHOLDER-SOURCE-009 public claim status: blocked",
  "PLACEHOLDER-SOURCE-010 scoreSource status: blocked",
  "QUESTION-TEMPLATE-001 source identity",
  "Status: locally_ready_for_review",
  "Blocked boundary note: do not verify by fetching or connecting externally",
  "QUESTION-TEMPLATE-002 source officialness",
  "actual officialness remains unanswered for real sources",
  "Blocked boundary note: do not use this classification as public-source approval",
  "QUESTION-TEMPLATE-003 source rights",
  "Status: needs_review",
  "Blocked boundary note: do not approve redistribution or public claims here",
  "QUESTION-TEMPLATE-004 access path",
  "no URL is opened, no endpoint is called, and no SQL is run",
  "Blocked boundary note: do not fetch, parse, connect, or run SQL",
  "QUESTION-TEMPLATE-005 field completeness",
  "no real row is inspected",
  "Blocked boundary note: do not inspect live rows to answer this template",
  "QUESTION-TEMPLATE-006 coverage period",
  "no start date, end date, row count, or market calendar is validated here",
  "Blocked boundary note: do not validate coverage by downloading market data",
  "QUESTION-TEMPLATE-007 freshness expectation",
  "no live polling, validator run, or data-source check is performed",
  "Blocked boundary note: do not poll live data or execute validators",
  "QUESTION-TEMPLATE-008 failure modes",
  "missing fields, stale data, schema drift, non-official source, rate limit, rights uncertainty, and attribution ambiguity",
  "Blocked boundary note: do not convert failure-mode notes into runtime behavior",
  "QUESTION-TEMPLATE-009 public claim dependency",
  "requires Legal, Investment, Marketing, and CEO approval",
  "Status: blocked",
  "Blocked boundary note: do not approve or publish public claims",
  "QUESTION-TEMPLATE-010 authorization dependency",
  "requires a separate Chairman and CEO approval question",
  "Blocked boundary note: do not schedule meeting, create packet, or execute authorization",
  "FILLED-EXAMPLE-RULE-001 every example answer must remain fictional placeholder content",
  "FILLED-EXAMPLE-RULE-002 every example answer must avoid raw market data",
  "FILLED-EXAMPLE-RULE-003 every example answer must avoid Supabase output",
  "FILLED-EXAMPLE-RULE-004 every example answer must avoid real source approval",
  "FILLED-EXAMPLE-RULE-005 every example answer must avoid public claim approval",
  "FILLED-EXAMPLE-RULE-006 every example answer must avoid scoreSource=real approval",
  "FILLED-EXAMPLE-RULE-007 every example answer must avoid source-depth not_ready clearance",
  "FILLED-EXAMPLE-RULE-008 every example answer must preserve local-only review semantics",
  "REJECT-FILLED-EXAMPLE-001 reject if the example contains a real market symbol",
  "REJECT-FILLED-EXAMPLE-002 reject if the example contains raw price, volume, or OHLC rows",
  "REJECT-FILLED-EXAMPLE-003 reject if the example contains Supabase query output",
  "REJECT-FILLED-EXAMPLE-004 reject if the example contains SQL result output",
  "REJECT-FILLED-EXAMPLE-005 reject if the example implies authorization approval",
  "REJECT-FILLED-EXAMPLE-006 reject if the example implies source-rights approval",
  "REJECT-FILLED-EXAMPLE-007 reject if the example implies public claims are approved for release",
  "REJECT-FILLED-EXAMPLE-008 reject if the example implies scoreSource=real is approved",
  "REJECT-FILLED-EXAMPLE-009 reject if the example implies source-depth not_ready is cleared",
  "REJECT-FILLED-EXAMPLE-010 reject if the example implies runtime implementation can begin",
  "CEO pace assessment: this is a useful fast-lane slice because it makes the template operational without crossing execution boundaries",
  "CEO pace assessment: do not add role review because boundary meaning did not change",
  "CEO pace assessment: the next useful step is runtime state naming acceptance criteria, unless CEO wants another source-depth template refinement",
  "CEO pace assessment: source-depth evidence remains blocked for real execution until explicit authorization",
  "Next safe slice: prepare CP3 runtime state naming acceptance criteria",
  "Alternative next safe slice: prepare source-depth filled-example static rejection checklist",
  "CEO recommendation: prepare CP3 runtime state naming acceptance criteria",
  "The next safe slice must remain local-only",
  "The next safe slice must not implement runtime data state naming",
  "The next safe slice must not connect to Supabase",
  "The next safe slice must not run SQL",
  "The next safe slice must not fetch market data",
  "The next safe slice must not parse market rows",
  "The next safe slice must not set scoreSource=real",
  "The next safe slice must not clear source-depth not_ready",
  "The next safe slice must not make public claims",
  "scripts/check-cp3-source-depth-evidence-local-only-filled-example-design.mjs passes",
  "scripts/check-cp3-source-depth-evidence-local-only-question-template.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "CP3 source-depth production gate remains not_ready",
  "scoreSource=real remains blocked",
  "Supabase and SQL execution remain blocked"
];

const forbiddenPhrases = [
  "authorization is approved",
  "authorization has been approved",
  "formal meeting is scheduled",
  "authorization packet is created",
  "real request packet is created",
  "real evidence artifact files are created",
  "Supabase connection is allowed",
  "SQL execution is allowed",
  "market data fetch is allowed",
  "market rows are parsed",
  "staging rows are written",
  "daily_prices rows are written",
  "seed SQL is created",
  "runtime code is wired",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public data source is real",
  "public claims are now approved for release",
  "release readiness is approved"
];

const marketDataPatterns = [
  /\b(?:open|high|low|close|volume)\s*[:=]\s*\d/iu,
  /\b(?:2330|2317|0050|TWII|IX0001|TAIEX)\b/u
];

const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));
const forbiddenPatterns = marketDataPatterns
  .map((pattern) => pattern.toString())
  .filter((_, index) => marketDataPatterns[index].test(report));

console.log(
  JSON.stringify(
    {
      forbidden,
      forbiddenPatterns,
      missing,
      status: missing.length === 0 && forbidden.length === 0 && forbiddenPatterns.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0 || forbiddenPatterns.length > 0) {
  process.exitCode = 1;
}
