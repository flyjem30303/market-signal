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
  buildInvestorActionSummary,
  type InvestorActionItem,
  type InvestorActionSummary
} from "@/lib/investor-action-summary";
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
          <p className="eyebrow">資料信任</p>
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
            <ActionCard title="下一步觀察" text="若市場轉弱，優先檢查風險是否擴散；若市場偏強，也要確認資料是否新鮮與是否集中在少數標的。" />
          </div>
        </section>
      )}

      <section className="stock-search-panel" aria-label="標的分類">
        <div>
          <p className="eyebrow">標的瀏覽</p>
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

      <section className="weekly-grid" aria-label="警示提醒">
        <div className="panel-intro">
          <p className="eyebrow">警示提醒</p>
          <h2>先看相對偏強，再看風險較高</h2>
          <p>
            這裡把可關注與需複核的標的分開，協助使用者在 3 分鐘內決定要繼續觀察、加強複核，或先降低風險。
          </p>
        </div>
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
        <section className="panel stock-reading-summary" id="stock-public-summary" aria-label="標的 30 秒解讀">
          <p className="eyebrow">30 秒解讀</p>
          <h2>{selected.symbol} {selected.name} 目前是「{snapshot.signal.title}」</h2>
          <p>
            30 秒快速閱讀時，先把單一標的放回市場脈絡，再看成因、更新時間、影響級別與下一步。
            這個狀態儀表把標的狀態拆成燈號、分數、更新時間與風險提醒；請把它當作觀察輔助，
            不能當成個股買賣指令，也不提供個股買賣建議。
          </p>
          <div className="briefing-actions">
            <ActionCard title="核心分數" text={`健康 ${snapshot.healthScore}/100，風險 ${snapshot.riskScore}/100。`} />
            <ActionCard title="更新時間" text={formatTaipeiTime(snapshot.lastUpdatedAt)} />
            <ActionCard title="資料狀態" text={`資料品質等級 ${snapshot.dataQualityGrade}；若資料延遲，請降低判斷權重。`} />
            <ActionCard title="觀察重點" text="若燈號轉弱，先看風險是否擴散；若燈號轉強，確認是否有足夠市場廣度支撐。" />
          </div>
        </section>
      )}

      {isStockPage && (
        <>
          <StockDecisionCompass scoreSourceLabel={freshness.scoreSourceLabel} snapshot={snapshot} />
          <StockInvestorActionSummary summary={stockInvestorSummary} onTab={openStockActionTab} />
          <StockIndicatorPriorityPanel snapshot={snapshot} onTab={openStockActionTab} />
          <StockInvestorIndicatorRoadmap />
          <StockMarketContextPanel breadth={breadth} market={market} snapshot={snapshot} />
          <StockDataBoundaryPanel snapshot={snapshot} />
        </>
      )}

      {!isStockPage && <PublicBetaMembershipMvpRoadmap />}

      <section className="panel next-reading-panel">
        <p className="eyebrow">下一步</p>
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

function StockDecisionCompass({
  scoreSourceLabel,
  snapshot
}: {
  scoreSourceLabel: string;
  snapshot: SignalSnapshot;
}) {
  const scoreTone = snapshot.riskScore >= 70 ? "blocked" : snapshot.riskScore >= 55 ? "hold" : "active";

  return (
    <section aria-label="Stock Decision Compass" className="stock-decision-compass">
      <div className="stock-decision-compass-heading">
        <p className="eyebrow">決策輔助摘要</p>
        <h2>30 秒快讀後，決定是否進入 3 分鐘複核</h2>
      </div>
      <article className={snapshot.compositeScore >= 62 ? "active" : snapshot.compositeScore >= 48 ? "hold" : "blocked"}>
        <span>30 秒可用</span>
        <strong>{snapshot.signal.title}</strong>
        <p>先看燈號與一句話成因，再決定是否需要進入 3 分鐘複核。</p>
      </article>
      <article className={scoreTone}>
        <span>風險熱度</span>
        <strong>{snapshot.riskScore}/100</strong>
        <p>風險越高，越要先看風險來源與資料更新時間，避免只看分數。</p>
      </article>
      <article className="blocked">
        <span>示範分數</span>
        <strong>{scoreSourceLabel}</strong>
        <p>正式資料與正式分數尚未啟用；本頁不提供買賣建議。</p>
      </article>
    </section>
  );
}

function StockInvestorActionSummary({
  onTab,
  summary
}: {
  onTab: (tab: StockActionTab) => void;
  summary: InvestorActionSummary;
}) {
  const items = [summary.observationFocus, summary.primaryRisk, summary.stopCondition];

  return (
    <section className="stock-investor-action-summary" aria-label="Investor Action Summary">
      <div>
        <p className="eyebrow">投資人行動摘要</p>
        <h2>把單一標的放回市場脈絡</h2>
        <p>{summary.headline}</p>
        <p>{summary.safetyLine}</p>
      </div>
      <div className="investor-action-grid">
        {items.map((item) => (
          <article className={item.tone} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
            <button type="button" onClick={() => onTab(item.tab)}>
              查看{item.label}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockIndicatorPriorityPanel({
  onTab,
  snapshot
}: {
  onTab: (tab: StockActionTab) => void;
  snapshot: SignalSnapshot;
}) {
  const rankedModules = snapshot.modules.slice().sort((a, b) => b.health - a.health);
  const riskModules = snapshot.modules.slice().sort((a, b) => b.risk - a.risk);
  const support = rankedModules[0];
  const risk = riskModules[0];
  const hasGaps = snapshot.missingModuleFlags.length > 0 || snapshot.staleDataFlags.length > 0;
  const qualityTone = hasGaps ? "blocked" : snapshot.dataQualityGrade === "A" || snapshot.dataQualityGrade === "B" ? "active" : "hold";

  return (
    <section className="stock-indicator-priority-panel" id="stock-indicator-priority" aria-label="Indicator Priority">
      <div>
        <p className="eyebrow">Indicator Priority</p>
        <h2>指標優先順序</h2>
        <p>
          3 分鐘要複核時，請依序看資料可信度、主要支撐、主要風險。示範資料只用來展示閱讀順序，
          正式資料接入前不能當成個股買賣指令。
        </p>
      </div>
      <div className="stock-indicator-priority-grid">
        <article className={qualityTone}>
          <span>1. 資料可信度</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>
            {hasGaps
              ? `仍有 ${snapshot.missingModuleFlags.length + snapshot.staleDataFlags.length} 個資料或更新缺口，先降低判斷權重。`
              : "資料狀態可讀，但仍需等正式來源、覆蓋率與品質檢查通過。"}
          </p>
          <button type="button" onClick={() => onTab("today")}>查看資料狀態</button>
        </article>
        <article className="active">
          <span>2. 主要支撐</span>
          <strong>{support.name}</strong>
          <p>支撐指標 {support.health}/100。若支撐集中在單一模組，仍要回看市場廣度。</p>
          <button type="button" onClick={() => onTab("trend")}>查看支撐指標</button>
        </article>
        <article className={risk.risk >= 70 ? "blocked" : "hold"}>
          <span>3. 主要風險</span>
          <strong>{risk.name}</strong>
          <p>風險來源 {risk.risk}/100。若風險升高，優先看成因與更新時間。</p>
          <button type="button" onClick={() => onTab("technical")}>查看風險來源</button>
        </article>
      </div>
    </section>
  );
}

function StockInvestorIndicatorRoadmap() {
  const roadmap = getInvestorIndicatorRoadmap();

  return (
    <section className="stock-investor-indicator-roadmap" aria-label="Stock investor indicator roadmap">
      <div>
        <p className="eyebrow">指標路線圖</p>
        <h2>未來專業指標路線</h2>
        <p>
          公開版先讓所有人看懂市場狀態；會員深度解讀與個人化追蹤會在後續會員階段再實作。
        </p>
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
        <h2>市場脈絡</h2>
        <p>
          標的頁不只看單一分數，也會把目前標的放回全市場總覽、廣度與風險熱度中閱讀。
        </p>
      </div>
      <div className="market-context-grid">
        <article className="positive">
          <span>市場燈號</span>
          <strong>{market.signal.title}</strong>
          <p>先確認大盤背景，再閱讀單一標的。</p>
        </article>
        <article className="watch">
          <span>市場廣度</span>
          <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
          <p>偏強、觀望、偏防守的分布可以避免只看單一族群。</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "risk" : "positive"}>
          <span>標的風險</span>
          <strong>{snapshot.riskScore}</strong>
          <p>風險升高時，下一步是複核來源，不是直接下買賣結論。</p>
        </article>
      </div>
    </section>
  );
}

function StockDataBoundaryPanel({ snapshot }: { snapshot: SignalSnapshot }) {
  const missing = [...snapshot.missingModuleFlags, ...snapshot.staleDataFlags];

  return (
    <section className="stock-risk-checklist" id="stock-data-boundary" aria-label="資料邊界與停止條件">
      <div>
        <p className="eyebrow">資料邊界</p>
        <h2>資料狀態與停止條件</h2>
        <p>
          示範資料與示範分數只能用來建立閱讀流程。若資料異常、延遲或缺口未解，請停止把分數當成正式市場判斷。
        </p>
      </div>
      <div className="risk-check-grid">
        <article className="watch">
          <span>資料品質</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>資料品質會影響燈號可信度，正式上線前仍需來源與覆蓋檢查。</p>
        </article>
        <article className={missing.length ? "watch" : "pass"}>
          <span>資料缺口</span>
          <strong>{missing.length ? `${missing.length} 項` : "無新增缺口"}</strong>
          <p>{missing.length ? "目前仍有示範資料缺口，請降低判斷權重。" : "目前畫面未新增資料缺口提醒。"}</p>
        </article>
        <article className="watch">
          <span>非投資建議</span>
          <strong>只供觀察</strong>
          <p>本頁不提供買賣建議，也不替使用者做投資決策。</p>
        </article>
      </div>
    </section>
  );
}

function getInvestorIndicatorStatusLabel(status: InvestorIndicatorStatus) {
  const labels: Record<InvestorIndicatorStatus, string> = {
    "blocked-until-real-data": "等待真實資料",
    "design-only": "設計保留",
    "mock-readable": "mock 可讀"
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
      action: "可先關注",
      body: `偏強 ${breadth.constructive}、觀望 ${breadth.watch}、偏防守 ${breadth.defensive}。`,
      label: "市場氛圍",
      tone: "constructive",
      value: market.signal.title
    },
    {
      action: "先複核",
      body: "市場廣度可以提醒行情是否只集中在少數標的，或已經擴散到更多族群。",
      label: "市場廣度",
      tone: breadth.constructive >= breadth.defensive ? "constructive" : "watch",
      value: `${breadth.constructive}/${breadth.watch}/${breadth.defensive}`
    },
    {
      action: riskTone === "defensive" ? "降低風險" : "加強觀察",
      body: `風險分數 ${market.riskScore}/100；分數越高，越需要檢查波動、估值與資料新鮮度。`,
      label: "風險熱度",
      tone: riskTone,
      value: `${market.riskScore}/100`
    },
    {
      action: "確認資料狀態",
      body: `資料品質 ${snapshot.dataQualityGrade}，更新時間 ${formatTaipeiTime(snapshot.lastUpdatedAt)}。正式資料尚未啟用前，先把燈號當成觀察線索。`,
      label: "資料更新",
      tone: dataTone,
      value: snapshot.dataQualityGrade
    }
  ];

  return (
    <section className="home-core-indicator-readout" aria-label="核心指標摘要">
      <div>
        <p className="eyebrow">核心指標快讀</p>
        <h2>核心指標快讀</h2>
        <p>
          30 秒可讀：先用市場氛圍建立方向。3 分鐘可行動：再用廣度、風險與資料狀態複核，
          決定是可先關注、加強觀察、降低風險，或先複核資料。
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
