import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "隱私權與資料說明",
  description: "說明指數燈號目前公開頁、未來會員功能與資料使用邊界。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">Privacy</p>
        <h1>隱私權與資料說明</h1>
        <p className="eyebrow">會員功能資料邊界</p>
        <p>
          目前公開版不啟用會員登入、付款、持久化自選追蹤或個人化警示；不需要輸入個人資料即可瀏覽市場燈號、資料狀態與風險提醒。
          未來若進入會員功能，網站會先補上會員功能資料邊界、收集目的、保存方式與刪除方式。
          本站不串接交易帳戶，也不要求使用者提供券商帳戶資料。
        </p>
        <p className="runtime-boundary-line">
          正式市場資料尚未啟用前，公開頁以示範資料呈現產品流程。網站分析資料只用於改善閱讀體驗，
          不用來提供個人化投資建議或保證報酬。
        </p>
      </section>

      <section className="legal-quick-read" aria-label="隱私快速閱讀">
        <article>
          <span>目前公開版</span>
          <strong>不需要註冊即可閱讀</strong>
          <p>目前公開版以免費市場總覽、資料狀態與風險提示為主，不建立會員資料閉環。</p>
        </article>
        <article>
          <span>未來會員功能</span>
          <strong>啟用前會先揭露資料邊界</strong>
          <p>自選追蹤、自訂警示與會員內容若進入會員階段，會先說明資料用途與使用者控制方式。</p>
        </article>
        <article>
          <span>資料使用</span>
          <strong>只改善產品閱讀流程</strong>
          <p>網站不會因瀏覽行為直接產生個人化買賣建議，也不代替使用者做投資決策。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>我們目前可能使用的資料</h2>
        <p>
          公開頁可能使用基本瀏覽分析，例如頁面瀏覽、連結點擊與停留情況，用來判斷哪些市場狀態說明需要改善。
          這些資料不等同於投資偏好，也不會直接轉成交易建議。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>會員功能尚未啟用</h2>
        <p>
          會員功能資料邊界是會員階段的前置要求。正式啟用登入、自選追蹤、警示條件或會員內容前，
          會先補上資料收集項目、保存期限、刪除方式與通知方式。
        </p>
      </section>

      <RouteLocalTrustCopyPanel context="privacy" />
      <PublicRouteReadingContract context="privacy" />

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <PrivacyTrustLink href="/terms" label="使用條款" />
        <PrivacyTrustLink href="/disclaimer" label="風險聲明" />
        <PrivacyTrustLink href="/methodology" label="方法說明" />
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
