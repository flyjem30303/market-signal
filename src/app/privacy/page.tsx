import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "隱私政策",
  description: "說明指數燈號目前公開頁與未來會員功能可能涉及的資料使用原則。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">Privacy</p>
        <h1>隱私權與資料說明</h1>
        <p className="eyebrow">隱私與資料說明</p>
        <p>
          目前公開頁以市場資訊展示為主，不需要輸入個人資料即可閱讀。未來若開放會員功能，會以最小必要資料支援登入、自選追蹤、提醒與內容體驗，並清楚標示資料來源。
        </p>
        <p className="runtime-boundary-line">
          會員功能尚未正式開放；自選追蹤、自訂警示與個人化通知仍屬下一階段規劃，正式上線前會補齊資料用途與管理方式。請不要在任何表單輸入交易帳戶、券商密碼或不必要的敏感資料。
        </p>
      </section>

      <section className="legal-quick-read" aria-label="隱私快速閱讀">
        <article>
          <span>目前公開頁</span>
          <strong>不需要會員資料</strong>
          <p>使用者可以直接查看市場總覽、晨報、週報、方法說明與風險聲明。</p>
        </article>
        <article>
          <span>未來會員功能</span>
          <strong>最小必要資料</strong>
          <p>會員資料只應用於登入、追蹤偏好、提醒設定與會員內容體驗。</p>
        </article>
        <article>
          <span>資料管理</span>
          <strong>可說明、可調整</strong>
          <p>未來會提供清楚的資料用途、保存範圍與使用者管理方式。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>資料保護方向</h2>
        <p>公開 Beta 階段可能使用基本流量、頁面互動與錯誤紀錄來改善服務品質。這些資料應以統計與維運目的為主。</p>
      </section>

      <section className="panel legal-section">
        <h2>未來會員資料</h2>
        <p>會員功能若上線，可能包含登入資料、自選追蹤、自訂警示與閱讀紀錄。這些資料會用於個人化追蹤與提醒，不會被描述成投資建議。</p>
      </section>

      <RouteLocalTrustCopyPanel context="privacy" />
      <PublicRouteReadingContract context="privacy" />

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <PrivacyTrustLink href="/terms" label="使用條款" />
        <PrivacyTrustLink href="/disclaimer" label="風險聲明" />
        <PrivacyTrustLink href="/methodology" label="方法說明" />
        <PrivacyTrustLink href="/" label="市場總覽" />
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
