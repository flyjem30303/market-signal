import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "使用條款",
  description:
    "指數燈號公開 Beta 使用條款，說明示範資料、示範分數、非投資建議、資料限制與使用者責任。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">Terms</p>
        <h1>使用條款</h1>
        <p>
          歡迎使用指數燈號公開 Beta。現階段網站以示範資料與示範分數呈現產品體驗，
          內容用於研究、整理與決策輔助展示，不構成投資建議、交易指示或收益保證。
        </p>
      </section>

      <TrustRuntimeBoundaryNotice context="terms" />
      <RouteLocalTrustCopyPanel context="terms" />

      <section className="legal-quick-read" aria-label="使用條款重點">
        <article>
          <span>服務定位</span>
          <strong>公開 Beta，不是交易服務</strong>
          <p>
            本網站協助使用者理解市場狀態與資料限制，但不代替個人判斷、專業顧問、
            券商平台或正式交易系統。
          </p>
        </article>
        <article>
          <span>資料狀態</span>
          <strong>正式市場資料尚未啟用</strong>
          <p>
            目前公開頁面仍使用示範資料與示範分數。正式資料來源、覆蓋率與更新流程
            通過後，才會在頁面上清楚標示並切換。
          </p>
        </article>
        <article>
          <span>使用責任</span>
          <strong>請自行評估風險</strong>
          <p>
            投資有風險，任何市場資訊都可能延遲、不完整或解讀錯誤。使用者應自行查證，
            並依自身財務狀況與風險承受度做決定。
          </p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>資料與分數限制</h2>
        <p>
          Beta 期間的資料、燈號、分數與摘要可能使用示範資料、測試流程或尚未完整覆蓋的市場樣本。
          這些內容只用來呈現產品方向與資訊架構，不應被視為即時、完整或已驗證的正式市場資料。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>非投資建議</h2>
        <p>
          指數燈號不提供個別化投資建議，也不承諾任何報酬、勝率或避險效果。網站上的分類、
          趨勢描述、風險提醒與決策輔助資訊，僅供使用者作為研究起點。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>Beta 期間可能變動</h2>
        <p>
          我們會持續調整資料來源、指標邏輯、頁面呈現與風險揭露。功能、內容與可用性可能隨測試結果改變，
          也可能暫停、延後或移除。正式上線前，所有公開狀態都會以頁面揭露為準。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>相關說明</h2>
        <TermsTrustLink href="/disclaimer" label="免責聲明" />
        <TermsTrustLink href="/privacy" label="隱私權說明" />
        <TermsTrustLink href="/methodology" label="方法說明" />
        <TermsTrustLink href="/" label="回到首頁" />
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
