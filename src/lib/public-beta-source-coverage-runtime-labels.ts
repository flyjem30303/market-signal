import { getTwseOpenApiIndexBaselineMockRuntimeHandoff } from "@/lib/twse-openapi-index-baseline-mock-runtime-handoff";

export type PublicBetaSourceCoverageContext = "home" | "briefing" | "stock";

export type PublicBetaSourceCoverageLayer = {
  detail: string;
  id: string;
  label: string;
  next: string;
  state: "usable_demo" | "checking" | "blocked";
};

export type PublicBetaFieldContractStatus = {
  detail: string;
  id: string;
  label: string;
  status: string;
};

export type PublicBetaIndexBaselineRuntimeCheck = {
  detail: string;
  id: string;
  label: string;
  status: string;
};

export type PublicBetaBatch1PolicyLabel = {
  detail: string;
  id: string;
  label: string;
  status: string;
};

export type PublicBetaCoverageGapMatrixItem = {
  detail: string;
  id: string;
  label: string;
  next: string;
  status: "candidate" | "checking" | "future" | "blocked";
};

export type PublicBetaSourceCoverageAction = {
  body: string;
  id: string;
  label: string;
  title: string;
};

export type PublicBetaSourceCoverageRuntimeLabels = {
  batch1PolicyLabels: PublicBetaBatch1PolicyLabel[];
  boundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
    stopLine: string;
  };
  coverageGapMatrix: PublicBetaCoverageGapMatrixItem[];
  fieldContracts: PublicBetaFieldContractStatus[];
  headline: string;
  indexBaselineChecks: PublicBetaIndexBaselineRuntimeCheck[];
  layers: PublicBetaSourceCoverageLayer[];
  readingActions: PublicBetaSourceCoverageAction[];
  summary: string;
  userMeaning: string;
};

export function getPublicBetaSourceCoverageRuntimeLabels(
  context: PublicBetaSourceCoverageContext,
  stockSymbol = "2330"
): PublicBetaSourceCoverageRuntimeLabels {
  const indexBaselineHandoff = getTwseOpenApiIndexBaselineMockRuntimeHandoff();
  const contextLine =
    context === "stock"
      ? `${stockSymbol} 仍是 mock 標的頁，請把它當成產品體驗與資料邊界示範。`
      : "公開 Beta 先讓使用者看懂資料來源與覆蓋範圍，不急著宣稱全市場真實資料。";

  return {
    batch1PolicyLabels: [
      {
        detail: "2330、2382、2308 目前只作為第一批 mock 示範標的，用來驗證標的頁資訊階層與行動判斷節奏。",
        id: "batch1-demo-anchors",
        label: "第一批個股示範",
        status: "mock 示範"
      },
      {
        detail: "公開頁不輸出完整個股清單，也不把未驗證的 stock id row list 當成已完成覆蓋率。",
        id: "batch1-no-row-list",
        label: "不宣稱全市場覆蓋",
        status: "限制清楚"
      },
      {
        detail: "指數、ETF、個股與產業族群分開處理；0050、006208 與 TWII 不混用同一套覆蓋判斷。",
        id: "batch1-instrument-scope",
        label: "資產類型分開",
        status: "範圍分離"
      }
    ],
    boundary: {
      publicDataSource: "mock",
      scoreSource: "mock",
      stopLine: "來源與覆蓋率尚未通過 gate；目前不宣稱真實資料、完整覆蓋，也不提供買賣建議。"
    },
    coverageGapMatrix: [
      {
        detail: "TWII 可支撐 30 秒市場氣氛，但正式資料顯示仍要完成來源歸屬、欄位契約、缺漏交易日與修訂規則。",
        id: "index-baseline-gap",
        label: "TWII 指數基準",
        next: "等明確授權後才準備受控唯讀驗證流程。",
        status: "candidate"
      },
      {
        detail: "0050、006208 可作為 3 分鐘行動判斷的 ETF 脈絡，但需先切清市場價格、NAV、成分股與折溢價資料邊界。",
        id: "core-etf-context-gap",
        label: "核心 ETF 脈絡",
        next: "A1 下一步：prepare_etf_market_price_source_scope_no_fetch。",
        status: "checking"
      },
      {
        detail: "2330、2382、2308 目前只是熟悉股票的 mock demo anchors，不代表完整上市股票覆蓋。",
        id: "listed-equity-batch1-gap",
        label: "Batch 1 個股示範",
        next: "維持小批次；不要輸出或暗示完整股票清單。",
        status: "checking"
      },
      {
        detail: "完整上市公司覆蓋仍未開放；需要 universe 來源、上下市處理、公司行動與延遲資料說明。",
        id: "listed-equity-full-gap",
        label: "完整上市股票",
        next: "等 Batch 1 欄位契約穩定後再開 universe source 決策。",
        status: "future"
      },
      {
        detail: "OTC 與更廣的台灣市場覆蓋仍是未來擴充，不是公開 Beta 的當前承諾。",
        id: "otc-future-expansion-gap",
        label: "OTC 未來擴充",
        next: "等上市股票完整覆蓋規則接受後再開。",
        status: "future"
      },
      {
        detail: "產業與族群分類可以幫使用者判斷壓力是否集中，但 taxonomy 來源與成分修訂規則尚未確定。",
        id: "sector-industry-context-gap",
        label: "產業分類脈絡",
        next: "之後準備產業分類來源決策文件。",
        status: "future"
      },
      {
        detail: "趨勢、動能、資金流與風險指標需要穩定基礎資料、公式、門檻與缺值規則後才能真實化。",
        id: "derived-indicator-layer-gap",
        label: "衍生指標層",
        next: "先維持 mock explanation，不提供買賣建議。",
        status: "blocked"
      }
    ],
    fieldContracts: [
      {
        detail: "大盤資料至少需要交易日與收盤值，才能支撐首頁與 briefing 的市場狀態判讀。",
        id: "index-baseline-field-contract",
        label: "大盤欄位對照",
        status: "檢查中"
      },
      {
        detail: "第一批個股需要日期、收盤、成交量與基本識別欄位；缺欄時只能維持 mock 或降級顯示。",
        id: "listed-equity-batch1-field-contract",
        label: "上市個股欄位對照",
        status: "檢查中"
      }
    ],
    headline: "資料來源與覆蓋範圍",
    indexBaselineChecks: indexBaselineHandoff.caseSummaries.map((item) => ({
      detail: toPublicIndexBaselineCheckDetail(item.caseId),
      id: item.caseId,
      label: item.label,
      status: "合成案例"
    })),
    layers: [
      {
        detail: "首頁與 briefing 需要先有大盤基準，才能把市場溫度、警示清單與標的頁串成同一個判讀流程。",
        id: "index-baseline",
        label: "大盤基準",
        next: "A1 持續整理 TWSE OpenAPI 候選來源、欄位契約與可公開使用條件。",
        state: "checking"
      },
      {
        detail: "0050、006208 等核心 ETF 需要獨立確認資料來源、更新節奏與公開引用條件。",
        id: "core-etf",
        label: "核心 ETF",
        next: "等大盤候選來源更穩定後，再打開 ETF 來源條件與覆蓋率檢查。",
        state: "blocked"
      },
      {
        detail: "2330、2382、2308 目前是 mock 示範標的，用來讓使用者理解個股頁會如何輔助觀察。",
        id: "listed-equity-batch1",
        label: "第一批個股",
        next: "先穩住標的頁讀法，再擴大資料 universe。",
        state: "usable_demo"
      }
    ],
    readingActions: [
      {
        body: "先確認畫面目前是 mock 還是 real；公開 Beta 目前仍標示為 mock。",
        id: "check-boundary",
        label: "1",
        title: "先看資料邊界"
      },
      {
        body: "再確認指數、ETF、個股各自覆蓋到哪裡，避免把示範資料誤認成全市場資料。",
        id: "check-coverage",
        label: "2",
        title: "再看覆蓋範圍"
      },
      {
        body: "最後才把狀態用於觀察、複核或等待，不把 mock 訊號當成買賣建議。",
        id: "choose-next-observation",
        label: "3",
        title: "最後做觀察判斷"
      }
    ],
    summary:
      "資料線正在從 mock 示範走向可驗證來源；公開頁會同步說清楚哪些資料可看、哪些資料仍在確認。",
    userMeaning: `${contextLine} 使用者可以知道哪些資料可看、哪些資料還在確認、哪些資料目前不能用來做 real-data 判斷。`
  };
}

function toPublicIndexBaselineCheckDetail(caseId: string): string {
  switch (caseId) {
    case "index_valid_date_close":
      return "可驗證交易日與收盤值是大盤基準的最小欄位。";
    case "index_missing_close":
      return "缺少收盤值時必須 fail closed，不能產生市場狀態。";
    case "index_duplicate_trade_date":
      return "同一交易日重複資料必須被攔下，避免覆蓋率被高估。";
    case "index_missing_optional_fields":
      return "非必要欄位缺漏時可降級，但不能影響核心日期與收盤值。";
    case "index_revision_warning":
      return "來源修正或版本變動需要留下 warning，避免舊資料被誤讀。";
    case "index_timezone_session_gap":
      return "交易日與時區需要一致，避免每日資料錯位。";
    default:
      return "合成案例用來確認 parser contract，不代表已抓取真實市場資料。";
  }
}
