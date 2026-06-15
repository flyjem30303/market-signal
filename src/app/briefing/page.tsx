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
  description: "用 30 秒看懂市場狀態，3 分鐘依序檢查成因、影響級別、資料更新時間與非投資建議邊界。"
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

      <section className="hero briefing-public-summary" aria-label="每日市場簡報">
        <p className="eyebrow">每日市場簡報</p>
        <h1>30 秒看懂市場燈號，3 分鐘完成判斷順序</h1>
        <p>
          這頁把市場狀態、成因、影響級別、資料更新時間與下一步觀察放在同一條閱讀路徑，讓一般投資者不用在多個資料網站之間來回比對。
        </p>
        <p className="runtime-boundary-line">
          目前為公開 Beta 模擬資料；正式資料上線前不宣稱即時真實資料，也不應直接視為個股買賣建議。
        </p>
      </section>

      <section className="briefing-executive-summary" aria-label="30 秒快讀">
        <div>
          <p className="eyebrow">30 秒市場狀態</p>
          <h2>{market.signal.title}</h2>
          <p>
            {market.asset.name} 綜合分數 {market.compositeScore}/100，風險分數 {market.riskScore}/100。成因主要來自趨勢、
            資金、評價與總體風險的合併判斷。
          </p>
        </div>
        <aside>
          <span>
            <b>市場燈號</b>
            <i>
              {market.asset.name}: {market.compositeScore}/100
            </i>
          </span>
          <span>
            <b>最高影響級別</b>
            <i>
              {topRisk.asset.name}: {topRisk.riskScore >= 70 ? "高" : topRisk.riskScore >= 55 ? "中" : "低"}
            </i>
          </span>
        </aside>
        <div className="briefing-runtime-action-strip">
          <DecisionPill title="狀態" body={`目前為 ${market.signal.title}`} tone="active" />
          <DecisionPill title="成因" body="趨勢、資金、評價與風險合併判斷" tone="hold" />
          <DecisionPill title="影響級別" body="風險升高時先降低誤判機率" tone="blocked" />
        </div>
        <nav aria-label="簡報下一步">
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${market.asset.symbol}`}
            label="查看市場指數詳情"
            payload={{ area: "briefing_summary", symbol: market.asset.symbol }}
          >
            <span>查看市場指數詳情</span>
            <strong>{market.asset.name}</strong>
            <small>看狀態、成因、影響級別與資料更新時間。</small>
          </TrackedLink>
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${topRisk.asset.symbol}`}
            label="查看高風險標的"
            payload={{ area: "briefing_summary", symbol: topRisk.asset.symbol }}
          >
            <span>查看高風險標的</span>
            <strong>{topRisk.asset.name}</strong>
            <small>複核是否需要加強觀察或降低風險。</small>
          </TrackedLink>
        </nav>
      </section>

      <section className="briefing-breadth" id="market-structure" aria-label="市場廣度">
        <BreadthCard label="偏多" tone="active" value={breadth.constructive} />
        <BreadthCard label="觀望" tone="hold" value={breadth.watch} />
        <BreadthCard label="防守" tone="blocked" value={breadth.defensive} />
      </section>

      <section className="briefing-playbook" id="briefing-playbook" aria-label="3 分鐘判斷順序">
        <p className="eyebrow">3 分鐘判斷順序</p>
        <h2>先看狀態，再看成因與影響級別，最後確認資料更新時間</h2>
        <p>這個順序的目標是降低資訊雜訊，協助使用者把市場觀察變成固定流程。</p>
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

      <section className="panel stock-reading-summary" aria-label="重點提醒">
        <p className="eyebrow">重點提醒</p>
        <h2>目前公開版先提供可理解的市場狀態，不提供買賣結論</h2>
        <div className="briefing-actions">
          <article>
            <strong>{topRisk.asset.name} 影響級別較高</strong>
            <p>風險分數 {topRisk.riskScore}/100，適合加強觀察資料更新時間、族群擴散與風險分數變化。</p>
          </article>
          <article>
            <strong>資料上線仍在進行</strong>
            <p>正式資料需完成來源權利、欄位合約、寫入回讀、回滾與正式切換條件，才會切換前台來源。</p>
          </article>
        </div>
      </section>

      <section className="weekly-grid">
        <BriefingList
          description="綜合分數較高的標的，適合進一步查看成因與資料品質。"
          items={strongest}
          title="相對偏多"
          valueKey="composite"
        />
        <BriefingList
          description="風險分數較高的標的，適合檢查是否需要加強觀察或降低曝險。"
          items={[topRisk]}
          title="風險較高"
          valueKey="risk"
        />
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicBetaDataReadinessStatus />
      <section className="panel briefing-public-reading-contract" aria-label="市場解讀與資料邊界">
        <p className="eyebrow">市場解讀</p>
        <h2>3 分鐘把市場燈號拆成原因</h2>
        <p>
          這頁協助使用者把主燈號、風險提示與後續觀察重點放在同一個脈絡中閱讀。
        </p>
        <p>
          資料與風險邊界：正式資料尚未啟用前，內容仍以示範資料呈現，不提供個股買賣建議。
        </p>
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
      <p>市場廣度分類</p>
    </article>
  );
}

function buildBriefingPlaybook(market: SignalSnapshot, topRisk: SignalSnapshot) {
  return [
    {
      body: `${market.asset.name} 目前為「${market.signal.title}」，先確認市場是偏多、觀望、警戒或高風險。`,
      step: "1",
      title: "看市場狀態"
    },
    {
      body: "成因來自趨勢、資金、評價、市場廣度與總體風險，不用單一數字做結論。",
      step: "2",
      title: "看成因"
    },
    {
      body: `${topRisk.asset.name} 目前風險分數 ${topRisk.riskScore}/100，影響級別升高時先複核曝險與資料時間。`,
      step: "3",
      title: "看影響級別"
    },
    {
      body: "最後確認資料更新時間、展示資料與正式資料邊界，以及非投資建議聲明，避免把流程展示當成交易訊號。",
      step: "4",
      title: "看資料邊界"
    }
  ];
}
