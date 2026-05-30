export type Cp3MockOnlyApprovalState = "not_ready";

export type Cp3MockOnlyDataQualityState = "partial" | "stale" | "unavailable";

export type Cp3MockOnlyFreshnessState = "stale" | "unknown";

export type Cp3MockOnlyRuntimeState = {
  assetType: "stock" | "etf" | "index";
  backtestApprovalState: Cp3MockOnlyApprovalState;
  claimApprovalState: Cp3MockOnlyApprovalState;
  contractState: "local_contract_only";
  dataQualityScore: number;
  dataQualityState: Cp3MockOnlyDataQualityState;
  disclosureApprovalState: Cp3MockOnlyApprovalState;
  freshnessState: Cp3MockOnlyFreshnessState;
  locale: "zh-TW";
  market: "tw";
  modelApprovalState: "candidate";
  modelVersion: string;
  scoreSource: "mock";
  sourceDepthState: Cp3MockOnlyApprovalState;
  sourceRightsState: Cp3MockOnlyApprovalState;
};

export type Cp3MockOnlyDisplayState = "mock" | "partial" | "stale" | "unavailable";

export type Cp3MockOnlyUiCopyToken = {
  claimLimit: string;
  disclosure: string;
  label: string;
  shortDescription: string;
};

export type Cp3MockOnlyUpgradeRequirement = {
  id: string;
  label: string;
  nextAction: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "Legal";
  sequence: number;
  state: Cp3MockOnlyApprovalState | "mock";
};

export type Cp3MockOnlyUpgradeVerdict = {
  label: string;
  reason: string;
  state: "blocked";
};

export type Cp3MockOnlyUpgradeProgress = {
  blockedCount: number;
  label: string;
  nextFocus: string;
  readyCount: number;
  totalCount: number;
};

export type Cp3MockOnlySourceDepthEvidenceItem = {
  acceptance: string;
  label: string;
  owner: "Data";
  state: Cp3MockOnlyApprovalState;
};

export type Cp3MockOnlySourceDepthEvidenceProgress = {
  blockedCount: number;
  label: string;
  nextFocus: string;
  readyCount: number;
  totalCount: number;
};

export type Cp3MockOnlyFastFollowGate = {
  gate: string;
  label: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "Legal";
  reason: string;
  state: "blocked";
};

export type Cp3MockOnlyRuntimeRouteDecision = {
  label: string;
  nextAction: string;
  reason: string;
  route: "local_mock_only_refinement";
  state: "blocked";
};

export type Cp3MockOnlyRuntimeRouteWorkItem = {
  acceptance: string;
  id: string;
  label: string;
  nextAction: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "Legal" | "PM";
  state: "blocked";
};

export type Cp3MockOnlyRuntimeRouteWorkProgress = {
  blockedCount: number;
  completeCount: number;
  label: string;
  nextFocus: string;
  totalCount: number;
};

export const cp3MockOnlyUiCopyTokens: Record<Cp3MockOnlyDisplayState, Cp3MockOnlyUiCopyToken> = {
  mock: {
    claimLimit: "目前只可作為產品體驗與閱讀流程示範，不能作為投資判斷、建議或績效保證。",
    disclosure: "分數來源仍是 mock；runtime 只使用本地雙層契約概念，不連外部資料庫、不讀取真實市場資料，也不表示來源深度已完成。",
    label: "Mock runtime",
    shortDescription: "這是 mock-only runtime 狀態，協助使用者理解畫面與資料邊界，尚未進入正式資料或公開宣稱階段。"
  },
  partial: {
    claimLimit: "部分資料條件尚未完整，所有解讀都必須保留折扣，不能升級為正式模型結論。",
    disclosure: "目前仍是 mock-only 狀態；資料品質為 partial，來源深度、權利與公開宣稱仍維持 not_ready。",
    label: "資料部分就緒",
    shortDescription: "部分欄位或驗證條件仍未齊備，畫面可用來檢查流程，但不能把分數視為可信訊號。"
  },
  stale: {
    claimLimit: "新鮮度未滿足前，不可把畫面解讀成即時、正式或可交易的資訊。",
    disclosure: "目前資料新鮮度為 stale；即使畫面可瀏覽，仍維持 mock-only 與 not_ready 邊界。",
    label: "資料新鮮度不足",
    shortDescription: "資料時間狀態需要更新或重新驗證，runtime 只能呈現保守提醒。"
  },
  unavailable: {
    claimLimit: "必要資料狀態不可用時，頁面不得暗示模型可信、資料完整或已完成審核。",
    disclosure: "目前缺少必要 runtime 狀態來源；畫面必須維持 mock-only disclosure，並等待後續 gate 補齊。",
    label: "資料狀態不可用",
    shortDescription: "runtime 缺少足夠資訊可安全分類，因此只能顯示不可用與待審核狀態。"
  }
};

export function getMockOnlyPublicDisplayState(state: Cp3MockOnlyRuntimeState): Cp3MockOnlyDisplayState {
  if (state.dataQualityState === "unavailable") return "unavailable";
  if (state.dataQualityState === "stale") return "stale";
  if (state.dataQualityState === "partial" && state.freshnessState === "unknown") return "partial";

  return "mock";
}

export function getMockOnlyRuntimeUpgradeRequirements(
  state: Cp3MockOnlyRuntimeState
): Cp3MockOnlyUpgradeRequirement[] {
  const requirements: Cp3MockOnlyUpgradeRequirement[] = [
    {
      id: "score-source",
      label: "正式分數來源",
      nextAction: "完成真實分數口徑與投資宣稱審核",
      owner: "Investment",
      sequence: 4,
      state: state.scoreSource
    },
    {
      id: "source-depth",
      label: "來源深度",
      nextAction: "補齊來源深度證據與資料覆蓋率",
      owner: "Data",
      sequence: 1,
      state: state.sourceDepthState
    },
    {
      id: "source-rights",
      label: "來源權利",
      nextAction: "確認資料授權、保存目的與公開揭露限制",
      owner: "Legal",
      sequence: 2,
      state: state.sourceRightsState
    },
    {
      id: "backtest",
      label: "回測審核",
      nextAction: "完成回測方法、品質降級與可重跑證據",
      owner: "Engineering",
      sequence: 3,
      state: state.backtestApprovalState
    },
    {
      id: "public-claim",
      label: "公開宣稱",
      nextAction: "彙整角色意見並核准是否可公開表述",
      owner: "CEO",
      sequence: 5,
      state: state.claimApprovalState
    }
  ];

  return requirements.sort((a, b) => a.sequence - b.sequence);
}

export function getMockOnlyRuntimeUpgradeVerdict(state: Cp3MockOnlyRuntimeState): Cp3MockOnlyUpgradeVerdict {
  const requirements = getMockOnlyRuntimeUpgradeRequirements(state);
  const unexpectedRequirementCount = requirements.filter(
    (requirement) => requirement.state !== "mock" && requirement.state !== "not_ready"
  ).length;

  if (unexpectedRequirementCount > 0) {
    return {
      label: "禁止自動升級",
      reason: "仍存在非正式 runtime 狀態，必須回到 CEO/PM gate 重新檢查。",
      state: "blocked"
    };
  }

  return {
    label: "禁止自動升級",
    reason: "所有升級前置條件仍是 mock 或 not_ready；CP3 必須維持 mock-only。",
    state: "blocked"
  };
}

export function getMockOnlyRuntimeUpgradeProgress(state: Cp3MockOnlyRuntimeState): Cp3MockOnlyUpgradeProgress {
  const requirements = getMockOnlyRuntimeUpgradeRequirements(state);
  const nextBlockedRequirement = requirements.find(
    (requirement) => requirement.state === "mock" || requirement.state === "not_ready"
  );
  const blockedCount = requirements.filter(
    (requirement) => requirement.state === "mock" || requirement.state === "not_ready"
  ).length;
  const readyCount = requirements.length - blockedCount;

  return {
    blockedCount,
    label: `已就緒 ${readyCount} / ${requirements.length}；待解除 ${blockedCount}`,
    nextFocus: nextBlockedRequirement
      ? `下一個解除重點：${nextBlockedRequirement.owner} / ${nextBlockedRequirement.label}`
      : "下一個解除重點：等待 CEO 最終核准",
    readyCount,
    totalCount: requirements.length
  };
}

export function getMockOnlySourceDepthEvidenceItems(): Cp3MockOnlySourceDepthEvidenceItem[] {
  return [
    {
      acceptance: "列出目標市場、資產類型、資料頻率與缺漏比例",
      label: "來源覆蓋率",
      owner: "Data",
      state: "not_ready"
    },
    {
      acceptance: "標明可用起訖日、交易日缺口與補洞策略",
      label: "歷史期間完整度",
      owner: "Data",
      state: "not_ready"
    },
    {
      acceptance: "定義每個欄位來源、轉換規則與不可轉換欄位",
      label: "欄位血緣與轉換規則",
      owner: "Data",
      state: "not_ready"
    },
    {
      acceptance: "證明連續更新規則、延遲容忍與 stale 判斷",
      label: "新鮮度連續性",
      owner: "Data",
      state: "not_ready"
    },
    {
      acceptance: "定義異常值、停牌、缺價與重跑後處理規則",
      label: "異常與缺口處理規則",
      owner: "Data",
      state: "not_ready"
    }
  ];
}

export function getMockOnlySourceDepthEvidenceProgress(): Cp3MockOnlySourceDepthEvidenceProgress {
  const evidenceItems = getMockOnlySourceDepthEvidenceItems();
  const blockedCount = evidenceItems.filter((item) => item.state === "not_ready").length;
  const readyCount = evidenceItems.length - blockedCount;
  const nextBlockedItem = evidenceItems.find((item) => item.state === "not_ready");

  return {
    blockedCount,
    label: `來源深度驗收 ${readyCount} / ${evidenceItems.length}；待補 ${blockedCount}`,
    nextFocus: nextBlockedItem ? `下一個待補：${nextBlockedItem.label}` : "來源深度驗收項目已可進入人工審核",
    readyCount,
    totalCount: evidenceItems.length
  };
}

export function getMockOnlyFastFollowGates(): Cp3MockOnlyFastFollowGate[] {
  return [
    {
      gate: "source-depth-evidence",
      label: "來源深度證據",
      owner: "Data",
      reason: "需補齊覆蓋率、期間、欄位血緣、新鮮度與異常處理證據",
      state: "blocked"
    },
    {
      gate: "source-rights-review",
      label: "來源權利審核",
      owner: "Legal",
      reason: "需確認資料保存、再散布、公開揭露與商用限制",
      state: "blocked"
    },
    {
      gate: "supabase-readonly-validation",
      label: "Supabase 唯讀驗證",
      owner: "Engineering",
      reason: "需 CEO 開啟單次唯讀驗證窗口，且不得寫入資料列",
      state: "blocked"
    },
    {
      gate: "score-source-transition",
      label: "正式分數切換",
      owner: "Investment",
      reason: "需完成真實資料、模型、回測、法務與投資宣稱審核",
      state: "blocked"
    },
    {
      gate: "public-claim-release",
      label: "公開宣稱發布",
      owner: "CEO",
      reason: "需完成角色覆核與董事長授權邊界確認",
      state: "blocked"
    }
  ];
}

export function getMockOnlyRuntimeRouteDecision(
  state: Cp3MockOnlyRuntimeState
): Cp3MockOnlyRuntimeRouteDecision {
  if (state.scoreSource === "mock" && state.sourceDepthState === "not_ready") {
    return {
      label: "下一步：本地 mock-only refinement",
      nextAction: "優先強化本地 runtime 顯示、靜態 guard 與審核路線；外部資料動作維持 gated。",
      reason: "來源深度、來源權利、回測、公開宣稱與正式分數切換條件尚未解除。",
      route: "local_mock_only_refinement",
      state: "blocked"
    };
  }

  return {
    label: "下一步：本地 mock-only refinement",
    nextAction: "停止升級並交回 CEO/PM gate 重新判斷。",
    reason: "runtime 狀態出現非預期組合，不能自動升級。",
    route: "local_mock_only_refinement",
    state: "blocked"
  };
}

export function getMockOnlyRuntimeRouteWorkQueue(): Cp3MockOnlyRuntimeRouteWorkItem[] {
  return [
    {
      acceptance: "畫面、copy 與靜態 gate 都保留 mock-only / not_ready / blocked 語意",
      id: "local-runtime-copy-review",
      label: "本地 runtime 文案確認",
      nextAction: "確認 mock-only、not_ready、gated fast-follow 文案一致",
      owner: "PM",
      state: "blocked"
    },
    {
      acceptance: "五項來源深度證據只建立草稿與缺口，不貼入真實市場資料",
      id: "source-depth-evidence-prep",
      label: "來源深度證據準備",
      nextAction: "補齊五項來源深度驗收證據草稿，仍不接真實資料",
      owner: "Data",
      state: "blocked"
    },
    {
      acceptance: "唯讀驗證指令、環境與停止條件整理完成，但不連線執行",
      id: "readonly-validation-window",
      label: "唯讀驗證窗口準備",
      nextAction: "準備單次唯讀驗證前置檢查，尚不執行遠端連線",
      owner: "Engineering",
      state: "blocked"
    },
    {
      acceptance: "授權、保存、再散布與公開揭露問題已整理成董事長可口頭審核項目",
      id: "rights-review-question",
      label: "來源權利問題整理",
      nextAction: "整理授權、保存、再散布與公開揭露待答問題",
      owner: "Legal",
      state: "blocked"
    },
    {
      acceptance: "公開宣稱仍停在 mock-only，不含正式分數、投資建議或績效暗示",
      id: "claim-boundary-review",
      label: "宣稱邊界覆核",
      nextAction: "確認公開文案仍不得使用正式分數或投資宣稱",
      owner: "CEO",
      state: "blocked"
    }
  ];
}

export function getMockOnlyRuntimeRouteWorkProgress(): Cp3MockOnlyRuntimeRouteWorkProgress {
  const workItems = getMockOnlyRuntimeRouteWorkQueue();
  const blockedCount = workItems.filter((item) => item.state === "blocked").length;
  const completeCount = workItems.length - blockedCount;
  const nextBlockedItem = workItems.find((item) => item.state === "blocked");

  return {
    blockedCount,
    completeCount,
    label: `PM route work ${completeCount} / ${workItems.length} complete; blocked ${blockedCount}`,
    nextFocus: nextBlockedItem
      ? `下一個本地工作：${nextBlockedItem.owner} / ${nextBlockedItem.label}`
      : "PM route work 全部完成後仍需 CEO 另行開 gate",
    totalCount: workItems.length
  };
}
