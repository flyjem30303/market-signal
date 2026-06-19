import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { MarketWatchlistPanel } from "@/components/market-watchlist-panel";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalRuntime } from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "市場快報",
  description: "以台股市場燈號、風險分數、資料日期與引用來源整理目前市場狀態。"
};

const fallbackSnapshotDate = "2026-05-28";

export default async function BriefingPage() {
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime();
  const freshness = await getDataFreshnessSnapshot();
  const snapshotDate = repository.getSeries("TWII").at(-1)?.date ?? fallbackSnapshotDate;
  const snapshots = repository
    .getAssets()
    .map((asset) => repository.getSnapshot(asset.symbol, snapshotDate) ?? repository.getSeries(asset.symbol).at(-1))
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));

  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshots[0];
  const topRisk = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore)[0] ?? market;
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const breadth = buildMarketBreadth(snapshots);
  const sourceLabel =
    marketSignalSourceStatus.resolvedSource === "supabase"
      ? freshness.sourceName && freshness.sourceName !== "正式資料" && !freshness.sourceName.toLowerCase().includes("supabase")
        ? freshness.sourceName
        : "TWSE OpenAPI"
      : "示範資料";

  return (
    <main className="page-shell">
      <PageViewTracker eventName="briefing_page_viewed" payload={{ page: "briefing" }} />

      <section className="hero briefing-public-summary" aria-label="市場快報">
        <p className="eyebrow">市場快報</p>
        <h1>把市場燈號拆成原因、風險與下一步觀察</h1>
        <p>
          本頁整理台股市場燈號、風險分數、強弱排行與資料邊界。它適合用來建立今天的觀察順序，不提供個股買賣建議。
        </p>
        <p>
          目前 {market.asset.name} 為「{market.signal.title}」，綜合分數 {market.compositeScore}/100，風險分數{" "}
          {market.riskScore}/100。
        </p>
        <p className="runtime-boundary-line">
          引用來源：{sourceLabel}；燈號分數為模型計算結果。請搭配更新日期、方法說明與風險提示判讀。
        </p>
      </section>

      <DataFreshnessStrip
        fallbackAsOfDate={market.date}
        freshness={freshness}
        marketSignalSourceStatus={marketSignalSourceStatus}
      />

      <MarketWatchlistPanel snapshots={snapshots} />

      <section className="briefing-executive-summary" aria-label="市場摘要">
        <div>
          <p className="eyebrow">30 秒摘要</p>
          <h2>{market.signal.title}</h2>
          <p>{market.signal.text}</p>
        </div>
        <aside>
          <span>
            綜合分數 <strong>{market.compositeScore}</strong>/100
          </span>
          <span>
            風險分數 <strong>{market.riskScore}</strong>/100
          </span>
          <span>資料品質 {market.dataQualityGrade}</span>
        </aside>
      </section>

      <section className="briefing-grid" aria-label="市場觀察">
        <article className="panel">
          <p className="eyebrow">市場廣度</p>
          <h2>
            分數偏強 {breadth.constructiveCount} 檔，風險偏高 {breadth.defensiveCount} 檔
          </h2>
          <p>市場不是只看大盤漲跌。若強勢標的增加但風險也同步升高，代表需要更細緻地檢查追蹤清單。</p>
        </article>

        <article className="panel">
          <p className="eyebrow">風險焦點</p>
          <h2>{topRisk.asset.name}</h2>
          <p>
            目前風險分數較高的是 {topRisk.asset.name}，風險分數 {topRisk.riskScore}/100。請優先確認資料日期與自身承受度。
          </p>
        </article>
      </section>

      <section className="panel" aria-label="下一步閱讀">
        <p className="eyebrow">下一步閱讀</p>
        <h2>把市場快報轉成可檢查的標的清單</h2>
        <p>先看市場燈號，再比對強弱排行與風險焦點。若要追蹤單一標的，請進入標的頁查看分數、資料日期與風險提示。</p>
        <div className="briefing-actions">
          <TrackedLink eventName="briefing_link_clicked" href="/" label="回到市場總覽" payload={{ area: "briefing_next" }}>
            回到市場總覽
          </TrackedLink>
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${topRisk.asset.symbol}`}
            label="查看風險焦點"
            payload={{ area: "briefing_next", symbol: topRisk.asset.symbol }}
          >
            查看風險焦點
          </TrackedLink>
        </div>
      </section>

      <section className="panel" aria-label="強勢標的">
        <div className="section-heading">
          <p className="eyebrow">強勢標的</p>
          <h2>目前綜合分數較高的標的</h2>
        </div>
        <div className="signal-list">
          {strongest.map((item) => (
            <article className="signal-row" key={item.asset.symbol}>
              <div>
                <strong>{item.asset.name}</strong>
                <span>{item.asset.symbol}</span>
              </div>
              <p>
                {item.signal.title}，綜合 {item.compositeScore}/100，風險 {item.riskScore}/100。
              </p>
              <TrackedLink
                className="text-link"
                eventName="briefing_link_clicked"
                href={`/stocks/${item.asset.symbol}`}
                label={`查看 ${item.asset.symbol}`}
                payload={{ symbol: item.asset.symbol }}
              >
                查看標的
              </TrackedLink>
            </article>
          ))}
        </div>
      </section>

      <PublicNextReadingFlow context="briefing" stockSymbol={market.asset.symbol} />
    </main>
  );
}

function buildMarketBreadth(snapshots: SignalSnapshot[]) {
  return snapshots.reduce(
    (summary, snapshot) => {
      if (snapshot.compositeScore >= 70) summary.constructiveCount += 1;
      if (snapshot.riskScore >= 55) summary.defensiveCount += 1;
      return summary;
    },
    { constructiveCount: 0, defensiveCount: 0 }
  );
}
