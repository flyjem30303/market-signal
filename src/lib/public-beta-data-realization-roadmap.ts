export type PublicBetaDataRealizationStage = {
  currentState: string;
  id: string;
  label: string;
  nextStep: string;
  publicMeaning: string;
  tone: "active" | "blocked" | "hold";
};

export type PublicBetaDataRealizationRoadmap = {
  disclosure: string;
  headline: string;
  stages: PublicBetaDataRealizationStage[];
  summary: string;
};

export type PublicBetaCoverageBatch = {
  currentState: string;
  id: string;
  label: string;
  nextStep: string;
  publicValue: string;
  tone: "active" | "blocked" | "hold";
};

export type PublicBetaPromotionChecklistItem = {
  id: string;
  label: string;
  notYetClaimed: string;
  publicWording: string;
  status: "blocked" | "ready" | "waiting";
};

export type PublicBetaBatch1ReadinessItem = {
  blocker: string;
  id: string;
  label: string;
  nextStep: string;
  publicMeaning: string;
  status: "blocked" | "ready" | "waiting";
};

export type PublicBetaBatch1UserStep = {
  id: string;
  label: string;
  message: string;
  nextStep: string;
  status: "blocked" | "ready" | "waiting";
};

export type PublicBetaReadonlyGateStep = {
  id: string;
  label: string;
  publicStatus: string;
  publicMeaning: string;
  requiredBeforeExecution: string;
  status: "blocked" | "ready" | "waiting";
};

export type PublicBetaCoverageRolloutPlan = {
  batch1Readiness: PublicBetaBatch1ReadinessItem[];
  batch1UserSteps: PublicBetaBatch1UserStep[];
  batches: PublicBetaCoverageBatch[];
  checklist: PublicBetaPromotionChecklistItem[];
  disclosure: string;
  headline: string;
  readonlyGate: PublicBetaReadonlyGateStep[];
  summary: string;
};

export function getPublicBetaDataRealizationRoadmap(): PublicBetaDataRealizationRoadmap {
  return {
    disclosure:
      "目前公開頁仍維持示範資料與示範分數；正式資料、Supabase 寫入、ingestion/backfill 與真實分數尚未啟用。",
    headline: "資料真實化路徑",
    stages: [
      {
        currentState: "TWII 與少量 ETF / 個股已有 mock 展示；完整上市公司 universe 尚未完成。",
        id: "coverage-universe",
        label: "覆蓋範圍",
        nextStep: "先鎖定 TWII、ETF、核心權值股與板塊，建立分批補齊順序。",
        publicMeaning: "使用者需要知道目前看得到哪些市場與標的，避免誤以為已覆蓋全部台股。",
        tone: "hold"
      },
      {
        currentState: "來源權利與公開引用規則仍需逐項確認。",
        id: "source-rights",
        label: "來源與權利",
        nextStep: "保留來源狀態與引用邊界，未確認前不宣稱正式資料服務。",
        publicMeaning: "資料可信度不只看數字，也要知道來源是否能公開展示。",
        tone: "blocked"
      },
      {
        currentState: "Supabase 專案與資料表已進入準備，但公開 runtime 仍不讀寫正式資料。",
        id: "supabase-readiness",
        label: "資料庫就緒",
        nextStep: "完成 readonly / write path gate 後，才進入正式資料 promotion。",
        publicMeaning: "資料庫準備中不等於真實分數已上線，公開頁需明確標示 mock 邊界。",
        tone: "hold"
      },
      {
        currentState: "ingestion / backfill 仍在設計與安全檢查階段。",
        id: "ingestion-backfill",
        label: "匯入與回補",
        nextStep: "先建立可重跑、可驗證、可回退的流程，再補歷史資料。",
        publicMeaning: "更新時間、缺漏資料與回補狀態會影響使用者是否能信任警示。",
        tone: "hold"
      },
      {
        currentState: "公開頁仍使用 mock score，不提供 real-time 或 real score 宣稱。",
        id: "runtime-promotion",
        label: "Runtime promotion",
        nextStep: "資料覆蓋、品質、來源權利與法務揭露通過後，才允許升級到 real。",
        publicMeaning: "使用者可以先理解產品，但不能把目前燈號當正式決策依據。",
        tone: "blocked"
      }
    ],
    summary:
      "第二階段的核心不是一次補完所有資料，而是把覆蓋範圍、來源權利、資料庫、匯入回補與 runtime promotion 做成可追蹤閉環。"
  };
}

export function getPublicBetaCoverageRolloutPlan(): PublicBetaCoverageRolloutPlan {
  return {
    batch1Readiness: [
      {
        blocker: "TWII 與 ETF 來源權利、引用範圍、公開展示條款仍需接受。",
        id: "batch1-source-rights",
        label: "Source rights",
        nextStep: "先確認 TWII 與核心 ETF 的來源、引用、展示與再利用邊界。",
        publicMeaning: "資料能不能公開展示，比資料本身是否存在更重要。",
        status: "blocked"
      },
      {
        blocker: "TWII 與 ETF 欄位、單位、日期、漲跌幅與排除欄位尚未完成合約。",
        id: "batch1-field-contract",
        label: "Field contract",
        nextStep: "鎖定 symbol、session date、close/level、change、source status、rights status 等最小欄位。",
        publicMeaning: "欄位合約完成後，使用者才知道每個數字代表什麼。",
        status: "waiting"
      },
      {
        blocker: "更新頻率、台北時區、交易日與缺漏 session 規則尚未正式定義。",
        id: "batch1-cadence-missing-rules",
        label: "Cadence and missing rules",
        nextStep: "定義更新時間、缺漏標示、休市與補資料規則。",
        publicMeaning: "使用者需要知道資料是最新、延遲、缺漏，或仍是 mock。",
        status: "waiting"
      },
      {
        blocker: "readonly/write gate 尚未允許公開 runtime 讀寫正式資料。",
        id: "batch1-runtime-gates",
        label: "Readonly / write gates",
        nextStep: "等 readonly、write path、rollback/fail-closed 全部通過後才可能 promotion。",
        publicMeaning: "資料庫準備好不等於網站可以直接切 real。",
        status: "blocked"
      }
    ],
    batch1UserSteps: [
      {
        id: "batch1-user-market-baseline",
        label: "先補大盤基準",
        message: "TWII 會先成為市場氣氛的基準線，讓使用者知道今天是偏穩、偏熱，還是需要提高警覺。",
        nextStep: "完成來源權利、欄位與交易日規則後，才進入 readonly 驗證。",
        status: "waiting"
      },
      {
        id: "batch1-user-core-etf",
        label: "再補核心 ETF",
        message: "核心 ETF 會用來對照大盤與主要資金方向，但不包含持股、淨值或折溢價等進階資料。",
        nextStep: "先確認公開展示權利與最小欄位，再決定是否納入 Batch 1。",
        status: "waiting"
      },
      {
        id: "batch1-user-data-boundary",
        label: "保持資料邊界清楚",
        message: "目前網站仍是 mock 閱讀模式；畫面可以解釋產品邏輯，但不能宣稱已提供正式市場資料。",
        nextStep: "等 readonly、write、回補與 promotion gate 都通過後，才可調整公開宣稱。",
        status: "blocked"
      }
    ],
    batches: [
      {
        currentState: "首頁、briefing 與主要股票頁已能展示 mock-only 市場狀態與資料邊界。",
        id: "batch-0-current-mock-showcase",
        label: "Batch 0：目前展示",
        nextStep: "持續把公開頁文字維持為 mock-only，不宣稱正式資料。",
        publicValue: "讓使用者先理解產品怎麼讀市場氛圍。",
        tone: "active"
      },
      {
        currentState: "TWII 與核心 ETF 是最適合先做真實化的基準組，但來源權利與欄位合約仍需通過。",
        id: "batch-1-twii-core-etf",
        label: "Batch 1：TWII + 核心 ETF",
        nextStep: "完成來源權利、欄位、更新時間與缺漏規則後，再進 readonly/write gate。",
        publicValue: "先補大盤與 ETF，讓使用者有市場基準。",
        tone: "hold"
      },
      {
        currentState: "主要上市公司與個股仍需 universe、來源與回補策略。",
        id: "batch-2-major-listed-companies",
        label: "Batch 2：主要上市公司",
        nextStep: "先定義權值股與高關注清單，再逐批補資料欄位。",
        publicValue: "讓個股頁從展示樣板逐步變成可比較的資料面板。",
        tone: "hold"
      },
      {
        currentState: "板塊與產業分類可先用 mock 分群呈現，真實分類與來源仍需確認。",
        id: "batch-3-sector-industry",
        label: "Batch 3：板塊與產業",
        nextStep: "建立產業對照表、分類來源與公開引用規則。",
        publicValue: "幫使用者看見市場風險集中在哪些族群。",
        tone: "hold"
      },
      {
        currentState: "波動率、資金流、均線與動能屬於進階指標，必須等基礎資料穩定後再升級。",
        id: "batch-4-advanced-indicators",
        label: "Batch 4：進階指標",
        nextStep: "等價格、量能與來源品質穩定，再導入進階指標。",
        publicValue: "讓使用者從燈號進一步理解成因與風險結構。",
        tone: "blocked"
      }
    ],
    checklist: [
      {
        id: "coverage-sufficiency",
        label: "Coverage sufficiency",
        notYetClaimed: "尚未宣稱完整覆蓋所有台股。",
        publicWording: "先分批補齊市場基準、ETF、主要個股與族群資料。",
        status: "waiting"
      },
      {
        id: "source-rights-accepted",
        label: "Source rights accepted",
        notYetClaimed: "尚未宣稱所有來源都可公開展示或再利用。",
        publicWording: "每批資料都需要確認來源、引用與公開展示權利。",
        status: "blocked"
      },
      {
        id: "supabase-readiness",
        label: "Supabase readiness",
        notYetClaimed: "尚未宣稱公開 runtime 已讀寫正式 Supabase 資料。",
        publicWording: "資料庫準備與公開資料服務是兩個不同階段。",
        status: "waiting"
      },
      {
        id: "ingestion-backfill-repeatability",
        label: "Ingestion/backfill repeatability",
        notYetClaimed: "尚未宣稱匯入與歷史回補已可穩定重跑。",
        publicWording: "正式上線前需能重跑、驗證、回退與標示缺漏。",
        status: "waiting"
      },
      {
        id: "trust-legal-disclosure",
        label: "Trust and legal disclosure",
        notYetClaimed: "不提供買賣建議、績效承諾或即時精準到秒承諾。",
        publicWording: "所有燈號都是資訊與風險辨識，不是交易指令。",
        status: "ready"
      }
    ],
    disclosure:
      "Coverage rollout 與 promotion checklist 只說明上線路徑；目前仍保持示範資料與示範分數。",
    headline: "Coverage Rollout Plan",
    readonlyGate: [
      {
        id: "readonly-purpose",
        label: "Readonly purpose",
        publicStatus: "已完成一次只讀診斷，結果仍需補資料",
        publicMeaning: "One bounded readonly validation has run. It reached Supabase and returned aggregate-only counts, but Batch 1 coverage is still incomplete, so the public site remains mock-only.",
        requiredBeforeExecution: "Do not retry this attempt in the same slice. Prepare a Batch 1 data coverage route decision for TWII, 0050, and 006208 before any write/backfill gate.",
        status: "blocked"
      },
      {
        id: "aggregate-proof",
        label: "Aggregate proof only",
        publicStatus: "目前只確認彙總覆蓋率，尚未補齊 Batch 1",
        publicMeaning: "The latest diagnostic counted 182 of 360 expected Batch 1 rows. Three symbols are complete, while TWII and two ETF symbols still need coverage work.",
        requiredBeforeExecution: "Post-run review confirmed no raw payload, row payload, stock-id payload, secrets, SQL text, Supabase write, or market-data ingestion was exposed.",
        status: "ready"
      },
      {
        id: "write-promotion-lock",
        label: "Write / promotion lock",
        publicStatus: "寫入、回補與真實分數升級仍關閉",
        publicMeaning: "只讀驗證即使成功，也不代表可以寫資料、補資料、給 row coverage 分數或切 real。",
        requiredBeforeExecution: "任何 write/backfill、公開資料升級或真實分數啟用都必須另開 gate。",
        status: "blocked"
      }
    ],
    summary:
      "公開 Beta 會先從市場基準與核心 ETF 補起，再擴到主要個股、板塊產業與進階指標；未通過 checklist 前不切換 real。"
  };
}
