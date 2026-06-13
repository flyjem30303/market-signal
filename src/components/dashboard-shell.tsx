"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CommercialSlot } from "@/components/commercial-slot";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
import { PublicBetaMembershipMvpRoadmap } from "@/components/public-beta-membership-mvp-roadmap";
import { PublicBetaPublicStatusSurface } from "@/components/public-beta-public-status-surface";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicBetaUsableLoopPanel } from "@/components/public-beta-usable-loop-panel";
import { StockRuntimeAtAGlance } from "@/components/stock-runtime-at-a-glance";
import { TrackedLink } from "@/components/tracked-link";
import { buildMockDataFreshnessSnapshot, type DataFreshnessSnapshot } from "@/lib/data-freshness";
import { buildInvestorActionSummary, type InvestorActionItem } from "@/lib/investor-action-summary";
import {
  getInvestorIndicatorRoadmap,
  type InvestorIndicatorStatus
} from "@/lib/investor-indicator-roadmap";
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

type StockActionTab = InvestorActionItem["tab"];

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
  const snapshot = repository.getSnapshot(selected.symbol, snapshotDate) ?? repository.getSnapshot(assets[0].symbol, snapshotDate)!;
  const snapshots = assets
    .map((asset) => repository.getSnapshot(asset.symbol, snapshotDate))
    .filter((item): item is SignalSnapshot => Boolean(item));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshot;
  const breadth = buildBreadth(snapshots);
  const riskList = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore).slice(0, 4);
  const strongList = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const isStockPage = includeSeoContent;
  const stockInvestorSummary = buildInvestorActionSummary(snapshot);

  function selectAsset(next: Asset) {
    setSymbol(next.symbol);
    router.push(`/stocks/${next.symbol}`);
  }

  function openStockActionTab(tab: StockActionTab) {
    const anchorByTab: Record<StockActionTab, string> = {
      backtest: "stock-data-boundary",
      fundamentals: "stock-market-context",
      technical: "stock-indicator-priority",
      today: "stock-public-summary",
      trend: "stock-market-context"
    };

    router.push(`/stocks/${selected.symbol}#${anchorByTab[tab]}`);
  }

  return (
    <main className="page-shell">
      <section className="hero dashboard-hero">
        <p className="eyebrow">指數燈號</p>
        <h1>{isStockPage ? `${selected.symbol} ${selected.name} 燈號總覽` : "指數狀態儀表站"}</h1>
        <p>
          用紅、黃、綠燈號整理市場氣氛、風險分數、趨勢強弱與資料更新時間。使用者可在 30 秒內看懂市場氛圍，
          透過 30 秒可讀的摘要看懂市場狀態，再用 3 分鐘內判斷的 3 分鐘可行動流程，依 3 分鐘判斷順序決定下一步觀察、加強觀察或降低風險。
        </p>
        <p className="runtime-boundary-line">
          目前公開 Beta 仍以示範資料建立閱讀流程；正式市場資料尚未啟用前不宣稱即時行情、不提供買賣建議，也不提供個股買賣建議。
        </p>
        <div className="hero-status-strip" aria-label="公開 Beta 快速閱讀重點">
          <span>30 秒市場氣氛</span>
          <span>3 分鐘判斷順序</span>
          <span>示範資料邊界</span>
          <span>會員預覽下一階段</span>
        </div>
      </section>

      {isStockPage ? (
        <>
          <StockRuntimeAtAGlance scoreSourceLabel={freshness.scoreSourceLabel} snapshot={snapshot} />
          <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
        </>
      ) : (
        <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      )}

      <PublicBetaPublicStatusSurface />
      <PublicBetaDataReadinessStatus />
      <PublicBetaSourceCoverageBridge context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />
      <PublicBetaUsableLoopPanel context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />

      {!isStockPage && (
        <>
          <HomeMarketOverview breadth={breadth} market={market} snapshot={snapshot} />
          <HomeCoreIndicatorReadout breadth={breadth} market={market} snapshot={snapshot} />
        </>
      )}

      {isStockPage && (
        <>
          <StockPublicSummary onTab={openStockActionTab} snapshot={snapshot} summary={stockInvestorSummary} />
          <StockMarketContextPanel breadth={breadth} market={market} snapshot={snapshot} />
          <StockDataBoundaryPanel snapshot={snapshot} />
          <StockInvestorIndicatorRoadmap />
        </>
      )}

      <section className="stock-search-panel" aria-label="標的切換">
        <div>
          <p className="eyebrow">市場標的</p>
          <h2>切換指數、ETF 與示範股票</h2>
          <p>先用同一套閱讀順序比較市場氣氛、風險分數與資料狀態；正式資料覆蓋率完成前，標的仍以示範展示為主。</p>
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

      <section className="weekly-grid" aria-label="市場排行">
        <div className="panel-intro">
          <p className="eyebrow">市場觀察</p>
          <h2>全市場總覽、警示清單與警示提醒</h2>
          <p>這裡整理相對偏強與風險較高的標的，只協助排序觀察重點，不代表買賣建議。請搭配資料可信度與更新時間一起閱讀。</p>
        </div>
        <MarketList
          title="相對偏強觀察"
          description="綜合分數較高的標的，可用來觀察市場是否仍有支撐。"
          items={strongList}
          valueKey="composite"
        />
        <MarketList
          title="風險較高觀察"
          description="風險分數較高的標的，適合先複核成因與資料狀態。"
          items={riskList}
          valueKey="risk"
        />
      </section>

      <CommercialSlot context={isStockPage ? "stock" : "briefing"} />
      <PublicBetaMembershipMvpRoadmap />

      <article className="disclaimer">
        <h2>風險提醒</h2>
        <p>
          本站定位為市場資訊整理、風險辨識與觀察輔助工具；不提供買賣建議、不提供個股買賣建議、不保證報酬，
          也不代替使用者做投資決策。
        </p>
      </article>
    </main>
  );
}

function HomeMarketOverview({
  breadth,
  market,
  snapshot
}: {
  breadth: ReturnType<typeof buildBreadth>;
  market: SignalSnapshot;
  snapshot: SignalSnapshot;
}) {
  return (
    <section className="home-public-beta-layers" aria-label="市場三層總覽">
      <div className="home-public-beta-layer active">
        <span>市場氣氛</span>
        <strong>{market.signal.title}</strong>
        <p>用燈號先建立今天的市場背景，再進一步複核風險、廣度、資料信任與資料更新時間。</p>
      </div>
      <div className="home-public-beta-layer readying">
        <span>市場廣度</span>
        <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
        <p>依序代表偏多、觀察與防守標的數量，協助判斷風險是否擴散。</p>
      </div>
      <div className="home-public-beta-layer blocked">
        <span>資料可信度</span>
        <strong>{snapshot.dataQualityGrade}</strong>
        <p>正式資料升級前，首頁會保留示範資料與非投資建議提示。</p>
      </div>
    </section>
  );
}

function StockPublicSummary({
  onTab,
  snapshot,
  summary
}: {
  onTab: (tab: StockActionTab) => void;
  snapshot: SignalSnapshot;
  summary: ReturnType<typeof buildInvestorActionSummary>;
}) {
  const support = summary.observationFocus;
  const risk = summary.primaryRisk;
  const hasGaps = snapshot.missingModuleFlags.length + snapshot.staleDataFlags.length > 0;

  return (
    <section className="stock-indicator-priority" id="stock-indicator-priority" aria-label="個股三分鐘複核順序">
      <div>
        <p className="eyebrow">Investor Action Summary / 決策輔助摘要 / 指標優先順序</p>
        <h2>
          {snapshot.asset.symbol} {snapshot.asset.name} 的觀察順序
        </h2>
        <p>標的決策摘要先做 30 秒快讀，再看資料可信度、趨勢強弱、影響級別與風險成因；不要把示範燈號當成交易指令。</p>
      </div>
      <div className="stock-indicator-priority-grid">
        <article className={hasGaps ? "hold" : "active"}>
          <span>1. 資料可信度</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>{hasGaps ? "目前仍有示範資料提示，請先看資料邊界。" : "資料狀態可閱讀，但仍需正式來源確認。"}</p>
          <button type="button" onClick={() => onTab("today")}>查看資料狀態</button>
        </article>
        <article className="active">
          <span>2. 趨勢觀察</span>
          <strong>{support.title}</strong>
          <p>{support.body}</p>
          <button type="button" onClick={() => onTab("trend")}>查看趨勢脈絡</button>
        </article>
        <article className={risk.tone === "blocked" ? "blocked" : "hold"}>
          <span>3. 風險成因</span>
          <strong>{risk.title}</strong>
          <p>{risk.body}</p>
          <button type="button" onClick={() => onTab("technical")}>查看風險來源</button>
        </article>
      </div>
    </section>
  );
}

function StockInvestorIndicatorRoadmap() {
  const roadmap = getInvestorIndicatorRoadmap();

  return (
    <section className="stock-investor-indicator-roadmap" aria-label="投資指標路線">
      <div>
        <p className="eyebrow">指標路線</p>
        <h2>哪些指標已可閱讀，哪些要等正式資料</h2>
        <p>公開頁先呈現一般投資者能理解的核心指標；會員深度指標與個人化追蹤會留到下一階段。</p>
        <strong>{roadmap.boundary.statement}</strong>
      </div>
      <div className="indicator-roadmap-grid">
        {roadmap.families.map((family) => (
          <article className={family.status} key={family.id}>
            <span>{getInvestorIndicatorStatusLabel(family.status)}</span>
            <strong>{family.label}</strong>
            <p>{family.productValue}</p>
            <small>{family.currentUse}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockMarketContextPanel({
  breadth,
  market,
  snapshot
}: {
  breadth: ReturnType<typeof buildBreadth>;
  market: SignalSnapshot;
  snapshot: SignalSnapshot;
}) {
  return (
    <section className="stock-market-context" id="stock-market-context" aria-label="市場脈絡">
      <div>
        <p className="eyebrow">Market Context</p>
        <h2>把單一標的放回市場脈絡</h2>
        <p>個股燈號需要搭配大盤狀態、市場廣度與資料可信度一起閱讀，這是 3 分鐘判斷順序，不應直接視為個股買賣建議。</p>
      </div>
      <div className="market-context-grid">
        <article className="positive">
          <span>市場燈號</span>
          <strong>{market.signal.title}</strong>
          <p>先確認今天的市場背景。</p>
        </article>
        <article className="watch">
          <span>市場廣度</span>
          <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
          <p>觀察風險是否集中在少數標的，或已擴散到整體市場。</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "risk" : "positive"}>
          <span>個股風險</span>
          <strong>{snapshot.riskScore}</strong>
          <p>風險分數偏高時，先看成因與資料更新時間。</p>
        </article>
      </div>
    </section>
  );
}

function StockDataBoundaryPanel({ snapshot }: { snapshot: SignalSnapshot }) {
  const missing = [...snapshot.missingModuleFlags, ...snapshot.staleDataFlags];

  return (
    <section className="stock-risk-checklist" id="stock-data-boundary" aria-label="資料邊界檢查">
      <div>
        <p className="eyebrow">資料邊界</p>
        <h2>先確認資料狀態，再解讀燈號</h2>
        <p>目前仍為示範資料；正式資料來源、欄位契約、覆蓋率與回補完成前，不宣稱即時行情或完整覆蓋。</p>
      </div>
      <div className="risk-check-grid">
        <article className="watch">
          <span>資料品質</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>資料品質只是閱讀提示，不代表投資評等。</p>
        </article>
        <article className={missing.length ? "watch" : "pass"}>
          <span>資料提示</span>
          <strong>{missing.length ? `${missing.length} 個提示` : "沒有額外提示"}</strong>
          <p>{missing.length ? "仍有資料缺漏或示範資料提示需要留意。" : "目前示範資料沒有額外缺漏提示。"}</p>
        </article>
        <article className="watch">
          <span>非投資建議</span>
          <strong>只做觀察輔助</strong>
          <p>本站不提供買賣建議，也不提供個股買賣建議。</p>
        </article>
      </div>
    </section>
  );
}

function getInvestorIndicatorStatusLabel(status: InvestorIndicatorStatus) {
  const labels: Record<InvestorIndicatorStatus, string> = {
    "blocked-until-real-data": "等待正式資料",
    "design-only": "設計中",
    "mock-readable": "示範可讀"
  };

  return labels[status];
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
      action: "先看市場狀態",
      body: `偏多 ${breadth.constructive}、觀察 ${breadth.watch}、防守 ${breadth.defensive}。`,
      label: "市場氣氛",
      tone: "constructive",
      value: market.signal.title
    },
    {
      action: "確認風險是否擴散",
      body: "市場廣度協助判斷是少數標的轉弱，還是整體市場一起轉弱。",
      label: "市場廣度",
      tone: breadth.constructive >= breadth.defensive ? "constructive" : "watch",
      value: `${breadth.constructive}/${breadth.watch}/${breadth.defensive}`
    },
    {
      action: riskTone === "defensive" ? "優先複核風險" : "維持觀察",
      body: `風險分數 ${market.riskScore}/100，請搭配更新時間與資料狀態閱讀。`,
      label: "風險熱度",
      tone: riskTone,
      value: `${market.riskScore}/100`
    },
    {
      action: "確認資料邊界",
      body: `資料品質 ${snapshot.dataQualityGrade}，更新時間 ${formatTaipeiTime(snapshot.lastUpdatedAt)}。`,
      label: "資料可信度",
      tone: dataTone,
      value: snapshot.dataQualityGrade
    }
  ];

  return (
    <section className="home-core-indicator-readout" aria-label="核心指標摘要">
      <div>
        <p className="eyebrow">核心指標快讀</p>
        <h2>30 秒看市場氣氛，3 分鐘行動判斷</h2>
        <p>首頁只放最必要的指標：市場燈號、市場廣度、風險熱度與資料可信度，協助使用者形成下一步觀察。</p>
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
