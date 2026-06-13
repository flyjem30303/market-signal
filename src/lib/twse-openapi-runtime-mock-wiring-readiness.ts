export type TwseOpenApiRuntimeMockWiringStep = {
  id: string;
  label: string;
  owner: "產品體驗" | "資料來源" | "公開文案";
  status: "accepted" | "readying" | "blocked";
  summary: string;
};

export type TwseOpenApiRuntimeMockWiringReadiness = {
  boundary: {
    publicDataSource: "mock";
    rawMarketDataFetch: false;
    scoreSource: "mock";
    sqlExecution: false;
    supabaseWrite: false;
  };
  headline: string;
  nextMainlineRoute: "twse_openapi_runtime_mock_consumer_wiring_readiness";
  productPromise: string;
  status: "readying";
  stopLine: string;
  steps: TwseOpenApiRuntimeMockWiringStep[];
  userValue: string;
};

export function getTwseOpenApiRuntimeMockWiringReadiness(): TwseOpenApiRuntimeMockWiringReadiness {
  return {
    boundary: {
      publicDataSource: "mock",
      rawMarketDataFetch: false,
      scoreSource: "mock",
      sqlExecution: false,
      supabaseWrite: false
    },
    headline: "正式資料導入前的 mock runtime 接線準備",
    nextMainlineRoute: "twse_openapi_runtime_mock_consumer_wiring_readiness",
    productPromise:
      "先把資料準備結果轉成使用者可理解的市場狀態，讓公開 Beta 能清楚說明資料可信度、更新時間與使用邊界。",
    status: "readying",
    stopLine:
      "目前不抓取真實市場資料、不執行 SQL、不寫入遠端資料庫，也不把示範分數升級為正式分數。",
    steps: [
      {
        id: "source-adapter",
        label: "來源介面",
        owner: "資料來源",
        status: "accepted",
        summary: "來源介面已以本地合約方式整理，尚未連接正式資料來源。"
      },
      {
        id: "parser-contract",
        label: "欄位契約",
        owner: "資料來源",
        status: "accepted",
        summary: "日期、收盤價與缺值處理等欄位規則已有示範契約，正式資料仍需來源確認。"
      },
      {
        id: "consumer-adapter",
        label: "runtime handoff",
        owner: "產品體驗",
        status: "accepted",
        summary: "前台可讀取示範結果並以 fail-closed 方式顯示資料狀態。"
      },
      {
        id: "synthetic-cases",
        label: "示範情境",
        owner: "資料來源",
        status: "readying",
        summary: "持續補齊成功、空資料、缺欄位、重複日期與格式變動等示範情境。"
      },
      {
        id: "public-copy-guard",
        label: "公開文案保護",
        owner: "公開文案",
        status: "readying",
        summary: "公開頁必須清楚標示示範資料、資料狀態與非投資建議邊界。"
      },
      {
        id: "real-promotion",
        label: "正式資料升級",
        owner: "產品體驗",
        status: "blocked",
        summary: "必須等來源權利、欄位契約、覆蓋率、品質與回退條件完整後，才可升級正式資料。"
      }
    ],
    userValue:
      "使用者會先看到清楚的市場狀態與資料邊界，而不是內部流程或不完整的資料升級訊號。"
  };
}
