import fs from "node:fs";

const libPath = "src/lib/runtime-gate-decision-brief.ts";
const readinessPanelPath = "src/components/runtime-readiness-panel.tsx";
const progressPanelPath = "src/components/project-progress-panel.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const lib = fs.readFileSync(libPath, "utf8");
const readinessPanel = fs.readFileSync(readinessPanelPath, "utf8");
const progressPanel = fs.readFileSync(progressPanelPath, "utf8");
const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const css = fs.readFileSync("src/app/globals.css", "utf8");

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
  "displayStatus",
  "displayDecisionPoint",
  "displayRouteTitle",
  "displaySourceBoundary",
  "displayScoreSource",
  "displayAllowedNowTitle",
  "displayBlockedNowTitle",
  "displayNextStep",
  "displayRemoteTrigger",
  "本地可整理，遠端需另行授權",
  "公開資料來源：mock",
  "分數來源：mock",
  "現在可做",
  "目前封鎖",
  "目前預設",
  "需另行授權",
  "只有 CEO 另行命名 bounded gate",
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
  "runtimeGateBrief.displayStatus",
  "runtimeGateBrief.displayDecisionPoint",
  "runtimeGateBrief.displayRouteTitle",
  "runtimeGateBrief.displaySourceBoundary",
  "runtimeGateBrief.displayScoreSource",
  "runtimeGateBrief.displayAllowedNowTitle",
  "runtimeGateBrief.displayBlockedNowTitle",
  "runtimeGateBrief.displayNextStep",
  "runtimeGateBrief.displayRemoteTrigger",
  "Single-attempt authorization command card",
  "Post-run review readiness card",
  "Runtime route snapshot",
  "runtimeGateBrief.routeOptions",
  "option.displayStatus"
]) {
  if (!readinessPanel.includes(phrase)) missing.push(`${readinessPanelPath}: ${phrase}`);
}

for (const phrase of [
  "runtimeGate.displayRouteTitle",
  "runtimeGate.displayDecisionPoint",
  "runtimeGate.displayStatus",
  "runtimeGate.displayRemoteTrigger",
  "runtimeGate.displaySourceBoundary",
  "runtimeGate.displayScoreSource",
  "runtimeGate.displayBlockedNowTitle"
]) {
  if (!progressPanel.includes(phrase)) missing.push(`${progressPanelPath}: ${phrase}`);
}

for (const phrase of [
  ".runtime-state-strip",
  ".runtime-state-pill",
  ".runtime-decision-snapshot",
  ".runtime-single-attempt-card",
  ".runtime-post-run-review-card",
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
  [readinessPanelPath, readinessPanel],
  [progressPanelPath, progressPanel]
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

for (const phrase of [
  ">{runtimeGateBrief.currentDefaultRoute}</strong>",
  ">{runtimeGateBrief.publicDataSource}</strong>",
  ">{runtimeGateBrief.scoreSource}</strong>",
  ">separate authorization</strong>",
  "Remote trigger: {runtimeGateBrief.separateRemoteTrigger}",
  ">{runtimeGateBrief.pmNextStep}</p>",
  ">{option.status}</span>",
  ">{runtimeGate.currentDefaultRoute}</strong>",
  "{runtimeGate.publicDataSource} / {runtimeGate.scoreSource}",
  ">{runtimeGate.separateRemoteTrigger}</strong>"
]) {
  if (readinessPanel.includes(phrase) || progressPanel.includes(phrase)) {
    forbidden.push(`runtime UI still renders internal runtime gate wording ${phrase}`);
  }
}

for (const pattern of [/[\uE000-\uF8FF\uFFFD]/u, /[嚗餅銝蝡舫摰祇雿輻閮踹]{2,}/u, /\?{2,}/u]) {
  if (pattern.test(lib)) forbidden.push(`${libPath}: mojibake runtime gate copy ${String(pattern)}`);
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
