import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PostReadonlyProductStatus } from "@/components/post-readonly-product-status";
import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { buildBriefingMarketActionSummary } from "@/lib/briefing-market-action-summary";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

type Tone = "active" | "hold" | "blocked";

export const metadata: Metadata = {
  title: "市場訊號晨報 | 指數燈號",
  description:
    "指數燈號公開 Beta 晨報，以 mock-only 資料與分數整理台股市場、ETF、風險觀察與公開 Beta 邊界。內容不是投資建議。"
};

export default async function BriefingPage() {
  const repository = getMarketSignalRepository();
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();
  const snapshots = repository
    .getAssets()
    .map((asset) => repository.getSnapshot(asset.symbol, "2026-05-28"))
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));

  if (snapshots.length === 0) {
    return (
      <main className="page-shell">
        <section className="hero briefing-hero">
          <div>
            <p className="eyebrow">Market Briefing</p>
            <h1>市場訊號晨報</h1>
            <p>目前沒有可顯示的 mock snapshot。publicDataSource=mock / scoreSource=mock 仍保持關閉真實資料 promotion。</p>
          </div>
        </section>
      </main>
    );
  }

  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshots[0];
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const heated = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore).slice(0, 4);
  const breadth = buildMarketBreadth(snapshots);
  const concentration = buildConcentrationSignal(snapshots);
  const playbook = buildBriefingPlaybook(market, breadth, concentration);
  const etfs = snapshots.filter((item) => item.asset.group === "ETF").sort((a, b) => b.healthScore - a.healthScore);
  const nonEtfStocks = snapshots.filter((item) => item.asset.group !== "ETF");
  const topEtf = etfs[0] ?? market;
  const leadingStock = nonEtfStocks.slice().sort((a, b) => b.compositeScore - a.compositeScore)[0] ?? market;
  const topRisk = heated[0] ?? market;
  const runtimePlan = buildBriefingRuntimePlan(market, breadth, concentration, topRisk);
  const marketActionSummary = buildBriefingMarketActionSummary(market, topRisk, breadth);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="briefing_page_viewed" payload={{ page: "briefing" }} />
      <BriefingExecutiveSummary market={market} topRisk={topRisk} />

      <section className="hero briefing-hero">
        <div>
          <p className="eyebrow">Daily Briefing</p>
          <h1>市場訊號晨報</h1>
          <p>
            這頁把目前的 mock 市場分數、風險觀察、ETF 與個股閱讀路徑整理成一份公開 Beta 晨報。
            它用來展示產品方向，不是交易服務，也不是投資建議。
          </p>
          <p className="runtime-boundary-line">
            publicDataSource=mock / scoreSource=mock。正式市場資料、真實分數、Supabase 寫入與資料 promotion
            仍需通過後續 gate。
          </p>
        </div>
        <div className="briefing-meta">
          <span>2026-05-28</span>
          <span>Data quality {market.dataQualityGrade}</span>
          <span>{market.modelVersion}</span>
        </div>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="briefing-market-action-summary" aria-label="Market action summary">
        <div>
          <p className="eyebrow">Market Action Summary</p>
          <h2>{marketActionSummary.headline}</h2>
          <p>{marketActionSummary.marketLine}</p>
          <p>{marketActionSummary.stopLine}</p>
        </div>
        <TrackedLink
          className={marketActionSummary.primary.tone}
          eventName="briefing_link_clicked"
          href={marketActionSummary.primary.href}
          label={marketActionSummary.primary.title}
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
          label={marketActionSummary.secondary.title}
          payload={{ area: "briefing_market_action_secondary", symbol: marketActionSummary.secondary.symbol }}
        >
          <span>{marketActionSummary.secondary.label}</span>
          <strong>{marketActionSummary.secondary.title}</strong>
          <p>{marketActionSummary.secondary.body}</p>
        </TrackedLink>
      </section>

      <nav aria-label="Experience Flow" className="experience-flow-nav">
        <span>Reading path</span>
        <TrackedLink eventName="briefing_link_clicked" href="/" label="Home dashboard" payload={{ area: "experience_flow", target: "home" }}>
          Home dashboard
        </TrackedLink>
        <TrackedLink
          eventName="briefing_link_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="Market detail"
          payload={{ area: "experience_flow", symbol: market.asset.symbol }}
        >
          Market detail
        </TrackedLink>
        <TrackedLink eventName="briefing_link_clicked" href="/weekly" label="Weekly report" payload={{ area: "experience_flow", target: "weekly" }}>
          Weekly report
        </TrackedLink>
      </nav>

      <PublicRuntimeStateStrip context="briefing" />
      <PostReadonlyProductStatus context="briefing" symbol={market.asset.symbol} />

      <nav aria-label="Briefing Compass" className="briefing-compass">
        <a href="#model-boundary">Model boundary</a>
        <a href="#market-structure">Market structure</a>
        <a href="#briefing-playbook">Briefing playbook</a>
        <a href="#watchlists">Watchlists</a>
      </nav>

      <section aria-label="Briefing decision boundary" className="briefing-decision-strip">
        <DecisionPill label="Current mode" text="Mock-only public Beta reading surface" tone="active" />
        <DecisionPill label="Data status" text="Coverage, freshness, and source-rights gates are still incomplete" tone="hold" />
        <DecisionPill label="Hard stop" text="No investment advice, no real score, no live market-data promotion" tone="blocked" />
      </section>

      <section className="briefing-runtime-plan" aria-label="Briefing reading plan">
        <div>
          <p className="eyebrow">Reading Plan</p>
          <h2>先看市場，再看風險與族群</h2>
          <p>
            這份晨報把 TWII、ETF、個股與集中度分成幾條閱讀路徑。所有分數仍是 mock score，
            用來測試產品理解與公開 Beta 呈現，不用來支持買賣決策。
          </p>
        </div>
        {runtimePlan.map((item) => (
          <TrackedLink
            className={item.tone}
            eventName="briefing_link_clicked"
            href={item.href}
            key={item.label}
            label={item.title}
            payload={{ area: "reading_plan", symbol: item.symbol }}
          >
            <span>{item.label}</span>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </TrackedLink>
        ))}
      </section>

      <section className="briefing-reading-bridge" aria-label="Briefing reading bridge">
        <div>
          <p className="eyebrow">Reading Bridge</p>
          <h2>把摘要接到可點擊的標的頁</h2>
          <p>
            這裡保留晨報到標的頁的產品路徑：先理解市場，再看 ETF、強勢股與風險股。每個頁面都仍維持
            mock-only 與非投資建議邊界。
          </p>
        </div>
        <nav>
          <BriefingBridgeLink
            href={`/stocks/${market.asset.symbol}`}
            label="Market"
            title={`${market.asset.symbol} ${market.asset.name}`}
            text={`Composite ${market.compositeScore}/100. Use this as the market anchor for mock Beta reading.`}
          />
          <BriefingBridgeLink
            href={`/stocks/${topEtf.asset.symbol}`}
            label="ETF"
            title={`${topEtf.asset.symbol} ${topEtf.asset.name}`}
            text={`Health ${topEtf.healthScore}/100. ETF coverage remains partial until source-rights and coverage gates pass.`}
          />
          <BriefingBridgeLink
            href={`/stocks/${leadingStock.asset.symbol}`}
            label="Stock"
            title={`${leadingStock.asset.symbol} ${leadingStock.asset.name}`}
            text={`Composite ${leadingStock.compositeScore}/100. Treat this as a mock signal example, not a recommendation.`}
          />
          <BriefingBridgeLink
            href={`/stocks/${topRisk.asset.symbol}`}
            label="Risk"
            title={`${topRisk.asset.symbol} ${topRisk.asset.name}`}
            text={`Risk ${topRisk.riskScore}/100. Review the risk explanation before interpreting the score.`}
          />
        </nav>
      </section>

      <section className="panel briefing-boundary" id="model-boundary">
        <div>
          <p className="eyebrow">Model Boundary</p>
          <h2>目前是 mock runtime，不是正式資料服務</h2>
          <p>
            公開 Beta 先驗證資訊層級、閱讀流程、信任揭露與產品定位。正式資料、真實分數、Supabase 讀寫、
            ingestion/backfill 與 scoreSource=real 都還沒有被 promotion gate 啟用。
          </p>
        </div>
        <div className="briefing-boundary-grid">
          <BoundaryItem label="Public data source" value="mock" />
          <BoundaryItem label="Score source" value="mock" />
          <BoundaryItem label="Advice status" value="not investment advice" />
        </div>
      </section>

      <section aria-label="Market Breadth" className="briefing-breadth" id="market-structure">
        <BreadthCard label="Constructive" text="Mock signals with healthier score and controlled risk." tone="positive" value={String(breadth.constructive)} />
        <BreadthCard label="Watch" text="Names that need more context before being treated as constructive." tone="watch" value={String(breadth.watch)} />
        <BreadthCard label="Defensive" text="Higher-risk or weaker-health names that need extra caution." tone="risk" value={String(breadth.defensive)} />
      </section>

      <ConcentrationPanel concentration={concentration} />

      <section className="panel briefing-playbook" aria-label="Briefing Playbook" id="briefing-playbook">
        <p className="eyebrow">Briefing Playbook</p>
        <h2>今天的閱讀順序</h2>
        <div className="playbook-grid">
          {playbook.map((item) => (
            <article className={`playbook-card ${item.tone}`} key={item.label}>
              <span>{item.label}</span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="briefing-summary">
        <article className="panel briefing-market-card">
          <div className="market-card-head">
            <div>
              <p className="panel-label">Market focus</p>
              <h2>{market.asset.name}</h2>
            </div>
            <strong className="signal-badge">{market.signal.title}</strong>
          </div>
          <div className="market-score-row">
            <div className="market-score">
              <span>{market.compositeScore}</span>
              <small>/100</small>
            </div>
            <div className="market-score-copy">
              <b>mock composite score</b>
              <p>
                Health {market.healthScore}/100, risk {market.riskScore}/100. Use this as a product reading example while
                coverage and real-data gates remain closed.
              </p>
            </div>
          </div>
        </article>
        <MetricPanel label="Data quality" value={`${market.dataQualityGrade}`} text={`Quality score ${market.dataQualityScore}/100; still mock and bounded.`} />
        <MetricPanel label="Model version" value={market.modelVersion} text="Mock model output; not a production investment model." />
        <MetricPanel label="Runtime boundary" value="mock" text="No Supabase write, no raw market data, no real score promotion." />
      </section>

      <section className="weekly-grid" id="watchlists">
        <BriefingList title="Top mock composite signals" description="High mock composite names for product reading flow." items={strongest} valueKey="composite" />
        <BriefingList title="Risk watch" description="Higher mock risk names that need more cautious reading." items={heated} valueKey="risk" />
      </section>

      <section className="weekly-grid">
        <article className="panel briefing-article">
          <p className="eyebrow">ETF Watch</p>
          <h2>ETF mock watchlist</h2>
          <p>ETF coverage remains partial. Use this area to inspect the intended reading experience before real-data promotion.</p>
          <div className="rank-list">
            {etfs.map((item) => (
              <TrackedLink
                className="rank-row"
                eventName="briefing_link_clicked"
                href={`/stocks/${item.asset.symbol}`}
                key={item.asset.id}
                label={`${item.asset.symbol} ${item.asset.name}`}
                payload={{ area: "etf_watch", symbol: item.asset.symbol }}
              >
                <strong>{item.asset.symbol}</strong>
                <span>{item.asset.name}</span>
                <b>{item.healthScore}</b>
              </TrackedLink>
            ))}
          </div>
        </article>

        <article className="panel briefing-article">
          <p className="eyebrow">Stock Watch</p>
          <h2>Stock mock watchlist</h2>
          <p>These cards keep the briefing actionable as a reading surface while all real-data gates remain closed.</p>
          <div className="rank-list">
            {nonEtfStocks.slice(0, 4).map((item) => (
              <TrackedLink
                className="rank-row"
                eventName="briefing_link_clicked"
                href={`/stocks/${item.asset.symbol}`}
                key={item.asset.id}
                label={`${item.asset.symbol} ${item.asset.name}`}
                payload={{ area: "stock_watch", symbol: item.asset.symbol }}
              >
                <strong>{item.asset.symbol}</strong>
                <span>{item.asset.name}</span>
                <b>{item.compositeScore}</b>
              </TrackedLink>
            ))}
          </div>
        </article>
      </section>

      <section className="panel briefing-article">
        <p className="eyebrow">Today's Rhythm</p>
        <h2>Use the briefing as a product walkthrough</h2>
        <div className="briefing-actions">
          <ActionCard title="Start with market context" text="Open TWII first and confirm the mock market framing." />
          <ActionCard title="Check the risk card" text="Use the highest-risk card as a reminder that this is not a trading signal." />
          <ActionCard title="Review the boundary" text="Keep source rights, coverage, and promotion gates visible before any real-data work." />
        </div>
      </section>

      <section className="panel briefing-links">
        <h2>Next reading links</h2>
        <TrackedLink className="text-link" eventName="briefing_link_clicked" href="/weekly" label="Weekly report" payload={{ area: "next_steps" }}>
          Weekly report
        </TrackedLink>
        <TrackedLink className="text-link" eventName="briefing_link_clicked" href="/methodology" label="Methodology" payload={{ area: "next_steps" }}>
          Methodology
        </TrackedLink>
        <TrackedLink className="text-link" eventName="briefing_link_clicked" href="/stocks/2330" label="2330 mock detail" payload={{ area: "next_steps", symbol: "2330" }}>
          2330 mock detail
        </TrackedLink>
        <TrackedLink className="text-link" eventName="briefing_link_clicked" href="/disclaimer" label="Disclaimer" payload={{ area: "next_steps" }}>
          Disclaimer
        </TrackedLink>
      </section>

      <article className="disclaimer">
        <h2>Important disclosure</h2>
        <p>
          This briefing is a public Beta reading surface. It uses mock data and mock scores, does not provide investment
          advice, and does not imply that source rights, coverage, Supabase writes, ingestion/backfill, or scoreSource=real
          have been approved.
        </p>
      </article>
    </main>
  );
}

function BriefingBridgeLink({
  href,
  label,
  text,
  title
}: {
  href: string;
  label: string;
  text: string;
  title: string;
}) {
  return (
    <TrackedLink eventName="briefing_link_clicked" href={href} label={title} payload={{ area: "reading_bridge", symbol: href.split("/").pop() }}>
      <span>{label}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </TrackedLink>
  );
}

function BriefingExecutiveSummary({ market, topRisk }: { market: SignalSnapshot; topRisk: SignalSnapshot }) {
  return (
    <section className="briefing-executive-summary" aria-label="Market Briefing executive summary">
      <div>
        <p className="eyebrow">Market Briefing</p>
        <h1>市場訊號晨報</h1>
        <p>
          Current public Beta state: core runtime routes are healthy, trust copy is readable, but real-data promotion is
          still closed by platform values and A1 source-rights evidence.
        </p>
      </div>
      <aside>
        <span>
          <b>Runtime</b>
          <i>publicDataSource=mock / scoreSource=mock</i>
        </span>
        <span>
          <b>Next readiness item</b>
          <i>Public launch settings and source checks are still being prepared</i>
        </span>
        <span>
          <b>Data evidence</b>
          <i>Index source coverage is still under review</i>
        </span>
        <span>
          <b>Risk focus</b>
          <i>
            {topRisk.asset.symbol} mock risk {topRisk.riskScore}/100
          </i>
        </span>
      </aside>
      <div className="briefing-runtime-action-strip" aria-label="Briefing runtime action strip">
        <article className="active">
          <span>Market anchor</span>
          <strong>{market.asset.symbol}</strong>
          <p>{market.asset.name}</p>
        </article>
        <article className="readying">
          <span>Beta route</span>
          <strong>Waiting values</strong>
          <p>Validate two platform values before packet proof.</p>
        </article>
        <article className="blocked">
          <span>Stop line</span>
          <strong>No real score</strong>
          <p>Do not promote source or score before gates pass.</p>
        </article>
      </div>
      <nav>
        <TrackedLink
          eventName="briefing_link_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="Market detail"
          payload={{ area: "executive_summary", symbol: market.asset.symbol }}
        >
          <span>Open market detail</span>
          <strong>{market.asset.name}</strong>
          <small>mock composite {market.compositeScore}/100</small>
        </TrackedLink>
        <TrackedLink
          eventName="briefing_link_clicked"
          href={`/stocks/${topRisk.asset.symbol}`}
          label="Risk detail"
          payload={{ area: "executive_summary", symbol: topRisk.asset.symbol }}
        >
          <span>Open risk detail</span>
          <strong>
            {topRisk.asset.symbol} {topRisk.asset.name}
          </strong>
          <small>mock risk {topRisk.riskScore}/100</small>
        </TrackedLink>
      </nav>
    </section>
  );
}

function buildBriefingRuntimePlan(
  market: SignalSnapshot,
  breadth: ReturnType<typeof buildMarketBreadth>,
  concentration: ReturnType<typeof buildConcentrationSignal>,
  topRisk: SignalSnapshot
) {
  const marketTone: Tone = market.riskScore >= 60 || breadth.defensive > breadth.constructive ? "hold" : "active";
  const riskTone: Tone = topRisk.riskScore >= 70 ? "blocked" : "hold";
  const concentrationTone: Tone = concentration.tone === "concentrated" ? "hold" : "active";

  return [
    {
      href: `/stocks/${market.asset.symbol}`,
      label: "Market",
      symbol: market.asset.symbol,
      text:
        marketTone === "active"
          ? `Composite ${market.compositeScore}/100. Use the market page as the starting context.`
          : `Risk ${market.riskScore}/100. Read the boundary notes before interpreting the market score.`,
      title: marketTone === "active" ? "Start with market context" : "Read market caution first",
      tone: marketTone
    },
    {
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "Risk",
      symbol: topRisk.asset.symbol,
      text: `${topRisk.asset.symbol} risk ${topRisk.riskScore}/100. Keep this as the caution card in the reading path.`,
      title: riskTone === "blocked" ? "Risk card is elevated" : "Risk card remains on watch",
      tone: riskTone
    },
    {
      href: concentrationTone === "hold" ? "#market-structure" : "/weekly",
      label: "Breadth",
      symbol: concentrationTone === "hold" ? "market-structure" : "weekly",
      text:
        concentrationTone === "hold"
          ? "Market structure is concentrated; use breadth before reading individual cards."
          : "Breadth is balanced enough to continue to the weekly page.",
      title: concentrationTone === "hold" ? "Check breadth before details" : "Continue to weekly context",
      tone: concentrationTone
    }
  ];
}

function MetricPanel({ label, value, text }: { label: string; value: string; text: string }) {
  return (
    <article className="panel metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{text}</p>
    </article>
  );
}

function BriefingList({
  title,
  description,
  items,
  valueKey
}: {
  title: string;
  description: string;
  items: SignalSnapshot[];
  valueKey: "composite" | "risk";
}) {
  return (
    <section className="panel briefing-article">
      <p className="eyebrow">Watchlist</p>
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
            payload={{ area: valueKey === "composite" ? "strongest" : "risk_watch", symbol: item.asset.symbol }}
          >
            <strong>{item.asset.symbol}</strong>
            <span>{item.asset.name}</span>
            <b>{valueKey === "composite" ? item.compositeScore : item.riskScore}</b>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}

function ActionCard({ title, text }: { title: string; text: string }) {
  return (
    <article>
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}

function BoundaryItem({ label, value }: { label: string; value: string }) {
  return (
    <article>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function DecisionPill({ label, text, tone }: { label: string; text: string; tone: Tone }) {
  return (
    <article className={tone}>
      <span>{label}</span>
      <p>{text}</p>
    </article>
  );
}

function ConcentrationPanel({
  concentration
}: {
  concentration: ReturnType<typeof buildConcentrationSignal>;
}) {
  return (
    <section className="panel concentration-panel">
      <div>
        <p className="eyebrow">Concentration</p>
        <h2>{concentration.title}</h2>
        <p>{concentration.text}</p>
      </div>
      <strong>{concentration.topGroupShare}%</strong>
    </section>
  );
}

function BreadthCard({ label, text, tone, value }: { label: string; text: string; tone: "positive" | "watch" | "risk"; value: string }) {
  return (
    <article className={tone}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{text}</p>
    </article>
  );
}

function buildMarketBreadth(snapshots: SignalSnapshot[]) {
  return snapshots.reduce(
    (acc, snapshot) => {
      if (snapshot.riskScore >= 70 || snapshot.healthScore < 45) {
        acc.defensive += 1;
      } else if (snapshot.compositeScore >= 60 && snapshot.healthScore >= 55) {
        acc.constructive += 1;
      } else {
        acc.watch += 1;
      }

      return acc;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
}

function buildConcentrationSignal(snapshots: SignalSnapshot[]) {
  const groupCounts = snapshots.reduce<Record<string, number>>((acc, snapshot) => {
    acc[snapshot.asset.group] = (acc[snapshot.asset.group] ?? 0) + 1;
    return acc;
  }, {});
  const [topGroup = "market", topCount = 0] =
    Object.entries(groupCounts).sort((a, b) => b[1] - a[1])[0] ?? [];
  const topGroupShare = snapshots.length > 0 ? Math.round((topCount / snapshots.length) * 100) : 0;
  const tone = topGroupShare >= 45 ? "concentrated" : "balanced";

  return {
    text:
      tone === "concentrated"
        ? `${topGroup} has the largest share of the mock universe. Read breadth before treating one group as market-wide proof.`
        : "The mock universe is distributed enough for a broader reading path.",
    title: tone === "concentrated" ? "Market structure is concentrated" : "Market structure is balanced",
    tone,
    topGroup,
    topGroupShare
  };
}

function buildBriefingPlaybook(
  market: SignalSnapshot,
  breadth: ReturnType<typeof buildMarketBreadth>,
  concentration: ReturnType<typeof buildConcentrationSignal>
) {
  const defensiveTilt = breadth.defensive > breadth.constructive;

  return [
    {
      label: "Step 1",
      text: `Open ${market.asset.symbol} first and confirm the mock market context.`,
      title: "Anchor the market",
      tone: "active" as Tone
    },
    {
      label: "Step 2",
      text: defensiveTilt
        ? "Defensive names are leading the mock breadth; read the risk cards before reading opportunity cards."
        : "Constructive names are leading the mock breadth; still keep the no-advice boundary visible.",
      title: defensiveTilt ? "Read risk first" : "Read opportunity with caution",
      tone: defensiveTilt ? ("blocked" as Tone) : ("hold" as Tone)
    },
    {
      label: "Step 3",
      text:
        concentration.tone === "concentrated"
          ? "Use sector concentration as a caveat before drawing any market-wide conclusion."
          : "Move from market context to weekly context after checking breadth.",
      title: "Check breadth and concentration",
      tone: concentration.tone === "concentrated" ? ("hold" as Tone) : ("active" as Tone)
    }
  ];
}
