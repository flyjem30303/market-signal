import { RowCoverageReadinessPanel } from "@/components/row-coverage-readiness-panel";

export function WeeklyRowCoverageStatus() {
  return (
    <RowCoverageReadinessPanel
      ariaLabel="Weekly row coverage readiness"
      className="weekly-row-coverage-status"
      eyebrow="Row Coverage Gate"
      openItemSuffix="unresolved"
      summary="Weekly row coverage remains local-ready and remote-paused. A Supabase readonly attempt still requires a separate CEO-named gate; publicDataSource and scoreSource remain mock."
    />
  );
}
