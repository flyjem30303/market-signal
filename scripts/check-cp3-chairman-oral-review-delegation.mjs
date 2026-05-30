import fs from "node:fs";

const reportPath = "docs/reviews/CP3_CHAIRMAN_ORAL_REVIEW_DELEGATION_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 chairman oral review delegation recorded",
  "ORAL_REVIEW_DELEGATED_TO_CEO",
  "chairman authorizes CEO to handle items that would otherwise require\nchairman review by oral summary and oral review",
  "execute the\ndelegated review decision inside the project governance flow",
  "review authority, not unrestricted execution\nauthority",
  "does not automatically approve runtime implementation",
  "does not\nautomatically approve Supabase access",
  "does not automatically approve SQL\nexecution",
  "does not automatically approve market-data fetch or parsing",
  "does\nnot automatically approve authorization packet creation",
  "does not\nautomatically approve formal meeting scheduling",
  "does not automatically approve\npublic claims",
  "does not automatically approve scoreSource=real",
  "DELEGATED-RULE-001 CEO may receive oral chairman review for chairman-review items",
  "DELEGATED-RULE-002 CEO may record the oral review outcome as a project governance artifact",
  "DELEGATED-RULE-003 CEO may execute only the scope explicitly covered by the oral review outcome",
  "DELEGATED-RULE-004 CEO must preserve all existing technical stop lines unless the oral review outcome explicitly changes them",
  "DELEGATED-RULE-005 CEO must convert any external-system, database, real-data, or public-claim action into a separate execution gate before action",
  "DELEGATED-RULE-006 PM must document the delegated decision before implementation work begins",
  "DELEGATED-RULE-007 QA must keep the delegated decision in the aggregate review gate",
  "CURRENT-QUESTION-STATUS: ORALLY_REVIEWED_AND_DELEGATED_TO_CEO",
  "CEO may proceed to prepare a bounded\nmock-only runtime-entry request draft",
  "PERMISSION-001 CEO may prepare the bounded mock-only runtime-entry request draft",
  "PERMISSION-002 CEO may name exact mock-only runtime entry scope",
  "PERMISSION-003 CEO may name candidate files for a future implementation slice",
  "PERMISSION-004 CEO may name local checks and browser routes for future QA",
  "PERMISSION-005 CEO must keep scoreSource=mock",
  "PERMISSION-006 CEO must keep source-depth not_ready",
  "PERMISSION-007 CEO must keep no Supabase, no SQL, no market data, and no public claims",
  "BLOCKED-001 runtime implementation is not approved by this delegation record",
  "BLOCKED-002 runtime entry execution is not approved by this delegation record",
  "BLOCKED-003 Supabase access remains blocked",
  "BLOCKED-004 SQL execution remains blocked",
  "BLOCKED-005 market-data fetch remains blocked",
  "BLOCKED-006 market-row parsing remains blocked",
  "BLOCKED-007 Supabase writes remain blocked",
  "BLOCKED-008 staging rows remain blocked",
  "BLOCKED-009 daily_prices remains blocked",
  "BLOCKED-010 seed SQL remains blocked",
  "BLOCKED-011 runtime code wiring remains blocked until a bounded implementation gate exists",
  "BLOCKED-012 scoreSource=real remains blocked",
  "BLOCKED-013 source-depth not_ready remains unchanged",
  "BLOCKED-014 public claims remain blocked",
  "BLOCKED-015 production-ready wording remains blocked",
  "CEO recommendation: create the bounded mock-only runtime-entry request draft next",
  "CEO recommendation: do not implement runtime from this delegation record",
  "CEO recommendation: do not connect to Supabase from this delegation record",
  "CEO recommendation: do not run SQL from this delegation record",
  "CEO recommendation: do not fetch or parse market data from this delegation record",
  "scripts/check-cp3-chairman-oral-review-delegation.mjs passes",
  "scripts/check-cp3-chairman-narrow-question-submission-record.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "scoreSource=real remains blocked",
  "CP3 source-depth production gate remains not_ready",
  "Supabase and SQL execution remain blocked",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "unrestricted execution authority",
  "runtime implementation is approved",
  "runtime entry execution is approved",
  "Supabase access is approved",
  "SQL execution is approved",
  "market-data fetch is approved",
  "market-row parsing is approved",
  "Supabase writes are approved",
  "staging rows are approved",
  "daily_prices is approved",
  "seed SQL is approved",
  "runtime code wiring is approved",
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
