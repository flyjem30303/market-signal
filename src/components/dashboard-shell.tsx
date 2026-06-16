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
        <p className="eyebrow">{isStockPage ? "個股燈號 / 一眼判讀" : "市場總覽 / 快速判讀"}</p>
        <p className="eyebrow">公開 Beta / Phase 1</p>
        <h1>{isStockPage ? `${selected.symbol} ${selected.name}: ${snapshot.signal.title}` : "30 秒看懂今天的市場狀態"}</h1>
        <p>
          {isStockPage
            ? `${selected.name} 目前綜合分數 ${snapshot.compositeScore}/100，風險分數 ${snapshot.riskScore}/100。這是狀態整理，不是買賣建議。`
            : `${market.asset.name} 目前為「${market.signal.title}」，綜合分數 ${market.compositeScore}/100。先看燈號，再看風險與資料更新時間。`}
        </p>
        <p className="runtime-boundary-line">
          Phase 1 仍以示範資料呈現產品流程；真實資料上線需通過來源、品質、更新時間與回退檢查。
        </p>
        <div className="hero-status-strip" aria-label="目前狀態">
          <span>{isStockPage ? "個股燈號" : "市場燈號"}：{isStockPage ? snapshot.signal.title : market.signal.title}</span>
          <span>綜合分數：{isStockPage ? snapshot.compositeScore : market.compositeScore}/100</span>
          <span>風險分數：{isStockPage ? snapshot.riskScore : market.riskScore}/100</span>
          <span>資料日期：{snapshotDate}</span>
          <span>資料模式：示範資料</span>
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
          <h2>切換指數、ETF 或主要觀察標的</h2>
          <p>Phase 1 先提供一組示範觀察清單，讓使用者理解燈號、風險分數與資料邊界的閱讀方式。</p>
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
        <h2>重要提醒 / 免責聲明</h2>
        <p>
          指數燈號是市場資訊整理與風險辨識工具，不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。
          目前公開版仍使用示範資料；請搭配資料來源、更新時間與自身風險承受度判斷。
        </p>
      </article>
    </main>
  );
}

function HomeFirstScreenDecisionSummary({ market }: { market: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="市場第一眼摘要">
      <p className="eyebrow">市場第一眼摘要</p>
      <p className="eyebrow">30 秒閱讀</p>
      <h2>
        {market.asset.name}: {market.signal.title}，綜合分數 {market.compositeScore}/100
      </h2>
      <p>{market.signal.text}</p>
      <p>
        建議先確認整體燈號，再看風險分數與資料更新時間。若燈號偏多但風險同步升高，應視為「加強觀察」而非直接行動。
      </p>
      <p className="eyebrow">下一步建議</p>
      <div className="briefing-actions" aria-label="下一步建議">
        <article>
          <strong>看市場簡報</strong>
          <p>用更完整的文字摘要理解市場狀態與觀察重點。</p>
        </article>
        <article>
          <strong>檢查風險標的</strong>
          <p>查看風險分數較高的標的，避免只追逐高分數。</p>
        </article>
        <article>
          <strong>確認資料邊界</strong>
          <p>目前仍是公開 Beta 與示範資料，真實資料切換前必須通過上線檢查。</p>
        </article>
      </div>
      <div className="home-first-screen-decision__actions" aria-label="主要操作">
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
    <section className="panel stock-reading-summary" aria-label="標的快速摘要">
      <p className="eyebrow">標的快速摘要 / 一眼閱讀</p>
      <p className="eyebrow">30 秒閱讀</p>
      <h2>
        {snapshot.asset.symbol} {snapshot.asset.name}: {snapshot.signal.title}
      </h2>
      <p>
        綜合分數 {snapshot.compositeScore}/100，風險分數 {snapshot.riskScore}/100。請先把它視為觀察輔助，再搭配市場簡報與資料狀態判讀。
      </p>
      <p>目前頁面使用示範資料呈現，重點是讓使用者理解燈號背後的狀態與風險，而不是形成買賣建議。</p>
      <div className="briefing-actions" aria-label="標的觀察重點">
        <article>
          <strong>目前訊號</strong>
          <p>{snapshot.signal.text}</p>
        </article>
        <article>
          <strong>資料狀態</strong>
          <p>{snapshot.staleDataFlags[0]}</p>
        </article>
        <article>
          <strong>下一步</strong>
          <p>回到市場簡報交叉確認整體環境，再決定是否加入觀察清單。</p>
        </article>
      </div>
    </section>
  );
}

function StockDecisionCompass() {
  return (
    <section className="panel stock-decision-compass" aria-label="決策輔助">
      <p className="eyebrow">決策輔助</p>
      <h2>燈號不是買賣指令</h2>
      <p>請把燈號視為市場狀態整理：先確認趨勢、風險與資料更新，再決定是否需要觀察、複核或降低曝險。</p>
      <div className="home-first-screen-decision__actions" aria-label="延伸閱讀">
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
      <h2>{snapshot.asset.name} 的觀察位置</h2>
      <p>Phase 1 先用簡化模型呈現趨勢、風險與資料品質。未來切換真實資料後，會補上更完整的來源、回看與品質提示。</p>
    </section>
  );
}

function MarketLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場排行">
      <MarketList description="綜合分數較高的標的，適合用來觀察目前市場支撐來自哪些族群。" items={strongList} title="相對強勢" valueKey="composite" />
      <MarketList description="風險分數較高的標的，適合用來提醒是否需要降低解讀信心。" items={riskList} title="風險較高" valueKey="risk" />
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
        <p className="eyebrow">目前燈號</p>
        <h2>{snapshot.signal.title}</h2>
        <p>{snapshot.signal.text}</p>
      </article>
      <article className="panel">
        <p className="eyebrow">綜合分數</p>
        <h2>{snapshot.compositeScore}/100</h2>
        <p>綜合分數用來概括趨勢、品質、資金與風險背景，不能單獨視為操作依據。</p>
      </article>
      <article className="panel">
        <p className="eyebrow">風險分數</p>
        <h2>{snapshot.riskScore}/100</h2>
        <p>風險分數越高，越需要檢查資料更新、波動來源與自身曝險。</p>
      </article>
    </section>
  );
}
