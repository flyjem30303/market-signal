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

export type Cp3MockOnlySourceDepthEvidenceProgress = Cp3MockOnlyUpgradeProgress;

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

export type Cp3MockOnlyRuntimeRoleAction = {
  action: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "Legal" | "PM";
  state: Cp3MockOnlyRuntimeAuthorizationStatus;
};

export type Cp3MockOnlyRuntimeHandoffCheck = {
  label: string;
  state: "recorded";
};

export type Cp3MockOnlyRuntimeMilestone = {
  label: string;
  note: string;
  owner: "CEO" | "Engineering" | "PM";
  state: "active" | "blocked" | "done";
};

export type Cp3MockOnlyRuntimeExecutionLane = {
  boundary: string;
  label: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "Legal" | "PM";
  state: "active" | "blocked";
  work: string;
};

export type Cp3MockOnlyExternalReadinessCheck = {
  criterion: string;
  label: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "Legal";
  state: "blocked";
};

export type Cp3MockOnlyGateProposalItem = {
  boundary: string;
  label: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "Legal" | "PM";
  sequence: number;
  state: "draft";
};

export type Cp3MockOnlyGateProposalProgress = {
  blockedExecutionLabel: string;
  draftCount: number;
  label: string;
  nextDraftLabel: string;
  totalCount: number;
};

export type Cp3MockOnlyRuntimeCommandCenter = {
  blockedLaneLabel: string;
  doNext: string;
  doNotDo: string;
  doNow: string;
  evidenceLevel: "mock_local_only";
  executionState: "active_local_only";
  executionLanes: Cp3MockOnlyRuntimeExecutionLane[];
  externalReadinessChecks: Cp3MockOnlyExternalReadinessCheck[];
  gateProposalProgress: Cp3MockOnlyGateProposalProgress;
  gateProposalQueue: Cp3MockOnlyGateProposalItem[];
  gateProposalQueueLabel: string;
  handoffChecks: Cp3MockOnlyRuntimeHandoffCheck[];
  localLaneLabel: string;
  milestones: Cp3MockOnlyRuntimeMilestone[];
  nextGateLabel: string;
  nextWorkLabel: string;
  operatingMode: "local_mock_only";
  priorityLabel: string;
  reviewCadence: string;
  riskLabel: string;
  roleActions: Cp3MockOnlyRuntimeRoleAction[];
  stopCondition: string;
  summary: string;
};

export const cp3MockOnlyUiCopyTokens: Record<Cp3MockOnlyDisplayState, Cp3MockOnlyUiCopyToken> = {
  mock: {
    claimLimit: "只能說明目前是 mock 訊號體驗，不能宣稱正式分數、投資建議或真實市場資料已完成。",
    disclosure: "目前前台仍使用 mock 訊號。即使部分 freshness metadata 可讀，也不代表資料品質、來源深度或模型分數已正式核准。",
    label: "Mock runtime",
    shortDescription: "本區塊只顯示本地 mock-only runtime 狀態，協助 CEO/PM 看清楚哪些路徑可做、哪些仍需另外授權。"
  },
  partial: {
    claimLimit: "可以呈現資料不完整狀態，但不能把 partial 解讀為可投資或可發布的正式訊號。",
    disclosure: "資料狀態為 partial。這只是 runtime 降級標記，來源深度、權利、回測與公開宣稱仍是 not_ready。",
    label: "資料部分可用",
    shortDescription: "有些 metadata 或本地資料可用，但仍不足以支撐真實分數或公開市場判斷。"
  },
  stale: {
    claimLimit: "可以提醒資料過期，但不能用 stale 資料支撐正式訊號、回測結論或公開建議。",
    disclosure: "資料狀態為 stale。系統必須降級顯示並維持 mock-only 邊界。",
    label: "資料過期",
    shortDescription: "runtime 偵測到資料時間落後，所有正式資料與分數轉換仍需停在 gate 前。"
  },
  unavailable: {
    claimLimit: "不能展示正式資料推論，僅能顯示 mock-only 與不可用狀態。",
    disclosure: "資料狀態不可用。前台必須維持 mock-only 說明，並避免使用者誤認為正式市場訊號。",
    label: "資料不可用",
    shortDescription: "runtime 沒有足夠資料可支撐正式解讀，必須停在本地 mock-only 模式。"
  }
};

export function getMockOnlyPublicDisplayState(state: Cp3MockOnlyRuntimeState): Cp3MockOnlyDisplayState {
  if (state.dataQualityState === "unavailable") return "unavailable";
  if (state.dataQualityState === "stale") return "stale";
  if (state.dataQualityState === "partial") return "partial";

  return "mock";
}

export function getMockOnlyRuntimeUpgradeRequirements(
  state: Cp3MockOnlyRuntimeState
): Cp3MockOnlyUpgradeRequirement[] {
  return [
    {
      id: "source-depth",
      label: "來源深度",
      nextAction: "補齊資料來源、欄位、更新頻率、缺漏與降級規則。",
      owner: "Data",
      sequence: 1,
      state: state.sourceDepthState
    },
    {
      id: "source-rights",
      label: "來源權利",
      nextAction: "確認資料使用、公開展示、再散布與商用限制。",
      owner: "Legal",
      sequence: 2,
      state: state.sourceRightsState
    },
    {
      id: "backtest",
      label: "回測可信度",
      nextAction: "建立可重跑、可解釋、可降級的回測檢查。",
      owner: "Engineering",
      sequence: 3,
      state: state.backtestApprovalState
    },
    {
      id: "score-source",
      label: "分數來源",
      nextAction: "投資角色確認模型證據前，scoreSource 必須維持 mock。",
      owner: "Investment",
      sequence: 4,
      state: state.scoreSource
    },
    {
      id: "public-claim",
      label: "公開宣稱",
      nextAction: "CEO 只在資料、法務、回測、模型都通過後核准公開宣稱。",
      owner: "CEO",
      sequence: 5,
      state: state.claimApprovalState
    }
  ];
}

export function getMockOnlyRuntimeUpgradeVerdict(): Cp3MockOnlyUpgradeVerdict {
  return {
    label: "升級結論",
    reason: "所有正式化條件仍未完成，因此 runtime 只能保持 mock-only。",
    state: "blocked"
  };
}

export function getMockOnlyRuntimeUpgradeProgress(state: Cp3MockOnlyRuntimeState): Cp3MockOnlyUpgradeProgress {
  const requirements = getMockOnlyRuntimeUpgradeRequirements(state);
  const blockedCount = requirements.filter((requirement) => requirement.state === "mock" || requirement.state === "not_ready").length;
  const nextBlockedRequirement = requirements.find((requirement) => requirement.state === "mock" || requirement.state === "not_ready");

  return {
    blockedCount,
    label: `升級條件 ${requirements.length - blockedCount} / ${requirements.length} 完成，${blockedCount} 項仍阻擋`,
    nextFocus: nextBlockedRequirement
      ? `下一個焦點：${nextBlockedRequirement.owner} / ${nextBlockedRequirement.label}`
      : "等待 CEO 開啟下一個外部資料 gate",
    readyCount: requirements.length - blockedCount,
    totalCount: requirements.length
  };
}

export function getMockOnlySourceDepthEvidenceItems(): Cp3MockOnlySourceDepthEvidenceItem[] {
  return [
    {
      acceptance: "列出資料來源、官方文件或可驗證欄位，不使用實際市場列資料。",
      label: "來源清單",
      owner: "Data",
      state: "not_ready"
    },
    {
      acceptance: "描述欄位意義、時間範圍與缺值處理，先停在本地文件與檢查器。",
      label: "欄位契約",
      owner: "Data",
      state: "not_ready"
    },
    {
      acceptance: "定義 partial、stale、unavailable 的降級條件。",
      label: "資料品質降級",
      owner: "Data",
      state: "not_ready"
    }
  ];
}

export function getMockOnlySourceDepthEvidenceProgress(): Cp3MockOnlySourceDepthEvidenceProgress {
  const items = getMockOnlySourceDepthEvidenceItems();

  return {
    blockedCount: items.length,
    label: `來源深度證據 0 / ${items.length} 完成`,
    nextFocus: `下一個焦點：${items[0].label}`,
    readyCount: 0,
    totalCount: items.length
  };
}

export function getMockOnlyFastFollowGates(): Cp3MockOnlyFastFollowGate[] {
  return [
    {
      gate: "source-depth-evidence",
      label: "來源深度證據",
      owner: "Data",
      reason: "真實資料前必須先知道來源、欄位、頻率與缺漏處理。",
      state: "blocked"
    },
    {
      gate: "source-rights-review",
      label: "來源權利覆核",
      owner: "Legal",
      reason: "公開展示與商用限制未確認前，不擴大資料使用。",
      state: "blocked"
    },
    {
      gate: "supabase-readonly-validation",
      label: "Supabase 唯讀驗證",
      owner: "Engineering",
      reason: "需要 CEO 另外開啟精準的一次性唯讀驗證 gate。",
      state: "blocked"
    },
    {
      gate: "score-source-transition",
      label: "scoreSource 轉換",
      owner: "Investment",
      reason: "模型、回測與來源證據未完成前，不能設定 scoreSource=real。",
      state: "blocked"
    },
    {
      gate: "public-claim-release",
      label: "公開宣稱發布",
      owner: "CEO",
      reason: "公開文案必須與 runtime 狀態一致，不能超前宣稱正式能力。",
      state: "blocked"
    }
  ];
}

export function getMockOnlyRuntimeRouteDecision(): Cp3MockOnlyRuntimeRouteDecision {
  return {
    label: "目前路線：local mock-only refinement",
    nextAction: "先強化本地 runtime 顯示、靜態檢查與降級規則，再由 CEO 決定是否開外部資料 gate。",
    reason: "Supabase、SQL、真實市場資料與正式分數仍需單獨授權。",
    route: "local_mock_only_refinement",
    state: "blocked"
  };
}

export function getMockOnlyRuntimeRouteWorkQueue(): Cp3MockOnlyRuntimeRouteWorkItem[] {
  return [
    {
      acceptance: "前台能清楚顯示 mock-only、not_ready、blocked，不再出現亂碼或誤導字眼。",
      id: "local-runtime-copy-review",
      label: "Runtime 文案清理",
      nextAction: "PM 先把可見 runtime 文案修到可讀、可決策。",
      owner: "PM",
      state: "blocked"
    },
    {
      acceptance: "檢查器能阻擋 scoreSource=real、Supabase runtime import、SQL 或市場資料寫入暗門。",
      id: "local-static-guard",
      label: "本地靜態防線",
      nextAction: "Engineering 收斂 guard，不再新增低價值治理切片。",
      owner: "Engineering",
      state: "blocked"
    },
    {
      acceptance: "下一個外部資料 gate 只允許一個精準命令、一個目的、一個回報格式。",
      id: "external-gate-prep",
      label: "外部資料 gate 準備",
      nextAction: "CEO 決定何時開 Supabase 唯讀或來源深度工作。",
      owner: "CEO",
      state: "blocked"
    }
  ];
}

export function getMockOnlyRuntimeRouteWorkProgress(): Cp3MockOnlyRuntimeRouteWorkProgress {
  const queue = getMockOnlyRuntimeRouteWorkQueue();

  return {
    blockedCount: queue.length,
    completeCount: 0,
    label: `PM route work 0 / ${queue.length} complete`,
    nextFocus: `${queue[0].owner}: ${queue[0].label}`,
    totalCount: queue.length
  };
}

export function getMockOnlyRuntimeMetadataDisclosure(
  state: Cp3MockOnlyRuntimeState
): Cp3MockOnlyRuntimeMetadataDisclosure {
  return state.metadataReachabilityState === "supabase_metadata_reachable"
    ? {
        label: "Supabase metadata 可讀",
        note: "這只代表 freshness metadata 有機會被讀到，不代表市場資料完整、正確或可公開宣稱。",
        state: state.metadataReachabilityState
      }
    : {
        label: "Mock metadata",
        note: "目前顯示 mock freshness metadata，前台不可暗示真實資料已接上。",
        state: state.metadataReachabilityState
      };
}

export function getMockOnlyRuntimeSchemaShapeDisclosure(
  state: Cp3MockOnlyRuntimeState
): Cp3MockOnlyRuntimeSchemaShapeDisclosure {
  return state.schemaShapeState === "schema_shape_checked_not_quality"
    ? {
        label: "Schema shape 已檢查",
        note: "schema shape 只代表欄位形狀可比對，不代表 row completeness、來源權利或資料品質。",
        state: state.schemaShapeState
      }
    : {
        label: "Schema shape 本地契約",
        note: "目前只使用本地契約，尚未作為正式資料品質依據。",
        state: state.schemaShapeState
      };
}

export function getMockOnlyRuntimeDataQualityDisclosure(
  state: Cp3MockOnlyRuntimeState
): Cp3MockOnlyRuntimeDataQualityDisclosure {
  const notes: Record<Cp3MockOnlyDataQualityState, string> = {
    partial: "部分資料可用，但不足以支撐正式訊號或投資判斷。",
    stale: "資料時間落後，必須降級顯示並停止正式解讀。",
    unavailable: "資料不可用，只能顯示 mock-only runtime 邊界。"
  };

  return {
    label: `資料品質：${state.dataQualityState}`,
    note: notes[state.dataQualityState],
    state: state.dataQualityState
  };
}

export function getMockOnlyRuntimeReadinessTriad(state: Cp3MockOnlyRuntimeState): Cp3MockOnlyRuntimeReadinessTriadItem[] {
  return [
    {
      id: "metadata",
      interpretation:
        state.metadataReachabilityState === "supabase_metadata_reachable"
          ? "metadata 可讀，但不能推論資料品質。"
          : "metadata 仍是 mock。不能宣稱已接真實資料。",
      label: "Metadata reachability",
      nextGate: "metadata / quality separation",
      state: "blocked"
    },
    {
      id: "schema_shape",
      interpretation:
        state.schemaShapeState === "schema_shape_checked_not_quality"
          ? "schema shape 可比對，但不能推論完整性或權利。"
          : "schema shape 仍停在本地契約。",
      label: "Schema shape",
      nextGate: "schema contract alignment",
      state: "blocked"
    },
    {
      id: "data_quality",
      interpretation: `目前資料品質狀態是 ${state.dataQualityState}。`,
      label: "Data quality downgrade",
      nextGate: "data quality role review",
      state: "blocked"
    }
  ];
}

export function getMockOnlyMetadataQualitySeparationGuard(
  state: Cp3MockOnlyRuntimeState
): Cp3MockOnlyMetadataQualitySeparationGuard {
  return {
    allowedClaims: [
      state.metadataReachabilityState === "supabase_metadata_reachable" ? "可以說 metadata 可讀。" : "可以說 metadata 仍是 mock。",
      "可以說資料品質仍需 Data / Investment 覆核。",
      "可以說 scoreSource 仍是 mock。"
    ],
    blockedClaims: ["不能說 metadata 可讀等於資料可用。", "不能說已完成正式資料接軌。", "不能說可公開投資建議。"],
    label: "Metadata / quality guard",
    nextGate: "PM 需保持 metadata 與資料品質分離顯示。",
    owner: "PM",
    state: "blocked"
  };
}

export function getMockOnlySchemaContractGuard(): Cp3MockOnlySchemaContractGuard {
  return {
    allowedClaims: ["可以說 schema contract 可本地檢查。", "可以說 schema shape 不是資料品質證明。"],
    blockedClaims: ["不能說 schema shape 等於 row completeness。", "不能說 schema shape 等於來源權利核准。"],
    label: "Schema contract guard",
    nextGate: "Engineering 需維持 schema、資料品質與權利的邊界。",
    owner: "Engineering",
    state: "blocked"
  };
}

export function getMockOnlyDataQualityRoleReviewGuard(
  state: Cp3MockOnlyRuntimeState
): Cp3MockOnlyDataQualityRoleReviewGuard {
  return {
    allowedClaims: [`可以說目前資料品質狀態是 ${state.dataQualityState}。`, "可以說仍需 Data / Investment 覆核。"],
    blockedClaims: ["不能把 partial、stale 或 unavailable 解讀為正式分數。", "不能跳過來源深度與回測。"],
    label: "Data quality role review guard",
    nextGate: "Data 與 Investment 需共同定義資料品質能支撐哪些模型結論。",
    owner: state.dataQualityState === "unavailable" ? "Data" : "Investment",
    state: "blocked"
  };
}

export function getMockOnlyRuntimeNextGates(state: Cp3MockOnlyRuntimeState): Cp3MockOnlyRuntimeNextGate[] {
  return [
    {
      acceptance: "UI 文案必須清楚區分 metadata 可讀與資料品質可用。",
      id: "metadata-quality-separation",
      label: "Metadata / quality 分離",
      owner: "PM",
      reason: "避免使用者把可讀 metadata 誤解成正式資料。",
      sequence: 1,
      state: "blocked"
    },
    {
      acceptance: "schema 只能證明形狀，不可證明完整性、權利或模型品質。",
      id: "schema-contract-alignment",
      label: "Schema contract 對齊",
      owner: "Engineering",
      reason: "讓未來 Supabase 接軌時不把 schema 檢查過度解讀。",
      sequence: 2,
      state: "blocked"
    },
    {
      acceptance: `資料品質 ${state.dataQualityState} 必須對應明確降級規則。`,
      id: "data-quality-role-review",
      label: "資料品質角色覆核",
      owner: state.dataQualityState === "unavailable" ? "Data" : "Investment",
      reason: "資料品質決定前台能說什麼，也決定模型能否升級。",
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
      reason: "可改善可讀性與決策階層。",
      status: "allowed"
    },
    {
      id: "local-static-guards",
      label: "本地靜態 guards",
      owner: "Engineering",
      reason: "可阻擋未授權的 real / Supabase / SQL 轉換。",
      status: "allowed"
    },
    {
      id: "supabase-readonly",
      label: "Supabase 唯讀驗證",
      owner: "Engineering",
      reason: "需要 CEO 另開一次性唯讀 gate。",
      status: "blocked"
    },
    {
      id: "sql-execution",
      label: "SQL 執行",
      owner: "Engineering",
      reason: "仍需獨立授權與回滾方案。",
      status: "blocked"
    },
    {
      id: "market-data",
      label: "真實市場資料",
      owner: "Data",
      reason: "來源深度、權利與品質尚未完成。",
      status: "blocked"
    },
    {
      id: "formal-score-transition",
      label: "scoreSource=real",
      owner: "Investment",
      reason: "模型、回測與公開宣稱尚未核准。",
      status: "blocked"
    },
    {
      id: "public-claims",
      label: "公開宣稱",
      owner: "CEO",
      reason: "必須等 runtime 狀態與證據全部一致。",
      status: "blocked"
    }
  ];
  const allowedCount = items.filter((item) => item.status === "allowed").length;

  return {
    allowedCount,
    blockedCount: items.length - allowedCount,
    items,
    label: `Runtime authorization: ${allowedCount} allowed / ${items.length - allowedCount} blocked`,
    nextAction: "PM / Engineering 可做本地 mock runtime 與 guard；Supabase、SQL、真實資料、scoreSource=real 仍需 CEO 另行開 gate。",
    totalCount: items.length
  };
}

export function getMockOnlyRuntimeCommandCenter(state: Cp3MockOnlyRuntimeState): Cp3MockOnlyRuntimeCommandCenter {
  const authorizationSnapshot = getMockOnlyRuntimeAuthorizationSnapshot();
  const nextGate = getMockOnlyRuntimeNextGates(state)[0];
  const nextWork = getMockOnlyRuntimeRouteWorkQueue()[0];
  const gateProposalQueue: Cp3MockOnlyGateProposalItem[] = [
    {
      boundary: "One exact read-only command, one run, no writes, no data mutation.",
      label: "Supabase read-only evidence run",
      owner: "Engineering",
      sequence: 1,
      state: "draft"
    },
    {
      boundary: "Compare contract shape only; do not infer data quality or public claim fitness.",
      label: "Schema contract comparison",
      owner: "Engineering",
      sequence: 2,
      state: "draft"
    },
    {
      boundary: "Evidence criteria only; no market-row ingestion or persisted market dataset.",
      label: "Source-depth evidence packet",
      owner: "Data",
      sequence: 3,
      state: "draft"
    },
    {
      boundary: "Rights questions only; no data usage expansion or public redistribution claim.",
      label: "Source-rights review packet",
      owner: "Legal",
      sequence: 4,
      state: "draft"
    },
    {
      boundary: "Model criteria only; do not change score source or public wording.",
      label: "Formal score transition packet",
      owner: "Investment",
      sequence: 5,
      state: "draft"
    }
  ];

  return {
    blockedLaneLabel: `${authorizationSnapshot.blockedCount} gates blocked: Supabase / SQL / market data / scoreSource=real / public claims`,
    doNext: "準備來源深度與唯讀驗證 gate，但先不執行外部連線。",
    doNotDo: "不要連 Supabase、不要跑 SQL、不要抓真實市場資料、不要設定 scoreSource=real。",
    doNow: "修正本地 runtime 可讀性，並加強靜態 guard。",
    evidenceLevel: "mock_local_only",
    executionState: "active_local_only",
    executionLanes: [
      {
        boundary: "Local UI and static guards only.",
        label: "Local Runtime UI",
        owner: "PM",
        state: "active",
        work: "改善 runtime 決策階層與可讀中文。"
      },
      {
        boundary: "Local checks only; no remote service dependency.",
        label: "Guard Hardening",
        owner: "Engineering",
        state: "active",
        work: "讓檢查器阻擋未授權 real / Supabase / SQL 路徑。"
      },
      {
        boundary: "Separate gate required before external-data work.",
        label: "External Gate",
        owner: "CEO",
        state: "blocked",
        work: "決定何時開啟外部資料與 formal score 工作。"
      }
    ],
    externalReadinessChecks: [
      {
        criterion: "CEO 必須另行核准精準命令與回報格式。",
        label: "Supabase read-only command gate",
        owner: "CEO",
        state: "blocked"
      },
      {
        criterion: "Data 必須先完成來源深度、缺漏與降級準則。",
        label: "Market data evidence",
        owner: "Data",
        state: "blocked"
      },
      {
        criterion: "Legal 必須確認公開展示與資料權利。",
        label: "Source rights boundary",
        owner: "Legal",
        state: "blocked"
      },
      {
        criterion: "Investment 必須核准模型與回測證據。",
        label: "Formal score transition",
        owner: "Investment",
        state: "blocked"
      }
    ],
    gateProposalProgress: {
      blockedExecutionLabel: "External execution remains blocked until CEO opens a separate gate.",
      draftCount: gateProposalQueue.length,
      label: `Gate proposals ${gateProposalQueue.length} draft / ${gateProposalQueue.length} total`,
      nextDraftLabel: `${gateProposalQueue[0].owner}: ${gateProposalQueue[0].label}`,
      totalCount: gateProposalQueue.length
    },
    gateProposalQueue,
    gateProposalQueueLabel: "Gate proposal queue",
    handoffChecks: [
      { label: "Mock-only runtime state remains explicit.", state: "recorded" },
      { label: "Static guard covers command center fields.", state: "recorded" },
      { label: "No external-data gate is opened by this UI.", state: "recorded" }
    ],
    localLaneLabel: `${authorizationSnapshot.allowedCount} local lanes allowed: mock runtime UI and static guards`,
    milestones: [
      {
        label: "Local runtime shell committed",
        note: "Panel, command center and static guard are local-only.",
        owner: "Engineering",
        state: "done"
      },
      {
        label: "Decision clarity pass",
        note: "PM keeps readability higher priority than extra governance detail.",
        owner: "PM",
        state: "active"
      },
      {
        label: "External-data transition",
        note: "Supabase, SQL, market data, formal score and public claims remain blocked.",
        owner: "CEO",
        state: "blocked"
      }
    ],
    nextGateLabel: `${nextGate.owner}: ${nextGate.label}`,
    nextWorkLabel: `${nextWork.owner}: ${nextWork.label}`,
    operatingMode: "local_mock_only",
    priorityLabel: "Priority: readable local runtime, then one narrow external-data gate.",
    reviewCadence: "Review after each committed local runtime slice or before any external-data gate.",
    riskLabel: "Main risk: mistaking metadata or UI readiness for production data readiness.",
    roleActions: [
      {
        action: "Refine local runtime readability and keep public copy mock-only.",
        owner: "PM",
        state: "allowed"
      },
      {
        action: "Harden static guards and keep runtime free of external data dependencies.",
        owner: "Engineering",
        state: "allowed"
      },
      {
        action: "Prepare source-depth evidence without market rows or remote validation.",
        owner: "Data",
        state: "blocked"
      },
      {
        action: "Prepare source-rights questions before any data usage expansion.",
        owner: "Legal",
        state: "blocked"
      },
      {
        action: "Prepare formal-score review criteria without switching score source.",
        owner: "Investment",
        state: "blocked"
      },
      {
        action: "Decide when to open a separate gate for external-data work.",
        owner: "CEO",
        state: "blocked"
      }
    ],
    stopCondition: "Stop before remote access, SQL, market-row ingestion, scoreSource=real, or public-claim release.",
    summary: "CEO keeps execution in local mock-only mode. PM should improve readability; Engineering should keep forbidden external-data transitions blocked."
  };
}
