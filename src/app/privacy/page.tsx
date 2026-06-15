import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "隱私政策",
  description: "說明指數燈號網站如何處理公開版基礎互動資料與未來會員資料邊界。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">隱私政策</p>
        <h1>Phase 1 公開版不需要敏感交易資料</h1>
        <p>
          目前公開版主要提供市場燈號閱讀，不需要使用者提供券商帳戶、資產配置或個人交易紀錄。
        </p>
        <p className="runtime-boundary-line">
          未來若導入會員、watchlist 或個人化警示，會再補充更完整的資料使用說明。
        </p>
      </section>

      <PublicRouteReadingContract context="privacy" />
      <TrustRuntimeBoundaryNotice context="privacy" />

      <section className="legal-quick-read" aria-label="隱私政策摘要">
        <article>
          <span>目前階段</span>
          <strong>公開閱讀為主</strong>
          <p>Phase 1 以公開頁面瀏覽與基本互動為主。</p>
        </article>
        <article>
          <span>不需要</span>
          <strong>交易帳戶或資產資料</strong>
          <p>網站不要求使用者提供下單權限或個人投資組合。</p>
        </article>
        <article>
          <span>未來功能</span>
          <strong>會員資料另行揭露</strong>
          <p>會員功能上線前會補上註冊、登入、watchlist 與警示資料說明。</p>
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
