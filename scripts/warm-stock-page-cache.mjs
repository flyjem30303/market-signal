const defaultBaseUrl = "https://market-signal.opensignallab.com";
const defaultSymbols = ["TWII", "2330", "0050", "006208", "2308", "2382"];

const baseUrl = (process.env.STOCK_PAGE_WARM_BASE_URL ?? defaultBaseUrl).replace(/\/+$/, "");
const symbols = (process.env.STOCK_PAGE_WARM_SYMBOLS ?? defaultSymbols.join(","))
  .split(",")
  .map((symbol) => symbol.trim())
  .filter(Boolean);

const results = [];

for (const symbol of symbols) {
  const url = `${baseUrl}/stocks/${symbol}`;
  const startedAt = Date.now();
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "market-signal-cache-warmer/1.0"
      },
      signal: AbortSignal.timeout(30_000)
    });
    results.push({
      ms: Date.now() - startedAt,
      ok: response.ok,
      status: response.status,
      symbol,
      url
    });
  } catch (error) {
    results.push({
      error: error instanceof Error ? error.message : String(error),
      ms: Date.now() - startedAt,
      ok: false,
      symbol,
      url
    });
  }
}

const failed = results.filter((result) => !result.ok);

console.log(
  JSON.stringify(
    {
      baseUrl,
      failed: failed.length,
      mode: "stock_page_cache_warm",
      results,
      status: failed.length ? "blocked" : "ok",
      symbols: symbols.length
    },
    null,
    2
  )
);

if (failed.length) process.exit(1);
