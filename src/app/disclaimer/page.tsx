import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "風險聲明",
  description: "指數燈號不是投資建議，僅提供市場資訊整理、風險辨識與觀察輔助。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">風險聲明</p>
        <h1>本網站提供資訊整理，不是投資建議</h1>
        <p>
          指數燈號協助使用者理解市場狀態、風險分數與觀察順序，但不提供個股買賣建議、不保證報酬，
          也不代替使用者做投資決策。所有資訊都應搭配自身情況與其他可靠來源交叉確認。
        </p>
        <p className="runtime-boundary-line">
          正式市場資料尚未啟用。Phase 1 使用示範資料與示範分數，可能與真實市場狀況不同。
        </p>
      </section>

      <PublicRouteReadingContract context="disclaimer" />
      <TrustRuntimeBoundaryNotice context="disclaimer" />

      <section className="legal-quick-read" aria-label="風險聲明重點">
        <article>
          <span>資訊定位</span>
          <strong>不是投資建議，也不是交易訊號</strong>
          <p>本網站只整理市場資訊與風險提示，不提供買進、賣出、持有或保證獲利建議。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>請確認來源、更新時間與資料狀態</strong>
          <p>資料可能延遲、缺漏或調整；若資料異常，前台會以降級或提示方式避免誤導。</p>
        </article>
        <article>
          <span>使用責任</span>
          <strong>使用者需自行承擔風險</strong>
          <p>任何投資行動都應由使用者自行判斷，並依自己的財務狀況、風險承受能力與投資目標決定。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關說明</h2>
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
