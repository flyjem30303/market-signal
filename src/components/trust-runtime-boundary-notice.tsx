type TrustRuntimeBoundaryNoticeProps = {
  context: "disclaimer" | "membership" | "methodology" | "privacy" | "terms" | "weekly";
};

const contextCopy = {
  disclaimer: {
    eyebrow: "風險邊界",
    title: "本網站提供市場資訊整理，不提供投資建議",
    summary: "燈號是觀察輔助工具，使用者仍需自行判斷資訊是否適用於自身情況。"
  },
  membership: {
    eyebrow: "會員邊界",
    title: "會員功能屬下一階段規劃",
    summary: "Phase 1 先完成免費市場總覽；會員深度解讀、追蹤與提醒需等 MVP 邊界確認後再推出。"
  },
  methodology: {
    eyebrow: "方法邊界",
    title: "燈號說明重點是可理解，不是保證預測",
    summary: "方法頁說明燈號、趨勢、風險與資料時間，協助使用者理解訊號來源。"
  },
  privacy: {
    eyebrow: "隱私邊界",
    title: "Phase 1 不收集會員或付款資料",
    summary: "目前沒有登入、付款、個人化追蹤或警示功能；相關功能上線前會另行揭露。"
  },
  terms: {
    eyebrow: "使用邊界",
    title: "請把燈號視為觀察輔助",
    summary: "使用條款說明網站用途、資料限制與使用者責任。"
  },
  weekly: {
    eyebrow: "週報邊界",
    title: "週報是市場回顧，不是交易指令",
    summary: "週報協助整理市場狀態與觀察重點，不取代個人投資決策。"
  }
} as const;

export function TrustRuntimeBoundaryNotice({ context }: TrustRuntimeBoundaryNoticeProps) {
  const copy = contextCopy[context];

  return (
    <section className="trust-runtime-boundary-notice" aria-label={`${copy.eyebrow}與資料說明`}>
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.summary}</p>
      </div>
      <article className="active runtime-boundary-copy-card">
        <span>目前狀態</span>
        <strong>示範資料模式</strong>
        <p>網站可先驗證閱讀流程、燈號說明與風險揭露；正式資料尚未對外宣稱。</p>
      </article>
      <article className="blocked">
        <span>尚未開放</span>
        <strong>正式資料與會員功能</strong>
        <p>正式資料、會員內容、個人化追蹤與提醒功能都需通過上線前檢查後才會開放。</p>
      </article>
      <article className="readying">
        <span>切換條件</span>
        <strong>資料來源、品質與公開說明都需完成</strong>
        <p>合法來源、覆蓋率、資料品質、寫入回讀與風險揭露都通過後，才可由示範模式升級。</p>
      </article>
    </section>
  );
}
