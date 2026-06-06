import fs from "node:fs";
import { spawn, spawnSync } from "node:child_process";

const node = process.execPath;
const baseUrl = process.env.LOCALHOST_HEALTH_BASE_URL ?? "http://localhost:3000";
const shouldManageServer = process.env.LOCALHOST_HEALTH_MANAGE_SERVER !== "false";
const checkTimeoutMs = Number.parseInt(process.env.LOCALHOST_FULL_HEALTH_CHECK_TIMEOUT_MS ?? "30000", 10);
const runSlowAggregateChecks = process.env.LOCALHOST_FULL_HEALTH_RUN_SLOW_AGGREGATES === "true";
const checks = [
  {
    command: [node, "scripts/check-localhost-health-config.mjs"],
    name: "localhost-health-config"
  },
  {
    command: [node, "scripts/check-localhost-health.mjs"],
    name: "localhost-health"
  },
  {
    command: [node, "scripts/check-localhost-content-health.mjs"],
    name: "localhost-content-health"
  },
  {
    command: [node, "scripts/check-row-coverage-health-route-alignment.mjs"],
    name: "row-coverage-health-route-alignment"
  },
  {
    command: [node, "scripts/check-project-progress-snapshot.mjs"],
    name: "project-progress-snapshot"
  },
  {
    command: [node, "scripts/check-overall-project-100-readiness.mjs"],
    name: "overall-project-100-readiness"
  },
  {
    command: [node, "scripts/check-runtime-schema-promotion-readiness.mjs"],
    name: "runtime-schema-promotion-readiness"
  },
  {
    command: [node, "scripts/check-mock-signal-reading-flow-readiness.mjs"],
    name: "mock-signal-reading-flow-readiness"
  },
  {
    command: [node, "scripts/check-mock-mvp-product-surface-readiness.mjs"],
    name: "mock-mvp-product-surface-readiness"
  },
  {
    command: [node, "scripts/check-devops-health-recovery-readiness.mjs"],
    name: "devops-health-recovery-readiness"
  },
  {
    command: [node, "scripts/check-ceo-execution-focus-closure-readiness.mjs"],
    name: "ceo-execution-focus-closure-readiness"
  },
  {
    command: [node, "scripts/check-final-mvp-100-completion-audit-readiness.mjs"],
    name: "final-mvp-100-completion-audit-readiness"
  },
  {
    command: [node, "scripts/check-mock-mvp-chairman-review.mjs"],
    name: "mock-mvp-chairman-review"
  },
  {
    command: [node, "scripts/check-mock-mvp-f-ui-closeout.mjs"],
    name: "mock-mvp-f-ui-closeout"
  },
  {
    command: [node, "scripts/check-data-authorization-entry-gate.mjs"],
    name: "data-authorization-entry-gate"
  },
  {
    command: [node, "scripts/check-data-authorization-decision-packet.mjs"],
    name: "data-authorization-decision-packet"
  },
  {
    command: [node, "scripts/check-data-authorization-readonly-attempt-post-run-review.mjs"],
    name: "data-authorization-readonly-attempt-post-run-review"
  },
  {
    command: [node, "scripts/check-data-population-route-decision.mjs"],
    name: "data-population-route-decision"
  },
  {
    command: [node, "scripts/check-data-realification-acceleration-gate.mjs"],
    name: "data-realification-acceleration-gate"
  },
  {
    command: [node, "scripts/check-backfill-ingestion-execution-packet.mjs"],
    name: "backfill-ingestion-execution-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-report-only-dry-run-packet.mjs"],
    name: "tw-equity-report-only-dry-run-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-source-rights-packet.mjs"],
    name: "tw-equity-source-rights-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-local-report-only-runner-design.mjs"],
    name: "tw-equity-local-report-only-runner-design"
  },
  {
    command: [node, "scripts/check-tw-equity-local-report-only-runner-implementation-gate.mjs"],
    name: "tw-equity-local-report-only-runner-implementation-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-local-report-only-runner.mjs"],
    name: "tw-equity-local-report-only-runner"
  },
  {
    command: [node, "scripts/check-tw-equity-local-report-only-runner-post-run-review.mjs"],
    name: "tw-equity-local-report-only-runner-post-run-review"
  },
  {
    command: [node, "scripts/check-tw-equity-source-approval-decision-packet.mjs"],
    name: "tw-equity-source-approval-decision-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-provider-specific-terms-review-packet.mjs"],
    name: "tw-equity-provider-specific-terms-review-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs"],
    name: "tw-equity-provider-specific-terms-review-outcome-ledger"
  },
  {
    command: [node, "scripts/check-record-tw-equity-provider-specific-terms-review-outcome.mjs"],
    name: "record-tw-equity-provider-specific-terms-review-outcome"
  },
  {
    command: [node, "scripts/check-tw-equity-provider-specific-terms-review-outcome-tool-role-review.mjs"],
    name: "tw-equity-provider-specific-terms-review-outcome-tool-role-review"
  },
  {
    command: [node, "scripts/check-tw-equity-provider-specific-terms-apply-runbook.mjs"],
    name: "tw-equity-provider-specific-terms-apply-runbook"
  },
  {
    command: [node, "scripts/check-tw-equity-provider-specific-terms-apply-runbook-role-review.mjs"],
    name: "tw-equity-provider-specific-terms-apply-runbook-role-review"
  },
  {
    command: [node, "scripts/check-tw-equity-source-review-readiness-summary.mjs"],
    name: "tw-equity-source-review-readiness-summary"
  },
  {
    command: [node, "scripts/check-tw-equity-source-classification-minimal-execution-route.mjs"],
    name: "tw-equity-source-classification-minimal-execution-route"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-first-authorization-packet.mjs"],
    name: "tw-equity-staging-first-authorization-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-first-preflight-runner.mjs"],
    name: "tw-equity-staging-first-preflight-runner"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-first-write-authorization-packet-v1.mjs"],
    name: "tw-equity-staging-first-write-authorization-packet-v1"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-write-authorization-readiness-v2.mjs"],
    name: "tw-equity-staging-write-authorization-readiness-v2"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-first-write-post-run-review-template-v1.mjs"],
    name: "tw-equity-staging-first-write-post-run-review-template-v1"
  },
  {
    command: [node, "scripts/check-tw-equity-bounded-staging-write-execution-decision-v1.mjs"],
    name: "tw-equity-bounded-staging-write-execution-decision-v1"
  },
  {
    command: [node, "scripts/check-tw-equity-write-runner-fail-closed-design.mjs"],
    name: "tw-equity-write-runner-fail-closed-design"
  },
  {
    command: [node, "scripts/check-tw-equity-actual-bounded-staging-write-authorization-packet.mjs"],
    name: "tw-equity-actual-bounded-staging-write-authorization-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-write-runner-implementation-gate.mjs"],
    name: "tw-equity-write-runner-implementation-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-write-runner-safety.mjs"],
    name: "tw-equity-staging-write-runner-safety"
  },
  {
    command: [node, "scripts/check-tw-equity-one-attempt-staging-write-preflight-gate.mjs"],
    name: "tw-equity-one-attempt-staging-write-preflight-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-write-capable-runner-implementation-readiness-gate.mjs"],
    name: "tw-equity-write-capable-runner-implementation-readiness-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-write-implementation-design-to-code-boundary.mjs"],
    name: "tw-equity-write-implementation-design-to-code-boundary"
  },
  {
    command: [node, "scripts/check-tw-equity-sanitized-candidate-input-validator.mjs"],
    name: "tw-equity-sanitized-candidate-input-validator"
  },
  {
    command: [node, "scripts/check-tw-equity-write-pre-execution-summary.mjs"],
    name: "tw-equity-write-pre-execution-summary"
  },
  {
    command: [node, "scripts/check-tw-equity-write-implementation-final-authorization-gate.mjs"],
    name: "tw-equity-write-implementation-final-authorization-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-write-implementation-final-authorization-acceptance.mjs"],
    name: "tw-equity-write-implementation-final-authorization-acceptance"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-write-implementation.mjs"],
    name: "tw-equity-staging-write-implementation"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-write-execution-readiness.mjs"],
    name: "tw-equity-staging-write-execution-readiness"
  },
  {
    command: [node, "scripts/check-tw-equity-bounded-staging-write-attempt-decision.mjs"],
    name: "tw-equity-bounded-staging-write-attempt-decision"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-first-write-post-run-review-2026-06-06.mjs"],
    name: "tw-equity-staging-first-write-post-run-review-2026-06-06"
  },
  {
    command: [node, "scripts/check-tw-equity-pgrst205-root-cause-gate.mjs"],
    name: "tw-equity-pgrst205-root-cause-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-second-bounded-staging-write-retry-decision.mjs"],
    name: "tw-equity-second-bounded-staging-write-retry-decision"
  },
  {
    command: [node, "scripts/check-tw-equity-second-write-runner-contract-alignment.mjs"],
    name: "tw-equity-second-write-runner-contract-alignment"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-second-write-retry-post-run-review-2026-06-06.mjs"],
    name: "tw-equity-staging-second-write-retry-post-run-review-2026-06-06"
  },
  {
    command: [node, "scripts/check-tw-equity-supabase-staging-write-repair-decision-packet.mjs"],
    name: "tw-equity-supabase-staging-write-repair-decision-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-supabase-staging-write-repair-evidence-checklist.mjs"],
    name: "tw-equity-supabase-staging-write-repair-evidence-checklist"
  },
  {
    command: [node, "scripts/check-tw-equity-supabase-staging-write-repair-evidence-record.mjs"],
    name: "tw-equity-supabase-staging-write-repair-evidence-record"
  },
  {
    command: [node, "scripts/check-tw-equity-run-id-uuid-contract-repair-gate.mjs"],
    name: "tw-equity-run-id-uuid-contract-repair-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-supabase-metadata-diagnostic-decision-packet.mjs"],
    name: "tw-equity-supabase-metadata-diagnostic-decision-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-supabase-metadata-diagnostic-once.mjs"],
    name: "tw-equity-supabase-metadata-diagnostic-once"
  },
  {
    command: [node, "scripts/check-tw-equity-supabase-metadata-diagnostic-post-run-review-2026-06-06.mjs"],
    name: "tw-equity-supabase-metadata-diagnostic-post-run-review"
  },
  {
    command: [node, "scripts/check-tw-equity-write-path-metadata-comparison.mjs"],
    name: "tw-equity-write-path-metadata-comparison"
  },
  {
    command: [node, "scripts/check-tw-equity-postgrest-schema-exposure-probe-once.mjs"],
    name: "tw-equity-postgrest-schema-exposure-probe-once"
  },
  {
    command: [node, "scripts/check-tw-equity-postgrest-schema-exposure-probe-post-run-review-2026-06-06.mjs"],
    name: "tw-equity-postgrest-schema-exposure-probe-post-run-review"
  },
  {
    command: [node, "scripts/check-tw-equity-schema-exposure-repair-decision-packet.mjs"],
    name: "tw-equity-schema-exposure-repair-decision-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-schema-exposure-repair-runbook.mjs"],
    name: "tw-equity-schema-exposure-repair-runbook"
  },
  {
    command: [node, "scripts/check-record-tw-equity-schema-exposure-repair-outcome.mjs"],
    name: "record-tw-equity-schema-exposure-repair-outcome"
  },
  {
    command: [node, "scripts/check-tw-equity-schema-exposure-outcome-to-probe-gate.mjs"],
    name: "tw-equity-schema-exposure-outcome-to-probe-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-post-repair-schema-exposure-probe-result.mjs"],
    name: "tw-equity-post-repair-schema-exposure-probe-result"
  },
  {
    command: [node, "scripts/check-tw-equity-table-api-visibility-permission-diagnostic-decision-packet.mjs"],
    name: "tw-equity-table-api-visibility-permission-diagnostic-decision-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-dashboard-table-visibility-observation.mjs"],
    name: "tw-equity-dashboard-table-visibility-observation"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-migration-apply-decision-packet.mjs"],
    name: "tw-equity-staging-migration-apply-decision-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-migration-apply-outcome.mjs"],
    name: "tw-equity-staging-migration-apply-outcome"
  },
  {
    command: [node, "scripts/check-tw-equity-post-migration-readonly-verification.mjs"],
    name: "tw-equity-post-migration-readonly-verification"
  },
  {
    command: [node, "scripts/check-tw-equity-post-migration-openapi-exposure-confirmation.mjs"],
    name: "tw-equity-post-migration-openapi-exposure-confirmation"
  },
  {
    command: [node, "scripts/check-tw-equity-third-bounded-staging-write-decision.mjs"],
    name: "tw-equity-third-bounded-staging-write-decision"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-third-write-post-run-review-2026-06-07.mjs"],
    name: "tw-equity-staging-third-write-post-run-review-2026-06-07"
  },
  {
    command: [node, "scripts/check-tw-equity-post-write-staging-verification.mjs"],
    name: "tw-equity-post-write-staging-verification"
  },
  {
    command: [node, "scripts/check-tw-equity-post-write-promotion-readiness-gate.mjs"],
    name: "tw-equity-post-write-promotion-readiness-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-to-daily-prices-merge-design-packet.mjs"],
    name: "tw-equity-staging-to-daily-prices-merge-design-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-to-daily-prices-dry-run-preflight.mjs"],
    name: "tw-equity-staging-to-daily-prices-dry-run-preflight"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-to-daily-prices-remote-preflight-authorization.mjs"],
    name: "tw-equity-staging-to-daily-prices-remote-preflight-authorization"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-to-daily-prices-remote-preflight-runner-implementation.mjs"],
    name: "tw-equity-staging-to-daily-prices-remote-preflight-runner-implementation"
  },
  {
    command: [node, "scripts/check-tw-equity-daily-prices-existing-target-overlap-policy.mjs"],
    name: "tw-equity-daily-prices-existing-target-overlap-policy"
  },
  {
    command: [node, "scripts/check-tw-equity-daily-prices-overlap-classification-runner.mjs"],
    name: "tw-equity-daily-prices-overlap-classification-runner"
  },
  {
    command: [node, "scripts/check-tw-equity-daily-prices-insert-missing-skip-existing-merge-authorization.mjs"],
    name: "tw-equity-daily-prices-insert-missing-skip-existing-merge-authorization"
  },
  {
    command: [node, "scripts/check-tw-equity-daily-prices-insert-missing-merge-runner-implementation.mjs"],
    name: "tw-equity-daily-prices-insert-missing-merge-runner-implementation"
  },
  {
    command: [node, "scripts/check-tw-equity-daily-prices-insert-missing-merge-execution-decision.mjs"],
    name: "tw-equity-daily-prices-insert-missing-merge-execution-decision"
  },
  {
    command: [node, "scripts/check-tw-equity-daily-prices-insert-missing-merge-post-run-review-2026-06-07.mjs"],
    name: "tw-equity-daily-prices-insert-missing-merge-post-run-review-2026-06-07"
  },
  {
    command: [node, "scripts/check-tw-equity-row-coverage-scoring-gate.mjs"],
    name: "tw-equity-row-coverage-scoring-gate"
  },
  {
    command: [node, "scripts/check-etf-daily-prices-coverage-completion-route.mjs"],
    name: "etf-daily-prices-coverage-completion-route"
  },
  {
    command: [node, "scripts/check-a1-tw-equity-candidate-artifact-intake.mjs"],
    name: "a1-tw-equity-candidate-artifact-intake"
  },
  {
    command: [node, "scripts/check-a1-tw-equity-candidate-artifact-delivery-spec.mjs"],
    name: "a1-tw-equity-candidate-artifact-delivery-spec"
  },
  {
    command: [node, "scripts/check-a1-tw-equity-candidate-artifact-self-check.mjs"],
    name: "a1-tw-equity-candidate-artifact-self-check"
  },
  {
    command: [node, "scripts/check-pm-tw-equity-candidate-intake-review.mjs"],
    name: "pm-tw-equity-candidate-intake-review"
  },
  {
    command: [node, "scripts/check-a1-tw-equity-candidate-artifact-production-checklist.mjs"],
    name: "a1-tw-equity-candidate-artifact-production-checklist"
  },
  {
    command: [node, "scripts/check-tw-equity-sanitized-candidate-artifact-generation.mjs"],
    name: "tw-equity-sanitized-candidate-artifact-generation"
  },
  {
    command: [node, "scripts/check-ceo-progress-brief.mjs"],
    name: "ceo-progress-brief"
  },
  {
    command: [node, "scripts/check-narrow-approval-packet.mjs"],
    name: "narrow-approval-packet"
  },
  {
    command: [node, "scripts/check-narrow-approval-post-review-gate.mjs"],
    name: "narrow-approval-post-review-gate"
  },
  {
    command: [node, "scripts/check-narrow-approval-outcome-ledger.mjs"],
    name: "narrow-approval-outcome-ledger"
  },
  {
    command: [node, "scripts/check-narrow-approval-outcome-panel.mjs"],
    name: "narrow-approval-outcome-panel"
  },
  {
    command: [node, "scripts/check-record-narrow-approval-outcome.mjs"],
    name: "record-narrow-approval-outcome"
  },
  {
    command: [node, "scripts/check-blocker-resolution-plan.mjs"],
    name: "blocker-resolution-plan"
  },
  {
    command: [node, "scripts/check-blocker-execution-queue.mjs"],
    name: "blocker-execution-queue"
  },
  {
    command: [node, "scripts/check-blocker-action-priorities.mjs"],
    name: "blocker-action-priorities"
  },
  {
    command: [node, "scripts/check-pre-runtime-blocker-closure-packet.mjs"],
    name: "pre-runtime-blocker-closure-packet"
  },
  {
    command: [node, "scripts/check-data-quality-evidence-checklist.mjs"],
    name: "data-quality-evidence-checklist"
  },
  {
    command: [node, "scripts/check-data-quality-field-validity.mjs"],
    name: "data-quality-field-validity"
  },
  {
    command: [node, "scripts/check-data-quality-field-validity-qa-review.mjs"],
    name: "data-quality-field-validity-qa-review"
  },
  {
    command: [node, "scripts/check-data-quality-field-validity-acceptance-gate.mjs"],
    name: "data-quality-field-validity-acceptance-gate"
  },
  {
    command: [node, "scripts/check-data-freshness-quality-mvp-readiness.mjs"],
    name: "data-freshness-quality-mvp-readiness"
  },
  {
    command: [node, "scripts/check-data-coverage-quality-route-readiness.mjs"],
    name: "data-coverage-quality-route-readiness"
  },
  {
    command: [node, "scripts/check-data-coverage-mvp-deferral-decision-readiness.mjs"],
    name: "data-coverage-mvp-deferral-decision-readiness"
  },
  {
    command: [node, "scripts/check-data-coverage-promotion-execution-readiness.mjs"],
    name: "data-coverage-promotion-execution-readiness"
  },
  {
    command: [node, "scripts/check-source-specific-acceptance-packets-readiness.mjs"],
    name: "source-specific-acceptance-packets-readiness"
  },
  {
    command: [node, "scripts/check-promotion-prerequisites-gate.mjs"],
    name: "promotion-prerequisites-gate"
  },
  {
    command: [node, "scripts/check-source-rights-disclosure-checklist.mjs"],
    name: "source-rights-disclosure-checklist"
  },
  {
    command: [node, "scripts/check-source-rights-disclosure-local-review.mjs"],
    name: "source-rights-disclosure-local-review"
  },
  {
    command: [node, "scripts/check-source-rights-disclosure-acceptance-gate.mjs"],
    name: "source-rights-disclosure-acceptance-gate"
  },
  {
    command: [node, "scripts/check-provider-specific-terms-review-packet.mjs"],
    name: "provider-specific-terms-review-packet"
  },
  {
    command: [node, "scripts/check-provider-specific-terms-post-review-rollup.mjs"],
    name: "provider-specific-terms-post-review-rollup"
  },
  {
    command: [node, "scripts/check-source-rights-mvp-readiness.mjs"],
    name: "source-rights-mvp-readiness"
  },
  {
    command: [node, "scripts/check-source-rights-public-placement-readiness.mjs"],
    name: "source-rights-public-placement-readiness"
  },
  {
    command: [node, "scripts/check-source-rights-public-copy-acceptance-readiness.mjs"],
    name: "source-rights-public-copy-acceptance-readiness"
  },
  {
    command: [node, "scripts/check-source-rights-mvp-deferral-decision-readiness.mjs"],
    name: "source-rights-mvp-deferral-decision-readiness"
  },
  {
    command: [node, "scripts/check-source-rights-mvp-final-closure-readiness.mjs"],
    name: "source-rights-mvp-final-closure-readiness"
  },
  {
    command: [node, "scripts/check-source-rights-specific-classification-readiness.mjs"],
    name: "source-rights-specific-classification-readiness"
  },
  {
    command: [node, "scripts/check-bounded-readonly-final-local-alignment.mjs"],
    name: "bounded-readonly-final-local-alignment"
  },
  {
    command: [node, "scripts/check-data-goal-readiness.mjs"],
    name: "data-goal-readiness"
  },
  {
    command: [node, "scripts/check-data-goal-execution-review-bridge.mjs"],
    name: "data-goal-execution-review-bridge"
  },
  {
    command: [node, "scripts/check-data-goal-completion-audit.mjs"],
    name: "data-goal-completion-audit"
  },
  {
    command: [node, "scripts/check-mvp-launch-prd.mjs"],
    name: "mvp-launch-prd"
  },
  {
    command: [node, "scripts/check-model-credibility-checklist.mjs"],
    name: "model-credibility-checklist"
  },
  {
    command: [node, "scripts/check-model-credibility-local-review.mjs"],
    name: "model-credibility-local-review"
  },
  {
    command: [node, "scripts/check-model-credibility-acceptance-gate.mjs"],
    name: "model-credibility-acceptance-gate"
  },
  {
    command: [node, "scripts/check-investment-credibility-mvp-readiness.mjs"],
    name: "investment-credibility-mvp-readiness"
  },
  {
    command: [node, "scripts/check-investment-credibility-evidence-upgrade.mjs"],
    name: "investment-credibility-evidence-upgrade"
  },
  {
    command: [node, "scripts/check-investment-formula-downgrade-readiness.mjs"],
    name: "investment-formula-downgrade-readiness"
  },
  {
    command: [node, "scripts/check-investment-public-claim-readiness.mjs"],
    name: "investment-public-claim-readiness"
  },
  {
    command: [node, "scripts/check-blocker-readiness-panel.mjs"],
    name: "blocker-readiness-panel"
  },
  {
    command: [node, "scripts/check-next-dev-recovery-tools.mjs"],
    name: "next-dev-recovery-tools"
  }
];

const slowAggregateCheckNames = new Set([
  "mock-signal-reading-flow-readiness",
  "data-freshness-quality-mvp-readiness",
  "data-coverage-mvp-deferral-decision-readiness",
  "data-coverage-promotion-execution-readiness",
  "data-goal-completion-audit",
  "investment-credibility-mvp-readiness",
  "investment-credibility-evidence-upgrade",
  "investment-formula-downgrade-readiness",
  "investment-public-claim-readiness"
]);

const managedServer = shouldManageServer && !(await canFetchRoot()) ? await startTemporaryServer() : null;

try {
  const results = checks.map((check) => {
    if (slowAggregateCheckNames.has(check.name) && !runSlowAggregateChecks) {
      return {
        name: check.name,
        ok: true,
        skipped: true,
        skipReason: "slow_aggregate_check_registered_not_rerun",
        statusCode: "skipped",
        stderr: "",
        stdout: "",
        timedOut: false
      };
    }

    const result = spawnSync(check.command[0], check.command.slice(1), {
      cwd: process.cwd(),
      encoding: "utf8",
      timeout: checkTimeoutMs,
      windowsHide: true
    });
    const timedOut = result.error?.code === "ETIMEDOUT";

    return {
      name: check.name,
      ok: result.status === 0 && !timedOut,
      statusCode: timedOut ? "timeout" : result.status,
      stderr: (result.stderr ?? "").trim(),
      stdout: (result.stdout ?? "").trim(),
      timedOut
    };
  });

  const failed = results.filter((result) => !result.ok);

  console.log(
    JSON.stringify(
      {
        managedServer: managedServer
          ? {
              command: managedServer.commandLabel,
              started: true
            }
          : {
              started: false
            },
        runMode: runSlowAggregateChecks
          ? "full_execution_with_slow_aggregates"
          : "fast_localhost_health_with_slow_aggregates_registered",
        results: results.map((result) => ({
          name: result.name,
          ok: result.ok,
          skipped: result.skipped === true,
          skipReason: result.skipReason,
          statusCode: result.statusCode,
          timedOut: result.timedOut
        })),
        status: failed.length === 0 ? "ok" : "blocked"
      },
      null,
      2
    )
  );

  if (failed.length > 0) {
    for (const result of failed) {
      console.error(`\n[${result.name}] stdout\n${result.stdout}`);
      console.error(`\n[${result.name}] stderr\n${result.stderr}`);
    }
    process.exitCode = 1;
  }
} finally {
  if (managedServer) {
    managedServer.child.kill();
  }
}

async function startTemporaryServer() {
  const hasProductionBuild = fs.existsSync(".next/BUILD_ID");
  const args = hasProductionBuild
    ? ["node_modules/next/dist/bin/next", "start", "--hostname", "localhost", "--port", "3000"]
    : ["node_modules/next/dist/bin/next", "dev", "--hostname", "localhost", "--port", "3000"];
  const child = spawn(node, args, {
    cwd: process.cwd(),
    env: normalizeEnv(process.env),
    stdio: "ignore",
    windowsHide: true
  });

  const ready = await waitForRoot();
  if (!ready) {
    child.kill();
    throw new Error("temporary localhost server did not become ready");
  }

  return {
    child,
    commandLabel: hasProductionBuild ? "next start" : "next dev"
  };
}

async function waitForRoot() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    if (await canFetchRoot()) return true;
    await delay(1000);
  }

  return false;
}

async function canFetchRoot() {
  try {
    const response = await fetch(new URL("/", baseUrl), { cache: "no-store" });
    return response.status === 200;
  } catch {
    return false;
  }
}

function normalizeEnv(env) {
  const next = { ...env };
  if (next.Path && next.PATH) {
    delete next.PATH;
  }
  return next;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
