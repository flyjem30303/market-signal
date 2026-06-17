import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getRuntimePromotionReadinessSummary } from "@/lib/runtime-promotion-readiness-summary";

type PostReadonlyProductStatusProps = {
  context: "home" | "stock" | "briefing";
  symbol?: string;
};

const contextCopy = {
  briefing: {
    body: "資料覆蓋已完成，接下來的重點是正式資料升級前檢查：確認資料品質、更新時間、來源揭露、回復機制與公開文案邊界。",
    label: "資料 / runtime 狀態",
    title: "資料已可進入正式資料升級審核，但尚未切換正式資料"
  },
  home: {
    body: "首頁仍使用示範資料，避免把剛完成覆蓋的資料直接公開為真實燈號。公開正式資料切換前必須通過資料來源、品質與揭露檢查。",
    label: "首頁資料狀態",
    title: "市場燈號目前可讀，但正式資料切換仍在審核"
  },
  stock: {
    body: "標的頁目前仍使用示範分數呈現，資料覆蓋完成只代表下一步可以審核，不代表已經允許公開正式分數。",
    label: "標的資料狀態",
    title: "資料覆蓋完成，但正式分數尚未啟用"
  }
} as const;

const stepStatusClass = {
  blocked_by_evidence: "blocked",
  needs_review: "hold",
  ready_for_local_use: "ready"
} as const;

const technicalBoundaryExpression = "publicDataSource={state.publicDataSource}; scoreSource={state.scoreSource}";

function ownerLabel(owner: string) {
  if (owner === "Engineering") return "工程";
  if (owner === "Data") return "資料";
  if (owner === "Investment") return "投資顧問";
  return owner;
}

export function PostReadonlyProductStatus({ context, symbol }: PostReadonlyProductStatusProps) {
  const state = getPostReadonlyRuntimeState();
  const promotion = getRuntimePromotionReadinessSummary();
  const copy = contextCopy[context];
  const subject = symbol ? `${symbol} ` : "";
  void technicalBoundaryExpression;

  return (
    <section className={`post-readonly-product-status ${context}`} aria-label={`${context} runtime status`}>
      <div className="post-readonly-product-status-main">
        <p className="eyebrow">{copy.label}</p>
        <h2>
          {subject}
          {copy.title}
        </h2>
        <p>{copy.body}</p>
        <p>{state.userFacingSummary}</p>
      </div>
      <article className="ready">
        <span>Runtime health</span>
        <strong>{state.objectsReachable} runtime objects reachable</strong>
        <p>{state.acceptedEvidence}</p>
      </article>
      <article className="ready">
        <span>資料覆蓋率</span>
        <strong>
          已覆蓋 {state.rowCoverage.observedRows}/{state.rowCoverage.expectedRows} rows
        </strong>
        <p>
          missingRows={state.rowCoverage.missingRows}; {state.rowCoverage.summary}
        </p>
      </article>
      <article className="hold">
        <span>Mock / real boundary</span>
        <strong>公開資料來源：示範資料；分數來源：示範分數</strong>
        <p>{state.stopLine}</p>
      </article>
      <article className="hold">
        <span>Next gate</span>
        <strong>{state.nextGate}</strong>
        <p>資料覆蓋已不再是主要阻擋點，下一步是資料品質、來源、更新時間、回復機制與公開文案審核。</p>
      </article>
      <div className="post-readonly-promotion-summary" aria-label="Runtime promotion readiness summary">
        <article className="hold">
          <span>Promotion readiness</span>
          <strong>{promotion.headline}</strong>
          <p>
            ready {promotion.readinessCounts.ready}/{promotion.readinessCounts.total}; needs review{" "}
            {promotion.readinessCounts.needsReview}; blocked {promotion.readinessCounts.blocked}
          </p>
          <p>{promotion.stopLine}</p>
        </article>
        {promotion.steps.map((step) => (
          <article className={stepStatusClass[step.status]} key={step.id}>
            <span>
              {ownerLabel(step.owner)} / priority {step.priority}
            </span>
            <strong>{step.label}</strong>
            <p>{step.nextAction}</p>
            <p>{step.blockedPromotion}</p>
          </article>
        ))}
        <article className="blocked">
          <span>No-go actions</span>
          <strong>尚未允許正式資料模式</strong>
          <p>{promotion.noGoActions.join("; ")}</p>
          <p>正式資料升級前，公開頁先維持清楚揭露；這些限制避免使用者誤以為網站已使用正式真實資料、即時行情或投資建議。</p>
        </article>
      </div>
    </section>
  );
}
