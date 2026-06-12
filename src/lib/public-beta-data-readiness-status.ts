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

export type PublicBetaCoverageArtifactScope = {
  id: string;
  label: string;
  status: "mock-ready" | "candidate" | "blocked" | "future";
  publicLabel: string;
  summary: string;
};

export type PublicBetaTwiiTermsReadinessItem = {
  id: string;
  label: string;
  status: "ready-for-copy" | "review-required" | "blocked";
  publicLabel: string;
  summary: string;
  nextStep: string;
};

export type PublicBetaBoundedReadonlyRequirementItem = {
  id: string;
  label: string;
  status: "required" | "prepared" | "blocked";
  publicLabel: string;
  summary: string;
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
  twiiTermsReadiness: PublicBetaTwiiTermsReadinessItem[];
  boundedReadonlyRequirements: PublicBetaBoundedReadonlyRequirementItem[];
  coverageArtifactScopes: PublicBetaCoverageArtifactScope[];
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
    twiiTermsReadiness: [
      {
        id: "twii-source-terms",
        label: "資料條款",
        publicLabel: "條款仍在確認",
        status: "review-required",
        summary:
          "目前只確認候選路徑與需要比對的條款面，尚未把任何來源視為可公開正式使用。",
        nextStep: "確認 exact endpoint 的使用條款、儲存條件與公開顯示條件。"
      },
      {
        id: "twii-field-contract",
        label: "欄位對照",
        publicLabel: "最小欄位待確認",
        status: "review-required",
        summary:
          "先鎖定交易日、收盤值、標的代碼、標的名稱、來源標籤與來源更新時間，不展開額外技術指標。",
        nextStep: "在 no-fetch 條件下確認欄位語意、缺值、修正與假日處理規則。"
      },
      {
        id: "twii-daily-cadence",
        label: "更新節奏",
        publicLabel: "每日收盤後候選",
        status: "ready-for-copy",
        summary:
          "公開 Beta 不承諾即時資料；TWII 真實化路線以每日收盤後批次更新為候選節奏。",
        nextStep: "補齊失敗重試、快取沿用、缺漏交易日與人工停用訊息。"
      },
      {
        id: "twii-attribution-copy",
        label: "公開引用",
        publicLabel: "引用文案待審",
        status: "review-required",
        summary:
          "頁面可先說明候選來源與 mock 邊界，但不得暗示官方背書、即時精準或投資建議。",
        nextStep: "由 A2 檢查資料來源、更新時間、風險揭露與非投資建議文案。"
      }
    ],
    boundedReadonlyRequirements: [
      {
        id: "readonly-source-rights",
        label: "來源權利",
        publicLabel: "需確認來源條款",
        status: "required",
        summary:
          "未來任何唯讀檢查前，都要先確認 exact source route、可自動化條件、儲存與公開顯示條件。"
      },
      {
        id: "readonly-field-contract",
        label: "欄位契約",
        publicLabel: "需確認欄位語意",
        status: "required",
        summary:
          "交易日、收盤值、標的代碼、標的名稱、來源標籤與來源更新時間都需先定義缺值與修正規則。"
      },
      {
        id: "readonly-safe-output",
        label: "安全輸出",
        publicLabel: "只允許安全摘要",
        status: "prepared",
        summary:
          "未來唯讀檢查只能輸出 sanitized aggregate 或布林狀態，不顯示 raw payload、row payload、secret 或 stock-id row list。"
      },
      {
        id: "readonly-promotion-lock",
        label: "升級鎖",
        publicLabel: "不自動升級資料源",
        status: "blocked",
        summary:
          "即使未來唯讀檢查成功，也不會自動切換正式資料或真實分數；仍需獨立 promotion gate。"
      }
    ],
    coverageArtifactScopes: [
      {
        id: "twii-index-baseline",
        label: "TWII",
        publicLabel: "TWII 大盤基準準備中",
        status: "candidate",
        summary:
          "最適合先接成大盤氛圍基準；仍需來源條件、欄位契約、更新頻率、缺漏規則與公開歸因。"
      },
      {
        id: "core-etf-context",
        label: "0050 / 006208",
        publicLabel: "核心 ETF 來源條件待確認",
        status: "blocked",
        summary:
          "可做 investable proxy，但 market price、NAV、持股與溢折價不能混用；目前只維持 mock 或未開放狀態。"
      },
      {
        id: "batch1-listed-equity",
        label: "2330 / 2382 / 2308",
        publicLabel: "第一批上市個股示範",
        status: "mock-ready",
        summary:
          "只作為標的頁閱讀流程錨點，不代表完整上市公司 universe、即時行情或個股買賣建議。"
      },
      {
        id: "sector-industry",
        label: "產業 / 族群",
        publicLabel: "產業與族群待 taxonomy review",
        status: "future",
        summary:
          "未來用來解釋市場壓力是集中或擴散；目前不阻塞 Batch 0 或 Batch 1 runtime shell。"
      },
      {
        id: "derived-indicators",
        label: "波動 / 資金流 / 均線 / 動能",
        publicLabel: "進階指標 mock 可解釋，真實計算未開放",
        status: "future",
        summary:
          "可以先用 mock 說明指標意義；真實計算需等底層來源、公式、閾值、缺漏規則與非投資建議文案通過。"
      }
    ],
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
