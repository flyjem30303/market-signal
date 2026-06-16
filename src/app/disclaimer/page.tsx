import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "免責聲明與風險聲明",
  description: "指數燈號不是投資建議；本頁說明資料、風險與使用限制。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">免責聲明與風險聲明</p>
        <h1>本網站提供市場資訊整理，不提供投資建議</h1>
        <p>
          指數燈號協助使用者理解市場狀態、風險來源與觀察順序，但不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。
        </p>
        <p className="runtime-boundary-line">
          目前公開 Beta 使用示範資料；正式資料尚未啟用。
        </p>
      </section>

      <PublicRouteReadingContract context="disclaimer" />
      <TrustRuntimeBoundaryNotice context="disclaimer" />

      <section className="legal-quick-read" aria-label="風險聲明重點">
        <article>
          <span>資訊定位</span>
          <strong>不是投資建議，也不是交易指令</strong>
          <p>所有燈號、分數與文字都是市場資訊整理，使用者仍需自行判斷。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>請確認資料時間與來源狀態</strong>
          <p>資料可能延遲、缺漏或處於示範模式；請勿把單一分數當成完整判斷。</p>
        </article>
        <article>
          <span>使用責任</span>
          <strong>投資風險由使用者自行承擔</strong>
          <p>市場波動可能造成損失，使用者應依自身狀況做風險控管。</p>
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
