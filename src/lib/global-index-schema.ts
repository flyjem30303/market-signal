import type { GlobalMarketCode } from "./global-index-provider";

export type GlobalIndexLegalUsageStatus = "conditional" | "rejected" | "unresolved" | "accepted";

export type GlobalIndexRow = {
  id: string;
  symbol: string;
  displayName: string;
  market: GlobalMarketCode;
  country: string;
  exchange: string;
  source: string;
  sourceUrl: string;
  attribution: string;
  legalUsageStatus: GlobalIndexLegalUsageStatus;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GlobalIndexScoreModuleKey = "trend" | "volatility" | "freshness" | "confidence" | "risk";

export type GlobalIndexScoreModules = Partial<Record<GlobalIndexScoreModuleKey, number>>;

export type GlobalIndexScoreRow = {
  id: string;
  globalIndexId: string;
  symbol: string;
  tradeDate: string;
  compositeScore: number;
  riskScore: number;
  freshnessScore: number;
  confidenceScore: number;
  modules: GlobalIndexScoreModules;
  isMock: true;
  createdAt: string;
};

export const globalIndexSchemaShape = {
  globalIndices: "global_indices",
  globalIndexScores: "global_index_scores"
} as const;

