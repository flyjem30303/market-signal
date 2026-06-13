import { TrackedLink } from "@/components/tracked-link";

const roadmapCards = [
  {
    label: "深度解讀",
    title: "每日市場三層解讀",
    body: "未來會員區會把市場總觀、關鍵指標變化與後續觀察重點整理成一份每日解讀，幫助使用者理解燈號背後的原因。"
  },
  {
    label: "個人追蹤",
    title: "Watchlist 與自訂警示",
    body: "使用者可以追蹤自己關心的指數、ETF 或指標，並設定觀察條件。初期會以提醒與追蹤為主，不會串接交易。"
  },
  {
    label: "複盤學習",
    title: "盤後複盤報告",
    body: "盤後回看當日燈號是否有效、哪些訊號值得隔日追蹤，讓使用者逐步建立自己的市場觀察流程。"
  }
];

export function PublicBetaMembershipMvpRoadmap() {
  return (
    <section className="public-beta-membership-roadmap" aria-label="會員功能規劃">
      <div className="public-beta-membership-roadmap__intro">
        <p className="eyebrow">下一階段會員功能</p>
        <h2>未來會員功能會從理解燈號開始</h2>
        <p>
          目前公開版先讓所有使用者看懂市場燈號、核心指標、風險提醒與資料更新狀態。
          會員內容會在公開 Beta 穩定後開放，重點是深度解讀、個人化追蹤與盤後複盤。
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
          會員內容仍會維持中性、穩健、非投資建議的定位。它會協助使用者觀察市場與回看判斷品質，
          不會提供保證報酬、個股買賣建議或交易執行。目前不提供會員登入、付費、watchlist 儲存、個人化警示執行或會員專屬內容。
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
