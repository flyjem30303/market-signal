import fs from "node:fs";

const problems = [];

const stockPage = read("src/app/stocks/[symbol]/page.tsx");
const dashboardShell = read("src/components/dashboard-shell.tsx");
const chart = read("src/components/stock-quote-interactive-chart.tsx");
const historyRoute = read("src/app/api/stocks/[symbol]/history/route.ts");
const quoteViewModel = read("src/lib/stock-quote-view-model.ts");

for (const forbidden of [
  "const stockPageHistoryDays = 370;",
  "buildStockPagePayload(params.symbol, stockPageHistoryDays)"
]) {
  if (stockPage.includes(forbidden)) problems.push(`stock page still SSR-loads full chart history: ${forbidden}`);
}

for (const phrase of [
  "const stockPageInitialHistoryDays",
  "buildStockPagePayload(params.symbol, stockPageInitialHistoryDays)"
]) {
  if (!stockPage.includes(phrase)) problems.push(`stock page missing thin initial payload marker: ${phrase}`);
}

for (const phrase of [
  'src/app/api/stocks/[symbol]/history/route.ts',
  "rangeToHistoryDays",
  "buildStockPagePayload(symbol, historyDays)",
  "createStaticMarketSignalRepository",
  "buildQuoteViewModel",
  "NextResponse.json"
]) {
  if (phrase.includes("/") || !historyRoute.includes(phrase)) {
    if (phrase.includes("/") && !fs.existsSync(phrase)) problems.push(`missing history route: ${phrase}`);
    if (!phrase.includes("/") && !historyRoute.includes(phrase)) problems.push(`history route missing: ${phrase}`);
  }
}

for (const phrase of ["<StockQuoteInteractiveChart", "symbol={quote.symbol}"]) {
  if (!dashboardShell.includes(phrase)) problems.push(`dashboard shell missing lazy chart wiring: ${phrase}`);
}

if (!quoteViewModel.includes("symbol: snapshot.asset.symbol")) {
  problems.push("quote view model missing symbol passthrough: symbol: snapshot.asset.symbol");
}

for (const phrase of [
  "symbol: string;",
  "fetch(`/api/stocks/${encodeURIComponent(symbol)}/history?range=${encodeURIComponent(rangeLabel)}`",
  "setRemotePoints",
  "useEffect"
]) {
  if (!chart.includes(phrase)) problems.push(`interactive chart missing lazy history behavior: ${phrase}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "stock_history_lazy_load_architecture",
      initialPayload: "short_recent_window",
      chartHistory: "client_lazy_api",
      historyRoute: "/api/stocks/[symbol]/history",
      intent: "keep stock first screen fast while preserving 1M/3M/6M/1Y history on demand"
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
