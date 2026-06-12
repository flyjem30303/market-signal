import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "使用條款 | Taiwan Market Signal",
  description:
    "公開 Beta 使用條款：目前以示範資料與示範分數提供資訊整理，正式市場資料尚未啟用，內容為非投資建議。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">Terms</p>
        <h1>使用條款</h1>
        <p>
          使用本公開 Beta 代表你理解：網站目前是資訊產品原型，使用示範資料與示範分數呈現市場狀態儀表站的流程。
          正式市場資料尚未啟用，內容不構成投資建議。
        </p>
        <p className="runtime-boundary-line">請自行評估風險，不要把任何頁面狀態當成單一買賣依據。</p>
      </section>

      <TrustRuntimeBoundaryNotice context="terms" />
      <RouteLocalTrustCopyPanel context="terms" />

      <section className="legal-quick-read" aria-label="使用條款重點">
        <article>
          <span>服務狀態</span>
          <strong>公開 Beta</strong>
          <p>功能、資料欄位、文案、指標與頁面可能調整；Beta 期間可能變動，不保證不中斷。</p>
        </article>
        <article>
          <span>資料狀態</span>
          <strong>示範資料與示範分數</strong>
          <p>publicDataSource=mock；scoreSource=mock。正式市場資料尚未啟用，也不宣稱完整覆蓋。</p>
        </article>
        <article>
          <span>使用責任</span>
          <strong>自行判斷與查證</strong>
          <p>你應自行評估風險、資料適用性與交易成本，並理解本網站不提供個別買賣建議。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>可接受使用</h2>
        <p>
          本網站可用於學習、觀察市場狀態與比較指標呈現方式；不得用於誤導他人、散布未經確認的投資結論或宣稱保證績效。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料與服務限制</h2>
        <p>
          系統可能因資料、快取、部署或第三方服務而出現延遲、錯誤或缺漏。公開 Beta 不承諾即時精準到秒。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>Beta 期間可能變動</h2>
        <p>
          我們會依資料來源權利、產品測試與使用者回饋調整功能。重大調整會盡量以頁面文案或狀態標籤提示。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TermsTrustLink href="/disclaimer" label="免責聲明" />
        <TermsTrustLink href="/privacy" label="隱私與資料說明" />
        <TermsTrustLink href="/methodology" label="方法說明" />
        <TermsTrustLink href="/" label="回到首頁" />
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
