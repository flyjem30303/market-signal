import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getBlockerReadinessSummary } from "@/lib/blocker-readiness";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";
import { getRuntimeInterpretationSummary } from "@/lib/runtime-interpretation";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";
import { getPublicRuntimeBoundaryCopy } from "@/lib/public-runtime-boundary-copy";
import { getRuntimeDeliveryCadence } from "@/lib/runtime-delivery-cadence";

type HomeRuntimeStatusPanelProps = {
  selectedSymbol: string;
};

export function HomeRuntimeStatusPanel({ selectedSymbol }: HomeRuntimeStatusPanelProps) {
  const readiness = getRuntimeReadinessSummary();
  const blockerReadiness = getBlockerReadinessSummary();
  const rowCoverage = getRowCoverageSecondAttemptReadiness();
  const runtimeInterpretation = getRuntimeInterpretationSummary();
  const sourceDepth = getSourceDepthBlockerSummary();
  const boundaryCopy = getPublicRuntimeBoundaryCopy("home");
  const runtimeDeliveryCadence = getRuntimeDeliveryCadence();

  return (
    <section className="home-runtime-status-panel" aria-label="Runtime status">
      <div>
        <p className="eyebrow">Runtime Status</p>
        <h2>目前仍是 mock-only runtime</h2>
        <p>
          {selectedSymbol} 目前可以瀏覽與比較 mock 訊號，但公開資料來源與分數來源仍維持 mock。
          CEO 已把推進節奏調整為較大的 runtime product slice，先提升可讀性與本地 guard，再另外開啟遠端 gate；
          scoreSource=real 仍未啟用。
        </p>
      </div>
      <article className="active runtime-delivery-card">
        <span>Delivery cadence</span>
        <strong>{runtimeDeliveryCadence.nextExecutionRatio}</strong>
        <p>{runtimeDeliveryCadence.targetSliceSize}</p>
      </article>
      <article className="active runtime-boundary-copy-card">
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
      <nav>
        <a href={`/stocks/${selectedSymbol}`}>查看個股頁</a>
        <a href="/briefing">查看 CEO/PM briefing</a>
      </nav>
      <details className="home-runtime-details">
        <summary>內部 runtime 細節（PM / 工程）</summary>
        <p>首頁先保留公開可讀結論；readiness、row coverage、source depth 與必要切點仍在這裡供內部檢查。</p>
        <div>
          <article className="readying">
            <span>Runtime readiness</span>
            <strong>{readiness.score}%</strong>
            <p>{readiness.status}</p>
          </article>
          <article className="blocked">
            <span>Source depth</span>
            <strong>{sourceDepth.sourceDepthState}</strong>
            <p>scoreSource: {sourceDepth.scoreSource}</p>
          </article>
          <article className="readying">
            <span>Row coverage</span>
            <strong>{rowCoverage.readiness}</strong>
            <p>
              {rowCoverage.publicDataSource} / {rowCoverage.scoreSource}. {rowCoverage.stopLine}
            </p>
          </article>
          <article className="readying">
            <span>CEO track</span>
            <strong>{runtimeInterpretation.decision}</strong>
            <p>
              Runtime {runtimeInterpretation.laneRatio.mockRuntimeHardening}% / readonly prep{" "}
              {runtimeInterpretation.laneRatio.supabaseReadonlyPreparation}%. {runtimeInterpretation.blockers[0]}.
            </p>
          </article>
          <article className="readying runtime-cutpoint-card">
            <span>Mandatory cutpoints</span>
            <strong>necessary gates remain</strong>
            <p>{runtimeDeliveryCadence.mandatoryCutpoints.slice(0, 3).join("; ")}.</p>
          </article>
          <article className="blocked">
            <span>Blocker readiness</span>
            <strong>{blockerReadiness.status}</strong>
            <p>Data / Legal / Investment checklists are local-ready. {runtimeInterpretation.stopLine}</p>
          </article>
        </div>
      </details>
    </section>
  );
}
