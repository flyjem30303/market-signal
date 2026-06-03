import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "免責聲明",
  description: "說明指數燈號目前的 mock-only runtime、資料限制、投資責任與使用邊界。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">Disclaimer</p>
        <h1>免責聲明</h1>
        <p>
          指數燈號目前是投資決策輔助產品的展示與驗證版本。頁面上的分數、燈號、摘要與解讀都還在
          mock-only runtime，不構成投資建議、買賣推薦或收益保證。
        </p>
      </section>

      <TrustRuntimeBoundaryNotice context="disclaimer" />

      <section className="legal-quick-read" aria-label="免責聲明重點">
        <article>
          <span>目前狀態</span>
          <strong>mock-only runtime</strong>
          <p>
            目前公開頁面只展示 mock 訊號與產品流程。publicDataSource=mock，scoreSource=mock，尚未啟用真實市場資料或真實評分。
          </p>
        </article>
        <article>
          <span>使用限制</span>
          <strong>不提供買賣建議</strong>
          <p>
            本網站不提供個別證券、ETF、期貨或其他金融商品的買賣建議，也不承諾任何報酬、避險效果或交易結果。
          </p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>不可視為完整資料源</strong>
          <p>
            所有摘要都可能受到資料缺口、過期狀態、模型假設與尚未完成的審核影響。正式使用前仍需通過獨立 gate。
          </p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>不是投資建議</h2>
        <p>
          指數燈號提供的是產品驗證用的閱讀流程與風險提示，不是投資顧問服務。任何投資決策都應由使用者自行評估，
          並在需要時諮詢合格專業人士。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料與模型邊界</h2>
        <p>
          目前 `publicDataSource=mock`、`scoreSource=mock`。即使頁面顯示分數、燈號、趨勢或風險文字，也只代表 mock
          runtime 的展示結果，不代表真實市場資料、正式模型或 Supabase-backed public data 已上線。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>使用者責任</h2>
        <p>
          使用者應理解本網站仍在建置與驗證階段。若將頁面內容用於任何投資、交易、風險控管或資產配置判斷，
          相關風險與結果均由使用者自行承擔。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <LegalTrustLink href="/methodology" label="查看方法說明" />
        <LegalTrustLink href="/" label="回到市場首頁" />
        <LegalTrustLink href="/terms" label="查看使用條款" />
        <LegalTrustLink href="/privacy" label="查看隱私權政策" />
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
