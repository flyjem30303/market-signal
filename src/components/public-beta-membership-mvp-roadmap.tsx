import { TrackedLink } from "@/components/tracked-link";

const roadmapCards = [
  {
    label: "深度解讀",
    title: "每日市場三層解讀",
    body: "先用市場總觀、關鍵指標變化與後續觀察重點，協助會員從看到燈號延伸到理解燈號。"
  },
  {
    label: "個人化追蹤",
    title: "Watchlist 與自訂警示",
    body: "讓使用者追蹤自己關心的指數、ETF 或指標；正式會員系統開放前，不會儲存 watchlist。"
  },
  {
    label: "複盤與學習",
    title: "盤後複盤報告",
    body: "回看當日燈號是否有效、哪些訊號值得隔日追蹤，避免只看單一數字做判斷。"
  }
];

export function PublicBetaMembershipMvpRoadmap() {
  return (
    <section className="public-beta-membership-roadmap" aria-label="會員 MVP 路線圖">
      <div className="public-beta-membership-roadmap__intro">
        <p className="eyebrow">下一階段會員功能</p>
        <h2>會員 MVP 是第二階段，第一階段先把免費指數燈號做穩</h2>
        <p>
          30 秒先看市場氣氛，3 分鐘再看成因。會員內容會在公開 Beta 穩定後開放，未來會補上更完整的原因分析、watchlist、自訂警示與盤後複盤，
          但這頁是會員路線圖，不是會員入口。
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
          目前不會建立帳號、不會收費、不會儲存 watchlist、不會發送個人化警示。
          會員註冊、登入、付費訂閱、個人 watchlist 儲存、自訂警示執行與會員專屬內容都尚未開放。
          正式市場資料尚未啟用，本區也不是非投資建議以外的交易服務。
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
