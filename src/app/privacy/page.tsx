import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "隱私政策",
  description: "說明指數燈號網站在 Phase 1 公開版如何處理基礎互動資料。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">隱私政策</p>
        <h1>Phase 1 公開版只處理基礎互動資料</h1>
        <p>
          指數燈號網站目前以公開市場資訊展示為主，可能記錄頁面瀏覽、連結點擊與基本使用情形，用來改善閱讀流程。
        </p>
        <p className="runtime-boundary-line">
          目前不啟用帳號登入、付款、個人化追蹤或個人化警示資料。
        </p>
      </section>

      <PublicRouteReadingContract context="privacy" />
      <TrustRuntimeBoundaryNotice context="privacy" />

      <section className="legal-quick-read" aria-label="隱私政策重點">
        <article>
          <span>目前範圍</span>
          <strong>公開版互動紀錄</strong>
          <p>Phase 1 只需要理解哪些頁面被閱讀、哪些信任連結被點擊。</p>
        </article>
        <article>
          <span>不收集</span>
          <strong>不處理交易或個人資產資料</strong>
          <p>目前沒有券商串接、下單、個人投資組合或交易紀錄功能。</p>
        </article>
        <article>
          <span>後續功能</span>
          <strong>啟用前另行揭露</strong>
          <p>若未來導入帳號、付款或個人化功能，會在啟用前補充完整資料使用說明。</p>
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
