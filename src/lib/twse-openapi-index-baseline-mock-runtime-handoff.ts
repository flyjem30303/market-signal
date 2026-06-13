import {
  runTwseOpenApiIndexBaselineSyntheticFixture,
  TWSE_OPENAPI_INDEX_BASELINE_SYNTHETIC_FIXTURE_BOUNDARY,
  type TwseOpenApiIndexBaselineSyntheticCaseResult
} from "@/lib/twse-openapi-index-baseline-synthetic-fixture";

export type TwseOpenApiIndexBaselineMockRuntimeCaseStatus = "可示範" | "暫停公開" | "政策待確認";

export type TwseOpenApiIndexBaselineMockRuntimeCase = {
  caseId: TwseOpenApiIndexBaselineSyntheticCaseResult["caseId"];
  detail: string;
  label: string;
  status: TwseOpenApiIndexBaselineMockRuntimeCaseStatus;
};

export type TwseOpenApiIndexBaselineMockRuntimeHandoff = {
  boundary: typeof TWSE_OPENAPI_INDEX_BASELINE_MOCK_RUNTIME_HANDOFF_BOUNDARY;
  caseSummaries: TwseOpenApiIndexBaselineMockRuntimeCase[];
  decisionUse: {
    thirtySecondMood: string;
    threeMinuteAction: string;
  };
  fixtureStatus: "ok" | "blocked";
  mode: "index_baseline_synthetic_fixture_handoff_only";
  nextRoute: "index_baseline_mock_runtime_handoff_review_then_public_label_integration";
  status: "twse_openapi_index_baseline_mock_runtime_handoff_ready_no_fetch" | "blocked";
  summary: string;
};

export const TWSE_OPENAPI_INDEX_BASELINE_MOCK_RUNTIME_HANDOFF_BOUNDARY = {
  executionAuthority: TWSE_OPENAPI_INDEX_BASELINE_SYNTHETIC_FIXTURE_BOUNDARY.executionAuthority,
  fixturePolicy: "index_baseline_synthetic_fixture_handoff_only",
  mockOnly: "mockOnly=true",
  nextRoute: "index_baseline_mock_runtime_handoff_review_then_public_label_integration",
  parserExecution: TWSE_OPENAPI_INDEX_BASELINE_SYNTHETIC_FIXTURE_BOUNDARY.parserExecution,
  publicDataSource: "mock",
  rawMarketDataFetch: false,
  scoreSource: "mock",
  sqlExecution: false,
  supabaseWrite: false
} as const;

export function getTwseOpenApiIndexBaselineMockRuntimeHandoff(): TwseOpenApiIndexBaselineMockRuntimeHandoff {
  const fixture = runTwseOpenApiIndexBaselineSyntheticFixture();
  const caseSummaries = fixture.caseResults.map(toCaseSummary);
  const readyCount = caseSummaries.filter((item) => item.status === "可示範").length;
  const blockedCount = caseSummaries.filter((item) => item.status === "暫停公開").length;
  const policyCount = caseSummaries.filter((item) => item.status === "政策待確認").length;

  return {
    boundary: TWSE_OPENAPI_INDEX_BASELINE_MOCK_RUNTIME_HANDOFF_BOUNDARY,
    caseSummaries,
    decisionUse: {
      thirtySecondMood: "用 TWII 指數基準先形成市場氛圍摘要，但目前只能標示為示範資料。",
      threeMinuteAction:
        "使用者可用它判斷是否加強觀察市場，不應把它當成即時行情、交易訊號或官方資料背書。"
    },
    fixtureStatus: fixture.status,
    mode: "index_baseline_synthetic_fixture_handoff_only",
    nextRoute: "index_baseline_mock_runtime_handoff_review_then_public_label_integration",
    status: fixture.status === "ok" ? "twse_openapi_index_baseline_mock_runtime_handoff_ready_no_fetch" : "blocked",
    summary: `TWSE OpenAPI 指數基準 mock runtime handoff 完成：可示範 ${readyCount} 例，暫停公開 ${blockedCount} 例，政策待確認 ${policyCount} 例。`
  };
}

function toCaseSummary(result: TwseOpenApiIndexBaselineSyntheticCaseResult): TwseOpenApiIndexBaselineMockRuntimeCase {
  return {
    caseId: result.caseId,
    detail: buildCaseDetail(result),
    label: normalizeCaseLabel(result),
    status: toPublicStatus(result)
  };
}

function toPublicStatus(result: TwseOpenApiIndexBaselineSyntheticCaseResult): TwseOpenApiIndexBaselineMockRuntimeCaseStatus {
  if (result.expectedStatus === "ready" && result.parserResult.failureClass === "none") return "可示範";
  if (result.expectedStatus === "policy_required") return "政策待確認";
  return "暫停公開";
}

function buildCaseDetail(result: TwseOpenApiIndexBaselineSyntheticCaseResult): string {
  const warningCount =
    result.policyWarnings.length +
    result.parserResult.records.flatMap((record) => record.validationWarnings).length;

  if (result.expectedStatus === "ready" && result.parserResult.failureClass === "none") {
    return `synthetic fixture 可產生 ${result.parserResult.records.length} 筆安全 mock 記錄；仍不得視為真實市場資料。`;
  }
  if (result.expectedStatus === "policy_required") {
    return `此案例需要政策待確認，共 ${warningCount} 個 warning；未確認前不可公開為真實資料。`;
  }
  return "欄位缺漏或日期品質不合格，runtime 必須 fail closed 並暫停公開。";
}

function normalizeCaseLabel(result: TwseOpenApiIndexBaselineSyntheticCaseResult): string {
  const labels: Record<TwseOpenApiIndexBaselineSyntheticCaseResult["caseId"], string> = {
    index_duplicate_trade_date: "重複交易日需拒絕",
    index_missing_close: "缺少收盤價需拒絕",
    index_missing_optional_fields: "必要欄位可用，選填欄位待補",
    index_revision_warning: "歷史修正需政策確認",
    index_timezone_session_gap: "交易日缺口需政策確認",
    index_valid_date_close: "日期與收盤價可形成示範點"
  };

  return labels[result.caseId];
}
