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
import type { SignalSnapshot } from "@/lib/signal-model";

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
        <p className="eyebrow">{isStockPage ? "個股燈號" : "市場總覽"}</p>
        <p className="eyebrow">公開 Beta 狀態</p>
        <h1>{isStockPage ? `${selected.symbol} ${selected.name}: ${snapshot.signal.title}` : "30 秒看懂今天的市場狀態"}</h1>
        <p>
          {isStockPage
            ? `${selected.name} 目前綜合分數 ${snapshot.compositeScore}/100，風險分數 ${snapshot.riskScore}/100。先看個股燈號，再看資料來源與覆蓋。`
            : `${market.asset.name} 目前為「${market.signal.title}」，綜合分數 ${market.compositeScore}/100。全市場總覽先讓使用者 30 秒內看懂市場氛圍，再用 3 分鐘內判斷下一步觀察。`}
        </p>
        <p className="runtime-boundary-line">
          Phase 1 使用示範資料，正式每日資料尚未啟用；本網站為非投資建議，不是即時報價。
          正式資料上線前會清楚標示示範/正式資料邊界。
        </p>
        <div className="hero-status-strip" aria-label="狀態儀表">
          <span>{isStockPage ? "個股燈號" : "市場燈號"}：{isStockPage ? snapshot.signal.title : market.signal.title}</span>
          <span>綜合分數：{isStockPage ? snapshot.compositeScore : market.compositeScore}/100</span>
          <span>風險分數：{isStockPage ? snapshot.riskScore : market.riskScore}/100</span>
          <span>資料時間：{snapshotDate}</span>
          <span>資料上線狀態：示範資料</span>
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
          <p className="eyebrow">標的清單</p>
          <h2>選擇指數、ETF 或個股範例</h2>
          <p>Phase 1 先用少量示範標的驗證閱讀流程；完整市場覆蓋與真實資料仍在後續資料作業中補齊。</p>
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
        <h2>重要提醒</h2>
        <p>
          指數燈號是市場資訊整理與風險辨識工具，不提供買賣建議，也不能當成個股買賣指令。
          正式資料升級前檢查仍未完成，請先把目前分數視為示範分數。
        </p>
      </article>
    </main>
  );
}

function HomeFirstScreenDecisionSummary({ market }: { market: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="指數狀態儀表站">
      <p className="eyebrow">指數狀態儀表站</p>
      <p className="eyebrow">30 秒快速閱讀</p>
      <h2>
        {market.asset.name}: {market.signal.title}，市場分數 {market.compositeScore}/100
      </h2>
      <p>{market.signal.text}</p>
      <p>
        首頁快速判讀：先看市場氣氛，再看風險，再決定下一步觀察。3 分鐘複核時，依序看核心指標快讀、
        警示提醒、資料信任、資料來源與覆蓋率，確認這只是公開 Beta 可用閉環與示範資料，不是投資建議。
      </p>
      <p className="eyebrow">核心指標面板</p>
      <div className="briefing-actions" aria-label="核心指標面板">
        <article>
          <strong>先看市場燈號</strong>
          <p>用一個狀態理解目前市場偏多、觀望、警戒或高風險。</p>
        </article>
        <article>
          <strong>再看警示清單</strong>
          <p>找出風險分數較高或需要加強觀察的標的。</p>
        </article>
        <article>
          <strong>最後看資料狀態</strong>
          <p>若仍為示範資料，就不能把燈號當成真實交易依據。</p>
        </article>
      </div>
      <div className="home-first-screen-decision__actions" aria-label="下一步閱讀">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場簡報" payload={{ area: "home_first_screen" }}>
          查看市場簡報
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看市場燈號"
          payload={{ area: "home_first_screen" }}
        >
          查看市場燈號
        </TrackedLink>
      </div>
    </section>
  );
}

function StockRuntimeAtAGlance({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="標的快速判讀">
      <p className="eyebrow">標的快速判讀 / 一眼判讀</p>
      <p className="eyebrow">決策輔助摘要</p>
      <p className="eyebrow">30 秒快速閱讀</p>
      <h2>
        {snapshot.asset.symbol} {snapshot.asset.name}: {snapshot.signal.title}
      </h2>
      <p>
        綜合分數 {snapshot.compositeScore}/100，風險分數 {snapshot.riskScore}/100。請用 30 秒看懂標的狀態，
        再用 3 分鐘複核風險來源、資料來源與覆蓋。
      </p>
      <p>標的決策摘要：先看燈號，再看資料來源與覆蓋率，最後確認公開 Beta 可用閉環仍是示範資料。</p>
      <div className="briefing-actions" aria-label="個股判讀順序">
        <article>
          <strong>狀態摘要</strong>
          <p>{snapshot.signal.text}</p>
        </article>
        <article>
          <strong>資料狀態</strong>
          <p>{snapshot.staleDataFlags[0]}</p>
        </article>
        <article>
          <strong>下一步觀察</strong>
          <p>查看市場簡報與方法說明，確認這個標的是否只是市場狀態的一部分。</p>
        </article>
      </div>
    </section>
  );
}

function StockDecisionCompass() {
  return (
    <section className="panel stock-decision-compass" aria-label="判讀順序">
      <p className="eyebrow">判讀順序</p>
      <h2>燈號不是交易指令</h2>
      <p>請先確認資料狀態，再閱讀市場簡報與方法說明。本頁不是投資建議，也不能當成個股買賣指令。</p>
      <div className="home-first-screen-decision__actions" aria-label="股票頁下一步">
        <TrackedLink eventName="stock_link_clicked" href="/briefing" label="查看市場簡報" payload={{ area: "stock_compass" }}>
          查看市場簡報
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
      <h2>{snapshot.asset.name} 的判讀位置</h2>
      <p>Phase 1 先把標的放進市場總覽中閱讀。分數與燈號應搭配大盤、風險分數與資料更新時間一起使用。</p>
    </section>
  );
}

function MarketLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場排行">
      <MarketList description="綜合分數較高的標的適合放入觀察清單，但仍需搭配資料狀態與風險分數一起看。" items={strongList} title="強勢觀察" valueKey="composite" />
      <MarketList description="風險分數較高的標的需要提高複核頻率，避免只看單一燈號。" items={riskList} title="主要風險" valueKey="risk" />
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
    <section className="stock-public-summary" aria-label="個股燈號摘要">
      <article className="panel">
        <p className="eyebrow">目前燈號</p>
        <h2>{snapshot.signal.title}</h2>
        <p>{snapshot.signal.text}</p>
      </article>
      <article className="panel">
        <p className="eyebrow">綜合分數</p>
        <h2>{snapshot.compositeScore}/100</h2>
        <p>綜合分數用來整理趨勢與動能，但仍需搭配風險分數與資料狀態。</p>
      </article>
      <article className="panel">
        <p className="eyebrow">風險分數</p>
        <h2>{snapshot.riskScore}/100</h2>
        <p>風險分數越高，越應提高觀察頻率，並避免用單一訊號做決策。</p>
      </article>
    </section>
  );
}
