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
        <p className="eyebrow">{isStockPage ? "標的燈號" : "指數狀態儀表站"}</p>
        <h1>
          {isStockPage
            ? `${selected.symbol} ${selected.name}：${snapshot.signal.title}`
            : "30 秒看懂市場氛圍，3 分鐘決定觀察重點"}
        </h1>
        <p>
          {isStockPage
            ? `${selected.name} 目前綜合分數 ${snapshot.compositeScore}/100，風險分數 ${snapshot.riskScore}/100。請搭配原因、更新時間與資料狀態一起閱讀。`
            : `${market.asset.name} 目前為「${market.signal.title}」，綜合分數 ${market.compositeScore}/100。首頁先給出市場總覽，再引導使用者查看原因與風險。`}
        </p>
        <p className="runtime-boundary-line">
          目前為公開 Beta 示範資料，尚未宣稱即時真實資料或投資建議。資料來源與更新時間會在頁面下方標示。
        </p>
        <div className="hero-status-strip" aria-label="首頁重點">
          <span>市場燈號：{market.signal.title}</span>
          <span>綜合分數：{market.compositeScore}/100</span>
          <span>風險分數：{market.riskScore}/100</span>
          <span>資料：示範資料</span>
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

      <section className="stock-search-panel" aria-label="選擇標的">
        <div>
          <p className="eyebrow">標的清單</p>
          <h2>切換指數、ETF 或大型權值股</h2>
          <p>目前清單為 Phase 1 公開版觀察樣本，用來示範燈號閱讀流程。</p>
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
          指數燈號是市場資訊整理與風險辨識工具，不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。
        </p>
      </article>
    </main>
  );
}

function HomeFirstScreenDecisionSummary({ market }: { market: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="市場總覽">
      <p className="eyebrow">市場總覽</p>
      <h2>
        {market.asset.name}：{market.signal.title}，綜合分數 {market.compositeScore}/100
      </h2>
      <p>{market.signal.text}</p>
      <div className="briefing-actions" aria-label="市場觀察重點">
        <article>
          <strong>現在狀態</strong>
          <p>
            綜合分數 {market.compositeScore}/100，風險分數 {market.riskScore}/100。先看市場氛圍，再看風險是否升高。
          </p>
        </article>
        <article>
          <strong>下一步</strong>
          <p>進入市場快報確認原因，或到標的頁查看單一指數、ETF、權值股的燈號。</p>
        </article>
        <article>
          <strong>資料提醒</strong>
          <p>目前仍為示範資料，不宣稱即時、完整或可作為交易依據。</p>
        </article>
      </div>
      <div className="home-first-screen-decision__actions" aria-label="主要行動">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場快報" payload={{ area: "home_first_screen" }}>
          查看市場快報
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

function StockRuntimeAtAGlance({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="標的摘要">
      <p className="eyebrow">標的摘要</p>
      <h2>
        {snapshot.asset.symbol} {snapshot.asset.name}：{snapshot.signal.title}
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
          <strong>使用方式</strong>
          <p>先確認資料更新時間，再搭配市場快報與週報判斷是否需要加強觀察。</p>
        </article>
      </div>
    </section>
  );
}

function StockDecisionCompass({ activeTab }: { activeTab: ActionTab }) {
  return (
    <section className="panel stock-decision-compass" aria-label="決策輔助">
      <p className="eyebrow">決策輔助</p>
      <h2>從燈號、風險與資料狀態建立觀察順序</h2>
      <p>目前查看：{activeTab}。請把分數當作觀察起點，並搭配資料品質與風險聲明。</p>
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
      <p className="eyebrow">觀察建議</p>
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
      <h2>{snapshot.asset.name} 需要放回整體市場判讀</h2>
      <p>
        單一標的分數容易受題材、權重或短期波動影響。Phase 1 會先提供清楚燈號與風險提示，幫助使用者建立固定觀察流程。
      </p>
    </section>
  );
}

function MarketLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場清單">
      <MarketList description="綜合分數較高的觀察樣本。" items={strongList} title="相對偏強" valueKey="composite" />
      <MarketList description="風險分數較高的觀察樣本。" items={riskList} title="需要留意" valueKey="risk" />
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
        <p>用來快速理解市場狀態，但不應單獨作為投資決策。</p>
      </article>
      <article className="panel">
        <p className="eyebrow">風險分數</p>
        <h2>{snapshot.riskScore}/100</h2>
        <p>分數越高代表越需要留意波動、資料延遲或情境變化。</p>
      </article>
    </section>
  );
}
