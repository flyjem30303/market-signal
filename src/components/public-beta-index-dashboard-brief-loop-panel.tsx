import { getPublicBetaIndexDashboardBriefLoop } from "@/lib/public-beta-index-dashboard-brief-loop";

export function PublicBetaIndexDashboardBriefLoopPanel() {
  const brief = getPublicBetaIndexDashboardBriefLoop();

  return (
    <section className="home-public-beta-loop" aria-label="Public Beta index dashboard brief loop">
      <div className="home-public-beta-loop__hero">
        <p className="eyebrow">Public Beta Index Dashboard</p>
        <h2>{brief.headline}</h2>
        <p>{brief.marketOverview}</p>
        <div className="home-public-beta-loop__timing" aria-label="decision timing">
          <strong>{brief.timeToUnderstand}</strong>
          <strong>{brief.timeToAction}</strong>
        </div>
      </div>

      <div className="home-public-beta-loop__grid" aria-label="core indicator panel">
        {brief.indicatorPanel.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <strong>{item.state}</strong>
            <p>{item.summary}</p>
          </article>
        ))}
      </div>

      <div className="home-public-beta-loop__actions" aria-label="decision helper">
        <article className="active">
          <span>第一步</span>
          <strong>{brief.primaryAction}</strong>
        </article>
        <article className="readying">
          <span>第二步</span>
          <strong>{brief.secondaryAction}</strong>
        </article>
      </div>

      <div className="home-public-beta-loop__alerts" aria-label="market alert list">
        {brief.alerts.map((alert) => (
          <article key={alert.title}>
            <div>
              <span>{alert.status}</span>
              <strong>{alert.title}</strong>
            </div>
            <p>{alert.cause}</p>
            <p>
              更新時間：{alert.updatedAt}；影響級別：{alert.impactLevel}
            </p>
            <p>下一步：{alert.nextStep}</p>
          </article>
        ))}
      </div>

      <p className="home-public-beta-loop__boundary">
        publicDataSource={brief.boundary.publicDataSource}; scoreSource={brief.boundary.scoreSource}. {brief.stopLine}
      </p>
    </section>
  );
}
