import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "免責聲明",
  description: "說明指數燈號目前仍是模擬資料閱讀版，不構成投資建議、買賣訊號或正式資料服務。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">Disclaimer</p>
        <h1>免責聲明</h1>
        <p>
          指數燈號目前用於產品驗證與決策輔助設計展示。所有公開頁面仍維持模擬資料閱讀狀態，
          不提供正式市場資料、投資建議、買賣建議或績效承諾。
        </p>
      </section>

      <TrustRuntimeBoundaryNotice context="disclaimer" />
      <RouteLocalTrustCopyPanel context="disclaimer" />

      <section className="legal-quick-read" aria-label="免責聲明重點">
        <article>
          <span>目前狀態</span>
          <strong>模擬資料閱讀版</strong>
          <p>
            系統公開資料與分數仍為模擬狀態；任何真實資料與分數正式化都尚未開放。
          </p>
        </article>
        <article>
          <span>使用限制</span>
          <strong>不構成投資建議</strong>
          <p>
            頁面中的燈號、摘要、風險提示與指標規劃僅供產品設計參考，不應作為買進、賣出、持有或配置資金的依據。
          </p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>不保證正式資料完整性</strong>
          <p>
            任何正式資料來源、資料覆蓋率、來源深度或正式分數都必須另行通過審核才會公開使用。
          </p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>非投資建議</h2>
        <p>
          本網站內容不是證券分析報告、投資顧問服務、招攬交易或個人化資產配置建議。使用者仍應自行評估風險，並在需要時諮詢合格專業人士。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料與分數來源</h2>
        <p>
          目前公開頁面明確標示資料與分數仍為模擬狀態。即使後端已有唯讀可達性證據，也只能作為
          內部決策參考，不能被解讀為正式市場資料服務已上線。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>使用者責任</h2>
        <p>
          金融市場存在價格波動、流動性、資訊延遲與模型失準風險。使用者若依任何頁面資訊採取行動，須自行承擔相關結果。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>相關文件</h2>
        <LegalTrustLink href="/methodology" label="查看方法說明" />
        <LegalTrustLink href="/" label="回到首頁" />
        <LegalTrustLink href="/terms" label="查看使用條款" />
        <LegalTrustLink href="/privacy" label="查看隱私政策" />
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
