import type { Metadata } from "next";
import { CommercialSlot } from "@/components/commercial-slot";
import { BriefingPublicBetaGateSummary } from "@/components/briefing-public-beta-gate-summary";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PostReadonlyProductStatus } from "@/components/post-readonly-product-status";
import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";
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
  title: "市場訊號晨報",
  description:
    "以示範資料狀態整理台股市場健康度、回檔風險、資料新鮮度限制與模型邊界；內容不構成投資建議。"
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
            用一分鐘整理今天的示範市場訊號、風險升溫標的與資料限制。這頁支援閱讀流程與公開信任檢查，
            不是即時市場資料、完整覆蓋率或投資建議；正式資料與正式分數尚未上線。
          </p>
          <p className="runtime-boundary-line">
            目前公開版仍使用示範資料與示範分數；資料新鮮度只作狀態說明，
            覆蓋率不足、資料缺漏或延遲、模型限制都必須保留。
          </p>
        </div>
        <div className="briefing-meta">
          <span>2026-05-28</span>
          <span>資料品質 {market.dataQualityGrade}</span>
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
        <TrackedLink eventName="briefing_link_clicked" href="/" label="回到首頁總覽" payload={{ area: "experience_flow", target: "home" }}>
          回到首頁總覽
        </TrackedLink>
        <TrackedLink
          eventName="briefing_link_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看市場頁"
          payload={{ area: "experience_flow", symbol: market.asset.symbol }}
        >
          查看市場頁
        </TrackedLink>
        <TrackedLink eventName="briefing_link_clicked" href="/weekly" label="查看週報" payload={{ area: "experience_flow", target: "weekly" }}>
          查看週報
        </TrackedLink>
      </nav>

      <PublicRuntimeStateStrip context="briefing" />
      <PostReadonlyProductStatus context="briefing" symbol={market.asset.symbol} />
      <BriefingPublicBetaGateSummary />

      <nav aria-label="Briefing Compass" className="briefing-compass">
        <a href="#model-boundary">模型邊界</a>
        <a href="#market-structure">市場結構</a>
        <a href="#briefing-playbook">閱讀策略</a>
        <a href="#watchlists">觀察清單</a>
      </nav>

      <section aria-label="晨報公開邊界" className="briefing-decision-strip">
        <DecisionPill label="目前可讀" text="mock 訊號、風險方向與產品流程" tone="active" />
        <DecisionPill label="資料限制" text="資料新鮮度、partial coverage 與缺值/延遲仍需揭露" tone="hold" />
        <DecisionPill label="禁止宣稱" text="不能說成真實資料、完整覆蓋率、真實分數或投資建議" tone="blocked" />
      </section>

      <section className="briefing-runtime-plan" aria-label="晨報閱讀計畫">
        <div>
          <p className="eyebrow">Reading Plan</p>
          <h2>先看市場，再看風險與資料限制</h2>
          <p>
            晨報先整理市場狀態，再引導到個股、ETF 與週報。每一步都保留 mock-only、資料新鮮度限制、
            partial coverage、missing/delayed data 與模型限制。
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

      <section className="briefing-reading-bridge" aria-label="晨報閱讀橋接">
        <div>
          <p className="eyebrow">Reading Bridge</p>
          <h2>從摘要跳到可檢查的頁面</h2>
          <p>
            這些連結只協助使用者在 mock-only 狀態下檢查市場、ETF、個股與風險頁面；分數不是預測、保證或個人化建議。
          </p>
        </div>
        <nav>
          <BriefingBridgeLink
            href={`/stocks/${market.asset.symbol}`}
            label="市場頁"
            title={`${market.asset.symbol} ${market.asset.name}`}
            text={`Composite ${market.compositeScore}/100；請搭配資料品質、模型限制與 mock-only 邊界閱讀。`}
          />
          <BriefingBridgeLink
            href={`/stocks/${topEtf.asset.symbol}`}
            label="ETF 範例"
            title={`${topEtf.asset.symbol} ${topEtf.asset.name}`}
            text={`Health ${topEtf.healthScore}/100；目前仍是 partial coverage/readiness，不代表完整覆蓋率。`}
          />
          <BriefingBridgeLink
            href={`/stocks/${leadingStock.asset.symbol}`}
            label="強勢標的"
            title={`${leadingStock.asset.symbol} ${leadingStock.asset.name}`}
            text={`Composite ${leadingStock.compositeScore}/100；只供 mock 訊號閱讀，不構成投資建議。`}
          />
          <BriefingBridgeLink
            href={`/stocks/${topRisk.asset.symbol}`}
            label="高風險標的"
            title={`${topRisk.asset.symbol} ${topRisk.asset.name}`}
            text={`Risk ${topRisk.riskScore}/100；風險升溫需搭配資料缺口、延遲與模型限制理解。`}
          />
        </nav>
      </section>

      <section className="panel briefing-boundary" id="model-boundary">
        <div>
          <p className="eyebrow">Model Boundary</p>
          <h2>mock 分數不等於正式模型結論</h2>
          <p>
            晨報分數用於產品流程與市場閱讀示範。模型可能受資料新鮮度、缺值/延遲、partial coverage、
            source-rights 與資料品質限制影響；不得視為預測、保證或投資建議。
          </p>
        </div>
        <div className="briefing-boundary-grid">
          <BoundaryItem label="公開資料來源" value="示範資料" />
          <BoundaryItem label="公開分數來源" value="示範分數" />
          <BoundaryItem label="投資用途" value="不得作為投資建議" />
        </div>
      </section>

      <section aria-label="Market Breadth" className="briefing-breadth" id="market-structure">
        <BreadthCard label="可閱讀" text="mock 訊號偏正向，可作為產品流程觀察。" tone="positive" value={String(breadth.constructive)} />
        <BreadthCard label="需觀察" text="分數或資料旗標需要搭配限制說明閱讀。" tone="watch" value={String(breadth.watch)} />
        <BreadthCard label="風險升溫" text="風險分數偏高，不代表買賣建議。" tone="risk" value={String(breadth.defensive)} />
      </section>

      <ConcentrationPanel concentration={concentration} />

      <section className="panel briefing-playbook" aria-label="Briefing Playbook" id="briefing-playbook">
        <p className="eyebrow">Briefing Playbook</p>
        <h2>今天的閱讀策略</h2>
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
              <p className="panel-label">市場摘要</p>
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
                Health {market.healthScore}/100, risk {market.riskScore}/100. 分數僅供閱讀流程測試；
                真實資料、完整覆蓋率與正式模型仍未核准。
              </p>
            </div>
          </div>
        </article>
        <MetricPanel label="資料品質" value={`${market.dataQualityGrade}`} text={`Data quality ${market.dataQualityScore}/100；缺值或延遲需要降級閱讀。`} />
        <MetricPanel label="模型版本" value={market.modelVersion} text="目前仍是 mock model，不得宣稱真實績效或預測能力。" />
        <MetricPanel label="公開邊界" value="示範資料" text="資料來源與分數來源尚未切換為正式市場資料；不構成投資建議。" />
      </section>

      <section className="weekly-grid" id="watchlists">
        <BriefingList title="較強 mock 訊號" description="用於比較閱讀流程，不代表投資排名或推薦。" items={strongest} valueKey="composite" />
        <BriefingList title="風險升溫觀察" description="風險分數偏高時，需優先檢查資料限制、缺值與模型邊界。" items={heated} valueKey="risk" />
      </section>

      <section className="weekly-grid">
        <article className="panel briefing-article">
          <p className="eyebrow">ETF Watch</p>
          <h2>ETF mock 觀察</h2>
          <p>
            ETF 清單目前用於 mock 閱讀與流程驗證。partial coverage 或 missing/delayed data 仍需揭露，
            不能把分數視為完整市場覆蓋或投資建議。
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
                <b>{item.healthScore}</b>
              </TrackedLink>
            ))}
          </div>
        </article>

        <article className="panel briefing-article">
          <p className="eyebrow">Stock Watch</p>
          <h2>個股 mock 觀察</h2>
          <p>
            個股摘要用於理解風險方向與模型限制。真實來源、資料新鮮度、完整覆蓋率與正式分數仍需後續 gate。
          </p>
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
        <h2>今天的閱讀節奏</h2>
        <div className="briefing-actions">
          <ActionCard title="先看市場" text="確認 TWII mock 訊號與資料新鮮度限制，不把 metadata 當成即時行情。" />
          <ActionCard title="再看風險" text="檢查高風險標的與缺值/延遲旗標，避免把資料缺口誤讀成模型結論。" />
          <ActionCard title="最後看方法" text="確認模型版本、partial coverage、非投資建議與公開停止線仍可見。" />
        </div>
      </section>

      <section className="panel briefing-links">
        <h2>下一步</h2>
        <TrackedLink className="text-link" eventName="briefing_link_clicked" href="/weekly" label="查看週報" payload={{ area: "next_steps" }}>
          查看週報
        </TrackedLink>
        <TrackedLink className="text-link" eventName="briefing_link_clicked" href="/methodology" label="查看方法說明" payload={{ area: "next_steps" }}>
          查看方法說明
        </TrackedLink>
        <TrackedLink
          className="text-link"
          eventName="briefing_link_clicked"
          href="/stocks/2330"
          label="查看 2330 mock 頁"
          payload={{ area: "next_steps", symbol: "2330" }}
        >
          查看 2330 mock 頁
        </TrackedLink>
        <TrackedLink className="text-link" eventName="briefing_link_clicked" href="/disclaimer" label="查看免責聲明" payload={{ area: "next_steps" }}>
          查看免責聲明
        </TrackedLink>
      </section>

      <article className="disclaimer">
        <h2>非投資建議</h2>
        <p>
          本晨報為 mock 模型摘要與資訊整理，不構成投資建議、買賣推薦、完整覆蓋率承諾或收益保證。
          所有分數仍需搭配個人風險承受度、資料新鮮度限制、缺值/延遲與模型限制判斷。
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
    <section className="briefing-executive-summary" aria-label="晨報重點摘要">
      <div>
        <p className="eyebrow">Market Briefing</p>
        <h1>市場訊號晨報</h1>
        <p>
          目前網站可用示範訊號閱讀市場方向、風險排序與產品流程。這不是即時市場資料，也不是投資建議；
          資料來源與分數來源仍是示範狀態，必須在公開頁面清楚揭露。
        </p>
      </div>
      <aside>
        <span>
          <b>目前可用</b>
          <i>{decisionSummary.userFacingNow}</i>
        </span>
        <span>
          <b>下一步</b>
          <i>{decisionSummary.subhead}</i>
        </span>
        <span>
          <b>停止線</b>
          <i>{decisionSummary.safetyStopLine}</i>
        </span>
        <span>
          <b>開發配置</b>
          <i>
            示範流程強化：示範流程強化 {runtimeInterpretation.laneRatio.mockRuntimeHardening}% /
            唯讀資料準備 {runtimeInterpretation.laneRatio.supabaseReadonlyPreparation}%
          </i>
        </span>
      </aside>
      <div className="briefing-runtime-action-strip" aria-label="晨報下一步與禁止升級">
        <article className="active">
          <span>目前進度</span>
          <strong>{decisionSummary.currentProgressPercent}%</strong>
          <p>{decisionSummary.stage}</p>
        </article>
        <article className="readying">
          <span>下一個檢查點</span>
          <strong>{decisionSummary.decisionLabel}</strong>
          <p>{decisionSummary.nextLift}</p>
        </article>
        <article className="blocked">
          <span>禁止升級</span>
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
          <small>mock composite {market.compositeScore}/100</small>
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
  const marketTone = market.riskScore >= 60 || breadth.defensive > breadth.constructive ? "hold" : "active";
  const riskTone = topRisk.riskScore >= 70 ? "blocked" : "hold";
  const concentrationTone = concentration.tone === "concentrated" ? "hold" : "active";

  return [
    {
      href: `/stocks/${market.asset.symbol}`,
      label: "市場",
      symbol: market.asset.symbol,
      text:
        marketTone === "active"
          ? `市場 composite ${market.compositeScore}/100，可用於 mock 閱讀流程，但不能視為真實投資訊號。`
          : `市場 risk ${market.riskScore}/100 偏高，請先檢查資料限制與風險揭露。`,
      title: marketTone === "active" ? "先看市場狀態" : "先檢查市場風險",
      tone: marketTone
    },
    {
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "風險",
      symbol: topRisk.asset.symbol,
      text: `${topRisk.asset.symbol} risk ${topRisk.riskScore}/100；這是 mock 風險排序，不是買賣建議。`,
      title: riskTone === "blocked" ? "高風險標的優先檢查" : "觀察風險升溫",
      tone: riskTone
    },
    {
      href: concentrationTone === "hold" ? "#market-structure" : "/weekly",
      label: "廣度",
      symbol: concentrationTone === "hold" ? "market-structure" : "weekly",
      text:
        concentrationTone === "hold"
          ? "市場廣度偏集中，請搭配 partial coverage 與 missing/delayed data 說明閱讀。"
          : "市場廣度較分散，可接續週報，但仍維持 mock-only 邊界。",
      title: concentrationTone === "hold" ? "檢查市場集中度" : "接續週報脈絡",
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
            <b>{valueKey === "risk" ? item.riskScore : item.compositeScore}</b>
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
        <h2>市場集中度</h2>
        <p>{concentration.message}</p>
      </div>
      <div className="concentration-metrics">
        <article>
          <span>領先族群</span>
          <strong>{concentration.leadingGroup}</strong>
          <b>{concentration.leadingScore}</b>
        </article>
        <article className={concentration.tone}>
          <span>正向占比</span>
          <strong>{concentration.constructiveShare}%</strong>
          <b>{concentration.tone === "balanced" ? "較分散" : "偏集中"}</b>
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
  const stockSnapshots = snapshots.filter((snapshot) => snapshot.asset.group !== "ETF");
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
      .sort((a, b) => b[1] - a[1])[0] ?? ["market", 0];
  const tone = constructiveShare >= 60 ? "balanced" : "concentrated";
  const message =
    tone === "balanced"
      ? "mock 訊號分布較分散，但仍需搭配資料新鮮度限制與模型邊界閱讀。"
      : "mock 訊號偏集中，使用者不應把集中度解讀成投資建議或完整市場結論。";

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
          title: "先讀市場方向",
          text: `${market.signal.title} 只代表 mock 閱讀狀態，不能視為真實市場訊號。`,
          tone: "active"
        }
      : {
          title: "先讀風險限制",
          text: `${market.signal.title} 需要搭配資料品質、缺值/延遲與模型限制判斷。`,
          tone: "blocked"
        };
  const focus =
    concentration.tone === "balanced"
      ? {
          title: "檢查市場廣度",
          text: `正向占比 ${concentration.constructiveShare}%，領先族群 ${concentration.leadingGroup}。這仍是 mock 結果。`,
          tone: "active"
        }
      : {
          title: "檢查集中風險",
          text: `正向占比 ${concentration.constructiveShare}%，領先族群 ${concentration.leadingGroup}；避免把集中度當成完整覆蓋率。`,
          tone: "hold"
        };
  const guardrail =
    breadth.defensive > breadth.constructive
      ? {
          title: "降低解讀信心",
          text: "風險升溫數量較多，公開文案必須保留 partial coverage 與 missing/delayed data 限制。",
          tone: "blocked"
        }
      : {
          title: "保留公開邊界",
          text: "即使 mock 訊號較穩，也不能宣稱真實資料、完整覆蓋率或投資建議。",
          tone: "hold"
        };

  return [
    { label: "方向", ...posture },
    { label: "廣度", ...focus },
    { label: "邊界", ...guardrail }
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
