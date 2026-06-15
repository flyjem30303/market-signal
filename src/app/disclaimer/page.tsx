import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "免責聲明",
  description: "說明指數燈號的資訊用途、限制、非投資建議定位與資料風險。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">免責聲明</p>
        <h1>指數燈號不是投資建議，也不保證任何報酬</h1>
        <p>
          本網站提供市場資訊整理、風險辨識與觀察輔助。所有燈號、分數與文字說明都不構成買進、賣出、持有或資產配置建議。
        </p>
        <p className="runtime-boundary-line">
          使用者應自行判斷資料是否適用於自身情況，並理解資料可能延遲、錯誤或仍處於示範資料模式。
        </p>
      </section>

      <PublicRouteReadingContract context="disclaimer" />
      <TrustRuntimeBoundaryNotice context="disclaimer" />

      <section className="legal-quick-read" aria-label="免責聲明重點">
        <article>
          <span>非投資建議</span>
          <strong>燈號不等於交易指令</strong>
          <p>任何分數或狀態都只協助整理市場資訊，不代表適合任何特定使用者採取交易行動。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>請確認更新時間與資料狀態</strong>
          <p>資料可能延遲、缺漏或暫時使用示範資料；正式資料上線前不宣稱完整或即時覆蓋。</p>
        </article>
        <article>
          <span>風險自負</span>
          <strong>投資決策需自行承擔</strong>
          <p>市場有波動與損失風險。使用者應搭配其他資料來源、專業意見與自身風險承受度判斷。</p>
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
