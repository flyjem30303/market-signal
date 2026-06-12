"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Asset } from "@/lib/assets";
import { StockSeoContent } from "@/components/stock-seo-content";
import { CommercialSlot } from "@/components/commercial-slot";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { HomeRuntimeStatusPanel } from "@/components/home-runtime-status-panel";
import { PublicBetaIndexDashboardBriefLoopPanel } from "@/components/public-beta-index-dashboard-brief-loop-panel";
import { PublicBetaRouteConsistencyPanel } from "@/components/public-beta-route-consistency-panel";
import { PublicBetaSourceCoverageRuntimeLabelsPanel } from "@/components/public-beta-source-coverage-runtime-labels-panel";
import { StockRuntimeAtAGlance } from "@/components/stock-runtime-at-a-glance";
import { TrackedLink } from "@/components/tracked-link";
import { TwiiMockDisclosureStatus } from "@/components/twii-mock-disclosure-status";
import {
  signalColor,
  type BacktestBucket,
  type NewsEvent,
  type SignalSnapshot
} from "@/lib/signal-model";
import { buildQuoteSnapshot, type QuoteSnapshot } from "@/lib/market-data";
import { buildMockDataFreshnessSnapshot, type DataFreshnessSnapshot } from "@/lib/data-freshness";
import { buildHomeMarketActionSummary } from "@/lib/home-market-action-summary";
import { buildInvestorActionSummary } from "@/lib/investor-action-summary";
import { getInvestorIndicatorRoadmap, type InvestorIndicatorStatus } from "@/lib/investor-indicator-roadmap";
import {
  getPublicBetaCoverageRolloutPlan,
  getPublicBetaDataRealizationRoadmap
} from "@/lib/public-beta-data-realization-roadmap";
import { getTwiiLocalDisclosureConsumerOutput } from "@/lib/twii-local-disclosure-consumer";
import {
  getMarketSignalRepository,
  type MarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import { trackEvent } from "@/lib/tracking";

type DashboardShellProps = {
  freshnessSnapshot?: DataFreshnessSnapshot;
  initialSymbol: string;
  includeSeoContent?: boolean;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
};

type TabKey = "today" | "trend" | "technical" | "volume" | "fundamentals" | "news" | "backtest";
type ChartMode = "health" | "risk" | "composite";

const today = "2026-05-28";

export function DashboardShell({
  freshnessSnapshot,
  initialSymbol,
  includeSeoContent = false,
  marketSignalSourceStatus
}: DashboardShellProps) {
  const router = useRouter();
  const [symbol, setSymbol] = useState(initialSymbol);
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("全部");
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
  const twiiMockDisclosure = useMemo(
    () =>
      getTwiiLocalDisclosureConsumerOutput({
        adapterOutput: {
          blockingReason: "rights_decision_required",
          canAwardRowCoverageCredit: false,
          canMapToDailyPrices: false,
          canSetScoreSourceReal: false,
          isRuntimeReady: false,
          parsedRowCount: 0,
          publicDataSource: "mock",
          reviewState: "parser_contract_waiting_for_rights_decision",
          scoreSource: "mock"
        }
      }),
    []
  );
  const assetGroups = useMemo(() => ["全部", ...Array.from(new Set(availableAssets.map((asset) => asset.group)))], [availableAssets]);
  const homeSnapshots = useMemo(
    () =>
      availableAssets
        .map((asset) => repository.getSnapshot(asset.symbol, today))
        .filter((item): item is SignalSnapshot => Boolean(item)),
    [availableAssets, repository]
  );
  const realEndIndex = endIndex || series.length - 1;
  const isFavorite = favorites.includes(selected.symbol);
  const filteredAssets = availableAssets.filter((asset) => {
    const matchesQuery = `${asset.symbol} ${asset.name} ${asset.group}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesGroup = activeGroup === "全部" || asset.group === activeGroup;

    return matchesQuery && matchesGroup;
  });
  const favoriteAssets = favorites
    .map((item) => repository.getAssetBySymbol(item))
    .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset));
  const peerSnapshots = useMemo(
    () => {
      const candidateAssets =
        selected.symbol === "TWII"
          ? availableAssets.filter((asset) => asset.symbol !== selected.symbol)
          : availableAssets.filter((asset) => asset.symbol !== selected.symbol && asset.group === selected.group);
      const fallbackAssets = availableAssets.filter((asset) => asset.symbol !== selected.symbol);

      return (candidateAssets.length ? candidateAssets : fallbackAssets)
        .map((asset) => repository.getSnapshot(asset.symbol, today))
        .filter((item): item is SignalSnapshot => Boolean(item))
        .slice(0, 4);
    },
    [availableAssets, repository, selected.group, selected.symbol]
  );
  const marketContext = useMemo(() => {
    const market = homeSnapshots.find((item) => item.asset.symbol === "TWII") ?? snapshot;
    const groupItems = homeSnapshots.filter((item) => item.asset.group === selected.group);
    const comparisonItems = groupItems.length ? groupItems : homeSnapshots;
    const groupAverage = comparisonItems.reduce(
      (summary, item) => {
        summary.compositeScore += item.compositeScore;
        summary.healthScore += item.healthScore;
        summary.riskScore += item.riskScore;
        return summary;
      },
      { compositeScore: 0, healthScore: 0, riskScore: 0 }
    );
    const count = comparisonItems.length || 1;

    return {
      groupAverage: {
        compositeScore: Math.round(groupAverage.compositeScore / count),
        healthScore: Math.round(groupAverage.healthScore / count),
        riskScore: Math.round(groupAverage.riskScore / count)
      },
      groupCount: comparisonItems.length,
      market
    };
  }, [homeSnapshots, selected.group, snapshot]);

  useEffect(() => {
    setSymbol(initialSymbol);
  }, [initialSymbol]);

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

  function toggleFavorite(target: string, source = "favorite_button") {
    setFavorites((current) => {
      const next = current.includes(target) ? current.filter((item) => item !== target) : [...current, target];
      trackEvent(current.includes(target) ? "favorite_removed" : "favorite_added", { source, symbol: target });
      window.localStorage.setItem("marketSignalFavorites", JSON.stringify(next));
      return next;
    });
  }

  function selectAsset(nextSymbol: string, source = "asset_selector") {
    trackEvent("asset_selected", { source, symbol: nextSymbol });
    setSymbol(nextSymbol);
    setQuery("");
    if (includeSeoContent && nextSymbol !== selected.symbol) {
      router.push(`/stocks/${nextSymbol}`);
    }
  }

  function changeTab(nextTab: TabKey, source = "content_button") {
    trackEvent("tab_changed", { source, symbol: selected.symbol, tab: nextTab });
    setActiveTab(nextTab);
  }

  function changeNewsDate(nextDate: string) {
    trackEvent("news_date_changed", { symbol: selected.symbol, date: nextDate });
    setNewsDate(nextDate);
  }

  function changeChartMode(nextMode: ChartMode) {
    trackEvent("chart_mode_changed", { symbol: selected.symbol, mode: nextMode });
    setChartMode(nextMode);
  }

  function changeQuery(nextQuery: string) {
    const normalized = nextQuery.trim();
    const nextResultCount = availableAssets.filter((asset) => {
      const matchesQuery = `${asset.symbol} ${asset.name} ${asset.group}`.toLowerCase().includes(normalized.toLowerCase());
      const matchesGroup = activeGroup === "全部" || asset.group === activeGroup;

      return matchesQuery && matchesGroup;
    }).length;

    if (!normalized || normalized.length >= 2) {
      trackEvent("asset_search_changed", {
        activeGroup,
        queryLength: normalized.length,
        resultCount: nextResultCount,
        symbol: selected.symbol
      });
    }
    setQuery(nextQuery);
  }

  function changeGroup(nextGroup: string) {
    trackEvent("asset_group_changed", { group: nextGroup, symbol: selected.symbol });
    setActiveGroup(nextGroup);
  }

  function clearQuery(source: string) {
    trackEvent("asset_search_cleared", { activeGroup, source, symbol: selected.symbol });
    setQuery("");
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Market Signal Dashboard</p>
        <h1>
          {includeSeoContent
            ? `${selected.symbol} ${selected.name} 狀態儀表：${snapshot.signal.title}`
            : "指數狀態儀表站"}
        </h1>
        <p>
          {includeSeoContent
            ? `目前 ${selected.symbol} 仍以 mock-only 資料呈現，協助使用者快速理解狀態、風險與資料品質；不構成投資建議，也尚未啟用真實資料推廣。`
            : "用紅黃綠燈、核心指標與警示清單，把市場氛圍整理成 30 秒可讀、3 分鐘可行動的決策輔助畫面。目前仍為 mock-only 公開 Beta。"}
        </p>
      </section>

      <AssetSelector
        assets={availableAssets}
        activeGroup={activeGroup}
        favorites={favoriteAssets}
        filteredAssets={filteredAssets}
        groups={assetGroups}
        isFavorite={isFavorite}
        query={query}
        selectedSymbol={selected.symbol}
        onFavorite={toggleFavorite}
        onGroup={changeGroup}
        onQuery={changeQuery}
        onQueryClear={clearQuery}
        onSelect={selectAsset}
      />

      {!includeSeoContent && <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />}

      {!includeSeoContent && <PublicBetaIndexDashboardBriefLoopPanel />}

      {!includeSeoContent && <PublicBetaRouteConsistencyPanel context="home" stockSymbol={selected.symbol} />}

      {!includeSeoContent && <PublicBetaSourceCoverageRuntimeLabelsPanel context="home" stockSymbol={selected.symbol} />}

      {!includeSeoContent && (
        <HomeProductOverview
          scoreSourceLabel={freshness.scoreSourceLabel}
          selected={selected}
          snapshots={homeSnapshots}
          snapshot={snapshot}
          onTab={changeTab}
        />
      )}

      {!includeSeoContent && <HomeRuntimeStatusPanel selectedSymbol={selected.symbol} />}

      {includeSeoContent && (
        <>
          <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
          <StockRuntimeAtAGlance scoreSourceLabel={freshness.scoreSourceLabel} snapshot={snapshot} />
          <PublicBetaRouteConsistencyPanel context="stock" stockSymbol={selected.symbol} />
          <PublicBetaSourceCoverageRuntimeLabelsPanel context="stock" stockSymbol={selected.symbol} />
          <StockRuntimeBrief scoreSourceLabel={freshness.scoreSourceLabel} snapshot={snapshot} onTab={changeTab} />
          <StockSignalWhyPanel snapshot={snapshot} onTab={changeTab} />
          {selected.symbol === "TWII" && (
            <TwiiMockDisclosureStatus
              disclosure={twiiMockDisclosure}
              label="TWII stock page mock disclosure status"
            />
          )}
          <StockEvidenceSnapshot snapshot={snapshot} />
          <StockDataGapPanel snapshot={snapshot} onTab={changeTab} />
          <StockDecisionCompass scoreSourceLabel={freshness.scoreSourceLabel} snapshot={snapshot} />
          <StockInvestorActionSummary snapshot={snapshot} onTab={changeTab} />
          <StockInvestorIndicatorRoadmap />
          <StockMarketContextPanel
            groupAverage={marketContext.groupAverage}
            groupCount={marketContext.groupCount}
            market={marketContext.market}
            selected={selected}
            snapshot={snapshot}
          />
          <QuoteSummary asset={selected} isFavorite={isFavorite} quote={quote} snapshot={snapshot} onFavorite={toggleFavorite} />
          <StockPeerNavigator peers={peerSnapshots} selected={selected} />
          <StockPageCompass activeTab={activeTab} onTab={changeTab} />
          <StockModuleHighlights snapshot={snapshot} onTab={changeTab} />
          <StockRiskChecklist snapshot={snapshot} onTab={changeTab} />
          <StockNextStepGuide snapshot={snapshot} onTab={changeTab} />
        </>
      )}

      <nav className="tabs" aria-label="股票內容分頁">
        {(includeSeoContent
          ? [
              ["today", "今日"],
              ["trend", "趨勢"],
              ["technical", "技術"],
              ["volume", "量能"],
              ["fundamentals", "基本面 / 籌碼"],
              ["news", "新聞"],
              ["backtest", "回測"],
            ]
          : [
              ["today", "今日燈號"],
              ["trend", "市場趨勢"],
              ["news", "新聞摘要"],
              ["backtest", "回測摘要"]
            ]
        ).map(([key, label]) => (
          <button
            className={activeTab === key ? "tab-button active" : "tab-button"}
            key={key}
            onClick={() => changeTab(key as TabKey, "top_tabs")}
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
          onChartMode={changeChartMode}
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
          <StockPageFollowUpLinks selected={selected} />
        </>
      )}
    </main>
  );
}

function StockPageFollowUpLinks({ selected }: { selected: Asset }) {
  const linkPayload = { area: "stock_follow_up", symbol: selected.symbol };

  return (
    <section className="panel stock-follow-up-links" aria-label="Stock Page Follow Up Links">
      <div>
        <p className="eyebrow">After Reading</p>
        <h2>看完 {selected.symbol} 後</h2>
        <p>回到市場層級交叉檢查，避免只用單一標的或單日 mock 分數形成判斷。</p>
      </div>
      <nav>
        <TrackedLink className="text-link" eventName="stock_link_clicked" href="/briefing" label="看每日晨報" payload={linkPayload}>
          看每日晨報
        </TrackedLink>
        <TrackedLink className="text-link" eventName="stock_link_clicked" href="/weekly" label="看本週週報" payload={linkPayload}>
          看本週週報
        </TrackedLink>
        <TrackedLink className="text-link" eventName="stock_link_clicked" href="/" label="回首頁看覆蓋地圖" payload={linkPayload}>
          回首頁看覆蓋地圖
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/methodology" label="確認方法論" payload={linkPayload}>
          確認方法論
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="確認免責聲明" payload={linkPayload}>
          確認免責聲明
        </TrackedLink>
      </nav>
    </section>
  );
}

function HomeProductOverview({
  scoreSourceLabel,
  selected,
  snapshots,
  snapshot,
  onTab
}: {
  scoreSourceLabel: string;
  selected: Asset;
  snapshots: SignalSnapshot[];
  snapshot: SignalSnapshot;
  onTab: (tab: TabKey, source?: string) => void;
}) {
  const riskState = snapshot.riskScore >= 70 ? "高風險" : snapshot.riskScore >= 55 ? "需觀察" : "相對穩定";
  const gapCount = snapshot.missingModuleFlags.length + snapshot.staleDataFlags.length;
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const riskiest = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore).slice(0, 4);
  const marketSnapshot = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshot;
  const strongestSnapshot = strongest[0] ?? snapshot;
  const riskiestSnapshot = riskiest[0] ?? snapshot;
  const groupSummaries = buildHomeGroupSummaries(snapshots);
  const actionSummary = buildHomeMarketActionSummary(snapshot, snapshots);
  const indicatorRoadmap = getInvestorIndicatorRoadmap();
  const visibleIndicatorFamilies = indicatorRoadmap.families.slice(0, 3);
  const dataRealizationRoadmap = getPublicBetaDataRealizationRoadmap();
  const coverageRolloutPlan = getPublicBetaCoverageRolloutPlan();
  const alertUpdateTime = snapshot.lastUpdatedAt.replace("T", " ").replace("+08:00", " 台北時間");
  const breadth = snapshots.reduce(
    (summary, item) => {
      if (item.signal.key === "green" || item.signal.key === "yellow") {
        summary.constructive += 1;
      } else if (item.signal.key === "orange") {
        summary.watch += 1;
      } else {
        summary.defensive += 1;
      }

      return summary;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
  const decision =
    snapshot.riskScore >= 60
      ? {
          action: "先拆風險來源",
          href: `/stocks/${riskiestSnapshot.asset.symbol}`,
          label: `${riskiestSnapshot.asset.symbol} 風險 ${riskiestSnapshot.riskScore}/100`,
          reason: "目前選取標的風險偏高，先確認風險模組與資料旗標，再閱讀趨勢。"
        }
      : breadth.defensive > breadth.constructive
        ? {
            action: "先看防守清單",
            href: "/briefing#watchlists",
            label: `${breadth.defensive} 檔防守優先`,
            reason: "防守標的多於強勢標的，今天先用晨報確認市場廣度是否轉弱。"
          }
        : {
            action: "先看強勢延伸",
            href: `/stocks/${strongestSnapshot.asset.symbol}`,
            label: `${strongestSnapshot.asset.symbol} 綜合 ${strongestSnapshot.compositeScore}/100`,
            reason: "市場廣度尚可，先從強勢標的確認趨勢是否連續，但仍維持 mock 邊界。"
          };
  const publicDashboardAlerts = [
    {
      cause: gapCount > 0 ? `${gapCount} 個資料旗標仍需補齊，公開解讀先維持降級。` : "目前沒有額外資料旗標，但仍維持 mock 邊界。",
      href: `/stocks/${selected.symbol}`,
      impact: gapCount > 0 ? "高" : "中",
      label: `${selected.symbol} 資料品質`,
      next: gapCount > 0 ? "先確認資料缺口，再閱讀分數。" : "可閱讀分數，但仍不可當成正式決策依據。",
      status: gapCount > 0 ? "資料待補" : "可閱讀",
      title: "資料可靠度"
    },
    {
      cause: `${riskiestSnapshot.asset.symbol} 風險分數 ${riskiestSnapshot.riskScore}/100，是目前最需要留意的標的。`,
      href: `/stocks/${riskiestSnapshot.asset.symbol}`,
      impact: riskiestSnapshot.riskScore >= 70 ? "高" : "中",
      label: `${riskiestSnapshot.asset.symbol} 風險來源`,
      next: "先拆解風險來源，再決定是否加強觀察或降低曝險。",
      status: riskiestSnapshot.riskScore >= 70 ? "風險升溫" : "持續觀察",
      title: "風險警示"
    },
    {
      cause: `市場分布為正向 ${breadth.constructive}、觀察 ${breadth.watch}、防守 ${breadth.defensive}。`,
      href: "/briefing",
      impact: breadth.defensive > breadth.constructive ? "中高" : "中",
      label: "市場晨報",
      next: breadth.defensive > breadth.constructive ? "優先看防守清單與市場廣度。" : "先看強勢是否延續，再對照風險。",
      status: breadth.defensive > breadth.constructive ? "防守優先" : "市場偏穩",
      title: "市場氛圍"
    }
  ];
  const coreIndicatorReadouts = [
    {
      action: "\u5148\u5224\u65b7\u5e02\u5834\u6c23\u6c1b\u662f\u5426\u503c\u5f97\u95dc\u6ce8",
      label: "\u5e02\u5834\u6c23\u6c1b",
      note: "\u7528\u7d9c\u5408\u5206\u6578\u628a\u76ee\u524d\u5e02\u5834\u7684\u5f37\u5f31\u8f49\u6210\u4e00\u500b\u5feb\u8b80\u8d77\u9ede\uff0c\u9084\u4e0d\u662f\u771f\u5be6\u6295\u8cc7\u8a0a\u865f\u3002",
      state: marketSnapshot.signal.title,
      tone: marketSnapshot.compositeScore >= 70 ? "constructive" : marketSnapshot.compositeScore >= 55 ? "watch" : "defensive",
      value: `${marketSnapshot.compositeScore}/100`
    },
    {
      action: snapshot.riskScore >= 60 ? "\u512a\u5148\u52a0\u5f37\u89c0\u5bdf\u98a8\u96aa\u4f86\u6e90" : "\u7e7c\u7e8c\u8ffd\u8e64\u98a8\u96aa\u662f\u5426\u64f4\u6563",
      label: "\u98a8\u96aa\u71b1\u5ea6",
      note: "\u628a\u56de\u6a94\u3001\u6ce2\u52d5\u8207\u8cc7\u6599\u7f3a\u53e3\u4e00\u8d77\u653e\u9032\u89c0\u5bdf\uff0c\u907f\u514d\u53ea\u770b\u4e00\u500b\u6578\u5b57\u5c31\u8ffd\u50f9\u3002",
      state: riskState,
      tone: snapshot.riskScore >= 70 ? "defensive" : snapshot.riskScore >= 55 ? "watch" : "constructive",
      value: `${snapshot.riskScore}/100`
    },
    {
      action: gapCount > 0 ? "\u628a\u7d50\u8ad6\u8996\u70ba\u793a\u7bc4\u95b1\u8b80\uff0c\u7b49\u5f85\u771f\u5be6\u8cc7\u6599\u88dc\u9f4a" : "\u53ef\u5148\u7576\u4f5c\u7a69\u5b9a\u793a\u7bc4\u6d41\u7a0b\u95b1\u8b80",
      label: "\u8cc7\u6599\u53ef\u4fe1\u5ea6",
      note: "\u76ee\u524d\u4ecd\u70ba mock-only\uff1b\u771f\u5be6\u8cc7\u6599\u4e0a\u7dda\u8981\u7b49\u4f86\u6e90\u3001\u8986\u84cb\u7387\u3001\u56de\u9000\u8207\u6642\u9593\u6233\u90fd\u901a\u904e\u3002",
      state: `${gapCount} \u500b\u5f85\u88dc\u9f4a\u9805\u76ee`,
      tone: gapCount > 0 ? "watch" : "constructive",
      value: snapshot.dataQualityGrade
    }
  ];

  return (
    <>
      <section className="home-product-overview" aria-label="首頁快速摘要">
        <article className="home-primary-card">
          <p className="eyebrow">Quick Start</p>
          <h2>
            先用 {selected.symbol} {selected.name} 建立今日閱讀節奏
          </h2>
          <p>
            目前分數來源為 {scoreSourceLabel}。這個首頁先協助你理解標的狀態、風險溫度與資料限制，
            不把 mock 分數包裝成正式決策依據。
          </p>
          <div className="home-action-row">
            <a
              className="solid-button"
              href={`/stocks/${selected.symbol}`}
              onClick={() => trackEvent("home_cta_clicked", { action: "stock", href: `/stocks/${selected.symbol}`, symbol: selected.symbol })}
            >
              前往股票頁
            </a>
            <a
              className="outline-button"
              href="/briefing"
              onClick={() => trackEvent("home_cta_clicked", { action: "briefing", href: "/briefing", symbol: selected.symbol })}
            >
              查看晨報
            </a>
            <a
              className="outline-button"
              href="/weekly"
              onClick={() => trackEvent("home_cta_clicked", { action: "weekly", href: "/weekly", symbol: selected.symbol })}
            >
              看週報
            </a>
            <button
              className="outline-button"
              onClick={() => {
                trackEvent("home_cta_clicked", { action: "trend_tab", href: "#trend", symbol: selected.symbol });
                onTab("trend", "home_quick_start");
              }}
              type="button"
            >
              看趨勢
            </button>
          </div>
        </article>

        <div className="home-overview-grid">
          <article>
            <span>今日燈號</span>
            <strong style={{ color: signalColor(snapshot.signal.key) }}>{snapshot.signal.title}</strong>
            <p>{snapshot.signal.text}</p>
          </article>
          <article>
            <span>健康 / 風險</span>
            <strong>
              {snapshot.healthScore} / {snapshot.riskScore}
            </strong>
            <p>風險狀態：{riskState}。先看趨勢與資料旗標，再形成判讀。</p>
          </article>
          <article>
            <span>資料限制</span>
            <strong>{gapCount} 項旗標</strong>
            <p>正式資料來源與公開宣稱仍未完成前，所有分數只支援產品體驗。</p>
          </article>
        </div>
      </section>

      <section className="home-public-beta-loop" aria-label="公開 Beta 指數狀態儀表站">
        <div className="home-public-beta-loop-head">
          <p className="eyebrow">Public Beta Index Dashboard</p>
          <h2>30 秒看懂市場氛圍，3 分鐘決定關注、加強觀察或減少風險</h2>
          <p>
            這裡把首頁收斂成三層：全市場總覽、核心指標面板、警示清單。資料仍以
            publicDataSource=mock、scoreSource=mock 呈現，只做資訊閱讀與產品驗證。
          </p>
        </div>
        <div className="home-public-beta-layer-grid">
          <article className="home-public-beta-layer overview">
            <span>全市場總覽</span>
            <strong>{marketSnapshot.signal.title}</strong>
            <p>
              目前市場氛圍：正向 {breadth.constructive}、觀察 {breadth.watch}、防守 {breadth.defensive}。
              先看大盤燈號，再決定是否進入 ETF、板塊或個股頁。
            </p>
            <small>更新時間：{alertUpdateTime}</small>
          </article>
          <article className="home-public-beta-layer indicators">
            <span>核心指標面板</span>
            <strong>
              健康 {snapshot.healthScore} / 風險 {snapshot.riskScore} / 資料 {snapshot.dataQualityGrade}
            </strong>
            <p>
              核心讀法：燈號看方向，健康分數看結構，風險分數看回撤壓力，資料等級決定是否需要降級解讀。
            </p>
            <small>資料旗標：{gapCount} 項</small>
          </article>
          <article className="home-public-beta-layer alerts">
            <span>警示清單</span>
            <strong>{publicDashboardAlerts.length} 則待閱讀警示</strong>
            <p>每則警示都包含狀態、成因、更新時間、影響級別與下一步建議，避免只看單一數字誤判。</p>
            <small>非投資建議；不提供買賣指令或績效承諾。</small>
          </article>
        </div>
        <section className="home-core-indicator-readout" aria-label="\u6838\u5fc3\u6307\u6a19\u5feb\u8b80">
          <div>
            <p className="eyebrow">Core Indicator Readout</p>
            <h3>{"\u6838\u5fc3\u6307\u6a19\u5feb\u8b80"}</h3>
            <p>
              {"\u9019\u4e00\u5340\u628a\u5e02\u5834\u6c23\u6c1b\u3001\u98a8\u96aa\u71b1\u5ea6\u8207\u8cc7\u6599\u53ef\u4fe1\u5ea6\u653e\u5728\u540c\u4e00\u500b\u9762\u677f\uff0c\u8b93\u4f7f\u7528\u8005\u5148\u77e5\u9053\u70ba\u4ec0\u9ebc\u662f\u7da0\u3001\u9ec3\u6216\u7d05\uff0c\u518d\u6c7a\u5b9a\u8981\u95dc\u6ce8\u3001\u52a0\u5f37\u89c0\u5bdf\u6216\u6e1b\u5c11\u98a8\u96aa\u3002"}
            </p>
          </div>
          <div className="home-core-indicator-grid">
            {coreIndicatorReadouts.map((item) => (
              <article className={item.tone} key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.state}</p>
                <small>{item.note}</small>
                <em>{item.action}</em>
              </article>
            ))}
          </div>
        </section>
        <div className="home-public-beta-alert-list">
          {publicDashboardAlerts.map((alert) => (
            <TrackedLink
              eventName="home_cta_clicked"
              href={alert.href}
              key={alert.title}
              label={alert.label}
              payload={{ action: "public_beta_alert", alert: alert.title, symbol: selected.symbol }}
            >
              <span>{alert.status}</span>
              <strong>{alert.title}</strong>
              <dl>
                <div>
                  <dt>成因</dt>
                  <dd>{alert.cause}</dd>
                </div>
                <div>
                  <dt>更新時間</dt>
                  <dd>{alertUpdateTime}</dd>
                </div>
                <div>
                  <dt>影響級別</dt>
                  <dd>{alert.impact}</dd>
                </div>
                <div>
                  <dt>下一步建議</dt>
                  <dd>{alert.next}</dd>
                </div>
              </dl>
            </TrackedLink>
          ))}
        </div>
      </section>

      <section className="public-beta-data-realization-roadmap" aria-label="資料真實化路徑">
        <div className="public-beta-data-realization-head">
          <p className="eyebrow">資料真實化路徑</p>
          <h2>{dataRealizationRoadmap.headline}</h2>
          <p>{dataRealizationRoadmap.summary}</p>
          <p>{dataRealizationRoadmap.disclosure}</p>
        </div>
        <div className="public-beta-data-realization-grid">
          {dataRealizationRoadmap.stages.map((stage) => (
            <article className={stage.tone} key={stage.id}>
              <span>{stage.label}</span>
              <strong>{stage.publicMeaning}</strong>
              <p>{stage.currentState}</p>
              <small>下一步：{stage.nextStep}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="public-beta-coverage-rollout" aria-label="Coverage rollout plan">
        <div className="public-beta-coverage-rollout-head">
          <p className="eyebrow">覆蓋率展開</p>
          <h2>{coverageRolloutPlan.headline}</h2>
          <p>{coverageRolloutPlan.summary}</p>
          <p>{coverageRolloutPlan.disclosure}</p>
        </div>
        <div className="public-beta-coverage-batches">
          {coverageRolloutPlan.batches.map((batch) => (
            <article className={batch.tone} key={batch.id}>
              <span>{batch.label}</span>
              <strong>{batch.publicValue}</strong>
              <p>{batch.currentState}</p>
              <small>下一步：{batch.nextStep}</small>
            </article>
          ))}
        </div>
        <div className="public-beta-promotion-checklist">
          {coverageRolloutPlan.checklist.map((item) => (
            <article className={item.status} key={item.id}>
              <span>{item.label}</span>
              <strong>{item.publicWording}</strong>
              <p>{item.notYetClaimed}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="public-beta-batch1-readiness" aria-label="Batch 1 readiness checklist">
        <div className="public-beta-batch1-readiness-head">
          <p className="eyebrow">下一個資料步驟</p>
          <h2>先把大盤與核心 ETF 變成可驗證資料</h2>
          <p>
            下一階段先處理 TWII 與核心 ETF，目標是讓使用者能用同一套口徑看市場氣氛。現在仍是 mock 閱讀模式，
            尚未宣稱正式市場資料或正式評分。
          </p>
        </div>
        <div className="public-beta-batch1-readiness-grid">
          {coverageRolloutPlan.batch1UserSteps.map((item) => (
            <article className={item.status} key={item.id}>
              <span>{item.label}</span>
              <strong>{item.message}</strong>
              <small>下一步：{item.nextStep}</small>
            </article>
          ))}
        </div>
        <TrackedLink
          className="inline-status-link"
          eventName="home_cta_clicked"
          href="/briefing"
          label="查看 Batch 1 readiness 細節"
          payload={{ action: "batch1_readiness_detail", symbol: selected.symbol }}
        >
          查看資料真實化審核細節
        </TrackedLink>
      </section>

      <section className="home-market-action-summary" aria-label="首頁市場行動摘要">
        <div>
          <p className="eyebrow">Market Action Summary</p>
          <h2>{actionSummary.headline}</h2>
          <p>{actionSummary.marketBreadthLine}</p>
          <p>{actionSummary.stopLine}</p>
        </div>
        <TrackedLink
          eventName="home_cta_clicked"
          href={actionSummary.primaryAction.href}
          label={actionSummary.primaryAction.label}
          payload={{ action: "home_market_action_primary", symbol: selected.symbol }}
        >
          <article className={actionSummary.primaryAction.tone}>
            <span>主入口</span>
            <strong>{actionSummary.primaryAction.title}</strong>
            <p>{actionSummary.primaryAction.body}</p>
          </article>
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href={actionSummary.secondaryAction.href}
          label={actionSummary.secondaryAction.label}
          payload={{ action: "home_market_action_secondary", symbol: selected.symbol }}
        >
          <article className={actionSummary.secondaryAction.tone}>
            <span>對照入口</span>
            <strong>{actionSummary.secondaryAction.title}</strong>
            <p>{actionSummary.secondaryAction.body}</p>
          </article>
        </TrackedLink>
      </section>

      <section className="home-indicator-roadmap" aria-label="首頁未來專業指標路線">
        <div>
          <p className="eyebrow">Indicator Roadmap</p>
          <h2>未來專業指標仍在準備階段</h2>
          <p>{indicatorRoadmap.boundary.statement}</p>
          <strong>
            資料基礎 {indicatorRoadmap.nextExecutionRatio.runtimeDataFoundation}% · 產品文字{" "}
            {indicatorRoadmap.nextExecutionRatio.productReadabilityAndWording}% · Future notes{" "}
            {indicatorRoadmap.nextExecutionRatio.futureIndicatorDesignNotes}%
          </strong>
        </div>
        {visibleIndicatorFamilies.map((family) => (
          <article className={family.status} key={family.id}>
            <span>{getInvestorIndicatorStatusLabel(family.status)}</span>
            <strong>{family.label}</strong>
            <p>{family.productValue}</p>
          </article>
        ))}
      </section>

      <section className="home-decision-strip" aria-label="首頁下一步決策列">
        <div>
          <p className="eyebrow">Decision Compass</p>
          <h2>{decision.action}</h2>
          <p>{decision.reason}</p>
          <p>先判斷市場節奏，再對照大盤，最後才進入 ETF 或個股拆解；目前仍是 mock-only 閱讀模式。</p>
        </div>
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="先看市場晨報" payload={{ action: "decision_compass_briefing", symbol: selected.symbol }}>
          <span>1 · 市場節奏</span>
          <strong>先看市場晨報</strong>
          <p>先用市場廣度、風險清單與資料完整度判斷今天該偏觀察、進攻或防守。</p>
        </TrackedLink>
        <TrackedLink eventName="home_cta_clicked" href={`/stocks/${marketSnapshot.asset.symbol}`} label={`${marketSnapshot.asset.symbol} ${marketSnapshot.signal.title}`} payload={{ action: "decision_compass_market", symbol: marketSnapshot.asset.symbol }}>
          <span>2 · 大盤基準</span>
          <strong>{marketSnapshot.asset.symbol} {marketSnapshot.signal.title}</strong>
          <p>用台指頁確認大盤健康、風險與 TWII mock disclosure，再決定要不要看個別標的。</p>
        </TrackedLink>
        <TrackedLink eventName="home_cta_clicked" href={decision.href} label={decision.label} payload={{ action: "decision_compass_target", symbol: selected.symbol }}>
          <span>3 · 標的拆解</span>
          <strong>{decision.label}</strong>
          <p>最後才進入 ETF 或個股頁，檢查模組、趨勢與 mock 分數邊界，不把它當買賣建議。</p>
        </TrackedLink>
      </section>

      <section className="home-reading-route" aria-label="三分鐘閱讀路線">
        <div className="home-reading-route-head">
          <p className="eyebrow">Reading Route</p>
          <h2>三分鐘先看這三件事</h2>
          <p>首頁先幫新使用者建立閱讀順序：市場、指數、個別標的。每一步仍維持 mock 邊界，不提供買賣建議。</p>
        </div>
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="先看市場晨報" payload={{ action: "reading_route_briefing", symbol: selected.symbol }}>
          <span>1</span>
          <strong>先看市場晨報</strong>
          <p>用市場廣度與風險清單判斷今天該偏進攻、觀察或防守。</p>
        </TrackedLink>
        <TrackedLink eventName="home_cta_clicked" href={`/stocks/${marketSnapshot.asset.symbol}`} label="再看台指狀態" payload={{ action: "reading_route_market", symbol: marketSnapshot.asset.symbol }}>
          <span>2</span>
          <strong>再看台指狀態</strong>
          <p>
            {marketSnapshot.asset.symbol} {marketSnapshot.signal.title}，確認大盤健康度與資料品質。
          </p>
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href={`/stocks/${snapshot.riskScore >= 60 ? riskiestSnapshot.asset.symbol : strongestSnapshot.asset.symbol}`}
          label={snapshot.riskScore >= 60 ? "最後拆風險來源" : "最後找強勢延伸"}
          payload={{
            action: snapshot.riskScore >= 60 ? "reading_route_risk" : "reading_route_strength",
            symbol: snapshot.riskScore >= 60 ? riskiestSnapshot.asset.symbol : strongestSnapshot.asset.symbol
          }}
        >
          <span>3</span>
          <strong>{snapshot.riskScore >= 60 ? "最後拆風險來源" : "最後找強勢延伸"}</strong>
          <p>
            {snapshot.riskScore >= 60
              ? `${riskiestSnapshot.asset.symbol} 風險 ${riskiestSnapshot.riskScore}/100，先確認波動與資料旗標。`
              : `${strongestSnapshot.asset.symbol} 綜合 ${strongestSnapshot.compositeScore}/100，先看趨勢是否連續。`}
          </p>
        </TrackedLink>
      </section>

      <section className="home-market-breadth" aria-label="首頁市場廣度摘要">
        <article className="positive">
          <span>強勢延伸</span>
          <strong>{breadth.constructive}</strong>
          <p>綠燈與黃燈標的數量。數量越多，代表 mock 訊號中的多頭結構較廣。</p>
        </article>
        <article className="watch">
          <span>需要觀察</span>
          <strong>{breadth.watch}</strong>
          <p>橘燈標的數量。這些標的適合先拆解風險來源，不急著放大解讀。</p>
        </article>
        <article className="risk">
          <span>防守優先</span>
          <strong>{breadth.defensive}</strong>
          <p>紅燈與深紅標的數量。若升高，首頁閱讀順序應先看風險清單。</p>
        </article>
      </section>

      <HomeGroupOverview groups={groupSummaries} />

      <section className="home-watchlists" aria-label="首頁市場觀察清單">
        <HomeWatchlist title="今日強勢觀察" description="綜合分數較高的標的，適合先看趨勢是否連續。" items={strongest} valueKey="composite" />
        <HomeWatchlist title="風險升溫觀察" description="風險分數較高的標的，追價前應先拆解風險來源。" items={riskiest} valueKey="risk" />
      </section>
    </>
  );
}

function buildHomeGroupSummaries(snapshots: SignalSnapshot[]) {
  return Object.values(
    snapshots.reduce<
      Record<
        string,
        {
          count: number;
          group: string;
          leading: SignalSnapshot;
          riskTotal: number;
        }
      >
    >((summary, item) => {
      const current = summary[item.asset.group] ?? {
        count: 0,
        group: item.asset.group,
        leading: item,
        riskTotal: 0
      };
      current.count += 1;
      current.riskTotal += item.riskScore;
      if (item.compositeScore > current.leading.compositeScore) {
        current.leading = item;
      }
      summary[item.asset.group] = current;

      return summary;
    }, {})
  )
    .map((item) => ({
      averageRisk: Math.round(item.riskTotal / item.count),
      count: item.count,
      group: item.group,
      leading: item.leading
    }))
    .sort((a, b) => b.leading.compositeScore - a.leading.compositeScore);
}

function HomeGroupOverview({
  groups
}: {
  groups: Array<{ averageRisk: number; count: number; group: string; leading: SignalSnapshot }>;
}) {
  return (
    <section className="home-group-overview" aria-label="首頁群組覆蓋摘要">
      <div className="home-group-overview-head">
        <p className="eyebrow">Coverage Map</p>
        <h2>目前 mock 清單覆蓋</h2>
        <p>這裡只顯示目前產品驗證清單中的群組，協助快速探索，不代表完整台股市場覆蓋。</p>
      </div>
      <div className="home-group-grid">
        {groups.map((item) => (
          <TrackedLink
            eventName="stock_link_clicked"
            href={`/stocks/${item.leading.asset.symbol}`}
            key={item.group}
            label={`${item.group} ${item.leading.asset.symbol}`}
            payload={{ area: "home_group_overview", group: item.group, symbol: item.leading.asset.symbol }}
          >
            <span>{item.group}</span>
            <strong>{item.leading.asset.symbol} {item.leading.asset.name}</strong>
            <small>{item.count} 檔 mock 標的 · 平均風險 {item.averageRisk}/100</small>
            <b style={{ color: signalColor(item.leading.signal.key) }}>{item.leading.signal.title}</b>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}

function HomeWatchlist({
  title,
  description,
  items,
  valueKey
}: {
  title: string;
  description: string;
  items: SignalSnapshot[];
  valueKey: "composite" | "risk";
}) {
  return (
    <article className="home-watchlist-card">
      <div>
        <p className="eyebrow">Watchlist</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="home-watchlist-rows">
        {items.map((item) => (
          <TrackedLink
            eventName="stock_link_clicked"
            href={`/stocks/${item.asset.symbol}`}
            key={`${title}-${item.asset.symbol}`}
            label={`${title} ${item.asset.symbol}`}
            payload={{ area: "home_watchlist", list: title, metric: valueKey, symbol: item.asset.symbol }}
          >
            <span>
              <strong>{item.asset.symbol}</strong>
              <small>{item.asset.name}</small>
            </span>
            <em>{item.signal.title}</em>
            <b>
              <small>{valueKey === "risk" ? "風險" : "綜合"}</small>
              {valueKey === "risk" ? item.riskScore : item.compositeScore}
            </b>
          </TrackedLink>
        ))}
      </div>
    </article>
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
  onFavorite: (symbol: string, source?: string) => void;
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
            <TrackedLink className="outline-button" eventName="trust_link_clicked" href="/methodology" label="比較模型" payload={{ area: "quote_actions", symbol: asset.symbol }}>
              比較模型
            </TrackedLink>
            <button className={isFavorite ? "solid-button active" : "solid-button"} onClick={() => onFavorite(asset.symbol, "quote_actions")} type="button">
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

function StockPeerNavigator({ peers, selected }: { peers: SignalSnapshot[]; selected: Asset }) {
  if (!peers.length) return null;
  const hasSameGroupPeers = peers.some((peer) => peer.asset.group === selected.group);

  return (
    <section className="stock-peer-navigator" aria-label="Related Stock Navigation">
      <div>
        <p className="eyebrow">Related Signals</p>
        <h2>
          {selected.symbol === "TWII"
            ? "從大盤延伸看代表標的"
            : hasSameGroupPeers
              ? `同類標的：${selected.group}`
              : "延伸閱讀代表標的"}
        </h2>
        <p>這裡只提供 mock 清單中的延伸閱讀，不代表完整市場覆蓋，也不構成推薦排序。</p>
      </div>
      <div className="peer-link-grid">
        {peers.map((peer) => (
          <TrackedLink
            eventName="stock_link_clicked"
            href={`/stocks/${peer.asset.symbol}`}
            key={peer.asset.symbol}
            label={`${peer.asset.symbol} ${peer.asset.name}`}
            payload={{ area: "stock_peer_navigator", fromSymbol: selected.symbol, symbol: peer.asset.symbol }}
          >
            <span>{peer.asset.symbol}</span>
            <strong>{peer.asset.name}</strong>
            <small>{peer.asset.group}</small>
            <b style={{ color: signalColor(peer.signal.key) }}>{peer.signal.title}</b>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}

function StockSignalWhyPanel({ snapshot, onTab }: { snapshot: SignalSnapshot; onTab: (tab: TabKey) => void }) {
  const riskTone = snapshot.riskScore >= 70 ? "defensive" : snapshot.riskScore >= 55 ? "watch" : "constructive";
  const dataWarningCount = snapshot.missingModuleFlags.length + snapshot.staleDataFlags.length;
  const dataTone = dataWarningCount > 0 ? "watch" : "constructive";
  const structureTone = snapshot.healthScore >= 70 ? "constructive" : snapshot.healthScore >= 55 ? "watch" : "defensive";
  const items = [
    {
      action: snapshot.healthScore >= 70 ? "\u53ef\u4ee5\u5148\u89c0\u5bdf\u8d70\u52e2\u662f\u5426\u9023\u7e8c" : "\u5148\u56de\u5230\u8d8b\u52e2\u9801\u6aa2\u67e5\u5206\u6578\u662f\u5426\u65b7\u88c2",
      label: "\u7d50\u69cb\u652f\u6490",
      note: `\u5065\u5eb7\u5206\u6578 ${snapshot.healthScore}/100\uff0c\u7528\u4f86\u5224\u65b7\u71c8\u865f\u80cc\u5f8c\u662f\u5426\u6709\u8db3\u5920\u7d50\u69cb\u652f\u6490\u3002`,
      tone: structureTone,
      value: `${snapshot.healthScore}/100`
    },
    {
      action: snapshot.riskScore >= 55 ? "\u5148\u52a0\u5f37\u89c0\u5bdf\u98a8\u96aa\u4f86\u6e90" : "\u6301\u7e8c\u89c0\u5bdf\u98a8\u96aa\u662f\u5426\u64f4\u6563",
      label: "\u98a8\u96aa\u62c9\u529b",
      note: `\u98a8\u96aa\u5206\u6578 ${snapshot.riskScore}/100\uff0c\u63d0\u9192\u8ffd\u50f9\u524d\u8981\u5148\u770b\u6ce2\u52d5\u3001\u56de\u6a94\u8207\u6a21\u7d44\u7f3a\u53e3\u3002`,
      tone: riskTone,
      value: `${snapshot.riskScore}/100`
    },
    {
      action: dataWarningCount > 0 ? "\u5c07\u7d50\u8ad6\u964d\u7d1a\u70ba\u793a\u7bc4\u95b1\u8b80" : "\u53ef\u4ee5\u5148\u5f9e\u95b1\u8b80\u6d41\u7a0b\u7406\u89e3\u8a0a\u865f",
      label: "\u8cc7\u6599\u908a\u754c",
      note: dataWarningCount > 0
        ? `\u76ee\u524d\u6709 ${dataWarningCount} \u500b\u8cc7\u6599\u65d7\u6a19\uff0c\u7d50\u8ad6\u5fc5\u9808\u4fdd\u6301 mock-only \u964d\u7d1a\u89e3\u8b80\u3002`
        : "\u76ee\u524d\u6c92\u6709\u984d\u5916\u8cc7\u6599\u65d7\u6a19\uff0c\u4f46\u4ecd\u662f mock-only \u516c\u958b Beta \u95b1\u8b80\u6d41\u7a0b\u3002",
      tone: dataTone,
      value: snapshot.dataQualityGrade
    }
  ];

  return (
    <section className="stock-signal-why-panel" aria-label="\u70ba\u4ec0\u9ebc\u662f\u9019\u500b\u71c8\u865f">
      <div>
        <p className="eyebrow">Signal Explanation</p>
        <h2>{"\u70ba\u4ec0\u9ebc\u662f\u9019\u500b\u71c8\u865f"}</h2>
        <p>
          {`\u76ee\u524d\u986f\u793a ${snapshot.signal.title}\uff0c\u4f46\u9019\u662f mock-only \u7684\u8cc7\u8a0a\u95b1\u8b80\u8f14\u52a9\u3002\u8acb\u5148\u770b\u7d50\u69cb\u652f\u6490\u3001\u98a8\u96aa\u62c9\u529b\u8207\u8cc7\u6599\u908a\u754c\uff0c\u518d\u6c7a\u5b9a\u8981\u95dc\u6ce8\u3001\u52a0\u5f37\u89c0\u5bdf\u6216\u6e1b\u5c11\u98a8\u96aa\u3002`}
        </p>
      </div>
      <div className="stock-signal-why-grid">
        {items.map((item) => (
          <article className={item.tone} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.note}</p>
            <em>{item.action}</em>
          </article>
        ))}
      </div>
      <button onClick={() => onTab(dataWarningCount > 0 ? "today" : snapshot.riskScore >= 55 ? "technical" : "trend")} type="button">
        {dataWarningCount > 0
          ? "\u67e5\u770b\u8cc7\u6599\u65d7\u6a19"
          : snapshot.riskScore >= 55
            ? "\u67e5\u770b\u98a8\u96aa\u4f86\u6e90"
            : "\u67e5\u770b\u8d8b\u52e2\u9023\u7e8c\u6027"}
      </button>
    </section>
  );
}

function StockEvidenceSnapshot({ snapshot }: { snapshot: SignalSnapshot }) {
  const warningCount = snapshot.missingModuleFlags.length + snapshot.staleDataFlags.length;
  const items = [
    { label: "模型版本", value: snapshot.modelVersion },
    { label: "資料品質", value: `${snapshot.dataQualityGrade} / ${snapshot.dataQualityScore}` },
    { label: "更新時間", value: snapshot.lastUpdatedAt },
    { label: "資料旗標", value: `${warningCount} 項需確認` }
  ];

  return (
    <section className="stock-evidence-snapshot" aria-label="Stock Evidence Snapshot">
      <div>
        <p className="eyebrow">Evidence Snapshot</p>
        <h2>目前證據狀態</h2>
        <p>這是 mock 模型的資料狀態摘要；正式決策前仍需通過來源深度與公開宣稱審核。</p>
      </div>
      <div className="evidence-snapshot-grid">
        {items.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockDataGapPanel({ snapshot, onTab }: { snapshot: SignalSnapshot; onTab: (tab: TabKey) => void }) {
  const gaps = [
    ...snapshot.staleDataFlags.map((flag) => ({ kind: "待更新", value: flag })),
    ...snapshot.missingModuleFlags.map((flag) => ({ kind: "待補齊", value: flag }))
  ];

  return (
    <section className="stock-data-gap-panel" aria-label="Stock Data Gap Panel">
      <div>
        <p className="eyebrow">Data Gaps</p>
        <h2>資料缺口清單</h2>
        <p>缺口未解除前，燈號只能用來練習閱讀流程，不能升級為正式投資判斷。</p>
      </div>
      <div className="data-gap-list">
        {gaps.map((gap) => (
          <article key={`${gap.kind}-${gap.value}`}>
            <span>{gap.kind}</span>
            <strong>{gap.value}</strong>
          </article>
        ))}
        <button onClick={() => onTab("today")} type="button">
          查看今日摘要
        </button>
      </div>
    </section>
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

function StockInvestorActionSummary({
  snapshot,
  onTab
}: {
  snapshot: SignalSnapshot;
  onTab: (tab: TabKey) => void;
}) {
  const summary = buildInvestorActionSummary(snapshot);
  const items = [summary.observationFocus, summary.primaryRisk, summary.stopCondition];

  return (
    <section className="stock-investor-action-summary" aria-label="Stock Investor Action Summary">
      <div>
        <p className="eyebrow">Investor Action Summary</p>
        <h2>{summary.headline}</h2>
        <p>{summary.safetyLine}</p>
      </div>
      <div className="investor-action-grid">
        {items.map((item) => (
          <article className={item.tone} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
            <button onClick={() => onTab(item.tab)} type="button">
              查看{item.tab === "today" ? "今日摘要" : item.tab === "technical" ? "技術風險" : item.tab === "trend" ? "趨勢" : item.tab === "fundamentals" ? "基本面" : "回測"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockInvestorIndicatorRoadmap() {
  const roadmap = getInvestorIndicatorRoadmap();

  return (
    <section className="stock-investor-indicator-roadmap" aria-label="Investor Indicator Roadmap">
      <div>
        <p className="eyebrow">Indicator Roadmap</p>
        <h2>未來專業指標路線</h2>
        <p>{roadmap.boundary.statement}</p>
        <strong>
          Runtime/data foundation {roadmap.nextExecutionRatio.runtimeDataFoundation}% · Product wording{" "}
          {roadmap.nextExecutionRatio.productReadabilityAndWording}% · Future notes{" "}
          {roadmap.nextExecutionRatio.futureIndicatorDesignNotes}%
        </strong>
      </div>
      <div className="indicator-roadmap-grid">
        {roadmap.families.map((family) => (
          <article className={family.status} key={family.id}>
            <span>{getInvestorIndicatorStatusLabel(family.status)}</span>
            <strong>{family.label}</strong>
            <p>{family.productValue}</p>
            <small>{family.currentUse}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function getInvestorIndicatorStatusLabel(status: InvestorIndicatorStatus) {
  if (status === "mock-readable") return "mock 可讀";
  if (status === "design-only") return "設計保留";
  return "等待真實資料";
}

function StockRuntimeBrief({
  scoreSourceLabel,
  snapshot,
  onTab
}: {
  scoreSourceLabel: string;
  snapshot: SignalSnapshot;
  onTab: (tab: TabKey) => void;
}) {
  const hasDataWarnings = snapshot.missingModuleFlags.length > 0 || snapshot.staleDataFlags.length > 0;
  const primaryTab: TabKey = hasDataWarnings ? "today" : snapshot.riskScore >= 60 ? "technical" : "trend";
  const primaryAction = hasDataWarnings
    ? "先補資料判讀"
    : snapshot.riskScore >= 60
      ? "先拆風險"
      : "先看趨勢";
  const readiness = hasDataWarnings ? "資料待確認" : snapshot.riskScore >= 60 ? "風險升溫" : "可做 mock 閱讀";

  return (
    <section className="stock-runtime-brief" aria-label="Stock Runtime Brief">
      <div>
        <p className="eyebrow">Runtime Brief</p>
        <h2>{snapshot.asset.symbol} 目前怎麼讀</h2>
        <p>這是公開頁面可用的閱讀摘要，維持 {scoreSourceLabel} 與 mock 邊界，只協助排序，不產生買賣建議。</p>
      </div>
      <article>
        <span>目前狀態</span>
        <strong>{readiness}</strong>
        <p>{hasDataWarnings ? "資料旗標未清前，先不要放大解讀分數。" : "可用既有 mock 模組檢查趨勢、風險與相對位置。"}</p>
      </article>
      <article>
        <span>主行動</span>
        <strong>{primaryAction}</strong>
        <p>{snapshot.riskScore >= 60 ? "風險分數偏高，優先看波動與技術風險。" : "先確認分數路徑是否連續，再看其他模組。"}</p>
      </article>
      <article>
        <span>停止線</span>
        <strong>不升級結論</strong>
        <p>來源深度、真實資料與正式分數未核准前，只保留觀察與產品驗證。</p>
      </article>
      <button onClick={() => onTab(primaryTab)} type="button">
        前往{primaryTab === "technical" ? "技術風險" : primaryTab === "trend" ? "趨勢" : "今日摘要"}
      </button>
    </section>
  );
}

function StockMarketContextPanel({
  groupAverage,
  groupCount,
  market,
  selected,
  snapshot
}: {
  groupAverage: { compositeScore: number; healthScore: number; riskScore: number };
  groupCount: number;
  market: SignalSnapshot;
  selected: Asset;
  snapshot: SignalSnapshot;
}) {
  const compositeGap = snapshot.compositeScore - groupAverage.compositeScore;
  const marketGap = snapshot.compositeScore - market.compositeScore;
  const riskGap = snapshot.riskScore - groupAverage.riskScore;
  const groupLabel = selected.group === "指數" ? "全市場 mock 清單" : selected.group;

  return (
    <section className="stock-market-context" aria-label="Stock Market Context">
      <div>
        <p className="eyebrow">Market Context</p>
        <h2>放回市場脈絡看 {selected.symbol}</h2>
        <p>
          這裡用 mock 清單做相對位置檢查，協助判斷單檔燈號是跟著市場走，還是明顯偏離同群組節奏。
        </p>
      </div>
      <div className="market-context-grid">
        <ContextMetric
          label="相對台指"
          tone={marketGap >= 0 ? "positive" : "watch"}
          value={formatSigned(marketGap)}
          text={`${market.asset.symbol} 綜合 ${market.compositeScore}/100`}
        />
        <ContextMetric
          label={`相對${groupLabel}`}
          tone={compositeGap >= 0 ? "positive" : "watch"}
          value={formatSigned(compositeGap)}
          text={`${groupCount} 檔平均綜合 ${groupAverage.compositeScore}/100`}
        />
        <ContextMetric
          label="風險差距"
          tone={riskGap <= 0 ? "positive" : "risk"}
          value={formatSigned(riskGap)}
          text={`群組平均風險 ${groupAverage.riskScore}/100`}
        />
      </div>
    </section>
  );
}

function ContextMetric({
  label,
  text,
  tone,
  value
}: {
  label: string;
  text: string;
  tone: "positive" | "risk" | "watch";
  value: string;
}) {
  return (
    <article className={tone}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{text}</p>
    </article>
  );
}

function StockPageCompass({ activeTab, onTab }: { activeTab: TabKey; onTab: (tab: TabKey, source?: string) => void }) {
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
          onClick={() => onTab(item.key, "stock_page_compass")}
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

function StockNextStepGuide({ snapshot, onTab }: { snapshot: SignalSnapshot; onTab: (tab: TabKey, source?: string) => void }) {
  const hasDataWarnings = snapshot.missingModuleFlags.length > 0 || snapshot.staleDataFlags.length > 0;
  const moduleTab: TabKey = snapshot.riskScore >= 60 ? "technical" : "trend";
  const guide = [
    {
      label: "1 · Runtime 邊界",
      tab: "today" as TabKey,
      text: "先確認這頁仍是 mock-only runtime：publicDataSource=mock、scoreSource=mock，不能把分數當真實投資訊號。",
      title: "先確認 mock 邊界"
    },
    {
      label: "2 · 模組判讀",
      tab: moduleTab,
      text: snapshot.riskScore >= 60
        ? "風險分數偏高時，先看技術與波動模組，再回頭對照趨勢是否轉弱。"
        : "風險未明顯升溫時，先看趨勢是否連續，再用技術模組交叉確認。",
      title: snapshot.riskScore >= 60 ? "再拆風險與波動" : "再看趨勢連續性"
    },
    {
      label: "3 · 資料與停止點",
      tab: "backtest" as TabKey,
      text: hasDataWarnings
        ? "資料旗標已出現，先看缺口、回測限制與 blocked gates，停止放大解讀。"
        : "最後檢查模型版本、回測限制與 blocked gates；未通過前不升級成買賣建議。",
      title: hasDataWarnings ? "最後處理資料缺口" : "最後檢查 blocked gates"
    }
  ];

  return (
    <section className="stock-next-step-guide" aria-label="Stock Next Step Guide">
      <div className="next-step-head">
        <p className="eyebrow">Decision Guide</p>
        <h2>個股頁三步檢查</h2>
        <p>先守 runtime 邊界，再看健康、風險與趨勢模組，最後確認資料品質與 blocked gates。</p>
      </div>
      <div className="next-step-grid">
        {guide.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
            <button onClick={() => onTab(item.tab, "stock_next_step_guide")} type="button">
              前往查看
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockDecisionBoundary({ onTab }: { onTab: (tab: TabKey) => void }) {
  const allowed = ["比較模組分數", "檢查資料缺口", "閱讀回測限制"];
  const blocked = ["宣稱真實訊號", "直接產生買賣建議", "忽略資料來源審核"];

  return (
    <section className="stock-decision-boundary" aria-label="Stock Decision Boundary">
      <div>
        <p className="eyebrow">Decision Boundary</p>
        <h2>目前能做與不能做</h2>
        <p>這個頁面目前只支援研究體驗與產品驗證；正式投資用途要等資料、模型、法遵與公開宣稱審核完成。</p>
      </div>
      <div className="decision-boundary-grid">
        <article className="allowed">
          <span>可以做</span>
          <ul>
            {allowed.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <button onClick={() => onTab("backtest")} type="button">
            查看回測
          </button>
        </article>
        <article className="blocked">
          <span>不能做</span>
          <ul>
            {blocked.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <button onClick={() => onTab("today")} type="button">
            回到摘要
          </button>
        </article>
      </div>
    </section>
  );
}

function StockReviewQueue({ snapshot, onTab }: { snapshot: SignalSnapshot; onTab: (tab: TabKey) => void }) {
  const questions = [
    {
      action: () => onTab("today"),
      label: "資料覆核",
      text: `目前仍有 ${snapshot.missingModuleFlags.length + snapshot.staleDataFlags.length} 個資料旗標，需先確認缺口是否影響解讀。`,
      title: "資料是否足以支持閱讀"
    },
    {
      action: () => onTab("backtest"),
      label: "模型覆核",
      text: `模型版本 ${snapshot.modelVersion} 仍屬 mock 階段，不能用來聲稱真實績效。`,
      title: "模型是否可被公開說明"
    },
    {
      action: () => onTab("technical"),
      label: "風險覆核",
      text: `風險分數 ${snapshot.riskScore}/100，需確認波動來源與停損邏輯。`,
      title: "風險是否已被拆解"
    }
  ];

  return (
    <section className="stock-review-queue" aria-label="Stock Review Queue">
      <div>
        <p className="eyebrow">Review Queue</p>
        <h2>下一輪覆核問題</h2>
        <p>這些問題幫助 PM、投資、資料與法遵角色在進入正式會議前先對齊，不代表已排會或已授權。</p>
      </div>
      <div className="review-queue-grid">
        {questions.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              前往檢查
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockRoleResponsibilityMap({ onTab }: { onTab: (tab: TabKey) => void }) {
  const roles: Array<{ action: () => void; focus: string; name: string; owner: string }> = [
    {
      action: () => onTab("today"),
      focus: "確認資料旗標與 mock 邊界是否清楚揭露。",
      name: "資料角色",
      owner: "Data"
    },
    {
      action: () => onTab("technical"),
      focus: "確認風險分數、波動來源與停損邏輯是否被拆解。",
      name: "投資角色",
      owner: "Investment"
    },
    {
      action: () => onTab("backtest"),
      focus: "確認回測限制、模型版本與公開宣稱是否仍維持不核准。",
      name: "法遵角色",
      owner: "Legal"
    },
    {
      action: () => onTab("trend"),
      focus: "彙整角色意見，決定是否形成下一個正式會議候選題。",
      name: "CEO / PM",
      owner: "CEO"
    }
  ];

  return (
    <section className="stock-role-map" aria-label="Stock Role Responsibility Map">
      <div>
        <p className="eyebrow">Role Map</p>
        <h2>角色責任分工</h2>
        <p>這是下一輪討論前的責任提示，不排會、不授權，也不改變目前 mock 與 not_ready 狀態。</p>
      </div>
      <div className="role-map-grid">
        {roles.map((role) => (
          <article key={role.owner}>
            <span>{role.owner}</span>
            <strong>{role.name}</strong>
            <p>{role.focus}</p>
            <button onClick={role.action} type="button">
              查看相關頁籤
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockEscalationReadiness({ snapshot, onTab }: { snapshot: SignalSnapshot; onTab: (tab: TabKey) => void }) {
  const dataWarningCount = snapshot.missingModuleFlags.length + snapshot.staleDataFlags.length;
  const blockers = [
    {
      action: () => onTab("today"),
      label: "資料",
      state: dataWarningCount > 0 ? "blocked" : "watch",
      text: dataWarningCount > 0 ? `${dataWarningCount} 個資料旗標仍需處理。` : "資料旗標暫時清空，但仍需來源深度審核。"
    },
    {
      action: () => onTab("technical"),
      label: "風險",
      state: snapshot.riskScore >= 60 ? "blocked" : "watch",
      text: snapshot.riskScore >= 60 ? `風險分數 ${snapshot.riskScore}/100，需先拆解波動來源。` : "風險尚可觀察，但不能取代停損與部位控管。"
    },
    {
      action: () => onTab("backtest"),
      label: "模型",
      state: "blocked",
      text: `模型版本 ${snapshot.modelVersion} 仍是 mock，不能進入公開宣稱。`
    }
  ];

  const blockedCount = blockers.filter((item) => item.state === "blocked").length;

  return (
    <section className="stock-escalation-readiness" aria-label="Stock Escalation Readiness">
      <div>
        <p className="eyebrow">Escalation Readiness</p>
        <h2>升級討論準備度</h2>
        <p>
          CEO 判斷：目前仍有 {blockedCount} 個阻塞點，先維持 local-only 產品驗證，不建立正式 packet，
          不進入授權流程。
        </p>
      </div>
      <div className="escalation-readiness-grid">
        {blockers.map((item) => (
          <article className={item.state} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.state === "blocked" ? "未準備好" : "持續觀察"}</strong>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              查看依據
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockCeoSynthesis({ snapshot, onTab }: { snapshot: SignalSnapshot; onTab: (tab: TabKey) => void }) {
  const dataWarningCount = snapshot.missingModuleFlags.length + snapshot.staleDataFlags.length;
  const nextFocus = dataWarningCount > 0 ? "先補資料缺口與來源說明" : "先檢查模型與風險揭露";

  return (
    <section className="stock-ceo-synthesis" aria-label="Stock CEO Synthesis">
      <div>
        <p className="eyebrow">CEO Synthesis</p>
        <h2>CEO 收斂結論</h2>
        <p>
          目前不升級為正式討論。理由是資料旗標、mock 模型與公開宣稱邊界仍未解除；下一步維持
          local-only，優先做「{nextFocus}」。
        </p>
      </div>
      <div className="ceo-synthesis-actions">
        <article>
          <span>目前狀態</span>
          <strong>維持產品驗證</strong>
          <p>不排會、不授權、不建立 packet，也不切換真實分數。</p>
        </article>
        <article>
          <span>下一步</span>
          <strong>{nextFocus}</strong>
          <p>先把可見風險與閱讀流程做清楚，再回頭判斷是否需要正式會議候選題。</p>
        </article>
        <button onClick={() => onTab(dataWarningCount > 0 ? "today" : "backtest")} type="button">
          查看下一步依據
        </button>
      </div>
    </section>
  );
}

function StockSourceExplanationBacklog({ snapshot, onTab }: { snapshot: SignalSnapshot; onTab: (tab: TabKey) => void }) {
  const backlog = [
    {
      action: () => onTab("today"),
      label: "資料缺口",
      text: `${snapshot.missingModuleFlags.length + snapshot.staleDataFlags.length} 個旗標需要補來源說明與降級規則。`
    },
    {
      action: () => onTab("backtest"),
      label: "模型限制",
      text: `模型版本 ${snapshot.modelVersion} 需補 mock 範圍、不可宣稱項目與回測限制。`
    },
    {
      action: () => onTab("technical"),
      label: "風險欄位",
      text: `風險分數 ${snapshot.riskScore}/100 需補欄位定義、波動來源與使用限制。`
    }
  ];

  return (
    <section className="stock-source-backlog" aria-label="Stock Source Explanation Backlog">
      <div>
        <p className="eyebrow">Source Backlog</p>
        <h2>來源說明待補清單</h2>
        <p>這是下一個 local-only 工作清單，只整理要補的說明，不新增資料、不連接 Supabase、不產生真實訊號。</p>
      </div>
      <div className="source-backlog-grid">
        {backlog.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              查看相關依據
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockSourceAcceptanceCriteria({ onTab }: { onTab: (tab: TabKey) => void }) {
  const criteria: Array<{ action: () => void; label: string; text: string }> = [
    {
      action: () => onTab("today"),
      label: "資料說明",
      text: "每個旗標都要能說明來源、缺口影響、降級規則與目前不可宣稱的範圍。"
    },
    {
      action: () => onTab("backtest"),
      label: "模型說明",
      text: "模型版本、mock 範圍、回測限制與不可公開主張需同時出現在使用者可見位置。"
    },
    {
      action: () => onTab("technical"),
      label: "風險說明",
      text: "風險欄位需能連回波動來源、停損假設與非買賣建議邊界。"
    }
  ];

  return (
    <section className="stock-source-criteria" aria-label="Stock Source Acceptance Criteria">
      <div>
        <p className="eyebrow">Acceptance Criteria</p>
        <h2>來源說明完成判準</h2>
        <p>只有完成這些 local-only 說明品質要求，CEO 才會重新評估是否提出正式討論候選題。</p>
      </div>
      <div className="source-criteria-grid">
        {criteria.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              對照頁籤
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockSourceDecisionBlockers({ onTab }: { onTab: (tab: TabKey) => void }) {
  const blockers: Array<{ action: () => void; label: string; owner: string; text: string }> = [
    {
      action: () => onTab("today"),
      label: "Evidence",
      owner: "Data",
      text: "來源證據、欄位缺口、資料降級與更新頻率仍需整理成可審核脈絡。"
    },
    {
      action: () => onTab("backtest"),
      label: "Claims",
      owner: "Legal",
      text: "公開文字仍只能描述 mock 研究體驗，不能暗示已完成真實訊號或績效驗證。"
    },
    {
      action: () => onTab("technical"),
      label: "Risk",
      owner: "Investment",
      text: "風險分數仍需連回波動來源、停損假設與使用者不應直接下單的邊界。"
    }
  ];

  return (
    <section className="stock-source-blockers" aria-label="Stock Source Decision Blockers">
      <div>
        <p className="eyebrow">Decision Blockers</p>
        <h2>來源決策阻擋點</h2>
        <p>CEO 目前不建議排正式會議；先把這三個阻擋點降到可審核，才重新評估是否提出候選題。</p>
      </div>
      <div className="source-blocker-grid">
        {blockers.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <strong>{item.owner}</strong>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              回到佐證頁籤
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockSourceCheckpointPath({ onTab }: { onTab: (tab: TabKey) => void }) {
  const steps: Array<{ action: () => void; label: string; state: "active" | "waiting"; text: string }> = [
    {
      action: () => onTab("today"),
      label: "1. 說明補強",
      state: "active",
      text: "先補齊來源、資料缺口、mock 邊界與降級文字，讓使用者能理解目前只屬研究體驗。"
    },
    {
      action: () => onTab("backtest"),
      label: "2. 角色覆核",
      state: "waiting",
      text: "資料、投資與法遵角色確認文字沒有越界，CEO 才能整理成下一個候選議題。"
    },
    {
      action: () => onTab("technical"),
      label: "3. CEO 檢討",
      state: "waiting",
      text: "若阻擋點下降且公開宣稱仍受控，CEO 再決定是否向董事長提出正式排會建議。"
    }
  ];

  return (
    <section className="stock-source-checkpoint" aria-label="Stock Source Checkpoint Path">
      <div>
        <p className="eyebrow">Checkpoint Path</p>
        <h2>下一個檢討節點</h2>
        <p>這不是授權流程，也不建立 packet；只是把接下來的 local-only 推進順序固定，避免團隊在文件裡迷路。</p>
      </div>
      <div className="source-checkpoint-grid">
        {steps.map((item) => (
          <article className={item.state} key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              查看相關頁籤
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockSourceEscalationSignal({ onTab }: { onTab: (tab: TabKey) => void }) {
  const signals: Array<{ action: () => void; label: string; state: "blocked" | "watch"; text: string }> = [
    {
      action: () => onTab("today"),
      label: "來源證據",
      state: "blocked",
      text: "尚未形成可審核證據鏈，因此不能宣稱資料來源已足以支撐正式決策。"
    },
    {
      action: () => onTab("backtest"),
      label: "公開宣稱",
      state: "blocked",
      text: "mock 與 not_ready 邊界仍存在，所有績效、訊號與建議文字都必須維持降級。"
    },
    {
      action: () => onTab("technical"),
      label: "風險揭露",
      state: "watch",
      text: "風險欄位可繼續補強，但目前只能支援研究閱讀，不能支援下單行為。"
    }
  ];

  return (
    <section className="stock-source-escalation" aria-label="Stock Source Escalation Signal">
      <div>
        <p className="eyebrow">Escalation Signal</p>
        <h2>CEO 升級訊號</h2>
        <p>目前 CEO 判斷：不升級、不排正式會議、不建立授權 packet。下一步仍是 local-only 產品說明補強。</p>
      </div>
      <div className="source-escalation-grid">
        {signals.map((item) => (
          <article className={item.state} key={item.label}>
            <span>{item.state === "blocked" ? "Blocked" : "Watch"}</span>
            <strong>{item.label}</strong>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              檢查對應內容
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockMockBoundaryLegend({ onTab }: { onTab: (tab: TabKey) => void }) {
  const legends: Array<{ action: () => void; label: string; text: string }> = [
    {
      action: () => onTab("today"),
      label: "mock",
      text: "代表目前分數只用於產品體驗與閱讀流程驗證，不能被解讀為真實市場訊號。"
    },
    {
      action: () => onTab("backtest"),
      label: "not_ready",
      text: "代表來源深度、模型或公開宣稱仍未完成審核，因此不能升級為正式決策素材。"
    },
    {
      action: () => onTab("technical"),
      label: "local-only",
      text: "代表此階段只允許本機產品與文件整理，不連線、不寫入資料庫、不產生真實資料。"
    }
  ];

  return (
    <section className="stock-mock-boundary" aria-label="Stock Mock Boundary Legend">
      <div>
        <p className="eyebrow">Boundary Legend</p>
        <h2>Mock 邊界圖例</h2>
        <p>這些標籤是產品安全線，不是技術裝飾；使用者看到分數前，必須先理解目前不能做什麼。</p>
      </div>
      <div className="mock-boundary-grid">
        {legends.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              查看頁面脈絡
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockSafeReadingFlow({ onTab }: { onTab: (tab: TabKey) => void }) {
  const flow: Array<{ action: () => void; label: string; text: string }> = [
    {
      action: () => onTab("today"),
      label: "先看邊界",
      text: "確認目前仍是 mock 與 local-only 狀態，分數只能當成產品閱讀練習。"
    },
    {
      action: () => onTab("today"),
      label: "再看缺口",
      text: "檢查資料旗標、更新狀態與不可宣稱範圍，先決定資訊是否足以支持解讀。"
    },
    {
      action: () => onTab("technical"),
      label: "最後看分數",
      text: "健康度與風險度只能用來比較模組狀態，不能轉成買賣建議或正式訊號。"
    }
  ];

  return (
    <section className="stock-safe-reading" aria-label="Stock Safe Reading Flow">
      <div>
        <p className="eyebrow">Safe Reading Flow</p>
        <h2>安全解讀流程</h2>
        <p>使用者應先理解限制，再閱讀資料，最後才看分數；這是產品體驗，不是投資決策流程。</p>
      </div>
      <div className="safe-reading-grid">
        {flow.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              依序檢查
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockStopReadingConditions({ onTab }: { onTab: (tab: TabKey) => void }) {
  const stops: Array<{ action: () => void; label: string; text: string }> = [
    {
      action: () => onTab("today"),
      label: "來源不足",
      text: "如果來源、更新時間或資料缺口無法說清楚，就停止用分數推論標的狀態。"
    },
    {
      action: () => onTab("backtest"),
      label: "宣稱越界",
      text: "如果文字開始暗示真實績效、真實訊號或買賣建議，就退回 mock 研究體驗。"
    },
    {
      action: () => onTab("technical"),
      label: "風險未拆解",
      text: "如果無法說明風險分數來自波動、趨勢或資料品質，就不能進一步形成結論。"
    }
  ];

  return (
    <section className="stock-stop-reading" aria-label="Stock Stop Reading Conditions">
      <div>
        <p className="eyebrow">Stop Conditions</p>
        <h2>停止解讀條件</h2>
        <p>這些條件一旦成立，頁面只能回到檢查與說明，不應繼續產生投資語氣或正式結論。</p>
      </div>
      <div className="stop-reading-grid">
        {stops.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              回到檢查
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockExplanationPriority({ onTab }: { onTab: (tab: TabKey) => void }) {
  const priorities: Array<{ action: () => void; label: string; rank: string; text: string }> = [
    {
      action: () => onTab("today"),
      label: "來源說明",
      rank: "P1",
      text: "先補來源、更新時間、缺口影響與資料品質折扣，避免使用者把缺資料看成模型判斷。"
    },
    {
      action: () => onTab("backtest"),
      label: "模型限制",
      rank: "P2",
      text: "再補 mock 範圍、回測限制與不可公開主張，避免把產品驗證包裝成績效。"
    },
    {
      action: () => onTab("technical"),
      label: "風險解釋",
      rank: "P3",
      text: "最後補風險分數來源、波動情境與使用限制，避免分數被轉成行動指令。"
    }
  ];

  return (
    <section className="stock-explanation-priority" aria-label="Stock Explanation Priority">
      <div>
        <p className="eyebrow">Explanation Priority</p>
        <h2>說明補強優先序</h2>
        <p>CEO 下一步仍不排會，先依照這個順序補強頁面說明；完成後才重新評估是否需要角色覆核。</p>
      </div>
      <div className="explanation-priority-grid">
        {priorities.map((item) => (
          <article key={item.rank}>
            <span>{item.rank}</span>
            <strong>{item.label}</strong>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              查看補強位置
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockRoleReviewTriggers({ onTab }: { onTab: (tab: TabKey) => void }) {
  const triggers: Array<{ action: () => void; label: string; text: string }> = [
    {
      action: () => onTab("today"),
      label: "資料可審核",
      text: "來源、更新時間、缺口影響與降級規則都能被同一套文字說清楚。"
    },
    {
      action: () => onTab("backtest"),
      label: "模型可審核",
      text: "mock 範圍、回測限制與不可公開主張都已在使用者可見位置對齊。"
    },
    {
      action: () => onTab("technical"),
      label: "風險可審核",
      text: "風險分數能連回波動來源、資料品質折扣與非買賣建議邊界。"
    }
  ];

  return (
    <section className="stock-role-review-triggers" aria-label="Stock Role Review Triggers">
      <div>
        <p className="eyebrow">Role Review Triggers</p>
        <h2>角色覆核觸發條件</h2>
        <p>這些條件同時成立時，CEO 才重新評估是否啟動角色覆核；目前仍不是正式排會或授權。</p>
      </div>
      <div className="role-review-trigger-grid">
        {triggers.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              檢查觸發依據
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockPreReviewForbiddenActions({ onTab }: { onTab: (tab: TabKey) => void }) {
  const forbidden: Array<{ action: () => void; label: string; text: string }> = [
    {
      action: () => onTab("today"),
      label: "不排正式會議",
      text: "角色覆核觸發條件尚未全數成立前，CEO 只維持 local-only 補強，不排正式會議。"
    },
    {
      action: () => onTab("backtest"),
      label: "不建立授權 packet",
      text: "頁面說明完成不等於授權完成，不能建立或提交任何授權 packet。"
    },
    {
      action: () => onTab("technical"),
      label: "不碰真實資料",
      text: "不連 Supabase、不跑 SQL、不寫資料庫、不切換真實分數來源。"
    }
  ];

  return (
    <section className="stock-pre-review-forbidden" aria-label="Stock Pre Review Forbidden Actions">
      <div>
        <p className="eyebrow">Forbidden Before Review</p>
        <h2>覆核前禁止事項</h2>
        <p>這些是 CEO 的硬邊界：角色覆核之前，只能補強本機頁面說明與本地檢查，不做正式執行。</p>
      </div>
      <div className="pre-review-forbidden-grid">
        {forbidden.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              回到邊界說明
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockChairmanReviewReadiness({ onTab }: { onTab: (tab: TabKey) => void }) {
  const readiness: Array<{ action: () => void; label: string; state: "ready" | "watch" | "blocked"; text: string }> = [
    {
      action: () => onTab("today"),
      label: "可審核範圍",
      state: "ready",
      text: "只審核 local-only 說明、角色邊界、未決事項與是否需要正式授權，不審核真實分數。"
    },
    {
      action: () => onTab("backtest"),
      label: "需要董事長判斷",
      state: "watch",
      text: "當 CEO 要跨出本地文件與 mock UI，進入資料源、授權 packet 或正式會議前，才提請董事長審核。"
    },
    {
      action: () => onTab("technical"),
      label: "尚未可送審",
      state: "blocked",
      text: "若資料來源、法遵揭露、角色覆核或停止條件任一項不完整，就只能繼續本地補強。"
    }
  ];

  return (
    <section className="stock-chairman-readiness" aria-label="Stock Chairman Review Readiness">
      <div>
        <p className="eyebrow">Chairman Review Readiness</p>
        <h2>董事長審核準備度</h2>
        <p>CEO 會把送審時點控制在決策真的需要你判斷時；在那之前，團隊只做本地風險收斂。</p>
      </div>
      <div className="chairman-readiness-grid">
        {readiness.map((item) => (
          <article className={item.state} key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              查看判斷依據
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockChairmanNarrowQuestions({ onTab }: { onTab: (tab: TabKey) => void }) {
  const questions: Array<{ action: () => void; label: string; text: string }> = [
    {
      action: () => onTab("today"),
      label: "是否允許進入下一階段",
      text: "問題只問是否能從 local-only 補強前進到受控準備，不包含資料庫寫入或真實分數啟用。"
    },
    {
      action: () => onTab("technical"),
      label: "授權邊界到哪裡",
      text: "若董事長同意推進，CEO 仍需限定範圍、輸出物、停止條件與回報頻率。"
    },
    {
      action: () => onTab("backtest"),
      label: "哪些證據還缺口",
      text: "尚未補齊資料來源、法遵揭露與角色覆核前，送審問題只能停在候選清單。"
    }
  ];

  return (
    <section className="stock-chairman-questions" aria-label="Stock Chairman Narrow Questions">
      <div>
        <p className="eyebrow">Narrow Questions</p>
        <h2>董事長窄問題候選</h2>
        <p>CEO 送審前要先把大議題拆成可回答問題，讓你只審決策，不替團隊補做準備工作。</p>
      </div>
      <div className="chairman-question-grid">
        {questions.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              回看相關條件
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockChairmanAnswerCriteria({ onTab }: { onTab: (tab: TabKey) => void }) {
  const criteria: Array<{ action: () => void; label: string; text: string }> = [
    {
      action: () => onTab("today"),
      label: "可執行回答",
      text: "必須包含明確範圍、允許事項、禁止事項、到期點與回報方式，CEO 才能轉成下一個安全切片。"
    },
    {
      action: () => onTab("technical"),
      label: "不可執行回答",
      text: "若回答只說繼續、同意或先做看看，沒有邊界與停止條件，就只能視為繼續本地準備。"
    },
    {
      action: () => onTab("backtest"),
      label: "保留回答",
      text: "若董事長要求補證據，CEO 需回到資料源、法遵與角色覆核缺口，不得跳到真實資料流程。"
    }
  ];

  return (
    <section className="stock-chairman-answer-criteria" aria-label="Stock Chairman Answer Criteria">
      <div>
        <p className="eyebrow">Answer Criteria</p>
        <h2>董事長答案接受條件</h2>
        <p>CEO 只把可落地、可驗證、可停止的回答轉成行動；模糊回答一律留在 local-only 準備區。</p>
      </div>
      <div className="chairman-answer-grid">
        {criteria.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              對照執行邊界
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockChairmanAnswerRouting({ onTab }: { onTab: (tab: TabKey) => void }) {
  const routes: Array<{ action: () => void; label: string; text: string }> = [
    {
      action: () => onTab("today"),
      label: "繼續本地準備",
      text: "回答若沒有完整邊界，CEO 只整理缺口、更新頁面說明與本地檢查，不進入外部系統。"
    },
    {
      action: () => onTab("technical"),
      label: "補證據後再審",
      text: "若回答要求補來源、法遵或角色覆核，團隊回到證據清單，不建立資料流程。"
    },
    {
      action: () => onTab("backtest"),
      label: "等待正式授權",
      text: "即使回答方向可行，也必須等明確授權範圍與停止條件，才能規劃下一個受控切片。"
    }
  ];

  return (
    <section className="stock-chairman-answer-routing" aria-label="Stock Chairman Answer Routing">
      <div>
        <p className="eyebrow">Answer Routing</p>
        <h2>董事長回答分流</h2>
        <p>CEO 會先把回答分流成安全路徑；分流完成前，不把任何回答視為資料、SQL 或真實分數授權。</p>
      </div>
      <div className="chairman-routing-grid">
        {routes.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              查看分流依據
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockPreAuthorizationStopLines({ onTab }: { onTab: (tab: TabKey) => void }) {
  const stopLines: Array<{ action: () => void; label: string; text: string }> = [
    {
      action: () => onTab("today"),
      label: "範圍未定",
      text: "沒有明確市場、股票池、資料欄位與輸出用途時，CEO 不得把討論轉成執行工作。"
    },
    {
      action: () => onTab("technical"),
      label: "停止條件未定",
      text: "沒有錯誤門檻、回復方式與暫停條件時，不得安排外部系統、資料庫或真實來源動作。"
    },
    {
      action: () => onTab("backtest"),
      label: "回報節奏未定",
      text: "沒有回報頻率、驗收格式與董事長再審點時，只能繼續本地文件與 UI 準備。"
    }
  ];

  return (
    <section className="stock-pre-authorization-stop-lines" aria-label="Stock Pre Authorization Stop Lines">
      <div>
        <p className="eyebrow">Pre-Authorization Stop Lines</p>
        <h2>授權前停止線</h2>
        <p>CEO 只有在範圍、停止條件與回報節奏都清楚時，才會把下一步整理成可審核的受控切片。</p>
      </div>
      <div className="pre-authorization-stop-grid">
        {stopLines.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              回到停止線
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockCeoOptionConvergence({ onTab }: { onTab: (tab: TabKey) => void }) {
  const options: Array<{ action: () => void; label: string; state: "active" | "guard" | "support" | "paused"; text: string }> = [
    {
      action: () => onTab("today"),
      label: "Option D 主線",
      state: "active",
      text: "準備董事長授權邊界與可審核問題，但不視為已授權。"
    },
    {
      action: () => onTab("technical"),
      label: "Option E 護欄",
      state: "guard",
      text: "持續拒絕 Supabase、SQL、真實資料、真實分數與 public claim。"
    },
    {
      action: () => onTab("backtest"),
      label: "Option B 支援",
      state: "support",
      text: "只在 D 主線需要 readiness checklist 或依賴圖時使用，不建立正式 packet。"
    },
    {
      action: () => onTab("news"),
      label: "Option A / C 暫緩",
      state: "paused",
      text: "A 避免過度文件化，C 只在 mock 揭露退化時修補。"
    }
  ];

  return (
    <section className="stock-ceo-option-convergence" aria-label="Stock CEO Option Convergence">
      <div>
        <p className="eyebrow">CEO Route</p>
        <h2>CEO 目前主導路線</h2>
        <p>專案已從 A/B/C/D/E 平行探索，收斂為 D 主線、E 護欄、B 支援、A/C 暫緩。</p>
      </div>
      <div className="ceo-option-grid">
        {options.map((item) => (
          <article className={item.state} key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              查看路線依據
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockAuthorizationScopeReadiness({ onTab }: { onTab: (tab: TabKey) => void }) {
  const scopeItems: Array<{ action: () => void; label: string; text: string }> = [
    {
      action: () => onTab("today"),
      label: "候選範圍",
      text: "先定義市場、股票池、來源類型與輸出用途；尚未定義前，不提出執行請求。"
    },
    {
      action: () => onTab("technical"),
      label: "董事長輸入",
      text: "需要你確認審核範圍、最大執行深度、是否需要正式會議與回到審核的時間點。"
    },
    {
      action: () => onTab("backtest"),
      label: "角色提醒",
      text: "PM 只整理可檢查任務，工程不連外部系統，法遵與投資角色維持 not_ready。"
    },
    {
      action: () => onTab("news"),
      label: "停止線",
      text: "任何把摘要當成授權、packet、SQL、真實資料或真實分數的解讀都必須停止。"
    }
  ];

  return (
    <section className="stock-authorization-readiness" aria-label="Stock Authorization Scope Readiness">
      <div>
        <p className="eyebrow">Authorization Scope</p>
        <h2>授權範圍準備摘要</h2>
        <p>這是 Option D 的下一步可視化：只整理未來送審前的範圍與停止線，不代表已授權。</p>
      </div>
      <div className="authorization-readiness-grid">
        {scopeItems.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
            <button onClick={item.action} type="button">
              查看摘要依據
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function AssetSelector({
  activeGroup,
  assets,
  favorites,
  filteredAssets,
  groups,
  isFavorite,
  query,
  selectedSymbol,
  onFavorite,
  onGroup,
  onQuery,
  onQueryClear,
  onSelect
}: {
  activeGroup: string;
  assets: Asset[];
  favorites: Asset[];
  filteredAssets: Asset[];
  groups: string[];
  isFavorite: boolean;
  query: string;
  selectedSymbol: string;
  onFavorite: (symbol: string, source?: string) => void;
  onGroup: (group: string) => void;
  onQuery: (query: string) => void;
  onQueryClear: (source: string) => void;
  onSelect: (symbol: string, source?: string) => void;
}) {
  const searchTerm = query.trim();
  const groupLabel = activeGroup === "全部" ? "全部群組" : activeGroup;
  const resultLabel = searchTerm
    ? `${groupLabel}中 ${filteredAssets.length} 個符合「${searchTerm}」的標的`
    : `${groupLabel}共 ${filteredAssets.length} / ${assets.length} 個可瀏覽標的`;

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
          <select value={selectedSymbol} onChange={(event) => onSelect(event.target.value, "quick_switch")}>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.symbol}>
                {asset.symbol} {asset.name}
              </option>
            ))}
          </select>
        </label>
        <button
          className={isFavorite ? "favorite active" : "favorite"}
          onClick={() => onFavorite(selectedSymbol, "asset_toolbar")}
          type="button"
        >
          {isFavorite ? "♥ 已加入愛心" : "♡ 加入愛心"}
        </button>
      </div>
      <div className="asset-search-status">
        <span>{resultLabel}</span>
        <div className="asset-search-actions">
          {searchTerm ? (
            <button onClick={() => onQueryClear("search_actions")} type="button">
              清除搜尋
            </button>
          ) : null}
          <TrackedLink eventName="stock_link_clicked" href={`/stocks/${selectedSymbol}`} label="開啟個股頁" payload={{ area: "asset_search_actions", symbol: selectedSymbol }}>
            開啟個股頁
          </TrackedLink>
        </div>
      </div>
      <div className="asset-group-filter" aria-label="標的群組篩選">
        {groups.map((group) => (
          <button className={activeGroup === group ? "active" : undefined} key={group} onClick={() => onGroup(group)} type="button">
            {group}
          </button>
        ))}
      </div>
      <div className="favorite-row">
        {favorites.length ? (
          favorites.map((asset) => (
            <button className="favorite-chip" key={asset.id} onClick={() => onSelect(asset.symbol, "favorite_chip")} type="button">
              ♥ {asset.symbol}
            </button>
          ))
        ) : (
          <span className="muted-chip">尚未加入愛心標的</span>
        )}
      </div>
      <div className="asset-grid">
        {filteredAssets.length ? (
          filteredAssets.map((asset) => (
            <button
              className={asset.symbol === selectedSymbol ? "asset-card active" : "asset-card"}
              key={asset.id}
              onClick={() => onSelect(asset.symbol, "asset_card")}
              type="button"
            >
              <strong>{asset.symbol}</strong>
              <span>{asset.name}</span>
              <small>{asset.group}</small>
            </button>
          ))
        ) : (
          <div className="asset-empty-state">
            <strong>找不到符合的標的</strong>
            <p>請改用股票代號、名稱或產業關鍵字搜尋；目前仍是 mock 清單，不代表完整市場覆蓋。</p>
            <button onClick={() => onQueryClear("empty_state")} type="button">
              清除搜尋
            </button>
          </div>
        )}
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
        <ScoreCard label="健康分數" score={snapshot.healthScore} tone="health" />
        <ScoreCard label="風險分數" score={snapshot.riskScore} tone="risk" />
        <article className="panel">
          <p className="panel-label">今日燈號</p>
          <h2 style={{ color: signalColor(snapshot.signal.key) }}>{snapshot.signal.title}</h2>
          <p>{snapshot.signal.text}</p>
        </article>
        <article className="panel">
          <p className="panel-label">資料品質</p>
          <h2>{snapshot.dataQualityGrade} 級</h2>
          <p>
            品質分數 {snapshot.dataQualityScore}/100，模型版本 {snapshot.modelVersion}。目前仍是 mock-only runtime；
            real score-source mode blocked，尚未可作公開真實市場資料宣稱。
          </p>
        </article>
      </section>

      <aside className="score-source-note" aria-label="分數來源說明">
        <strong>目前分數來源：{scoreSourceLabel}</strong>
        <span>這些分數只支援產品閱讀與流程驗證，尚未啟用 Supabase runtime、SQL scoring 或真實市場資料。</span>
        <TrackedLink eventName="trust_link_clicked" href="/methodology" label="方法論" payload={{ area: "score_source_note", symbol: selectedSymbol }}>
          方法論
        </TrackedLink>
        <TrackedLink eventName="trust_link_clicked" href="/disclaimer" label="免責聲明" payload={{ area: "score_source_note", symbol: selectedSymbol }}>
          免責聲明
        </TrackedLink>
      </aside>

      <section className="content-grid">
        <article className="panel">
          <p className="eyebrow">Research Modules</p>
          <h2>{selectedSymbol} 模組分數</h2>
          <div className="module-list">
            {snapshot.modules.map((module) => (
              <div className="module-card" key={module.id}>
                <div>
                  <strong>{module.name}</strong>
                  <span>{module.note}</span>
                </div>
                <b>健康 {module.health}</b>
                <b>風險 {module.risk}</b>
              </div>
            ))}
          </div>
        </article>

        <aside className="panel">
          <p className="eyebrow">SEO Preview</p>
          <h2>股票頁公開摘要</h2>
          <p>
            這個區塊說明搜尋與公開頁可讀方向：先讓使用者理解目前燈號、分數來源與限制，再導向完整股票頁內容。
          </p>
          <TrackedLink className="text-link" eventName="stock_link_clicked" href={`/stocks/${selectedSymbol}`} label={`前往 ${selectedSymbol} 股票頁`} payload={{ area: "seo_preview", symbol: selectedSymbol }}>
            前往 {selectedSymbol} 股票頁
          </TrackedLink>
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
          <h2>分數時間線</h2>
        </div>
        <div className="chart-toggle">
          {[
            ["health", "健康分數"],
            ["risk", "風險分數"],
            ["composite", "綜合分數"]
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
        <Metric label="最新燈號" value={latest.signal.title} />
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
      ? "趨勢健康度較強，仍需確認量能與資料品質是否同步支持。"
      : snapshot.riskScore >= 70
        ? "風險分數偏高，先拆解波動來源，再閱讀技術強弱。"
        : "技術狀態介於觀察與延伸之間，適合搭配趨勢頁與風險分數一起看。";

  return (
    <section className="content-grid">
      <article className="panel technical-panel">
        <p className="eyebrow">Technical Snapshot</p>
        <h2>{selected.symbol} 技術快照</h2>
        <div className="technical-meter">
          <strong>{trendModule.health}</strong>
          <span>趨勢模組健康分數</span>
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
        <h2>技術判讀邊界</h2>
        <p>
          目前用 mock 模組近似技術狀態，尚未接上 MA、RSI、MACD 或真實成交資料。這裡只做產品閱讀輔助，不能當作交易建議。
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
          <h2>{selected.symbol} 量能輪廓</h2>
        </div>
        <strong className={volumeRatio >= 1.15 ? "status-pill warning" : "status-pill"}>
          量能 {volumeRatio.toFixed(2)} 倍
        </strong>
      </div>
      <div className="metric-grid">
        <Metric label="今日量能" value={formatInteger(quote.volume)} />
        <Metric label="20 日均量" value={formatInteger(avgVolume)} />
        <Metric label="資金流健康" value={`${flowModule.health}/100`} />
        <Metric label="資金流風險" value={`${flowModule.risk}/100`} />
      </div>
      <div className="volume-bars" aria-label="近 12 期量能示意">
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
        量能放大不等於可交易訊號。這裡只呈現量能相對狀態與資金流模組風險，等待資料管線完成後再接上真實成交量來源。
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
        <h2>{selected.symbol} 基本面 / 籌碼資料</h2>
        <div className="metric-grid compact-metrics">
          <Metric label="本益比" value={quote.pe ? String(quote.pe) : "-"} />
          <Metric label="股價淨值比" value={quote.pb ? String(quote.pb) : "-"} />
          <Metric label="現金殖利率" value={quote.dividendYield ? `${(quote.dividendYield * 100).toFixed(2)}%` : "-"} />
          <Metric label="EPS TTM" value={quote.epsTtm ? String(quote.epsTtm) : "-"} />
        </div>
        <div className="fundamental-note">
          <strong>基本面參考分數 {payoutScore}/100</strong>
          <p>
            盈餘模組健康 {earningsModule.health}/100，評價風險 {valuationModule.risk}/100。這些資料仍來自 mock runtime，僅用於閱讀流程與資訊階層驗證。
          </p>
        </div>
      </article>

      <aside className="panel">
        <p className="eyebrow">CEO Product Layer</p>
        <h2>產品判讀層</h2>
        <p>
          基本面區塊的任務是把估值、盈餘與配息放回健康 / 風險分數脈絡。等 Supabase readonly gate 通過後，再決定正式資料來源與揭露方式。
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
  const title = tone >= 3 ? "新聞情緒偏正向" : tone <= -2 ? "新聞情緒偏負向" : "新聞情緒中性觀察";
  const strongest = current.modules.slice().sort((a, b) => b.health - a.health)[0];
  const weakest = current.modules.slice().sort((a, b) => b.risk - a.risk)[0];
  const positiveCount = related.filter((item) => item.impact > 0).length;
  const negativeCount = related.filter((item) => item.impact < 0).length;
  const confidenceScore = Math.max(0, Math.min(100, current.healthScore - current.riskScore * 0.35 + 48 + tone * 4));
  const confidenceLabel =
    confidenceScore >= 72 ? "信心偏強" : confidenceScore >= 56 ? "信心中性偏穩" : confidenceScore >= 42 ? "信心觀察" : "信心偏弱";
  const confidenceTone = confidenceScore >= 72 ? "positive" : confidenceScore >= 56 ? "neutral" : "negative";
  const narrative =
    tone >= 3
      ? "近期新聞對基本面或需求敘事偏正向，仍需搭配趨勢、量能與資料品質一起確認。"
      : tone <= -2
        ? "近期新聞偏負向，先觀察是否影響風險分數與資金流模組，再決定是否升級風險提示。"
        : "近期新聞訊號分歧，適合用信心分數、燈號與模組強弱做交叉閱讀。";

  return (
    <section className="news-layout">
      <article className="panel">
        <p className="eyebrow">Confidence Review</p>
        <h2>{selected.symbol} 新聞信心檢查</h2>
        <div className="date-row">
          <label>
            <span>新聞日期</span>
            <input max={today} min="2000-01-01" type="date" value={newsDate} onChange={(event) => onNewsDate(event.target.value)} />
          </label>
          <strong className="confidence-pill" style={{ background: signalColor(current.signal.key) }}>
            {current.compositeScore}/100 - {current.signal.title}
          </strong>
        </div>
        <div className={`news-confidence ${confidenceTone}`}>
          <div className="confidence-score">
            <strong>{Math.round(confidenceScore)}</strong>
            <span>/100</span>
          </div>
          <div>
            <p className="panel-label">新聞信心分數</p>
            <h2>{confidenceLabel}</h2>
            <p>{narrative}</p>
          </div>
        </div>
        <div className="news-metrics">
          <Metric label="正向事件" value={`${positiveCount} 件`} />
          <Metric label="負向事件" value={`${negativeCount} 件`} />
          <Metric label="新聞影響" value={tone > 0 ? `+${tone}` : String(tone)} />
          <Metric label="目前燈號" value={current.signal.title} />
        </div>
        <div className="commentary-box">
          <h3>{title}</h3>
          <p>
            {selected.symbol} 在 {newsDate} 的健康分數為 {current.healthScore}/100，風險分數為 {current.riskScore}/100。
            最強模組是 {strongest.name}，主要風險來源是 {weakest.name}。新聞只做輔助脈絡，不能取代資料品質與方法論檢查。
          </p>
        </div>
      </article>

      <article className="panel">
        <p className="eyebrow">Related News</p>
        <h2>相關新聞摘要</h2>
        <p className="news-source-note">目前為 mock 關聯新聞資料，尚未串接新聞 API、RSS 或真實市場資料來源。</p>
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
