import fs from "node:fs";

const reportPath = "docs/reviews/CP3_BOUNDED_MOCK_ONLY_RUNTIME_IMPLEMENTATION_APPROVAL_GATE_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 bounded mock-only runtime implementation approval gate recorded",
  "APPROVE_NEXT_SLICE_MOCK_ONLY_RUNTIME_IMPLEMENTATION",
  "CEO approves the next coherent implementation slice to refine mock-only runtime\nstate wiring after this gate passes and is committed.",
  "bounded\nimplementation entry gate for local runtime UI/state work only",
  "does not approve Supabase connection",
  "does not approve SQL\nexecution",
  "does not approve market-data fetch",
  "does not approve market-row\nparsing",
  "does not approve Supabase writes",
  "does not approve staging rows",
  "does\nnot approve daily_prices writes",
  "does not approve seed SQL",
  "does not approve\nscoreSource=real",
  "does not clear source-depth not_ready",
  "does not approve\npublic claims",
  "APPROVED-SCOPE-001 next slice may edit mock-only runtime state wiring",
  "APPROVED-SCOPE-002 next slice may edit local UI disclosure wiring",
  "APPROVED-SCOPE-003 next slice may edit local mock-only copy if it preserves not_ready boundaries",
  "APPROVED-SCOPE-004 next slice may strengthen local static guards",
  "APPROVED-SCOPE-005 next slice must keep public data source mock",
  "APPROVED-SCOPE-006 next slice must keep scoreSource=mock",
  "APPROVED-SCOPE-007 next slice must keep source-depth not_ready",
  "APPROVED-SCOPE-008 next slice must keep source-rights not_ready",
  "APPROVED-SCOPE-009 next slice must keep public claims not_ready",
  "ALLOWED-FILE-001 src/lib/cp3-mock-only-runtime-state.ts",
  "ALLOWED-FILE-002 src/components/cp3-runtime-state-panel.tsx",
  "ALLOWED-FILE-003 src/components/dashboard-shell.tsx",
  "ALLOWED-FILE-004 src/app/globals.css",
  "ALLOWED-FILE-005 scripts/check-cp3-mock-only-runtime-panel.mjs",
  "ALLOWED-FILE-006 scripts/check-review-gates.mjs only if a new checker is added",
  "No other file may be edited in the next implementation slice unless CEO records\na revised bounded implementation approval gate first.",
  "BLOCKED-NEXT-001 no Supabase connection",
  "BLOCKED-NEXT-002 no SQL execution",
  "BLOCKED-NEXT-003 no market-data fetch",
  "BLOCKED-NEXT-004 no market-row parsing",
  "BLOCKED-NEXT-005 no Supabase writes",
  "BLOCKED-NEXT-006 no staging rows",
  "BLOCKED-NEXT-007 no daily_prices writes",
  "BLOCKED-NEXT-008 no seed SQL",
  "BLOCKED-NEXT-009 no scoreSource=real",
  "BLOCKED-NEXT-010 no source-depth readiness promotion",
  "BLOCKED-NEXT-011 no public claims",
  "BLOCKED-NEXT-012 no production-ready wording",
  "BLOCKED-NEXT-013 no real-data readiness wording",
  "BLOCKED-NEXT-014 no officialness wording",
  "BLOCKED-NEXT-015 no investment advice wording",
  "REQUIRED-CHECK-001 scripts/check-cp3-mock-only-runtime-panel.mjs",
  "REQUIRED-CHECK-002 scripts/check-cp3-runtime-policy-draft.mjs",
  "REQUIRED-CHECK-003 scripts/check-cp3-ui-copy-tokens-draft.mjs",
  "REQUIRED-CHECK-004 node_modules/typescript/bin/tsc --noEmit",
  "REQUIRED-CHECK-005 scripts/check-review-gates.mjs",
  "BROWSER-ROUTE-001 /stocks/2330",
  "BROWSER-ROUTE-002 /stocks/TWII",
  "BROWSER-ROUTE-003 /briefing",
  "Browser verification may inspect local UI only.",
  "must not\nconnect to Supabase",
  "must not run validators against Supabase",
  "must not fetch\nmarket data",
  "must not parse market rows",
  "must not change runtime source\nbehavior",
  "ACCELERATION-STEP-001 execute bounded mock-only runtime implementation next",
  "ACCELERATION-STEP-002 review mock-only runtime behavior and UI disclosure",
  "ACCELERATION-STEP-003 prepare separate Supabase read-only validation authorization gate",
  "ACCELERATION-STEP-004 prepare separate SQL execution authorization gate only after read-only validation readiness",
  "ACCELERATION-STEP-005 prepare separate real market-data ingestion authorization gate only after source-depth and rights are ready",
  "ACCELERATION-STEP-006 prepare separate scoreSource=real authorization gate only after real data, source-depth, rights, QA, Legal, and Investment gates pass",
  "CEO resolves speed-versus-control by entering runtime implementation now only for mock-only local wiring",
  "CEO keeps Supabase, SQL, real market data, and scoreSource=real on a fast follow gated roadmap",
  "CEO rejects bundling database access, real data, and scoreSource=real into the first runtime implementation slice",
  "CEO directs PM to execute the bounded mock-only runtime implementation slice next after this gate is committed",
  "scripts/check-cp3-bounded-mock-only-runtime-implementation-approval-gate.mjs passes",
  "scripts/check-cp3-bounded-mock-only-runtime-entry-request-draft-role-review.mjs passes",
  "scripts/check-cp3-bounded-mock-only-runtime-entry-request-draft.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 source-depth production gate remains not_ready",
  "Supabase and SQL execution remain blocked",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "Supabase connection is approved",
  "SQL execution is approved",
  "market-data fetch is approved",
  "market data fetch is approved",
  "market-row parsing is approved",
  "market rows are parsed",
  "Supabase writes are approved",
  "staging rows are written",
  "daily_prices rows are written",
  "seed SQL is created",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public claims are approved",
  "production-ready approved",
  "real-data readiness approved",
  "officialness approved",
  "investment advice approved",
  "may edit any file",
  "may connect to Supabase",
  "may run SQL",
  "may fetch market data"
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
