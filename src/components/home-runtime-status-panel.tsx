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
import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";

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
  const failClosed = getRuntimeFailClosedSummary();
  const postReadonlyRuntime = getPostReadonlyRuntimeState();

  return (
    <section className="home-runtime-status-panel" aria-label="Runtime status">
      <div>
        <p className="eyebrow">Runtime Status</p>
        <h2>Mock-only runtime is active</h2>
        <p>
          {selectedSymbol} is currently limited to mock scoring and local readiness. Real market data,
          Supabase-backed public data, and scoreSource=real are blocked by the shared fail-closed guard.
          CEO has shifted delivery toward a larger runtime product slice.
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
      <article className="blocked runtime-fail-closed-card">
        <span>Fail-closed guard</span>
        <strong>{failClosed.failClosedState}</strong>
        <p>{failClosed.statusLine}</p>
        <p>{failClosed.stopLine}</p>
      </article>
      <article className="active post-readonly-runtime-card">
        <span>Readonly result</span>
        <strong>{postReadonlyRuntime.objectsReachable} objects reachable</strong>
        <p>{postReadonlyRuntime.headline}</p>
        <p>
          Public {postReadonlyRuntime.publicDataSource}; score {postReadonlyRuntime.scoreSource}.
        </p>
      </article>
      <nav>
        <a href={`/stocks/${selectedSymbol}`}>Open stock page</a>
        <a href="/briefing">View CEO/PM briefing</a>
      </nav>
      <details className="home-runtime-details">
        <summary>Runtime details: PM / technical state</summary>
        <p>
          This section shows readiness, row coverage, source depth, and CEO track. The shared fail-closed guard keeps
          scoreSource=real and publicDataSource=supabase blocked.
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
          <article className="blocked runtime-fail-closed-card">
            <span>Fail-closed blocked actions</span>
            <strong>{failClosed.allowedState}</strong>
            <p>{failClosed.blockedActions.slice(0, 4).join(", ")}.</p>
          </article>
          <article className="readying post-readonly-runtime-card">
            <span>Post-readonly next gate</span>
            <strong>{postReadonlyRuntime.state}</strong>
            <p>{postReadonlyRuntime.nextGate}</p>
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
