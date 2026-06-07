import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "免責聲明",
  description:
    "指數燈號公開 Beta 免責聲明，說明示範資料、示範分數、正式市場資料尚未啟用、非投資建議與使用風險。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">Disclaimer</p>
        <h1>免責聲明</h1>
        <p>
          指數燈號公開 Beta 目前用示範資料與示範分數呈現產品方向。所有內容都應被視為研究與資訊整理輔助，
          不構成投資建議、交易指示、個別化顧問服務或任何報酬保證。
        </p>
      </section>

      <TrustRuntimeBoundaryNotice context="disclaimer" />
      <RouteLocalTrustCopyPanel context="disclaimer" />

      <section className="legal-quick-read" aria-label="免責聲明重點">
        <article>
          <span>資料狀態</span>
          <strong>示範資料，正式市場資料尚未啟用</strong>
          <p>
            目前頁面展示的是 Beta 體驗與資訊架構。正式資料來源、覆蓋率、更新流程與來源權利通過後，
            才會清楚標示並切換成正式資料狀態。
          </p>
        </article>
        <article>
          <span>分數狀態</span>
          <strong>示範分數，不是買賣訊號</strong>
          <p>
            燈號與分數只協助使用者整理觀察方向，不代表未來價格、勝率、適合度，也不代表買進、賣出或持有建議。
          </p>
        </article>
        <article>
          <span>使用責任</span>
          <strong>請自行查證並評估風險</strong>
          <p>
            市場資訊可能延遲、不完整或解讀錯誤。使用者應自行查證資料，並依自己的財務狀況、投資目標與風險承受度做決定。
          </p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>資料限制</h2>
        <p>
          Beta 期間的資料可能來自示範樣本、測試流程或尚未完整覆蓋的資料集。資料新鮮度、標的覆蓋率、
          欄位完整性與來源權利仍在逐步確認中，因此不應把目前內容視為即時或完整的正式市場資料。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>非投資建議</h2>
        <p>
          本網站不提供投資顧問服務，也不會針對個別使用者的資產、目標、期間或風險承受度做建議。
          任何摘要、分類、燈號、分數或提醒，都只適合作為研究起點。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>Beta 期間變更</h2>
        <p>
          在正式上線前，資料來源、指標權重、分數說明、頁面呈現與風險揭露都可能調整。
          如果資料狀態、覆蓋率或正式來源條件改變，頁面會以新的公開說明為準。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>相關說明</h2>
        <LegalTrustLink href="/methodology" label="方法說明" />
        <LegalTrustLink href="/terms" label="使用條款" />
        <LegalTrustLink href="/privacy" label="隱私權說明" />
        <LegalTrustLink href="/" label="回到首頁" />
      </section>
    </main>
  );
}

function LegalTrustLink({ href, label }: { href: string; label: string }) {
  return (
    <TrackedLink className="text-link" eventName="trust_link_clicked" href={href} label={label} payload={{ area: "disclaimer_next_links" }}>
      {label}
    </TrackedLink>
  );
}
