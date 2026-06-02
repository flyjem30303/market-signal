import fs from "node:fs";

const dashboardPath = "src/components/dashboard-shell.tsx";
const componentPath = "src/components/twii-mock-disclosure-status.tsx";
const consumerPath = "src/lib/twii-local-disclosure-consumer.ts";
const reviewPath = "docs/reviews/TWII_MOCK_DISCLOSURE_STATUS_COMPONENT_IMPLEMENTATION_REVIEW_2026-06-02.md";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const dashboard = fs.readFileSync(dashboardPath, "utf8");
const component = fs.readFileSync(componentPath, "utf8");
const consumer = fs.readFileSync(consumerPath, "utf8");
const review = fs.readFileSync(reviewPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "import { TwiiMockDisclosureStatus }",
  "import { getTwiiLocalDisclosureConsumerOutput }",
  "const twiiMockDisclosure = useMemo",
  "blockingReason: \"rights_decision_required\"",
  "canAwardRowCoverageCredit: false",
  "canMapToDailyPrices: false",
  "canSetScoreSourceReal: false",
  "isRuntimeReady: false",
  "publicDataSource: \"mock\"",
  "reviewState: \"parser_contract_waiting_for_rights_decision\"",
  "scoreSource: \"mock\"",
  "selected.symbol === \"TWII\"",
  "<TwiiMockDisclosureStatus",
  "label=\"TWII stock page mock disclosure status\""
]) {
  if (!dashboard.includes(phrase)) {
    missing.push(`${dashboardPath}: ${phrase}`);
  }
}

for (const phrase of [
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
  "getTwiiLocalDisclosureConsumerOutput",
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
  "READY_FOR_TWII_STOCK_PAGE_INTERNAL_STATUS_PLACEMENT",
  "Do not place it on the homepage, score cards, signal cards, buy/sell interpretation areas",
  "Do not activate runtime, Supabase, SQL, staging writes, daily_prices mapping, row coverage credit, real score"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  ".twii-mock-disclosure-status",
  "grid-template-columns: minmax(0, 1fr) repeat(2, minmax(160px, 0.28fr))",
  "background: #f7faff"
]) {
  if (!css.includes(phrase)) {
    missing.push(`${cssPath}: ${phrase}`);
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
    blocked.push(`${dashboardPath}: forbidden stock-page-placement pattern ${String(pattern)}`);
  }
}

if (/scoreSource\s*=\s*["']real["']/.test(dashboard) || /publicDataSource\s*=\s*["']supabase["']/.test(dashboard)) {
  blocked.push(`${dashboardPath}: placement must not promote real score or supabase source`);
}
if (/parsedRowCount:\s*[1-9]/.test(dashboard) || /normalizedDate/.test(dashboard) || /normalizedIndexValue/.test(dashboard)) {
  blocked.push(`${dashboardPath}: placement must not expose parsed row evidence`);
}
const homeRuntimeIndex = dashboard.indexOf("<HomeRuntimeStatusPanel");
const stockRuntimeIndex = dashboard.indexOf("<StockRuntimeAtAGlance");
const twiiPlacementIndex = dashboard.indexOf("<TwiiMockDisclosureStatus");
if (twiiPlacementIndex < 0 || stockRuntimeIndex < 0 || twiiPlacementIndex < stockRuntimeIndex) {
  blocked.push(`${dashboardPath}: TWII mock disclosure status must be placed after StockRuntimeAtAGlance`);
}
if (homeRuntimeIndex >= 0 && twiiPlacementIndex >= 0 && twiiPlacementIndex < stockRuntimeIndex) {
  blocked.push(`${dashboardPath}: homepage branch must not render TWII mock disclosure status`);
}

if (packageJson.scripts?.["check:twii-stock-page-mock-disclosure-placement"] !== "node scripts/check-twii-stock-page-mock-disclosure-placement.mjs") {
  missing.push(`${packagePath}: check:twii-stock-page-mock-disclosure-placement`);
}
if (!reviewGate.includes("scripts/check-twii-stock-page-mock-disclosure-placement.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-stock-page-mock-disclosure-placement.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
