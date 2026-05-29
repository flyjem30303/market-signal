"use client";

import { useEffect, useMemo, useState } from "react";
import type { Asset } from "@/lib/assets";
import { StockSeoContent } from "@/components/stock-seo-content";
import { CommercialSlot } from "@/components/commercial-slot";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import {
  signalColor,
  type BacktestBucket,
  type NewsEvent,
  type SignalSnapshot
} from "@/lib/signal-model";
import { buildQuoteSnapshot, type QuoteSnapshot } from "@/lib/market-data";
import { buildMockDataFreshnessSnapshot, type DataFreshnessSnapshot } from "@/lib/data-freshness";
import { getMarketSignalRepository } from "@/lib/repositories/market-signal-repository";
import { trackEvent } from "@/lib/tracking";

type DashboardShellProps = {
  freshnessSnapshot?: DataFreshnessSnapshot;
  initialSymbol: string;
  includeSeoContent?: boolean;
};

type TabKey = "today" | "trend" | "technical" | "volume" | "fundamentals" | "news" | "backtest";
type ChartMode = "health" | "risk" | "composite";

const today = "2026-05-28";

export function DashboardShell({ freshnessSnapshot, initialSymbol, includeSeoContent = false }: DashboardShellProps) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [chartMode, setChartMode] = useState<ChartMode>("health");
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [newsDate, setNewsDate] = useState(today);
  const repository = useMemo(() => getMarketSignalRepository(), []);
  const freshness = useMemo(() => freshnessSnapshot ?? buildMockDataFreshnessSnapshot(), [freshnessSnapshot]);
  const availableAssets = useMemo(() => repository.getAssets(), [repository]);
  const selected = repository.getAssetBySymbol(symbol) ?? availableAssets[0];
  const snapshot = useMemo(() => repository.getSnapshot(selected.symbol, today)!, [repository, selected.symbol]);
  const quote = useMemo(() => buildQuoteSnapshot(selected, snapshot), [selected, snapshot]);
  const series = useMemo(() => repository.getSeries(selected.symbol), [repository, selected.symbol]);
  const realEndIndex = endIndex || series.length - 1;
  const isFavorite = favorites.includes(selected.symbol);
  const filteredAssets = availableAssets.filter((asset) =>
    `${asset.symbol} ${asset.name} ${asset.group}`.toLowerCase().includes(query.trim().toLowerCase())
  );
  const favoriteAssets = favorites
    .map((item) => repository.getAssetBySymbol(item))
    .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset));

  useEffect(() => {
    setStartIndex(0);
    setEndIndex(series.length - 1);
    setNewsDate(today);
  }, [series.length]);

  useEffect(() => {
    if (includeSeoContent) {
      trackEvent("stock_page_viewed", {
        symbol: selected.symbol,
        name: selected.name,
        signal: snapshot.signal.title
      });
    }
  }, [includeSeoContent, selected.name, selected.symbol, snapshot.signal.title]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("marketSignalFavorites");
      if (saved) setFavorites(JSON.parse(saved));
    } catch {
      setFavorites([]);
    }
  }, []);

  function toggleFavorite(target: string) {
    setFavorites((current) => {
      const next = current.includes(target) ? current.filter((item) => item !== target) : [...current, target];
      trackEvent(current.includes(target) ? "favorite_removed" : "favorite_added", { symbol: target });
      window.localStorage.setItem("marketSignalFavorites", JSON.stringify(next));
      return next;
    });
  }

  function selectAsset(nextSymbol: string) {
    trackEvent("asset_selected", { symbol: nextSymbol });
    setSymbol(nextSymbol);
    setQuery("");
  }

  function changeTab(nextTab: TabKey) {
    trackEvent("tab_changed", { symbol: selected.symbol, tab: nextTab });
    setActiveTab(nextTab);
  }

  function changeNewsDate(nextDate: string) {
    trackEvent("news_date_changed", { symbol: selected.symbol, date: nextDate });
    setNewsDate(nextDate);
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Market Signal Dashboard</p>
        <h1>
          {includeSeoContent
            ? `${selected.symbol} ${selected.name} 今日燈號：${snapshot.signal.title}`
            : "多標的健康度與回檔風險燈號"}
        </h1>
        <p>
          {includeSeoContent
            ? `追蹤 ${selected.symbol} 的多頭健康度、回檔風險度、新聞信心與回測摘要。`
            : "先選標的，再查看今日燈號、區間變化、新聞信心與回測摘要。"}
        </p>
      </section>

      <AssetSelector
        assets={availableAssets}
        favorites={favoriteAssets}
        filteredAssets={filteredAssets}
        isFavorite={isFavorite}
        query={query}
        selectedSymbol={selected.symbol}
        onFavorite={toggleFavorite}
        onQuery={setQuery}
        onSelect={selectAsset}
      />

      {includeSeoContent && (
        <>
          <DataFreshnessStrip freshness={freshness} />
          <StockDecisionCompass scoreSourceLabel={freshness.scoreSourceLabel} snapshot={snapshot} />
          <QuoteSummary asset={selected} isFavorite={isFavorite} quote={quote} snapshot={snapshot} onFavorite={toggleFavorite} />
          <StockPageCompass activeTab={activeTab} onTab={changeTab} />
          <StockModuleHighlights snapshot={snapshot} onTab={changeTab} />
          <StockRiskChecklist snapshot={snapshot} onTab={changeTab} />
        </>
      )}

      <nav className="tabs" aria-label="儀表板頁籤">
        {(includeSeoContent
          ? [
              ["today", "總覽"],
              ["trend", "走勢"],
              ["technical", "技術"],
              ["volume", "成交量"],
              ["fundamentals", "股利 / 基本"],
              ["news", "新聞"],
              ["backtest", "燈號模型"]
            ]
          : [
              ["today", "今日燈號"],
              ["trend", "區間變化"],
              ["news", "新聞信心"],
              ["backtest", "回測驗證"]
            ]
        ).map(([key, label]) => (
          <button
            className={activeTab === key ? "tab-button active" : "tab-button"}
            key={key}
            onClick={() => changeTab(key as TabKey)}
            type="button"
          >
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "today" && (
        <TodayTab scoreSourceLabel={freshness.scoreSourceLabel} selectedSymbol={selected.symbol} snapshot={snapshot} />
      )}
      {activeTab === "trend" && (
        <TrendTab
          chartMode={chartMode}
          endIndex={realEndIndex}
          series={series}
          startIndex={startIndex}
          onChartMode={setChartMode}
          onEndIndex={setEndIndex}
          onStartIndex={setStartIndex}
        />
      )}
      {activeTab === "technical" && <TechnicalTab quote={quote} selected={selected} snapshot={snapshot} />}
      {activeTab === "volume" && <VolumeTab quote={quote} selected={selected} series={series} snapshot={snapshot} />}
      {activeTab === "fundamentals" && <FundamentalsTab quote={quote} selected={selected} snapshot={snapshot} />}
      {activeTab === "news" && (
        <NewsTab
          newsDate={newsDate}
          related={repository.getRelatedNews(selected.symbol, newsDate)}
          selected={selected}
          series={series}
          onNewsDate={changeNewsDate}
        />
      )}
      {activeTab === "backtest" && (
        <BacktestTab buckets={repository.getBacktestBuckets(selected.symbol)} series={series} symbol={selected.symbol} />
      )}

      {includeSeoContent && (
        <>
          <StockSeoContent
            asset={selected}
            backtestBuckets={repository.getBacktestBuckets(selected.symbol)}
            news={repository.getRelatedNews(selected.symbol, today)}
            snapshot={snapshot}
          />
          <CommercialSlot context="stock" />
        </>
      )}
    </main>
  );
}

function QuoteSummary({
  asset,
  isFavorite,
  quote,
  snapshot,
  onFavorite
}: {
  asset: Asset;
  isFavorite: boolean;
  quote: QuoteSnapshot;
  snapshot: SignalSnapshot;
  onFavorite: (symbol: string) => void;
}) {
  const isUp = quote.change >= 0;

  return (
    <section className="quote-panel">
      <div className="quote-main">
        <div className="quote-title-row">
          <div>
            <div className="quote-name-line">
              <h2>{asset.name}</h2>
              <span>{asset.symbol}</span>
              <b>{quote.marketLabel}</b>
              <em>{quote.rankLabel}</em>
            </div>
            <p>
              收盤 | {quote.updatedAt} 更新 · {quote.currency}
            </p>
          </div>
          <div className="quote-actions">
            <a className="outline-button" href="/methodology">
              比較模型
            </a>
            <button className={isFavorite ? "solid-button active" : "solid-button"} onClick={() => onFavorite(asset.symbol)} type="button">
              {isFavorite ? "已加入自選股" : "加入自選股"}
            </button>
          </div>
        </div>

        <div className="quote-price-row">
          <strong className={isUp ? "quote-price up" : "quote-price down"}>{formatNumber(quote.close)}</strong>
          <span className={isUp ? "quote-change up" : "quote-change down"}>
            {isUp ? "▲" : "▼"} {formatSigned(quote.change)} ({formatSigned(quote.changePercent * 100)}%)
          </span>
        </div>
      </div>

      <div className="quote-stat-grid">
        <QuoteStat label="成交量" value={formatInteger(quote.volume)} />
        <QuoteStat label="本益比" value={quote.pe ? String(quote.pe) : "-"} />
        <QuoteStat label="殖利率" value={quote.dividendYield ? `${(quote.dividendYield * 100).toFixed(2)}%` : "-"} />
        <QuoteStat label="燈號" value={snapshot.signal.title} tone={signalColor(snapshot.signal.key)} />
      </div>

      <div className="quote-stat-grid compact">
        <QuoteStat label="開盤" value={formatNumber(quote.open)} />
        <QuoteStat label="最高" value={formatNumber(quote.high)} />
        <QuoteStat label="最低" value={formatNumber(quote.low)} />
        <QuoteStat label="健康 / 風險" value={`${snapshot.healthScore} / ${snapshot.riskScore}`} />
      </div>
    </section>
  );
}

function QuoteStat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="quote-stat">
      <span>{label}</span>
      <strong style={tone ? { color: tone } : undefined}>{value}</strong>
    </div>
  );
}

function StockDecisionCompass({
  scoreSourceLabel,
  snapshot
}: {
  scoreSourceLabel: string;
  snapshot: SignalSnapshot;
}) {
  const riskTone = snapshot.riskScore >= 70 ? "blocked" : snapshot.riskScore >= 55 ? "hold" : "active";

  return (
    <section className="stock-decision-compass" aria-label="Stock Decision Compass">
      <article className="active">
        <span>模型狀態</span>
        <strong>{scoreSourceLabel}</strong>
        <p>目前仍是 mock 閱讀體驗，先看結構，不把分數當成交易訊號。</p>
      </article>
      <article className={riskTone}>
        <span>風險溫度</span>
        <strong>{snapshot.riskScore}/100</strong>
        <p>{snapshot.riskScore >= 55 ? "先檢查風險來源，再看健康度是否足以抵銷。" : "風險尚未升溫，仍需搭配族群與估值檢查。"}</p>
      </article>
      <article className="hold">
        <span>閱讀順序</span>
        <strong>先總後細</strong>
        <p>先看今日分數與資料狀態，再切換趨勢、技術、籌碼、基本面與回測。</p>
      </article>
    </section>
  );
}

function StockPageCompass({ activeTab, onTab }: { activeTab: TabKey; onTab: (tab: TabKey) => void }) {
  const items: Array<{ key: TabKey; label: string; text: string }> = [
    { key: "today", label: "今日", text: "分數與模型狀態" },
    { key: "trend", label: "趨勢", text: "長期分數路徑" },
    { key: "technical", label: "技術", text: "價格與動能" },
    { key: "volume", label: "籌碼", text: "成交與資金" },
    { key: "fundamentals", label: "基本面", text: "估值與品質" },
    { key: "news", label: "新聞", text: "事件脈絡" },
    { key: "backtest", label: "回測", text: "歷史模擬表現" }
  ];

  return (
    <nav className="stock-page-compass" aria-label="Stock Page Compass">
      {items.map((item) => (
        <button
          className={activeTab === item.key ? "active" : undefined}
          key={item.key}
          onClick={() => onTab(item.key)}
          type="button"
        >
          <strong>{item.label}</strong>
          <span>{item.text}</span>
        </button>
      ))}
    </nav>
  );
}

function StockModuleHighlights({ snapshot, onTab }: { snapshot: SignalSnapshot; onTab: (tab: TabKey) => void }) {
  const strongestModule = snapshot.modules.slice().sort((a, b) => b.health - a.health)[0];
  const hottestRisk = snapshot.modules.slice().sort((a, b) => b.risk - a.risk)[0];
  const gapCount = snapshot.missingModuleFlags.length + snapshot.staleDataFlags.length;

  return (
    <section className="stock-module-highlights" aria-label="Stock Module Highlights">
      <article>
        <span>健康支撐</span>
        <strong>{strongestModule.name}</strong>
        <p>健康度 {strongestModule.health}/100，先確認這個優勢是否也反映在趨勢與基本面。</p>
        <button onClick={() => onTab("fundamentals")} type="button">看基本面</button>
      </article>
      <article className="risk">
        <span>風險來源</span>
        <strong>{hottestRisk.name}</strong>
        <p>風險度 {hottestRisk.risk}/100，若追價前沒有釐清來源，容易把燈號誤讀成指令。</p>
        <button onClick={() => onTab("technical")} type="button">看技術面</button>
      </article>
      <article className="gap">
        <span>資料缺口</span>
        <strong>{gapCount}</strong>
        <p>仍有 mock 或缺漏旗標，正式判讀前必須保留模型邊界與資料品質折扣。</p>
        <button onClick={() => onTab("today")} type="button">看今日狀態</button>
      </article>
    </section>
  );
}

function StockRiskChecklist({ snapshot, onTab }: { snapshot: SignalSnapshot; onTab: (tab: TabKey) => void }) {
  const checklist = [
    {
      action: () => onTab("trend"),
      button: "看趨勢",
      status: snapshot.healthScore >= 65 ? "pass" : "watch",
      text: snapshot.healthScore >= 65 ? "健康度足以支撐觀察，但仍需確認分數是否連續。" : "健康度不足，先不要只因單日燈號做判斷。",
      title: "趨勢是否連續"
    },
    {
      action: () => onTab("technical"),
      button: "看技術",
      status: snapshot.riskScore >= 60 ? "watch" : "pass",
      text: snapshot.riskScore >= 60 ? "風險分數偏高，追價前要先確認波動來源。" : "風險分數尚可，但仍要保留停損與部位控管。",
      title: "風險是否升溫"
    },
    {
      action: () => onTab("today"),
      button: "看資料",
      status: snapshot.missingModuleFlags.length || snapshot.staleDataFlags.length ? "watch" : "pass",
      text: "目前仍有 mock 或資料旗標，所有解讀都應降級為研究體驗。",
      title: "資料是否可靠"
    }
  ];

  return (
    <section className="stock-risk-checklist" aria-label="Stock Risk Checklist">
      <div>
        <p className="eyebrow">Risk Checklist</p>
        <h2>進場前風險檢查</h2>
        <p>這些檢查只協助閱讀 mock 模型，不構成買賣建議。</p>
      </div>
      <div className="risk-check-grid">
        {checklist.map((item) => (
          <article className={item.status} key={item.title}>
            <span>{item.status === "pass" ? "可觀察" : "需確認"}</span>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              {item.button}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function AssetSelector({
  assets,
  favorites,
  filteredAssets,
  isFavorite,
  query,
  selectedSymbol,
  onFavorite,
  onQuery,
  onSelect
}: {
  assets: Asset[];
  favorites: Asset[];
  filteredAssets: Asset[];
  isFavorite: boolean;
  query: string;
  selectedSymbol: string;
  onFavorite: (symbol: string) => void;
  onQuery: (query: string) => void;
  onSelect: (symbol: string) => void;
}) {
  return (
    <section className="panel asset-panel">
      <div className="asset-toolbar">
        <label>
          <span>標的搜尋</span>
          <input
            placeholder="輸入代號或名稱"
            type="search"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
          />
        </label>
        <label>
          <span>快速切換</span>
          <select value={selectedSymbol} onChange={(event) => onSelect(event.target.value)}>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.symbol}>
                {asset.symbol} {asset.name}
              </option>
            ))}
          </select>
        </label>
        <button
          className={isFavorite ? "favorite active" : "favorite"}
          onClick={() => onFavorite(selectedSymbol)}
          type="button"
        >
          {isFavorite ? "♥ 已加入愛心" : "♡ 加入愛心"}
        </button>
      </div>
      <div className="favorite-row">
        {favorites.length ? (
          favorites.map((asset) => (
            <button className="favorite-chip" key={asset.id} onClick={() => onSelect(asset.symbol)} type="button">
              ♥ {asset.symbol}
            </button>
          ))
        ) : (
          <span className="muted-chip">尚未加入愛心標的</span>
        )}
      </div>
      <div className="asset-grid">
        {filteredAssets.map((asset) => (
          <button
            className={asset.symbol === selectedSymbol ? "asset-card active" : "asset-card"}
            key={asset.id}
            onClick={() => onSelect(asset.symbol)}
            type="button"
          >
            <strong>{asset.symbol}</strong>
            <span>{asset.name}</span>
            <small>{asset.group}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function TodayTab({
  scoreSourceLabel,
  selectedSymbol,
  snapshot
}: {
  scoreSourceLabel: string;
  selectedSymbol: string;
  snapshot: SignalSnapshot;
}) {
  return (
    <>
      <section className="score-grid">
        <ScoreCard label="多頭健康度" score={snapshot.healthScore} tone="health" />
        <ScoreCard label="回檔風險度" score={snapshot.riskScore} tone="risk" />
        <article className="panel">
          <p className="panel-label">綜合燈號</p>
          <h2 style={{ color: signalColor(snapshot.signal.key) }}>{snapshot.signal.title}</h2>
          <p>{snapshot.signal.text}</p>
        </article>
        <article className="panel">
          <p className="panel-label">資料品質</p>
          <h2>{snapshot.dataQualityGrade} 級</h2>
          <p>
            完整度 {snapshot.dataQualityScore}/100，目前版本為 {snapshot.modelVersion}，正式上線前會改接真實資料。
          </p>
        </article>
      </section>

      <aside className="score-source-note" aria-label="模型狀態">
        <strong>目前分數來源：{scoreSourceLabel}</strong>
        <span>正式上線前，分數仍用於產品體驗驗證，不代表已完成真實投資模型校準。</span>
        <a href="/methodology">方法論</a>
        <a href="/disclaimer">免責聲明</a>
      </aside>

      <section className="content-grid">
        <article className="panel">
          <p className="eyebrow">Research Modules</p>
          <h2>{selectedSymbol} 六大研究模組</h2>
          <div className="module-list">
            {snapshot.modules.map((module) => (
              <div className="module-card" key={module.id}>
                <div>
                  <strong>{module.name}</strong>
                  <span>{module.note}</span>
                </div>
                <b>健 {module.health}</b>
                <b>險 {module.risk}</b>
              </div>
            ))}
          </div>
        </article>

        <aside className="panel">
          <p className="eyebrow">SEO Preview</p>
          <h2>股票頁內容方向</h2>
          <p>
            未來每檔股票頁會包含今日燈號、分數趨勢、新聞信心、回測摘要與同產業比較，並輸出
            SEO metadata。
          </p>
          <a className="text-link" href={`/stocks/${selectedSymbol}`}>
            前往 {selectedSymbol} 股票頁
          </a>
        </aside>
      </section>
    </>
  );
}

function TrendTab({
  chartMode,
  endIndex,
  series,
  startIndex,
  onChartMode,
  onEndIndex,
  onStartIndex
}: {
  chartMode: ChartMode;
  endIndex: number;
  series: SignalSnapshot[];
  startIndex: number;
  onChartMode: (mode: ChartMode) => void;
  onEndIndex: (value: number) => void;
  onStartIndex: (value: number) => void;
}) {
  const visible = series.slice(startIndex, endIndex + 1);
  const values = visible.map((row) => chartValue(row, chartMode));
  const high = Math.max(...values);
  const low = Math.min(...values);
  const avg = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  const latest = visible[visible.length - 1];

  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Score Timeline</p>
          <h2>時間區間分數變化</h2>
        </div>
        <div className="chart-toggle">
          {[
            ["health", "健康度"],
            ["risk", "風險度"],
            ["composite", "綜合分"]
          ].map(([key, label]) => (
            <button
              className={chartMode === key ? "chart-mode active" : "chart-mode"}
              key={key}
              onClick={() => onChartMode(key as ChartMode)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="slider-grid">
        <label>
          <span>起始日期</span>
          <input
            max={series.length - 8}
            min={0}
            type="range"
            value={startIndex}
            onChange={(event) => onStartIndex(Math.min(Number(event.target.value), endIndex - 7))}
          />
          <strong>{visible[0].date}</strong>
        </label>
        <label>
          <span>結束日期</span>
          <input
            max={series.length - 1}
            min={7}
            type="range"
            value={endIndex}
            onChange={(event) => onEndIndex(Math.max(Number(event.target.value), startIndex + 7))}
          />
          <strong>{latest.date}</strong>
        </label>
      </div>
      <ScoreChart mode={chartMode} rows={visible} />
      <div className="metric-grid">
        <Metric label="區間最高" value={String(high)} />
        <Metric label="區間最低" value={String(low)} />
        <Metric label="區間平均" value={String(avg)} />
        <Metric label="最新狀態" value={latest.signal.title} />
      </div>
    </section>
  );
}

function TechnicalTab({ quote, selected, snapshot }: { quote: QuoteSnapshot; selected: Asset; snapshot: SignalSnapshot }) {
  const trendModule = snapshot.modules.find((module) => module.id === "trend") ?? snapshot.modules[0];
  const ma20 = quote.close * (1 - (snapshot.healthScore - 55) / 1800);
  const ma60 = quote.close * (1 - (snapshot.healthScore - 50) / 1200);
  const relativeStrength = Math.round(45 + selected.ai * 28 + selected.quality * 16 - selected.beta * 5);
  const technicalTone =
    snapshot.healthScore >= 75 && snapshot.riskScore < 68
      ? "趨勢偏多，短線仍需留意估值與籌碼是否同步升溫。"
      : snapshot.riskScore >= 70
        ? "趨勢雖未必轉弱，但風險分數偏高，追價節奏應更保守。"
        : "技術結構中性偏穩，適合觀察均線與量能是否延續。";

  return (
    <section className="content-grid">
      <article className="panel technical-panel">
        <p className="eyebrow">Technical Snapshot</p>
        <h2>{selected.symbol} 技術分析摘要</h2>
        <div className="technical-meter">
          <strong>{trendModule.health}</strong>
          <span>價格趨勢健康度</span>
        </div>
        <p>{technicalTone}</p>
        <div className="metric-grid compact-metrics">
          <Metric label="20 日均線" value={formatNumber(ma20)} />
          <Metric label="60 日均線" value={formatNumber(ma60)} />
          <Metric label="相對強弱" value={`${relativeStrength}/100`} />
          <Metric label="趨勢風險" value={`${trendModule.risk}/100`} />
        </div>
      </article>

      <aside className="panel">
        <p className="eyebrow">Signal Reading</p>
        <h2>技術面判讀</h2>
        <p>
          技術分頁會把均線、動能、相對強弱與趨勢風險整理成摘要。正式資料接上後，這裡會加入
          MA、RSI、MACD 與波動區間，但仍以風險判讀為主，不做買賣指令。
        </p>
      </aside>
    </section>
  );
}

function VolumeTab({
  quote,
  selected,
  series,
  snapshot
}: {
  quote: QuoteSnapshot;
  selected: Asset;
  series: SignalSnapshot[];
  snapshot: SignalSnapshot;
}) {
  const avgVolume = Math.round(quote.volume * (0.82 + selected.flow * 0.28));
  const volumeRatio = quote.volume / avgVolume;
  const recent = series.slice(-12);
  const flowModule = snapshot.modules.find((module) => module.id === "flow") ?? snapshot.modules[0];

  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Volume Profile</p>
          <h2>{selected.symbol} 成交量與資金熱度</h2>
        </div>
        <strong className={volumeRatio >= 1.15 ? "status-pill warning" : "status-pill"}>
          量能 {volumeRatio.toFixed(2)} 倍
        </strong>
      </div>
      <div className="metric-grid">
        <Metric label="今日成交量" value={formatInteger(quote.volume)} />
        <Metric label="20 日均量" value={formatInteger(avgVolume)} />
        <Metric label="籌碼健康" value={`${flowModule.health}/100`} />
        <Metric label="籌碼風險" value={`${flowModule.risk}/100`} />
      </div>
      <div className="volume-bars" aria-label="近 12 日量能示意">
        {recent.map((row) => {
          const height = 34 + Math.max(0, Math.min(78, row.riskScore - 25 + selected.flow * 22));
          return (
            <span key={row.date} style={{ ["--bar" as string]: `${height}%` }}>
              <i />
              <small>{row.date.slice(5)}</small>
            </span>
          );
        })}
      </div>
      <p>
        成交量放大不一定是風險，但若同時伴隨風險分數升高，通常代表市場情緒變熱。正式版會接法人、
        融資與當沖資料，讓量價解讀更接近真實交易環境。
      </p>
    </section>
  );
}

function FundamentalsTab({ quote, selected, snapshot }: { quote: QuoteSnapshot; selected: Asset; snapshot: SignalSnapshot }) {
  const earningsModule = snapshot.modules.find((module) => module.id === "earnings") ?? snapshot.modules[0];
  const valuationModule = snapshot.modules.find((module) => module.id === "valuation") ?? snapshot.modules[0];
  const payoutScore = Math.round(45 + (quote.dividendYield ?? 0) * 900 + selected.quality * 22);

  return (
    <section className="content-grid">
      <article className="panel">
        <p className="eyebrow">Fundamentals</p>
        <h2>{selected.symbol} 股利 / 基本資料</h2>
        <div className="metric-grid compact-metrics">
          <Metric label="本益比" value={quote.pe ? String(quote.pe) : "-"} />
          <Metric label="股價淨值比" value={quote.pb ? String(quote.pb) : "-"} />
          <Metric label="殖利率" value={quote.dividendYield ? `${(quote.dividendYield * 100).toFixed(2)}%` : "-"} />
          <Metric label="EPS TTM" value={quote.epsTtm ? String(quote.epsTtm) : "-"} />
        </div>
        <div className="fundamental-note">
          <strong>股利支撐分數 {payoutScore}/100</strong>
          <p>
            基本面健康度 {earningsModule.health}/100，估值風險 {valuationModule.risk}/100。若殖利率提高但估值風險也升高，
            代表需要同時檢查獲利是否能支撐配息。
          </p>
        </div>
      </article>

      <aside className="panel">
        <p className="eyebrow">CEO Product Layer</p>
        <h2>為什麼要做基本資料</h2>
        <p>
          使用者查股票時會期待看到估值與股利，這是信任基礎。我們的差異化不是表格比別人多，
          而是把估值、股利與健康 / 風險分數一起解讀。
        </p>
      </aside>
    </section>
  );
}

function NewsTab({
  newsDate,
  related,
  selected,
  series,
  onNewsDate
}: {
  newsDate: string;
  related: NewsEvent[];
  selected: Asset;
  series: SignalSnapshot[];
  onNewsDate: (date: string) => void;
}) {
  const current = nearestSnapshot(series, newsDate);
  const tone = related.reduce((sum, item) => sum + item.impact, 0);
  const title = tone >= 3 ? "新聞面提高基本面信心" : tone <= -2 ? "新聞面提醒風險升溫" : "新聞面中性偏觀望";
  const strongest = current.modules.slice().sort((a, b) => b.health - a.health)[0];
  const weakest = current.modules.slice().sort((a, b) => b.risk - a.risk)[0];
  const positiveCount = related.filter((item) => item.impact > 0).length;
  const negativeCount = related.filter((item) => item.impact < 0).length;
  const confidenceScore = Math.max(0, Math.min(100, current.healthScore - current.riskScore * 0.35 + 48 + tone * 4));
  const confidenceLabel =
    confidenceScore >= 72 ? "信心偏強" : confidenceScore >= 56 ? "信心中性偏穩" : confidenceScore >= 42 ? "信心轉弱" : "信心偏低";
  const confidenceTone = confidenceScore >= 72 ? "positive" : confidenceScore >= 56 ? "neutral" : "negative";
  const narrative =
    tone >= 3
      ? "近期新聞偏向基本面或產業動能正向，若價格趨勢同步維持，較有利於延續觀察名單。"
      : tone <= -2
        ? "近期新聞偏向宏觀、籌碼或集中度壓力，若風險分數同步升高，應降低追價速度。"
        : "近期新聞沒有明顯單邊方向，分數判讀應回到趨勢、估值與籌碼是否同步。";

  return (
    <section className="news-layout">
      <article className="panel">
        <p className="eyebrow">Confidence Review</p>
        <h2>{selected.symbol} 新聞信心儀表</h2>
        <div className="date-row">
          <label>
            <span>新聞日期</span>
            <input max={today} min="2000-01-01" type="date" value={newsDate} onChange={(event) => onNewsDate(event.target.value)} />
          </label>
          <strong className="confidence-pill" style={{ background: signalColor(current.signal.key) }}>
            {current.compositeScore}/100 · {current.signal.title}
          </strong>
        </div>
        <div className={`news-confidence ${confidenceTone}`}>
          <div className="confidence-score">
            <strong>{Math.round(confidenceScore)}</strong>
            <span>/100</span>
          </div>
          <div>
            <p className="panel-label">投資信心評論</p>
            <h2>{confidenceLabel}</h2>
            <p>{narrative}</p>
          </div>
        </div>
        <div className="news-metrics">
          <Metric label="正向事件" value={`${positiveCount} 則`} />
          <Metric label="負向事件" value={`${negativeCount} 則`} />
          <Metric label="新聞影響" value={tone > 0 ? `+${tone}` : String(tone)} />
          <Metric label="目前燈號" value={current.signal.title} />
        </div>
        <div className="commentary-box">
          <h3>{title}</h3>
          <p>
            {selected.symbol} 在 {newsDate} 的多頭健康度為 {current.healthScore}/100，回檔風險度為{" "}
            {current.riskScore}/100。最強支撐是 {strongest.name}，最大壓力是 {weakest.name}。此處把新聞視為
            信心修正因子，而不是單獨的買賣依據。
          </p>
        </div>
      </article>

      <article className="panel">
        <p className="eyebrow">Related News</p>
        <h2>相關新聞彙整</h2>
        <p className="news-source-note">目前為 mock 重大事件資料。正式版會優先使用合法 API、RSS 或官方來源，並保留原文連結。</p>
        <div className="news-list">
          {related.map((item) => (
            <article className="news-card" key={`${item.date}-${item.title}`}>
              <div className="news-meta">
                <time>{item.date}</time>
                <span>{item.source}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <b className={item.impact >= 0 ? "news-impact positive" : "news-impact negative"}>
                {item.category} {item.impact > 0 ? "+" : ""}
                {item.impact}
              </b>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

function BacktestTab({ buckets, series, symbol }: { buckets: BacktestBucket[]; series: SignalSnapshot[]; symbol: string }) {
  const risky = series.slice(0, -20).filter((row) => row.compositeScore < 62);

  return (
    <>
      <section className="panel">
        <p className="eyebrow">Validation</p>
        <h2>{symbol} 回測驗證</h2>
        <div className="metric-grid">
          <Metric label="樣本期間" value={`${series[0].date} 至 ${series[series.length - 1].date}`} />
          <Metric label="橘燈以下天數" value={`${risky.length} 天`} />
          <Metric label="模型狀態" value="待真實資料校準" />
          <Metric label="用途" value="風險輔助判斷" />
        </div>
      </section>
      <section className="panel">
        <p className="eyebrow">Signal Events</p>
        <h2>燈號事件樣本</h2>
        <div className="event-list">
          {buckets.map((bucket) => (
            <article className="event-card" key={bucket.signal.key}>
              <div>
                <h3 style={{ color: signalColor(bucket.signal.key) }}>{bucket.signal.title}</h3>
                <p>{bucket.count} 天樣本</p>
              </div>
              <b>20 日均報酬 {formatPct(bucket.avgReturn)}</b>
              <b>勝率 {formatPct(bucket.winRate)}</b>
              <b>最大回檔 {formatPct(bucket.maxDrawdown)}</b>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function ScoreCard({ label, score, tone }: { label: string; score: number; tone: "health" | "risk" }) {
  const color = tone === "health" ? (score >= 70 ? "#1f9d55" : "#d99a00") : score >= 65 ? "#d83a3a" : "#d99a00";

  return (
    <article className="panel score-card">
      <div className="score-ring" style={{ ["--ring" as string]: color, ["--pct" as string]: score }}>
        <span>{score}</span>
        <small>/100</small>
      </div>
      <div>
        <p className="panel-label">{label}</p>
        <h2>{score >= 70 ? "偏強" : score >= 55 ? "中性偏高" : "待修復"}</h2>
      </div>
    </article>
  );
}

function ScoreChart({ mode, rows }: { mode: ChartMode; rows: SignalSnapshot[] }) {
  const width = 920;
  const height = 320;
  const pad = { top: 24, right: 28, bottom: 36, left: 44 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const xFor = (index: number) => pad.left + (index / Math.max(rows.length - 1, 1)) * innerW;
  const yFor = (score: number) => pad.top + ((100 - score) / 100) * innerH;
  const points = rows.map((row, index) => `${xFor(index).toFixed(1)},${yFor(chartValue(row, mode)).toFixed(1)}`);
  const latest = rows[rows.length - 1];
  const latestValue = chartValue(latest, mode);

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="分數折線圖">
        {[0, 25, 50, 75, 100].map((score) => (
          <g key={score}>
            <line x1={pad.left} x2={pad.left + innerW} y1={yFor(score)} y2={yFor(score)} stroke="#dfe4ea" />
            <text className="axis-label" x={12} y={yFor(score) + 4}>
              {score}
            </text>
          </g>
        ))}
        <polyline className="trend-line" points={points.join(" ")} />
        <circle cx={xFor(rows.length - 1)} cy={yFor(latestValue)} fill="#fff" r={6} stroke="#2667ff" strokeWidth={3} />
        <text className="axis-label" x={pad.left} y={height - 12}>
          {rows[0].date}
        </text>
        <text className="axis-label" textAnchor="end" x={pad.left + innerW} y={height - 12}>
          {latest.date}
        </text>
      </svg>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function chartValue(row: SignalSnapshot, mode: ChartMode) {
  if (mode === "risk") return row.riskScore;
  if (mode === "composite") return row.compositeScore;
  return row.healthScore;
}

function nearestSnapshot(rows: SignalSnapshot[], date: string) {
  return rows.find((row) => row.date === date) ?? rows[rows.length - 1];
}

function formatPct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("zh-TW").format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 2 }).format(value);
}

function formatSigned(value: number) {
  const formatted = new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 2 }).format(Math.abs(value));
  return `${value >= 0 ? "+" : "-"}${formatted}`;
}
