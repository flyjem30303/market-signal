export type RuntimeDeliveryCadence = {
  adjustment: string;
  deEmphasizedCutpoints: string[];
  mandatoryCutpoints: string[];
  nextExecutionMode: "larger_mock_runtime_product_slice";
  nextExecutionRatio: "runtime product 70 / blocker closure 20 / governance 10";
  reason: string;
  targetSliceSize: string;
  verdict: "recent_slices_too_fragmented";
};

export function getRuntimeDeliveryCadence(): RuntimeDeliveryCadence {
  return {
    adjustment:
      "Keep mandatory gates, but consolidate future work into larger product-visible slices that combine UI, guard, report, and checker updates.",
    deEmphasizedCutpoints: [
      "standalone wording-only governance notes",
      "single-field report-only changes",
      "duplicate role reviews that do not change an executable decision",
      "visual micro-adjustments without runtime decision value"
    ],
    mandatoryCutpoints: [
      "before any Supabase connection attempt",
      "before any SQL execution",
      "before any market-data fetch or ingestion",
      "before any publicDataSource promotion",
      "before any scoreSource=real transition",
      "after any remote attempt post-run review"
    ],
    nextExecutionMode: "larger_mock_runtime_product_slice",
    nextExecutionRatio: "runtime product 70 / blocker closure 20 / governance 10",
    reason:
      "Recent runtime work improved safety and traceability, but too many small governance and UI-only commits created slow visible progress.",
    targetSliceSize: "one coherent runtime product outcome per commit",
    verdict: "recent_slices_too_fragmented"
  };
}
