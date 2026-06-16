import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "使用條款",
  description: "說明指數燈號公開 Beta 的使用方式、資料限制與非投資建議邊界。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">使用條款</p>
        <h1>使用指數燈號前，請先理解網站定位</h1>
        <p>
          指數燈號是市場資訊整理與風險辨識工具。使用者應自行確認資料時間、來源限制與個人風險承受度。
        </p>
        <p className="runtime-boundary-line">
          Phase 1 使用示範資料；會員、watchlist、自訂警示與正式資料功能尚未啟用。
        </p>
      </section>

      <PublicRouteReadingContract context="terms" />
      <TrustRuntimeBoundaryNotice context="terms" />

      <section className="legal-quick-read" aria-label="使用條款重點">
        <article>
          <span>使用範圍</span>
          <strong>市場資訊整理與風險辨識</strong>
          <p>本網站不提供下單、不串接券商交易，也不提供個人資產配置建議。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>資料可能延遲或處於示範模式</strong>
          <p>正式資料切換前，使用者不應把頁面內容當作即時行情。</p>
        </article>
        <article>
          <span>風險責任</span>
          <strong>使用者需自行承擔投資風險</strong>
          <p>本網站不承諾任何報酬，也不保證燈號能預測未來市場。</p>
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
