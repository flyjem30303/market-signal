import fs from "node:fs";

const reportPath = "docs/reviews/CP3_PRE_RUNTIME_AUTHORIZATION_BOUNDARY_TABLE_ROLE_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 pre-runtime authorization boundary table role review recorded",
  "reviewed docs/reviews/CP3_PRE_RUNTIME_AUTHORIZATION_BOUNDARY_TABLE_2026-05-30.md",
  "reviewed scripts/check-cp3-pre-runtime-authorization-boundary-table.mjs",
  "role review only",
  "does not approve runtime implementation",
  "does not approve authorization",
  "does not schedule a formal meeting",
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
  "CEO confirms the table is suitable as a chairman-review boundary, not an approval",
  "PM confirms the table can drive the next narrow decision without creating a packet",
  "Engineering confirms no runtime file, Supabase path, SQL path, or market-data path is authorized",
  "QA confirms the table has a dedicated checker and is included in the review gate",
  "Legal confirms the wording does not grant authorization, meeting schedule, packet creation, advice, officialness, or real-data readiness",
  "Investment confirms real-score, backtest, source-depth, and public claim states remain not_ready",
  "Design confirms visual and information hierarchy polish remains lower priority than boundary clarity",
  "Data confirms scoreSource=real, staging rows, daily_prices, seed SQL, and raw market data remain blocked",
  "accepted as local-only chairman-review boundary",
  "accepted as a pre-runtime decision table",
  "accepted as a stop-before-runtime control",
  "accepted as a narrow-question preparation artifact",
  "not accepted as runtime implementation approval",
  "not accepted as authorization approval",
  "not accepted as authorization packet creation",
  "not accepted as real request packet creation",
  "not accepted as formal meeting scheduling",
  "not accepted as Supabase access approval",
  "not accepted as SQL execution approval",
  "not accepted as market-data collection approval",
  "not accepted as public claim approval",
  "not accepted as production readiness",
  "Engineering wants clearer runtime-entry file scope before implementation",
  "QA wants the new role review checker included in the aggregate review gate",
  "Legal wants the chairman question to remain narrow and non-executing until explicitly approved",
  "Investment wants source-depth not_ready to remain visible in every runtime-entry question",
  "Design wants visual hierarchy polish deferred until chairman boundary acceptance",
  "Data wants all Supabase, SQL, staging, daily_prices, and market-data actions outside this authorization table",
  "CEO resolves the conflict by holding runtime entry and selecting a chairman-facing narrow-question preparation slice next",
  "Question draft only: Should CEO prepare a bounded mock-only runtime-entry request that keeps scoreSource=mock, keeps source-depth not_ready, excludes Supabase, excludes SQL, excludes market-data fetch or parsing, excludes authorization packet creation, excludes formal meeting scheduling, and excludes public claims?",
  "This question draft is not submitted, not scheduled, and not approved.",
  "CEO recommendation: create a chairman narrow-question draft gate",
  "The next safe slice must remain local-only",
  "The next safe slice must not enter runtime implementation",
  "The next safe slice must not approve authorization",
  "The next safe slice must not create an authorization packet",
  "The next safe slice must not create a real request packet",
  "The next safe slice must not schedule a formal meeting",
  "The next safe slice must not connect to Supabase",
  "The next safe slice must not run SQL",
  "The next safe slice must not fetch market data",
  "The next safe slice must not parse market rows",
  "The next safe slice must not write staging rows",
  "The next safe slice must not write daily_prices",
  "The next safe slice must not create seed SQL",
  "The next safe slice must not wire runtime code",
  "The next safe slice must not set scoreSource=real",
  "The next safe slice must not clear source-depth not_ready",
  "The next safe slice must not make public claims",
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
  "runtime implementation is approved",
  "runtime entry is approved",
  "authorization is approved",
  "authorization has been approved",
  "formal meeting is scheduled",
  "authorization packet is created",
  "real request packet is created",
  "real evidence artifact files are created",
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
  "production-ready approved",
  "question draft is submitted",
  "question draft is approved"
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
