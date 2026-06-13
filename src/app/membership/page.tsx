import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaMembershipMvpRoadmap } from "@/components/public-beta-membership-mvp-roadmap";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "會員功能預覽",
  description:
    "指數燈號下一階段會員功能預覽：每日市場三層解讀、watchlist 與自訂警示、盤後複盤報告。公開 Beta 目前尚未開放會員登入或付費。"
};

const previewRows = [
  {
    title: "每日市場三層解讀",
    status: "規劃中",
    value: "市場總觀、關鍵指標變化、後續觀察重點",
    boundary: "提供市場解讀脈絡，不提供個股買賣建議。"
  },
  {
    title: "Watchlist 與自訂警示",
    status: "規劃中",
    value: "追蹤關心的指數、ETF 或指標，設定至少一種觀察條件",
    boundary: "公開 Beta 尚未儲存個人清單，也不執行個人化通知。"
  },
  {
    title: "盤後複盤報告",
    status: "規劃中",
    value: "回顧當日燈號是否有效，整理隔日值得追蹤的訊號",
    boundary: "用於學習與複核，不代表投資結果承諾。"
  }
];

export default function MembershipPreviewPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="membership_preview_page_viewed" payload={{ page: "membership" }} />
      <section className="hero">
        <p className="eyebrow">會員功能預覽</p>
        <h1>會員功能預覽</h1>
        <p>
          會員功能的目標，是讓使用者不只看到市場燈號，也能理解燈號背後原因、建立自己的觀察清單，
          並在盤後回看判斷品質。這一頁只說明下一階段產品路線，尚未開放登入、付費或個人化資料儲存。
        </p>
        <p className="runtime-boundary-line">
          目前公開 Beta 仍使用示範資料與示範分數；正式市場資料尚未啟用。會員內容也會維持市場資訊整理、
          風險辨識與非投資建議邊界。
        </p>
        <p className="runtime-boundary-line">
          下一階段的會員功能仍會延續同一套閱讀承諾：30 秒先看市場氣氛，3 分鐘再看成因、警示與後續觀察。
        </p>
      </section>

      <section className="panel stock-reading-summary" aria-label="會員 MVP 三個核心能力">
        <p className="eyebrow">會員 MVP</p>
        <h2>三個核心能力先定義清楚，再進入會員實作</h2>
        <p>
          會員 MVP 先聚焦三件事：每日市場三層解讀、watchlist 與自訂警示、盤後複盤報告。
          這些能力會在公開 Beta 穩定後逐步實作，不會阻擋目前所有人可用的免費市場總覽。
        </p>
        <div className="membership-preview-grid">
          {previewRows.map((row) => (
            <article key={row.title}>
              <span>{row.status}</span>
              <strong>{row.title}</strong>
              <p>{row.value}</p>
              <small>{row.boundary}</small>
            </article>
          ))}
        </div>
      </section>

      <PublicBetaMembershipMvpRoadmap />

      <section className="panel stock-reading-summary" aria-label="會員預覽目前狀態">
        <p className="eyebrow">目前狀態</p>
        <h2>這頁是會員路線圖，不是會員入口</h2>
        <p>
          目前可以做的是理解下一階段會員 MVP 會包含哪些內容，以及哪些邊界不會被突破。
          目前不會建立帳號、不會收費、不會儲存 watchlist、不會發送個人化警示，也不會開放會員專屬內容。
        </p>
        <div className="briefing-actions">
          <article>
            <strong>現在可用</strong>
            <p>查看會員功能方向、免費版與會員版差異、非投資建議邊界，以及未來功能的優先順序。</p>
          </article>
          <article>
            <strong>尚未啟用</strong>
            <p>會員註冊、登入、付費訂閱、個人 watchlist 儲存、自訂警示執行與會員專屬內容都尚未開放。</p>
          </article>
          <article>
            <strong>上線條件</strong>
            <p>公開 Beta 穩定、資料信任狀態清楚、法務揭露完整後，才會進入會員功能實作。</p>
          </article>
        </div>
      </section>

      <section className="panel stock-reading-summary" aria-label="會員功能尚未開放項目">
        <p className="eyebrow">尚未開放</p>
        <h2>目前不開放會員登入或付費</h2>
        <p>
          本頁是產品預覽，不會要求輸入帳號密碼、交易帳戶、信用卡、身分證字號或任何第三方服務密鑰。
          Watchlist、警示條件與盤後複盤目前都只作為下一階段規劃，不會儲存個人資料或發送個人化通知。
        </p>
        <div className="briefing-actions">
          <TrackedLink className="text-link" eventName="membership_preview_link_clicked" href="/" label="回到市場總覽" payload={{ area: "membership_preview" }}>
            回到市場總覽
          </TrackedLink>
          <TrackedLink className="text-link" eventName="membership_preview_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "membership_preview" }}>
            查看風險聲明
          </TrackedLink>
        </div>
      </section>

      <TrustRuntimeBoundaryNotice context="membership" />
    </main>
  );
}
