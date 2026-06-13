import type { Metadata } from "next";
import { BriefingPublicBetaGateSummary } from "@/components/briefing-public-beta-gate-summary";
import { BriefingPublicDecisionSummaryPanel } from "@/components/briefing-public-decision-summary-panel";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
import { PublicBetaMembershipMvpRoadmap } from "@/components/public-beta-membership-mvp-roadmap";
import { PublicBetaPublicStatusSurface } from "@/components/public-beta-public-status-surface";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
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
  title: "每日市場晨報",
  description: "公開 Beta 每日市場晨報，整理市場燈號、核心指標、風險提示與資料更新狀態。"
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
            <h1>每日市場晨報暫無資料</h1>
            <p>目前沒有可顯示的示範燈號。請稍後再試，或回首頁查看公開 Beta 狀態。</p>
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

      <section className="briefing-market-action-summary" aria-label="市場行動摘要">
        <div>
          <p className="eyebrow">Market Action Summary</p>
          <h2>{actionSummary.headline}</h2>
          <p>{actionSummary.marketLine}</p>
          <p>3 分鐘判斷順序：先看市場燈號，再看風險熱度，最後確認資料品質與更新時間。</p>
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
          <span>今日提醒</span>
          <strong>{alerts.length} 個觀察重點</strong>
          <p>
            使用提醒：每個警示都保留狀態、成因、更新時間、影響級別與下一步，
            避免只看單一分數做判斷。
          </p>
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
        <DecisionPill label="偏多" text={`${breadth.constructive} 個標的偏強`} tone="active" />
        <DecisionPill label="觀望" text={`${breadth.watch} 個標的需觀察`} tone="hold" />
        <DecisionPill label="防守" text={`${breadth.defensive} 個標的偏防守`} tone="blocked" />
      </section>

      <section className="briefing-summary">
        <article className="panel briefing-market-card">
          <div className="market-card-head">
            <div>
              <p className="panel-label">市場主燈號</p>
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
              <p>
                健康分數 {market.healthScore}/100，風險分數 {market.riskScore}/100。請把分數視為觀察排序，
                不要視為買賣訊號。
              </p>
            </div>
          </div>
        </article>
        <MetricPanel label="資料品質" value={market.dataQualityGrade} text={`資料品質 ${market.dataQualityScore}/100，目前仍是示範資料。`} />
        <MetricPanel label="更新時間" value={updatedAt} text="使用者應先確認資料日期與延遲狀態，再閱讀燈號。" />
        <MetricPanel label="資料邊界" value="示範資料" text="正式資料來源與完整授權未完成前，不顯示真實分數宣稱。" />
      </section>

      <section className="panel stock-reading-summary" aria-label="三分鐘判斷">
        <p className="eyebrow">3 分鐘行動判斷</p>
        <h2>3 分鐘內完成關注、加強觀察或降低風險的初步判斷</h2>
        <p>
          這裡不是交易建議，而是把市場燈號、風險熱度、ETF 狀態與資料品質排成固定閱讀流程，協助使用者避免資訊過載。
        </p>
        <div className="briefing-actions">
          <ActionCard title="市場燈號" text={`目前市場主燈號為 ${market.signal.title}，先確認是否仍適合關注。`} />
          <ActionCard title="風險成因" text={`${topRisk.asset.symbol} 風險分數為 ${topRisk.riskScore}/100，需檢查是否集中在單一族群。`} />
          <ActionCard title="ETF 觀察" text={`${topEtf.asset.symbol} 健康分數為 ${topEtf.healthScore}/100，可作為大盤觀察參考。`} />
          <ActionCard title="資料確認" text="若資料未更新或品質偏低，先降低判斷權重，等待下一次資料更新。" />
        </div>
      </section>

      <section className="weekly-grid">
        <BriefingList title="偏強觀察" description="分數較高的標的可作為市場熱點觀察清單。" items={strongest} valueKey="composite" />
        <BriefingList title="風險觀察" description="風險分數較高的標的需先檢查成因與資料品質。" items={heated} valueKey="risk" />
      </section>

      <nav aria-label="晨報閱讀路徑" className="experience-flow-nav">
        <span>閱讀路徑</span>
        <TrackedLink eventName="briefing_link_clicked" href="/" label="市場總覽" payload={{ area: "experience_flow", target: "home" }}>
          市場總覽
        </TrackedLink>
        <TrackedLink
          eventName="briefing_link_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="指數細節"
          payload={{ area: "experience_flow", symbol: market.asset.symbol }}
        >
          指數細節
        </TrackedLink>
        <TrackedLink eventName="briefing_link_clicked" href="/weekly" label="週報" payload={{ area: "experience_flow", target: "weekly" }}>
          週報
        </TrackedLink>
        <TrackedLink eventName="briefing_link_clicked" href="/methodology" label="方法說明" payload={{ area: "experience_flow", target: "methodology" }}>
          方法說明
        </TrackedLink>
        <TrackedLink eventName="briefing_link_clicked" href="/disclaimer" label="風險聲明" payload={{ area: "experience_flow", target: "disclaimer" }}>
          風險聲明
        </TrackedLink>
      </nav>

      <PublicBetaPublicStatusSurface />
      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicBetaDataReadinessStatus />
      <PublicBetaSourceCoverageBridge context="briefing" />
      <PublicBetaMembershipMvpRoadmap />
      <BriefingPublicBetaGateSummary />

      <article className="disclaimer">
        <h2>重要提醒</h2>
        <p>本頁為公開 Beta 示範，不提供個股買賣建議、不承諾投資結果，也不代替使用者做投資決策。</p>
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
      cause: marketNeedsCaution ? "市場風險分數偏高，或防守標的多於偏強標的。" : "市場主燈號仍有支撐，但需確認資料品質。",
      href: `/stocks/${market.asset.symbol}`,
      impact: marketNeedsCaution ? "中高" : "中",
      next: marketNeedsCaution ? "先看風險來源，再決定是否降低曝險。" : "保持觀察，並追蹤下一次更新。",
      status: marketNeedsCaution ? "加強觀察" : "可先關注",
      symbol: market.asset.symbol,
      title: `${market.asset.symbol} ${market.asset.name}`,
      tone: marketNeedsCaution ? "hold" : "active"
    },
    {
      cause: `${topRisk.asset.symbol} 風險分數為 ${topRisk.riskScore}/100。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      impact: topRiskElevated ? "高" : "中",
      next: "檢查風險是否集中在估值、趨勢或資料品質。",
      status: topRiskElevated ? "風險升溫" : "持續觀察",
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
