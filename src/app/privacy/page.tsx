import type { Metadata } from "next";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { buildCorePageJsonLd, buildRouteMetadata } from "@/lib/seo";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = buildRouteMetadata({
  description: "????????????????????????",
  path: "/privacy",
  title: "?????"
});

const privacyJsonLd = buildCorePageJsonLd({
  description: "????????????????????????",
  path: "/privacy",
  title: "?????"
});

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="privacy_page_viewed" payload={{ page: "privacy" }} />
      <SeoJsonLd data={privacyJsonLd} />
      <section className="hero">
        <p className="eyebrow">隱私權政策</p>
        <h1>目前不建立會員帳號，也不處理交易資料</h1>
        <p>公開版可直接瀏覽；追蹤清單只儲存在使用者自己的瀏覽器，本網站目前不建立會員資料庫。</p>
        <p className="runtime-boundary-line">目前不串接券商、交易帳戶或個人資產配置資料。</p>
      </section>

      <section className="legal-quick-read" aria-label="隱私權重點">
        <article>
          <span>會員資料</span>
          <strong>目前沒有帳號系統</strong>
          <p>本站目前不提供註冊、登入、付款或會員專區，因此不建立會員個資。</p>
        </article>
        <article>
          <span>追蹤清單</span>
          <strong>儲存在你的瀏覽器</strong>
          <p>你加入的追蹤標的使用瀏覽器 localStorage 保存，不會寫入本站會員資料庫。</p>
        </article>
        <article>
          <span>互動事件</span>
          <strong>用於改善閱讀流程</strong>
          <p>頁面瀏覽與點擊事件用來觀察功能是否容易理解，不包含交易帳戶或資產配置資料。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/terms" label="查看使用條款" payload={{ area: "privacy" }}>
          查看使用條款
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "privacy" }}>
          查看風險聲明
        </TrackedLink>
      </section>
    </main>
  );
}
