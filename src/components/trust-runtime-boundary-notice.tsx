type TrustRuntimeBoundaryNoticeProps = {
  context: "disclaimer" | "membership" | "methodology" | "privacy" | "terms" | "weekly";
};

const contextCopy = {
  disclaimer: {
    eyebrow: "免責邊界",
    title: "本網站不是投資建議或交易服務",
    summary: "燈號只能協助整理市場資訊與風險提示，不能取代個人判斷、專業諮詢或完整投資研究。"
  },
  membership: {
    eyebrow: "會員邊界",
    title: "會員功能屬下一階段規劃",
    summary: "Phase 1 先完成免費市場總覽；會員深度解讀、追蹤與提醒需等 MVP 邊界確認後再推出。"
  },
  methodology: {
    eyebrow: "方法邊界",
    title: "燈號是閱讀框架，不是交易指令",
    summary: "方法說明只解釋分數與燈號如何輔助觀察，不宣稱正式資料、完整覆蓋或投資績效。"
  },
  privacy: {
    eyebrow: "隱私邊界",
    title: "Phase 1 不收集會員或付款資料",
    summary: "目前不啟用登入、付款、自選清單或個人化警示；未來會員功能會另行揭露資料使用方式。"
  },
  terms: {
    eyebrow: "使用邊界",
    title: "請把燈號視為觀察輔助",
    summary: "使用條款說明資訊用途、資料限制與使用者責任，避免把燈號誤解為保證或指令。"
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
    <section className="trust-runtime-boundary-notice" aria-label={`${copy.eyebrow}說明`}>
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
        <span>上線條件</span>
        <strong>來源、品質、回復方案與風險揭露都要可驗證</strong>
        <p>只有合法來源、資料品質、寫入驗證、讀回驗證、回復計畫與正式資料切換檢查都通過後，才可切換正式資料。</p>
      </article>
    </section>
  );
}
