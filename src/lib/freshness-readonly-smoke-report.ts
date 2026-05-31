import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import {
  getFreshnessRuntimeActivationSummary,
  type FreshnessRuntimeActivationEnvironment,
  type FreshnessRuntimeActivationSummary
} from "@/lib/freshness-runtime-activation";

export type FreshnessReadonlySmokeOutcome = "blocked" | "metadata_ready" | "mock_only";

export type FreshnessReadonlySmokeReport = {
  activation: Pick<
    FreshnessRuntimeActivationSummary,
    | "automatedRemoteRun"
    | "connectionAttempted"
    | "dataFreshnessSource"
    | "publicDataSource"
    | "scoreSourceRealEnabled"
    | "sqlExecuted"
    | "state"
    | "supabaseRuntimeReads"
    | "writesEnabled"
  >;
  metadata: {
    asOfDate: string;
    isMock: boolean;
    market: string;
    scoreSource: DataFreshnessSnapshot["scoreSource"];
    sourceName: string;
    state: DataFreshnessSnapshot["state"];
  } | null;
  outcome: FreshnessReadonlySmokeOutcome;
  safety: {
    rowPayloadsPrinted: false;
    secretsPrinted: false;
  };
  stopLine: string;
};

export function buildFreshnessReadonlySmokeReport({
  env = process.env,
  snapshot = null
}: {
  env?: FreshnessRuntimeActivationEnvironment;
  snapshot?: DataFreshnessSnapshot | null;
} = {}): FreshnessReadonlySmokeReport {
  const activation = getFreshnessRuntimeActivationSummary(env);
  const metadata = snapshot ? summarizeSnapshot(snapshot) : null;

  return {
    activation: {
      automatedRemoteRun: activation.automatedRemoteRun,
      connectionAttempted: activation.connectionAttempted,
      dataFreshnessSource: activation.dataFreshnessSource,
      publicDataSource: activation.publicDataSource,
      scoreSourceRealEnabled: activation.scoreSourceRealEnabled,
      sqlExecuted: activation.sqlExecuted,
      state: activation.state,
      supabaseRuntimeReads: activation.supabaseRuntimeReads,
      writesEnabled: activation.writesEnabled
    },
    metadata,
    outcome: resolveOutcome(activation, metadata),
    safety: {
      rowPayloadsPrinted: false,
      secretsPrinted: false
    },
    stopLine:
      "Smoke report is a sanitized contract only; do not print secrets, row payloads, SQL, writes, or scoreSource=real approval."
  };
}

function summarizeSnapshot(snapshot: DataFreshnessSnapshot): FreshnessReadonlySmokeReport["metadata"] {
  return {
    asOfDate: snapshot.asOfDate,
    isMock: snapshot.isMock,
    market: snapshot.market,
    scoreSource: snapshot.scoreSource,
    sourceName: snapshot.sourceName,
    state: snapshot.state
  };
}

function resolveOutcome(
  activation: FreshnessRuntimeActivationSummary,
  metadata: FreshnessReadonlySmokeReport["metadata"]
): FreshnessReadonlySmokeOutcome {
  if (activation.state === "blocked") return "blocked";
  if (activation.state === "mock_only") return "mock_only";
  return metadata && metadata.scoreSource === "mock" ? "metadata_ready" : "blocked";
}
