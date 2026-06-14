import { buildBriefingPublicDecisionSummary } from "@/lib/briefing-public-decision-summary";
import type { SignalSnapshot } from "@/lib/signal-model";

type BriefingPublicDecisionSummaryPanelProps = {
  breadth: { constructive: number; defensive: number; watch: number };
  market: SignalSnapshot;
  topRisk: SignalSnapshot;
};

export function BriefingPublicDecisionSummaryPanel({
  breadth,
  market,
  topRisk
}: BriefingPublicDecisionSummaryPanelProps) {
  const summary = buildBriefingPublicDecisionSummary(market, topRisk, breadth);
  const alertTone = summary.alert.impactLevel === "高" || summary.alert.impactLevel === "中" ? "blocked" : "readying";

  return (
    <section className="briefing-public-decision-summary" aria-label="市場晨報決策摘要">
      <div>
        <p className="eyebrow">每日市場晨報</p>
        <h1>{summary.headline}</h1>
        <p>{summary.quickRead}</p>
        <p>{summary.nextObservation}</p>
      </div>
      <article className="active">
        <span>市場狀態</span>
        <strong>{summary.marketMood}</strong>
        <p>{summary.boundaryLine}</p>
      </article>
      <article className={alertTone}>
        <span>{summary.alert.status}</span>
        <strong>{summary.alert.title}</strong>
        <p>{summary.alert.cause}</p>
        <p>
          更新時間：{summary.alert.updatedAt}；影響級別：{summary.alert.impactLevel}
        </p>
        <p>下一步：{summary.alert.nextStep}</p>
      </article>
    </section>
  );
}
