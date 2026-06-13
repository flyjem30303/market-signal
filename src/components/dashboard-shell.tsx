"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CommercialSlot } from "@/components/commercial-slot";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { HomeRuntimeStatusPanel } from "@/components/home-runtime-status-panel";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
import { PublicBetaIndexDashboardBriefLoopPanel } from "@/components/public-beta-index-dashboard-brief-loop-panel";
import { PublicBetaMembershipMvpRoadmap } from "@/components/public-beta-membership-mvp-roadmap";
import { PublicBetaPublicStatusSurface } from "@/components/public-beta-public-status-surface";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
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
        <h1>{isStockPage ? `${selected.symbol} ${selected.name} 指數燈號` : "指數狀態儀表站"}</h1>
        <p>
          指數燈號把市場狀態、風險熱度、資料可信度與下一步觀察整理成同一條閱讀路徑。
          使用者可以先用 30 秒看懂大方向，再用 3 分鐘決定是否關注、加強觀察或降低風險。
        </p>
        <p className="runtime-boundary-line">
          目前公開 Beta 使用示範資料與示範分數；正式市場資料尚未啟用，完整覆蓋率與正式模型也仍在驗證。
          本站提供市場資訊整理與風險辨識，不提供個股買賣建議，也不應作為交易依據。
        </p>
        {!isStockPage && (
          <p className="runtime-boundary-line">
            決策輔助摘要：先看市場氣氛，再看風險熱度與資料可信度，最後回到提醒列表與後續閱讀。
          </p>
        )}
      </section>

      {!isStockPage && (
        <>
          <PublicBetaPublicStatusSurface />
          <PublicBetaIndexDashboardBriefLoopPanel />
          <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
          <HomeRuntimeStatusPanel selectedSymbol={selected.symbol} />
        </>
      )}

      {isStockPage && (
        <>
          <StockRuntimeAtAGlance scoreSourceLabel={freshness.scoreSourceLabel} snapshot={snapshot} />
          <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
        </>
      )}

      <section className="home-public-beta-layers" aria-label="市場狀態三層摘要">
        <div className="home-public-beta-layer active">
          <span>市場氣氛</span>
          <strong>{market.signal.title}</strong>
          <p>
            偏強 {breadth.constructive} 個、觀察 {breadth.watch} 個、防守 {breadth.defensive} 個。
            先用市場氣氛判斷目前偏多、觀望或需要保守。
          </p>
        </div>
        <div className="home-public-beta-layer readying">
          <span>核心分數</span>
          <strong>
            健康 {snapshot.healthScore} / 風險 {snapshot.riskScore}
          </strong>
          <p>分數用來排序觀察重點；請搭配成因、更新時間與資料品質一起判讀。</p>
        </div>
        <div className="home-public-beta-layer blocked">
          <span>資料可信度</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>正式資料尚未啟用，公開頁會持續標示示範資料、更新時間與資料邊界。</p>
        </div>
      </section>

      {!isStockPage && <HomeCoreIndicatorReadout breadth={breadth} market={market} snapshot={snapshot} />}

      {!isStockPage && (
        <section className="panel stock-reading-summary" aria-label="3 分鐘行動判斷">
          <p className="eyebrow">3 分鐘行動判斷</p>
          <h2>先看市場氣氛，再決定是否加強觀察或降低風險</h2>
          <p>
            首頁把市場狀態、風險成因、資料邊界與下一步閱讀放在同一條路徑中。
            目前仍是示範資料，適合用來熟悉判斷順序，不適合作為交易依據。
          </p>
          <div className="briefing-actions">
            <ActionCard title="市場燈號" text={`目前市場主燈號為 ${market.signal.title}，先確認是否仍適合關注。`} />
            <ActionCard
              title="成因"
              text={`健康分數 ${market.healthScore}/100，風險分數 ${market.riskScore}/100；請看成因與更新時間。`}
            />
            <ActionCard title="資料狀態" text={`資料品質 ${market.dataQualityGrade}；正式資料尚未啟用，請保守解讀。`} />
            <ActionCard title="下一步觀察" text="如果訊號偏強，列入觀察；如果風險升溫，先看市場晨報與風險聲明。" />
          </div>
        </section>
      )}

      <section className="stock-search-panel" aria-label="切換觀察標的">
        <div>
          <p className="eyebrow">Explore</p>
          <h2>切換觀察標的</h2>
          <p>公開 Beta 先提供代表性指數、ETF 與股票樣本，協助使用者理解燈號、成因與資料邊界。</p>
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

      <section className="weekly-grid" aria-label="市場觀察清單">
        <MarketList title="偏強觀察" description="分數較高的標的可作為市場氣氛延續觀察，不代表買進建議。" items={strongList} valueKey="composite" />
        <MarketList title="風險觀察" description="風險分數較高的標的需要先看成因與更新時間，再決定是否加強觀察。" items={riskList} valueKey="risk" />
      </section>

      {isStockPage && (
        <section className="panel stock-reading-summary" aria-label="標的頁 30 秒快速閱讀">
          <p className="eyebrow">30 秒快速閱讀</p>
          <h2>先看標的狀態，再對照市場與資料品質</h2>
          <p>
            目前顯示 {snapshot.signal.title}。請先看狀態、成因、更新時間與資料邊界，
            再決定是否持續觀察；本頁不提供個股買賣建議。
          </p>
          <div className="briefing-actions">
            <ActionCard title="分數" text={`健康分數 ${snapshot.healthScore}/100，風險分數 ${snapshot.riskScore}/100。`} />
            <ActionCard title="更新時間" text={`資料更新時間：${formatTaipeiTime(snapshot.lastUpdatedAt)}。`} />
            <ActionCard title="資料狀態" text="公開 Beta 目前使用示範資料；正式更新節奏尚未啟用。" />
            <ActionCard title="下一步觀察" text="先看資料狀態與風險說明，再決定是否持續觀察；不應直接視為個股買賣建議。" />
          </div>
        </section>
      )}

      <PublicBetaDataReadinessStatus />
      <PublicBetaSourceCoverageBridge context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />

      {!isStockPage && <PublicBetaMembershipMvpRoadmap />}

      <section className="panel next-reading-panel">
        <p className="eyebrow">Next</p>
        <h2>下一步閱讀</h2>
        <div className="briefing-actions">
          <TrackedLink className="text-link" eventName="home_cta_clicked" href="/briefing" label="市場晨報" payload={{ area: "next_reading" }}>
            市場晨報
          </TrackedLink>
          <TrackedLink className="text-link" eventName="home_cta_clicked" href="/weekly" label="市場週報" payload={{ area: "next_reading" }}>
            市場週報
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
      action: "可先關注",
      body: `偏強 ${breadth.constructive} 個、觀察 ${breadth.watch} 個、防守 ${breadth.defensive} 個。`,
      label: "市場氣氛",
      tone: "constructive",
      value: market.signal.title
    },
    {
      action: "確認擴散",
      body: "市場廣度用來確認燈號是否由多數標的一起支撐，而不是只靠少數權值或單一題材。",
      label: "市場廣度",
      tone: breadth.constructive >= breadth.defensive ? "constructive" : "watch",
      value: `${breadth.constructive}/${breadth.watch}/${breadth.defensive}`
    },
    {
      action: riskTone === "defensive" ? "降低風險" : "加強觀察",
      body: `風險分數 ${market.riskScore}/100；若升溫，先回到風險成因與市場晨報。`,
      label: "風險熱度",
      tone: riskTone,
      value: `${market.riskScore}/100`
    },
    {
      action: "先複核",
      body: `資料品質 ${snapshot.dataQualityGrade}，更新時間 ${formatTaipeiTime(snapshot.lastUpdatedAt)}。`,
      label: "資料可信度",
      tone: dataTone,
      value: snapshot.dataQualityGrade
    }
  ];

  return (
    <section className="home-core-indicator-readout" aria-label="核心指標快讀">
      <div>
        <p className="eyebrow">Core Indicator Readout</p>
        <h2>核心指標快讀</h2>
        <p>
          先看市場氣氛，再看市場廣度、風險熱度與資料可信度。這些指標幫助使用者快速決定要關注、
          加強觀察，或先降低風險。公開 Beta 仍使用示範資料，正式資料尚未啟用。
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
