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
  "Separate accepted gate required before SQL, writes, public source promotion, or scoreSource=real",
  "SQL execution",
  "Supabase writes",
  "raw market data fetch or ingestion",
  "publicDataSource=supabase",
  "scoreSource=real",
  "record exactly one attempt",
  "record sanitized aggregate only",
  "currentDefaultRoute: \"post_readonly_runtime_decision\"",
  "Post-readonly decision: Supabase object reachability is accepted",
  "CEO explicitly names a bounded schema, freshness, quality, or source-depth gate",
  "Default route: post-readonly runtime decision",
  "Optional route: schema, freshness, and quality gate",
  "schema shape",
  "data freshness",
  "row coverage",
  "data quality",
  "source-depth",
  "requires_separate_ceo_named_action"
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
  "Automated remote run remains",
  "Post-run review readiness card",
  "executionPreview.postRunReviewTarget",
  "executionPreview.postRunAcceptedOutcomeCategories",
  "executionPreview.readinessPromotionBlocked",
  "executionPreview.blockedPromotions",
  "RuntimeSectionLabel",
  "Top decision",
  "One-attempt guard",
  "Evidence details",
  "Work lanes",
  "Runtime route snapshot",
  "runtimeGateBrief.currentDefaultRoute",
  "runtimeGateBrief.decisionPoint",
  "runtimeGateBrief.routeOptions",
  "runtimeGateBrief.separateRemoteTrigger"
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
  ".runtime-single-attempt-card article.blocked",
  ".runtime-post-run-review-card",
  ".runtime-post-run-review-card article.blocked",
  ".runtime-section-label",
  ".runtime-route-snapshot"
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
