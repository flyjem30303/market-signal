import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getBlockerReadinessSummary } from "@/lib/blocker-readiness";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";
import { getRuntimeInterpretationSummary } from "@/lib/runtime-interpretation";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";
import { getPublicRuntimeBoundaryCopy } from "@/lib/public-runtime-boundary-copy";
import { getRuntimeDeliveryCadence } from "@/lib/runtime-delivery-cadence";
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
  const runtimeDeliveryCadence = getRuntimeDeliveryCadence();

  return (
    <section className="stock-runtime-at-a-glance" aria-label="Stock runtime status">
      <div>
        <p className="eyebrow">Runtime At A Glance</p>
        <h2>{snapshot.asset.symbol} 仍是 mock-only runtime</h2>
        <p>
          這個個股頁可以協助閱讀 mock 訊號與缺口，但尚未完成真實市場資料接軌。
          在 post-run review 與必要 gate 通過前，不能宣稱真實資料覆蓋，也不能切換 scoreSource=real。
        </p>
      </div>
      <article className="active runtime-delivery-card">
        <span>Delivery cadence</span>
        <strong>{runtimeDeliveryCadence.nextExecutionRatio}</strong>
        <p>{runtimeDeliveryCadence.targetSliceSize}</p>
      </article>
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
      <article className="readying compact-runtime-blocker runtime-cutpoint-card">
        <span>Mandatory cutpoints</span>
        <strong>necessary gates remain</strong>
        <p>{runtimeDeliveryCadence.mandatoryCutpoints.slice(0, 3).join("; ")}.</p>
      </article>
      <article className="blocked compact-runtime-blocker">
        <span>Blocker readiness</span>
        <strong>{blockerReadiness.status}</strong>
        <p>Data / Legal / Investment checklists are local-ready. {runtimeInterpretation.stopLine}</p>
      </article>
    </section>
  );
}
