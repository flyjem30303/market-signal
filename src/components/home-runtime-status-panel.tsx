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
import { getRuntimeProductSummary } from "@/lib/runtime-product-summary";
import { RuntimeTransitionRail } from "@/components/runtime-transition-rail";
import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";

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
  const productSummary = getRuntimeProductSummary(selectedSymbol);

  return (
    <section className="home-runtime-status-panel" aria-label="Runtime status">
      <div>
        <p className="eyebrow">Runtime Status</p>
        <h2>Mock signals are available for reading</h2>
        <p>
          {selectedSymbol} can be read as a mock-only signal today: useful for checking product flow, risk direction,
          and disclosure clarity. Real market data, Supabase-backed public data, and scoreSource=real remain blocked
          until separate accepted gates.
        </p>
      </div>
      <div className="runtime-product-summary" aria-label="Runtime product summary">
        <article className="active">
          <span>{productSummary.useNow.label}</span>
          <strong>{productSummary.useNow.title}</strong>
          <p>{productSummary.useNow.body}</p>
        </article>
        <article className="blocked">
          <span>{productSummary.notLiveYet.label}</span>
          <strong>{productSummary.notLiveYet.title}</strong>
          <p>{productSummary.notLiveYet.body}</p>
        </article>
        <article className="readying">
          <span>{productSummary.nextGate.label}</span>
          <strong>{productSummary.nextGate.title}</strong>
          <p>{productSummary.nextGate.body}</p>
        </article>
        <article className="active">
          <span>{productSummary.readonlyDecision.label}</span>
          <strong>{productSummary.readonlyDecision.title}</strong>
          <p>{productSummary.readonlyDecision.body}</p>
        </article>
      </div>
      <RuntimeTransitionRail symbol={selectedSymbol} />
      <PublicRuntimeStateStrip context="home" />
      <article className="active post-readonly-runtime-card">
        <span>Readonly result</span>
        <strong>{postReadonlyRuntime.objectsReachable} objects reachable</strong>
        <p>{postReadonlyRuntime.headline}</p>
        <p>
          Row coverage {postReadonlyRuntime.rowCoverage.coverageStatus}:{" "}
          {postReadonlyRuntime.rowCoverage.observedRows}/{postReadonlyRuntime.rowCoverage.expectedRows} rows,
          missing {postReadonlyRuntime.rowCoverage.missingRows}.
        </p>
        <p>
          Public {postReadonlyRuntime.publicDataSource}; score {postReadonlyRuntime.scoreSource}.
        </p>
      </article>
      <nav>
        <a href={`/stocks/${selectedSymbol}`}>Open stock page</a>
        <a href="/briefing">View CEO/PM briefing</a>
      </nav>
      <details className="home-runtime-details">
        <summary>Runtime details: review state and blocked upgrades</summary>
        <p>
          This section keeps readiness, row coverage, source depth, and fail-closed rules available for review while
          the first screen stays focused on what users can safely read now.
        </p>
        <div>
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
            <strong>{failClosed.failClosedState}</strong>
            <p>{failClosed.blockedActions.slice(0, 4).join(", ")}.</p>
            <p>{failClosed.allowedState}</p>
          </article>
          <article className="readying post-readonly-runtime-card">
            <span>Post-readonly next gate</span>
            <strong>{postReadonlyRuntime.state}</strong>
            <p>{postReadonlyRuntime.rowCoverage.summary}</p>
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
