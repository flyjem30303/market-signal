import { getPublicBetaDataReadinessStatus } from "@/lib/public-beta-data-readiness-status";

const laneStatusLabels = {
  accepted: "已納入 mock 示範",
  blocked: "等待條件",
  readying: "準備中"
} as const;

const sourceStatusLabels = {
  blocked: "暫不開放",
  candidate: "候選",
  reviewing: "確認中"
} as const;

const coverageScopeStatusLabels = {
  blocked: "等待來源條件",
  candidate: "候選線",
  future: "後續階段",
  "mock-ready": "mock 示範可用"
} as const;

const twiiTermsStatusLabels = {
  blocked: "暫不開放",
  "ready-for-copy": "可作為公開說明",
  "review-required": "仍需 review"
} as const;

const boundedReadonlyStatusLabels = {
  blocked: "目前鎖住",
  prepared: "安全形狀已準備",
  required: "必要條件"
} as const;

const operatorDecisionStatusLabels = {
  blocked: "blocked",
  ready: "ready",
  waiting: "waiting"
} as const;

export function PublicBetaDataReadinessStatus() {
  const status = getPublicBetaDataReadinessStatus();

  return (
    <section className="public-beta-data-readiness-status" aria-label="Public Beta data readiness status">
      <div className="public-beta-data-readiness-status-main">
        <p className="eyebrow">Data Readiness</p>
        <h2>{status.headline}</h2>
        <p>{status.summary}</p>
        <p>{status.stopLine}</p>
      </div>
      <article className="readying">
        <span>覆蓋證據</span>
        <strong>{status.rowCoverage.label}</strong>
        <p>
          目前檢查進度 {status.rowCoverage.acceptedRows}/{status.rowCoverage.targetRows}；這只是資料準備狀態，不代表真實資料已上線。
        </p>
      </article>
      <article className="readying">
        <span>TWII 前置條件</span>
        <strong>
          {status.twiiPrerequisites.acceptedSlots}/{status.twiiPrerequisites.totalSlots} 項已整理
        </strong>
        <p>{status.twiiPrerequisites.nextAction}</p>
      </article>
      <article className="active">
        <span>公開資料邊界</span>
        <strong>
          {status.publicDataSource} / {status.scoreSource}
        </strong>
        <p>公開 Beta 仍維持 mock；任何 real-data promotion 都需要另行通過資料與法務 gate。</p>
      </article>
      <div className="public-beta-source-trust">
        {status.sourceTrust.map((item) => (
          <article className={item.status} key={item.id}>
            <span>{item.label}</span>
            <strong>{sourceStatusLabels[item.status]}</strong>
            <p>{item.summary}</p>
            <p>下一步：{item.nextStep}</p>
          </article>
        ))}
      </div>
      <div className="public-beta-twii-terms-readiness" aria-label="TWII terms field cadence attribution readiness">
        {status.twiiTermsReadiness.map((item) => (
          <article className={item.status} key={item.id}>
            <span>{item.label}</span>
            <strong>{item.publicLabel}</strong>
            <p>{twiiTermsStatusLabels[item.status]}</p>
            <p>{item.summary}</p>
            <p>下一步：{item.nextStep}</p>
          </article>
        ))}
      </div>
      <div className="public-beta-bounded-readonly-requirements" aria-label="Bounded readonly gate requirements">
        {status.boundedReadonlyRequirements.map((item) => (
          <article className={item.status} key={item.id}>
            <span>{item.label}</span>
            <strong>{item.publicLabel}</strong>
            <p>{boundedReadonlyStatusLabels[item.status]}</p>
            <p>{item.summary}</p>
          </article>
        ))}
      </div>
      <div className="public-beta-twii-decision-readiness" aria-label="TWII data decision readiness">
        {status.operatorDecisionReadiness.map((item) => (
          <article className={item.status} key={item.id}>
            <span>{item.label}</span>
            <strong>{item.publicLabel}</strong>
            <p>{operatorDecisionStatusLabels[item.status]}</p>
            <p>{item.summary}</p>
            <p>下一步：{item.nextStep}</p>
          </article>
        ))}
      </div>
      <div className="public-beta-coverage-artifact-scopes" aria-label="Public Beta next coverage artifact scopes">
        {status.coverageArtifactScopes.map((scope) => (
          <article className={scope.status} key={scope.id}>
            <span>{scope.label}</span>
            <strong>{scope.publicLabel}</strong>
            <p>{coverageScopeStatusLabels[scope.status]}</p>
            <p>{scope.summary}</p>
          </article>
        ))}
      </div>
      <div className="public-beta-data-readiness-lanes">
        {status.lanes.map((lane) => (
          <article className={lane.status} key={lane.id}>
            <span>{lane.label}</span>
            <strong>{laneStatusLabels[lane.status]}</strong>
            <p>{lane.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
