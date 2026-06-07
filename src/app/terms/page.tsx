import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "使用條款",
  description:
    "Terms of use for 指數燈號公開 Beta，說明 mock-only 資料邊界、data freshness metadata、非投資建議與使用者責任。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">Terms</p>
        <h1>使用條款</h1>
        <p>
          Terms of use: 使用本網站代表你理解目前服務仍是 mock-only Beta。燈號、分數、週報與 data freshness metadata
          是研究輔助，不是正式投資建議、交易指令或保證報酬的承諾。
        </p>
      </section>

      <TrustRuntimeBoundaryNotice context="terms" />
      <RouteLocalTrustCopyPanel context="terms" />

      <section className="legal-quick-read" aria-label="使用條款重點">
        <article>
          <span>服務定位</span>
          <strong>研究輔助工具</strong>
          <p>
            本網站協助整理市場資料、風險訊號與模型摘要。它不能取代投資顧問、交易系統、券商平台或使用者自己的判斷。
          </p>
        </article>
        <article>
          <span>資料狀態</span>
          <strong>mock-only until promotion gate</strong>
          <p>
            publicDataSource=mock，scoreSource=mock。正式資料、完整覆蓋與 real score 必須另行通過 promotion gate。
          </p>
        </article>
        <article>
          <span>禁止用途</span>
          <strong>不得視為買賣指示</strong>
          <p>
            你不應把任何頁面內容解讀為買進、賣出、持有、融資、放空、槓桿或其他特定交易建議。
          </p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>資料與功能可能變動</h2>
        <p>
          Beta 期間，資料欄位、模型權重、分類、頁面呈現、追蹤事件與功能入口可能調整。若某項資料暫停、延遲或移除，
          本網站不保證提供替代資料或事後補償。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>使用者判斷與風險</h2>
        <p>
          投資有風險，市場價格可能大幅波動。你應自行確認資料來源、交易成本、稅務、流動性、個人風險承受度與法規限制。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>服務限制</h2>
        <p>
          本網站可能因維護、系統錯誤、第三方服務限制或資料來源變更而中斷。若有重大變更，PM 會優先保持 mock/real
          狀態與風險揭露可讀。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>相關說明</h2>
        <TermsTrustLink href="/disclaimer" label="查看風險揭露" />
        <TermsTrustLink href="/privacy" label="查看隱私權說明" />
        <TermsTrustLink href="/methodology" label="查看方法論" />
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
