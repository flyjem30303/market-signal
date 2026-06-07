import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import { getFreshnessEvidenceBoundarySummary } from "@/lib/freshness-evidence-boundary";
import { getFreshnessRuntimeOperationDecisionSummary } from "@/lib/freshness-runtime-operation-decision";

type FreshnessEvidenceBoundaryProps = {
  freshness: DataFreshnessSnapshot;
};

export function FreshnessEvidenceBoundary({ freshness }: FreshnessEvidenceBoundaryProps) {
  const boundary = getFreshnessEvidenceBoundarySummary(freshness);
  const operationDecision = getFreshnessRuntimeOperationDecisionSummary(freshness);

  return (
    <section className="freshness-evidence-boundary" aria-label="新鮮度證據邊界">
      <div>
        <span>證據邊界</span>
        <strong>{boundary.headline}</strong>
        <p>{boundary.summary}</p>
      </div>
      {boundary.items.map((item) => (
        <article className={item.tone} key={item.label}>
          <span>{item.label}</span>
          <strong>{formatFreshnessRuntimeValue(item.value)}</strong>
          <p>{item.body}</p>
        </article>
      ))}
      <p className="freshness-evidence-stop-line">{boundary.stopLine}</p>
      <div className="freshness-operation-decision" aria-label="新鮮度操作決策">
        <div>
          <span>操作決策</span>
          <strong>{operationDecision.headline}</strong>
          <p>{operationDecision.nextAction}</p>
        </div>
        {operationDecision.decisions.map((decision) => (
          <article className={decision.state} key={decision.label}>
            <span>{decision.label}</span>
            <strong>{formatFreshnessRuntimeValue(decision.value)}</strong>
            <p>{decision.body}</p>
          </article>
        ))}
        <p className="freshness-operation-stop-line">{operationDecision.stopLine}</p>
      </div>
      <div className="freshness-readonly-candidate-card" aria-label="新鮮度唯讀候選檢查">
        <div>
          <span>唯讀候選</span>
          <strong>{operationDecision.attemptCandidate.headline}</strong>
          <p>這只是前置摘要，不能執行遠端讀取，也不能改變公開資料來源模式。</p>
        </div>
        {operationDecision.attemptCandidate.items.map((item) => (
          <article className={item.state} key={item.label}>
            <span>{item.label}</span>
            <strong>{formatFreshnessRuntimeValue(item.value)}</strong>
            <p>{item.body}</p>
          </article>
        ))}
        <p className="freshness-readonly-candidate-stop-line">{operationDecision.attemptCandidate.stopLine}</p>
      </div>
      <div className="freshness-route-summary" aria-label="新鮮度路線選擇摘要">
        <div>
          <span>路線選擇</span>
          <strong>{operationDecision.routeSummary.headline}</strong>
          <p>預設：{formatFreshnessRuntimeValue(operationDecision.routeSummary.defaultRoute)}</p>
        </div>
        {operationDecision.routeSummary.options.map((option) => (
          <article className={option.state} key={option.label}>
            <span>{option.label}</span>
            <strong>{formatFreshnessRuntimeValue(option.value)}</strong>
            <p>{option.body}</p>
          </article>
        ))}
        <p className="freshness-route-stop-line">{operationDecision.routeSummary.stopLine}</p>
      </div>
    </section>
  );
}

function formatFreshnessRuntimeValue(value: string) {
  const labels: Record<string, string> = {
    blocked: "仍被阻擋",
    bounded_readonly_attempt_candidate: "有範圍的唯讀候選",
    candidate_only: "僅為候選",
    data_quality_not_approved: "資料品質尚未核准",
    metadata_mock: "示範 metadata",
    mock_runtime_hardening: "示範流程強化",
    mock: "示範分數",
    object_reachability_accepted: "後端物件可讀性已接受",
    not_approved: "尚未核准",
    required_before_promotion: "升級前必須完成",
    separate_ceo_named_action_required: "需要 CEO 另行命名"
  };

  return labels[value] ?? value;
}
