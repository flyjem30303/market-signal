import { RowCoverageReadinessPanel } from "@/components/row-coverage-readiness-panel";

export function BriefingRowCoverageStatus() {
  return (
    <RowCoverageReadinessPanel
      ariaLabel="資料列覆蓋準備度"
      className="briefing-row-coverage-status"
      eyebrow="資料覆蓋狀態"
      openItemSuffix="筆資料待補"
      summary="目前本地資料流程與說明已準備好，但正式資料來源、覆蓋範圍與更新流程仍需完成確認。公開頁在此之前維持示範資料與清楚揭露。"
    />
  );
}
