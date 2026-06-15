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
        <p className="eyebrow">{isStockPage ? "個股燈號" : "市場總覽"}</p>
        <h1>
          {isStockPage
            ? `${selected.symbol} ${selected.name}: ${snapshot.signal.title}`
            : "30 秒看懂今天的市場狀態"}
        </h1>
        <p>
          {isStockPage
            ? `${selected.name} 目前綜合分數 ${snapshot.compositeScore}/100，風險分數 ${snapshot.riskScore}/100。這裡提供觀察輔助，不是買賣建議。`
            : `${market.asset.name} 目前為「${market.signal.title}」，綜合分數 ${market.compositeScore}/100。先看市場氛圍，再決定是否加強觀察或降低風險。`}
        </p>
        <p className="runtime-boundary-line">
          Phase 1 公開版使用示範資料與 mock 分數。正式資料上線前，頁面會持續標示來源、更新時間與 mock/real 邊界。
        </p>
        <div className="hero-status-strip" aria-label="市場狀態摘要">
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
          <p className="eyebrow">快速切換</p>
          <h2>查看其他指數、ETF 或股票燈號</h2>
          <p>Phase 1 先提供有限標的的示範閱讀體驗；資料完整覆蓋與正式資料來源仍需通過資料上線 gate。</p>
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
          指數燈號是市場資訊整理與風險辨識工具，不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。
        </p>
      </article>
    </main>
  );
}

function HomeFirstScreenDecisionSummary({ market }: { market: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="市場快速判讀">
      <p className="eyebrow">快速判讀</p>
      <h2>
        {market.asset.name}: {market.signal.title}，綜合分數 {market.compositeScore}/100
      </h2>
      <p>{market.signal.text}</p>
      <div className="briefing-actions" aria-label="市場觀察重點">
        <article>
          <strong>現在怎麼看</strong>
          <p>
            綜合分數 {market.compositeScore}/100，風險分數 {market.riskScore}/100。先判斷市場偏多、觀望或警戒，再決定觀察強度。
          </p>
        </article>
        <article>
          <strong>下一步</strong>
          <p>閱讀市場簡報與週報，確認燈號變化、主要風險與後續觀察條件。</p>
        </article>
        <article>
          <strong>資料邊界</strong>
          <p>目前仍是示範資料，正式資料上線前不宣稱即時真實行情或投資建議。</p>
        </article>
      </div>
      <div className="home-first-screen-decision__actions" aria-label="主要行動">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場簡報" payload={{ area: "home_first_screen" }}>
          查看市場簡報
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看個股燈號"
          payload={{ area: "home_first_screen" }}
        >
          查看個股燈號
        </TrackedLink>
      </div>
    </section>
  );
}

function StockRuntimeAtAGlance({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="標的一眼判讀">
      <p className="eyebrow">一眼判讀</p>
      <h2>
        {snapshot.asset.symbol} {snapshot.asset.name}: {snapshot.signal.title}
      </h2>
      <p>
        綜合分數 {snapshot.compositeScore}/100，風險分數 {snapshot.riskScore}/100。這裡協助使用者整理觀察重點，不提供買賣建議。
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
          <p>搭配市場總覽與週報一起閱讀，避免只用單一分數做判斷。</p>
        </article>
      </div>
    </section>
  );
}

function StockDecisionCompass({ activeTab }: { activeTab: ActionTab }) {
  return (
    <section className="panel stock-decision-compass" aria-label="決策輔助">
      <p className="eyebrow">決策輔助</p>
      <h2>把燈號轉成可追蹤的觀察條件</h2>
      <p>目前焦點：{activeTab}。請把燈號視為觀察輔助，並搭配自身風險承受度與其他資料來源。</p>
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
    <section className="stock-investor-action-summary" aria-label="投資者行動摘要">
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
      <h2>{snapshot.asset.name} 的觀察脈絡</h2>
      <p>
        Phase 1 先提供市場狀態、分數與風險提示。正式資料上線後，才會加入更完整的資料來源、更新時間與品質證明。
      </p>
    </section>
  );
}

function MarketLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場排行">
      <MarketList description="綜合分數較高的標的，適合優先觀察趨勢與動能。" items={strongList} title="相對強勢" valueKey="composite" />
      <MarketList description="風險分數較高的標的，適合優先檢查波動與下行風險。" items={riskList} title="風險較高" valueKey="risk" />
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
    <section className="stock-public-summary" aria-label="標的摘要">
      <article className="panel">
        <p className="eyebrow">目前燈號</p>
        <h2>{snapshot.signal.title}</h2>
        <p>{snapshot.signal.text}</p>
      </article>
      <article className="panel">
        <p className="eyebrow">綜合分數</p>
        <h2>{snapshot.compositeScore}/100</h2>
        <p>用來快速比較市場狀態與相對強弱，不代表買賣建議。</p>
      </article>
      <article className="panel">
        <p className="eyebrow">風險分數</p>
        <h2>{snapshot.riskScore}/100</h2>
        <p>分數越高代表越需要留意波動、資料新鮮度與風險條件。</p>
      </article>
    </section>
  );
}
