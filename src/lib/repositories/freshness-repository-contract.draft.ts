import type { DataFreshnessSnapshot } from "@/lib/data-freshness";

export type FreshnessRepositoryContractState = "draft_only";

export type FreshnessRepositoryRuntimeState = "mock_default" | "supabase_read_blocked" | "candidate_only";

export type FreshnessRepositorySourceKind = "mock" | "data_runs" | "data_freshness_candidate";

export type FreshnessRepositoryReadMode = "local_mock_only" | "gated_supabase_read_candidate" | "blocked";

export type FreshnessRepositorySafetyBoundary = {
  cp3Readiness: "not_ready";
  dataFreshnessRuntimeDependency: "data_runs_only_candidate";
  dataFreshnessRemoteObject: "blocked";
  marketDataIngestion: "blocked";
  publicClaims: "blocked";
  publicDataSource: "mock";
  scoreSourceReal: "blocked";
  sqlExecution: "blocked";
  supabaseConnection: "not_enabled_by_contract";
  supabaseWrites: "blocked";
};

export type FreshnessRepositoryDraft = {
  contractState: FreshnessRepositoryContractState;
  getSnapshot(): Promise<DataFreshnessSnapshot>;
  readMode: FreshnessRepositoryReadMode;
  runtimeState: FreshnessRepositoryRuntimeState;
  sourceKind: FreshnessRepositorySourceKind;
};

export type MockFreshnessRepositoryDraft = FreshnessRepositoryDraft & {
  readMode: "local_mock_only";
  runtimeState: "mock_default";
  sourceKind: "mock";
};

export type DataRunsFreshnessRepositoryDraft = FreshnessRepositoryDraft & {
  readMode: "gated_supabase_read_candidate";
  runtimeState: "supabase_read_blocked";
  sourceKind: "data_runs";
};

export type DataFreshnessRemoteCandidateRepositoryDraft = {
  contractState: "draft_only";
  readMode: "blocked";
  reason: "data_freshness_unmapped_pending_decision";
  runtimeState: "candidate_only";
  sourceKind: "data_freshness_candidate";
};

export const freshnessRepositorySafetyBoundary: FreshnessRepositorySafetyBoundary = {
  cp3Readiness: "not_ready",
  dataFreshnessRuntimeDependency: "data_runs_only_candidate",
  dataFreshnessRemoteObject: "blocked",
  marketDataIngestion: "blocked",
  publicClaims: "blocked",
  publicDataSource: "mock",
  scoreSourceReal: "blocked",
  sqlExecution: "blocked",
  supabaseConnection: "not_enabled_by_contract",
  supabaseWrites: "blocked"
};

export const freshnessRepositoryDraftSourceOrder: FreshnessRepositorySourceKind[] = [
  "mock",
  "data_runs",
  "data_freshness_candidate"
];

export function canUseFreshnessRepositoryAtPublicRuntime(repository: FreshnessRepositoryDraft): boolean {
  return repository.sourceKind === "mock" && repository.readMode === "local_mock_only";
}

export function canUseDataRunsFreshnessCandidate({
  source,
  supabaseRuntimeReads
}: {
  source: "mock" | "supabase";
  supabaseRuntimeReads: "disabled" | "enabled";
}): boolean {
  return source === "supabase" && supabaseRuntimeReads === "enabled";
}

export function canUseDataFreshnessRemoteCandidate(): false {
  return false;
}

export function getFreshnessRepositoryNextAction(sourceKind: FreshnessRepositorySourceKind): string {
  if (sourceKind === "mock") {
    return "Keep mock freshness as the default public-safe repository.";
  }

  if (sourceKind === "data_runs") {
    return "Prepare gated data_runs repository implementation without enabling Supabase reads by default.";
  }

  return "Keep data_freshness blocked until migration, generated types, repository contract, and QA gates exist.";
}
