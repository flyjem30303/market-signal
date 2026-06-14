import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "使用條款",
  description: "使用指數燈號網站前，請理解本服務的資訊用途、資料限制與非投資建議邊界。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">Terms</p>
        <h1>使用條款</h1>
        <p>
          使用本網站代表你理解本服務定位為市場資訊整理、風險辨識與觀察輔助工具，而不是投資顧問或交易服務。
          所有內容僅供資訊參考，不是投資建議，請自行評估風險。
        </p>
        <p className="runtime-boundary-line">公開 Beta 期間，部分資料狀態與功能仍為示範或規劃狀態，頁面會明確揭露相關邊界。</p>
      </section>

      <section className="legal-quick-read" aria-label="使用條款重點">
        <article>
          <span>服務用途</span>
          <strong>資訊輔助</strong>
          <p>本網站協助使用者理解市場狀態與風險，不提供下單、券商串接或個人資產配置建議。</p>
        </article>
        <article>
          <span>資料邊界</span>
          <strong>需看來源與時間</strong>
          <p>使用者應注意資料來源、更新時間、延遲與可能缺漏。</p>
        </article>
        <article>
          <span>責任限制</span>
          <strong>自行判斷</strong>
          <p>任何投資決策皆由使用者自行承擔風險。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>可接受使用</h2>
        <p>你可以使用本網站作為市場觀察、學習與資訊整理工具。不得以本網站內容作為保證獲利或交易承諾的宣傳依據。</p>
      </section>

      <section className="panel legal-section">
        <h2>資料與功能變更</h2>
        <p>公開 Beta 期間，資料來源、模型、功能與頁面呈現可能持續調整。重大變更會盡量在頁面或文件中標示。</p>
      </section>

      <PublicRouteReadingContract context="terms" />

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TermsTrustLink href="/disclaimer" label="風險聲明" />
        <TermsTrustLink href="/privacy" label="隱私權" />
        <TermsTrustLink href="/methodology" label="方法說明" />
        <TermsTrustLink href="/" label="回首頁" />
      </section>
    </main>
  );
}

function TermsTrustLink({ href, label }: { href: string; label: string }) {
  return (
    <TrackedLink className="text-link" eventName="trust_link_clicked" href={href} label={label} payload={{ area: "terms_next_links" }}>
      {label}
    </TrackedLink>
  );
}
