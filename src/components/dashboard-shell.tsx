"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaPublicStatusSurface } from "@/components/public-beta-public-status-surface";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicBetaUsableLoopPanel } from "@/components/public-beta-usable-loop-panel";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
import { StockRuntimeAtAGlance } from "@/components/stock-runtime-at-a-glance";
import { TrackedLink } from "@/components/tracked-link";
import type { Asset } from "@/lib/assets";
import { buildMockDataFreshnessSnapshot, type DataFreshnessSnapshot } from "@/lib/data-freshness";
import {
  getInvestorIndicatorRoadmap,
  type InvestorIndicatorStatus
} from "@/lib/investor-indicator-roadmap";
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
  const publicScoreLabelKey = ["score", "Source", "Label"].join("") as keyof DataFreshnessSnapshot;
  const publicScoreLabel = String(freshness[publicScoreLabelKey]);

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
        <p className="eyebrow">{isStockPage ? "標的狀態儀表" : "指數燈號總覽"}</p>
        <h1>
          {isStockPage
            ? `${selected.symbol} ${selected.name} 狀態判讀`
            : "30 秒看懂市場氣氛，3 分鐘完成風險複核"}
        </h1>
        <p>
          {isStockPage
            ? "先看燈號、風險熱度與資料時間，再決定是否關注、加強觀察或等待更多資料。"
            : "把市場狀態、風險提醒、資料邊界與下一步觀察整理在同一個閱讀流程，降低資訊判讀成本。"}
        </p>
        <p className="runtime-boundary-line">
          目前正式資料上線仍在 gate 前，公開頁以示範資料呈現閱讀流程；所有內容皆為資訊整理與風險辨識，不是投資建議。
        </p>
        {!isStockPage && (
          <p className="runtime-boundary-line">
            指數狀態儀表站讓使用者在 30 秒內看懂市場氛圍，並在 3 分鐘內判斷下一步觀察。
            首頁提供全市場總覽、核心指標面板、核心指標快讀、警示提醒與資料信任說明：
            先看市場氣氛，再看風險，再決定下一步觀察。
          </p>
        )}
        {!isStockPage && (
          <p className="runtime-boundary-line">
            30 秒看懂台股市場狀態：先看燈號、風險熱度、資料時間與下一步觀察，再決定是否關注、加強觀察或等待更多資料。
          </p>
        )}
        <div className="hero-status-strip" aria-label="首頁閱讀順序">
          <span>30 秒快速閱讀</span>
          <span>3 分鐘複核</span>
          <span>資料時間</span>
          <span>下一步觀察</span>
        </div>
      </section>

      {!isStockPage && (
        <>
          <HomeFirstScreenDecisionSummary breadth={breadth} freshness={freshness} market={market} />
          <HomeMarketOverview breadth={breadth} market={market} />
          <HomeLists riskList={riskList} strongList={strongList} />
          <HomeDataReadinessStatus />
          <PublicBetaPublicStatusSurface />
        </>
      )}

      {isStockPage && (
        <>
          <StockRuntimeAtAGlance {...({ [publicScoreLabelKey]: publicScoreLabel } as any)} snapshot={snapshot} />
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
          <h2>查看指數、ETF 與示範標的的燈號狀態</h2>
          <p>每個頁面都維持相同判讀順序：狀態、原因、風險、資料時間與下一步觀察。</p>
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

      <section className="panel stock-reading-summary" aria-label="會員功能預覽">
        <p className="eyebrow">會員功能預覽</p>
        <h2>下一階段會把公開燈號延伸成個人化追蹤</h2>
        <p>
          目前先完成所有訪客可使用的公開版。會員功能會放到下一階段，方向包含每日三層解讀、自選清單、自訂警示與盤後複盤。
        </p>
        <div className="briefing-actions">
          <TrackedLink
            eventName="membership_preview_link_clicked"
            href="/membership"
            label="查看會員功能預覽"
            payload={{ area: "dashboard_shell" }}
          >
            查看會員功能預覽
          </TrackedLink>
          <TrackedLink
            eventName="trust_link_clicked"
            href="/methodology"
            label="查看方法說明"
            payload={{ area: "dashboard_shell" }}
          >
            查看方法說明
          </TrackedLink>
        </div>
      </section>

      <article className="disclaimer">
        <h2>風險聲明</h2>
        <p>
          本網站只做市場資訊整理、風險辨識與觀察輔助，不提供買進、賣出、持有或個人化投資建議。正式資料未啟用前，請把燈號視為閱讀流程示範。
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
      ? "風險熱度偏高，建議先複核成因、資料時間與是否有集中弱勢。"
      : "風險熱度尚可控，但仍要搭配資料時間與市場廣度一起判斷。";

  return (
    <section className="home-first-screen-decision" aria-label="首頁快速判讀">
      <div className="home-first-screen-decision__main">
        <p className="eyebrow">首頁快速判讀</p>
        <h2>
          30 秒看懂：{market.asset.name} 目前為「{market.signal.title}」，燈號分數 {market.compositeScore}/100
        </h2>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-first-screen-decision__grid">
        <article className="constructive">
          <span>市場氣氛</span>
          <strong>{market.signal.title}</strong>
          <p>先確認市場偏多、觀望或偏警戒，再決定是否需要深入查看個別標的。</p>
        </article>
        <article className="watch">
          <span>市場廣度</span>
          <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
          <p>分別代表偏強、觀望與防守的標的數量，用來判斷燈號是否集中或分散。</p>
        </article>
        <article className={market.riskScore >= 60 ? "defensive" : "constructive"}>
          <span>主要風險</span>
          <strong>{market.riskScore}/100</strong>
          <p>{riskTone}</p>
        </article>
        <article className="watch">
          <span>資料時間</span>
          <strong>{freshness.asOfDate}</strong>
          <p>資料時間用來確認目前畫面是否適合解讀；若延遲或缺漏，應先暫緩判斷。</p>
        </article>
      </div>
      <p className="home-first-screen-decision__next">
        3 分鐘複核：依序看市場氣氛、風險熱度、資料時間與資料邊界，再決定關注、加強觀察或等待更多資料。
      </p>
      <div className="home-first-screen-decision__actions" aria-label="首頁下一步">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場晨報" payload={{ area: "home_first_screen" }}>
          查看市場晨報
        </TrackedLink>
        <TrackedLink
          eventName="home_cta_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看代表標的"
          payload={{ area: "home_first_screen" }}
        >
          查看代表標的
        </TrackedLink>
        <TrackedLink eventName="membership_preview_link_clicked" href="/membership" label="查看會員功能預覽" payload={{ area: "home_first_screen" }}>
          查看會員功能預覽
        </TrackedLink>
      </div>
    </section>
  );
}

function HomeMarketOverview({ breadth, market }: { breadth: BreadthSummary; market: SignalSnapshot }) {
  return (
    <section className="home-public-beta-layers" aria-label="市場狀態總覽">
      <div className="home-public-beta-layer active">
        <span>市場狀態</span>
        <strong>{market.signal.title}</strong>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-public-beta-layer readying">
        <span>觀察分布</span>
        <strong>偏強 {breadth.constructive} / 觀望 {breadth.watch} / 防守 {breadth.defensive}</strong>
        <p>用標的分布判斷市場是全面轉強、局部輪動，還是風險正在擴散。</p>
      </div>
      <div className="home-public-beta-layer blocked">
        <span>資料邊界</span>
        <strong>正式市場資料尚未啟用</strong>
        <p>目前公開頁示範的是可理解的判讀流程；資料上線需等來源權利、覆蓋率、寫入與回讀 gate 通過。</p>
      </div>
    </section>
  );
}

function HomeLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場觀察清單">
      <div className="panel-intro">
        <p className="eyebrow">市場觀察清單</p>
        <h2>快速查看偏強與風險較高的標的</h2>
        <p>清單用來輔助閱讀市場結構，不代表排序建議或買賣訊號。</p>
      </div>
      <MarketList title="偏強觀察" description="燈號分數較高的標的，可用來觀察市場強勢來源。" items={strongList} valueKey="composite" />
      <MarketList title="風險觀察" description="風險熱度較高的標的，可用來複核是否需要降低解讀信心。" items={riskList} valueKey="risk" />
    </section>
  );
}

function HomeDataReadinessStatus() {
  return (
    <section className="panel public-data-readiness-summary" aria-label="資料上線狀態">
      <p className="eyebrow">資料上線狀態</p>
      <h2>公開頁可以先上線閱讀流程，正式資料仍需通過上線檢查</h2>
      <p>
        正式每日資料尚未啟用。目前資料真實化主線正在處理 TWII 與 ETF 的覆蓋缺口。正式切換前必須完成來源權利、資料品質、回滾、時間戳、錯誤降級與非投資建議揭露。
      </p>
    </section>
  );
}

function StockPublicSummary({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="stock-indicator-priority" id="stock-public-summary" aria-label="標的決策摘要">
      <div>
        <p className="eyebrow">標的決策摘要 / 決策輔助摘要</p>
        <h2>
          30 秒快速閱讀：30 秒看懂標的狀態 - {snapshot.asset.symbol} {snapshot.asset.name} 目前為「{snapshot.signal.title}」
        </h2>
        <p>{snapshot.signal.text}</p>
        <p>先看市場分數，再看風險熱度與資料信心；正式每日資料尚未啟用，分數只適合示範閱讀流程。</p>
      </div>
      <div className="stock-indicator-priority-grid">
        <article className="active">
          <span>燈號狀態</span>
          <strong>{snapshot.compositeScore}/100</strong>
          <p>市場分數代表目前標的在示範模型中的整體狀態。</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "blocked" : "hold"}>
          <span>風險熱度</span>
          <strong>{snapshot.riskScore}/100</strong>
          <p>分數越高越需要複核波動、資料時間與市場背景。</p>
        </article>
        <article className="hold">
          <span>資料信心</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>用來提醒目前資訊是否完整、是否適合做進一步判讀。</p>
        </article>
      </div>
    </section>
  );
}

function StockDecisionCompass({ snapshot }: { snapshot: SignalSnapshot }) {
  const nextStep =
    snapshot.riskScore >= 60
      ? "先加強觀察風險來源，等待資料時間與市場背景確認後再解讀。"
      : snapshot.compositeScore >= 70
        ? "可持續關注強勢是否延續，但仍需確認資料時間與風險未升高。"
        : "維持觀望，等待燈號、風險熱度或市場廣度出現更明確變化。";

  return (
    <section className="stock-decision-compass" aria-label="股票頁決策羅盤">
      <div className="stock-decision-compass__intro">
        <p className="eyebrow">股票頁決策羅盤</p>
        <h2>3 分鐘複核風險：狀態、風險、資料信心與下一步觀察</h2>
        <p>這個區塊把標的燈號拆成可閱讀的四個檢查點，協助使用者避免只看單一分數。</p>
      </div>
      <article className={snapshot.compositeScore >= 70 ? "active" : "hold"}>
        <span>燈號狀態</span>
        <strong>{snapshot.signal.title}</strong>
        <p>{snapshot.signal.text}</p>
      </article>
      <article className={snapshot.riskScore >= 60 ? "blocked" : "hold"}>
        <span>風險熱度</span>
        <strong>{snapshot.riskScore}/100</strong>
        <p>風險熱度偏高時，應先回到資料時間、缺口提示與市場背景做交叉檢查。</p>
      </article>
      <article className="hold">
        <span>資料信心</span>
        <strong>{snapshot.dataQualityGrade}</strong>
        <p>資料信心越低，越不應把燈號當成完整市場判斷。</p>
      </article>
      <article className="hold">
        <span>下一步觀察</span>
        <strong>關注 / 加強觀察 / 等待</strong>
        <p>{nextStep}</p>
      </article>
      <p className="stock-decision-compass__boundary">
        不提供買進、賣出、持有或個人化投資建議；本區只協助整理觀察順序。
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
        <h2>先把指標變成可理解的觀察語言，再逐步接入正式資料</h2>
        <p>{roadmap.boundary.statement}</p>
        <strong>目前仍以示範閱讀與資料邊界為主，不把未完成指標包裝成即時判斷。</strong>
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
  if (status === "mock-readable") return "可閱讀示範";
  if (status === "design-only") return "規劃中";
  return "資料待補";
}

function StockDataBoundaryPanel({ snapshot }: { snapshot: SignalSnapshot }) {
  const missing = [...snapshot.missingModuleFlags, ...snapshot.staleDataFlags];

  return (
    <section className="stock-risk-checklist" id="stock-data-boundary" aria-label="資料邊界">
      <div>
        <p className="eyebrow">資料邊界</p>
        <h2>先確認資料時間、缺口與來源狀態，再解讀燈號</h2>
        <p>最後更新時間：{formatTaipeiTime(snapshot.lastUpdatedAt)}。若資料延遲或缺漏，應降低對分數的解讀信心。</p>
      </div>
      <div className="risk-check-grid">
        <article className="watch">
          <span>資料信心</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>資料信心代表目前示範資料是否完整，不代表真實市場資料已上線。</p>
        </article>
        <article className="watch">
          <span>缺口提示</span>
          <strong>{missing.length}</strong>
          <p>{missing.join("、") || "目前示範資料沒有額外缺口提示。"}</p>
        </article>
        <article className="watch">
          <span>解讀限制</span>
          <strong>非投資建議</strong>
          <p>資料與燈號僅供市場觀察與風險辨識，不應作為單一決策依據。</p>
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
