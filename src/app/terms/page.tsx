import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "使用條款",
  description: "說明指數燈號 Phase 1 公開版的使用範圍、資料限制、風險提醒與使用者責任。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">使用條款</p>
        <h1>請把指數燈號視為市場資訊整理工具</h1>
        <p>
          指數燈號提供市場燈號、風險提示、資料更新時間與觀察順序，目的是降低資訊理解門檻，而不是提供個別投資建議。
        </p>
        <p className="runtime-boundary-line">
          Phase 1 公開版仍使用示範資料與示範分數；正式資料啟用前，使用者不應把本網站內容視為即時行情或交易依據。
        </p>
      </section>

      <PublicRouteReadingContract context="terms" />
      <TrustRuntimeBoundaryNotice context="terms" />

      <section className="legal-quick-read" aria-label="使用條款摘要">
        <article>
          <span>服務定位</span>
          <strong>市場資訊整理與風險辨識</strong>
          <p>本網站協助使用者理解市場狀態、燈號原因與資料時間，不提供買賣指令、保證報酬或個人化投資配置。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>請搭配來源、時間戳與風險聲明閱讀</strong>
          <p>資料可能延遲、缺漏或仍在示範階段；正式資料上線前，頁面會持續標示資料狀態與使用邊界。</p>
        </article>
        <article>
          <span>使用者責任</span>
          <strong>使用者需自行判斷與承擔風險</strong>
          <p>任何投資行動都應另行複核資料來源、個人風險承受度與專業意見，不應只依賴單一燈號或分數。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>延伸閱讀</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/privacy" label="查看隱私政策" payload={{ area: "terms" }}>
          查看隱私政策
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看免責聲明" payload={{ area: "terms" }}>
          查看免責聲明
        </TrackedLink>
      </section>
    </main>
  );
}
