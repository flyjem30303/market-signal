import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { MarketWatchlistPanel } from "@/components/market-watchlist-panel";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalRuntime } from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";
import { buildStockExplanation, type ExplanationItem } from "@/lib/stock-explanation-engine";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "市場週報",
  description: "整理本週市場燈號、相對強勢標的、風險觀察與後續追蹤重點。"
};

export default async function WeeklyPage() {
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime();
  const freshness = await getDataFreshnessSnapshot();
  const marketSeries = repository.getSeries("TWII");
  const snapshots = repository
    .getAssets()
    .map((asset) => repository.getSeries(asset.symbol).at(-1))
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshots[0];
  const topRisk = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore)[0] ?? market;
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 3);
  const watchlistSnapshots = buildPublicWatchlistSnapshots(snapshots, [market, topRisk, ...strongest]);
  const weeklyChange = buildWeeklyChangeSummary(marketSeries);
  const explanation = buildStockExplanation(market, { seriesLength: marketSeries.length });
  const positives = explanation.positives.slice(0, 3);
  const negatives = explanation.negatives.slice(0, 3);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="weekly_page_viewed" payload={{ page: "weekly" }} />

      <section className="hero weekly-hero">
        <p className="eyebrow">市場週報</p>
        <h1>回看這週市場分數、風險與燈號變化</h1>
        <p>{weeklyChange.summary}</p>
        <p className="runtime-boundary-line">週報用來整理市場資訊與風險變化，不提供個股買賣建議。</p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="weekly-change-board" aria-label="本週市場變化">
        <div className="weekly-change-board__intro">
          <p className="eyebrow">本週市場摘要</p>
          <h2>{weeklyChange.title}</h2>
          <p>{weeklyChange.detail}</p>
        </div>
        <article>
          <span>綜合分數</span>
          <strong>{weeklyChange.composite}</strong>
          <p>{weeklyChange.compositeNote}</p>
        </article>
        <article>
          <span>風險分數</span>
          <strong>{weeklyChange.risk}</strong>
          <p>{weeklyChange.riskNote}</p>
        </article>
        <article>
          <span>市場燈號</span>
          <strong>{weeklyChange.signal}</strong>
          <p>{weeklyChange.signalNote}</p>
        </article>
      </section>

      <section className="weekly-factor-grid" aria-label="本週支撐與拖累">
        <WeeklyFactorCard title="本週主要支撐" tone="positive" items={positives} />
        <WeeklyFactorCard title="本週主要拖累" tone="negative" items={negatives} />
      </section>

      <section className="weekly-grid" aria-label="本週觀察標的">
        <article className="panel panel-intro weekly-panel-intro">
          <p className="eyebrow">本週相對強勢標的</p>
          <h2>先看分數較強、風險仍需確認的標的</h2>
          <p>這些標的依目前綜合分數排序，只作為觀察清單，不代表買賣建議。</p>
        </article>
        {strongest.map((snapshot) => {
          const stockExplanation = buildStockExplanation(snapshot, { seriesLength: repository.getSeries(snapshot.asset.symbol).length });
          return (
            <article className="panel weekly-stock-card" key={snapshot.asset.symbol}>
              <p className="eyebrow">{snapshot.asset.symbol}</p>
              <h2>{snapshot.asset.name}</h2>
              <p>
                {snapshot.signal.title}，綜合 {snapshot.compositeScore}/100，風險 {snapshot.riskScore}/100。
              </p>
              <p>主要原因：{stockExplanation.positives[0]?.text ?? "目前分數仍有支撐，但需要持續確認資料更新。"}</p>
              <TrackedLink
                className="text-link"
                eventName="weekly_link_clicked"
                href={`/stocks/${snapshot.asset.symbol}`}
                label={`查看 ${snapshot.asset.symbol}`}
                payload={{ symbol: snapshot.asset.symbol }}
              >
                查看標的
              </TrackedLink>
            </article>
          );
        })}
      </section>

      <section className="panel weekly-next-watch" aria-label="下週觀察重點">
        <p className="eyebrow">下週觀察重點</p>
        <h2>先確認拖累因素是否改善，再看風險是否擴散</h2>
        <p>
          下週先看「{buildWatchLabel(negatives[0])}」是否改善，再確認「{buildWatchLabel(positives[0])}」能否延續。若風險分數續升，閱讀順序應先轉向風險標的與資料日期。
        </p>
        <div className="briefing-actions">
          <TrackedLink eventName="weekly_link_clicked" href="/briefing" label="查看市場快報" payload={{ area: "weekly_next" }}>
            查看市場快報
          </TrackedLink>
          <TrackedLink
            eventName="weekly_link_clicked"
            href={`/stocks/${topRisk.asset.symbol}`}
            label="查看需要留意標的"
            payload={{ area: "weekly_next", symbol: topRisk.asset.symbol }}
          >
            查看需要留意標的
          </TrackedLink>
        </div>
      </section>

      <MarketWatchlistPanel
        description="週報先看市場變化；若要補查單一標的，再用搜尋建立追蹤清單。"
        eyebrow="延伸查詢"
        heading="想查其他標的"
        snapshots={watchlistSnapshots}
      />

      <PublicNextReadingFlow context="weekly" stockSymbol={market.asset.symbol} />
    </main>
  );
}

function WeeklyFactorCard({
  items,
  title,
  tone
}: {
  items: ExplanationItem[];
  title: string;
  tone: "positive" | "negative";
}) {
  return (
    <article className={`panel weekly-factor-card weekly-factor-card--${tone}`}>
      <p className="eyebrow">{title}</p>
      <ul>
        {items.map((item) => (
          <li key={item.evidence.map((entry) => entry.ruleId).join("-")}>{item.text}</li>
        ))}
      </ul>
    </article>
  );
}

function buildWeeklyChangeSummary(series: SignalSnapshot[]) {
  const latest = series.at(-1);
  const previous = series.length >= 6 ? series.at(-6) : series.at(-2);

  if (!latest || !previous) {
    return {
      composite: "資料累積中",
      compositeNote: "目前還不足以比較週變化。",
      detail: "目前歷史資料點不足，週報先以最新市場狀態與主要因素作為閱讀順序。",
      risk: "資料累積中",
      riskNote: "待更多資料後再呈現風險變化。",
      signal: "資料累積中",
      signalNote: "待更多資料後再呈現燈號轉變。",
      summary: "歷史資料仍在累積，週報暫以最新市場狀態作為回看基準。",
      title: "週變化資料仍在累積"
    };
  }

  const compositeDelta = latest.compositeScore - previous.compositeScore;
  const riskDelta = latest.riskScore - previous.riskScore;
  const signalChanged = previous.signal.title !== latest.signal.title;

  return {
    composite: formatWeeklyDelta(previous.compositeScore, latest.compositeScore, compositeDelta),
    compositeNote: describeScoreMove("綜合分數", compositeDelta),
    detail: `比較 ${previous.date} 到 ${latest.date}，綜合分數${describeMove(compositeDelta)}，風險分數${describeMove(riskDelta)}。`,
    risk: formatWeeklyDelta(previous.riskScore, latest.riskScore, riskDelta),
    riskNote: describeScoreMove("風險分數", riskDelta),
    signal: signalChanged ? `${previous.signal.title} → ${latest.signal.title}` : `${latest.signal.title}（未變）`,
    signalNote: signalChanged ? "本週燈號有轉變，優先看拖累因素是否擴散。" : "本週燈號未變，先看分數改善能否延續。",
    summary: buildWeeklySummary(compositeDelta, riskDelta, signalChanged),
    title: `本週回看：${previous.date} → ${latest.date}`
  };
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

function formatWeeklyDelta(previous: number, current: number, delta: number) {
  const sign = delta > 0 ? "+" : "";
  return `${previous} → ${current} (${sign}${delta})`;
}

function describeMove(delta: number) {
  if (delta > 0) return `上升 ${delta} 分`;
  if (delta < 0) return `下降 ${Math.abs(delta)} 分`;
  return "持平";
}

function describeScoreMove(label: string, delta: number) {
  if (label === "風險分數") {
    if (delta > 0) return `+${delta}，風險升高`;
    if (delta < 0) return `${delta}，風險下降`;
    return "0，風險持平";
  }
  if (delta > 0) return `+${delta}，本週改善`;
  if (delta < 0) return `${delta}，本週轉弱`;
  return "0，本週持平";
}

function buildWeeklySummary(compositeDelta: number, riskDelta: number, signalChanged: boolean) {
  if (compositeDelta < 0 && riskDelta > 0) {
    return "本週市場分數轉弱、風險升高，週報重點是確認拖累因素是否擴散。";
  }
  if (compositeDelta < 0) {
    return "本週市場分數回落，但風險未同步明顯升高，重點是觀察動能能否止跌。";
  }
  if (riskDelta > 0) {
    return "本週市場風險升高，雖然分數未必同步轉弱，但需要提高風險觀察優先度。";
  }
  if (signalChanged) {
    return "本週市場燈號出現轉變，閱讀重點是找出分數變化背後的支撐與拖累因素。";
  }
  return "本週市場變化相對溫和，重點是確認支撐因素是否延續到下一次更新。";
}

function buildWatchLabel(item: ExplanationItem | undefined) {
  if (!item) return "主要分數變化";
  return item.text.replace(/[。.]$/, "");
}
