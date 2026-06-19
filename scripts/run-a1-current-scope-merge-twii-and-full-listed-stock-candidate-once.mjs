import fs from "node:fs";
import path from "node:path";

const stockCandidatePath =
  process.env.A1_FULL_TWSE_EQUITY_CANDIDATE_ARTIFACT_PATH ??
  "tmp/a1-full-twse-equity-candidates/20260618T152613Z-cleaned-candidate.json";
const twiiSourcePath =
  process.env.A1_TWII_CURRENT_SCOPE_SOURCE_PATH ??
  "tmp/phase-1-current-scope-row-payload-candidate-from-local-artifacts.json";
const outputPath =
  process.env.PHASE_1_CURRENT_SCOPE_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH ??
  "tmp/a1-full-twse-equity-candidates/phase-1-current-scope-twii-plus-full-listed-stock-row-payload.json";

const stockCandidate = JSON.parse(fs.readFileSync(stockCandidatePath, "utf8"));
const twiiSource = JSON.parse(fs.readFileSync(twiiSourcePath, "utf8"));
const twiiRows = (Array.isArray(twiiSource.rows) ? twiiSource.rows : []).filter((row) => row.symbol === "TWII");
const stockRows = (Array.isArray(stockCandidate.candidatePrices) ? stockCandidate.candidatePrices : [])
  .map(normalizeStockPrice)
  .filter(Boolean);
const rows = [...twiiRows, ...stockRows];
const seen = new Set();
const duplicateKeys = [];

for (const row of rows) {
  const key = `${row.symbol}|${row.trade_date}`;
  if (seen.has(key)) duplicateKeys.push(key);
  seen.add(key);
}

if (twiiRows.length < 1) throw new Error("twii_rows_missing");
if (stockRows.length < 1) throw new Error("listed_stock_rows_missing");
if (duplicateKeys.length > 0) throw new Error("duplicate_symbol_trade_date_rows");

const artifact = {
  artifactId: `phase-1-current-scope-full-listed-stock-row-payload-${new Date().toISOString().slice(0, 10)}`,
  createdAt: new Date().toISOString(),
  scope: "twii_plus_listed_stock_daily_close",
  phase1Universe: "twii_plus_listed_stock_daily_close",
  sourceRightsStatus: "accepted",
  fieldContractStatus: "accepted",
  sanitizedRowPayloadIncluded: true,
  rawPayloadIncluded: false,
  stockIdPayloadIncluded: false,
  secretsIncluded: false,
  expectedRows: rows.length,
  rows
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      status: "a1_current_scope_twii_plus_full_listed_stock_candidate_merged",
      outputPath,
      twiiRows: twiiRows.length,
      listedStockRows: stockRows.length,
      totalRows: rows.length,
      filesWritten: true,
      marketDataFetched: false,
      sqlExecuted: false,
      supabaseConnectionAttempted: false,
      supabaseWrite: false,
      dailyPricesMutation: false,
      rawPayloadOutput: false,
      stockIdPayloadOutput: false,
      secretsOutput: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function normalizeStockPrice(price) {
  if (!price || typeof price !== "object" || Array.isArray(price)) return null;
  const symbol = String(price.symbol ?? "");
  if (!/^[1-9]\d{3}$/u.test(symbol)) return null;
  const tradeDate = String(price.trade_date ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(tradeDate)) return null;
  const close = finiteNonNegative(price.close_price);
  if (close === null) return null;

  const row = {
    symbol,
    trade_date: tradeDate,
    close,
    source_name: String(price.source_id ?? stockCandidate.sourceId ?? "twse-stock-day"),
    source_updated_at: String(price.source_fetched_at ?? stockCandidate.candidateRun?.finished_at ?? ""),
    source_row_hash: String(price.source_row_hash ?? "")
  };

  for (const [from, to] of [
    ["open_price", "open"],
    ["high_price", "high"],
    ["low_price", "low"],
    ["volume", "volume"]
  ]) {
    const value = finiteNonNegative(price[from]);
    if (value !== null) row[to] = value;
  }

  return row;
}

function finiteNonNegative(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}
