import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "風險聲明",
  description: "指數燈號提供市場資訊整理與風險辨識，不提供買賣建議、保證報酬或個人化投資建議。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">風險聲明</p>
        <h1>燈號是觀察工具，不是買賣指令</h1>
        <p>本站整理市場狀態、風險提示與資料更新時間，協助使用者建立觀察流程。</p>
        <p className="runtime-boundary-line">所有內容僅供資訊參考，不構成投資建議、報酬承諾或買賣推薦。</p>
      </section>

      <section className="legal-quick-read" aria-label="風險聲明重點">
        <article>
          <span>投資責任</span>
          <strong>使用者需自行判斷</strong>
          <p>任何市場資訊都可能延遲、錯誤或不完整，使用者應自行承擔投資決策與風險。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>資料時間必須確認</strong>
          <p>使用燈號前請先確認資料來源、更新時間與是否存在降級提示。</p>
        </article>
        <article>
          <span>產品定位</span>
          <strong>不提供個股買賣建議</strong>
          <p>本站不代替使用者做投資決策，也不提供個人化資產配置建議。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>延伸閱讀</h2>
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
