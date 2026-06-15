import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "會員功能預覽",
  description: "會員功能預告包含市場三層解讀、自選追蹤、自訂警示與盤後複盤；第一階段先完成公開版。"
};

export default function MembershipPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="membership_preview_page_viewed" payload={{ page: "membership" }} />
      <section className="hero">
        <p className="eyebrow">會員功能預覽</p>
        <h1>會員功能預告：公開版穩定後，再做深度解讀與個人化追蹤</h1>
        <p>
          第一階段先完成所有人可使用的市場總覽、核心指標、風險提示與資料更新時間。後續會員功能會提供更完整的市場解讀、
          自選追蹤、自訂警示與盤後複盤。
        </p>
        <p className="runtime-boundary-line">
          會員內容也會維持中性、穩健、非投資建議；不提供個別買賣建議、買賣點或保證報酬。
        </p>
      </section>

      <section className="panel stock-reading-summary" aria-label="會員 MVP 邊界">
        <p className="eyebrow">會員 MVP 邊界</p>
        <h2>會員功能規劃中，尚未開放登入</h2>
        <p>
          公開 Beta 先完成免費市場總覽；後續會員區才會提供自選追蹤與自訂警示、每日市場三層解讀與盤後複盤。所有內容定位為觀察輔助，不提供個股買賣建議。
        </p>
      </section>

      <section className="method-quick-read" aria-label="會員功能預告">
        <article>
          <span>深度解讀</span>
          <strong>每日市場三層解讀</strong>
          <p>用市場總觀、關鍵指標變化與後續觀察重點，協助使用者理解燈號原因。</p>
        </article>
        <article>
          <span>自選追蹤</span>
          <strong>自選追蹤 + 自訂警示</strong>
          <p>讓使用者追蹤自己關心的指數、ETF 或指標；正式實作會留到下一階段。</p>
        </article>
        <article>
          <span>複盤學習</span>
          <strong>盤後複盤報告</strong>
          <p>回顧當日燈號是否有效，以及哪些訊號值得隔日追蹤。</p>
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
