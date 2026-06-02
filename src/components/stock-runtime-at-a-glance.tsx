import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getBlockerReadinessSummary } from "@/lib/blocker-readiness";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";
import { getRuntimeInterpretationSummary } from "@/lib/runtime-interpretation";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";
import { getPublicRuntimeBoundaryCopy } from "@/lib/public-runtime-boundary-copy";
import type { SignalSnapshot } from "@/lib/signal-model";

type StockRuntimeAtAGlanceProps = {
  scoreSourceLabel: string;
  snapshot: SignalSnapshot;
};

export function StockRuntimeAtAGlance({ scoreSourceLabel, snapshot }: StockRuntimeAtAGlanceProps) {
  const readiness = getRuntimeReadinessSummary();
  const blockerReadiness = getBlockerReadinessSummary();
  const rowCoverage = getRowCoverageSecondAttemptReadiness();
  const runtimeInterpretation = getRuntimeInterpretationSummary();
  const sourceDepth = getSourceDepthBlockerSummary();
  const boundaryCopy = getPublicRuntimeBoundaryCopy("stock");

  return (
    <section className="stock-runtime-at-a-glance" aria-label="Stock runtime status">
      <div>
        <p className="eyebrow">Runtime At A Glance</p>
        <h2>{snapshot.asset.symbol} 目前仍是 mock-only 狀態</h2>
        <p>
          這個頁面的分數與訊號仍是展示用 mock。row coverage readonly gate 已本地就緒，但尚未執行第二次
          Supabase readonly attempt；在 post-run review 之前，不能宣稱真實資料覆蓋，也不能切換 scoreSource=real。
          scoreSource=real 仍未完成。
        </p>
      </div>
      <article className="active runtime-boundary-copy-card">
        <span>Score source</span>
        <strong>{scoreSourceLabel}</strong>
        <p>公開分數仍由 mock runtime 提供，尚未進入真實市場資料計分，scoreSource=real 仍未完成。</p>
      </article>
      <article className="active">
        <span>Visible now</span>
        <strong>{boundaryCopy.headline}</strong>
        <p>{boundaryCopy.summary}</p>
        <p>{boundaryCopy.currentState}</p>
      </article>
      <article className="blocked runtime-boundary-copy-card">
        <span>Not live yet</span>
        <strong>real data blocked</strong>
        <p>{boundaryCopy.blockedState}</p>
        <p>{boundaryCopy.stopLine}</p>
      </article>
      <article className="blocked">
        <span>Source depth</span>
        <strong>{sourceDepth.sourceDepthState}</strong>
        <p>{sourceDepth.stopLine}</p>
      </article>
      <article className="readying">
        <span>Row coverage</span>
        <strong>{rowCoverage.readiness}</strong>
        <p>
          {rowCoverage.publicDataSource} / {rowCoverage.scoreSource}. {rowCoverage.stopLine}
        </p>
      </article>
      <article className="readying">
        <span>Next runtime gate</span>
        <strong>{readiness.score}% readiness</strong>
        <p>{rowCoverage.nextDecision}</p>
      </article>
      <article className="readying compact-runtime-blocker">
        <span>CEO track</span>
        <strong>{runtimeInterpretation.decision}</strong>
        <p>
          Runtime {runtimeInterpretation.laneRatio.mockRuntimeHardening}% / readonly prep{" "}
          {runtimeInterpretation.laneRatio.supabaseReadonlyPreparation}%. {runtimeInterpretation.blockers[0]}.
        </p>
      </article>
      <article className="blocked compact-runtime-blocker">
        <span>Blocker readiness</span>
        <strong>{blockerReadiness.status}</strong>
        <p>Data / Legal / Investment checklists are local-ready. {runtimeInterpretation.stopLine}</p>
      </article>
    </section>
  );
}
