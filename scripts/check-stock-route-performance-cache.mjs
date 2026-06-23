import fs from "node:fs";

const problems = [];

const repository = read("src/lib/repositories/market-signal-repository.ts");
const payload = read("src/lib/stock-page-payload.ts");
const stockPage = read("src/app/stocks/[symbol]/page.tsx");
const warmScript = read("scripts/warm-stock-page-cache.mjs");
const dailyWorkflow = read(".github/workflows/daily-after-close-update.yml");

for (const phrase of [
  'import { unstable_cache } from "next/cache";',
  "getCachedSupabaseMarketSignalSearchItems",
  '["market-signal-search-items"]',
  "revalidate: 900"
]) {
  if (!repository.includes(phrase)) problems.push(`runtime cache missing: ${phrase}`);
}

for (const phrase of [
  'import { unstable_cache } from "next/cache";',
  "export async function buildStockPagePayload",
  "getCachedStockPagePayload",
  '["stock-page-payload"]',
  "revalidate: 900",
  "getMarketSignalRuntime({",
  "getMarketSignalSearchItems()",
  "toMarketSignalRepositoryData(repository",
  "includeSeriesDays"
]) {
  if (!payload.includes(phrase)) problems.push(`stock payload builder missing: ${phrase}`);
}

for (const phrase of [
  'import { buildStockPagePayload } from "@/lib/stock-page-payload";',
  'export const dynamic = "force-static";',
  "const payload = await buildStockPagePayload(params.symbol, stockPageHistoryDays);",
  "repositoryData={payload.repositoryData}",
  "watchlistItems={payload.watchlistItems}"
]) {
  if (!stockPage.includes(phrase)) problems.push(`stock page payload usage missing: ${phrase}`);
}

for (const phrase of ["STOCK_PAGE_WARM_BASE_URL", "STOCK_PAGE_WARM_SYMBOLS", "/stocks/${symbol}", "response.ok"]) {
  if (!warmScript.includes(phrase)) problems.push(`stock page cache warmer missing: ${phrase}`);
}

for (const phrase of ["Warm stock page payload cache", "node scripts/warm-stock-page-cache.mjs"]) {
  if (!dailyWorkflow.includes(phrase)) problems.push(`daily workflow cache warm step missing: ${phrase}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "stock_route_performance_cache",
      cache: ["stock-page-payload", "market-signal-search-items"],
      payloadBuilder: "buildStockPagePayload",
      dailyWarmup: "scripts/warm-stock-page-cache.mjs",
      intent: "reduce stock route SSR Supabase recomputation before daily payload materialization"
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
