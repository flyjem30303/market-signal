"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { HomeRuntimeStatusPanel } from "@/components/home-runtime-status-panel";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { StockRuntimeAtAGlance } from "@/components/stock-runtime-at-a-glance";
import { TrackedLink } from "@/components/tracked-link";
import type { Asset } from "@/lib/assets";
import { buildMockDataFreshnessSnapshot, type DataFreshnessSnapshot } from "@/lib/data-freshness";
import {
  getMarketSignalRepository,
  type MarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { NewsEvent, SignalSnapshot } from "@/lib/signal-model";

type DashboardShellProps = {
  freshnessSnapshot?: DataFreshnessSnapshot;
  initialSymbol: string;
  includeSeoContent?: boolean;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
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
  const riskList = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore).slice(0, 4);
  const strongList = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const relatedNews = repository.getRelatedNews(selected.symbol, snapshotDate);
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
        <p className="eyebrow">{isStockPage ? "標的燈號 / 市場狀態" : "公開 Beta / 指數狀態儀表站"}</p>
        <h1>{isStockPage ? `${selected.symbol} ${selected.name}: ${snapshot.signal.title}` : "30 秒看懂台股市場氛圍"}</h1>
        <p>
          {isStockPage
            ? `${selected.name} 目前綜合分數 ${snapshot.compositeScore}/100，風險分數 ${snapshot.riskScore}/100。`
            : `${market.asset.name} 目前為「${market.signal.title}」，綜合分數 ${market.compositeScore}/100，風險分數 ${market.riskScore}/100。`}
          本站以燈號、原因與下一步觀察重點，協助一般投資者快速建立市場閱讀順序。
        </p>
        <p className="runtime-boundary-line">
          目前維持示範資料與示範分數；正式資料來源、覆蓋率與品質通過後，才會開放正式資料模式。
        </p>
        <div className="hero-status-strip" aria-label="目前市場狀態">
          <span>{isStockPage ? "標的燈號" : "市場燈號"}: {isStockPage ? snapshot.signal.title : market.signal.title}</span>
          <span>綜合分數: {isStockPage ? snapshot.compositeScore : market.compositeScore}/100</span>
          <span>風險分數: {isStockPage ? snapshot.riskScore : market.riskScore}/100</span>
          <span>資料日期: {snapshotDate}</span>
          <span>資料來源: 示範資料</span>
        </div>
      </section>

      {!isStockPage && (
        <>
          <HomeFirstScreenDecisionSummary market={market} />
          <HomeRuntimeStatusPanel selectedSymbol={selected.symbol} />
          <PublicBetaDataReadinessStatus />
          <PublicBetaSourceCoverageBridge context="home" />
          <MarketLists riskList={riskList} strongList={strongList} />
        </>
      )}

      {isStockPage && (
        <>
          <StockRuntimeAtAGlance snapshot={snapshot} scoringLabel="示範分數" />
          <StockMarketFacts snapshot={snapshot} />
          <StockEventContext news={relatedNews} />
          <PublicBetaSourceCoverageBridge context="stock" stockSymbol={selected.symbol} />
        </>
      )}

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicDataSourceBoundaryNotice context={isStockPage ? "stock" : "home"} />
      <PublicNextReadingFlow context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />

      <section className="stock-search-panel" aria-label="標的切換">
        <div>
          <p className="eyebrow">指數 / ETF / 主要股票</p>
          <h2>切換你想觀察的標的</h2>
          <p>目前先聚焦台股大盤與上市股票日收盤價；ETF 全量覆蓋會在後續版本補齊。</p>
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

      <article className="disclaimer">
        <h2>風險聲明</h2>
        <p>
          本站提供市場資訊整理、風險辨識與觀察輔助，不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。
        </p>
      </article>
    </main>
  );
}

function HomeFirstScreenDecisionSummary({ market }: { market: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="市場總覽摘要">
      <p className="eyebrow">市場總覽</p>
      <h2>
        {market.asset.name}: {market.signal.title}，綜合分數 {market.compositeScore}/100
      </h2>
      <p>{market.signal.text}</p>
      <div className="briefing-actions" aria-label="市場下一步">
        <article>
          <strong>先看狀態</strong>
          <p>用紅黃綠燈快速判斷目前市場是偏多、觀望、警戒或高風險。</p>
        </article>
        <article>
          <strong>再看原因</strong>
          <p>回看趨勢、風險與資料更新時間，避免只看單一分數。</p>
        </article>
        <article>
          <strong>最後決定行動</strong>
          <p>選擇關注、加強觀察或降低風險，仍不把燈號當成買賣建議。</p>
        </article>
      </div>
      <div className="home-first-screen-decision__actions" aria-label="主要行動">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場晨報" payload={{ area: "home_first_screen" }}>
          查看市場晨報
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看指數燈號"
          payload={{ area: "home_first_screen" }}
        >
          查看指數燈號
        </TrackedLink>
      </div>
    </section>
  );
}

function StockMarketFacts({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="stock-public-summary" aria-label="標的市場資料">
      <article className="panel">
        <p className="eyebrow">標的分類</p>
        <h2>{snapshot.asset.group}</h2>
        <p>此分類協助使用者理解標的在市場中的角色，避免只看單一分數。</p>
      </article>
      {snapshot.marketFacts.map((fact) => (
        <article className="panel" key={fact.label}>
          <p className="eyebrow">{fact.label}</p>
          <h2>{fact.value}</h2>
          <p>{fact.note}</p>
        </article>
      ))}
    </section>
  );
}

function StockEventContext({ news }: { news: NewsEvent[] }) {
  const latestNews = news[0];

  return (
    <section className="panel stock-reading-summary" aria-label="事件脈絡">
      <p className="eyebrow">市場事件 / 觀察脈絡</p>
      <h2>新聞目前只作背景說明，不納入正式評分</h2>
      {latestNews ? (
        <p>
          {latestNews.title}: {latestNews.summary}
        </p>
      ) : (
        <p>目前沒有可顯示的示範事件。新聞區塊先作背景說明，正式新聞評分延後處理。</p>
      )}
    </section>
  );
}

function MarketLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場排行">
      <MarketList description="綜合分數較高的標的，適合作為市場強度觀察起點。" items={strongList} title="相對強勢" valueKey="composite" />
      <MarketList description="風險分數較高的標的，適合作為加強觀察或降低風險的提醒。" items={riskList} title="風險觀察" valueKey="risk" />
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
