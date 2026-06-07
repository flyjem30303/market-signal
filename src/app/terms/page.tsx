import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "使用條款",
  description: "說明指數燈號的使用限制、模擬資料閱讀邊界，以及正式資料與分數功能尚未開放。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">Terms</p>
        <h1>使用條款</h1>
        <p>
          使用本網站代表你理解目前服務仍在建置與驗證階段。公開頁面採用模擬資料閱讀狀態，
          資料與分數不代表正式市場資料、投資建議或可交易訊號。
        </p>
      </section>

      <TrustRuntimeBoundaryNotice context="terms" />
      <RouteLocalTrustCopyPanel context="terms" />

      <section className="legal-quick-read" aria-label="使用條款重點">
        <article>
          <span>服務性質</span>
          <strong>產品驗證與資訊整理</strong>
          <p>本網站目前展示產品方向、決策輔助框架與資料使用邊界，不承諾資料即時性、完整性或可交易性。</p>
        </article>
        <article>
          <span>禁止用途</span>
          <strong>不得視為交易指示</strong>
          <p>你不得將 mock 分數、燈號或摘要當作正式投資建議、保證獲利方法或自動交易依據。</p>
        </article>
        <article>
          <span>功能開放</span>
          <strong>需通過獨立審核</strong>
          <p>正式資料來源、資料覆蓋率與正式分數必須通過後續審核與授權才會開放。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>使用範圍</h2>
        <p>
          你可以瀏覽目前公開頁面、了解指標設計方向與模擬資料狀態。你不應透過本網站進行未經授權的資料擷取、干擾服務、繞過限制或誤用內部狀態。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料限制</h2>
        <p>
          本網站可能顯示 mock 資料、狀態摘要、來源邊界與方法說明。除非頁面明確標示正式來源已核准，否則所有資料都只應視為產品展示。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>條款調整</h2>
        <p>
          隨著系統狀態、資料來源與公開功能逐步成熟，使用條款可能更新。正式資料或投資相關功能開放前，仍會保留明確的審核與風險揭露。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>相關文件</h2>
        <TermsTrustLink href="/disclaimer" label="查看免責聲明" />
        <TermsTrustLink href="/privacy" label="查看隱私政策" />
        <TermsTrustLink href="/methodology" label="查看方法說明" />
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
