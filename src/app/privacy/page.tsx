import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "隱私說明",
  description: "了解指數燈號目前如何使用基本瀏覽事件與資料邊界說明。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">隱私說明</p>
        <h1>我們只用必要資料改善閱讀體驗</h1>
        <p>
          公開測試版主要追蹤頁面瀏覽、連結點擊與公開頁互動，用來確認使用者是否能快速理解市場狀態與資料邊界。
        </p>
        <p className="runtime-boundary-line">
          目前未實作會員登入、付費、個人投資組合或下單功能；未來若導入會員功能、自選追蹤與自訂警示，會另行補足資料使用說明。
        </p>
      </section>

      <PublicRouteReadingContract context="privacy" />
      <TrustRuntimeBoundaryNotice context="privacy" />

      <section className="panel stock-reading-summary" aria-label="隱私快速說明">
        <p className="eyebrow">隱私快速說明</p>
        <h2>公開 Beta 不需要輸入個人資料</h2>
        <p>目前公開 Beta 以瀏覽市場燈號與說明頁為主，不需要輸入個人資料；若未來啟用會員功能，會再明確揭露資料用途與保存方式。</p>
      </section>

      <section className="legal-quick-read" aria-label="隱私說明摘要">
        <article>
          <span>目前資料</span>
          <strong>基本互動事件</strong>
          <p>例如頁面瀏覽、導覽點擊與公開內容互動，用來改善資訊架構。</p>
        </article>
        <article>
          <span>尚未啟用</span>
          <strong>會員個資</strong>
          <p>公開測試版不處理會員帳號、付款資料或個人化投資設定。</p>
        </article>
        <article>
          <span>資料邊界</span>
          <strong>示範資料</strong>
          <p>市場資料仍維持 mock 邊界，不代表已啟用正式資料服務。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/terms" label="查看服務條款" payload={{ area: "privacy" }}>
          查看服務條款
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "privacy" }}>
          查看風險聲明
        </TrackedLink>
      </section>
    </main>
  );
}
