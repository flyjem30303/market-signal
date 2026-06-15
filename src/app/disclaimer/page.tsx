import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "風險聲明",
  description: "本網站提供市場資訊整理與風險辨識，不構成投資建議。公開 Beta 目前使用模擬資料。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">風險聲明</p>
        <h1>指數燈號提供市場資訊整理，不構成投資建議</h1>
        <p>本網站協助使用者理解市場狀態、成因與風險，但不提供個股買賣建議、保證報酬承諾或交易指令。</p>
        <p className="runtime-boundary-line">公開 Beta 目前使用模擬資料展示流程；正式資料上線前請不要把燈號視為即時真實訊號。</p>
      </section>

      <section className="legal-quick-read" aria-label="風險聲明快讀">
        <article>
          <span>定位</span>
          <strong>市場資訊整理</strong>
          <p>用於風險辨識與觀察輔助，不取代個人投資判斷。</p>
        </article>
        <article>
          <span>資料</span>
          <strong>模擬資料</strong>
          <p>目前資料僅供公開 Beta 流程展示。</p>
        </article>
        <article>
          <span>責任</span>
          <strong>自行判斷風險</strong>
          <p>投資可能產生損失，使用者應自行評估並承擔風險。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/terms" label="查看使用條款" payload={{ area: "disclaimer" }}>
          查看使用條款
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/methodology" label="查看方法說明" payload={{ area: "disclaimer" }}>
          查看方法說明
        </TrackedLink>
      </section>
    </main>
  );
}
