import { getPublicBetaDataReadinessStatus } from "@/lib/public-beta-data-readiness-status";

export function PublicBetaDataReadinessStatus() {
  const status = getPublicBetaDataReadinessStatus();

  return (
    <section className="public-beta-data-readiness-status" aria-label="公開 Beta 資料可用性">
      <div className="public-beta-data-readiness-status-main">
        <p className="eyebrow">資料可用性</p>
        <h2>{status.headline}</h2>
        <p>{status.summary}</p>
        <p>{status.stopLine}</p>
      </div>
      <div className="public-beta-data-actionability" aria-label="目前資料可以怎麼使用">
        {status.lanes.map((lane) => (
          <article className={lane.status === "accepted" ? "active" : lane.status === "readying" ? "readying" : "blocked"} key={lane.id}>
            <span>{lane.label}</span>
            <strong>{lane.summary}</strong>
          </article>
        ))}
      </div>
      <div className="public-beta-data-upgrade-readiness" aria-label="正式資料升級前檢查">
        <p className="eyebrow">正式資料升級前檢查</p>
        {status.upgradeChecks.map((lane) => (
          <article className={lane.status === "accepted" ? "active" : lane.status === "readying" ? "readying" : "blocked"} key={lane.id}>
            <span>{lane.label}</span>
            <strong>{lane.summary}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
