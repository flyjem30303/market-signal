import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import {
  cp3MockOnlyUiCopyTokens,
  getMockOnlyFastFollowGates,
  getMockOnlyPublicDisplayState,
  getMockOnlyRuntimeRouteDecision,
  getMockOnlyRuntimeRouteWorkQueue,
  getMockOnlySourceDepthEvidenceItems,
  getMockOnlySourceDepthEvidenceProgress,
  getMockOnlyRuntimeUpgradeProgress,
  getMockOnlyRuntimeUpgradeRequirements,
  getMockOnlyRuntimeUpgradeVerdict,
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
  const decisionSummary = buildRuntimeDecisionSummary(runtimeState);
  const upgradeRequirements = getMockOnlyRuntimeUpgradeRequirements(runtimeState);
  const upgradeProgress = getMockOnlyRuntimeUpgradeProgress(runtimeState);
  const upgradeVerdict = getMockOnlyRuntimeUpgradeVerdict(runtimeState);
  const sourceDepthEvidenceItems = getMockOnlySourceDepthEvidenceItems();
  const sourceDepthEvidenceProgress = getMockOnlySourceDepthEvidenceProgress();
  const fastFollowGates = getMockOnlyFastFollowGates();
  const routeDecision = getMockOnlyRuntimeRouteDecision(runtimeState);
  const routeWorkQueue = getMockOnlyRuntimeRouteWorkQueue();
  const stopLines = buildRuntimeStopLines();

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
      <div className="cp3-runtime-decision-summary" aria-label="Runtime decision summary">
        <strong>CEO runtime 判定</strong>
        <span>{decisionSummary}</span>
      </div>
      <div className="cp3-runtime-route-decision" aria-label="Runtime route decision">
        <strong>{routeDecision.label}</strong>
        <span>{routeDecision.reason}</span>
        <em>{routeDecision.nextAction}</em>
      </div>
      <div className="cp3-runtime-upgrade-requirements" aria-label="Runtime upgrade requirements">
        <strong>升級前置條件</strong>
        <mark>{upgradeProgress.label}</mark>
        <mark>{upgradeProgress.nextFocus}</mark>
        <p>
          {upgradeVerdict.label}: {upgradeVerdict.reason}
        </p>
        <div>
          {upgradeRequirements.map((requirement) => (
            <span key={requirement.id}>
              <b>
                {requirement.sequence}. {requirement.label}
              </b>
              <small>{requirement.owner}</small>
              <i>{requirement.nextAction}</i>
              <em>{formatRuntimeValue(requirement.state)}</em>
            </span>
          ))}
        </div>
      </div>
      <div className="cp3-runtime-source-depth-focus" aria-label="Source depth evidence focus">
        <strong>來源深度解除條件</strong>
        <mark>{sourceDepthEvidenceProgress.label}</mark>
        <mark>{sourceDepthEvidenceProgress.nextFocus}</mark>
        <p>Data 必須先補齊以下證據；完成前來源深度維持尚未就緒。</p>
        <div>
          {sourceDepthEvidenceItems.map((item) => (
            <span key={item.label}>
              <b>{item.label}</b>
              <small>{item.owner}</small>
              <i>{item.acceptance}</i>
              <em>{formatRuntimeValue(item.state)}</em>
            </span>
          ))}
        </div>
      </div>
      <div className="cp3-runtime-state-blockers" aria-label="Runtime blockers">
        {blockers.map((blocker) => (
          <span key={blocker}>{blocker}</span>
        ))}
      </div>
      <div className="cp3-runtime-fast-follow-gates" aria-label="Runtime fast-follow gates">
        <strong>Fast-follow gates</strong>
        <p>以下項目只能作為下一步審核路線；完成 gate 前不得切換正式資料或公開宣稱。</p>
        <div>
          {fastFollowGates.map((gate) => (
            <span key={gate.gate}>
              <b>{gate.label}</b>
              <small>{gate.owner}</small>
              <i>{gate.reason}</i>
              <em>{formatRuntimeValue(gate.state)}</em>
            </span>
          ))}
        </div>
      </div>
      <div className="cp3-runtime-route-work-queue" aria-label="Runtime route work queue">
        <strong>PM route work queue</strong>
        <p>僅列本地準備工作；不代表外部資料、SQL 或正式分數已授權。</p>
        <div>
          {routeWorkQueue.map((item) => (
            <span key={item.id}>
              <b>{item.label}</b>
              <small>{item.owner}</small>
              <i>{item.nextAction}</i>
              <em>{formatRuntimeValue(item.state)}</em>
            </span>
          ))}
        </div>
      </div>
      <div className="cp3-runtime-stop-lines" aria-label="Runtime stop lines">
        {stopLines.map((line) => (
          <span key={line}>{line}</span>
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

function buildRuntimeDecisionSummary(state: Cp3MockOnlyRuntimeState) {
  if (state.scoreSource === "mock" && state.sourceDepthState === "not_ready") {
    return "維持 mock-only；CP3 不可進入真實資料、正式分數或公開投資宣稱。";
  }

  return "維持人工覆核；CP3 不可自動升級為正式 runtime。";
}

function buildRuntimeStopLines() {
  return ["不可轉正式分數", "不可連接真實資料", "不可作為投資結論", "不可發布公開宣稱"];
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
