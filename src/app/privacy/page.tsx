import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "隱私權政策",
  description: "說明公開版與未來會員功能可能使用的資料類型，例如 watchlist、警示條件與盤後複盤閱讀紀錄。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <section className="hero">
        <p className="eyebrow">隱私權政策</p>
        <h1>公開版先以最少資料運作；會員功能上線後再補充個人化資料規則</h1>
        <p>
          目前公開版主要使用基本瀏覽與互動事件來改善產品。未來會員功能可能包含 watchlist、自訂警示條件與盤後複盤閱讀紀錄。
        </p>
        <p className="runtime-boundary-line">會員資料只會用於提供追蹤、提醒與內容體驗，不會作為交易指令或個人投資建議。</p>
      </section>

      <section className="legal-quick-read" aria-label="隱私權快讀">
        <article>
          <span>公開版</span>
          <strong>最少資料</strong>
          <p>以頁面瀏覽與互動資料協助改善可讀性。</p>
        </article>
        <article>
          <span>會員規劃</span>
          <strong>watchlist 與警示</strong>
          <p>用於保存使用者關注標的與提醒條件。</p>
        </article>
        <article>
          <span>內容體驗</span>
          <strong>盤後複盤</strong>
          <p>可能記錄閱讀與互動狀態，協助改善回訪體驗。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/terms" label="查看使用條款" payload={{ area: "privacy" }}>
          查看使用條款
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "privacy" }}>
          查看風險聲明
        </TrackedLink>
      </section>
    </main>
  );
}
