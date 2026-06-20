import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { MarketWatchlistPanel } from "@/components/market-watchlist-panel";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalRuntime } from "@/lib/repositories/market-signal-repository";
import { buildStockExplanation, type ExplanationItem } from "@/lib/stock-explanation-engine";
import type { SignalSnapshot } from "@/lib/signal-model";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "市場快報",
  description: "以台股市場燈號、風險分數、資料日期與引用來源整理目前市場狀態。"
};

const fallbackSnapshotDate = "2026-05-28";

export default async function BriefingPage() {
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime();
  const freshness = await getDataFreshnessSnapshot();
  const marketSeries = repository.getSeries("TWII");
  const snapshotDate = marketSeries.at(-1)?.date ?? fallbackSnapshotDate;
  const snapshots = repository
    .getAssets()
    .map((asset) => repository.getSnapshot(asset.symbol, snapshotDate) ?? repository.getSeries(asset.symbol).at(-1))
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));

  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshots[0];
  const topRisk = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore)[0] ?? market;
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const breadth = buildMarketBreadth(snapshots);
  const explanation = buildStockExplanation(market, { seriesLength: marketSeries.length });
  const marketChange = buildMarketChangeSummary(marketSeries);
  const positives = explanation.positives.slice(0, 2);
  const negatives = explanation.negatives.slice(0, 2);
  const watchlistSnapshots = buildPublicWatchlistSnapshots(snapshots, [market, topRisk, ...strongest]);
  const sourceLabel =
    marketSignalSourceStatus.resolvedSource === "supabase"
      ? freshness.sourceName && freshness.sourceName !== "正式資料" && !freshness.sourceName.toLowerCase().includes("supabase")
        ? freshness.sourceName
        : "TWSE OpenAPI"
      : "示範資料";

  return (
    <main className="page-shell">
      <PageViewTracker eventName="briefing_page_viewed" payload={{ page: "briefing" }} />

      <section className="hero briefing-public-summary" aria-label="市場快報">
        <p className="eyebrow">市場快報</p>
        <h1>把市場燈號拆成原因、風險與下一步觀察</h1>
        <p>
          本頁整理台股市場燈號、風險分數、強弱排行與資料邊界。它適合用來建立今天的觀察順序，不提供個股買賣建議。
        </p>
        <p>
          {buildBriefingMarketDiagnosis(market)}
        </p>
        <p className="runtime-boundary-line">
          引用來源：{sourceLabel}；燈號分數為模型計算結果。請搭配更新日期、方法說明與風險提示判讀。
        </p>
      </section>

      <DataFreshnessStrip
        fallbackAsOfDate={market.date}
        freshness={freshness}
        marketSignalSourceStatus={marketSignalSourceStatus}
      />

      <section className="briefing-executive-summary" aria-label="今日快報摘要">
        <div>
          <p className="eyebrow">今日快報摘要</p>
          <h2>
            {market.asset.name}: {explanation.scoreLevel}，綜合分數 {market.compositeScore}/100
          </h2>
          <p>{explanation.summary.text}</p>
        </div>
        <aside>
          <span>
            <b>綜合分數</b>
            <strong>{market.compositeScore}/100</strong>
          </span>
          <span>
            <b>風險分數</b>
            <strong>{market.riskScore}/100</strong>
          </span>
          <span>
            <b>判讀信心</b>
            <strong>{explanation.confidence.score}%</strong>
          </span>
        </aside>
      </section>

      <section className="briefing-cause-grid" aria-label="市場支撐與拖累">
        <BriefingFactorCard title="主要支撐" tone="positive" items={positives} />
        <BriefingFactorCard title="主要拖累" tone="negative" items={negatives} />
      </section>

      <section className="panel briefing-signal-change" aria-label="市場訊號變化">
        <div>
          <p className="eyebrow">市場訊號變化</p>
          <h2>{marketChange.title}</h2>
          <p>{marketChange.text}</p>
        </div>
        <div className="briefing-change-metrics">
          <span>
            <b>綜合分數</b>
            {marketChange.composite}
          </span>
          <span>
            <b>風險分數</b>
            {marketChange.risk}
          </span>
          <span>
            <b>資料點</b>
            {marketSeries.length} 筆
          </span>
        </div>
      </section>

      <MarketWatchlistPanel snapshots={watchlistSnapshots} />

      <section className="briefing-grid" aria-label="市場觀察">
        <article className="panel">
          <p className="eyebrow">市場廣度</p>
          <h2>
            分數偏強 {breadth.constructiveCount} 檔，風險偏高 {breadth.defensiveCount} 檔
          </h2>
          <p>市場不是只看大盤漲跌。若強勢標的增加但風險也同步升高，代表需要更細緻地檢查追蹤清單。</p>
        </article>

        <article className="panel">
          <p className="eyebrow">需要留意</p>
          <h2>{topRisk.asset.name}</h2>
          <p>
            目前需要優先留意的是 {topRisk.asset.name}，風險分數 {topRisk.riskScore}/100。請優先確認資料日期與自身承受度。
          </p>
        </article>
      </section>

      <section className="panel" aria-label="強勢標的">
        <div className="section-heading">
          <p className="eyebrow">強勢標的</p>
          <h2>目前市場相對強勢標的</h2>
        </div>
        <div className="signal-list">
          {strongest.map((item) => (
            <article className="signal-row" key={item.asset.symbol}>
              <div>
                <strong>{item.asset.name}</strong>
                <span>{item.asset.symbol}</span>
              </div>
              <p>
                {item.signal.title}，綜合 {item.compositeScore}/100，風險 {item.riskScore}/100。
              </p>
              <TrackedLink
                className="text-link"
                eventName="briefing_link_clicked"
                href={`/stocks/${item.asset.symbol}`}
                label={`查看 ${item.asset.symbol}`}
                payload={{ symbol: item.asset.symbol }}
              >
                查看標的
              </TrackedLink>
            </article>
          ))}
        </div>
      </section>

      <section className="panel" aria-label="下一步閱讀">
        <p className="eyebrow">下一步閱讀</p>
        <h2>把市場快報轉成可檢查的標的清單</h2>
        <p>先看支撐與拖累因素，再比對強弱排行與需要留意的標的。若要追蹤單一標的，請進入標的頁查看分數、資料日期與風險提示。</p>
        <div className="briefing-actions">
          <TrackedLink eventName="briefing_link_clicked" href="/" label="回到市場總覽" payload={{ area: "briefing_next" }}>
            回到市場總覽
          </TrackedLink>
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${topRisk.asset.symbol}`}
            label="查看需要留意標的"
            payload={{ area: "briefing_next", symbol: topRisk.asset.symbol }}
          >
            查看需要留意標的
          </TrackedLink>
        </div>
      </section>

      <PublicNextReadingFlow context="briefing" stockSymbol={market.asset.symbol} />
    </main>
  );
}

function BriefingFactorCard({
  items,
  title,
  tone
}: {
  items: ExplanationItem[];
  title: string;
  tone: "positive" | "negative";
}) {
  return (
    <article className={`panel briefing-factor-card briefing-factor-card--${tone}`}>
      <p className="eyebrow">{title}</p>
      <ul>
        {items.map((item) => (
          <li key={item.evidence.map((entry) => entry.ruleId).join("-")}>{item.text}</li>
        ))}
      </ul>
    </article>
  );
}

function buildMarketBreadth(snapshots: SignalSnapshot[]) {
  return snapshots.reduce(
    (summary, snapshot) => {
      if (snapshot.compositeScore >= 70) summary.constructiveCount += 1;
      if (snapshot.riskScore >= 55) summary.defensiveCount += 1;
      return summary;
    },
    { constructiveCount: 0, defensiveCount: 0 }
  );
}

function buildPublicWatchlistSnapshots(snapshots: SignalSnapshot[], priority: SignalSnapshot[]) {
  const prioritySymbols = new Set(["TWII", "0050", "006208", "2330", "2308", "2382"]);
  for (const snapshot of priority) prioritySymbols.add(snapshot.asset.symbol);

  return snapshots
    .filter((snapshot) => prioritySymbols.has(snapshot.asset.symbol))
    .sort((a, b) => {
      const priorityDelta = Number(prioritySymbols.has(b.asset.symbol)) - Number(prioritySymbols.has(a.asset.symbol));
      return priorityDelta || b.compositeScore - a.compositeScore;
    })
    .slice(0, 12);
}

function buildBriefingMarketDiagnosis(market: SignalSnapshot) {
  if (market.compositeScore < 60 && market.riskScore < 45) {
    return "市場偏弱但風險尚未擴散，本頁聚焦哪些因子正在支撐或拖累分數。";
  }
  if (market.compositeScore >= 65 && market.riskScore < 45) {
    return "市場維持偏強且風險尚未明顯升高，本頁聚焦強勢能否延續。";
  }
  if (market.riskScore >= 60) {
    return "市場風險升高，本頁優先拆解風險來源與需要留意的標的。";
  }
  return "市場處於觀察區間，本頁聚焦分數來源、近期變化與可追蹤標的。";
}

function buildMarketChangeSummary(series: SignalSnapshot[]) {
  const latest = series.at(-1);
  const previous = series.at(-2);

  if (!latest || !previous) {
    return {
      composite: "資料累積中",
      risk: "資料累積中",
      text: "目前歷史資料點不足，先以今日分數、支撐與拖累因素作為主要閱讀順序。",
      title: "近期資料仍在累積"
    };
  }

  const compositeDelta = latest.compositeScore - previous.compositeScore;
  const riskDelta = latest.riskScore - previous.riskScore;

  return {
    composite: formatDelta(previous.compositeScore, latest.compositeScore, compositeDelta),
    risk: formatDelta(previous.riskScore, latest.riskScore, riskDelta),
    text: `相較前一筆資料，綜合分數${formatChangeText(compositeDelta)}，風險分數${formatChangeText(riskDelta)}。`,
    title: `最近一筆變化：${previous.date} → ${latest.date}`
  };
}

function formatDelta(previous: number, current: number, delta: number) {
  const sign = delta > 0 ? "+" : "";
  return `${previous} → ${current} (${sign}${delta})`;
}

function formatChangeText(delta: number) {
  if (delta > 0) return `上升 ${delta} 分`;
  if (delta < 0) return `下降 ${Math.abs(delta)} 分`;
  return "持平";
}
