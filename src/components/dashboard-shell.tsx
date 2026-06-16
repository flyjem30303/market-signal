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
        <p className="eyebrow">{isStockPage ? "標的燈號 / 一眼判讀" : "市場總覽 / 快速判讀"}</p>
        <p className="eyebrow">公開 Beta / Phase 1</p>
        <h1>{isStockPage ? `${selected.symbol} ${selected.name}: ${snapshot.signal.title}` : "30 秒看懂市場狀態"}</h1>
        <p>
          {isStockPage
            ? `${selected.name} 目前綜合分數 ${snapshot.compositeScore}/100，風險分數 ${snapshot.riskScore}/100。先用燈號、基本資料與資料時間判斷是否需要加強觀察。`
            : `${market.asset.name} 目前是「${market.signal.title}」，綜合分數 ${market.compositeScore}/100。先看市場氣氛，再看風險來源與資料狀態。`}
        </p>
        <p className="runtime-boundary-line">
          Phase 1 使用示範資料，不是即時報價，也不是投資建議；正式每日資料尚未啟用，上線前會明確標示來源、更新時間與資料狀態。
        </p>
        <div className="hero-status-strip" aria-label="目前狀態">
          <span>{isStockPage ? "標的燈號" : "市場燈號"}：{isStockPage ? snapshot.signal.title : market.signal.title}</span>
          <span>市場分數：{isStockPage ? snapshot.compositeScore : market.compositeScore}/100</span>
          <span>風險分數：{isStockPage ? snapshot.riskScore : market.riskScore}/100</span>
          <span>資料日期：{snapshotDate}</span>
          <span>資料狀態：示範</span>
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
          <p className="eyebrow">分類 / 標的</p>
          <h2>查看指數、ETF 與主要觀察標的</h2>
          <p>Phase 1 先提供一組示範標的，讓使用者理解燈號、風險分數與資料狀態的閱讀方式。</p>
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
        <h2>重要聲明</h2>
        <p>
          指數燈號是市場資訊整理與風險辨識工具，不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。
          Phase 1 使用示範資料建立閱讀流程；正式每日資料尚未啟用，所有數字都應被視為產品示範與非投資建議。
        </p>
      </article>
    </main>
  );
}

function HomeFirstScreenDecisionSummary({ market }: { market: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="市場總覽快速判讀">
      <p className="eyebrow">市場總覽快速判讀</p>
      <p className="eyebrow">30 秒快讀</p>
      <h2>
        {market.asset.name}: {market.signal.title}，綜合分數 {market.compositeScore}/100
      </h2>
      <p>{market.signal.text}</p>
      <p>今天先看市場燈號、主要風險、資料時間與下一步觀察順序，再決定要關注、加強觀察，還是降低風險。</p>
      <div className="briefing-actions" aria-label="下一步觀察">
        <article>
          <strong>關注</strong>
          <p>若燈號偏多且風險不高，可以觀察強勢標的是否延續。</p>
        </article>
        <article>
          <strong>加強觀察</strong>
          <p>若風險分數升高，先看是單一標的還是市場廣度轉弱。</p>
        </article>
        <article>
          <strong>降低風險</strong>
          <p>若燈號轉為警戒，先確認資料是否更新，再避免只靠單一訊號判斷。</p>
        </article>
      </div>
      <div className="home-first-screen-decision__actions" aria-label="主要行動">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="看市場快報" payload={{ area: "home_first_screen" }}>
          看市場快報
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看大盤燈號"
          payload={{ area: "home_first_screen" }}
        >
          查看大盤燈號
        </TrackedLink>
      </div>
    </section>
  );
}

function StockRuntimeAtAGlance({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="標的快速判讀">
      <p className="eyebrow">標的 30 秒快讀</p>
      <h2>
        {snapshot.asset.symbol} {snapshot.asset.name}: {snapshot.signal.title}
      </h2>
      <p>
        綜合分數 {snapshot.compositeScore}/100，風險分數 {snapshot.riskScore}/100。這個頁面先幫你整理燈號、基本資料、風險來源與資料限制。
      </p>
      <div className="briefing-actions" aria-label="標的觀察重點">
        <article>
          <strong>目前狀態</strong>
          <p>{snapshot.signal.text}</p>
        </article>
        <article>
          <strong>資料狀態</strong>
          <p>{snapshot.staleDataFlags[0]}</p>
        </article>
        <article>
          <strong>下一步</strong>
          <p>回到市場快報檢查整體背景，避免只看單一標的。</p>
        </article>
      </div>
    </section>
  );
}

function StockMarketFacts({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="stock-public-summary" aria-label="標的基本資料">
      <article className="panel">
        <p className="eyebrow">標的基本資料</p>
        <h2>{snapshot.asset.group}</h2>
        <p>這裡保留原本個股頁的行情摘要概念，但改成可支援指數、ETF 與股票的「標的資料」。</p>
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
    <section className="panel stock-reading-summary" aria-label="市場事件觀察">
      <p className="eyebrow">市場事件 / 新聞脈絡</p>
      <h2>目前作為觀察脈絡，不納入燈號分數</h2>
      {latestNews ? (
        <p>
          {latestNews.title}。{latestNews.summary}
        </p>
      ) : (
        <p>目前沒有示範市場事件。Phase 1 不用新聞作為硬性評分指標。</p>
      )}
    </section>
  );
}

function StockDecisionCompass() {
  return (
    <section className="panel stock-decision-compass" aria-label="判讀順序">
      <p className="eyebrow">判讀順序</p>
      <h2>先理解狀態，再決定是否需要追蹤</h2>
      <p>燈號不是交易指令。請先看市場背景、資料時間與主要風險，再決定今天是觀察、複核，還是暫時降低風險。</p>
      <div className="home-first-screen-decision__actions" aria-label="相關連結">
        <TrackedLink eventName="stock_link_clicked" href="/briefing" label="看市場快報" payload={{ area: "stock_compass" }}>
          看市場快報
        </TrackedLink>
        <TrackedLink eventName="stock_link_clicked" href="/methodology" label="看方法說明" payload={{ area: "stock_compass" }}>
          看方法說明
        </TrackedLink>
      </div>
    </section>
  );
}

function StockMarketContextPanel({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="市場背景">
      <p className="eyebrow">市場背景</p>
      <h2>{snapshot.asset.name} 的判讀脈絡</h2>
      <p>
        Phase 1 先用示範資料呈現閱讀方式：燈號負責快速判斷，基本資料負責確認當日狀態，資料邊界負責提醒目前尚未切換正式資料。
      </p>
    </section>
  );
}

function MarketLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場清單">
      <MarketList description="綜合分數較高的標的，適合先用來觀察市場是否有支撐。" items={strongList} title="相對強勢" valueKey="composite" />
      <MarketList description="風險分數較高的標的，適合用來檢查市場是否需要提高警覺。" items={riskList} title="風險觀察" valueKey="risk" />
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
        <p>綜合分數整理趨勢、資料信心、估值、資金與風險背景；目前仍是示範分數。</p>
      </article>
      <article className="panel">
        <p className="eyebrow">風險分數</p>
        <h2>{snapshot.riskScore}/100</h2>
        <p>風險分數越高，越需要確認資料時間、風險來源與整體市場背景。</p>
      </article>
    </section>
  );
}
