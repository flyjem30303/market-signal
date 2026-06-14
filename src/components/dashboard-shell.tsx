"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaPublicStatusSurface } from "@/components/public-beta-public-status-surface";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
import { StockRuntimeAtAGlance } from "@/components/stock-runtime-at-a-glance";
import { TrackedLink } from "@/components/tracked-link";
import { buildMockDataFreshnessSnapshot, type DataFreshnessSnapshot } from "@/lib/data-freshness";
import {
  getMarketSignalRepository,
  type MarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { Asset } from "@/lib/assets";
import {
  getInvestorIndicatorRoadmap,
  type InvestorIndicatorStatus
} from "@/lib/investor-indicator-roadmap";
import type { SignalSnapshot } from "@/lib/signal-model";

type DashboardShellProps = {
  freshnessSnapshot?: DataFreshnessSnapshot;
  initialSymbol: string;
  includeSeoContent?: boolean;
  marketSignalSourceStatus?: MarketSignalSourceStatus;
};

type BreadthSummary = {
  constructive: number;
  defensive: number;
  watch: number;
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
      <PageViewTracker
        eventName={isStockPage ? "stock_page_viewed" : "home_page_viewed"}
        payload={{ page: isStockPage ? "stock" : "home", symbol: selected.symbol }}
      />

      <section className="hero dashboard-hero">
        <p className="eyebrow">{isStockPage ? "標的燈號" : "市場總覽"}</p>
        <h1>{isStockPage ? `${selected.symbol} ${selected.name} 燈號判讀` : "30 秒看懂今日市場狀態"}</h1>
        <p>
          {isStockPage
            ? "用燈號、風險分數、資料品質與下一步觀察，協助你快速判斷這個標的目前應該關注什麼。"
            : "把市場氛圍、核心指標、風險提示與資料更新狀態放在同一頁，降低一般投資者的理解門檻。"}
        </p>
        <p className="runtime-boundary-line">
          正式資料尚未啟用；目前內容用來示範閱讀流程，所有資訊都不構成投資建議。
        </p>
        <div className="hero-status-strip" aria-label="首頁閱讀順序">
          <span>30 秒市場狀態</span>
          <span>3 分鐘觀察重點</span>
          <span>資料來源與更新時間</span>
          <span>非投資建議</span>
        </div>
      </section>

      {!isStockPage && (
        <>
          <HomeFirstScreenDecisionSummary breadth={breadth} freshness={freshness} market={market} />
          <HomeMarketOverview breadth={breadth} market={market} />
          <HomeLists riskList={riskList} strongList={strongList} />
          <HomeDataReadinessStatus />
          {!isStockPage && <PublicBetaPublicStatusSurface />}
        </>
      )}

      {isStockPage && (
        <>
          <StockRuntimeAtAGlance scoreSourceLabel={freshness.scoreSourceLabel} snapshot={snapshot} />
          <StockPublicSummary snapshot={snapshot} />
          <StockDecisionCompass snapshot={snapshot} />
          <StockInvestorIndicatorRoadmap />
          <StockDataBoundaryPanel snapshot={snapshot} />
        </>
      )}

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicDataSourceBoundaryNotice context={isStockPage ? "stock" : "home"} />
      <PublicBetaSourceCoverageBridge context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />

      <section className="stock-search-panel" aria-label="標的切換">
        <div>
          <p className="eyebrow">標的切換</p>
          <h2>查看指數、ETF 與主要觀察標的</h2>
          <p>先用固定清單建立閱讀流程；資料覆蓋率完成後，再逐步擴充更多上市櫃標的。</p>
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

      <section className="panel stock-reading-summary" aria-label="會員內容預告">
        <p className="eyebrow">會員內容預告</p>
        <h2>會員深度解讀會放在後續版本，公開版先完成免費市場總覽</h2>
        <p>
          目前先把免費版的燈號、風險提示、資料更新時間與資料邊界做好。會員功能未上線前，所有內容都保持公開可讀。
        </p>
        <div className="briefing-actions">
          <TrackedLink eventName="membership_preview_link_clicked" href="/membership" label="查看會員規劃" payload={{ area: "dashboard_shell" }}>
            查看會員規劃
          </TrackedLink>
          <TrackedLink eventName="trust_link_clicked" href="/methodology" label="查看方法說明" payload={{ area: "dashboard_shell" }}>
            查看方法說明
          </TrackedLink>
        </div>
      </section>

      <article className="disclaimer">
        <h2>風險聲明</h2>
        <p>
          本網站提供市場資訊整理、風險辨識與觀察輔助，不提供個股買賣建議、不保證獲利，也不代替使用者做投資決策。
        </p>
      </article>
    </main>
  );
}

function HomeFirstScreenDecisionSummary({
  breadth,
  freshness,
  market
}: {
  breadth: BreadthSummary;
  freshness: DataFreshnessSnapshot;
  market: SignalSnapshot;
}) {
  const riskTone =
    market.riskScore >= 60
      ? "目前風險分數偏高，建議提高觀察頻率並複核成因。"
      : "目前風險分數尚可，仍需確認資料更新與市場變化。";

  return (
    <section className="home-first-screen-decision" aria-label="首頁快速判讀">
      <div className="home-first-screen-decision__main">
        <p className="eyebrow">首頁快速判讀</p>
        <h2>
          {market.asset.name} 目前是「{market.signal.title}」，市場分數 {market.compositeScore}/100
        </h2>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-first-screen-decision__grid">
        <article className="constructive">
          <span>市場狀態</span>
          <strong>{market.signal.title}</strong>
          <p>先看目前市場偏多、觀望或警戒，再決定是否需要深入查看成因。</p>
        </article>
        <article className="watch">
          <span>市場廣度</span>
          <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
          <p>分別代表偏強、觀望與防守標的數，用來快速看市場是否一致。</p>
        </article>
        <article className={market.riskScore >= 60 ? "defensive" : "constructive"}>
          <span>主要風險</span>
          <strong>{market.riskScore}/100</strong>
          <p>{riskTone}</p>
        </article>
        <article className="watch">
          <span>更新時間</span>
          <strong>{freshness.asOfDate}</strong>
          <p>正式資料上線前，使用者需要清楚知道目前資料是否仍是示範狀態。</p>
        </article>
      </div>
      <p className="home-first-screen-decision__next">
        3 分鐘觀察：看市場狀態、主要風險、資料更新時間，再決定是否進入標的頁複核。
      </p>
      <div className="home-first-screen-decision__actions" aria-label="首頁行動">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場簡報" payload={{ area: "home_first_screen" }}>
          查看市場簡報
        </TrackedLink>
        <TrackedLink eventName="home_cta_clicked" href={`/stocks/${market.asset.symbol}`} label="查看核心標的" payload={{ area: "home_first_screen" }}>
          查看核心標的
        </TrackedLink>
        <TrackedLink eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "home_first_screen" }}>
          查看風險聲明
        </TrackedLink>
      </div>
    </section>
  );
}

function HomeMarketOverview({ breadth, market }: { breadth: BreadthSummary; market: SignalSnapshot }) {
  return (
    <section className="home-public-beta-layers" aria-label="市場總覽">
      <div className="home-public-beta-layer active">
        <span>市場總覽</span>
        <strong>{market.signal.title}</strong>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-public-beta-layer readying">
        <span>觀察結構</span>
        <strong>偏強 {breadth.constructive} / 觀望 {breadth.watch} / 防守 {breadth.defensive}</strong>
        <p>用簡單分類協助一般投資者看出市場是不是同步轉強或轉弱。</p>
      </div>
      <div className="home-public-beta-layer blocked">
        <span>資料狀態</span>
        <strong>正式資料尚未啟用</strong>
        <p>切換正式資料前，仍需完成來源權利、覆蓋率、品質檢查與錯誤回退。</p>
      </div>
    </section>
  );
}

function HomeLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場觀察清單">
      <div className="panel-intro">
        <p className="eyebrow">市場觀察清單</p>
        <h2>先看偏強標的，再看高風險標的</h2>
        <p>這兩個清單讓使用者快速找到值得追蹤或需要提高警覺的市場區塊。</p>
      </div>
      <MarketList title="偏強觀察" description="市場分數較高的標的，用來觀察市場強勢是否集中或擴散。" items={strongList} valueKey="composite" />
      <MarketList title="風險觀察" description="風險分數較高的標的，用來提醒哪些區塊需要避免單點判斷。" items={riskList} valueKey="risk" />
    </section>
  );
}

function HomeDataReadinessStatus() {
  return (
    <section className="panel public-data-readiness-summary" aria-label="資料準備狀態">
      <p className="eyebrow">資料準備狀態</p>
      <h2>資料真實化正在推進，但公開版仍須清楚標示示範狀態</h2>
      <p>
        公開版會先完成合法免費可自動化來源、欄位合約、覆蓋率、寫入閉環與前台降級；通過後才會把正式資料推到前台。
      </p>
    </section>
  );
}

function StockPublicSummary({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="stock-indicator-priority" id="stock-public-summary" aria-label="30 秒標的摘要">
      <div>
        <p className="eyebrow">30 秒標的摘要</p>
        <h2>
          {snapshot.asset.symbol} {snapshot.asset.name} 目前是「{snapshot.signal.title}」
        </h2>
        <p>{snapshot.signal.text}</p>
        <p>這是公開免費版的快速摘要，目標是先讓使用者理解狀態，再決定是否查看完整成因。</p>
      </div>
      <div className="stock-indicator-priority-grid">
        <article className="active">
          <span>市場分數</span>
          <strong>{snapshot.compositeScore}/100</strong>
          <p>用來快速看目前狀態偏強、觀望或偏弱。</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "blocked" : "hold"}>
          <span>風險分數</span>
          <strong>{snapshot.riskScore}/100</strong>
          <p>分數越高，越需要複核成因與提高觀察頻率。</p>
        </article>
        <article className="hold">
          <span>資料品質</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>用來提醒使用者資料是否足以支撐目前判讀。</p>
        </article>
      </div>
    </section>
  );
}

function StockDecisionCompass({ snapshot }: { snapshot: SignalSnapshot }) {
  const nextStep =
    snapshot.riskScore >= 60
      ? "優先觀察風險是否連續升高，不要只看單一分數。"
      : snapshot.compositeScore >= 70
        ? "維持追蹤偏強訊號是否擴散到更多標的。"
        : "等待資料更新與市場方向更明確後再判讀。";

  return (
    <section className="stock-decision-compass" aria-label="三分鐘觀察指南">
      <div className="stock-decision-compass__intro">
        <p className="eyebrow">3 分鐘觀察指南</p>
        <h2>從狀態、成因、風險與下一步建立觀察順序</h2>
        <p>這不是買賣建議，而是協助使用者把市場資訊整理成可追蹤的觀察流程。</p>
      </div>
      <article className={snapshot.compositeScore >= 70 ? "active" : "hold"}>
        <span>狀態</span>
        <strong>{snapshot.signal.title}</strong>
        <p>{snapshot.signal.text}</p>
      </article>
      <article className={snapshot.riskScore >= 60 ? "blocked" : "hold"}>
        <span>成因</span>
        <strong>分數與風險一起看</strong>
        <p>分數只是一個摘要，必須搭配資料更新時間與風險提示。</p>
      </article>
      <article className="hold">
        <span>影響層級</span>
        <strong>{snapshot.riskScore >= 60 ? "高風險觀察" : "持續觀察"}</strong>
        <p>風險分數 {snapshot.riskScore}/100，請避免把燈號當作單一結論。</p>
      </article>
      <article className="hold">
        <span>下一步</span>
        <strong>觀察 / 複核 / 降低風險</strong>
        <p>{nextStep}</p>
      </article>
      <p className="stock-decision-compass__boundary">
        本站不提供個股買賣建議，也不保證任何投資結果。
      </p>
    </section>
  );
}

function StockInvestorIndicatorRoadmap() {
  const roadmap = getInvestorIndicatorRoadmap();

  return (
    <section className="stock-investor-indicator-roadmap" aria-label="投資指標路線">
      <div>
        <p className="eyebrow">投資指標路線</p>
        <h2>先用可理解指標建立閱讀順序，再逐步接入正式資料</h2>
        <p>{roadmap.boundary.statement}</p>
        <strong>目前維持示範資料與示範分數；指標說明只用來建立閱讀順序。</strong>
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

function getInvestorIndicatorStatusLabel(status: InvestorIndicatorStatus) {
  if (status === "mock-readable") return "示範可讀";
  if (status === "design-only") return "設計中";
  return "等待資料";
}

function StockDataBoundaryPanel({ snapshot }: { snapshot: SignalSnapshot }) {
  const missing = [...snapshot.missingModuleFlags, ...snapshot.staleDataFlags];

  return (
    <section className="stock-risk-checklist" id="stock-data-boundary" aria-label="資料邊界">
      <div>
        <p className="eyebrow">資料邊界</p>
        <h2>資料正式上線前，每個標的都必須清楚顯示更新時間與限制</h2>
        <p>最後更新：{formatTaipeiTime(snapshot.lastUpdatedAt)}。目前仍屬示範資料，不代表正式市場資料已啟用。</p>
      </div>
      <div className="risk-check-grid">
        <article className="watch">
          <span>資料品質</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>正式資料上線前，品質等級只用來示範前台呈現方式。</p>
        </article>
        <article className="watch">
          <span>待複核項目</span>
          <strong>{missing.length}</strong>
          <p>{missing.join("、") || "目前沒有示範資料缺漏標記。"}</p>
        </article>
        <article className="watch">
          <span>使用限制</span>
          <strong>不是交易指令</strong>
          <p>資料異常或未更新時，前台必須明確降級並提示使用者複核。</p>
        </article>
      </div>
    </section>
  );
}

function buildBreadth(snapshots: SignalSnapshot[]): BreadthSummary {
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
