import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
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
        <h1>本網站提供市場觀察輔助，不提供買賣建議</h1>
        <p>
          指數燈號協助使用者整理市場狀態、原因與風險提醒。任何燈號、分數或文字說明，都不構成個股買賣建議，也不代表保證報酬。
        </p>
        <p className="runtime-boundary-line">
          目前公開頁使用示範資料與模擬分數；正式每日資料尚未啟用，請勿把頁面資訊視為即時交易訊號。
        </p>
      </section>

      <PublicRouteReadingContract context="disclaimer" />
      <TrustRuntimeBoundaryNotice context="disclaimer" />

      <section className="panel stock-reading-summary" aria-label="非投資建議提醒">
        <p className="eyebrow">非投資建議提醒</p>
        <h2>本網站不提供交易指令</h2>
        <p>所有燈號與摘要只協助使用者理解市場狀態，不是個別買賣建議，也不是任何形式的交易指令。</p>
      </section>

      <section className="legal-quick-read" aria-label="風險聲明摘要">
        <article>
          <span>定位</span>
          <strong>資訊整理工具</strong>
          <p>網站目標是降低市場資訊理解門檻，不代替使用者做投資決策。</p>
        </article>
        <article>
          <span>資料邊界</span>
          <strong>示範資料</strong>
          <p>正式資料上線前，前台會保留 mock 邊界與更新時間提醒。</p>
        </article>
        <article>
          <span>使用方式</span>
          <strong>交叉確認</strong>
          <p>請搭配資料來源、更新時間、方法說明與自身風險承受度閱讀。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/terms" label="查看服務條款" payload={{ area: "disclaimer" }}>
          查看服務條款
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/methodology" label="查看方法說明" payload={{ area: "disclaimer" }}>
          查看方法說明
        </TrackedLink>
      </section>
    </main>
  );
}
