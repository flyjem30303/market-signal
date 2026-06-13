import { getPublicClaimRuntimeState } from "@/lib/public-claim-runtime-state";

type PublicRuntimeStateStripProps = {
  context: "home" | "stock" | "briefing" | "weekly" | "trust";
};

export function PublicRuntimeStateStrip({ context }: PublicRuntimeStateStripProps) {
  const state = getPublicClaimRuntimeState();

  return (
    <section className="public-runtime-state-strip" aria-label={`${context} 公開使用邊界`}>
      <div>
        <p className="eyebrow">公開使用邊界</p>
        <h2>{state.headline}</h2>
        <p>{state.summary}</p>
      </div>
      {state.states.map((item) => (
        <article className={item.tone} key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <p>{item.body}</p>
        </article>
      ))}
      <p className="public-runtime-stop-line">{state.stopLine}</p>
    </section>
  );
}
