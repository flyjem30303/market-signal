import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_MOCK_DISCLOSURE_STATUS_COMPONENT_IMPLEMENTATION_REVIEW_2026-06-02.md";
const componentPath = "src/components/twii-mock-disclosure-status.tsx";
const componentCheckerPath = "scripts/check-twii-mock-disclosure-status-component.mjs";
const planningPath = "docs/reviews/TWII_MOCK_DISCLOSURE_UI_PLACEMENT_PLANNING_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const review = fs.readFileSync(reviewPath, "utf8");
const component = fs.readFileSync(componentPath, "utf8");
const componentChecker = fs.readFileSync(componentCheckerPath, "utf8");
const planning = fs.readFileSync(planningPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_mock_disclosure_status_component_implementation_review_recorded`",
  "component: src/components/twii-mock-disclosure-status.tsx",
  "checker: scripts/check-twii-mock-disclosure-status-component.mjs",
  "implementation_type: presentational_mock_only_status_component",
  "input_contract: TwiiLocalDisclosureConsumerOutput",
  "placement_scope: reusable_component_only",
  "publicDataSource: mock",
  "scoreSource: mock",
  "runtime_activation_authorized: false",
  "IMPLEMENTED-001 component imports TwiiLocalDisclosureConsumerOutput as a type-only dependency",
  "IMPLEMENTED-002 component exports TwiiMockDisclosureStatus",
  "IMPLEMENTED-005 component renders safeSummary",
  "IMPLEMENTED-010 component does not import parser, adapter, Supabase, HTTP, SQL, repositories, or data loaders",
  "BOUNDARY-001 no fetcher added",
  "BOUNDARY-005 no Supabase client added",
  "BOUNDARY-006 no SQL added",
  "BOUNDARY-008 no daily_prices mapping added",
  "BOUNDARY-009 no parsed rows or parsed counts exposed",
  "BOUNDARY-012 no scoreSource=real enabled",
  "BOUNDARY-013 no publicDataSource=supabase enabled",
  "BOUNDARY-015 no page placement wired yet",
  "QA-RESULT-001 npm run check:twii-mock-disclosure-status-component passes",
  "QA-RESULT-004 full review gate passes",
  "CEO-FINDING-001 component is accepted as a reusable safe UI unit, not page placement or runtime activation",
  "ENGINEERING-FINDING-001 component is presentational and deterministic",
  "DATA-FINDING-001 component cannot grant coverage or completeness claims",
  "LEGAL-FINDING-001 component copy must remain mock-only and cannot imply source rights or real TWII activation",
  "READY_FOR_TWII_STOCK_PAGE_INTERNAL_STATUS_PLACEMENT"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "import type { TwiiLocalDisclosureConsumerOutput }",
  "export function TwiiMockDisclosureStatus",
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
  "forbidden mock-disclosure-component pattern",
  "component must not expose parsed counts, rows, or normalized fields",
  "component must not promote real score or supabase source"
]) {
  if (!componentChecker.includes(phrase)) {
    missing.push(`${componentCheckerPath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_MOCK_DISCLOSURE_STATUS_COMPONENT_DRAFT",
  "component must consume safe disclosure output only",
  "component must not import parser, adapter, Supabase, HTTP, SQL, or data repositories"
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
    blocked.push(`${componentPath}: forbidden component-review pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["check:twii-mock-disclosure-status-component-implementation-review"] !== "node scripts/check-twii-mock-disclosure-status-component-implementation-review.mjs") {
  missing.push(`${packagePath}: check:twii-mock-disclosure-status-component-implementation-review`);
}
if (!reviewGate.includes("scripts/check-twii-mock-disclosure-status-component-implementation-review.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-mock-disclosure-status-component-implementation-review.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
