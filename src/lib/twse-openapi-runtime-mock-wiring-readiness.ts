export type TwseOpenApiRuntimeMockWiringStep = {
  id: string;
  label: string;
  owner: "產品線" | "資料線" | "文案線";
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
    headline: "TWSE OpenAPI 管線已進入 runtime mock 接線準備",
    nextMainlineRoute: "twse_openapi_runtime_mock_consumer_wiring_readiness",
    productPromise:
      "這一步不是上線真實行情，而是讓公開 Beta 的首頁與標的頁先能讀懂未來真實資料會長什麼樣子。",
    status: "readying",
    stopLine:
      "在資料覆蓋、來源條件與正式切換檢查完成前，網站仍維持 mock 資料與 mock 分數，不宣稱即時行情或投資建議。",
    steps: [
      {
        id: "source-adapter",
        label: "來源契約",
        owner: "產品線",
        status: "accepted",
        summary: "TWSE OpenAPI route、授權邊界、來源標示與延遲揭露已被記錄為 no-fetch contract。"
      },
      {
        id: "parser-contract",
        label: "解析契約",
        owner: "產品線",
        status: "accepted",
        summary: "synthetic parser 已能處理日期、數字、必要欄位、重複日期與 fail-closed 分類。"
      },
      {
        id: "consumer-adapter",
        label: "runtime handoff",
        owner: "產品線",
        status: "accepted",
        summary: "parser result 已可轉成 runtime handoff，失敗時會 blocked 且不輸出可用 points。"
      },
      {
        id: "synthetic-cases",
        label: "synthetic cases",
        owner: "資料線",
        status: "readying",
        summary: "資料線獨立補齊 success、empty、missing field、duplicate date、schema drift 等 synthetic cases。"
      },
      {
        id: "public-copy-guard",
        label: "公開邊界文案",
        owner: "文案線",
        status: "readying",
        summary: "公開頁需持續標示資料延遲、mock 邊界、非投資建議與非官方背書。"
      },
      {
        id: "real-promotion",
        label: "real promotion",
        owner: "產品線",
        status: "blocked",
        summary: "真實資料與真實分數必須等來源權利、覆蓋率、品質、Supabase gate 與 promotion gate 另行通過。"
      }
    ],
    userValue:
      "使用者目前看到的是產品閱讀流程與風險辨識介面；工程上正在把未來真實資料接入點整理成可驗證、可回退、可揭露的 runtime 形狀。"
  };
}
