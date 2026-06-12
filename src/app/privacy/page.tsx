import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "隱私與資料說明 | Taiwan Market Signal",
  description:
    "公開 Beta 隱私與資料說明：公開頁不要求輸入密鑰，不顯示原始市場 payload，並維持 mock-only 公開狀態。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">Privacy</p>
        <h1>隱私與資料說明</h1>
        <p>
          公開 Beta 頁面只需要一般瀏覽資訊即可使用。使用者不需要輸入 API key、交易帳戶、身份證字號或任何機密資料。
          目前公開頁維持 mock-only 狀態。
        </p>
        <p className="runtime-boundary-line">公開頁不顯示 secrets、raw market payloads、row payloads 或 stock id payloads。</p>
      </section>

      <TrustRuntimeBoundaryNotice context="privacy" />
      <RouteLocalTrustCopyPanel context="privacy" />

      <section className="legal-quick-read" aria-label="隱私重點">
        <article>
          <span>不要求機密</span>
          <strong>不輸入密鑰</strong>
          <p>使用公開頁不需要提供 Supabase key、內部 token 或交易帳戶資訊。</p>
        </article>
        <article>
          <span>瀏覽體驗</span>
          <strong>可能使用本機偏好</strong>
          <p>若未來提供收藏、篩選或偏好設定，會優先使用本機瀏覽器儲存並清楚揭露。</p>
        </article>
        <article>
          <span>市場資料</span>
          <strong>不公開原始 payload</strong>
          <p>公開頁只顯示整理後的狀態、說明與風險提示，不公開原始市場資料內容，也不把內部 row payload 直接暴露給使用者。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>我們可能記錄什麼</h2>
        <p>
          為改善產品，未來可能記錄頁面瀏覽、點擊、停留時間與互動事件。這些資訊應用於產品分析，不用於提供個人化投資建議。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>我們不會要求什麼</h2>
        <p>
          公開 Beta 不要求使用者輸入交易帳密、券商帳號、API secret、身份證字號或任何足以執行交易的資訊。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料安全邊界</h2>
        <p>
          資料來源升級與後台寫入流程會留在受控工程流程中，不會透過公開頁要求使用者貼上機密或原始市場資料。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <PrivacyTrustLink href="/terms" label="使用條款" />
        <PrivacyTrustLink href="/disclaimer" label="免責聲明" />
        <PrivacyTrustLink href="/methodology" label="方法說明" />
        <PrivacyTrustLink href="/" label="回到首頁" />
      </section>
    </main>
  );
}

function PrivacyTrustLink({ href, label }: { href: string; label: string }) {
  return (
    <TrackedLink className="text-link" eventName="trust_link_clicked" href={href} label={label} payload={{ area: "privacy_next_links" }}>
      {label}
    </TrackedLink>
  );
}
