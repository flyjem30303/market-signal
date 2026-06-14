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
        <h1>{isStockPage ? `${selected.symbol} ${selected.name} 狀態儀表` : "指數狀態儀表站"}</h1>
        <p>
          指數燈號把市場資料整理成紅、黃、綠等狀態提示，讓一般投資者先用 30 秒內看懂市場氛圍，再用 3 分鐘內判斷是否關注、加強觀察或降低風險。
        </p>
        <p className="runtime-boundary-line">正式市場資料尚未啟用；目前為示範資料與示範分數，不提供個股買賣建議。</p>
        <div className="hero-status-strip" aria-label="公開 Beta 閱讀重點">
          <span>30 秒內看懂市場氛圍</span>
          <span>3 分鐘內判斷</span>
          <span>顯示資料更新時間</span>
          <span>保留非投資建議邊界</span>
        </div>
      </section>

      {!isStockPage && (
        <HomeFirstScreenDecisionSummary breadth={breadth} freshness={freshness} market={market} snapshot={snapshot} />
      )}
      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      {!isStockPage && <PublicBetaPublicStatusSurface />}
      <PublicBetaSourceCoverageBridge context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />

      <section className="panel stock-reading-summary" aria-label="三分鐘閱讀流程">
        <p className="eyebrow">3 分鐘閱讀流程</p>
        <h2>先看市場氣氛，再看風險原因，最後確認資料狀態</h2>
        <p>
          本頁把燈號、風險分數、資料更新時間與下一步觀察放在同一條閱讀順序。燈號代表需要觀察的市場線索，不是交易指令。
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

      <section className="stock-search-panel" aria-label="標的切換">
        <div>
          <p className="eyebrow">標的列表</p>
          <h2>切換指數、ETF 與示範標的</h2>
          <p>目前先保留少量示範標的，資料流程完成覆蓋率後再擴大到完整市場清單。</p>
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
          <p className="eyebrow">市場觀察</p>
          <h2>先看強勢，再看風險</h2>
          <p>使用者可先確認市場氣氛，再比較相對偏強與風險較高的標的。這是觀察輔助，不是交易指令。</p>
        </div>
        <MarketList title="強勢觀察" description="綜合分數較高，適合優先回看燈號成因。" items={strongList} valueKey="composite" />
        <MarketList title="風險觀察" description="風險分數較高，適合先複核資料狀態與警示原因。" items={riskList} valueKey="risk" />
      </section>

      <CommercialSlot context={isStockPage ? "stock" : "briefing"} />
      {!isStockPage && (
        <>
          <PublicBetaMembershipMvpRoadmap />

          <section className="panel stock-reading-summary" aria-label="會員功能預覽">
            <p className="eyebrow">下一階段會員功能</p>
            <h2>會員功能預覽：理解燈號、追蹤變化、回看判斷</h2>
            <p>
              下一階段會把「看到燈號」延伸成「理解燈號」。會員功能預計包含每日市場三層解讀、自選追蹤與自訂警示條件、盤後複盤報告。
            </p>
            <div className="briefing-actions">
              <TrackedLink eventName="membership_preview_link_clicked" href="/membership" label="查看會員功能預覽" payload={{ area: "dashboard_shell" }}>
                查看會員功能預覽
              </TrackedLink>
              <TrackedLink eventName="trust_link_clicked" href="/methodology" label="查看方法說明" payload={{ area: "dashboard_shell" }}>
                查看方法說明
              </TrackedLink>
            </div>
          </section>
        </>
      )}

      <article className="disclaimer">
        <h2>不是投資建議</h2>
        <p>本站是市場資訊整理與風險辨識工具，不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。</p>
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
  const action = market.riskScore >= 60 ? "先降低解讀信心並複核風險" : "先關注趨勢是否延續";

  return (
    <section className="home-first-screen-decision" aria-label="首頁快速閱讀">
      <div className="home-first-screen-decision__main">
        <p className="eyebrow">全市場總覽</p>
        <h2>
          30 秒看懂：{market.asset.name} 目前是「{market.signal.title}」
        </h2>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-first-screen-decision__grid">
        <article className="constructive">
          <span>市場氣氛</span>
          <strong>{market.signal.title}</strong>
          <p>先判斷目前偏多、觀望、警戒或高風險。</p>
        </article>
        <article className="watch">
          <span>市場廣度</span>
          <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
          <p>偏多、觀望、警戒數量協助確認市場是否集中。</p>
        </article>
        <article className={market.riskScore >= 60 ? "defensive" : "constructive"}>
          <span>主要風險</span>
          <strong>{market.riskScore}/100</strong>
          <p>{action}。</p>
        </article>
        <article className="watch">
          <span>資料時間</span>
          <strong>{freshness.asOfDate}</strong>
          <p>更新時間：{formatTaipeiTime(snapshot.lastUpdatedAt)}；正式市場資料尚未啟用。</p>
        </article>
      </div>
      <p className="home-first-screen-decision__next">
        3 分鐘複核：先看市場晨報，再看指數狀態與風險聲明；本頁是資訊整理與風險辨識，不提供個股買賣建議。
      </p>
      <div className="home-first-screen-decision__actions" aria-label="首頁下一步行動">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場晨報" payload={{ area: "home_first_screen" }}>
          查看市場晨報
        </TrackedLink>
        <TrackedLink eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "home_first_screen" }}>
          查看風險聲明
        </TrackedLink>
        <TrackedLink
          eventName="membership_preview_link_clicked"
          href="/membership"
          label="查看會員功能預覽"
          payload={{ area: "home_first_screen" }}
        >
          查看會員功能預覽
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
    <section className="home-public-beta-layers" aria-label="全市場總覽">
      <div className="home-public-beta-layer active">
        <span>全市場總覽</span>
        <strong>{market.signal.title}</strong>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-public-beta-layer readying">
        <span>核心指標面板</span>
        <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
        <p>用偏多、觀望、警戒數量判斷市場是否集中在少數強勢標的。</p>
      </div>
      <div className="home-public-beta-layer blocked">
        <span>警示清單</span>
        <strong>{snapshot.dataQualityGrade}</strong>
        <p>正式資料升級前檢查仍未完成，請把目前分數視為示範資料邊界內的閱讀流程。</p>
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
      action: "先看市場氣氛",
      body: market.signal.text,
      label: "核心燈號",
      tone: "constructive",
      value: market.signal.title
    },
    {
      action: "確認是否集中",
      body: `偏多 ${breadth.constructive}、觀望 ${breadth.watch}、警戒 ${breadth.defensive}。`,
      label: "市場廣度",
      tone: breadth.constructive >= breadth.defensive ? "constructive" : "watch",
      value: `${breadth.constructive}/${breadth.watch}/${breadth.defensive}`
    },
    {
      action: market.riskScore >= 55 ? "加強風險複核" : "維持觀察",
      body: "風險分數偏高時，先回看資料狀態與警示原因。",
      label: "風險熱度",
      tone: market.riskScore >= 55 ? "watch" : "constructive",
      value: `${market.riskScore}/100`
    },
    {
      action: "確認資料時間",
      body: `更新時間：${formatTaipeiTime(snapshot.lastUpdatedAt)}。`,
      label: "資料可信度",
      tone: "watch",
      value: snapshot.dataQualityGrade
    }
  ];

  return (
    <section className="home-core-indicator-readout" aria-label="核心指標摘要">
      <div>
        <p className="eyebrow">核心指標面板</p>
        <h2>30 秒看市場，3 分鐘排觀察順序</h2>
        <p>先看燈號，再看強弱分布、風險熱度與資料時間，避免只看單一分數就做判斷。</p>
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
    <section className="panel public-data-readiness-summary" aria-label="資料準備狀態">
      <p className="eyebrow">資料狀態</p>
      <h2>正式資料導入前，先把閱讀流程做好</h2>
      <p>
        目前公開頁使用示範資料建立市場燈號、風險提示與更新時間的閱讀方式。正式資料升級前檢查仍未完成；資料來源、覆蓋率與自動化更新流程確認後，才會升級為正式資料。
      </p>
      <p>在正式資料啟用前，頁面會持續標示示範資料邊界與非投資建議邊界。</p>
    </section>
  );
}

function StockPublicSummary({ snapshot }: { snapshot: SignalSnapshot }) {
  const missing = snapshot.missingModuleFlags.length + snapshot.staleDataFlags.length;

  return (
    <section className="stock-indicator-priority" id="stock-public-summary" aria-label="標的快速摘要">
      <div>
        <p className="eyebrow">標的快速摘要</p>
        <h2>
          先看燈號：{snapshot.asset.symbol} {snapshot.asset.name} 是「{snapshot.signal.title}」
        </h2>
        <p>30 秒快速閱讀：{snapshot.signal.text}</p>
      </div>
      <div className="stock-indicator-priority-grid">
        <article className="active">
          <span>綜合分數</span>
          <strong>{snapshot.compositeScore}/100</strong>
          <p>用來快速理解目前偏強、觀望或偏防守。</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "blocked" : "hold"}>
          <span>風險分數</span>
          <strong>{snapshot.riskScore}/100</strong>
          <p>風險偏高時，先看成因與資料狀態，不急著做方向判斷。</p>
        </article>
        <article className={missing ? "hold" : "active"}>
          <span>資料提醒</span>
          <strong>{missing ? `${missing} 項提醒` : "暫無提醒"}</strong>
          <p>正式市場資料尚未啟用，請先確認資料狀態再閱讀燈號。</p>
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
      ? "先複核風險來源、資料時間與市場總覽，再決定是否降低風險。"
      : snapshot.compositeScore >= 70
        ? "先觀察趨勢是否延續，再比較市場總覽與相關 ETF。"
        : "維持觀察，等待更多資料或連續燈號變化。";

  const cards = [
    {
      body: snapshot.signal.text,
      label: "目前燈號",
      tone: snapshot.compositeScore >= 70 ? "active" : "hold",
      value: snapshot.signal.title
    },
    {
      body: "風險分數越高，越需要先複核成因與資料狀態。",
      label: "風險熱度",
      tone: riskTone,
      value: `${snapshot.riskScore}/100`
    },
    {
      body: "正式市場資料尚未啟用，目前為示範閱讀流程。",
      label: "資料品質",
      tone: dataTone,
      value: snapshot.dataQualityGrade
    },
    {
      body: nextStep,
      label: "下一步觀察",
      tone: "hold",
      value: "觀察順序"
    }
  ];

  return (
    <section className="stock-decision-compass" aria-label="標的決策輔助">
      <div className="stock-decision-compass__intro">
        <p className="eyebrow">決策輔助</p>
        <h2>把燈號、風險、資料狀態整理成一個觀察順序</h2>
      </div>
      {cards.map((card) => (
        <article className={card.tone} key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          <p>{card.body}</p>
        </article>
      ))}
      <p className="stock-decision-compass__boundary">
        本區塊提供市場資訊整理與風險辨識，不是買賣建議，也不保證任何投資結果。
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
        <h2>把單一標的放回整體市場一起看</h2>
        <p>單一指數、ETF 或個股不應孤立閱讀；請同時看市場總燈號、廣度與資料狀態。</p>
      </div>
      <div className="market-context-grid">
        <article className="positive">
          <span>市場總燈號</span>
          <strong>{market.signal.title}</strong>
          <p>{market.signal.text}</p>
        </article>
        <article className="watch">
          <span>市場廣度</span>
          <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
          <p>偏多、觀望、警戒數量協助判斷市場是否集中。</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "risk" : "positive"}>
          <span>標的風險</span>
          <strong>{snapshot.riskScore}/100</strong>
          <p>風險分數偏高時，請先回看原因與資料更新時間。</p>
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
        <h2>目前仍是示範資料，正式資料尚未啟用</h2>
        <p>資料時間：{formatTaipeiTime(snapshot.lastUpdatedAt)}。正式資料來源、覆蓋率與自動化更新完成前，請勿把目前燈號視為即時市場訊號。</p>
      </div>
      <div className="risk-check-grid">
        <article className="watch">
          <span>資料等級</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>3 分鐘判斷時，先確認資料品質，再解讀風險或趨勢。</p>
        </article>
        <article className={missing.length ? "watch" : "pass"}>
          <span>資料提醒</span>
          <strong>{missing.length ? `${missing.length} 項` : "無"}</strong>
          <p>{missing.length ? missing.join("、") : "目前沒有額外資料缺漏提醒。"}</p>
        </article>
        <article className="watch">
          <span>使用邊界</span>
          <strong>資訊整理</strong>
          <p>燈號只能用來建立觀察順序，不能視為買賣指令或報酬承諾。</p>
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
