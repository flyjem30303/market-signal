import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();

const FILES = {
  layout: path.join(ROOT, "src/app/layout.tsx"),
  sitemap: path.join(ROOT, "src/app/sitemap.ts"),
  robots: path.join(ROOT, "src/app/robots.ts"),
  stocksPage: path.join(ROOT, "src/app/stocks/[symbol]/page.tsx"),
  home: path.join(ROOT, "src/app/page.tsx"),
  briefing: path.join(ROOT, "src/app/briefing/page.tsx"),
  weekly: path.join(ROOT, "src/app/weekly/page.tsx"),
  methodology: path.join(ROOT, "src/app/methodology/page.tsx"),
  disclaimer: path.join(ROOT, "src/app/disclaimer/page.tsx"),
  privacy: path.join(ROOT, "src/app/privacy/page.tsx"),
  terms: path.join(ROOT, "src/app/terms/page.tsx"),
  seed: path.join(ROOT, "data/seeds/stocks.seed.json"),
  internal: [
    path.join(ROOT, "src/app/internal/page.tsx"),
    path.join(ROOT, "src/app/internal/raw-market-preview/page.tsx"),
    path.join(ROOT, "src/app/internal/etf-source-readiness/page.tsx"),
    path.join(ROOT, "src/app/internal/cp3-dry-run/page.tsx"),
  ],
};

const checks = [];
const STOCK_SITEMAP_INITIAL_LIMIT = 100;

const warn = (id, msg, details = "") =>
  checks.push({ level: "WARN", id, msg, details });
const fail = (id, msg, details = "") =>
  checks.push({ level: "FAIL", id, msg, details });
const pass = (id, msg, details = "") =>
  checks.push({ level: "PASS", id, msg, details });

const read = async (p) => fs.readFile(p, "utf8");
const has = (source, pattern) => pattern.test(source);

const metadataHas = (source, key) => new RegExp(`${key}\\s*:`, "i").test(source);
const hasOpenGraph = (source) => /openGraph:/i.test(source);
const hasTwitter = (source) => /twitter:/i.test(source);
const hasTitleDesc = (source) =>
  (/title\s*:\s*[`'"]/.test(source) && /description\s*:\s*[`'"]/.test(source)) ||
  /buildRouteMetadata\s*\(/.test(source);
const hasCanonical = (source) => /alternates\s*:\s*{[^}]*canonical/i.test(source) || /buildRouteMetadata\s*\(/.test(source);
const hasGenerateMetadata = (source) => /generateMetadata/i.test(source);
const hasSocialMetadata = (source) => hasOpenGraph(source) || hasTwitter(source) || /buildRouteMetadata\s*\(/.test(source);

function printReport() {
  const groups = {
    PASS: checks.filter((x) => x.level === "PASS"),
    WARN: checks.filter((x) => x.level === "WARN"),
    FAIL: checks.filter((x) => x.level === "FAIL"),
  };

  const paint = {
    PASS: "✅",
    WARN: "⚠️",
    FAIL: "🧨",
  };

  console.log("\nPhase-2B SEO Foundation Check");
  for (const level of ["PASS", "WARN", "FAIL"]) {
    if (!groups[level].length) continue;
    console.log(`\n${level} (${groups[level].length})`);
    for (const item of groups[level]) {
      console.log(` ${paint[level]} ${item.id}: ${item.msg}`);
      if (item.details) console.log(`    - ${item.details}`);
    }
  }
  if (groups.FAIL.length) {
    console.log("\nResult: FAILED（有阻斷性 SEO 風險）");
    process.exitCode = 1;
  } else {
    console.log("\nResult: PASSED（P0 門檻：FAIL = 0；WARN 作為治理提醒逐步收斂）");
    process.exitCode = 0;
  }
}

async function run() {
  const layout = await read(FILES.layout);
  const sitemap = await read(FILES.sitemap);
  const robots = await read(FILES.robots);
  const home = await read(FILES.home);
  const briefing = await read(FILES.briefing);
  const weekly = await read(FILES.weekly);
  const methodology = await read(FILES.methodology);
  const disclaimer = await read(FILES.disclaimer);
  const privacy = await read(FILES.privacy);
  const terms = await read(FILES.terms);
  const stocks = await read(FILES.stocksPage);

  // global baseline
  if (has(layout, /metadataBase|metadata base/i) && has(layout, /NEXT_PUBLIC_SITE_URL/)) {
    pass("layout.metadataBase", "layout.tsx 有 metadataBase 與 NEXT_PUBLIC_SITE_URL 參照");
  } else {
    fail("layout.metadataBase", "layout.tsx 缺少可用的 metadataBase 或環境變數設定");
  }
  if (has(layout, /twitter:/i) && has(layout, /openGraph:/i)) {
    pass("layout.social", "layout.tsx 已設定全站 OG 與 Twitter 基礎欄位");
  } else {
    warn("layout.social", "layout.tsx 未完全定義全站 OG / Twitter baseline");
  }
  if (layout.includes("localhost")) {
    warn("layout.siteUrl", "metadataBase fallback 出現 localhost，部署/正式網域切換前請確認環境變數");
  }

  // route metadata checks
  const coreStatic = [
    { id: "/", source: home, name: "Home page" },
    { id: "/briefing", source: briefing, name: "Briefing" },
    { id: "/weekly", source: weekly, name: "Weekly" },
    { id: "/methodology", source: methodology, name: "Methodology" },
    { id: "/disclaimer", source: disclaimer, name: "Disclaimer" },
    { id: "/privacy", source: privacy, name: "Privacy" },
    { id: "/terms", source: terms, name: "Terms" },
  ];

  for (const page of coreStatic) {
    if (!has(page.source, /export const metadata|generateMetadata/i)) {
      if (page.id === "/") {
        warn(page.id, `${page.name} 尚未明確定義 metadata（建議補齊）`);
      } else {
        fail(page.id, `${page.name} metadata 缺失`);
      }
      continue;
    }
    if (hasTitleDesc(page.source)) {
      pass(`${page.id}.metadata`, `${page.name} 有 title + description`);
    } else {
      fail(`${page.id}.metadata`, `${page.name} metadata 缺少 title 或 description`);
    }
    if (hasSocialMetadata(page.source) || has(layout, /openGraph:/i)) {
      pass(`${page.id}.og`, `${page.name} 有 OG 設定來源`);
    } else {
      warn(`${page.id}.og`, `${page.name} 建議補 OG`);
    }
    if (hasSocialMetadata(page.source) || has(layout, /twitter:/i)) {
      pass(`${page.id}.twitter`, `${page.name} 有 Twitter 設定來源`);
    } else {
      warn(`${page.id}.twitter`, `${page.name} 建議補 Twitter card`);
    }
    if (hasCanonical(page.source) || page.id === "/") {
      pass(`${page.id}.canonical`, `${page.name} 有可追蹤 canonical 策略`);
    } else {
      warn(`${page.id}.canonical`, `${page.name} 未明確設定 canonical`);
    }
  }

  // stocks detail page
  if (hasGenerateMetadata(stocks)) {
    pass("/stocks/[symbol].metadata", "stocks/[symbol] 有 generateMetadata");
  } else {
    fail("/stocks/[symbol].metadata", "stocks/[symbol] 缺少 generateMetadata");
  }
  if (has(stocks, /noindex|index:\s*false/i)) {
    pass("/stocks/[symbol].noindexGate", "stocks 索引策略已有 noindex 條件可掛載");
  } else {
    warn("/stocks/[symbol].noindexGate", "目前未明顯看到條件式 noindex，建議加入資料不足/ mock 條件");
  }
  if (hasSocialMetadata(stocks)) pass("/stocks/[symbol].og", "stocks/[symbol] 有 OG");
  else warn("/stocks/[symbol].og", "stocks/[symbol] 建議補完整 OG");
  if (hasSocialMetadata(stocks)) pass("/stocks/[symbol].twitter", "stocks/[symbol] 有 Twitter card");
  else warn("/stocks/[symbol].twitter", "stocks/[symbol] 建議補 Twitter card");
  if (has(stocks, /jsonLd|application\/ld\+json|structured/i)) {
    pass("/stocks/[symbol].structuredData", "stocks/[symbol] 有 structured data");
  } else {
    warn("/stocks/[symbol].structuredData", "stocks/[symbol] 建議補齊結構化資料");
  }

  // sitemap checks
  if (has(sitemap, /staticRoutes/i) && has(sitemap, /getSeoStockSitemapAssets|getAssets/)) {
    pass("sitemap.base", "sitemap 包含靜態路由與資產列表輸出");
  } else {
    fail("sitemap.base", "sitemap 缺少靜態路由或資產清單輸出邏輯");
  }
  if (!has(sitemap, /internal/)) {
    pass("sitemap.excludeInternal", "sitemap 未直接列出 internal 路由");
  } else {
    warn("sitemap.excludeInternal", "sitemap 內疑似包含 internal 類路由，請再確認");
  }
  if (has(robots, /sitemap/i) && has(robots, /allow:\s*"\//)) {
    pass("robots.basic", "robots.txt 含 sitemap 宣告與首頁 allow 規則");
  } else {
    fail("robots.basic", "robots 缺少基本 allow / sitemap 可見度宣告");
  }
  if (
    has(robots, /"\/internal"/) &&
    has(robots, /"\/api\/internal"/)
  ) {
    pass("robots.disallow.internal", "robots 對內部路由已設定 disallow");
  } else {
    fail("robots.disallow.internal", "robots 尚未完整 disallow 內部路由");
  }

  // internal route metadata sanity
  for (const p of FILES.internal) {
    const src = await read(p);
    if (has(src, /index:\s*false/) || has(src, /export const metadata = {[^}]*robots:[^}]*index:\s*false/i)) {
      pass(`internal.${path.basename(path.dirname(p))}`, "內部頁有 index:false");
    } else {
      warn(`internal.${path.basename(path.dirname(p))}`, "內部頁未確認 index:false，可能會暴露");
    }
  }

  // stock indexing volume risk
  try {
    const raw = await read(FILES.seed);
    const parsed = JSON.parse(raw);
    const count = Array.isArray(parsed) ? parsed.length : 0;
    if (count > STOCK_SITEMAP_INITIAL_LIMIT) {
      warn(
        "stocks.volume",
        `當前 stock 資料約有 ${count} 筆，高於 CEO 決議第一批 sitemap 上限 ${STOCK_SITEMAP_INITIAL_LIMIT}`,
      );
    } else {
      pass("stocks.volume", `stock 資料筆數為 ${count}，放量壓力可控`);
    }
    if (has(sitemap, /getAssets\(\)/) && !has(sitemap, /STOCK_SEO_INDEX_MAX|SEO_STOCK_SITEMAP_LIMIT|shouldIndexStock|indexCondition/i)) {
      warn(
        "sitemap.stockIndexCondition",
        `sitemap 目前未見條件式索引門檻，建議先新增資料品質 gating 並限制第一批 ${STOCK_SITEMAP_INITIAL_LIMIT} 頁`,
      );
    }
  } catch (e) {
    warn("stocks.seed", "無法解析 stocks.seed.json，請確認資料檔可讀");
  }

  printReport();
}

await run();
