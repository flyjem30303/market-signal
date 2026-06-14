"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
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
  const snapshot = repository.getSnapshot(selected.symbol, snapshotDate) ?? repository.getSnapshot(assets[0].symbol, snapshotDate)!;
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
        <p className="eyebrow">{isStockPage ? "標的狀態" : "市場總覽"}</p>
        <h1>{isStockPage ? `${selected.symbol} ${selected.name} 燈號狀態` : "30 秒看懂市場狀態"}</h1>
        <p>
          {isStockPage
            ? "把標的燈號、風險分數與觀察重點放在同一頁，協助你先判斷是否需要加強追蹤。"
            : "用紅、黃、綠燈號整理市場氣氛、趨勢強弱與主要風險，讓你先抓方向，再決定是否深入查看。"}
        </p>
        <p className="runtime-boundary-line">
          燈號代表風險與趨勢的整理，不是買賣建議。資料仍在正式上線前，請搭配資料來源與更新時間閱讀。
        </p>
        <div className="hero-status-strip" aria-label="閱讀流程">
          <span>30 秒看懂市場狀態</span>
          <span>3 分鐘決定下一步觀察</span>
          <span>資料來源透明</span>
          <span>非投資建議</span>
        </div>
      </section>

      {!isStockPage && (
        <>
          <HomeFirstScreenDecisionSummary breadth={breadth} freshness={freshness} market={market} />
          <HomeMarketOverview breadth={breadth} market={market} />
          <HomeLists riskList={riskList} strongList={strongList} />
          <HomeDataReadinessStatus />
        </>
      )}

      {isStockPage && (
        <>
          <StockPublicSummary snapshot={snapshot} />
          <StockDecisionCompass snapshot={snapshot} />
          <StockDataBoundaryPanel snapshot={snapshot} />
        </>
      )}

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicDataSourceBoundaryNotice context={isStockPage ? "stock" : "home"} />

      <section className="stock-search-panel" aria-label="切換觀察標的">
        <div>
          <p className="eyebrow">觀察標的</p>
          <h2>切換指數、ETF 與核心台股</h2>
          <p>選擇標的後，可以看到相同口徑的燈號、成因、風險熱度與資料邊界。</p>
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
        <p className="eyebrow">下一階段會員功能</p>
        <h2>會員功能會放在下一階段，不影響免費市場總覽上線</h2>
        <p>
          免費版先完成市場總覽、核心指標、風險提示與資料更新時間。會員版再延伸每日市場三層解讀、
          自選追蹤、警示條件與盤後複盤，避免第一版上線範圍過大。
        </p>
        <div className="briefing-actions">
          <TrackedLink eventName="membership_preview_link_clicked" href="/membership" label="查看會員功能預覽" payload={{ area: "dashboard_shell" }}>
            查看會員功能預覽
          </TrackedLink>
          <TrackedLink eventName="trust_link_clicked" href="/methodology" label="查看燈號方法" payload={{ area: "dashboard_shell" }}>
            查看燈號方法
          </TrackedLink>
        </div>
      </section>

      <article className="disclaimer">
        <h2>風險聲明</h2>
        <p>
          本站提供市場資訊整理、風險辨識與觀察輔助，不提供個股買賣建議，
          也不提供買進、賣出、持有或個人化投資建議。
          使用者仍應自行判斷資料時效、來源限制與自身風險承受度。
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
  const riskTone = market.riskScore >= 60 ? "主要風險偏高，先降低曝險並等待確認" : "主要風險可控，維持觀察並複核資料時間";

  return (
    <section className="home-first-screen-decision" aria-label="首頁快速判讀">
      <div className="home-first-screen-decision__main">
        <p className="eyebrow">首頁快速判讀</p>
        <h2>
          {market.asset.name} 目前為「{market.signal.title}」，市場分數 {market.compositeScore}/100
        </h2>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-first-screen-decision__grid">
        <article className="constructive">
          <span>市場狀態</span>
          <strong>{market.signal.title}</strong>
          <p>30 秒可用：先判斷今天偏多、觀望、警戒或高風險。</p>
        </article>
        <article className="watch">
          <span>市場廣度</span>
          <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
          <p>看強勢、觀望與防守標的比例，避免只看單一指數。</p>
        </article>
        <article className={market.riskScore >= 60 ? "defensive" : "constructive"}>
          <span>主要風險</span>
          <strong>{market.riskScore}/100</strong>
          <p>{riskTone}</p>
        </article>
        <article className="watch">
          <span>資料時間</span>
          <strong>{freshness.asOfDate}</strong>
          <p>3 分鐘複核：確認資料是否仍在可接受的更新時間內。</p>
        </article>
      </div>
      <p className="home-first-screen-decision__next">
        3 分鐘複核順序：先看市場狀態，再看主要風險，最後確認資料時間與資料邊界。
      </p>
      <div className="home-first-screen-decision__actions" aria-label="首頁行動">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場晨報" payload={{ area: "home_first_screen" }}>
          查看市場晨報
        </TrackedLink>
        <TrackedLink eventName="home_cta_clicked" href={`/stocks/${market.asset.symbol}`} label="查看核心指數" payload={{ area: "home_first_screen" }}>
          查看核心指數
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
        <span>觀察重點</span>
        <strong>強勢 {breadth.constructive}、觀望 {breadth.watch}、防守 {breadth.defensive}</strong>
        <p>用市場廣度補足單一指數盲點，先看整體氛圍，再回到標的頁複核。</p>
      </div>
      <div className="home-public-beta-layer blocked">
        <span>資料狀態</span>
        <strong>正式資料尚未啟用</strong>
        <p>正式每日資料、資料來源與覆蓋率通過後，才會切換成正式資料讀取。</p>
      </div>
    </section>
  );
}

function HomeLists({ riskList, strongList }: { riskList: SignalSnapshot[]; strongList: SignalSnapshot[] }) {
  return (
    <section className="weekly-grid" aria-label="市場清單">
      <div className="panel-intro">
        <p className="eyebrow">市場清單</p>
        <h2>強勢觀察與風險觀察</h2>
        <p>清單用同一套分數口徑排序，協助使用者快速找到需要深入查看的標的。</p>
      </div>
      <MarketList title="強勢觀察" description="市場分數較高的標的，適合用來複核趨勢是否延續。" items={strongList} valueKey="composite" />
      <MarketList title="風險觀察" description="風險分數較高的標的，適合用來檢查是否需要降低曝險或等待確認。" items={riskList} valueKey="risk" />
    </section>
  );
}

function HomeDataReadinessStatus() {
  return (
    <section className="panel public-data-readiness-summary" aria-label="資料狀態">
      <p className="eyebrow">資料狀態</p>
      <h2>免費版先以可理解的市場總覽上線，正式資料仍需通過資料來源與覆蓋檢查</h2>
      <p>
        現在畫面可驗證閱讀流程、燈號解釋、資料時間與風險聲明。資料上線前仍需完成合法可自動化來源、
        欄位合約、覆蓋率、回退與讀取檢查。
      </p>
    </section>
  );
}

function StockPublicSummary({ snapshot }: { snapshot: SignalSnapshot }) {
  return (
    <section className="stock-indicator-priority" id="stock-public-summary" aria-label="30 秒快速閱讀">
      <div>
        <p className="eyebrow">30 秒快讀 / 30 秒快速閱讀</p>
        <h2>
          {snapshot.asset.symbol} {snapshot.asset.name} 目前為「{snapshot.signal.title}」
        </h2>
        <p>{snapshot.signal.text}</p>
        <p>把單一標的放回市場脈絡，先看燈號狀態，再看成因、影響級別與資料信心。</p>
      </div>
      <div className="stock-indicator-priority-grid">
        <article className="active">
          <span>市場分數</span>
          <strong>{snapshot.compositeScore}/100</strong>
          <p>30 秒可用：用同一口徑快速判斷標的偏強、觀望或轉弱。</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "blocked" : "hold"}>
          <span>風險熱度</span>
          <strong>{snapshot.riskScore}/100</strong>
          <p>影響級別：分數越高，越需要複核波動、成交量與市場廣度。</p>
        </article>
        <article className="hold">
          <span>資料信心</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>示範資料與示範分數；正式市場資料尚未啟用。</p>
        </article>
      </div>
    </section>
  );
}

function StockDecisionCompass({ snapshot }: { snapshot: SignalSnapshot }) {
  const nextStep =
    snapshot.riskScore >= 60
      ? "先降低風險曝露，等待風險熱度下降或資料更新後再複核。"
      : snapshot.compositeScore >= 70
        ? "維持觀察趨勢是否延續，同時確認成交量與市場廣度沒有轉弱。"
        : "先列入觀察清單，等待燈號、成因或資料時間出現更明確變化。";

  return (
    <section className="stock-decision-compass" aria-label="股票頁決策羅盤">
      <div className="stock-decision-compass__intro">
        <p className="eyebrow">決策輔助摘要</p>
        <h2>股票頁決策羅盤：燈號狀態、成因、風險熱度、資料信心與下一步觀察</h2>
        <p>
          這裡不是買賣建議，而是把標的目前的市場訊號拆成可檢查的觀察項目。
          使用者可以在 3 分鐘要複核的清單中確認是否需要加強觀察。
        </p>
      </div>
      <article className={snapshot.compositeScore >= 70 ? "active" : "hold"}>
        <span>燈號狀態</span>
        <strong>{snapshot.signal.title}</strong>
        <p>{snapshot.signal.text}</p>
      </article>
      <article className={snapshot.riskScore >= 60 ? "blocked" : "hold"}>
        <span>成因</span>
        <strong>分數組合</strong>
        <p>由趨勢強弱、基本體質、估值壓力、市場廣度、資金流向與總體風險共同形成。</p>
      </article>
      <article className="hold">
        <span>影響級別</span>
        <strong>{snapshot.riskScore >= 60 ? "需要警戒" : "維持觀察"}</strong>
        <p>風險熱度 {snapshot.riskScore}/100；分數升高時，不應只看單一價格變化。</p>
      </article>
      <article className="hold">
        <span>下一步觀察</span>
        <strong>觀察 / 複核 / 降低風險</strong>
        <p>{nextStep}</p>
      </article>
      <p className="stock-decision-compass__boundary">
        不能當成個股買賣指令。不提供買進、賣出、持有或個人化投資建議。
      </p>
    </section>
  );
}

function StockDataBoundaryPanel({ snapshot }: { snapshot: SignalSnapshot }) {
  const missing = [...snapshot.missingModuleFlags, ...snapshot.staleDataFlags];

  return (
    <section className="stock-risk-checklist" id="stock-data-boundary" aria-label="資料來源與覆蓋">
      <div>
        <p className="eyebrow">資料來源與覆蓋</p>
        <h2>資料邊界：正式市場資料尚未啟用，需通過來源、覆蓋率與回退檢查</h2>
        <p>最近更新時間：{formatTaipeiTime(snapshot.lastUpdatedAt)}。目前為公開測試示範資料，不是投資建議。</p>
      </div>
      <div className="risk-check-grid">
        <article className="watch">
          <span>資料信心</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>正式資料來源與覆蓋率仍在上線前驗證。</p>
        </article>
        <article className="watch">
          <span>待確認項目</span>
          <strong>{missing.length}</strong>
          <p>{missing.join("；") || "目前沒有額外示範資料旗標"}</p>
        </article>
        <article className="watch">
          <span>使用邊界</span>
          <strong>不是投資建議</strong>
          <p>資料異常或未更新時，前台必須清楚顯示，不讓使用者誤判。</p>
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
