import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "隱私政策",
  description: "說明指數燈號 Phase 1 如何處理使用資料、追蹤事件與資料保護邊界。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">隱私政策</p>
        <h1>Phase 1 不需要輸入個人資料即可使用</h1>
        <p>
          指數燈號公開版目前提供市場總覽、今日簡報、週報與標的燈號。使用者不需要註冊、
          登入或輸入個人投資資料，即可閱讀 Phase 1 內容。
        </p>
        <p className="runtime-boundary-line">
          若未來啟用會員、自選追蹤或自訂警示，會另行揭露需要蒐集的資料、使用目的與退出方式。
        </p>
      </section>

      <PublicRouteReadingContract context="privacy" />
      <TrustRuntimeBoundaryNotice context="privacy" />

      <section className="legal-quick-read" aria-label="隱私政策重點">
        <article>
          <span>目前不收集</span>
          <strong>不需要個人持股或交易資料</strong>
          <p>Phase 1 不要求使用者提供姓名、電話、持股、交易紀錄或券商帳號。</p>
        </article>
        <article>
          <span>可能記錄</span>
          <strong>匿名化的頁面互動事件</strong>
          <p>網站可能記錄頁面瀏覽、導覽點擊與停留情況，用於改善內容排序與使用體驗。</p>
        </article>
        <article>
          <span>未來功能</span>
          <strong>會員功能會另行揭露</strong>
          <p>自選追蹤、自訂警示與會員內容尚非 Phase 1 上線範圍，啟用前會補齊對應告知。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關文件</h2>
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
