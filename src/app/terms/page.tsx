import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "使用條款",
  description: "說明指數燈號展示型服務的使用方式、責任邊界與目前 mock-only runtime 狀態。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">Terms</p>
        <h1>使用條款</h1>
        <p>
          使用本網站代表你理解目前內容仍以產品展示、研究與流程驗證為主。正式資料、正式分數與商業功能上線前，服務條款會依實際範圍再更新。
        </p>
      </section>

      <TrustRuntimeBoundaryNotice context="terms" />

      <section className="legal-quick-read" aria-label="使用條款快速閱讀">
        <article>
          <span>可以使用</span>
          <strong>瀏覽與測試公開頁</strong>
          <p>你可以瀏覽首頁、晨報、週報、個股頁與方法論頁，理解產品想解決的投資閱讀問題。</p>
        </article>
        <article>
          <span>不可使用</span>
          <strong>不得當作正式投資服務</strong>
          <p>目前內容不得作為交易依據，也不得轉述為真實市場訊號、正式研究報告或保證績效的工具。</p>
        </article>
        <article>
          <span>服務狀態</span>
          <strong>可能隨開發調整</strong>
          <p>網站仍在快速開發，頁面、文案、指標與資料狀態可能隨切片調整。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>服務內容</h2>
        <p>
          指數燈號目前提供市場健康度、風險升溫、趨勢節奏與資料品質等概念展示。這些內容用來協助使用者理解未來產品方向，不代表正式服務承諾。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>使用限制</h2>
        <p>
          你不得以本網站目前 mock 內容作為真實投資建議、銷售素材、績效宣稱或第三方資料授權依據。若引用畫面，應清楚標示其仍是展示版本。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>變更與中斷</h2>
        <p>
          因開發、測試、部署或資料流程調整，本網站可能暫停、變更或移除部分功能。正式上線前，服務可用性與資料完整性不作保證。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>延伸閱讀</h2>
        <TermsTrustLink href="/disclaimer" label="查看免責聲明" />
        <TermsTrustLink href="/privacy" label="查看隱私權政策" />
        <TermsTrustLink href="/methodology" label="了解評分方法論" />
        <TermsTrustLink href="/" label="回首頁看市場概況" />
      </section>
    </main>
  );
}

function TermsTrustLink({ href, label }: { href: string; label: string }) {
  return (
    <TrackedLink className="text-link" eventName="trust_link_clicked" href={href} label={label} payload={{ area: "terms_next_links" }}>
      {label}
    </TrackedLink>
  );
}
