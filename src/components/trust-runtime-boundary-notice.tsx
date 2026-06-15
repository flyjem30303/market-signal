type TrustRuntimeBoundaryNoticeProps = {
  context: "disclaimer" | "membership" | "methodology" | "privacy" | "terms" | "weekly";
};

const contextCopy = {
  disclaimer: {
    eyebrow: "風險聲明",
    title: "本網站不是投資建議",
    summary: "所有內容僅供市場資訊整理與風險辨識參考，不能取代使用者自己的投資判斷。"
  },
  membership: {
    eyebrow: "會員規劃",
    title: "會員功能仍屬下一階段",
    summary: "Phase 1 先完成公開免費版；會員深度解讀與個人化追蹤會在後續階段處理。"
  },
  methodology: {
    eyebrow: "方法邊界",
    title: "燈號是輔助閱讀，不是交易訊號",
    summary: "燈號會整合趨勢、風險與資料品質，但不應被解讀為買進、賣出或持有建議。"
  },
  privacy: {
    eyebrow: "隱私邊界",
    title: "Phase 1 不需要敏感個資",
    summary: "目前公開版以頁面瀏覽與基礎互動為主，不需要使用者提供交易帳戶或資產資訊。"
  },
  terms: {
    eyebrow: "使用條款",
    title: "請把內容視為資訊服務",
    summary: "使用者應自行確認資料狀態與風險，本網站不保證資料即時、完整或適合任何特定投資目的。"
  },
  weekly: {
    eyebrow: "週報邊界",
    title: "週報提供脈絡，不提供預測保證",
    summary: "週報用來整理觀察重點與可能風險，不承諾市場方向或報酬結果。"
  }
} as const;

export function TrustRuntimeBoundaryNotice({ context }: TrustRuntimeBoundaryNoticeProps) {
  const copy = contextCopy[context];

  return (
    <section className="trust-runtime-boundary-notice" aria-label={`${copy.eyebrow}資料與風險邊界`}>
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.summary}</p>
      </div>
      <article className="active runtime-boundary-copy-card">
        <span>目前狀態</span>
        <strong>公開 Beta 示範資料</strong>
        <p>網站目前保留 mock/real 邊界，真實資料尚未完成完整上線檢查。</p>
      </article>
      <article className="blocked">
        <span>不可誤解</span>
        <strong>不是即時交易訊號</strong>
        <p>燈號與分數僅協助理解市場狀態，不構成任何個別標的買賣建議。</p>
      </article>
      <article className="readying">
        <span>下一步</span>
        <strong>補齊合法資料來源與資料品質驗證</strong>
        <p>只有來源、品質、寫入、讀回、回滾與正式上線檢查都通過後，才會切換真實資料宣稱。</p>
      </article>
    </section>
  );
}
