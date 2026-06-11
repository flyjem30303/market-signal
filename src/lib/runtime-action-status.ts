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
    headline: "公開頁狀態維持示範閱讀模式",
    mode: "runtime_action_status_normalization",
    nextAction:
      "目前可閱讀市場氛圍、風險方向與資料邊界；正式資料升級仍需獨立檢查。",
    publicDataSource: executionReadiness.publicDataSource,
    scoreSource: executionReadiness.scoreSource,
    statuses: [
      {
        allowedAction: "Keep public pages navigable, readable, and explicitly mock-only.",
        blockedAction: "Do not imply live data, real score, or investment-grade decision support.",
        detail: "Public pages may show mock signals, product flow, risk direction, and disclosure state.",
        id: "mock_only",
        label: "Mock-only runtime",
        nextGate: "Runtime UX hardening",
        owner: "Product",
        tone: "active"
      },
      {
        allowedAction: "整理資料結構、新鮮度與覆蓋率說明，讓使用者知道目前可信度。",
        blockedAction: "不能從未補齊的證據宣稱完整覆蓋或正式資料。",
        detail: `${readiness.score}% runtime readiness; schema, freshness, and row coverage interpretation are still being prepared.`,
        id: "readying",
        label: "資料證據準備中",
        nextGate: "資料品質與覆蓋率檢查",
        owner: "Product",
        tone: "readying"
      },
      {
        allowedAction: "說明為什麼正式資料尚未啟用，以及還缺哪些證據。",
        blockedAction: "No SQL, Supabase writes, ingestion, real score, or public Supabase source promotion.",
        detail: "Supabase writes, SQL, market-data ingestion, publicDataSource=supabase, scoreSource=real, and investment-grade claims remain blocked.",
        id: "blocked",
        label: "正式資料升級尚未開放",
        nextGate: "資料品質接受條件",
        owner: "Data",
        tone: "blocked"
      },
      {
        allowedAction: "下一次資料檢查必須先限定範圍、欄位、輸出與停止條件。",
        blockedAction: "不自動執行遠端讀取、不廣泛探查、不跑 SQL、不匯入市場資料。",
        detail:
          "資料檢查只能作為升級前證據，不能直接改變公開資料來源或分數來源。",
        id: "oral_decision_ready",
        label: "下一次資料檢查需另行限定",
        nextGate: "有範圍的資料檢查",
        owner: "Data",
        tone: "readying"
      }
    ],
    stopLine:
      "Status normalization does not execute Supabase, run SQL, write data, fetch market data, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
  };
}
