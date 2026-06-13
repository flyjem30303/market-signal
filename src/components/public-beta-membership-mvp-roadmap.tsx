import { TrackedLink } from "@/components/tracked-link";

const roadmapCards = [
  {
    label: "深度解讀",
    title: "每日市場三層解讀",
    body: "會員階段會把市場總觀、關鍵指標變化與後續觀察重點整理成固定閱讀格式，協助使用者理解燈號背後原因。"
  },
  {
    label: "個人化追蹤",
    title: "Watchlist 與自訂警示",
    body: "下一階段才會讓使用者追蹤關心的指數、ETF 或指標，並設定至少一種觀察條件；公開 Beta 目前不執行個人化警示。"
  },
  {
    label: "複盤學習",
    title: "盤後複盤報告",
    body: "會員版本會提供盤後回顧，說明當日燈號是否有效、哪些訊號值得隔日追蹤，並維持非投資建議邊界。"
  }
];

export function PublicBetaMembershipMvpRoadmap() {
  return (
    <section className="public-beta-membership-roadmap" aria-label="下一階段會員功能">
      <div className="public-beta-membership-roadmap__intro">
        <p className="eyebrow">下一階段會員功能</p>
        <h2>會員內容會在公開 Beta 穩定後開放</h2>
        <p>
          公開 Beta 先完成所有人都能使用的市場燈號、核心指標、風險提示與更新時間。
          會員功能會在資料來源、產品路徑與信任邊界穩定後，再逐步開放三層解讀、watchlist 與盤後複盤。
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
          目前不提供會員登入、付費、watchlist 儲存、個人化警示執行或會員專屬內容。
          會員預覽只說明產品方向，所有內容仍維持市場資訊整理、風險辨識與非投資建議邊界。
        </p>
        <TrackedLink
          className="text-link"
          eventName="membership_preview_link_clicked"
          href="/membership"
          label="查看會員功能預覽"
          payload={{ area: "membership_roadmap" }}
        >
          查看會員功能預覽
        </TrackedLink>
      </div>
    </section>
  );
}
