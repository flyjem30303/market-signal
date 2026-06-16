import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getRuntimePromotionReadinessSummary } from "@/lib/runtime-promotion-readiness-summary";

type PostReadonlyProductStatusProps = {
  context: "home" | "stock" | "briefing";
  symbol?: string;
};

const contextCopy = {
  briefing: {
    body: "資料覆蓋已完成，現在的主線不是再補 row，而是確認真實資料上線前的品質、更新時間、來源揭露與回退邊界。",
    label: "資料與 runtime 狀態",
    title: "資料補齊完成，仍待上線檢查"
  },
  home: {
    body: "首頁仍以安全的 mock 燈號呈現。後台資料補齊已完成，但公開網站要等上線檢查通過後才會切換成真實資料來源。",
    label: "公開資料狀態",
    title: "目前可看市場狀態，真實資料切換仍受控"
  },
  stock: {
    body: "這檔商品目前仍用 mock score 呈現。資料覆蓋完成後，下一步是確認品質、更新時間、來源揭露與公開文案，不急著切 real。",
    label: "個股資料狀態",
    title: "資料補齊完成，但尚未升級為 real score"
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
        <span>本機證據</span>
        <strong>{state.objectsReachable} 個 runtime 物件可讀</strong>
        <p>{state.acceptedEvidence}</p>
      </article>
      <article className="ready">
        <span>資料覆蓋率</span>
        <strong>
          已補齊 {state.rowCoverage.observedRows}/{state.rowCoverage.expectedRows} rows
        </strong>
        <p>
          missingRows={state.rowCoverage.missingRows}；{state.rowCoverage.summary}
        </p>
      </article>
      <article className="hold">
        <span>公開資料邊界</span>
        <strong>publicDataSource={state.publicDataSource}; scoreSource={state.scoreSource}</strong>
        <p>{state.stopLine}</p>
      </article>
      <article className="hold">
        <span>下一個 gate</span>
        <strong>{state.nextGate}</strong>
        <p>資料覆蓋已不再是 blocker；下一步只關閉 promotion preflight 的必要條件。</p>
      </article>
      <div className="post-readonly-promotion-summary" aria-label="Runtime promotion readiness summary">
        <article className="hold">
          <span>Promotion readiness</span>
          <strong>{promotion.headline}</strong>
          <p>
            ready {promotion.readinessCounts.ready}/{promotion.readinessCounts.total}；needs review{" "}
            {promotion.readinessCounts.needsReview}；blocked {promotion.readinessCounts.blocked}
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
          <strong>目前不可直接切 real</strong>
          <p>{promotion.noGoActions.join("；")}</p>
          <p>這些限制不是退回資料補齊，而是避免公開網站誤導使用者。</p>
        </article>
      </div>
    </section>
  );
}
