import fs from "node:fs";

const problems = [];

const docPath = "docs/ROUTE_LOCAL_PUBLIC_COPY_ALIGNMENT.md";
const mappingPath = "docs/RUNTIME_POLICY_PUBLIC_SURFACE_MAPPING.md";
const patchPath = "docs/BOUNDED_PUBLIC_SURFACE_COPY_PATCH_FROM_MAPPING.md";
const publicCopyPath = "src/lib/public-runtime-boundary-copy.ts";
const dashboardShellPath = "src/components/dashboard-shell.tsx";
const homePanelPath = "src/components/home-runtime-status-panel.tsx";
const stockPanelPath = "src/components/stock-runtime-at-a-glance.tsx";
const trustNoticePath = "src/components/trust-runtime-boundary-notice.tsx";
const freshnessStripPath = "src/components/data-freshness-strip.tsx";
const postReadonlyPath = "src/components/post-readonly-product-status.tsx";
const publicRuntimeStatePath = "src/components/public-runtime-state-strip.tsx";
const briefingPagePath = "src/app/briefing/page.tsx";
const weeklyPagePath = "src/app/weekly/page.tsx";
const methodologyPagePath = "src/app/methodology/page.tsx";
const disclaimerPagePath = "src/app/disclaimer/page.tsx";
const termsPagePath = "src/app/terms/page.tsx";
const privacyPagePath = "src/app/privacy/page.tsx";
const stockPagePath = "src/app/stocks/[symbol]/page.tsx";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const mapping = read(mappingPath);
const patch = read(patchPath);
const publicCopy = read(publicCopyPath);
const dashboardShell = read(dashboardShellPath);
const homePanel = read(homePanelPath);
const stockPanel = read(stockPanelPath);
const trustNotice = read(trustNoticePath);
const freshnessStrip = read(freshnessStripPath);
const postReadonly = read(postReadonlyPath);
const publicRuntimeState = read(publicRuntimeStatePath);
const briefingPage = read(briefingPagePath);
const weeklyPage = read(weeklyPagePath);
const methodologyPage = read(methodologyPagePath);
const disclaimerPage = read(disclaimerPagePath);
const termsPage = read(termsPagePath);
const privacyPage = read(privacyPagePath);
const stockPage = read(stockPagePath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `route_local_public_copy_alignment_ready_mock_boundary_preserved`",
  "CEO decision: `align_route_level_public_copy_to_mapping_without_broad_page_rewrite`",
  "PM route: `route_local_public_copy_alignment`",
  "docs/RUNTIME_POLICY_PUBLIC_SURFACE_MAPPING.md",
  "docs/BOUNDED_PUBLIC_SURFACE_COPY_PATCH_FROM_MAPPING.md",
  "src/lib/public-runtime-boundary-copy.ts",
  "`/`",
  "`/stocks/[symbol]`",
  "`/briefing`",
  "`/weekly`",
  "`/methodology`",
  "`/disclaimer`",
  "`/terms`",
  "`/privacy`",
  "broad route text rewrite is deferred",
  "A1 support lane: continue `twii_etf_blocked_universe_candidate_and_rights_path`",
  "A2 support lane: monitor public-copy readability",
  "The next route is `beta_deployment_operator_values_or_blocked_universe_candidate_path`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `runtime_policy_public_surface_mapping_ready_mock_boundary_preserved`",
  "bounded_public_surface_copy_patch_from_mapping",
  "publicDataSource=mock",
  "scoreSource=mock",
  "First TW equity closed-loop evidence exists for a limited sub-scope"
]) {
  if (!mapping.includes(phrase)) problems.push(`${mappingPath} missing mapping phrase: ${phrase}`);
}

for (const phrase of [
  "Status: `bounded_public_surface_copy_patch_from_mapping_applied_mock_boundary_preserved`",
  "First TW equity closed-loop evidence may be shown only as limited Beta context",
  "publicDataSource=mock",
  "scoreSource=mock",
  "route_local_public_copy_alignment_or_blocked_universe_candidate_path"
]) {
  if (!patch.includes(phrase)) problems.push(`${patchPath} missing patch phrase: ${phrase}`);
}

for (const [pathName, text, phrases] of [
  [publicCopyPath, publicCopy, ["First TW equity closed-loop evidence may be shown only as limited Beta context", "publicDataSource=mock; scoreSource=mock", "This does not constitute investment advice"]],
  [dashboardShellPath, dashboardShell, ["DataFreshnessStrip", "HomeRuntimeStatusPanel", "StockRuntimeAtAGlance"]],
  [homePanelPath, homePanel, ['getPublicRuntimeBoundaryCopy("home")', "PublicRuntimeStateStrip", "PostReadonlyProductStatus", "boundaryCopy.currentState", "boundaryCopy.stopLine"]],
  [stockPanelPath, stockPanel, ['getPublicRuntimeBoundaryCopy("stock")', "PublicRuntimeStateStrip", "PostReadonlyProductStatus", "boundaryCopy.currentState", "boundaryCopy.stopLine"]],
  [trustNoticePath, trustNotice, ["Investment and data limits: currently mock-only", "Methodology: mock scores are not formal model conclusions", "Weekly boundary: not live or complete market data", "publicDataSource=mock; scoreSource=mock"]],
  [freshnessStripPath, freshnessStrip, ["Data freshness metadata", "display context only", "real score source", "Missing/delayed data and partial coverage"]],
  [postReadonlyPath, postReadonly, ["state.publicDataSource", "state.scoreSource", "promotion.mockBoundary.publicDataSource", "promotion.mockBoundary.scoreSource"]],
  [publicRuntimeStatePath, publicRuntimeState, ["getPublicClaimRuntimeState", "state.stopLine", "state.states.map"]],
  [briefingPagePath, briefingPage, ["DataFreshnessStrip", "PublicRuntimeStateStrip", "PostReadonlyProductStatus", "RuntimeReadinessPanel", "BriefingRowCoverageStatus", "publicDataSource=mock", "scoreSource=mock"]],
  [weeklyPagePath, weeklyPage, ["DataFreshnessStrip", "TrustRuntimeBoundaryNotice", 'context="weekly"', "WeeklyRowCoverageStatus"]],
  [methodologyPagePath, methodologyPage, ["DataFreshnessStrip", "TrustRuntimeBoundaryNotice", 'context="methodology"']],
  [disclaimerPagePath, disclaimerPage, ["TrustRuntimeBoundaryNotice", 'context="disclaimer"']],
  [termsPagePath, termsPage, ["TrustRuntimeBoundaryNotice", 'context="terms"']],
  [privacyPagePath, privacyPage, ["TrustRuntimeBoundaryNotice", 'context="privacy"']],
  [stockPagePath, stockPage, ["DashboardShell", "mock-only runtime", "not real market data", "investment advice", "real score-source evidence"]]
]) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) problems.push(`${pathName} missing route alignment phrase: ${phrase}`);
  }
}

for (const phrase of [
  "Latest route-local public copy alignment slice",
  "docs/ROUTE_LOCAL_PUBLIC_COPY_ALIGNMENT.md",
  "route_local_public_copy_alignment_ready_mock_boundary_preserved",
  "align_route_level_public_copy_to_mapping_without_broad_page_rewrite",
  "beta_deployment_operator_values_or_blocked_universe_candidate_path"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:route-local-public-copy-alignment"] !==
  "node scripts/check-route-local-public-copy-alignment.mjs"
) {
  problems.push(`${packagePath} missing check:route-local-public-copy-alignment`);
}

for (const phrase of [
  "scripts/check-route-local-public-copy-alignment.mjs",
  "expectStatus: \"ok\"",
  "name: \"route-local-public-copy-alignment\"",
  "\"route-local-public-copy-alignment\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "SQL execution",
  "Supabase write",
  "staging row creation",
  "`daily_prices` mutation",
  "raw market-data fetch",
  "raw market-data ingest",
  "raw market-data storage",
  "raw market-data commit",
  "raw payload output",
  "row payload output",
  "stock id payload output",
  "secret output",
  "additional row coverage points",
  "full MVP coverage claim",
  "public source promotion",
  "`publicDataSource=supabase`",
  "real score promotion",
  "`scoreSource=real`",
  "investment advice claim",
  "public launch completion claim"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

const forbiddenApprovalPatterns = [
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /public real-data claim: `accepted`/u,
  /real score claim: `accepted`/u,
  /full MVP row coverage readiness: `accepted`/u,
  /public launch completion claim accepted/u,
  /investment advice claim accepted/u
];

for (const pattern of forbiddenApprovalPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden approval pattern: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "route_local_public_copy_alignment_ready_mock_boundary_preserved",
      runtime: "publicDataSource=mock",
      score: "scoreSource=mock",
      nextRoute: "beta_deployment_operator_values_or_blocked_universe_candidate_path"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}
