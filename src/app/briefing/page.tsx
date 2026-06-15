import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
import { PublicBetaPublicStatusSurface } from "@/components/public-beta-public-status-surface";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicBetaUsableLoopPanel } from "@/components/public-beta-usable-loop-panel";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";
import { TwseOpenApiRuntimeMockWiringStatus } from "@/components/twse-openapi-runtime-mock-wiring-status";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "市場簡報",
  description: "用 30 秒看懂目前市場燈號、主要風險與下一步觀察方向。"
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
  const playbook = buildBriefingPlaybook(market, topRisk);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="briefing_page_viewed" payload={{ page: "briefing" }} />

      <section className="hero briefing-public-summary" aria-label="市場簡報摘要">
        <p className="eyebrow">市場簡報</p>
        <h1>30 秒看懂市場狀態，3 分鐘決定下一步觀察</h1>
        <p>
          指數燈號把市場分數、風險分數與資料更新狀態整理成一頁市場解讀，協助一般投資者先判斷目前是偏多、觀望、
          警戒或高風險。
        </p>
        <p className="runtime-boundary-line">
          目前仍為公開 Beta 示範資料；正式每日資料尚未啟用前，本頁只作為市場觀察流程示範，不提供投資建議。
        </p>
      </section>

      <PublicBetaPublicStatusSurface />

      <section className="panel stock-reading-summary" aria-label="市場簡報閱讀方式">
        <p className="eyebrow">閱讀方式</p>
        <h2>3 分鐘把市場燈號拆成原因</h2>
        <p>
          本頁先用燈號說明市場氣氛，再補上成因、風險與下一步觀察。正式資料尚未啟用前，所有數字都會維持示範資料標示，
          避免使用者把公開 Beta 誤認為正式即時訊號。
        </p>
      </section>

      <section className="panel stock-reading-summary" aria-label="每日市場晨報">
        <p className="eyebrow">每日市場晨報</p>
        <h2>先看市場氣氛，再看風險，最後確認資料與風險邊界</h2>
        <p>
          晨報快速判讀：先用 30 秒看懂今日市場氣氛，再用 3 分鐘再決定觀察順序。今日市場提醒先整理市場行動摘要，
          再用警示清單協助使用者判斷要關注、加強觀察或降低風險。
        </p>
        <div className="briefing-actions" aria-label="3 分鐘行動判斷">
          <article>
            <strong>3 分鐘行動判斷</strong>
            <p>
              {market.asset.name} 市場分數 {market.compositeScore}/100，風險分數 {market.riskScore}/100；先看氣氛，
              再看風險。
            </p>
          </article>
          <article>
            <strong>今日警示清單</strong>
            <p>
              {topRisk.asset.name} 風險分數 {topRisk.riskScore}/100；若風險升高，先複核資料時間與燈號原因。
            </p>
          </article>
          <article>
            <strong>下一步觀察</strong>
            <p>觀察市場狀態、複核警示原因、決定是否追蹤；不要把單一分數當成買賣訊號。</p>
          </article>
        </div>
      </section>

      <section className="briefing-executive-summary" aria-label="30 秒市場摘要">
        <div>
          <p className="eyebrow">30 秒摘要</p>
          <h2>{market.signal.title}</h2>
          <p>
            {market.asset.name} 綜合分數 {market.compositeScore}/100，風險分數 {market.riskScore}/100。請先確認趨勢是否延續、
            資金是否擴散，以及資料更新時間是否可信。
          </p>
        </div>
        <aside>
          <span>
            <b>市場主燈號</b>
            <i>
              {market.asset.name}: {market.compositeScore}/100
            </i>
          </span>
          <span>
            <b>最高風險觀察</b>
            <i>
              {topRisk.asset.name}: {topRisk.riskScore}/100
            </i>
          </span>
        </aside>
        <div className="briefing-runtime-action-strip">
          <DecisionPill title="先看燈號" body={`目前市場狀態：${market.signal.title}`} tone="active" />
          <DecisionPill title="再看原因" body="檢查趨勢、資金、廣度與資料時間" tone="hold" />
          <DecisionPill title="最後看風險" body="若風險升高，先降低單一訊號依賴" tone="blocked" />
        </div>
        <nav aria-label="市場簡報連結">
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${market.asset.symbol}`}
            label="查看市場主燈號"
            payload={{ area: "briefing_summary", symbol: market.asset.symbol }}
          >
            <span>查看市場主燈號</span>
            <strong>{market.asset.name}</strong>
            <small>看分數、風險與資料時間</small>
          </TrackedLink>
          <TrackedLink eventName="briefing_link_clicked" href="/" label="返回首頁" payload={{ area: "briefing_summary" }}>
            <span>返回首頁</span>
            <strong>全市場總覽</strong>
            <small>看核心指標與示範標的</small>
          </TrackedLink>
        </nav>
      </section>

      <section className="briefing-breadth" id="market-structure" aria-label="市場結構">
        <BreadthCard label="偏多" tone="active" value={breadth.constructive} />
        <BreadthCard label="觀察" tone="hold" value={breadth.watch} />
        <BreadthCard label="警戒" tone="blocked" value={breadth.defensive} />
      </section>

      <section className="panel stock-reading-summary" aria-label="市場觀察重點">
        <p className="eyebrow">觀察重點</p>
        <h2>燈號只是入口，真正要看的是原因與變化</h2>
        <div className="briefing-actions">
          {playbook.map((item) => (
            <article key={item.step}>
              <strong>
                {item.step}. {item.title}
              </strong>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="weekly-grid" aria-label="市場觀察清單">
        <BriefingList description="分數較高的示範標的，適合用來觀察偏多訊號是否集中。" items={strongest} title="相對偏多" />
        <BriefingList description="風險分數較高的標的，適合放進觀察清單並等待更多資料確認。" items={[topRisk]} title="風險觀察" />
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicBetaDataReadinessStatus />
      <TwseOpenApiRuntimeMockWiringStatus />

      <section className="panel stock-reading-summary" aria-label="閱讀說明">
        <p className="eyebrow">閱讀說明</p>
        <h2>這頁只回答三件事</h2>
        <p>現在市場大致偏多、觀望或警戒；造成燈號的主要原因；以及接下來最值得觀察的風險變化。</p>
        <p>所有分數都必須搭配資料更新時間與來源狀態閱讀，不能單獨作為投資決策依據。</p>
      </section>

      <PublicDataSourceBoundaryNotice context="briefing" />
      <PublicBetaSourceCoverageBridge context="briefing" stockSymbol={market.asset.symbol} />
      <PublicBetaUsableLoopPanel context="briefing" stockSymbol={market.asset.symbol} />
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

function buildBriefingPlaybook(market: SignalSnapshot, topRisk: SignalSnapshot) {
  return [
    {
      body: `${market.asset.name} 目前是「${market.signal.title}」，先把它當成市場氛圍入口。`,
      step: "1",
      title: "確認主燈號"
    },
    {
      body: "看趨勢、資金、廣度與資料時間是否一致，避免只看單一分數。",
      step: "2",
      title: "拆解原因"
    },
    {
      body: `${topRisk.asset.name} 是目前最高風險觀察，先確認風險是否集中。`,
      step: "3",
      title: "複核風險"
    },
    {
      body: "若資料未更新或來源仍是示範資料，只能作為觀察輔助，不能當作投資建議。",
      step: "4",
      title: "確認資料邊界"
    }
  ];
}

function BreadthCard({ label, tone, value }: { label: string; tone: "active" | "blocked" | "hold"; value: number }) {
  return (
    <article className={tone}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>示範標的數</p>
    </article>
  );
}

function BriefingList({ description, items, title }: { description: string; items: SignalSnapshot[]; title: string }) {
  return (
    <section className="panel">
      <p className="eyebrow">市場清單</p>
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

function DecisionPill({ body, title, tone }: { body: string; title: string; tone: "active" | "blocked" | "hold" }) {
  return (
    <article className={tone}>
      <strong>{title}</strong>
      <p>{body}</p>
    </article>
  );
}
