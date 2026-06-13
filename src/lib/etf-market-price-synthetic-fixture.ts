export type EtfMarketPriceSyntheticCaseId =
  | "etf_valid_market_price"
  | "etf_missing_close_price"
  | "etf_out_of_scope_symbol"
  | "etf_duplicate_session"
  | "etf_optional_activity_missing"
  | "etf_forbidden_nav_field";

export type EtfMarketPriceSyntheticFailureClass =
  | "none"
  | "duplicate_session"
  | "forbidden_field"
  | "missing_required_field"
  | "out_of_scope_symbol";

export type EtfMarketPriceSyntheticStatus = "ready" | "blocked" | "policy_required";

export type EtfMarketPriceSyntheticRow = {
  assetClass?: string;
  changePercent?: number;
  closePrice?: number;
  currency?: string;
  displayName?: string;
  exchange?: string;
  forbiddenNavValue?: number;
  priceChange?: number;
  sessionDate?: string;
  sourceCadence?: string;
  sourceName?: string;
  sourceUpdatedAt?: string;
  sourceUrlLabel?: string;
  symbol?: string;
  turnover?: number;
  volume?: number;
};

export type EtfMarketPriceNormalizedPoint = {
  assetClass: "ETF";
  closePrice: number;
  currency: "TWD";
  displayName: string;
  exchange: string;
  sessionDate: string;
  sourceCadence: string;
  sourceName: string;
  sourceUpdatedAt: string;
  sourceUrlLabel: string;
  symbol: "0050" | "006208";
  turnover?: number;
  volume?: number;
};

export type EtfMarketPriceSyntheticCaseExpectation = {
  expectedFailureClass: EtfMarketPriceSyntheticFailureClass;
  expectedStatus: EtfMarketPriceSyntheticStatus;
  expectedWarnings: string[];
  publicMeaning: string;
};

export type EtfMarketPriceSyntheticCase = {
  description: string;
  expectation: EtfMarketPriceSyntheticCaseExpectation;
  id: EtfMarketPriceSyntheticCaseId;
  rows: readonly EtfMarketPriceSyntheticRow[];
};

export type EtfMarketPriceSyntheticCaseResult = {
  caseId: EtfMarketPriceSyntheticCaseId;
  expectedStatus: EtfMarketPriceSyntheticStatus;
  failureClass: EtfMarketPriceSyntheticFailureClass;
  normalizedPoints: EtfMarketPriceNormalizedPoint[];
  publicMeaning: string;
  status: EtfMarketPriceSyntheticStatus;
  statusMatchesExpectation: boolean;
  warnings: string[];
};

export const ETF_MARKET_PRICE_SYNTHETIC_FIXTURE_BOUNDARY = {
  executionAuthority: "local_synthetic_fixture_only",
  fixturePolicy: "etf_market_price_synthetic_rows_only_no_fetch",
  nextRoute: "etf_market_price_synthetic_fixture_review_then_mock_runtime_handoff",
  publicDataSource: "mock",
  rawMarketDataFetch: false,
  scoreSource: "mock",
  sqlExecution: false,
  status: "etf_market_price_synthetic_fixture_ready_no_fetch",
  supabaseWrite: false
} as const;

export const ETF_MARKET_PRICE_SYNTHETIC_CASES: readonly EtfMarketPriceSyntheticCase[] = [
  {
    description: "Valid synthetic ETF market-price rows can produce mock-only normalized points.",
    expectation: {
      expectedFailureClass: "none",
      expectedStatus: "ready",
      expectedWarnings: [],
      publicMeaning: "ETF 市價欄位形狀可支撐 mock runtime，並能形成可讀的市場 proxy。"
    },
    id: "etf_valid_market_price",
    rows: [
      makeValidSyntheticEtfRow("0050", "元大台灣50 synthetic", "2026-06-10", 100.5),
      makeValidSyntheticEtfRow("006208", "富邦台50 synthetic", "2026-06-10", 82.25)
    ]
  },
  {
    description: "Missing close price must fail closed and export no runtime point.",
    expectation: {
      expectedFailureClass: "missing_required_field",
      expectedStatus: "blocked",
      expectedWarnings: [],
      publicMeaning: "缺少收盤價時 ETF 市價線必須 fail closed，不能輸出 runtime 點位。"
    },
    id: "etf_missing_close_price",
    rows: [{ ...makeValidSyntheticEtfRow("0050", "元大台灣50 synthetic", "2026-06-10", 100.5), closePrice: undefined }]
  },
  {
    description: "Symbols outside the first ETF scope must be rejected before runtime use.",
    expectation: {
      expectedFailureClass: "out_of_scope_symbol",
      expectedStatus: "blocked",
      expectedWarnings: [],
      publicMeaning: "公開 Beta 第一批 ETF 市價範圍只包含 0050 與 006208。"
    },
    id: "etf_out_of_scope_symbol",
    rows: [makeValidSyntheticEtfRow("00999", "Out of scope synthetic", "2026-06-10", 25.5)]
  },
  {
    description: "Duplicate symbol and session date rows must be rejected before runtime use.",
    expectation: {
      expectedFailureClass: "duplicate_session",
      expectedStatus: "blocked",
      expectedWarnings: [],
      publicMeaning: "同一 ETF 同一交易日重複時必須拒收，避免 runtime 顯示不穩定。"
    },
    id: "etf_duplicate_session",
    rows: [
      makeValidSyntheticEtfRow("0050", "元大台灣50 synthetic", "2026-06-10", 100.5),
      makeValidSyntheticEtfRow("0050", "元大台灣50 synthetic", "2026-06-10", 100.7)
    ]
  },
  {
    description: "Optional activity fields can be absent while required market-price fields remain valid.",
    expectation: {
      expectedFailureClass: "none",
      expectedStatus: "policy_required",
      expectedWarnings: ["activity_context_unavailable"],
      publicMeaning: "成交量或成交值缺漏時仍可保留價格讀法，但必須標示活動脈絡不足。"
    },
    id: "etf_optional_activity_missing",
    rows: [
      {
        ...makeValidSyntheticEtfRow("006208", "富邦台50 synthetic", "2026-06-10", 82.25),
        turnover: undefined,
        volume: undefined
      }
    ]
  },
  {
    description: "NAV-like fields are forbidden in the market-price lane.",
    expectation: {
      expectedFailureClass: "forbidden_field",
      expectedStatus: "blocked",
      expectedWarnings: [],
      publicMeaning: "NAV 不屬於 ETF 市價線；若出現 NAV 欄位，必須阻擋並交由後續資料層評估。"
    },
    id: "etf_forbidden_nav_field",
    rows: [{ ...makeValidSyntheticEtfRow("0050", "元大台灣50 synthetic", "2026-06-10", 100.5), forbiddenNavValue: 101.2 }]
  }
] as const;

export function runEtfMarketPriceSyntheticFixture(): {
  boundary: typeof ETF_MARKET_PRICE_SYNTHETIC_FIXTURE_BOUNDARY;
  caseResults: EtfMarketPriceSyntheticCaseResult[];
  status: "ok" | "blocked";
} {
  const caseResults = ETF_MARKET_PRICE_SYNTHETIC_CASES.map((syntheticCase) =>
    evaluateEtfMarketPriceSyntheticCase(syntheticCase)
  );

  return {
    boundary: ETF_MARKET_PRICE_SYNTHETIC_FIXTURE_BOUNDARY,
    caseResults,
    status: caseResults.every((result) => result.statusMatchesExpectation) ? "ok" : "blocked"
  };
}

function evaluateEtfMarketPriceSyntheticCase(
  syntheticCase: EtfMarketPriceSyntheticCase
): EtfMarketPriceSyntheticCaseResult {
  const result = parseEtfMarketPriceSyntheticRows(syntheticCase.rows);
  const expectedWarningsPresent = syntheticCase.expectation.expectedWarnings.every((warning) =>
    result.warnings.includes(warning)
  );
  const statusMatchesExpectation =
    result.failureClass === syntheticCase.expectation.expectedFailureClass &&
    result.status === syntheticCase.expectation.expectedStatus &&
    expectedWarningsPresent;

  return {
    caseId: syntheticCase.id,
    expectedStatus: syntheticCase.expectation.expectedStatus,
    failureClass: result.failureClass,
    normalizedPoints: result.normalizedPoints,
    publicMeaning: syntheticCase.expectation.publicMeaning,
    status: result.status,
    statusMatchesExpectation,
    warnings: result.warnings
  };
}

function parseEtfMarketPriceSyntheticRows(rows: readonly EtfMarketPriceSyntheticRow[]): {
  failureClass: EtfMarketPriceSyntheticFailureClass;
  normalizedPoints: EtfMarketPriceNormalizedPoint[];
  status: EtfMarketPriceSyntheticStatus;
  warnings: string[];
} {
  const seenSessions = new Set<string>();
  const normalizedPoints: EtfMarketPriceNormalizedPoint[] = [];
  const warnings = new Set<string>();

  for (const row of rows) {
    if (row.forbiddenNavValue !== undefined) {
      return blocked("forbidden_field", warnings);
    }

    if (!isAllowedEtfSymbol(row.symbol)) {
      return blocked("out_of_scope_symbol", warnings);
    }

    if (!isRequiredString(row.displayName) || row.assetClass !== "ETF" || !isRequiredString(row.exchange)) {
      return blocked("missing_required_field", warnings);
    }

    if (row.currency !== "TWD" || !isIsoDate(row.sessionDate) || !isPositiveFinite(row.closePrice)) {
      return blocked("missing_required_field", warnings);
    }

    if (!isRequiredString(row.sourceName) || !isRequiredString(row.sourceUrlLabel)) {
      return blocked("missing_required_field", warnings);
    }

    if (!isRequiredString(row.sourceUpdatedAt) || !isRequiredString(row.sourceCadence)) {
      return blocked("missing_required_field", warnings);
    }

    const sessionKey = `${row.symbol}:${row.sessionDate}`;
    if (seenSessions.has(sessionKey)) {
      return blocked("duplicate_session", warnings);
    }
    seenSessions.add(sessionKey);

    if (!isNonNegativeFinite(row.volume) || !isNonNegativeFinite(row.turnover)) {
      warnings.add("activity_context_unavailable");
    }

    normalizedPoints.push({
      assetClass: "ETF",
      closePrice: row.closePrice,
      currency: "TWD",
      displayName: row.displayName,
      exchange: row.exchange,
      sessionDate: row.sessionDate,
      sourceCadence: row.sourceCadence,
      sourceName: row.sourceName,
      sourceUpdatedAt: row.sourceUpdatedAt,
      sourceUrlLabel: row.sourceUrlLabel,
      symbol: row.symbol,
      ...(isNonNegativeFinite(row.turnover) ? { turnover: row.turnover } : {}),
      ...(isNonNegativeFinite(row.volume) ? { volume: row.volume } : {})
    });
  }

  return {
    failureClass: "none",
    normalizedPoints,
    status: warnings.size > 0 ? "policy_required" : "ready",
    warnings: [...warnings]
  };
}

function makeValidSyntheticEtfRow(
  symbol: string,
  displayName: string,
  sessionDate: string,
  closePrice: number
): EtfMarketPriceSyntheticRow {
  return {
    assetClass: "ETF",
    changePercent: 0.12,
    closePrice,
    currency: "TWD",
    displayName,
    exchange: "TWSE synthetic",
    priceChange: 0.12,
    sessionDate,
    sourceCadence: "daily_after_close_synthetic",
    sourceName: "synthetic_fixture_only",
    sourceUpdatedAt: "2026-06-13T00:00:00.000Z",
    sourceUrlLabel: "synthetic-fixture-no-fetch",
    symbol,
    turnover: 1000000,
    volume: 10000
  };
}

function blocked(
  failureClass: Exclude<EtfMarketPriceSyntheticFailureClass, "none">,
  warnings: Set<string>
): {
  failureClass: EtfMarketPriceSyntheticFailureClass;
  normalizedPoints: EtfMarketPriceNormalizedPoint[];
  status: "blocked";
  warnings: string[];
} {
  return {
    failureClass,
    normalizedPoints: [],
    status: "blocked",
    warnings: [...warnings]
  };
}

function isAllowedEtfSymbol(symbol: string | undefined): symbol is "0050" | "006208" {
  return symbol === "0050" || symbol === "006208";
}

function isRequiredString(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDate(value: string | undefined): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/u.test(value) && Number.isFinite(Date.parse(value));
}

function isPositiveFinite(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isNonNegativeFinite(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}
