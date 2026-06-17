import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "使用條款",
  description: "使用指數燈號前，請理解資料、燈號與非投資建議邊界。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">使用條款</p>
        <h1>請把本站視為市場資訊輔助工具</h1>
        <p>指數燈號用來整理市場資訊、提示風險與建立觀察流程，不提供交易指令或保證結果。</p>
        <p className="runtime-boundary-line">正式資料升級尚未開放；公開頁仍維持示範資料與 mock score。</p>
      </section>

      <PublicRouteReadingContract context="terms" />
      <RouteLocalTrustCopyPanel context="terms" />
      <TrustRuntimeBoundaryNotice context="terms" />

      <section className="legal-quick-read" aria-label="使用條款重點">
        <article>
          <span>使用定位</span>
          <strong>資訊整理與風險辨識</strong>
          <p>不得把燈號、分數或文字視為買賣建議。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>更新時間與來源需以頁面揭露為準</strong>
          <p>資料可能延遲、異常或降級，使用前需確認頁面狀態。</p>
        </article>
        <article>
          <span>責任邊界</span>
          <strong>使用者自行承擔投資決策</strong>
          <p>本站不保證報酬，也不代替專業投資顧問。</p>
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
