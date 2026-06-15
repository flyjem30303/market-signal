import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "隱私政策",
  description: "說明指數燈號 Phase 1 公開版的資料使用、會員資料邊界與追蹤原則。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">隱私政策</p>
        <h1>Phase 1 公開版不啟用會員或付款資料</h1>
        <p>
          指數燈號目前提供公開瀏覽體驗，不要求會員登入、不收集付款資料，也不儲存自選清單或個人化警示條件。
        </p>
        <p className="runtime-boundary-line">
          若未來導入會員功能，會在啟用前補充資料收集目的、使用範圍、保存期間與刪除方式。
        </p>
      </section>

      <PublicRouteReadingContract context="privacy" />
      <TrustRuntimeBoundaryNotice context="privacy" />

      <section className="legal-quick-read" aria-label="隱私政策重點">
        <article>
          <span>目前收集</span>
          <strong>基本瀏覽事件</strong>
          <p>Phase 1 只用於理解頁面瀏覽、連結點擊與使用流程，不建立個人投資檔案。</p>
        </article>
        <article>
          <span>目前不收集</span>
          <strong>不收集會員與付款資料</strong>
          <p>目前沒有會員登入、付款、自選清單儲存或個人化警示，因此不處理相關個資。</p>
        </article>
        <article>
          <span>後續功能</span>
          <strong>會員功能需另行揭露</strong>
          <p>未來若加入會員或提醒功能，會先說明資料用途、權限、保存與刪除流程。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/terms" label="查看使用條款" payload={{ area: "privacy" }}>
          查看使用條款
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看免責聲明" payload={{ area: "privacy" }}>
          查看免責聲明
        </TrackedLink>
      </section>
    </main>
  );
}
