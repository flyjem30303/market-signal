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
  title: "市場快報",
  description:
    "用 30 秒看懂市場燈號、風險提示、資料更新時間與下一步觀察順序；目前為示範資料，不構成投資建議。"
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

      <section className="hero briefing-public-summary" aria-label="市場快報摘要">
        <p className="eyebrow">市場快報</p>
        <h1>30 秒看懂市場燈號，3 分鐘把市場燈號拆成原因</h1>
        <p>
          目前以 {market.asset.name} 作為台股市場輪廓參考，燈號為「{market.signal.title}」，
          市場分數 {market.compositeScore}/100，風險分數 {market.riskScore}/100。先看市場氣氛，
          再確認風險最高標的與資料更新時間。
        </p>
        <p className="runtime-boundary-line">
          資料與風險邊界：本頁仍使用示範資料與示範分數，正式資料尚未啟用；所有內容僅供市場資訊整理與風險辨識，不是投資建議。
        </p>
      </section>

      <section className="briefing-executive-summary" aria-label="市場快報重點">
        <div>
          <p className="eyebrow">30 秒重點</p>
          <h2>{market.signal.title}</h2>
          <p>{market.signal.text}</p>
        </div>
        <aside>
          <span>
            <b>市場分數</b>
            <i>{market.compositeScore}/100</i>
          </span>
          <span>
            <b>優先複核風險</b>
            <i>
              {topRisk.asset.name}: {topRisk.riskScore}/100
            </i>
          </span>
        </aside>
      </section>

      <section className="briefing-breadth" id="market-structure" aria-label="市場廣度">
        <BreadthCard label="偏多觀察" tone="active" value={breadth.constructive} />
        <BreadthCard label="觀望整理" tone="hold" value={breadth.watch} />
        <BreadthCard label="警戒防守" tone="blocked" value={breadth.defensive} />
      </section>

      <section className="panel stock-reading-summary" aria-label="三分鐘閱讀順序">
        <p className="eyebrow">下一步行動</p>
        <h2>先看市場，再看風險，最後確認資料狀態</h2>
        <div className="briefing-actions">
          <article>
            <strong>1. 看市場氣氛</strong>
            <p>用 TWII 與市場廣度判斷目前偏多、觀望或防守，不用單一分數做結論。</p>
          </article>
          <article>
            <strong>2. 看風險來源</strong>
            <p>優先檢查風險分數最高的標的，確認是市場共同風險，還是個別標的異常。</p>
          </article>
          <article>
            <strong>3. 看資料時間</strong>
            <p>確認資料更新時間與示範資料邊界；正式資料上線前，不把燈號當成交易訊號。</p>
          </article>
        </div>
      </section>

      <section className="weekly-grid" aria-label="市場觀察清單">
        <BriefingList
          description="市場分數較高的標的可作為觀察清單起點，但仍要回看成因、資料時間與風險分數。"
          items={strongest}
          title="相對強勢觀察"
        />
        <BriefingList
          description="風險分數較高的標的需要先複核資料狀態與主要風險，不適合直接延伸成買賣判斷。"
          items={[topRisk]}
          title="優先複核風險來源"
        />
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicDataSourceBoundaryNotice context="briefing" />
      <PublicNextReadingFlow context="briefing" stockSymbol={market.asset.symbol} />
    </main>
  );
}

function buildMarketBreadth(snapshots: SignalSnapshot[]) {
  return snapshots.reduce(
    (summary, snapshot) => {
      if (snapshot.riskScore >= 65) summary.defensive += 1;
      else if (snapshot.compositeScore >= 65) summary.constructive += 1;
      else summary.watch += 1;
      return summary;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
}

function BreadthCard({ label, tone, value }: { label: string; tone: "active" | "blocked" | "hold"; value: number }) {
  return (
    <article className={tone}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>依目前示範燈號統計的市場結構，請搭配資料時間與風險提示閱讀。</p>
    </article>
  );
}

function BriefingList({ description, items, title }: { description: string; items: SignalSnapshot[]; title: string }) {
  return (
    <section className="panel">
      <p className="eyebrow">市場觀察清單</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="stock-chip-list">
        {items.map((item) => (
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${item.asset.symbol}`}
            key={item.asset.symbol}
            label={`${item.asset.symbol} ${item.asset.name}`}
            payload={{ area: "briefing_list", symbol: item.asset.symbol }}
          >
            <strong>{item.asset.symbol}</strong>
            <span>{item.asset.name}</span>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
