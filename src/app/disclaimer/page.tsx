import type { Metadata } from "next";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = {
  title: "風險聲明",
  description: "指數燈號是市場資訊整理與風險辨識工具，不是投資建議，也不保證報酬。"
};

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <PageViewTracker eventName="disclaimer_page_viewed" payload={{ page: "disclaimer" }} />
      <section className="hero">
        <p className="eyebrow">Risk Disclosure</p>
        <h1>風險聲明</h1>
        <p>
          指數燈號協助使用者整理市場狀態、資料更新時間與風險提示。這些內容是資訊參考，不是投資建議，也不是任何買進、賣出或持有指令。
        </p>
        <p className="runtime-boundary-line">
          目前公開 Beta 使用示範資料與示範分數。正式市場資料尚未啟用；資料來源、資料範圍與覆蓋率通過前，不宣稱即時或完整市場資料。本網站不提供買賣建議，市場風險自負，燈號不要當成交易指令。
        </p>
      </section>

      <section className="legal-quick-read" aria-label="風險重點">
        <article>
          <span>網站定位</span>
          <strong>資訊與風險辨識</strong>
          <p>本站用紅、黃、綠等燈號降低理解門檻，但不替使用者做投資決策。</p>
        </article>
        <article>
          <span>資料狀態</span>
          <strong>需看更新時間</strong>
          <p>若資料延遲、缺漏或異常，前台會顯示狀態。使用者應避免只看單一燈號下判斷。</p>
        </article>
        <article>
          <span>使用方式</span>
          <strong>先觀察再複核</strong>
          <p>任何警示都應搭配市場背景、個人風險承受度與其他資訊來源共同判讀。</p>
        </article>
      </section>

      <section className="panel legal-section">
        <h2>不是投資建議</h2>
        <p>
          本站不提供個別股票、ETF 或任何金融商品的買賣建議，不提供保證獲利承諾，也不代替專業投資顧問、券商或使用者本人做決策。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>資料限制</h2>
        <p>
          市場資料可能受到資料來源、更新頻率、快取、連線或系統維護影響。正式市場資料尚未啟用前，公開頁維持示範資料邊界，並揭露覆蓋率限制，避免使用者誤認為即時資料。
        </p>
      </section>

      <section className="panel legal-section">
        <h2>會員內容邊界</h2>
        <p>
          下一階段會員功能可提供更完整的市場解讀、watchlist、警示條件與盤後複盤，但仍以觀察、風險提醒與資料解讀為核心，不會提供下單或個人資產配置建議。
        </p>
      </section>

      <PublicRouteReadingContract context="disclaimer" />

      <section className="panel legal-links">
        <h2>相關說明</h2>
        <LegalTrustLink href="/methodology" label="燈號方法" />
        <LegalTrustLink href="/terms" label="使用條款" />
        <LegalTrustLink href="/privacy" label="隱私說明" />
        <LegalTrustLink href="/" label="回到首頁" />
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
