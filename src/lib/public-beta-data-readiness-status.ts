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
    headline: "正式資料仍在準備，公開頁維持示範狀態",
    summary:
      "目前網站已能呈現市場狀態儀表站的閱讀流程，但正式資料來源、覆蓋率、更新頻率與回退流程仍需驗證後才會上線。",
    publicDataSource: "mock",
    scoreSource: "mock",
    rowCoverage: {
      acceptedRows: 182,
      targetRows: 360,
      label: "資料覆蓋仍在補齊"
    },
    twiiPrerequisites: {
      acceptedSlots: 6,
      totalSlots: 6,
      nextOwner: "product-data",
      nextAction: "下一步是把資料來源可用條件、欄位定義與覆蓋率整理成上線前檢查。"
    },
    twiiTermsReadiness: [
      {
        id: "twii-source-terms",
        label: "來源可用條件",
        publicLabel: "仍需確認公開使用條件",
        status: "review-required",
        summary: "正式資料上線前，需要確認來源的可使用範圍、引用方式與限制。",
        nextStep: "先整理來源證據，再判斷是否足以進入正式資料流程。"
      },
      {
        id: "twii-field-contract",
        label: "欄位定義",
        publicLabel: "仍需確認欄位一致性",
        status: "review-required",
        summary: "日期、收盤價、漲跌與來源狀態等欄位需要一致定義，才能避免誤讀。",
        nextStep: "先完成欄位對照，再接入使用者可理解的資料狀態說明。"
      },
      {
        id: "twii-daily-cadence",
        label: "更新頻率",
        publicLabel: "每日收盤後更新",
        status: "ready-for-copy",
        summary: "目前產品方向不追求秒級即時，而是以每日收盤資訊支撐穩定判讀。",
        nextStep: "公開頁會清楚標示更新時間與資料延遲。"
      }
    ],
    boundedReadonlyRequirements: [
      {
        id: "source-rights",
        label: "來源條件",
        publicLabel: "需要確認合法可用",
        status: "required",
        summary: "未確認來源條件前，不把資料宣稱為正式市場資料。"
      },
      {
        id: "field-contract",
        label: "欄位契約",
        publicLabel: "需要欄位一致",
        status: "required",
        summary: "資料欄位必須穩定，才能進一步做覆蓋率與品質檢查。"
      },
      {
        id: "safe-output",
        label: "安全輸出",
        publicLabel: "只顯示可公開摘要",
        status: "prepared",
        summary: "公開頁只顯示整理後資訊，不顯示內部處理內容或機密資訊。"
      }
    ],
    operatorDecisionReadiness: [
      {
        id: "source-evidence",
        label: "來源證據",
        publicLabel: "部分證據已整理",
        status: "ready",
        summary: "已有部分候選證據可供後續評估，但仍不等於正式上線。",
        nextStep: "整理成上線前檢查清單。"
      },
      {
        id: "release-decision",
        label: "正式資料啟用",
        publicLabel: "等待整體驗證",
        status: "waiting",
        summary: "需等待來源條件、覆蓋率、品質、回退流程與公開文案都通過。",
        nextStep: "通過前維持示範資料標示。"
      }
    ],
    coverageArtifactScopes: [
      {
        id: "twii",
        label: "指數資料",
        publicLabel: "優先補齊大盤指數",
        status: "mock-ready",
        summary: "大盤指數是 30 秒市場氣氛的核心，優先補足。"
      },
      {
        id: "etf",
        label: "ETF",
        publicLabel: "第二優先",
        status: "future",
        summary: "ETF 用於確認市場氣氛是否擴散。"
      },
      {
        id: "listed-equity",
        label: "上市個股",
        publicLabel: "分批補齊",
        status: "future",
        summary: "上市個股資料量較大，會在來源與欄位穩定後分批擴充。"
      }
    ],
    lanes: [
      {
        id: "product-runtime",
        label: "產品閱讀流程",
        status: "accepted",
        summary: "首頁、晨報與標的頁已能展示示範閱讀流程。"
      },
      {
        id: "data-coverage",
        label: "資料覆蓋率",
        status: "readying",
        summary: "正在整理正式資料來源與覆蓋率路線。"
      },
      {
        id: "public-trust",
        label: "公開信任",
        status: "readying",
        summary: "公開頁持續移除內部字樣，改用使用者可理解的說明。"
      }
    ],
    sourceTrust: [
      {
        id: "official-source",
        label: "正式來源",
        status: "reviewing",
        summary: "仍需確認可自動化使用條件與引用方式。",
        nextStep: "來源確認後才可進一步啟用正式資料。"
      },
      {
        id: "fallback-copy",
        label: "降級說明",
        status: "candidate",
        summary: "若資料不足，頁面會提示使用者保守解讀。",
        nextStep: "持續檢查每個公開頁是否有清楚的資料狀態。"
      }
    ],
    stopLine: "正式資料尚未啟用；目前只呈現示範資料與示範分數，也不提供買賣建議。"
  };
}
