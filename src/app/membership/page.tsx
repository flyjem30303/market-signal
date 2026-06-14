import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaMembershipMvpRoadmap } from "@/components/public-beta-membership-mvp-roadmap";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "會員功能預覽",
  description:
    "下一階段會員功能預計提供每日市場三層解讀、自選追蹤與自訂警示、盤後複盤報告。此頁是會員路線圖，不是會員入口；目前尚未開放登入。"
};

export default function MembershipPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="membership_preview_page_viewed" payload={{ page: "membership" }} />
      <section className="hero">
        <p className="eyebrow">第二階段會員路線圖</p>
        <h1>會員功能預告：從看懂市場燈號，延伸到建立自己的觀察流程</h1>
        <p>
          會員功能會放在第二階段推出。第一階段先讓所有使用者都能在 30 秒內看懂市場總覽、核心指標、風險提示與資料更新時間；
          會員區則會補上更完整的市場解讀、盤後複盤與個人化觀察工具，協助使用者用 3 分鐘建立自己的觀察順序。
        </p>
        <p className="runtime-boundary-line">
          這頁是會員路線圖，不是會員入口。目前尚未開放登入，也尚未提供付費會員內容。
          目前不會建立帳號、不會收費、不會儲存自選追蹤清單、不會發送個人化警示。
        </p>
      </section>

      <PublicBetaMembershipMvpRoadmap />

      <section className="panel stock-reading-summary" aria-label="會員內容邊界">
        <p className="eyebrow">免費與會員內容邊界</p>
        <h2>免費頁面先回答市場現在怎麼了，會員頁面再回答為什麼與接下來觀察什麼</h2>
        <p>
          免費內容會保留市場總覽燈號、核心指標摘要、主要風險提示與更新時間，讓一般投資者快速建立當日市場輪廓。
          會員內容則預計提供每日市場三層解讀、自選追蹤、自訂警示條件與盤後複盤，協助使用者追蹤自己關心的指標。
        </p>
        <p>
          會員解讀會以觀察、風險提醒、情境判斷與資料說明為核心；即使未來開放會員功能，仍不提供買賣建議、不提供個別買賣建議，也不提供個股買賣建議、
          不代替使用者做投資決策，也不串接券商下單。
        </p>
      </section>

      <section className="method-quick-read" aria-label="會員功能優先內容">
        <article>
          <span>第一層</span>
          <strong>每日市場三層解讀</strong>
          <p>整理市場總觀、關鍵指標變化與後續觀察重點，讓使用者不只看到燈號，也理解燈號變化的原因。</p>
        </article>
        <article>
          <span>第二層</span>
          <strong>自選追蹤與自訂警示</strong>
          <p>讓使用者追蹤自己關心的指數、ETF 或指標，並用條件提醒建立固定觀察流程。</p>
        </article>
        <article>
          <span>第三層</span>
          <strong>盤後複盤報告</strong>
          <p>回看當日燈號與關鍵訊號是否有效，整理隔日值得追蹤的市場變化。</p>
        </article>
      </section>

      <section className="panel method-links">
        <h2>先從公開頁面開始</h2>
        <TrackedLink className="text-link" eventName="membership_preview_link_clicked" href="/" label="返回市場總覽" payload={{ area: "membership" }}>
          返回市場總覽
        </TrackedLink>
        <TrackedLink className="text-link" eventName="membership_preview_link_clicked" href="/briefing" label="查看市場簡報" payload={{ area: "membership" }}>
          查看市場簡報
        </TrackedLink>
        <TrackedLink className="text-link" eventName="membership_preview_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "membership" }}>
          查看風險聲明
        </TrackedLink>
      </section>
    </main>
  );
}
