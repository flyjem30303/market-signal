import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "風險聲明",
  description: "說明指數燈號網站的資訊用途、資料限制與非投資建議邊界。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">風險聲明</p>
        <h1>本網站提供市場資訊整理，不代替投資判斷</h1>
        <p>
          指數燈號以市場狀態、趨勢強弱與風險提示協助使用者建立觀察流程。所有資訊僅供參考，並非個股買賣建議或保證報酬承諾。
        </p>
        <p className="runtime-boundary-line">
          使用者應自行判斷資訊是否適用於自身情況；若需要個人化建議，應諮詢合格專業人員。
        </p>
      </section>

      <PublicRouteReadingContract context="disclaimer" />
      <TrustRuntimeBoundaryNotice context="disclaimer" />

      <section className="legal-quick-read" aria-label="風險聲明重點">
        <article>
          <span>非投資建議</span>
          <strong>燈號不是買賣指令</strong>
          <p>紅、黃、綠狀態只代表市場觀察分類，不代表應立即買進、賣出或持有任何商品。</p>
        </article>
        <article>
          <span>資料限制</span>
          <strong>請確認更新時間與來源狀態</strong>
          <p>資料可能延遲、缺漏或正在驗證。若前台顯示資料異常，請不要用該狀態做單一判斷。</p>
        </article>
        <article>
          <span>自行判斷</span>
          <strong>投資風險由使用者自行承擔</strong>
          <p>市場可能快速變動，任何資訊都需要搭配個人風險承受度、資金規劃與其他資料來源交叉確認。</p>
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
