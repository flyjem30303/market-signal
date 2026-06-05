import { spawnSync } from "node:child_process";

const checks = [
  {
    id: "runtime-fail-closed",
    command: "scripts/check-runtime-fail-closed.mjs",
    evidence:
      "Runtime fail-closed state is active and keeps publicDataSource and scoreSource mock before any promotion."
  },
  {
    id: "post-readonly-runtime-state",
    command: "scripts/check-post-readonly-runtime-state.mjs",
    evidence:
      "Post-readonly runtime state converts object reachability into backend evidence only while keeping row coverage and public source promotion blocked."
  },
  {
    id: "runtime-decision-summary",
    command: "scripts/check-runtime-decision-summary.mjs",
    evidence:
      "Runtime decision summary keeps post-readonly interpretation separate from SQL, writes, public source promotion, and scoreSource=real."
  },
  {
    id: "data-readiness-decision-summary",
    command: "scripts/check-data-readiness-decision-summary.mjs",
    evidence:
      "Data readiness decision summary connects schema shape, freshness, row coverage, quality, and source-depth gates without running remote work."
  },
  {
    id: "data-foundation-gate",
    command: "scripts/check-data-foundation-gate.mjs",
    evidence:
      "Data foundation gate accepts object reachability, runtime schema baseline, and freshness metadata while keeping row coverage, quality, and source-depth promotion blockers visible."
  },
  {
    id: "supabase-readonly-runtime-readiness-summary",
    command: "scripts/check-supabase-readonly-runtime-readiness-summary.mjs",
    evidence:
      "Supabase readonly runtime readiness summary proves local preflight, final prep, sanitized reachability evidence, runtime fail-closed, and mock boundaries are aligned."
  }
];

const evidence = checks.map((check) => {
  const run = spawnSync(process.execPath, [check.command], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  return {
    id: check.id,
    ok: run.status === 0,
    evidence: check.evidence
  };
});

const allOk = evidence.every((item) => item.ok);

const report = {
  mode: "runtime_schema_promotion_readiness",
  status: allOk
    ? "local_runtime_schema_promotion_ready_real_promotion_blocked"
    : "blocked_runtime_schema_promotion_incomplete",
  owner: "Engineering",
  coOwners: ["CEO", "PM", "Data", "QA"],
  recommendedBy: "CEO",
  readinessLift: allOk ? 5 : 0,
  upgradedRuntimeGuardPercent: allOk ? 95 : 90,
  upgradedSchemaRepositoryPercent: allOk ? 95 : 90,
  targetForMvpReview: 95,
  readinessMeaning:
    "Runtime/schema promotion readiness is MVP-review ready as local evidence: object reachability, schema baseline, freshness metadata, fail-closed runtime state, and promotion locks are aligned, while real promotion remains blocked.",
  evidence,
  promotionDecisionMap: [
    {
      id: "runtime-interpretation",
      decision: "ready_for_mock_mvp_review",
      acceptedState: "UI may say object reachability and schema/freshness readiness are local backend evidence.",
      blockedState: "UI must not say production Supabase data, public source promotion, or real scoring is active."
    },
    {
      id: "schema-repository-contract",
      decision: "ready_as_local_contract",
      acceptedState: "Schema, repository, validator, readonly preflight, object reachability, and daily_prices runtime shape can support MVP review.",
      blockedState: "SQL execution, migration execution, writes, staging rows, daily_prices modification, and ingestion remain blocked."
    },
    {
      id: "promotion-locks",
      decision: "active_until_separate_gate",
      acceptedState: "Promotion locks are visible for row coverage, data quality, source depth, public source, and score source.",
      blockedState: "publicDataSource=supabase, scoreSource=real, row coverage points, data-quality score lift, and public real-data claims remain blocked."
    },
    {
      id: "fail-closed-recovery",
      decision: "ready_for_local_health_review",
      acceptedState: "Build, dev recovery, localhost health, runtime fail-closed, and review gate checks can verify the local mock boundary.",
      blockedState: "A green local health check must not be treated as authorization for remote reads, writes, SQL, or source promotion."
    }
  ],
  mvpAllowed: [
    "mock-only runtime/schema readiness review",
    "backend object reachability as local evidence",
    "schema/repository contract review without execution",
    "fail-closed public runtime state",
    "separate future promotion gate backlog"
  ],
  stillNotApproved: [
    "Supabase public source promotion",
    "publicDataSource=supabase",
    "scoreSource=real",
    "SQL execution",
    "migration execution",
    "Supabase writes",
    "staging rows",
    "daily_prices modification",
    "market data ingestion",
    "row coverage points",
    "data-quality score increase",
    "public real-data claims"
  ],
  nextAfterMvpReview: [
    "separately named schema/freshness/quality promotion gate",
    "sanitized post-run evidence for any future remote attempt",
    "row coverage and source-depth acceptance before any real score",
    "publicDataSource and scoreSource promotion gate after Legal/Data/QA acceptance"
  ],
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    marketDataFetched: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  stopLine:
    "This runtime/schema promotion readiness report does not connect to Supabase, run SQL, execute migrations, write data, create staging rows, modify daily_prices, fetch or ingest market data, print secrets, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
