import { RowCoverageReadinessPanel } from "@/components/row-coverage-readiness-panel";

export function WeeklyRowCoverageStatus() {
  return (
    <RowCoverageReadinessPanel
      ariaLabel="Weekly row coverage readiness"
      className="weekly-row-coverage-status"
      eyebrow="Row Coverage Gate"
      openItemSuffix="unresolved"
      summary="週報頁目前同步揭露 row coverage 的 runtime 狀態。第二次 Supabase readonly attempt 尚未執行，公開資料來源與分數來源仍維持 mock。"
    />
  );
}
