import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

export const metadata: Metadata = {
  title: "方法說明",
  description: "說明指數燈號如何閱讀、資料狀態如何影響解讀，以及為什麼本站只提供資訊整理與風險辨識。"
};

const methodModules = [
  ["市場主燈號", "把市場狀態整理成偏多、觀望、警戒或高風險。", "幫助使用者先看大方向。"],
  ["核心指標", "搭配趨勢、成交量、風險分數與健康分數。", "避免只用單一數字判斷。"],
  ["資料狀態", "揭露更新時間、來源狀態與是否為示範資料。", "避免把延遲或未啟用資料當作即時訊號。"],
  ["行動順序", "先看燈號，再看成因，最後看資料邊界。", "讓 30 秒閱讀與 3 分鐘判斷有固定流程。"],
  ["風險邊界", "所有內容都是資訊整理，不是買賣建議。", "降低誤用與過度解讀。"]
];

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">方法說明</p>
        <h1>燈號方法：讓市場狀態更容易閱讀</h1>
        <p>
          指數燈號不是要用一個分數取代判斷，而是把市場狀態、指標成因、資料更新與風險邊界整理成使用者看得懂的資訊輔助順序。
        </p>
        <p className="runtime-boundary-line">
          正式資料尚未啟用前，公開頁以示範資料呈現閱讀流程；正式市場資料尚未啟用，正式資料必須先通過驗證，任何燈號都不是交易指令，也不提供個股買賣建議。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="method-quick-read" aria-label="方法快速閱讀">
        <article>
          <span>30 秒</span>
          <strong>先看市場主燈號</strong>
          <p>確認目前市場偏多、觀望、警戒或高風險。</p>
        </article>
        <article>
          <span>3 分鐘</span>
          <strong>再看成因與資料狀態</strong>
          <p>複核風險、趨勢、成交量與更新時間，避免只看單一分數。</p>
        </article>
        <article>
          <span>資料品質</span>
          <strong>不是交易指令</strong>
          <p>燈號是觀察輔助，不能取代使用者自己的投資判斷。</p>
        </article>
      </section>

      <section className="panel method-section">
        <h2>指標模組</h2>
        <div className="method-table" role="table" aria-label="指標模組">
          <div className="method-row method-head" role="row">
            <span>模組</span>
            <span>用途</span>
            <span>使用價值</span>
          </div>
          {methodModules.map(([name, purpose, value]) => (
            <div className="method-row" role="row" key={name}>
              <strong>{name}</strong>
              <span>{purpose}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="method-guardrail-grid" aria-label="資料品質與風險邊界">
        <article>
          <h2>資料需要可驗證</h2>
          <p>資料來源、更新時間、覆蓋率與可能延遲必須能被使用者看見；若資料品質異常，前台應清楚降級。</p>
        </article>
        <article>
          <h2>燈號需要解釋</h2>
          <p>紅黃綠狀態必須搭配原因、影響級別與後續觀察重點，避免只留下顏色判斷。</p>
        </article>
        <article>
          <h2>風險提醒不能恐嚇</h2>
          <p>警戒代表需要複核與觀察，不應用恐慌式文案推動使用者做交易。</p>
        </article>
      </section>

      <RouteLocalTrustCopyPanel context="methodology" />
      <PublicRouteReadingContract context="methodology" />

      <section className="panel method-links">
        <h2>下一步閱讀</h2>
        <TrustTextLink href="/" label="市場總覽" />
        <TrustTextLink href="/briefing" label="每日市場晨報" />
        <TrustTextLink href="/weekly" label="市場週報" />
        <TrustTextLink href="/disclaimer" label="風險聲明" />
      </section>
    </main>
  );
}

function TrustTextLink({ href, label }: { href: string; label: string }) {
  return (
    <TrackedLink className="text-link" eventName="trust_link_clicked" href={href} label={label} payload={{ area: "methodology_next_links" }}>
      {label}
    </TrackedLink>
  );
}
