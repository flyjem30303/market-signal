import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "使用條款",
  description: "說明指數燈號公開版的使用範圍、資料限制與非投資建議邊界。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">使用條款</p>
        <h1>請將指數燈號視為市場資訊整理工具</h1>
        <p>
          指數燈號協助使用者快速理解市場狀態、風險位置與後續觀察重點。網站內容僅供市場觀察與資訊參考，
          不構成投資建議、交易建議或任何獲利承諾，不能當作交易指令。
        </p>
        <p className="runtime-boundary-line">
          Phase 1 使用示範資料與公開說明呈現產品流程；真實資料切換前，網站會持續標示資料來源與更新狀態。
        </p>
      </section>

      <PublicRouteReadingContract context="terms" />
      <TrustRuntimeBoundaryNotice context="terms" />

      <section className="legal-quick-read" aria-label="使用條款重點">
        <article>
          <span>使用範圍</span>
          <strong>市場總覽與風險辨識</strong>
          <p>燈號、分數與摘要用於協助閱讀市場，不應作為單一買賣依據。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>請留意來源、時間與延遲</strong>
          <p>資料可能因來源、更新時間或驗證狀態而延遲。若資料異常，前台會保留提示。</p>
        </article>
        <article>
          <span>責任邊界</span>
          <strong>投資決策由使用者自行負責</strong>
          <p>使用者應自行評估風險，必要時諮詢合格專業人士。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關文件</h2>
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
