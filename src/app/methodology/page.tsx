import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

export const metadata: Metadata = {
  title: "方法說明 | Taiwan Market Signal",
  description:
    "公開 Beta 方法說明：解釋示範評分、資料來源邊界、風險提示與非投資建議原則。"
};

const methodModules = [
  ["趨勢與動能", "18%", "觀察價格相對均線、近期方向與動能變化", "用來判斷市場是否延續原方向"],
  ["風險與波動", "16%", "觀察回落風險、波動與防守訊號", "用來提醒使用者先複核風險"],
  ["市場廣度", "18%", "觀察偏強、觀察中與偏防守標的比例", "用來避免只看單一股票"],
  ["ETF 與產業", "14%", "觀察 ETF 與產業代表標的", "用來建立比較順序"],
  ["資料品質", "16%", "觀察資料更新時間、來源狀態與覆蓋率", "資料不足時會降低信心"],
  ["公開信任邊界", "18%", "揭露 mock-only、非投資建議與 promotion gate", "避免誤讀示範分數"]
];

const qualityLevels = [
  ["A", "來源、欄位、更新時間與覆蓋率都可驗證，適合進入更高信任層級。"],
  ["B", "主要欄位可驗證，但仍需補齊部分覆蓋或更新節奏說明。"],
  ["C", "可以做示範或內部觀察，但不適合公開宣稱完整可靠。"],
  ["D", "來源或欄位仍不明確，只能停留在 mock 或研究狀態。"]
];

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">Methodology</p>
        <h1>方法說明</h1>
        <p>
          這套方法把市場資料轉成一般投資者可理解的觀察順序：先看市場氛圍，再看風險、ETF、產業與個別標的。
          目前仍使用示範資料與示範評分，正式市場資料尚未啟用。
        </p>
        <p className="runtime-boundary-line">
          重要聲明：本頁是方法透明化，不是預測保證，也不是投資建議。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <TrustRuntimeBoundaryNotice context="methodology" />
      <RouteLocalTrustCopyPanel context="methodology" />

      <section className="method-quick-read" aria-label="方法 30 秒理解">
        <article>
          <span>30 秒</span>
          <strong>分數是觀察順序</strong>
          <p>高分代表值得優先閱讀，不代表可以直接買進；低分代表需要複核，不代表一定賣出。</p>
        </article>
        <article>
          <span>3 分鐘</span>
          <strong>先看成因，再看行動</strong>
          <p>每個狀態都必須回到成因、更新時間、影響層級與下一步觀察，不把分數當指令。</p>
        </article>
        <article>
          <span>升級條件</span>
          <strong>資料權利與覆蓋率先通過</strong>
          <p>只有合法免費可自動化來源、欄位契約與 coverage gate 通過後，才會評估 real-data promotion。</p>
        </article>
      </section>

      <section className="panel method-section">
        <h2>指標組成</h2>
        <div className="method-table" role="table" aria-label="指標組成">
          <div className="method-row method-head" role="row">
            <span>模組</span>
            <span>權重</span>
            <span>觀察內容</span>
            <span>使用方式</span>
          </div>
          {methodModules.map(([name, weight, data, comment]) => (
            <div className="method-row" role="row" key={name}>
              <strong>{name}</strong>
              <span>{weight}</span>
              <span>{data}</span>
              <span>{comment}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel method-section">
        <h2>資料品質等級</h2>
        <div className="quality-grid">
          {qualityLevels.map(([level, text]) => (
            <article className="quality-card" key={level}>
              <strong>{level}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="method-guardrail-grid" aria-label="方法邊界">
        <article>
          <h2>不把分數當指令</h2>
          <p>分數只幫助排序注意力，使用者仍需自行查證並評估風險。</p>
        </article>
        <article>
          <h2>不宣稱即時完整</h2>
          <p>正式市場資料尚未啟用前，所有頁面都必須清楚標示 mock-only。</p>
        </article>
        <article>
          <h2>不替代專業判斷</h2>
          <p>本網站提供資訊整理與風險辨識，不提供個別買賣建議。</p>
        </article>
      </section>

      <section className="panel method-links">
        <h2>下一步閱讀</h2>
        <TrustTextLink href="/" label="回到首頁" />
        <TrustTextLink href="/briefing" label="閱讀市場 briefing" />
        <TrustTextLink href="/weekly" label="閱讀週報" />
        <TrustTextLink href="/disclaimer" label="查看免責聲明" />
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
