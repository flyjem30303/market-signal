"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicBetaUsableLoopPanel } from "@/components/public-beta-usable-loop-panel";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";
import type { Asset } from "@/lib/assets";
import { buildMockDataFreshnessSnapshot, type DataFreshnessSnapshot } from "@/lib/data-freshness";
import {
  getMarketSignalRepository,
  type MarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

type DashboardShellProps = {
  freshnessSnapshot?: DataFreshnessSnapshot;
  initialSymbol: string;
  includeSeoContent?: boolean;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
};

type BreadthSummary = {
  constructive: number;
  defensive: number;
  watch: number;
};

const snapshotDate = "2026-05-28";

export function DashboardShell({
  freshnessSnapshot,
  initialSymbol,
  includeSeoContent = false,
  marketSignalSourceStatus
}: DashboardShellProps) {
  const router = useRouter();
  const [symbol, setSymbol] = useState(initialSymbol);
  const repository = useMemo(() => getMarketSignalRepository(), []);
  const freshness = useMemo(() => freshnessSnapshot ?? buildMockDataFreshnessSnapshot(), [freshnessSnapshot]);
  const assets = repository.getAssets();
  const selected = repository.getAssetBySymbol(symbol) ?? assets[0];
  const snapshot =
    repository.getSnapshot(selected.symbol, snapshotDate) ?? repository.getSnapshot(assets[0].symbol, snapshotDate)!;
  const snapshots = assets
    .map((asset) => repository.getSnapshot(asset.symbol, snapshotDate))
    .filter((item): item is SignalSnapshot => Boolean(item));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshot;
  const breadth = buildBreadth(snapshots);
  const riskList = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore).slice(0, 4);
  const strongList = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const isStockPage = includeSeoContent;

  function selectAsset(next: Asset) {
    setSymbol(next.symbol);
    router.push(`/stocks/${next.symbol}`);
  }

  return (
    <main className="page-shell">
      <PageViewTracker
        eventName={isStockPage ? "stock_page_viewed" : "home_page_viewed"}
        payload={{ page: isStockPage ? "stock" : "home", symbol: selected.symbol }}
      />

      <section className="hero dashboard-hero">
        <p className="eyebrow">{isStockPage ? "標的燈號" : "指數狀態儀表站"}</p>
        <h1>
          {isStockPage
            ? `${selected.symbol} ${selected.name}：${snapshot.signal.title}`
            : "30 秒看市場氣氛，3 分鐘決定觀察方向"}
        </h1>
        <p>
          {isStockPage
            ? `${selected.name} 目前綜合分數 ${snapshot.compositeScore}/100，風險分數 ${snapshot.riskScore}/100。請搭配成因、資料時間與風險邊界閱讀。`
            : `${market.asset.name} 目前為「${market.signal.title}」，綜合分數 ${market.compositeScore}/100。先看市場狀態，再看原因與資料時間。`}
        </p>
        <p className="runtime-boundary-line">
          目前仍為公開 Beta 示範資料，正式資料尚未啟用；本站提供市場資訊整理與風險辨識，不提供個股買賣建議。
        </p>
        <div className="hero-status-strip" aria-label="閱讀重點">
          <span>30 秒市場狀態</span>
          <span>3 分鐘觀察流程</span>
          <span>資料更新時間</span>
          <span>風險提示</span>
          <span>不提供買賣建議</span>
        </div>
      </section>

      {!isStockPage && (
        <>
          <HomeFirstScreenDecisionSummary breadth={breadth} freshness={freshness} market={market} />
          <MarketLists riskList={riskList} strongList={strongList} />
          <PublicBetaDataReadinessStatus />
        </>
      )}

      {isStockPage && <StockPublicSummary snapshot={snapshot} />}

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicDataSourceBoundaryNotice context={isStockPage ? "stock" : "home"} />
      <PublicBetaSourceCoverageBridge context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />
      <PublicBetaUsableLoopPanel context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />

      <section className="stock-search-panel" aria-label="選擇追蹤項目">
        <div>
          <p className="eyebrow">分類與標的</p>
          <h2>選擇你想查看的指數、ETF 或股票</h2>
          <p>第一階段先提供公開市場總覽與基礎指標；會員登入、個人化追蹤與自訂警示保留到下一階段。</p>
        </div>
        <div className="stock-chip-list">
          {assets.map((asset) => (
            <button
              className={asset.symbol === selected.symbol ? "chip active" : "chip"}
              key={asset.id}
              onClick={() => selectAsset(asset)}
              type="button"
            >
              {asset.symbol} {asset.name}
            </button>
          ))}
        </div>
      </section>

      <section className="panel stock-reading-summary" aria-label="會員功能預告">
        <p className="eyebrow">會員功能預告</p>
        <h2>第一階段先完成公開版；會員深度解讀留到下一階段</h2>
        <p>
          後續會員功能會延伸每日市場三層解讀、自選追蹤、自訂警示與盤後複盤。目前公開版先聚焦市場總覽、
          核心指標、主要風險提示與資料更新時間。
        </p>
        <div className="briefing-actions">
          <TrackedLink
            eventName="membership_preview_link_clicked"
            href="/membership"
            label="查看會員規劃"
            payload={{ area: "dashboard_shell" }}
          >
            查看會員規劃
          </TrackedLink>
          <TrackedLink eventName="trust_link_clicked" href="/methodology" label="查看燈號方法" payload={{ area: "dashboard_shell" }}>
            查看燈號方法
          </TrackedLink>
        </div>
      </section>

      <article className="disclaimer">
        <h2>重要風險聲明</h2>
        <p>
          本網站提供市場資訊整理、風險辨識與觀察輔助，不應直接視為個股買賣建議、保證獲利承諾或交易指令。
          使用者仍需自行判斷並承擔投資風險。
        </p>
      </article>
    </main>
  );
}

function HomeFirstScreenDecisionSummary({
  breadth,
  freshness,
  market
}: {
  breadth: BreadthSummary;
  freshness: DataFreshnessSnapshot;
  market: SignalSnapshot;
}) {
  const impactLevel = market.riskScore >= 70 ? "高" : market.riskScore >= 55 ? "中" : "低";

  return (
    <section className="home-first-screen-decision" aria-label="首頁 30 秒摘要">
      <div className="home-first-screen-decision__main">
        <p className="eyebrow">30 秒摘要</p>
        <h2>
          {market.asset.name} 目前為「{market.signal.title}」，綜合分數 {market.compositeScore}/100
        </h2>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-first-screen-decision__grid">
        <article className="constructive">
          <span>市場燈號</span>
          <strong>{market.signal.title}</strong>
          <p>先用燈號掌握市場氛圍，再看成因與更新時間。</p>
        </article>
        <article className="watch">
          <span>市場結構</span>
          <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
          <p>偏多、觀察、防守項目的分布，可用來判斷強勢是否擴散。</p>
        </article>
        <article className={market.riskScore >= 60 ? "defensive" : "constructive"}>
          <span>風險級別</span>
          <strong>{impactLevel}</strong>
          <p>風險分數 {market.riskScore}/100，分數升高時應回到原因與資料狀態。</p>
        </article>
        <article className="watch">
          <span>資料時間</span>
          <strong>{freshness.asOfDate}</strong>
          <p>目前仍為示範資料，正式資料上線前不宣稱即時或完整。</p>
        </article>
      </div>
      <p className="home-first-screen-decision__next">
        3 分鐘觀察流程：確認主燈號、拆解原因、標出風險、確認資料與風險邊界。
      </p>
      <div className="home-first-screen-decision__actions" aria-label="首頁下一步">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場簡報" payload={{ area: "home_first_screen" }}>
          查看市場簡報
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看市場主燈號"
          payload={{ area: "home_first_screen" }}
        >
          查看市場主燈號
        </TrackedLink>
      </div>
    </section>
  );
}

function MarketLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場清單">
      <MarketList
        description="綜合分數較高的項目，適合進一步確認成因、資料品質與更新時間。"
        items={strongList}
        title="相對偏多"
        valueKey="composite"
      />
      <MarketList
        description="風險分數較高的項目，適合加強觀察，並避免只依賴單一燈號。"
        items={riskList}
        title="風險較高"
        valueKey="risk"
      />
    </section>
  );
}

function MarketList({
  description,
  items,
  title,
  valueKey
}: {
  description: string;
  items: SignalSnapshot[];
  title: string;
  valueKey: "composite" | "risk";
}) {
  return (
    <article className="panel briefing-article">
      <p className="eyebrow">{title}</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="rank-list">
        {items.map((item) => (
          <TrackedLink
            className="rank-row"
            eventName="stock_link_clicked"
            href={`/stocks/${item.asset.symbol}`}
            key={item.asset.id}
            label={`${item.asset.symbol} ${item.asset.name}`}
            payload={{ area: title, symbol: item.asset.symbol }}
          >
            <strong>{item.asset.symbol}</strong>
            <span>{item.asset.name}</span>
            <b>{valueKey === "risk" ? item.riskScore : item.compositeScore}</b>
          </TrackedLink>
        ))}
      </div>
    </article>
  );
}

function StockPublicSummary({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="stock-public-summary" aria-label="標的觀察摘要">
      <article className="panel">
        <p className="eyebrow">市場分數</p>
        <h2>{snapshot.compositeScore}/100</h2>
        <p>
          {snapshot.asset.symbol} {snapshot.asset.name} 目前為「{snapshot.signal.title}」。這是市場狀態整理，不是交易指令。
        </p>
      </article>
      <article className="panel">
        <p className="eyebrow">風險提示</p>
        <h2>{snapshot.riskScore}/100</h2>
        <p>風險升高時，請優先確認資料更新時間、趨勢是否轉弱，以及是否有單一族群過度集中。</p>
      </article>
      <article className="panel">
        <p className="eyebrow">資料邊界</p>
        <h2>{snapshot.dataQualityGrade}</h2>
        <p>正式資料尚未啟用；目前前台維持示範資料與示範分數，不提供個別買賣建議。</p>
      </article>
    </section>
  );
}

function buildBreadth(snapshots: SignalSnapshot[]): BreadthSummary {
  return snapshots.reduce(
    (summary, snapshot) => {
      if (snapshot.compositeScore >= 70) summary.constructive += 1;
      else if (snapshot.riskScore >= 60 || snapshot.compositeScore < 45) summary.defensive += 1;
      else summary.watch += 1;
      return summary;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
}
