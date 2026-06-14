import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getRuntimeProductSummary } from "@/lib/runtime-product-summary";

type RuntimeTransitionRailProps = {
  symbol: string;
};

export function RuntimeTransitionRail({ symbol }: RuntimeTransitionRailProps) {
  const productSummary = getRuntimeProductSummary(symbol);
  const postReadonly = getPostReadonlyRuntimeState();

  return (
    <section className="runtime-transition-rail" aria-label="資料切換狀態">
      <article className="active">
        <span>現在可用</span>
        <strong>示範燈號閱讀流程</strong>
        <p>{productSummary.useNow.body}</p>
      </article>
      <article className="readying">
        <span>讀取檢查</span>
        <strong>{postReadonly.objectsReachable} 個物件已可檢查</strong>
        <p>{postReadonly.userFacingSummary}</p>
      </article>
      <article className="blocked">
        <span>尚未正式</span>
        <strong>正式資料切換仍需通過上線條件</strong>
        <p>{postReadonly.stopLine}</p>
      </article>
    </section>
  );
}
