import { getPublicBetaDataReadinessStatus } from "@/lib/public-beta-data-readiness-status";

export function PublicBetaDataReadinessStatus() {
  const status = getPublicBetaDataReadinessStatus();

  return (
    <section className="public-beta-data-readiness-status" aria-label="公開 Beta 資料準備狀態">
      <div className="public-beta-data-readiness-status-main">
        <p className="eyebrow">資料上線狀態</p>
        <h2>{status.headline}</h2>
        <p>{status.summary}</p>
        <p>{status.stopLine}</p>
      </div>
      <div className="public-beta-data-actionability" aria-label="目前可閱讀內容">
        {status.lanes.map((lane) => (
          <article className={lane.status} key={lane.id}>
            <span>{lane.label}</span>
            <strong>{lane.status === "accepted" ? "可閱讀" : lane.status === "readying" ? "需複核" : "不可當指令"}</strong>
            <p>{lane.summary}</p>
          </article>
        ))}
      </div>
      <div className="public-beta-data-upgrade-readiness" aria-label="正式資料升級條件">
        <p className="eyebrow">正式資料升級前檢查</p>
        {status.upgradeChecks.map((lane) => (
          <article className={lane.status} key={lane.id}>
            <span>{lane.label}</span>
            <strong>{lane.status === "blocked" ? "需完成公開回退" : "需確認"}</strong>
            <p>{lane.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
