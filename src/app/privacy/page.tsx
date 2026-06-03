import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "隱私權政策",
  description: "說明指數燈號目前的資料使用、追蹤事件、localStorage 與隱私邊界。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">Privacy</p>
        <h1>隱私權政策</h1>
        <p>
          指數燈號目前以產品驗證為主。公開頁面不要求登入，也不需要使用者提供姓名、電話、身分證字號或金融帳戶資料。
        </p>
      </section>

      <TrustRuntimeBoundaryNotice context="privacy" />

      <section className="legal-quick-read" aria-label="隱私權政策重點">
        <article>
          <span>目前不蒐集</span>
          <strong>敏感個資與金融帳戶</strong>
          <p>公開頁面不要求提供身分證字號、銀行帳戶、券商帳號、信用卡或精確財務狀況。</p>
        </article>
        <article>
          <span>可能使用</span>
          <strong>產品互動事件</strong>
          <p>頁面可能記錄頁面瀏覽、按鈕點擊、股票選取與功能互動，用於改善產品流程與可讀性。</p>
        </article>
        <article>
          <span>本機資料</span>
          <strong>localStorage 偏好設定</strong>
          <p>收藏標的等偏好可能儲存在你的瀏覽器 localStorage 中，可由你自行清除。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>我們使用哪些資料</h2>
        <p>
          目前主要使用匿名或低識別性的產品互動資料，例如頁面路徑、事件名稱、標的代碼、按鈕來源與基本瀏覽器狀態。
          這些資料用於確認產品流程是否順暢，並不代表真實投資意圖或財務狀況。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料如何使用</h2>
        <p>
          互動事件用於改善資訊階層、修正錯誤、確認功能是否被理解，以及判斷 mock-only runtime 的揭露是否足夠清楚。
          不會因為互動事件而產生個別投資建議。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料保存與清除</h2>
        <p>
          本機偏好資料可透過瀏覽器設定清除。若未來加入帳號、通知、付費或正式資料服務，會先補充相應的隱私說明與使用者控制方式。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <PrivacyTrustLink href="/terms" label="查看使用條款" />
        <PrivacyTrustLink href="/disclaimer" label="查看免責聲明" />
        <PrivacyTrustLink href="/methodology" label="查看方法說明" />
        <PrivacyTrustLink href="/" label="回到市場首頁" />
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
