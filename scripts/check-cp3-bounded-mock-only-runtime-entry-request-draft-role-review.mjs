import fs from "node:fs";

const reportPath = "docs/reviews/CP3_BOUNDED_MOCK_ONLY_RUNTIME_ENTRY_REQUEST_DRAFT_ROLE_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 bounded mock-only runtime-entry request draft role review recorded",
  "reviewed docs/reviews/CP3_BOUNDED_MOCK_ONLY_RUNTIME_ENTRY_REQUEST_DRAFT_2026-05-30.md",
  "reviewed scripts/check-cp3-bounded-mock-only-runtime-entry-request-draft.mjs",
  "role review only",
  "does not approve runtime implementation",
  "does not approve runtime entry execution",
  "does not create an authorization packet",
  "does not create a real request packet",
  "does not connect to Supabase",
  "does not run SQL",
  "does not fetch market data",
  "does not parse market rows",
  "does not write Supabase",
  "does not write staging rows",
  "does not write daily_prices",
  "does not create seed SQL",
  "does not wire runtime code",
  "does not set scoreSource=real",
  "does not clear source-depth not_ready",
  "does not make public claims",
  "CEO confirms the request draft is fit to move toward a separate bounded implementation approval gate",
  "PM confirms the request draft names candidate files and checks tightly enough for a next approval gate",
  "Engineering confirms no runtime file edit is authorized by this role review",
  "QA confirms the request draft has a dedicated checker and is included in the aggregate review gate",
  "Legal confirms the wording does not imply advice, officialness, reliability, real-data readiness, authorization, public claims, or production readiness",
  "Investment confirms real-score, source-depth, source-rights, and public claim states remain not_ready",
  "Data confirms scoreSource=real, Supabase, SQL, staging rows, daily_prices, seed SQL, and market-data actions remain blocked",
  "Design confirms any future visible wording must remain mock-only and must not imply real data",
  "accepted as a local-only request-draft role review",
  "accepted as a prerequisite to a future bounded implementation approval gate",
  "accepted as a stop-before-runtime control",
  "accepted as a candidate file-and-check scope map",
  "not accepted as runtime implementation approval",
  "not accepted as runtime entry execution approval",
  "not accepted as authorization packet creation",
  "not accepted as real request packet creation",
  "not accepted as Supabase access approval",
  "not accepted as SQL execution approval",
  "not accepted as market-data collection approval",
  "not accepted as staging write approval",
  "not accepted as daily_prices write approval",
  "not accepted as scoreSource=real approval",
  "not accepted as source-depth production readiness",
  "not accepted as public claim approval",
  "not accepted as production readiness",
  "Engineering wants a smaller implementation approval scope before any runtime edit",
  "QA wants the next approval gate to name exact local checks and browser routes",
  "Legal wants every future UI copy change to preserve mock-only and not_ready wording",
  "Investment wants the future implementation to keep real-score and source-depth states not_ready",
  "Data wants scoreSource=real and all external data paths explicitly blocked in the next gate",
  "Design wants visual and information hierarchy polish deferred unless needed for mock-only disclosure clarity",
  "CEO resolves the conflict by approving only the creation of a bounded implementation approval gate next",
  "CEO recommendation: create a bounded mock-only runtime implementation approval gate",
  "The next safe slice may prepare implementation approval wording only",
  "The next safe slice must restate exact files before runtime editing",
  "The next safe slice must remain local-only",
  "The next safe slice must not edit runtime files yet",
  "The next safe slice must not connect to Supabase",
  "The next safe slice must not run SQL",
  "The next safe slice must not fetch market data",
  "The next safe slice must not parse market rows",
  "The next safe slice must not write Supabase",
  "The next safe slice must not write staging rows",
  "The next safe slice must not write daily_prices",
  "The next safe slice must not create seed SQL",
  "The next safe slice must not set scoreSource=real",
  "The next safe slice must not clear source-depth not_ready",
  "The next safe slice must not make public claims",
  "The next safe slice must not call the feature production-ready",
  "scripts/check-cp3-bounded-mock-only-runtime-entry-request-draft-role-review.mjs passes",
  "scripts/check-cp3-bounded-mock-only-runtime-entry-request-draft.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "scoreSource=real remains blocked",
  "CP3 source-depth production gate remains not_ready",
  "Supabase and SQL execution remain blocked",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "runtime implementation is approved",
  "runtime entry execution is approved",
  "authorization packet is created",
  "real request packet is created",
  "Supabase connection is allowed",
  "Supabase access is approved",
  "SQL execution is approved",
  "market-data fetch is approved",
  "market data collection is approved",
  "market rows are parsed",
  "staging rows are written",
  "daily_prices rows are written",
  "seed SQL is created",
  "runtime code is wired",
  "runtime file edit is now authorized",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public claims are approved",
  "production-ready approved",
  "may edit runtime files yet"
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
