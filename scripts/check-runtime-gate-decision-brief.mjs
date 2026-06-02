import fs from "node:fs";

const libPath = "src/lib/runtime-gate-decision-brief.ts";
const panelPath = "src/components/runtime-readiness-panel.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const lib = fs.readFileSync(libPath, "utf8");
const panel = fs.readFileSync(panelPath, "utf8");
const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const missing = [];
const forbidden = [];

for (const phrase of [
  "getRuntimeGateDecisionBrief",
  "runtime_gate_decision_brief",
  "local_ready_remote_requires_separate_authorization",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "CEO must explicitly name one bounded Supabase readonly attempt",
  "SQL execution",
  "Supabase writes",
  "raw market data fetch or ingestion",
  "publicDataSource=supabase",
  "scoreSource=real",
  "record exactly one attempt",
  "record sanitized aggregate only"
]) {
  if (!lib.includes(phrase)) missing.push(`${libPath}: ${phrase}`);
}

for (const phrase of [
  "getRuntimeGateDecisionBrief",
  "runtimeGateBrief.status",
  "Runtime gate decision",
  "runtimeGateBrief.requiredAuthorization",
  "runtimeGateBrief.blockedNow",
  "Runtime state summary",
  "Runtime decision snapshot",
  "runtimeGateBrief.allowedNow",
  "runtimeGateBrief.pmNextStep",
  "separate authorization",
  "Single-attempt authorization command card",
  "Single-attempt command card",
  "executionPreview.requiredConfirmation",
  "executionPreview.exactCommandPreview",
  "executionPreview.manualRunPrerequisites",
  "executionPreview.stopConditions",
  "Automated remote run remains"
]) {
  if (!panel.includes(phrase)) missing.push(`${panelPath}: ${phrase}`);
}

const css = fs.readFileSync("src/app/globals.css", "utf8");

for (const phrase of [
  ".runtime-state-strip",
  ".runtime-state-pill",
  ".runtime-decision-snapshot",
  ".runtime-decision-snapshot article.blocked",
  ".runtime-single-attempt-card",
  ".runtime-single-attempt-card article.blocked"
]) {
  if (!css.includes(phrase)) missing.push(`src/app/globals.css: ${phrase}`);
}

for (const [file, content, phrase] of [
  [packagePath, packageJson, "\"check:runtime-gate-decision-brief\": \"node scripts/check-runtime-gate-decision-brief.mjs\""],
  [reviewGatePath, reviewGate, "scripts/check-runtime-gate-decision-brief.mjs"]
]) {
  if (!content.includes(phrase)) missing.push(`${file}: ${phrase}`);
}

for (const [file, content] of [
  [libPath, lib],
  [panelPath, panel]
]) {
  for (const phrase of [
    "@supabase/supabase-js",
    "createClient",
    "fetch(",
    ".from(",
    "process.env",
    "scoreSource: \"real\"",
    "publicDataSource: \"supabase\"",
    "SQL execution is approved",
    "Supabase writes are approved",
    "RUN_REMOTE_NOW",
    "EXECUTION_COMPLETED"
  ]) {
    if (content.includes(phrase)) forbidden.push(`${file}: ${phrase}`);
  }
}

if (/command:\s*\[node,\s*"scripts\/run-row-coverage-readonly-once\.mjs"\]/.test(reviewGate)) {
  forbidden.push(`${reviewGatePath}: review gate must not execute row coverage runner`);
}

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status: forbidden.length === 0 && missing.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (forbidden.length > 0 || missing.length > 0) {
  process.exitCode = 1;
}
