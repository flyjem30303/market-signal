import { RowCoverageReadinessPanel } from "@/components/row-coverage-readiness-panel";

export function WeeklyRowCoverageStatus() {
  return (
    <RowCoverageReadinessPanel
      ariaLabel="週報資料覆蓋狀態"
      className="weekly-row-coverage-status"
      eyebrow="資料覆蓋狀態"
      openItemSuffix="項待補"
      summary="週報目前仍以示範資料呈現閱讀流程；真實資料上線前，會先補齊覆蓋率、來源權利與品質檢查，publicDataSource 與 scoreSource 都維持 mock。"
    />
  );
}
