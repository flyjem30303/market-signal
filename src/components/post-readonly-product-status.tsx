import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getRuntimePromotionReadinessSummary } from "@/lib/runtime-promotion-readiness-summary";

type PostReadonlyProductStatusProps = {
  context: "home" | "stock" | "briefing";
  symbol?: string;
};

const contextCopy = {
  briefing: {
    label: "後端證據狀態",
    title: "後端可讀性已驗證；公開訊號仍維持示範狀態",
    body:
      "這份晨報目前只能作為示範閱讀頁。唯讀結果證明後端物件可讀，但尚未證明完整覆蓋率、資料品質、來源權利或正式分數。"
  },
  home: {
    label: "產品執行狀態",
    title: "產品流程可審查，但尚不能視為正式資料",
    body:
      "首頁可用來審查產品流程、風險語言與揭露清楚度。公開資料與分數仍維持示範狀態，直到資料品質與來源深度檢查點通過。"
  },
  stock: {
    label: "個股執行狀態",
    title: "此個股頁目前可作為示範訊號閱讀",
    body:
      "此頁可用來檢視示範分數與決策流程。後端唯讀證據不是即時市場資料，也不代表正式分數已啟用。"
  }
} as const;

const publicBoundaryLabel = {
  mock: "示範"
} as const;

const readinessStatusLabel = {
  not_ready_for_real_data_promotion: "尚未可升級正式資料"
} as const;

const promotionStepStatusClass = {
  blocked_by_evidence: "blocked",
  needs_review: "hold",
  ready_for_local_use: "ready"
} as const;

function toPublicBoundaryLabel(value: "mock") {
  return publicBoundaryLabel[value];
}

function toReadinessStatusLabel(value: keyof typeof readinessStatusLabel) {
  return readinessStatusLabel[value];
}

export function PostReadonlyProductStatus({ context, symbol }: PostReadonlyProductStatusProps) {
  const state = getPostReadonlyRuntimeState();
  const promotion = getRuntimePromotionReadinessSummary();
  const copy = contextCopy[context];
  const subject = symbol ? `${symbol} ` : "";

  return (
    <section className={`post-readonly-product-status ${context}`} aria-label={`${context} post-readonly runtime status`}>
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
        <strong>{state.objectsReachable} 個後端物件可讀</strong>
        <p>{state.acceptedEvidence}</p>
      </article>
      <article className="hold">
        <span>資料覆蓋率</span>
        <strong>
          已觀察 {state.rowCoverage.observedRows}/{state.rowCoverage.expectedRows} 筆
        </strong>
        <p>
          缺少 {state.rowCoverage.missingRows} 筆；原因：{state.rowCoverage.reason}。{state.rowCoverage.summary}
        </p>
      </article>
      <article className="blocked">
        <span>公開邊界</span>
        <strong>
          資料來源：{toPublicBoundaryLabel(state.publicDataSource)}；分數來源：
          {toPublicBoundaryLabel(state.scoreSource)}
        </strong>
        <p>{state.stopLine}</p>
      </article>
      <article className="hold">
        <span>下一個檢查點</span>
        <strong>{state.nextGate}</strong>
        <p>
          下一步升級前，必須分別確認資料結構、新鮮度、覆蓋率、資料品質、來源深度與公開文案要求；
          未通過前不得切換正式資料或正式分數。
        </p>
      </article>
      <div className="post-readonly-promotion-summary" aria-label="Runtime promotion readiness summary">
        <article className="blocked">
          <span>升級準備度</span>
          <strong>{toReadinessStatusLabel(promotion.overallStatus)}</strong>
          <p>{promotion.headline}</p>
          <p>
            已就緒 {promotion.readinessCounts.ready}/{promotion.readinessCounts.total}；阻擋{" "}
            {promotion.readinessCounts.blocked}；需覆核 {promotion.readinessCounts.needsReview}。覆蓋率{" "}
            {promotion.rowCoverage.observedRows}/{promotion.rowCoverage.expectedRows}，缺少{" "}
            {promotion.rowCoverage.missingRows}。
          </p>
          <p>{promotion.nextCeoDecision}</p>
        </article>
        {promotion.steps.map((step) => (
          <article
            className={promotionStepStatusClass[step.status]}
            key={step.id}
          >
            <span>
              {step.owner} / 優先度 {step.priority}
            </span>
            <strong>{step.label}</strong>
            <p>{step.nextAction}</p>
            <p>仍阻擋升級：{step.blockedPromotion}。</p>
          </article>
        ))}
        <article className="blocked">
          <span>禁止升級動作</span>
          <strong>
            資料來源：{toPublicBoundaryLabel(promotion.mockBoundary.publicDataSource)}；分數來源：
            {toPublicBoundaryLabel(promotion.mockBoundary.scoreSource)}
          </strong>
          <p>{promotion.noGoActions.join("、")}。</p>
          <p>{promotion.stopLine}</p>
        </article>
      </div>
    </section>
  );
}
