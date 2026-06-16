import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "使用條款",
  description: "說明指數燈號公開版的使用範圍、資料限制與非投資建議邊界。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">使用條款</p>
        <h1>使用指數燈號前，請先理解資料限制與風險邊界</h1>
        <p>
          指數燈號提供市場資訊整理、風險辨識與觀察輔助。使用者可以把它作為建立觀察流程的參考，
          但不得把任何燈號、分數或提示視為個別投資建議。
        </p>
        <p className="runtime-boundary-line">
          Phase 1 使用示範資料；正式市場資料、會員功能與個人化警示尚未啟用。
        </p>
      </section>

      <PublicRouteReadingContract context="terms" />
      <TrustRuntimeBoundaryNotice context="terms" />

      <section className="legal-quick-read" aria-label="使用條款重點">
        <article>
          <span>使用範圍</span>
          <strong>市場資訊整理與風險辨識</strong>
          <p>本網站協助使用者快速理解市場狀態，並建立觀察順序，不提供交易執行或投資顧問服務。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>資料可能延遲、缺漏或調整</strong>
          <p>使用前請確認資料狀態、更新時間與來源揭露；正式資料未啟用前，前台僅作示範用途。</p>
        </article>
        <article>
          <span>風險責任</span>
          <strong>使用者需自行承擔風險</strong>
          <p>任何投資決策都應由使用者自行判斷，並自行確認資料是否符合自己的使用目的。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/privacy" label="查看隱私權說明" payload={{ area: "terms" }}>
          查看隱私權說明
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "terms" }}>
          查看風險聲明
        </TrackedLink>
      </section>
    </main>
  );
}
