import { getPublicBetaPublicStatusSurface } from "@/lib/public-beta-public-status-surface";

export function PublicBetaPublicStatusSurface() {
  const surface = getPublicBetaPublicStatusSurface();

  return (
    <section className="public-beta-public-status-surface" aria-label="公開 Beta 使用狀態">
      <div className="public-beta-public-status-surface__head">
        <p className="eyebrow">公開 Beta 使用狀態</p>
        <h2>{surface.headline}</h2>
        <p>{surface.summary}</p>
      </div>
      <div className="public-beta-public-status-surface__grid">
        {surface.cards.map((card) => (
          <article className={card.tone} key={card.title}>
            <span>{card.label}</span>
            <strong>{card.title}</strong>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
      <p className="public-beta-public-status-surface__stop-line">{surface.stopLine}</p>
    </section>
  );
}
