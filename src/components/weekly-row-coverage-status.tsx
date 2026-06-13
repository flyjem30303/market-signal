import { RowCoverageReadinessPanel } from "@/components/row-coverage-readiness-panel";

export function WeeklyRowCoverageStatus() {
  return (
    <RowCoverageReadinessPanel
      ariaLabel="週報資料覆蓋狀態"
      className="weekly-row-coverage-status"
      eyebrow="資料覆蓋狀態"
      openItemSuffix="待補齊"
      summary="週報目前用示範資料呈現公開閱讀流程；正式市場資料、資料覆蓋率與更新流程仍在驗證。"
    />
  );
}
