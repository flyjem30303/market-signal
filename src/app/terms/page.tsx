import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "使用條款",
  description: "說明台股燈號網站的服務定位、使用限制、模型資料限制、會員、廣告與責任範圍。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Terms</p>
        <h1>使用條款</h1>
        <p>本頁為正式上線前的使用條款草案，用來先界定網站服務範圍與使用者責任。</p>
      </section>

      <section className="legal-quick-read" aria-label="使用條款快速摘要">
        <article>
          <span>目前版本</span>
          <strong>正式上線前草案</strong>
          <p>條款先界定產品方向與使用限制，實際商業化前仍需法務與營運覆核。</p>
        </article>
        <article>
          <span>使用限制</span>
          <strong>不可當交易指令</strong>
          <p>健康度、風險度、新聞信心與週報都不能被直接解讀為買賣推薦。</p>
        </article>
        <article>
          <span>未來功能</span>
          <strong>會員與訂閱待定</strong>
          <p>付費、Email、會員收藏與廣告合作上線前，需補完整範圍與取消方式。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>服務定位</h2>
        <p>
          本網站提供台股健康度、回檔風險、新聞信心、週報與模型研究內容。所有內容皆為一般資訊服務，
          不構成個人化投資建議、買賣推薦、招攬或收益保證。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>使用者責任</h2>
        <p>
          使用者應自行判斷資訊是否適合自身財務狀況與風險承受度。任何投資決策與結果均由使用者自行承擔。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料與模型限制</h2>
        <p>
          本網站資料可能有延遲、缺漏、錯誤或計算假設差異。模型分數與回測結果可能因資料品質、市場結構變化與參數調整而改變。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>會員與訂閱</h2>
        <p>
          未來若推出會員、Email 週報或付費功能，會另行標示功能範圍、付款方式、取消方式與資料保存規則。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>廣告與聯盟內容</h2>
        <p>
          本網站可能提供廣告、聯盟連結或商業合作內容。相關內容不得視為投資建議，且不應影響模型分數或燈號。
        </p>
      </section>
    </main>
  );
}
