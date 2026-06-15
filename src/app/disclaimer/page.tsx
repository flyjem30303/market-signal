import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "風險聲明",
  description: "說明指數燈號網站不是投資建議，資料可能延遲或不完整。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">風險聲明</p>
        <h1>本網站提供市場觀察，不提供投資建議</h1>
        <p>
          指數燈號協助使用者理解市場氛圍、風險狀態與觀察重點，但不代表任何買進、賣出、持有或保證報酬建議。
        </p>
        <p className="runtime-boundary-line">
          使用者應自行評估資料來源、更新時間、個人風險承受度與投資目的。
        </p>
      </section>

      <PublicRouteReadingContract context="disclaimer" />
      <TrustRuntimeBoundaryNotice context="disclaimer" />

      <section className="legal-quick-read" aria-label="風險聲明摘要">
        <article>
          <span>不是建議</span>
          <strong>不提供買賣指令</strong>
          <p>燈號和分數只是市場閱讀輔助，不是個別投資建議。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>可能延遲或不完整</strong>
          <p>真實資料上線前，頁面會保留示範資料與更新時間提示。</p>
        </article>
        <article>
          <span>使用方式</span>
          <strong>搭配自身判斷</strong>
          <p>任何投資決策都應由使用者自行判斷並承擔風險。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
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
