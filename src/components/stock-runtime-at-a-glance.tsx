import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getBlockerReadinessSummary } from "@/lib/blocker-readiness";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";
import { getRuntimeInterpretationSummary } from "@/lib/runtime-interpretation";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";
import { getPublicRuntimeBoundaryCopy } from "@/lib/public-runtime-boundary-copy";
import { getRuntimeDeliveryCadence } from "@/lib/runtime-delivery-cadence";
import { getRuntimeStateConsistencySummary } from "@/lib/runtime-state-consistency";
import { getRuntimeFailClosedSummary } from "@/lib/runtime-fail-closed";
import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getRuntimeProductSummary } from "@/lib/runtime-product-summary";
import { getRuntimeDecisionSummary } from "@/lib/runtime-decision-summary";
import { getStockRuntimeHeadlineSummary } from "@/lib/stock-runtime-headline-summary";
import { getFreshnessReadonlyLatestEvidenceSummary } from "@/lib/freshness-readonly-latest-evidence";
import { getRuntimeExecutionReadinessSummary } from "@/lib/runtime-execution-readiness-summary";
import { getRuntimeActionStatusSummary } from "@/lib/runtime-action-status";
import type { SignalSnapshot } from "@/lib/signal-model";
import { RuntimeTransitionRail } from "@/components/runtime-transition-rail";
import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";
import { TrackedLink } from "@/components/tracked-link";

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
          label="查看晨報"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          查看晨報
        </TrackedLink>
        <TrackedLink
          eventName="trust_link_clicked"
          href="/methodology"
          label="了解 mock 邊界"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          了解 mock 邊界
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
          <span>專案進度</span>
          <strong>{decisionSummary.currentProgressPercent}%</strong>
          <p>{decisionSummary.stage}</p>
        </article>
        <article className="readying">
          <span>下一步</span>
          <strong>{decisionSummary.decisionLabel}</strong>
          <p>{decisionSummary.nextLift}</p>
        </article>
        <article className="blocked">
          <span>被擋住的升級</span>
          <strong>{decisionSummary.blockedTransition}</strong>
          <p>{decisionSummary.safetyStopLine}</p>
        </article>
      </div>

      <div className="stock-runtime-governance-details" aria-label="Stock system governance details">
        <div>
          <span>治理摘要</span>
          <strong>公開頁面仍停在 mock runtime</strong>
          <p>
            這個標的頁可以用來閱讀 mock score、風險方向與資料邊界；它尚未宣稱真實市場資料、正式分數或
            Supabase-backed public data。任何升級都要等獨立 gate 接受。
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
            {postReadonlyRuntime.rowCoverage.missingRows}.
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
          <span>來源深度</span>
          <strong>{sourceDepth.sourceDepthState}</strong>
          <p>{sourceDepth.stopLine}</p>
        </article>
        <article className="active runtime-delivery-card">
          <span>推進節奏</span>
          <strong>{runtimeDeliveryCadence.nextExecutionRatio}</strong>
          <p>{runtimeDeliveryCadence.targetSliceSize}</p>
        </article>
        <article className="active">
          <span>可用狀態</span>
          <strong>{boundaryCopy.headline}</strong>
          <p>{boundaryCopy.summary}</p>
          <p>{boundaryCopy.currentState}</p>
        </article>
        <article className="blocked runtime-boundary-copy-card">
          <span>尚未開放</span>
          <strong>真實資料仍未開放</strong>
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
          <span>下一個 runtime gate</span>
          <strong>{readiness.score}% readiness</strong>
          <p>{rowCoverage.nextDecision}</p>
        </article>
        <article className="readying compact-runtime-blocker">
          <span>Runtime 解讀</span>
          <strong>{runtimeInterpretation.decision}</strong>
          <p>
            mock runtime hardening {runtimeInterpretation.laneRatio.mockRuntimeHardening}% / Supabase readonly
            preparation {runtimeInterpretation.laneRatio.supabaseReadonlyPreparation}%。{runtimeInterpretation.blockers[0]}
          </p>
        </article>
        <article className="readying compact-runtime-blocker runtime-cutpoint-card">
          <span>必要切點</span>
          <strong>切點仍需保留</strong>
          <p>{runtimeDeliveryCadence.mandatoryCutpoints.slice(0, 3).join("; ")}.</p>
        </article>
        <article className="readying compact-runtime-blocker runtime-consistency-card">
          <span>狀態一致性</span>
          <strong>{runtimeStateConsistency.consistencyState}</strong>
          <p>{runtimeStateConsistency.statusLine}</p>
        </article>
        <article className="readying compact-runtime-blocker post-readonly-runtime-card">
          <span>Readonly 證據</span>
          <strong>{postReadonlyRuntime.state}</strong>
          <p>{postReadonlyRuntime.rowCoverage.summary}</p>
          <p>{postReadonlyRuntime.stopLine}</p>
        </article>
        <article className="blocked compact-runtime-blocker">
          <span>封鎖項目</span>
          <strong>{blockerReadiness.status}</strong>
          <p>Data / Legal / Investment checklists are local-ready. {runtimeInterpretation.stopLine}</p>
        </article>
      </div>
    </section>
  );
}
