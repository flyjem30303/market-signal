import fs from "node:fs";

const reportPath = "docs/reviews/CP3_CHAIRMAN_NARROW_QUESTION_DRAFT_GATE_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 chairman narrow question draft gate recorded",
  "DRAFT_ONLY",
  "single narrow question that may later be presented to the\nchairman",
  "local-only draft gate",
  "does not submit the question",
  "does\nnot schedule a meeting",
  "does not request authorization",
  "does not approve\nauthorization",
  "does not create an authorization packet",
  "does not create a real\nrequest packet",
  "does not enter runtime implementation",
  "does not approve runtime implementation",
  "does not connect\nto Supabase",
  "does not run SQL",
  "does not fetch market data",
  "does not parse\nmarket rows",
  "does not write Supabase",
  "does not write staging rows",
  "does not\nwrite daily_prices",
  "does not create seed SQL",
  "does not wire runtime code",
  "does\nnot set scoreSource=real",
  "does not clear source-depth not_ready",
  "does not\nmake public claims",
  "Question draft only: Should CEO prepare a bounded mock-only runtime-entry request that keeps scoreSource=mock, keeps source-depth not_ready, excludes Supabase, excludes SQL, excludes market-data fetch or parsing, excludes authorization packet creation, excludes formal meeting scheduling, and excludes public claims?",
  "ANSWER-A yes, prepare only the bounded mock-only runtime-entry request draft",
  "ANSWER-B no, continue local-only governance and do not prepare the request draft",
  "ANSWER-C revise the boundary before any request draft is prepared",
  "Any answer outside this answer space must return to CEO review before PM\ncontinues.",
  "YES-PERMITS-001 prepare a written request draft only",
  "YES-PERMITS-002 name the exact mock-only runtime entry scope",
  "YES-PERMITS-003 name the files that may be edited in a future implementation slice",
  "YES-PERMITS-004 name local checks and browser routes for future QA",
  "YES-PERMITS-005 preserve scoreSource=mock",
  "YES-PERMITS-006 preserve source-depth not_ready",
  "YES-PERMITS-007 preserve no Supabase, no SQL, no market data, and no public claims",
  "YES-BLOCKS-001 does not approve runtime implementation",
  "YES-BLOCKS-002 does not approve authorization",
  "YES-BLOCKS-003 does not schedule a formal meeting",
  "YES-BLOCKS-004 does not create an authorization packet",
  "YES-BLOCKS-005 does not create a real request packet",
  "YES-BLOCKS-006 does not connect to Supabase",
  "YES-BLOCKS-007 does not run SQL",
  "YES-BLOCKS-008 does not fetch market data",
  "YES-BLOCKS-009 does not parse market rows",
  "YES-BLOCKS-010 does not write Supabase",
  "YES-BLOCKS-011 does not write staging rows",
  "YES-BLOCKS-012 does not write daily_prices",
  "YES-BLOCKS-013 does not create seed SQL",
  "YES-BLOCKS-014 does not wire runtime code",
  "YES-BLOCKS-015 does not set scoreSource=real",
  "YES-BLOCKS-016 does not clear source-depth not_ready",
  "YES-BLOCKS-017 does not make public claims",
  "YES-BLOCKS-018 does not call the feature production-ready",
  "CEO must explicitly decide whether to submit this question later",
  "PM must confirm this is still the only active question",
  "Engineering must confirm no runtime files will be edited by submission",
  "QA must confirm submission creates no test execution or browser route change",
  "Legal must confirm wording still does not imply advice, officialness, reliability, real-data readiness, or authorization",
  "Investment must confirm real-score, backtest, source-depth, and public claim states remain not_ready",
  "Design must confirm visible UI polish remains deferred",
  "Data must confirm Supabase, SQL, staging, daily_prices, seed SQL, and raw market data remain blocked",
  "CEO recommendation: keep this as draft-only until the user/chairman explicitly asks to submit or revise it",
  "CEO recommendation: next safe slice is role review of this narrow question draft gate",
  "CEO recommendation: do not enter runtime implementation from this gate",
  "CEO recommendation: do not prepare an authorization packet from this gate",
  "CEO recommendation: do not schedule a formal meeting from this gate",
  "scripts/check-cp3-chairman-narrow-question-draft-gate.mjs passes",
  "scripts/check-cp3-pre-runtime-authorization-boundary-table-role-review.mjs passes",
  "scripts/check-cp3-pre-runtime-authorization-boundary-table.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "scoreSource=real remains blocked",
  "CP3 source-depth production gate remains not_ready",
  "Supabase and SQL execution remain blocked",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "question is submitted",
  "question has been submitted",
  "question draft is approved",
  "runtime implementation is approved",
  "runtime entry is approved",
  "authorization is approved",
  "authorization has been approved",
  "authorization is requested",
  "formal meeting is scheduled",
  "authorization packet is created",
  "real request packet is created",
  "Supabase connection is allowed",
  "Supabase access is approved",
  "SQL execution is allowed",
  "SQL execution is approved",
  "market data fetch is allowed",
  "market data collection is approved",
  "market rows are parsed",
  "staging rows are written",
  "daily_prices rows are written",
  "seed SQL is created",
  "runtime code is wired",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public claims are approved",
  "production-ready approved"
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
