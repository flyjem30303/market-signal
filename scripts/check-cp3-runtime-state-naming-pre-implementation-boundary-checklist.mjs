import fs from "node:fs";

const reportPath = "docs/reviews/CP3_RUNTIME_STATE_NAMING_PRE_IMPLEMENTATION_BOUNDARY_CHECKLIST_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 runtime state naming pre-implementation boundary checklist recorded",
  "STOP_BEFORE_RUNTIME_IMPLEMENTATION",
  "boundary immediately before runtime implementation",
  "sufficient to report stage work items",
  "not sufficient to implement runtime state naming",
  "wire UI",
  "read remote state\npackets",
  "connect to Supabase",
  "run SQL",
  "fetch market data",
  "parse market rows",
  "set\nscoreSource=real",
  "clear source-depth not_ready",
  "make public claims",
  "does not approve authorization",
  "does not schedule a formal\nmeeting",
  "does not create an authorization packet",
  "does not create a real request\npacket",
  "does not create real evidence artifact files",
  "does not connect to\nSupabase",
  "does not run SQL",
  "does not fetch market data",
  "does not parse market\nrows",
  "does not write Supabase",
  "does not write staging rows",
  "does not write\ndaily_prices",
  "does not create seed SQL",
  "does not wire runtime code",
  "does not\nimplement runtime state naming",
  "does not set scoreSource=real",
  "does not clear\nsource-depth not_ready",
  "does not make public claims",
  "STAGE-WORK-001 runtime state naming acceptance criteria recorded",
  "STAGE-WORK-002 allowed state names recorded: mock, internal_review, blocked, partial, stale, unavailable, approved, unknown",
  "STAGE-WORK-003 rejected state names recorded: real_ready, production_ready, verified, trusted, official, live, accurate, complete, safe, recommended",
  "STAGE-WORK-004 role responsibilities recorded for CEO, PM, Engineering, QA, Legal, Investment, Design, Chairman",
  "STAGE-WORK-005 runtime source contract alignment recorded",
  "STAGE-WORK-006 local-only checker design recorded",
  "STAGE-WORK-007 future checker input boundaries recorded",
  "STAGE-WORK-008 forbidden future checker outcomes recorded",
  "STAGE-WORK-009 runtime implementation stop conditions recorded",
  "STAGE-WORK-010 review gate registration recorded for local-only documents",
  "BLOCKED-BEFORE-RUNTIME-001 runtime implementation approval is missing",
  "BLOCKED-BEFORE-RUNTIME-002 public UI copy approval is missing",
  "BLOCKED-BEFORE-RUNTIME-003 public claim approval is missing",
  "BLOCKED-BEFORE-RUNTIME-004 source-depth production gate remains not_ready",
  "BLOCKED-BEFORE-RUNTIME-005 scoreSource=real remains blocked",
  "BLOCKED-BEFORE-RUNTIME-006 Supabase connection remains blocked",
  "BLOCKED-BEFORE-RUNTIME-007 SQL execution remains blocked",
  "BLOCKED-BEFORE-RUNTIME-008 market data fetch remains blocked",
  "BLOCKED-BEFORE-RUNTIME-009 market row parsing remains blocked",
  "BLOCKED-BEFORE-RUNTIME-010 runtime state packet source remains non-runtime only",
  "BLOCKED-BEFORE-RUNTIME-011 Legal source-rights approval remains unresolved",
  "BLOCKED-BEFORE-RUNTIME-012 Chairman and CEO authorization remains required for external-system or real-data action",
  "RUNTIME-DISCUSSION-ENTRY-001 CEO must explicitly approve moving from local-only design to runtime implementation planning",
  "RUNTIME-DISCUSSION-ENTRY-002 Engineering must identify exact app files before any implementation patch",
  "RUNTIME-DISCUSSION-ENTRY-003 Design must approve user-facing state wording before public UI wiring",
  "RUNTIME-DISCUSSION-ENTRY-004 Legal must approve public claim and officialness-sensitive wording before public display",
  "RUNTIME-DISCUSSION-ENTRY-005 QA must define local UI verification expectations before implementation",
  "RUNTIME-DISCUSSION-ENTRY-006 PM must confirm the implementation slice does not require Supabase, SQL, or real market data",
  "RUNTIME-DISCUSSION-ENTRY-007 CEO must decide whether the implementation remains mock-only",
  "RUNTIME-DISCUSSION-ENTRY-008 Chairman and CEO must authorize any external-system or real-data step separately",
  "STOP-LINE-001 stop now before editing app runtime files",
  "STOP-LINE-002 stop now before importing state names into public components",
  "STOP-LINE-003 stop now before wiring state names to data fetching",
  "STOP-LINE-004 stop now before reading runtime state packets",
  "STOP-LINE-005 stop now before connecting to Supabase",
  "STOP-LINE-006 stop now before running SQL",
  "STOP-LINE-007 stop now before fetching market data",
  "STOP-LINE-008 stop now before parsing market rows",
  "STOP-LINE-009 stop now before setting scoreSource=real",
  "STOP-LINE-010 stop now before clearing source-depth not_ready",
  "STOP-LINE-011 stop now before making public claims",
  "STOP-LINE-012 stop now before implying production readiness",
  "CEO stage report: runtime state naming local-only preparation has reached the pre-implementation boundary",
  "CEO stage report: stage work items are ready to report",
  "CEO stage report: next project move requires a decision whether to plan a mock-only runtime implementation slice",
  "CEO stage report: do not implement runtime until CEO explicitly approves the next implementation-planning phase",
  "CEO stage report: current recommendation is to report stage work items, then request direction for mock-only runtime implementation planning",
  "scripts/check-cp3-runtime-state-naming-pre-implementation-boundary-checklist.mjs passes",
  "scripts/check-cp3-runtime-state-naming-local-only-checker-design.mjs passes",
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
  "runtime state naming is implemented",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public data source is real",
  "public claims are approved for release",
  "release readiness is approved"
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
