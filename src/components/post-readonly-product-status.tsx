import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getRuntimePromotionReadinessSummary } from "@/lib/runtime-promotion-readiness-summary";

type PostReadonlyProductStatusProps = {
  context: "home" | "stock" | "briefing";
  symbol?: string;
};

const contextCopy = {
  briefing: {
    body: "市場簡報會把資料狀態轉成使用者可理解的摘要，讓使用者知道目前哪些內容可閱讀、哪些仍在準備。",
    label: "資料準備狀態",
    title: "正式資料升級前，公開頁先維持清楚揭露"
  },
  home: {
    body: "首頁先提供市場總覽、核心指標、風險提示與更新時間；正式資料升級前仍以示範資料建立閱讀流程。",
    label: "首頁資料狀態",
    title: "公開頁可讀，但不宣稱正式行情"
  },
  stock: {
    body: "個股頁先提供燈號讀法、成因、更新時間與資料邊界；正式資料完成前不把分數當成交易訊號。",
    label: "個股資料狀態",
    title: "個股頁以風險辨識與觀察輔助為主"
  }
} as const;

const stepStatusClass = {
  blocked_by_evidence: "blocked",
  needs_review: "hold",
  ready_for_local_use: "ready"
} as const;

function ownerLabel(owner: string) {
  if (owner === "Engineering") return "工程";
  if (owner === "Data") return "資料來源";
  if (owner === "Investment") return "投資解讀";
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
        <span>本地檢查</span>
        <strong>{state.objectsReachable} 個資料物件通過形狀檢查</strong>
        <p>{state.acceptedEvidence}</p>
      </article>
      <article className="hold">
        <span>覆蓋率</span>
        <strong>
          目前確認 {state.rowCoverage.observedRows}/{state.rowCoverage.expectedRows} 筆
        </strong>
        <p>
          尚缺 {state.rowCoverage.missingRows} 筆；{state.rowCoverage.summary}
        </p>
      </article>
      <article className="blocked">
        <span>升級邊界</span>
        <strong>正式資料與正式分數仍需完整條件</strong>
        <p>{state.stopLine}</p>
      </article>
      <article className="hold">
        <span>下一步</span>
        <strong>{state.nextGate}</strong>
        <p>資料來源、欄位契約、覆蓋率、品質與回退條件齊備後，才會進入正式資料升級討論。</p>
      </article>
      <div className="post-readonly-promotion-summary" aria-label="Runtime upgrade readiness summary">
        <article className="blocked">
          <span>升級準備</span>
          <strong>{promotion.headline}</strong>
          <p>
            可用條件 {promotion.readinessCounts.ready}/{promotion.readinessCounts.total}，需要複核{" "}
            {promotion.readinessCounts.needsReview}，仍受阻 {promotion.readinessCounts.blocked}。
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
          <span>不可誤解</span>
          <strong>目前不是正式行情或投資建議</strong>
          <p>{promotion.noGoActions.join("、")}</p>
          <p>公開頁必須持續揭露資料狀態、更新時間與非投資建議邊界。</p>
        </article>
      </div>
    </section>
  );
}
