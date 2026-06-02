import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_STOCK_PAGE_MOCK_DISCLOSURE_PLACEMENT_IMPLEMENTATION_REVIEW_2026-06-02.md";
const dashboardPath = "src/components/dashboard-shell.tsx";
const placementCheckerPath = "scripts/check-twii-stock-page-mock-disclosure-placement.mjs";
const componentReviewPath = "docs/reviews/TWII_MOCK_DISCLOSURE_STATUS_COMPONENT_IMPLEMENTATION_REVIEW_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const review = fs.readFileSync(reviewPath, "utf8");
const dashboard = fs.readFileSync(dashboardPath, "utf8");
const placementChecker = fs.readFileSync(placementCheckerPath, "utf8");
const componentReview = fs.readFileSync(componentReviewPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_stock_page_mock_disclosure_placement_implementation_review_recorded`",
  "page_container: src/components/dashboard-shell.tsx",
  "component: src/components/twii-mock-disclosure-status.tsx",
  "consumer: src/lib/twii-local-disclosure-consumer.ts",
  "checker: scripts/check-twii-stock-page-mock-disclosure-placement.mjs",
  "placement_type: stock_page_internal_status_only",
  "target_symbol: TWII",
  "homepage_placement: false",
  "score_card_placement: false",
  "signal_card_placement: false",
  "publicDataSource: mock",
  "scoreSource: mock",
  "runtime_activation_authorized: false",
  "IMPLEMENTED-001 DashboardShell imports TwiiMockDisclosureStatus",
  "IMPLEMENTED-002 DashboardShell imports getTwiiLocalDisclosureConsumerOutput",
  "IMPLEMENTED-011 placement renders TwiiMockDisclosureStatus only when selected.symbol is TWII",
  "IMPLEMENTED-012 placement is after StockRuntimeAtAGlance and before evidence/decision modules",
  "BOUNDARY-015 homepage remains unwired",
  "BOUNDARY-016 score cards and signal cards remain unwired",
  "QA-RESULT-001 npm run check:twii-stock-page-mock-disclosure-placement passes",
  "QA-RESULT-004 local HTTP check for /stocks/TWII returned 200 and included TWII Mock Disclosure",
  "CEO-FINDING-001 placement is accepted as a bounded stock-page internal status disclosure, not runtime activation",
  "READY_FOR_TWII_BRIEFING_INTERNAL_READINESS_PLACEMENT_OR_GIT_BACKUP"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "import { TwiiMockDisclosureStatus }",
  "import { getTwiiLocalDisclosureConsumerOutput }",
  "const twiiMockDisclosure = useMemo",
  "selected.symbol === \"TWII\"",
  "<TwiiMockDisclosureStatus",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!dashboard.includes(phrase)) {
    missing.push(`${dashboardPath}: ${phrase}`);
  }
}

for (const phrase of [
  "TWII mock disclosure status must be placed after StockRuntimeAtAGlance",
  "homepage branch must not render TWII mock disclosure status",
  "placement must not promote real score or supabase source",
  "placement must not expose parsed row evidence"
]) {
  if (!placementChecker.includes(phrase)) {
    missing.push(`${placementCheckerPath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_STOCK_PAGE_INTERNAL_STATUS_PLACEMENT",
  "component is accepted as a reusable safe UI unit, not page placement or runtime activation"
]) {
  if (!componentReview.includes(phrase)) {
    missing.push(`${componentReviewPath}: ${phrase}`);
  }
}

for (const pattern of [
  /twii-parser-contract/,
  /twii-parser-consumer-adapter(?!Output)/,
  /getTwiiParserConsumerAdapterOutput/,
  /fetch\s*\(/,
  /https?:\/\//i,
  /@supabase\/supabase-js/,
  /createClient/,
  /(?<!Array)\.from\(/,
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
  if (pattern.test(dashboard)) {
    blocked.push(`${dashboardPath}: forbidden stock-placement-review pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["check:twii-stock-page-mock-disclosure-placement-implementation-review"] !== "node scripts/check-twii-stock-page-mock-disclosure-placement-implementation-review.mjs") {
  missing.push(`${packagePath}: check:twii-stock-page-mock-disclosure-placement-implementation-review`);
}
if (!reviewGate.includes("scripts/check-twii-stock-page-mock-disclosure-placement-implementation-review.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-stock-page-mock-disclosure-placement-implementation-review.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
