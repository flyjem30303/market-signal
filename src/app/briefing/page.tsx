import type { Metadata } from "next";
import { BriefingPublicBetaGateSummary } from "@/components/briefing-public-beta-gate-summary";
import { BriefingPublicDecisionSummaryPanel } from "@/components/briefing-public-decision-summary-panel";
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
    "公開 Beta 的市場狀態晨報，以 mock-only 資料呈現市場氣氛、警示成因、更新時間與下一步觀察，不提供買賣建議。"
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
            <p>目前沒有可顯示的 mock snapshot。正式資料上線前，頁面會維持安全降級。</p>
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
  const briefingAlerts = buildBriefingAlerts(market, topRisk, breadth, concentration);
  const briefingAlertUpdateTime = market.lastUpdatedAt.replace("T", " ").replace("+08:00", " 台北時間");

  return (
    <main className="page-shell">
      <PageViewTracker eventName="briefing_page_viewed" payload={{ page: "briefing" }} />
      <BriefingPublicDecisionSummaryPanel breadth={breadth} market={market} topRisk={topRisk} />
      <BriefingExecutiveSummary market={market} topRisk={topRisk} />

      <section className="hero briefing-hero">
        <div>
          <p className="eyebrow">Daily Briefing</p>
          <h1>市場訊號晨報</h1>
          <p>
            這份晨報把市場總覽、核心指標與警示清單放在同一條閱讀路徑，讓一般投資者在 30 秒看懂今日市場氣氛，再決定是否需要加強觀察。
          </p>
          <p className="runtime-boundary-line">
            目前公開資料來源與分數來源維持 publicDataSource=mock、scoreSource=mock；正式資料尚未上線，這不是即時真實資料，也不是買賣建議。
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

      <section className="home-public-beta-layers briefing-alert-decision-list" aria-label="Briefing alert list">
        <div className="home-public-beta-layer alerts">
          <span>警示清單</span>
          <strong>{briefingAlerts.length} 個觀察重點</strong>
          <p>每個警示都保留狀態、成因、更新時間、影響級別與下一步，避免只看單一分數造成誤判。</p>
        </div>
        <div className="home-public-beta-alert-list">
          {briefingAlerts.map((alert) => (
            <TrackedLink
              className={alert.tone}
              eventName="briefing_link_clicked"
              href={alert.href}
              key={alert.title}
              label={alert.title}
              payload={{ action: "briefing_alert", alert: alert.title, symbol: alert.symbol }}
            >
              <span>{alert.status}</span>
              <strong>{alert.title}</strong>
              <dl>
                <div>
                  <dt>成因</dt>
                  <dd>{alert.cause}</dd>
                </div>
                <div>
                  <dt>更新時間</dt>
                  <dd>{briefingAlertUpdateTime}</dd>
                </div>
                <div>
                  <dt>影響級別</dt>
                  <dd>{alert.impact}</dd>
                </div>
                <div>
                  <dt>下一步</dt>
                  <dd>{alert.next}</dd>
                </div>
              </dl>
            </TrackedLink>
          ))}
        </div>
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
        <TrackedLink eventName="briefing_link_clicked" href="/methodology" label="Methodology" payload={{ area: "experience_flow", target: "methodology" }}>
          Methodology
        </TrackedLink>
        <TrackedLink eventName="briefing_link_clicked" href="/disclaimer" label="Disclaimer" payload={{ area: "experience_flow", target: "disclaimer" }}>
          Disclaimer
        </TrackedLink>
      </nav>

      <PublicRuntimeStateStrip context="briefing" />
      <PostReadonlyProductStatus context="briefing" symbol={market.asset.symbol} />
      <BriefingPublicBetaGateSummary />

      <nav aria-label="Briefing Compass" className="briefing-compass">
        <a href="#model-boundary">Model boundary</a>
        <a href="#market-structure">Market structure</a>
        <a href="#briefing-playbook">Briefing playbook</a>
        <a href="#watchlists">Watchlists</a>
      </nav>

      <section aria-label="Briefing decision boundary" className="briefing-decision-strip">
        <DecisionPill label="Current mode" text="Mock-only public Beta reading surface" tone="active" />
        <DecisionPill label="Data status" text="partial coverage; missing/delayed data can still occur" tone="hold" />
        <DecisionPill label="Hard stop" text="不提供買賣建議，也不宣稱真實資料或完整覆蓋已上線" tone="blocked" />
      </section>

      <section className="briefing-runtime-plan" aria-label="Briefing reading plan">
        <div>
          <p className="eyebrow">Reading Plan</p>
          <h2>先看市場，再看風險，最後看族群集中度</h2>
          <p>這條路徑把 30 秒摘要延伸成 3 分鐘判讀流程，幫使用者知道下一步要看哪裡，而不是直接下交易結論。</p>
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
          <h2>從市場氣氛接到細節頁</h2>
          <p>如果只看總覽還不夠，請往下查看市場、ETF、個股與風險卡片。所有分數都仍是 mock 訊號。</p>
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
            text={`Health ${topEtf.healthScore}/100. ETF coverage remains partial until source and coverage gates pass.`}
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
          <h2>目前是 mock runtime，不是正式市場資料</h2>
          <p>
            這個頁面用來驗證產品閱讀流程。資料來源、覆蓋率、模型可信度與公開聲明都還需要後續 gate 才能升級。
          </p>
        </div>
        <div className="briefing-boundary-grid">
          <BoundaryItem label="Public data source" value="mock" />
          <BoundaryItem label="Score source" value="mock" />
          <BoundaryItem label="Advice status" value="不提供買賣建議" />
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
        <h2>三步驟閱讀市場訊號</h2>
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
          This briefing is a public Beta reading surface. It uses demo data and demo scores, does not provide buy/sell
          recommendations, and does not imply that source rights, coverage, Supabase writes, ingestion/backfill, or real
          scoring have been approved.
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
          先看市場氣氛，再看風險來源，最後確認資料邊界。這個頁面是公開 Beta 的 mock-only 閱讀介面，不是交易建議。
        </p>
      </div>
      <aside>
        <span>
          <b>Runtime</b>
          <i>mock-only，正式資料尚未 promotion</i>
        </span>
        <span>
          <b>下一步</b>
          <i>確認來源、覆蓋率、品質與公開聲明後，才討論真實資料提升</i>
        </span>
        <span>
          <b>資料邊界</b>
          <i>publicDataSource=mock；scoreSource=mock</i>
        </span>
        <span>
          <b>風險焦點</b>
          <i>
            {topRisk.asset.symbol} mock risk {topRisk.riskScore}/100
          </i>
        </span>
      </aside>
      <div className="briefing-runtime-action-strip" aria-label="Briefing runtime action strip">
        <article className="active">
          <span>市場入口</span>
          <strong>{market.asset.symbol}</strong>
          <p>{market.asset.name}</p>
        </article>
        <article className="readying">
          <span>Beta 狀態</span>
          <strong>產品閱讀流程可用</strong>
          <p>目前重點是讓使用者看懂市場氣氛、成因、更新時間與下一步觀察。</p>
        </article>
        <article className="blocked">
          <span>硬邊界</span>
          <strong>真實資料尚未上線</strong>
          <p>沒有 SQL、沒有 Supabase 寫入、沒有 raw market data、沒有 real score promotion。</p>
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

function buildBriefingAlerts(
  market: SignalSnapshot,
  topRisk: SignalSnapshot,
  breadth: ReturnType<typeof buildMarketBreadth>,
  concentration: ReturnType<typeof buildConcentrationSignal>
) {
  const marketNeedsCaution = market.riskScore >= 60 || breadth.defensive > breadth.constructive;
  const topRiskElevated = topRisk.riskScore >= 70;
  const concentrated = concentration.tone === "concentrated";

  return [
    {
      cause: marketNeedsCaution
        ? `市場風險分數為 ${market.riskScore}/100，先降低解讀速度。`
        : `市場綜合分數為 ${market.compositeScore}/100，可先用作氣氛判讀。`,
      href: `/stocks/${market.asset.symbol}`,
      impact: marketNeedsCaution ? "中" : "低",
      next: marketNeedsCaution ? "先看風險來源，再看 ETF 與族群是否同步轉弱。" : "持續觀察市場入口，再確認週報脈絡。",
      status: marketNeedsCaution ? "需要觀察" : "可觀察",
      symbol: market.asset.symbol,
      title: `${market.asset.symbol} 市場氣氛警示`,
      tone: marketNeedsCaution ? "hold" : "active"
    },
    {
      cause: `${topRisk.asset.symbol} 風險分數為 ${topRisk.riskScore}/100，是目前晨報的主要提醒來源。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      impact: topRiskElevated ? "高" : "中",
      next: topRiskElevated ? "先閱讀該標的細節頁，再回到市場總覽交叉確認。" : "列入風險觀察，不把分數視為交易訊號。",
      status: topRiskElevated ? "風險升溫" : "需要觀察",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} 風險來源`,
      tone: topRiskElevated ? "blocked" : "hold"
    },
    {
      cause: concentrated
        ? `${concentration.topGroup} 佔 mock universe ${concentration.topGroupShare}%，市場可能偏集中。`
        : "市場分布暫時較均衡，可以繼續觀察週報脈絡。",
      href: concentrated ? "#market-structure" : "/weekly",
      impact: concentrated ? "中" : "低",
      next: concentrated ? "先看市場結構，再看個股或 ETF。" : "前往週報確認中期背景。",
      status: concentrated ? "需要觀察" : "可觀察",
      symbol: concentrated ? "market-structure" : "weekly",
      title: "市場結構警示",
      tone: concentrated ? "hold" : "active"
    }
  ] satisfies Array<{
    cause: string;
    href: string;
    impact: string;
    next: string;
    status: string;
    symbol: string;
    title: string;
    tone: Tone;
  }>;
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

function BreadthCard({
  label,
  text,
  tone,
  value
}: {
  label: string;
  text: string;
  tone: "positive" | "risk" | "watch";
  value: string;
}) {
  return (
    <article className={`breadth-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
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
    <section className="panel concentration-panel briefing-concentration">
      <div>
        <p className="eyebrow">Concentration Check</p>
        <h2>{concentration.title}</h2>
        <p>{concentration.text}</p>
      </div>
      <div className="concentration-metrics">
        <span>Top group share</span>
        <strong>{concentration.topGroupShare}%</strong>
        <small>{concentration.topGroup}</small>
      </div>
    </section>
  );
}

function buildMarketBreadth(items: SignalSnapshot[]) {
  return items.reduce(
    (acc, item) => {
      if (item.healthScore >= 70 && item.riskScore < 60) acc.constructive += 1;
      else if (item.riskScore >= 65 || item.healthScore < 50) acc.defensive += 1;
      else acc.watch += 1;
      return acc;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
}

function buildConcentrationSignal(items: SignalSnapshot[]) {
  const groups = new Map<string, number>();
  for (const item of items) groups.set(item.asset.group, (groups.get(item.asset.group) ?? 0) + 1);

  const [topGroup = "Market", topCount = 0] = [...groups.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
  const topGroupShare = Math.round((topCount / Math.max(items.length, 1)) * 100);
  const concentrated = topGroupShare >= 45;

  return {
    text: concentrated
      ? `${topGroup} 佔比偏高，請先看市場結構，再解讀個別標的。`
      : "目前 mock universe 分布較均衡，可以繼續往週報與細節頁閱讀。",
    title: concentrated ? "市場結構偏集中" : "市場結構暫時均衡",
    tone: concentrated ? "concentrated" : "balanced",
    topGroup,
    topGroupShare
  };
}

function buildBriefingPlaybook(
  market: SignalSnapshot,
  breadth: ReturnType<typeof buildMarketBreadth>,
  concentration: ReturnType<typeof buildConcentrationSignal>
) {
  return [
    {
      label: "Step 1",
      text: `${market.asset.symbol} 是市場入口。先確認 composite ${market.compositeScore}/100 與資料邊界。`,
      title: "先讀市場氣氛",
      tone: "active"
    },
    {
      label: "Step 2",
      text: `目前 ${breadth.defensive} 個標的偏防守。若防守數增加，請放慢解讀速度。`,
      title: "再看風險與廣度",
      tone: breadth.defensive > breadth.constructive ? "blocked" : "hold"
    },
    {
      label: "Step 3",
      text: concentration.tone === "concentrated" ? "族群集中時，避免只用單一標的代表整個市場。" : "族群較均衡時，可接著看週報脈絡。",
      title: "最後確認結構",
      tone: concentration.tone === "concentrated" ? "hold" : "active"
    }
  ] satisfies Array<{ label: string; text: string; title: string; tone: Tone }>;
}
