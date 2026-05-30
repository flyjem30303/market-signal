import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "投資免責聲明",
  description: "說明台股燈號網站的資訊服務定位、投資風險、廣告聯盟揭露與新聞引用原則。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Disclaimer</p>
        <h1>投資免責聲明</h1>
        <p>
          本網站提供研究模型、資料整理與市場觀察，不提供個人化投資建議，也不保證任何投資成果。
        </p>
      </section>

      <section className="legal-quick-read" aria-label="免責聲明快速摘要">
        <article>
          <span>服務定位</span>
          <strong>一般資訊服務</strong>
          <p>燈號、排行、週報與評論只用於研究與閱讀輔助，不是個人化建議。</p>
        </article>
        <article>
          <span>投資責任</span>
          <strong>使用者自行承擔</strong>
          <p>任何投資決策都應依個人財務狀況、風險承受度與專業諮詢判斷。</p>
        </article>
        <article>
          <span>目前資料</span>
          <strong>模型仍未正式化</strong>
          <p>正式資料、回測、公開宣稱與廣告合作流程完成前，不應視為真實績效承諾。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>資訊服務定位</h2>
        <p>
          本網站的多頭健康度、回檔風險度、燈號、排行、週報與新聞評論，均屬一般性資訊與研究模型展示。
          內容不構成投資建議、招攬、推介、買賣推薦或收益保證。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>投資風險</h2>
        <p>
          股票、ETF 與其他金融商品皆有價格波動、流動性、匯率、利率、產業循環與市場系統性風險。
          使用者應自行評估財務狀況、投資目標、風險承受度與投資期限，必要時諮詢合格專業人士。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>模型限制</h2>
        <p>
          模型分數可能受到資料延遲、缺漏、計算假設、歷史樣本偏誤與市場結構變化影響。
          過去回測結果不代表未來績效，燈號也不應被視為單一買賣依據。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>廣告與聯盟行銷</h2>
        <p>
          本網站未來可能放置廣告、聯盟連結或商業合作內容。若使用者透過相關連結註冊、購買或開戶，
          本網站可能取得廣告收入或佣金。商業合作內容不會改變模型分數，也不應被視為投資推薦。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>新聞與第三方內容</h2>
        <p>
          新聞彙整會盡量標示來源，並以摘要、評論與連結方式呈現。本網站不重製第三方全文內容。
          若內容涉及錯誤、授權或權利問題，後續正式上線前需建立聯絡與下架流程。
        </p>
      </section>
    </main>
  );
}
