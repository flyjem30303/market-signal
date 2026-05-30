import fs from "node:fs";

const reportPath = "docs/reviews/CP3_CHAIRMAN_NARROW_QUESTION_SUBMISSION_RECORD_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 chairman narrow question submission recorded",
  "SUBMIT_QUESTION_FOR_CHAIRMAN_REVIEW",
  "The user selected A: submit this exact question for chairman review.",
  "logs the governance submission decision inside the project",
  "does not\nmean the chairman has answered",
  "does not approve the question",
  "does not approve\nauthorization",
  "does not approve runtime entry",
  "does not approve runtime\nimplementation",
  "does not schedule a formal meeting",
  "does not create an\nauthorization packet",
  "does not create a real request packet",
  "does not connect to Supabase",
  "does not run SQL",
  "does not fetch\nmarket data",
  "does not parse market rows",
  "does not write Supabase",
  "does not\nwrite staging rows",
  "does not write daily_prices",
  "does not create seed SQL",
  "does\nnot wire runtime code",
  "does not set scoreSource=real",
  "does not clear\nsource-depth not_ready",
  "does not make public claims",
  "Submitted for chairman review: Should CEO prepare a bounded mock-only runtime-entry request that keeps scoreSource=mock, keeps source-depth not_ready, excludes Supabase, excludes SQL, excludes market-data fetch or parsing, excludes authorization packet creation, excludes formal meeting scheduling, and excludes public claims?",
  "CHAIRMAN-RESPONSE-A yes, CEO may prepare only the bounded mock-only runtime-entry request draft",
  "CHAIRMAN-RESPONSE-B no, continue local-only governance and do not prepare the request draft",
  "CHAIRMAN-RESPONSE-C revise the boundary before any request draft is prepared",
  "Any answer outside this response space must return to CEO review before PM\ncontinues.",
  "FUTURE-YES-PERMITS-001 prepare a request draft only",
  "FUTURE-YES-PERMITS-002 name exact mock-only runtime entry scope",
  "FUTURE-YES-PERMITS-003 name candidate files for a future implementation slice",
  "FUTURE-YES-PERMITS-004 name local checks and browser routes for future QA",
  "FUTURE-YES-PERMITS-005 keep scoreSource=mock",
  "FUTURE-YES-PERMITS-006 keep source-depth not_ready",
  "FUTURE-YES-PERMITS-007 keep no Supabase, no SQL, no market data, and no public claims",
  "SUBMISSION-BLOCKS-001 chairman answer is not recorded yet",
  "SUBMISSION-BLOCKS-002 authorization is not approved",
  "SUBMISSION-BLOCKS-003 runtime entry is not approved",
  "SUBMISSION-BLOCKS-004 runtime implementation is not approved",
  "SUBMISSION-BLOCKS-005 formal meeting is not scheduled",
  "SUBMISSION-BLOCKS-006 authorization packet is not created",
  "SUBMISSION-BLOCKS-007 real request packet is not created",
  "SUBMISSION-BLOCKS-008 Supabase access remains blocked",
  "SUBMISSION-BLOCKS-009 SQL execution remains blocked",
  "SUBMISSION-BLOCKS-010 market-data fetch remains blocked",
  "SUBMISSION-BLOCKS-011 market-row parsing remains blocked",
  "SUBMISSION-BLOCKS-012 Supabase writes remain blocked",
  "SUBMISSION-BLOCKS-013 staging rows remain blocked",
  "SUBMISSION-BLOCKS-014 daily_prices remains blocked",
  "SUBMISSION-BLOCKS-015 seed SQL remains blocked",
  "SUBMISSION-BLOCKS-016 runtime code wiring remains blocked",
  "SUBMISSION-BLOCKS-017 scoreSource=real remains blocked",
  "SUBMISSION-BLOCKS-018 source-depth not_ready remains unchanged",
  "SUBMISSION-BLOCKS-019 public claims remain blocked",
  "SUBMISSION-BLOCKS-020 production-ready wording remains blocked",
  "CEO recommendation: wait for chairman response before preparing any request draft",
  "CEO recommendation: next safe slice is a chairman response pending-state checkpoint",
  "CEO recommendation: do not enter runtime implementation from this submission record",
  "CEO recommendation: do not create an authorization packet from this submission record",
  "CEO recommendation: do not schedule a formal meeting from this submission record",
  "CEO recommendation: keep visual and information hierarchy polish lower priority until chairman response is resolved",
  "scripts/check-cp3-chairman-narrow-question-submission-record.mjs passes",
  "scripts/check-cp3-chairman-narrow-question-submit-readiness-checkpoint.mjs passes",
  "scripts/check-cp3-chairman-narrow-question-draft-gate-role-review.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "scoreSource=real remains blocked",
  "CP3 source-depth production gate remains not_ready",
  "Supabase and SQL execution remain blocked",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "chairman has answered yes",
  "chairman has answered no",
  "chairman answer is recorded",
  "question is approved",
  "question draft is approved",
  "runtime implementation is approved",
  "runtime entry is approved",
  "authorization is approved",
  "authorization has been approved",
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
