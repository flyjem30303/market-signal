import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "隱私與資料說明",
  description: "說明指數燈號公開 Beta 階段的資料來源、資料蒐集範圍、會員功能預覽與使用者隱私權邊界。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">Privacy</p>
        <h1>隱私權與資料說明</h1>
        <p>
          公開 Beta 階段以市場資訊展示與閱讀流程驗證為主。一般使用者瀏覽公開頁時，不需要輸入交易帳戶、券商帳號、身分證字號或金融帳戶資料。不要在任何表單填入券商密碼、金融帳戶或交易授權資訊。資料來源與更新狀態會在公開頁揭露。
        </p>
        <p className="runtime-boundary-line">
          會員功能仍是下一階段規劃；若未來開放登入、watchlist 或自訂警示，會先補上明確的個資蒐集範圍、敏感資料邊界、保存方式與刪除機制。
        </p>
      </section>

      <section className="legal-quick-read" aria-label="隱私重點">
        <article>
          <span>目前階段</span>
          <strong>公開瀏覽為主</strong>
          <p>目前主要處理頁面瀏覽、互動事件與錯誤觀察，用來改善網站可用性。</p>
        </article>
        <article>
          <span>不需要輸入</span>
          <strong>交易帳戶</strong>
          <p>本站不要求使用者輸入券商帳號、交易密碼、金融帳戶或個人資產資料。</p>
        </article>
        <article>
          <span>資料保護方向</span>
          <strong>最小化蒐集</strong>
          <p>未來會員功能會以必要資料為原則，避免蒐集與市場觀察無關的資料。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>目前可能蒐集的資料</h2>
        <p>可能包含頁面瀏覽、點擊事件、裝置與瀏覽器資訊、錯誤紀錄與匿名化使用統計。這些資料用來改善內容、導覽與載入穩定性。</p>
      </section>

      <section className="panel legal-section">
        <h2>目前不蒐集的資料</h2>
        <p>公開 Beta 階段不需要輸入交易帳戶，不蒐集下單資訊、個人持倉、資產配置、券商密碼、信用卡資料或其他敏感資料。</p>
      </section>

      <section className="panel legal-section">
        <h2>會員功能資料邊界</h2>
        <p>會員 MVP 若啟用，可能需要帳號、watchlist、警示條件與閱讀紀錄；正式上線前會再補完整告知與刪除流程。</p>
      </section>

      <PublicRouteReadingContract context="privacy" />

      <section className="panel legal-links">
        <h2>相關說明</h2>
        <PrivacyTrustLink href="/terms" label="使用條款" />
        <PrivacyTrustLink href="/disclaimer" label="風險聲明" />
        <PrivacyTrustLink href="/methodology" label="方法說明" />
        <PrivacyTrustLink href="/" label="回首頁" />
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
