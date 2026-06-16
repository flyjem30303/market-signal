import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "隱私政策與資料說明",
  description: "說明指數燈號公開免費版的資料使用方式，以及會員功能尚未啟用的邊界。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">隱私政策</p>
        <h1>公開免費版不啟用會員，也不收集會員追蹤資料</h1>
        <p>
          公開 Beta 目前不提供登入、watchlist、自訂警示或會員專屬內容，因此不會儲存會員個人化追蹤資料。
        </p>
        <p className="runtime-boundary-line">
          會員功能上線前，會另行補齊資料使用、通知、刪除與權限說明。
        </p>
      </section>

      <PublicRouteReadingContract context="privacy" />
      <TrustRuntimeBoundaryNotice context="privacy" />

      <section className="legal-quick-read" aria-label="隱私權重點">
        <article>
          <span>目前不收集</span>
          <strong>不儲存會員個人化追蹤資料</strong>
          <p>目前不開放登入與 watchlist，因此不會產生會員追蹤資料。</p>
        </article>
        <article>
          <span>基本使用</span>
          <strong>可能使用必要的網站技術資料</strong>
          <p>網站可能使用基本技術紀錄維持服務穩定，例如頁面載入與錯誤診斷。</p>
        </article>
        <article>
          <span>會員規劃</span>
          <strong>會員功能會在下一階段補齊隱私規則</strong>
          <p>未來若提供個人化功能，會補上資料保存、刪除與通知規則。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關說明</h2>
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
