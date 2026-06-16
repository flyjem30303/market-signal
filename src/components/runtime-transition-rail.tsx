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
        <strong>公開頁維持 mock 燈號</strong>
        <p>{productSummary.useNow.body}</p>
      </article>
      <article className="readying">
        <span>資料準備</span>
        <strong>{postReadonly.rowCoverage.observedRows}/{postReadonly.rowCoverage.expectedRows} rows 已完成</strong>
        <p>{postReadonly.userFacingSummary}</p>
      </article>
      <article className="blocked">
        <span>切換限制</span>
        <strong>promotion gate 通過前不切 real</strong>
        <p>{postReadonly.stopLine}</p>
      </article>
    </section>
  );
}
