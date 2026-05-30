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

const runtimeValueLabels: Record<string, string> = {
  candidate: "候選模型",
  local_contract_only: "本地契約",
  mock: "模擬分數",
  not_ready: "尚未就緒",
  partial: "部分就緒",
  stale: "新鮮度不足",
  unavailable: "不可用",
  unknown: "未知"
};

export function Cp3RuntimeStatePanel({ freshness, snapshot }: Cp3RuntimeStatePanelProps) {
  const runtimeState = buildMockOnlyRuntimeState({ freshness, snapshot });
  const displayState = getMockOnlyPublicDisplayState(runtimeState);
  const copy = cp3MockOnlyUiCopyTokens[displayState];
  const blockers = buildRuntimeBlockers(runtimeState);

  return (
    <section className={`cp3-runtime-state-panel ${displayState}`} aria-label="CP3 Runtime State">
      <div>
        <p className="eyebrow">Runtime Boundary</p>
        <h2>{copy.label}</h2>
        <p>{copy.shortDescription}</p>
      </div>
      <div className="cp3-runtime-state-grid">
        <RuntimeStateItem label="顯示狀態" value={displayState} />
        <RuntimeStateItem label="分數來源" value={runtimeState.scoreSource} />
        <RuntimeStateItem label="資料契約" value={runtimeState.contractState} />
        <RuntimeStateItem label="來源深度" value={runtimeState.sourceDepthState} />
        <RuntimeStateItem label="公開宣稱" value={runtimeState.claimApprovalState} />
        <RuntimeStateItem label="資料品質" value={runtimeState.dataQualityState} />
      </div>
      <div className="cp3-runtime-state-disclosure">
        <strong>{copy.disclosure}</strong>
        <span>{copy.claimLimit}</span>
      </div>
      <div className="cp3-runtime-state-blockers" aria-label="Runtime blockers">
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
    contractState: "local_contract_only",
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
      <strong>{formatRuntimeValue(value)}</strong>
    </article>
  );
}

function formatRuntimeValue(value: string | number) {
  return runtimeValueLabels[String(value)] ?? value;
}

function buildRuntimeBlockers(state: Cp3MockOnlyRuntimeState) {
  return [
    state.scoreSource === "mock" ? "分數仍為 mock" : null,
    `資料契約 ${formatRuntimeValue(state.contractState)}`,
    `來源深度 ${formatRuntimeValue(state.sourceDepthState)}`,
    `來源權利 ${formatRuntimeValue(state.sourceRightsState)}`,
    `公開宣稱 ${formatRuntimeValue(state.claimApprovalState)}`,
    `回測審核 ${formatRuntimeValue(state.backtestApprovalState)}`
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
