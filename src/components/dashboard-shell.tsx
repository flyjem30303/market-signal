"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CommercialSlot } from "@/components/commercial-slot";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PublicBetaMembershipMvpRoadmap } from "@/components/public-beta-membership-mvp-roadmap";
import { PublicBetaPublicStatusSurface } from "@/components/public-beta-public-status-surface";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
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
      <section className="hero dashboard-hero">
        <p className="eyebrow">公開 Beta</p>
        <h1>{isStockPage ? `${selected.symbol} ${selected.name} 指數燈號` : "指數狀態儀表站"}</h1>
        <p>
          用紅、黃、綠等燈號，把市場風險、趨勢強弱與觀察重點整理成可閱讀的順序。目標是讓使用者在 30 秒內看懂市場氛圍，並在 3 分鐘內知道下一步該觀察什麼。
        </p>
        <p className="runtime-boundary-line">
          目前前台仍以示範資料呈現，真實資料來源與更新流程確認前，不會宣稱即時真實行情或提供投資建議。
        </p>
        <div className="hero-status-strip" aria-label="公開版閱讀重點">
          <span>30 秒看懂市場狀態</span>
          <span>3 分鐘形成觀察順序</span>
          <span>資料來源與時間清楚揭露</span>
          <span>非投資建議</span>
        </div>
      </section>

      {!isStockPage && (
        <HomeFirstScreenDecisionSummary breadth={breadth} freshness={freshness} market={market} snapshot={snapshot} />
      )}
      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      {!isStockPage && <PublicBetaPublicStatusSurface />}
      <PublicBetaSourceCoverageBridge context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />

      <section className="panel stock-reading-summary" aria-label="三分鐘閱讀順序">
        <p className="eyebrow">3 分鐘閱讀順序</p>
        <h2>先看市場燈號，再看核心指標，最後看資料邊界</h2>
        <p>
          指數燈號不是單一分數排名，而是把市場總覽、核心指標、警示清單與更新時間放在同一個判斷順序中，幫助使用者避免只看漲跌造成誤判。
        </p>
      </section>
      <PublicNextReadingFlow context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />

      {!isStockPage && (
        <>
          <HomeMarketOverview breadth={breadth} market={market} snapshot={snapshot} />
          <HomeCoreIndicatorReadout breadth={breadth} market={market} snapshot={snapshot} />
          <HomeDataReadinessStatus />
        </>
      )}

      {isStockPage && (
        <>
          <StockRuntimeAtAGlance scoreSourceLabel="示範分數" snapshot={snapshot} />
          <StockPublicSummary snapshot={snapshot} />
          <StockDecisionCompass snapshot={snapshot} />
          <StockMarketContextPanel breadth={breadth} market={market} snapshot={snapshot} />
          <StockDataBoundaryPanel snapshot={snapshot} />
        </>
      )}

      <section className="stock-search-panel" aria-label="切換觀察標的">
        <div>
          <p className="eyebrow">切換標的</p>
          <h2>查看不同指數、ETF 與代表性標的</h2>
          <p>公開版先以少量示範標的建立閱讀流程；資料覆蓋率補齊後，再擴大到更完整的台股市場範圍。</p>
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
        <div className="panel-intro">
          <p className="eyebrow">觀察清單</p>
          <h2>把可關注與需複核的標的分開看</h2>
          <p>清單協助使用者先理解市場結構，再決定是否前往個別標的頁深入閱讀；它不是買賣排序。</p>
        </div>
        <MarketList title="相對強勢觀察" description="綜合分數較高的示範標的，適合用來理解目前市場主軸。" items={strongList} valueKey="composite" />
        <MarketList title="風險複核清單" description="風險分數較高的示範標的，適合先確認成因與資料更新時間。" items={riskList} valueKey="risk" />
      </section>

      <CommercialSlot context={isStockPage ? "stock" : "briefing"} />
      {!isStockPage && (
        <>
          <PublicBetaMembershipMvpRoadmap />

          <section className="panel stock-reading-summary" aria-label="會員內容預告">
            <p className="eyebrow">下一階段會員內容</p>
            <h2>會員版會從「看到燈號」延伸到「理解燈號與追蹤變化」</h2>
            <p>
              會員 MVP 會優先規劃每日市場三層解讀、watchlist 與自訂警示、盤後複盤。公開版先完成市場總覽與風險辨識，會員功能不阻塞目前上線。
            </p>
            <div className="briefing-actions">
              <TrackedLink eventName="membership_preview_link_clicked" href="/membership" label="查看會員內容規劃" payload={{ area: "dashboard_shell" }}>
                查看會員內容規劃
              </TrackedLink>
              <TrackedLink eventName="trust_link_clicked" href="/methodology" label="了解燈號方法" payload={{ area: "dashboard_shell" }}>
                了解燈號方法
              </TrackedLink>
            </div>
          </section>
        </>
      )}

      <article className="disclaimer">
        <h2>非投資建議</h2>
        <p>本網站提供市場資訊整理、風險辨識與觀察輔助，不提供個別買賣建議、不保證報酬，也不代替使用者做投資決策。</p>
      </article>
    </main>
  );
}

function HomeFirstScreenDecisionSummary({
  breadth,
  freshness,
  market,
  snapshot
}: {
  breadth: BreadthSummary;
  freshness: DataFreshnessSnapshot;
  market: SignalSnapshot;
  snapshot: SignalSnapshot;
}) {
  const action = market.riskScore >= 60 ? "先降低風險判斷速度，複核資料與成因" : "可維持觀察，但仍需確認更新時間";

  return (
    <section className="home-first-screen-decision" aria-label="首頁第一屏決策摘要">
      <div className="home-first-screen-decision__main">
        <p className="eyebrow">市場總覽</p>
        <h2>
          30 秒內先看：{market.asset.name} 目前為「{market.signal.title}」
        </h2>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-first-screen-decision__grid">
        <article className="constructive">
          <span>市場燈號</span>
          <strong>{market.signal.title}</strong>
          <p>用一句話先判斷目前市場偏多、觀望、警戒或高風險。</p>
        </article>
        <article className="watch">
          <span>市場廣度</span>
          <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
          <p>依序代表偏多、觀望、警戒標的數量，協助看出市場是否集中。</p>
        </article>
        <article className={market.riskScore >= 60 ? "defensive" : "constructive"}>
          <span>主要風險</span>
          <strong>{market.riskScore}/100</strong>
          <p>{action}。</p>
        </article>
        <article className="watch">
          <span>資料更新</span>
          <strong>{freshness.asOfDate}</strong>
          <p>示範資料時間：{formatTaipeiTime(snapshot.lastUpdatedAt)}，真實資料接入前請以示範閱讀。</p>
        </article>
      </div>
      <p className="home-first-screen-decision__next">
        3 分鐘閱讀建議：先看全市場總覽，再看核心指標面板與警示清單；若資料時間延遲或風險升高，先暫緩做單一結論。
      </p>
      <div className="home-first-screen-decision__actions" aria-label="首頁下一步">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="閱讀今日市場簡報" payload={{ area: "home_first_screen" }}>
          閱讀今日市場簡報
        </TrackedLink>
        <TrackedLink eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "home_first_screen" }}>
          查看風險聲明
        </TrackedLink>
        <TrackedLink
          eventName="membership_preview_link_clicked"
          href="/membership"
          label="查看會員功能規劃"
          payload={{ area: "home_first_screen" }}
        >
          查看會員功能規劃
        </TrackedLink>
      </div>
    </section>
  );
}

function HomeMarketOverview({
  breadth,
  market,
  snapshot
}: {
  breadth: BreadthSummary;
  market: SignalSnapshot;
  snapshot: SignalSnapshot;
}) {
  return (
    <section className="home-public-beta-layers" aria-label="首頁三層視圖">
      <div className="home-public-beta-layer active">
        <span>全市場總覽</span>
        <strong>{market.signal.title}</strong>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-public-beta-layer readying">
        <span>核心指標面板</span>
        <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
        <p>以市場廣度、趨勢、資金與風險分數建立同一套閱讀順序。</p>
      </div>
      <div className="home-public-beta-layer blocked">
        <span>警示清單</span>
        <strong>{snapshot.dataQualityGrade}</strong>
        <p>資料品質與更新時間會直接顯示，避免使用者把示範資料誤認為即時行情。</p>
      </div>
    </section>
  );
}

function HomeCoreIndicatorReadout({
  breadth,
  market,
  snapshot
}: {
  breadth: BreadthSummary;
  market: SignalSnapshot;
  snapshot: SignalSnapshot;
}) {
  const items = [
    {
      action: "先看市場狀態",
      body: market.signal.text,
      label: "燈號",
      tone: "constructive",
      value: market.signal.title
    },
    {
      action: "判斷市場是否集中",
      body: `偏多 ${breadth.constructive}、觀望 ${breadth.watch}、警戒 ${breadth.defensive}。`,
      label: "市場廣度",
      tone: breadth.constructive >= breadth.defensive ? "constructive" : "watch",
      value: `${breadth.constructive}/${breadth.watch}/${breadth.defensive}`
    },
    {
      action: market.riskScore >= 55 ? "優先複核風險" : "維持觀察",
      body: "風險分數用來提醒是否需要降低判斷速度，而不是直接給出交易結論。",
      label: "風險分數",
      tone: market.riskScore >= 55 ? "watch" : "constructive",
      value: `${market.riskScore}/100`
    },
    {
      action: "確認資料時間",
      body: `更新時間：${formatTaipeiTime(snapshot.lastUpdatedAt)}。`,
      label: "資料品質",
      tone: "watch",
      value: snapshot.dataQualityGrade
    }
  ];

  return (
    <section className="home-core-indicator-readout" aria-label="核心指標面板">
      <div>
        <p className="eyebrow">核心指標面板</p>
        <h2>30 秒看燈號，3 分鐘看成因</h2>
        <p>核心指標用同一套順序整理市場狀態：先看燈號，再看廣度、風險與資料品質。</p>
      </div>
      <div className="home-core-indicator-grid">
        {items.map((item) => (
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

function HomeDataReadinessStatus() {
  return (
    <section className="panel public-data-readiness-summary" aria-label="資料狀態摘要">
      <p className="eyebrow">資料狀態</p>
      <h2>目前以示範資料建立閱讀流程，真實資料接入另行放行</h2>
      <p>
        公開版先完成使用者可理解的市場總覽、核心指標與風險提示。真實資料來源、合法自動化條件、更新頻率與回退流程確認後，才會切換資料來源。
      </p>
      <p>若資料異常或未更新，前台會顯示更新時間與資料邊界，避免使用者誤判。</p>
    </section>
  );
}

function StockPublicSummary({ snapshot }: { snapshot: SignalSnapshot }) {
  const missing = snapshot.missingModuleFlags.length + snapshot.staleDataFlags.length;

  return (
    <section className="stock-indicator-priority" id="stock-public-summary" aria-label="標的公開摘要">
      <div>
        <p className="eyebrow">標的摘要</p>
        <h2>
          {snapshot.asset.symbol} {snapshot.asset.name} 目前為「{snapshot.signal.title}」
        </h2>
        <p>30 秒快讀：{snapshot.signal.text}</p>
      </div>
      <div className="stock-indicator-priority-grid">
        <article className="active">
          <span>綜合分數</span>
          <strong>{snapshot.compositeScore}/100</strong>
          <p>用來快速理解示範資料下的整體狀態，不是買賣排序。</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "blocked" : "hold"}>
          <span>風險分數</span>
          <strong>{snapshot.riskScore}/100</strong>
          <p>分數越高代表越需要複核風險成因與資料時間。</p>
        </article>
        <article className={missing ? "hold" : "active"}>
          <span>資料提醒</span>
          <strong>{missing ? `${missing} 項提醒` : "無提醒"}</strong>
          <p>目前仍是示範資料，真實資料接入前所有分數都只用於閱讀流程驗證。</p>
        </article>
      </div>
    </section>
  );
}

function StockDecisionCompass({ snapshot }: { snapshot: SignalSnapshot }) {
  const riskTone = snapshot.riskScore >= 60 ? "blocked" : snapshot.riskScore >= 45 ? "hold" : "active";
  const dataTone = snapshot.dataQualityGrade === "A" ? "active" : "hold";
  const nextStep =
    snapshot.riskScore >= 60
      ? "先複核風險成因與資料更新時間，再決定是否持續追蹤。"
      : snapshot.compositeScore >= 70
        ? "可放入觀察清單，但仍需同步看市場總覽與風險分數。"
        : "先維持觀望，等待趨勢、資金或市場廣度出現更一致的訊號。";

  const cards = [
    {
      body: snapshot.signal.text,
      label: "目前燈號",
      tone: snapshot.compositeScore >= 70 ? "active" : "hold",
      value: snapshot.signal.title
    },
    {
      body: "風險分數提醒是否需要降低判斷速度，避免只看單日漲跌。",
      label: "風險狀態",
      tone: riskTone,
      value: `${snapshot.riskScore}/100`
    },
    {
      body: "目前公開頁仍以示範資料呈現，資料品質會影響判讀信心。",
      label: "資料品質",
      tone: dataTone,
      value: snapshot.dataQualityGrade
    },
    {
      body: nextStep,
      label: "下一步",
      tone: "hold",
      value: "觀察建議"
    }
  ];

  return (
    <section className="stock-decision-compass" aria-label="標的決策輔助">
      <div className="stock-decision-compass__intro">
        <p className="eyebrow">決策輔助</p>
        <h2>把燈號、風險、資料品質與下一步放在同一張卡片</h2>
      </div>
      {cards.map((card) => (
        <article className={card.tone} key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          <p>{card.body}</p>
        </article>
      ))}
      <p className="stock-decision-compass__boundary">
        這些內容是資訊整理與觀察輔助，不是個別標的買賣建議。
      </p>
    </section>
  );
}

function StockMarketContextPanel({
  breadth,
  market,
  snapshot
}: {
  breadth: BreadthSummary;
  market: SignalSnapshot;
  snapshot: SignalSnapshot;
}) {
  return (
    <section className="stock-market-context" id="stock-market-context" aria-label="市場脈絡">
      <div>
        <p className="eyebrow">市場脈絡</p>
        <h2>不要只看單一標的，也要看整體市場狀態</h2>
        <p>同一支股票或 ETF 的燈號，需要搭配大盤狀態、市場廣度與風險分數一起閱讀。</p>
      </div>
      <div className="market-context-grid">
        <article className="positive">
          <span>大盤燈號</span>
          <strong>{market.signal.title}</strong>
          <p>{market.signal.text}</p>
        </article>
        <article className="watch">
          <span>市場廣度</span>
          <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
          <p>偏多、觀望、警戒標的分布可協助判斷市場是否集中。</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "risk" : "positive"}>
          <span>標的風險</span>
          <strong>{snapshot.riskScore}/100</strong>
          <p>風險升高時，應先看成因與資料時間，再做進一步判斷。</p>
        </article>
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
        <h2>目前不是即時真實行情，請先看更新時間</h2>
        <p>資料更新時間：{formatTaipeiTime(snapshot.lastUpdatedAt)}。真實資料來源、授權與更新流程確認前，前台維持示範資料。</p>
      </div>
      <div className="risk-check-grid">
        <article className="watch">
          <span>資料品質</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>資料品質等級用來提醒目前判讀信心，不能單獨作為投資依據。</p>
        </article>
        <article className={missing.length ? "watch" : "pass"}>
          <span>資料提醒</span>
          <strong>{missing.length ? `${missing.length} 項` : "無"}</strong>
          <p>{missing.length ? missing.join("、") : "目前沒有額外資料提醒。"}</p>
        </article>
        <article className="watch">
          <span>使用邊界</span>
          <strong>資訊整理</strong>
          <p>公開頁只提供風險辨識與觀察輔助，不提供買賣建議。</p>
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
