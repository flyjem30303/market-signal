import fs from "node:fs";

const problems = [];

const stockPage = read("src/app/stocks/[symbol]/page.tsx");
const stockPagePayload = read("src/lib/stock-page-payload.ts");
const dashboardShell = read("src/components/dashboard-shell.tsx");
const watchlistPanel = read("src/components/market-watchlist-panel.tsx");
const watchlistApi = read("src/app/api/watchlist/search-items/route.ts");
const chart = read("src/components/stock-quote-interactive-chart.tsx");
const historyRoute = readOptional("src/app/api/stocks/[symbol]/history/route.ts");
const quoteViewModel = read("src/lib/stock-quote-view-model.ts");
const supabaseRepository = read("src/lib/repositories/supabase-market-signal-repository.ts");

for (const phrase of ["const stockPageInitialHistoryDays = 390;"]) {
  if (!stockPage.includes(phrase)) problems.push(`stock page missing: ${phrase}`);
}

for (const phrase of ["includeSeriesDays: historyDays", "return [symbol];", "watchlistItems: []"]) {
  if (!stockPagePayload.includes(phrase)) problems.push(`stock page payload missing: ${phrase}`);
}

if (stockPagePayload.includes("getMarketSignalSearchItems")) {
  problems.push("stock page payload must not server-load full-market watchlist items");
}

for (const phrase of ['loadItemsEndpoint="/api/watchlist/search-items"', "loadItemsEndpoint?: string"]) {
  if (!dashboardShell.includes(phrase) && !watchlistPanel.includes(phrase)) problems.push(`lazy watchlist missing: ${phrase}`);
}

for (const phrase of ["fetch(loadItemsEndpoint)", "setLoadedItems", "const panelItems = loadedItems"]) {
  if (!watchlistPanel.includes(phrase)) problems.push(`watchlist panel missing lazy-load behavior: ${phrase}`);
}

for (const phrase of ["getMarketSignalSearchItems", "Cache-Control", "s-maxage=300"]) {
  if (!watchlistApi.includes(phrase)) problems.push(`watchlist API missing: ${phrase}`);
}

for (const phrase of ["buildQuoteViewModel", ".slice(-252)"]) {
  if (!quoteViewModel.includes(phrase)) problems.push(`quote view model missing: ${phrase}`);
}

for (const phrase of [
  '{ label: "1M", months: 1 }',
  '{ label: "3M", months: 3 }',
  '{ label: "6M", months: 6 }',
  '{ label: "1Y", years: 1 }',
  'const [rangeLabel, setRangeLabel] = useState("3M");',
  "filterPointsByCalendarRange(points, activeRange)",
  "function filterPointsByCalendarRange",
  "function shiftDateByRange"
]) {
  if (!chart.includes(phrase)) problems.push(`chart missing: ${phrase}`);
}

for (const forbidden of ["rangeToHistoryDays", "buildStockPagePayload(symbol, historyDays)", "/api/stocks/${encodeURIComponent(symbol)}/history", "remotePoints", "historyStatus"]) {
  if (historyRoute.includes(forbidden) || chart.includes(forbidden)) {
    problems.push(`per-range history loading remains: ${forbidden}`);
  }
}

if (historyRoute.trim().length > 0) {
  problems.push("stock history route should be removed after one-shot chart data preload");
}

for (const forbidden of [
  "getMarketSignalSearchItems",
  "watchlistItems = await",
  "watchlistItems: payload.watchlistItems"
]) {
  if (stockPage.includes(forbidden) || stockPagePayload.includes(forbidden)) {
    problems.push(`server-side full search loading remains: ${forbidden}`);
  }
}

for (const phrase of ["const historyStartDate", "toHistoryStartDate(options.historyDays)", ".gte(\"trade_date\", historyStartDate)"]) {
  if (!supabaseRepository.includes(phrase)) problems.push(`supabase repository missing: ${phrase}`);
}

for (const phrase of [
  "const historyStartDate",
  "toHistoryStartDate(options.historyDays)",
  ".gte(\"trade_date\", historyStartDate)",
  "readPages<DailyPriceRow>",
  "readPages<DailyScoreRow>"
]) {
  if (!supabaseRepository.includes(phrase)) problems.push(`supabase repository missing: ${phrase}`);
}

for (const forbidden of [
  "{ days: 30",
  "{ days: 60",
  "{ days: 90",
  "{ days: 31",
  "{ days: 93",
  "{ days: 186",
  "{ days: 366",
  "{ days: 132",
  "{ days: 252",
  "stockIds.length * options.historyDays",
  ".in(\"stock_id\", [stockId])",
  ".range(0, historyRowsPerStock - 1)",
  "points.slice(-rangeDays)",
  "slice(-90)"
]) {
  if (chart.includes(forbidden) || dashboardShell.includes(forbidden) || supabaseRepository.includes(forbidden)) {
    problems.push(`legacy chart range/text remains: ${forbidden}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "stock_quote_chart_range_options",
      stockPageInitialHistoryDays: 390,
      chartHistory: "one_shot_page_payload",
      chartRanges: ["1M", "3M", "6M", "1Y"],
      defaultRange: "3M",
      rangeBasis: "calendar_months_and_year",
      historyQueryBasis: "single_selected_symbol_calendar_window",
      stockPageWatchlistLoading: "client_lazy_api"
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

function readOptional(filePath) {
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf8");
}
