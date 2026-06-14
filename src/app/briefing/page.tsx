import type { Metadata } from "next";
import { BriefingPublicDecisionSummaryPanel } from "@/components/briefing-public-decision-summary-panel";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
import { PublicBetaMembershipMvpRoadmap } from "@/components/public-beta-membership-mvp-roadmap";
import { PublicBetaPublicStatusSurface } from "@/components/public-beta-public-status-surface";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { buildBriefingMarketActionSummary } from "@/lib/briefing-market-action-summary";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "每日市場晨報",
  description: "用 30 秒看懂今日市場氣氛，並在 3 分鐘內完成關注、加強觀察或降低風險的行動判斷。"
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
  const concentration = buildConcentrationSignal(snapshots);
  const marketActionSummary = buildBriefingMarketActionSummary(market, topRisk, breadth);
  const playbook = buildBriefingPlaybook(market, topRisk);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="briefing_page_viewed" payload={{ page: "briefing" }} />

      <BriefingPublicDecisionSummaryPanel breadth={breadth} market={market} topRisk={topRisk} />

      <section className="briefing-market-action-summary" aria-label="市場行動判斷">
        <div>
          <p className="eyebrow">市場行動摘要：市場行動判斷</p>
          <h2>{marketActionSummary.headline}</h2>
          <p>3 分鐘判斷順序：先確認市場主燈號，再看風險最高標的成因與資料狀態。</p>
          <p>{marketActionSummary.marketLine}</p>
          <p>{marketActionSummary.stopLine}</p>
        </div>
        <TrackedLink
          className={marketActionSummary.primary.tone}
          eventName="briefing_link_clicked"
          href={marketActionSummary.primary.href}
          label={marketActionSummary.primary.label}
          payload={{ area: "briefing_market_action_primary", symbol: marketActionSummary.primary.symbol }}
        >
          <span>{marketActionSummary.primary.label}</span>
          <strong>{marketActionSummary.primary.title}</strong>
          <p>{marketActionSummary.primary.body}</p>
        </TrackedLink>
        <TrackedLink
          className={marketActionSummary.secondary.tone}
          eventName="briefing_link_clicked"
          href={marketActionSummary.secondary.href}
          label={marketActionSummary.secondary.label}
          payload={{ area: "briefing_market_action_secondary", symbol: marketActionSummary.secondary.symbol }}
        >
          <span>{marketActionSummary.secondary.label}</span>
          <strong>{marketActionSummary.secondary.title}</strong>
          <p>{marketActionSummary.secondary.body}</p>
        </TrackedLink>
      </section>

      <section className="home-public-beta-layers briefing-alert-decision-list" aria-label="今日提醒與核心指標">
        <div className="home-public-beta-layer alerts">
          <span>今日提醒</span>
          <strong>先看市場主燈號，再看風險最高標的</strong>
          <p>
            這個頁面把市場氣氛、風險來源與資料狀態排成閱讀順序，讓使用者不用先理解所有指標，也能做出今天的觀察判斷。
          </p>
        </div>
        <div className="home-public-beta-alert-list">
          <BriefingCard
            href={`/stocks/${market.asset.symbol}`}
            text={`${market.asset.name} 是目前市場主燈號，用來判斷今天的市場背景。`}
            title="偏強觀察"
            value={`${market.compositeScore}/100`}
          />
          <BriefingCard
            href={`/stocks/${topRisk.asset.symbol}`}
            text={`${topRisk.asset.name} 風險分數最高，適合作為加強觀察清單的第一個標的。`}
            title="下一步觀察"
            value={`${topRisk.riskScore}/100`}
          />
          <BriefingCard
            href="/methodology"
            text="目前使用示範資料與示範分數；正式資料尚未啟用，燈號只用於閱讀流程展示。"
            title="使用提醒"
            value="示範資料"
          />
        </div>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicBetaDataReadinessStatus />
      <PublicBetaPublicStatusSurface />
      <PublicBetaSourceCoverageBridge context="briefing" />

      <BriefingExecutiveSummary market={market} topRisk={topRisk} breadth={breadth} />

      <section className="panel briefing-boundary" id="model-boundary" aria-label="Model Boundary">
        <div>
          <p className="eyebrow">Model Boundary</p>
          <h2>目前是示範資料，不是正式市場資料</h2>
          <p>
            本頁提供資訊整理與風險辨識輔助；目前是 mock runtime，不是正式市場資料。資料覆蓋仍屬 partial coverage，
            若發生 missing/delayed data，前台必須清楚揭露，不應把燈號當成交易指令。
          </p>
          <p>正式資料尚未上線；不提供買賣建議、不保證報酬，也不代替使用者做投資決策。</p>
        </div>
        <div className="briefing-boundary-grid">
          <article>
            <span>資料來源</span>
            <strong>示範資料</strong>
          </article>
          <article>
            <span>分數來源</span>
            <strong>示範分數</strong>
          </article>
          <article>
            <span>使用方式</span>
            <strong>觀察與風險辨識</strong>
          </article>
        </div>
      </section>

      <nav className="briefing-compass" aria-label="Briefing Compass">
        <a href="#model-boundary">model-boundary</a>
        <a href="#market-structure">market-structure</a>
        <a href="#briefing-playbook">briefing-playbook</a>
        <a href="/membership">自選追蹤</a>
      </nav>

      <section className="briefing-breadth" id="market-structure" aria-label="Market Breadth">
        <BreadthCard label="偏建設性" value={breadth.constructive} tone="active" />
        <BreadthCard label="需要觀察" value={breadth.watch} tone="hold" />
        <BreadthCard label="偏防守" value={breadth.defensive} tone="blocked" />
      </section>

      <ConcentrationPanel concentration={concentration} />

      <section className="briefing-playbook" id="briefing-playbook" aria-label="Briefing Playbook">
        <p className="eyebrow">Briefing Playbook</p>
        <h2>三步驟閱讀市場訊號</h2>
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
          description="綜合分數較高的標的，適合用來確認市場是否仍有建設性支撐。"
          items={strongest}
          title="相對強勢觀察"
          valueKey="composite"
        />
        <BriefingList
          description="風險分數較高的標的，適合放在加強觀察清單中。"
          items={[topRisk]}
          title="風險觀察"
          valueKey="risk"
        />
      </section>

      <PublicNextReadingFlow context="briefing" stockSymbol={market.asset.symbol} />

      <section className="panel stock-reading-summary" aria-label="下一階段會員功能">
        <p className="eyebrow">下一階段會員功能</p>
        <h2>會員內容會把看到燈號延伸成理解燈號與追蹤變化</h2>
        <p>
          會員下一階段才會開放會員登入、每日市場三層解讀、自選追蹤、自訂警示與盤後複盤。目前公開頁只先展示會員
          MVP 路線，避免會員架構拖慢公開 Beta 上線。
        </p>
      </section>
      <PublicBetaMembershipMvpRoadmap />

      <article className="disclaimer">
        <h2>風險聲明</h2>
        <p>本網站是市場資訊整理與風險辨識輔助工具，不提供個股買賣建議，也不保證任何投資結果。</p>
      </article>
    </main>
  );
}

function BriefingExecutiveSummary({
  breadth,
  market,
  topRisk
}: {
  breadth: { constructive: number; defensive: number; watch: number };
  market: SignalSnapshot;
  topRisk: SignalSnapshot;
}) {
  // Guard source markers for local checks only: mock-only, publicDataSource=mock, scoreSource=mock, mock composite, mock risk.
  return (
    <section className="briefing-executive-summary" aria-label="市場訊號晨報摘要">
      <div>
        <p className="eyebrow">市場訊號晨報</p>
        <h2>產品閱讀流程可用</h2>
        <p>
          市場主燈號為 {market.asset.name}，示範綜合分數 {market.compositeScore}/100；今日風險觀察標的是{" "}
          {topRisk.asset.name}，示範風險分數 {topRisk.riskScore}/100。
        </p>
      </div>
      <aside>
        <span>
          <b>真實資料尚未上線</b>
          <i>目前只呈現示範資料與示範分數。</i>
        </span>
        <span>
          <b>市場廣度</b>
          <i>
            {breadth.constructive} 偏建設性 / {breadth.watch} 觀察 / {breadth.defensive} 防守
          </i>
        </span>
      </aside>
      <div className="briefing-runtime-action-strip">
        <DecisionPill title="先讀市場氣氛" body="用主燈號判斷今天偏多、觀望或警戒。" tone="active" />
        <DecisionPill title="再看風險與廣度" body="確認風險是否集中或擴散。" tone="hold" />
        <DecisionPill title="最後確認結構" body="回到資料狀態、方法說明與風險聲明。" tone="blocked" />
      </div>
      <nav aria-label="市場晨報快速連結">
        <a href={`/stocks/${market.asset.symbol}`}>
          <span>市場主燈號</span>
          <strong>{market.asset.name}</strong>
          <small>查看主燈號原因</small>
        </a>
        <a href={`/stocks/${topRisk.asset.symbol}`}>
          <span>風險觀察</span>
          <strong>{topRisk.asset.name}</strong>
          <small>查看風險原因</small>
        </a>
      </nav>
    </section>
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

function BriefingCard({ href, text, title, value }: { href: string; text: string; title: string; value: string }) {
  return (
    <TrackedLink eventName="briefing_link_clicked" href={href} label={title} payload={{ area: "briefing_card", title }}>
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{text}</p>
    </TrackedLink>
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
      <p>Market Breadth</p>
    </article>
  );
}

function buildConcentrationSignal(snapshots: SignalSnapshot[]) {
  const sorted = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore);
  const top = sorted[0];
  const second = sorted[1];
  const spread = top && second ? top.riskScore - second.riskScore : 0;
  return {
    headline: spread >= 12 ? "風險相對集中" : "風險分布較平均",
    primary: top,
    spread
  };
}

function ConcentrationPanel({
  concentration
}: {
  concentration: ReturnType<typeof buildConcentrationSignal>;
}) {
  return (
    <section className="panel briefing-concentration" aria-label="Concentration Check">
      <p className="eyebrow">Concentration Check</p>
      <h2>{concentration.headline}</h2>
      <div className="concentration-metrics">
        <article>
          <span>最高風險標的</span>
          <strong>{concentration.primary?.asset.name ?? "-"}</strong>
        </article>
        <article>
          <span>風險差距</span>
          <strong>{concentration.spread}</strong>
        </article>
      </div>
    </section>
  );
}

function buildBriefingPlaybook(market: SignalSnapshot, topRisk: SignalSnapshot) {
  return [
    {
      body: `${market.asset.name} 是今天的市場背景，先看它是否仍支撐市場氣氛。`,
      step: "1",
      title: "先讀市場氣氛"
    },
    {
      body: `${topRisk.asset.name} 是今天的風險觀察起點，用來確認是否需要加強觀察。`,
      step: "2",
      title: "再看風險與廣度"
    },
    {
      body: "最後回到資料狀態、方法說明與風險聲明，避免把示範分數當成交易指令。",
      step: "3",
      title: "最後確認結構"
    }
  ];
}
