import fs from "node:fs";

const reportPath = "docs/reviews/CP3_PRE_RUNTIME_AUTHORIZATION_BOUNDARY_TABLE_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 pre-runtime authorization boundary table recorded",
  "HOLD_RUNTIME_ENTRY",
  "final local-only authorization boundary summary before any\nfuture runtime entry request",
  "not authorization",
  "not runtime implementation",
  "does not approve runtime implementation",
  "does not approve\nauthorization",
  "does not schedule a formal meeting",
  "does not create an\nauthorization packet",
  "does not create a real request packet",
  "does not connect to Supabase",
  "does not run SQL",
  "does not fetch market data",
  "does not parse market rows",
  "does not write\nSupabase",
  "does not write staging rows",
  "does not write daily_prices",
  "does not\ncreate seed SQL",
  "does not wire runtime code",
  "does not set scoreSource=real",
  "does not clear source-depth not_ready",
  "does not make public claims",
  "| Runtime entry | blocked before runtime implementation | no runtime implementation without explicit approval | decide whether to allow mock-only runtime execution planning to proceed |",
  "| Score source | scoreSource=mock | scoreSource=real remains blocked | decide whether any future real-score path may be discussed later |",
  "| Source-depth | not_ready | source-depth production gate remains not_ready | decide whether source-depth evidence review should be scheduled |",
  "| Supabase | out of scope for this table | no connection, read, write, validator, SQL, staging, or daily_prices action | decide whether a separate remote read-only validation review should be prepared |",
  "| Market data | out of scope for this table | no fetch, parse, storage, seed, CSV, JSON, or raw-row commit | decide whether market-data evidence collection may be proposed later |",
  "| Public claims | not_ready | no real, validated, production-ready, advice, or coverage claim | decide whether claim wording review is needed before runtime entry |",
  "| Authorization packet | not created | no packet creation from this table | decide whether CEO should prepare a future packet proposal |",
  "| Formal meeting | not scheduled | no meeting schedule from this table | decide whether a formal review meeting should be requested |",
  "| UI copy and disclosure | mock-only copy is allowed only as guarded product context | visual hierarchy polish is lower priority than authorization boundary clarity | decide whether Design and Legal review is required before further visible copy changes |",
  "| Global expansion | strategic requirement remains active | Taiwan-first work must preserve global market and locale extensibility | decide whether global readiness should be included in the first runtime-entry question |",
  "SAFE-LOCAL-001 maintain documentation indexes",
  "SAFE-LOCAL-002 maintain static review gates",
  "SAFE-LOCAL-003 maintain TypeScript checks",
  "SAFE-LOCAL-004 refine local-only decision tables",
  "SAFE-LOCAL-005 improve wording that preserves mock-only and not_ready boundaries",
  "SAFE-LOCAL-006 prepare role-review summaries that do not request execution",
  "SAFE-LOCAL-007 keep public runtime score source mock",
  "SAFE-LOCAL-008 keep CP3 source-depth production gate not_ready",
  "BLOCKED-001 entering runtime implementation",
  "BLOCKED-002 changing scoreSource behavior",
  "BLOCKED-003 setting scoreSource=real",
  "BLOCKED-004 clearing source-depth not_ready",
  "BLOCKED-005 connecting to Supabase",
  "BLOCKED-006 running SQL",
  "BLOCKED-007 running remote validators",
  "BLOCKED-008 fetching market data",
  "BLOCKED-009 parsing market rows",
  "BLOCKED-010 writing Supabase",
  "BLOCKED-011 writing staging rows",
  "BLOCKED-012 writing daily_prices",
  "BLOCKED-013 creating seed SQL",
  "BLOCKED-014 creating an authorization packet",
  "BLOCKED-015 creating a real request packet",
  "BLOCKED-016 scheduling a formal authorization meeting",
  "BLOCKED-017 making public claims",
  "BLOCKED-018 calling the feature production-ready",
  "ENTRY-CRITERIA-001 CEO names the exact runtime slice",
  "ENTRY-CRITERIA-002 PM names the files that may be edited",
  "ENTRY-CRITERIA-003 Engineering confirms no Supabase, SQL, or market-data work is included",
  "ENTRY-CRITERIA-004 QA names local checks and browser routes",
  "ENTRY-CRITERIA-005 Legal confirms the wording does not imply advice, officialness, reliability, or real-data readiness",
  "ENTRY-CRITERIA-006 Design confirms the visible copy is clear enough for users",
  "ENTRY-CRITERIA-007 Data confirms scoreSource=real remains blocked",
  "ENTRY-CRITERIA-008 Investment confirms real-score and source-depth claims remain not_ready",
  "ENTRY-CRITERIA-009 Chairman explicitly approves the bounded runtime-entry question",
  "CEO recommendation: do not enter runtime implementation yet",
  "CEO recommendation: use this table as the chairman review boundary",
  "CEO recommendation: next safe slice should be role review of this boundary table",
  "CEO recommendation: visual and information hierarchy polish stays lower priority until this boundary is accepted",
  "approve mock-only runtime entry with scoreSource=mock, source-depth not_ready, no Supabase, no SQL, no market data, and no public claims",
  "scripts/check-cp3-pre-runtime-authorization-boundary-table.mjs passes",
  "scripts/check-cp3-mock-only-runtime-implementation-stop-gate.mjs passes",
  "scripts/check-cp3-chairman-authorization-scope-readiness-summary.mjs passes",
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
  "SQL execution is allowed",
  "remote validator is allowed",
  "market data fetch is allowed",
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
