import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_METADATA_PROBE_2026-05-29.md";
const timeoutMs = 15000;
const stockNo = "2330";
const testMonths = ["20260501", "20200101", "20100101"];
const routes = [
  {
    id: "TWSE-STOCK-DAY-EXCHANGE-REPORT",
    buildUrl: (month) => `https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=${month}&stockNo=${stockNo}`
  },
  {
    id: "TWSE-STOCK-DAY-RWD",
    buildUrl: (month) => `https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY?response=json&date=${month}&stockNo=${stockNo}`
  }
];

const generatedAt = new Date().toISOString();
const results = [];

for (const month of testMonths) {
  for (const route of routes) {
    results.push(await probeRoute(month, route));
  }
}

const report = renderReport(results, generatedAt);
fs.writeFileSync(reportPath, report);
console.log(report);

async function probeRoute(testMonth, route) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const url = route.buildUrl(testMonth);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json,text/plain,*/*",
        "user-agent": "taiwan-market-signal-stock-day-metadata-probe/0.1"
      },
      signal: controller.signal
    });
    const contentType = response.headers.get("content-type") ?? "unknown";
    const text = await response.text();
    const metadata = extractStockDayMetadata(text, contentType);

    return {
      bodyBytes: Buffer.byteLength(text, "utf8"),
      contentType,
      error: "",
      httpStatus: response.status,
      routeId: route.id,
      testMonth,
      ...metadata
    };
  } catch (error) {
    return {
      bodyBytes: 0,
      contentType: "unavailable",
      error: error instanceof Error ? error.message : String(error),
      fields: [],
      firstObservedDate: "unavailable",
      httpStatus: 0,
      lastObservedDate: "unavailable",
      routeId: route.id,
      rowCount: 0,
      statKeys: [],
      testMonth,
      title: "unavailable"
    };
  } finally {
    clearTimeout(timer);
  }
}

function extractStockDayMetadata(text, contentType) {
  const trimmed = text.trim();
  if (!contentType.includes("json") && !trimmed.startsWith("{")) {
    return {
      fields: [],
      firstObservedDate: "unavailable",
      lastObservedDate: "unavailable",
      rowCount: 0,
      statKeys: [],
      title: "non-json-response"
    };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const rows = Array.isArray(parsed.data) ? parsed.data : [];
    const observedDates = rows
      .map((row) => Array.isArray(row) ? String(row[0] ?? "").trim() : "")
      .filter(Boolean);

    return {
      fields: Array.isArray(parsed.fields) ? parsed.fields.slice(0, 40) : [],
      firstObservedDate: observedDates[0] ?? "unavailable",
      lastObservedDate: observedDates.at(-1) ?? "unavailable",
      rowCount: rows.length,
      statKeys: parsed.stat && typeof parsed.stat === "object" ? Object.keys(parsed.stat).slice(0, 40) : [],
      title: typeof parsed.title === "string" ? sanitize(parsed.title) : "unavailable"
    };
  } catch {
    return {
      fields: [],
      firstObservedDate: "unavailable",
      lastObservedDate: "unavailable",
      rowCount: 0,
      statKeys: [],
      title: "json-parse-failed"
    };
  }
}

function sanitize(value) {
  return value.replace(/\s+/g, " ").replace(/\|/g, "/").trim();
}

function renderReport(results, generatedAt) {
  const rows = results.map((result) => {
    const fields = result.fields.length > 0 ? result.fields.join(", ") : "unavailable";
    const statKeys = result.statKeys.length > 0 ? result.statKeys.join(", ") : "unavailable";
    const error = result.error ? result.error.replace(/\|/g, "/") : "";

    return `| ${result.routeId} | ${stockNo} | ${result.testMonth} | ${result.httpStatus} | ${result.contentType} | ${result.rowCount} | ${result.firstObservedDate} | ${result.lastObservedDate} | ${result.title} | ${fields} | ${statKeys} | ${result.bodyBytes} | ${error} |`;
  });

  const summary = results.map((result) => {
    return `${result.routeId} ${result.testMonth}: rows=${result.rowCount}, range=${result.firstObservedDate}..${result.lastObservedDate}`;
  }).join("\n");

  return `# CP3 TWSE Stock Day Metadata Probe

Status: stock day metadata probe recorded

Generated at: ${generatedAt}

## CEO Decision

\`\`\`text
REVISE
\`\`\`

This report records metadata for TWSE STOCK_DAY only. It is not historical
ingestion, not a source-depth pass, not a backtest, and not approval for public
scoring.

## Guardrails

\`\`\`text
metadata-only stock day probe
one TWSE listed symbol only: 2330
maximum 3 month probes: 20260501, 20200101, 20100101
tested routes: exchangeReport/STOCK_DAY, rwd/zh/afterTrading/STOCK_DAY
no raw market rows stored
no CSV / JSON data files written
no Supabase writes
no scoreSource=real
no public backtest claims
response bodies discarded after metadata extraction
source-depth smoke remains not_ready
Keep public data source mock
\`\`\`

## Probe Results

| Route | Stock No | Tested Month | HTTP | Content Type | Row Count | First Observed Date | Last Observed Date | Title Metadata | Schema Fields | Stat Keys | Body Bytes Read Then Discarded | Error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}

## Observed Range Summary

\`\`\`text
${summary}
\`\`\`

## Interpretation

\`\`\`text
Changing observed date ranges by requested month suggests STOCK_DAY can provide
month-level historical data for one TWSE-listed stock.
This does not approve bulk crawling, storage, backtests, public scoring, or
derived public claims.
\`\`\`

## Remaining Blockers

\`\`\`text
license / terms reviewed by D
rate-limit / fair-use policy documented
confirmed route selected
field mapping reviewed by A and C
corporate-action handling documented
inactive / delisted symbol handling documented
source-depth smoke still not_ready until approved data exists
\`\`\`
`;
}
