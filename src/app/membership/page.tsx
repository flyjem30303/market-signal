import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "會員規劃",
  description: "會員功能規劃包含市場三層解讀、watchlist、自訂警示與盤後複盤。第一階段先完成公開版。"
};

export default function MembershipPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="membership_preview_page_viewed" payload={{ page: "membership" }} />
      <section className="hero">
        <p className="eyebrow">會員規劃</p>
        <h1>下一階段：會員深度解讀與個人化追蹤</h1>
        <p>
          會員功能會在公開版穩定後啟動。方向包含市場三層解讀、自選追蹤 watchlist、自訂警示條件與盤後複盤，目標是讓使用者更快理解市場變化。
        </p>
        <p className="runtime-boundary-line">會員內容仍會維持中性、穩健、非投資建議，不提供買賣點或保證報酬。</p>
      </section>

      <section className="method-quick-read" aria-label="會員 MVP">
        <article>
          <span>深度解讀</span>
          <strong>市場三層解讀</strong>
          <p>市場總觀、關鍵指標變化與後續觀察重點。</p>
        </article>
        <article>
          <span>個人化追蹤</span>
          <strong>watchlist + 自訂警示</strong>
          <p>追蹤關心的指數、ETF 或指標，建立自己的觀察流程。</p>
        </article>
        <article>
          <span>複盤學習</span>
          <strong>盤後複盤</strong>
          <p>回看當日燈號是否有效，以及哪些訊號值得隔日追蹤。</p>
        </article>
      </section>

      <section className="panel method-links">
        <h2>先回到公開版</h2>
        <TrackedLink className="text-link" eventName="membership_preview_link_clicked" href="/" label="回到市場總覽" payload={{ area: "membership" }}>
          回到市場總覽
        </TrackedLink>
        <TrackedLink className="text-link" eventName="membership_preview_link_clicked" href="/briefing" label="查看市場簡報" payload={{ area: "membership" }}>
          查看市場簡報
        </TrackedLink>
      </section>
    </main>
  );
}
