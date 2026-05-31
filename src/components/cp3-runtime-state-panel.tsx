import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import {
  cp3MockOnlyUiCopyTokens,
  getMockOnlyDataQualityRoleReviewGuard,
  getMockOnlyFastFollowGates,
  getMockOnlyMetadataQualitySeparationGuard,
  getMockOnlyPublicDisplayState,
  getMockOnlyRuntimeAuthorizationSnapshot,
  getMockOnlyRuntimeCommandCenter,
  getMockOnlyRuntimeDataQualityDisclosure,
  getMockOnlyRuntimeMetadataDisclosure,
  getMockOnlyRuntimeNextGates,
  getMockOnlyRuntimeReadinessTriad,
  getMockOnlyRuntimeRouteDecision,
  getMockOnlyRuntimeRouteWorkProgress,
  getMockOnlyRuntimeRouteWorkQueue,
  getMockOnlyRuntimeSchemaShapeDisclosure,
  getMockOnlyRuntimeUpgradeProgress,
  getMockOnlyRuntimeUpgradeRequirements,
  getMockOnlyRuntimeUpgradeVerdict,
  getMockOnlySchemaContractGuard,
  getMockOnlySourceDepthEvidenceItems,
  getMockOnlySourceDepthEvidenceProgress,
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
  active: "執行中",
  active_local_only: "本地執行中",
  allowed: "允許",
  blocked: "阻擋",
  candidate: "候選",
  done: "完成",
  draft: "草稿",
  local_contract_only: "本地契約",
  local_mock_only: "本地 mock-only",
  mock: "mock",
  mock_local_only: "mock / local only",
  mock_metadata: "mock metadata",
  not_ready: "尚未就緒",
  partial: "部分可用",
  recorded: "已記錄",
  schema_shape_checked_not_quality: "schema shape 已檢查，不等於品質核准",
  schema_shape_local_only: "schema shape 本地契約",
  stale: "過期",
  supabase_metadata_reachable: "Supabase metadata 可讀",
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
  const upgradeVerdict = getMockOnlyRuntimeUpgradeVerdict();
  const sourceDepthEvidenceItems = getMockOnlySourceDepthEvidenceItems();
  const sourceDepthEvidenceProgress = getMockOnlySourceDepthEvidenceProgress();
  const fastFollowGates = getMockOnlyFastFollowGates();
  const routeDecision = getMockOnlyRuntimeRouteDecision();
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
  const schemaContractGuard = getMockOnlySchemaContractGuard();
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
        <RuntimeStateItem label="metadata 可讀性" value={runtimeState.metadataReachabilityState} />
        <RuntimeStateItem label="schema shape" value={runtimeState.schemaShapeState} />
      </div>

      <div className="cp3-runtime-state-disclosure">
        <strong>{copy.disclosure}</strong>
        <span>{copy.claimLimit}</span>
      </div>

      <div className="cp3-runtime-command-center" aria-label="Runtime command center">
        <strong>CEO / PM command center</strong>
        <p>{commandCenter.summary}</p>
        <section>
          <span>
            <b>現在做</b>
            <i>{commandCenter.doNow}</i>
          </span>
          <span>
            <b>接著準備</b>
            <i>{commandCenter.doNext}</i>
          </span>
          <span>
            <b>現在不做</b>
            <i>{commandCenter.doNotDo}</i>
          </span>
        </section>
        <aside>
          <span>
            <b>優先序</b>
            <i>{commandCenter.priorityLabel}</i>
          </span>
          <span>
            <b>主要風險</b>
            <i>{commandCenter.riskLabel}</i>
          </span>
          <span>
            <b>證據等級</b>
            <i>{formatRuntimeValue(commandCenter.evidenceLevel)}</i>
          </span>
        </aside>
      </div>

      <div className="cp3-runtime-decision-summary" aria-label="Runtime decision summary">
        <strong>CEO runtime 結論</strong>
        <span>{decisionSummary}</span>
      </div>

      <div className="cp3-runtime-route-decision" aria-label="Runtime route decision">
        <strong>{routeDecision.label}</strong>
        <span>{routeDecision.reason}</span>
        <em>{routeDecision.nextAction}</em>
      </div>

      <details className="cp3-runtime-detail-group">
        <summary>資料狀態與 guard 明細</summary>

        <RuntimeDisclosure className="cp3-runtime-metadata-disclosure" item={metadataDisclosure} />
        <RuntimeDisclosure className="cp3-runtime-schema-shape-disclosure" item={schemaShapeDisclosure} />
        <RuntimeDisclosure className="cp3-runtime-data-quality-disclosure" item={dataQualityDisclosure} />

        <GuardBlock
          className="cp3-runtime-metadata-quality-guard"
          label={metadataQualityGuard.label}
          nextGate={metadataQualityGuard.nextGate}
          owner={metadataQualityGuard.owner}
          state={metadataQualityGuard.state}
          allowedClaims={metadataQualityGuard.allowedClaims}
          blockedClaims={metadataQualityGuard.blockedClaims}
        />
        <GuardBlock
          className="cp3-runtime-schema-contract-guard"
          label={schemaContractGuard.label}
          nextGate={schemaContractGuard.nextGate}
          owner={schemaContractGuard.owner}
          state={schemaContractGuard.state}
          allowedClaims={schemaContractGuard.allowedClaims}
          blockedClaims={schemaContractGuard.blockedClaims}
        />
        <GuardBlock
          className="cp3-runtime-data-quality-role-guard"
          label={dataQualityRoleReviewGuard.label}
          nextGate={dataQualityRoleReviewGuard.nextGate}
          owner={dataQualityRoleReviewGuard.owner}
          state={dataQualityRoleReviewGuard.state}
          allowedClaims={dataQualityRoleReviewGuard.allowedClaims}
          blockedClaims={dataQualityRoleReviewGuard.blockedClaims}
        />

        <div className="cp3-runtime-readiness-triad" aria-label="Runtime readiness triad">
          <strong>CEO runtime triad</strong>
          <p>把 metadata、schema shape、data quality 拆開看，避免把局部可讀誤認為正式資料就緒。</p>
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
          <p>下一階段只開高價值 gate，避免治理過細造成推進變慢。</p>
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
      </details>

      <details className="cp3-runtime-command-details">
        <summary>角色、handoff 與 external gate 明細</summary>
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
        <article aria-label={commandCenter.localContractConceptsLabel}>
          <b>{commandCenter.localContractConceptsLabel}</b>
          {commandCenter.localContractConcepts.map((item) => (
            <span key={item.id}>
              <strong>{item.label}</strong>
              <small>{item.owner}</small>
              <i>{item.runtimeUse}</i>
              <i>{item.evidenceUse}</i>
              <em>{formatRuntimeValue(item.state)}</em>
            </span>
          ))}
        </article>
        <article>
          <b>Runtime milestones</b>
          {commandCenter.milestones.map((item) => (
            <span key={item.label}>
              <strong>{item.label}</strong>
              <small>{item.owner}</small>
              <i>{item.note}</i>
              <em>{formatRuntimeValue(item.state)}</em>
            </span>
          ))}
        </article>
        <nav aria-label="Runtime execution lanes">
          <b>Execution lanes</b>
          {commandCenter.executionLanes.map((item) => (
            <span key={item.label}>
              <strong>{item.label}</strong>
              <small>{item.owner}</small>
              <i>{item.work}</i>
              <i>{item.boundary}</i>
              <em>{formatRuntimeValue(item.state)}</em>
            </span>
          ))}
        </nav>
        <footer aria-label="External readiness checks">
          <b>External readiness checks</b>
          {commandCenter.externalReadinessChecks.map((item) => (
            <span key={item.label}>
              <strong>{item.label}</strong>
              <small>{item.owner}</small>
              <i>{item.criterion}</i>
              <em>{formatRuntimeValue(item.state)}</em>
            </span>
          ))}
        </footer>
        <menu aria-label="Gate proposal queue">
          <b>{commandCenter.gateProposalQueueLabel}</b>
          <mark>{commandCenter.gateProposalProgress.label}</mark>
          <mark>{commandCenter.gateProposalProgress.nextDraftLabel}</mark>
          <mark>{commandCenter.gateProposalProgress.blockedExecutionLabel}</mark>
          {commandCenter.gateProposalQueue.map((item) => (
            <span key={item.label}>
              <strong>
                {item.sequence}. {item.label}
              </strong>
              <small>{item.owner}</small>
              <i>{item.boundary}</i>
              <em>{formatRuntimeValue(item.state)}</em>
            </span>
          ))}
        </menu>
      </details>

      <details className="cp3-runtime-detail-group">
        <summary>升級條件與後續 work queue</summary>
        <div className="cp3-runtime-upgrade-requirements" aria-label="Runtime upgrade requirements">
          <strong>升級到正式資料前的條件</strong>
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
          <strong>來源深度證據焦點</strong>
          <mark>{sourceDepthEvidenceProgress.label}</mark>
          <mark>{sourceDepthEvidenceProgress.nextFocus}</mark>
          <p>Data 要先建立證據框架，不能在這個切片抓市場資料或寫入資料庫。</p>
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
          <p>只保留會讓專案往真實 runtime 前進的 gate，低價值治理細節延後。</p>
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
          <p>目前先走本地可落地工作；外部資料、SQL、正式分數另開 gate。</p>
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
      </details>
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

function RuntimeDisclosure({
  className,
  item
}: {
  className: string;
  item: { label: string; note: string; state: string };
}) {
  return (
    <div className={className} aria-label={item.label}>
      <strong>{item.label}</strong>
      <span>{item.note}</span>
      <em>{formatRuntimeValue(item.state)}</em>
    </div>
  );
}

function GuardBlock({
  allowedClaims,
  blockedClaims,
  className,
  label,
  nextGate,
  owner,
  state
}: {
  allowedClaims: string[];
  blockedClaims: string[];
  className: string;
  label: string;
  nextGate: string;
  owner: string;
  state: string;
}) {
  return (
    <div className={className} aria-label={label}>
      <strong>{label}</strong>
      <p>{nextGate}</p>
      <div>
        <span>
          <b>可說</b>
          {allowedClaims.map((claim) => (
            <i key={claim}>{claim}</i>
          ))}
        </span>
        <span>
          <b>不可說</b>
          {blockedClaims.map((claim) => (
            <i key={claim}>{claim}</i>
          ))}
        </span>
        <span>
          <b>Owner</b>
          <i>{owner}</i>
          <em>{formatRuntimeValue(state)}</em>
        </span>
      </div>
    </div>
  );
}

function formatRuntimeValue(value: string | number) {
  return runtimeValueLabels[String(value)] ?? value;
}

function buildRuntimeBlockers(state: Cp3MockOnlyRuntimeState) {
  return [
    state.scoreSource === "mock" ? "分數來源仍為 mock" : null,
    state.metadataReachabilityState === "supabase_metadata_reachable"
      ? "Freshness metadata 可讀，不等於資料品質核准"
      : "metadata 仍為 mock",
    state.schemaShapeState === "schema_shape_checked_not_quality"
      ? "Schema shape 已檢查，不等於 row completeness"
      : "schema shape 仍為本地契約",
    `資料品質狀態：${formatRuntimeValue(state.dataQualityState)}`,
    `資料契約：${formatRuntimeValue(state.contractState)}`,
    `來源深度：${formatRuntimeValue(state.sourceDepthState)}`,
    `來源權利：${formatRuntimeValue(state.sourceRightsState)}`,
    `公開宣稱：${formatRuntimeValue(state.claimApprovalState)}`,
    `回測核准：${formatRuntimeValue(state.backtestApprovalState)}`
  ].filter((item): item is string => Boolean(item));
}

function buildRuntimeDecisionSummary(state: Cp3MockOnlyRuntimeState) {
  if (state.scoreSource === "mock" && state.sourceDepthState === "not_ready") {
    return "維持 mock-only。可以改善本地 runtime 與 guard，但不能接真實市場資料、不能跑 SQL、不能設定 scoreSource=real。";
  }

  return "偵測到未預期 runtime 狀態，需停下由 CEO / PM 覆核。";
}

function buildRuntimeStopLines() {
  return [
    "不得連線 Supabase",
    "不得執行 SQL",
    "不得抓取或寫入真實市場資料",
    "不得寫入 staging 或 daily_prices",
    "不得建立 seed SQL",
    "不得設定 scoreSource=real",
    "不得發布正式投資或市場宣稱"
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
