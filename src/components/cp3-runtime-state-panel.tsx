import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import {
  cp3MockOnlyUiCopyTokens,
  getMockOnlyPublicDisplayState,
  type Cp3MockOnlyDataQualityState,
  type Cp3MockOnlyFreshnessState,
  type Cp3MockOnlyRuntimeState
} from "@/lib/cp3-mock-only-runtime-state";
import type { SignalSnapshot } from "@/lib/signal-model";

type Cp3RuntimeStatePanelProps = {
  freshness: DataFreshnessSnapshot;
  snapshot: SignalSnapshot;
};

export function Cp3RuntimeStatePanel({ freshness, snapshot }: Cp3RuntimeStatePanelProps) {
  const runtimeState = buildMockOnlyRuntimeState({ freshness, snapshot });
  const displayState = getMockOnlyPublicDisplayState(runtimeState);
  const copy = cp3MockOnlyUiCopyTokens[displayState];
  const blockers = buildRuntimeBlockers(runtimeState);

  return (
    <section className={`cp3-runtime-state-panel ${displayState}`} aria-label="CP3 Runtime State">
      <div>
        <p className="eyebrow">CP3 Runtime State</p>
        <h2>{copy.label}</h2>
        <p>{copy.shortDescription}</p>
      </div>
      <div className="cp3-runtime-state-grid">
        <RuntimeStateItem label="Display state" value={displayState} />
        <RuntimeStateItem label="Score source" value={runtimeState.scoreSource} />
        <RuntimeStateItem label="Source depth" value={runtimeState.sourceDepthState} />
        <RuntimeStateItem label="Claim gate" value={runtimeState.claimApprovalState} />
      </div>
      <div className="cp3-runtime-state-disclosure">
        <strong>{copy.disclosure}</strong>
        <span>{copy.claimLimit}</span>
      </div>
      <div className="cp3-runtime-state-blockers">
        {blockers.map((blocker) => (
          <span key={blocker}>{blocker}</span>
        ))}
      </div>
    </section>
  );
}

export function buildMockOnlyRuntimeState({
  freshness,
  snapshot
}: Cp3RuntimeStatePanelProps): Cp3MockOnlyRuntimeState {
  return {
    assetType: inferRuntimeAssetType(snapshot),
    backtestApprovalState: "not_ready",
    claimApprovalState: "not_ready",
    dataQualityScore: snapshot.dataQualityScore,
    dataQualityState: toRuntimeDataQualityState(freshness),
    disclosureApprovalState: "not_ready",
    freshnessState: toRuntimeFreshnessState(freshness),
    locale: "zh-TW",
    market: "tw",
    modelApprovalState: "candidate",
    modelVersion: snapshot.modelVersion,
    scoreSource: "mock",
    sourceDepthState: "not_ready",
    sourceRightsState: "not_ready"
  };
}

function inferRuntimeAssetType(snapshot: SignalSnapshot): Cp3MockOnlyRuntimeState["assetType"] {
  if (snapshot.asset.group === "ETF") return "etf";
  if (snapshot.asset.symbol === "TWII") return "index";

  return "stock";
}

function RuntimeStateItem({ label, value }: { label: string; value: string | number }) {
  return (
    <article>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function buildRuntimeBlockers(state: Cp3MockOnlyRuntimeState) {
  return [
    state.scoreSource === "mock" ? "real score blocked" : null,
    `source depth ${state.sourceDepthState}`,
    `source rights ${state.sourceRightsState}`,
    `public claims ${state.claimApprovalState}`
  ].filter((item): item is string => Boolean(item));
}

function toRuntimeDataQualityState(freshness: DataFreshnessSnapshot): Cp3MockOnlyDataQualityState {
  if (freshness.state === "partial" || freshness.state === "stale") {
    return freshness.state;
  }

  return "unavailable";
}

function toRuntimeFreshnessState(freshness: DataFreshnessSnapshot): Cp3MockOnlyFreshnessState {
  if (freshness.state === "stale") return "stale";

  return "unknown";
}
