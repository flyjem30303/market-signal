type TrustRuntimeBoundaryNoticeProps = {
  context: "disclaimer" | "membership" | "methodology" | "privacy" | "terms" | "weekly";
};

const contextCopy = {
  disclaimer: {
    eyebrow: "風險邊界",
    title: "市場燈號是資訊整理，不是投資建議",
    summary: "本網站協助整理市場狀態與風險提示，但不提供個股買賣建議、保證報酬或交易指令。"
  },
  membership: {
    eyebrow: "會員邊界",
    title: "會員功能仍是下一階段規劃",
    summary: "Phase 1 先完成公開版；登入、watchlist、自訂警示與會員專屬內容留待 Phase 2。"
  },
  methodology: {
    eyebrow: "方法邊界",
    title: "燈號協助閱讀，不取代判斷",
    summary: "燈號用於降低理解門檻，仍需搭配資料時間、來源品質與個人風險承受度。"
  },
  privacy: {
    eyebrow: "隱私邊界",
    title: "Phase 1 不收集會員追蹤資料",
    summary: "公開版不提供登入、watchlist 或自訂警示，因此不會儲存會員個人化追蹤內容。"
  },
  terms: {
    eyebrow: "使用邊界",
    title: "請把燈號當成觀察輔助",
    summary: "使用者應自行判斷資料適用性，並理解公開 Beta 仍處於示範資料階段。"
  },
  weekly: {
    eyebrow: "週報邊界",
    title: "週報用來回看市場，不是交易指令",
    summary: "週報整理本週燈號與風險脈絡，協助建立觀察流程，不代表買賣建議。"
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
        <p>公開頁先呈現產品閱讀流程與燈號邏輯，所有分數與資料狀態都以 mock 方式呈現。</p>
      </article>
      <article className="blocked">
        <span>尚未啟用</span>
        <strong>真實資料與個人化功能</strong>
        <p>正式資料、會員 watchlist、自訂警示與會員專屬內容都需要通過後續 gate 才會開放。</p>
      </article>
      <article className="readying">
        <span>上線前要求</span>
        <strong>來源、品質、回退與揭露要通過檢查</strong>
        <p>正式資料 promotion 前，必須確認資料來源可用、欄位契約穩定、錯誤能 fail-closed，並清楚揭露限制。</p>
      </article>
    </section>
  );
}
