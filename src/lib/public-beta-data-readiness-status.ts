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
    headline: "正式資料仍在準備，公開頁目前維持示範展示",
    summary:
      "首頁、簡報與個股頁已可用來理解燈號讀法、風險提示與觀察順序；正式市場資料仍需完成來源權利、欄位契約、覆蓋率、回補與正式升級檢查。",
    publicDataSource: "mock",
    scoreSource: "mock",
    rowCoverage: {
      acceptedRows: 182,
      targetRows: 360,
      label: "資料覆蓋率準備中"
    },
    twiiPrerequisites: {
      acceptedSlots: 6,
      totalSlots: 6,
      nextOwner: "product-data",
      nextAction: "確認來源權利、欄位契約與可公開使用條件"
    },
    twiiTermsReadiness: [
      {
        id: "twii-source-terms",
        label: "來源使用條件",
        publicLabel: "資料是否可公開呈現",
        status: "review-required",
        summary: "需要確認來源網站或開放資料條款允許自動化使用、轉換與公開摘要呈現。",
        nextStep: "完成條款位置、可用範圍與引用方式的紀錄。"
      },
      {
        id: "twii-field-contract",
        label: "欄位契約",
        publicLabel: "資料欄位是否穩定",
        status: "review-required",
        summary: "需要明確定義日期、收盤價、成交量與更新時間欄位，避免前台讀到錯誤資料。",
        nextStep: "建立欄位對應與異常資料降級規則。"
      },
      {
        id: "twii-daily-cadence",
        label: "每日更新節奏",
        publicLabel: "資料多久更新一次",
        status: "ready-for-copy",
        summary: "第一階段不追求秒級即時，公開頁會以每日收盤後更新為主。",
        nextStep: "把更新時間與可能延遲寫入公開頁說明。"
      }
    ],
    boundedReadonlyRequirements: [
      {
        id: "source-rights",
        label: "來源權利",
        publicLabel: "合法可用",
        status: "required",
        summary: "正式資料上線前，必須確認資料來源可用於公開網站與商業化產品。"
      },
      {
        id: "field-contract",
        label: "欄位契約",
        publicLabel: "格式穩定",
        status: "required",
        summary: "資料欄位需有固定名稱、型別、日期規則與缺值處理方式。"
      },
      {
        id: "safe-output",
        label: "安全輸出",
        publicLabel: "前台不誤導",
        status: "prepared",
        summary: "當資料缺漏、過期或尚未升級時，前台會明確顯示狀態並維持示範展示。"
      }
    ],
    operatorDecisionReadiness: [
      {
        id: "source-evidence",
        label: "來源證據",
        publicLabel: "已可進入審查",
        status: "ready",
        summary: "資料來源與欄位使用方式已有初步整理，可交由 PM 收斂是否進入下一步。",
        nextStep: "確認是否採用該來源作為第一階段資料基礎。"
      },
      {
        id: "release-decision",
        label: "正式資料升級",
        publicLabel: "等待完整條件",
        status: "waiting",
        summary: "正式資料上線仍需來源權利、覆蓋率、品質與回補條件一起通過。",
        nextStep: "條件齊備後再將公開頁從示範資料升級到正式資料。"
      }
    ],
    coverageArtifactScopes: [
      {
        id: "twii",
        label: "指數資料",
        publicLabel: "台灣加權指數",
        status: "mock-ready",
        summary: "示範資料已能支援 30 秒市場氛圍與 3 分鐘觀察順序。"
      },
      {
        id: "etf",
        label: "ETF",
        publicLabel: "核心 ETF",
        status: "future",
        summary: "ETF 資料會在來源與欄位條件清楚後納入正式覆蓋。"
      },
      {
        id: "listed-equity",
        label: "上市股票",
        publicLabel: "上市股票覆蓋",
        status: "future",
        summary: "上市公司完整覆蓋需要分批建立名單、資料來源、回補與品質檢查。"
      }
    ],
    lanes: [
      {
        id: "product-runtime",
        label: "產品體驗",
        status: "accepted",
        summary: "首頁、簡報與個股頁已先用示範資料建立可理解的閱讀流程。"
      },
      {
        id: "data-coverage",
        label: "資料覆蓋",
        status: "readying",
        summary: "資料來源與覆蓋範圍正在收斂，尚未宣稱完整正式資料。"
      },
      {
        id: "public-trust",
        label: "公開信任",
        status: "readying",
        summary: "前台會揭露資料狀態、更新時間、延遲可能與非投資建議邊界。"
      }
    ],
    sourceTrust: [
      {
        id: "official-source",
        label: "官方或開放來源",
        status: "reviewing",
        summary: "優先選擇合法免費、可自動化且可公開摘要使用的資料來源。",
        nextStep: "補齊條款位置、引用要求、使用限制與更新節奏。"
      },
      {
        id: "fallback-copy",
        label: "降級說明",
        status: "candidate",
        summary: "若正式資料尚未可用，公開頁要清楚說明目前為示範資料。",
        nextStep: "保留使用者可理解的資料狀態與風險提醒。"
      }
    ],
    stopLine: "目前仍為示範展示；不是即時行情，不代表完整覆蓋，也不提供買賣或持有建議。"
  };
}
