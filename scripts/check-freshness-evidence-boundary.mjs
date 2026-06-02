import { readFileSync } from "node:fs";

const files = {
  component: "src/components/freshness-evidence-boundary.tsx",
  css: "src/app/globals.css",
  dataFreshnessStrip: "src/components/data-freshness-strip.tsx",
  helper: "src/lib/freshness-evidence-boundary.ts",
  packageJson: "package.json",
  reviewGate: "scripts/check-review-gates.mjs"
};

function read(path) {
  return readFileSync(path, "utf8");
}

function requireIncludes(source, token, label) {
  if (!source.includes(token)) {
    throw new Error(`Missing ${label}: ${token}`);
  }
}

function forbidIncludes(source, token, label) {
  if (source.includes(token)) {
    throw new Error(`Forbidden ${label}: ${token}`);
  }
}

const helper = read(files.helper);
const component = read(files.component);
const strip = read(files.dataFreshnessStrip);
const css = read(files.css);
const packageJson = read(files.packageJson);
const reviewGate = read(files.reviewGate);

for (const [token, label] of [
  ["FreshnessEvidenceBoundarySummary", "summary type"],
  ["getFreshnessEvidenceBoundarySummary", "summary helper"],
  ["getFreshnessMetadataBoundarySummary", "metadata boundary helper"],
  ["getFreshnessInterpretationSummary", "interpretation helper"],
  ["getSupabaseReadonlyEvidenceSummary", "readonly evidence helper"],
  ["Freshness evidence boundary", "headline"],
  ["Freshness metadata", "metadata lane"],
  ["Readonly reachability", "readonly lane"],
  ["Data quality", "data quality lane"],
  ["dataQualityApproval", "data-quality approval state"],
  ["Do not convert freshness metadata or readonly reachability", "stop line"],
  ["real-score mode", "blocked real score wording"]
]) {
  requireIncludes(helper, token, label);
}

for (const [token, label] of [
  ["FreshnessEvidenceBoundary", "component export"],
  ["getFreshnessEvidenceBoundarySummary", "helper import"],
  ['aria-label="Freshness evidence boundary"', "aria label"],
  ['className="freshness-evidence-boundary"', "boundary class"],
  ["freshness-evidence-stop-line", "stop line class"]
]) {
  requireIncludes(component, token, label);
}

requireIncludes(strip, 'import { FreshnessEvidenceBoundary }', "strip import");
requireIncludes(strip, "<FreshnessEvidenceBoundary freshness={freshness} />", "strip placement");
requireIncludes(css, ".freshness-evidence-boundary", "boundary CSS");
requireIncludes(css, ".freshness-evidence-boundary article.blocked", "blocked CSS");
requireIncludes(packageJson, '"check:freshness-evidence-boundary"', "package script");
requireIncludes(reviewGate, "check-freshness-evidence-boundary.mjs", "review gate wiring");

for (const [source, label] of [
  [helper, "helper"],
  [component, "component"],
  [strip, "strip"]
]) {
  forbidIncludes(source, "@supabase/supabase-js", `${label} Supabase client`);
  forbidIncludes(source, "createClient", `${label} direct client`);
  forbidIncludes(source, "fetch(", `${label} remote fetch`);
  forbidIncludes(source, 'scoreSource: "real"', `${label} real score source object`);
  forbidIncludes(source, 'publicDataSource: "supabase"', `${label} public supabase source object`);
}

console.log("freshness evidence boundary ok");
