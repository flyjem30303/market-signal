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

export type PublicBetaOperatorDecisionReadinessItem = {
  id: string;
  label: string;
  status: "ready" | "waiting" | "blocked";
  publicLabel: string;
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
  twiiTermsReadiness: PublicBetaTwiiTermsReadinessItem[];
  boundedReadonlyRequirements: PublicBetaBoundedReadonlyRequirementItem[];
  operatorDecisionReadiness: PublicBetaOperatorDecisionReadinessItem[];
  coverageArtifactScopes: PublicBetaCoverageArtifactScope[];
  lanes: PublicBetaDataReadinessLane[];
  sourceTrust: PublicBetaSourceTrustItem[];
  stopLine: string;
};

export function getPublicBetaDataReadinessStatus(): PublicBetaDataReadinessStatus {
  return {
    headline: "資料真實化仍在準備中，公開頁維持 mock",
    summary:
      "目前已把資料來源、覆蓋範圍、欄位契約與升級檢查拆成可追蹤狀態；這讓使用者知道哪些訊號只是產品示範，哪些資料線正在等待合法來源與覆蓋驗證。",
    publicDataSource: "mock",
    scoreSource: "mock",
    rowCoverage: {
      acceptedRows: 182,
      targetRows: 360,
      label: "目前可檢查的覆蓋證據 182/360"
    },
    twiiPrerequisites: {
      acceptedSlots: 6,
      totalSlots: 6,
      nextOwner: "CEO/PM",
      nextAction:
        "TWII 的來源、欄位、更新節奏與安全輸出條件已整理；下一步仍需一次明確的受控讀取或後續資料線決策。"
    },
    twiiTermsReadiness: [
      {
        id: "twii-source-terms",
        label: "資料條款",
        publicLabel: "合法使用條件仍需確認",
        status: "review-required",
        summary: "需確認來源頁、使用條款、引用方式與是否允許自動化取得每日資料。",
        nextStep: "由 A1 持續整理合法免費可自動化來源與條款證據。"
      },
      {
        id: "twii-field-contract",
        label: "欄位契約",
        publicLabel: "欄位對照仍需驗證",
        status: "review-required",
        summary: "至少需要交易日、收盤值、來源標籤與更新時間能穩定對照。",
        nextStep: "先以 synthetic / no-fetch contract case 驗證欄位形狀。"
      },
      {
        id: "twii-daily-cadence",
        label: "更新節奏",
        publicLabel: "每日收盤後更新即可",
        status: "ready-for-copy",
        summary: "本產品不追求秒級即時，公開 Beta 只需要清楚標示每日收盤後資料節奏。",
        nextStep: "A2 持續守住非即時與非投資建議文案。"
      },
      {
        id: "twii-attribution-copy",
        label: "公開引用",
        publicLabel: "來源引用文字待最終確認",
        status: "review-required",
        summary: "公開頁需要說明資料來源、更新頻率與限制，但不能暗示官方背書。",
        nextStep: "待來源條件確認後，再由 PM 整合公開頁引用文字。"
      }
    ],
    boundedReadonlyRequirements: [
      {
        id: "readonly-source-rights",
        label: "來源權利",
        publicLabel: "必須先確認可讀取條件",
        status: "required",
        summary: "未確認合法免費可自動化來源前，不進入真實資料 promotion。"
      },
      {
        id: "readonly-field-contract",
        label: "欄位契約",
        publicLabel: "必須先確認欄位穩定",
        status: "required",
        summary: "資料列需要能被穩定轉成 runtime 可理解的日期、數值、來源與時間戳。"
      },
      {
        id: "readonly-safe-output",
        label: "安全輸出",
        publicLabel: "只允許摘要與 no-secret 結果",
        status: "prepared",
        summary: "任何未來檢查都只能回傳 sanitized aggregate，不輸出 raw payload、row payload 或 secrets。"
      },
      {
        id: "readonly-promotion-lock",
        label: "升級鎖",
        publicLabel: "真實資料升級仍鎖住",
        status: "blocked",
        summary: "通過來源、覆蓋、品質、回退與公開文案 gate 之前，不切到 Supabase 或 real score。"
      }
    ],
    operatorDecisionReadiness: [
      {
        id: "twii-source-evidence",
        label: "TWII 資料證據",
        publicLabel: "證據已整理，尚未公開升級",
        status: "ready",
        summary: "TWII 是第一條最小可行資料線，但目前仍只支援 mock runtime 說明。",
        nextStep: "等待 CEO/PM 對下一次受控讀取或資料線轉向做明確決策。"
      },
      {
        id: "twii-operator-decision",
        label: "受控讀取決策",
        publicLabel: "等待一次明確決策",
        status: "waiting",
        summary: "是否執行 bounded readonly attempt 需要單獨命名與事後 review，不在一般頁面自動啟動。",
        nextStep: "主線先持續產品/runtime 可理解性；資料線可獨立準備。"
      },
      {
        id: "twii-real-data-promotion",
        label: "真實資料升級",
        publicLabel: "目前 blocked",
        status: "blocked",
        summary: "尚未滿足公開資料來源、覆蓋率、品質與 promotion 條件。",
        nextStep: "維持 publicDataSource=mock 與 scoreSource=mock。"
      }
    ],
    coverageArtifactScopes: [
      {
        id: "twii-index-baseline",
        label: "TWII",
        publicLabel: "大盤基準候選線",
        status: "candidate",
        summary: "適合作為第一條資料真實化主線，但仍需來源條款與欄位契約確認。"
      },
      {
        id: "core-etf-context",
        label: "0050 / 006208",
        publicLabel: "核心 ETF 來源條件待確認",
        status: "blocked",
        summary: "ETF 涉及價格、成分、NAV 或不同來源條件，暫不宣稱真實覆蓋。"
      },
      {
        id: "batch1-listed-equity",
        label: "2330 / 2382 / 2308",
        publicLabel: "第一批個股 mock 示範",
        status: "mock-ready",
        summary: "用於產品體驗示範，不代表台股全市場真實覆蓋。"
      },
      {
        id: "sector-industry",
        label: "產業 / 族群",
        publicLabel: "taxonomy 待 review",
        status: "future",
        summary: "等資料基礎穩定後，再建立產業與族群分類。"
      },
      {
        id: "derived-indicators",
        label: "波動率 / 資金流 / 乖離 / 動能",
        publicLabel: "可先解釋，真實計算未開放",
        status: "future",
        summary: "產品可先說明指標意義，但真實計算需要來源與品質 gate。"
      }
    ],
    lanes: [
      {
        id: "tw-equity",
        label: "上市個股示範線",
        status: "accepted",
        summary: "目前只作為 mock 示範，不輸出完整上市公司清單或真實交易資料。"
      },
      {
        id: "twii",
        label: "TWII 大盤基準線",
        status: "readying",
        summary: "最適合作為第一條真實化候選線，但仍需合法來源與欄位驗證。"
      },
      {
        id: "etf",
        label: "核心 ETF 線",
        status: "blocked",
        summary: "暫時卡在來源權利、欄位契約與可公開使用條件。"
      }
    ],
    sourceTrust: [
      {
        id: "twse-openapi",
        label: "TWSE OpenAPI 候選來源",
        status: "reviewing",
        summary: "A1 正在整理合法免費可自動化條件；主線不直接抓資料。",
        nextStep: "完成 OFFICIAL source matrix 後再決定是否進入 adapter / parser。"
      },
      {
        id: "twii-index",
        label: "TWII 指數候選線",
        status: "candidate",
        summary: "TWII 有機會成為最小可行真實資料線，但仍不能在公開頁宣稱 real。",
        nextStep: "等待 PM 接收 A1 的來源與覆蓋矩陣。"
      },
      {
        id: "etf-source",
        label: "ETF 來源條件",
        status: "blocked",
        summary: "ETF 資料源、再散布與引用條件尚未足夠清楚。",
        nextStep: "先完成 TWII，再回頭處理 ETF。"
      }
    ],
    stopLine:
      "目前不執行資料庫寫入、不匯入原始資料酬載、不修改正式資料表，也不把示範資料或示範分數升級成正式狀態。"
  };
}
