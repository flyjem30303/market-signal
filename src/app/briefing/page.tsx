import type { Metadata } from "next";
import { BlockerReadinessPanel } from "@/components/blocker-readiness-panel";
import { CommercialSlot } from "@/components/commercial-slot";
import { BriefingRowCoverageStatus } from "@/components/briefing-row-coverage-status";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { NarrowApprovalOutcomePanel } from "@/components/narrow-approval-outcome-panel";
import { PageViewTracker } from "@/components/page-view-tracker";
import { ProjectProgressPanel } from "@/components/project-progress-panel";
import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";
import { RuntimeReadinessPanel } from "@/components/runtime-readiness-panel";
import { SourceDepthBlockerPanel } from "@/components/source-depth-blocker-panel";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { buildBriefingMarketActionSummary } from "@/lib/briefing-market-action-summary";
import { getRuntimeDecisionSummary } from "@/lib/runtime-decision-summary";
import { getRuntimeInterpretationSummary } from "@/lib/runtime-interpretation";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";
import { signalColor } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "台股每日晨報",
  description: "每天快速查看台股市場健康度、風險升溫標的、ETF 節奏與 AI 半導體觀察。"
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
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const heated = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore).slice(0, 4);
  const breadth = buildMarketBreadth(snapshots);
  const concentration = buildConcentrationSignal(snapshots);
  const playbook = buildBriefingPlaybook(market, breadth, concentration);
  const etfs = snapshots.filter((item) => item.asset.group === "ETF").sort((a, b) => b.healthScore - a.healthScore);
  const aiSemis = snapshots
    .filter((item) => ["半導體", "IC 設計", "AI 伺服器", "電子代工"].includes(item.asset.group))
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, 4);
  const topEtf = etfs[0];
  const leadingAiSemi = aiSemis[0];
  const topRisk = heated[0];
  const runtimePlan = buildBriefingRuntimePlan(market, breadth, concentration, topRisk);
  const marketActionSummary = buildBriefingMarketActionSummary(market, topRisk, breadth);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="briefing_page_viewed" payload={{ page: "briefing" }} />
      <BriefingExecutiveSummary market={market} topRisk={topRisk} />
      <section className="hero briefing-hero">
        <div>
          <p className="eyebrow">Daily Briefing</p>
          <h1>台股每日晨報</h1>
          <p>
            用一分鐘查看今天的市場健康度、風險升溫標的與觀察重點。這是研究模型摘要，不是買賣建議。
          </p>
        </div>
        <div className="briefing-meta">
          <span>2026-05-28</span>
          <span>資料品質 {market.dataQualityGrade} 級</span>
          <span>{market.modelVersion}</span>
        </div>
      </section>
      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="briefing-market-action-summary" aria-label="晨報市場行動摘要">
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
        <span>閱讀路徑</span>
        <TrackedLink eventName="briefing_link_clicked" href="/" label="回首頁看市場總覽" payload={{ area: "experience_flow", target: "home" }}>
          回首頁看市場總覽
        </TrackedLink>
        <TrackedLink
          eventName="briefing_link_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="看台指狀態"
          payload={{ area: "experience_flow", symbol: market.asset.symbol }}
        >
          看台指狀態
        </TrackedLink>
        <TrackedLink eventName="briefing_link_clicked" href="/weekly" label="延伸到本週週報" payload={{ area: "experience_flow", target: "weekly" }}>
          延伸到本週週報
        </TrackedLink>
      </nav>

      <PublicRuntimeStateStrip context="briefing" />

      <ProjectProgressPanel />
      <RuntimeReadinessPanel />
      <BriefingRowCoverageStatus />
      <SourceDepthBlockerPanel />
      <BlockerReadinessPanel />
      <NarrowApprovalOutcomePanel />

      <nav aria-label="Briefing Compass" className="briefing-compass">
        <a href="#model-boundary">模型邊界</a>
        <a href="#market-structure">市場結構</a>
        <a href="#briefing-playbook">行動框架</a>
        <a href="#watchlists">觀察名單</a>
      </nav>

      <section aria-label="CEO Decision Strip" className="briefing-decision-strip">
        <DecisionPill label="可推進" text="閱讀節奏與 mock 體驗" tone="active" />
        <DecisionPill label="暫緩" text="真實資料切換與公開宣稱" tone="hold" />
        <DecisionPill label="封鎖" text="投資建議與 real score" tone="blocked" />
      </section>

      <section className="briefing-runtime-plan" aria-label="晨報執行順序">
        <div>
          <p className="eyebrow">Runtime Plan</p>
          <h2>今天照這個順序讀</h2>
          <p>把晨報壓縮成三個可執行閱讀動作：先判斷市場，再拆風險，最後才進個股或週報脈絡。</p>
        </div>
        {runtimePlan.map((item) => (
          <TrackedLink
            className={item.tone}
            eventName="briefing_link_clicked"
            href={item.href}
            key={item.label}
            label={item.title}
            payload={{ area: "runtime_plan", symbol: item.symbol }}
          >
            <span>{item.label}</span>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </TrackedLink>
        ))}
      </section>

      <section className="briefing-reading-bridge" aria-label="晨報讀後路徑">
        <div>
          <p className="eyebrow">Reading Bridge</p>
          <h2>今天先點哪裡</h2>
          <p>晨報先給方向，下一步回到可檢查的標的頁：大盤、ETF、主線族群與風險升溫清單。</p>
        </div>
        <nav>
          <BriefingBridgeLink
            href={`/stocks/${market.asset.symbol}`}
            label="先看大盤"
            title={`${market.asset.symbol} ${market.asset.name}`}
            text={`綜合 ${market.compositeScore}/100，確認今天市場基準。`}
          />
          <BriefingBridgeLink
            href={`/stocks/${topEtf.asset.symbol}`}
            label="再看 ETF"
            title={`${topEtf.asset.symbol} ${topEtf.asset.name}`}
            text={`健康 ${topEtf.healthScore}/100，檢查核心部位節奏。`}
          />
          <BriefingBridgeLink
            href={`/stocks/${leadingAiSemi.asset.symbol}`}
            label="主線族群"
            title={`${leadingAiSemi.asset.symbol} ${leadingAiSemi.asset.name}`}
            text={`綜合 ${leadingAiSemi.compositeScore}/100，觀察 AI / 半導體延續性。`}
          />
          <BriefingBridgeLink
            href={`/stocks/${topRisk.asset.symbol}`}
            label="風險升溫"
            title={`${topRisk.asset.symbol} ${topRisk.asset.name}`}
            text={`風險 ${topRisk.riskScore}/100，先拆解追價風險。`}
          />
        </nav>
      </section>

      <section className="panel briefing-boundary" id="model-boundary">
        <div>
          <p className="eyebrow">Model Boundary</p>
          <h2>目前為 mock 訊號體驗</h2>
          <p>
            晨報頁用來驗證閱讀節奏與資訊架構；分數仍是模擬評分，不代表真實模型、真實資料驗證或投資建議。
          </p>
        </div>
        <div className="briefing-boundary-grid">
          <BoundaryItem label="分數來源" value="mock" />
          <BoundaryItem label="資料深度" value="not_ready" />
          <BoundaryItem label="公開宣稱" value="blocked" />
        </div>
      </section>

      <section aria-label="Market Breadth" className="briefing-breadth" id="market-structure">
        <BreadthCard
          label="強勢"
          text="綠燈與黃燈標的"
          tone="positive"
          value={String(breadth.constructive)}
        />
        <BreadthCard
          label="觀察"
          text="橘燈標的"
          tone="watch"
          value={String(breadth.watch)}
        />
        <BreadthCard
          label="風險升溫"
          text="紅燈與深紅標的"
          tone="risk"
          value={String(breadth.defensive)}
        />
      </section>

      <ConcentrationPanel concentration={concentration} />

      <section className="panel briefing-playbook" aria-label="Briefing Playbook" id="briefing-playbook">
        <p className="eyebrow">Briefing Playbook</p>
        <h2>今日行動框架</h2>
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
        <article className="panel briefing-market-card" style={{ ["--signal" as string]: signalColor(market.signal.key) }}>
          <div className="market-card-head">
            <div>
              <p className="panel-label">今日市場狀態</p>
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
              <b>今日節奏：觀察風險擴散與熱門股集中度</b>
              <p>
                多頭健康度 {market.healthScore}/100，回檔風險度 {market.riskScore}/100。先看大盤結構，再看個股變化。
              </p>
            </div>
          </div>
        </article>
        <MetricPanel label="資料品質" value={`${market.dataQualityGrade} 級`} text={`完整度 ${market.dataQualityScore}/100`} />
        <MetricPanel label="模型版本" value={market.modelVersion} text="正式上線前會改接真實資料" />
        <MetricPanel label="今日重點" value="分批與觀察" text="避免把單日燈號視為交易指令" />
      </section>

      <section className="weekly-grid" id="watchlists">
        <BriefingList title="健康度較強" description="可作為今日觀察名單，但仍需搭配估值與籌碼風險。" items={strongest} valueKey="composite" />
        <BriefingList title="風險升溫" description="風險分數較高，代表追價節奏需要更保守。" items={heated} valueKey="risk" />
      </section>

      <section className="weekly-grid">
        <article className="panel briefing-article">
          <p className="eyebrow">ETF Watch</p>
          <h2>ETF 觀察</h2>
          <p>
            大型 ETF 適合觀察市場核心資金是否穩定。若 ETF 健康度維持高檔但風險升溫，
            今日更適合檢查加碼節奏，而不是只看指數表面強弱。
          </p>
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
                <b>健 {item.healthScore}</b>
              </TrackedLink>
            ))}
          </div>
        </article>

        <article className="panel briefing-article">
          <p className="eyebrow">AI & Semiconductor</p>
          <h2>AI / 半導體觀察</h2>
          <p>
            AI 與半導體仍是台股權值與市場信心的核心來源。今天可優先看分數是否集中在少數股票，
            若集中度提高，代表指數強勢可能不等於市場廣度健康。
          </p>
          <div className="rank-list">
            {aiSemis.map((item) => (
              <TrackedLink
                className="rank-row"
                eventName="briefing_link_clicked"
                href={`/stocks/${item.asset.symbol}`}
                key={item.asset.id}
                label={`${item.asset.symbol} ${item.asset.name}`}
                payload={{ area: "ai_semiconductor", symbol: item.asset.symbol }}
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
        <h2>今日投資節奏提醒</h2>
        <div className="briefing-actions">
          <ActionCard title="先看大盤" text="確認台指與大型 ETF 的健康度是否同步，避免只被單一熱門股帶動情緒。" />
          <ActionCard title="再看風險" text="檢查風險升溫名單是否集中在同一族群，集中度提高時追價要更保守。" />
          <ActionCard title="最後看個股" text="進入個股頁看六大模組、新聞信心與回測摘要，再決定是否需要調整觀察清單。" />
        </div>
      </section>

      <section className="panel briefing-links">
        <h2>下一步</h2>
        <TrackedLink className="text-link" eventName="briefing_link_clicked" href="/weekly" label="看本週週報" payload={{ area: "next_steps" }}>
          看本週週報
        </TrackedLink>
        <TrackedLink className="text-link" eventName="briefing_link_clicked" href="/methodology" label="了解評分方法論" payload={{ area: "next_steps" }}>
          了解評分方法論
        </TrackedLink>
        <TrackedLink
          className="text-link"
          eventName="briefing_link_clicked"
          href="/stocks/2330"
          label="查看 2330 台積電"
          payload={{ area: "next_steps", symbol: "2330" }}
        >
          查看 2330 台積電
        </TrackedLink>
        <TrackedLink className="text-link" eventName="briefing_link_clicked" href="/disclaimer" label="確認免責聲明" payload={{ area: "next_steps" }}>
          確認免責聲明
        </TrackedLink>
      </section>

      <article className="disclaimer">
        <h2>投資免責聲明</h2>
        <p>
          本晨報為模型摘要與資訊整理，不構成投資建議、買賣推薦或收益保證。所有分數仍需搭配個人風險承受度判斷。
        </p>
      </article>

      <CommercialSlot context="briefing" />
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
  const runtimeInterpretation = getRuntimeInterpretationSummary();
  const decisionSummary = getRuntimeDecisionSummary();

  return (
    <section className="briefing-executive-summary" aria-label="CEO briefing executive summary">
      <div>
        <p className="eyebrow">CEO Briefing</p>
        <h1>市場訊號晨報</h1>
        <p>
          目前網站可用 mock 訊號閱讀市場方向、風險排序與產品流程。這不是即時市場資料，也不是投資建議；
          真實資料、公開 Supabase 資料源與 real score source 都仍需通過後續 gate。
        </p>
      </div>
      <aside>
        <span>
          <b>現在可讀</b>
          <i>{decisionSummary.userFacingNow}</i>
        </span>
        <span>
          <b>唯讀證據</b>
          <i>{decisionSummary.subhead}</i>
        </span>
        <span>
          <b>仍然 blocked</b>
          <i>{decisionSummary.safetyStopLine}</i>
        </span>
        <span>
          <b>CEO track</b>
          <i>
            {runtimeInterpretation.decision}: runtime {runtimeInterpretation.laneRatio.mockRuntimeHardening}% /
            readonly prep {runtimeInterpretation.laneRatio.supabaseReadonlyPreparation}%
          </i>
        </span>
      </aside>
      <div className="briefing-runtime-action-strip" aria-label="Briefing CEO next runtime action summary">
        <article className="active">
          <span>Current progress</span>
          <strong>{decisionSummary.currentProgressPercent}%</strong>
          <p>{decisionSummary.stage}</p>
        </article>
        <article className="readying">
          <span>CEO next action</span>
          <strong>{decisionSummary.decisionLabel}</strong>
          <p>{decisionSummary.nextLift}</p>
        </article>
        <article className="blocked">
          <span>Still blocked</span>
          <strong>{decisionSummary.blockedTransition}</strong>
          <p>{decisionSummary.safetyStopLine}</p>
        </article>
      </div>
      <nav>
        <TrackedLink
          eventName="briefing_link_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看市場頁"
          payload={{ area: "executive_summary", symbol: market.asset.symbol }}
        >
          <span>查看市場頁</span>
          <strong>{market.asset.name}</strong>
          <small>綜合分數 {market.compositeScore}/100</small>
        </TrackedLink>
        <TrackedLink
          eventName="briefing_link_clicked"
          href={`/stocks/${topRisk.asset.symbol}`}
          label="查看高風險標的"
          payload={{ area: "executive_summary", symbol: topRisk.asset.symbol }}
        >
          <span>查看高風險標的</span>
          <strong>
            {topRisk.asset.symbol} {topRisk.asset.name}
          </strong>
          <small>風險分數 {topRisk.riskScore}/100</small>
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
  const marketTone = market.riskScore >= 60 || breadth.defensive > breadth.constructive ? "hold" : "active";
  const riskTone = topRisk.riskScore >= 70 ? "blocked" : "hold";
  const concentrationTone = concentration.tone === "concentrated" ? "hold" : "active";

  return [
    {
      href: `/stocks/${market.asset.symbol}`,
      label: "第一步",
      symbol: market.asset.symbol,
      text:
        marketTone === "active"
          ? `市場綜合 ${market.compositeScore}/100，先確認多頭健康度是否支撐今日閱讀。`
          : `市場風險 ${market.riskScore}/100，先確認大盤是否需要降速觀察。`,
      title: marketTone === "active" ? "先看市場基準" : "先降速看市場",
      tone: marketTone
    },
    {
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "第二步",
      symbol: topRisk.asset.symbol,
      text: `${topRisk.asset.symbol} 風險 ${topRisk.riskScore}/100，確認風險升溫是否集中在單一族群。`,
      title: riskTone === "blocked" ? "優先拆高風險" : "再看風險清單",
      tone: riskTone
    },
    {
      href: concentrationTone === "hold" ? "#market-structure" : "/weekly",
      label: "第三步",
      symbol: concentrationTone === "hold" ? "market-structure" : "weekly",
      text:
        concentrationTone === "hold"
          ? "強勢集中度偏高時，先回到市場結構，避免把少數標的當成整體市場。"
          : "市場廣度尚可時，再進週報，把今天的訊號放到一週脈絡。",
      title: concentrationTone === "hold" ? "確認集中度" : "接到週報脈絡",
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
            payload={{ area: "watchlist", symbol: item.asset.symbol }}
          >
            <strong>{item.asset.symbol}</strong>
            <span>{item.asset.name}</span>
            <b>{valueKey === "risk" ? `險 ${item.riskScore}` : item.compositeScore}</b>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}

function ActionCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="action-card">
      <h3>{title}</h3>
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

function DecisionPill({ label, text, tone }: { label: string; text: string; tone: string }) {
  return (
    <article className={`decision-pill ${tone}`}>
      <strong>{label}</strong>
      <span>{text}</span>
    </article>
  );
}

function ConcentrationPanel({
  concentration
}: {
  concentration: { leadingGroup: string; leadingScore: number; constructiveShare: number; tone: string; message: string };
}) {
  return (
    <section className="panel briefing-concentration" aria-label="Concentration Check">
      <div>
        <p className="eyebrow">Concentration Check</p>
        <h2>族群集中度檢查</h2>
        <p>{concentration.message}</p>
      </div>
      <div className="concentration-metrics">
        <article>
          <span>主導族群</span>
          <strong>{concentration.leadingGroup}</strong>
          <b>{concentration.leadingScore}</b>
        </article>
        <article className={concentration.tone}>
          <span>強勢占比</span>
          <strong>{concentration.constructiveShare}%</strong>
          <b>{concentration.tone === "balanced" ? "較均衡" : "偏集中"}</b>
        </article>
      </div>
    </section>
  );
}

function BreadthCard({ label, text, tone, value }: { label: string; text: string; tone: string; value: string }) {
  return (
    <article className={`panel breadth-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{text}</p>
    </article>
  );
}

function buildConcentrationSignal(snapshots: SignalSnapshot[]) {
  const stockSnapshots = snapshots.filter((snapshot) => snapshot.asset.group !== "指數" && snapshot.asset.group !== "ETF");
  const constructive = stockSnapshots.filter(
    (snapshot) => snapshot.signal.key === "green" || snapshot.signal.key === "yellow"
  ).length;
  const constructiveShare = stockSnapshots.length ? Math.round((constructive / stockSnapshots.length) * 100) : 0;
  const groupScores = stockSnapshots.reduce<Record<string, { score: number; count: number }>>((summary, snapshot) => {
    const current = summary[snapshot.asset.group] ?? { score: 0, count: 0 };
    current.score += snapshot.compositeScore;
    current.count += 1;
    summary[snapshot.asset.group] = current;

    return summary;
  }, {});
  const [leadingGroup, leading] =
    Object.entries(groupScores)
      .map(([group, value]) => [group, Math.round(value.score / value.count)] as const)
      .sort((a, b) => b[1] - a[1])[0] ?? ["未分類", 0];
  const tone = constructiveShare >= 60 ? "balanced" : "concentrated";
  const message =
    tone === "balanced"
      ? "強勢標的分布較均衡，仍需確認是否由單一權值族群主導。"
      : "強勢標的偏少，應優先檢查指數上漲是否集中在少數族群。";

  return { constructiveShare, leadingGroup, leadingScore: leading, message, tone };
}

function buildBriefingPlaybook(
  market: SignalSnapshot,
  breadth: { constructive: number; defensive: number; watch: number },
  concentration: { constructiveShare: number; leadingGroup: string; leadingScore: number; tone: string; message: string }
) {
  const posture =
    market.signal.key === "green" || market.signal.key === "yellow"
      ? {
          title: "分批觀察",
          text: `大盤為${market.signal.title}，先確認強勢是否延伸到更多族群，再看個股頁細節。`,
          tone: "active"
        }
      : {
          title: "防守優先",
          text: `大盤為${market.signal.title}，先降低追價衝動，優先檢查風險升溫名單。`,
          tone: "blocked"
        };
  const focus =
    concentration.tone === "balanced"
      ? {
          title: "確認廣度",
          text: `強勢占比 ${concentration.constructiveShare}%，主導族群為 ${concentration.leadingGroup}，可觀察是否延續。`,
          tone: "active"
        }
      : {
          title: "檢查集中",
          text: `強勢占比 ${concentration.constructiveShare}%，主導族群為 ${concentration.leadingGroup}，避免只看指數表面。`,
          tone: "hold"
        };
  const guardrail =
    breadth.defensive > breadth.constructive
      ? {
          title: "不要追高",
          text: "風險升溫數量高於強勢數量，先等結構改善，不把單日反彈當成趨勢確認。",
          tone: "blocked"
        }
      : {
          title: "不要放大宣稱",
          text: "目前仍是 mock 模型摘要，只能作為閱讀節奏驗證，不作為買賣依據。",
          tone: "hold"
        };

  return [
    { label: "今日姿態", ...posture },
    { label: "觀察焦點", ...focus },
    { label: "避免事項", ...guardrail }
  ];
}

function buildMarketBreadth(snapshots: SignalSnapshot[]) {
  return snapshots.reduce(
    (summary, snapshot) => {
      if (snapshot.signal.key === "green" || snapshot.signal.key === "yellow") {
        summary.constructive += 1;
      } else if (snapshot.signal.key === "orange") {
        summary.watch += 1;
      } else {
        summary.defensive += 1;
      }

      return summary;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
}
