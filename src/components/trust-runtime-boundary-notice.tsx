type TrustRuntimeBoundaryNoticeProps = {
  context: "disclaimer" | "membership" | "methodology" | "privacy" | "terms" | "weekly";
};

const contextCopy = {
  disclaimer: {
    eyebrow: "風險邊界",
    title: "市場燈號不是投資建議",
    summary: "所有內容僅供資訊參考，不能替代使用者自己的判斷或專業顧問意見。"
  },
  membership: {
    eyebrow: "會員邊界",
    title: "會員功能仍屬後續規劃",
    summary: "目前公開版不提供登入、付款、watchlist 儲存或自訂警示執行。"
  },
  methodology: {
    eyebrow: "方法邊界",
    title: "分數用來排序觀察，不用來直接交易",
    summary: "燈號協助理解市場狀態，但不保證結果，也不代表任何個別商品建議。"
  },
  privacy: {
    eyebrow: "隱私邊界",
    title: "目前公開版不建立個人投資檔案",
    summary: "在會員功能上線前，本網站不儲存 watchlist、警示條件或個人投資偏好。"
  },
  terms: {
    eyebrow: "使用邊界",
    title: "使用者需自行承擔投資判斷",
    summary: "本網站提供資訊整理與風險提示，不承諾資料完全即時、完整或適合所有情境。"
  },
  weekly: {
    eyebrow: "週報邊界",
    title: "週報是回顧，不是預測保證",
    summary: "週報協助回看市場狀態變化，不應被視為未來績效承諾。"
  }
} as const;

export function TrustRuntimeBoundaryNotice({ context }: TrustRuntimeBoundaryNoticeProps) {
  const copy = contextCopy[context];

  return (
    <section className="trust-runtime-boundary-notice" aria-label={`${copy.eyebrow}說明`}>
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.summary}</p>
      </div>
      <article className="active runtime-boundary-copy-card">
        <span>目前狀態</span>
        <strong>示範資料模式</strong>
        <p>公開頁用示範資料驗證閱讀流程；正式資料啟用後仍會清楚標示來源與更新時間。</p>
      </article>
      <article className="blocked">
        <span>不提供</span>
        <strong>買賣建議與保證報酬</strong>
        <p>任何燈號、分數或摘要都不能直接解讀為買進、賣出或持有建議。</p>
      </article>
      <article className="readying">
        <span>需要搭配</span>
        <strong>資料狀態與風險聲明</strong>
        <p>若資料延遲、異常或尚未正式啟用，使用者應先降低判斷權重。</p>
      </article>
    </section>
  );
}
