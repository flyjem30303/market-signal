import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "風險聲明",
  description: "指數燈號提供市場資訊整理與風險辨識，不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">Risk Disclosure</p>
        <h1>風險聲明</h1>
        <p>
          指數燈號是市場資訊整理、風險辨識與觀察輔助工具。網站內容不構成個股買賣建議、不保證獲利，也不代替使用者做投資決策；市場風險自負。
        </p>
        <p className="runtime-boundary-line">
          目前公開頁以示範資料呈現閱讀流程；正式資料尚未啟用、正式市場資料尚未啟用前，所有燈號都應視為產品體驗與方法展示，不要當成交易指令。
        </p>
      </section>

      <section className="legal-quick-read" aria-label="風險快速閱讀">
        <article>
          <span>網站定位</span>
          <strong>資訊整理與風險辨識</strong>
          <p>本站協助使用者快速理解市場氣氛與觀察重點，不替使用者決定買賣。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>可能延遲或缺漏</strong>
          <p>資料來源、更新時間與資料狀態都會影響解讀，請勿把燈號視為即時交易訊號。</p>
        </article>
        <article>
          <span>使用責任</span>
          <strong>自行判斷與承擔風險</strong>
          <p>任何投資行為都需要自行評估，本站不承諾任何報酬結果。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>不提供買賣建議</h2>
        <p>網站中的燈號、分數、圖表、警示與文字說明都只用於市場觀察，不應被解讀為任何標的的買進、賣出或持有建議。</p>
      </section>

      <section className="panel legal-section">
        <h2>資料狀態需要複核</h2>
        <p>若資料延遲、缺漏、覆蓋率不足或尚未正式啟用，前台會標示資料狀態。使用者應先確認更新時間與資料邊界，再閱讀燈號。</p>
      </section>

      <RouteLocalTrustCopyPanel context="disclaimer" />
      <PublicRouteReadingContract context="disclaimer" />

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <LegalTrustLink href="/methodology" label="方法說明" />
        <LegalTrustLink href="/terms" label="使用條款" />
        <LegalTrustLink href="/privacy" label="隱私政策" />
        <LegalTrustLink href="/" label="市場總覽" />
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
