import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "風險聲明",
  description: "指數燈號僅供資訊整理與風險辨識，不提供投資建議、保證報酬或買賣推薦。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">風險聲明</p>
        <h1>本網站不是投資建議，也不保證任何投資結果</h1>
        <p>指數燈號整理市場狀態、風險提示與資料更新時間，協助使用者建立觀察流程，但不替使用者做決策。</p>
        <p className="runtime-boundary-line">目前公開版使用示範資料；請勿把示範分數視為真實行情或個別買賣依據。</p>
      </section>

      <PublicRouteReadingContract context="disclaimer" />
      <TrustRuntimeBoundaryNotice context="disclaimer" />

      <section className="legal-quick-read" aria-label="風險聲明摘要">
        <article>
          <span>資訊用途</span>
          <strong>僅供市場觀察與風險辨識</strong>
          <p>燈號與分數不能取代專業建議，也不能保證未來績效。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>請確認資料狀態與更新時間</strong>
          <p>資料可能延遲、缺漏或仍為示範資料；使用者需自行判斷可靠性。</p>
        </article>
        <article>
          <span>使用責任</span>
          <strong>投資決策由使用者自行承擔</strong>
          <p>任何投資都有風險，網站內容不構成買進、賣出或持有建議。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>延伸閱讀</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/terms" label="查看使用條款" payload={{ area: "disclaimer" }}>
          查看使用條款
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/methodology" label="查看方法說明" payload={{ area: "disclaimer" }}>
          查看方法說明
        </TrackedLink>
      </section>
    </main>
  );
}
