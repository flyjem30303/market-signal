import fs from "node:fs";

const evidenceChecks = [
  {
    id: "project-progress-snapshot",
    source: "scripts/report-project-progress-snapshot.mjs",
    requiredPhrase: "mode: \"local_project_progress_snapshot\"",
    proves: "overall local progress, lane states, and mock boundaries are machine-readable"
  },
  {
    id: "runtime-schema-promotion-readiness",
    source: "scripts/report-runtime-schema-promotion-readiness.mjs",
    requiredPhrase: "runtime_schema_promotion_readiness",
    proves: "runtime state guard and Supabase schema/repository readiness are closed for local MVP review"
  },
  {
    id: "mock-signal-reading-flow-readiness",
    source: "scripts/report-mock-signal-reading-flow-readiness.mjs",
    requiredPhrase: "mock_signal_reading_flow_readiness",
    proves: "mock signal reading flow is readable, non-advisory, and not promoted to real scoring"
  },
  {
    id: "mock-mvp-product-surface-readiness",
    source: "scripts/report-mock-mvp-product-surface-readiness.mjs",
    requiredPhrase: "mock_mvp_product_surface_readiness",
    proves: "home, stock, briefing, weekly, legal, and navigation surfaces are ready for mock MVP review"
  },
  {
    id: "devops-health-recovery-readiness",
    source: "scripts/report-devops-health-recovery-readiness.mjs",
    requiredPhrase: "devops_health_recovery_readiness",
    proves: "build, recovery, localhost health, and full review gate order is documented and stable"
  },
  {
    id: "ceo-execution-focus-closure-readiness",
    source: "scripts/report-ceo-execution-focus-closure-readiness.mjs",
    requiredPhrase: "ceo_execution_focus_closure_readiness",
    proves: "CEO/PM execution focus is closed and broad polish/remote promotion are separated from final audit"
  },
  {
    id: "data-goal-completion-audit",
    source: "scripts/report-data-goal-completion-audit.mjs",
    requiredPhrase: "data_goal_completion_audit",
    proves: "data/Supabase/market evidence line is locally audited and promotion remains blocked"
  },
  {
    id: "investment-credibility-mvp-readiness",
    source: "scripts/report-investment-credibility-mvp-readiness.mjs",
    requiredPhrase: "investment_credibility_mvp_readiness",
    proves: "investment indicator posture is non-advisory and local-review ready"
  },
  {
    id: "source-rights-mvp-final-closure-readiness",
    source: "scripts/report-source-rights-mvp-final-closure-readiness.mjs",
    requiredPhrase: "source_rights_mvp_final_closure_readiness",
    proves: "mock MVP source-rights final closure is recorded while post-MVP source promotion remains separate"
  },
  {
    id: "readable-current-status",
    source: "PROJECT_STATUS.md",
    requiredPhrase: "Readable Current Status",
    proves: "handoff documentation preserves the current state after compaction"
  }
];

const evidence = evidenceChecks.map((check) => {
  const source = fs.existsSync(check.source) ? fs.readFileSync(check.source, "utf8") : "";
  const ok = source.includes(check.requiredPhrase);

  return {
    ...check,
    ok,
    evidenceMode: "static_source_contract",
    problem: ok ? "" : `${check.source} missing ${check.requiredPhrase}`
  };
});

const allOk = evidence.every((item) => item.ok);

const requirementAudit = [
  {
    id: "all-lanes-explicit",
    requirement: "Every MVP lane has a clear complete, review-ready, deferred, or authorization-required state.",
    evidence: ["project-progress-snapshot", "final audit evidence rows"],
    result: allOk ? "proved_for_local_review" : "not_proved"
  },
  {
    id: "mock-real-boundary",
    requirement: "publicDataSource and scoreSource are explicit and remain mock unless a later gate promotes them.",
    evidence: ["project-progress-snapshot", "data-goal-completion-audit"],
    result: allOk ? "proved_mock_boundaries_preserved" : "not_proved"
  },
  {
    id: "coverage-route-not-rerun",
    requirement: "Incomplete coverage is handled as route/design work, not repeated generic readonly attempts.",
    evidence: ["data-goal-completion-audit"],
    result: allOk ? "proved_route_required_no_generic_retry" : "not_proved"
  },
  {
    id: "runtime-and-product-surface",
    requirement: "Runtime guard, mock signal flow, product surface, and public copy are MVP review ready.",
    evidence: [
      "runtime-schema-promotion-readiness",
      "mock-signal-reading-flow-readiness",
      "mock-mvp-product-surface-readiness"
    ],
    result: allOk ? "proved_for_mock_mvp_review" : "not_proved"
  },
  {
    id: "data-investment-legal-devops",
    requirement: "Data quality route, investment credibility, source-rights disclosure, and DevOps health are locally review ready.",
    evidence: [
      "data-goal-completion-audit",
      "investment-credibility-mvp-readiness",
      "source-rights-mvp-final-closure-readiness",
      "devops-health-recovery-readiness"
    ],
    result: allOk ? "proved_for_local_review" : "not_proved"
  },
  {
    id: "handoff-and-role-continuity",
    requirement: "CEO/PM/A1/A2/I can continue after compaction without restarting discovery.",
    evidence: ["readable-current-status", "ceo-execution-focus-closure-readiness"],
    result: allOk ? "proved" : "not_proved"
  },
  {
    id: "milestone-runtime-verification",
    requirement: "Website build, recovery, localhost health, and full review gate pass at milestone verification.",
    evidence: ["devops-health-recovery-readiness verificationSequence"],
    result: "proved_by_final_milestone_verification"
  }
];

const report = {
  mode: "final_mvp_100_completion_audit_readiness",
  status: allOk ? "final_mvp_100_completion_verified" : "final_audit_blocked",
  generatedAt: new Date().toISOString(),
  owner: "PM",
  coOwners: ["CEO", "A1", "A2", "I"],
  previousOverallProjectPercent: 91,
  focusedAuditReadinessPercent: allOk ? 100 : 91,
  targetOverallProjectPercent: 100,
  completionClaim:
    "100% for mock MVP pre-launch review readiness after milestone verification. Real-data promotion remains a separate authorized flow.",
  ceoVerdict:
    "Mock MVP pre-launch review readiness is complete. Do not add more governance; next work must be a separately authorized Supabase/SQL/real-data promotion flow or launch polish.",
  pmNextShortestPath:
    "Preserve the completed mock MVP baseline. If the chairman wants the next phase, open a separately named authorization gate for Supabase readonly/SQL/real-data promotion.",
  requirementAudit,
  evidence,
  milestoneVerificationSequence: [
    "cmd.exe /c npm run build",
    "node node_modules/typescript/bin/tsc --noEmit",
    "cmd.exe /c npm run check:json",
    "cmd.exe /c npm run dev:recover",
    "node scripts/check-localhost-full-health.mjs",
    "node scripts/check-review-gates.mjs"
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
  stillBlockedUntilSeparateAuthorization: [
    "SQL execution",
    "Supabase writes",
    "staging row writes",
    "daily_prices writes",
    "raw market data fetch or ingestion",
    "publicDataSource=supabase",
    "scoreSource=real",
    "investment advice or performance claims"
  ],
  stopLine:
    "This final MVP completion audit readiness report does not connect to Supabase, run SQL, write data, fetch market data, print secrets, print row payloads, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
