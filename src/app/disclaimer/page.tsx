import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "風險揭露",
  description:
    "指數燈號是市場資訊整理與風險辨識工具，不是投資建議，也不保證報酬。請搭配自身判斷與其他來源交叉確認。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">Risk Disclosure</p>
        <h1>風險揭露</h1>
        <p>
          指數燈號提供市場狀態、風險提示、資料更新時間與觀察順序，目的是協助使用者整理資訊。
          本網站不是投資建議，不構成個股買賣建議，不提供買進、賣出、持有或保證報酬的指示，
          也不代替使用者做投資決策。
        </p>
        <p className="runtime-boundary-line">
          目前公開 Beta 使用示範資料與示範分數；正式市場資料尚未啟用，正式資料來源、覆蓋率與延遲說明會在通過公開上線審核後再開放。
        </p>
      </section>

      <section className="legal-quick-read" aria-label="風險揭露快速閱讀">
        <article>
          <span>定位</span>
          <strong>資訊整理與風險辨識</strong>
          <p>燈號與分數用來提示市場狀態，不代表任何個別標的的買賣結論。</p>
        </article>
        <article>
          <span>資料</span>
          <strong>需確認來源與時間</strong>
          <p>使用者應留意資料更新時間、可能延遲、示範資料邊界與資料異常提示。</p>
        </article>
        <article>
          <span>行動</span>
          <strong>先觀察，再複核</strong>
          <p>若燈號轉弱或風險升高，建議加強觀察與交叉確認，而不是直接視為交易指令。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>不是投資建議</h2>
        <p>
          本網站所有內容皆為市場資訊整理、風險提醒與觀察輔助。任何燈號、分數、摘要、圖表或文字說明，
          都不應被解讀為個人化投資建議、投資顧問服務、下單建議或收益承諾；本網站不提供買賣建議，也不保證任何投資結果。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料可能延遲或異動</h2>
        <p>
          市場資料可能因來源更新、交易日曆、欄位異動、驗證失敗或系統維護而延遲。若資料狀態不明，
          前台會保守顯示為示範或暫不可用，避免使用者誤判。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>使用者仍需自行判斷</h2>
        <p>
          投資決策涉及個人財務狀況、風險承受度、投資期間與其他資訊來源。使用者應自行評估，
          並視需要諮詢合格專業人士。
        </p>
      </section>

      <RouteLocalTrustCopyPanel context="disclaimer" />
      <PublicRouteReadingContract context="disclaimer" />

      <section className="panel legal-links">
        <h2>繼續查看</h2>
        <LegalTrustLink href="/methodology" label="方法說明" />
        <LegalTrustLink href="/terms" label="使用條款" />
        <LegalTrustLink href="/privacy" label="隱私權" />
        <LegalTrustLink href="/" label="回到首頁" />
      </section>
    </main>
  );
}

function LegalTrustLink({ href, label }: { href: string; label: string }) {
  return (
    <TrackedLink
      className="text-link"
      eventName="trust_link_clicked"
      href={href}
      label={label}
      payload={{ area: "disclaimer_next_links" }}
    >
      {label}
    </TrackedLink>
  );
}
