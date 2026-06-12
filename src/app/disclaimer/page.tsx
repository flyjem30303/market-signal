import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "免責聲明 | Taiwan Market Signal",
  description:
    "公開 Beta 免責聲明：本網站目前使用示範資料與示範分數，正式市場資料尚未啟用，內容為非投資建議。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">Disclaimer</p>
        <h1>免責聲明</h1>
        <p>
          Taiwan Market Signal 是公開 Beta 的市場狀態儀表站。現階段以示範資料與示範分數說明產品流程，
          正式市場資料尚未啟用，內容不構成任何投資、買賣或持有建議。
        </p>
        <p className="runtime-boundary-line">
          請自行查證並評估風險；投資決策應以自己的財務狀況、風險承受度與專業意見為準。
        </p>
      </section>

      <TrustRuntimeBoundaryNotice context="disclaimer" />
      <RouteLocalTrustCopyPanel context="disclaimer" />

      <section className="legal-quick-read" aria-label="免責聲明重點">
        <article>
          <span>資料狀態</span>
          <strong>示範資料與示範分數</strong>
          <p>公開 Beta 目前維持 publicDataSource=mock；scoreSource=mock，不宣稱即時、完整或正式市場資料。</p>
        </article>
        <article>
          <span>使用方式</span>
          <strong>資訊整理，不是買賣指令</strong>
          <p>頁面可協助辨識市場氛圍與風險，但非投資建議，也不保證報酬或避免損失。</p>
        </article>
        <article>
          <span>風險承擔</span>
          <strong>請自行查證並評估風險</strong>
          <p>任何行動前，請確認資料來源、更新時間、個人風險承受度與交易成本。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>資料限制</h2>
        <p>
          本網站可能出現延遲、缺漏、錯誤或無法更新。資料來源權利、欄位契約與覆蓋率尚未完成前，不會宣稱 real data promotion。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>非投資建議</h2>
        <p>
          所有指數、ETF、個股、產業與風險訊號都只作為資訊整理與決策輔助介面展示，不代表任何個別證券的買賣建議。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>Beta 期間變更</h2>
        <p>
          Beta 期間變更可能包含頁面、指標、資料欄位、模型權重與揭露方式。若這些變更影響使用者理解，頁面會盡量提供清楚說明。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <LegalTrustLink href="/methodology" label="方法說明" />
        <LegalTrustLink href="/terms" label="使用條款" />
        <LegalTrustLink href="/privacy" label="隱私與資料說明" />
        <LegalTrustLink href="/" label="回到首頁" />
      </section>
    </main>
  );
}

function LegalTrustLink({ href, label }: { href: string; label: string }) {
  return (
    <TrackedLink className="text-link" eventName="trust_link_clicked" href={href} label={label} payload={{ area: "disclaimer_next_links" }}>
      {label}
    </TrackedLink>
  );
}
