import type { Metadata } from "next";
import { CommercialSlot } from "@/components/commercial-slot";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { WeeklyRowCoverageStatus } from "@/components/weekly-row-coverage-status";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getHomeRuntimeActionSummary } from "@/lib/home-runtime-action-summary";
import { buildWeeklyMarketActionSummary } from "@/lib/weekly-market-action-summary";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "Weekly Report | Taiwan Market Signal",
  description:
    "A weekly public Beta report for Taiwan market signal reading. Current runtime remains mock-only with data freshness metadata, publicDataSource=mock, scoreSource=mock, and not investment advice."
};

export default async function WeeklyPage() {
  const repository = getMarketSignalRepository();
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();
  const snapshots = repository
    .getAssets()
    .map((asset) => repository.getSnapshot(asset.symbol, "2026-05-28"))
    .filter((snapshot): snapshot is NonNullable<typeof snapshot> => Boolean(snapshot));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshots[0];
  const topHealth = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 6);
  const riskHeating = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore).slice(0, 6);
  const etfs = snapshots.filter((item) => item.asset.group === "ETF").sort((a, b) => b.healthScore - a.healthScore);
  const aiSemis = snapshots
    .filter((item) => ["2330", "2454", "2317", "2308", "2382"].includes(item.asset.symbol))
    .sort((a, b) => b.healthScore - a.healthScore);
  const breadth = buildWeeklyBreadth(snapshots);
  const topRisk = riskHeating[0];
  const topEtf = etfs[0] ?? topHealth[0];
  const leadingAiSemi = aiSemis[0] ?? topHealth[0];
  const cadence = buildWeeklyRuntimeCadence(market, breadth, topRisk, topEtf);
  const actionSummary = getHomeRuntimeActionSummary();
  const marketActionSummary = buildWeeklyMarketActionSummary(market, topRisk, topEtf, breadth);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="weekly_page_viewed" payload={{ page: "weekly" }} />
      <section className="hero">
        <p className="eyebrow">Weekly Report</p>
        <h1>本週市場觀察</h1>
        <p>
          這份週報把台股大盤、ETF、AI 與半導體族群放在同一個閱讀順序中，幫助 Beta 使用者先判斷市場溫度、
          風險熱點與下一步應該查看的標的頁。
        </p>
        <p className="runtime-boundary-line">
          Weekly boundary: this page is a public Beta reading surface. It uses data freshness metadata and mock-only model output;
          the formal market-data source and formal score source have not been promoted, and this is not investment advice.
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <nav aria-label="Experience Flow" className="experience-flow-nav">
        <span>閱讀路徑</span>
        <TrackedLink eventName="weekly_link_clicked" href="/" label="回到市場總覽" payload={{ area: "experience_flow", target: "home" }}>
          市場總覽
        </TrackedLink>
        <TrackedLink eventName="weekly_link_clicked" href="/briefing" label="查看今日簡報" payload={{ area: "experience_flow", target: "briefing" }}>
          今日簡報
        </TrackedLink>
        <TrackedLink
          eventName="weekly_link_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看大盤頁"
          payload={{ area: "experience_flow", symbol: market.asset.symbol }}
        >
          大盤頁
        </TrackedLink>
      </nav>

      <TrustRuntimeBoundaryNotice context="weekly" />
      <RouteLocalTrustCopyPanel context="weekly" />

      <section className="weekly-market-action-summary" aria-label="Weekly market action summary">
        <div>
          <p className="eyebrow">Market Action Summary</p>
          <h2>{marketActionSummary.headline}</h2>
          <p>{marketActionSummary.weeklyLine}</p>
          <p>{marketActionSummary.stopLine}</p>
        </div>
        <TrackedLink
          className={marketActionSummary.primary.tone}
          eventName="weekly_link_clicked"
          href={marketActionSummary.primary.href}
          label={marketActionSummary.primary.title}
          payload={{ area: "weekly_market_action_primary", symbol: marketActionSummary.primary.symbol }}
        >
          <span>{marketActionSummary.primary.label}</span>
          <strong>{marketActionSummary.primary.title}</strong>
          <p>{marketActionSummary.primary.body}</p>
        </TrackedLink>
        <TrackedLink
          className={marketActionSummary.secondary.tone}
          eventName="weekly_link_clicked"
          href={marketActionSummary.secondary.href}
          label={marketActionSummary.secondary.title}
          payload={{ area: "weekly_market_action_secondary", symbol: marketActionSummary.secondary.symbol }}
        >
          <span>{marketActionSummary.secondary.label}</span>
          <strong>{marketActionSummary.secondary.title}</strong>
          <p>{marketActionSummary.secondary.body}</p>
        </TrackedLink>
      </section>

      <WeeklyRowCoverageStatus />

      <section className="weekly-runtime-action-summary" aria-label="Weekly runtime action summary">
        <div>
          <p className="eyebrow">Next Reading Step</p>
          <h2>本週仍以 mock runtime 做公開閱讀</h2>
          <p>
            週報目前用來說明閱讀流程與邊界，而不是宣告真實資料或真實分數已經上線。資料覆蓋、來源權利、
            ingestion 與 promotion gate 完成前，公開頁面都維持 mock-only，並保留 publicDataSource=mock 與 scoreSource=mock。
          </p>
        </div>
        <article className="active">
          <span>目前進度</span>
          <strong>{actionSummary.currentProgressPercent}%</strong>
          <p>{actionSummary.stage}</p>
        </article>
        <article className="readying">
          <span>下一步</span>
          <strong>{actionSummary.nextAction}</strong>
          <p>{actionSummary.nextLift}</p>
        </article>
        <article className="blocked">
          <span>不可越線</span>
          <strong>{actionSummary.blockedTransition}</strong>
          <p>{actionSummary.safetyStopLine}</p>
        </article>
      </section>

      <section className="weekly-quick-read" aria-label="Weekly quick read">
        <article>
          <span>市場廣度</span>
          <strong>{breadth.constructive} 檔偏正向</strong>
          <p>
            正向、觀望與防守標的的分布，提供本週市場溫度的第一層判讀，後續仍需搭配各標的頁的模組分數。
          </p>
        </article>
        <article>
          <span>風險熱點</span>
          <strong>{topRisk.asset.symbol} 風險 {topRisk.riskScore}</strong>
          <p>風險分數較高的標的會優先放入觀察清單，提醒使用者不要只看健康分數或題材熱度。</p>
        </article>
        <article>
          <span>資料狀態</span>
          <strong>{freshness.scoreSourceLabel}</strong>
          <p>
            data freshness metadata 只說明資料與模型狀態，不代表正式資料來源、完整覆蓋率或任何投資建議已被核准。
          </p>
        </article>
      </section>

      <section className="weekly-runtime-cadence" aria-label="Weekly cadence">
        <div>
          <p className="eyebrow">Weekly Cadence</p>
          <h2>建議的本週閱讀順序</h2>
          <p>
            先看大盤與廣度，再看 ETF 與風險熱點，最後回到 briefing 確認短期事件。這個順序讓 Beta 使用者理解系統，
            但不替代個人研究或專業判斷。
          </p>
        </div>
        {cadence.map((item) => (
          <TrackedLink
            className={item.tone}
            eventName="weekly_link_clicked"
            href={item.href}
            key={item.label}
            label={item.title}
            payload={{ area: "weekly_cadence", symbol: item.symbol }}
          >
            <span>{item.label}</span>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </TrackedLink>
        ))}
      </section>

      <section className="weekly-reading-bridge" aria-label="Weekly reading bridge">
        <div>
          <p className="eyebrow">Reading Bridge</p>
          <h2>從週報進入標的頁</h2>
          <p>
            週報只提供高層次導讀。真正的分數拆解、模組風險與資料品質狀態，仍應回到個別標的頁逐項檢查。
          </p>
        </div>
        <nav>
          <WeeklyBridgeLink
            href={`/stocks/${market.asset.symbol}`}
            label="大盤"
            title={`${market.asset.symbol} market signal`}
            text={`Composite ${market.compositeScore}/100. Use this page to check whether the weekly market tone is constructive or defensive.`}
          />
          <WeeklyBridgeLink
            href={`/stocks/${topEtf.asset.symbol}`}
            label="ETF"
            title={`${topEtf.asset.symbol} ETF signal`}
            text={`Health ${topEtf.healthScore}/100. Use this as the first ETF reference before comparing allocation candidates.`}
          />
          <WeeklyBridgeLink
            href={`/stocks/${leadingAiSemi.asset.symbol}`}
            label="AI / Semiconductor"
            title={`${leadingAiSemi.asset.symbol} sector signal`}
            text={`Health ${leadingAiSemi.healthScore}/100. Use this to inspect whether AI and semiconductor strength is broad or concentrated.`}
          />
          <WeeklyBridgeLink
            href={`/stocks/${topRisk.asset.symbol}`}
            label="Risk"
            title={`${topRisk.asset.symbol} risk signal`}
            text={`Risk ${topRisk.riskScore}/100. Use this to review whether the highest-risk candidate needs a defensive reading.`}
          />
        </nav>
      </section>

      <article className="panel weekly-article">
        <p className="eyebrow">Market Brief</p>
        <h2>本週判讀摘要</h2>
        <p>
          {market.asset.symbol} 的 composite score 為 {market.compositeScore}/100，signal state 為 {market.signal.title}。
          這個數字目前來自 mock runtime，適合用來驗證產品閱讀流程與資訊階層，不應被解讀為正式投資訊號。
        </p>
        <p>
          Beta 版週報的價值在於把市場、ETF、題材族群與風險清單放到同一個節奏中，讓使用者快速知道下一頁該看哪裡。
          在資料真實化完成前，所有結論都必須維持保守語氣，並保留來源、覆蓋率與模型限制。
        </p>
      </article>

      <section className="weekly-grid">
        <WeeklyRanking title="健康度排行" items={topHealth} description="依 composite score 排序，協助使用者先找到相對強勢的候選標的。" />
        <WeeklyRanking title="風險熱點排行" items={riskHeating} description="依 risk score 排序，提醒使用者先檢查可能過熱或需要防守閱讀的標的。" scoreKey="risk" />
      </section>

      <section className="panel">
        <p className="eyebrow">ETF Allocation</p>
        <h2>ETF 觀察清單</h2>
        <p>
          ETF 區塊目前用來示範使用者如何比較 ETF 候選標的。正式配置建議必須等 ETF 來源權利、覆蓋率、
          freshness 與 promotion gate 通過後才可提升語氣。
        </p>
        <div className="rank-list">
          {etfs.map((item) => (
            <TrackedLink
              className="rank-row"
              eventName="weekly_link_clicked"
              href={`/stocks/${item.asset.symbol}`}
              key={item.asset.id}
              label={`${item.asset.symbol} ETF`}
              payload={{ area: "etf_allocation", symbol: item.asset.symbol }}
            >
              <strong>{item.asset.symbol}</strong>
              <span>ETF candidate</span>
              <b>Health {item.healthScore}</b>
            </TrackedLink>
          ))}
        </div>
      </section>

      <section className="panel weekly-article">
        <p className="eyebrow">AI & Semiconductor</p>
        <h2>AI 與半導體觀察</h2>
        <p>
          AI 與半導體仍是 Beta 版的高關注族群。週報會列出相關 symbol，方便使用者進一步查看標的頁：
          {aiSemis.slice(0, 3).map((item) => ` ${item.asset.symbol}`).join(", ")}。目前只呈現閱讀輔助，不宣告正式買賣建議。
        </p>
      </section>

      <section className="panel weekly-article">
        <p className="eyebrow">Next Week Watchlist</p>
        <h2>下週觀察重點</h2>
        <p>
          下週優先觀察三件事：大盤 signal 是否轉弱、ETF 健康度是否維持、AI 與半導體風險是否升溫。
          若資料來源、覆蓋率或 freshness 狀態不足，頁面必須維持 mock-only 說明，而不是提高判斷語氣。
        </p>
      </section>

      <section className="panel weekly-links">
        <h2>繼續閱讀</h2>
        <TrackedLink className="text-link" eventName="weekly_link_clicked" href="/" label="市場總覽" payload={{ area: "next_steps" }}>
          市場總覽
        </TrackedLink>
        <TrackedLink className="text-link" eventName="weekly_link_clicked" href="/briefing" label="今日簡報" payload={{ area: "next_steps" }}>
          今日簡報
        </TrackedLink>
        <TrackedLink
          className="text-link"
          eventName="weekly_link_clicked"
          href="/stocks/TWII"
          label="大盤標的頁"
          payload={{ area: "next_steps", symbol: "TWII" }}
        >
          大盤標的頁
        </TrackedLink>
        <TrackedLink className="text-link" eventName="weekly_link_clicked" href="/methodology" label="方法論" payload={{ area: "next_steps" }}>
          方法論
        </TrackedLink>
        <TrackedLink className="text-link" eventName="weekly_link_clicked" href="/disclaimer" label="免責聲明" payload={{ area: "next_steps" }}>
          免責聲明
        </TrackedLink>
      </section>

      <article className="disclaimer">
        <h2>重要聲明</h2>
        <p>
          本週報為公開 Beta 的資訊整理與產品閱讀示範，不是投資建議、研究報告、招攬或保證收益。
          使用者應自行確認資料來源、資料延遲、模型限制與個人風險承受度。
        </p>
      </article>

      <CommercialSlot context="weekly" />
    </main>
  );
}

function WeeklyBridgeLink({
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
    <TrackedLink eventName="weekly_link_clicked" href={href} label={title} payload={{ area: "reading_bridge", symbol: href.split("/").pop() }}>
      <span>{label}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </TrackedLink>
  );
}

function buildWeeklyBreadth(snapshots: SignalSnapshot[]) {
  return snapshots.reduce(
    (summary, snapshot) => {
      if (snapshot.signal.key === "green" || snapshot.signal.key === "yellow") {
        summary.constructive += 1;
      } else if (snapshot.signal.key === "orange") {
        summary.watch += 1;
      } else {
        summary.defensive += 1;
      }

      return summary;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
}

function buildWeeklyRuntimeCadence(
  market: SignalSnapshot,
  breadth: ReturnType<typeof buildWeeklyBreadth>,
  topRisk: SignalSnapshot,
  topEtf: SignalSnapshot
) {
  const marketIsConstructive = market.signal.key === "green" || market.signal.key === "yellow";
  const breadthTone = breadth.defensive > breadth.constructive ? "hold" : "active";
  const riskTone = topRisk.riskScore >= 70 ? "blocked" : "hold";
  const etfTone = topEtf.riskScore >= 60 ? "hold" : "active";

  return [
    {
      href: `/stocks/${market.asset.symbol}`,
      label: "Market",
      symbol: market.asset.symbol,
      text: marketIsConstructive
        ? `${market.asset.symbol} is currently constructive in the mock model. Use it as the first weekly market context check.`
        : `${market.asset.symbol} is not clearly constructive in the mock model. Review breadth and risk before reading sector candidates.`,
      title: breadthTone === "active" ? "Market breadth supports a constructive read" : "Market breadth needs a defensive read",
      tone: breadthTone
    },
    {
      href: `/stocks/${topEtf.asset.symbol}`,
      label: "ETF",
      symbol: topEtf.asset.symbol,
      text: `${topEtf.asset.symbol} health ${topEtf.healthScore}/100. Compare ETF candidates only within the current mock boundary.`,
      title: etfTone === "active" ? "ETF candidate is readable" : "ETF candidate needs risk review",
      tone: etfTone
    },
    {
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "Risk",
      symbol: topRisk.asset.symbol,
      text: `${topRisk.asset.symbol} risk ${topRisk.riskScore}/100. Use this as the first stop for overheating or defensive checks.`,
      title: riskTone === "blocked" ? "Risk is elevated" : "Risk should stay on watch",
      tone: riskTone
    },
    {
      href: "/briefing",
      label: "Briefing",
      symbol: "briefing",
      text: "Read the briefing after the weekly report to connect this slower weekly view with shorter-term market context.",
      title: "Move from weekly context to briefing",
      tone: "active"
    }
  ];
}

function WeeklyRanking({
  title,
  description,
  items,
  scoreKey = "composite"
}: {
  title: string;
  description: string;
  items: SignalSnapshot[];
  scoreKey?: "composite" | "risk";
}) {
  return (
    <section className="panel">
      <p className="eyebrow">Ranking</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="rank-list">
        {items.map((item) => (
          <TrackedLink
            className="rank-row"
            eventName="weekly_link_clicked"
            href={`/stocks/${item.asset.symbol}`}
            key={item.asset.id}
            label={`${item.asset.symbol} signal`}
            payload={{ area: "ranking", symbol: item.asset.symbol }}
          >
            <strong>{item.asset.symbol}</strong>
            <span>{item.asset.group === "ETF" ? "ETF candidate" : "Stock candidate"}</span>
            <b>{scoreKey === "risk" ? `Risk ${item.riskScore}` : `Score ${item.compositeScore}`}</b>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
