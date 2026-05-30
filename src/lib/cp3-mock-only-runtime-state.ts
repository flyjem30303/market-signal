export type Cp3MockOnlyApprovalState = "not_ready";

export type Cp3MockOnlyDataQualityState = "partial" | "stale" | "unavailable";

export type Cp3MockOnlyFreshnessState = "stale" | "unknown";

export type Cp3MockOnlyMetadataReachabilityState = "mock_metadata" | "supabase_metadata_reachable";

export type Cp3MockOnlySchemaShapeState = "schema_shape_local_only" | "schema_shape_checked_not_quality";

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
  metadataReachabilityState: Cp3MockOnlyMetadataReachabilityState;
  modelApprovalState: "candidate";
  modelVersion: string;
  schemaShapeState: Cp3MockOnlySchemaShapeState;
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

export type Cp3MockOnlyRuntimeMetadataDisclosure = {
  label: string;
  note: string;
  state: Cp3MockOnlyMetadataReachabilityState;
};

export type Cp3MockOnlyRuntimeSchemaShapeDisclosure = {
  label: string;
  note: string;
  state: Cp3MockOnlySchemaShapeState;
};

export type Cp3MockOnlyRuntimeDataQualityDisclosure = {
  label: string;
  note: string;
  state: Cp3MockOnlyDataQualityState;
};

export type Cp3MockOnlyRuntimeReadinessTriadItem = {
  id: "metadata" | "schema_shape" | "data_quality";
  interpretation: string;
  label: string;
  nextGate: string;
  state: "blocked";
};

export type Cp3MockOnlyMetadataQualitySeparationGuard = {
  allowedClaims: string[];
  blockedClaims: string[];
  label: string;
  nextGate: string;
  owner: "PM";
  state: "blocked";
};

export type Cp3MockOnlySchemaContractGuard = {
  allowedClaims: string[];
  blockedClaims: string[];
  label: string;
  nextGate: string;
  owner: "Engineering";
  state: "blocked";
};

export type Cp3MockOnlyDataQualityRoleReviewGuard = {
  allowedClaims: string[];
  blockedClaims: string[];
  label: string;
  nextGate: string;
  owner: "Data" | "Investment";
  state: "blocked";
};

export type Cp3MockOnlyRuntimeNextGate = {
  acceptance: string;
  id: "metadata-quality-separation" | "schema-contract-alignment" | "data-quality-role-review";
  label: string;
  owner: "Data" | "Engineering" | "Investment" | "PM";
  reason: string;
  sequence: number;
  state: "blocked";
};

export type Cp3MockOnlyRuntimeAuthorizationStatus = "allowed" | "blocked";

export type Cp3MockOnlyRuntimeAuthorizationItem = {
  id:
    | "local-mock-runtime-ui"
    | "local-static-guards"
    | "supabase-readonly"
    | "sql-execution"
    | "market-data"
    | "formal-score-transition"
    | "public-claims";
  label: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "Legal" | "PM";
  reason: string;
  status: Cp3MockOnlyRuntimeAuthorizationStatus;
};

export type Cp3MockOnlyRuntimeAuthorizationSnapshot = {
  allowedCount: number;
  blockedCount: number;
  items: Cp3MockOnlyRuntimeAuthorizationItem[];
  label: string;
  nextAction: string;
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

export function getMockOnlyRuntimeMetadataDisclosure(
  state: Cp3MockOnlyRuntimeState
): Cp3MockOnlyRuntimeMetadataDisclosure {
  if (state.metadataReachabilityState === "supabase_metadata_reachable") {
    return {
      label: "Supabase metadata 可達",
      note: "這只代表 freshness metadata 可讀；不代表資料品質已核准、來源深度已完成或正式分數切換已通過。",
      state: state.metadataReachabilityState
    };
  }

  return {
    label: "模擬 metadata",
    note: "目前仍使用本地 mock freshness；runtime 只能呈現產品流程與邊界。",
    state: state.metadataReachabilityState
  };
}

export function getMockOnlyRuntimeSchemaShapeDisclosure(
  state: Cp3MockOnlyRuntimeState
): Cp3MockOnlyRuntimeSchemaShapeDisclosure {
  if (state.schemaShapeState === "schema_shape_checked_not_quality") {
    return {
      label: "Schema shape 已有窄證據",
      note: "這只代表物件與欄位形狀已有窄範圍證據；不代表 row completeness、historical depth、source rights、資料品質或正式分數可使用。",
      state: state.schemaShapeState
    };
  }

  return {
    label: "Schema shape 僅本地契約",
    note: "目前只可依本地 contract 呈現 UI；未形成遠端 schema shape 依賴。",
    state: state.schemaShapeState
  };
}

export function getMockOnlyRuntimeDataQualityDisclosure(
  state: Cp3MockOnlyRuntimeState
): Cp3MockOnlyRuntimeDataQualityDisclosure {
  if (state.dataQualityState === "partial") {
    return {
      label: "資料品質折扣：partial",
      note: "部分資料條件缺口仍需降級解讀；不得把 UI 分數或模組文字視為正式模型結論。",
      state: state.dataQualityState
    };
  }

  if (state.dataQualityState === "stale") {
    return {
      label: "資料品質折扣：stale",
      note: "資料時間狀態不足，所有呈現只能作為延遲或待更新提醒，不可暗示即時可用。",
      state: state.dataQualityState
    };
  }

  return {
    label: "資料品質折扣：unavailable",
    note: "必要資料品質條件不可用；runtime 必須維持 mock-only，且不得形成正式分數或公開宣稱。",
    state: state.dataQualityState
  };
}

export function getMockOnlyRuntimeReadinessTriad(state: Cp3MockOnlyRuntimeState): Cp3MockOnlyRuntimeReadinessTriadItem[] {
  return [
    {
      id: "metadata",
      interpretation:
        state.metadataReachabilityState === "supabase_metadata_reachable"
          ? "metadata 可讀，但不能推論市場資料品質或正式分數"
          : "metadata 仍使用 mock，僅能展示流程",
      label: "Metadata reachability",
      nextGate: "維持 freshness metadata 與資料品質 gate 分離",
      state: "blocked"
    },
    {
      id: "schema_shape",
      interpretation:
        state.schemaShapeState === "schema_shape_checked_not_quality"
          ? "schema shape 有窄證據，但不能推論 row completeness 或 source rights"
          : "schema shape 仍依本地契約呈現",
      label: "Schema shape",
      nextGate: "完成遠端物件 contract 對齊後仍需資料品質與權利覆核",
      state: "blocked"
    },
    {
      id: "data_quality",
      interpretation: `資料品質目前是 ${state.dataQualityState}；所有分數仍需折扣解讀`,
      label: "Data quality downgrade",
      nextGate: "完成資料品質矩陣、來源深度、回測與投資宣稱覆核",
      state: "blocked"
    }
  ];
}

export function getMockOnlyMetadataQualitySeparationGuard(
  state: Cp3MockOnlyRuntimeState
): Cp3MockOnlyMetadataQualitySeparationGuard {
  const isMetadataReachable = state.metadataReachabilityState === "supabase_metadata_reachable";

  return {
    allowedClaims: [
      isMetadataReachable
        ? "可說 freshness metadata 已由既有唯讀 runtime path 讀到"
        : "可說 freshness metadata 目前仍由 mock fallback 呈現",
      "可說資料品質仍需另走資料品質矩陣、來源深度與角色覆核",
      "可說分數、模型文字與公開宣稱仍維持折扣解讀"
    ],
    blockedClaims: [
      "不可說 metadata 可讀代表市場資料正確、完整或即時",
      "不可說 metadata 可讀代表資料品質核准、來源權利完成或回測成立",
      "不可說 metadata 可讀代表正式分數或投資宣稱可切換"
    ],
    label: "Metadata / quality guard",
    nextGate: "PM 維持 UI copy、guard 與角色語言一致；Data 另行補資料品質證據。",
    owner: "PM",
    state: "blocked"
  };
}

export function getMockOnlySchemaContractGuard(state: Cp3MockOnlyRuntimeState): Cp3MockOnlySchemaContractGuard {
  const isSchemaShapeChecked = state.schemaShapeState === "schema_shape_checked_not_quality";

  return {
    allowedClaims: [
      isSchemaShapeChecked
        ? "可說 schema shape 已有窄範圍物件與欄位形狀證據"
        : "可說 schema shape 目前仍只依本地 contract 呈現",
      "可說 schema contract 只支援 UI 邊界揭露與未來 validator 對齊",
      "可說資料品質、來源權利、歷史深度與模型可信度仍需獨立 gate"
    ],
    blockedClaims: [
      "不可說 schema shape 代表 row completeness、historical depth 或連續更新已成立",
      "不可說 schema shape 代表 source rights、redistribution 或公開揭露限制已完成",
      "不可說 schema shape 代表資料品質、正式分數或投資宣稱可切換"
    ],
    label: "Schema contract guard",
    nextGate: "Engineering 維持 schema shape 與 row/data/source gates 分離；Data 與 Legal 另行補證據。",
    owner: "Engineering",
    state: "blocked"
  };
}

export function getMockOnlyDataQualityRoleReviewGuard(
  state: Cp3MockOnlyRuntimeState
): Cp3MockOnlyDataQualityRoleReviewGuard {
  const owner = state.dataQualityState === "unavailable" ? "Data" : "Investment";

  return {
    allowedClaims: [
      `可說資料品質目前是 ${state.dataQualityState}，且所有分數必須折扣解讀`,
      "可說 Data 需補齊資料品質矩陣、來源深度、缺口處理與新鮮度證據",
      "可說 Investment 需確認折扣後的模型文字不得形成正式投資結論"
    ],
    blockedClaims: [
      "不可說 partial、stale 或 unavailable 仍可支援正式分數",
      "不可說資料品質折扣代表模型可信、回測成立或公開宣稱可發布",
      "不可說資料品質角色覆核可取代來源權利、schema、回測或董事長授權"
    ],
    label: "Data quality role review guard",
    nextGate: "Data 與 Investment 需共同確認折扣規則；完成前 runtime 只可顯示保守解讀。",
    owner,
    state: "blocked"
  };
}

export function getMockOnlyRuntimeNextGates(state: Cp3MockOnlyRuntimeState): Cp3MockOnlyRuntimeNextGate[] {
  return [
    {
      acceptance:
        state.metadataReachabilityState === "supabase_metadata_reachable"
          ? "UI 與 guard 持續宣告 freshness metadata 可讀不等於資料品質核准"
          : "mock metadata 仍不得被描述成遠端可讀",
      id: "metadata-quality-separation",
      label: "Metadata / quality 分離",
      owner: "PM",
      reason: "先固定使用者與角色如何解讀 metadata reachability，避免後續被誤當成資料品質證據。",
      sequence: 1,
      state: "blocked"
    },
    {
      acceptance:
        state.schemaShapeState === "schema_shape_checked_not_quality"
          ? "遠端物件 contract 對齊後仍保留 no row completeness / no rights approval 邊界"
          : "本地 schema contract 不得被描述成遠端 shape 已驗證",
      id: "schema-contract-alignment",
      label: "Schema contract 對齊",
      owner: "Engineering",
      reason: "schema shape 窄證據必須轉成明確 contract，且不能自動推論資料完整或權利。",
      sequence: 2,
      state: "blocked"
    },
    {
      acceptance: "資料品質矩陣完成角色覆核前，所有分數與模組文字都維持折扣解讀",
      id: "data-quality-role-review",
      label: "資料品質角色覆核",
      owner: state.dataQualityState === "unavailable" ? "Data" : "Investment",
      reason: "資料品質降級規則要由 Data 與 Investment 能共同解釋，才能進一步討論正式分數。",
      sequence: 3,
      state: "blocked"
    }
  ];
}

export function getMockOnlyRuntimeAuthorizationSnapshot(): Cp3MockOnlyRuntimeAuthorizationSnapshot {
  const items: Cp3MockOnlyRuntimeAuthorizationItem[] = [
    {
      id: "local-mock-runtime-ui",
      label: "本地 mock runtime UI",
      owner: "PM",
      reason: "可繼續整理本地 runtime 顯示、資訊階層與 mock-only 邊界揭露。",
      status: "allowed"
    },
    {
      id: "local-static-guards",
      label: "本地靜態 guard",
      owner: "Engineering",
      reason: "可繼續強化靜態檢查，確保 public runtime 不引入外部資料或正式分數。",
      status: "allowed"
    },
    {
      id: "supabase-readonly",
      label: "Supabase 唯讀驗證",
      owner: "Engineering",
      reason: "需另開單次唯讀驗證窗口；本切片不連線、不驗證遠端。",
      status: "blocked"
    },
    {
      id: "sql-execution",
      label: "SQL 執行",
      owner: "Engineering",
      reason: "需在唯讀驗證與停止條件完成後另行開 gate。",
      status: "blocked"
    },
    {
      id: "market-data",
      label: "真實市場資料",
      owner: "Data",
      reason: "需來源深度、權利、品質與重跑規則完成後才可進入資料動作。",
      status: "blocked"
    },
    {
      id: "formal-score-transition",
      label: "正式分數切換",
      owner: "Investment",
      reason: "需真實資料、回測、模型、法務與投資宣稱覆核全部完成。",
      status: "blocked"
    },
    {
      id: "public-claims",
      label: "公開宣稱",
      owner: "CEO",
      reason: "需董事長授權邊界、法務、投資與 QA 結論收斂後才可發布。",
      status: "blocked"
    }
  ];
  const allowedCount = items.filter((item) => item.status === "allowed").length;
  const blockedCount = items.length - allowedCount;

  return {
    allowedCount,
    blockedCount,
    items,
    label: `Runtime authorization ${allowedCount} allowed / ${blockedCount} blocked`,
    nextAction: "PM 繼續本地 mock-only runtime 實作；CEO 另行決定何時開 Supabase、SQL、真實資料與正式分數 gate。",
    totalCount: items.length
  };
}
