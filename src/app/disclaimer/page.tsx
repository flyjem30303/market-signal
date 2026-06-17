import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "風險聲明",
  description: "指數燈號提供市場資訊整理與風險辨識，不提供投資建議或保證報酬。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">風險聲明</p>
        <h1>燈號是市場觀察工具，不是買賣建議</h1>
        <p>本站協助使用者理解市場狀態、風險與觀察重點，但不代替任何投資判斷。</p>
        <p className="runtime-boundary-line">公開 Beta 目前使用示範資料；正式資料升級尚未開放。</p>
      </section>

      <PublicRouteReadingContract context="disclaimer" />
      <RouteLocalTrustCopyPanel context="disclaimer" />
      <TrustRuntimeBoundaryNotice context="disclaimer" />

      <section className="legal-quick-read" aria-label="風險聲明重點">
        <article>
          <span>非投資建議</span>
          <strong>不提供個股買賣建議</strong>
          <p>所有燈號與文字只作資訊整理、風險辨識與觀察輔助。</p>
        </article>
        <article>
          <span>資料邊界</span>
          <strong>示範資料需清楚揭露</strong>
          <p>正式資料來源、覆蓋率與品質通過前，不宣稱即時真實資料。</p>
        </article>
        <article>
          <span>使用責任</span>
          <strong>投資決策由使用者自行負責</strong>
          <p>使用者應自行評估風險承受度，並可尋求合格專業意見。</p>
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
