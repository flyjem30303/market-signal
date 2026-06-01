const baseOutput = {
  calendarStatus: "not_run",
  canAwardRowCoveragePoints: false,
  canClaimCoverage: false,
  canSetScoreSourceReal: false,
  connectionAttempted: true,
  expectedSymbolCount: 6,
  expectedTotalRows: 360,
  filesWritten: false,
  mode: "row_coverage_readonly_remote_validation",
  mutations: false,
  preflightStatus: "ready_for_guarded_readonly_decision",
  publicDataSource: "mock",
  remoteAttempted: true,
  requiredTradingSessions: 60,
  rowPayloadsPrinted: false,
  scoreSource: "mock",
  secretsPrinted: false,
  sqlExecuted: false,
  targetRelation: "daily_prices"
};

const samples = [
  {
    expectValid: true,
    name: "blocked_count_unavailable",
    output: {
      ...baseOutput,
      coverageStatus: "blocked",
      missingRows: 360,
      observedTotalRows: 0,
      problems: [
        "TWII: count_unavailable",
        "0050: count_unavailable",
        "006208: count_unavailable",
        "2330: count_unavailable",
        "2382: count_unavailable",
        "2308: count_unavailable"
      ],
      reason: "aggregate_count_incomplete",
      status: "blocked",
      symbolsChecked: []
    }
  },
  {
    expectValid: true,
    name: "ok_aggregate_count_complete",
    output: {
      ...baseOutput,
      coverageStatus: "ok",
      missingRows: 0,
      observedTotalRows: 360,
      problems: [],
      reason: "aggregate_count_complete",
      status: "ok",
      symbolsChecked: [
        { observedRows: 60, symbol: "TWII" },
        { observedRows: 60, symbol: "0050" },
        { observedRows: 60, symbol: "006208" },
        { observedRows: 60, symbol: "2330" },
        { observedRows: 60, symbol: "2382" },
        { observedRows: 60, symbol: "2308" }
      ]
    }
  },
  {
    expectValid: false,
    name: "forbidden_internal_and_secret_metadata",
    output: {
      ...baseOutput,
      coverageStatus: "ok",
      keyPrefix: "sb_secret_",
      missingRows: 0,
      observedTotalRows: 360,
      problems: [],
      reason: "aggregate_count_complete",
      status: "ok",
      symbolsChecked: [{ observedRows: 60, stock_id: "internal-id", symbol: "2330" }]
    }
  }
];

const results = samples.map((sample) => {
  const errors = validateOutput(sample.output);
  return {
    errors,
    expectValid: sample.expectValid,
    name: sample.name,
    pass: sample.expectValid ? errors.length === 0 : errors.length > 0
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
  process.exitCode = 1;
}

function validateOutput(output) {
  const errors = [];

  expect(output.mode, "row_coverage_readonly_remote_validation", "mode", errors);
  expectOneOf(output.status, ["ok", "blocked"], "status", errors);
  expectOneOf(output.coverageStatus, ["ok", "blocked"], "coverageStatus", errors);
  expect(output.remoteAttempted, true, "remoteAttempted", errors);
  expect(output.connectionAttempted, true, "connectionAttempted", errors);
  expect(output.targetRelation, "daily_prices", "targetRelation", errors);
  expect(output.expectedSymbolCount, 6, "expectedSymbolCount", errors);
  expect(output.requiredTradingSessions, 60, "requiredTradingSessions", errors);
  expect(output.expectedTotalRows, 360, "expectedTotalRows", errors);
  expect(output.filesWritten, false, "filesWritten", errors);
  expect(output.mutations, false, "mutations", errors);
  expect(output.sqlExecuted, false, "sqlExecuted", errors);
  expect(output.secretsPrinted, false, "secretsPrinted", errors);
  expect(output.rowPayloadsPrinted, false, "rowPayloadsPrinted", errors);
  expect(output.publicDataSource, "mock", "publicDataSource", errors);
  expect(output.scoreSource, "mock", "scoreSource", errors);
  expect(output.canAwardRowCoveragePoints, false, "canAwardRowCoveragePoints", errors);
  expect(output.canClaimCoverage, false, "canClaimCoverage", errors);
  expect(output.canSetScoreSourceReal, false, "canSetScoreSourceReal", errors);

  if (output.status === "ok" && output.reason !== "aggregate_count_complete") {
    errors.push("ok status requires aggregate_count_complete reason");
  }

  if (output.status === "blocked" && output.reason === "aggregate_count_complete") {
    errors.push("blocked status cannot use aggregate_count_complete reason");
  }

  if (!Number.isInteger(output.observedTotalRows) || output.observedTotalRows < 0) {
    errors.push("observedTotalRows must be a non-negative integer");
  }

  if (!Number.isInteger(output.missingRows) || output.missingRows < 0) {
    errors.push("missingRows must be a non-negative integer");
  }

  if (output.observedTotalRows + output.missingRows < output.expectedTotalRows) {
    errors.push("observedTotalRows plus missingRows must cover expectedTotalRows");
  }

  if (!Array.isArray(output.symbolsChecked)) {
    errors.push("symbolsChecked must be an array");
  } else {
    for (const item of output.symbolsChecked) {
      const keys = Object.keys(item).sort();
      if (JSON.stringify(keys) !== JSON.stringify(["observedRows", "symbol"])) {
        errors.push(`symbolsChecked item has forbidden keys: ${keys.join(",")}`);
      }
      if (!["TWII", "0050", "006208", "2330", "2382", "2308"].includes(item.symbol)) {
        errors.push(`unexpected symbol in symbolsChecked: ${item.symbol}`);
      }
      if (!Number.isInteger(item.observedRows) || item.observedRows < 0) {
        errors.push(`invalid observedRows for ${item.symbol}`);
      }
    }
  }

  if (!Array.isArray(output.problems)) {
    errors.push("problems must be an array");
  } else {
    for (const problem of output.problems) {
      if (!/^(TWII|0050|006208|2330|2382|2308): (count_unavailable|stock_mapping_missing|stock_mapping_unavailable)$/.test(problem)) {
        errors.push(`problem is not sanitized: ${problem}`);
      }
    }
  }

  for (const forbiddenKey of ["stock_id", "stockId", "rawRows", "rows", "supabaseUrl", "anonKey", "serviceRoleKey", "keyPrefix", "keySuffix", "keyLength"]) {
    if (containsKey(output, forbiddenKey)) {
      errors.push(`forbidden output key present: ${forbiddenKey}`);
    }
  }

  return errors;
}

function expect(actual, expected, label, errors) {
  if (actual !== expected) {
    errors.push(`${label} expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function expectOneOf(actual, expected, label, errors) {
  if (!expected.includes(actual)) {
    errors.push(`${label} expected one of ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function containsKey(value, key) {
  if (!value || typeof value !== "object") return false;
  if (Object.prototype.hasOwnProperty.call(value, key)) return true;
  return Object.values(value).some((child) => containsKey(child, key));
}
