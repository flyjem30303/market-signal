export type RuntimeDeliveryCadence = {
  adjustment: string;
  deEmphasizedCutpoints: string[];
  mandatoryCutpoints: string[];
  nextExecutionMode: "larger_mock_runtime_product_slice";
  nextExecutionRatio: "runtime product 70 / data readiness 20 / governance 10";
  reason: string;
  targetSliceSize: string;
  verdict: "recent_slices_too_fragmented";
};

export function getRuntimeDeliveryCadence(): RuntimeDeliveryCadence {
  return {
    adjustment:
      "保留必要 gate，但後續工作合併成較大的產品可見切片，同時包含 UI、guard、report 與 checker 更新。",
    deEmphasizedCutpoints: [
      "standalone wording-only governance notes",
      "single-field report-only changes",
      "duplicate role reviews that do not change an executable decision",
      "visual micro-adjustments without runtime decision value"
    ],
    mandatoryCutpoints: [
      "任何 Supabase 連線嘗試前",
      "任何 SQL 執行前",
      "任何市場資料抓取或匯入前",
      "任何正式公開資料升級前",
      "任何正式分數切換前",
      "任何遠端嘗試後，必須先完成執行後覆核"
    ],
    nextExecutionMode: "larger_mock_runtime_product_slice",
    nextExecutionRatio: "runtime product 70 / data readiness 20 / governance 10",
    reason:
      "近期 runtime 工作提升了安全性與可追溯性，但過多小型治理與純 UI 切片讓可見進度變慢。",
    targetSliceSize: "每次完成一個一致的 runtime 產品成果",
    verdict: "recent_slices_too_fragmented"
  };
}
