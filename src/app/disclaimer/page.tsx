import type { Metadata } from "next";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { buildCorePageJsonLd, buildRouteMetadata } from "@/lib/seo";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = buildRouteMetadata({
  description: "????????????????????????????????????",
  path: "/disclaimer",
  title: "????"
});

const disclaimerJsonLd = buildCorePageJsonLd({
  description: "????????????????????????????????????",
  path: "/disclaimer",
  title: "????"
});

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <SeoJsonLd data={disclaimerJsonLd} />
      <section className="hero">
        <p className="eyebrow">風險聲明</p>
        <h1>燈號是觀察工具，不是買賣指令</h1>
        <p>本站整理市場狀態、風險提示與資料更新時間，協助使用者建立自己的觀察流程。</p>
        <p className="runtime-boundary-line">所有內容僅供資訊參考，不構成投資建議、報酬承諾或買賣推薦。</p>
      </section>

      <section className="legal-quick-read" aria-label="風險聲明重點">
        <article>
          <span>資訊定位</span>
          <strong>市場觀察參考</strong>
          <p>本站協助整理市場訊號，不提供個股買賣建議或個人化資產配置。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>可能延遲或缺漏</strong>
          <p>使用燈號前請先確認資料來源、更新時間與頁面上的資料狀態提示。</p>
        </article>
        <article>
          <span>投資責任</span>
          <strong>自行承擔決策風險</strong>
          <p>投資可能產生損失，任何決策都應由使用者自行評估並承擔結果。</p>
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
