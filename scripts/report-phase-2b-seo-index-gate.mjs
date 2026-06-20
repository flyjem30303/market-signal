import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const EXPECTED_TEMPORARY_SITE_URL = "https://market-signal-two.vercel.app";
const CORE_ROUTES = ["/", "/briefing", "/weekly", "/methodology", "/privacy", "/terms", "/disclaimer"];

function readText(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function extractStockSitemapLimit() {
  const seoSource = readText("src/lib/seo.ts");
  const match = seoSource.match(/SEO_STOCK_SITEMAP_LIMIT\s*=\s*(\d+)/);
  return match ? Number(match[1]) : null;
}

function getStockUniverseSummary() {
  const rows = readJson("data/seeds/stocks.seed.json");
  const typeCounts = rows.reduce((acc, row) => {
    const type = row.asset_type ?? row.type ?? "unknown";
    acc[type] = (acc[type] ?? 0) + 1;
    return acc;
  }, {});

  return {
    total: rows.length,
    typeCounts
  };
}

function getRuntimeGateSummary() {
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";
  const scoreSource = process.env.NEXT_PUBLIC_SCORE_SOURCE ?? "mock";
  const supabaseReads = process.env.MARKET_SIGNAL_SUPABASE_READS ?? "disabled";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? null;

  const blockingReasons = [];
  if (dataSource !== "supabase") blockingReasons.push("NEXT_PUBLIC_DATA_SOURCE is not supabase");
  if (scoreSource !== "real") blockingReasons.push("NEXT_PUBLIC_SCORE_SOURCE is not real");
  if (supabaseReads !== "enabled") blockingReasons.push("MARKET_SIGNAL_SUPABASE_READS is not enabled");
  if (!siteUrl) blockingReasons.push("NEXT_PUBLIC_SITE_URL is not set");

  return {
    blockingReasons,
    dataSource,
    eligibleStockRoutesNow: blockingReasons.length === 0 ? "requires data-quality gate evaluation" : 0,
    expectedTemporarySiteUrl: EXPECTED_TEMPORARY_SITE_URL,
    scoreSource,
    siteUrl,
    supabaseReads
  };
}

function main() {
  const stockSitemapLimit = extractStockSitemapLimit();
  const stockUniverse = getStockUniverseSummary();
  const runtimeGate = getRuntimeGateSummary();

  const report = {
    generatedAt: new Date().toISOString(),
    scope: "phase_2b_seo_index_gate_report",
    boundary: {
      dataFetch: false,
      externalPlatformMutation: false,
      sql: false,
      supabaseWrite: false
    },
    coreRoutes: CORE_ROUTES,
    stockSitemapPolicy: {
      firstBatchLimit: stockSitemapLimit,
      allStockRoutesAllowed: false,
      reason: "CEO decision requires stock sitemap gating and noindex for mock/fallback/insufficient data states."
    },
    stockUniverse,
    runtimeGate,
    conclusion:
      runtimeGate.blockingReasons.length > 0
        ? "Stock detail pages should remain out of sitemap/noindex under current local gate state."
        : "Runtime prerequisites are present; inspect per-symbol data-quality gate before sitemap inclusion."
  };

  console.log(JSON.stringify(report, null, 2));
}

main();
