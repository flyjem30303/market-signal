import fs from "node:fs";

const reportPath = "docs/reviews/CP3_5PM_RUNTIME_READINESS_CHECKPOINT_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 17:00 runtime readiness checkpoint recorded",
  "PROCEED with local mock-only runtime readiness work",
  "READY-LOCAL-001 mock-only runtime panel is implemented",
  "READY-LOCAL-002 runtime upgrade requirements are visible",
  "READY-LOCAL-003 runtime upgrade progress is visible",
  "READY-LOCAL-004 source-depth evidence items are visible",
  "READY-LOCAL-005 source-depth evidence acceptance criteria are visible",
  "READY-LOCAL-006 source-depth evidence progress is visible",
  "READY-LOCAL-007 public data source remains mock",
  "READY-LOCAL-008 CP3 source-depth production gate remains not_ready",
  "READY-LOCAL-009 review gates pass with expected blocked and not_ready states",
  "READY-LOCAL-010 TypeScript noEmit passes",
  "STOP-001 does not approve authorization",
  "STOP-002 does not schedule a formal meeting",
  "STOP-003 does not create an authorization packet",
  "STOP-004 does not create a real request packet",
  "STOP-005 does not connect to Supabase",
  "STOP-006 does not run SQL",
  "STOP-007 does not fetch market data",
  "STOP-008 does not parse market rows",
  "STOP-009 does not write Supabase",
  "STOP-010 does not write staging rows",
  "STOP-011 does not write daily_prices",
  "STOP-012 does not create seed SQL",
  "STOP-013 does not set scoreSource=real",
  "STOP-014 does not clear source-depth not_ready",
  "STOP-015 does not make public claims",
  "source-depth evidence still needs real evidence artifacts before production clearance",
  "source-rights and redistribution review still needs Legal confirmation",
  "Supabase read-only validation still needs a deliberate execution window",
  "scoreSource=real remains blocked until evidence, rights, QA, Legal, Investment, CEO, and chairman-authorized gates pass",
  "Next safe slice: continue local runtime readiness by improving the visible mock-only readiness state and static guards",
  "Fast-follow gated slice: prepare Supabase read-only validation execution only when CEO deliberately opens that gate",
  "Do not bundle Supabase, SQL, real market data, and scoreSource=real into the same slice",
  "scripts/check-cp3-5pm-runtime-readiness-checkpoint.mjs passes",
  "scripts/check-cp3-mock-only-runtime-panel.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes"
];

const forbiddenPhrases = [
  "authorization is approved",
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
