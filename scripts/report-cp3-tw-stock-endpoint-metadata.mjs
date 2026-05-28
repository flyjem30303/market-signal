import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TW_STOCK_ENDPOINT_METADATA_PROBE_2026-05-29.md";
const timeoutMs = 15000;
const endpoints = [
  {
    id: "TWSE-PRICE-DAILY-ALL",
    url: "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL"
  },
  {
    id: "TWSE-PRICE-AVG-ALL",
    url: "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_AVG_ALL"
  },
  {
    id: "TWSE-VALUATION-DATE",
    url: "https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_d"
  },
  {
    id: "TPEX-PRICE-DAILY",
    url: "https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes"
  },
  {
    id: "TPEX-VALUATION",
    url: "https://www.tpex.org.tw/openapi/v1/tpex_mainboard_peratio_analysis"
  }
];

const generatedAt = new Date().toISOString();
const results = [];

for (const endpoint of endpoints) {
  results.push(await probeEndpoint(endpoint));
}

const report = renderReport(results, generatedAt);
fs.writeFileSync(reportPath, report);
console.log(report);

async function probeEndpoint(endpoint) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint.url, {
      headers: {
        accept: "application/json,text/csv,text/plain,*/*",
        "user-agent": "taiwan-market-signal-metadata-probe/0.1"
      },
      signal: controller.signal
    });
    const contentType = response.headers.get("content-type") ?? "unknown";
    const text = await response.text();
    const metadata = extractMetadata(text, contentType);

    return {
      ...endpoint,
      bodyBytes: Buffer.byteLength(text, "utf8"),
      contentType,
      error: "",
      httpStatus: response.status,
      ok: response.ok,
      ...metadata
    };
  } catch (error) {
    return {
      ...endpoint,
      bodyBytes: 0,
      contentType: "unavailable",
      error: error instanceof Error ? error.message : String(error),
      httpStatus: 0,
      ok: false,
      rowCount: 0,
      schemaKeys: []
    };
  } finally {
    clearTimeout(timer);
  }
}

function extractMetadata(text, contentType) {
  const trimmed = text.trim();
  if (contentType.includes("json") || trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return {
          rowCount: parsed.length,
          schemaKeys: readKeys(parsed[0])
        };
      }

      return {
        rowCount: Array.isArray(parsed.data) ? parsed.data.length : 1,
        schemaKeys: readKeys(Array.isArray(parsed.data) ? parsed.data[0] : parsed)
      };
    } catch {
      return readDelimitedMetadata(trimmed);
    }
  }

  return readDelimitedMetadata(trimmed);
}

function readDelimitedMetadata(text) {
  const [header = "", ...rows] = text.split(/\r?\n/).filter(Boolean);
  const delimiter = header.includes("\t") ? "\t" : ",";

  return {
    rowCount: rows.length,
    schemaKeys: header.split(delimiter).map((key) => key.trim()).filter(Boolean).slice(0, 40)
  };
}

function readKeys(row) {
  if (!row || typeof row !== "object") return [];
  return Object.keys(row).slice(0, 40);
}

function renderReport(results, generatedAt) {
  const rows = results.map((result) => {
    const keys = result.schemaKeys.length > 0 ? result.schemaKeys.join(", ") : "unavailable";
    const error = result.error ? result.error.replace(/\|/g, "/") : "";
    return `| ${result.id} | ${result.httpStatus} | ${result.contentType} | ${result.rowCount} | ${result.bodyBytes} | ${keys} | ${error} |`;
  });

  return `# CP3 Taiwan Stock Endpoint Metadata Probe

Status: metadata probe recorded

Generated at: ${generatedAt}

## CEO Decision

\`\`\`text
REVISE
\`\`\`

This report records endpoint metadata only. It is not historical ingestion, not
a source-depth pass, not a backtest, and not approval for public scoring.

## Guardrails

\`\`\`text
metadata-only endpoint probe
no raw market rows stored
no CSV / JSON data files written
no Supabase writes
no scoreSource=real
no public backtest claims
response bodies discarded after metadata extraction
\`\`\`

## Probe Results

| ID | HTTP | Content Type | Sample Row Count | Body Bytes Read Then Discarded | Schema Keys | Error |
| --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}

## Interpretation

\`\`\`text
HTTP 200 with schema keys means the endpoint is reachable for metadata review.
It does not prove historical depth, legal permission, common-stock coverage, or
model readiness.
\`\`\`

## Remaining Blockers

\`\`\`text
license / terms reviewed by D
rate-limit / fair-use policy documented
historical date parameter confirmed
field mapping reviewed by A and C
corporate-action handling documented
inactive / delisted symbol handling documented
source-depth smoke still not_ready until approved data exists
\`\`\`
`;
}
