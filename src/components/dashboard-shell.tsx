"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import type { Asset } from "@/lib/assets";
import { buildMockDataFreshnessSnapshot, type DataFreshnessSnapshot } from "@/lib/data-freshness";
import type { MarketSignalSourceStatus } from "@/lib/repositories/market-signal-source-status";
import { mockMarketSignalRepository } from "@/lib/repositories/mock-market-signal-repository";
import {
  createStaticMarketSignalRepository,
  type MarketSignalRepositoryData
} from "@/lib/repositories/static-market-signal-repository";
import type { NewsEvent, SignalSnapshot } from "@/lib/signal-model";

type DashboardShellProps = {
  freshnessSnapshot?: DataFreshnessSnapshot;
  initialSymbol: string;
  includeSeoContent?: boolean;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
  repositoryData?: MarketSignalRepositoryData;
};

const fallbackSnapshotDate = "2026-05-28";

export function DashboardShell({
  freshnessSnapshot,
  initialSymbol,
  includeSeoContent = false,
  marketSignalSourceStatus,
  repositoryData
}: DashboardShellProps) {
  const router = useRouter();
  const [symbol, setSymbol] = useState(initialSymbol);
  const repository = useMemo(
    () => (repositoryData ? createStaticMarketSignalRepository(repositoryData) : mockMarketSignalRepository),
    [repositoryData]
  );
  const freshness = useMemo(() => freshnessSnapshot ?? buildMockDataFreshnessSnapshot(), [freshnessSnapshot]);
  const assets = repository.getAssets();
  const activeSnapshotDate = repositoryData?.snapshotDate ?? fallbackSnapshotDate;
  const selected = repository.getAssetBySymbol(symbol) ?? repository.getAssetBySymbol(initialSymbol) ?? assets[0];
  const snapshot =
    repository.getSnapshot(selected.symbol, activeSnapshotDate) ??
    repository.getSeries(selected.symbol).at(-1) ??
    repository.getSnapshot(assets[0].symbol, activeSnapshotDate)!;
  const snapshots = assets
    .map((asset) => repository.getSnapshot(asset.symbol, activeSnapshotDate) ?? repository.getSeries(asset.symbol).at(-1))
    .filter((item): item is SignalSnapshot => Boolean(item));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshot;
  const riskList = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore).slice(0, 4);
  const strongList = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const relatedNews = repository.getRelatedNews(selected.symbol, activeSnapshotDate);
  const isStockPage = includeSeoContent;
  const dataSourceLabel = marketSignalSourceStatus?.resolvedSource === "supabase" ? "正式資料" : "示範資料";
  const scoreSourceLabel = marketSignalSourceStatus?.publicScoreSource === "real" ? "正式分數" : "示範分數";
  const switchAssets = buildSwitchAssets(assets, selected);

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

      <Hero
        dataSourceLabel={dataSourceLabel}
        isStockPage={isStockPage}
        market={market}
        scoreSourceLabel={scoreSourceLabel}
        selected={selected}
        snapshot={snapshot}
        snapshotDate={activeSnapshotDate}
      />

      {!isStockPage && (
        <>
          <HomeFirstScreenDecisionSummary market={market} />
          <RuntimeStatusPanel
            dataSourceLabel={dataSourceLabel}
            scoreSourceLabel={scoreSourceLabel}
            selectedSymbol={selected.symbol}
            status={marketSignalSourceStatus}
          />
          <DataReadinessStatus dataSourceLabel={dataSourceLabel} scoreSourceLabel={scoreSourceLabel} />
          <MarketLists riskList={riskList} strongList={strongList} />
        </>
      )}

      {isStockPage && (
        <>
          <StockAtAGlance scoreSourceLabel={scoreSourceLabel} snapshot={snapshot} />
          <StockMarketFacts snapshot={snapshot} />
          <StockEventContext news={relatedNews} />
        </>
      )}

      <DataFreshnessStrip
        fallbackAsOfDate={snapshot.date}
        freshness={freshness}
        marketSignalSourceStatus={marketSignalSourceStatus}
      />
      <PublicNextReadingFlow context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />

      <section className="stock-search-panel" aria-label="標的切換">
        <div>
          <p className="eyebrow">指數 / ETF / 上市股票</p>
          <h2>切換常用觀察標的</h2>
          <p>Phase 1 先提供精選標的切換，完整上市股票可直接用網址 /stocks/代號 開啟；ETF 全量覆蓋留到 Phase 1.1。</p>
        </div>
        <div className="stock-chip-list">
          {switchAssets.map((asset) => (
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
          本站提供市場資訊整理、風險辨識與觀察順序，不提供個別買賣建議、保證報酬或個人化資產配置。請搭配資料時間、來源揭露與自身風險承受度使用。
        </p>
      </article>
    </main>
  );
}

function Hero({
  dataSourceLabel,
  isStockPage,
  market,
  scoreSourceLabel,
  selected,
  snapshot,
  snapshotDate
}: {
  dataSourceLabel: string;
  isStockPage: boolean;
  market: SignalSnapshot;
  scoreSourceLabel: string;
  selected: Asset;
  snapshot: SignalSnapshot;
  snapshotDate: string;
}) {
  const focus = isStockPage ? snapshot : market;

  return (
    <section className="hero dashboard-hero">
      <p className="eyebrow">{isStockPage ? "標的燈號 / 市場觀察" : "公開 Beta / 指數狀態儀表站"}</p>
      <h1>{isStockPage ? `${selected.symbol} ${selected.name}: ${snapshot.signal.title}` : "30 秒看懂台股市場氛圍"}</h1>
      <p>
        {isStockPage
          ? `${selected.name} 目前為 ${snapshot.signal.title}，綜合分數 ${snapshot.compositeScore}/100，風險分數 ${snapshot.riskScore}/100。`
          : `${market.asset.name} 目前為 ${market.signal.title}，綜合分數 ${market.compositeScore}/100，風險分數 ${market.riskScore}/100。`}
        本頁先整理狀態、原因、更新時間與風險提醒，協助使用者建立固定的市場觀察流程。
      </p>
      <p className="runtime-boundary-line">
        資料來源：{dataSourceLabel}；分數來源：{scoreSourceLabel}。所有內容皆為市場資訊整理，不構成投資建議。
      </p>
      <div className="hero-status-strip" aria-label="目前市場狀態">
        <span>{isStockPage ? "標的狀態" : "市場狀態"}: {focus.signal.title}</span>
        <span>綜合分數: {focus.compositeScore}/100</span>
        <span>風險分數: {focus.riskScore}/100</span>
        <span>資料日期: {snapshotDate}</span>
        <span>資料來源: {dataSourceLabel}</span>
      </div>
    </section>
  );
}

function HomeFirstScreenDecisionSummary({ market }: { market: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="市場快速判讀">
      <p className="eyebrow">市場快速判讀</p>
      <h2>
        {market.asset.name}: {market.signal.title}，綜合分數 {market.compositeScore}/100
      </h2>
      <p>{market.signal.text}</p>
      <div className="briefing-actions" aria-label="市場閱讀順序">
        <article>
          <strong>先看狀態</strong>
          <p>用燈號與分數快速判斷市場偏多、觀望、警戒或高風險。</p>
        </article>
        <article>
          <strong>再看原因</strong>
          <p>確認趨勢、資金、風險與資料品質，不只看單一數字。</p>
        </article>
        <article>
          <strong>最後決定行動</strong>
          <p>選擇觀察、複核或降低風險，而不是直接轉成買賣指令。</p>
        </article>
      </div>
      <div className="home-first-screen-decision__actions" aria-label="下一步閱讀">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場簡報" payload={{ area: "home_first_screen" }}>
          查看市場簡報
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看指數狀態"
          payload={{ area: "home_first_screen" }}
        >
          查看指數狀態
        </TrackedLink>
      </div>
    </section>
  );
}

function RuntimeStatusPanel({
  dataSourceLabel,
  scoreSourceLabel,
  selectedSymbol,
  status
}: {
  dataSourceLabel: string;
  scoreSourceLabel: string;
  selectedSymbol: string;
  status?: MarketSignalSourceStatus;
}) {
  const isReal = status?.resolvedSource === "supabase" && status.publicScoreSource === "real";

  return (
    <section className="home-runtime-status-panel" aria-label="首頁資料與 runtime 狀態">
      <div>
        <p className="eyebrow">資料狀態</p>
        <h2>{isReal ? "正式資料與正式分數已啟用" : "目前仍以示範資料與示範分數呈現"}</h2>
        <p>
          {isReal
            ? "Phase 1 已從 Supabase 唯讀資料產生市場燈號與分數，前台仍保留資料來源、更新時間與非投資建議提示。"
            : "正式資料或正式分數尚未通過所有條件時，前台會保守顯示示範資料，避免使用者誤判。"}
        </p>
      </div>
      <div className="runtime-product-summary" aria-label="首頁 runtime 摘要">
        <article className="active">
          <span>使用目標</span>
          <strong>30 秒完成市場判讀</strong>
          <p>協助使用者先知道市場狀態，再決定是否需要深入閱讀。</p>
        </article>
        <article className={isReal ? "active" : "blocked"}>
          <span>資料來源</span>
          <strong>{dataSourceLabel}</strong>
          <p>正式資料模式使用 Supabase readonly 資料，並保留保守降級保護。</p>
        </article>
        <article className={isReal ? "active" : "readying"}>
          <span>分數來源</span>
          <strong>{scoreSourceLabel}</strong>
          <p>Phase 1 分數根據日收盤價與可公開資料計算，不含新聞評分。</p>
        </article>
        <article className="active">
          <span>閱讀邊界</span>
          <strong>資訊整理，不是建議</strong>
          <p>所有訊號都需要搭配資料時間、來源與個人風險承受度閱讀。</p>
        </article>
      </div>
      <article className="home-runtime-status-panel__data">
        <span>資料揭露</span>
        <strong>資料來源：{dataSourceLabel}；分數來源：{scoreSourceLabel}</strong>
        <p>本網站會標示資料更新時間；若資料缺漏或讀取失敗，頁面會保守降級。</p>
      </article>
      <nav aria-label="首頁下一步閱讀">
        <TrackedLink eventName="home_cta_clicked" href={`/stocks/${selectedSymbol}`} label="查看標的狀態" payload={{ area: "home_runtime_status" }}>
          查看標的狀態
        </TrackedLink>
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場簡報" payload={{ area: "home_runtime_status" }}>
          查看市場簡報
        </TrackedLink>
        <TrackedLink eventName="trust_link_clicked" href="/methodology" label="查看方法說明" payload={{ area: "home_runtime_status" }}>
          查看方法說明
        </TrackedLink>
      </nav>
    </section>
  );
}

function DataReadinessStatus({ dataSourceLabel, scoreSourceLabel }: { dataSourceLabel: string; scoreSourceLabel: string }) {
  return (
    <section className="public-beta-data-readiness-status" aria-label="公開 Beta 資料狀態">
      <div className="public-beta-data-readiness-status-main">
        <p className="eyebrow">資料狀態</p>
        <h2>Phase 1 聚焦 TWII 與上市股票日收盤價</h2>
        <p>首頁會先呈現市場總覽、核心指標、主要風險提示與資料更新時間，讓使用者快速理解目前市場狀態。</p>
        <p>目前資料來源：{dataSourceLabel}；分數來源：{scoreSourceLabel}。ETF 全量覆蓋、新聞評分與會員功能留到後續階段。</p>
      </div>
      <div className="public-beta-data-actionability" aria-label="資料可用性">
        <article className="accepted">
          <span>30 秒可判讀</span>
          <strong>已可使用</strong>
          <p>燈號、分數、狀態說明與風險提示已形成第一層閱讀流程。</p>
        </article>
        <article className="accepted">
          <span>範圍收斂</span>
          <strong>Phase 1 清楚</strong>
          <p>先做 TWII 與上市股票日收盤價，不把 ETF 全量與會員功能混入本階段。</p>
        </article>
        <article className="readying">
          <span>資料監控</span>
          <strong>持續追蹤</strong>
          <p>資料缺漏、讀取失敗或延遲時，前台需清楚顯示狀態。</p>
        </article>
      </div>
    </section>
  );
}

function StockAtAGlance({ scoreSourceLabel, snapshot }: { scoreSourceLabel: string; snapshot: SignalSnapshot }) {
  return (
    <section className="panel stock-runtime-at-a-glance" aria-label="標的狀態摘要">
      <p className="eyebrow">標的狀態</p>
      <h2>{snapshot.asset.name}: {snapshot.signal.title}</h2>
      <p>{snapshot.signal.text}</p>
      <div className="briefing-actions">
        <article>
          <strong>綜合分數</strong>
          <p>{snapshot.compositeScore}/100</p>
        </article>
        <article>
          <strong>風險分數</strong>
          <p>{snapshot.riskScore}/100</p>
        </article>
        <article>
          <strong>分數來源</strong>
          <p>{scoreSourceLabel}</p>
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
        <p>這裡整理可公開閱讀的關鍵資料，協助使用者先理解狀態，再看原因與風險。</p>
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
      <p className="eyebrow">市場事件 / 閱讀脈絡</p>
      <h2>新聞評分尚未納入 Phase 1 正式分數</h2>
      {latestNews ? (
        <p>
          {latestNews.title}: {latestNews.summary}
        </p>
      ) : (
        <p>目前沒有可公開呈現的事件脈絡。新聞資訊會在後續版本補齊，且不會直接轉成買賣建議。</p>
      )}
    </section>
  );
}

function MarketLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場排行">
      <MarketList description="綜合分數較高的標的，可用來觀察目前市場相對強勢方向。" items={strongList} title="相對強勢" valueKey="composite" />
      <MarketList description="風險分數較高的標的，提醒使用者優先確認資料與風險背景。" items={riskList} title="風險提醒" valueKey="risk" />
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

function buildSwitchAssets(assets: Asset[], selected: Asset) {
  const priority = ["TWII", "0050", "006208", "2330", "2308", "2382"];
  const bySymbol = new Map(assets.map((asset) => [asset.symbol, asset]));
  const selectedFirst = [selected, ...priority.map((symbol) => bySymbol.get(symbol)).filter((asset): asset is Asset => Boolean(asset))];
  return Array.from(new Map(selectedFirst.map((asset) => [asset.symbol, asset])).values()).slice(0, 12);
}
