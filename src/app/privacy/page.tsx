import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "隱私與資料說明 | Taiwan Market Signal",
  description: "公開 Beta 隱私與資料說明：本站不要求使用者輸入交易帳戶、密鑰或敏感個人資料。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">Privacy</p>
        <h1>隱私與資料說明</h1>
        <p>
          公開 Beta 頁面可以直接瀏覽，不需要輸入交易帳戶、身份證字號、密碼、密鑰或其他敏感資料。
          我們會優先把資料狀態、更新時間與使用邊界說清楚。
        </p>
        <p className="runtime-boundary-line">請不要在任何表單或回饋欄位輸入機密資訊、交易帳戶資訊或完整個資。</p>
      </section>

      <TrustRuntimeBoundaryNotice context="privacy" />
      <RouteLocalTrustCopyPanel context="privacy" />

      <section className="legal-quick-read" aria-label="隱私快速摘要">
        <article>
          <span>不要求機密</span>
          <strong>一般瀏覽即可使用</strong>
          <p>公開頁不需要使用者提供交易帳戶、API 密鑰、系統憑證或其他敏感資訊。</p>
        </article>
        <article>
          <span>行為資料</span>
          <strong>用於改善體驗</strong>
          <p>若有瀏覽或互動紀錄，目的是改善頁面排序、文案理解度與功能穩定性。</p>
        </article>
        <article>
          <span>市場資料</span>
          <strong>只呈現整理後資訊</strong>
          <p>公開頁只呈現必要的摘要與狀態，不顯示逐筆資料內容或不該公開的系統處理內容。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>我們可能使用的資訊</h2>
        <p>可能包含瀏覽頁面、點擊位置、停留時間、裝置類型與錯誤紀錄，用來改善網站可讀性與可靠性。</p>
      </section>

      <section className="panel legal-section">
        <h2>我們不要求的資訊</h2>
        <p>本站不要求交易帳戶、金融憑證、完整身份資料、信用卡資料或任何用於登入第三方服務的密鑰。</p>
      </section>

      <section className="panel legal-section">
        <h2>資料保護方向</h2>
        <p>正式上線前會持續檢查公開頁是否誤露技術欄位、測試資料、機密資訊或讓使用者誤解的技術字樣。</p>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <PrivacyTrustLink href="/terms" label="使用條款" />
        <PrivacyTrustLink href="/disclaimer" label="風險聲明" />
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
