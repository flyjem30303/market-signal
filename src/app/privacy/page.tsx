import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "隱私權與資料說明",
  description: "說明指數燈號 Phase 1 公開版的資料使用方式、追蹤範圍與會員功能資料邊界。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">隱私政策</p>
        <h1>Phase 1 不要求使用者提供姓名、帳號或個人投資資料</h1>
        <p>
          指數燈號公開版目前不啟用登入、付款、自選清單或個人化警示。頁面可能使用基本瀏覽事件，
          協助我們理解哪些公開內容被閱讀，但不要求使用者提供姓名、身分證字號或券商帳戶資料。
        </p>
        <p className="runtime-boundary-line">
          會員功能資料邊界會在啟用前明確說明，包含收集目的、使用範圍、保存期間與刪除方式。
        </p>
      </section>

      <PublicRouteReadingContract context="privacy" />
      <TrustRuntimeBoundaryNotice context="privacy" />

      <section className="legal-quick-read" aria-label="隱私權重點">
        <article>
          <span>目前不收集</span>
          <strong>不要求姓名、帳號或個人投資資料</strong>
          <p>Phase 1 不開放會員登入，也不收集個人資產配置、交易紀錄或券商資料。</p>
        </article>
        <article>
          <span>可能使用</span>
          <strong>基本瀏覽事件與匿名化產品指標</strong>
          <p>我們可能觀察頁面瀏覽、點擊與閱讀路徑，用來改善公開內容與頁面可讀性。</p>
        </article>
        <article>
          <span>會員功能</span>
          <strong>會員功能資料邊界會另行揭露</strong>
          <p>未來若啟用會員功能，會先補齊資料收集目的、使用範圍、保存方式與使用者控制選項。</p>
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
