export type Cp3RemoteOnlyContractState = "remote_only_pending_contract";

export type Cp3RuntimeDependencyState = "blocked";

export type Cp3ContractPriority = "P1";

export type Cp3ContractOwner = "CEO" | "Data" | "Engineering" | "PM" | "QA";

export type Cp3MarketAssetContractDraft = {
  activeFlag: boolean | null;
  assetId: string;
  assetType: "stock" | "etf" | "index" | "fx" | "rate" | "crypto" | (string & {});
  contractState: Cp3RemoteOnlyContractState;
  country: string;
  currency: string;
  displayName: string;
  exchange: string;
  marketId: string;
  priority: Cp3ContractPriority;
  runtimeDependencyState: Cp3RuntimeDependencyState;
  symbol: string;
  timezone: string;
};

export type Cp3ModelRunContractDraft = {
  contractState: Cp3RemoteOnlyContractState;
  errorMessage: string | null;
  finishedAt: string | null;
  modelVersion: string;
  notes: string | null;
  priority: Cp3ContractPriority;
  reviewStatus: "pending" | "review" | "rejected" | "approved";
  runStatus: "pending" | "running" | "success" | "partial" | "failed";
  runtimeDependencyState: Cp3RuntimeDependencyState;
  sourceMode: "mock" | "candidate" | "real_blocked";
  startedAt: string;
  targetObject: "market" | "asset" | "stock" | "etf" | "index" | (string & {});
};

export type Cp3DataFreshnessContractDraft = {
  contractState: Cp3RemoteOnlyContractState;
  finishedAt: string | null;
  freshnessStatus: "unknown" | "fresh_candidate" | "stale_candidate" | "failed";
  latestDataDate: string | null;
  priority: Cp3ContractPriority;
  relationshipToDataRuns: "unmapped_pending_decision";
  rowCount: number | null;
  runStatus: "pending" | "running" | "success" | "partial" | "failed";
  runtimeDependencyState: Cp3RuntimeDependencyState;
  sourceName: string;
  staleReason: string | null;
  targetTable: string;
};

export type Cp3RemoteOnlyObjectContractDraft =
  | {
      objectName: "market_assets";
      ownerRoles: ("CEO" | "Data" | "Engineering")[];
      role: "global_asset_identity_candidate_only";
      shape: Cp3MarketAssetContractDraft;
    }
  | {
      objectName: "model_runs";
      ownerRoles: ("Data" | "QA" | "Engineering")[];
      role: "score_provenance_candidate_only";
      shape: Cp3ModelRunContractDraft;
    }
  | {
      objectName: "data_freshness";
      ownerRoles: ("PM" | "Engineering" | "QA")[];
      role: "freshness_disclosure_candidate_only";
      shape: Cp3DataFreshnessContractDraft;
    };

export const cp3RemoteOnlyContractGuardrails = {
  cp3Readiness: "not_ready",
  marketDataIngestion: "blocked",
  publicClaims: "blocked",
  publicDataSource: "mock",
  scoreSourceReal: "blocked",
  sqlExecution: "blocked",
  supabaseConnection: "blocked",
  supabaseWrites: "blocked"
} as const;

export const cp3RemoteOnlyObjectContractDrafts: Cp3RemoteOnlyObjectContractDraft[] = [
  {
    objectName: "market_assets",
    ownerRoles: ["CEO", "Data", "Engineering"],
    role: "global_asset_identity_candidate_only",
    shape: {
      activeFlag: null,
      assetId: "draft-only",
      assetType: "stock",
      contractState: "remote_only_pending_contract",
      country: "TW",
      currency: "TWD",
      displayName: "Draft asset",
      exchange: "TWSE",
      marketId: "tw",
      priority: "P1",
      runtimeDependencyState: "blocked",
      symbol: "DRAFT",
      timezone: "Asia/Taipei"
    }
  },
  {
    objectName: "model_runs",
    ownerRoles: ["Data", "QA", "Engineering"],
    role: "score_provenance_candidate_only",
    shape: {
      contractState: "remote_only_pending_contract",
      errorMessage: null,
      finishedAt: null,
      modelVersion: "draft-only",
      notes: null,
      priority: "P1",
      reviewStatus: "pending",
      runStatus: "pending",
      runtimeDependencyState: "blocked",
      sourceMode: "real_blocked",
      startedAt: "draft-only",
      targetObject: "stock"
    }
  },
  {
    objectName: "data_freshness",
    ownerRoles: ["PM", "Engineering", "QA"],
    role: "freshness_disclosure_candidate_only",
    shape: {
      contractState: "remote_only_pending_contract",
      finishedAt: null,
      freshnessStatus: "unknown",
      latestDataDate: null,
      priority: "P1",
      relationshipToDataRuns: "unmapped_pending_decision",
      rowCount: null,
      runStatus: "pending",
      runtimeDependencyState: "blocked",
      sourceName: "draft-only",
      staleReason: null,
      targetTable: "daily_prices"
    }
  }
];

export function canUseRemoteOnlyObjectAtRuntime(contract: Cp3RemoteOnlyObjectContractDraft): boolean {
  return contract.shape.contractState !== "remote_only_pending_contract";
}

export function getRemoteOnlyContractNextAction(contract: Cp3RemoteOnlyObjectContractDraft): string {
  if (contract.objectName === "market_assets") {
    return "Define local migration/type alignment before global asset runtime reads.";
  }

  if (contract.objectName === "model_runs") {
    return "Define score provenance semantics before any score-source promotion.";
  }

  return "Map data_freshness to data_runs before freshness runtime dependency.";
}
