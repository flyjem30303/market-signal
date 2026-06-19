import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { MarketWatchlistPanel } from "@/components/market-watchlist-panel";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { StockFollowButton } from "@/components/stock-follow-button";
import { StockQuoteInteractiveChart } from "@/components/stock-quote-interactive-chart";
import { TrackedLink } from "@/components/tracked-link";
import type { Asset } from "@/lib/assets";
import { buildMockDataFreshnessSnapshot, type DataFreshnessSnapshot } from "@/lib/data-freshness";
import { buildStockExplanation, type ExplanationItem } from "@/lib/stock-explanation-engine";
import type { MarketSignalSourceStatus } from "@/lib/repositories/market-signal-source-status";
import { mockMarketSignalRepository } from "@/lib/repositories/mock-market-signal-repository";
import {
  createStaticMarketSignalRepository,
  type MarketSignalRepositoryData
} from "@/lib/repositories/static-market-signal-repository";
import type { NewsEvent, SignalSnapshot } from "@/lib/signal-model";

type DashboardShellProps = {
  freshnessSnapshot?: DataFreshnessSnapshot;
  initialSymbol: string;
  includeSeoContent?: boolean;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
  repositoryData?: MarketSignalRepositoryData;
};

const fallbackSnapshotDate = "2026-05-28";

export function DashboardShell({
  freshnessSnapshot,
  initialSymbol,
  includeSeoContent = false,
  marketSignalSourceStatus,
  repositoryData
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
  const relatedNews = repository.getRelatedNews(selected.symbol, activeSnapshotDate);
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
          <HomeFirstScreenDecisionSummary market={market} />
          <MarketWatchlistPanel snapshots={snapshots} />
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
          <MarketWatchlistPanel snapshots={snapshots} />
          <StockEventContext news={relatedNews} />
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
        {market.riskScore}/100。這裡把趨勢、資金、風險與資料品質放在同一個閱讀脈絡，協助你先判斷市場溫度，再進入標的細節。
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

function HomeFirstScreenDecisionSummary({ market }: { market: SignalSnapshot }) {
  return (
    <section className="home-decision-summary" aria-label="今日市場重點">
      <p className="eyebrow">今日重點</p>
      <h2>
        {market.asset.name}: {market.signal.title}，綜合分數 {market.compositeScore}/100
      </h2>
      <p>{market.signal.text}</p>
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

function StockAtAGlance({ series, snapshot }: { series: SignalSnapshot[]; snapshot: SignalSnapshot }) {
  const explanation = buildStockExplanation(snapshot, { seriesLength: series.length });

  return (
    <section className="stock-public-summary" aria-label="標的分析摘要">
      <article className="panel stock-public-summary__wide stock-decision-summary">
        <p className="eyebrow">市場診斷</p>
        <h2>
          {snapshot.asset.name}: {explanation.scoreLevel}，綜合分數 {snapshot.compositeScore}/100
        </h2>
        <p>{explanation.summary.text}</p>
        <div className="stock-decision-facts" aria-label="判讀依據">
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
        <h2>哪些因素拉高，哪些因素拖累</h2>
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
        <div className="stock-confidence-meter" aria-label="判讀信心百分比">
          <b style={{ width: String(explanation.confidence.score) + "%" }} />
        </div>
        <div className="stock-decision-facts" aria-label="信心度來源">
          <span>
            <b>資料品質</b>
            {explanation.confidence.dataQuality}/100
          </span>
          <span>
            <b>歷史樣本</b>
            {explanation.confidence.sampleDepth}
          </span>
          <span>
            <b>缺漏模組</b>
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
  return (
    <div className="stock-confidence-details" aria-label="判讀信心細節">
      <div>
        <h3>缺漏因子</h3>
        {missingInputs.length > 0 ? (
          <ul>
            {missingInputs.map((flag) => (
              <li key={flag}>{formatReadableDataFlag(flag)}</li>
            ))}
          </ul>
        ) : (
          <p>目前沒有缺漏因子。</p>
        )}
      </div>
      <div>
        <h3>資料延遲</h3>
        {staleInputs.length > 0 ? (
          <ul>
            {staleInputs.map((flag) => (
              <li key={flag}>{formatReadableDataFlag(flag)}</li>
            ))}
          </ul>
        ) : (
          <p>目前未標記資料延遲。</p>
        )}
      </div>
    </div>
  );
}

function formatReadableDataFlag(flag: string) {
  if (flag.includes("valuation")) return "估值資料尚未納入，因此本頁不判斷便宜或昂貴。";
  if (flag.includes("fund_flow") || flag.includes("flow")) return "資金流資料尚未納入，因此無法確認買盤是否穩定。";
  if (flag.includes("news_score") || flag.includes("news")) return "新聞情緒尚未納入正式模型，本頁先以價格與分數資料判讀。";
  if (flag.includes("etf_full_coverage")) return "ETF 全量覆蓋列入 Phase 1.1，目前先顯示已納入的核心 ETF。";
  if (flag.includes("momentum")) return "缺少開盤或收盤欄位，因此無法完整計算短線動能。";
  if (flag.includes("volatility")) return "缺少最高、最低或收盤欄位，因此無法完整計算盤中波動。";
  if (flag.includes("stale_gt_5") || flag.includes("severe_stale")) return "資料已落後超過 5 個交易日，應停止把分數視為最新狀態。";
  if (flag.includes("stale_gt_2") || flag.includes("stale")) return "資料已落後超過 2 個交易日，判讀信心會下降。";
  if (flag.includes("freshness_expected_date_unavailable")) return "目前無法確認預期交易日，需檢查每日更新流程。";
  return flag.replace(/_/g, " ");
}

function formatFlagCount(count: number) {
  return count === 0 ? "無" : String(count) + " 項";
}

function formatDataFlag(flag: string) {
  if (flag.includes("news_score")) return "新聞事件目前只作為背景輔助，尚未納入正式分數。";
  if (flag.includes("etf_full_coverage")) return "ETF 全量覆蓋列入 Phase 1.1，本頁先以目前標的與上市股票資料判讀。";
  if (flag.includes("示範資料")) return "目前資料狀態會以頁面顯示的資料日期與引用來源為準。";
  return flag.replace(/_/g, " ");
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
  const assetTypeLabel = snapshot.asset.type === "index" ? "指數" : snapshot.asset.type === "etf" ? "ETF" : "股票";

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

      <StockQuoteInteractiveChart assetName={snapshot.asset.name} points={quote.chartPoints} unit={quote.unit} />

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

function StockEventContext({ news }: { news: NewsEvent[] }) {
  const latestNews = news[0];

  return (
    <section className="panel stock-reading-summary" aria-label="事件脈絡">
      <p className="eyebrow">事件脈絡</p>
      <h2>新聞與事件仍作為背景輔助</h2>
      {latestNews ? (
        <p>
          {latestNews.title}: {latestNews.summary}
        </p>
      ) : (
        <p>目前沒有可用的事件脈絡；請先以燈號、分數、資料日期與風險提示作為主要閱讀順序。</p>
      )}
    </section>
  );
}

function buildQuoteViewModel(series: SignalSnapshot[], snapshot: SignalSnapshot) {
  const closeLabels = snapshot.asset.type === "index" ? ["指數收盤", "指數收盤價", "收盤點數"] : ["收盤價", "ETF 參考價"];
  const points = series
    .map((item) => ({
      close: parseMarketNumber(getMarketFactValue(item, closeLabels)),
      compositeScore: item.compositeScore,
      date: item.date,
      riskScore: item.riskScore
    }))
    .filter(
      (item): item is { close: number; compositeScore: number; date: string; riskScore: number } =>
        Number.isFinite(item.close)
    )
    .slice(-90);
  const snapshotClose = parseMarketNumber(getMarketFactValue(snapshot, closeLabels));
  const fallbackClose = snapshotClose ?? points.at(-1)?.close ?? snapshot.compositeScore;
  const chartPoints = points.length
    ? [...points]
    : [
        {
          close: fallbackClose,
          compositeScore: snapshot.compositeScore,
          date: snapshot.date,
          riskScore: snapshot.riskScore
        }
      ];
  if (snapshotClose !== null) {
    chartPoints[chartPoints.length - 1] = {
      ...chartPoints[chartPoints.length - 1],
      close: snapshotClose,
      date: snapshot.date
    };
  }
  const previousClose = chartPoints.at(-2)?.close ?? chartPoints.at(-1)!.close;
  const close = snapshotClose ?? chartPoints.at(-1)!.close;
  const change = close - previousClose;
  const changePercent = previousClose === 0 ? 0 : (change / previousClose) * 100;

  return {
    change,
    changePercent,
    chartPoints,
    closeLabel: formatMarketNumber(close),
    stats: [
      { label: "開盤", value: getMarketFactValue(snapshot, ["開盤價", "指數開盤"]) ?? "暫無資料" },
      { label: "最高", value: getMarketFactValue(snapshot, ["最高價", "指數最高"]) ?? "暫無資料" },
      { label: "最低", value: getMarketFactValue(snapshot, ["最低價", "指數最低"]) ?? "暫無資料" },
      { label: "收盤", value: getMarketFactValue(snapshot, closeLabels) ?? "暫無資料" },
      { label: "成交量", value: getMarketFactValue(snapshot, ["成交量"]) ?? "暫無資料" },
      { label: "成交金額", value: getMarketFactValue(snapshot, ["成交金額"]) ?? "暫無資料" }
    ],
    tradeDate: getMarketFactValue(snapshot, ["資料日期"]) ?? snapshot.date,
    unit: snapshot.asset.type === "index" ? "點" : "TWD"
  };
}

function getMarketFactValue(snapshot: SignalSnapshot, labels: string[]) {
  return snapshot.marketFacts.find((fact) => labels.includes(fact.label))?.value;
}

function parseMarketNumber(value: string | undefined) {
  if (!value) return null;
  const parsed = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatMarketNumber(value: number) {
  return value.toLocaleString("zh-TW", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
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
