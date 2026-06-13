import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "使用條款",
  description: "公開 Beta 使用條款：本網站提供市場資訊整理與風險辨識，不提供個別買賣建議。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">Terms</p>
        <h1>使用條款</h1>
        <p>
          指數燈號是市場資訊整理工具。公開 Beta 階段以示範資料呈現產品流程，協助使用者理解市場氣氛、
          風險提示與觀察順序。
        </p>
        <p className="runtime-boundary-line">使用本網站時，請把內容視為資訊參考，而不是投資建議、保證報酬或交易指令。</p>
      </section>

      <TrustRuntimeBoundaryNotice context="terms" />
      <RouteLocalTrustCopyPanel context="terms" />

      <section className="legal-quick-read" aria-label="使用條款快速摘要">
        <article>
          <span>服務定位</span>
          <strong>資訊整理與風險辨識</strong>
          <p>本站協助使用者快速看懂市場狀態，但不替使用者做投資決策。</p>
        </article>
        <article>
          <span>資料狀態</span>
          <strong>正式資料尚未啟用</strong>
          <p>公開 Beta 目前使用示範資料與示範分數，不宣稱即時、完整或正式市場覆蓋。</p>
        </article>
        <article>
          <span>使用責任</span>
          <strong>請自行評估風險</strong>
          <p>任何投資行動都應由使用者自行判斷，並搭配其他可靠資訊與自身風險承受度。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>服務內容</h2>
        <p>本網站提供市場狀態摘要、指標解釋、風險提示與觀察清單。內容可能隨公開 Beta 測試進度調整。</p>
      </section>

      <section className="panel legal-section">
        <h2>資料限制</h2>
        <p>資料可能延遲、缺漏或因測試而調整。正式資料啟用前，所有分數與提示都僅用於示範產品體驗。</p>
      </section>

      <section className="panel legal-section">
        <h2>禁止用途</h2>
        <p>不得把本站內容包裝成保證獲利、個別買賣建議、代客操作依據或任何違反法規的金融服務。</p>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TermsTrustLink href="/disclaimer" label="風險聲明" />
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
