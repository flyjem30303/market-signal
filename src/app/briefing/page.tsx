import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
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
  title: "每日市場晨報",
  description: "用 30 秒看市場氣氛，再用 3 分鐘複核風險、資料時間與下一步觀察。"
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

      <section className="hero briefing-public-summary" aria-label="每日市場晨報">
        <p className="eyebrow">每日市場晨報</p>
        <h1>30 秒看市場氣氛，3 分鐘複核今日風險</h1>
        <p>
          晨報把市場狀態、警示清單、資料時間與下一步觀察放在同一個閱讀流程，協助一般投資者快速建立今日觀察重點。
        </p>
        <p className="runtime-boundary-line">
          正式資料尚未切換；目前頁面以示範資料呈現閱讀流程，不提供買進、賣出、持有或個人化投資建議。
        </p>
      </section>

      <section className="briefing-executive-summary" aria-label="30 秒快讀">
        <div>
          <p className="eyebrow">30 秒快讀</p>
          <h2>{market.signal.title}</h2>
          <p>
            {market.asset.name} 目前燈號分數為 {market.compositeScore}/100，風險熱度為 {market.riskScore}/100。
            先把它當成市場氣氛摘要，再往下複核風險與資料邊界。
          </p>
        </div>
        <aside>
          <span>
            <b>市場狀態</b>
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
          <DecisionPill title="先看狀態" body="確認市場目前偏多、觀望或偏警戒。" tone="active" />
          <DecisionPill title="再看風險" body="複核風險熱度是否集中在少數標的。" tone="hold" />
          <DecisionPill title="最後看資料" body="確認資料時間、來源狀態與缺口提示。" tone="blocked" />
        </div>
        <nav aria-label="晨報下一步">
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${market.asset.symbol}`}
            label="查看市場代表標的"
            payload={{ area: "briefing_summary", symbol: market.asset.symbol }}
          >
            <span>查看市場代表標的</span>
            <strong>{market.asset.name}</strong>
            <small>回到標的頁複核燈號狀態、風險與資料時間。</small>
          </TrackedLink>
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${topRisk.asset.symbol}`}
            label="查看主要風險標的"
            payload={{ area: "briefing_summary", symbol: topRisk.asset.symbol }}
          >
            <span>查看主要風險標的</span>
            <strong>{topRisk.asset.name}</strong>
            <small>複核風險熱度是否需要加強觀察。</small>
          </TrackedLink>
        </nav>
      </section>

      <section className="briefing-breadth" id="market-structure" aria-label="市場廣度">
        <BreadthCard label="偏強" tone="active" value={breadth.constructive} />
        <BreadthCard label="觀望" tone="hold" value={breadth.watch} />
        <BreadthCard label="防守" tone="blocked" value={breadth.defensive} />
      </section>

      <section className="briefing-playbook" id="briefing-playbook" aria-label="3 分鐘複核流程">
        <p className="eyebrow">3 分鐘複核流程</p>
        <h2>用狀態、風險、資料邊界整理今日觀察順序</h2>
        <p>晨報不是買賣建議，而是協助使用者用固定流程確認市場是否值得關注、加強觀察或等待更多資料。</p>
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

      <section className="panel stock-reading-summary" aria-label="今日警示清單">
        <p className="eyebrow">今日警示清單</p>
        <h2>先看最高風險標的，再確認資料是否適合解讀</h2>
        <div className="briefing-actions">
          <article>
            <strong>{topRisk.asset.name} 風險較高</strong>
            <p>風險熱度 {topRisk.riskScore}/100，建議複核是否由資料延遲、集中弱勢或市場背景造成。</p>
          </article>
          <article>
            <strong>正式資料尚未啟用</strong>
            <p>若資料時間延遲或來源狀態未確認，請先暫緩解讀，等待下一次資料更新或 gate 通過。</p>
          </article>
        </div>
      </section>

      <section className="weekly-grid">
        <BriefingList
          description="燈號分數較高的標的，用來觀察市場強勢來源。"
          items={strongest}
          title="偏強觀察"
          valueKey="composite"
        />
        <BriefingList
          description="風險熱度較高的標的，用來複核今日是否需要加強觀察。"
          items={[topRisk]}
          title="風險觀察"
          valueKey="risk"
        />
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
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
      <p>觀察標的</p>
    </article>
  );
}

function buildBriefingPlaybook(market: SignalSnapshot, topRisk: SignalSnapshot) {
  return [
    {
      body: `${market.asset.name} 目前為「${market.signal.title}」，先確認這個狀態是否與市場廣度一致。`,
      step: "1",
      title: "確認市場狀態"
    },
    {
      body: `${topRisk.asset.name} 風險熱度為 ${topRisk.riskScore}/100，複核是否需要加強觀察。`,
      step: "2",
      title: "查看主要風險"
    },
    {
      body: "確認資料時間、來源狀態與缺口提示；正式資料未啟用時，請降低對分數的解讀信心。",
      step: "3",
      title: "複核資料邊界"
    }
  ];
}
