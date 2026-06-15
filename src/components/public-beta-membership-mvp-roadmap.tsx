const roadmapCards = [
  {
    body: "未來可把市場總覽拆成市場總觀、關鍵指標變化與後續觀察重點，但 Phase 1 不把它做成已上線承諾。",
    label: "後續規劃",
    title: "每日市場三層解讀"
  },
  {
    body: "未來可提供個人化追蹤與提醒，但 Phase 1 不啟用帳號、付費、自選清單儲存或個人化警示。",
    label: "後續規劃",
    title: "個人化追蹤"
  },
  {
    body: "未來可回看燈號變化與判讀品質，但 Phase 1 先完成公開資料狀態、方法說明與風險揭露。",
    label: "後續規劃",
    title: "盤後複盤與學習"
  }
];

export function PublicBetaMembershipMvpRoadmap() {
  return (
    <section className="public-beta-membership-roadmap" aria-label="後續功能規劃">
      <div className="public-beta-membership-roadmap__intro">
        <p className="eyebrow">後續功能規劃</p>
        <h2>Phase 1 先完成公開免費版，進階功能不放入目前上線承諾</h2>
        <p>
          本區塊只描述後續產品方向，不代表目前已提供登入、付費、個人化追蹤、警示執行或專屬內容。
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
        <p>
          目前公開版的目標是讓使用者看懂市場燈號、核心指標、主要風險與資料更新狀態。
        </p>
        <p>
          若未來啟用會員或個人化功能，會先補齊資料使用、付款、權限、風險揭露與客服流程。
        </p>
      </div>
    </section>
  );
}
