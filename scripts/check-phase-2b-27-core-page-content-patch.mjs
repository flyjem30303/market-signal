import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const files = {
  doc: "docs/PHASE_2B_27_CORE_PAGE_CONTENT_PATCH.md",
  handoff: "docs/PHASE_2B_SEO_HANDOFF_STATUS.md",
  markets: "src/app/markets/page.tsx",
  stocks: "src/app/stocks/page.tsx",
  methodology: "src/app/methodology/page.tsx",
  packageJson: "package.json"
};

const failures = [];

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Missing file: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(fullPath, "utf8");
}

const doc = read(files.doc);
const handoff = read(files.handoff);
const markets = read(files.markets);
const stocks = read(files.stocks);
const methodology = read(files.methodology);
const packageJson = JSON.parse(read(files.packageJson) || "{}");
const handoffSectionMarker = "## Latest Coherent Slice: phase_2b_27_core_page_content_patch";
const handoffSection = handoff.includes(handoffSectionMarker)
  ? handoff.slice(handoff.indexOf(handoffSectionMarker))
  : "";

const requiredDocSnippets = [
  "phase_2b_27_core_page_content_patch_ready",
  "/markets",
  "/stocks",
  "/methodology",
  "How to use",
  "Search Scope",
  "這頁說明「為什麼今天是這個分數」。",
  "requestIndexingAllPages=false",
  "repeatSitemapSubmissionNow=false",
  "sitemapExpansionNow=false",
  "stockRouteIndexing=keep_existing_gated_scope",
  "globalRouteIndexing=gated",
  "nonTaiwanMarketIndexing=gated",
  "analyticsRuntime=false",
  "adRuntime=false",
  "supabaseWrite=false",
  "sqlExecution=false",
  "marketDataFetch=false",
  "scoringChange=false",
  "runtimePromotion=false",
  "nextRecommendedSlice=phase_2b_28_core_page_post_deploy_observation"
];

const requiredMarketsSnippets = [
  "如何使用市場入口",
  "這頁負責完整市場探索，不取代首頁的每日摘要",
  "台灣市場頁",
  "標的觀察入口",
  "至少 2 個正式市場通過 production gate"
];

const requiredStocksSnippets = [
  "這頁可以搜尋什麼？",
  "台灣上市股票、ETF 與主要指數搜尋",
  "2330、0050 或 TWII",
  "完整股票頁索引仍維持 gated"
];

const requiredMethodologySnippets = [
  "這頁說明「為什麼今天是這個分數」",
  "可追溯的方法論",
  "不是投資建議"
];

const requiredHandoffSnippets = [
  "phase_2b_27_core_page_content_patch_ready",
  "patchRoutes=/markets,/stocks,/methodology",
  "patchMode=small_static_content_only",
  "stockRouteIndexing=keep_existing_gated_scope",
  "requestIndexingAllPages=false",
  "supabaseWrite=false",
  "sqlExecution=false",
  "marketDataFetch=false",
  "scoringChange=false",
  "nextRecommendedSlice=phase_2b_28_core_page_post_deploy_observation"
];

function requireSnippets(label, content, snippets) {
  for (const snippet of snippets) {
    if (!content.includes(snippet)) failures.push(`${label} missing snippet: ${snippet}`);
  }
}

requireSnippets("Doc", doc, requiredDocSnippets);
requireSnippets("Markets page", markets, requiredMarketsSnippets);
requireSnippets("Stocks page", stocks, requiredStocksSnippets);
requireSnippets("Methodology page", methodology, requiredMethodologySnippets);
requireSnippets("Handoff", handoffSection, requiredHandoffSnippets);

const forbiddenPatterns = [
  /requestIndexingAllPages=true/iu,
  /repeatSitemapSubmissionNow=true/iu,
  /sitemapExpansionNow=true/iu,
  /stockRouteIndexing=opened/iu,
  /globalRouteIndexing=opened/iu,
  /nonTaiwanMarketIndexing=opened/iu,
  /globalRoutePublicExposure=true/iu,
  /mockMarketPublicSeo=true/iu,
  /analyticsRuntime=true/iu,
  /adRuntime=true/iu,
  /supabaseWrite=true/iu,
  /sqlExecution=true/iu,
  /marketDataFetch=true/iu,
  /scoringChange=true/iu,
  /runtimePromotion=true/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) failures.push(`Doc contains forbidden pattern: ${pattern}`);
  if (pattern.test(handoffSection)) failures.push(`Handoff section contains forbidden pattern: ${pattern}`);
}

if (!packageJson.scripts?.["check:phase-2b-27-core-page-content-patch"]) {
  failures.push("package.json missing Phase 2B.27 checker script.");
}

if (failures.length > 0) {
  console.error("Phase 2B.27 core page content patch check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2b_27_core_page_content_patch",
      patchRoutes: ["/markets", "/stocks", "/methodology"],
      patchMode: "small_static_content_only",
      requestIndexingAllPages: false,
      repeatSitemapSubmissionNow: false,
      sitemapExpansionNow: false,
      stockRouteIndexing: "keep_existing_gated_scope",
      globalRouteIndexing: "gated",
      nonTaiwanMarketIndexing: "gated",
      analyticsRuntime: false,
      adRuntime: false,
      supabaseWrite: false,
      sqlExecution: false,
      marketDataFetch: false,
      scoringChange: false,
      runtimePromotion: false,
      nextRecommendedSlice: "phase_2b_28_core_page_post_deploy_observation"
    },
    null,
    2
  )
);
