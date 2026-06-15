import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "使用條款",
  description: "說明指數燈號網站的使用方式、資料限制與責任邊界。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">使用條款</p>
        <h1>使用本網站前，請先理解資料與風險邊界</h1>
        <p>
          指數燈號網站提供市場資訊整理、風險辨識與觀察輔助。使用者仍需自行判斷資料是否適合自己的需求。
        </p>
        <p className="runtime-boundary-line">
          本網站不提供下單、交易執行、保證報酬或個別投資建議。
        </p>
      </section>

      <PublicRouteReadingContract context="terms" />
      <TrustRuntimeBoundaryNotice context="terms" />

      <section className="legal-quick-read" aria-label="使用條款摘要">
        <article>
          <span>服務定位</span>
          <strong>資訊整理工具</strong>
          <p>網站內容用於協助閱讀市場狀態，不代表任何交易指令。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>可能延遲或不完整</strong>
          <p>資料來源、更新時間與示範狀態會在頁面上標示。</p>
        </article>
        <article>
          <span>使用責任</span>
          <strong>使用者需自行判斷</strong>
          <p>任何投資決策都應由使用者自行評估風險後做出。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/privacy" label="查看隱私政策" payload={{ area: "terms" }}>
          查看隱私政策
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "terms" }}>
          查看風險聲明
        </TrackedLink>
      </section>
    </main>
  );
}
