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

const copy = {
  boundary: "資料邊界",
  constructive: "偏多觀察",
  defensive: "風險警戒",
  description:
    "用 30 秒看懂市場燈號，用 3 分鐘整理市場氣氛與後續觀察重點。Phase 1 使用示範資料，不提供買賣建議。",
  hero: "30 秒看懂市場燈號",
  heroSub:
    "把大盤燈號、風險分數與觀察清單放在同一頁，協助一般投資者快速判斷今天應該關注、等待或降低風險。",
  marketFlash: "市場快報",
  marketWatch: "市場觀察",
  next: "下一步行動",
  nextTitle: "先看市場氣氛，再看原因與風險",
  quick: "30 秒摘要",
  realDataNotEnabled: "正式每日資料尚未啟用",
  risk: "風險分數",
  riskList: "風險較高標的",
  score: "市場分數",
  strongList: "強勢觀察標的",
  structure: "市場結構",
  summary: "市場簡報摘要",
  title: "指數燈號市場簡報",
  watch: "等待確認",
  watchList: "觀察標的"
};

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description
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

      <section className="hero briefing-public-summary" aria-label={copy.title}>
        <p className="eyebrow">{copy.marketFlash}</p>
        <h1>{copy.hero}</h1>
        <p>{copy.heroSub}</p>
        <p>
          目前代表市場為 {market.asset.name}，燈號為「{market.signal.title}」；
          {copy.score} {market.compositeScore}/100，{copy.risk} {market.riskScore}/100。請把它視為市場氣氛摘要，
          不是個別標的買賣建議。
        </p>
        <p className="runtime-boundary-line">
          {copy.boundary}：{copy.realDataNotEnabled}。Phase 1 仍以示範資料呈現，真實資料上線前仍需完成合法來源、
          資料品質、寫入回讀、回復方案與正式切換檢查。
        </p>
      </section>

      <section className="briefing-executive-summary" aria-label={copy.summary}>
        <div>
          <p className="eyebrow">{copy.quick}</p>
          <h2>{market.signal.title}</h2>
          <p>{market.signal.text}</p>
        </div>
        <aside>
          <span>
            <b>{copy.score}</b>
            <i>{market.compositeScore}/100</i>
          </span>
          <span>
            <b>{copy.risk}</b>
            <i>
              {topRisk.asset.name}: {topRisk.riskScore}/100
            </i>
          </span>
        </aside>
      </section>

      <section className="briefing-breadth" id="market-structure" aria-label={copy.structure}>
        <BreadthCard
          description="市場分數較高、風險尚未明顯升高的標的數量。適合列入觀察，但仍需搭配資料更新時間。"
          label={copy.constructive}
          tone="active"
          value={breadth.constructive}
        />
        <BreadthCard
          description="分數與風險沒有明顯方向的標的數量。適合等待更多訊號，不急著下判斷。"
          label={copy.watch}
          tone="hold"
          value={breadth.watch}
        />
        <BreadthCard
          description="風險分數較高的標的數量。適合優先檢查原因、降低過度解讀單一燈號的風險。"
          label={copy.defensive}
          tone="blocked"
          value={breadth.defensive}
        />
      </section>

      <section className="panel stock-reading-summary" aria-label={copy.next}>
        <p className="eyebrow">{copy.next}</p>
        <h2>{copy.nextTitle}</h2>
        <p>
          第一層先看市場燈號與分數，確認今天偏向積極、觀望或警戒。第二層再看風險分數與標的分布，
          避免只因單一數字就做出過度判斷。
        </p>
        <p>
          若市場分數上升但風險也同步升高，代表需要加強觀察而不是直接追價；若市場分數下降且風險擴大，
          則應先檢查部位風險與資料更新時間。
        </p>
        <p>Phase 1 的任務是讓使用者建立固定閱讀流程：先看狀態，再看原因，最後決定下一步觀察重點。</p>
      </section>

      <section className="weekly-grid" aria-label={copy.watchList}>
        <BriefingList
          description="這些標的在示範資料中市場分數較高，可作為觀察市場強弱的參考入口。"
          items={strongest}
          title={copy.strongList}
        />
        <BriefingList
          description="這些標的在示範資料中風險分數較高，適合優先檢查燈號原因與資料狀態。"
          items={[topRisk]}
          title={copy.riskList}
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

function BreadthCard({
  description,
  label,
  tone,
  value
}: {
  description: string;
  label: string;
  tone: "active" | "blocked" | "hold";
  value: number;
}) {
  return (
    <article className={tone}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{description}</p>
    </article>
  );
}

function BriefingList({ description, items, title }: { description: string; items: SignalSnapshot[]; title: string }) {
  return (
    <section className="panel">
      <p className="eyebrow">{copy.marketWatch}</p>
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
