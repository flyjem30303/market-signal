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
        <span>目前公開模式</span>
        <strong>維持 mock 燈號</strong>
        <p>{productSummary.useNow.body}</p>
      </article>
      <article className="readying">
        <span>資料覆蓋</span>
        <strong>
          {postReadonly.rowCoverage.observedRows}/{postReadonly.rowCoverage.expectedRows} rows 已補齊
        </strong>
        <p>{postReadonly.userFacingSummary}</p>
      </article>
      <article className="blocked">
        <span>切換條件</span>
        <strong>promotion gate 通過前不切 real</strong>
        <p>{postReadonly.stopLine}</p>
      </article>
    </section>
  );
}
