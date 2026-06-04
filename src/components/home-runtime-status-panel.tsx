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
        <h2>Mock signals are available for reading</h2>
        <p>
          {selectedSymbol} can be read as a mock-only signal today: useful for checking product flow, risk direction,
          and disclosure clarity. Real market data, Supabase-backed public data, and scoreSource=real remain blocked
          until separate accepted gates.
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
          {postReadonlyRuntime.rowCoverage.missingRows}.
        </p>
        <p>
          Public {postReadonlyRuntime.publicDataSource}; score {postReadonlyRuntime.scoreSource}.
        </p>
      </article>

      <article className="active post-readonly-runtime-card home-freshness-evidence-card">
        <span>Freshness metadata</span>
        <strong>{freshnessLatestEvidence.state}</strong>
        <p>
          {freshnessLatestEvidence.market} freshness is reachable as of {freshnessLatestEvidence.asOfDate} from{" "}
          {freshnessLatestEvidence.sourceName}.
        </p>
        <p>
          Public {freshnessLatestEvidence.publicDataSource}; score {freshnessLatestEvidence.scoreSource}. Metadata
          only, not market-data quality or real-score approval.
        </p>
      </article>

      <nav className="runtime-next-links" aria-label="Runtime next steps">
        <TrackedLink
          eventName="home_cta_clicked"
          href={`/stocks/${selectedSymbol}`}
          label="查看個股燈號"
          payload={{ action: "runtime_next_stock", symbol: selectedSymbol }}
        >
          查看個股燈號
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href="/briefing"
          label="查看市場晨報"
          payload={{ action: "runtime_next_briefing", symbol: selectedSymbol }}
        >
          查看晨報
        </TrackedLink>
        <TrackedLink
          eventName="trust_link_clicked"
          href="/methodology"
          label="了解 mock 方法"
          payload={{ area: "runtime_next_links", symbol: selectedSymbol }}
        >
          了解 mock 方法
        </TrackedLink>
      </nav>

      <details className="home-runtime-details">
        <summary>查看 runtime 邊界、推進比例與阻塞項目</summary>
        <p>
          目前 runtime 可以繼續強化閱讀體驗、狀態顯示與 fail-closed guard；Supabase readonly
          證據只代表後端物件可達，不能直接升級公開資料來源、正式分數或投資結論。
          下一階段仍要等資料品質、來源權利、來源深度與模型可信度 gate 另外通過。
        </p>
        <div>
          <article className="active runtime-delivery-card">
            <span>推進比例</span>
            <strong>{runtimeDeliveryCadence.nextExecutionRatio}</strong>
            <p>{runtimeDeliveryCadence.targetSliceSize}</p>
          </article>
          <article className="active runtime-boundary-copy-card">
            <span>目前可用</span>
            <strong>{boundaryCopy.headline}</strong>
            <p>{boundaryCopy.summary}</p>
            <p>{boundaryCopy.currentState}</p>
          </article>
          <article className="blocked runtime-boundary-copy-card">
            <span>仍被阻塞</span>
            <strong>真實資料與正式分數仍未開放</strong>
            <p>{boundaryCopy.blockedState}</p>
            <p>{boundaryCopy.stopLine}</p>
          </article>
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
            <span>禁止升級</span>
            <strong>{decisionSummary.blockedTransition}</strong>
            <p>{decisionSummary.safetyStopLine}</p>
          </article>
          <article className="readying">
            <span>Runtime readiness</span>
            <strong>{readiness.score}%</strong>
            <p>{readiness.status}</p>
          </article>
          <article className="blocked">
            <span>來源深度</span>
            <strong>{sourceDepth.sourceDepthState}</strong>
            <p>來源深度尚未足以支撐正式公開分數；目前 score source 維持 {sourceDepth.scoreSource}。</p>
          </article>
          <article className="readying">
            <span>Row coverage</span>
            <strong>{rowCoverage.readiness}</strong>
            <p>
              {rowCoverage.publicDataSource} / {rowCoverage.scoreSource}. {rowCoverage.stopLine}
            </p>
          </article>
          <article className="readying">
            <span>Runtime 解讀</span>
            <strong>{runtimeInterpretation.decision}</strong>
            <p>
              mock runtime hardening {runtimeInterpretation.laneRatio.mockRuntimeHardening}% / Supabase readonly
              preparation {runtimeInterpretation.laneRatio.supabaseReadonlyPreparation}%. {runtimeInterpretation.blockers[0]}
            </p>
          </article>
          <article className="readying runtime-cutpoint-card">
            <span>必要切點</span>
            <strong>保留必要 gate，但避免過細切片</strong>
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
            <p>任何 gate 未通過時，公開狀態必須維持 mock 或 blocked。</p>
            <p>{failClosed.blockedActions.slice(0, 4).join(", ")}.</p>
            <p>{failClosed.allowedState}</p>
          </article>
          <article className="readying post-readonly-runtime-card">
            <span>Readonly 後狀態</span>
            <strong>{postReadonlyRuntime.state}</strong>
            <p>{postReadonlyRuntime.rowCoverage.summary}</p>
            <p>唯讀後下一關：{postReadonlyRuntime.nextGate}</p>
          </article>
          <article className="readying post-readonly-runtime-card home-freshness-evidence-card">
            <span>Readonly 證據</span>
            <strong>{freshnessLatestEvidence.evidenceStatus}</strong>
            <p>{freshnessLatestEvidence.acceptedScope}</p>
            <p>{freshnessLatestEvidence.stopLine}</p>
          </article>
          <article className="blocked">
            <span>阻塞項目</span>
            <strong>{blockerReadiness.status}</strong>
            <p>Data / Legal / Investment checklists are local-ready. {runtimeInterpretation.stopLine}</p>
          </article>
          <article className="blocked">
            <span>升級條件</span>
            <strong>下一個 gate 通過前維持 mock</strong>
            <p>真實資料品質、來源權利、來源深度與模型可信度都要有可審核證據，才可討論公開來源或正式分數升級。</p>
          </article>
        </div>
      </details>
    </section>
  );
}
