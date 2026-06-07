import { getFreshnessReadonlyLatestEvidenceSummary } from "@/lib/freshness-readonly-latest-evidence";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";
import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getSchemaShapeAcceptanceContract } from "@/lib/schema-shape-acceptance-contract";
import { getSupabaseReadonlyEvidenceSummary } from "@/lib/supabase-readonly-evidence";
import { getDataFoundationGate, type DataFoundationGate } from "@/lib/data-foundation-gate";

export type DataReadinessDecisionLane = {
  evidence: string;
  id:
    | "object-reachability"
    | "schema-shape"
    | "freshness-metadata"
    | "row-coverage"
    | "quality-source-depth";
  label: string;
  nextAction: string;
  owner: "Data" | "Engineering" | "Investment" | "PM" | "QA";
  state: "accepted" | "blocked" | "readying";
};

export type DataReadinessIntegrationQueueItem = {
  acceptanceSignal: string;
  blockedUntil: string;
  id: "mainline-runtime-bridge" | "a1-readonly-evidence" | "a2-public-copy-readiness";
  integrationAction: string;
  owner: "A1" | "A2" | "PM";
  priority: 1 | 2 | 3;
  source: string;
  status: "active_mainline" | "accepted_for_mainline_review" | "monitor_only";
};

export type DataReadinessDecisionSummary = {
  boundedReadonlyAttempt: {
    command: string;
    decision: "prepare_but_do_not_run";
    reason: string;
    requiresSeparateCeoNamedAction: true;
  };
  closestNextGate: "schema_shape_freshness_row_coverage_decision_gate";
  dataFoundationGate: DataFoundationGate;
  headline: string;
  integrationQueue: DataReadinessIntegrationQueueItem[];
  lanes: DataReadinessDecisionLane[];
  mode: "post_readonly_data_readiness_summary";
  recommendation: string;
  safety: {
    marketDataFetched: false;
    publicDataSource: "mock";
    scoreSource: "mock";
    scoreSourceRealEnabled: false;
    secretsPrinted: false;
    sqlExecuted: false;
    supabaseWritesEnabled: false;
  };
  status: "local_ready_remote_paused";
  stopLine: string;
};

export function getDataReadinessDecisionSummary(): DataReadinessDecisionSummary {
  const readonlyEvidence = getSupabaseReadonlyEvidenceSummary();
  const schema = getSchemaShapeAcceptanceContract();
  const freshness = getFreshnessReadonlyLatestEvidenceSummary();
  const rowCoverage = getRowCoverageSecondAttemptReadiness();
  const runtime = getRuntimeReadinessSummary();
  const qualityLane = runtime.lanes.find((lane) => lane.label === "Investment credibility");

  return {
    boundedReadonlyAttempt: {
      command: rowCoverage.commandMap.packageCommand,
      decision: "prepare_but_do_not_run",
      reason:
        "唯讀覆蓋率檢查已可本地準備，但下一次遠端讀取仍需要 CEO 另行命名的有範圍嘗試與執行後覆核。",
      requiresSeparateCeoNamedAction: true
    },
    closestNextGate: "schema_shape_freshness_row_coverage_decision_gate",
    dataFoundationGate: getDataFoundationGate(),
    headline: "唯讀後資料準備狀態已收斂；runtime 仍維持示範狀態。",
    integrationQueue: [
      {
        acceptanceSignal:
          "Runtime and data readiness summaries agree that publicDataSource and scoreSource stay mock.",
        blockedUntil:
          "a separate CEO-named bounded readonly attempt is requested and immediate post-run review is recorded",
        id: "mainline-runtime-bridge",
        integrationAction:
          "PM keeps integrating local runtime/data readiness into the home and progress surfaces without remote execution.",
        owner: "PM",
        priority: 1,
        source: "src/lib/runtime-execution-readiness-summary.ts",
        status: "active_mainline"
      },
      {
        acceptanceSignal:
          "A1 evidence can be used as sanitized aggregate readiness context, not as production-data proof.",
        blockedUntil:
          "row coverage, source-rights, and data-quality gates accept a bounded readonly outcome",
        id: "a1-readonly-evidence",
        integrationAction:
          "PM may absorb A1 packet fields into readonly decision summaries while keeping SQL, writes, raw payloads, and market-data ingestion blocked.",
        owner: "A1",
        priority: 2,
        source: "docs/ROLE_WORKSTREAMS.md",
        status: "accepted_for_mainline_review"
      },
      {
        acceptanceSignal:
          "A2 public-copy checks report no boundary-insufficient files and no mojibake candidates.",
        blockedUntil:
          "runtime foundation needs public readability changes for comprehension, not cosmetic polish",
        id: "a2-public-copy-readiness",
        integrationAction:
          "PM monitors A2 visible-language output and only pulls launch-blocking copy fixes ahead of runtime work.",
        owner: "A2",
        priority: 3,
        source: "scripts/report-a2-public-copy-readability-candidates.mjs",
        status: "monitor_only"
      }
    ],
    lanes: [
      {
        evidence: `${readonlyEvidence.objects.length} 個 Supabase 物件可讀；接受範圍僅限後端物件可讀性。`,
        id: "object-reachability",
        label: "後端物件可讀性",
        nextAction: readonlyEvidence.nextRuntimeGate,
        owner: "Engineering",
        state: "accepted"
      },
      {
        evidence: `${schema.acceptedCount}/${schema.objects.length} 個物件結構已接受，可供 runtime 結構檢查使用。`,
        id: "schema-shape",
        label: "資料結構",
        nextAction: schema.nextDefaultAction,
        owner: "Data",
        state: "readying"
      },
      {
        evidence: `${freshness.market} 新鮮度 metadata 已接受，日期 ${freshness.asOfDate}；來源 ${freshness.sourceName}。`,
        id: "freshness-metadata",
        label: "新鮮度 metadata",
        nextAction: freshness.nextRuntimeGate,
        owner: "QA",
        state: "accepted"
      },
      {
        evidence: `已觀察 ${rowCoverage.latestAttempt.observedTotalRows}/${rowCoverage.latestAttempt.expectedTotalRows} 筆；缺少 ${rowCoverage.latestAttempt.missingRows} 筆。`,
        id: "row-coverage",
        label: "資料覆蓋率",
        nextAction: rowCoverage.nextDecision,
        owner: "Data",
        state: "blocked"
      },
      {
        evidence: `可信度線目前 ${(qualityLane?.current ?? 0).toString()}%；來源權利、品質與模型證據仍阻擋升級。`,
        id: "quality-source-depth",
        label: "品質與來源深度",
        nextAction:
          qualityLane?.nextAction ??
          "在投資與 QA 檢查點接受正式資料可信度前，品質與來源深度證據維持阻擋。",
        owner: "Investment",
        state: "blocked"
      }
    ],
    mode: "post_readonly_data_readiness_summary",
    recommendation:
      "此摘要用於準備下一份決策 packet；不得執行 SQL、寫入 Supabase、升級正式公開資料或啟用正式分數。",
    safety: {
      marketDataFetched: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      scoreSourceRealEnabled: false,
      secretsPrinted: false,
      sqlExecuted: false,
      supabaseWritesEnabled: false
    },
    status: "local_ready_remote_paused",
    stopLine:
      "不得從此摘要執行 SQL、寫入 Supabase、抓取或匯入市場資料、輸出 secrets、升級正式公開資料或啟用正式分數。"
  };
}
