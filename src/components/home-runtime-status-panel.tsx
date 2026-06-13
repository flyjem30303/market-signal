import { RuntimeTransitionRail } from "@/components/runtime-transition-rail";
import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";
import { PostReadonlyProductStatus } from "@/components/post-readonly-product-status";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
import { TwseOpenApiRuntimeMockWiringStatus } from "@/components/twse-openapi-runtime-mock-wiring-status";
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
  const showDetailedRuntimeDiagnostics = false;
  // Legacy public-copy guard: Real data, complete coverage, and advice wording remain blocked.

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

      <article className="readying home-runtime-data-readiness-summary">
        <span>Data Readiness</span>
        <strong>資料真實化仍在準備中，公開頁維持 mock</strong>
        <p>
          目前首頁只提供 mock 訊號閱讀與狀態說明；真實資料、完整覆蓋率與個別投資建議都還沒有開放。
        </p>
        <p>
          覆蓋證據：目前可檢查的覆蓋證據 182/360；TWII 前置條件與公開資料邊界仍是上線前檢查項。目前不執行資料庫寫入、不匯入原始資料酬載、不修改正式資料表。
        </p>
      </article>

      {showDetailedRuntimeDiagnostics && (
        <>
      <RuntimeTransitionRail symbol={selectedSymbol} />
      <PublicRuntimeStateStrip context="home" />
      <PostReadonlyProductStatus context="home" symbol={selectedSymbol} />
      <PublicBetaDataReadinessStatus />
      {/* This is readiness evidence only, not a public real-data claim. */}
      <TwseOpenApiRuntimeMockWiringStatus />

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
        <span>資料覆蓋檢查</span>
        <strong>
          {postReadonlyRuntime.rowCoverage.observedRows}/{postReadonlyRuntime.rowCoverage.expectedRows} 筆已可比對
        </strong>
        <p>{postReadonlyRuntime.headline}</p>
        <p>
          目前仍有 {postReadonlyRuntime.rowCoverage.missingRows} 筆覆蓋缺口；這只是資料準備狀態，不代表正式即時資料或投資建議。
        </p>
        <p>
          Public {postReadonlyRuntime.publicDataSource}; score {postReadonlyRuntime.scoreSource}.
        </p>
      </article>

      <article className="active post-readonly-runtime-card home-freshness-evidence-card">
        <span>資料更新狀態</span>
        <strong>可讀取更新線索</strong>
        <p>
          {freshnessLatestEvidence.market} 的更新線索已記錄至 {freshnessLatestEvidence.asOfDate}，來源：
          {freshnessLatestEvidence.sourceName}。
        </p>
        <p>
          公開頁維持 {freshnessLatestEvidence.publicDataSource} / {freshnessLatestEvidence.scoreSource}；這只代表更新線索存在，不代表即時行情、完整品質或正式分數。
        </p>
      </article>

        </>
      )}

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

      {showDetailedRuntimeDiagnostics && (
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
            <span>公開資料邊界</span>
            <strong>{boundaryCopy.headline}</strong>
            <p>{boundaryCopy.summary}</p>
            <p>{boundaryCopy.currentState}</p>
          </article>
          <article className="blocked runtime-boundary-copy-card">
            <span>升級仍鎖住</span>
            <strong>真實資料、完整覆蓋與建議語氣尚未開放</strong>
            <p>{boundaryCopy.blockedState}</p>
            <p>{boundaryCopy.stopLine}</p>
          </article>
          <article className="active">
            <span>目前進度</span>
            <strong>{decisionSummary.currentProgressPercent}%</strong>
            <p>{decisionSummary.stage}</p>
          </article>
          <article className="readying">
            <span>下一步判斷</span>
            <strong>{decisionSummary.decisionLabel}</strong>
            <p>{decisionSummary.nextLift}</p>
          </article>
          <article className="blocked">
            <span>尚未開放的切換</span>
            <strong>{decisionSummary.blockedTransition}</strong>
            <p>{decisionSummary.safetyStopLine}</p>
          </article>
          <article className="readying">
            <span>Runtime readiness</span>
            <strong>{readiness.score}%</strong>
            <p>{readiness.status}</p>
          </article>
          <article className="blocked">
            <span>來源說明</span>
            <strong>來源深度仍待補齊</strong>
            <p>正式資料上線前，仍需確認來源權利、欄位契約與可回溯說明。</p>
          </article>
          <article className="readying">
            <span>資料列覆蓋</span>
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
            <span>狀態一致性</span>
            <strong>公開頁維持示範邊界</strong>
            <p>首頁、簡報與股票頁會一致標示 mock 資料，避免使用者把示範分數誤讀成正式行情。</p>
          </article>
          <article className="blocked runtime-fail-closed-card">
            <span>Fail-closed</span>
            <strong>{failClosed.failClosedState}</strong>
            <p>When any gate is not accepted, runtime must stay mock or blocked instead of showing real-data claims.</p>
            <p>{failClosed.blockedActions.slice(0, 4).join(", ")}.</p>
            <p>{failClosed.allowedState}</p>
          </article>
          <article className="readying post-readonly-runtime-card">
            <span>資料覆蓋狀態</span>
            <strong>仍在補齊缺口</strong>
            <p>部分資料列尚未補齊；完成來源、覆蓋率與品質檢查前，公開頁不升級為正式資料。</p>
            <p>下一步：{postReadonlyRuntime.nextGate}</p>
          </article>
          <article className="readying post-readonly-runtime-card home-freshness-evidence-card">
            <span>資料更新狀態</span>
            <strong>更新線索仍需覆核</strong>
            <p>{freshnessLatestEvidence.acceptedScope}</p>
            <p>{freshnessLatestEvidence.stopLine}</p>
          </article>
          <article className="blocked">
            <span>資料與揭露準備</span>
            <strong>上線前仍需完成來源與風險揭露</strong>
            <p>正式資料與投資相關呈現必須通過資料、法務與風險揭露檢查；目前仍維持示範說明。</p>
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
      )}
    </section>
  );
}
