import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "隱私政策",
  description: "說明公開版與未來會員功能可能涉及的資料範圍；目前不啟用會員登入或持久化自選追蹤。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">隱私政策</p>
        <h1>公開版可直接瀏覽；會員資料功能會在啟用前另行說明</h1>
        <p>
          第一階段以公開市場總覽為主，不啟用會員登入、付款、持久化自選追蹤或個人化警示。若未來開放會員功能，
          會先說明收集目的、使用範圍與保存方式。
        </p>
        <p className="runtime-boundary-line">
          自選追蹤、警示與盤後複盤屬於後續會員功能預告；目前公開版不需要使用者提供敏感資料。
        </p>
      </section>

      <section className="legal-quick-read" aria-label="隱私政策快讀">
        <article>
          <span>公開版</span>
          <strong>可直接瀏覽</strong>
          <p>目前核心頁面不要求登入，也不需要提供個人金融資料。</p>
        </article>
        <article>
          <span>自選追蹤</span>
          <strong>尚未啟用</strong>
          <p>自選追蹤與自訂警示會留到會員階段，正式啟用前會另行揭露。</p>
        </article>
        <article>
          <span>風險聲明</span>
          <strong>非投資建議</strong>
          <p>隱私政策不改變網站定位：本網站只提供市場資訊整理與觀察輔助。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關文件</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/terms" label="查看使用條款" payload={{ area: "privacy" }}>
          查看使用條款
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "privacy" }}>
          查看風險聲明
        </TrackedLink>
      </section>
    </main>
  );
}
