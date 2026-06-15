import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "免責聲明",
  description: "說明指數燈號的非投資建議定位、資料限制、示範資料邊界與使用者風險責任。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">免責聲明</p>
        <h1>指數燈號不是投資建議，也不是交易訊號</h1>
        <p>
          本網站內容用於市場資訊整理、風險辨識與觀察流程輔助。任何燈號、分數、摘要或提示都不代表買進、賣出或持有建議。
        </p>
        <p className="runtime-boundary-line">
          Phase 1 公開版仍使用示範資料；正式資料、完整覆蓋率與品質驗證完成前，不宣稱即時真實行情或正式投資分析。
        </p>
      </section>

      <PublicRouteReadingContract context="disclaimer" />
      <TrustRuntimeBoundaryNotice context="disclaimer" />

      <section className="legal-quick-read" aria-label="免責聲明摘要">
        <article>
          <span>非投資建議</span>
          <strong>燈號只協助閱讀市場狀態</strong>
          <p>分數與燈號是資訊整理結果，不是個人化建議，也不保證未來報酬、方向或風險結果。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>請確認資料來源、更新時間與狀態</strong>
          <p>資料可能延遲、缺漏或處於示範階段。使用者應搭配其他可信資料來源進行複核。</p>
        </article>
        <article>
          <span>風險責任</span>
          <strong>投資決策由使用者自行承擔</strong>
          <p>市場波動可能造成損失。使用者應依自己的財務狀況、風險承受度與專業意見做決策。</p>
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
