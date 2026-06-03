import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "使用條款",
  description: "說明指數燈號的使用規範、服務限制、責任邊界與 mock-only runtime 狀態。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">Terms</p>
        <h1>使用條款</h1>
        <p>
          使用指數燈號代表你理解本網站仍處於產品建置與驗證階段。公開頁面目前只提供 mock-only runtime 的展示，
          不提供買賣建議、真實資料保證或投資顧問服務。
        </p>
      </section>

      <TrustRuntimeBoundaryNotice context="terms" />

      <section className="legal-quick-read" aria-label="使用條款重點">
        <article>
          <span>可使用範圍</span>
          <strong>產品閱讀與流程驗證</strong>
          <p>你可以使用頁面檢查燈號流程、資訊階層、風險提示與資料邊界是否清楚。</p>
        </article>
        <article>
          <span>不可使用範圍</span>
          <strong>不可作為交易依據</strong>
          <p>你不得把 mock 分數、燈號或摘要視為正式投資建議、買賣推薦、研究報告或收益承諾。</p>
        </article>
        <article>
          <span>變更狀態</span>
          <strong>正式上線需另行通過 gate</strong>
          <p>Supabase-backed public data、真實市場資料與 scoreSource=real 都需要獨立審核與明確啟用。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>服務內容</h2>
        <p>
          指數燈號提供市場與標的頁面的 mock 訊號展示、風險摘要、資料新鮮度揭露與產品流程驗證。服務內容可能持續調整，
          且不保證任何功能永久可用。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>使用責任</h2>
        <p>
          使用者需自行判斷資訊是否適合自身目的。若將本網站內容用於投資、交易、研究、報告或其他決策，
          應自行承擔相關風險並取得必要的專業意見。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>限制與中止</h2>
        <p>
          若發現系統錯誤、資料異常、濫用、未授權存取或可能造成誤導的使用情境，網站可暫停、限制或調整相關功能。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TermsTrustLink href="/disclaimer" label="查看免責聲明" />
        <TermsTrustLink href="/privacy" label="查看隱私權政策" />
        <TermsTrustLink href="/methodology" label="查看方法說明" />
        <TermsTrustLink href="/" label="回到市場首頁" />
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
