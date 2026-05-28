import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TW_STOCK_HISTORICAL_PARAMETER_PROBE_2026-05-29.md";
const timeoutMs = 15000;
const testDates = ["20260527", "20260526", "20200102"];
const parameterVariants = [
  {
    name: "date",
    buildUrl: (date) => `https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL?date=${date}`
  },
  {
    name: "response_json_date",
    buildUrl: (date) => `https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL?response=json&date=${date}`
  },
  {
    name: "queryDate",
    buildUrl: (date) => `https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL?queryDate=${date}`
  }
];

const generatedAt = new Date().toISOString();
const results = [];

for (const date of testDates) {
  for (const variant of parameterVariants) {
    results.push(await probeVariant(date, variant));
  }
}

const report = renderReport(results, generatedAt);
fs.writeFileSync(reportPath, report);
console.log(report);

async function probeVariant(testDate, variant) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const url = variant.buildUrl(testDate);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json,text/csv,text/plain,*/*",
        "user-agent": "taiwan-market-signal-parameter-probe/0.1"
      },
      signal: controller.signal
    });
    const contentType = response.headers.get("content-type") ?? "unknown";
    const text = await response.text();
    const metadata = extractMetadata(text, contentType);

    return {
      bodyBytes: Buffer.byteLength(text, "utf8"),
      contentType,
      error: "",
      httpStatus: response.status,
      observedDates: metadata.observedDates,
      parameterName: variant.name,
      rowCount: metadata.rowCount,
      schemaKeys: metadata.schemaKeys,
      testDate
    };
  } catch (error) {
    return {
      bodyBytes: 0,
      contentType: "unavailable",
      error: error instanceof Error ? error.message : String(error),
      httpStatus: 0,
      observedDates: [],
      parameterName: variant.name,
      rowCount: 0,
      schemaKeys: [],
      testDate
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
      const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed.data) ? parsed.data : [parsed];
      return {
        observedDates: uniqueDates(rows.map((row) => readDateValue(row))),
        rowCount: rows.length,
        schemaKeys: readKeys(rows[0])
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
  const schemaKeys = header.split(delimiter).map((key) => key.trim()).filter(Boolean).slice(0, 40);
  const dateIndex = schemaKeys.findIndex((key) => key.toLowerCase() === "date");
  const observedDates = dateIndex >= 0
    ? uniqueDates(rows.map((row) => row.split(delimiter)[dateIndex]?.trim()))
    : [];

  return {
    observedDates,
    rowCount: rows.length,
    schemaKeys
  };
}

function readKeys(row) {
  if (!row || typeof row !== "object") return [];
  return Object.keys(row).slice(0, 40);
}

function readDateValue(row) {
  if (!row || typeof row !== "object") return "";
  return row.Date ?? row.date ?? row.DATE ?? "";
}

function uniqueDates(values) {
  return [...new Set(values.filter(Boolean))].slice(0, 5);
}

function renderReport(results, generatedAt) {
  const rows = results.map((result) => {
    const keys = result.schemaKeys.length > 0 ? result.schemaKeys.join(", ") : "unavailable";
    const dates = result.observedDates.length > 0 ? result.observedDates.join(", ") : "unavailable";
    const error = result.error ? result.error.replace(/\|/g, "/") : "";

    return `| TWSE-PRICE-DATE-PARAM | ${result.parameterName} | ${result.testDate} | ${result.httpStatus} | ${result.contentType} | ${result.rowCount} | ${result.bodyBytes} | ${dates} | ${keys} | ${error} |`;
  });

  const observedSummary = summarizeObservedDates(results);

  return `# CP3 Taiwan Stock Historical Parameter Probe

Status: parameter metadata probe recorded

Generated at: ${generatedAt}

## CEO Decision

\`\`\`text
REVISE
\`\`\`

This report records parameter metadata only. It is not historical ingestion, not
a source-depth pass, not a backtest, and not approval for public scoring.

## Guardrails

\`\`\`text
metadata-only parameter probe
one endpoint family tested
tested endpoint family: TWSE-PRICE-DATE-PARAM
tested parameter names: date, response_json_date, queryDate
tested dates: 20260527, 20260526, 20200102
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

| Endpoint Family | Parameter Name | Tested Date | HTTP | Content Type | Row Count | Body Bytes Read Then Discarded | Observed Date Values Only As Metadata | Schema Keys | Error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}

## Observed Date Summary

\`\`\`text
${observedSummary}
\`\`\`

## Interpretation

\`\`\`text
HTTP 200 confirms endpoint reachability for each parameter variant.
Matching observed dates would suggest the parameter may control history.
Repeated current dates across all tested dates would suggest the endpoint may ignore the parameter.
This probe does not prove historical depth, legal permission, common-stock coverage, or model readiness.
\`\`\`

## Remaining Blockers

\`\`\`text
license / terms reviewed by D
rate-limit / fair-use policy documented
confirmed historical date parameter selected
field mapping reviewed by A and C
corporate-action handling documented
inactive / delisted symbol handling documented
source-depth smoke still not_ready until approved data exists
\`\`\`
`;
}

function summarizeObservedDates(results) {
  return results.map((result) => {
    const dates = result.observedDates.length > 0 ? result.observedDates.join(", ") : "unavailable";
    return `${result.parameterName} ${result.testDate}: ${dates}`;
  }).join("\n");
}
