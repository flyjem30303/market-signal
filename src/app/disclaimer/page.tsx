import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "風險聲明",
  description: "說明指數燈號的非投資建議、示範資料、資料延遲與市場風險自負邊界。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">Risk Disclosure</p>
        <h1>風險聲明與風險揭露</h1>
        <p>
          市場風險自負。指數燈號提供市場資訊整理、風險辨識與觀察輔助，不構成個股買賣建議，也不提供買賣建議，
          不保證任何報酬，也不代替使用者做投資決策。
        </p>
        <p className="runtime-boundary-line">
          正式市場資料尚未啟用前，公開頁以示範資料呈現產品流程。燈號與分數不是即時行情、
          不是買賣指令，也不應作為單一決策依據。
        </p>
      </section>

      <section className="legal-quick-read" aria-label="風險聲明快速閱讀">
        <article>
          <span>定位</span>
          <strong>觀察輔助，不是投資建議</strong>
          <p>燈號只協助你排序市場觀察重點，不能直接轉換成買賣行動。</p>
        </article>
        <article>
          <span>資料</span>
          <strong>需檢查更新時間與來源狀態</strong>
          <p>資料可能延遲、缺漏或異常，正式資料上線後仍需保留錯誤回退與來源揭露。</p>
        </article>
        <article>
          <span>責任</span>
          <strong>使用者自行承擔風險</strong>
          <p>任何投資判斷都應搭配自身狀況、風險承受度與其他資料來源。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>非投資建議</h2>
        <p>
          本網站不提供買進、賣出、持有、停損、停利或資產配置建議。所有燈號、分數、警示與說明都只作為資訊整理與風險辨識參考。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料延遲與異常</h2>
        <p>
          市場資料可能因來源更新、技術維護、網路異常或資料格式變更而延遲或錯誤。看到警示時，請先確認資料更新時間與來源狀態。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>使用者責任</h2>
        <p>
          使用者需自行承擔風險。若你需要個人化投資建議，請諮詢具備資格的專業人士，並自行確認資訊適用性。
        </p>
      </section>

      <RouteLocalTrustCopyPanel context="disclaimer" />
      <PublicRouteReadingContract context="disclaimer" />

      <section className="panel legal-links">
        <h2>相關頁面</h2>
        <LegalTrustLink href="/methodology" label="方法說明" />
        <LegalTrustLink href="/terms" label="使用條款" />
        <LegalTrustLink href="/privacy" label="隱私政策" />
        <LegalTrustLink href="/" label="回到首頁" />
      </section>
    </main>
  );
}

function LegalTrustLink({ href, label }: { href: string; label: string }) {
  return (
    <TrackedLink
      className="text-link"
      eventName="trust_link_clicked"
      href={href}
      label={label}
      payload={{ area: "disclaimer_next_links" }}
    >
      {label}
    </TrackedLink>
  );
}
