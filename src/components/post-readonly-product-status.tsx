import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getRuntimePromotionReadinessSummary } from "@/lib/runtime-promotion-readiness-summary";

type PostReadonlyProductStatusProps = {
  context: "home" | "stock" | "briefing";
  symbol?: string;
};

const contextCopy = {
  briefing: {
    body: "正式資料 runtime 已啟用，接下來的重點是每日更新、延遲揭露、回復機制與分數來源說明品質。",
    label: "資料 / runtime 狀態",
    title: "正式資料已啟用，進入每日更新監控"
  },
  home: {
    body: "首頁已使用正式資料來源呈現 Phase 1 燈號。接下來要確認每日收盤後更新、延遲揭露與異常回復都穩定。",
    label: "首頁資料狀態",
    title: "市場燈號已切換正式資料，持續監控更新閉環"
  },
  stock: {
    body: "標的頁已讀取正式資料與正式分數。若資料延遲或缺少模組，前台必須降低判讀信心並清楚揭露。",
    label: "標的資料狀態",
    title: "正式分數已啟用，解釋區需持續可追溯"
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
        <span>資料來源狀態</span>
        <strong>公開資料來源：Supabase 正式資料；分數來源：正式分數</strong>
        <p>{state.stopLine}</p>
      </article>
      <article className="hold">
        <span>Next gate</span>
        <strong>{state.nextGate}</strong>
        <p>資料覆蓋已不再是主要阻擋點，下一步是 freshness 監控、解釋品質與異常回復。</p>
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
          <strong>正式資料模式維持監控</strong>
          <p>{promotion.noGoActions.join("; ")}</p>
          <p>正式資料已啟用，但仍需避免使用者誤以為網站提供即時行情、完整市場覆蓋或投資建議。</p>
        </article>
      </div>
    </section>
  );
}
