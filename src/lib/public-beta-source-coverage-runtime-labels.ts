import { getEtfMarketPriceMockRuntimeHandoff } from "@/lib/etf-market-price-mock-runtime-handoff";
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

export type PublicBetaEtfMarketPriceScopeLabel = {
  detail: string;
  id: string;
  label: string;
  status: "checking" | "excluded" | "mock_only";
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
  etfMarketPriceMockChecks: PublicBetaIndexBaselineRuntimeCheck[];
  etfMarketPriceScope: PublicBetaEtfMarketPriceScopeLabel[];
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
  const etfMarketPriceHandoff = getEtfMarketPriceMockRuntimeHandoff();
  const contextLine =
    context === "stock"
      ? `${stockSymbol} 頁面先用示範資料說明讀法，正式市場資料與完整覆蓋率還在資料線確認。`
      : "公開 Beta 先讓使用者看懂市場氣氛、資料範圍與下一步觀察，不宣稱全市場覆蓋。";

  return {
    batch1PolicyLabels: [
      {
        detail: "2330、2382、2308 先作為產品讀法錨點，協助驗證個股頁資訊階層與風險說明。",
        id: "batch1-demo-anchors",
        label: "第一批個股錨點",
        status: "示範可讀"
      },
      {
        detail: "目前不展示完整上市櫃清單，避免使用者誤以為所有股票都已完成資料覆蓋。",
        id: "batch1-no-row-list",
        label: "不宣稱全市場覆蓋",
        status: "邊界清楚"
      },
      {
        detail: "指數、ETF、個股的資料口徑不同；正式上線前要分開確認來源、欄位與更新頻率。",
        id: "batch1-instrument-scope",
        label: "商品類型分流",
        status: "持續確認"
      }
    ],
    boundary: {
      publicDataSource: "mock",
      scoreSource: "mock",
      stopLine: "目前仍是示範資料與示範分數，不提供買賣建議，也不宣稱即時、完整或正式市場資料。"
    },
    coverageGapMatrix: [
      {
        detail: "TWII 是市場氛圍主軸，目前已有候選資料形狀可供評估，但正式來源條件與上線流程仍需確認。",
        id: "index-baseline-gap",
        label: "TWII 指數基準",
        next: "持續整理合法免費可自動化來源、欄位定義與覆蓋窗口，再收斂可公開使用的結果。",
        status: "candidate"
      },
      {
        detail: "0050、006208 可用作 ETF 觀察入口；Beta 階段先呈現價格與風險讀法，不處理成分股、NAV 或折溢價。",
        id: "core-etf-context-gap",
        label: "核心 ETF 脈絡",
        next: "確認 ETF 收盤價來源、更新頻率與公開使用條件後再接 runtime。",
        status: "checking"
      },
      {
        detail: "第一批個股只用來驗證頁面決策輔助，不代表完整台股資料已補齊。",
        id: "listed-equity-batch1-gap",
        label: "第一批個股",
        next: "先完成 symbol universe 政策與欄位契約，再擴大覆蓋率。",
        status: "checking"
      },
      {
        detail: "所有上市公司覆蓋是正式資料線目標，但不應阻擋公開 Beta 先提供市場總覽與示範讀法。",
        id: "listed-equity-full-gap",
        label: "上市公司全覆蓋",
        next: "等資料來源條件、補齊策略與更新流程穩定後再擴張。",
        status: "future"
      },
      {
        detail: "上櫃與興櫃可在上市股票穩定後再進入，不放入第一波 Beta 承諾。",
        id: "otc-future-expansion-gap",
        label: "上櫃與興櫃",
        next: "先完成上市與核心 ETF，再評估下一個市場範圍。",
        status: "future"
      },
      {
        detail: "乖離率、均線、動能與資金流需要可靠基礎價格與成交資訊；目前不能用示範資料包裝成正式訊號。",
        id: "derived-indicator-layer-gap",
        label: "衍生指標層",
        next: "基礎資料來源與更新流程確認後，再實裝投資指標與決策輔助。",
        status: "blocked"
      }
    ],
    etfMarketPriceScope: [
      {
        detail: "Beta 只先討論 ETF 收盤價與交易資訊，讓使用者知道 ETF 是否跟著市場氣氛移動。",
        id: "etf-market-price-runtime-scope",
        label: "ETF 價格範圍",
        status: "checking"
      },
      {
        detail: "NAV、折溢價與成分股資料不列入第一波公開 Beta，避免來源與解讀責任過重。",
        id: "etf-nav-excluded",
        label: "NAV 暫不納入",
        status: "excluded"
      },
      {
        detail: "ETF 成分股與權重屬於更深資料層，等基礎閉環完成後再評估。",
        id: "etf-holdings-excluded",
        label: "成分股暫不納入",
        status: "excluded"
      },
      {
        detail: "折溢價需要 NAV 與價格同步品質，第一波先不顯示。",
        id: "etf-premium-discount-excluded",
        label: "折溢價暫不納入",
        status: "excluded"
      },
      {
        detail: "ETF 資訊只作市場觀察，不提供買賣建議或推薦排序。",
        id: "etf-non-advice-runtime-boundary",
        label: "ETF 非投資建議",
        status: "mock_only"
      }
    ],
    etfMarketPriceMockChecks: [
      {
        detail: etfMarketPriceHandoff.decisionUse.thirtySecondMood,
        id: "etf-market-price-thirty-second-mood",
        label: "ETF 30 秒讀法",
        status: "示範可讀"
      },
      {
        detail: etfMarketPriceHandoff.decisionUse.threeMinuteAction,
        id: "etf-market-price-three-minute-action",
        label: "ETF 3 分鐘行動",
        status: "示範可讀"
      },
      ...etfMarketPriceHandoff.caseSummaries.map((item) => ({
        detail: item.detail,
        id: item.caseId,
        label: item.label,
        status: item.status
      }))
    ],
    fieldContracts: [
      {
        detail: "指數資料至少需要交易日、收盤值、來源識別與更新時間，才能支撐市場氛圍判讀。",
        id: "index-baseline-field-contract",
        label: "指數欄位契約",
        status: "草案可讀"
      },
      {
        detail: "ETF 價格資料需確認開高低收、成交量、成交值與交易日期；其他欄位暫不放入 Beta 承諾。",
        id: "etf-price-field-contract",
        label: "ETF 價格欄位契約",
        status: "確認中"
      },
      {
        detail: "個股資料先聚焦每日收盤與交易資訊；財報、籌碼與估值指標等資料層之後再擴張。",
        id: "listed-equity-batch1-field-contract",
        label: "個股欄位契約",
        status: "確認中"
      }
    ],
    headline: "資料來源與覆蓋率",
    indexBaselineChecks: indexBaselineHandoff.caseSummaries.map((item) => ({
      detail: toPublicIndexBaselineCheckDetail(item.caseId),
      id: item.caseId,
      label: item.label,
      status: "示範檢查"
    })),
    layers: [
      {
        detail: "大盤指數是 30 秒市場氛圍的核心入口；目前先用示範資料驗證使用者是否看得懂。",
        id: "index-baseline",
        label: "指數基準",
        next: "等待來源條件、欄位定義與覆蓋窗口確認後，再推進正式資料接入。",
        state: "checking"
      },
      {
        detail: "核心 ETF 可輔助判斷市場是否由大盤擴散到可交易商品，但第一波只處理價格讀法。",
        id: "core-etf",
        label: "核心 ETF",
        next: "確認免費可自動化來源與公開使用條件。",
        state: "blocked"
      },
      {
        detail: "第一批個股用來驗證頁面結構與決策輔助，不代表完整台股覆蓋。",
        id: "listed-equity-batch1",
        label: "第一批個股",
        next: "整理 universe 政策，避免使用者誤會覆蓋範圍。",
        state: "usable_demo"
      }
    ],
    readingActions: [
      {
        body: "先確認這個頁面使用的是示範資料或正式資料；目前公開 Beta 仍以示範資料為主。",
        id: "check-boundary",
        label: "1",
        title: "先看資料邊界"
      },
      {
        body: "再確認目前包含指數、ETF 或個股哪一層；不要把第一批示範標的當成全市場覆蓋。",
        id: "check-coverage",
        label: "2",
        title: "再看覆蓋範圍"
      },
      {
        body: "最後做觀察判斷：是否需要加強觀察、暫停追高、或等待資料更完整。",
        id: "choose-next-observation",
        label: "3",
        title: "最後做觀察判斷"
      }
    ],
    summary: "資料仍在從示範讀法走向正式資料；目前重點是讓使用者看懂來源、覆蓋率與不可宣稱範圍。",
    userMeaning: `${contextLine} 使用者可以先把燈號當成閱讀線索，並在資料來源、覆蓋率與更新時間都清楚後再提高信任度。`
  };
}

function toPublicIndexBaselineCheckDetail(caseId: string): string {
  switch (caseId) {
    case "index_valid_date_close":
      return "交易日與收盤值能被正規化，代表基礎指數資料可以進入示範讀法。";
    case "index_missing_close":
      return "缺少收盤值時必須降級，不可把不完整資料當成正式市場訊號。";
    case "index_duplicate_trade_date":
      return "同一交易日重複出現時要先拒收或人工複核，避免覆蓋錯誤。";
    case "index_missing_optional_fields":
      return "選填欄位缺漏不一定阻擋讀法，但必須在來源與覆蓋率說明中揭露。";
    case "index_revision_warning":
      return "來源若可能修訂，頁面需要保留更新時間與修訂風險說明。";
    case "index_timezone_session_gap":
      return "交易日與時區要能對齊台北時間，避免把不同市場日誤判為同一日。";
    default:
      return "示範檢查只代表資料形狀可讀，仍不能替代正式來源權利與品質審核。";
  }
}
