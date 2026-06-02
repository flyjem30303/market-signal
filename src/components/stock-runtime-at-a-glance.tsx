import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getBlockerReadinessSummary } from "@/lib/blocker-readiness";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";
import { getRuntimeInterpretationSummary } from "@/lib/runtime-interpretation";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";
import { getPublicRuntimeBoundaryCopy } from "@/lib/public-runtime-boundary-copy";
import { getRuntimeDeliveryCadence } from "@/lib/runtime-delivery-cadence";
import { getHomeRuntimeActionSummary } from "@/lib/home-runtime-action-summary";
import { getRuntimeStateConsistencySummary } from "@/lib/runtime-state-consistency";
import { getRuntimeFailClosedSummary } from "@/lib/runtime-fail-closed";
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
  const actionSummary = getHomeRuntimeActionSummary();
  const runtimeStateConsistency = getRuntimeStateConsistencySummary();
  const failClosed = getRuntimeFailClosedSummary();

  return (
    <section className="stock-runtime-at-a-glance" aria-label="Stock runtime status">
      <div>
        <p className="eyebrow">Runtime At A Glance</p>
        <h2>{snapshot.asset.symbol} is mock-only runtime</h2>
        <p>
          This page can show mock interpretation, local readiness, and blocked runtime gates only. Real market data,
          Supabase-backed public data, and scoreSource=real require a separate accepted gate and post-run review.
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
        <p>Current score source remains mock runtime; scoreSource=real is not enabled.</p>
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
      <article className="blocked runtime-fail-closed-card">
        <span>Fail-closed guard</span>
        <strong>{failClosed.failClosedState}</strong>
        <p>{failClosed.statusLine}</p>
        <p>{failClosed.blockedActions.slice(0, 4).join(", ")}.</p>
      </article>
      <article className="blocked">
        <span>Source depth</span>
        <strong>{sourceDepth.sourceDepthState}</strong>
        <p>{sourceDepth.stopLine}</p>
      </article>
      <div className="stock-runtime-action-strip" aria-label="Stock CEO next runtime action summary">
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
      <article className="readying compact-runtime-blocker runtime-consistency-card">
        <span>State consistency</span>
        <strong>{runtimeStateConsistency.consistencyState}</strong>
        <p>{runtimeStateConsistency.statusLine}</p>
      </article>
      <article className="blocked compact-runtime-blocker">
        <span>Blocker readiness</span>
        <strong>{blockerReadiness.status}</strong>
        <p>Data / Legal / Investment checklists are local-ready. {runtimeInterpretation.stopLine}</p>
      </article>
    </section>
  );
}
