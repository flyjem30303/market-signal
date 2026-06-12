import {
  getPublicBetaUsableLoop,
  type PublicBetaUsableLoopContext
} from "@/lib/public-beta-usable-loop";

type PublicBetaUsableLoopPanelProps = {
  context: PublicBetaUsableLoopContext;
  stockSymbol?: string;
};

export function PublicBetaUsableLoopPanel({
  context,
  stockSymbol = "TWII"
}: PublicBetaUsableLoopPanelProps) {
  const loop = getPublicBetaUsableLoop(context, stockSymbol);

  return (
    <section className="public-beta-usable-loop" aria-label="Public Beta usable decision loop">
      <div className="public-beta-usable-loop__head">
        <p className="eyebrow">可用閉環</p>
        <h2>{loop.headline}</h2>
        <p>{loop.summary}</p>
        <p>{loop.contextLine}</p>
      </div>

      <div className="public-beta-usable-loop__cards" aria-label="30 second and 3 minute usable loop">
        {loop.actionCards.map((card) => (
          <article className={card.tone} key={card.id}>
            <span>{card.label}</span>
            <strong>{card.title}</strong>
            <p>{card.body}</p>
          </article>
        ))}
      </div>

      <div className="public-beta-usable-loop__boundary" aria-label="Usable loop source and advice boundary">
        {loop.boundaryCards.map((card) => (
          <article className={card.tone} key={card.id}>
            <span>{card.label}</span>
            <strong>{card.title}</strong>
            <p>{card.body}</p>
          </article>
        ))}
      </div>

      <p className="public-beta-usable-loop__stop-line">{loop.stopLine}</p>
    </section>
  );
}
