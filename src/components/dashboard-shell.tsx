"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicBetaUsableLoopPanel } from "@/components/public-beta-usable-loop-panel";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
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
  const scoreSourceLabel = "示範分數";

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
            : "30 秒看懂台股市場狀態"}
        </h1>
        <p>
          {isStockPage
            ? `${selected.name} 目前模擬綜合分數 ${snapshot.compositeScore}/100，風險分數 ${snapshot.riskScore}/100。請先確認原因、更新時間與資料邊界。`
            : `${market.asset.name} 目前為「${market.signal.title}」，模擬綜合分數 ${market.compositeScore}/100。這個頁面協助一般投資者快速理解市場氛圍。`}
        </p>
        <p className="runtime-boundary-line">
          正式資料尚未啟用；正式每日資料尚未啟用前，公開頁維持示範資料與模擬分數，內容僅供市場觀察，非投資建議。
        </p>
        <div className="hero-status-strip" aria-label="閱讀重點">
          <span>30 秒看懂市場氛圍</span>
          <span>3 分鐘完成觀察判斷</span>
          <span>狀態、原因、風險、時間</span>
          <span>資料邊界清楚揭露</span>
          <span>非投資建議</span>
        </div>
      </section>

      {!isStockPage && (
        <>
          <HomeFirstScreenDecisionSummary market={market} />
          <HomeMarketSummary market={market} />
          <MarketLists riskList={riskList} strongList={strongList} />
        </>
      )}

      {isStockPage && (
        <>
          <StockRuntimeAtAGlance snapshot={snapshot} />
          <StockDecisionCompass activeTab={activeTab} scoreSourceLabel={scoreSourceLabel} />
          <StockInvestorActionSummary summary={buildInvestorActionSummary(snapshot)} onTab={(tab) => setActiveTab(tab)} />
          <StockMarketContextPanel snapshot={snapshot} scoreSourceLabel={scoreSourceLabel} />
          <StockPublicSummary snapshot={snapshot} />
        </>
      )}

      <PublicBetaSourceCoverageBridge context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />
      <PublicBetaUsableLoopPanel context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />
      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicDataSourceBoundaryNotice context={isStockPage ? "stock" : "home"} />
      {isStockPage && (
        <section className="panel">
          <p className="eyebrow">資料來源與覆蓋</p>
          <h2>正式資料啟用前，先看資料邊界</h2>
          <p>目前標的頁仍以示範資料呈現閱讀流程；真實資料覆蓋、回讀與正式切換完成後，才會改為正式資料顯示。</p>
        </section>
      )}

      <section className="stock-search-panel" aria-label="選擇觀察標的">
        <div>
          <p className="eyebrow">觀察清單</p>
          <h2>切換指數、ETF 或代表性標的</h2>
          <p>公開測試版先提供示範標的，用來驗證市場狀態、風險提醒與資料邊界是否容易理解。</p>
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

      <section className="panel stock-reading-summary" aria-label="下一步閱讀">
        <p className="eyebrow">下一步閱讀</p>
        <h2>先看市場狀態，再看原因與風險</h2>
        <p>
          本站把燈號、分數、資料更新時間與風險聲明放在同一條閱讀流程中。若資料仍為示範或未更新，請先等待正式資料啟用，不要把分數當成交易訊號。
        </p>
        <div className="briefing-actions">
          <TrackedLink
            eventName="membership_preview_link_clicked"
            href="/briefing"
            label="查看市場簡報"
            payload={{ area: "dashboard_shell" }}
          >
            查看市場簡報
          </TrackedLink>
          <TrackedLink eventName="trust_link_clicked" href="/methodology" label="查看方法說明" payload={{ area: "dashboard_shell" }}>
            查看方法說明
          </TrackedLink>
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

function HomeMarketSummary({ market }: { market: SignalSnapshot }) {
  return (
    <section className="home-first-screen-decision" aria-label="市場總覽">
      <div className="home-first-screen-decision__main">
        <p className="eyebrow">市場總覽</p>
        <h2>
          {market.asset.name}：{market.signal.title}，市場分數 {market.compositeScore}/100
        </h2>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-first-screen-decision__grid">
        <article className="constructive">
          <span>狀態</span>
          <strong>{market.signal.title}</strong>
          <p>先用燈號判斷市場氛圍，再看分數與原因。</p>
        </article>
        <article className="watch">
          <span>趨勢</span>
          <strong>{market.compositeScore}</strong>
          <p>分數越高代表目前示範模型偏多，但仍需看資料時間。</p>
        </article>
        <article className={market.riskScore >= 60 ? "defensive" : "watch"}>
          <span>風險</span>
          <strong>{market.riskScore}</strong>
          <p>風險分數偏高時，應先複核原因與資料品質。</p>
        </article>
        <article className="watch">
          <span>資料</span>
          <strong>mock</strong>
          <p>正式每日資料尚未啟用，前台會持續標示。</p>
        </article>
      </div>
      <p className="home-first-screen-decision__next">下一步：查看市場簡報，確認主要風險、更新時間與觀察順序。</p>
      <div className="home-first-screen-decision__actions" aria-label="主要行動">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場簡報" payload={{ area: "home_first_screen" }}>
          查看市場簡報
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看指數詳情"
          payload={{ area: "home_first_screen" }}
        >
          查看指數詳情
        </TrackedLink>
      </div>
    </section>
  );
}

function HomeFirstScreenDecisionSummary({ market }: { market: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="首頁快速判讀">
      <p className="eyebrow">全市場總覽</p>
      <h2>首頁快速判讀：30 秒內看懂市場氛圍，3 分鐘內判斷下一步觀察</h2>
      <p>
        先看市場氣氛，再看風險，再決定下一步觀察。現在公開 Beta 以示範資料呈現核心指標面板，正式資料尚未啟用前，請把燈號視為產品流程示範。
      </p>
      <div className="briefing-actions" aria-label="首頁決策輔助摘要">
        <article>
          <strong>核心指標快讀</strong>
          <p>
            {market.asset.name} 市場分數 {market.compositeScore}/100，風險分數 {market.riskScore}/100。先用 30 秒掌握偏多、觀望或警戒，再進入 3 分鐘複核。
          </p>
        </article>
        <article>
          <strong>警示提醒</strong>
          <p>燈號只協助整理市場狀態，不是投資建議；若資料時間或來源狀態異常，前台會保留資料信任提示。</p>
        </article>
        <article>
          <strong>資料信任</strong>
          <p>目前為示範資料與公開 Beta 邊界，正式每日資料上線前不宣稱即時真實資料。</p>
        </article>
      </div>
    </section>
  );
}

function StockRuntimeAtAGlance({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="標的快速判讀">
      <p className="eyebrow">公開 Beta 狀態</p>
      <h2>標的快速判讀：30 秒看懂標的狀態，3 分鐘複核風險</h2>
      <p>
        30 秒快速閱讀 {snapshot.asset.symbol} {snapshot.asset.name} 的市場分數、風險分數、資料時間與資料邊界；再用 3 分鐘複核風險與下一步觀察。
      </p>
      <div className="briefing-actions" aria-label="標的決策摘要">
        <article>
          <strong>標的決策摘要 / 決策輔助摘要</strong>
          <p>
            示範分數：市場分數 {snapshot.compositeScore}/100，風險分數 {snapshot.riskScore}/100。示範資料僅用來驗證公開 Beta 可用流程。
          </p>
        </article>
        <article>
          <strong>下一步觀察</strong>
          <p>{snapshot.signal.text}</p>
        </article>
        <article>
          <strong>資料時間</strong>
          <p>資料邊界仍維持公開 Beta 說明；正式資料尚未啟用前，不提供買賣建議。</p>
        </article>
      </div>
    </section>
  );
}

function StockDecisionCompass({
  activeTab,
  scoreSourceLabel
}: {
  activeTab: ActionTab;
  scoreSourceLabel: string;
}) {
  return (
    <section className="panel stock-decision-compass" aria-label="標的決策指南">
      <p className="eyebrow">標的決策指南</p>
      <h2>先看狀態，再看風險，最後看資料邊界</h2>
      <p>
        目前閱讀焦點是 {activeTab}；分數來源標示為 {scoreSourceLabel}，正式資料尚未啟用前不作為投資建議。
      </p>
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
    <section className="stock-investor-action-summary" aria-label="投資人行動摘要">
      <p className="eyebrow">決策輔助摘要</p>
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

function StockMarketContextPanel({
  scoreSourceLabel,
  snapshot
}: {
  scoreSourceLabel: string;
  snapshot: SignalSnapshot;
}) {
  return (
    <section className="panel stock-reading-summary" aria-label="標的市場脈絡">
      <p className="eyebrow">市場脈絡</p>
      <h2>{snapshot.asset.name} 目前以{scoreSourceLabel}呈現</h2>
      <p>
        這個區塊把市場分數、風險分數與資料邊界放在一起，協助使用者確認「可以觀察什麼」以及「不能誤解成什麼」。
      </p>
    </section>
  );
}

function MarketLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場清單">
      <MarketList
        description="綜合分數較高的示範標的，適合用來觀察市場偏多是否集中。"
        items={strongList}
        title="相對偏多"
        valueKey="composite"
      />
      <MarketList
        description="風險分數較高的示範標的，適合優先檢查波動與資料品質。"
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
    <section className="stock-public-summary" aria-label="標的摘要">
      <article className="panel">
        <p className="eyebrow">燈號</p>
        <h2>{snapshot.signal.title}</h2>
        <p>{snapshot.signal.text}</p>
      </article>
      <article className="panel">
        <p className="eyebrow">市場分數</p>
        <h2>{snapshot.compositeScore}/100</h2>
        <p>用來示範趨勢、品質、評價與資金狀態的合成結果。</p>
      </article>
      <article className="panel">
        <p className="eyebrow">風險分數</p>
        <h2>{snapshot.riskScore}/100</h2>
        <p>分數越高代表越需要檢查波動、資料品質與是否應降低風險。</p>
      </article>
    </section>
  );
}
