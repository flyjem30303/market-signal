import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getBlockerReadinessSummary } from "@/lib/blocker-readiness";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";
import { getRuntimeInterpretationSummary } from "@/lib/runtime-interpretation";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";
import { getPublicRuntimeBoundaryCopy } from "@/lib/public-runtime-boundary-copy";
import { getRuntimeDeliveryCadence } from "@/lib/runtime-delivery-cadence";
import { getHomeRuntimeActionSummary } from "@/lib/home-runtime-action-summary";
import { getRuntimeStateConsistencySummary } from "@/lib/runtime-state-consistency";

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
  const actionSummary = getHomeRuntimeActionSummary();
  const runtimeStateConsistency = getRuntimeStateConsistencySummary();

  return (
    <section className="home-runtime-status-panel" aria-label="Runtime status">
      <div>
        <p className="eyebrow">Runtime Status</p>
        <h2>目前仍是 mock-only runtime</h2>
        <p>
          {selectedSymbol} 目前只呈現 mock 分數與本機 readiness 狀態；真實市場資料、Supabase runtime
          讀取與 scoreSource=real 尚未啟用。CEO 目前把推進重心放在 runtime product slice、fail-closed
          guard，以及下一個可控 gate。CEO 已把推進節奏調整為較大的 runtime product slice。
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
      <div className="home-runtime-action-strip" aria-label="CEO next runtime action summary">
        <article className="active">
          <span>Current progress</span>
          <strong>{actionSummary.currentProgressPercent}%</strong>
          <p>{actionSummary.stage}</p>
        </article>
        <article className="readying">
          <span>CEO next action</span>
          <strong>{actionSummary.nextAction}</strong>
          <p>{actionSummary.nextLift}</p>
        </article>
        <article className="blocked">
          <span>Still blocked</span>
          <strong>{actionSummary.blockedTransition}</strong>
          <p>{actionSummary.safetyStopLine}</p>
        </article>
      </div>
      <nav>
        <a href={`/stocks/${selectedSymbol}`}>前往個股頁</a>
        <a href="/briefing">查看 CEO/PM briefing</a>
      </nav>
      <details className="home-runtime-details">
        <summary>展開 runtime 細節：PM / 技術狀態</summary>
        <p>
          這裡集中顯示目前可公開呈現的 readiness、row coverage、source depth 與 CEO track；所有真實資料與
          scoreSource=real 轉換仍維持 fail-closed。
        </p>
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
          <article className="readying runtime-consistency-card">
            <span>State consistency</span>
            <strong>{runtimeStateConsistency.consistencyState}</strong>
            <p>{runtimeStateConsistency.statusLine}</p>
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
