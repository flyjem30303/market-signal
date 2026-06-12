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
  status: "ready" | "blocked";
  summary: string;
};

export const TWSE_OPENAPI_INDEX_BASELINE_MOCK_RUNTIME_HANDOFF_BOUNDARY = {
  executionAuthority: TWSE_OPENAPI_INDEX_BASELINE_SYNTHETIC_FIXTURE_BOUNDARY.executionAuthority,
  fixturePolicy: "index_baseline_synthetic_fixture_handoff_only",
  nextRoute: "index_baseline_mock_runtime_handoff_review_then_public_label_integration",
  parserExecution: TWSE_OPENAPI_INDEX_BASELINE_SYNTHETIC_FIXTURE_BOUNDARY.parserExecution,
  publicDataSource: "mock",
  rawMarketDataFetch: false,
  scoreSource: "mock",
  sqlExecution: false,
  status: "twse_openapi_index_baseline_mock_runtime_handoff_ready_no_fetch",
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
      thirtySecondMood: "大盤基準可先作為示範閱讀，但正式行情仍需來源、欄位、交易日與修正規則通過。",
      threeMinuteAction: "使用者應先看示範狀態，再檢查缺值、重複日期與政策待確認項目，最後只把結果當成觀察線索。"
    },
    fixtureStatus: fixture.status,
    mode: "index_baseline_synthetic_fixture_handoff_only",
    nextRoute: "index_baseline_mock_runtime_handoff_review_then_public_label_integration",
    status: fixture.status === "ok" ? "ready" : "blocked",
    summary: `Index baseline fixture handoff ready with ${readyCount} demo-readable case(s), ${blockedCount} fail-closed case(s), and ${policyCount} policy-required case(s).`
  };
}

function toCaseSummary(result: TwseOpenApiIndexBaselineSyntheticCaseResult): TwseOpenApiIndexBaselineMockRuntimeCase {
  return {
    caseId: result.caseId,
    detail: buildCaseDetail(result),
    label: result.expectedPublicMeaning,
    status: toPublicStatus(result)
  };
}

function toPublicStatus(result: TwseOpenApiIndexBaselineSyntheticCaseResult): TwseOpenApiIndexBaselineMockRuntimeCaseStatus {
  if (result.expectedStatus === "ready" && result.parserResult.failureClass === "none") return "可示範";
  if (result.expectedStatus === "policy_required") return "政策待確認";
  return "暫停公開";
}

function buildCaseDetail(result: TwseOpenApiIndexBaselineSyntheticCaseResult): string {
  const warningCount = result.policyWarnings.length + result.parserResult.records.flatMap((record) => record.validationWarnings).length;
  return `failure=${result.parserResult.failureClass}; records=${result.parserResult.records.length}; warnings=${warningCount}; mockOnly=true`;
}
