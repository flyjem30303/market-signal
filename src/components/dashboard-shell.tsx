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
            ? `${selected.name} 目前綜合分數 ${snapshot.compositeScore}/100，風險分數 ${snapshot.riskScore}/100。這是示範資料，不是買賣建議。`
            : `${market.asset.name} 目前為「${market.signal.title}」，綜合分數 ${market.compositeScore}/100。先看市場狀態，再看風險來源與資料更新時間。`}
        </p>
        <p className="runtime-boundary-line">
          Phase 1 使用示範資料與示範分數；正式每日資料尚未啟用，所有燈號都應搭配資料邊界與免責聲明閱讀。
        </p>
        <div className="hero-status-strip" aria-label="目前狀態">
          <span>{isStockPage ? "標的燈號" : "市場燈號"}：{isStockPage ? snapshot.signal.title : market.signal.title}</span>
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
        <h2>重要提醒 / 非投資建議</h2>
        <p>
          指數燈號是市場資訊整理與風險辨識工具，不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。
          目前公開 Beta 使用示範資料；正式資料切換前會完成來源、品質與回退檢查。
        </p>
      </article>
    </main>
  );
}

function HomeFirstScreenDecisionSummary({ market }: { market: SignalSnapshot }) {
  return (
    <section className="panel stock-reading-summary" aria-label="市場總覽快速判讀">
      <p className="eyebrow">市場總覽快速判讀</p>
      <p className="eyebrow">30 秒閱讀</p>
      <h2>
        {market.asset.name}: {market.signal.title}，綜合分數 {market.compositeScore}/100
      </h2>
      <p>{market.signal.text}</p>
      <p>
        建議閱讀順序：先看市場燈號，再看風險分數，最後確認資料更新時間與資料來源邊界。
      </p>
      <p className="eyebrow">下一步行動</p>
      <div className="briefing-actions" aria-label="下一步行動">
        <article>
          <strong>關注</strong>
          <p>如果燈號偏多且風險分數不高，可列入觀察清單。</p>
        </article>
        <article>
          <strong>加強觀察</strong>
          <p>如果風險分數升高，先看風險來源與資料是否延遲。</p>
        </article>
        <article>
          <strong>降低風險</strong>
          <p>如果燈號轉弱或資料異常，避免只憑單一數字做判斷。</p>
        </article>
      </div>
      <div className="home-first-screen-decision__actions" aria-label="主要操作">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場快報" payload={{ area: "home_first_screen" }}>
          查看市場快報
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
      <p className="eyebrow">標的快速判讀 / 一眼閱讀</p>
      <p className="eyebrow">30 秒閱讀</p>
      <h2>
        {snapshot.asset.symbol} {snapshot.asset.name}: {snapshot.signal.title}
      </h2>
      <p>
        綜合分數 {snapshot.compositeScore}/100，風險分數 {snapshot.riskScore}/100。這是示範資料，用來呈現未來正式資料的閱讀方式。
      </p>
      <p>目前頁面不提供買賣建議；請把燈號當成市場狀態摘要與風險提示。</p>
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

function StockDecisionCompass() {
  return (
    <section className="panel stock-decision-compass" aria-label="判斷輔助">
      <p className="eyebrow">判斷輔助</p>
      <h2>燈號不是買賣指令</h2>
      <p>請把燈號用來整理市場狀態、風險來源與後續觀察重點，而不是直接當成交易決策。</p>
      <div className="home-first-screen-decision__actions" aria-label="延伸閱讀">
        <TrackedLink eventName="stock_link_clicked" href="/briefing" label="查看市場快報" payload={{ area: "stock_compass" }}>
          查看市場快報
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
    <section className="panel stock-reading-summary" aria-label="市場背景">
      <p className="eyebrow">市場背景</p>
      <h2>{snapshot.asset.name} 的觀察脈絡</h2>
      <p>Phase 1 先用示範資料呈現市場背景、風險分數與燈號原因。正式資料上線後，這裡會接到來源與更新時間。</p>
    </section>
  );
}

function MarketLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場排行">
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
        <p className="eyebrow">目前燈號</p>
        <h2>{snapshot.signal.title}</h2>
        <p>{snapshot.signal.text}</p>
      </article>
      <article className="panel">
        <p className="eyebrow">綜合分數</p>
        <h2>{snapshot.compositeScore}/100</h2>
        <p>綜合分數整理趨勢、品質、評價、資金與風險背景，作為快速閱讀入口。</p>
      </article>
      <article className="panel">
        <p className="eyebrow">風險分數</p>
        <h2>{snapshot.riskScore}/100</h2>
        <p>風險分數越高，越需要檢查波動、資料更新時間與市場背景。</p>
      </article>
    </section>
  );
}
