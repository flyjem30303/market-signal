import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicDataSourceBoundaryNotice } from "@/components/public-data-source-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "市場晨報",
  description: "用 30 秒看懂市場狀態，再用 3 分鐘整理觀察重點與風險提示。"
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

      <section className="hero briefing-public-summary" aria-label="市場晨報">
        <p className="eyebrow">市場晨報</p>
        <h1>30 秒看懂市場狀態，3 分鐘整理觀察重點</h1>
        <p>
          這頁把市場燈號、主要風險、強弱清單、資料更新時間與下一步觀察放在一起，協助一般投資者快速建立今日市場脈絡。
        </p>
        <p className="runtime-boundary-line">
          正式資料尚未啟用，內容用來示範解讀流程；所有資訊都不構成投資建議。
        </p>
      </section>

      <section className="briefing-executive-summary" aria-label="30 秒摘要">
        <div>
          <p className="eyebrow">30 秒摘要</p>
          <h2>{market.signal.title}</h2>
          <p>
            {market.asset.name} 目前市場分數為 {market.compositeScore}/100，風險分數為 {market.riskScore}/100。
            先看整體市場氣氛，再看風險是否集中，最後確認資料更新狀態。
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
          <DecisionPill title="先看狀態" body="確認市場目前偏多、觀望或警戒。" tone="active" />
          <DecisionPill title="再看風險" body="查看風險是否集中在少數標的或正在擴散。" tone="hold" />
          <DecisionPill title="最後複核資料" body="確認更新時間、資料品質與正式資料是否已啟用。" tone="blocked" />
        </div>
        <nav aria-label="市場晨報延伸連結">
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${market.asset.symbol}`}
            label="查看市場核心標的"
            payload={{ area: "briefing_summary", symbol: market.asset.symbol }}
          >
            <span>查看市場核心標的</span>
            <strong>{market.asset.name}</strong>
            <small>看燈號、風險、資料品質與下一步觀察。</small>
          </TrackedLink>
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${topRisk.asset.symbol}`}
            label="查看主要風險"
            payload={{ area: "briefing_summary", symbol: topRisk.asset.symbol }}
          >
            <span>查看主要風險</span>
            <strong>{topRisk.asset.name}</strong>
            <small>複核風險分數是否需要提高觀察頻率。</small>
          </TrackedLink>
        </nav>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicDataSourceBoundaryNotice context="briefing" />
      <PublicBetaSourceCoverageBridge context="briefing" stockSymbol={market.asset.symbol} />

      <section className="briefing-breadth" id="market-structure" aria-label="市場廣度">
        <BreadthCard label="偏強" tone="active" value={breadth.constructive} />
        <BreadthCard label="觀望" tone="hold" value={breadth.watch} />
        <BreadthCard label="防守" tone="blocked" value={breadth.defensive} />
      </section>

      <section className="briefing-playbook" id="briefing-playbook" aria-label="3 分鐘觀察流程">
        <p className="eyebrow">3 分鐘觀察流程</p>
        <h2>從市場狀態、風險來源與資料邊界建立今日觀察順序</h2>
        <p>這不是買賣建議，而是把市場資訊整理成可追蹤、可複核的觀察流程。</p>
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

      <section className="panel stock-reading-summary" aria-label="警示清單">
        <p className="eyebrow">警示清單</p>
        <h2>今日優先複核的兩個提醒</h2>
        <div className="briefing-actions">
          <article>
            <strong>{topRisk.asset.name} 風險較高</strong>
            <p>風險分數 {topRisk.riskScore}/100，請先觀察風險是否連續升高或擴散到其他標的。</p>
          </article>
          <article>
            <strong>正式資料尚未啟用</strong>
            <p>請確認資料更新時間與資料邊界，不要把示範資料當成正式市場結論。</p>
          </article>
        </div>
      </section>

      <section className="weekly-grid">
        <BriefingList
          description="市場分數較高的標的，用來觀察強勢是否集中或擴散。"
          items={strongest}
          title="偏強觀察"
          valueKey="composite"
        />
        <BriefingList
          description="風險分數較高的標的，用來提醒哪些區塊需要提高警覺。"
          items={[topRisk]}
          title="風險觀察"
          valueKey="risk"
        />
      </section>

      <section className="panel stock-reading-summary" aria-label="資料使用提醒">
        <p className="eyebrow">資料使用提醒</p>
        <h2>資料異常或未更新時，請先複核來源與更新時間</h2>
        <p>
          市場晨報只提供市場資訊整理與風險辨識，不提供買賣建議。正式資料上線前，本頁會明確標示示範資料與資料限制。
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
      body: `${market.asset.name} 目前是「${market.signal.title}」，先確認它是否代表整體市場氣氛。`,
      step: "1",
      title: "確認市場狀態"
    },
    {
      body: `${topRisk.asset.name} 風險分數為 ${topRisk.riskScore}/100，觀察風險是否集中或正在擴散。`,
      step: "2",
      title: "查看主要風險"
    },
    {
      body: "確認資料更新時間、資料品質與正式資料狀態，避免把示範資料當成正式結論。",
      step: "3",
      title: "複核資料邊界"
    }
  ];
}
