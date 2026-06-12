import {
  ETF_MARKET_PRICE_SYNTHETIC_FIXTURE_BOUNDARY,
  runEtfMarketPriceSyntheticFixture,
  type EtfMarketPriceSyntheticCaseResult
} from "@/lib/etf-market-price-synthetic-fixture";

export type EtfMarketPriceMockRuntimeCaseStatus = "可示範" | "暫停公開" | "政策待確認";

export type EtfMarketPriceMockRuntimeCase = {
  caseId: EtfMarketPriceSyntheticCaseResult["caseId"];
  detail: string;
  label: string;
  status: EtfMarketPriceMockRuntimeCaseStatus;
};

export type EtfMarketPriceMockRuntimeHandoff = {
  boundary: typeof ETF_MARKET_PRICE_MOCK_RUNTIME_HANDOFF_BOUNDARY;
  caseSummaries: EtfMarketPriceMockRuntimeCase[];
  decisionUse: {
    thirtySecondMood: string;
    threeMinuteAction: string;
  };
  fixtureStatus: "ok" | "blocked";
  mode: "etf_market_price_synthetic_fixture_handoff_only";
  nextRoute: "etf_market_price_mock_runtime_handoff_review_then_public_label_integration";
  status: "ready" | "blocked";
  summary: string;
};

export const ETF_MARKET_PRICE_MOCK_RUNTIME_HANDOFF_BOUNDARY = {
  executionAuthority: ETF_MARKET_PRICE_SYNTHETIC_FIXTURE_BOUNDARY.executionAuthority,
  fixturePolicy: "etf_market_price_synthetic_fixture_handoff_only",
  nextRoute: "etf_market_price_mock_runtime_handoff_review_then_public_label_integration",
  publicDataSource: "mock",
  rawMarketDataFetch: false,
  scoreSource: "mock",
  sqlExecution: false,
  status: "etf_market_price_mock_runtime_handoff_ready_no_fetch",
  supabaseWrite: false
} as const;

export function getEtfMarketPriceMockRuntimeHandoff(): EtfMarketPriceMockRuntimeHandoff {
  const fixture = runEtfMarketPriceSyntheticFixture();
  const caseSummaries = fixture.caseResults.map(toCaseSummary);
  const demoReadableCount = caseSummaries.filter((item) => item.status === "可示範").length;
  const blockedCount = caseSummaries.filter((item) => item.status === "暫停公開").length;
  const policyCount = caseSummaries.filter((item) => item.status === "政策待確認").length;

  return {
    boundary: ETF_MARKET_PRICE_MOCK_RUNTIME_HANDOFF_BOUNDARY,
    caseSummaries,
    decisionUse: {
      thirtySecondMood:
        "ETF 市價線目前只能輔助理解 0050、006208 的市場脈絡；它通過的是 mock 欄位形狀驗證，不是真實行情。",
      threeMinuteAction:
        "使用者可以把 ETF 卡片當作市場 proxy 的觀察入口，但需同時看到缺漏、重複、範圍外與 NAV 混入時會 fail closed。"
    },
    fixtureStatus: fixture.status,
    mode: "etf_market_price_synthetic_fixture_handoff_only",
    nextRoute: "etf_market_price_mock_runtime_handoff_review_then_public_label_integration",
    status: fixture.status === "ok" ? "ready" : "blocked",
    summary: `ETF market-price fixture handoff ready with ${demoReadableCount} demo-readable case(s), ${blockedCount} fail-closed case(s), and ${policyCount} policy-required case(s).`
  };
}

function toCaseSummary(result: EtfMarketPriceSyntheticCaseResult): EtfMarketPriceMockRuntimeCase {
  return {
    caseId: result.caseId,
    detail: buildCaseDetail(result),
    label: result.publicMeaning,
    status: toPublicStatus(result)
  };
}

function toPublicStatus(result: EtfMarketPriceSyntheticCaseResult): EtfMarketPriceMockRuntimeCaseStatus {
  if (result.status === "ready" && result.failureClass === "none") return "可示範";
  if (result.status === "policy_required") return "政策待確認";
  return "暫停公開";
}

function buildCaseDetail(result: EtfMarketPriceSyntheticCaseResult): string {
  return `failure=${result.failureClass}; points=${result.normalizedPoints.length}; warnings=${result.warnings.length}; mockOnly=true`;
}
