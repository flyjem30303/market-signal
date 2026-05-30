import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隱私權政策",
  description: "說明台股燈號網站可能蒐集的資料、使用目的、分析工具、會員資料與使用者權利。"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Privacy</p>
        <h1>隱私權政策</h1>
        <p>
          本頁為正式上線前的隱私權政策草案，用來先界定追蹤事件、會員功能、廣告與 Email 週報可能涉及的資料使用。
        </p>
      </section>

      <section className="legal-quick-read" aria-label="隱私權快速摘要">
        <article>
          <span>目前狀態</span>
          <strong>上線前草案</strong>
          <p>目前先界定追蹤事件、會員、Email 週報與廣告可能用到的資料範圍。</p>
        </article>
        <article>
          <span>資料用途</span>
          <strong>改善產品體驗</strong>
          <p>互動事件主要用於理解使用流程、熱門標的與內容效果，不用來保證投資結果。</p>
        </article>
        <article>
          <span>使用者權利</span>
          <strong>需補流程</strong>
          <p>會員功能上線前，需補齊查詢、更正、刪除、停用與聯絡窗口。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>可能蒐集的資料</h2>
        <p>
          本網站目前可能記錄使用者瀏覽頁面、選擇標的、加入愛心、切換頁籤與調整日期等互動事件。
          未來若開放會員功能，可能會蒐集 Email、登入識別、收藏清單、訂閱狀態與偏好設定。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料使用目的</h2>
        <p>
          資料主要用於改善網站體驗、分析熱門標的、優化週報內容、提供會員收藏與通知功能、偵測異常使用，
          以及評估廣告與聯盟行銷成效。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>分析工具與 Cookie</h2>
        <p>
          正式上線後，本網站可能使用 GA4、Vercel Analytics 或其他網站分析工具。若使用 Cookie 或類似技術，
          會用於統計流量、理解使用行為與維持登入狀態，不會用來保證任何投資結果。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>第三方服務</h2>
        <p>
          本網站可能使用資料庫、主機代管、Email 寄送、廣告平台、聯盟行銷平台與新聞資料服務。
          第三方服務會依其各自條款處理資料，正式上線前需補上實際服務商清單。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>使用者權利</h2>
        <p>
          會員功能上線後，使用者應可要求查詢、更正、刪除或停止使用個人資料。正式版本會補上聯絡方式與資料刪除流程。
        </p>
      </section>
    </main>
  );
}
