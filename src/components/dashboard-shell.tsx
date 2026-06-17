"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
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
  const selected = repository.getAssetBySymbol(symbol) ?? assets[0];
  const snapshot =
    repository.getSnapshot(selected.symbol, activeSnapshotDate) ?? repository.getSnapshot(assets[0].symbol, activeSnapshotDate)!;
  const snapshots = assets
    .map((asset) => repository.getSnapshot(asset.symbol, activeSnapshotDate))
    .filter((item): item is SignalSnapshot => Boolean(item));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshot;
  const riskList = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore).slice(0, 4);
  const strongList = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const relatedNews = repository.getRelatedNews(selected.symbol, activeSnapshotDate);
  const isStockPage = includeSeoContent;
  const dataSourceLabel = marketSignalSourceStatus?.resolvedSource === "supabase" ? "正式資料" : "示範資料";
  const scoreSourceLabel = marketSignalSourceStatus?.publicScoreSource === "real" ? "正式分數" : "示範分數";

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
          <PublicBetaSourceCoverageBridge context="home" />
          <MarketLists riskList={riskList} strongList={strongList} />
        </>
      )}

      {isStockPage && (
        <>
          <StockAtAGlance scoreSourceLabel={scoreSourceLabel} snapshot={snapshot} />
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
          <p>Phase 1 先聚焦 TWII 與上市股票日收盤價；ETF 全量覆蓋會在 Phase 1.1 補齊。</p>
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
      <p className="eyebrow">{isStockPage ? "標的燈號 / 市場狀態" : "公開 Beta / 指數狀態儀表站"}</p>
      <h1>{isStockPage ? `${selected.symbol} ${selected.name}: ${snapshot.signal.title}` : "30 秒看懂台股市場氛圍"}</h1>
      <p>
        {isStockPage
          ? `${selected.name} 目前為「${snapshot.signal.title}」，綜合分數 ${snapshot.compositeScore}/100，風險分數 ${snapshot.riskScore}/100。`
          : `${market.asset.name} 目前為「${market.signal.title}」，綜合分數 ${market.compositeScore}/100，風險分數 ${market.riskScore}/100。`}
        本站用燈號、原因與下一步觀察重點，協助一般投資者建立市場閱讀順序。
      </p>
      <p className="runtime-boundary-line">
        資料來源：{dataSourceLabel}；分數來源：{scoreSourceLabel}。所有內容僅供資訊整理與風險辨識，不構成投資建議。
      </p>
      <div className="hero-status-strip" aria-label="目前市場狀態">
        <span>{isStockPage ? "標的燈號" : "市場燈號"}: {focus.signal.title}</span>
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
        <h2>{isReal ? "正式資料與正式分數已啟用" : "目前仍保守顯示示範資料或示範分數"}</h2>
        <p>
          {isReal
            ? "Phase 1 已從 Supabase 唯讀資料產生市場燈號與分數，前台仍保留資料來源、更新時間與非投資建議提示。"
            : "正式資料切換條件尚未完全通過時，前台會保守降級，避免使用者誤判。"}
        </p>
      </div>
      <div className="runtime-product-summary" aria-label="首頁 runtime 摘要">
        <article className="active">
          <span>現在可用</span>
          <strong>30 秒市場狀態閱讀</strong>
          <p>使用者可以先看燈號、分數、原因與更新時間，再決定是否加強觀察。</p>
        </article>
        <article className={isReal ? "active" : "blocked"}>
          <span>資料來源</span>
          <strong>{dataSourceLabel}</strong>
          <p>正式資料模式只使用 Supabase readonly 資料；讀取失敗會保守降級。</p>
        </article>
        <article className={isReal ? "active" : "readying"}>
          <span>分數來源</span>
          <strong>{scoreSourceLabel}</strong>
          <p>Phase 1 分數由已入庫的日收盤價資料計算，不是個股買賣建議。</p>
        </article>
        <article className="active">
          <span>下一步</span>
          <strong>監控與資料品質</strong>
          <p>正式上線後持續觀察資料更新、缺漏、頁面載入與使用者互動。</p>
        </article>
      </div>
      <article className="home-runtime-status-panel__data">
        <span>資料邊界</span>
        <strong>公開資料來源：{dataSourceLabel}；分數來源：{scoreSourceLabel}</strong>
        <p>本站定位是資訊整理與風險辨識，不是投資建議，也不提供保證報酬。</p>
      </article>
      <nav aria-label="首頁下一步閱讀">
        <TrackedLink eventName="home_cta_clicked" href={`/stocks/${selectedSymbol}`} label="查看標的燈號" payload={{ area: "home_runtime_status" }}>
          查看標的燈號
        </TrackedLink>
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場快報" payload={{ area: "home_runtime_status" }}>
          查看市場快報
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
        <p>首頁、標的頁與快報會先用可理解的燈號、原因、更新時間與風險提示完成公開 Beta 可用閉環。</p>
        <p>目前資料來源：{dataSourceLabel}；分數來源：{scoreSourceLabel}。ETF 全量、新聞評分與會員內容延後到後續版本。</p>
      </div>
      <div className="public-beta-data-actionability" aria-label="資料可用性">
        <article className="accepted">
          <span>30 秒可理解</span>
          <strong>已可呈現</strong>
          <p>使用者能快速看懂市場燈號、綜合分數、風險分數與下一步觀察。</p>
        </article>
        <article className="accepted">
          <span>日收盤資料</span>
          <strong>Phase 1 主範圍</strong>
          <p>先完成 TWII 與上市股票日收盤價，不把 ETF 全量覆蓋塞進本階段。</p>
        </article>
        <article className="readying">
          <span>資料品質</span>
          <strong>持續監控</strong>
          <p>資料若缺漏或讀取失敗，前台必須清楚顯示並保守降級。</p>
        </article>
      </div>
    </section>
  );
}

function StockAtAGlance({ scoreSourceLabel, snapshot }: { scoreSourceLabel: string; snapshot: SignalSnapshot }) {
  return (
    <section className="panel stock-runtime-at-a-glance" aria-label="標的燈號摘要">
      <p className="eyebrow">標的燈號</p>
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
        <p>本區塊提供標的的核心資料與更新脈絡，協助使用者先看狀態，再看原因。</p>
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
    <section className="panel stock-reading-summary" aria-label="市場脈絡">
      <p className="eyebrow">市場脈絡 / 觀察重點</p>
      <h2>先看資料，再看脈絡，不直接轉成買賣建議</h2>
      {latestNews ? (
        <p>
          {latestNews.title}: {latestNews.summary}
        </p>
      ) : (
        <p>目前沒有額外新聞脈絡納入正式分數。後續若加入新聞評分，會另行標示來源、權重與資料時間。</p>
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
