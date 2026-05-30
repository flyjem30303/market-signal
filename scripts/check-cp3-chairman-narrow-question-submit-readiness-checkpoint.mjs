import fs from "node:fs";

const reportPath = "docs/reviews/CP3_CHAIRMAN_NARROW_QUESTION_SUBMIT_READINESS_CHECKPOINT_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 chairman narrow question submit-readiness checkpoint recorded",
  "SUBMIT_READINESS_ONLY",
  "checks whether the chairman narrow question is ready to be\nsubmitted later",
  "does not submit the question",
  "does not approve the\nquestion",
  "does not request authorization",
  "does not approve authorization",
  "does\nnot schedule a formal meeting",
  "does not create an authorization packet",
  "does\nnot create a real request packet",
  "does not enter runtime implementation",
  "does not approve runtime implementation",
  "does not connect to\nSupabase",
  "does not run SQL",
  "does not fetch market data",
  "does not parse market\nrows",
  "does not write Supabase",
  "does not write staging rows",
  "does not write\ndaily_prices",
  "does not create seed SQL",
  "does not wire runtime code",
  "does not\nset scoreSource=real",
  "does not clear source-depth not_ready",
  "does not make\npublic claims",
  "READINESS_RESULT: READY_TO_ASK_USER_FOR_SUBMISSION_DECISION",
  "ready for the user/chairman to decide whether it should be\nsubmitted",
  "but it is not submitted by this checkpoint",
  "Question draft only: Should CEO prepare a bounded mock-only runtime-entry request that keeps scoreSource=mock, keeps source-depth not_ready, excludes Supabase, excludes SQL, excludes market-data fetch or parsing, excludes authorization packet creation, excludes formal meeting scheduling, and excludes public claims?",
  "CONDITION-001 one and only one active question exists",
  "CONDITION-002 answer space is limited to yes draft, no continue, or revise boundary",
  "CONDITION-003 role review confirms the question is draft-only",
  "CONDITION-004 role review confirms a yes answer permits only future request-draft preparation",
  "CONDITION-005 role review confirms no runtime files may be edited by submission",
  "CONDITION-006 role review confirms no tests, browser routes, or implementation checks are executed by submission",
  "CONDITION-007 legal wording blocks advice, officialness, reliability, real-data readiness, and authorization implications",
  "CONDITION-008 investment wording preserves scoreSource=mock and source-depth not_ready",
  "CONDITION-009 data wording blocks Supabase, SQL, staging, daily_prices, seed SQL, raw market data, and scoreSource=real",
  "CONDITION-010 design wording keeps visible UI polish deferred",
  "STOP-LINE-001 do not submit without explicit user/chairman direction",
  "STOP-LINE-002 do not treat submission as authorization",
  "STOP-LINE-003 do not treat submission as runtime entry",
  "STOP-LINE-004 do not treat a yes answer as runtime implementation approval",
  "STOP-LINE-005 do not create an authorization packet",
  "STOP-LINE-006 do not create a real request packet",
  "STOP-LINE-007 do not schedule a formal meeting",
  "STOP-LINE-008 do not connect to Supabase",
  "STOP-LINE-009 do not run SQL",
  "STOP-LINE-010 do not fetch market data",
  "STOP-LINE-011 do not parse market rows",
  "STOP-LINE-012 do not write staging rows",
  "STOP-LINE-013 do not write daily_prices",
  "STOP-LINE-014 do not create seed SQL",
  "STOP-LINE-015 do not wire runtime code",
  "STOP-LINE-016 do not set scoreSource=real",
  "STOP-LINE-017 do not clear source-depth not_ready",
  "STOP-LINE-018 do not make public claims",
  "CEO recommendation: ask the user/chairman whether to submit this exact question",
  "CEO recommendation: do not submit automatically",
  "CEO recommendation: if user/chairman says yes, create a separate submission-record slice before any runtime planning",
  "CEO recommendation: if user/chairman says no, continue local-only governance",
  "CEO recommendation: if user/chairman revises, return to boundary review",
  "USER-DECISION-A submit this exact question for chairman review",
  "USER-DECISION-B do not submit and continue local-only governance",
  "USER-DECISION-C revise the question or boundary first",
  "scripts/check-cp3-chairman-narrow-question-submit-readiness-checkpoint.mjs passes",
  "scripts/check-cp3-chairman-narrow-question-draft-gate-role-review.mjs passes",
  "scripts/check-cp3-chairman-narrow-question-draft-gate.mjs passes",
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
  "question is approved",
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
  "production-ready approved",
  "submit automatically now",
  "submitted by this checkpoint as an action"
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
