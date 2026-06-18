import { buildSupabaseDataFreshnessSnapshot } from "../src/lib/data-freshness.ts";

const market = {
  currency: "TWD",
  exchange: "TWSE",
  timezone: "Asia/Taipei"
};

const cases = [
  {
    expected: {
      asOfDate: "2026-05-30",
      isMock: false,
      scoreSource: "mixed",
      state: "complete"
    },
    name: "complete when both required tables have successful rows",
    rows: [
      {
        data_end_date: "2026-05-30",
        row_count: 1000,
        source_name: "TWSE OpenAPI",
        status: "success",
        target_table: "daily_prices"
      },
      {
        data_end_date: "2026-05-29",
        row_count: 800,
        source_name: "TWSE OpenAPI",
        status: "success",
        target_table: "daily_fundamentals"
      }
    ]
  },
  {
    expected: {
      asOfDate: "2026-05-30",
      isMock: false,
      scoreSource: "mixed",
      state: "partial"
    },
    name: "partial when a required table is missing",
    rows: [
      {
        data_end_date: "2026-05-30",
        row_count: 1000,
        source_name: "TWSE OpenAPI",
        status: "success",
        target_table: "daily_prices"
      }
    ]
  },
  {
    expected: {
      asOfDate: "2026-05-30",
      isMock: false,
      scoreSource: "mixed",
      state: "partial"
    },
    name: "partial when a required table has zero rows",
    rows: [
      {
        data_end_date: "2026-05-30",
        row_count: 1000,
        source_name: "TWSE OpenAPI",
        status: "success",
        target_table: "daily_prices"
      },
      {
        data_end_date: "2026-05-30",
        row_count: 0,
        source_name: "TWSE OpenAPI",
        status: "success",
        target_table: "daily_fundamentals"
      }
    ]
  },
  {
    expected: {
      asOfDate: "2026-05-30",
      isMock: false,
      scoreSource: "mixed",
      state: "unavailable"
    },
    name: "unavailable when any selected required table failed",
    rows: [
      {
        data_end_date: "2026-05-30",
        row_count: 1000,
        source_name: "TWSE OpenAPI",
        status: "success",
        target_table: "daily_prices"
      },
      {
        data_end_date: "2026-05-30",
        row_count: 0,
        source_name: "TWSE OpenAPI",
        status: "failed",
        target_table: "daily_fundamentals"
      }
    ]
  },
  {
    expected: {
      asOfDate: "-",
      isMock: false,
      scoreSource: "unavailable",
      state: "unavailable"
    },
    name: "unavailable when no required table rows exist",
    rows: [
      {
        data_end_date: "2026-05-30",
        row_count: 5,
        source_name: "TWSE OpenAPI",
        status: "success",
        target_table: "unrelated_table"
      }
    ]
  }
];

const results = cases.map((testCase) => {
  const snapshot = buildSupabaseDataFreshnessSnapshot({
    dataRuns: testCase.rows,
    market
  });
  const problems = [];

  for (const [key, value] of Object.entries(testCase.expected)) {
    if (snapshot[key] !== value) {
      problems.push(`${key} expected ${String(value)}, got ${String(snapshot[key])}`);
    }
  }

  if (snapshot.market !== market.exchange) problems.push("market metadata was not preserved");
  if (snapshot.currency !== market.currency) problems.push("currency metadata was not preserved");
  if (snapshot.timezone !== market.timezone) problems.push("timezone metadata was not preserved");
  if (snapshot.scoreSource === "real") problems.push("raw freshness snapshot must not promote scoreSource to real");

  return {
    name: testCase.name,
    pass: problems.length === 0,
    problems,
    snapshot: {
      asOfDate: snapshot.asOfDate,
      isMock: snapshot.isMock,
      scoreSource: snapshot.scoreSource,
      state: snapshot.state
    }
  };
});

const failed = results.filter((result) => !result.pass);

console.log(
  JSON.stringify(
    {
      results,
      status: failed.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (failed.length > 0) {
  process.exit(1);
}
