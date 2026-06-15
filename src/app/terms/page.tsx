import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "使用條款",
  description: "說明指數燈號網站的市場觀察用途、資料來源邊界與非投資建議聲明。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">使用條款</p>
        <h1>本網站用於市場觀察與風險辨識，不能當作交易指令</h1>
        <p>指數燈號提供市場資訊整理、風險提示與資料狀態說明，協助使用者建立觀察流程。</p>
        <p className="runtime-boundary-line">
          本網站不提供個別買賣建議、不保證報酬、不代替使用者做投資決策，也不提供交易服務。
        </p>
      </section>

      <section className="legal-quick-read" aria-label="使用條款快讀">
        <article>
          <span>用途</span>
          <strong>市場觀察</strong>
          <p>所有內容都是資訊整理與風險辨識輔助，不是投資建議。</p>
        </article>
        <article>
          <span>資料來源</span>
          <strong>需搭配更新時間閱讀</strong>
          <p>正式資料尚未啟用前，頁面會維持示範資料與資料邊界揭露。</p>
        </article>
        <article>
          <span>限制</span>
          <strong>不能當作交易指令</strong>
          <p>使用者需自行判斷並承擔投資風險。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關文件</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/privacy" label="查看隱私政策" payload={{ area: "terms" }}>
          查看隱私政策
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "terms" }}>
          查看風險聲明
        </TrackedLink>
      </section>
    </main>
  );
}
