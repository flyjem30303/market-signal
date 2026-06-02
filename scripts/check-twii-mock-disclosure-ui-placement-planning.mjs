import fs from "node:fs";

const planPath = "docs/reviews/TWII_MOCK_DISCLOSURE_UI_PLACEMENT_PLANNING_2026-06-02.md";
const implementationReviewPath = "docs/reviews/TWII_LOCAL_DISCLOSURE_CONSUMER_IMPLEMENTATION_REVIEW_2026-06-02.md";
const consumerPath = "src/lib/twii-local-disclosure-consumer.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const plan = fs.readFileSync(planPath, "utf8");
const implementationReview = fs.readFileSync(implementationReviewPath, "utf8");
const consumer = fs.readFileSync(consumerPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_mock_disclosure_ui_placement_planning_recorded`",
  "consumer_module: src/lib/twii-local-disclosure-consumer.ts",
  "consumer_helper: getTwiiLocalDisclosureConsumerOutput",
  "placement_type: mock_only_status_disclosure",
  "fixture_policy: synthetic_rows_only",
  "publicDataSource: mock",
  "scoreSource: mock",
  "runtime_activation_authorized: false",
  "PLACEMENT-001 stock page internal status area is allowed for TWII mock disclosure",
  "PLACEMENT-002 briefing internal readiness area is allowed for TWII mock disclosure",
  "PLACEMENT-003 homepage placement is deferred until public copy is reviewed",
  "PLACEMENT-005 do not place mock TWII disclosure inside score cards or signal cards",
  "COPY-001 disclosure must say mock-only or not activated",
  "COPY-002 disclosure must not claim TWII data coverage",
  "COPY-004 disclosure must not mention row counts or parsed rows",
  "BOUNDARY-001 no runtime activation from UI placement",
  "BOUNDARY-002 no Supabase read or write from UI placement",
  "BOUNDARY-003 no SQL command from UI placement",
  "BOUNDARY-005 no daily_prices mapping from UI placement",
  "BOUNDARY-009 no remote TWII probe rerun from UI placement",
  "CRITERIA-002 first UI implementation should be a small internal status component",
  "CRITERIA-003 component must consume safe disclosure output only",
  "CRITERIA-004 component must not import parser, adapter, Supabase, HTTP, SQL, or data repositories",
  "CRITERIA-005 component must render mock-only status and safeSummary only",
  "CEO-FINDING-002 first implementation should target a reusable mock-only status component, not homepage prominence",
  "ENGINEERING-FINDING-001 UI component may accept TwiiLocalDisclosureConsumerOutput as props",
  "READY_FOR_TWII_MOCK_DISCLOSURE_STATUS_COMPONENT_DRAFT"
]) {
  if (!plan.includes(phrase)) {
    missing.push(`${planPath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_MOCK_DISCLOSURE_UI_PLACEMENT_PLANNING",
  "disclosure consumer is accepted as a safe UI/briefing input layer, not runtime activation",
  "disclosure state cannot grant row coverage or data completeness claims"
]) {
  if (!implementationReview.includes(phrase)) {
    missing.push(`${implementationReviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "export type TwiiLocalDisclosureConsumerOutput",
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

for (const pattern of [
  /fetch\s*\(/,
  /https?:\/\//i,
  /@supabase\/supabase-js/,
  /createClient/,
  /\.from\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /\.upsert\(/,
  /\.rpc\(/,
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
  if (pattern.test(plan)) {
    blocked.push(`${planPath}: forbidden ui-placement-planning pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["check:twii-mock-disclosure-ui-placement-planning"] !== "node scripts/check-twii-mock-disclosure-ui-placement-planning.mjs") {
  missing.push(`${packagePath}: check:twii-mock-disclosure-ui-placement-planning`);
}
if (!reviewGate.includes("scripts/check-twii-mock-disclosure-ui-placement-planning.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-mock-disclosure-ui-placement-planning.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
