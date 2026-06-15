import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "使用條款",
  description: "使用條款說明本網站提供市場資訊整理，不構成投資建議，資料可能延遲或異常。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">使用條款</p>
        <h1>使用指數燈號前，請理解資料與風險邊界</h1>
        <p>本服務提供市場資訊整理、風險辨識與觀察輔助，不構成投資建議，也不保證資料完整、即時或無誤。</p>
        <p className="runtime-boundary-line">若資料延遲、異常或未更新，前台會盡力提示，但使用者仍應自行複核。</p>
      </section>

      <section className="legal-quick-read" aria-label="使用條款快讀">
        <article>
          <span>用途</span>
          <strong>市場資訊整理</strong>
          <p>燈號只是觀察輔助，不代表買賣點。</p>
        </article>
        <article>
          <span>資料</span>
          <strong>可能延遲或異常</strong>
          <p>請以頁面顯示的資料更新時間與來源說明為準。</p>
        </article>
        <article>
          <span>責任</span>
          <strong>不構成投資建議</strong>
          <p>任何投資決策都應由使用者自行判斷。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
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
