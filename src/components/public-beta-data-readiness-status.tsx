import { getPublicBetaDataReadinessStatus } from "@/lib/public-beta-data-readiness-status";

const laneStatusLabels = {
  accepted: "已接受",
  blocked: "暫停",
  readying: "準備中"
} as const;

const sourceStatusLabels = {
  blocked: "暫停",
  candidate: "候選",
  reviewing: "檢查中"
} as const;

export function PublicBetaDataReadinessStatus() {
  const status = getPublicBetaDataReadinessStatus();

  return (
    <section className="public-beta-data-readiness-status" aria-label="Public Beta data readiness status">
      <div className="public-beta-data-readiness-status-main">
        <p className="eyebrow">資料準備狀態</p>
        <h2>{status.headline}</h2>
        <p>{status.summary}</p>
        <p>{status.stopLine}</p>
      </div>
      <article className="readying">
        <span>覆蓋率證據</span>
        <strong>{status.rowCoverage.label}</strong>
        <p>
          已接受證據 {status.rowCoverage.acceptedRows}/{status.rowCoverage.targetRows}；這不是完整覆蓋率承諾。
        </p>
      </article>
      <article className="readying">
        <span>TWII 前置條件</span>
        <strong>
          {status.twiiPrerequisites.acceptedSlots}/{status.twiiPrerequisites.totalSlots} 已可進入 gate 準備
        </strong>
        <p>{status.twiiPrerequisites.nextAction}</p>
      </article>
      <article className="active">
        <span>公開資料邊界</span>
        <strong>
          {status.publicDataSource} / {status.scoreSource}
        </strong>
        <p>公開 Beta 仍維持 mock；真實資料與真實分數需要另外通過升級 gate。</p>
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
