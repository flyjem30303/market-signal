import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

export const metadata: Metadata = {
  title: "方法說明",
  description:
    "指數燈號公開 Beta 方法說明，解釋示範評分、資料限制、指標組成、品質等級與非投資建議邊界。"
};

const methodModules = [
  ["趨勢位置", "18%", "觀察價格與均線位置，協助判斷目前偏強、偏弱或盤整。", "示範階段只做狀態整理，不預測短線漲跌。"],
  ["量能變化", "18%", "觀察成交量是否支持價格變動，避免只看價格而忽略參與度。", "量能異常需要搭配事件與流動性判斷。"],
  ["波動風險", "16%", "觀察近期波動與回撤壓力，協助提醒追價或過度集中風險。", "高分不代表低風險，低分也不等於必然下跌。"],
  ["產業與市場脈絡", "14%", "把個股或 ETF 放回市場、類股與指數環境中閱讀。", "目前仍以示範資料呈現，正式資料覆蓋後才會擴大。"],
  ["資料品質", "16%", "標示資料是否完整、新鮮、可追溯，避免把缺口誤讀為訊號。", "資料不足時應降低解讀強度。"],
  ["使用情境", "18%", "把分數轉成觀察、等待、風險提醒等輔助語言。", "不產生買進、賣出或持有指令。"]
];

const qualityLevels = [
  ["A", "資料較完整，示範評分可作為較高信心的閱讀起點，但仍需自行查證。"],
  ["B", "資料大致可讀，仍有部分限制或延遲，需要搭配其他來源確認。"],
  ["C", "資料或覆蓋率不足，適合觀察方向，不適合作為主要判斷依據。"],
  ["D", "資料缺口明顯，頁面只保留基本說明，不應解讀成有效訊號。"]
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
          指數燈號公開 Beta 先用示範資料與示範評分呈現產品邏輯。這頁說明分數如何被拆解、
          目前有哪些限制，以及使用者應該如何把燈號當成研究起點，而不是交易指令。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <TrustRuntimeBoundaryNotice context="methodology" />
      <RouteLocalTrustCopyPanel context="methodology" />

      <section className="method-quick-read" aria-label="方法快速閱讀">
        <article>
          <span>目前定位</span>
          <strong>示範評分，正式資料尚未啟用</strong>
          <p>頁面先展示資訊架構與閱讀方式。正式市場資料、覆蓋率與來源權利完成前，分數不應被視為正式訊號。</p>
        </article>
        <article>
          <span>閱讀方式</span>
          <strong>看狀態，不看單點答案</strong>
          <p>分數應搭配趨勢、量能、波動、資料品質與市場脈絡一起看，避免用單一數字做決策。</p>
        </article>
        <article>
          <span>使用邊界</span>
          <strong>非投資建議</strong>
          <p>本網站不提供買進、賣出或持有建議，也不保證任何報酬、勝率或避險效果。</p>
        </article>
      </section>

      <section className="method-application-bridge" aria-label="方法使用入口">
        <div>
          <p className="eyebrow">Apply The Method</p>
          <h2>從總覽到單一標的，逐層閱讀</h2>
          <p>建議先看市場總覽，再看週報與單一標的頁。每一層都應同時留意資料狀態與風險揭露。</p>
        </div>
        <nav>
          <MethodBridgeLink href="/briefing" label="市場總覽" title="先看大盤狀態" text="掌握目前市場溫度、資料限制與主要觀察方向。" />
          <MethodBridgeLink href="/weekly" label="週報" title="再看中期節奏" text="把短期波動放進一週尺度，降低單日雜訊。" />
          <MethodBridgeLink href="/stocks/TWII" label="台股指數" title="檢查指數脈絡" text="用指數頁理解市場背景，再回到個股或 ETF。" />
          <MethodBridgeLink href="/stocks/2330" label="個股頁" title="最後看標的細節" text="閱讀趨勢、風險與資料品質，不把分數當成交易指令。" />
        </nav>
      </section>

      <section className="method-runtime-map" aria-label="資料狀態轉換說明">
        <div>
          <p className="eyebrow">Data State</p>
          <h2>從示範資料到正式資料，需要逐步通過</h2>
          <p>
            正式資料啟用前，必須確認資料來源權利、欄位定義、覆蓋率、更新流程、回復方式與公開揭露。
            通過前，公開頁面會維持示範資料說明。
          </p>
        </div>
        <article>
          <span>第一步</span>
          <strong>確認來源與權利</strong>
          <p>先確認資料可以合法使用、保存、轉換與公開呈現。</p>
        </article>
        <article>
          <span>第二步</span>
          <strong>確認覆蓋與品質</strong>
          <p>再確認台股、指數與 ETF 的資料覆蓋率、更新頻率與缺口處理。</p>
        </article>
        <article>
          <span>第三步</span>
          <strong>公開標示資料狀態</strong>
          <p>正式切換前，頁面必須清楚告知使用者資料是否為示範、延遲、部分覆蓋或正式來源。</p>
        </article>
      </section>

      <section className="panel method-section">
        <h2>指標組成</h2>
        <div className="method-table" role="table" aria-label="指標組成">
          <div className="method-row method-head" role="row">
            <span>模組</span>
            <span>權重</span>
            <span>觀察內容</span>
            <span>限制提醒</span>
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

      <article className="disclaimer">
        <h2>方法限制</h2>
        <p>
          分數只是整理資訊的一種方式，不代表未來價格、個人適合度或交易建議。使用者應搭配自身目標、
          風險承受度、資金規劃與其他資料來源自行判斷。
        </p>
      </article>

      <section className="method-guardrail-grid" aria-label="方法護欄">
        <article>
          <h2>不把缺資料當訊號</h2>
          <p>資料不足時，頁面應降低信心或明確提醒，而不是硬做結論。</p>
        </article>
        <article>
          <h2>不把分數當指令</h2>
          <p>分數只協助排序與提醒，不能替代使用者自己的投資判斷。</p>
        </article>
        <article>
          <h2>不隱藏資料狀態</h2>
          <p>示範、延遲、部分覆蓋或正式資料，都必須用使用者能理解的文字標示。</p>
        </article>
      </section>

      <section className="panel method-links">
        <h2>繼續閱讀</h2>
        <TrustTextLink href="/" label="回到首頁" />
        <TrustTextLink href="/briefing" label="市場總覽" />
        <TrustTextLink href="/weekly" label="週報" />
        <TrustTextLink href="/disclaimer" label="免責聲明" />
        <TrustTextLink href="/terms" label="使用條款" />
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
