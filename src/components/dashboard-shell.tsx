"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CommercialSlot } from "@/components/commercial-slot";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
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
        <h1>{isStockPage ? `${selected.symbol} ${selected.name} 指數燈號` : "指數燈號儀表站"}</h1>
        <p>
          用紅、黃、綠燈號把市場風險、趨勢強弱與觀察重點整理成可閱讀的決策輔助介面。
          目標是讓一般投資者在 30 秒內看懂市場氛圍，並在 3 分鐘內知道下一步該觀察什麼。
        </p>
        <p className="runtime-boundary-line">
          目前為公開 Beta 示範資料，不構成投資建議；正式資料來源、更新頻率與資料覆蓋率仍會逐步補齊。
        </p>
        <div className="hero-status-strip" aria-label="公開 Beta 狀態">
          <span>30 秒市場判讀</span>
          <span>3 分鐘內判斷</span>
          <span>全市場總覽</span>
          <span>警示提醒</span>
          <span>資料時間戳揭露</span>
          <span>非投資建議</span>
        </div>
      </section>

      {!isStockPage && (
        <HomeFirstScreenDecisionSummary breadth={breadth} freshness={freshness} market={market} snapshot={snapshot} />
      )}

      {!isStockPage && (
        <section className="home-public-beta-layers" aria-label="首頁三層市場視圖">
          <div className="home-public-beta-layer active">
            <span>核心指標面板</span>
            <strong>指數狀態儀表站：30 秒可讀</strong>
            <p>先看市場狀態、風險熱度、資料品質與更新時間，快速判斷目前偏多、觀望、警戒或高風險。</p>
          </div>
          <div className="home-public-beta-layer readying">
            <span>警示清單</span>
            <strong>3 分鐘可行動</strong>
            <p>再看成因、影響級別與下一步觀察，決定是否關注、加強複核或降低風險曝露。</p>
          </div>
          <div className="home-public-beta-layer blocked">
            <span>資料邊界</span>
            <strong>正式市場資料尚未啟用</strong>
            <p>目前維持示範資料與 mock 分數；不提供買進、賣出、持有或個人化投資建議。</p>
          </div>
        </section>
      )}

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      {!isStockPage && <PublicBetaPublicStatusSurface />}
      {!isStockPage && <PublicBetaDataReadinessStatus />}
      <PublicBetaSourceCoverageBridge context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />

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
          <p className="eyebrow">觀察標的</p>
          <h2>切換指數、ETF 與核心台股</h2>
          <p>先用少量代表性標的驗證閱讀流程；正式資料覆蓋補齊後，再擴大到更完整的台股與 ETF 覆蓋。</p>
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
        <div className="panel-intro">
          <p className="eyebrow">市場清單</p>
          <h2>找出目前較強與較需要警戒的標的</h2>
          <p>這些排序是示範分數，用來呈現未來正式資料接入後的閱讀方式。</p>
        </div>
        <MarketList title="較強觀察" description="綜合分數較高，代表示範模型中趨勢、品質與資金條件相對較好。" items={strongList} valueKey="composite" />
        <MarketList title="風險觀察" description="風險分數較高，代表估值、波動或資料狀態需要更仔細檢查。" items={riskList} valueKey="risk" />
      </section>

      <PublicNextReadingFlow context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />
      <CommercialSlot context={isStockPage ? "stock" : "briefing"} />

      {!isStockPage && (
        <>
          <PublicBetaMembershipMvpRoadmap />
          <section className="panel stock-reading-summary" aria-label="會員預覽">
            <p className="eyebrow">下一階段</p>
            <h2>會員功能會放在第二階段，不拖慢第一階段公開可用閉環</h2>
            <p>
              第一階段先完成所有人可使用的市場總覽、資料揭露與風險提示。第二階段再導入每日三層解讀、
              自選追蹤與自訂警示、盤後複盤。
            </p>
            <div className="briefing-actions">
              <TrackedLink eventName="membership_preview_link_clicked" href="/membership" label="查看會員規劃" payload={{ area: "dashboard_shell" }}>
                查看會員規劃
              </TrackedLink>
              <TrackedLink eventName="trust_link_clicked" href="/methodology" label="了解方法與限制" payload={{ area: "dashboard_shell" }}>
                了解方法與限制
              </TrackedLink>
            </div>
          </section>
        </>
      )}

      <article className="disclaimer">
        <h2>重要聲明</h2>
        <p>
          本網站提供市場資訊整理、風險辨識與觀察輔助，不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。
        </p>
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
  const action =
    market.riskScore >= 60 ? "先降低追價衝動，確認風險是否擴散。" : "可持續觀察趨勢，但仍要檢查資料狀態。";

  return (
    <section className="home-first-screen-decision" aria-label="首頁快速判讀">
      <div className="home-first-screen-decision__main">
        <p className="eyebrow">首頁快速判讀</p>
        <h2>
          30 秒看懂市場氣氛：目前 {market.asset.name} 為「{market.signal.title}」
        </h2>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-first-screen-decision__grid">
        <article className="constructive">
          <span>市場燈號</span>
          <strong>{market.signal.title}</strong>
          <p>先看市場整體偏多、觀望、警戒或高風險。</p>
        </article>
        <article className="watch">
          <span>市場廣度</span>
          <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
          <p>依序代表偏多、觀望、防守標的數量。</p>
        </article>
        <article className={market.riskScore >= 60 ? "defensive" : "constructive"}>
          <span>主要風險</span>
          <strong>{market.riskScore}/100</strong>
          <p>{action}</p>
        </article>
        <article className="watch">
          <span>資料時間</span>
          <strong>{freshness.asOfDate}</strong>
          <p>示範資料更新時間：{formatTaipeiTime(snapshot.lastUpdatedAt)}</p>
        </article>
      </div>
      <p className="home-first-screen-decision__next">
        3 分鐘複核與 3 分鐘閱讀建議：先看市場燈號，再看主要風險與市場廣度，最後確認資料更新時間與限制。
      </p>
      <div className="home-first-screen-decision__actions" aria-label="首頁行動">
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場晨報" payload={{ area: "home_first_screen" }}>
          查看市場晨報
        </TrackedLink>
        <TrackedLink eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "home_first_screen" }}>
          查看風險聲明
        </TrackedLink>
        <TrackedLink eventName="membership_preview_link_clicked" href="/membership" label="查看會員功能預覽" payload={{ area: "home_first_screen" }}>
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
    <section className="home-public-beta-layers" aria-label="市場三層總覽">
      <div className="home-public-beta-layer active">
        <span>市場狀態</span>
        <strong>{market.signal.title}</strong>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-public-beta-layer readying">
        <span>市場廣度</span>
        <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
        <p>用三段數量觀察市場是多數標的同步，還是集中在少數標的。</p>
      </div>
      <div className="home-public-beta-layer blocked">
        <span>資料狀態</span>
        <strong>{snapshot.dataQualityGrade}</strong>
        <p>目前仍是示範資料，正式每日資料覆蓋與來源條件尚未完成。</p>
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
      action: "判斷市場氛圍",
      body: market.signal.text,
      label: "燈號",
      tone: "constructive",
      value: market.signal.title
    },
    {
      action: "確認是否擴散",
      body: `偏多 ${breadth.constructive}、觀望 ${breadth.watch}、防守 ${breadth.defensive}。`,
      label: "市場廣度",
      tone: breadth.constructive >= breadth.defensive ? "constructive" : "watch",
      value: `${breadth.constructive}/${breadth.watch}/${breadth.defensive}`
    },
    {
      action: market.riskScore >= 55 ? "加強風險檢查" : "維持觀察",
      body: "風險分數越高，越需要檢查集中度、波動與資料更新狀態。",
      label: "風險",
      tone: market.riskScore >= 55 ? "watch" : "constructive",
      value: `${market.riskScore}/100`
    },
    {
      action: "確認資料限制",
      body: `更新時間：${formatTaipeiTime(snapshot.lastUpdatedAt)}。`,
      label: "資料",
      tone: "watch",
      value: snapshot.dataQualityGrade
    }
  ];

  return (
    <section className="home-core-indicator-readout" aria-label="核心指標">
      <div>
        <p className="eyebrow">核心指標</p>
        <h2>用四個資訊完成第一輪判斷</h2>
        <p>燈號、廣度、主要風險、資料狀態是第一階段首頁的最小可用決策順序。</p>
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
    <section className="panel public-data-readiness-summary" aria-label="資料狀態">
      <p className="eyebrow">資料狀態</p>
      <h2>目前公開頁先清楚標示示範資料，避免使用者誤判</h2>
      <p>
        資料真實化與覆蓋率補齊會持續推進；在正式來源、更新頻率、來源權利與驗證流程完成前，
        前台會維持示範資料與非投資建議標示。
      </p>
    </section>
  );
}

function StockPublicSummary({ snapshot }: { snapshot: SignalSnapshot }) {
  const missing = snapshot.missingModuleFlags.length + snapshot.staleDataFlags.length;

  return (
    <section className="stock-indicator-priority" id="stock-public-summary" aria-label="標的摘要">
      <div>
        <p className="eyebrow">標的摘要</p>
        <h2>
          {snapshot.asset.symbol} {snapshot.asset.name} 目前為「{snapshot.signal.title}」
        </h2>
        <p>{snapshot.signal.text}</p>
        <p>3 分鐘閱讀順序：先看燈號，再看風險分數，最後確認資料更新時間與使用邊界。</p>
      </div>
      <div className="stock-indicator-priority-grid">
        <article className="active">
          <span>綜合分數</span>
          <strong>{snapshot.compositeScore}/100</strong>
          <p>用來快速理解趨勢、品質、估值與資金狀態的示範分數。</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "blocked" : "hold"}>
          <span>風險分數</span>
          <strong>{snapshot.riskScore}/100</strong>
          <p>分數越高，越需要檢查波動、集中度與資料時效。</p>
        </article>
        <article className={missing ? "hold" : "active"}>
          <span>資料提示</span>
          <strong>{missing ? `${missing} 項` : "完整"}</strong>
          <p>目前仍為示範資料，正式資料補齊前請勿作為交易依據。</p>
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
      ? "先檢查風險是否擴散，避免只看單一高分訊號。"
      : snapshot.compositeScore >= 70
        ? "可持續觀察趨勢是否延續，並留意估值與資金流。"
        : "維持觀望，等待燈號、廣度或風險訊號更一致。";

  const cards = [
    {
      body: snapshot.signal.text,
      label: "市場狀態",
      tone: snapshot.compositeScore >= 70 ? "active" : "hold",
      value: snapshot.signal.title
    },
    {
      body: "風險分數用來提醒是否需要降低追價、複核資料或等待確認。",
      label: "風險提醒",
      tone: riskTone,
      value: `${snapshot.riskScore}/100`
    },
    {
      body: "資料分級目前主要揭露示範資料限制，正式資料接入後會再升級。",
      label: "資料可信度",
      tone: dataTone,
      value: snapshot.dataQualityGrade
    },
    {
      body: nextStep,
      label: "下一步",
      tone: "hold",
      value: "觀察"
    }
  ];

  return (
    <section className="stock-decision-compass" aria-label="決策輔助">
      <div className="stock-decision-compass__intro">
        <p className="eyebrow">股票頁決策羅盤</p>
        <h2>燈號狀態、風險熱度、資料信心與下一步觀察</h2>
        <p>
          股票頁先把目前燈號、主要風險、資料品質與觀察動作整理在同一區，協助使用者在 3 分鐘內完成複核。
          正式市場資料尚未啟用；不提供買進、賣出、持有或個人化投資建議。
        </p>
      </div>
      <div className="stock-decision-compass__grid" aria-label="股票頁決策羅盤摘要">
        <article className={snapshot.compositeScore >= 70 ? "active" : "hold"}>
          <span>燈號狀態</span>
          <strong>{snapshot.signal.title}</strong>
          <p>{snapshot.signal.text}</p>
        </article>
        <article className={riskTone}>
          <span>風險熱度</span>
          <strong>{snapshot.riskScore}/100</strong>
          <p>風險熱度越高，越需要複核市場總覽、資料品質與隔日觀察重點。</p>
        </article>
        <article className={dataTone}>
          <span>資料信心</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>資料品質仍需來源、覆蓋率與更新流程驗證；目前不作正式資料宣稱。</p>
        </article>
        <article className="hold">
          <span>下一步觀察</span>
          <strong>觀察 / 複核 / 降低風險</strong>
          <p>{nextStep}</p>
        </article>
      </div>
      <div className="stock-decision-compass__intro">
        <p className="eyebrow">決策輔助</p>
        <h2>先理解狀態，再決定是否加強觀察或降低風險</h2>
      </div>
      {cards.map((card) => (
        <article className={card.tone} key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          <p>{card.body}</p>
        </article>
      ))}
      <p className="stock-decision-compass__boundary">
        本區塊只提供市場資訊整理與風險辨識，不提供買賣建議或保證報酬。
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
        <p>單一標的分數需要搭配大盤燈號、市場廣度與資料狀態，避免只看局部訊號。</p>
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
          <p>觀察市場是否多數同步，或僅集中在少數標的。</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "risk" : "positive"}>
          <span>標的風險</span>
          <strong>{snapshot.riskScore}/100</strong>
          <p>若風險高於市場平均，應先檢查波動與資料時效。</p>
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
        <h2>資料來源與更新時間必須清楚，避免誤判</h2>
        <p>資料更新時間：{formatTaipeiTime(snapshot.lastUpdatedAt)}。目前為示範資料，正式資料接入後會顯示來源與延遲說明。</p>
      </div>
      <div className="risk-check-grid">
        <article className="watch">
          <span>資料分級</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>分級用來提醒資料完整性，不代表投資價值。</p>
        </article>
        <article className={missing.length ? "watch" : "pass"}>
          <span>資料提醒</span>
          <strong>{missing.length ? `${missing.length} 項` : "無"}</strong>
          <p>{missing.length ? missing.join("；") : "目前沒有額外資料提醒。"}</p>
        </article>
        <article className="watch">
          <span>使用邊界</span>
          <strong>觀察輔助</strong>
          <p>本頁不是交易訊號，也不承諾資料即時到秒。</p>
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
