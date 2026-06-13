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
        <span>目前可用</span>
        <strong>示範資料閱讀</strong>
        <p>{productSummary.useNow.body}</p>
      </article>
      <article className="readying">
        <span>後端證據</span>
        <strong>{postReadonly.objectsReachable} 個唯讀物件曾通過檢查</strong>
        <p>{postReadonly.userFacingSummary}</p>
      </article>
      <article className="blocked">
        <span>尚未上線</span>
        <strong>正式資料與正式分數仍未啟用</strong>
        <p>{postReadonly.stopLine}</p>
      </article>
    </section>
  );
}
