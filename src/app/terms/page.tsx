import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "使用條款",
  description: "說明指數燈號的服務定位、資料限制、使用者責任與風險邊界。"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="terms_page_viewed" payload={{ page: "terms" }} />
      <section className="hero">
        <p className="eyebrow">使用條款</p>
        <h1>請把指數燈號視為市場資訊整理與風險辨識工具</h1>
        <p>
          指數燈號網站以市場狀態、風險提示與資料更新狀態協助使用者閱讀資訊。使用者應自行判斷資訊是否適用於自身情況。
        </p>
        <p className="runtime-boundary-line">
          本網站不提供交易執行、投資顧問、個人資產配置或保證報酬服務。
        </p>
      </section>

      <PublicRouteReadingContract context="terms" />
      <TrustRuntimeBoundaryNotice context="terms" />

      <section className="legal-quick-read" aria-label="使用條款重點">
        <article>
          <span>服務定位</span>
          <strong>市場資訊與風險提示</strong>
          <p>燈號用於降低資訊理解門檻，不代表任何商品適合買進、賣出或持有。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>資料可能延遲或仍為示範資料</strong>
          <p>使用者應確認資料狀態、更新時間與來源說明，不應把示範資料視為正式行情。</p>
        </article>
        <article>
          <span>使用者責任</span>
          <strong>使用者需自行判斷風險</strong>
          <p>使用者應自行承擔投資決策結果，並搭配其他資料來源與專業意見。</p>
        </article>
      </section>

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/privacy" label="查看隱私政策" payload={{ area: "terms" }}>
          查看隱私政策
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看免責聲明" payload={{ area: "terms" }}>
          查看免責聲明
        </TrackedLink>
      </section>
    </main>
  );
}
