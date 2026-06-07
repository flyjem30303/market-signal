import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "隱私政策",
  description: "說明指數燈號目前的資料使用、localStorage、分析事件與模擬資料閱讀邊界。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">Privacy</p>
        <h1>隱私政策</h1>
        <p>
          指數燈號目前仍在產品建置階段。我們只保留必要的本地偏好與頁面互動事件，用來改善體驗與確認
          模擬資料閱讀邊界是否清楚。
        </p>
      </section>

      <TrustRuntimeBoundaryNotice context="privacy" />
      <RouteLocalTrustCopyPanel context="privacy" />

      <section className="legal-quick-read" aria-label="隱私政策重點">
        <article>
          <span>目前不做</span>
          <strong>不收集交易帳戶資料</strong>
          <p>公開頁面不要求輸入券商帳號、交易密碼、身分證件、信用卡或銀行帳戶資訊。</p>
        </article>
        <article>
          <span>網站使用</span>
          <strong>基礎互動事件</strong>
          <p>頁面可能記錄瀏覽、點擊與導覽事件，用於產品品質分析；這些事件不代表投資行為或交易意圖。</p>
        </article>
        <article>
          <span>本機資料</span>
          <strong>localStorage 偏好設定</strong>
          <p>部分介面偏好可能存在瀏覽器 localStorage。你可以透過瀏覽器設定清除這些本機資料。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>我們可能使用的資料</h2>
        <p>
          目前可能使用頁面瀏覽、按鈕點擊、導覽來源、裝置與瀏覽器狀態等基礎資料，以判斷功能是否清楚、路由是否正常，以及公開揭露是否足夠。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料不會用於投資建議</h2>
        <p>
          互動事件與本機偏好不會用來產生個人化投資建議，也不會改變公開資料與分數仍為模擬狀態的邊界。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料保存與清除</h2>
        <p>
          localStorage 由你的瀏覽器保存，你可以自行清除。若未來加入帳號、訂閱、正式資料或第三方服務，隱私政策會在功能開放前更新。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>相關文件</h2>
        <PrivacyTrustLink href="/terms" label="查看使用條款" />
        <PrivacyTrustLink href="/disclaimer" label="查看免責聲明" />
        <PrivacyTrustLink href="/methodology" label="查看方法說明" />
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
