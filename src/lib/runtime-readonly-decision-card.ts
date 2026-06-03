import {
  getSupabaseReadonlyDecision,
  type SupabaseReadonlyDecisionPacket
} from "@/lib/supabase-readonly-decision";
import {
  getSupabaseReadonlyExecutionPreview,
  type SupabaseReadonlyExecutionPreview
} from "@/lib/supabase-readonly-execution-preview";
import {
  getSupabaseReadonlyLocalPreflight,
  type SupabaseReadonlyLocalPreflight
} from "@/lib/supabase-readonly-local-preflight";

export type RuntimeReadonlyDecisionCard = {
  allowedLocalChecks: string[];
  automatedRemoteRun: false;
  blockedRemoteActions: string[];
  decisionState: "hold" | "ready_for_ceo_oral_review";
  displayBlockedRemoteActions: string[];
  displayDecisionState: string;
  displayHeadline: string;
  displayLocalChecks: string[];
  displayPostRunReviewRequirement: string;
  displayRequiredCeoWording: string;
  exactCommandPreview: string | null;
  headline: string;
  postRunReviewRequirement: string;
  requiredCeoWording: string;
  safetyLine: string;
  statusLine: string;
};

export function getRuntimeReadonlyDecisionCard(
  preflight: SupabaseReadonlyLocalPreflight = getSupabaseReadonlyLocalPreflight(),
  decision: SupabaseReadonlyDecisionPacket = getSupabaseReadonlyDecision(preflight),
  executionPreview: SupabaseReadonlyExecutionPreview = getSupabaseReadonlyExecutionPreview(decision)
): RuntimeReadonlyDecisionCard {
  const ready =
    preflight.status === "ready_for_guarded_readonly_decision" &&
    decision.status === "ready_for_ceo_decision" &&
    executionPreview.status === "ready_for_manual_ceo_run";

  return {
    allowedLocalChecks: [
      "local preflight",
      "readonly execution preview",
      "public runtime boundary checks",
      "full review gate",
      "production build"
    ],
    automatedRemoteRun: false,
    blockedRemoteActions: [
      "automatic Supabase connection",
      "SQL execution",
      "Supabase writes",
      "row payload printing",
      "publicDataSource=supabase",
      "scoreSource=real"
    ],
    decisionState: ready ? "ready_for_ceo_oral_review" : "hold",
    displayBlockedRemoteActions: [
      "自動連線 Supabase",
      "執行 SQL",
      "寫入 Supabase",
      "列印資料列內容",
      "公開資料來源升級",
      "真實評分來源"
    ],
    displayDecisionState: ready ? "可口頭審核，尚未執行" : "暫停，等待本機檢查完成",
    displayHeadline: ready
      ? "唯讀嘗試已在本機準備好，但仍需要 CEO 明確點名"
      : "唯讀嘗試仍暫停，需先完成本機預檢",
    displayLocalChecks: ["本機預檢", "唯讀執行預覽", "公開邊界檢查", "完整 review gate", "production build"],
    displayPostRunReviewRequirement:
      "若 CEO 之後明確點名一次唯讀嘗試，執行後必須先記錄去敏感化的回顧，才能討論任何狀態升級。",
    displayRequiredCeoWording:
      "CEO 必須明確說出只允許一次限定唯讀嘗試與確認代碼，才可以執行遠端命令。",
    exactCommandPreview: executionPreview.exactCommandPreview,
    headline: ready
      ? "Readonly attempt is locally prepared but still requires CEO oral naming"
      : "Readonly attempt remains on hold until local preflight is ready",
    postRunReviewRequirement:
      "After exactly one manually named readonly attempt, record a sanitized post-run review before any readiness or public-state change.",
    requiredCeoWording:
      "CEO must explicitly name one bounded Supabase readonly attempt and the confirmation token before any remote command is run.",
    safetyLine:
      "This card does not run Supabase, does not run SQL, does not ingest market data, and does not promote scoreSource=real.",
    statusLine: `preflight ${preflight.status}; decision ${decision.status}; execution preview ${executionPreview.status}.`
  };
}
