import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = buildRouteMetadata({
  description: "?????????????????????????",
  path: "/terms",
  title: "????"
});

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">使用條款</p>
        <h1>請把本站作為市場觀察輔助工具</h1>
        <p>指數燈號整理市場狀態、資料時間與風險提示，協助使用者更快建立閱讀順序。</p>
        <p className="runtime-boundary-line">使用本站即表示你理解內容僅供資訊參考，不構成投資建議。</p>
      </section>

      <section className="legal-quick-read" aria-label="使用條款重點">
        <article>
          <span>使用範圍</span>
          <strong>市場觀察與學習</strong>
          <p>本站內容可作為市場觀察、風險辨識與學習用途，不應作為唯一投資決策依據。</p>
        </article>
        <article>
          <span>資料更新</span>
          <strong>可能延遲或降級</strong>
          <p>資料來源、更新時間與品質狀態會盡量標示；若資料異常，頁面可能保守降級。</p>
        </article>
        <article>
          <span>責任邊界</span>
          <strong>不承擔投資結果</strong>
          <p>本站不保證資料完整性、報酬或投資結果；使用者應自行評估風險。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>延伸閱讀</h2>
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
