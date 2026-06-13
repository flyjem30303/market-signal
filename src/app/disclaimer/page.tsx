import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "風險聲明",
  description: "公開 Beta 風險聲明：本站提供市場資訊整理，不提供個別投資建議或保證報酬。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">Disclaimer</p>
        <h1>風險聲明</h1>
        <p>
          指數燈號的目標是協助一般投資者快速理解市場氣氛與風險變化。公開 Beta 階段仍在驗證資料來源、
          更新時間、覆蓋率、指標解釋與使用體驗。
        </p>
        <p className="runtime-boundary-line">本站內容不是投資建議，不保證正確、完整、即時，也不承諾任何投資結果。</p>
      </section>

      <TrustRuntimeBoundaryNotice context="disclaimer" />
      <RouteLocalTrustCopyPanel context="disclaimer" />

      <section className="legal-quick-read" aria-label="風險聲明快速摘要">
        <article>
          <span>資料限制</span>
          <strong>示範資料與示範分數</strong>
          <p>正式市場資料尚未啟用前，分數與警示都只用來展示判讀流程；資料來源、更新時間與覆蓋率仍需確認。</p>
        </article>
        <article>
          <span>非投資建議</span>
          <strong>不提供買賣指令</strong>
          <p>本站不針對個別使用者提供適合度判斷，不提供買賣建議，也不建議買進、賣出或持有任何標的。</p>
        </article>
        <article>
          <span>使用者責任</span>
          <strong>請自行複核資訊</strong>
          <p>使用者應搭配其他可靠來源、個人風險承受度與專業意見後再做決策。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>資料可能不完整</h2>
        <p>公開 Beta 期間，資料可能出現延遲、缺漏、測試調整或暫時無法更新。若資料狀態不明，請以保守方式解讀。</p>
      </section>

      <section className="panel legal-section">
        <h2>市場風險自負</h2>
        <p>投資市場會受價格波動、流動性、政策、匯率與重大事件影響。任何交易行為與結果都由使用者自行承擔。</p>
      </section>

      <section className="panel legal-section">
        <h2>公開 Beta 說明</h2>
        <p>目前網站正在測試資訊架構與決策輔助體驗。正式資料、正式模型與完整覆蓋率會在通過後才清楚標示。</p>
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
