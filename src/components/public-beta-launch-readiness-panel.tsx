import { getPublicBetaLaunchReadinessSummary } from "@/lib/public-beta-launch-readiness";

type PublicBetaLaunchReadinessPanelProps = {
  compact?: boolean;
};

export function PublicBetaLaunchReadinessPanel({ compact = false }: PublicBetaLaunchReadinessPanelProps) {
  const summary = getPublicBetaLaunchReadinessSummary();

  return (
    <section className={compact ? "public-beta-launch-readiness compact" : "public-beta-launch-readiness"} aria-label="公開 Beta 上線進度">
      <div className="public-beta-launch-readiness-head">
        <div>
          <p className="eyebrow">Public Beta Readiness</p>
          <h2>{summary.headline}</h2>
          <p>{summary.subhead}</p>
        </div>
        <div className="public-beta-launch-readiness-score" aria-label={`公開 Beta 上線前進度 ${summary.completionPercent}%`}>
          <strong>{summary.completionPercent}%</strong>
          <span>pre-launch executable</span>
          <small>commit {summary.asOfCommit}</small>
        </div>
      </div>

      <div className="public-beta-launch-readiness-grid">
        {summary.items.map((item) => (
          <article className={item.tone} key={item.id}>
            <span>{item.label}</span>
            <strong>{item.status}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="public-beta-launch-readiness-route">
        <article>
          <span>目前主要阻塞</span>
          <ul>
            {summary.blockedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <span>下一步 PM 指令</span>
          <code>{summary.nextCommand}</code>
          <p>{summary.nextDecision}</p>
        </article>
        <article>
          <span>公開資料邊界</span>
          <strong>
            publicDataSource={summary.runtimeBoundary.publicDataSource} / scoreSource={summary.runtimeBoundary.scoreSource}
          </strong>
          <p>{summary.stopLine}</p>
        </article>
      </div>
    </section>
  );
}
