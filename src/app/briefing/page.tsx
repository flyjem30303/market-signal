import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "市場簡報",
  description:
    "用 30 秒看懂市場氣氛，並用 3 分鐘確認風險、更新時間與下一步觀察重點。Phase 1 仍使用示範資料，不提供投資建議。"
};

export default async function BriefingPage() {
  const repository = getMarketSignalRepository();
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();
  const snapshots = repository
    .getAssets()
    .map((asset) => repository.getSnapshot(asset.symbol, "2026-05-28"))
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));

  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshots[0];
  const topRisk = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore)[0] ?? market;
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const breadth = buildMarketBreadth(snapshots);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="briefing_page_viewed" payload={{ page: "briefing" }} />

      <section className="hero briefing-public-summary" aria-label="市場簡報">
        <p className="eyebrow">市場快報</p>
        <h1>30 秒看懂市場燈號</h1>
        <p>
          先看市場燈號，再看風險分數與資料更新時間。這份簡報用來幫助一般投資者建立觀察順序，不提供買賣建議。
        </p>
        <p>
          目前 {market.asset.name} 為「{market.signal.title}」，綜合分數 {market.compositeScore}/100，
          風險分數 {market.riskScore}/100。請搭配資料狀態與風險聲明一起判讀。
        </p>
        <p className="runtime-boundary-line">
          Phase 1 仍以示範資料呈現；正式資料切換前，需完成資料品質、來源揭露、更新時間與回退檢查。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicDataSourceBoundaryNotice context="briefing" />

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

      <section className="briefing-grid" aria-label="市場重點">
        <article className="panel">
          <p className="eyebrow">市場廣度</p>
          <h2>偏強 {breadth.constructiveCount} 檔，風險偏高 {breadth.defensiveCount} 檔</h2>
          <p>
            如果強勢集中在少數標的，解讀信心應降低；如果風險分數同步上升，應優先檢查資料新鮮度與回退提示。
          </p>
        </article>

        <article className="panel">
          <p className="eyebrow">風險焦點</p>
          <h2>{topRisk.asset.name}</h2>
          <p>
            風險分數 {topRisk.riskScore}/100。這代表目前需要更多觀察，不代表一定下跌，也不是買賣指令。
          </p>
        </article>
      </section>

      <section className="panel" aria-label="下一步行動">
        <p className="eyebrow">下一步行動</p>
        <h2>先觀察，再複核，不把燈號當成買賣指令</h2>
        <p>
          若市場偏多但風險分數同步升高，優先確認資料更新時間、風險來源與資料邊界；若訊號分歧，先等待更多確認訊號。
        </p>
      </section>

      <section className="panel" aria-label="資料邊界">
        <p className="eyebrow">資料邊界</p>
        <h2>目前仍是公開 Beta 與示範資料</h2>
        <p>正式資料上線前，需通過來源、品質、更新時間、回退與公開文案檢查。</p>
      </section>

      <section className="panel" aria-label="觀察清單">
        <div className="section-heading">
          <p className="eyebrow">相對強勢</p>
          <h2>先看狀態，再看是否值得持續觀察</h2>
        </div>
        <div className="signal-list">
          {strongest.map((item) => (
            <article className="signal-row" key={item.asset.symbol}>
              <div>
                <strong>{item.asset.name}</strong>
                <span>{item.asset.symbol}</span>
              </div>
              <p>
                {item.signal.title}，綜合分數 {item.compositeScore}/100，風險分數 {item.riskScore}/100。
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
