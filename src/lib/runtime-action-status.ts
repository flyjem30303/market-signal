import { getRuntimeExecutionReadinessSummary } from "@/lib/runtime-execution-readiness-summary";
import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";

export type RuntimeActionStatusId = "mock_only" | "readying" | "blocked" | "oral_decision_ready";

export type RuntimeActionStatusItem = {
  allowedAction: string;
  blockedAction: string;
  detail: string;
  id: RuntimeActionStatusId;
  label: string;
  nextGate: string;
  owner: "Product" | "Data";
  tone: "active" | "blocked" | "readying";
};

export type RuntimeActionStatusSummary = {
  headline: string;
  mode: "runtime_action_status_normalization";
  nextAction: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  statuses: RuntimeActionStatusItem[];
  stopLine: string;
};

export function getRuntimeActionStatusSummary(): RuntimeActionStatusSummary {
  const readiness = getRuntimeReadinessSummary();
  const executionReadiness = getRuntimeExecutionReadinessSummary();

  return {
    headline: "公開頁目前能做與不能做",
    mode: "runtime_action_status_normalization",
    nextAction: "先把示範訊號說清楚，再補齊資料來源、覆蓋率、品質與升級條件。",
    publicDataSource: executionReadiness.publicDataSource,
    scoreSource: executionReadiness.scoreSource,
    statuses: [
      {
        allowedAction: "維持公開頁可瀏覽、可理解，並清楚標示示範資料與示範分數。",
        blockedAction: "不能暗示即時行情、正式分數、完整覆蓋或投資級決策支援。",
        detail: "目前可呈現示範訊號、風險方向、產品流程與揭露狀態。",
        id: "mock_only",
        label: "示範閱讀",
        nextGate: "產品閱讀體驗強化",
        owner: "Product",
        tone: "active"
      },
      {
        allowedAction: "整理來源、覆蓋率、品質與回退證據，讓 PM 能判斷下一段升級條件。",
        blockedAction: "不能把準備中的證據直接說成正式資料已上線。",
        detail: `${readiness.score}% 準備度；欄位、資料新鮮度與覆蓋率解讀仍在準備中。`,
        id: "readying",
        label: "資料準備",
        nextGate: "資料覆蓋與品質檢查",
        owner: "Product",
        tone: "readying"
      },
      {
        allowedAction: "可以說明正式資料尚未啟用，以及還缺哪些證據。",
        blockedAction: "不執行資料庫寫入、不匯入市場資料、不切換正式資料來源。",
        detail: "公開資料來源、正式分數、完整覆蓋與投資建議都仍未啟用。",
        id: "blocked",
        label: "升級鎖住",
        nextGate: "合法來源與覆蓋率驗證",
        owner: "Data",
        tone: "blocked"
      },
      {
        allowedAction: "CEO/PM 可用口頭決策收斂下一個可執行檢查，但仍需保留紀錄。",
        blockedAction: "不能用口頭決策跳過資料來源、品質、覆蓋率或公開揭露條件。",
        detail: "決策權可加速流程，但不能把未驗證資料升級成正式訊號。",
        id: "oral_decision_ready",
        label: "決策可收斂",
        nextGate: "下一段資料升級決策",
        owner: "Data",
        tone: "readying"
      }
    ],
    stopLine:
      "正式資料、正式分數、完整覆蓋與投資建議未啟用前，公開頁只能以示範資料與示範分數呈現。"
  };
}
