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
  description: "公開 Beta 方法說明：指數狀態如何整理成市場氣氛、風險提示與觀察順序。"
};

const methodModules = [
  ["市場氣氛", "18%", "觀察指數狀態與整體方向", "幫助使用者先理解大盤溫度"],
  ["風險升溫", "16%", "觀察波動、分數下降與偏防守訊號", "提醒使用者放慢判讀速度"],
  ["市場廣度", "18%", "觀察偏強、觀察中、偏防守標的分布", "避免只看單一數字"],
  ["ETF 與產業", "14%", "觀察 ETF 與代表標的", "建立比較順序"],
  ["資料品質", "16%", "觀察更新時間、來源狀態與覆蓋率", "資料不足時降低信心"],
  ["公開信任邊界", "18%", "揭露示範資料、非投資建議與正式資料狀態", "避免誤讀示範分數"]
];

const qualityLevels = [
  ["A", "資料更新、來源狀態與欄位一致性都足以支撐公開解讀。"],
  ["B", "資料大致可讀，但仍需要留意更新時間或部分欄位限制。"],
  ["C", "資料可用於觀察方向，但不適合作為高信心判斷。"],
  ["D", "資料限制明顯，應保守解讀或等待後續更新。"]
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
          本站把市場資料整理成「市場氣氛、風險升溫、廣度、資料品質」等可讀訊號，讓使用者先看大方向，
          再決定是否關注、加強觀察或降低風險。資料來源、覆蓋率與更新時間會影響判讀信心。
        </p>
        <p className="runtime-boundary-line">正式資料尚未啟用；目前為公開 Beta 示範階段，分數用來展示判讀流程，不代表正式投資模型。</p>
      </section>

      <section className="panel legal-section" aria-label="方法使用邊界">
        <h2>方法是觀察工具，不是交易指令</h2>
        <p>
          本頁說明燈號、風險與資料品質如何整理成可閱讀的市場狀態。內容用來協助使用者理解市場氣氛，
          不提供買賣建議、不提供個股買賣建議，也不保證任何投資結果。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <TrustRuntimeBoundaryNotice context="methodology" />
      <RouteLocalTrustCopyPanel context="methodology" />

      <section className="method-quick-read" aria-label="方法快速閱讀">
        <article>
          <span>30 秒</span>
          <strong>先看市場氣氛</strong>
          <p>綠色代表偏穩定，黃色代表需要觀察，紅色代表風險升溫或資料限制較高。</p>
        </article>
        <article>
          <span>3 分鐘</span>
          <strong>再看成因與資料狀態</strong>
          <p>每個警示都應搭配成因、更新時間、影響級別與下一步建議，不只看單一分數。</p>
        </article>
        <article>
          <span>升級條件</span>
          <strong>正式資料必須先通過驗證</strong>
          <p>正式資料啟用前，需要確認來源可用條件、欄位契約、覆蓋率與錯誤回退流程。</p>
        </article>
      </section>

      <section className="panel method-section">
        <h2>指標架構</h2>
        <div className="method-table" role="table" aria-label="指標架構">
          <div className="method-row method-head" role="row">
            <span>模組</span>
            <span>權重</span>
            <span>觀察內容</span>
            <span>使用者價值</span>
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
          <h2>不提供個別建議</h2>
          <p>分數用於整理資訊，不代表買進、賣出、持有或適合度判斷。</p>
        </article>
        <article>
          <h2>不宣稱即時完整</h2>
          <p>正式市場資料尚未啟用前，所有頁面都會以示範資料說明使用體驗。</p>
        </article>
        <article>
          <h2>不製造恐慌</h2>
          <p>風險提示必須搭配條件與背景，避免只用單一閾值製造誤解。</p>
        </article>
      </section>

      <section className="panel method-links">
        <h2>下一步閱讀</h2>
        <TrustTextLink href="/" label="回到首頁" />
        <TrustTextLink href="/briefing" label="閱讀市場晨報" />
        <TrustTextLink href="/weekly" label="閱讀週報" />
        <TrustTextLink href="/disclaimer" label="查看風險聲明" />
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
