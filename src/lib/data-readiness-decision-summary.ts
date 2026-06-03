import { getFreshnessReadonlyLatestEvidenceSummary } from "@/lib/freshness-readonly-latest-evidence";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";
import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getSchemaShapeAcceptanceContract } from "@/lib/schema-shape-acceptance-contract";
import { getSupabaseReadonlyEvidenceSummary } from "@/lib/supabase-readonly-evidence";

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

export type DataReadinessDecisionSummary = {
  boundedReadonlyAttempt: {
    command: string;
    decision: "prepare_but_do_not_run";
    reason: string;
    requiresSeparateCeoNamedAction: true;
  };
  closestNextGate: "schema_shape_freshness_row_coverage_decision_gate";
  headline: string;
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
        "Readonly row coverage is local-ready, but the next remote read still needs a separate CEO-named bounded attempt and post-run review.",
      requiresSeparateCeoNamedAction: true
    },
    closestNextGate: "schema_shape_freshness_row_coverage_decision_gate",
    headline: "Post-readonly data readiness is consolidated; runtime remains mock-only.",
    lanes: [
      {
        evidence: `${readonlyEvidence.objects.length} Supabase objects reachable; accepted scope is object reachability only.`,
        id: "object-reachability",
        label: "Object reachability",
        nextAction: readonlyEvidence.nextRuntimeGate,
        owner: "Engineering",
        state: "accepted"
      },
      {
        evidence: `${schema.acceptedCount} of ${schema.objects.length} object shapes accepted for runtime shape.`,
        id: "schema-shape",
        label: "Schema shape",
        nextAction: schema.nextDefaultAction,
        owner: "Data",
        state: "readying"
      },
      {
        evidence: `${freshness.market} freshness metadata accepted as of ${freshness.asOfDate}; source ${freshness.sourceName}.`,
        id: "freshness-metadata",
        label: "Freshness metadata",
        nextAction: freshness.nextRuntimeGate,
        owner: "QA",
        state: "accepted"
      },
      {
        evidence: `${rowCoverage.latestAttempt.observedTotalRows}/${rowCoverage.latestAttempt.expectedTotalRows} rows observed; ${rowCoverage.latestAttempt.missingRows} missing.`,
        id: "row-coverage",
        label: "Row coverage",
        nextAction: rowCoverage.nextDecision,
        owner: "Data",
        state: "blocked"
      },
      {
        evidence: `${qualityLane?.current ?? 0}% credibility lane; source rights, quality, and model proof still block promotion.`,
        id: "quality-source-depth",
        label: "Quality and source depth",
        nextAction:
          qualityLane?.nextAction ??
          "Keep quality and source-depth evidence blocked until Investment and QA gates accept real-data credibility.",
        owner: "Investment",
        state: "blocked"
      }
    ],
    mode: "post_readonly_data_readiness_summary",
    recommendation:
      "Use this summary to prepare the next decision packet; do not run SQL, write Supabase, promote publicDataSource=supabase, or set scoreSource=real.",
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
      "Do not run SQL, write Supabase, fetch or ingest market data, print secrets, promote publicDataSource=supabase, or set scoreSource=real from this summary."
  };
}
