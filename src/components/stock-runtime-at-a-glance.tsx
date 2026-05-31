import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";
import type { SignalSnapshot } from "@/lib/signal-model";

type StockRuntimeAtAGlanceProps = {
  scoreSourceLabel: string;
  snapshot: SignalSnapshot;
};

export function StockRuntimeAtAGlance({ scoreSourceLabel, snapshot }: StockRuntimeAtAGlanceProps) {
  const readiness = getRuntimeReadinessSummary();
  const sourceDepth = getSourceDepthBlockerSummary();

  return (
    <section className="stock-runtime-at-a-glance" aria-label="股票頁 runtime 摘要">
      <div>
        <p className="eyebrow">Runtime At A Glance</p>
        <h2>
          {snapshot.asset.symbol} 目前仍是 mock-only 解讀
        </h2>
        <p>
          這個頁面可以用來閱讀訊號結構與缺口，但正式資料接軌、來源深度、權利審核與
          scoreSource=real 仍未完成。
        </p>
      </div>
      <article className="active">
        <span>目前可用</span>
        <strong>{scoreSourceLabel}</strong>
        <p>可瀏覽 mock 訊號、風險提示、資料缺口與 runtime 邊界。</p>
      </article>
      <article className="blocked">
        <span>目前封鎖</span>
        <strong>{sourceDepth.sourceDepthState}</strong>
        <p>{sourceDepth.stopLine}</p>
      </article>
      <article className="readying">
        <span>下一步</span>
        <strong>{readiness.score}% readiness</strong>
        <p>先補齊本地 runtime 可讀性與 guard，再由 CEO 另開外部系統 gate。</p>
      </article>
    </section>
  );
}
