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
  "broad route text rewrite is deferred",
  "The next route is `beta_deployment_operator_values_or_blocked_universe_candidate_path`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `runtime_policy_public_surface_mapping_ready_mock_boundary_preserved`",
  "bounded_public_surface_copy_patch_from_mapping",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!mapping.includes(phrase)) problems.push(`${mappingPath} missing mapping phrase: ${phrase}`);
}

for (const phrase of [
  "Status: `bounded_public_surface_copy_patch_from_mapping_applied_mock_boundary_preserved`",
  "route_local_public_copy_alignment_or_blocked_universe_candidate_path"
]) {
  if (!patch.includes(phrase)) problems.push(`${patchPath} missing patch phrase: ${phrase}`);
}

for (const [pathName, text, phrases] of [
  [publicCopyPath, publicCopy, ["getPublicRuntimeBoundaryCopy", "正式資料升級尚未開放", "公開 Beta 目前使用示範資料", "模型輸出也不是預測或投資建議"]],
  [dashboardShellPath, dashboardShell, ["DataFreshnessStrip", "StockRuntimeAtAGlance", "PublicBetaDataReadinessStatus", "PublicBetaSourceCoverageBridge"]],
  [homePanelPath, homePanel, ["getRuntimeProductSummary", "目前維持示範資料", "正式資料來源、覆蓋率與品質通過後"]],
  [stockPanelPath, stockPanel, ["scoreSourceLabel", "snapshot", "資料", "風險"]],
  [trustNoticePath, trustNotice, ["TrustRuntimeBoundaryNotice", "getPublicRuntimeBoundaryCopy", "非投資建議", "boundaryCopy.summary"]],
  [freshnessStripPath, freshnessStrip, ["DataFreshnessStrip", "freshness.scoreSource", "freshness.sourceName", "freshness-boundary"]],
  [postReadonlyPath, postReadonly, ["getPostReadonlyRuntimeState", "getRuntimePromotionReadinessSummary", "正式資料升級前", "公開頁先維持清楚揭露"]],
  [publicRuntimeStatePath, publicRuntimeState, ["getPublicClaimRuntimeState", "state.stopLine", "state.states.map"]],
  [briefingPagePath, briefingPage, ["DataFreshnessStrip", "PublicNextReadingFlow", "getDataFreshnessSnapshot"]],
  [weeklyPagePath, weeklyPage, ["DataFreshnessStrip", "RouteLocalTrustCopyPanel", "weekly"]],
  [methodologyPagePath, methodologyPage, ["DataFreshnessStrip", "RouteLocalTrustCopyPanel", "methodology"]],
  [disclaimerPagePath, disclaimerPage, ["RouteLocalTrustCopyPanel", "disclaimer"]],
  [termsPagePath, termsPage, ["RouteLocalTrustCopyPanel", "terms"]],
  [privacyPagePath, privacyPage, ["RouteLocalTrustCopyPanel", "privacy"]],
  [stockPagePath, stockPage, ["DashboardShell", "includeSeoContent"]]
]) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) problems.push(`${pathName} missing current route alignment phrase: ${phrase}`);
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
  "public source promotion",
  "`publicDataSource=supabase`",
  "real score promotion",
  "`scoreSource=real`",
  "investment advice claim"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
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
