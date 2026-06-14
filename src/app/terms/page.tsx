import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "使用條款",
  description: "說明指數燈號的資訊服務定位、資料邊界、使用責任與非交易服務限制。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">Terms</p>
        <h1>使用條款</h1>
        <p>
          指數燈號提供市場資訊整理、風險辨識與觀察輔助。使用者需自行承擔風險，並自行確認資料是否符合自己的使用目的。
          本網站不提供下單、不串接券商交易，也不提供個人資產配置建議；會員功能啟用前會另行說明服務與資料邊界。
        </p>
        <p className="runtime-boundary-line">
          正式市場資料尚未啟用前，公開頁以示範資料呈現產品流程。燈號、分數與警示不應被視為即時行情，
          不能當作交易指令，也不代表保證結果。
        </p>
      </section>

      <section className="legal-quick-read" aria-label="使用條款快速閱讀">
        <article>
          <span>服務定位</span>
          <strong>資訊整理與風險辨識</strong>
          <p>本網站協助你更快理解市場狀態，但不代替你的投資判斷。</p>
        </article>
        <article>
          <span>使用責任</span>
          <strong>自行承擔風險</strong>
          <p>任何投資行為都應由使用者自行評估，並搭配其他資料來源複核。</p>
        </article>
        <article>
          <span>資料邊界</span>
          <strong>正式資料切換前不宣稱真實即時</strong>
          <p>資料來源、更新時間、延遲與錯誤回退狀態會在正式資料上線時揭露。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>非投資建議</h2>
        <p>
          網站內容不構成買進、賣出、持有或其他投資建議。燈號與分數只協助整理市場觀察順序，
          不代表對未來價格、報酬或風險的保證。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料與服務限制</h2>
        <p>
          本網站可能因資料來源延遲、維護、格式變更或系統錯誤而顯示異常狀態。使用者應先查看更新時間與來源狀態，
          再決定是否採用頁面資訊。
        </p>
      </section>

      <RouteLocalTrustCopyPanel context="terms" />
      <PublicRouteReadingContract context="terms" />

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TermsTrustLink href="/disclaimer" label="風險聲明" />
        <TermsTrustLink href="/privacy" label="隱私政策" />
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
