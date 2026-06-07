import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";

export const metadata: Metadata = {
  title: "隱私權與資料邊界",
  description:
    "Privacy and data boundary for 指數燈號公開 Beta，說明本網站如何處理瀏覽狀態、localStorage、事件追蹤與 raw market payloads 邊界。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">Privacy</p>
        <h1>隱私權與資料邊界</h1>
        <p>
          Privacy and data boundary: 指數燈號公開 Beta 會盡量把使用者資料收集降到最低。頁面可能記錄基本瀏覽事件與本機偏好，
          但不應輸出 secrets、row payloads、stock id payloads 或 raw market payloads。目前 publicDataSource=mock，scoreSource=mock。
        </p>
      </section>

      <TrustRuntimeBoundaryNotice context="privacy" />
      <RouteLocalTrustCopyPanel context="privacy" />

      <section className="legal-quick-read" aria-label="隱私權重點">
        <article>
          <span>本機狀態</span>
          <strong>localStorage 只保存操作偏好</strong>
          <p>
            若功能需要記住瀏覽狀態、篩選條件或使用者確認狀態，會優先使用本機儲存，不把它解讀為投資偏好或個人化建議。
          </p>
        </article>
        <article>
          <span>事件追蹤</span>
          <strong>用於改善公開 Beta 體驗</strong>
          <p>
            站內連結與頁面瀏覽事件可用來理解哪些說明需要更清楚。事件不應包含秘密值、原始市場資料或個人交易內容。
          </p>
        </article>
        <article>
          <span>市場資料</span>
          <strong>不提交 raw market payloads</strong>
          <p>
            資料真實化流程必須經過 source-rights、readonly、ingestion、write/readback 與 promotion gate，不能把原始資料直接提交到 repo。
          </p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>我們可能處理的資料</h2>
        <p>
          Beta 階段可能處理頁面路徑、互動事件、使用者選擇的符號、裝置瀏覽器基本資訊與本機偏好。這些資料用於產品改善、
          健康檢查與公開信任文案調整。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>我們不應收集的資料</h2>
        <p>
          本網站不應要求輸入券商帳號、交易密碼、身分證字號、銀行資料或個人持股明細。若未來需要會員功能，必須另行補充資料保護與權限設計。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料保留與刪除</h2>
        <p>
          本機狀態可由使用者清除瀏覽器資料移除。若未來加入伺服器端帳號或付費功能，會在上線前補齊資料保留、刪除與客服流程。
        </p>
      </section>

      <section className="panel legal-links">
        <h2>相關說明</h2>
        <PrivacyTrustLink href="/terms" label="查看使用條款" />
        <PrivacyTrustLink href="/disclaimer" label="查看風險揭露" />
        <PrivacyTrustLink href="/methodology" label="查看方法論" />
        <PrivacyTrustLink href="/" label="回到首頁" />
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
