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
          指數燈號目前是投資決策輔助產品的展示與驗證版本。頁面上的分數、燈號、摘要與解讀都還在 mock-only runtime，不構成投資建議、買賣推薦或收益保證。
        </p>
      </section>

      <TrustRuntimeBoundaryNotice context="disclaimer" />

      <section className="legal-quick-read" aria-label="免責聲明快速閱讀">
        <article>
          <span>目前狀態</span>
          <strong>mock-only runtime</strong>
          <p>公開頁只展示產品流程、資訊階層與決策輔助邏輯，尚未啟用真實行情、真實分數或 Supabase 作為公開資料來源。</p>
        </article>
        <article>
          <span>使用責任</span>
          <strong>請自行判斷風險</strong>
          <p>任何投資決策都應由使用者自行評估，並搭配合格投資顧問、券商資訊與個人風險承受度。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>不可視為即時資料</strong>
          <p>目前畫面不保證即時、完整或正確反映市場，未來接入真實資料前會另行完成資料來源與品質審核。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>不是投資建議</h2>
        <p>
          本網站提供的內容僅供產品研究、資訊整理與決策輔助展示使用。任何燈號、分數、標籤、風險提示或摘要，都不應被解讀為買進、賣出、持有或避險建議。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料與模型仍在驗證</h2>
        <p>
          目前 `publicDataSource=mock`、`scoreSource=mock`。在正式切換真實資料前，仍需要完成來源授權、欄位品質、覆蓋率、模型可信度與 post-run review。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>可能發生的限制</h2>
        <p>
          畫面可能因開發、測試、資料更新或部署調整而變更。即使未來接入真實資料，也可能受到延遲、來源中斷、欄位缺漏或解析錯誤影響。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>延伸閱讀</h2>
        <LegalTrustLink href="/methodology" label="了解評分方法論" />
        <LegalTrustLink href="/" label="回首頁看市場概況" />
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
