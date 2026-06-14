import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaMembershipMvpRoadmap } from "@/components/public-beta-membership-mvp-roadmap";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "會員功能預覽",
  description:
    "會員 MVP 預計提供每日市場三層解讀、自選追蹤與自訂警示、盤後複盤報告。此頁是會員路線圖，不是會員入口。"
};

export default function MembershipPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="membership_preview_page_viewed" payload={{ page: "membership" }} />
      <section className="hero">
        <p className="eyebrow">第二階段會員路線圖</p>
        <h1>會員功能預覽：從看到燈號，延伸到理解與追蹤</h1>
        <p>
          會員 MVP 會在第一階段公開指數燈號穩定後推進。免費頁先讓所有人 30 秒先看市場氣氛；
          會員內容再讓使用者 3 分鐘再看成因、建立自選追蹤、設定觀察條件並回看盤後複盤。
        </p>
        <p className="runtime-boundary-line">
          這頁是會員路線圖，不是會員入口。正式市場資料尚未啟用；目前不開放會員登入或付費。
          目前不會建立帳號、不會收費、不會儲存自選追蹤清單、不會發送個人化警示。
        </p>
      </section>

      <PublicBetaMembershipMvpRoadmap />

      <section className="panel stock-reading-summary" aria-label="會員功能邊界">
        <p className="eyebrow">會員預覽目前狀態</p>
        <h2>會員 MVP 先驗證需求，不一次做成完整交易工具</h2>
        <p>
          會員註冊、登入、付費訂閱、個人自選追蹤儲存、自訂警示執行與會員專屬內容都尚未開放。
          目前不會儲存個人資料或發送個人化通知，也不會串接券商或處理下單。
        </p>
        <p>
          會員內容未來會以市場總觀、關鍵指標變化、後續觀察重點與盤後複盤為主，仍維持非投資建議邊界。
        </p>
      </section>

      <section className="method-quick-read" aria-label="會員 MVP 三層">
        <article>
          <span>第一層</span>
          <strong>深度解讀</strong>
          <p>每日市場三層解讀：市場總觀、關鍵指標變化、後續觀察重點。</p>
        </article>
        <article>
          <span>第二層</span>
          <strong>個人化追蹤</strong>
          <p>自選追蹤與自訂警示條件，先從觀察輔助開始，不進入交易執行。</p>
        </article>
        <article>
          <span>第三層</span>
          <strong>複盤與學習</strong>
          <p>盤後複盤報告、歷史燈號案例與情境式風險說明。</p>
        </article>
      </section>

      <section className="panel method-links">
        <h2>下一步閱讀</h2>
        <TrackedLink className="text-link" eventName="membership_preview_link_clicked" href="/" label="回到市場總覽" payload={{ area: "membership" }}>
          回到市場總覽
        </TrackedLink>
        <TrackedLink className="text-link" eventName="membership_preview_link_clicked" href="/briefing" label="回到市場晨報" payload={{ area: "membership" }}>
          回到市場晨報
        </TrackedLink>
        <TrackedLink className="text-link" eventName="membership_preview_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "membership" }}>
          查看風險聲明
        </TrackedLink>
      </section>
    </main>
  );
}
