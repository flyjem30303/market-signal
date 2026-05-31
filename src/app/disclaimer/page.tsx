import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "投資免責聲明",
  description: "說明台股燈號網站的資訊服務定位、投資風險、廣告聯盟揭露與新聞引用原則。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
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

      <section className="legal-runtime-boundary" aria-label="免責聲明 runtime 邊界">
        <div>
          <p className="eyebrow">Runtime Boundary</p>
          <h2>看到分數時先套這三條</h2>
          <p>這些規則對首頁、晨報、週報與個股頁都適用，用來避免把研究體驗誤讀成投資指令。</p>
        </div>
        <article className="allowed">
          <span>可以</span>
          <strong>排序閱讀</strong>
          <p>用燈號、風險與資料狀態安排先看大盤、ETF、個股或方法論。</p>
        </article>
        <article className="caution">
          <span>需要保留</span>
          <strong>只做觀察</strong>
          <p>分數可以協助比較狀態，但不能替代個人財務、部位與風險承受度判斷。</p>
        </article>
        <article className="blocked">
          <span>不可</span>
          <strong>升級成建議</strong>
          <p>不得把任何分數、週報、排行或頁面文案視為買賣、加減碼或收益承諾。</p>
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

      <section className="panel legal-links">
        <h2>讀完免責聲明後</h2>
        <LegalTrustLink href="/methodology" label="了解評分方法論" />
        <LegalTrustLink href="/" label="回首頁看市場概況" />
        <LegalTrustLink href="/terms" label="查看服務條款" />
        <LegalTrustLink href="/privacy" label="查看隱私權政策" />
      </section>
    </main>
  );
}

function LegalTrustLink({ href, label }: { href: string; label: string }) {
  return (
    <TrackedLink className="text-link" eventName="trust_link_clicked" href={href} label={label} payload={{ area: "disclaimer_next_links" }}>
      {label}
    </TrackedLink>
  );
}
