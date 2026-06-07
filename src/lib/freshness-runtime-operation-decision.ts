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
          body: "任何遠端命令前，仍需要 CEO 另行命名的動作與確認代碼。",
          label: "執行觸發",
          state: "hold",
          value: "separate_ceo_named_action_required"
        },
        {
          body: "任何準備度、公開狀態或分數變更前，都必須先記錄去識別化執行後覆核。",
          label: "執行後覆核",
          state: "blocked",
          value: "required_before_promotion"
        }
      ],
      stopLine:
        "這張候選卡不連線遠端、不檢查資料列、不修改資料，也不升級正式分數。"
    },
    routeSummary: {
      defaultRoute: "mock_runtime_hardening",
      headline: "PM 路線選擇摘要",
      options: [
        {
          body: "在公開來源與分數仍為示範狀態時，繼續改善可讀性、揭露、失敗關閉行為與本地檢查。",
          label: "預設路線",
          state: "active",
          value: "mock_runtime_hardening"
        },
        {
          body: "只有在 CEO 另行命名一次有範圍的唯讀嘗試、具備確認代碼並承諾立即去識別化執行後覆核時才可使用。",
          label: "可選路線",
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
          ? "唯讀可讀性可支撐另行核准的 bounded attempt 候選，之後仍需 post-run review。"
          : "在可讀性與 post-run guardrail 明確前，唯讀嘗試準備仍被阻擋。",
        label: "唯讀嘗試",
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
      "只能準備 bounded readonly-attempt 決策候選，或繼續示範流程強化；不得從這個 UI 狀態執行遠端讀取。",
    stopLine:
      "任何 runtime 操作決策都不得觸發 SQL、Supabase 寫入、市場資料匯入、公開來源升級或正式分數升級。",
    summary: evidenceBoundary.summary
  };
}
