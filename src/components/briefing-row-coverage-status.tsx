import { RowCoverageReadinessPanel } from "@/components/row-coverage-readiness-panel";

export function BriefingRowCoverageStatus() {
  return (
    <RowCoverageReadinessPanel
      ariaLabel="資料列覆蓋準備度"
      className="briefing-row-coverage-status"
      eyebrow="Data Row Coverage"
      openItemSuffix="筆資料待補"
      summary="目前是 local_ready_remote_paused：本地檢查與說明已準備好，但任何 Supabase readonly attempt 都必須另外命名授權、只輸出彙總結果，且不得升級公開資料來源或正式分數。"
    />
  );
}
