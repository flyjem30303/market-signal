import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "會員功能預覽",
  description: "會員功能預告：公開版先完成市場總覽、核心指標與風險提示，後續再導入深度解讀與個人化追蹤。",
  robots: {
    follow: false,
    index: false
  }
};

export default function MembershipPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="membership_preview_page_viewed" payload={{ page: "membership" }} />

      <section className="hero">
        <p className="eyebrow">會員功能預覽</p>
        <h1>會員功能預告：從看到燈號，延伸到理解與追蹤</h1>
        <p>
          指數燈號目前先完成公開免費版，讓使用者在 30 秒內看懂市場狀態，並在 3 分鐘內判斷是否需要關注、加強觀察或降低風險。
          後續會員功能會在公開版穩定後，再逐步導入深度解讀、自選追蹤、自訂警示與盤後複盤。
        </p>
        <p className="runtime-boundary-line">
          目前尚未開放會員登入、付款、持久化自選清單或個人化警示；本頁只說明第二階段產品方向，不代表功能已上線。
        </p>
      </section>

      <section className="panel stock-reading-summary" aria-label="會員功能邊界">
        <p className="eyebrow">會員功能邊界</p>
        <h2>會員功能規劃中，尚未開放登入</h2>
        <p>
          會員版本會延伸「看到燈號」到「理解燈號」與「追蹤變化」。初期不做交易、不串接券商、不提供個人資產配置建議，
          也不提供買賣建議，不提供個別買賣建議，不提供個股買賣建議。
        </p>
      </section>

      <section className="method-quick-read" aria-label="會員功能規劃">
        <article>
          <span>深度解讀</span>
          <strong>每日市場三層解讀</strong>
          <p>補充市場總觀、關鍵指標變化原因與後續觀察重點，讓使用者知道燈號背後的脈絡。</p>
        </article>
        <article>
          <span>個人化追蹤</span>
          <strong>自選追蹤與自訂警示</strong>
          <p>讓使用者追蹤自己關心的指數、ETF 或指標，並在條件觸發時收到清楚的風險提醒。</p>
        </article>
        <article>
          <span>複盤學習</span>
          <strong>盤後複盤報告</strong>
          <p>回顧當日燈號是否有效、哪些訊號值得隔日追蹤，協助使用者建立穩定的觀察流程。</p>
        </article>
      </section>

      <section className="panel method-links">
        <h2>先回到公開版體驗</h2>
        <TrackedLink className="text-link" eventName="membership_preview_link_clicked" href="/" label="查看市場總覽" payload={{ area: "membership" }}>
          查看市場總覽
        </TrackedLink>
        <TrackedLink className="text-link" eventName="membership_preview_link_clicked" href="/briefing" label="閱讀市場簡報" payload={{ area: "membership" }}>
          閱讀市場簡報
        </TrackedLink>
      </section>
    </main>
  );
}
