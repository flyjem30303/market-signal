import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "使用條款",
  description: "說明指數燈號網站的資訊使用方式、責任邊界與風險限制。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">使用條款</p>
        <h1>本網站提供市場資訊整理，不代替使用者做投資決策</h1>
        <p>
          指數燈號網站以市場狀態、風險提示與資料更新狀態協助使用者閱讀資訊。使用者應自行判斷資訊是否適用於自身情況。
        </p>
        <p className="runtime-boundary-line">
          本網站不提供買進、賣出、持有、目標價、保證報酬或個人化資產配置建議。
        </p>
      </section>

      <PublicRouteReadingContract context="terms" />
      <TrustRuntimeBoundaryNotice context="terms" />

      <section className="legal-quick-read" aria-label="使用條款重點">
        <article>
          <span>網站定位</span>
          <strong>資訊整理與風險辨識</strong>
          <p>燈號與分數協助理解市場狀態，不是交易指令。</p>
        </article>
        <article>
          <span>資料狀態</span>
          <strong>需注意更新時間與示範模式</strong>
          <p>正式資料上線前，請勿把頁面內容視為即時或完整市場資料。</p>
        </article>
        <article>
          <span>使用責任</span>
          <strong>使用者仍需自行判斷</strong>
          <p>任何投資行動都應由使用者自行評估風險，必要時諮詢合格專業人士。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/privacy" label="查看隱私政策" payload={{ area: "terms" }}>
          查看隱私政策
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "terms" }}>
          查看風險聲明
        </TrackedLink>
      </section>
    </main>
  );
}
