import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicBetaUsableLoopPanel } from "@/components/public-beta-usable-loop-panel";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";
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
          指數燈號把市場分數、風險分數與資料更新狀態整理成一頁摘要，讓使用者用 3 分鐘把市場燈號拆成原因，
          並先判斷目前是偏多、觀望、警戒或高風險。
        </p>
        <p className="runtime-boundary-line">
          資料與風險邊界：目前仍是公開 Beta 示範資料，正式資料尚未啟用，不提供投資建議，也不保證資料即時或完整。
        </p>
      </section>

      <section className="briefing-executive-summary" aria-label="30 秒市場摘要">
        <div>
          <p className="eyebrow">30 秒摘要</p>
          <h2>{market.signal.title}</h2>
          <p>
            {market.asset.name} 綜合分數 {market.compositeScore}/100，風險分數 {market.riskScore}/100。這代表目前應先確認
            趨勢是否延續、資金是否擴散，以及資料更新時間是否可信。
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
              {topRisk.asset.name}: {topRisk.riskScore >= 70 ? "高風險" : topRisk.riskScore >= 55 ? "需觀察" : "相對穩定"}
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
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${topRisk.asset.symbol}`}
            label="查看最高風險標的"
            payload={{ area: "briefing_summary", symbol: topRisk.asset.symbol }}
          >
            <span>查看最高風險標的</span>
            <strong>{topRisk.asset.name}</strong>
            <small>確認是否需要加強觀察</small>
          </TrackedLink>
        </nav>
      </section>

      <section className="briefing-breadth" id="market-structure" aria-label="市場結構">
        <BreadthCard label="偏多" tone="active" value={breadth.constructive} />
        <BreadthCard label="觀察" tone="hold" value={breadth.watch} />
        <BreadthCard label="防守" tone="blocked" value={breadth.defensive} />
      </section>

      <section className="briefing-playbook" id="briefing-playbook" aria-label="3 分鐘觀察流程">
        <p className="eyebrow">3 分鐘觀察流程</p>
        <h2>先判斷方向，再確認原因，最後決定是否提高風險意識</h2>
        <p>這份簡報不是買賣建議，而是把市場狀態整理成可追蹤的觀察順序。</p>
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

      <section className="panel stock-reading-summary" aria-label="市場觀察重點">
        <p className="eyebrow">觀察重點</p>
        <h2>燈號只是入口，真正要看的是原因與變化</h2>
        <div className="briefing-actions">
          <article>
            <strong>{topRisk.asset.name} 是目前最高風險觀察</strong>
            <p>
              風險分數 {topRisk.riskScore}/100。若後續風險持續升高，應先複核資料時間、趨勢與市場廣度，而不是只看單一分數。
            </p>
          </article>
          <article>
            <strong>資料仍在 Beta 邊界內</strong>
            <p>正式資料來源、覆蓋率與回補流程完成前，前台會明確標示示範資料，避免使用者誤判。</p>
          </article>
        </div>
      </section>

      <section className="weekly-grid">
        <BriefingList
          description="綜合分數較高的標的，代表目前示範模型中趨勢與品質相對穩定。"
          items={strongest}
          title="相對偏多"
          valueKey="composite"
        />
        <BriefingList
          description="風險分數較高的標的，適合放進觀察清單並等待更多資料確認。"
          items={[topRisk]}
          title="風險觀察"
          valueKey="risk"
        />
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicBetaDataReadinessStatus />
      <section className="panel briefing-public-reading-contract" aria-label="簡報閱讀說明">
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
      <p>目前符合此狀態的追蹤項目</p>
    </article>
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
      body: `${topRisk.asset.name} 風險分數 ${topRisk.riskScore}/100，是目前最需要追蹤的風險觀察點。`,
      step: "3",
      title: "標出風險"
    },
    {
      body: "若資料未更新或來源仍是示範資料，只能作為觀察輔助，不能當作投資建議。",
      step: "4",
      title: "確認資料邊界"
    }
  ];
}
