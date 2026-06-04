import { RowCoverageReadinessPanel } from "@/components/row-coverage-readiness-panel";

export function WeeklyRowCoverageStatus() {
  return (
    <RowCoverageReadinessPanel
      ariaLabel="週報資料列覆蓋準備度"
      className="weekly-row-coverage-status"
      eyebrow="資料列覆蓋關卡"
      openItemSuffix="筆資料待補"
      summary="週報只呈現資料列覆蓋準備度的閱讀摘要；Supabase readonly attempt 仍需另外命名授權，publicDataSource 與 scoreSource 都維持 mock。"
    />
  );
}
