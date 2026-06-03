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
import { getStockRuntimeHeadlineSummary } from "@/lib/stock-runtime-headline-summary";
import { getFreshnessReadonlyLatestEvidenceSummary } from "@/lib/freshness-readonly-latest-evidence";
import type { SignalSnapshot } from "@/lib/signal-model";
import { RuntimeTransitionRail } from "@/components/runtime-transition-rail";
import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";

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
  const postReadonlyRuntime = getPostReadonlyRuntimeState();
  const productSummary = getRuntimeProductSummary(snapshot.asset.symbol);
  const headlineSummary = getStockRuntimeHeadlineSummary(snapshot);
  const freshnessLatestEvidence = getFreshnessReadonlyLatestEvidenceSummary();

  return (
    <section className="stock-runtime-at-a-glance" aria-label="Stock runtime status">
      <div>
        <p className="eyebrow">Runtime At A Glance</p>
        <h2>{snapshot.asset.symbol} has a readable mock signal</h2>
        <p>
          Use this page to understand the mock score, risk direction, and disclosure state. It is not live market-data
          evidence, and Supabase-backed public data plus scoreSource=real still require separate accepted gates.
        </p>
      </div>
      <div className="stock-runtime-headline-summary" aria-label="Stock runtime headline summary">
        <div>
          <span>First-screen runtime summary</span>
          <strong>{headlineSummary.headline}</strong>
          <p>{headlineSummary.subhead}</p>
        </div>
        {headlineSummary.items.map((item) => (
          <article className={item.state} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.body}</p>
          </article>
        ))}
        <p className="stock-runtime-headline-stop-line">{headlineSummary.stopLine}</p>
      </div>
      <div className="stock-decision-aid-groups" aria-label="Stock decision aid groups">
        {headlineSummary.decisionAidGroups.map((group) => (
          <article className={group.state} key={group.label}>
            <span>{group.label}</span>
            <strong>{group.title}</strong>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="runtime-product-summary" aria-label="Runtime product summary">
        <article className="active">
          <span>{productSummary.useNow.displayLabel}</span>
          <strong>{productSummary.useNow.displayTitle}</strong>
          <p>{productSummary.useNow.displayBody}</p>
        </article>
        <article className="blocked">
          <span>{productSummary.notLiveYet.displayLabel}</span>
          <strong>{productSummary.notLiveYet.displayTitle}</strong>
          <p>{productSummary.notLiveYet.displayBody}</p>
        </article>
        <article className="readying">
          <span>{productSummary.nextGate.displayLabel}</span>
          <strong>{productSummary.nextGate.displayTitle}</strong>
          <p>{productSummary.nextGate.displayBody}</p>
        </article>
        <article className="active">
          <span>{productSummary.readonlyDecision.displayLabel}</span>
          <strong>{productSummary.readonlyDecision.displayTitle}</strong>
          <p>{productSummary.readonlyDecision.displayBody}</p>
        </article>
      </div>
      <RuntimeTransitionRail symbol={snapshot.asset.symbol} />
      <PublicRuntimeStateStrip context="stock" />
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
      <div className="stock-runtime-governance-details" aria-label="Stock runtime governance details">
        <div>
          <span>Review details</span>
          <strong>upgrade blockers stay below the reading summary</strong>
          <p>
            Blockers, delivery cadence, readonly state, and fail-closed rules remain available here without turning the
            first screen into an internal checklist.
          </p>
        </div>
        <article className="active runtime-boundary-copy-card">
          <span>Score source</span>
          <strong>{scoreSourceLabel}</strong>
          <p>Current score source remains mock runtime; scoreSource=real is not enabled.</p>
        </article>
        <article className="active post-readonly-runtime-card">
          <span>Readonly result</span>
          <strong>{postReadonlyRuntime.objectsReachable} objects reachable</strong>
          <p>{postReadonlyRuntime.userFacingSummary}</p>
          <p>
            Row coverage {postReadonlyRuntime.rowCoverage.coverageStatus}:{" "}
            {postReadonlyRuntime.rowCoverage.observedRows}/{postReadonlyRuntime.rowCoverage.expectedRows} rows,
            missing {postReadonlyRuntime.rowCoverage.missingRows}.
          </p>
        </article>
        <article className="active post-readonly-runtime-card stock-freshness-evidence-card">
          <span>Freshness metadata</span>
          <strong>{freshnessLatestEvidence.state}</strong>
          <p>
            {freshnessLatestEvidence.market} freshness is reachable as of {freshnessLatestEvidence.asOfDate} from{" "}
            {freshnessLatestEvidence.sourceName}.
          </p>
          <p>
            Public {freshnessLatestEvidence.publicDataSource}; score {freshnessLatestEvidence.scoreSource}. Metadata
            only, not market-data quality or scoreSource=real approval.
          </p>
        </article>
        <article className="blocked">
          <span>Source depth</span>
          <strong>{sourceDepth.sourceDepthState}</strong>
          <p>{sourceDepth.stopLine}</p>
        </article>
        <article className="active runtime-delivery-card">
          <span>Delivery cadence</span>
          <strong>{runtimeDeliveryCadence.nextExecutionRatio}</strong>
          <p>{runtimeDeliveryCadence.targetSliceSize}</p>
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
        <article className="readying compact-runtime-blocker post-readonly-runtime-card">
          <span>Post-readonly next gate</span>
          <strong>{postReadonlyRuntime.state}</strong>
          <p>{postReadonlyRuntime.rowCoverage.summary}</p>
          <p>{postReadonlyRuntime.stopLine}</p>
        </article>
        <article className="blocked compact-runtime-blocker">
          <span>Blocker readiness</span>
          <strong>{blockerReadiness.status}</strong>
          <p>Data / Legal / Investment checklists are local-ready. {runtimeInterpretation.stopLine}</p>
        </article>
      </div>
    </section>
  );
}
