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
import { PostReadonlyProductStatus } from "@/components/post-readonly-product-status";
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
        <h2>{snapshot.asset.symbol} 目前是可閱讀的 mock 訊號</h2>
        <p>
          本頁用來理解 mock 分數、風險方向、資料限制與揭露狀態。這不是即時市場資料、完整覆蓋率、正式模型結論或個人化投資建議；
          scoreSource=real 仍需等待獨立 gate。
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
          label="查看公開狀態簡報"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          查看公開狀態簡報
        </TrackedLink>
        <TrackedLink
          eventName="trust_link_clicked"
          href="/methodology"
          label="查看 mock 方法說明"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          查看 mock 方法說明
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
          <span>目前進度</span>
          <strong>{decisionSummary.currentProgressPercent}%</strong>
          <p>{decisionSummary.stage}</p>
        </article>
        <article className="readying">
          <span>下一步</span>
          <strong>{decisionSummary.decisionLabel}</strong>
          <p>{decisionSummary.nextLift}</p>
        </article>
        <article className="blocked">
          <span>被阻擋的升級</span>
          <strong>{decisionSummary.blockedTransition}</strong>
          <p>{decisionSummary.safetyStopLine}</p>
        </article>
      </div>

      <div className="stock-runtime-governance-details" aria-label="Stock system governance details">
        <div>
          <span>公開判讀邊界</span>
          <strong>目前只可閱讀 mock runtime</strong>
          <p>
            這個區塊說明個股頁的資料、分數與模型限制。mock score 可協助理解風險方向，但真實資料來源、完整覆蓋率、
            freshness 品質與 scoreSource=real 都尚未通過 PM 接受 gate。
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
            {postReadonlyRuntime.rowCoverage.missingRows}. 這是 readiness 訊息，不是公開完整覆蓋率承諾。
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
          <span>資料來源限制</span>
          <strong>{sourceDepth.sourceDepthState}</strong>
          <p>{sourceDepth.stopLine}</p>
        </article>
        <article className="active runtime-delivery-card">
          <span>執行節奏</span>
          <strong>{runtimeDeliveryCadence.nextExecutionRatio}</strong>
          <p>{runtimeDeliveryCadence.targetSliceSize}</p>
        </article>
        <article className="active">
          <span>公開資料邊界</span>
          <strong>{boundaryCopy.headline}</strong>
          <p>{boundaryCopy.summary}</p>
          <p>{boundaryCopy.currentState}</p>
        </article>
        <article className="blocked runtime-boundary-copy-card">
          <span>尚未上線</span>
          <strong>真實資料、真實分數與投資用途仍被阻擋</strong>
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
          <span>Runtime 判讀</span>
          <strong>示範流程強化</strong>
          <p>
            mock runtime hardening {runtimeInterpretation.laneRatio.mockRuntimeHardening}% / Supabase readonly
            preparation {runtimeInterpretation.laneRatio.supabaseReadonlyPreparation}%. {runtimeInterpretation.blockers[0]}
          </p>
        </article>
        <article className="readying compact-runtime-blocker runtime-cutpoint-card">
          <span>升級前檢查點</span>
          <strong>gate 通過前只保留 mock-only 公開說明</strong>
          <p>{runtimeDeliveryCadence.mandatoryCutpoints.slice(0, 3).join("; ")}.</p>
        </article>
        <article className="readying compact-runtime-blocker runtime-consistency-card">
          <span>狀態一致性</span>
          <strong>{runtimeStateConsistency.consistencyState}</strong>
          <p>{runtimeStateConsistency.statusLine}</p>
        </article>
        <article className="readying compact-runtime-blocker post-readonly-runtime-card">
          <span>Readonly 結果</span>
          <strong>{postReadonlyRuntime.state}</strong>
          <p>{postReadonlyRuntime.rowCoverage.summary}</p>
          <p>{postReadonlyRuntime.stopLine}</p>
        </article>
        <article className="blocked compact-runtime-blocker">
          <span>資料與法務限制</span>
          <strong>{blockerReadiness.status}</strong>
          <p>Data / Legal / Investment checklists are local-ready. {runtimeInterpretation.stopLine}</p>
        </article>
      </div>
    </section>
  );
}
