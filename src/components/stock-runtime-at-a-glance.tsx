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
        <p className="eyebrow">資料狀態摘要</p>
        <h2>{snapshot.asset.symbol} 目前可用示範資料閱讀</h2>
        <p>
          本頁用示範資料呈現燈號、風險方向、資料更新說明與目前限制；適合做市場氛圍閱讀，
          但尚未啟用正式資料來源、完整覆蓋率或正式分數。
        </p>
      </div>

      <div className="stock-runtime-headline-summary" aria-label="Stock runtime headline summary">
        <div>
          <span>首屏閱讀摘要</span>
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
          <span>公開狀態</span>
          <strong>{actionStatus.headline}</strong>
          <p>{actionStatus.nextAction}</p>
        </div>
        {actionStatus.statuses.map((status) => (
          <article className={status.tone} key={status.id}>
            <span>
              {status.owner === "Data" ? "資料線" : "產品線"} / {status.id}
            </span>
            <strong>{status.label}</strong>
            <p>{status.detail}</p>
            <p>目前可做：{status.allowedAction}</p>
            <p>仍不可做：{status.blockedAction}</p>
            <p>下一步：{status.nextGate}</p>
          </article>
        ))}
      </section>

      <article className="readying runtime-execution-readiness-card">
        <span>正式資料升級狀態</span>
        <strong>仍維持示範資料</strong>
        <p>正式資料升級必須先完成來源、覆蓋率、品質檢查、回讀與揭露條件。</p>
        <p>目前使用者可以閱讀示範燈號與風險方向，但不能把它視為即時真實行情或投資建議。</p>
        <p>
          Public {executionReadiness.publicDataSource}; score{" "}
          {executionReadiness.scoreSource}.
        </p>
      </article>

      <nav className="runtime-next-links" aria-label="Stock runtime next steps">
        <TrackedLink
          eventName="stock_link_clicked"
          href="/briefing"
          label="看公開 Beta 市場摘要"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          看公開 Beta 市場摘要
        </TrackedLink>
        <TrackedLink
          eventName="trust_link_clicked"
          href="/methodology"
          label="了解示範資料邊界"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          了解示範資料邊界
        </TrackedLink>
        <TrackedLink
          eventName="stock_link_clicked"
          href="/"
          label="回首頁看市場總覽"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          回首頁看市場總覽
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
          <span>尚未開放</span>
          <strong>{decisionSummary.blockedTransition}</strong>
          <p>{decisionSummary.safetyStopLine}</p>
        </article>
      </div>

      <div className="stock-runtime-governance-details" aria-label="Stock public data boundary details">
        <div>
          <span>公開資料邊界</span>
          <strong>個股頁仍維持示範資料模式</strong>
          <p>
            本區塊說明使用者現在可以讀到什麼、不能推論什麼。示範分數可協助理解產品流程，
            但資料更新說明與彙總證據不代表本頁已接上正式即時資料。
          </p>
        </div>
        <article className="active runtime-boundary-copy-card">
          <span>分數來源</span>
          <strong>{scoreSourceLabel}</strong>
          <p>目前分數來源仍是示範模式；正式分數尚未啟用。</p>
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
          <span>推進節奏</span>
          <strong>優先補強可理解性與資料證據</strong>
          <p>公開頁先把市場狀態、資料限制與下一步觀察說清楚，再逐步升級正式資料來源。</p>
        </article>
        <article className="active">
          <span>公開資料邊界</span>
          <strong>{boundaryCopy.headline}</strong>
          <p>{boundaryCopy.summary}</p>
          <p>{boundaryCopy.currentState}</p>
        </article>
        <article className="blocked runtime-boundary-copy-card">
          <span>升級尚未開放</span>
          <strong>正式資料、完整覆蓋與建議語氣仍未啟用</strong>
          <p>{boundaryCopy.blockedState}</p>
          <p>{boundaryCopy.stopLine}</p>
        </article>
        <article className="blocked runtime-fail-closed-card">
          <span>安全降級</span>
          <strong>{failClosed.failClosedState}</strong>
          <p>{failClosed.statusLine}</p>
          <p>{failClosed.blockedActions.slice(0, 4).join(", ")}.</p>
        </article>
        <article className="readying">
          <span>資料覆蓋</span>
          <strong>{rowCoverage.readiness}</strong>
          <p>
            {rowCoverage.publicDataSource} / {rowCoverage.scoreSource}. {rowCoverage.stopLine}
          </p>
        </article>
        <article className="readying">
          <span>下一步</span>
          <strong>{readiness.score}% readiness</strong>
          <p>補齊 Batch 1 覆蓋率與回讀證據後，才可討論正式資料升級。</p>
        </article>
        <article className="readying compact-runtime-blocker">
          <span>目前路線</span>
          <strong>示範資料閱讀體驗仍是主線</strong>
          <p>
            先強化燈號解釋、資料限制與降級說明；正式資料檢查只在範圍明確且條件通過後進行。
          </p>
        </article>
        <article className="readying compact-runtime-blocker runtime-cutpoint-card">
          <span>必要切點</span>
          <strong>升級正式資料前必須先停下檢查</strong>
          <p>來源權利、覆蓋率、品質、回讀、回退與揭露都通過後，才可從示範資料升級。</p>
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
