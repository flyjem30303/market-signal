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
  title: "今日市場簡報",
  marketFlash: "每日市場晨報",
  description: "用 30 秒看懂市場燈號，用 3 分鐘整理市場氣氛與後續觀察重點。Phase 1 使用示範資料，不提供買賣建議。",
  hero: "30 秒看懂市場燈號",
  heroSub: "3 分鐘把市場燈號拆成原因：先看市場主燈號，再看今日警示清單、資料邊界與下一步觀察。",
  summary: "市場簡報",
  quick: "30 秒快速閱讀",
  score: "市場分數",
  risk: "風險觀察",
  structure: "核心指標",
  constructive: "偏多觀察",
  watch: "觀望整理",
  defensive: "警戒防守",
  next: "下一步觀察",
  nextTitle: "先複核警示清單，再確認資料來源與覆蓋率",
  boundary: "資料邊界",
  realDataNotEnabled: "正式資料尚未啟用",
  watchList: "今日警示清單",
  strongList: "強勢觀察清單",
  riskList: "風險觀察清單",
  marketWatch: "市場觀察",
  betaLoop: "公開 Beta 可用閉環"
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
          市場快報 / 市場晨報：{market.asset.name} 目前為「{market.signal.title}」，{copy.score} {market.compositeScore}/100，
          {copy.risk} {market.riskScore}/100。這是非投資建議，僅協助建立市場觀察順序。
        </p>
        <p className="runtime-boundary-line">
          {copy.boundary}：{copy.realDataNotEnabled}。Phase 1 仍以示範資料呈現，資料來源準備與覆蓋率仍需通過上線檢查。
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
        <BreadthCard label={copy.constructive} tone="active" value={breadth.constructive} />
        <BreadthCard label={copy.watch} tone="hold" value={breadth.watch} />
        <BreadthCard label={copy.defensive} tone="blocked" value={breadth.defensive} />
      </section>

      <section className="panel stock-reading-summary" aria-label={copy.next}>
        <p className="eyebrow">{copy.next}</p>
        <h2>{copy.nextTitle}</h2>
        <p>
          晨報快速判讀：30 秒看懂今日市場氣氛，3 分鐘再決定觀察順序。
        </p>
        <p>
          先看今日警示清單的影響級別，再確認資料更新時間、資料來源準備狀態，以及資料與風險邊界。若資料狀態仍是示範資料，
          就只把燈號當作閱讀流程範例，不作為交易依據。
        </p>
        <p>今日市場提醒與市場行動摘要：3 分鐘行動判斷完成前，本頁不提供買賣建議。下一步行動：{copy.betaLoop}</p>
      </section>

      <section className="weekly-grid" aria-label={copy.watchList}>
        <BriefingList
          description="分數較強的標的適合放入觀察清單，但仍需搭配資料邊界與風險分數一起看。"
          items={strongest}
          title={copy.strongList}
        />
        <BriefingList
          description="風險分數較高的標的需要提高複核頻率，避免只看單一燈號或單一分數。"
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

function BreadthCard({ label, tone, value }: { label: string; tone: "active" | "blocked" | "hold"; value: number }) {
  return (
    <article className={tone}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>依目前示範資料統計，用來快速了解市場氣氛分布；正式資料上線前仍需看資料狀態。</p>
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
