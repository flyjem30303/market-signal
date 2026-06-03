import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "隱私權政策",
  description: "說明指數燈號目前的資料收集範圍、分析工具邊界與未來功能更新原則。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">Privacy</p>
        <h1>隱私權政策</h1>
        <p>
          指數燈號目前不要求登入，也不收集交易帳戶、持股明細或個人財務資料。若未來加入會員、通知或表單功能，會先更新本頁說明。
        </p>
      </section>

      <TrustRuntimeBoundaryNotice context="privacy" />

      <section className="legal-quick-read" aria-label="隱私權政策快速閱讀">
        <article>
          <span>目前不收集</span>
          <strong>投資帳戶與部位資料</strong>
          <p>網站目前沒有要求你輸入券商帳號、下單紀錄、持股、資產或風險屬性。</p>
        </article>
        <article>
          <span>可能使用</span>
          <strong>基本瀏覽分析</strong>
          <p>為了改善產品體驗，未來可能使用去識別化瀏覽事件，例如頁面瀏覽、連結點擊與功能使用情境。</p>
        </article>
        <article>
          <span>未來變更</span>
          <strong>先告知再擴大</strong>
          <p>若加入聯絡表單、Email 通知或會員功能，會明確說明收集目的、保存方式與使用者選擇。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>目前資料範圍</h2>
        <p>
          目前公開頁主要使用 mock 市場資料與本機產品狀態。使用者瀏覽網站時，不需要提供姓名、電話、身分證字號、券商帳號或交易資訊。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>分析與追蹤</h2>
        <p>
          產品內有事件追蹤設計，用來理解使用者如何閱讀首頁、晨報、週報與個股頁。這些事件應以產品改善為目的，不應用於投資行為側寫。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料安全與第三方服務</h2>
        <p>
          若未來導入第三方分析、雲端資料庫、通知服務或付款工具，會依功能需求揭露服務商、資料用途與必要的保護措施。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>延伸閱讀</h2>
        <PrivacyTrustLink href="/terms" label="查看使用條款" />
        <PrivacyTrustLink href="/disclaimer" label="查看免責聲明" />
        <PrivacyTrustLink href="/methodology" label="了解評分方法論" />
        <PrivacyTrustLink href="/" label="回首頁看市場概況" />
      </section>
    </main>
  );
}

function PrivacyTrustLink({ href, label }: { href: string; label: string }) {
  return (
    <TrackedLink className="text-link" eventName="trust_link_clicked" href={href} label={label} payload={{ area: "privacy_next_links" }}>
      {label}
    </TrackedLink>
  );
}
