import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getRuntimePromotionReadinessSummary } from "@/lib/runtime-promotion-readiness-summary";

type PostReadonlyProductStatusProps = {
  context: "home" | "stock" | "briefing";
  symbol?: string;
};

const contextCopy = {
  briefing: {
    body: "資料覆蓋已完成，現在重點轉到品質、來源揭露、更新時間、rollback/readback 與公開文案 review。",
    label: "資料 / runtime 狀態",
    title: "資料可用性已前進，但仍未切換 real runtime"
  },
  home: {
    body: "首頁仍以 mock runtime 顯示，避免在 promotion gate 通過前讓使用者誤以為是真實即時資料。",
    label: "公開資料狀態",
    title: "目前是可理解的市場燈號介面，不是真實資料 promotion"
  },
  stock: {
    body: "標的頁仍使用 mock score 與受控資料說明；下一步要先證明資料品質與 fallback，而不是直接打開 real score。",
    label: "標的資料狀態",
    title: "資料覆蓋完成，real score 仍需 gate"
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
        <span>Runtime health</span>
        <strong>{state.objectsReachable} 個 runtime 物件可讀</strong>
        <p>{state.acceptedEvidence}</p>
      </article>
      <article className="ready">
        <span>資料覆蓋率</span>
        <strong>
          已覆蓋 {state.rowCoverage.observedRows}/{state.rowCoverage.expectedRows} rows
        </strong>
        <p>
          missingRows={state.rowCoverage.missingRows}；{state.rowCoverage.summary}
        </p>
      </article>
      <article className="hold">
        <span>Mock / real boundary</span>
        <strong>publicDataSource={state.publicDataSource}; scoreSource={state.scoreSource}</strong>
        <p>{state.stopLine}</p>
      </article>
      <article className="hold">
        <span>Next gate</span>
        <strong>{state.nextGate}</strong>
        <p>資料覆蓋不再是 blocker；下一步是 promotion preflight 的品質、來源、rollback/readback 與公開文案 review。</p>
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
          <strong>目前不可切換 real</strong>
          <p>{promotion.noGoActions.join("；")}</p>
          <p>這裡是安全邊界提示，不是投資建議，也不是即時真實資料宣告。</p>
        </article>
      </div>
    </section>
  );
}
