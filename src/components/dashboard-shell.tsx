"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CommercialSlot } from "@/components/commercial-slot";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PublicBetaMembershipMvpRoadmap } from "@/components/public-beta-membership-mvp-roadmap";
import { StockRuntimeAtAGlance } from "@/components/stock-runtime-at-a-glance";
import { TrackedLink } from "@/components/tracked-link";
import { buildMockDataFreshnessSnapshot, type DataFreshnessSnapshot } from "@/lib/data-freshness";
import {
  getMarketSignalRepository,
  type MarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { Asset } from "@/lib/assets";
import type { SignalSnapshot } from "@/lib/signal-model";

type DashboardShellProps = {
  freshnessSnapshot?: DataFreshnessSnapshot;
  initialSymbol: string;
  includeSeoContent?: boolean;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
};

const today = "2026-05-28";

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
  const snapshot = repository.getSnapshot(selected.symbol, today) ?? repository.getSnapshot(assets[0].symbol, today)!;
  const snapshots = assets
    .map((asset) => repository.getSnapshot(asset.symbol, today))
    .filter((item): item is SignalSnapshot => Boolean(item));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshot;
  const breadth = buildBreadth(snapshots);
  const riskList = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore).slice(0, 4);
  const strongList = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const isStockPage = includeSeoContent;

  function selectAsset(next: Asset) {
    setSymbol(next.symbol);
    router.push(`/stocks/${next.symbol}`);
  }

  return (
    <main className="page-shell">
      <section className="hero dashboard-hero">
        <p className="eyebrow">Taiwan Market Signal</p>
        <h1>{isStockPage ? `${selected.symbol} ${selected.name} 狀態儀表` : "指數狀態儀表站"}</h1>
        <p>
          用紅、黃、綠燈號整理市場風險、趨勢強弱與觀察重點。目標是讓使用者在 30 秒內看懂市場氛圍，
          並在 3 分鐘內判斷要關注、加強觀察，或先降低風險。
        </p>
        <p className="runtime-boundary-line">
          正式市場資料尚未啟用；目前公開版使用示範資料與模型分數呈現產品體驗。正式資料接入前，所有燈號都應視為觀察輔助。
          本網站不提供買賣建議，也不提供個股買賣建議；所有內容都不是投資建議或買賣指令。
        </p>
      </section>

      {isStockPage ? (
        <>
          <StockRuntimeAtAGlance scoreSourceLabel={freshness.scoreSourceLabel} snapshot={snapshot} />
          <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
        </>
      ) : (
        <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      )}

      <section className="home-public-beta-layers" aria-label="市場三層視圖">
        <div className="home-public-beta-layer active">
          <span>全市場總覽</span>
          <strong>{market.signal.title}</strong>
          <p>
            目前 {breadth.constructive} 個標的偏強、{breadth.watch} 個標的觀望、{breadth.defensive} 個標的偏防守。
            先看市場整體氣氛，再決定是否需要深入檢查個別指標。
          </p>
        </div>
        <div className="home-public-beta-layer readying">
          <span>核心指標面板</span>
          <strong>
            健康 {snapshot.healthScore} / 風險 {snapshot.riskScore}
          </strong>
          <p>
            健康分數反映趨勢、基本面、資金與市場廣度；風險分數提醒估值、波動與防守壓力。
          </p>
        </div>
        <div className="home-public-beta-layer blocked">
          <span>資料可信度</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>
            資料品質等級與更新時間會影響燈號可信度。若資料延遲或缺漏，請把燈號當作待複核的提示。
          </p>
        </div>
      </section>

      {!isStockPage && <HomeCoreIndicatorReadout breadth={breadth} market={market} snapshot={snapshot} />}

      {!isStockPage && (
        <section className="panel stock-reading-summary" aria-label="正式資料升級前檢查">
          <p className="eyebrow">Data Trust</p>
          <h2>正式資料升級前檢查</h2>
          <p>
            在正式資料源完成授權、覆蓋率與更新流程驗證前，頁面會清楚標示資料可信度、更新時間與示範資料狀態。
            使用者可以先用它建立觀察流程，但不應把目前燈號視為即時正式市場訊號。
          </p>
        </section>
      )}

      {!isStockPage && (
        <section className="panel stock-reading-summary" aria-label="3 分鐘行動判斷">
          <p className="eyebrow">3 分鐘行動判斷</p>
          <h2>決策輔助摘要：先看市場狀態，再看風險來源，最後決定下一步觀察</h2>
          <p>
            這個頁面不是要替使用者做買賣決定，而是把分散的市場訊號整理成可理解的觀察順序：
            市場氛圍、核心指標、資料狀態與風險提醒。
          </p>
          <div className="briefing-actions">
            <ActionCard title="市場燈號" text={`目前市場總覽為「${market.signal.title}」，請先確認這個狀態是否符合你的觀察週期。`} />
            <ActionCard title="風險來源" text={`健康分數 ${market.healthScore}/100，風險分數 ${market.riskScore}/100；分數接近時應避免過度解讀。`} />
            <ActionCard title="資料更新" text={`資料品質 ${market.dataQualityGrade}，更新時間 ${formatTaipeiTime(market.lastUpdatedAt)}。`} />
            <ActionCard title="下一步" text="若市場轉弱，優先檢查風險是否擴散；若市場偏強，也要確認資料是否新鮮與是否集中在少數標的。" />
          </div>
        </section>
      )}

      <section className="stock-search-panel" aria-label="標的分類">
        <div>
          <p className="eyebrow">Explore</p>
          <h2>查看指數、ETF 與核心標的</h2>
          <p>
            先用總覽理解市場氣氛，再切到你關注的指數、ETF 或大型權值股，檢查燈號原因與資料狀態。
          </p>
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

      <section className="weekly-grid" aria-label="市場清單">
        <MarketList
          title="相對偏強"
          description="分數較高的標的代表示範模型目前給出較正向的市場狀態，仍需搭配風險與資料時間複核。"
          items={strongList}
          valueKey="composite"
        />
        <MarketList
          title="風險較高"
          description="風險分數較高的標的需要加強觀察，特別是波動升高、趨勢轉弱或資料延遲時。"
          items={riskList}
          valueKey="risk"
        />
      </section>

      {isStockPage && (
        <section className="panel stock-reading-summary" aria-label="標的 30 秒解讀">
          <p className="eyebrow">30 秒解讀</p>
          <h2>{selected.symbol} {selected.name} 目前是「{snapshot.signal.title}」</h2>
          <p>
            這個狀態儀表把標的狀態拆成燈號、分數、更新時間與風險提醒。請把它當作觀察輔助，
            不提供個股買賣建議。
          </p>
          <div className="briefing-actions">
            <ActionCard title="核心分數" text={`健康 ${snapshot.healthScore}/100，風險 ${snapshot.riskScore}/100。`} />
            <ActionCard title="更新時間" text={formatTaipeiTime(snapshot.lastUpdatedAt)} />
            <ActionCard title="資料狀態" text={`資料品質等級 ${snapshot.dataQualityGrade}；若資料延遲，請降低判斷權重。`} />
            <ActionCard title="觀察重點" text="若燈號轉弱，先看風險是否擴散；若燈號轉強，確認是否有足夠市場廣度支撐。" />
          </div>
        </section>
      )}

      {!isStockPage && <PublicBetaMembershipMvpRoadmap />}

      <section className="panel next-reading-panel">
        <p className="eyebrow">Next</p>
        <h2>下一步閱讀</h2>
        <div className="briefing-actions">
          <TrackedLink className="text-link" eventName="home_cta_clicked" href="/briefing" label="市場簡報" payload={{ area: "next_reading" }}>
            市場簡報
          </TrackedLink>
          <TrackedLink className="text-link" eventName="home_cta_clicked" href="/weekly" label="每週觀察" payload={{ area: "next_reading" }}>
            每週觀察
          </TrackedLink>
          <TrackedLink className="text-link" eventName="trust_link_clicked" href="/methodology" label="方法說明" payload={{ area: "next_reading" }}>
            方法說明
          </TrackedLink>
          <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="風險聲明" payload={{ area: "next_reading" }}>
            風險聲明
          </TrackedLink>
        </div>
      </section>

      <CommercialSlot context={isStockPage ? "stock" : "briefing"} />
    </main>
  );
}

function HomeCoreIndicatorReadout({
  breadth,
  market,
  snapshot
}: {
  breadth: ReturnType<typeof buildBreadth>;
  market: SignalSnapshot;
  snapshot: SignalSnapshot;
}) {
  const riskTone = market.riskScore >= 70 ? "defensive" : market.riskScore >= 55 ? "watch" : "constructive";
  const dataTone = snapshot.dataQualityGrade === "A" || snapshot.dataQualityGrade === "B" ? "constructive" : "watch";
  const coreIndicatorReadouts = [
    {
      action: "先看整體市場",
      body: `偏強 ${breadth.constructive}、觀望 ${breadth.watch}、偏防守 ${breadth.defensive}。`,
      label: "市場氛圍",
      tone: "constructive",
      value: market.signal.title
    },
    {
      action: "檢查是否擴散",
      body: "市場廣度可以提醒行情是否只集中在少數標的，或已經擴散到更多族群。",
      label: "市場廣度",
      tone: breadth.constructive >= breadth.defensive ? "constructive" : "watch",
      value: `${breadth.constructive}/${breadth.watch}/${breadth.defensive}`
    },
    {
      action: riskTone === "defensive" ? "加強風險控管" : "持續觀察",
      body: `風險分數 ${market.riskScore}/100；分數越高，越需要檢查波動、估值與資料新鮮度。`,
      label: "風險提醒",
      tone: riskTone,
      value: `${market.riskScore}/100`
    },
    {
      action: "確認資料狀態",
      body: `資料品質 ${snapshot.dataQualityGrade}，更新時間 ${formatTaipeiTime(snapshot.lastUpdatedAt)}。`,
      label: "資料更新",
      tone: dataTone,
      value: snapshot.dataQualityGrade
    }
  ];

  return (
    <section className="home-core-indicator-readout" aria-label="核心指標摘要">
      <div>
        <p className="eyebrow">Core Indicator Readout</p>
        <h2>核心指標摘要</h2>
        <p>
          先用市場氛圍建立方向，再用廣度、風險與資料狀態複核。這個順序可以降低只看單一分數造成的誤判。
        </p>
      </div>
      <div className="home-core-indicator-grid">
        {coreIndicatorReadouts.map((item) => (
          <article className={item.tone} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.body}</p>
            <em>{item.action}</em>
          </article>
        ))}
      </div>
    </section>
  );
}

function buildBreadth(snapshots: SignalSnapshot[]) {
  return snapshots.reduce(
    (summary, item) => {
      if (item.compositeScore >= 70) summary.constructive += 1;
      else if (item.riskScore >= 60 || item.compositeScore < 45) summary.defensive += 1;
      else summary.watch += 1;
      return summary;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
}

function formatTaipeiTime(value: string) {
  return value.replace("T", " ").replace("+08:00", " 台北時間");
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
            payload={{ area: valueKey === "risk" ? "risk_list" : "strong_list", symbol: item.asset.symbol }}
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

function ActionCard({ text, title }: { text: string; title: string }) {
  return (
    <article>
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}
