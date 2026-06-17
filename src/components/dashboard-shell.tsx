"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
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
        <p className="eyebrow">{isStockPage ? "標的燈號 / 市場脈絡" : "公開 Beta / 指數狀態儀表站"}</p>
        <h1>{isStockPage ? `${selected.symbol} ${selected.name}: ${snapshot.signal.title}` : "30 秒看懂台股市場氛圍"}</h1>
        <p>
          {isStockPage
            ? `${selected.name} 目前綜合分數 ${snapshot.compositeScore}/100，風險分數 ${snapshot.riskScore}/100。此頁協助你理解標的狀態、主要原因與下一步觀察重點。`
            : `${market.asset.name} 目前為「${market.signal.title}」，綜合分數 ${market.compositeScore}/100。首頁先提供市場狀態、風險提示與可追蹤標的，讓一般投資者快速建立觀察順序。`}
        </p>
        <p className="runtime-boundary-line">
          目前公開頁面仍使用示範資料與可控資料流程；正式切換真實資料前，系統會持續標示來源、更新時間與資料邊界。
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
          <MarketLists riskList={riskList} strongList={strongList} />
        </>
      )}

      {isStockPage && (
        <>
          <StockRuntimeAtAGlance snapshot={snapshot} />
          <StockMarketFacts snapshot={snapshot} />
          <StockEventContext news={relatedNews} />
          <StockDecisionCompass />
          <StockMarketContextPanel snapshot={snapshot} />
          <StockPublicSummary snapshot={snapshot} />
        </>
      )}

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicDataSourceBoundaryNotice context={isStockPage ? "stock" : "home"} />
      <PublicNextReadingFlow context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />

      <section className="stock-search-panel" aria-label="標的切換">
        <div>
          <p className="eyebrow">指數 / ETF / 上市股票</p>
          <h2>切換你想觀察的標的燈號</h2>
          <p>目前版本先聚焦 TWII 與上市股票日收盤價；ETF 完整覆蓋會在後續版本補齊。</p>
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
          本網站提供市場資訊整理、風險辨識與觀察輔助，不提供個別買賣建議，也不保證任何投資結果。
          使用者應自行判斷並搭配其他可信來源；若資料延遲、異常或未更新，請以頁面顯示的資料狀態為準。
        </p>
      </article>
    </main>
  );
}

function HomeFirstScreenDecisionSummary({ market }: { market: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="市場總覽決策摘要">
      <p className="eyebrow">市場總覽</p>
      <h2>
        {market.asset.name}: {market.signal.title}，綜合分數 {market.compositeScore}/100
      </h2>
      <p>{market.signal.text}</p>
      <div className="briefing-actions" aria-label="建議觀察動作">
        <article>
          <strong>先看狀態</strong>
          <p>用燈號快速確認目前市場偏多、觀望或警戒，不用先讀大量新聞。</p>
        </article>
        <article>
          <strong>再看原因</strong>
          <p>回到市場摘要確認分數變化、風險來源與資料更新狀態。</p>
        </article>
        <article>
          <strong>最後追蹤</strong>
          <p>挑選關注標的，觀察是否跟整體市場方向一致。</p>
        </article>
      </div>
      <div className="home-first-screen-decision__actions" aria-label="主要行動">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場摘要" payload={{ area: "home_first_screen" }}>
          查看市場摘要
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看代表指數燈號"
          payload={{ area: "home_first_screen" }}
        >
          查看代表指數燈號
        </TrackedLink>
      </div>
    </section>
  );
}

function StockRuntimeAtAGlance({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="標的快速解讀">
      <p className="eyebrow">標的快速解讀</p>
      <h2>
        {snapshot.asset.symbol} {snapshot.asset.name}: {snapshot.signal.title}
      </h2>
      <p>
        綜合分數 {snapshot.compositeScore}/100，風險分數 {snapshot.riskScore}/100。此頁以市場脈絡、資料品質與風險提示協助觀察，不做買賣建議。
      </p>
      <div className="briefing-actions" aria-label="標的觀察摘要">
        <article>
          <strong>目前狀態</strong>
          <p>{snapshot.signal.text}</p>
        </article>
        <article>
          <strong>資料狀態</strong>
          <p>{snapshot.staleDataFlags[0]}</p>
        </article>
        <article>
          <strong>觀察提醒</strong>
          <p>請搭配市場摘要與方法說明一起判斷，避免用單一標的分數做決策。</p>
        </article>
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
        <p>分類用來協助比較相近標的，目前版本先提供核心市場與上市股票觀察。</p>
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
    <section className="panel stock-reading-summary" aria-label="市場事件脈絡">
      <p className="eyebrow">市場事件 / 觀察脈絡</p>
      <h2>用事件說明燈號變化，不用事件取代判斷</h2>
      {latestNews ? (
        <p>
          {latestNews.title}: {latestNews.summary}
        </p>
      ) : (
        <p>目前沒有可顯示的示範事件。正式資料上線前，事件模組維持保守顯示。</p>
      )}
    </section>
  );
}

function StockDecisionCompass() {
  return (
    <section className="panel stock-decision-compass" aria-label="觀察方向">
      <p className="eyebrow">觀察方向</p>
      <h2>先確認市場，再確認標的，最後確認風險</h2>
      <p>燈號不是買賣指令，而是協助你快速決定是否需要關注、加強觀察或降低風險暴露。</p>
      <div className="home-first-screen-decision__actions" aria-label="延伸行動">
        <TrackedLink eventName="stock_link_clicked" href="/briefing" label="查看市場摘要" payload={{ area: "stock_compass" }}>
          查看市場摘要
        </TrackedLink>
        <TrackedLink eventName="stock_link_clicked" href="/methodology" label="查看方法說明" payload={{ area: "stock_compass" }}>
          查看方法說明
        </TrackedLink>
      </div>
    </section>
  );
}

function StockMarketContextPanel({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="市場脈絡">
      <p className="eyebrow">市場脈絡</p>
      <h2>{snapshot.asset.name} 的判讀背景</h2>
      <p>
        目前版本先以收盤價、分數、資料品質與風險提示建立可理解的觀察流程；完整即時報價與更細分的產業指標會在後續階段評估。
      </p>
    </section>
  );
}

function MarketLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場排行">
      <MarketList description="綜合分數較高的標的，適合用來觀察目前相對強勢方向。" items={strongList} title="相對強勢" valueKey="composite" />
      <MarketList description="風險分數較高的標的，適合用來確認需要加強觀察的區域。" items={riskList} title="風險觀察" valueKey="risk" />
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
    <section className="stock-public-summary" aria-label="標的公開摘要">
      <article className="panel">
        <p className="eyebrow">燈號</p>
        <h2>{snapshot.signal.title}</h2>
        <p>{snapshot.signal.text}</p>
      </article>
      <article className="panel">
        <p className="eyebrow">綜合分數</p>
        <h2>{snapshot.compositeScore}/100</h2>
        <p>綜合分數整合趨勢、風險與資料品質，用於快速理解市場氛圍。</p>
      </article>
      <article className="panel">
        <p className="eyebrow">風險分數</p>
        <h2>{snapshot.riskScore}/100</h2>
        <p>風險分數越高，越需要搭配市場摘要與更新狀態一起確認。</p>
      </article>
    </section>
  );
}
