import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "免責聲明",
  description: "指數燈號不是投資建議，僅提供市場資訊整理、風險辨識與觀察輔助。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">免責聲明</p>
        <h1>本網站不提供投資建議或保證報酬</h1>
        <p>
          指數燈號以市場資訊整理、風險辨識與觀察輔助為目的。任何燈號、分數、摘要或警示，
          都不構成個股買賣建議，也不是交易指令，不代表買進、賣出、持有或保證獲利的建議；本網站不保證任何投資結果。
        </p>
        <p className="runtime-boundary-line">
          Phase 1 使用示範資料。正式資料與真實燈號上線前，仍需完成合法來源、資料品質、寫入與回讀檢查。
        </p>
      </section>

      <PublicRouteReadingContract context="disclaimer" />
      <TrustRuntimeBoundaryNotice context="disclaimer" />

      <section className="legal-quick-read" aria-label="免責聲明重點">
        <article>
          <span>資訊用途</span>
          <strong>協助理解市場，不代替決策</strong>
          <p>網站內容用於整理市場狀態與風險背景，不應作為唯一交易依據。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>請確認更新時間與資料狀態</strong>
          <p>市場資料可能延遲、缺漏或仍在驗證。使用前請留意頁面上的資料狀態提示。</p>
        </article>
        <article>
          <span>風險承擔</span>
          <strong>所有投資風險由使用者自行承擔</strong>
          <p>金融商品價格會波動，過去表現不代表未來結果。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關文件</h2>
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
