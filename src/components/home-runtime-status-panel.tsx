import { RuntimeTransitionRail } from "@/components/runtime-transition-rail";
import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";
import { PostReadonlyProductStatus } from "@/components/post-readonly-product-status";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
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
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";

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
  const runtimeStateConsistency = getRuntimeStateConsistencySummary();
  const failClosed = getRuntimeFailClosedSummary();
  const postReadonlyRuntime = getPostReadonlyRuntimeState();
  const productSummary = getRuntimeProductSummary(selectedSymbol);
  const decisionSummary = getRuntimeDecisionSummary();
  const freshnessLatestEvidence = getFreshnessReadonlyLatestEvidenceSummary();
  const executionReadiness = getRuntimeExecutionReadinessSummary();
  const actionStatus = getRuntimeActionStatusSummary();

  return (
    <section className="home-runtime-status-panel" aria-label="Runtime status">
      <div>
        <p className="eyebrow">Runtime Status</p>
        <h2>目前可用的是 mock 訊號閱讀模式</h2>
        <p>
          {selectedSymbol} 目前可用於檢查產品流程、燈號解讀與公開揭露方式。正式市場資料、完整覆蓋率與
          scoreSource=real 仍需通過資料品質與來源檢查；通過前，網站不會宣稱即時資料、真實評分或投資建議。
          不是投資建議。
        </p>
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

      <RuntimeTransitionRail symbol={selectedSymbol} />
      <PublicRuntimeStateStrip context="home" />
      <PostReadonlyProductStatus context="home" symbol={selectedSymbol} />
      <PublicBetaDataReadinessStatus />

      <section className="runtime-action-status-strip" aria-label="Runtime action status normalization">
        <div>
          <span>公開狀態</span>
          <strong>{actionStatus.headline}</strong>
          <p>{actionStatus.nextAction}</p>
        </div>
        {actionStatus.statuses.map((status) => (
          <article className={status.tone} key={status.id}>
            <span>
              {status.owner === "Data" ? "資料線" : "產品線"}
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
        <p>目前公開頁只呈現示範訊號與資料邊界；正式資料升級前仍需完成資料覆蓋、來源權利與安全檢查。</p>
        <p>這個狀態不會自動執行 SQL、寫入 Supabase、匯入市場資料或切換正式分數。</p>
        <p>
          Public {executionReadiness.publicDataSource}; score{" "}
          {executionReadiness.scoreSource}.
        </p>
      </article>

      <article className="active post-readonly-runtime-card">
        <span>Readonly result</span>
        <strong>{postReadonlyRuntime.objectsReachable} objects reachable</strong>
        <p>{postReadonlyRuntime.headline}</p>
        <p>
          Row coverage {postReadonlyRuntime.rowCoverage.coverageStatus}:{" "}
          {postReadonlyRuntime.rowCoverage.observedRows}/{postReadonlyRuntime.rowCoverage.expectedRows} rows, missing{" "}
          {postReadonlyRuntime.rowCoverage.missingRows}. This is readiness evidence only, not a public real-data claim.
        </p>
        <p>
          Public {postReadonlyRuntime.publicDataSource}; score {postReadonlyRuntime.scoreSource}.
        </p>
      </article>

      <article className="active post-readonly-runtime-card home-freshness-evidence-card">
        <span>Freshness metadata</span>
        <strong>{freshnessLatestEvidence.state}</strong>
        <p>
          {freshnessLatestEvidence.market} freshness metadata is reachable as of {freshnessLatestEvidence.asOfDate} from{" "}
          {freshnessLatestEvidence.sourceName}.
        </p>
        <p>
          Public {freshnessLatestEvidence.publicDataSource}; score {freshnessLatestEvidence.scoreSource}. Metadata
          only; it does not approve market-data quality, live freshness, or real-score claims.
        </p>
      </article>

      <nav className="runtime-next-links" aria-label="Runtime next steps">
        <TrackedLink
          eventName="home_cta_clicked"
          href={`/stocks/${selectedSymbol}`}
          label="查看股票 mock 訊號"
          payload={{ action: "runtime_next_stock", symbol: selectedSymbol }}
        >
          查看股票 mock 訊號
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href="/briefing"
          label="查看公開 Beta 簡報"
          payload={{ action: "runtime_next_briefing", symbol: selectedSymbol }}
        >
          查看公開 Beta 簡報
        </TrackedLink>
        <TrackedLink
          eventName="trust_link_clicked"
          href="/methodology"
          label="查看 mock 方法論"
          payload={{ area: "runtime_next_links", symbol: selectedSymbol }}
        >
          查看 mock 方法論
        </TrackedLink>
      </nav>

      <details className="home-runtime-details">
        <summary>查看 runtime 邊界與下一步 gate</summary>
        <p>
          公開 Beta 前，首頁只展示 mock 訊號與升級準備狀態。freshness metadata、row coverage、source
          rights、data quality、model credibility 與 public claim gates 都必須逐一通過後，才能把公開資料來源或分數來源從
          mock 推進到真實狀態。
        </p>
        <div>
          <article className="active runtime-delivery-card">
            <span>Slice size</span>
            <strong>{runtimeDeliveryCadence.nextExecutionRatio}</strong>
            <p>{runtimeDeliveryCadence.targetSliceSize}</p>
          </article>
          <article className="active runtime-boundary-copy-card">
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
          <article className="readying">
            <span>Runtime readiness</span>
            <strong>{readiness.score}%</strong>
            <p>{readiness.status}</p>
          </article>
          <article className="blocked">
            <span>Source depth</span>
            <strong>{sourceDepth.sourceDepthState}</strong>
            <p>Source depth and source-rights evidence still block public promotion. Current score source: {sourceDepth.scoreSource}.</p>
          </article>
          <article className="readying">
            <span>Row coverage</span>
            <strong>{rowCoverage.readiness}</strong>
            <p>
              {rowCoverage.publicDataSource} / {rowCoverage.scoreSource}. {rowCoverage.stopLine}
            </p>
          </article>
          <article className="readying">
            <span>Runtime route</span>
            <strong>Mock runtime hardening remains active</strong>
            <p>
              mock runtime hardening {runtimeInterpretation.laneRatio.mockRuntimeHardening}% / Supabase readonly
              preparation {runtimeInterpretation.laneRatio.supabaseReadonlyPreparation}%. {runtimeInterpretation.blockers[0]}
            </p>
          </article>
          <article className="readying runtime-cutpoint-card">
            <span>Mandatory cutpoints</span>
            <strong>Stop at gates before any mock-to-real promotion</strong>
            <p>{runtimeDeliveryCadence.mandatoryCutpoints.slice(0, 3).join("; ")}.</p>
          </article>
          <article className="readying runtime-consistency-card">
            <span>Runtime consistency</span>
            <strong>{runtimeStateConsistency.consistencyState}</strong>
            <p>{runtimeStateConsistency.statusLine}</p>
          </article>
          <article className="blocked runtime-fail-closed-card">
            <span>Fail-closed</span>
            <strong>{failClosed.failClosedState}</strong>
            <p>When any gate is not accepted, runtime must stay mock or blocked instead of showing real-data claims.</p>
            <p>{failClosed.blockedActions.slice(0, 4).join(", ")}.</p>
            <p>{failClosed.allowedState}</p>
          </article>
          <article className="readying post-readonly-runtime-card">
            <span>Readonly state</span>
            <strong>{postReadonlyRuntime.state}</strong>
            <p>{postReadonlyRuntime.rowCoverage.summary}</p>
            <p>下一步：{postReadonlyRuntime.nextGate}</p>
          </article>
          <article className="readying post-readonly-runtime-card home-freshness-evidence-card">
            <span>Freshness metadata</span>
            <strong>{freshnessLatestEvidence.evidenceStatus}</strong>
            <p>{freshnessLatestEvidence.acceptedScope}</p>
            <p>{freshnessLatestEvidence.stopLine}</p>
          </article>
          <article className="blocked">
            <span>Data and legal readiness</span>
            <strong>{blockerReadiness.status}</strong>
            <p>Data / Legal / Investment checklists are local-ready. {runtimeInterpretation.stopLine}</p>
          </article>
          <article className="blocked">
            <span>Public claim limit</span>
            <strong>Mock signals are not investment advice</strong>
            <p>
              Mock outputs can explain product flow and market-reading context, but they must not be presented as
              real market data, validated forecasts, buy/sell/hold advice, or personalized recommendations.
            </p>
          </article>
        </div>
      </details>
    </section>
  );
}
