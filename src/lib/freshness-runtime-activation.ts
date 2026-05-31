export type FreshnessRuntimeActivationState = "blocked" | "mock_only" | "readonly_metadata_open";

export type FreshnessRuntimeActivationEnvironment = {
  [key: string]: string | undefined;
  DATA_FRESHNESS_SOURCE?: string;
  DATA_FRESHNESS_SUPABASE_READS?: string;
  NEXT_PUBLIC_DATA_SOURCE?: string;
};

export type FreshnessRuntimeActivationSummary = {
  automatedRemoteRun: false;
  connectionAttempted: false;
  dataFreshnessSource: string;
  decision: string;
  nextPublicDataSource: "mock";
  publicDataSource: string;
  scoreSourceRealEnabled: false;
  sqlExecuted: false;
  state: FreshnessRuntimeActivationState;
  supabaseRuntimeReads: string;
  stopLine: string;
  writesEnabled: false;
};

export function getFreshnessRuntimeActivationSummary(
  env: FreshnessRuntimeActivationEnvironment = process.env
): FreshnessRuntimeActivationSummary {
  const dataFreshnessSource = env.DATA_FRESHNESS_SOURCE ?? "mock";
  const supabaseRuntimeReads = env.DATA_FRESHNESS_SUPABASE_READS ?? "disabled";
  const publicDataSource = env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";
  const sourceIsAllowed = dataFreshnessSource === "mock" || dataFreshnessSource === "supabase";
  const readsAreAllowed = supabaseRuntimeReads === "disabled" || supabaseRuntimeReads === "enabled";
  const publicSourceIsMock = publicDataSource === "mock";
  const state: FreshnessRuntimeActivationState =
    sourceIsAllowed && readsAreAllowed && publicSourceIsMock
      ? dataFreshnessSource === "supabase" && supabaseRuntimeReads === "enabled"
        ? "readonly_metadata_open"
        : "mock_only"
      : "blocked";

  return {
    automatedRemoteRun: false,
    connectionAttempted: false,
    dataFreshnessSource,
    decision: buildDecision(state),
    nextPublicDataSource: "mock",
    publicDataSource,
    scoreSourceRealEnabled: false,
    sqlExecuted: false,
    state,
    supabaseRuntimeReads,
    stopLine:
      "Freshness readonly activation may read metadata only; it must not run SQL, write Supabase, ingest market data, or set scoreSource=real.",
    writesEnabled: false
  };
}

function buildDecision(state: FreshnessRuntimeActivationState) {
  if (state === "readonly_metadata_open") {
    return "Runtime may attempt bounded Supabase freshness metadata reads, while public scores and public data source remain mock.";
  }

  if (state === "mock_only") {
    return "Runtime remains mock-only until CEO opens bounded freshness metadata reads.";
  }

  return "Runtime activation is blocked because one or more source switches are outside the approved values.";
}
