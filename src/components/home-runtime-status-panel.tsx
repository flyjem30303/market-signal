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
import { getFreshnessReadonlyLatestEvidenceSummary } from "@/lib/freshness-readonly-latest-evidence";
import { getRuntimeExecutionReadinessSummary } from "@/lib/runtime-execution-readiness-summary";
import { getRuntimeActionStatusSummary } from "@/lib/runtime-action-status";
import { RuntimeTransitionRail } from "@/components/runtime-transition-rail";
import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";
import { PostReadonlyProductStatus } from "@/components/post-readonly-product-status";
import { TrackedLink } from "@/components/tracked-link";

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
        <h2>目前可閱讀 mock 訊號</h2>
        <p>
          {selectedSymbol} 目前是 mock-only 訊號：可用來理解產品流程、風險方向與揭露位置。真實市場資料、
          真實公開資料與 scoreSource=real 仍需等待 PM 接受 gate，尚未公開上線。
        </p>
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

      <RuntimeTransitionRail symbol={selectedSymbol} />
      <PublicRuntimeStateStrip context="home" />
      <PostReadonlyProductStatus context="home" symbol={selectedSymbol} />

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

      <article className="active post-readonly-runtime-card">
        <span>Readonly result</span>
        <strong>{postReadonlyRuntime.objectsReachable} objects reachable</strong>
        <p>{postReadonlyRuntime.headline}</p>
        <p>
          Row coverage {postReadonlyRuntime.rowCoverage.coverageStatus}:{" "}
          {postReadonlyRuntime.rowCoverage.observedRows}/{postReadonlyRuntime.rowCoverage.expectedRows} rows, missing{" "}
          {postReadonlyRuntime.rowCoverage.missingRows}. 這是覆蓋率 readiness，不是公開完整覆蓋率宣稱。
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
          label="查看個股 mock 訊號"
          payload={{ action: "runtime_next_stock", symbol: selectedSymbol }}
        >
          查看個股 mock 訊號
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href="/briefing"
          label="查看公開狀態簡報"
          payload={{ action: "runtime_next_briefing", symbol: selectedSymbol }}
        >
          查看公開狀態簡報
        </TrackedLink>
        <TrackedLink
          eventName="trust_link_clicked"
          href="/methodology"
          label="查看 mock 方法說明"
          payload={{ area: "runtime_next_links", symbol: selectedSymbol }}
        >
          查看 mock 方法說明
        </TrackedLink>
      </nav>

      <details className="home-runtime-details">
        <summary>查看 runtime 邊界、資料限制與下一步</summary>
        <p>
          這裡整理公開網站目前能說與不能說的內容。mock 訊號可用來閱讀產品流程；freshness metadata
          只代表狀態可讀，不代表即時行情或資料品質已核准。若資料缺值、延遲、部分覆蓋或尚未驗證，頁面必須保留限制說明。
        </p>
        <div>
          <article className="active runtime-delivery-card">
            <span>執行節奏</span>
            <strong>{runtimeDeliveryCadence.nextExecutionRatio}</strong>
            <p>{runtimeDeliveryCadence.targetSliceSize}</p>
          </article>
          <article className="active runtime-boundary-copy-card">
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
          <article className="readying">
            <span>Runtime readiness</span>
            <strong>{readiness.score}%</strong>
            <p>{readiness.status}</p>
          </article>
          <article className="blocked">
            <span>資料來源限制</span>
            <strong>{sourceDepth.sourceDepthState}</strong>
            <p>來源權利、覆蓋率與資料品質仍需審核；目前 score source 是 {sourceDepth.scoreSource}。</p>
          </article>
          <article className="readying">
            <span>Row coverage</span>
            <strong>{rowCoverage.readiness}</strong>
            <p>
              {rowCoverage.publicDataSource} / {rowCoverage.scoreSource}. {rowCoverage.stopLine}
            </p>
          </article>
          <article className="readying">
            <span>Runtime 判讀</span>
            <strong>示範流程強化</strong>
            <p>
              mock runtime hardening {runtimeInterpretation.laneRatio.mockRuntimeHardening}% / Supabase readonly
              preparation {runtimeInterpretation.laneRatio.supabaseReadonlyPreparation}%. {runtimeInterpretation.blockers[0]}
            </p>
          </article>
          <article className="readying runtime-cutpoint-card">
            <span>升級前檢查點</span>
            <strong>gate 通過前只保留 mock-only 公開說明</strong>
            <p>{runtimeDeliveryCadence.mandatoryCutpoints.slice(0, 3).join("; ")}.</p>
          </article>
          <article className="readying runtime-consistency-card">
            <span>狀態一致性</span>
            <strong>{runtimeStateConsistency.consistencyState}</strong>
            <p>{runtimeStateConsistency.statusLine}</p>
          </article>
          <article className="blocked runtime-fail-closed-card">
            <span>Fail-closed</span>
            <strong>{failClosed.failClosedState}</strong>
            <p>若 gate 尚未通過，公開頁必須維持 mock 或 blocked 狀態，不能暗示真實資料或真實分數已上線。</p>
            <p>{failClosed.blockedActions.slice(0, 4).join(", ")}.</p>
            <p>{failClosed.allowedState}</p>
          </article>
          <article className="readying post-readonly-runtime-card">
            <span>Readonly 結果</span>
            <strong>{postReadonlyRuntime.state}</strong>
            <p>{postReadonlyRuntime.rowCoverage.summary}</p>
            <p>下一個 gate: {postReadonlyRuntime.nextGate}</p>
          </article>
          <article className="readying post-readonly-runtime-card home-freshness-evidence-card">
            <span>Freshness metadata</span>
            <strong>{freshnessLatestEvidence.evidenceStatus}</strong>
            <p>{freshnessLatestEvidence.acceptedScope}</p>
            <p>{freshnessLatestEvidence.stopLine}</p>
          </article>
          <article className="blocked">
            <span>資料與法務限制</span>
            <strong>{blockerReadiness.status}</strong>
            <p>Data / Legal / Investment checklists are local-ready. {runtimeInterpretation.stopLine}</p>
          </article>
          <article className="blocked">
            <span>非投資建議</span>
            <strong>公開內容只供資訊閱讀與產品理解</strong>
            <p>mock 分數不是預測、保證或個人化建議；資料可能缺值、延遲或部分覆蓋，使用者仍需自行判斷風險。</p>
          </article>
        </div>
      </details>
    </section>
  );
}
