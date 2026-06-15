import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "服務條款",
  description: "了解指數燈號的服務定位、資料限制與使用邊界。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">服務條款</p>
        <h1>使用本網站前，請先理解資料與決策邊界</h1>
        <p>
          指數燈號提供市場資訊整理、風險辨識與市場觀察輔助。使用者應自行判斷資料是否適合自己的情境，不能當作交易指令。
        </p>
        <p className="runtime-boundary-line">
          免費公開頁以市場總覽與基礎指標為主；會員功能屬後續階段，公開測試版不會提供交易、下單或個人資產配置建議。
        </p>
      </section>

      <PublicRouteReadingContract context="terms" />

      <section className="legal-quick-read" aria-label="服務條款摘要">
        <article>
          <span>服務內容</span>
          <strong>市場狀態提示</strong>
          <p>燈號用來輔助閱讀市場，不保證準確、完整或即時到秒。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>需看更新時間</strong>
          <p>若資料異常、延遲或仍為示範資料，前台會清楚揭露。</p>
        </article>
        <article>
          <span>使用限制</span>
          <strong>非投資建議</strong>
          <p>網站不提供買賣建議、不保證報酬，也不代替專業諮詢。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/privacy" label="查看隱私說明" payload={{ area: "terms" }}>
          查看隱私說明
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "terms" }}>
          查看風險聲明
        </TrackedLink>
      </section>
    </main>
  );
}
