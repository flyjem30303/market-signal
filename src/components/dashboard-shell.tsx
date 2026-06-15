"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicBetaUsableLoopPanel } from "@/components/public-beta-usable-loop-panel";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
import { StockRuntimeAtAGlance } from "@/components/stock-runtime-at-a-glance";
import { TrackedLink } from "@/components/tracked-link";
import type { Asset } from "@/lib/assets";
import { buildMockDataFreshnessSnapshot, type DataFreshnessSnapshot } from "@/lib/data-freshness";
import { getInvestorIndicatorRoadmap } from "@/lib/investor-indicator-roadmap";
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
  const scoreSourceLabel = String((freshness as DataFreshnessSnapshot & { scoreSourceLabel?: string }).scoreSourceLabel ?? "mock");

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
            ? `${selected.symbol} ${selected.name} 指數燈號`
            : "30 秒看懂市場燈號，3 分鐘完成風險判斷"}
        </h1>
        <p>
          {isStockPage
            ? `${selected.name} 目前為「${snapshot.signal.title}」，本頁用狀態、成因、影響級別與資料時間協助你快速判斷是否需要加強觀察。`
            : "把指數、ETF 與大型權值股整理成紅黃綠燈號，先看市場氛圍，再看成因、風險與下一步觀察方向。"}
        </p>
        <p className="runtime-boundary-line">
          公開 Beta 目前仍使用模擬資料展示流程；資料上線前不宣稱即時真實資料，也不提供個股買賣建議。
        </p>
        <div className="hero-status-strip" aria-label="閱讀順序">
          <span>30 秒市場狀態</span>
          <span>3 分鐘判斷順序</span>
          <span>成因</span>
          <span>影響級別</span>
          <span>資料更新時間</span>
        </div>
      </section>

      {!isStockPage && (
        <>
          <HomeFirstScreenDecisionSummary breadth={breadth} freshness={freshness} market={market} />
          <HomeMarketOverview breadth={breadth} market={market} />
          <HomeLists riskList={riskList} strongList={strongList} />
          <PublicBetaDataReadinessStatus />
        </>
      )}

      {isStockPage && (
        <>
          <StockRuntimeAtAGlance scoreSourceLabel={scoreSourceLabel} snapshot={snapshot} />
          <StockPublicSummary snapshot={snapshot} />
          <StockDecisionCompass snapshot={snapshot} />
          <StockInvestorIndicatorRoadmap />
          <StockDataBoundaryPanel snapshot={snapshot} />
        </>
      )}

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicDataSourceBoundaryNotice context={isStockPage ? "stock" : "home"} />
      <PublicBetaSourceCoverageBridge context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />
      <PublicBetaUsableLoopPanel context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />

      <section className="stock-search-panel" aria-label="標的切換">
        <div>
          <p className="eyebrow">標的切換</p>
          <h2>快速查看指數、ETF 與主要權值股</h2>
          <p>分類目前先支援指數、ETF、半導體、IC 設計、電子代工、電源/工控與 AI 伺服器。</p>
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
        <h2>第一階段先完成公開版；會員深度解讀保留到下一階段</h2>
        <p>
          目前公開版聚焦市場總覽、核心指標、主要風險提示與資料更新時間。會員 watchlist、盤後複盤與個人化警示會在下一階段
          實作，避免拖慢第一階段上線。
        </p>
        <div className="briefing-actions">
          <TrackedLink
            eventName="membership_preview_link_clicked"
            href="/membership"
            label="查看會員規劃"
            payload={{ area: "dashboard_shell" }}
          >
            查看會員規劃
          </TrackedLink>
          <TrackedLink eventName="trust_link_clicked" href="/methodology" label="查看方法說明" payload={{ area: "dashboard_shell" }}>
            查看方法說明
          </TrackedLink>
        </div>
      </section>

      <article className="disclaimer">
        <h2>非投資建議</h2>
        <p>
          本網站提供市場資訊整理、風險辨識與觀察輔助，不應直接視為個股買賣建議、保證獲利承諾或交易指令。請自行判斷並承擔投資風險。
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
  const impactLevel = market.riskScore >= 70 ? "高" : market.riskScore >= 55 ? "中" : "低";

  return (
    <section className="home-first-screen-decision" aria-label="首頁 30 秒快讀">
      <div className="home-first-screen-decision__main">
        <p className="eyebrow">30 秒市場狀態</p>
        <h2>
          {market.asset.name} 目前為「{market.signal.title}」，綜合分數 {market.compositeScore}/100
        </h2>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-first-screen-decision__grid">
        <article className="constructive">
          <span>市場燈號</span>
          <strong>{market.signal.title}</strong>
          <p>成因：趨勢、資金、評價與總體風險合併後形成目前狀態。</p>
        </article>
        <article className="watch">
          <span>市場廣度</span>
          <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
          <p>依序代表偏多、觀望與防守標的數量，用來檢查行情是否擴散。</p>
        </article>
        <article className={market.riskScore >= 60 ? "defensive" : "constructive"}>
          <span>影響級別</span>
          <strong>{impactLevel}</strong>
          <p>風險分數 {market.riskScore}/100；若升高，應優先檢查曝險與資料更新時間。</p>
        </article>
        <article className="watch">
          <span>資料更新時間</span>
          <strong>{freshness.asOfDate}</strong>
          <p>目前仍為公開 Beta 模擬資料，真實資料上線前請以流程展示看待。</p>
        </article>
      </div>
      <p className="home-first-screen-decision__next">
        3 分鐘判斷順序：先看市場燈號，再看成因與影響級別，最後確認資料更新時間與非投資建議邊界。
      </p>
      <div className="home-first-screen-decision__actions" aria-label="首頁下一步">
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

function HomeMarketOverview({ breadth, market }: { breadth: BreadthSummary; market: SignalSnapshot }) {
  return (
    <section className="home-public-beta-layers" aria-label="市場三層視圖">
      <div className="home-public-beta-layer active">
        <span>全市場總覽</span>
        <strong>{market.signal.title}</strong>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-public-beta-layer readying">
        <span>核心指標面板</span>
        <strong>偏多 {breadth.constructive} / 觀望 {breadth.watch} / 防守 {breadth.defensive}</strong>
        <p>用市場廣度、風險分數與資料品質輔助判斷，不讓單一分數決定行動。</p>
      </div>
      <div className="home-public-beta-layer blocked">
        <span>警示清單</span>
        <strong>資料上線仍在準備中</strong>
        <p>真實資料需通過來源權利、欄位合約、寫入回讀、回滾與正式切換條件，才會公開切換。</p>
      </div>
    </section>
  );
}

function HomeLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場觀察清單">
      <div className="panel-intro">
        <p className="eyebrow">觀察清單</p>
        <h2>找出相對偏多與風險較高的標的</h2>
        <p>先用模擬燈號示範閱讀方式；資料上線後會改由正式來源與時間戳驅動。</p>
      </div>
      <MarketList title="相對偏多" description="綜合分數較高的標的，適合進一步查看成因與資料品質。" items={strongList} valueKey="composite" />
      <MarketList title="風險較高" description="風險分數較高的標的，適合檢查是否需要加強觀察或降低曝險。" items={riskList} valueKey="risk" />
    </section>
  );
}

function HomeDataReadinessStatus() {
  return (
    <section className="panel public-data-readiness-summary" aria-label="資料上線狀態">
      <p className="eyebrow">資料上線狀態</p>
      <h2>公開頁面可讀；正式資料仍需完成寫入閉環</h2>
      <p>
        目前 TW equity 覆蓋已完成，TWII 與 ETF 仍有缺口。正式資料上線前會維持模擬來源，避免使用者誤以為這是即時真實訊號。
      </p>
    </section>
  );
}

function StockPublicSummary({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="stock-indicator-priority" id="stock-public-summary" aria-label="標的摘要">
      <div>
        <p className="eyebrow">標的摘要</p>
        <h2>
          30 秒快讀：{snapshot.asset.symbol} {snapshot.asset.name} 目前為「{snapshot.signal.title}」
        </h2>
        <p>{snapshot.signal.text}</p>
        <p>成因：此燈號由趨勢強弱、基本面品質、評價壓力、市場廣度、資金流向與總體風險合併判斷。</p>
      </div>
      <div className="stock-indicator-priority-grid">
        <article className="active">
          <span>市場狀態</span>
          <strong>{snapshot.compositeScore}/100</strong>
          <p>分數越高，代表目前模擬狀態越偏正向。</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "blocked" : "hold"}>
          <span>影響級別</span>
          <strong>{snapshot.riskScore >= 70 ? "高" : snapshot.riskScore >= 55 ? "中" : "低"}</strong>
          <p>風險分數 {snapshot.riskScore}/100，升高時應加強觀察。</p>
        </article>
        <article className="hold">
          <span>資料更新時間</span>
          <strong>{formatTaipeiTime(snapshot.lastUpdatedAt)}</strong>
          <p>目前資料來源仍為 mock，正式資料上線前不作即時真實宣稱。</p>
        </article>
      </div>
    </section>
  );
}

function StockDecisionCompass({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="stock-decision-compass" aria-label="3 分鐘判斷順序">
      <div className="stock-decision-compass__intro">
        <p className="eyebrow">3 分鐘判斷順序</p>
        <h2>依序看狀態、成因、影響級別與下一步觀察</h2>
        <p>本區不是買賣建議，而是協助一般投資者建立固定的市場檢查流程。</p>
      </div>
      <article className={snapshot.compositeScore >= 70 ? "active" : "hold"}>
        <span>1. 市場狀態</span>
        <strong>{snapshot.signal.title}</strong>
        <p>{snapshot.signal.text}</p>
      </article>
      <article className="hold">
        <span>2. 成因</span>
        <strong>六類指標合併</strong>
        <p>趨勢、品質、評價、市場廣度、資金與總體風險共同形成燈號。</p>
      </article>
      <article className={snapshot.riskScore >= 60 ? "blocked" : "hold"}>
        <span>3. 影響級別</span>
        <strong>{snapshot.riskScore >= 70 ? "高" : snapshot.riskScore >= 55 ? "中" : "低"}</strong>
        <p>若影響級別升高，優先檢查是否需要減少風險、等待訊號改善或複核資料時間。</p>
      </article>
      <article className="hold">
        <span>4. 下一步觀察</span>
        <strong>觀察 / 複核 / 等待</strong>
        <p>觀察趨勢是否延續，複核資料品質與更新時間，等待正式資料切換條件完成。</p>
      </article>
      <p className="stock-decision-compass__boundary">
        不應直接視為個股買賣建議；本頁只提供市場資訊整理、風險辨識與觀察輔助。
      </p>
    </section>
  );
}

function StockInvestorIndicatorRoadmap() {
  const roadmap = getInvestorIndicatorRoadmap();

  return (
    <section className="stock-investor-indicator-roadmap" aria-label="指標路線">
      <div>
        <p className="eyebrow">指標路線</p>
        <h2>第一階段先讓核心燈號可理解，再逐步補齊正式指標</h2>
        <p>{roadmap.boundary.statement}</p>
        <strong>正式資料上線前，所有指標都必須保留來源、時間戳與風險揭露。</strong>
      </div>
      <div className="indicator-roadmap-grid">
        {roadmap.families.map((family) => (
          <article className={family.status} key={family.id}>
            <span>{family.status === "mock-readable" ? "可讀展示" : family.status === "design-only" ? "設計中" : "資料待補"}</span>
            <strong>{family.label}</strong>
            <p>{family.productValue}</p>
            <small>{family.currentUse}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockDataBoundaryPanel({ snapshot }: { snapshot: SignalSnapshot }) {
  const missing = [...snapshot.missingModuleFlags, ...snapshot.staleDataFlags];

  return (
    <section className="stock-risk-checklist" id="stock-data-boundary" aria-label="資料邊界">
      <div>
        <p className="eyebrow">資料邊界</p>
        <h2>資料異常或未更新時，前台必須清楚提示</h2>
        <p>最後更新時間：{formatTaipeiTime(snapshot.lastUpdatedAt)}。目前仍為 mock 模式，尚未切換到正式資料來源。</p>
      </div>
      <div className="risk-check-grid">
        <article className="watch">
          <span>資料品質</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>資料品質代表目前訊號可讀性，不代表投資勝率。</p>
        </article>
        <article className="watch">
          <span>待補提醒</span>
          <strong>{missing.length}</strong>
          <p>{missing.join("；") || "目前沒有額外待補提醒。"}</p>
        </article>
        <article className="watch">
          <span>公開邊界</span>
          <strong>非投資建議</strong>
          <p>公開頁不提供買賣點、保證報酬或個人化資產配置建議。</p>
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
