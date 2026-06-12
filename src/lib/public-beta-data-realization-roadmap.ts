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
      "這份路線圖只描述資料升級順序。公開頁目前仍是 mock-only，不宣稱即時行情、完整覆蓋或投資建議。",
    headline: "公開資料升級",
    stages: [
      {
        currentState: "首頁、晨報與標的頁已能用 mock 狀態說明市場氛圍、風險焦點與資料邊界。",
        id: "coverage-universe",
        label: "覆蓋範圍",
        nextStep: "先把 TWII、核心 ETF、第一批上市個股分開標示，避免使用者誤以為已覆蓋全市場。",
        publicMeaning: "使用者可以知道目前看到的是示範儀表站，而不是完整台股資料庫。",
        tone: "active"
      },
      {
        currentState: "A1 正在整理合法免費可自動化來源、欄位契約與公開顯示限制。",
        id: "source-rights",
        label: "資料來源條件",
        nextStep: "完成 no-fetch coverage artifact 後，由 CEO/PM 決定是否進入 bounded readonly gate。",
        publicMeaning: "資料來源必須先能公開解釋，才會放進公開 Beta 的真實資料線。",
        tone: "hold"
      },
      {
        currentState: "Supabase 已作為未來資料後端候選，但公開 runtime 尚未切換到 Supabase 真實資料。",
        id: "supabase-readiness",
        label: "後端資料準備",
        nextStep: "等來源、欄位、覆蓋率與回退策略通過後，再做單次明確授權的 read/write gate。",
        publicMeaning: "使用者不會在未驗證完成前看到半成品真實資料。",
        tone: "hold"
      },
      {
        currentState: "ingestion 與 backfill 流程仍未啟用；目前只允許本地規格、mock fixture 與 no-fetch 檢查。",
        id: "ingestion-backfill",
        label: "回補與更新流程",
        nextStep: "定義可重跑、可回退、可稽核的流程後，才允許接觸真實資料或寫入 staging。",
        publicMeaning: "資料更新會先有安全流程，不會直接把未審核資料推到畫面。",
        tone: "blocked"
      },
      {
        currentState: "公開頁分數與狀態仍由 mock score 驅動。",
        id: "runtime-promotion",
        label: "公開頁升級",
        nextStep: "來源權利、覆蓋率、品質、回退與公開文案都通過後，才可考慮把 publicDataSource 或 scoreSource 升級。",
        publicMeaning: "使用者看到的紅黃綠燈目前是產品示範，不是正式真實市場訊號。",
        tone: "blocked"
      }
    ],
    summary:
      "CEO 目前採多線推進：PM 主線修 runtime 可理解性，A1 補 no-fetch 資料覆蓋 artifact，A2 檢查公開文案與非投資建議邊界。"
  };
}

export function getPublicBetaCoverageRolloutPlan(): PublicBetaCoverageRolloutPlan {
  return {
    batch1Readiness: [
      {
        blocker: "TWII 與 ETF 的可公開使用條件、欄位契約、更新頻率與歸因文字尚未全部接受。",
        id: "batch1-source-rights",
        label: "來源權利與使用條件",
        nextStep: "A1 先完成 no-fetch coverage artifact；PM 只吸收彙總結論，不抓 raw market data。",
        publicMeaning: "資料可看之前，必須先知道能不能公開展示與如何標示來源。",
        status: "waiting"
      },
      {
        blocker: "TWII、ETF 與上市個股的欄位用途不同，不能混成同一個全市場資料承諾。",
        id: "batch1-field-contract",
        label: "欄位規格",
        nextStep: "分開確認 symbol、session date、close/level、change、source status、rights status。",
        publicMeaning: "欄位清楚後，畫面才能說清楚每個數字代表什麼。",
        status: "waiting"
      },
      {
        blocker: "缺漏日、補正、休市與更新延遲規則尚未成為正式公開規格。",
        id: "batch1-cadence-missing-rules",
        label: "更新與缺漏規則",
        nextStep: "定義更新時間、缺資料時的降級訊息，以及不顯示真實資料的 fail-closed 狀態。",
        publicMeaning: "使用者需要知道資料何時更新，以及資料不完整時該怎麼解讀。",
        status: "waiting"
      },
      {
        blocker: "readonly、write、rollback、promotion gate 尚未形成可公開資料升級閉環。",
        id: "batch1-runtime-gates",
        label: "升級安全線",
        nextStep: "先完成本地檢查與 one-attempt gate 包；未通過前公開頁維持 mock。",
        publicMeaning: "真實資料不會跳過檢查直接上線。",
        status: "blocked"
      }
    ],
    batch1UserSteps: [
      {
        id: "batch1-user-market-baseline",
        label: "先看大盤基準",
        message: "TWII 是最適合先讓使用者建立市場氛圍的基準，但目前仍是 mock 示範線。",
        nextStep: "完成 TWII 來源、欄位與覆蓋條件後，再決定是否開啟 bounded readonly gate。",
        status: "waiting"
      },
      {
        id: "batch1-user-core-etf",
        label: "再看核心 ETF",
        message: "0050 與 006208 可作為投資工具 proxy，但不能直接等同於指數、NAV 或持股資料。",
        nextStep: "等 ETF-specific source review 完成後，才可規劃真實 ETF 顯示。",
        status: "blocked"
      },
      {
        id: "batch1-user-data-boundary",
        label: "最後確認資料邊界",
        message: "公開 Beta 會清楚標示 mock、候選來源、覆蓋缺口與非投資建議，避免使用者誤讀。",
        nextStep: "通過來源、覆蓋、品質、回退與文案 gate 前，不升級真實資料或真實分數。",
        status: "blocked"
      }
    ],
    batches: [
      {
        currentState: "目前首頁、晨報與標的頁能展示產品流程、紅黃綠燈語言與資料邊界。",
        id: "batch-0-current-mock-showcase",
        label: "Batch 0：mock 示範儀表站",
        nextStep: "把每個 mock 訊號都維持清楚標示，避免像真實行情或投資建議。",
        publicValue: "使用者可以先理解產品如何幫忙閱讀市場氛圍。",
        tone: "active"
      },
      {
        currentState: "TWII 與核心 ETF 是最直覺的第一批真實資料候選，但仍缺來源與欄位確認。",
        id: "batch-1-twii-core-etf",
        label: "Batch 1：TWII + 核心 ETF",
        nextStep: "先收斂 no-fetch artifact，再決定是否進入 readonly gate。",
        publicValue: "讓使用者先從大盤與核心 proxy 看懂市場狀態。",
        tone: "hold"
      },
      {
        currentState: "2330、2382、2308 只能當示範錨點，不代表完整上市股票覆蓋。",
        id: "batch-2-major-listed-companies",
        label: "Batch 2：第一批上市個股",
        nextStep: "等待 universe rules、來源條件與非投資建議文案更穩定後再擴充。",
        publicValue: "幫助使用者理解標的頁閱讀方式，但不能變成選股建議。",
        tone: "hold"
      },
      {
        currentState: "產業與族群分類仍需要 taxonomy、成分規則與聚合權利確認。",
        id: "batch-3-sector-industry",
        label: "Batch 3：產業與族群",
        nextStep: "先保留為後續 roadmap，不放在第一階段真實資料依賴。",
        publicValue: "未來可解釋市場壓力是集中或擴散。",
        tone: "hold"
      },
      {
        currentState: "波動、資金流、均線與動能仍依賴底層資料與公式 gate。",
        id: "batch-4-advanced-indicators",
        label: "Batch 4：進階指標",
        nextStep: "先用 mock 解釋概念；真實計算等資料來源與公式都通過後再做。",
        publicValue: "未來可把市場氛圍轉成更完整的決策輔助。",
        tone: "blocked"
      }
    ],
    checklist: [
      {
        id: "coverage-sufficiency",
        label: "覆蓋率是否足夠",
        notYetClaimed: "尚未宣稱全市場覆蓋、完整台股覆蓋或即時資料。",
        publicWording: "目前只呈現示範覆蓋與候選資料線，完整覆蓋仍在補齊。",
        status: "waiting"
      },
      {
        id: "source-rights-accepted",
        label: "來源使用條件",
        notYetClaimed: "尚未宣稱所有來源都可公開、自動化、免費或可再散布。",
        publicWording: "來源條件確認前，真實資料不會進入公開頁。",
        status: "blocked"
      },
      {
        id: "supabase-readiness",
        label: "Supabase 後端準備",
        notYetClaimed: "尚未宣稱公開 runtime 已經改用 Supabase 真實資料。",
        publicWording: "後端仍在準備，公開頁先用 mock 維持穩定閱讀。",
        status: "waiting"
      },
      {
        id: "ingestion-backfill-repeatability",
        label: "資料更新可重跑",
        notYetClaimed: "尚未宣稱 ingestion 或 backfill 可正式重跑。",
        publicWording: "正式更新流程通過前，不把未審核資料放到畫面。",
        status: "waiting"
      },
      {
        id: "trust-legal-disclosure",
        label: "信任與法務揭露",
        notYetClaimed: "不宣稱保證報酬、買賣建議或完整即時資料。",
        publicWording: "本網站提供資訊整理與風險辨識，不提供投資建議。",
        status: "ready"
      }
    ],
    disclosure:
      "資料覆蓋率展開計畫只說明順序與邊界；任何真實資料、寫入、回補或分數升級都需要另外通過 gate。",
    headline: "資料覆蓋率展開計畫",
    readonlyGate: [
      {
        id: "readonly-purpose",
        label: "只讀診斷目的",
        publicStatus: "只讀診斷只用來確認資料庫可讀狀態與彙總覆蓋率，不代表可以寫入或上線。",
        publicMeaning: "它是安全檢查，不是資料升級本身。",
        requiredBeforeExecution: "需要明確命名的一次性 gate、可回報的彙總輸出、以及執行後 review。",
        status: "blocked"
      },
      {
        id: "aggregate-proof",
        label: "只有彙總證據",
        publicStatus: "目前只確認 182/360 的彙總覆蓋狀態；缺口仍包含 TWII 與 ETF。",
        publicMeaning: "彙總數字能說明進度，但不能替代 row 級資料驗證。",
        requiredBeforeExecution: "不得輸出 raw payload、row payload、stock id payload 或 secrets。",
        status: "ready"
      },
      {
        id: "write-promotion-lock",
        label: "寫入與升級鎖定",
        publicStatus: "寫入、回補與真實分數升級仍關閉。",
        publicMeaning: "公開頁不會因一次只讀診斷就切到真實資料。",
        requiredBeforeExecution: "需要 write path、rollback、quality、source promotion 與 score promotion 的獨立 gate。",
        status: "blocked"
      }
    ],
    summary:
      "CEO 建議先用 Batch 0 做公開 Beta 可用閉環，同步把 Batch 1 的 TWII/ETF 條件補齊；Batch 2 之後不阻塞目前上線準備。"
  };
}
