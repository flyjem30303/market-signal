import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "隱私權政策",
  description: "說明指數燈號公開 Beta 階段的資料使用與後續會員功能邊界。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">隱私權政策</p>
        <h1>公開瀏覽階段不建立會員資料</h1>
        <p>會員、watchlist 與個人化警示屬後續階段；正式上線前會補齊更完整的資料使用說明。</p>
        <p className="runtime-boundary-line">目前不建立交易連線，也不處理個人資產配置資料。</p>
      </section>

      <PublicRouteReadingContract context="privacy" />
      <RouteLocalTrustCopyPanel context="privacy" />
      <TrustRuntimeBoundaryNotice context="privacy" />

      <section className="legal-quick-read" aria-label="隱私權重點">
        <article>
          <span>目前不做</span>
          <strong>不串接券商交易</strong>
          <p>目前不做下單、資產配置或交易帳戶整合。</p>
        </article>
        <article>
          <span>基本追蹤</span>
          <strong>只用於改善內容與流程</strong>
          <p>頁面瀏覽與互動事件用來觀察產品是否容易理解。</p>
        </article>
        <article>
          <span>後續會員</span>
          <strong>會員功能上線前另補政策</strong>
          <p>watchlist、自訂警示與通知設定會在會員版本補齊資料權限說明。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
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
