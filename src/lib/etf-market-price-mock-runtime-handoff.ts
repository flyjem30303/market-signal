import {
  ETF_MARKET_PRICE_SYNTHETIC_FIXTURE_BOUNDARY,
  runEtfMarketPriceSyntheticFixture,
  type EtfMarketPriceSyntheticCaseResult
} from "@/lib/etf-market-price-synthetic-fixture";

export type EtfMarketPriceMockRuntimeCaseStatus = "示範可讀" | "阻擋放行" | "政策待確認";

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
  const demoReadableCount = caseSummaries.filter((item) => item.status === "示範可讀").length;
  const blockedCount = caseSummaries.filter((item) => item.status === "阻擋放行").length;
  const policyCount = caseSummaries.filter((item) => item.status === "政策待確認").length;

  return {
    boundary: ETF_MARKET_PRICE_MOCK_RUNTIME_HANDOFF_BOUNDARY,
    caseSummaries,
    decisionUse: {
      thirtySecondMood: "ETF 市價線目前只能輔助理解 0050、006208 的市場脈絡，不能當成真實交易建議。",
      threeMinuteAction: "使用者可以把 ETF 卡片當作市場 proxy 的觀察入口，再回到指數與個股頁交叉確認。"
    },
    fixtureStatus: fixture.status,
    mode: "etf_market_price_synthetic_fixture_handoff_only",
    nextRoute: "etf_market_price_mock_runtime_handoff_review_then_public_label_integration",
    status: fixture.status === "ok" ? "ready" : "blocked",
    summary: `ETF 市價 mockOnly=true handoff 已用合成資料驗證：示範可讀 ${demoReadableCount} 件、阻擋放行 ${blockedCount} 件、政策待確認 ${policyCount} 件。`
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
  if (result.status === "ready" && result.failureClass === "none") return "示範可讀";
  if (result.status === "policy_required") return "政策待確認";
  return "阻擋放行";
}

function buildCaseDetail(result: EtfMarketPriceSyntheticCaseResult): string {
  if (result.status === "ready" && result.failureClass === "none") {
    return `合成資料已輸出 ${result.normalizedPoints.length} 筆可讀 ETF 市價點位，仍維持 no-fetch 與 mock runtime。`;
  }
  if (result.status === "policy_required") {
    return `合成資料可讀，但有 ${result.warnings.length} 個活動脈絡警示，必須在公開文案降級說明。`;
  }
  return "欄位形狀或範圍不符合 ETF 市價線要求，必須 fail closed，不能輸出 runtime 點位。";
}
