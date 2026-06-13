import type { Metadata } from "next";
import { BriefingPublicDecisionSummaryPanel } from "@/components/briefing-public-decision-summary-panel";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
import { PublicBetaMembershipMvpRoadmap } from "@/components/public-beta-membership-mvp-roadmap";
import { PublicBetaPublicStatusSurface } from "@/components/public-beta-public-status-surface";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicBetaUsableLoopPanel } from "@/components/public-beta-usable-loop-panel";
import { TrackedLink } from "@/components/tracked-link";
import { buildBriefingMarketActionSummary } from "@/lib/briefing-market-action-summary";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

type Tone = "active" | "hold" | "blocked";

export const metadata: Metadata = {
  title: "市場簡報",
  description: "公開 Beta 市場簡報，用 30 秒摘要與 3 分鐘觀察順序整理市場燈號、核心風險、資料可信度與非投資建議邊界。"
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
            <p className="eyebrow">市場簡報</p>
            <h1>目前沒有可閱讀的市場資料</h1>
            <p>請稍後再試；當資料無法載入時，本站不會用過期資訊替代正式判斷。</p>
          </div>
        </section>
      </main>
    );
  }

  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshots[0];
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const heated = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore).slice(0, 4);
  const breadth = buildMarketBreadth(snapshots);
  const topRisk = heated[0] ?? market;
  const etfs = snapshots.filter((item) => item.asset.group === "ETF").sort((a, b) => b.healthScore - a.healthScore);
  const topEtf = etfs[0] ?? market;
  const actionSummary = buildBriefingMarketActionSummary(market, topRisk, breadth);
  const alerts = buildBriefingAlerts(market, topRisk, breadth);
  const updatedAt = formatTaipeiTime(market.lastUpdatedAt);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="briefing_page_viewed" payload={{ page: "briefing" }} />
      <BriefingPublicDecisionSummaryPanel breadth={breadth} market={market} topRisk={topRisk} />

      <section className="panel stock-reading-summary" aria-label="市場簡報閱讀順序">
        <p className="eyebrow">每日市場晨報</p>
        <h2>30 秒看市場狀態，3 分鐘行動判斷</h2>
        <p>
          市場簡報把市場燈號、主要風險、更新時間與下一步觀察整理在同一頁，也提供公開使用狀態。使用提醒：使用者先看市場氣氛處於偏多、觀望、警戒或高風險，
          再依 3 分鐘判斷順序複核成因與資料可信度。正式市場資料尚未啟用前，所有數字都會保留示範資料提示。
        </p>
        <div className="briefing-actions">
          <ActionCard title="30 秒閱讀" text={`目前市場燈號為「${market.signal.title}」，先用它建立今天的市場背景。`} />
          <ActionCard
            title="3 分鐘判斷順序"
            text={`市場廣度：${breadth.constructive} 個偏建設性、${breadth.watch} 個觀察中、${breadth.defensive} 個偏防守。`}
          />
          <ActionCard title="資料更新" text={`目前更新時間：${updatedAt}。正式資料上線前，頁面會保留示範資料標示。`} />
          <ActionCard title="偏強觀察" text={`先看相對偏強標的是否還能支撐市場，再檢查 ${topRisk.asset.symbol} 是否屬於風險較高名單。`} />
        </div>
      </section>

      <section className="briefing-market-action-summary" aria-label="市場行動摘要">
        <div>
          <p className="eyebrow">市場行動摘要</p>
          <h2>{actionSummary.headline}</h2>
          <p>{actionSummary.marketLine}</p>
          <p>這不是買賣建議；它只是把目前市場狀態整理成可複核的觀察順序。</p>
          <p>{actionSummary.stopLine}</p>
        </div>
        <TrackedLink
          className={actionSummary.primary.tone}
          eventName="briefing_link_clicked"
          href={actionSummary.primary.href}
          label={actionSummary.primary.title}
          payload={{ area: "briefing_market_action_primary", symbol: actionSummary.primary.symbol }}
        >
          <span>{actionSummary.primary.label}</span>
          <strong>{actionSummary.primary.title}</strong>
          <p>{actionSummary.primary.body}</p>
        </TrackedLink>
        <TrackedLink
          className={actionSummary.secondary.tone}
          eventName="briefing_link_clicked"
          href={actionSummary.secondary.href}
          label={actionSummary.secondary.title}
          payload={{ area: "briefing_market_action_secondary", symbol: actionSummary.secondary.symbol }}
        >
          <span>{actionSummary.secondary.label}</span>
          <strong>{actionSummary.secondary.title}</strong>
          <p>{actionSummary.secondary.body}</p>
        </TrackedLink>
      </section>

      <section className="home-public-beta-layers briefing-alert-decision-list" aria-label="警示清單">
        <div className="home-public-beta-layer alerts">
          <span>警示清單</span>
          <strong>{alerts.length} 個觀察重點</strong>
          <p>每個警示都包含狀態、成因、更新時間、影響級別與下一步，避免只看單一分數。</p>
        </div>
        <div className="home-public-beta-alert-list">
          {alerts.map((alert) => (
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
                  <dd>{updatedAt}</dd>
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

      <section className="briefing-decision-strip" aria-label="市場廣度">
        <DecisionPill label="偏多" text={`${breadth.constructive} 個標的`} tone="active" />
        <DecisionPill label="觀察" text={`${breadth.watch} 個標的`} tone="hold" />
        <DecisionPill label="防守" text={`${breadth.defensive} 個標的`} tone="blocked" />
      </section>

      <section className="briefing-summary">
        <article className="panel briefing-market-card">
          <div className="market-card-head">
            <div>
              <p className="panel-label">市場總覽</p>
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
              <b>綜合分數</b>
              <p>健康分數 {market.healthScore}/100，風險分數 {market.riskScore}/100。正式資料上線前，此分數仍屬示範模型。</p>
            </div>
          </div>
        </article>
        <MetricPanel label="資料品質" value={market.dataQualityGrade} text={`資料品質 ${market.dataQualityScore}/100，仍需正式來源與覆蓋率檢查。`} />
        <MetricPanel label="更新時間" value={updatedAt} text="頁面會明確顯示資料更新時間，避免使用者把過期資料當成最新狀態。" />
        <MetricPanel label="資料狀態" value="示範資料" text="正式資料來源、欄位契約與覆蓋率完成前，公開頁保持示範資料標示。" />
      </section>

      <section className="panel stock-reading-summary" aria-label="三層市場解讀">
        <p className="eyebrow">三層市場解讀</p>
        <h2>先看市場，再看風險，最後看資料可信度</h2>
        <p>
          這是公開 Beta 的核心閱讀方式：先用市場總覽建立背景，再找出最需要注意的風險標的，最後回到資料更新與使用邊界。
        </p>
        <div className="briefing-actions">
          <ActionCard title="市場燈號" text={`目前市場總覽為「${market.signal.title}」。`} />
          <ActionCard title="最高風險" text={`${topRisk.asset.symbol} 風險分數 ${topRisk.riskScore}/100。`} />
          <ActionCard title="ETF 觀察" text={`${topEtf.asset.symbol} 健康分數 ${topEtf.healthScore}/100。`} />
          <ActionCard title="資料邊界" text="目前仍為示範資料，不提供個股買賣建議。" />
        </div>
      </section>

      <section className="weekly-grid">
        <BriefingList title="相對強勢觀察" description="綜合分數較高的標的，可用來觀察市場是否仍有支撐。" items={strongest} valueKey="composite" />
        <BriefingList title="風險升溫觀察" description="風險分數較高的標的，適合先複核成因與資料狀態。" items={heated} valueKey="risk" />
      </section>

      <nav aria-label="簡報導覽" className="experience-flow-nav">
        <span>繼續閱讀</span>
        <TrackedLink eventName="briefing_link_clicked" href="/" label="市場總覽" payload={{ area: "experience_flow", target: "home" }}>
          市場總覽
        </TrackedLink>
        <TrackedLink
          eventName="briefing_link_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="指數頁"
          payload={{ area: "experience_flow", symbol: market.asset.symbol }}
        >
          指數頁
        </TrackedLink>
        <TrackedLink eventName="briefing_link_clicked" href="/weekly" label="週報" payload={{ area: "experience_flow", target: "weekly" }}>
          週報
        </TrackedLink>
        <TrackedLink eventName="briefing_link_clicked" href="/methodology" label="方法說明" payload={{ area: "experience_flow", target: "methodology" }}>
          方法說明
        </TrackedLink>
        <TrackedLink eventName="briefing_link_clicked" href="/disclaimer" label="免責聲明" payload={{ area: "experience_flow", target: "disclaimer" }}>
          免責聲明
        </TrackedLink>
      </nav>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicBetaPublicStatusSurface />
      <PublicBetaDataReadinessStatus />
      <PublicBetaSourceCoverageBridge context="briefing" stockSymbol={market.asset.symbol} />
      <PublicBetaUsableLoopPanel context="briefing" stockSymbol={market.asset.symbol} />

      <section className="panel stock-reading-summary" aria-label="產品階段規劃">
        <p className="eyebrow">會員路線</p>
        <h2>免費頁先讓所有人看懂市場，會員內容留到下一階段</h2>
        <p>
          第一階段先完成市場總覽燈號、核心指標、風險提示、更新時間與資料可信度揭露。
          會員內容會作為下一階段產品路線：每日三層解讀、watchlist、自訂警示與盤後複盤。
        </p>
        <div className="briefing-actions">
          <ActionCard title="免費市場總覽" text="讓一般使用者快速理解市場目前偏多、觀望、警戒或高風險。" />
          <ActionCard title="會員 MVP 路線" text="規劃每日市場三層解讀、watchlist、自訂警示與盤後複盤，不阻塞公開 Beta。" />
          <ActionCard title="資料升級條件" text="資料來源、欄位契約、覆蓋率與回補通過後，才逐步升級正式資料。" />
        </div>
      </section>

      <PublicBetaMembershipMvpRoadmap />

      <article className="disclaimer">
        <h2>風險提醒</h2>
        <p>本站是市場資訊整理、風險辨識與觀察輔助工具，不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。</p>
      </article>
    </main>
  );
}

function buildBriefingAlerts(
  market: SignalSnapshot,
  topRisk: SignalSnapshot,
  breadth: ReturnType<typeof buildMarketBreadth>
) {
  const marketNeedsCaution = market.riskScore >= 60 || breadth.defensive > breadth.constructive;
  const topRiskElevated = topRisk.riskScore >= 70;

  return [
    {
      cause: marketNeedsCaution ? "市場風險分數偏高或防守標的增加。" : "市場狀態相對穩定，但仍需確認資料狀態。",
      href: `/stocks/${market.asset.symbol}`,
      impact: marketNeedsCaution ? "中高" : "低",
      next: marketNeedsCaution ? "先檢查風險成因，再決定是否降低風險。" : "維持觀察並追蹤下一次更新。",
      status: marketNeedsCaution ? "需要觀察" : "可閱讀",
      symbol: market.asset.symbol,
      title: `${market.asset.symbol} ${market.asset.name}`,
      tone: marketNeedsCaution ? "hold" : "active"
    },
    {
      cause: `${topRisk.asset.symbol} 風險分數 ${topRisk.riskScore}/100。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      impact: topRiskElevated ? "高" : "中",
      next: "閱讀該標的的成因、更新時間與資料邊界。",
      status: topRiskElevated ? "高風險" : "風險觀察",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} ${topRisk.asset.name}`,
      tone: topRiskElevated ? "blocked" : "hold"
    }
  ] as Array<{
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

function formatTaipeiTime(value: string) {
  return value.replace("T", " ").replace("+08:00", " 台北時間");
}

function DecisionPill({ label, text, tone }: { label: string; text: string; tone: Tone }) {
  return (
    <article className={tone}>
      <span>{label}</span>
      <strong>{text}</strong>
    </article>
  );
}

function MetricPanel({ label, text, value }: { label: string; text: string; value: string }) {
  return (
    <article className="panel metric-panel">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{text}</p>
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
            payload={{ area: valueKey === "composite" ? "strong_watch" : "risk_watch", symbol: item.asset.symbol }}
          >
            <strong>{item.asset.symbol}</strong>
            <span>{item.asset.name}</span>
            <b>{valueKey === "composite" ? item.compositeScore : item.riskScore}</b>
          </TrackedLink>
        ))}
      </div>
    </article>
  );
}

function ActionCard({ text, title }: { text: string; title: string }) {
  return (
    <article>
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}
