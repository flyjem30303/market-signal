import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import { getFreshnessEvidenceBoundarySummary } from "@/lib/freshness-evidence-boundary";
import { getFreshnessInterpretationSummary } from "@/lib/freshness-interpretation";
import { getSupabaseReadonlyEvidenceSummary } from "@/lib/supabase-readonly-evidence";

export type FreshnessRuntimeOperationDecisionSummary = {
  attemptCandidate: {
    headline: string;
    items: Array<{
      body: string;
      label: string;
      state: "ready" | "hold" | "blocked";
      value: string;
    }>;
    stopLine: string;
  };
  routeSummary: {
    defaultRoute: string;
    headline: string;
    options: Array<{
      body: string;
      label: string;
      state: "active" | "optional" | "blocked";
      value: string;
    }>;
    stopLine: string;
  };
  headline: string;
  decisions: Array<{
    body: string;
    label: string;
    state: "allowed" | "candidate" | "blocked";
    value: string;
  }>;
  nextAction: string;
  stopLine: string;
  summary: string;
};

export function getFreshnessRuntimeOperationDecisionSummary(
  freshness: DataFreshnessSnapshot
): FreshnessRuntimeOperationDecisionSummary {
  const evidenceBoundary = getFreshnessEvidenceBoundarySummary(freshness);
  const interpretation = getFreshnessInterpretationSummary();
  const readonlyEvidence = getSupabaseReadonlyEvidenceSummary();
  const canExplainDisplayState = freshness.scoreSource === "mock" && freshness.isMock;
  const canPrepareReadonlyAttempt =
    readonlyEvidence.evidenceStatus === "object_reachability_accepted" &&
    interpretation.dataQualityApproval === "not_approved";

  return {
    attemptCandidate: {
      headline: canPrepareReadonlyAttempt
        ? "唯讀嘗試候選可在本地討論"
        : "唯讀嘗試候選仍暫停",
      items: [
        {
          body: readonlyEvidence.acceptedScope,
          label: "證據基礎",
          state: canPrepareReadonlyAttempt ? "ready" : "hold",
          value: readonlyEvidence.evidenceStatus
        },
        {
          body: "目前不會從公開頁自動讀取遠端資料；下一次資料檢查必須先完成範圍與安全條件。",
          label: "遠端資料檢查",
          state: "hold",
          value: "manual_scope_required"
        },
        {
          body: "任何準備度、公開狀態或分數變更前，都必須先確認結果不含密鑰、原始資料或逐列內容。",
          label: "結果安全檢查",
          state: "blocked",
          value: "required_before_promotion"
        }
      ],
      stopLine:
        "這張候選卡不連線遠端、不檢查資料列、不修改資料，也不升級正式分數。"
    },
    routeSummary: {
      defaultRoute: "mock_runtime_hardening",
      headline: "公開頁下一步路線",
      options: [
        {
          body: "在公開來源與分數仍為示範狀態時，繼續改善可讀性、揭露、失敗關閉行為與本地檢查。",
          label: "預設路線",
          state: "active",
          value: "mock_runtime_hardening"
        },
        {
          body: "等資料範圍、來源權利、回讀與回退條件都清楚後，才可安排下一次有範圍的資料檢查。",
          label: "資料檢查路線",
          state: canPrepareReadonlyAttempt ? "optional" : "blocked",
          value: "bounded_readonly_attempt_candidate"
        },
        {
          body: "任一路線都不得直接升級公開資料來源、覆蓋率、資料品質、模型可信度或正式分數。",
          label: "升級路線",
          state: "blocked",
          value: "blocked"
        }
      ],
      stopLine:
        "路線選擇只是指引，不得執行遠端讀取、SQL、寫入、資料匯入或正式分數升級。"
    },
    headline: "Runtime 操作決策",
    decisions: [
      {
        body: canExplainDisplayState
          ? "公開狀態維持示範揭露，新鮮度 metadata 只說明顯示狀態。"
          : "只有在分數仍為示範且狀態不暗示正式資料時，才顯示新鮮度 metadata。",
        label: "示範揭露",
        state: "allowed",
        value: canExplainDisplayState ? "allowed" : "guarded"
      },
      {
        body: canPrepareReadonlyAttempt
          ? "後端可讀性可支撐下一次有範圍的資料檢查候選，但仍不能改變公開資料狀態。"
          : "在可讀性與結果安全條件明確前，資料檢查準備仍被阻擋。",
        label: "資料檢查候選",
        state: canPrepareReadonlyAttempt ? "candidate" : "blocked",
        value: canPrepareReadonlyAttempt ? "candidate_only" : "blocked"
      },
      {
        body: interpretation.stopLine,
        label: "正式分數模式",
        state: "blocked",
        value: interpretation.scoreSource
      }
    ],
    nextAction:
      "只能繼續強化示範閱讀流程，或準備下一次有範圍的資料檢查；不得從公開頁執行遠端讀取。",
    stopLine:
      "任何 runtime 操作決策都不得觸發 SQL、Supabase 寫入、市場資料匯入、公開來源升級或正式分數升級。",
    summary: evidenceBoundary.summary
  };
}
