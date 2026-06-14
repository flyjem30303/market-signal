import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "市場解讀",
  description: "用 3 分鐘拆解市場燈號、成因、風險與下一步觀察方向。"
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

      <section className="hero briefing-public-summary" aria-label="市場解讀摘要">
        <p className="eyebrow">指數狀態儀表站</p>
        <h1>3 分鐘把市場燈號拆成原因、風險與下一步</h1>
        <p>
          這頁把首頁的 30 秒快讀延伸成完整複核流程：先確認市場狀態，再看成因與影響級別，
          最後檢查資料邊界與警示清單。
        </p>
        <p className="runtime-boundary-line">
          目前為公開測試示範資料，正式每日資料尚未啟用；本頁只做資訊整理與風險辨識，不是投資建議。
        </p>
      </section>

      <section className="briefing-executive-summary" aria-label="30 秒摘要">
        <div>
          <p className="eyebrow">30 秒摘要</p>
          <h2>{market.signal.title}</h2>
          <p>
            {market.asset.name} 市場分數為 {market.compositeScore}/100，風險熱度為 {market.riskScore}/100。
            先用燈號掌握氛圍，再用市場廣度與資料時間做 3 分鐘複核。
          </p>
        </div>
        <aside>
          <span>
            <b>市場分數</b>
            <i>
              {market.asset.name}: {market.compositeScore}/100
            </i>
          </span>
          <span>
            <b>主要風險</b>
            <i>
              {topRisk.asset.name}: {topRisk.riskScore}/100
            </i>
          </span>
        </aside>
        <div className="briefing-runtime-action-strip">
          <DecisionPill title="成因" body="由趨勢、估值、廣度、資金與總體風險共同形成。" tone="active" />
          <DecisionPill title="影響級別" body="風險熱度越高，越需要降低單一訊號依賴。" tone="hold" />
          <DecisionPill title="資料邊界" body="正式資料尚未啟用，資料時間與來源限制必須清楚顯示。" tone="blocked" />
        </div>
        <nav aria-label="市場解讀行動">
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${market.asset.symbol}`}
            label="查看核心指數"
            payload={{ area: "briefing_summary", symbol: market.asset.symbol }}
          >
            <span>查看核心指數</span>
            <strong>{market.asset.name}</strong>
            <small>回到標的頁確認燈號狀態</small>
          </TrackedLink>
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${topRisk.asset.symbol}`}
            label="查看主要風險"
            payload={{ area: "briefing_summary", symbol: topRisk.asset.symbol }}
          >
            <span>查看主要風險</span>
            <strong>{topRisk.asset.name}</strong>
            <small>檢查風險熱度與下一步觀察</small>
          </TrackedLink>
        </nav>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="briefing-breadth" id="market-structure" aria-label="市場廣度">
        <BreadthCard label="偏強" tone="active" value={breadth.constructive} />
        <BreadthCard label="觀望" tone="hold" value={breadth.watch} />
        <BreadthCard label="防守" tone="blocked" value={breadth.defensive} />
      </section>

      <section className="briefing-playbook" id="briefing-playbook" aria-label="3 分鐘複核">
        <p className="eyebrow">3 分鐘複核</p>
        <h2>把燈號變成可執行的觀察流程</h2>
        <p>先看市場狀態，再看警示清單，最後確認資料邊界；不要只因單一分數做判斷。</p>
        <div className="playbook-grid">
          {playbook.map((item) => (
            <article className="playbook-card" key={item.title}>
              <span>{item.step}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="weekly-grid">
        <BriefingList
          description="市場分數較高的標的，適合用來複核趨勢是否延續。"
          items={strongest}
          title="強勢觀察"
          valueKey="composite"
        />
        <BriefingList
          description="風險分數較高的標的，適合加入警示清單並檢查是否需要降低風險。"
          items={[topRisk]}
          title="警示清單"
          valueKey="risk"
        />
      </section>

      <section className="panel stock-reading-summary" aria-label="資料與風險邊界">
        <p className="eyebrow">資料與風險邊界</p>
        <h2>資料來源、更新時間與正式資料狀態必須清楚顯示</h2>
        <p>
          上線前仍需完成合法可自動化資料源、欄位合約、覆蓋率、錯誤回退與讀取檢查。
          若資料異常或未更新，前台必須明確提示，避免使用者誤判。
        </p>
      </section>
    </main>
  );
}

function DecisionPill({ body, title, tone }: { body: string; title: string; tone: "active" | "hold" | "blocked" }) {
  return (
    <article className={`decision-pill ${tone}`}>
      <strong>{title}</strong>
      <span>{body}</span>
    </article>
  );
}

function BriefingList({
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
            eventName="briefing_link_clicked"
            href={`/stocks/${item.asset.symbol}`}
            key={item.asset.id}
            label={`${item.asset.symbol} ${item.asset.name}`}
            payload={{ area: title, symbol: item.asset.symbol }}
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

function buildMarketBreadth(snapshots: SignalSnapshot[]) {
  return snapshots.reduce(
    (summary, snapshot) => {
      if (snapshot.compositeScore >= 70) summary.constructive += 1;
      else if (snapshot.riskScore >= 60 || snapshot.compositeScore < 45) summary.defensive += 1;
      else summary.watch += 1;
      return summary;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
}

function BreadthCard({
  label,
  tone,
  value
}: {
  label: string;
  tone: "active" | "hold" | "blocked";
  value: number;
}) {
  return (
    <article className={`breadth-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>觀察標的</p>
    </article>
  );
}

function buildBriefingPlaybook(market: SignalSnapshot, topRisk: SignalSnapshot) {
  return [
    {
      body: `${market.asset.name} 目前為「${market.signal.title}」，先確認這是否符合你的觀察假設。`,
      step: "1",
      title: "確認市場狀態"
    },
    {
      body: `${topRisk.asset.name} 風險熱度為 ${topRisk.riskScore}/100，檢查是否需要降低風險或等待確認。`,
      step: "2",
      title: "查看警示清單"
    },
    {
      body: "確認正式資料是否啟用、資料時間是否可接受，以及頁面是否有清楚的非投資建議提示。",
      step: "3",
      title: "檢查資料邊界"
    }
  ];
}
