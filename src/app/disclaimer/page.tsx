import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "風險揭露與免責聲明",
  description:
    "說明指數燈號公開 Beta 的資料與投資限制、示範資料邊界、資料新鮮度限制，以及本網站不提供個人化投資建議。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">Disclaimer</p>
        <h1>風險揭露與免責聲明</h1>
        <p>
          指數燈號目前是公開 Beta 的決策輔助介面，畫面中的燈號、示範分數、摘要與資料新鮮度說明，
          只用來幫助理解市場狀態。目前仍使用示範資料，不代表完整、即時或保證正確的正式市場資料。
        </p>
      </section>

      <TrustRuntimeBoundaryNotice context="disclaimer" />
      <RouteLocalTrustCopyPanel context="disclaimer" />

      <section className="legal-quick-read" aria-label="免責聲明重點">
        <article>
          <span>資料限制</span>
          <strong>目前仍是 mock-only Beta</strong>
          <p>
            publicDataSource=mock，scoreSource=mock。資料可能延遲、不完整、缺漏或無法更新；任何顯示結果都不能視為正式資料源已切換。
          </p>
        </article>
        <article>
          <span>投資限制</span>
          <strong>not investment advice</strong>
          <p>
            本網站不提供買進、賣出、持有、目標價或個人化配置建議；任何內容都不是買進、賣出或持有建議。
            使用者仍需自行判斷風險，或諮詢合格專業人士。
          </p>
        </article>
        <article>
          <span>模型限制</span>
          <strong>分數不是報酬保證</strong>
          <p>
            分數與燈號是模型化摘要，可能受資料覆蓋率、資料新鮮度、權重設計與市場突發事件影響，不能保證預測結果。
          </p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>資料與來源邊界</h2>
        <p>
          公開 Beta 階段的資料覆蓋仍在擴充。部分股票、ETF、指數或週報欄位可能只有示範資料、聚合狀態或 readiness
          metadata。只有通過 source-rights、coverage、readonly、ingestion 與 promotion gate 後，才會顯示正式資料來源。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>使用者責任</h2>
        <p>
          使用者可以把本網站當成研究起點、風險提醒與資料閱讀輔助，但不應把任何燈號、排名或摘要當成唯一決策依據。
          市場價格可能快速變動，過去資料與模型摘要不代表未來表現。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>服務可用性</h2>
        <p>
          Beta 期間可能發生維護、資料更新延遲、頁面錯誤、模型調整或功能變更。若資料狀態與頁面文字不一致，應以頁面明示的
          mock/real 邊界與最新 gate 狀態為準。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>相關說明</h2>
        <LegalTrustLink href="/methodology" label="查看方法論" />
        <LegalTrustLink href="/terms" label="查看使用條款" />
        <LegalTrustLink href="/privacy" label="查看隱私權說明" />
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
