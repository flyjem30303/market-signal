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
  displayAutomatedRunLine: string;
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
    displayAutomatedRunLine: "自動遠端執行：關閉。任何 Supabase readonly 嘗試都必須由 CEO 另行命名一次 bounded action。",
    displayBlockedRemoteActions: [
      "自動連線 Supabase",
      "執行 SQL",
      "寫入 Supabase",
      "列印 row payload",
      "公開資料來源切到 supabase",
      "分數來源切到 real"
    ],
    displayDecisionState: ready ? "可進入 CEO 口頭覆核" : "暫停，等待本地預檢完成",
    displayHeadline: ready
      ? "Readonly attempt 已在本地準備完成，但仍需要 CEO 口頭命名後才能執行。"
      : "Readonly attempt 仍暫停；PM 需先完成本地預檢與 guard checks。",
    displayLocalChecks: ["本地預檢", "唯讀命令預覽", "公開 mock 邊界檢查", "完整 review gate", "production build"],
    displayPostRunReviewRequirement:
      "若 CEO 另行命名一次 readonly attempt，執行後必須先記錄 sanitized post-run review，才能討論任何 readiness 或公開狀態變更。",
    displayRequiredCeoWording:
      "CEO 必須明確說出只允許一次 bounded Supabase readonly attempt，並確認不包含 SQL、寫入、資料匯入、row payload 或 scoreSource=real。",
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
