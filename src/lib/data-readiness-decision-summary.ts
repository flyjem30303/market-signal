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
        "Readonly row coverage is local-ready, but the next remote read still needs a separate CEO-named bounded attempt and post-run review.",
      requiresSeparateCeoNamedAction: true
    },
    closestNextGate: "schema_shape_freshness_row_coverage_decision_gate",
    dataFoundationGate: getDataFoundationGate(),
    headline: "Post-readonly data readiness is consolidated; runtime remains mock-only.",
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
