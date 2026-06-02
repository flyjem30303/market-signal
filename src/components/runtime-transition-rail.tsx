import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getRuntimeProductSummary } from "@/lib/runtime-product-summary";

type RuntimeTransitionRailProps = {
  symbol: string;
};

export function RuntimeTransitionRail({ symbol }: RuntimeTransitionRailProps) {
  const productSummary = getRuntimeProductSummary(symbol);
  const postReadonly = getPostReadonlyRuntimeState();

  return (
    <section className="runtime-transition-rail" aria-label="Runtime transition rail">
      <article className="active">
        <span>Live now</span>
        <strong>Mock runtime</strong>
        <p>{productSummary.useNow.body}</p>
      </article>
      <article className="readying">
        <span>Evidence ready</span>
        <strong>{postReadonly.objectsReachable} readonly objects</strong>
        <p>{postReadonly.userFacingSummary}</p>
      </article>
      <article className="blocked">
        <span>Not live yet</span>
        <strong>Real score blocked</strong>
        <p>{postReadonly.stopLine}</p>
      </article>
    </section>
  );
}
