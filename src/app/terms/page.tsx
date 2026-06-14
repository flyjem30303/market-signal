import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "使用條款",
  description: "說明指數燈號網站的資訊用途、使用邊界、資料限制與使用者責任。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">Terms</p>
        <h1>使用條款</h1>
        <p>
          使用本網站代表你理解本站定位為市場資訊整理、風險辨識與觀察輔助工具；所有內容僅供資訊參考。本站不提供交易執行、不串接券商下單，也不提供個人資產配置建議。
        </p>
        <p className="runtime-boundary-line">
          若資料延遲、缺漏或尚未正式啟用，前台會顯示資料狀態；使用者不應把燈號視為保證準確或保證報酬的承諾。
        </p>
      </section>

      <section className="legal-quick-read" aria-label="使用條款快速閱讀">
        <article>
          <span>可以怎麼用</span>
          <strong>市場觀察與風險辨識</strong>
          <p>你可以用本站快速理解市場狀態、追蹤指標變化與建立觀察流程。</p>
        </article>
        <article>
          <span>不能怎麼用</span>
          <strong>不能當作交易指令</strong>
          <p>本站內容不是買賣建議，也不應作為任何自動交易或保證獲利依據。</p>
        </article>
        <article>
          <span>資料責任</span>
          <strong>需自行複核</strong>
          <p>重要決策前請自行確認資料來源、更新時間、風險與個人情況，並自行判斷市場風險。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>服務範圍</h2>
        <p>本站提供市場燈號、指標摘要、資料更新時間、風險提醒與相關說明。未來會員功能會以深度解讀、watchlist、自訂警示與盤後複盤為主，但仍不提供買賣建議。</p>
      </section>

      <section className="panel legal-section">
        <h2>資料與可用性</h2>
        <p>本站會盡力維持資料清楚與頁面穩定，但資料可能因來源、網路、系統維護或授權狀態而延遲、缺漏或暫停顯示。</p>
      </section>

      <RouteLocalTrustCopyPanel context="terms" />
      <PublicRouteReadingContract context="terms" />

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TermsTrustLink href="/disclaimer" label="風險聲明" />
        <TermsTrustLink href="/privacy" label="隱私政策" />
        <TermsTrustLink href="/methodology" label="方法說明" />
        <TermsTrustLink href="/" label="市場總覽" />
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
