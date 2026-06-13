import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getRuntimePromotionReadinessSummary } from "@/lib/runtime-promotion-readiness-summary";

type PostReadonlyProductStatusProps = {
  context: "home" | "stock" | "briefing";
  symbol?: string;
};

const contextCopy = {
  briefing: {
    body: "這裡把後端唯讀證據轉成公開 Beta 可理解的資料狀態，但不把它說成正式資料已上線。",
    label: "資料準備狀態",
    title: "後端證據已整理，公開資料仍是示範"
  },
  home: {
    body: "首頁可說明目前能看什麼、不能推論什麼，以及正式資料還缺哪些條件。",
    label: "首頁資料狀態",
    title: "目前公開頁仍使用示範資料"
  },
  stock: {
    body: "標的頁可以協助使用者閱讀訊號、風險與資料限制，但不能把示範分數當作正式市場判斷。",
    label: "標的資料狀態",
    title: "標的頁目前是示範訊號閱讀"
  }
} as const;

const stepStatusClass = {
  blocked_by_evidence: "blocked",
  needs_review: "hold",
  ready_for_local_use: "ready"
} as const;

function ownerLabel(owner: string) {
  if (owner === "Engineering") return "工程線";
  if (owner === "Data") return "資料線";
  if (owner === "Investment") return "投資判讀線";
  return owner;
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
        <span>後端檢查</span>
        <strong>{state.objectsReachable} 個唯讀物件曾通過檢查</strong>
        <p>{state.acceptedEvidence}</p>
      </article>
      <article className="hold">
        <span>覆蓋率</span>
        <strong>
          已觀察 {state.rowCoverage.observedRows}/{state.rowCoverage.expectedRows} 筆
        </strong>
        <p>
          尚缺 {state.rowCoverage.missingRows} 筆。{state.rowCoverage.summary}
        </p>
      </article>
      <article className="blocked">
        <span>停止線</span>
        <strong>正式資料、正式分數與完整覆蓋都尚未啟用</strong>
        <p>{state.stopLine}</p>
      </article>
      <article className="hold">
        <span>下一步</span>
        <strong>{state.nextGate}</strong>
        <p>資料線需要補齊合法來源、欄位契約、覆蓋率、品質與回退條件，才會進入下一段升級討論。</p>
      </article>
      <div className="post-readonly-promotion-summary" aria-label="Runtime promotion readiness summary">
        <article className="blocked">
          <span>升級狀態</span>
          <strong>{promotion.headline}</strong>
          <p>
            可用於本地準備 {promotion.readinessCounts.ready}/{promotion.readinessCounts.total} 項；
            仍需覆核 {promotion.readinessCounts.needsReview} 項，等待證據 {promotion.readinessCounts.blocked} 項。
          </p>
          <p>{promotion.stopLine}</p>
        </article>
        {promotion.steps.map((step) => (
          <article className={stepStatusClass[step.status]} key={step.id}>
            <span>{ownerLabel(step.owner)}</span>
            <strong>{step.label}</strong>
            <p>{step.nextAction}</p>
            <p>{step.blockedPromotion}</p>
          </article>
        ))}
        <article className="blocked">
          <span>不可做</span>
          <strong>正式資料升級仍鎖住</strong>
          <p>{promotion.noGoActions.join("、")}。</p>
          <p>公開資料來源與分數來源仍維持示範狀態。</p>
        </article>
      </div>
    </section>
  );
}
