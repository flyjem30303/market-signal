import { getPublicBetaDataReadinessStatus } from "@/lib/public-beta-data-readiness-status";

export function PublicBetaDataReadinessStatus() {
  const status = getPublicBetaDataReadinessStatus();

  return (
    <section className="public-beta-data-readiness-status" aria-label="公開 Beta 資料狀態">
      <div className="public-beta-data-readiness-status-main">
        <p className="eyebrow">資料狀態</p>
        <h2>{status.headline}</h2>
        <p>{status.summary}</p>
        <p>{status.stopLine}</p>
      </div>
      <div className="public-beta-data-actionability" aria-label="資料可用性">
        {status.lanes.map((lane) => (
          <article className={lane.status} key={lane.id}>
            <span>{lane.label}</span>
            <strong>{lane.status === "accepted" ? "可作為內部證據" : lane.status === "readying" ? "準備中" : "尚未可公開切換"}</strong>
            <p>{lane.summary}</p>
          </article>
        ))}
      </div>
      <div className="public-beta-data-upgrade-readiness" aria-label="正式資料升級檢查">
        <p className="eyebrow">正式資料升級前檢查</p>
        {status.upgradeChecks.map((lane) => (
          <article className={lane.status} key={lane.id}>
            <span>{lane.label}</span>
            <strong>{lane.status === "blocked" ? "不得升級公開資料" : "可進入審核"}</strong>
            <p>{lane.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
