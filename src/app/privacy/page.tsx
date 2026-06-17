import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "隱私權政策",
  description: "說明指數燈號公開版目前如何處理資料、會員功能與個人化功能邊界。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">隱私權政策</p>
        <h1>公開版目前不建立會員資料或個人化投資檔案</h1>
        <p>目前網站不提供登入、付款、watchlist 儲存或自訂警示，因此不會建立個人投資偏好資料。</p>
        <p className="runtime-boundary-line">未來若加入會員功能，會另行揭露資料用途、保存方式、刪除方式與通知設定。</p>
      </section>

      <PublicRouteReadingContract context="privacy" />
      <TrustRuntimeBoundaryNotice context="privacy" />

      <section className="legal-quick-read" aria-label="隱私權摘要">
        <article>
          <span>目前不收集</span>
          <strong>會員帳號、watchlist 與自訂警示</strong>
          <p>公開版尚未啟用會員功能，因此不保存這些個人化資料。</p>
        </article>
        <article>
          <span>基本使用資料</span>
          <strong>可能使用匿名流量指標改善網站</strong>
          <p>若使用流量分析，應以匿名、彙總方式理解頁面使用情況。</p>
        </article>
        <article>
          <span>未來會員</span>
          <strong>會員功能上線前會補充完整政策</strong>
          <p>包含資料用途、保存期限、刪除流程與通知偏好設定。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>延伸閱讀</h2>
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
