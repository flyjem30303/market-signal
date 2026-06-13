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
  const contextLine =
    context === "stock"
      ? `${stockSymbol} 頁面會先用示範資料呈現燈號讀法，正式資料完整升級前不宣稱完整覆蓋。`
      : "公開 Beta 會先讓使用者看懂市場狀態，再逐步補齊正式資料來源與覆蓋率。";

  return {
    batch1PolicyLabels: [
      {
        detail: "2330、2382、2308 等示範標的只用於建立閱讀流程，不代表正式資料覆蓋已完成。",
        id: "batch1-demo-anchors",
        label: "示範標的",
        status: "可閱讀"
      },
      {
        detail: "正式上市股票清單需要先確認來源、欄位、更新節奏與資料品質，不在公開頁直接展示內部清單。",
        id: "batch1-no-row-list",
        label: "上市股票清單",
        status: "準備中"
      },
      {
        detail: "指數、ETF、上市股票會分批納入，不把不同資料類型混成同一個完成狀態。",
        id: "batch1-instrument-scope",
        label: "標的類型",
        status: "分批建立"
      }
    ],
    boundary: {
      publicDataSource: "mock",
      scoreSource: "mock",
      stopLine: "目前仍為示範資料與示範分數；正式資料完整通過前，不宣稱即時行情或完整市場覆蓋。"
    },
    coverageGapMatrix: [
      {
        detail: "台灣加權指數是第一個核心市場背景，會優先完成來源權利、欄位契約與每日更新節奏。",
        id: "index-baseline-gap",
        label: "台灣加權指數",
        next: "完成可公開使用條件與欄位契約後，再進入正式資料升級。",
        status: "candidate"
      },
      {
        detail: "0050、006208 等核心 ETF 會作為第二批市場觀察標的，先確認價格資料而非成分股或淨值資料。",
        id: "core-etf-context-gap",
        label: "核心 ETF",
        next: "確認 ETF 收盤價、成交量與更新時間欄位。",
        status: "checking"
      },
      {
        detail: "示範股票可支援產品閱讀，但完整上市公司覆蓋仍需分批建立名單與資料品質檢查。",
        id: "listed-equity-batch1-gap",
        label: "示範股票",
        next: "先完成第一批標的的欄位契約與異常降級。",
        status: "checking"
      },
      {
        detail: "完整上市公司覆蓋是資料真實化的後續大項，不應阻塞公開 Beta 的閱讀體驗先完成。",
        id: "listed-equity-full-gap",
        label: "上市公司完整覆蓋",
        next: "資料來源確定後，再分批做清單、回補、品質與監控。",
        status: "future"
      },
      {
        detail: "櫃買、興櫃或海外資料會留到台股核心資料穩定後再展開。",
        id: "otc-future-expansion-gap",
        label: "後續市場擴充",
        next: "先不納入 Phase 1 公開 Beta 完成條件。",
        status: "future"
      },
      {
        detail: "衍生指標需要建立在穩定的正式資料之上，否則會放大錯誤訊號。",
        id: "derived-indicator-layer-gap",
        label: "衍生指標",
        next: "等基礎資料來源與覆蓋率完成後再升級。",
        status: "blocked"
      }
    ],
    etfMarketPriceScope: [
      {
        detail: "公開 Beta 只需要 ETF 每日市場價格與成交資訊，不先處理淨值、折溢價或成分股。",
        id: "etf-market-price-runtime-scope",
        label: "ETF 市場價格",
        status: "checking"
      },
      {
        detail: "淨值與折溢價不是 Phase 1 必備資料，避免增加資料授權與解釋成本。",
        id: "etf-nav-excluded",
        label: "ETF 淨值",
        status: "excluded"
      },
      {
        detail: "成分股資料會留到會員或進階分析階段，不影響公開總覽先上線。",
        id: "etf-holdings-excluded",
        label: "ETF 成分股",
        status: "excluded"
      },
      {
        detail: "ETF 頁面不會把示範燈號描述成交易建議。",
        id: "etf-non-advice-runtime-boundary",
        label: "ETF 非投資建議",
        status: "mock_only"
      }
    ],
    etfMarketPriceMockChecks: [
      {
        detail: "示範 ETF 卡片只呈現市場觀察，不宣稱正式資料已完成。",
        id: "etf-market-price-thirty-second-mood",
        label: "ETF 30 秒摘要",
        status: "可閱讀"
      },
      {
        detail: "ETF 觀察行動會以複核、等待、追蹤為語氣，不給買賣指令。",
        id: "etf-market-price-three-minute-action",
        label: "ETF 3 分鐘觀察",
        status: "可閱讀"
      }
    ],
    fieldContracts: [
      {
        detail: "指數資料至少需要交易日、收盤值、來源識別與更新時間；指數欄位契約會先確認這四個欄位，才能穩定支援市場總覽。",
        id: "index-baseline-field-contract",
        label: "指數欄位契約",
        status: "準備中"
      },
      {
        detail: "ETF 價格欄位契約先聚焦每日收盤價、成交量與更新時間，暫不納入淨值或成分股。",
        id: "etf-price-field-contract",
        label: "ETF 欄位契約",
        status: "準備中"
      },
      {
        detail: "個股欄位契約會明確標示：個股資料先聚焦每日收盤與交易資訊；上市股票需要分批確認欄位、異常資料處理與覆蓋率，不一次承諾全市場完成。",
        id: "listed-equity-batch1-field-contract",
        label: "上市股票欄位契約",
        status: "準備中"
      }
    ],
    headline: "資料來源與覆蓋狀態",
    indexBaselineChecks: [
      {
        detail: "有效日期與收盤價是最小可用條件。",
        id: "index_valid_date_close",
        label: "日期與收盤價",
        status: "需確認"
      },
      {
        detail: "缺漏資料必須在前台降級顯示，避免使用者誤判。",
        id: "index_missing_close",
        label: "缺值處理",
        status: "需確認"
      },
      {
        detail: "同一天重複資料需被攔截或標記。",
        id: "index_duplicate_trade_date",
        label: "重複日期",
        status: "需確認"
      }
    ],
    layers: [
      {
        detail: "台灣加權指數負責全市場背景，是最優先的正式資料來源。",
        id: "index-baseline",
        label: "指數基準",
        next: "完成合法來源與欄位契約確認。",
        state: "checking"
      },
      {
        detail: "核心 ETF 用來補強市場廣度與資金觀察，但不阻塞公開 Beta 第一版。",
        id: "core-etf",
        label: "核心 ETF",
        next: "確認每日價格資料可用範圍。",
        state: "blocked"
      },
      {
        detail: "示範股票讓個股頁可閱讀，完整上市公司覆蓋留給資料真實化後續工作。",
        id: "listed-equity-batch1",
        label: "示範股票",
        next: "維持示範展示並揭露資料邊界。",
        state: "usable_demo"
      }
    ],
    readingActions: [
      {
        body: "先確認頁面目前是示範資料或正式資料，避免把尚未升級的資訊當成即時行情。",
        id: "check-boundary",
        label: "1",
        title: "確認資料狀態"
      },
      {
        body: "再看目前覆蓋的是指數、ETF、示範股票或完整上市股票，不把不同範圍混在一起。",
        id: "check-coverage",
        label: "2",
        title: "確認覆蓋範圍"
      },
      {
        body: "最後才根據燈號、成因與更新時間決定是否關注、加強觀察或降低風險。",
        id: "choose-next-observation",
        label: "3",
        title: "形成觀察行動"
      }
    ],
    summary: "資料來源與覆蓋狀態會直接影響燈號可信度，因此公開頁必須清楚說明目前資料能用到哪裡。",
    userMeaning: `${contextLine} 使用者應先看資料狀態，再看燈號與觀察建議。`
  };
}
