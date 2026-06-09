import { RuntimeTransitionRail } from "@/components/runtime-transition-rail";
import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";
import { PostReadonlyProductStatus } from "@/components/post-readonly-product-status";
import { TrackedLink } from "@/components/tracked-link";
import { getBlockerReadinessSummary } from "@/lib/blocker-readiness";
import { getFreshnessReadonlyLatestEvidenceSummary } from "@/lib/freshness-readonly-latest-evidence";
import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getPublicRuntimeBoundaryCopy } from "@/lib/public-runtime-boundary-copy";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";
import { getRuntimeActionStatusSummary } from "@/lib/runtime-action-status";
import { getRuntimeDecisionSummary } from "@/lib/runtime-decision-summary";
import { getRuntimeDeliveryCadence } from "@/lib/runtime-delivery-cadence";
import { getRuntimeExecutionReadinessSummary } from "@/lib/runtime-execution-readiness-summary";
import { getRuntimeFailClosedSummary } from "@/lib/runtime-fail-closed";
import { getRuntimeInterpretationSummary } from "@/lib/runtime-interpretation";
import { getRuntimeProductSummary } from "@/lib/runtime-product-summary";
import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getRuntimeStateConsistencySummary } from "@/lib/runtime-state-consistency";
import type { SignalSnapshot } from "@/lib/signal-model";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";
import { getStockRuntimeHeadlineSummary } from "@/lib/stock-runtime-headline-summary";

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
  const runtimeStateConsistency = getRuntimeStateConsistencySummary();
  const failClosed = getRuntimeFailClosedSummary();
  const postReadonlyRuntime = getPostReadonlyRuntimeState();
  const productSummary = getRuntimeProductSummary(snapshot.asset.symbol);
  const decisionSummary = getRuntimeDecisionSummary();
  const headlineSummary = getStockRuntimeHeadlineSummary(snapshot);
  const freshnessLatestEvidence = getFreshnessReadonlyLatestEvidenceSummary();
  const executionReadiness = getRuntimeExecutionReadinessSummary();
  const actionStatus = getRuntimeActionStatusSummary();

  return (
    <section className="stock-runtime-at-a-glance" aria-label="Stock runtime status">
      <div>
        <p className="eyebrow">Runtime At A Glance</p>
        <h2>{snapshot.asset.symbol} 目前是 mock 訊號閱讀頁</h2>
        <p>
          這個股票頁用來展示訊號閱讀、風險排序與產品流程；它不是正式市場資料、不是完整覆蓋、不是正式模型結論，
          也不是個人化投資建議。scoreSource=real 尚未啟用。
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
        {[
          { className: "active", item: productSummary.useNow },
          { className: "blocked", item: productSummary.notLiveYet },
          { className: "readying", item: productSummary.nextGate },
          { className: "active", item: productSummary.readonlyDecision }
        ].map(({ className, item }) => (
          <article className={className} key={item.label}>
            <span>{item.displayLabel}</span>
            <strong>{item.displayTitle}</strong>
            <p>{item.displayBody}</p>
          </article>
        ))}
      </div>

      <RuntimeTransitionRail symbol={snapshot.asset.symbol} />
      <PublicRuntimeStateStrip context="stock" />
      <PostReadonlyProductStatus context="stock" symbol={snapshot.asset.symbol} />

      <section className="runtime-action-status-strip" aria-label="Runtime action status normalization">
        <div>
          <span>Action status</span>
          <strong>{actionStatus.headline}</strong>
          <p>{actionStatus.nextAction}</p>
        </div>
        {actionStatus.statuses.map((status) => (
          <article className={status.tone} key={status.id}>
            <span>
              {status.owner} / {status.id}
            </span>
            <strong>{status.label}</strong>
            <p>{status.detail}</p>
            <p>Allowed: {status.allowedAction}</p>
            <p>Blocked: {status.blockedAction}</p>
            <p>Next gate: {status.nextGate}</p>
          </article>
        ))}
      </section>

      <article className="readying runtime-execution-readiness-card">
        <span>Execution readiness</span>
        <strong>{executionReadiness.state}</strong>
        <p>{executionReadiness.chairBrief}</p>
        <p>{executionReadiness.decisionQuestion}</p>
        <p>
          Command preview: {executionReadiness.commandLabel}. Public {executionReadiness.publicDataSource}; score{" "}
          {executionReadiness.scoreSource}.
        </p>
      </article>

      <nav className="runtime-next-links" aria-label="Stock runtime next steps">
        <TrackedLink
          eventName="stock_link_clicked"
          href="/briefing"
          label="查看公開 Beta 簡報"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          查看公開 Beta 簡報
        </TrackedLink>
        <TrackedLink
          eventName="trust_link_clicked"
          href="/methodology"
          label="查看 mock 方法論"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          查看 mock 方法論
        </TrackedLink>
        <TrackedLink
          eventName="stock_link_clicked"
          href="/"
          label="回到首頁"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          回到首頁
        </TrackedLink>
      </nav>

      <div className="stock-runtime-action-strip" aria-label="Stock next system action summary">
        <article className="active">
          <span>Current progress</span>
          <strong>{decisionSummary.currentProgressPercent}%</strong>
          <p>{decisionSummary.stage}</p>
        </article>
        <article className="readying">
          <span>Next decision</span>
          <strong>{decisionSummary.decisionLabel}</strong>
          <p>{decisionSummary.nextLift}</p>
        </article>
        <article className="blocked">
          <span>Blocked transition</span>
          <strong>{decisionSummary.blockedTransition}</strong>
          <p>{decisionSummary.safetyStopLine}</p>
        </article>
      </div>

      <div className="stock-runtime-governance-details" aria-label="Stock system governance details">
        <div>
          <span>Public source boundary</span>
          <strong>Stock page remains mock runtime</strong>
          <p>
            This section keeps the stock page honest about what users can and cannot infer today. Mock scores can help
            readers understand product flow, but freshness metadata and readonly evidence do not make this a live data
            page. scoreSource=real still requires a separate PM gate.
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
            {postReadonlyRuntime.rowCoverage.observedRows}/{postReadonlyRuntime.rowCoverage.expectedRows} rows, missing{" "}
            {postReadonlyRuntime.rowCoverage.missingRows}. This is readiness evidence only, not a public real-data claim.
          </p>
        </article>
        <article className="active post-readonly-runtime-card stock-freshness-evidence-card">
          <span>Freshness metadata</span>
          <strong>{freshnessLatestEvidence.state}</strong>
          <p>
            {freshnessLatestEvidence.market} freshness metadata is reachable as of {freshnessLatestEvidence.asOfDate} from{" "}
            {freshnessLatestEvidence.sourceName}.
          </p>
          <p>
            Public {freshnessLatestEvidence.publicDataSource}; score {freshnessLatestEvidence.scoreSource}. Metadata
            only; it does not approve market-data quality, live freshness, or scoreSource=real claims.
          </p>
        </article>
        <article className="blocked">
          <span>Source depth</span>
          <strong>{sourceDepth.sourceDepthState}</strong>
          <p>{sourceDepth.stopLine}</p>
        </article>
        <article className="active runtime-delivery-card">
          <span>Slice size</span>
          <strong>{runtimeDeliveryCadence.nextExecutionRatio}</strong>
          <p>{runtimeDeliveryCadence.targetSliceSize}</p>
        </article>
        <article className="active">
          <span>Public data boundary</span>
          <strong>{boundaryCopy.headline}</strong>
          <p>{boundaryCopy.summary}</p>
          <p>{boundaryCopy.currentState}</p>
        </article>
        <article className="blocked runtime-boundary-copy-card">
          <span>Promotion blocked</span>
          <strong>Real data, complete coverage, and advice wording remain blocked</strong>
          <p>{boundaryCopy.blockedState}</p>
          <p>{boundaryCopy.stopLine}</p>
        </article>
        <article className="blocked runtime-fail-closed-card">
          <span>Fail-closed</span>
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
          <span>Runtime route</span>
          <strong>Mock runtime hardening remains active</strong>
          <p>
            mock runtime hardening {runtimeInterpretation.laneRatio.mockRuntimeHardening}% / Supabase readonly
            preparation {runtimeInterpretation.laneRatio.supabaseReadonlyPreparation}%. {runtimeInterpretation.blockers[0]}
          </p>
        </article>
        <article className="readying compact-runtime-blocker runtime-cutpoint-card">
          <span>Mandatory cutpoints</span>
          <strong>Stop at gates before any mock-to-real promotion</strong>
          <p>{runtimeDeliveryCadence.mandatoryCutpoints.slice(0, 3).join("; ")}.</p>
        </article>
        <article className="readying compact-runtime-blocker runtime-consistency-card">
          <span>Runtime consistency</span>
          <strong>{runtimeStateConsistency.consistencyState}</strong>
          <p>{runtimeStateConsistency.statusLine}</p>
        </article>
        <article className="readying compact-runtime-blocker post-readonly-runtime-card">
          <span>Readonly state</span>
          <strong>{postReadonlyRuntime.state}</strong>
          <p>{postReadonlyRuntime.rowCoverage.summary}</p>
          <p>{postReadonlyRuntime.stopLine}</p>
        </article>
        <article className="blocked compact-runtime-blocker">
          <span>Data and legal readiness</span>
          <strong>{blockerReadiness.status}</strong>
          <p>Data / Legal / Investment checklists are local-ready. {runtimeInterpretation.stopLine}</p>
        </article>
      </div>
    </section>
  );
}
