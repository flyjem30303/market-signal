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
    disclosure: "目前公開頁使用示範資料呈現產品體驗；正式資料尚未啟用，也不提供買賣建議。",
    headline: "資料上線路線",
    stages: [
      {
        currentState: "首頁、晨報、週報與標的頁已能用示範資料呈現完整閱讀流程。",
        id: "coverage-universe",
        label: "覆蓋範圍",
        nextStep: "先補齊大盤指數與核心 ETF，再分批擴充上市公司與產業分類。",
        publicMeaning: "使用者會逐步看到更完整的市場範圍，而不是只看到少數示範標的。",
        tone: "active"
      },
      {
        currentState: "資料線正在確認合法免費可自動化來源、引用條件與欄位定義。",
        id: "source-rights",
        label: "資料來源",
        nextStep: "確認來源可用條件後，才把資料接入正式流程。",
        publicMeaning: "正式資料必須能清楚說明來源、更新頻率與使用限制。",
        tone: "hold"
      },
      {
        currentState: "後端資料庫已作為未來資料儲存候選，但公開頁尚未切換到正式資料。",
        id: "backend-readiness",
        label: "後端準備",
        nextStep: "完成讀取、寫入、回退與錯誤提示流程後，再評估正式啟用。",
        publicMeaning: "使用者不需要知道內部技術細節，只需要知道資料是否正式、何時更新、是否完整。",
        tone: "hold"
      },
      {
        currentState: "資料匯入與補齊流程仍在設計與測試。",
        id: "ingestion-backfill",
        label: "資料補齊",
        nextStep: "建立可重複、可追溯、可回退的每日資料流程。",
        publicMeaning: "正式上線後，資料缺口與更新失敗都必須能被清楚標示。",
        tone: "blocked"
      },
      {
        currentState: "公開頁仍使用示範分數。",
        id: "runtime-release",
        label: "正式啟用",
        nextStep: "來源、覆蓋、品質、回退與公開文案都通過後，才會切換正式資料與正式分數。",
        publicMeaning: "正式資料啟用時，使用者會看到清楚的資料狀態，而不是模糊宣稱。",
        tone: "blocked"
      }
    ],
    summary:
      "CEO/PM 主線維持產品可理解性與公開信任；A1 資料線持續補來源與覆蓋；A2 支援公開文案與風險邊界。"
  };
}

export function getPublicBetaCoverageRolloutPlan(): PublicBetaCoverageRolloutPlan {
  return {
    batch1Readiness: [
      {
        blocker: "核心資料來源與欄位定義仍需確認。",
        id: "batch1-source",
        label: "來源確認",
        nextStep: "整理來源條款、引用方式與每日資料欄位。",
        publicMeaning: "正式資料上線前，使用者要能知道資料從哪裡來。",
        status: "waiting"
      },
      {
        blocker: "核心標的欄位需要一致定義。",
        id: "batch1-field-contract",
        label: "欄位一致",
        nextStep: "確認日期、收盤價、漲跌、來源狀態與更新時間。",
        publicMeaning: "欄位一致才能避免分數與說明互相矛盾。",
        status: "waiting"
      },
      {
        blocker: "資料缺口與更新失敗需要清楚標示。",
        id: "batch1-fallback",
        label: "錯誤回退",
        nextStep: "定義資料缺口、延遲與更新失敗時的公開提示。",
        publicMeaning: "使用者需要知道何時應該保守解讀。",
        status: "waiting"
      }
    ],
    batch1UserSteps: [
      {
        id: "market-baseline",
        label: "先看大盤",
        message: "大盤指數是 30 秒市場氣氛的核心入口。",
        nextStep: "先完成大盤指數正式資料條件。",
        status: "waiting"
      },
      {
        id: "core-etf",
        label: "再看核心 ETF",
        message: "ETF 可用來確認市場氣氛是否擴散。",
        nextStep: "確認 ETF 資料來源與欄位後，再接入正式流程。",
        status: "blocked"
      },
      {
        id: "listed-equity",
        label: "最後擴充上市公司",
        message: "上市公司覆蓋量大，需要分批建立資料品質與分類規則。",
        nextStep: "先建立 universe 規則，再逐批補齊。",
        status: "blocked"
      }
    ],
    batches: [
      {
        currentState: "目前以示範標的展示市場狀態儀表站。",
        id: "batch-0",
        label: "Batch 0：示範閱讀流程",
        nextStep: "持續移除公開頁內部字樣，讓使用者看得懂。",
        publicValue: "使用者可先體驗首頁、晨報、週報與標的頁的閱讀順序。",
        tone: "active"
      },
      {
        currentState: "大盤指數與核心 ETF 是第一批正式資料候選。",
        id: "batch-1",
        label: "Batch 1：大盤與核心 ETF",
        nextStep: "完成來源條件、欄位定義、覆蓋率與更新頻率。",
        publicValue: "支撐每日市場氣氛與 3 分鐘行動判斷。",
        tone: "hold"
      },
      {
        currentState: "上市公司資料會分批擴充。",
        id: "batch-2",
        label: "Batch 2：主要上市公司",
        nextStep: "建立分類、覆蓋規則與缺口提示。",
        publicValue: "讓使用者從大盤延伸到主要標的與產業觀察。",
        tone: "hold"
      },
      {
        currentState: "進階指標需等待資料穩定後再實裝。",
        id: "batch-3",
        label: "Batch 3：進階指標",
        nextStep: "在正式資料穩定後加入波動、資金、乖離與動能等指標。",
        publicValue: "提升進階使用者的決策輔助深度。",
        tone: "blocked"
      }
    ],
    checklist: [
      {
        id: "coverage",
        label: "覆蓋率足夠",
        notYetClaimed: "尚未宣稱完整市場覆蓋。",
        publicWording: "目前仍是公開 Beta 示範覆蓋，正式資料會另行標示。",
        status: "waiting"
      },
      {
        id: "source",
        label: "來源條件明確",
        notYetClaimed: "尚未宣稱所有來源都可正式公開使用。",
        publicWording: "資料來源仍在確認，可用條件通過後才會正式啟用。",
        status: "blocked"
      },
      {
        id: "backend",
        label: "後端流程準備",
        notYetClaimed: "尚未宣稱公開頁已使用正式後端資料。",
        publicWording: "後端資料流程仍在驗證，公開頁維持示範狀態。",
        status: "waiting"
      },
      {
        id: "public-trust",
        label: "公開信任與風險說明",
        notYetClaimed: "不宣稱投資建議或保證報酬。",
        publicWording: "本站提供資訊整理與風險辨識，不提供個別投資建議。",
        status: "ready"
      }
    ],
    disclosure: "資料覆蓋會分批上線；每一批都要先確認來源、欄位、品質、更新與公開說明。",
    headline: "資料覆蓋推進計畫",
    readonlyGate: [
      {
        id: "purpose",
        label: "目的清楚",
        publicStatus: "只用來確認資料是否可讀與可整理。",
        publicMeaning: "這不是正式資料啟用，也不是交易訊號。",
        requiredBeforeExecution: "需要明確範圍、輸出欄位與執行後覆核。",
        status: "waiting"
      },
      {
        id: "safe-output",
        label: "輸出安全",
        publicStatus: "只輸出整理後摘要。",
        publicMeaning: "公開頁不顯示內部處理資料或機密內容。",
        requiredBeforeExecution: "不得輸出不該公開的資料內容。",
        status: "ready"
      },
      {
        id: "release-lock",
        label: "正式啟用鎖定",
        publicStatus: "正式資料與正式分數尚未啟用。",
        publicMeaning: "使用者看到的仍是示範閱讀流程。",
        requiredBeforeExecution: "需要資料來源、品質、回退與公開說明都通過。",
        status: "blocked"
      }
    ],
    summary:
      "目前先維持 Batch 0 產品體驗可讀，並把 Batch 1 的大盤與核心 ETF 資料條件補齊；上市公司與進階指標後續分批推進。"
  };
}
