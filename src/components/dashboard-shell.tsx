"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CommercialSlot } from "@/components/commercial-slot";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PublicBetaMembershipMvpRoadmap } from "@/components/public-beta-membership-mvp-roadmap";
import { PublicBetaPublicStatusSurface } from "@/components/public-beta-public-status-surface";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
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
          指數燈號把市場資料整理成紅、黃、綠等狀態提示，讓一般投資者在 30 秒內看懂市場氛圍，並用 3 分鐘內判斷是否關注、加強觀察或降低風險。
          這是 30 秒可讀、3 分鐘可行動的公開閱讀流程。
        </p>
        <p className="runtime-boundary-line">正式市場資料尚未啟用；目前為示範資料與示範分數，不提供個股買賣建議。</p>
        <div className="hero-status-strip" aria-label="公開 Beta 快速重點">
          <span>30 秒內看懂市場氛圍</span>
          <span>3 分鐘內判斷</span>
          <span>警示提醒</span>
          <span>資料信任</span>
        </div>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicBetaPublicStatusSurface />
      <PublicBetaSourceCoverageBridge context={isStockPage ? "stock" : "home"} stockSymbol={selected.symbol} />
      <section className="panel stock-reading-summary" aria-label="三分鐘判斷順序">
        <p className="eyebrow">3 分鐘判斷順序</p>
        <h2>先看市場氣氛，再看資料品質，最後決定下一步觀察</h2>
        <p>
          下一步觀察：若燈號偏綠，先追蹤趨勢是否延續；若燈號偏黃，先等待資料確認；若燈號偏紅，先降低風險暴露。
          本頁不提供買賣建議，也不提供個股買賣建議；個股頁燈號不應直接視為個股買賣建議。
        </p>
      </section>

      {!isStockPage && (
        <>
          <HomeMarketOverview breadth={breadth} market={market} snapshot={snapshot} />
          <HomeCoreIndicatorReadout breadth={breadth} market={market} snapshot={snapshot} />
          <HomeDataReadinessStatus />
        </>
      )}

      {isStockPage && (
        <>
          <StockPublicSummary snapshot={snapshot} />
          <StockMarketContextPanel breadth={breadth} market={market} snapshot={snapshot} />
          <StockDataBoundaryPanel snapshot={snapshot} />
        </>
      )}

      <section className="stock-search-panel" aria-label="標的選擇">
        <div>
          <p className="eyebrow">分類</p>
          <h2>查看指數、ETF 與示範股票</h2>
          <p>這裡先保留少量示範標的，資料流程完成覆蓋率後再擴大到完整市場清單。</p>
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
      <PublicBetaMembershipMvpRoadmap />

      <section className="panel stock-reading-summary" aria-label="會員功能預覽">
        <p className="eyebrow">下一階段會員 MVP</p>
        <h2>會員功能預覽：理解燈號、追蹤變化、回看判斷</h2>
        <p>
          下一階段會把「看到燈號」延伸成「理解燈號」。會員 MVP 預計包含每日市場三層解讀、watchlist 與自訂警示條件、盤後複盤報告。
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

      <article className="disclaimer">
        <h2>不是投資建議</h2>
        <p>本站是市場資訊整理與風險辨識工具，不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。</p>
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
    <section className="home-public-beta-layers" aria-label="全市場總覽">
      <div className="home-public-beta-layer active">
        <span>全市場總覽</span>
        <strong>{market.signal.title}</strong>
        <p>{market.signal.text}</p>
      </div>
      <div className="home-public-beta-layer readying">
        <span>核心指標面板</span>
        <strong>{breadth.constructive}/{breadth.watch}/{breadth.defensive}</strong>
        <p>偏多、觀望、警戒項目會幫助使用者判斷市場廣度是否健康。</p>
      </div>
      <div className="home-public-beta-layer blocked">
        <span>警示清單</span>
        <strong>{snapshot.dataQualityGrade}</strong>
        <p>正式資料升級前檢查仍未完成，頁面維持示範資料邊界。</p>
      </div>
    </section>
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
  const items = [
    {
      action: "先看市場氣氛",
      body: market.signal.text,
      label: "核心指標快讀",
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
      body: "風險分數越高，越需要看資料狀態、波動與警示原因。",
      label: "風險熱度",
      tone: market.riskScore >= 55 ? "watch" : "constructive",
      value: `${market.riskScore}/100`
    },
    {
      action: "確認資料邊界",
      body: `更新時間：${formatTaipeiTime(snapshot.lastUpdatedAt)}。`,
      label: "資料可信度",
      tone: "watch",
      value: snapshot.dataQualityGrade
    }
  ];

  return (
    <section className="home-core-indicator-readout" aria-label="核心指標快讀">
      <div>
        <p className="eyebrow">核心指標快讀</p>
        <h2>30 秒看市場，3 分鐘行動判斷</h2>
        <p>先看燈號，再看風險與資料可信度，最後決定要關注、加強觀察或降低風險。</p>
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
      <p className="eyebrow">資料品質</p>
      <h2>目前資料可以怎麼使用</h2>
      <p>
        30 秒可用：先用示範燈號理解市場氣氛。3 分鐘要複核：再看資料狀態、來源可用條件、欄位與覆蓋率、回退與公開說明。
      </p>
      <p>正式資料升級前檢查仍在進行；目前內容不能當成買賣指令。</p>
    </section>
  );
}

function StockPublicSummary({ snapshot }: { snapshot: SignalSnapshot }) {
  const missing = snapshot.missingModuleFlags.length + snapshot.staleDataFlags.length;

  return (
    <section className="stock-indicator-priority" id="stock-public-summary" aria-label="標的快速判讀">
      <div>
        <p className="eyebrow">標的快速判讀</p>
        <h2>
          決策輔助摘要：30 秒快速閱讀：{snapshot.asset.symbol} {snapshot.asset.name}：{snapshot.signal.title}
        </h2>
        <p>30 秒快讀、30 秒看懂標的狀態：{snapshot.signal.text}</p>
      </div>
      <div className="stock-indicator-priority-grid">
        <article className="active">
          <span>30 秒可用</span>
          <strong>{snapshot.compositeScore}/100</strong>
          <p>用來快速看目前狀態，但仍需搭配資料狀態與風險分數。</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "blocked" : "hold"}>
          <span>影響級別</span>
          <strong>{snapshot.riskScore}/100</strong>
          <p>風險越高，越應保守閱讀並複核更新時間。</p>
        </article>
        <article className={missing ? "hold" : "active"}>
          <span>下一步觀察</span>
          <strong>{missing ? `${missing} 項提示` : "已揭露"}</strong>
          <p>正式資料尚未啟用，本頁仍是示範閱讀流程。</p>
        </article>
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
        <p className="eyebrow">市場脈絡</p>
        <h2>把單一標的放回市場脈絡</h2>
        <p>個股或 ETF 燈號需要搭配大盤、廣度與風險分數一起判讀，避免只看單一分數造成誤判。</p>
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
          <p>偏多、觀望、警戒的比例可用來判斷市場是否集中。</p>
        </article>
        <article className={snapshot.riskScore >= 60 ? "risk" : "positive"}>
          <span>標的風險</span>
          <strong>{snapshot.riskScore}/100</strong>
          <p>風險分數偏高時，先看警示原因與資料狀態。</p>
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
        <h2>正式資料尚未啟用，先用示範資料理解流程</h2>
        <p>資料時間：{formatTaipeiTime(snapshot.lastUpdatedAt)}。資料真實化與覆蓋率仍在資料流程推進，前台會清楚揭露示範資料狀態。</p>
      </div>
      <div className="risk-check-grid">
        <article className="watch">
          <span>資料狀態</span>
          <strong>{snapshot.dataQualityGrade}</strong>
          <p>3 分鐘要複核、3 分鐘複核風險：資料狀態會影響燈號信心，不應單獨作為交易依據。</p>
        </article>
        <article className={missing.length ? "watch" : "pass"}>
          <span>資料提示</span>
          <strong>{missing.length ? `${missing.length} 項` : "無"}</strong>
          <p>{missing.length ? missing.join("、") : "目前沒有額外缺漏提示。"}</p>
        </article>
        <article className="watch">
          <span>非投資建議</span>
          <strong>資訊整理</strong>
          <p>燈號只協助整理狀態，不提供個股買賣建議或保證報酬，不能當成個股買賣指令。</p>
        </article>
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
