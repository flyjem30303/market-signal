import { RowCoverageReadinessPanel } from "@/components/row-coverage-readiness-panel";

export function BriefingRowCoverageStatus() {
  return (
    <RowCoverageReadinessPanel
      ariaLabel="Row coverage readiness"
      className="briefing-row-coverage-status"
      eyebrow="Row Coverage Readiness"
      openItemSuffix="items"
      summary="目前狀態是 local_ready_remote_paused。這代表本地 runner、輸出合約與 post-run acceptance gate 已就緒，但第二次 Supabase readonly attempt 尚未執行。"
    />
  );
}
