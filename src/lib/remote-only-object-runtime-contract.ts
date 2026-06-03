export type RemoteOnlyRuntimeContractStatus =
  | "blocked_runtime_candidate"
  | "local_mapping_required"
  | "provenance_planning_only";

export type RemoteOnlyRuntimeObjectContract = {
  blockedPromotion: string;
  currentRuntimeUse: "display_only" | "planning_only" | "none";
  evidenceSource: "schema_shape_sanitized_run_2026_05_31";
  localBaseline: string;
  name: "market_assets" | "model_runs" | "data_freshness";
  nextAction: string;
  owner: "CEO" | "Data" | "Engineering" | "PM" | "QA";
  relationshipToRuntime: string;
  status: RemoteOnlyRuntimeContractStatus;
};

export type RemoteOnlyRuntimeContract = {
  blockedActions: string[];
  dataFreshnessRelationship: {
    baselineObject: "data_runs";
    candidateObject: "data_freshness";
    decision: "keep_data_runs_as_runtime_baseline";
    runtimeRepositoryDependency: "data_runs_only";
  };
  mode: "remote_only_object_runtime_contract";
  nextDefaultAction: string;
  objects: RemoteOnlyRuntimeObjectContract[];
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
};

export function getRemoteOnlyObjectRuntimeContract(): RemoteOnlyRuntimeContract {
  const objects: RemoteOnlyRuntimeObjectContract[] = [
    {
      blockedPromotion: "global asset runtime dependency",
      currentRuntimeUse: "planning_only",
      evidenceSource: "schema_shape_sanitized_run_2026_05_31",
      localBaseline:
        "No accepted local migration, generated type, or repository contract for market_assets.",
      name: "market_assets",
      nextAction:
        "Define asset identity semantics for market, country, exchange, currency, timezone, and activation before any global asset runtime read.",
      owner: "PM",
      relationshipToRuntime:
        "Global market expansion candidate only; current stock pages must continue using existing mock/local asset metadata.",
      status: "local_mapping_required"
    },
    {
      blockedPromotion: "score provenance claim",
      currentRuntimeUse: "planning_only",
      evidenceSource: "schema_shape_sanitized_run_2026_05_31",
      localBaseline:
        "No accepted local model provenance contract, credibility gate, or QA acceptance path for model_runs.",
      name: "model_runs",
      nextAction:
        "Define model version, run status, review status, source mode, and QA acceptance semantics before any score-source promotion.",
      owner: "QA",
      relationshipToRuntime:
        "Score provenance planning only; it cannot justify scoreSource=real or public investment claims.",
      status: "provenance_planning_only"
    },
    {
      blockedPromotion: "freshness-based public claim",
      currentRuntimeUse: "display_only",
      evidenceSource: "schema_shape_sanitized_run_2026_05_31",
      localBaseline:
        "data_runs remains the only local-baselined freshness repository object; data_freshness is not a runtime repository source.",
      name: "data_freshness",
      nextAction:
        "Keep data_runs as the runtime baseline and map whether data_freshness summarizes, complements, or replaces it before dependency changes.",
      owner: "Engineering",
      relationshipToRuntime:
        "Freshness disclosure candidate only; current freshness behavior remains data_runs-only and mock-first.",
      status: "blocked_runtime_candidate"
    }
  ];

  return {
    blockedActions: [
      "Supabase reads from remote-only objects",
      "Supabase writes",
      "SQL execution",
      "runtime repository dependency on data_freshness",
      "market_assets global runtime reads",
      "model_runs score provenance claims",
      "publicDataSource=supabase",
      "scoreSource=real"
    ],
    dataFreshnessRelationship: {
      baselineObject: "data_runs",
      candidateObject: "data_freshness",
      decision: "keep_data_runs_as_runtime_baseline",
      runtimeRepositoryDependency: "data_runs_only"
    },
    mode: "remote_only_object_runtime_contract",
    nextDefaultAction:
      "Use this contract to prepare repository and UI boundaries while keeping all remote-only objects blocked from runtime dependency.",
    objects,
    publicDataSource: "mock",
    scoreSource: "mock",
    stopLine:
      "Remote-only object contracts do not approve Supabase reads, writes, SQL, ingestion, public source promotion, model credibility, freshness quality, or scoreSource=real."
  };
}
