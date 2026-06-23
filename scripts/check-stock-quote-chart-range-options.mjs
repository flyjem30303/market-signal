import fs from "node:fs";

const problems = [];

const stockPage = read("src/app/stocks/[symbol]/page.tsx");
const stockPagePayload = read("src/lib/stock-page-payload.ts");
const dashboardShell = read("src/components/dashboard-shell.tsx");
const chart = read("src/components/stock-quote-interactive-chart.tsx");
const historyRoute = read("src/app/api/stocks/[symbol]/history/route.ts");
const quoteViewModel = read("src/lib/stock-quote-view-model.ts");
const supabaseRepository = read("src/lib/repositories/supabase-market-signal-repository.ts");

for (const phrase of ["const stockPageInitialHistoryDays = 75;"]) {
  if (!stockPage.includes(phrase)) problems.push(`stock page missing: ${phrase}`);
}

for (const phrase of ["includeSeriesDays: historyDays"]) {
  if (!stockPagePayload.includes(phrase)) problems.push(`stock page payload missing: ${phrase}`);
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
  "filterPointsByCalendarRange(chartPoints, activeRange)",
  "/api/stocks/${encodeURIComponent(symbol)}/history",
  "function filterPointsByCalendarRange",
  "function shiftDateByRange"
]) {
  if (!chart.includes(phrase)) problems.push(`chart missing: ${phrase}`);
}

for (const phrase of ["rangeToHistoryDays", '"1Y": 390', "buildStockPagePayload(symbol, historyDays)"]) {
  if (!historyRoute.includes(phrase)) problems.push(`history route missing: ${phrase}`);
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
      stockPageInitialHistoryDays: 75,
      chartHistory: "lazy_api_route",
      chartRanges: ["1M", "3M", "6M", "1Y"],
      defaultRange: "3M",
      rangeBasis: "calendar_months_and_year",
      historyQueryBasis: "batched_calendar_window"
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
