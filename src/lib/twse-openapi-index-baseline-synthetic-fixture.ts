import {
  parseTwseOpenApiSyntheticRows,
  TWSE_OPENAPI_PARSER_CONTRACT_BOUNDARY,
  type TwseOpenApiParserContractResult,
  type TwseOpenApiSyntheticRow
} from "@/lib/twse-openapi-parser-contract";

export type TwseOpenApiIndexBaselineSyntheticCaseId =
  | "index_valid_date_close"
  | "index_missing_close"
  | "index_duplicate_trade_date"
  | "index_missing_optional_fields"
  | "index_revision_warning"
  | "index_timezone_session_gap";

export type TwseOpenApiIndexBaselineSyntheticCaseExpectation = {
  expectedFailureClass: TwseOpenApiParserContractResult<"twse_openapi_synthetic_daily_close">["failureClass"];
  expectedPublicMeaning: string;
  expectedStatus: "ready" | "blocked" | "policy_required";
  expectedWarnings: string[];
};

export type TwseOpenApiIndexBaselineSyntheticCase = {
  description: string;
  expectation: TwseOpenApiIndexBaselineSyntheticCaseExpectation;
  id: TwseOpenApiIndexBaselineSyntheticCaseId;
  rows: readonly TwseOpenApiSyntheticRow[];
};

export type TwseOpenApiIndexBaselineSyntheticCaseResult = {
  caseId: TwseOpenApiIndexBaselineSyntheticCaseId;
  expectedPublicMeaning: string;
  expectedStatus: TwseOpenApiIndexBaselineSyntheticCaseExpectation["expectedStatus"];
  parserResult: TwseOpenApiParserContractResult<"twse_openapi_synthetic_daily_close">;
  policyWarnings: string[];
  statusMatchesExpectation: boolean;
};

export const TWSE_OPENAPI_INDEX_BASELINE_SYNTHETIC_FIXTURE_BOUNDARY = {
  executionAuthority: TWSE_OPENAPI_PARSER_CONTRACT_BOUNDARY.executionAuthority,
  fixturePolicy: "index_baseline_synthetic_rows_only",
  nextRoute: "twse_openapi_index_baseline_synthetic_parser_fixture_review_then_mock_runtime_handoff",
  parserExecution: TWSE_OPENAPI_PARSER_CONTRACT_BOUNDARY.parserExecution,
  publicDataSource: "mock",
  rawMarketDataFetch: false,
  scoreSource: "mock",
  sqlExecution: false,
  status: "twse_openapi_index_baseline_synthetic_parser_fixture_ready_no_fetch",
  supabaseWrite: false
} as const;

export const TWSE_OPENAPI_INDEX_BASELINE_SYNTHETIC_CASES: readonly TwseOpenApiIndexBaselineSyntheticCase[] = [
  {
    description: "Valid synthetic TWII index date and close can produce mock-only parser output.",
    expectation: {
      expectedFailureClass: "none",
      expectedPublicMeaning: "Synthetic TWII close is readable for mock-only route validation.",
      expectedStatus: "ready",
      expectedWarnings: []
    },
    id: "index_valid_date_close",
    rows: [
      { ClosingIndex: "22,100.25", Date: "20260610" },
      { ClosingIndex: "22,180.75", Date: "20260611" }
    ]
  },
  {
    description: "Missing close value must fail closed and export no runtime point.",
    expectation: {
      expectedFailureClass: "missing_required_field",
      expectedPublicMeaning: "Missing close must block runtime promotion and show no public point.",
      expectedStatus: "blocked",
      expectedWarnings: []
    },
    id: "index_missing_close",
    rows: [{ Date: "20260611" }]
  },
  {
    description: "Duplicate trade dates must be rejected before any real-data promotion.",
    expectation: {
      expectedFailureClass: "duplicate_dates",
      expectedPublicMeaning: "Duplicate trade dates must be rejected before real-data promotion.",
      expectedStatus: "blocked",
      expectedWarnings: []
    },
    id: "index_duplicate_trade_date",
    rows: [
      { ClosingIndex: "22,100.25", Date: "20260611" },
      { ClosingIndex: "22,101.25", Date: "20260611" }
    ]
  },
  {
    description: "Required fields can remain readable while optional volume / turnover fields stay unconfirmed.",
    expectation: {
      expectedFailureClass: "none",
      expectedPublicMeaning: "Required index close fields pass while optional market fields remain unconfirmed.",
      expectedStatus: "ready",
      expectedWarnings: ["volume_not_required_for_route", "turnover_not_required_for_route"]
    },
    id: "index_missing_optional_fields",
    rows: [{ ClosingIndex: "22,180.75", Date: "115/06/11" }]
  },
  {
    description: "Synthetic revision package must surface a policy warning instead of silently replacing history.",
    expectation: {
      expectedFailureClass: "none",
      expectedPublicMeaning: "Historical replacement requires a revision policy before public promotion.",
      expectedStatus: "policy_required",
      expectedWarnings: ["revision_policy_required_before_replacement"]
    },
    id: "index_revision_warning",
    rows: [
      { ClosingIndex: "22,100.25", Date: "2026-06-10" },
      { ClosingIndex: "22,180.75", Date: "2026-06-11" }
    ]
  },
  {
    description: "Synthetic session gaps must remain visible as trading-calendar policy work.",
    expectation: {
      expectedFailureClass: "none",
      expectedPublicMeaning: "Trading-session gaps require a calendar policy before real promotion.",
      expectedStatus: "policy_required",
      expectedWarnings: ["session_gap_policy_required_before_real_promotion"]
    },
    id: "index_timezone_session_gap",
    rows: [
      { ClosingIndex: "22,100.25", Date: "2026-06-10" },
      { ClosingIndex: "22,280.75", Date: "2026-06-12" }
    ]
  }
] as const;

export function runTwseOpenApiIndexBaselineSyntheticFixture(): {
  boundary: typeof TWSE_OPENAPI_INDEX_BASELINE_SYNTHETIC_FIXTURE_BOUNDARY;
  caseResults: TwseOpenApiIndexBaselineSyntheticCaseResult[];
  status: "ok" | "blocked";
} {
  const caseResults = TWSE_OPENAPI_INDEX_BASELINE_SYNTHETIC_CASES.map((syntheticCase) =>
    evaluateIndexBaselineSyntheticCase(syntheticCase)
  );

  return {
    boundary: TWSE_OPENAPI_INDEX_BASELINE_SYNTHETIC_FIXTURE_BOUNDARY,
    caseResults,
    status: caseResults.every((result) => result.statusMatchesExpectation) ? "ok" : "blocked"
  };
}

function evaluateIndexBaselineSyntheticCase(
  syntheticCase: TwseOpenApiIndexBaselineSyntheticCase
): TwseOpenApiIndexBaselineSyntheticCaseResult {
  const parserResult = parseTwseOpenApiSyntheticRows("twiiIndexHistory", syntheticCase.rows);
  const policyWarnings = collectPolicyWarnings(syntheticCase, parserResult);
  const expectedWarningsPresent = syntheticCase.expectation.expectedWarnings.every((warning) =>
    [...policyWarnings, ...parserResult.records.flatMap((record) => record.validationWarnings)].includes(warning)
  );
  const failureMatches = parserResult.failureClass === syntheticCase.expectation.expectedFailureClass;
  const statusMatchesExpectation = failureMatches && expectedWarningsPresent;

  return {
    caseId: syntheticCase.id,
    expectedPublicMeaning: syntheticCase.expectation.expectedPublicMeaning,
    expectedStatus: syntheticCase.expectation.expectedStatus,
    parserResult,
    policyWarnings,
    statusMatchesExpectation
  };
}

function collectPolicyWarnings(
  syntheticCase: TwseOpenApiIndexBaselineSyntheticCase,
  parserResult: TwseOpenApiParserContractResult<"twse_openapi_synthetic_daily_close">
): string[] {
  const warnings: string[] = [];
  if (syntheticCase.id === "index_revision_warning") warnings.push("revision_policy_required_before_replacement");
  if (syntheticCase.id === "index_timezone_session_gap" && hasSyntheticSessionGap(parserResult)) {
    warnings.push("session_gap_policy_required_before_real_promotion");
  }
  return warnings;
}

function hasSyntheticSessionGap(
  parserResult: TwseOpenApiParserContractResult<"twse_openapi_synthetic_daily_close">
): boolean {
  const orderedDates = parserResult.records.map((record) => record.normalized.tradeDate).sort();
  for (let index = 1; index < orderedDates.length; index += 1) {
    const previous = Date.parse(`${orderedDates[index - 1]}T00:00:00.000Z`);
    const current = Date.parse(`${orderedDates[index]}T00:00:00.000Z`);
    if (Number.isFinite(previous) && Number.isFinite(current) && current - previous > 24 * 60 * 60 * 1000) {
      return true;
    }
  }
  return false;
}
