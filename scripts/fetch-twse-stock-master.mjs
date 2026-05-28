import fs from "node:fs";

const TWSE_LISTED_COMPANIES_URL =
  "https://openapi.twse.com.tw/v1/opendata/t187ap03_L";
const DEFAULT_SEED_PATH = "data/seeds/stocks.seed.json";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");

function getField(record, candidates) {
  for (const key of candidates) {
    if (record[key] !== undefined && record[key] !== null) {
      const value = String(record[key]).trim();
      if (value) return value;
    }
  }
  return null;
}

function normalizeDate(value) {
  if (!value) return null;

  const compact = value.replaceAll("/", "").replaceAll("-", "");
  if (/^\d{8}$/.test(compact)) {
    return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;
  }

  if (/^\d{7}$/.test(compact)) {
    const year = Number(compact.slice(0, 3)) + 1911;
    return `${year}-${compact.slice(3, 5)}-${compact.slice(5, 7)}`;
  }

  return null;
}

function isCommonStock(symbol) {
  return /^\d{4}$/.test(symbol);
}

function loadExistingStocks() {
  if (!fs.existsSync(DEFAULT_SEED_PATH)) return [];
  return JSON.parse(fs.readFileSync(DEFAULT_SEED_PATH, "utf8"));
}

function mergeStocks(existingStocks, fetchedStocks) {
  const bySymbol = new Map();

  for (const stock of existingStocks) {
    bySymbol.set(stock.symbol, stock);
  }

  for (const stock of fetchedStocks) {
    bySymbol.set(stock.symbol, {
      ...bySymbol.get(stock.symbol),
      ...stock,
    });
  }

  return [...bySymbol.values()].sort((a, b) => {
    if (a.market !== b.market) return a.market.localeCompare(b.market);
    return a.symbol.localeCompare(b.symbol);
  });
}

async function fetchTwseListedCompanies() {
  const response = await fetch(TWSE_LISTED_COMPANIES_URL, {
    headers: {
      accept: "application/json",
      "user-agent": "taiwan-market-signal/0.1",
    },
  });

  if (!response.ok) {
    throw new Error(`TWSE request failed: ${response.status} ${response.statusText}`);
  }

  const records = await response.json();
  if (!Array.isArray(records)) {
    throw new Error("TWSE response was not an array");
  }

  return records
    .map((record) => {
      const symbol = getField(record, ["公司代號"]);
      const name = getField(record, ["公司簡稱", "公司名稱"]);
      const industry = getField(record, ["產業別"]);
      const listedDate = normalizeDate(getField(record, ["上市日期"]));

      if (!symbol || !name || !isCommonStock(symbol)) return null;

      return {
        symbol,
        name,
        market: "TWSE",
        industry,
        listed_date: listedDate,
        is_etf: false,
        is_active: true,
      };
    })
    .filter(Boolean);
}

const existingStocks = loadExistingStocks();
const fetchedStocks = await fetchTwseListedCompanies();
const mergedStocks = mergeStocks(existingStocks, fetchedStocks);

if (dryRun) {
  console.log(
    JSON.stringify(
      {
        source: TWSE_LISTED_COMPANIES_URL,
        existing_count: existingStocks.length,
        fetched_count: fetchedStocks.length,
        merged_count: mergedStocks.length,
        sample: mergedStocks.slice(0, 5),
      },
      null,
      2,
    ),
  );
} else {
  fs.writeFileSync(DEFAULT_SEED_PATH, `${JSON.stringify(mergedStocks, null, 2)}\n`);
  console.log(`Updated ${DEFAULT_SEED_PATH}`);
  console.log(`Fetched ${fetchedStocks.length} TWSE listed common stocks`);
  console.log(`Merged total ${mergedStocks.length} symbols`);
}
