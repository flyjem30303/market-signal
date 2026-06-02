import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import { getFreshnessEvidenceBoundarySummary } from "@/lib/freshness-evidence-boundary";

type FreshnessEvidenceBoundaryProps = {
  freshness: DataFreshnessSnapshot;
};

export function FreshnessEvidenceBoundary({ freshness }: FreshnessEvidenceBoundaryProps) {
  const boundary = getFreshnessEvidenceBoundarySummary(freshness);

  return (
    <section className="freshness-evidence-boundary" aria-label="Freshness evidence boundary">
      <div>
        <span>Evidence boundary</span>
        <strong>{boundary.headline}</strong>
        <p>{boundary.summary}</p>
      </div>
      {boundary.items.map((item) => (
        <article className={item.tone} key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <p>{item.body}</p>
        </article>
      ))}
      <p className="freshness-evidence-stop-line">{boundary.stopLine}</p>
    </section>
  );
}
