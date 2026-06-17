import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "使用條款",
  description: "說明指數燈號公開版的資訊用途、資料限制與使用者責任。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">使用條款</p>
        <h1>使用指數燈號前，請先理解資訊用途與限制</h1>
        <p>本網站提供市場資訊整理、風險辨識與觀察輔助，不提供個別投資建議或任何報酬承諾。</p>
        <p className="runtime-boundary-line">目前公開版沒有會員登入、付款、watchlist 儲存或自訂警示執行。</p>
      </section>

      <PublicRouteReadingContract context="terms" />
      <TrustRuntimeBoundaryNotice context="terms" />

      <section className="legal-quick-read" aria-label="使用條款摘要">
        <article>
          <span>使用目的</span>
          <strong>市場資訊整理與風險觀察</strong>
          <p>使用者可以參考燈號建立觀察流程，但不能把它視為交易指令。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>資料可能延遲、缺漏或仍為示範</strong>
          <p>正式資料啟用前，所有前台分數都只用於產品流程展示。</p>
        </article>
        <article>
          <span>使用責任</span>
          <strong>使用者需自行判斷風險</strong>
          <p>任何根據本網站內容做出的投資行為，都由使用者自行負責。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關文件</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/privacy" label="查看隱私權政策" payload={{ area: "terms" }}>
          查看隱私權政策
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "terms" }}>
          查看風險聲明
        </TrackedLink>
      </section>
    </main>
  );
}
