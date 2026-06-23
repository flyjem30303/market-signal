import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { MarketWatchlistPanel } from "@/components/market-watchlist-panel";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { StockFollowButton } from "@/components/stock-follow-button";
import { StockQuoteInteractiveChart } from "@/components/stock-quote-interactive-chart";
import { TrackedLink } from "@/components/tracked-link";
import type { Asset } from "@/lib/assets";
import { buildMockDataFreshnessSnapshot, type DataFreshnessSnapshot } from "@/lib/data-freshness";
import { toMarketWatchlistItem, type MarketWatchlistItem } from "@/lib/market-watchlist-search";
import { buildStockExplanation, type ExplanationItem } from "@/lib/stock-explanation-engine";
import type { MarketSignalSourceStatus } from "@/lib/repositories/market-signal-source-status";
import { mockMarketSignalRepository } from "@/lib/repositories/mock-market-signal-repository";
import {
  createStaticMarketSignalRepository,
  type MarketSignalRepositoryData
} from "@/lib/repositories/static-market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";
import { buildQuoteViewModel } from "@/lib/stock-quote-view-model";

type DashboardShellProps = {
  freshnessSnapshot?: DataFreshnessSnapshot;
  initialSymbol: string;
  includeSeoContent?: boolean;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
  repositoryData?: MarketSignalRepositoryData;
  watchlistItems?: MarketWatchlistItem[];
};

const fallbackSnapshotDate = "2026-05-28";

export function DashboardShell({
  freshnessSnapshot,
  initialSymbol,
  includeSeoContent = false,
  marketSignalSourceStatus,
  repositoryData,
  watchlistItems
}: DashboardShellProps) {
  const repository = repositoryData ? createStaticMarketSignalRepository(repositoryData) : mockMarketSignalRepository;
  const freshness = freshnessSnapshot ?? buildMockDataFreshnessSnapshot();
  const assets = repository.getAssets();
  const activeSnapshotDate = repositoryData?.snapshotDate ?? fallbackSnapshotDate;
  const selected = repository.getAssetBySymbol(initialSymbol) ?? assets[0];
  const snapshot =
    repository.getSnapshot(selected.symbol, activeSnapshotDate) ??
    repository.getSeries(selected.symbol).at(-1) ??
    repository.getSnapshot(assets[0].symbol, activeSnapshotDate)!;
  const snapshots = assets
    .map((asset) => repository.getSnapshot(asset.symbol, activeSnapshotDate) ?? repository.getSeries(asset.symbol).at(-1))
    .filter((item): item is SignalSnapshot => Boolean(item));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshot;
  const searchItems = watchlistItems ?? snapshots.map(toMarketWatchlistItem);
  const isStockPage = includeSeoContent;
  const isOfficialRuntime = marketSignalSourceStatus?.resolvedSource === "supabase";
  const publicSourceLabel = formatPublicSourceLabel(freshness.sourceName, isOfficialRuntime);

  return (
    <main className="page-shell">
      <PageViewTracker
        eventName={isStockPage ? "stock_page_viewed" : "home_page_viewed"}
        payload={{ page: isStockPage ? "stock" : "home", symbol: selected.symbol }}
      />

      {!isStockPage && (
        <>
          <Hero market={market} publicSourceLabel={publicSourceLabel} selected={selected} snapshotDate={activeSnapshotDate} />
          <HomeFirstScreenDecisionSummary market={market} series={repository.getSeries(market.asset.symbol)} />
          <MarketWatchlistPanel items={searchItems} />
        </>
      )}

      {isStockPage && (
        <>
          <StockQuotePanel
            series={repository.getSeries(selected.symbol)}
            snapshot={snapshot}
            sourceLabel={publicSourceLabel}
          />
          <StockAtAGlance series={repository.getSeries(selected.symbol)} snapshot={snapshot} />
          <section className="stock-watchlist-top" aria-label="標的搜尋與追蹤入口">
            <MarketWatchlistPanel items={searchItems} variant="compact-stock" />
          </section>
        </>
      )}

      <DataFreshnessStrip
        fallbackAsOfDate={snapshot.date}
        freshness={freshness}
        marketSignalSourceStatus={marketSignalSourceStatus}
      />
      <PublicNextReadingFlow context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />

      <article className="disclaimer">
        <h2>風險提示</h2>
        <p>
          本站提供市場資訊整理、風險辨識與觀察順序，不提供個股買賣建議、保證報酬或個人化資產配置。請搭配資料日期、引用來源與自身風險承受度使用。
        </p>
      </article>
    </main>
  );
}

function Hero({
  market,
  publicSourceLabel,
  selected,
  snapshotDate
}: {
  market: SignalSnapshot;
  publicSourceLabel: string;
  selected: Asset;
  snapshotDate: string;
}) {
  return (
    <section className="hero dashboard-hero">
      <p className="eyebrow">公開市場 / 指數燈號</p>
      <h1>台股市場燈號與風險觀察</h1>
      <p>
        {market.asset.name} 目前為「{market.signal.title}」，綜合分數 {market.compositeScore}/100，風險分數{" "}
        {market.riskScore}/100。這裡把趨勢、動能、波動與資料品質放在同一個閱讀脈絡，協助你先判斷市場溫度，再進入標的細節。
      </p>
      <div className="hero-status-strip" aria-label="市場狀態摘要">
        <span>市場狀態：{market.signal.title}</span>
        <span>更新日期：{snapshotDate}</span>
        <span>引用來源：{publicSourceLabel}</span>
      </div>
      <div className="hero-cta-row" aria-label="主要操作">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場快報" payload={{ area: "hero" }}>
          查看市場快報
        </TrackedLink>
        <TrackedLink eventName="home_cta_clicked" href={`/stocks/${selected.symbol}`} label="查看標的觀察" payload={{ area: "hero" }}>
          查看標的觀察
        </TrackedLink>
      </div>
    </section>
  );
}

function HomeFirstScreenDecisionSummary({ market, series }: { market: SignalSnapshot; series: SignalSnapshot[] }) {
  const explanation = buildStockExplanation(market, { seriesLength: series.length });
  const marketDiagnosis = buildHomeMarketDiagnosis(market);
  const confidenceBrief = buildHomeConfidenceBrief(explanation);
  const recentScores = series.slice(-5);
  const positives = explanation.positives.slice(0, 2);
  const negatives = explanation.negatives.slice(0, 2);

  return (
    <section className="home-decision-summary" aria-label="今日市場重點">
      <p className="eyebrow">今日重點</p>
      <h2>
        {market.asset.name}: {explanation.scoreLevel}，綜合分數 {market.compositeScore}/100
      </h2>
      <p className="home-market-diagnosis">{marketDiagnosis}</p>
      <div className="home-insight-strip" aria-label="首頁市場洞察">
        <div className="home-insight-factor home-insight-factor--positive">
          <h3>主要加分</h3>
          <ul>
            {positives.map((item) => (
              <li key={item.evidence.map((entry) => entry.ruleId).join("-")}>{item.text}</li>
            ))}
          </ul>
        </div>
        <div className="home-insight-factor home-insight-factor--negative">
          <h3>主要拖累</h3>
          <ul>
            {negatives.map((item) => (
              <li key={item.evidence.map((entry) => entry.ruleId).join("-")}>{item.text}</li>
            ))}
          </ul>
        </div>
        <div className="home-score-trend" aria-label="最近市場分數">
          <h3>最近分數</h3>
          <div>
            {recentScores.map((item) => (
              <span key={`${item.asset.symbol}-${item.date}`}>
                <b>{item.compositeScore}</b>
                <small>{item.date.slice(5)}</small>
              </span>
            ))}
          </div>
        </div>
        <div className="home-confidence-mini" aria-label="首頁判讀信心">
          <span>判讀信心</span>
          <strong>{explanation.confidence.score}%</strong>
          <small>{confidenceBrief}</small>
        </div>
      </div>
      <div className="home-decision-grid">
        <article>
          <h3>先看燈號</h3>
          <p>用綜合分數快速掌握市場強弱，避免只看單一漲跌數字。</p>
        </article>
        <article>
          <h3>再看風險</h3>
          <p>同步檢查風險分數、資料品質與更新日期，確認訊號是否可靠。</p>
        </article>
        <article>
          <h3>最後看標的</h3>
          <p>把市場狀態帶入標的頁，檢查個別標的是否與大盤方向一致。</p>
        </article>
      </div>
      <div className="home-decision-actions">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場快報" payload={{ area: "summary" }}>
          查看市場快報
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看指數狀態"
          payload={{ area: "summary", symbol: market.asset.symbol }}
        >
          查看指數狀態
        </TrackedLink>
      </div>
    </section>
  );
}

function buildHomeMarketDiagnosis(market: SignalSnapshot) {
  if (market.compositeScore < 60 && market.riskScore < 45) {
    return "市場仍偏弱，但風險尚未擴散；目前更像動能降溫，而不是全面惡化。";
  }
  if (market.compositeScore >= 65 && market.riskScore < 45) {
    return "市場維持偏強，且風險尚未明顯升高；可先觀察強勢是否延續。";
  }
  if (market.riskScore >= 60) {
    return "市場風險升高，判讀上應優先確認波動與資料更新是否同步惡化。";
  }
  return "市場處於中性觀察區間，先看主要加分與拖累因素，再決定是否進入標的細節。";
}

function buildHomeConfidenceBrief(explanation: ReturnType<typeof buildStockExplanation>) {
  const { confidence } = explanation;
  const constraints = [
    confidence.missingInputs.length > 0 ? "缺漏因子" : null,
    confidence.staleInputs.length > 0 ? "資料延遲" : null,
    confidence.sampleDepth.includes("不足") ? "歷史樣本深度限制" : null
  ].filter(Boolean);

  if (constraints.length === 0) {
    return `資料完整度 ${confidence.dataQuality}/100，資料日期與更新狀態正常。`;
  }

  return `資料完整度 ${confidence.dataQuality}/100，信心主要受${constraints.join("、")}影響。`;
}

function StockAtAGlance({ series, snapshot }: { series: SignalSnapshot[]; snapshot: SignalSnapshot }) {
  const explanation = buildStockExplanation(snapshot, { seriesLength: series.length });

  return (
    <section className="stock-public-summary" aria-label="標的分數來源說明">
      <article className="panel stock-public-summary__wide stock-decision-summary">
        <p className="eyebrow">市場診斷</p>
        <h2>
          {snapshot.asset.name}: {explanation.scoreLevel}，綜合分數 {snapshot.compositeScore}/100
        </h2>
        <p>{explanation.summary.text}</p>
        <div className="stock-decision-facts" aria-label="判讀摘要">
          <span>
            <b>資料日期</b>
            {snapshot.date}
          </span>
          <span>
            <b>綜合分數</b>
            {snapshot.compositeScore}/100
          </span>
          <span>
            <b>風險分數</b>
            {snapshot.riskScore}/100
          </span>
          <span>
            <b>判讀信心</b>
            {explanation.confidence.score}%
          </span>
        </div>
      </article>

      <article className="panel stock-public-summary__wide">
        <p className="eyebrow">分數來源拆解</p>
        <h2>哪些因素拉高或拖累目前分數</h2>
        <div className="stock-factor-columns">
          <ExplanationList title="主要加分" tone="positive" items={explanation.positives} />
          <ExplanationList title="主要扣分" tone="negative" items={explanation.negatives} />
        </div>
      </article>

      <article className="panel">
        <p className="eyebrow">投資人解讀</p>
        <h2>不同觀察週期的閱讀方式</h2>
        <ul className="stock-explanation-list">
          <li>{explanation.longTermView.text}</li>
          <li>{explanation.shortTermView.text}</li>
        </ul>
      </article>

      <article className="panel">
        <p className="eyebrow">決策脈絡</p>
        <h2>先看什麼，再看什麼</h2>
        <ul className="stock-explanation-list">
          {explanation.decisionContext.map((item) => (
            <li key={item.evidence.map((entry) => entry.ruleId).join("-")}>{item.text}</li>
          ))}
        </ul>
      </article>

      <article className="panel stock-public-summary__wide stock-confidence-panel">
        <p className="eyebrow">判讀信心</p>
        <h2>
          {explanation.confidence.level}信心，{explanation.confidence.score}%
        </h2>
        <p>{explanation.confidence.note}</p>
        <div className="stock-confidence-meter" aria-label="判讀信心比例">
          <b style={{ width: String(explanation.confidence.score) + "%" }} />
        </div>
        <div className="stock-decision-facts" aria-label="信心來源">
          <span>
            <b>資料完整度</b>
            {explanation.confidence.dataQuality}/100
          </span>
          <span>
            <b>歷史樣本</b>
            {explanation.confidence.sampleDepth}
          </span>
          <span>
            <b>缺漏因子</b>
            {formatFlagCount(explanation.confidence.missingInputs.length)}
          </span>
          <span>
            <b>資料延遲</b>
            {formatFlagCount(explanation.confidence.staleInputs.length)}
          </span>
        </div>
        <ConfidenceDetails
          missingInputs={explanation.confidence.missingInputs}
          staleInputs={explanation.confidence.staleInputs}
        />
      </article>
    </section>
  );
}

function ExplanationList({
  items,
  title,
  tone
}: {
  items: ExplanationItem[];
  title: string;
  tone: "positive" | "negative";
}) {
  return (
    <div className={"stock-factor-list " + tone}>
      <h3>{title}</h3>
      <ol>
        {items.map((item) => (
          <li key={item.evidence.map((entry) => entry.ruleId).join("-")}>
            <span>{item.text}</span>
            <small>影響度 {item.impact}</small>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ConfidenceDetails({ missingInputs, staleInputs }: { missingInputs: string[]; staleInputs: string[] }) {
  if (missingInputs.length === 0 && staleInputs.length === 0) {
    return null;
  }

  return (
    <div className="stock-confidence-details" aria-label="判讀信心細節">
      {missingInputs.length > 0 && (
        <div>
          <h3>缺漏因子</h3>
          <ul>
            {missingInputs.map((flag) => (
              <li key={flag}>{formatReadableDataFlag(flag)}</li>
            ))}
          </ul>
        </div>
      )}
      {staleInputs.length > 0 && (
        <div>
          <h3>資料延遲</h3>
          <ul>
            {staleInputs.map((flag) => (
              <li key={flag}>{formatReadableDataFlag(flag)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function formatReadableDataFlag(flag: string) {
  if (flag.includes("etf_full_coverage")) return "ETF 全量覆蓋列入 Phase 1.1，目前先呈現既有 ETF 標的。";
  if (flag.includes("momentum")) return "缺少開盤或收盤價格，暫時無法推估價格動能。";
  if (flag.includes("volatility")) return "缺少最高、最低或收盤價格，暫時無法推估波動風險。";
  if (flag.includes("stale_gt_5") || flag.includes("severe_stale")) return "資料已超過 5 個交易日未更新，判讀信心明顯下降。";
  if (flag.includes("stale_gt_2") || flag.includes("stale")) return "資料已超過 2 個交易日未更新，判讀信心下降。";
  if (flag.includes("freshness_expected_date_unavailable")) return "目前無法判斷最近交易日，請以資料日期為準。";
  return flag.replace(/_/g, " ");
}

function formatFlagCount(count: number) {
  return count === 0 ? "無" : `${count} 項`;
}

function StockQuotePanel({
  series,
  snapshot,
  sourceLabel
}: {
  series: SignalSnapshot[];
  snapshot: SignalSnapshot;
  sourceLabel: string;
}) {
  const quote = buildQuoteViewModel(series, snapshot);
  const tone = quote.change >= 0 ? "up" : "down";
  const marketCode = snapshot.asset.type === "index" ? "TWSE 指數" : `TPE: ${snapshot.asset.symbol}`;
  const assetTypeLabel = snapshot.asset.type === "index" ? "指數" : snapshot.asset.type === "etf" ? "ETF" : "股";

  return (
    <section className="stock-quote-panel" aria-label={`${snapshot.asset.name} 報價資訊`}>
      <div className="stock-quote-head">
        <div className="stock-quote-identity">
          <div className="stock-quote-avatar" aria-hidden="true">
            {assetTypeLabel}
          </div>
          <div>
            <p className="eyebrow">標的資訊</p>
            <h1>{snapshot.asset.name}</h1>
            <p>
              {marketCode} ・ {formatPublicAssetGroup(snapshot.asset)}
            </p>
          </div>
        </div>
        <div className="stock-quote-head-actions">
          <StockFollowButton symbol={snapshot.asset.symbol} />
        </div>
      </div>

      <div className="stock-quote-price-row">
        <strong>{quote.closeLabel}</strong>
        <span>{quote.unit}</span>
        <b className={tone}>
          {quote.change >= 0 ? "▲" : "▼"} {formatSignedNumber(quote.change)} / {formatSignedNumber(quote.changePercent)}%
        </b>
      </div>
      <p className="stock-quote-timestamp">
        資料日期：{quote.tradeDate} ・ 引用來源：{sourceLabel} ・ 非即時行情，僅供市場觀察。
      </p>

      <StockQuoteInteractiveChart assetName={snapshot.asset.name} points={quote.chartPoints} symbol={quote.symbol} unit={quote.unit} />

      <dl className="stock-quote-stat-grid" aria-label="報價摘要">
        {quote.stats.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function formatSignedNumber(value: number) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toLocaleString("zh-TW", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}

function formatPublicAssetGroup(asset: Asset) {
  if (asset.type === "index") return "市場指數";
  if (asset.type === "etf") return "ETF";
  if (!asset.group || /^\d+$/.test(asset.group.trim())) return "上市股票";
  return asset.group;
}

function formatPublicSourceLabel(sourceName: string, isOfficialRuntime: boolean) {
  if (!isOfficialRuntime) return "示範資料";
  if (!sourceName || sourceName === "正式資料" || sourceName.toLowerCase().includes("supabase")) return "TWSE OpenAPI";
  return sourceName;
}
