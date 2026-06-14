import { TrackedLink } from "@/components/tracked-link";

const roadmapCards = [
  {
    body: "以市場總觀、關鍵指標變化與後續觀察重點，協助會員理解燈號背後的原因。",
    label: "深度解讀",
    title: "每日市場三層解讀"
  },
  {
    body: "讓會員追蹤自己關心的指數、ETF 或指標，並設定觀察條件；初期只做觀察輔助，不進入交易執行。",
    label: "個人化追蹤",
    title: "自選追蹤與自訂警示"
  },
  {
    body: "回看當日燈號是否有效、哪些訊號值得隔日追蹤，讓使用者建立固定複盤習慣。",
    label: "複盤與學習",
    title: "盤後複盤報告"
  }
];

export function PublicBetaMembershipMvpRoadmap() {
  return (
    <section className="public-beta-membership-roadmap" aria-label="會員 MVP 路線圖">
      <div className="public-beta-membership-roadmap__intro">
        <p className="eyebrow">第二階段會員路線圖</p>
        <h2>會員 MVP 會在公開免費頁穩定後推進</h2>
        <p>
          目前公開頁先讓所有使用者看懂市場燈號、核心指標、風險提示與更新時間。下一階段會員功能再把「看到燈號」延伸成「理解燈號、追蹤變化、回看判斷品質」。
        </p>
        <p>會員 MVP 是第二階段，第一階段先把免費指數燈號做穩。</p>
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
          會員功能目前仍是路線圖，不會建立帳號、不會收費、不會儲存自選清單，也不會發送個人化警示。
          未來會員內容仍會維持資訊整理、風險辨識與觀察輔助定位，不提供個別買賣建議。
        </p>
        <p>目前不提供會員登入、付費、自選追蹤儲存、個人化警示執行或會員專屬內容。</p>
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
