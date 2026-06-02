import fs from "node:fs";

const componentPath = "src/components/twii-mock-disclosure-status.tsx";
const consumerPath = "src/lib/twii-local-disclosure-consumer.ts";
const planningPath = "docs/reviews/TWII_MOCK_DISCLOSURE_UI_PLACEMENT_PLANNING_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const component = fs.readFileSync(componentPath, "utf8");
const consumer = fs.readFileSync(consumerPath, "utf8");
const planning = fs.readFileSync(planningPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "import type { TwiiLocalDisclosureConsumerOutput }",
  "type TwiiMockDisclosureStatusProps",
  "const statusLabels",
  "mock_ready_for_review",
  "mock_waiting_for_rights",
  "mock_waiting_for_staging_schema",
  "mock_blocked_by_parser_contract",
  "mock_not_runtime_ready",
  "export function TwiiMockDisclosureStatus",
  "TWII Mock Disclosure",
  "disclosure.safeSummary",
  "disclosure.publicDataSource",
  "disclosure.scoreSource",
  "disclosure.canUseSupabaseRuntime",
  "disclosure.canClaimTwiiCoverage",
  "disclosure.canShowRealScore"
]) {
  if (!component.includes(phrase)) {
    missing.push(`${componentPath}: ${phrase}`);
  }
}

for (const phrase of [
  "export type TwiiLocalDisclosureConsumerOutput",
  "canClaimTwiiCoverage: false",
  "canShowRealScore: false",
  "canUseSupabaseRuntime: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!consumer.includes(phrase)) {
    missing.push(`${consumerPath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_MOCK_DISCLOSURE_STATUS_COMPONENT_DRAFT",
  "component must consume safe disclosure output only",
  "component must not import parser, adapter, Supabase, HTTP, SQL, or data repositories",
  "component must render mock-only status and safeSummary only",
  "component must not render rows, parsed counts, stock payloads, or real data claims"
]) {
  if (!planning.includes(phrase)) {
    missing.push(`${planningPath}: ${phrase}`);
  }
}

for (const pattern of [
  /twii-parser-contract/,
  /twii-parser-consumer-adapter/,
  /getTwiiParserConsumerAdapterOutput/,
  /getTwiiLocalDisclosureConsumerOutput/,
  /fetch\s*\(/,
  /https?:\/\//i,
  /@supabase\/supabase-js/,
  /createClient/,
  /repositories\//,
  /\.from\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /\.upsert\(/,
  /\.rpc\(/,
  /daily_prices/,
  /writeFileSync/,
  /appendFileSync/,
  /process\.env/,
  /NEXT_PUBLIC_SUPABASE_URL/,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /\bselect\s+\*\s+from\b/i,
  /\binsert\s+into\b/i,
  /\bupdate\s+[a-z_]+\s+set\b/i,
  /\bdelete\s+from\b/i
]) {
  if (pattern.test(component)) {
    blocked.push(`${componentPath}: forbidden mock-disclosure-component pattern ${String(pattern)}`);
  }
}

if (/parsedRowCount/.test(component) || /\brows\b/.test(component) || /normalizedDate/.test(component) || /normalizedIndexValue/.test(component)) {
  blocked.push(`${componentPath}: component must not expose parsed counts, rows, or normalized fields`);
}
if (/scoreSource\s*=\s*["']real["']/.test(component) || /publicDataSource\s*=\s*["']supabase["']/.test(component)) {
  blocked.push(`${componentPath}: component must not promote real score or supabase source`);
}

if (packageJson.scripts?.["check:twii-mock-disclosure-status-component"] !== "node scripts/check-twii-mock-disclosure-status-component.mjs") {
  missing.push(`${packagePath}: check:twii-mock-disclosure-status-component`);
}
if (!reviewGate.includes("scripts/check-twii-mock-disclosure-status-component.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-mock-disclosure-status-component.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
