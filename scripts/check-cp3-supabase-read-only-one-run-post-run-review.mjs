import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SUPABASE_READ_ONLY_ONE_RUN_POST_RUN_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 Supabase read-only one-run post-run review recorded",
  "RUN-DECISION-001 CEO-controlled single read-only validation checkpoint entered",
  "RUN-DECISION-002 pre-run local gates passed",
  "RUN-DECISION-003 validator command was attempted once",
  "RUN-DECISION-004 command scope was npm run db:readonly-validate",
  "RUN-OUTCOME-001 status blocked",
  "RUN-OUTCOME-002 validator did not return valid JSON for the remote attempt",
  "RUN-OUTCOME-003 terminal returned Access is denied",
  "RUN-OUTCOME-004 no Supabase readiness evidence is accepted from this attempt",
  "RUN-OUTCOME-005 no object reachability is accepted from this attempt",
  "PRE-RUN-001 scripts/check-cp3-supabase-read-only-one-run-execution-gate-role-review.mjs passed",
  "PRE-RUN-004 scripts/check-cp3-supabase-read-only-validator-skeleton.mjs passed",
  "PRE-RUN-005 TypeScript noEmit passed",
  "PRE-RUN-006 scripts/check-review-gates.mjs passed",
  "PRE-RUN-007 git status was clean before the attempted run",
  "DIAGNOSTIC-001 validator default fail-closed path still returns redacted JSON",
  "DIAGNOSTIC-002 .env.local exists",
  "DIAGNOSTIC-003 required environment names can be loaded as present without printing values",
  "DIAGNOSTIC-004 npm command runner is available",
  "DIAGNOSTIC-005 diagnostic commands did not print secret values",
  "DIAGNOSTIC-006 diagnostic commands did not print row payloads",
  "DIAGNOSTIC-007 no second remote validation attempt was made after the blocked run",
  "OUTPUT-001 no row payloads were printed",
  "OUTPUT-002 no secrets were printed",
  "OUTPUT-003 no key prefixes were printed",
  "OUTPUT-004 no key suffixes were printed",
  "OUTPUT-005 no key lengths were printed",
  "OUTPUT-006 no raw market data was printed",
  "OUTPUT-007 no remote rows were committed",
  "BOUNDARY-001 SQL execution remained blocked",
  "BOUNDARY-003 Supabase writes remained blocked",
  "BOUNDARY-004 insert update upsert delete remained blocked",
  "BOUNDARY-010 public data source remained mock",
  "BOUNDARY-011 scoreSource=real remained blocked",
  "BOUNDARY-012 CP3 source-depth production gate remained not_ready",
  "BOUNDARY-013 public claims remained blocked",
  "CEO-FINDING-001 the attempted checkpoint did not produce usable Supabase readiness evidence",
  "CEO-FINDING-002 the project should not promote runtime readiness from this result",
  "CEO-FINDING-003 the next acceleration should be a narrow execution-environment diagnostic plan, not ingestion",
  "PM-FINDING-002 no repeated remote attempts should occur without a fresh diagnostic gate",
  "ENGINEERING-FINDING-001 validator fail-closed behavior remains intact",
  "ENGINEERING-FINDING-003 the blocked result appears to be execution-environment or permission related",
  "QA-FINDING-002 the blocked result must not be treated as validation success",
  "DATA-FINDING-001 no object reachability evidence is accepted",
  "SECURITY-FINDING-001 no secret material was printed in the recorded output",
  "LEGAL-FINDING-001 no public claim can be made from this result",
  "The single read-only validation checkpoint was attempted and ended blocked with\nAccess is denied before valid validator JSON was produced.",
  "This is not a data\nreadiness milestone.",
  "next slice should isolate the execution-environment permission issue before any\nnew remote validation attempt",
  "NEXT-SLICE-001 draft a narrow execution-environment diagnostic gate",
  "NEXT-SLICE-002 do not retry remote validation until that diagnostic gate passes",
  "NEXT-SLICE-003 keep diagnostic output redacted",
  "scripts/check-cp3-supabase-read-only-one-run-post-run-review.mjs passes",
  "scripts/check-cp3-supabase-read-only-one-run-execution-gate-role-review.mjs passes",
  "scripts/check-cp3-supabase-read-only-validator-skeleton.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "SQL execution remains blocked",
  "Supabase writes remain blocked",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 source-depth production gate remains not_ready",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "VALIDATION_SUCCESS_ACCEPTED",
  "OBJECT_REACHABILITY_ACCEPTED",
  "REMOTE_ROWS_COMMITTED",
  "SQL execution is approved",
  "Supabase writes are approved",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public claims are approved",
  "market ingestion is approved",
  "schema changes are approved",
  "retry remote validation now"
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
