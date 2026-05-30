import fs from "node:fs";

const reportPath = "docs/reviews/CP3_NON_RUNTIME_READINESS_GAP_SUMMARY_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 non-runtime readiness gap summary recorded",
  "PROCEED",
  "non-runtime readiness work",
  "concrete local-only gaps",
  "does not approve authorization",
  "does not schedule a\nformal meeting",
  "does not create an authorization packet",
  "does not create a real\nrequest packet",
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
  "GAP-CATEGORY-001 source-depth evidence remains incomplete",
  "GAP-CATEGORY-002 runtime UI copy has no implementation approval",
  "GAP-CATEGORY-003 runtime data state naming has no implementation approval",
  "GAP-CATEGORY-004 public claim wording has no release approval",
  "GAP-CATEGORY-005 source-rights and redistribution review remain unresolved",
  "GAP-CATEGORY-006 real-data validation authorization remains pending",
  "GAP-CATEGORY-007 Supabase and SQL execution authorization remains pending",
  "GAP-CATEGORY-008 scoreSource=real transition remains pending",
  "GAP-CATEGORY-009 chairman authorization scope remains pending",
  "GAP-CATEGORY-010 production readiness acceptance criteria remain local-only",
  "ALLOWED-NON-RUNTIME-001 summarize readiness gaps without approving them",
  "ALLOWED-NON-RUNTIME-002 map gaps to required owners",
  "ALLOWED-NON-RUNTIME-003 draft acceptance criteria as non-runtime text",
  "ALLOWED-NON-RUNTIME-004 refine mock disclosure language as internal guidance only",
  "ALLOWED-NON-RUNTIME-005 register static checkers for local-only documents",
  "ALLOWED-NON-RUNTIME-006 update review gates for local-only documents",
  "ALLOWED-NON-RUNTIME-007 keep public data source mock",
  "ALLOWED-NON-RUNTIME-008 keep CP3 source-depth production gate not_ready",
  "BLOCKED-NON-RUNTIME-001 do not implement runtime UI copy from this summary",
  "BLOCKED-NON-RUNTIME-002 do not implement runtime data state naming from this summary",
  "BLOCKED-NON-RUNTIME-003 do not create authorization packet from this summary",
  "BLOCKED-NON-RUNTIME-004 do not create real request packet from this summary",
  "BLOCKED-NON-RUNTIME-005 do not create real evidence artifact files from this summary",
  "BLOCKED-NON-RUNTIME-006 do not connect to Supabase from this summary",
  "BLOCKED-NON-RUNTIME-007 do not run SQL from this summary",
  "BLOCKED-NON-RUNTIME-008 do not fetch market data from this summary",
  "BLOCKED-NON-RUNTIME-009 do not parse market rows from this summary",
  "BLOCKED-NON-RUNTIME-010 do not set scoreSource=real from this summary",
  "BLOCKED-NON-RUNTIME-011 do not clear source-depth not_ready from this summary",
  "BLOCKED-NON-RUNTIME-012 do not make public claims from this summary",
  "source-depth evidence gap owner: CEO and Investment",
  "runtime UI copy approval gap owner: CEO, Design, Legal, Marketing",
  "runtime data state naming gap owner: CEO, Engineering, QA",
  "public claim wording gap owner: CEO, Legal, Investment, Marketing",
  "source-rights and redistribution gap owner: Legal",
  "real-data validation authorization gap owner: Chairman and CEO",
  "Supabase and SQL authorization gap owner: Chairman and CEO",
  "scoreSource=real transition gap owner: Chairman, CEO, Investment",
  "chairman authorization scope gap owner: Chairman and CEO",
  "production readiness acceptance criteria gap owner: CEO, PM, QA",
  "Pace guidance: continue moving faster on local-only readiness clarity",
  "Pace guidance: reduce repeated governance-only checkpoint loops",
  "Pace guidance: keep one document plus one checker for normal fast-lane slices",
  "Pace guidance: stop when a gap is converted into implementation",
  "Pace guidance: stop when authorization, external system, real data, runtime wiring, scoreSource=real, or public claim is requested",
  "Next safe slice: prepare CP3 non-runtime readiness gap owner-action matrix",
  "Alternative next safe slice: prepare runtime copy approval gate only if UI copy is requested",
  "CEO recommendation: prepare CP3 non-runtime readiness gap owner-action matrix",
  "The next safe slice must remain local-only",
  "The next safe slice must not approve authorization",
  "The next safe slice must not schedule a formal meeting",
  "The next safe slice must not create an authorization packet",
  "The next safe slice must not create a real request packet",
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
  "scripts/check-cp3-non-runtime-readiness-gap-summary.mjs passes",
  "scripts/check-cp3-local-only-open-decision-ledger-refresh-checkpoint-summary.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "CP3 source-depth production gate remains not_ready"
];

const forbiddenPhrases = [
  "authorization is approved",
  "authorization has been approved",
  "formal meeting is scheduled",
  "authorization packet is created",
  "real request packet is created",
  "Supabase connection is allowed",
  "SQL execution is allowed",
  "market data fetch is allowed",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public data source is real",
  "public claims are approved"
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
