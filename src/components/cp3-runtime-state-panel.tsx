import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import {
  cp3MockOnlyUiCopyTokens,
  getMockOnlyDataQualityRoleReviewGuard,
  getMockOnlyFastFollowGates,
  getMockOnlyMetadataQualitySeparationGuard,
  getMockOnlyPublicDisplayState,
  getMockOnlyRuntimeRouteDecision,
  getMockOnlyRuntimeRouteWorkProgress,
  getMockOnlyRuntimeRouteWorkQueue,
  getMockOnlyRuntimeMetadataDisclosure,
  getMockOnlyRuntimeSchemaShapeDisclosure,
  getMockOnlyRuntimeDataQualityDisclosure,
  getMockOnlyRuntimeAuthorizationSnapshot,
  getMockOnlyRuntimeCommandCenter,
  getMockOnlyRuntimeReadinessTriad,
  getMockOnlyRuntimeNextGates,
  getMockOnlySchemaContractGuard,
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
  allowed: "可執行",
  active_local_only: "本地執行中",
  blocked: "封鎖",
  candidate: "候選模型",
  local_contract_only: "本地契約",
  local_mock_only: "本地 mock-only",
  mock_local_only: "mock / local only",
  mock_metadata: "模擬 metadata",
  mock: "模擬分數",
  not_ready: "尚未就緒",
  partial: "部分就緒",
  recorded: "已記錄",
  schema_shape_checked_not_quality: "schema shape 窄證據",
  schema_shape_local_only: "schema shape 本地契約",
  stale: "新鮮度不足",
  supabase_metadata_reachable: "Supabase metadata 可達",
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
  const routeWorkProgress = getMockOnlyRuntimeRouteWorkProgress();
  const metadataDisclosure = getMockOnlyRuntimeMetadataDisclosure(runtimeState);
  const schemaShapeDisclosure = getMockOnlyRuntimeSchemaShapeDisclosure(runtimeState);
  const dataQualityDisclosure = getMockOnlyRuntimeDataQualityDisclosure(runtimeState);
  const authorizationSnapshot = getMockOnlyRuntimeAuthorizationSnapshot();
  const commandCenter = getMockOnlyRuntimeCommandCenter(runtimeState);
  const readinessTriad = getMockOnlyRuntimeReadinessTriad(runtimeState);
  const dataQualityRoleReviewGuard = getMockOnlyDataQualityRoleReviewGuard(runtimeState);
  const metadataQualityGuard = getMockOnlyMetadataQualitySeparationGuard(runtimeState);
  const schemaContractGuard = getMockOnlySchemaContractGuard(runtimeState);
  const nextGates = getMockOnlyRuntimeNextGates(runtimeState);
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
        <RuntimeStateItem label="metadata 可達性" value={runtimeState.metadataReachabilityState} />
        <RuntimeStateItem label="schema shape" value={runtimeState.schemaShapeState} />
      </div>
      <div className="cp3-runtime-state-disclosure">
        <strong>{copy.disclosure}</strong>
        <span>{copy.claimLimit}</span>
      </div>
      <div className="cp3-runtime-metadata-disclosure" aria-label="Runtime metadata disclosure">
        <strong>{metadataDisclosure.label}</strong>
        <span>{metadataDisclosure.note}</span>
      </div>
      <div className="cp3-runtime-schema-shape-disclosure" aria-label="Runtime schema shape disclosure">
        <strong>{schemaShapeDisclosure.label}</strong>
        <span>{schemaShapeDisclosure.note}</span>
      </div>
      <div className="cp3-runtime-data-quality-disclosure" aria-label="Runtime data quality disclosure">
        <strong>{dataQualityDisclosure.label}</strong>
        <span>{dataQualityDisclosure.note}</span>
      </div>
      <div className="cp3-runtime-metadata-quality-guard" aria-label="Metadata quality separation guard">
        <strong>{metadataQualityGuard.label}</strong>
        <p>{metadataQualityGuard.nextGate}</p>
        <div>
          <span>
            <b>可表述</b>
            {metadataQualityGuard.allowedClaims.map((claim) => (
              <i key={claim}>{claim}</i>
            ))}
          </span>
          <span>
            <b>不可表述</b>
            {metadataQualityGuard.blockedClaims.map((claim) => (
              <i key={claim}>{claim}</i>
            ))}
          </span>
          <span>
            <b>Owner</b>
            <i>{metadataQualityGuard.owner}</i>
            <em>{formatRuntimeValue(metadataQualityGuard.state)}</em>
          </span>
        </div>
      </div>
      <div className="cp3-runtime-schema-contract-guard" aria-label="Schema contract guard">
        <strong>{schemaContractGuard.label}</strong>
        <p>{schemaContractGuard.nextGate}</p>
        <div>
          <span>
            <b>可表述</b>
            {schemaContractGuard.allowedClaims.map((claim) => (
              <i key={claim}>{claim}</i>
            ))}
          </span>
          <span>
            <b>不可表述</b>
            {schemaContractGuard.blockedClaims.map((claim) => (
              <i key={claim}>{claim}</i>
            ))}
          </span>
          <span>
            <b>Owner</b>
            <i>{schemaContractGuard.owner}</i>
            <em>{formatRuntimeValue(schemaContractGuard.state)}</em>
          </span>
        </div>
      </div>
      <div className="cp3-runtime-data-quality-role-guard" aria-label="Data quality role review guard">
        <strong>{dataQualityRoleReviewGuard.label}</strong>
        <p>{dataQualityRoleReviewGuard.nextGate}</p>
        <div>
          <span>
            <b>可表述</b>
            {dataQualityRoleReviewGuard.allowedClaims.map((claim) => (
              <i key={claim}>{claim}</i>
            ))}
          </span>
          <span>
            <b>不可表述</b>
            {dataQualityRoleReviewGuard.blockedClaims.map((claim) => (
              <i key={claim}>{claim}</i>
            ))}
          </span>
          <span>
            <b>Owner</b>
            <i>{dataQualityRoleReviewGuard.owner}</i>
            <em>{formatRuntimeValue(dataQualityRoleReviewGuard.state)}</em>
          </span>
        </div>
      </div>
      <div className="cp3-runtime-readiness-triad" aria-label="Runtime readiness triad">
        <strong>CEO runtime triad</strong>
        <p>三條線分開判讀；任何一條可讀或有窄證據，都不能自動升級成正式資料或正式分數。</p>
        <div>
          {readinessTriad.map((item) => (
            <span key={item.id}>
              <b>{item.label}</b>
              <i>{item.interpretation}</i>
              <small>{item.nextGate}</small>
              <em>{formatRuntimeValue(item.state)}</em>
            </span>
          ))}
        </div>
      </div>
      <div className="cp3-runtime-next-gates" aria-label="Runtime next gates">
        <strong>CEO next gate ladder</strong>
        <p>下一步只做本地 gate 對齊；不得用這個 ladder 啟動 Supabase 寫入、SQL、市場資料抓取或正式分數切換。</p>
        <div>
          {nextGates.map((gate) => (
            <span key={gate.id}>
              <b>
                {gate.sequence}. {gate.label}
              </b>
              <small>{gate.owner}</small>
              <i>{gate.reason}</i>
              <i>{gate.acceptance}</i>
              <em>{formatRuntimeValue(gate.state)}</em>
            </span>
          ))}
        </div>
      </div>
      <div className="cp3-runtime-authorization-snapshot" aria-label="Runtime authorization snapshot">
        <strong>CEO authorization snapshot</strong>
        <p>{authorizationSnapshot.nextAction}</p>
        <mark>{authorizationSnapshot.label}</mark>
        <div>
          {authorizationSnapshot.items.map((item) => (
            <span key={item.id}>
              <b>{item.label}</b>
              <small>{item.owner}</small>
              <i>{item.reason}</i>
              <em>{formatRuntimeValue(item.status)}</em>
            </span>
          ))}
        </div>
      </div>
      <div className="cp3-runtime-command-center" aria-label="Runtime command center">
        <strong>CEO / PM command center</strong>
        <p>{commandCenter.summary}</p>
        <section>
          <span>
            <b>Do now</b>
            <i>{commandCenter.doNow}</i>
          </span>
          <span>
            <b>Prepare next</b>
            <i>{commandCenter.doNext}</i>
          </span>
          <span>
            <b>Do not do</b>
            <i>{commandCenter.doNotDo}</i>
          </span>
        </section>
        <aside>
          <span>
            <b>Priority</b>
            <i>{commandCenter.priorityLabel}</i>
          </span>
          <span>
            <b>Risk</b>
            <i>{commandCenter.riskLabel}</i>
          </span>
          <span>
            <b>Evidence</b>
            <i>{formatRuntimeValue(commandCenter.evidenceLevel)}</i>
          </span>
        </aside>
        <div>
          <span>
            <b>Mode</b>
            <i>{formatRuntimeValue(commandCenter.operatingMode)}</i>
          </span>
          <span>
            <b>Execution</b>
            <i>{formatRuntimeValue(commandCenter.executionState)}</i>
          </span>
          <span>
            <b>Allowed lane</b>
            <i>{commandCenter.localLaneLabel}</i>
          </span>
          <span>
            <b>Blocked lane</b>
            <i>{commandCenter.blockedLaneLabel}</i>
          </span>
          <span>
            <b>Next gate</b>
            <i>{commandCenter.nextGateLabel}</i>
          </span>
          <span>
            <b>Next PM work</b>
            <i>{commandCenter.nextWorkLabel}</i>
          </span>
          <span>
            <b>Review cadence</b>
            <i>{commandCenter.reviewCadence}</i>
          </span>
          <span>
            <b>Stop condition</b>
            <i>{commandCenter.stopCondition}</i>
          </span>
        </div>
        <ul>
          {commandCenter.roleActions.map((item) => (
            <li key={`${item.owner}-${item.action}`}>
              <b>{item.owner}</b>
              <i>{item.action}</i>
              <em>{formatRuntimeValue(item.state)}</em>
            </li>
          ))}
        </ul>
        <ol>
          {commandCenter.handoffChecks.map((item) => (
            <li key={item.label}>
              <b>{item.label}</b>
              <em>{formatRuntimeValue(item.state)}</em>
            </li>
          ))}
        </ol>
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
        <mark>{routeWorkProgress.label}</mark>
        <mark>{routeWorkProgress.nextFocus}</mark>
        <div>
          {routeWorkQueue.map((item) => (
            <span key={item.id}>
              <b>{item.label}</b>
              <small>{item.owner}</small>
              <i>{item.nextAction}</i>
              <i>{item.acceptance}</i>
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
    metadataReachabilityState: freshness.isMock ? "mock_metadata" : "supabase_metadata_reachable",
    modelApprovalState: "candidate",
    modelVersion: snapshot.modelVersion,
    schemaShapeState: freshness.isMock ? "schema_shape_local_only" : "schema_shape_checked_not_quality",
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
    state.metadataReachabilityState === "supabase_metadata_reachable"
      ? "Freshness metadata 可達但不代表資料品質核准"
      : "metadata 仍為 mock",
    state.schemaShapeState === "schema_shape_checked_not_quality"
      ? "Schema shape 窄證據不代表 row completeness"
      : "schema shape 仍為本地契約",
    `資料品質折扣 ${formatRuntimeValue(state.dataQualityState)}`,
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
  return [
    "不可轉正式分數",
    "不可把 metadata 可達視為資料品質核准",
    "不可把 schema shape 視為資料完整或權利核准",
    "不可把資料品質折扣視為正式模型資格",
    "不可連接真實資料或寫入市場資料",
    "不可作為投資結論",
    "不可發布公開宣稱"
  ];
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
