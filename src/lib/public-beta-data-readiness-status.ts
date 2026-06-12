export type PublicBetaDataReadinessLane = {
  id: string;
  label: string;
  status: "accepted" | "readying" | "blocked";
  summary: string;
};

export type PublicBetaSourceTrustItem = {
  id: string;
  label: string;
  status: "candidate" | "reviewing" | "blocked";
  summary: string;
  nextStep: string;
};

export type PublicBetaDataReadinessStatus = {
  headline: string;
  summary: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  rowCoverage: {
    acceptedRows: number;
    targetRows: number;
    label: string;
  };
  twiiPrerequisites: {
    acceptedSlots: number;
    totalSlots: number;
    nextOwner: string;
    nextAction: string;
  };
  lanes: PublicBetaDataReadinessLane[];
  sourceTrust: PublicBetaSourceTrustItem[];
  stopLine: string;
};

export function getPublicBetaDataReadinessStatus(): PublicBetaDataReadinessStatus {
  return {
    headline: "資料真實化仍在準備，公開頁先用 mock 說清楚狀態",
    summary:
      "目前公開 Beta 的重點是讓使用者看懂市場狀態與資料邊界。已完成的資料證據只代表局部覆蓋，不代表全市場、即時或可作為投資建議的真實資料已上線。",
    publicDataSource: "mock",
    scoreSource: "mock",
    rowCoverage: {
      acceptedRows: 182,
      targetRows: 360,
      label: "目前已接受 182/360 筆覆蓋證據"
    },
    twiiPrerequisites: {
      acceptedSlots: 6,
      totalSlots: 6,
      nextOwner: "CEO/PM",
      nextAction:
        "先把 TWII 與第一批資料線的來源、欄位、覆蓋範圍整理成 no-fetch artifact；通過後才可進入下一個明確授權 gate。"
    },
    lanes: [
      {
        id: "tw-equity",
        label: "第一批上市個股示範",
        status: "accepted",
        summary:
          "2330、2382、2308 可作為 mock 示範錨點；這不是完整上市股票覆蓋，也不是即時或真實投資訊號。"
      },
      {
        id: "twii",
        label: "TWII 大盤基準",
        status: "readying",
        summary:
          "TWII 是下一個最小可解釋的大盤基準線；目前只允許 no-fetch 準備與 mock runtime 顯示，尚未升級為真實資料來源。"
      },
      {
        id: "etf",
        label: "核心 ETF",
        status: "blocked",
        summary:
          "0050 與 006208 仍需來源權利、欄位範圍與公開顯示條件確認；在 gate 通過前只能用 mock 或未開放狀態呈現。"
      }
    ],
    sourceTrust: [
      {
        id: "twse-openapi",
        label: "TWSE OpenAPI 候選來源",
        status: "reviewing",
        summary:
          "A1 資料線已把官方開放資料候選列入 no-fetch 檢查；PM 只吸收來源位置、免費自動化條件、欄位與覆蓋範圍，不抓 raw market data。",
        nextStep: "完成 terms、automation、free-use、attribution 與限制條件確認。"
      },
      {
        id: "twii-index",
        label: "TWII 指數候選",
        status: "candidate",
        summary:
          "TWII 可作為公開 Beta 的大盤第一線，但目前仍停在候選與 mock 展示階段；缺口是可公開使用條件、欄位契約與回補規則。",
        nextStep: "產出 no-fetch coverage artifact，讓 PM 決定是否進入 bounded readonly gate。"
      },
      {
        id: "etf-source",
        label: "ETF 來源條件",
        status: "blocked",
        summary:
          "ETF 價格、NAV、持股與溢折價可能有不同來源與使用條件；目前不把 ETF 真實資料放上公開頁。",
        nextStep: "等 TWII 線路穩定後，再做 ETF-specific review。"
      }
    ],
    stopLine:
      "本區不代表真實資料已上線；不執行 SQL、不寫 Supabase、不建立 staging rows、不修改 daily_prices、不抓取 raw market data，也不把 publicDataSource 或 scoreSource 升級為 real。"
  };
}
