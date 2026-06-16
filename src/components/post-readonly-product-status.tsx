import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getRuntimePromotionReadinessSummary } from "@/lib/runtime-promotion-readiness-summary";

type PostReadonlyProductStatusProps = {
  context: "home" | "stock" | "briefing";
  symbol?: string;
};

const contextCopy = {
  briefing: {
    body: "這裡呈現的是資料閉環後的上線前狀態：資料覆蓋已完成，但公開頁仍需通過 promotion gate 才能改讀真實資料。",
    label: "資料與 runtime 狀態",
    title: "資料覆蓋已完成，準備進入真實資料切換前檢查"
  },
  home: {
    body: "首頁目前可作為 Phase 1 公開體驗審核；燈號與分數仍是 mock，避免在切換前誤導使用者。",
    label: "首頁資料狀態",
    title: "可讀的市場儀表站，真實資料切換仍待 gate"
  },
  stock: {
    body: "個股頁已可承載 Phase 1 觀察流程；切 real 前仍需完成品質、延遲、回退與來源揭露。",
    label: "標的資料狀態",
    title: "資料覆蓋完成，尚未切換正式分數"
  }
} as const;

const stepStatusClass = {
  blocked_by_evidence: "blocked",
  needs_review: "hold",
  ready_for_local_use: "ready"
} as const;

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
        <span>唯讀證據</span>
        <strong>{state.objectsReachable} 個 runtime 物件可讀</strong>
        <p>{state.acceptedEvidence}</p>
      </article>
      <article className="ready">
        <span>資料覆蓋</span>
        <strong>
          已完成 {state.rowCoverage.observedRows}/{state.rowCoverage.expectedRows} rows
        </strong>
        <p>
          missingRows={state.rowCoverage.missingRows}；{state.rowCoverage.summary}
        </p>
      </article>
      <article className="hold">
        <span>公開邊界</span>
        <strong>publicDataSource={state.publicDataSource}; scoreSource={state.scoreSource}</strong>
        <p>{state.stopLine}</p>
      </article>
      <article className="hold">
        <span>下一道 gate</span>
        <strong>{state.nextGate}</strong>
        <p>資料覆蓋完成不會自動啟用 scoreSource=real；下一步先完成 promotion preflight。</p>
      </article>
      <div className="post-readonly-promotion-summary" aria-label="Runtime promotion readiness summary">
        <article className="hold">
          <span>Promotion readiness</span>
          <strong>{promotion.headline}</strong>
          <p>
            ready {promotion.readinessCounts.ready}/{promotion.readinessCounts.total}；needs review{" "}
            {promotion.readinessCounts.needsReview}；blocked {promotion.readinessCounts.blocked}。
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
          <strong>目前仍不可切 real</strong>
          <p>{promotion.noGoActions.join("；")}</p>
          <p>這是上線前安全邊界，不是新的資料 blocker。</p>
        </article>
      </div>
    </section>
  );
}
