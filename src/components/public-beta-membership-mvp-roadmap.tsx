const roadmapCards = [
  {
    body: "會員階段可提供每日市場三層解讀，但 Phase 1 不啟用付費、登入或會員內容權限。",
    label: "後續規劃",
    title: "深度解讀"
  },
  {
    body: "未來可提供個人化追蹤與提醒，但 Phase 1 不儲存自選清單或個人化警示條件。",
    label: "後續規劃",
    title: "個人化追蹤"
  },
  {
    body: "未來可提供盤後複盤與歷史案例，Phase 1 先把公開燈號、資料邊界與風險揭露做穩。",
    label: "後續規劃",
    title: "複盤與學習"
  }
];

export function PublicBetaMembershipMvpRoadmap() {
  return (
    <section className="public-beta-membership-roadmap" aria-label="會員功能後續規劃">
      <div className="public-beta-membership-roadmap__intro">
        <p className="eyebrow">會員功能後續規劃</p>
        <h2>Phase 1 先完成免費市場總覽，會員功能不在本階段啟用</h2>
        <p>
          會員功能的方向是讓使用者更理解燈號、追蹤重點並回看判斷品質；但公開 Beta 先聚焦可讀、可信、可驗證的免費版。
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
        <p>目前不開放會員註冊、登入、付款、自選清單儲存或個人化警示。</p>
        <p>若未來啟用會員功能，會先補齊資料使用、付款、權限、風險揭露與客服流程。</p>
      </div>
    </section>
  );
}
