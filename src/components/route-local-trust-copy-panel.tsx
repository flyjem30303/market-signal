type RouteLocalTrustCopyPanelProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms" | "weekly";
};

const copyByContext = {
  disclaimer: {
    eyebrow: "信任提醒",
    title: "風險聲明放在使用流程裡",
    summary: "本站會把市場狀態、資料時間與非投資建議邊界一起呈現，避免使用者只看分數就做出過度判斷。",
    points: [
      "所有燈號都需要搭配資料更新時間一起閱讀。",
      "警示代表需要觀察，不代表必須交易。",
      "網站提供資訊整理，不保證報酬，也不代替個人判斷。"
    ]
  },
  methodology: {
    eyebrow: "方法提醒",
    title: "方法頁要說清楚燈號怎麼看",
    summary: "方法頁的重點不是堆指標，而是讓使用者知道每個指標在判斷順序中的角色。",
    points: [
      "先看總燈號，再看核心指標與風險提示。",
      "資料狀態會影響解讀信心，不能忽略。",
      "若資料尚未正式啟用，前台會維持示範資料說明。"
    ]
  },
  privacy: {
    eyebrow: "隱私提醒",
    title: "會員功能上線前先把資料用途說清楚",
    summary: "目前公開頁不需要個人資料即可閱讀；未來會員功能會以最小必要資料支援追蹤與提醒。",
    points: [
      "會員功能開放前，不收集不必要的個人化追蹤資料。",
      "watchlist 與提醒設定未來會清楚標示用途。",
      "個人資料流程需要能查詢、修改與刪除。"
    ]
  },
  terms: {
    eyebrow: "條款提醒",
    title: "使用條款要保護使用者理解邊界",
    summary: "條款頁會說明本站定位、資料限制與使用者責任，避免把資訊輔助誤解為交易承諾。",
    points: [
      "本站不提供買賣建議，也不提供個股買賣建議。",
      "資料可能延遲、缺漏或需要修正。",
      "使用者仍需自行判斷市場風險。"
    ]
  },
  weekly: {
    eyebrow: "週報提醒",
    title: "週報協助回看，不製造交易壓力",
    summary: "週報用來整理一週市場狀態、主要風險與後續觀察重點，幫助使用者形成固定複盤習慣。",
    points: [
      "週報不是單一標的推薦清單。",
      "高風險提醒代表需要複核，不代表立即操作。",
      "資料狀態與更新時間會影響週報可信度。"
    ]
  }
} as const;

export function RouteLocalTrustCopyPanel({ context }: RouteLocalTrustCopyPanelProps) {
  const copy = copyByContext[context];

  return (
    <section className="route-local-trust-copy panel" aria-label={`${copy.eyebrow} route trust copy`}>
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.summary}</p>
      </div>
      <div className="route-local-trust-copy-grid">
        {copy.points.map((point) => (
          <article key={point}>
            <span>資料邊界</span>
            <p>{point}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
