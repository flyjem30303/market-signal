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
  buildInvestorActionSummary,
  type ActionTab,
  type InvestorActionSummary
} from "@/lib/investor-action-summary";
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
  const [activeTab, setActiveTab] = useState<ActionTab>("today");
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
        <p className="eyebrow">{isStockPage ? "標的燈號" : "市場總覽"}</p>
        <h1>
          {isStockPage
            ? `${selected.symbol} ${selected.name}: ${snapshot.signal.title}`
            : "指數狀態儀表站：30 秒看懂市場氛圍"}
        </h1>
        <p>
          {isStockPage
            ? `${selected.name} 目前綜合分數 ${snapshot.compositeScore}/100，風險分數 ${snapshot.riskScore}/100。請先看燈號原因、資料時間與主要風險。`
            : `${market.asset.name} 目前市場狀態為「${market.signal.title}」，綜合分數 ${market.compositeScore}/100。此頁協助一般投資者快速理解市場氣氛與觀察重點。`}
        </p>
        <p className="runtime-boundary-line">
          目前為公開 Beta 示範資料模式，不宣稱正式即時資料，也不提供個股買賣建議。
        </p>
        <div className="hero-status-strip" aria-label="首頁重點">
          <span>市場燈號：{market.signal.title}</span>
          <span>綜合分數：{market.compositeScore}/100</span>
          <span>風險分數：{market.riskScore}/100</span>
          <span>資料狀態：示範資料</span>
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
          <StockDecisionCompass activeTab={activeTab} />
          <StockInvestorActionSummary summary={buildInvestorActionSummary(snapshot)} onTab={(tab) => setActiveTab(tab)} />
          <StockMarketContextPanel snapshot={snapshot} />
          <StockPublicSummary snapshot={snapshot} />
        </>
      )}

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicDataSourceBoundaryNotice context={isStockPage ? "stock" : "home"} />
      <PublicNextReadingFlow context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />

      <section className="stock-search-panel" aria-label="標的切換">
        <div>
          <p className="eyebrow">分類</p>
          <h2>查看指數、ETF 與主要觀察標的</h2>
          <p>Phase 1 先提供少量代表性標的，讓使用者理解燈號、風險與資料邊界。</p>
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
        <h2>風險提醒</h2>
        <p>
          指數燈號是市場資訊整理與風險辨識工具，不是投資建議。請搭配資料更新時間、來源狀態與自身風險承受度判斷。
        </p>
      </article>
    </main>
  );
}

function HomeFirstScreenDecisionSummary({ market }: { market: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="市場快讀">
      <p className="eyebrow">市場快讀</p>
      <h2>
        {market.asset.name}: {market.signal.title}，綜合分數 {market.compositeScore}/100
      </h2>
      <p>{market.signal.text}</p>
      <div className="briefing-actions" aria-label="市場觀察重點">
        <article>
          <strong>現在看什麼</strong>
          <p>
            先確認綜合分數 {market.compositeScore}/100 與風險分數 {market.riskScore}/100，再看資料是否為示範或正式狀態。
          </p>
        </article>
        <article>
          <strong>下一步觀察</strong>
          <p>進入市場快報，檢查主要風險、核心指標與後續觀察清單。</p>
        </article>
        <article>
          <strong>資料邊界</strong>
          <p>目前仍為示範資料，正式資料切換前不作即時或完整覆蓋宣稱。</p>
        </article>
      </div>
      <div className="home-first-screen-decision__actions" aria-label="下一步">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場快報" payload={{ area: "home_first_screen" }}>
          查看市場快報
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看指數頁"
          payload={{ area: "home_first_screen" }}
        >
          查看指數頁
        </TrackedLink>
      </div>
    </section>
  );
}

function StockRuntimeAtAGlance({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="標的摘要">
      <p className="eyebrow">標的摘要</p>
      <h2>
        {snapshot.asset.symbol} {snapshot.asset.name}: {snapshot.signal.title}
      </h2>
      <p>
        綜合分數 {snapshot.compositeScore}/100，風險分數 {snapshot.riskScore}/100。這是觀察輔助，不是買賣建議。
      </p>
      <div className="briefing-actions" aria-label="標的觀察重點">
        <article>
          <strong>燈號原因</strong>
          <p>{snapshot.signal.text}</p>
        </article>
        <article>
          <strong>資料狀態</strong>
          <p>{snapshot.staleDataFlags[0]}</p>
        </article>
        <article>
          <strong>觀察方式</strong>
          <p>先看燈號，再看風險分數、資料時間與主要模組，不要用單一分數做決策。</p>
        </article>
      </div>
    </section>
  );
}

function StockDecisionCompass({ activeTab }: { activeTab: ActionTab }) {
  return (
    <section className="panel stock-decision-compass" aria-label="決策輔助">
      <p className="eyebrow">決策輔助</p>
      <h2>把燈號轉成可執行的觀察順序</h2>
      <p>目前焦點：{activeTab}。請依序確認資料狀態、趨勢、風險與後續觀察條件。</p>
    </section>
  );
}

function StockInvestorActionSummary({
  onTab,
  summary
}: {
  onTab: (tab: ActionTab) => void;
  summary: InvestorActionSummary;
}) {
  const items = [summary.observationFocus, summary.primaryRisk, summary.stopCondition];

  return (
    <section className="stock-investor-action-summary" aria-label="使用者行動摘要">
      <p className="eyebrow">行動摘要</p>
      <h2>{summary.headline}</h2>
      <p>{summary.safetyLine}</p>
      <div className="investor-action-grid">
        {items.map((item) => (
          <article className={item.tone} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
            <button onClick={() => onTab(item.tab)} type="button">
              查看{item.label}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockMarketContextPanel({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="市場脈絡">
      <p className="eyebrow">市場脈絡</p>
      <h2>{snapshot.asset.name} 的觀察重點</h2>
      <p>
        Phase 1 先用少量代表性標的建立閱讀流程。使用者應先理解燈號原因，再確認資料時間與風險提示。
      </p>
    </section>
  );
}

function MarketLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場排行">
      <MarketList description="綜合分數較高的觀察標的。" items={strongList} title="相對強勢" valueKey="composite" />
      <MarketList description="風險分數較高的觀察標的。" items={riskList} title="風險較高" valueKey="risk" />
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
        <p className="eyebrow">標的摘要</p>
        <h2>{snapshot.signal.title}</h2>
        <p>{snapshot.signal.text}</p>
      </article>
      <article className="panel">
        <p className="eyebrow">綜合分數</p>
        <h2>{snapshot.compositeScore}/100</h2>
        <p>用來快速理解目前狀態強弱，但仍需搭配資料時間與風險提示。</p>
      </article>
      <article className="panel">
        <p className="eyebrow">風險分數</p>
        <h2>{snapshot.riskScore}/100</h2>
        <p>分數越高代表需加強觀察，不代表一定要買賣任何商品。</p>
      </article>
    </section>
  );
}
