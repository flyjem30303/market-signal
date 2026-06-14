import { TrackedLink } from "@/components/tracked-link";

// Phase 2 membership roadmap source marker; public copy stays Traditional Chinese.
const roadmapCards = [
  {
    body: "每天用市場總觀、關鍵指標變化、後續觀察重點三段式，讓會員快速理解燈號背後的原因。",
    label: "深度解讀",
    title: "每日市場三層解讀"
  },
  {
    body: "讓使用者追蹤自己關心的指數、ETF 或指標，並設定至少一種提醒條件。",
    label: "個人化追蹤",
    title: "自選追蹤與自訂警示"
  },
  {
    body: "回看當日燈號是否有效、哪些訊號值得隔日追蹤，逐步建立自己的觀察節奏。",
    label: "複盤與學習",
    title: "盤後複盤報告"
  }
];

export function PublicBetaMembershipMvpRoadmap() {
  return (
    <section className="public-beta-membership-roadmap" aria-label="會員功能規劃">
      <div className="public-beta-membership-roadmap__intro">
        <p className="eyebrow">第二階段會員路線圖</p>
        <h2>下一階段：從看到燈號，升級成理解燈號</h2>
        <p>
          第一階段先把免費市場總覽做好；會員功能會在後續階段導入，重點是深度解讀、個人化追蹤與盤後複盤，
          不提供買賣建議，也不代替使用者做投資決策。
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
          會員內容會以觀察、風險提醒、情境判斷與資料解讀為核心。初期不做下單、不串接券商、不提供資產配置建議，
          也不承諾任何報酬。
        </p>
        <p>
          目前不提供會員登入、付費、自選追蹤儲存、個人化警示執行或會員專屬內容。
        </p>
        <TrackedLink
          className="text-link"
          eventName="membership_preview_link_clicked"
          href="/membership"
          label="查看會員規劃"
          payload={{ area: "membership_roadmap" }}
        >
          查看會員規劃
        </TrackedLink>
      </div>
    </section>
  );
}
