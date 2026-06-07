import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

export const metadata: Metadata = {
  title: "方法論",
  description:
    "Methodology for 指數燈號公開 Beta，說明 mock scores、資料新鮮度、模型限制、分數來源與 promotion gate 之前的使用邊界。"
};

const modules = [
  ["市場趨勢", "18%", "指數方向、週期位置、風險溫度", "判斷大盤環境是否支持積極曝險。"],
  ["產業動能", "18%", "族群強弱、半導體與 ETF 分組", "比較同類資產的相對強弱。"],
  ["評價與品質", "16%", "估值、獲利穩定度、基本面風險", "避免只看短線漲跌。"],
  ["資金與籌碼", "14%", "成交量、法人與市場情緒", "觀察買盤是否持續。"],
  ["風險控制", "16%", "波動、回檔、集中度與資料缺口", "讓高分也能被風險拉回。"],
  ["總體環境", "18%", "利率、匯率、美元、波動率與國際市場", "提醒外部壓力是否升高。"]
];

const qualityLevels = [
  ["A", "資料來源、覆蓋率與更新流程清楚，可支持較高信任度的摘要。"],
  ["B", "主要資料可用，但仍有部分欄位、頻率或來源權利需要補強。"],
  ["C", "只能作為方向參考，使用時必須搭配人工檢查與其他來源。"],
  ["D", "資料不足或尚未通過 gate，不應用於公開真實分數。"]
];

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">Methodology</p>
        <h1>方法論</h1>
        <p>
          Methodology: 指數燈號把市場趨勢、產業動能、評價品質、資金籌碼、風險控制與總體環境整理成可閱讀的 mock scores。
          目前分數仍是 Beta 示範狀態，不代表正式市場資料、完整覆蓋或個人化投資建議。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <TrustRuntimeBoundaryNotice context="methodology" />
      <RouteLocalTrustCopyPanel context="methodology" />

      <section className="method-quick-read" aria-label="方法論快速閱讀">
        <article>
          <span>目前用途</span>
          <strong>決策輔助，不是交易指令</strong>
          <p>分數用來整理市場訊號，協助使用者知道要看哪裡；它不是買進、賣出或持有建議。</p>
        </article>
        <article>
          <span>資料來源</span>
          <strong>{freshness.scoreSourceLabel}</strong>
          <p>資料新鮮度會以 metadata 呈現。若來源、時間或覆蓋不足，頁面必須維持 mock/real 邊界清楚。</p>
        </article>
        <article>
          <span>升級條件</span>
          <strong>promotion gate 後才可切 real</strong>
          <p>publicDataSource 與 scoreSource 必須通過資料權利、coverage、readonly、ingestion 與模型審核後才能升級。</p>
        </article>
      </section>

      <section className="method-application-bridge" aria-label="方法論閱讀入口">
        <div>
          <p className="eyebrow">Apply The Method</p>
          <h2>從總覽到個股逐層閱讀</h2>
          <p>先看市場總覽，再進入週報與個股頁，最後檢查資料邊界與風險揭露。</p>
        </div>
        <nav>
          <MethodBridgeLink href="/briefing" label="市場簡報" title="看整體狀態" text="先確認市場方向、資料覆蓋與目前仍待補齊的 gate。" />
          <MethodBridgeLink href="/weekly" label="週報" title="看每週節奏" text="用週報比較指數、ETF 與主要族群的相對狀態。" />
          <MethodBridgeLink href="/stocks/TWII" label="指數頁" title="看大盤環境" text="用 TWII 頁面理解大盤燈號、資料新鮮度與 mock 邊界。" />
          <MethodBridgeLink href="/stocks/2330" label="個股頁" title="看單一標的" text="用個股頁檢查分數來源、風險提示與後續閱讀路徑。" />
        </nav>
      </section>

      <section className="method-runtime-map" aria-label="方法論 runtime 地圖">
        <div>
          <p className="eyebrow">Runtime Map</p>
          <h2>分數如何從 mock 走向 real</h2>
          <p>目前 runtime 以安全可讀為主。正式資料與正式分數必須經過多個 gate，而不是只靠單次資料寫入。</p>
        </div>
        <article>
          <span>第一步</span>
          <strong>資料權利確認</strong>
          <p>確認資料來源、欄位授權、再散布限制與可保留的 attribution。</p>
        </article>
        <article>
          <span>第二步</span>
          <strong>覆蓋率與品質</strong>
          <p>檢查股票、指數、ETF 的覆蓋率、缺漏、更新頻率與異常值處理。</p>
        </article>
        <article>
          <span>第三步</span>
          <strong>promotion gate</strong>
          <p>只有 gate 接受後，才允許 publicDataSource 或 scoreSource 從 mock 往 real 推進。</p>
        </article>
      </section>

      <section className="panel method-section">
        <h2>模型模組</h2>
        <div className="method-table" role="table" aria-label="模型模組">
          <div className="method-row method-head" role="row">
            <span>模組</span>
            <span>權重</span>
            <span>主要資料</span>
            <span>閱讀重點</span>
          </div>
          {modules.map(([name, weight, data, comment]) => (
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
        <h2>資料品質分級</h2>
        <div className="quality-grid">
          {qualityLevels.map(([level, text]) => (
            <article className="quality-card" key={level}>
              <strong>{level}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <article className="disclaimer">
        <h2>方法論限制</h2>
        <p>
          任何模型都會簡化現實。指數燈號的分數可能因資料延遲、覆蓋不足、權重設計或市場突發事件而失真。請把它當成研究輔助，
          不要把它當成保證報酬或個人化投資建議。
        </p>
      </article>

      <section className="method-guardrail-grid" aria-label="方法論防線">
        <article>
          <h2>不承諾即時</h2>
          <p>資料新鮮度會明示，未通過正式 gate 前不宣稱即時市場資料。</p>
        </article>
        <article>
          <h2>不承諾完整</h2>
          <p>覆蓋率仍在補齊，缺少指數或 ETF 證據時，頁面必須保留限制說明。</p>
        </article>
        <article>
          <h2>不承諾投資結果</h2>
          <p>分數、燈號與摘要不能保證報酬，也不能取代使用者的風險管理。</p>
        </article>
      </section>

      <section className="panel method-links">
        <h2>繼續閱讀</h2>
        <TrustTextLink href="/" label="回到首頁" />
        <TrustTextLink href="/briefing" label="查看市場簡報" />
        <TrustTextLink href="/weekly" label="查看週報" />
        <TrustTextLink href="/disclaimer" label="查看風險揭露" />
        <TrustTextLink href="/terms" label="查看使用條款" />
      </section>
    </main>
  );
}

function MethodBridgeLink({
  href,
  label,
  text,
  title
}: {
  href: string;
  label: string;
  text: string;
  title: string;
}) {
  return (
    <TrackedLink eventName="trust_link_clicked" href={href} label={title} payload={{ area: "methodology_application_bridge" }}>
      <span>{label}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </TrackedLink>
  );
}

function TrustTextLink({ href, label }: { href: string; label: string }) {
  return (
    <TrackedLink className="text-link" eventName="trust_link_clicked" href={href} label={label} payload={{ area: "methodology_next_links" }}>
      {label}
    </TrackedLink>
  );
}
