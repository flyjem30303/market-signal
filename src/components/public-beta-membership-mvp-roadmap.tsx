const roadmapCards = [
  {
    body: "會員版會把公開燈號拆成市場總觀、關鍵指標變化與後續觀察重點。",
    label: "Phase 2 規劃",
    title: "每日三層解讀"
  },
  {
    body: "未來讓使用者追蹤自己關心的指數、ETF 或指標，並設定觀察條件。",
    label: "Phase 2 規劃",
    title: "Watchlist 與自訂警示"
  },
  {
    body: "回顧當日燈號是否有效、哪些訊號值得隔日追蹤，協助建立固定觀察流程。",
    label: "Phase 2 規劃",
    title: "盤後複盤報告"
  }
];

export function PublicBetaMembershipMvpRoadmap() {
  return (
    <section className="public-beta-membership-roadmap" aria-label="會員功能路線圖">
      <div className="public-beta-membership-roadmap__intro">
        <p className="eyebrow">會員功能路線圖</p>
        <h2>Phase 1 先完成公開版，會員功能留在下一階段</h2>
        <p>
          會員規劃的重點是讓使用者不只看到燈號，而是能理解原因、追蹤變化並回看判斷品質。
          這些功能會在公開版穩定後再進入 Phase 2。
        </p>
      </div>
      <div className="public-beta-membership-roadmap__grid">
        {roadmapCards.map((card) => (
          <article key={card.title}>
            <span>{card.label}</span>
            <strong>{card.title}</strong>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
      <div className="public-beta-membership-roadmap__boundary">
        <p>Phase 1 不包含登入、付款、儲存 watchlist、自訂警示執行或會員專屬內容。</p>
        <p>所有會員規劃都維持資訊整理與風險辨識定位，不提供個股買賣建議。</p>
      </div>
    </section>
  );
}
