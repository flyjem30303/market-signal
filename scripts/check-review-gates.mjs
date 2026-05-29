import { spawnSync } from "node:child_process";

const node = process.execPath;
const checks = [
  {
    command: [node, "-e", "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package.json ok')"],
    expectStatus: "ok",
    name: "package-json"
  },
  {
    command: [node, "--experimental-strip-types", "scripts/check-asset-type-policy.mjs"],
    expectStatus: "ok",
    name: "asset-policy"
  },
  {
    command: [node, "scripts/check-ceo-delegated-autonomy-policy.mjs"],
    expectStatus: "ok",
    name: "ceo-delegated-autonomy"
  },
  {
    command: [node, "scripts/check-internal-route-exposure.mjs"],
    expectStatus: "ok",
    name: "internal-route-exposure"
  },
  {
    command: [node, "scripts/check-cp1-snapshot.mjs"],
    expectStatus: "ok",
    name: "cp1-snapshot"
  },
  {
    command: [node, "scripts/check-cp1-to-cp2.mjs"],
    expectStatus: "not_ready",
    name: "cp1-to-cp2"
  },
  {
    command: [node, "scripts/check-cp3-model-credibility.mjs"],
    expectStatus: "not_ready",
    name: "cp3-model-credibility"
  },
  {
    command: [node, "scripts/check-cp3-tw-stock-source-depth.mjs"],
    expectStatus: "not_ready",
    name: "cp3-tw-stock-source-depth"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-gate-draft.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-gate-draft"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-gate-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-gate-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-matrix.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-matrix"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-matrix-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-matrix-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-checker-plan.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-checker-plan"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-checker-plan-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-checker-plan-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-artifact-checklist-plan.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-artifact-checklist-plan"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-artifact-checklist-plan-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-artifact-checklist-plan-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-empty-template-design.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-empty-template-design"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-empty-template-design-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-empty-template-design-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-template-creation-approval-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-template-creation-approval-gate"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-template-creation-approval-gate-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-template-creation-approval-gate-role-review"
  },
  {
    command: [node, "scripts/check-cp3-tw-stock-historical-plan.mjs"],
    expectStatus: "ok",
    name: "cp3-tw-stock-historical-plan"
  },
  {
    command: [node, "scripts/check-cp3-tw-stock-historical-source-research.mjs"],
    expectStatus: "ok",
    name: "cp3-tw-stock-historical-source-research"
  },
  {
    command: [node, "scripts/check-cp3-tw-stock-endpoint-contract-matrix.mjs"],
    expectStatus: "ok",
    name: "cp3-tw-stock-endpoint-contract-matrix"
  },
  {
    command: [node, "scripts/check-cp3-tw-stock-endpoint-metadata-probe.mjs"],
    expectStatus: "ok",
    name: "cp3-tw-stock-endpoint-metadata-probe"
  },
  {
    command: [node, "scripts/check-cp3-tw-stock-legal-field-contract-review.mjs"],
    expectStatus: "ok",
    name: "cp3-tw-stock-legal-field-contract"
  },
  {
    command: [node, "scripts/check-cp3-tw-stock-historical-parameter-probe-plan.mjs"],
    expectStatus: "ok",
    name: "cp3-tw-stock-historical-parameter-probe-plan"
  },
  {
    command: [node, "scripts/check-cp3-tw-stock-historical-parameter-probe.mjs"],
    expectStatus: "ok",
    name: "cp3-tw-stock-historical-parameter-probe"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-historical-endpoint-research.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-historical-endpoint-research"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-metadata-probe.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-metadata-probe"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-source-depth-smoke-design.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-source-depth-smoke-design"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-source-depth-smoke.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-source-depth-smoke"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-license-rate-field-checklist.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-license-rate-field"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-controlled-ingestion-design.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-controlled-ingestion-design"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-dry-run-reporter-design.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-dry-run-reporter-design"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-controlled-dry-run.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-controlled-dry-run"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-dry-run-human-review.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-dry-run-human-review"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-boundary-design.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-boundary-design"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-sql-design.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-sql-design"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-migration-review-checklist.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-migration-review-checklist"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-migration-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-migration-role-review"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-migration-implementation-plan.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-migration-implementation-plan"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-migration-implementation-plan-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-migration-implementation-plan-role-review"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-migration-draft-approval-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-migration-draft-approval-gate"
  },
  {
    command: [node, "scripts/check-supabase-twse-stock-day-staging-schema.mjs"],
    expectStatus: "ok",
    name: "twse-stock-day-staging-schema-static"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-migration-draft-review.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-migration-draft-review"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-migration-draft-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-migration-draft-role-review"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-migration-execution-approval-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-migration-execution-approval-gate"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-migration-execution-readiness.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-migration-execution-readiness"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-post-migration-validation-rollback-plan.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-post-migration-validation-rollback-plan"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-read-only-validation-script-design.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-read-only-validation-script-design"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-read-only-validation-script-approval-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-read-only-validation-script-approval-gate"
  },
  {
    command: [node, "scripts/check-twse-stock-day-staging-readonly-validator-safety.mjs"],
    expectStatus: "ok",
    name: "twse-stock-day-staging-readonly-validator-safety"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-read-only-validator-draft-review.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-read-only-validator-draft-review"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-read-only-validator-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-read-only-validator-role-review"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-remote-read-only-validation-approval-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-remote-read-only-validation-approval-gate"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-remote-read-only-validation-readiness-checklist.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-remote-read-only-validation-readiness-checklist"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-remote-read-only-validation-runbook-draft.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-remote-read-only-validation-runbook-draft"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-remote-read-only-validation-runbook-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-remote-read-only-validation-runbook-role-review"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-remote-read-only-validation-pre-execution-approval-packet.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-remote-read-only-validation-pre-execution-approval-packet"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-remote-read-only-validation-pre-execution-approval-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-remote-read-only-validation-pre-execution-approval-gate"
  },
  {
    command: [node, "scripts/check-cp3-local-only-decision-quality-worklist.mjs"],
    expectStatus: "ok",
    name: "cp3-local-only-decision-quality-worklist"
  },
  {
    command: [node, "scripts/check-cp3-tw-stock-model-candidates.mjs"],
    expectStatus: "ok",
    name: "cp3-tw-stock-model"
  },
  {
    command: [node, "scripts/check-cp3-tw-stock-data-quality-downgrade-matrix.mjs"],
    expectStatus: "ok",
    name: "cp3-tw-stock-data-quality-downgrade-matrix"
  },
  {
    command: [node, "scripts/check-cp3-tw-stock-data-quality-downgrade-matrix-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-tw-stock-data-quality-downgrade-matrix-role-review"
  },
  {
    command: [node, "scripts/check-cp3-global-model-version-naming-rules.mjs"],
    expectStatus: "ok",
    name: "cp3-global-model-version-naming-rules"
  },
  {
    command: [node, "scripts/check-cp3-global-model-version-naming-rules-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-global-model-version-naming-rules-role-review"
  },
  {
    command: [node, "scripts/check-cp3-public-claim-approval-checklist.mjs"],
    expectStatus: "ok",
    name: "cp3-public-claim-approval-checklist"
  },
  {
    command: [node, "scripts/check-cp3-public-claim-approval-checklist-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-public-claim-approval-checklist-role-review"
  },
  {
    command: [node, "scripts/check-cp3-claim-to-runtime-state-mapping.mjs"],
    expectStatus: "ok",
    name: "cp3-claim-to-runtime-state-mapping"
  },
  {
    command: [node, "scripts/check-cp3-claim-to-runtime-state-mapping-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-claim-to-runtime-state-mapping-role-review"
  },
  {
    command: [node, "scripts/check-cp3-runtime-state-schema-draft.mjs"],
    expectStatus: "ok",
    name: "cp3-runtime-state-schema-draft"
  },
  {
    command: [node, "scripts/check-cp3-runtime-state-schema-draft-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-runtime-state-schema-draft-role-review"
  },
  {
    command: [node, "scripts/check-cp3-runtime-state-source-gate-draft.mjs"],
    expectStatus: "ok",
    name: "cp3-runtime-state-source-gate-draft"
  },
  {
    command: [node, "scripts/check-cp3-runtime-state-source-gate-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-runtime-state-source-gate-role-review"
  },
  {
    command: [node, "scripts/check-cp3-runtime-state-sample-packet-draft.mjs"],
    expectStatus: "ok",
    name: "cp3-runtime-state-sample-packet-draft"
  },
  {
    command: [node, "scripts/check-cp3-runtime-state-sample-packet-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-runtime-state-sample-packet-role-review"
  },
  {
    command: [node, "scripts/check-cp3-runtime-state-sample-packet-validation-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-runtime-state-sample-packet-validation-gate"
  },
  {
    command: [node, "scripts/check-cp3-runtime-state-sample-packet-validation-gate-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-runtime-state-sample-packet-validation-gate-role-review"
  },
  {
    command: [node, "scripts/check-cp3-non-runtime-typescript-policy-draft-approval-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-non-runtime-typescript-policy-draft-approval-gate"
  },
  {
    command: [node, "scripts/check-cp3-runtime-policy-draft.mjs"],
    expectStatus: "ok",
    name: "cp3-runtime-policy-draft"
  },
  {
    command: [node, "scripts/check-cp3-runtime-policy-draft-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-runtime-policy-draft-role-review"
  },
  {
    command: [node, "scripts/check-cp3-runtime-policy-implementation-readiness-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-runtime-policy-implementation-readiness-gate"
  },
  {
    command: [node, "scripts/check-cp3-ui-state-disclosure-placement-plan.mjs"],
    expectStatus: "ok",
    name: "cp3-ui-state-disclosure-placement-plan"
  },
  {
    command: [node, "scripts/check-cp3-ui-state-disclosure-placement-plan-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-ui-state-disclosure-placement-plan-role-review"
  },
  {
    command: [node, "scripts/check-cp3-non-runtime-ui-copy-token-draft-approval-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-non-runtime-ui-copy-token-draft-approval-gate"
  },
  {
    command: [node, "scripts/check-cp3-ui-copy-tokens-draft.mjs"],
    expectStatus: "ok",
    name: "cp3-ui-copy-tokens-draft"
  },
  {
    command: [node, "scripts/check-cp3-ui-copy-tokens-draft-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-ui-copy-tokens-draft-role-review"
  },
  {
    command: [node, "scripts/check-cp3-ui-wiring-launch-blocker-checklist-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-ui-wiring-launch-blocker-checklist-gate"
  },
  {
    command: [node, "scripts/check-cp3-ui-wiring-launch-blocker-implementation-plan.mjs"],
    expectStatus: "ok",
    name: "cp3-ui-wiring-launch-blocker-implementation-plan"
  },
  {
    command: [node, "scripts/check-cp3-ui-wiring-launch-blocker-implementation-plan-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-ui-wiring-launch-blocker-implementation-plan-role-review"
  },
  {
    command: [node, "scripts/check-cp3-ui-wiring-blocker-to-owner-gate-matrix.mjs"],
    expectStatus: "ok",
    name: "cp3-ui-wiring-blocker-to-owner-gate-matrix"
  },
  {
    command: [node, "scripts/check-cp3-ui-wiring-blocker-to-owner-gate-matrix-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-ui-wiring-blocker-to-owner-gate-matrix-role-review"
  },
  {
    command: [node, "scripts/check-cp3-tw-stock-backtest-method.mjs"],
    expectStatus: "ok",
    name: "cp3-tw-stock-backtest"
  },
  {
    command: [node, "scripts/check-cp3-tw-stock-input-readiness.mjs"],
    expectStatus: "ok",
    name: "cp3-tw-stock-inputs"
  },
  {
    command: [node, "scripts/check-cp3-tw-stock-dry-run-contract.mjs"],
    expectStatus: "ok",
    name: "cp3-tw-stock-dry-run"
  },
  {
    command: [node, "scripts/check-cp3-tw-stock-dry-run-report.mjs"],
    expectStatus: "ok",
    name: "cp3-tw-stock-dry-run-report"
  },
  {
    command: [node, "scripts/check-score-source-ui.mjs"],
    expectStatus: "ok",
    name: "score-source-ui"
  },
  {
    command: [node, "scripts/check-freshness-state-ui.mjs"],
    expectStatus: "ok",
    name: "freshness-state-ui"
  },
  {
    command: [node, "scripts/check-etf-source-gate.mjs"],
    expectStatus: "blocked",
    name: "etf-source-gate"
  },
  {
    command: [node, "scripts/check-etf-due-diligence.mjs"],
    expectStatus: "blocked",
    name: "etf-due-diligence"
  },
  {
    command: [node, "scripts/check-etf-mis-validation-plan.mjs"],
    expectStatus: "not_ready",
    name: "etf-mis-validation"
  },
  {
    command: [node, "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "--experimental-strip-types", "scripts/report-etf-source-readiness.mjs"],
    expectStatus: "report",
    name: "etf-source-report"
  },
  {
    command: [node, "node_modules/typescript/bin/tsc", "--noEmit"],
    expectStatus: "ok",
    name: "typescript"
  }
];

const results = checks.map(runCheck);
const failed = results.filter((result) => !result.pass);

console.log(
  JSON.stringify(
    {
      results,
      status: failed.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (failed.length > 0) {
  process.exitCode = 1;
}

function runCheck(check) {
  const result = spawnSync(check.command[0], check.command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  const observedStatus = readStatus(output, result.status);
  const pass = check.expectStatus === "report" ? result.status === 0 && output.includes("ETF Source Readiness Report") : observedStatus === check.expectStatus;

  return {
    exit_code: result.status,
    expected_status: check.expectStatus,
    name: check.name,
    observed_status: observedStatus,
    pass
  };
}

function readStatus(output, exitCode) {
  const jsonStart = output.indexOf("{");
  const jsonEnd = output.lastIndexOf("}");

  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    try {
      const parsed = JSON.parse(output.slice(jsonStart, jsonEnd + 1));
      if (parsed.status) return parsed.status;
    } catch {
      // Non-JSON output is fine for commands like TypeScript.
    }
  }

  return exitCode === 0 ? "ok" : "blocked";
}
