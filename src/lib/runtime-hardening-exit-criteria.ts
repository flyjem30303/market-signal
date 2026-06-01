export type RuntimeHardeningExitCriterion = {
  id: string;
  label: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "PM";
  state: "accepted" | "blocked" | "readying";
  evidence: string;
};

export type RuntimeHardeningExitCriteriaSummary = {
  acceptedCount: number;
  blockedCount: number;
  criteria: RuntimeHardeningExitCriterion[];
  headline: string;
  nextAction: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  stage: "mock_runtime_hardening_exit_review";
  status: "local_ready_blocked_by_external_gates";
  stopLine: string;
};

export function getRuntimeHardeningExitCriteria(): RuntimeHardeningExitCriteriaSummary {
  const criteria: RuntimeHardeningExitCriterion[] = [
    {
      id: "local-build-review-gates",
      label: "Local build and review gates are green",
      owner: "Engineering",
      state: "accepted",
      evidence: "npm run build and npm run check:review-gates must pass before the slice can exit."
    },
    {
      id: "public-runtime-boundary",
      label: "Public runtime state remains mock-only",
      owner: "PM",
      state: "accepted",
      evidence: "publicDataSource=mock and scoreSource=mock remain visible in the runtime panels."
    },
    {
      id: "supabase-readonly-separate-action",
      label: "Supabase readonly is a separate named action",
      owner: "CEO",
      state: "readying",
      evidence: "Row coverage attempt may run only as a separately named readonly attempt with post-run review."
    },
    {
      id: "source-rights-model-quality",
      label: "Source rights, model credibility, and data quality still block real score",
      owner: "Investment",
      state: "blocked",
      evidence: "No public claim, production data source, or scoreSource=real promotion is allowed from local hardening."
    },
    {
      id: "sql-write-ingestion-stop-line",
      label: "SQL, writes, and ingestion stay off",
      owner: "Data",
      state: "accepted",
      evidence: "This exit review does not run SQL, write Supabase, ingest market rows, or commit raw market data."
    }
  ];

  const acceptedCount = criteria.filter((item) => item.state === "accepted").length;
  const blockedCount = criteria.filter((item) => item.state === "blocked").length;

  return {
    acceptedCount,
    blockedCount,
    criteria,
    headline: "Mock runtime hardening is ready for exit review, not real-data promotion",
    nextAction:
      "Keep runtime hardening as the lead lane, then prepare a separate Supabase readonly attempt only when CEO explicitly names it.",
    publicDataSource: "mock",
    scoreSource: "mock",
    stage: "mock_runtime_hardening_exit_review",
    status: "local_ready_blocked_by_external_gates",
    stopLine:
      "Do not set publicDataSource=supabase or scoreSource=real until source rights, model credibility, data quality, and public-claim gates are accepted."
  };
}
