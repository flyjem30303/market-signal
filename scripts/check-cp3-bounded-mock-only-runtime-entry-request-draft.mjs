import fs from "node:fs";

const reportPath = "docs/reviews/CP3_BOUNDED_MOCK_ONLY_RUNTIME_ENTRY_REQUEST_DRAFT_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 bounded mock-only runtime-entry request draft recorded",
  "REQUEST_DRAFT_ONLY",
  "bounded mock-only runtime-entry request draft",
  "not runtime implementation approval",
  "not runtime entry execution approval",
  "not\nauthorization packet creation",
  "not a real request packet",
  "does not connect to Supabase",
  "does not run SQL",
  "does not\nfetch market data",
  "does not parse market rows",
  "does not write Supabase",
  "does\nnot write staging rows",
  "does not write daily_prices",
  "does not create seed SQL",
  "does not wire runtime code",
  "does not set scoreSource=real",
  "does not clear\nsource-depth not_ready",
  "does not make public claims",
  "REQUEST-SCOPE-001 allow a future implementation slice to refine mock-only runtime state wiring",
  "REQUEST-SCOPE-002 keep scoreSource=mock",
  "REQUEST-SCOPE-003 keep source-depth not_ready",
  "REQUEST-SCOPE-004 keep source-rights not_ready",
  "REQUEST-SCOPE-005 keep public claims not_ready",
  "REQUEST-SCOPE-006 keep no Supabase",
  "REQUEST-SCOPE-007 keep no SQL",
  "REQUEST-SCOPE-008 keep no market-data fetch or parsing",
  "REQUEST-SCOPE-009 keep no staging rows",
  "REQUEST-SCOPE-010 keep no daily_prices",
  "REQUEST-SCOPE-011 keep no seed SQL",
  "REQUEST-SCOPE-012 keep no public claim wording",
  "REQUEST-SCOPE-013 keep no production-ready wording",
  "FUTURE-FILE-001 src/lib/cp3-mock-only-runtime-state.ts",
  "FUTURE-FILE-002 src/components/cp3-runtime-state-panel.tsx",
  "FUTURE-FILE-003 src/components/dashboard-shell.tsx",
  "FUTURE-FILE-004 src/app/globals.css",
  "FUTURE-FILE-005 scripts/check-cp3-mock-only-runtime-panel.mjs",
  "FUTURE-FILE-006 scripts/check-review-gates.mjs only if a new checker is added",
  "No other file may be edited in the future implementation slice unless CEO\nrecords a revised bounded request draft first.",
  "FUTURE-CHECK-001 scripts/check-cp3-mock-only-runtime-panel.mjs",
  "FUTURE-CHECK-002 scripts/check-cp3-runtime-policy-draft.mjs",
  "FUTURE-CHECK-003 scripts/check-cp3-ui-copy-tokens-draft.mjs",
  "FUTURE-CHECK-004 node_modules/typescript/bin/tsc --noEmit",
  "FUTURE-CHECK-005 scripts/check-review-gates.mjs",
  "FUTURE-BROWSER-001 /stocks/2330",
  "FUTURE-BROWSER-002 /stocks/TWII",
  "FUTURE-BROWSER-003 /briefing",
  "Browser verification may inspect local UI only.",
  "must not\nconnect to Supabase",
  "must not run validators",
  "must not fetch market data",
  "must not change runtime source behavior",
  "ENTRY-STOP-001 do not implement from this request draft",
  "ENTRY-STOP-002 do not edit runtime files until a separate implementation approval gate exists",
  "ENTRY-STOP-003 do not connect to Supabase",
  "ENTRY-STOP-004 do not run SQL",
  "ENTRY-STOP-005 do not fetch market data",
  "ENTRY-STOP-006 do not parse market rows",
  "ENTRY-STOP-007 do not write Supabase",
  "ENTRY-STOP-008 do not write staging rows",
  "ENTRY-STOP-009 do not write daily_prices",
  "ENTRY-STOP-010 do not create seed SQL",
  "ENTRY-STOP-011 do not set scoreSource=real",
  "ENTRY-STOP-012 do not clear source-depth not_ready",
  "ENTRY-STOP-013 do not make public claims",
  "ENTRY-STOP-014 do not call the feature production-ready",
  "IMPLEMENTATION-APPROVAL-001 CEO must record a separate bounded implementation approval gate",
  "IMPLEMENTATION-APPROVAL-002 PM must restate exact files to edit",
  "IMPLEMENTATION-APPROVAL-003 Engineering must confirm no external-system action",
  "IMPLEMENTATION-APPROVAL-004 QA must confirm local checks and local browser routes",
  "IMPLEMENTATION-APPROVAL-005 Legal must confirm no advice, officialness, reliability, real-data readiness, authorization, or public-claim implication",
  "IMPLEMENTATION-APPROVAL-006 Investment must confirm real-score and source-depth claims remain not_ready",
  "IMPLEMENTATION-APPROVAL-007 Data must confirm scoreSource=real remains blocked",
  "IMPLEMENTATION-APPROVAL-008 Design must confirm any visible copy remains mock-only",
  "CEO recommendation: role-review this bounded request draft next",
  "CEO recommendation: do not implement runtime until the request draft is role-reviewed and a separate implementation approval gate is recorded",
  "scripts/check-cp3-bounded-mock-only-runtime-entry-request-draft.mjs passes",
  "scripts/check-cp3-chairman-oral-review-delegation.mjs passes",
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
  "market rows are parsed",
  "staging rows are written",
  "daily_prices rows are written",
  "seed SQL is created",
  "runtime code is wired",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public claims are approved",
  "production-ready approved",
  "may implement from this request draft"
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
