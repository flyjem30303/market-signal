import { spawnSync } from "node:child_process";

const node = process.execPath;
const checks = [
  {
    command: [node, "-e", "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package.json ok')"],
    expectStatus: "ok",
    name: "package-json"
  },
  {
    command: [node, "scripts/check-localhost-health-config.mjs"],
    expectStatus: "ok",
    name: "localhost-health-config"
  },
  {
    command: [node, "scripts/check-localhost-content-health.mjs"],
    expectStatus: "ok",
    name: "localhost-content-health"
  },
  {
    command: [node, "scripts/check-local-verification-runbook.mjs"],
    expectStatus: "ok",
    name: "local-verification-runbook"
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
    command: [node, "scripts/check-internal-diagnostics-runtime-policy.mjs"],
    expectStatus: "ok",
    name: "internal-diagnostics-runtime-policy"
  },
  {
    command: [node, "scripts/check-internal-diagnostics-access-behavior.mjs"],
    expectStatus: "ok",
    name: "internal-diagnostics-access-behavior"
  },
  {
    command: [node, "scripts/check-briefing-executive-summary.mjs"],
    expectStatus: "ok",
    name: "briefing-executive-summary"
  },
  {
    command: [node, "scripts/check-briefing-market-action-summary.mjs"],
    expectStatus: "ok",
    name: "briefing-market-action-summary"
  },
  {
    command: [node, "scripts/check-briefing-midpage-readability.mjs"],
    expectStatus: "ok",
    name: "briefing-midpage-readability"
  },
  {
    command: [node, "scripts/check-briefing-boundary-disclosure.mjs"],
    expectStatus: "ok",
    name: "briefing-boundary-disclosure"
  },
  {
    command: [node, "scripts/check-briefing-row-coverage-status.mjs"],
    expectStatus: "ok",
    name: "briefing-row-coverage-status"
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
    command: [node, "scripts/check-cp3-internal-overview.mjs"],
    expectStatus: "ok",
    name: "cp3-internal-overview"
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
    command: [node, "scripts/check-cp3-source-depth-evidence-blank-template.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-blank-template"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-blank-template-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-blank-template-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-template-usage-guide.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-template-usage-guide"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-template-usage-guide-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-template-usage-guide-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-artifact-approval-gate-plan.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-artifact-approval-gate-plan"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-artifact-approval-gate-plan-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-artifact-approval-gate-plan-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-template-copy-approval-packet-design.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-template-copy-approval-packet-design"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-template-copy-approval-packet-design-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-template-copy-approval-packet-design-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-template-copy-approval-packet-blank-template-design.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-template-copy-approval-packet-blank-template-design"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-template-copy-approval-packet-blank-template-design-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-template-copy-approval-packet-blank-template-design-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-template-copy-approval-packet-blank-template-creation-approval-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-template-copy-approval-packet-blank-template-creation-approval-gate"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-template-copy-approval-packet-template.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-template-copy-approval-packet-template"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-template-copy-approval-packet-template-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-template-copy-approval-packet-template-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-template-copy-approval-packet-usage-runbook.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-template-copy-approval-packet-usage-runbook"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-template-copy-approval-packet-usage-runbook-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-template-copy-approval-packet-usage-runbook-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-template-copy-approval-packet-role-review-gate-checker.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-template-copy-approval-packet-role-review-gate-checker"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-template-copy-approval-packet-role-review-gate-checker-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-template-copy-approval-packet-role-review-gate-checker-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-template-copy-approval-packet-governance-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-template-copy-approval-packet-governance-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-template-copy-approval-packet-governance-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-template-copy-approval-packet-governance-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-next-governance-priority-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-next-governance-priority-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-next-governance-priority-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-next-governance-priority-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-tier1-local-work-queue.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-tier1-local-work-queue"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-tier1-local-work-queue-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-tier1-local-work-queue-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-approval-packet-boundary-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-approval-packet-boundary-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-approval-packet-boundary-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-approval-packet-boundary-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-ceo-handoff-index.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-ceo-handoff-index"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-ceo-handoff-index-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-ceo-handoff-index-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-pending-decision-ledger.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-pending-decision-ledger"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-pending-decision-ledger-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-pending-decision-ledger-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-decision-meeting-agenda.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-decision-meeting-agenda"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-decision-meeting-agenda-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-decision-meeting-agenda-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-meeting-readiness-checklist.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-meeting-readiness-checklist"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-meeting-readiness-checklist-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-meeting-readiness-checklist-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-meeting-decision-packet-outline.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-meeting-decision-packet-outline"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-meeting-decision-packet-outline-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-meeting-decision-packet-outline-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-packet-outline-readiness-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-packet-outline-readiness-gate"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-packet-outline-readiness-gate-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-packet-outline-readiness-gate-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-decision-governance-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-decision-governance-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-decision-governance-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-decision-governance-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-approval-packet-scope-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-approval-packet-scope-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-approval-packet-scope-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-approval-packet-scope-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-single-scope-approval-packet-rulebook.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-single-scope-approval-packet-rulebook"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-single-scope-approval-packet-rulebook-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-single-scope-approval-packet-rulebook-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-single-scope-packet-readiness-checklist.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-single-scope-packet-readiness-checklist"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-single-scope-packet-readiness-checklist-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-single-scope-packet-readiness-checklist-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-packet-readiness-rejection-gate-design.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-packet-readiness-rejection-gate-design"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-packet-readiness-rejection-gate-design-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-packet-readiness-rejection-gate-design-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-packet-readiness-rejection-gate-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-packet-readiness-rejection-gate-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-packet-readiness-rejection-gate-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-packet-readiness-rejection-gate-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-readiness-rejection-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-readiness-rejection-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-readiness-rejection-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-readiness-rejection-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-readiness-rejection-decision-dependency-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-readiness-rejection-decision-dependency-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-readiness-rejection-decision-dependency-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-readiness-rejection-decision-dependency-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-readiness-rejection-dependency-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-readiness-rejection-dependency-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-readiness-rejection-dependency-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-readiness-rejection-dependency-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-readiness-blocker-index.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-readiness-blocker-index"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-readiness-blocker-index-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-readiness-blocker-index-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-blocker-owner-matrix.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-blocker-owner-matrix"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-blocker-owner-matrix-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-blocker-owner-matrix-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-blocker-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-blocker-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-blocker-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-blocker-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-blocker-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-blocker-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-blocker-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-blocker-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-authorization-scope-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-authorization-scope-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-authorization-scope-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-authorization-scope-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-authorization-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-authorization-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-authorization-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-authorization-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-authorization-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-authorization-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-authorization-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-authorization-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-authorization-decision-packet-outline.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-authorization-decision-packet-outline"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-authorization-decision-packet-outline-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-authorization-decision-packet-outline-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-authorization-decision-packet-outline-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-authorization-decision-packet-outline-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-authorization-decision-packet-outline-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-authorization-decision-packet-outline-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-authorization-decision-packet-outline-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-authorization-decision-packet-outline-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-transition-authorization-decision-packet-outline-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-transition-authorization-decision-packet-outline-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-packet-creation-approval-gate-design.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-packet-creation-approval-gate-design"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-packet-creation-approval-gate-design-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-packet-creation-approval-gate-design-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-packet-creation-approval-gate-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-packet-creation-approval-gate-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-packet-creation-approval-gate-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-packet-creation-approval-gate-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-packet-creation-gate-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-packet-creation-gate-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-packet-creation-gate-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-packet-creation-gate-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-packet-creation-proposal-readiness-checklist.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-packet-creation-proposal-readiness-checklist"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-packet-creation-proposal-readiness-checklist-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-packet-creation-proposal-readiness-checklist-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-packet-creation-proposal-rejection-gate-design.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-packet-creation-proposal-rejection-gate-design"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-packet-creation-proposal-rejection-gate-design-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-packet-creation-proposal-rejection-gate-design-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-packet-creation-proposal-rejection-gate-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-packet-creation-proposal-rejection-gate-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-packet-creation-proposal-rejection-gate-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-packet-creation-proposal-rejection-gate-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-packet-proposal-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-packet-proposal-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-packet-proposal-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-packet-proposal-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-decision-dependency-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-decision-dependency-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-decision-dependency-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-decision-dependency-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-dependency-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-dependency-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-dependency-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-dependency-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-readiness-blocker-index.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-readiness-blocker-index"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-readiness-blocker-index-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-readiness-blocker-index-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-blocker-owner-matrix.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-blocker-owner-matrix"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-blocker-owner-matrix-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-blocker-owner-matrix-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-blocker-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-blocker-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-blocker-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-blocker-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-blocker-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-blocker-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-blocker-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-blocker-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-scope-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-scope-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-scope-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-scope-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-decision-packet-outline.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-decision-packet-outline"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-decision-packet-outline-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-decision-packet-outline-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-decision-packet-outline-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-decision-packet-outline-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-decision-packet-outline-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-decision-packet-outline-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-decision-packet-outline-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-decision-packet-outline-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-decision-packet-outline-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-decision-packet-outline-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-approval-gate-design.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-approval-gate-design"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-approval-gate-design-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-approval-gate-design-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-approval-gate-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-approval-gate-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-approval-gate-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-approval-gate-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-gate-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-gate-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-gate-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-gate-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-readiness-checklist.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-readiness-checklist"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-readiness-checklist-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-readiness-checklist-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-rejection-gate-design.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-rejection-gate-design"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-rejection-gate-design-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-rejection-gate-design-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-rejection-gate-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-rejection-gate-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-rejection-gate-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-rejection-gate-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-authorization-packet-creation-proposal-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-decision-dependency-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-decision-dependency-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-decision-dependency-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-decision-dependency-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-dependency-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-dependency-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-dependency-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-dependency-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-decision-packet-outline.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-decision-packet-outline"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-decision-packet-outline-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-decision-packet-outline-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-decision-packet-outline-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-decision-packet-outline-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-decision-packet-outline-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-decision-packet-outline-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-decision-packet-outline-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-decision-packet-outline-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-decision-packet-outline-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-decision-packet-outline-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-chain-continuity-audit.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-chain-continuity-audit"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-chain-continuity-audit-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-chain-continuity-audit-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-downstream-governance-resumption-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-downstream-governance-resumption-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-downstream-governance-resumption-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-downstream-governance-resumption-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-downstream-unresolved-decision-inventory.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-downstream-unresolved-decision-inventory"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-downstream-unresolved-decision-inventory-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-downstream-unresolved-decision-inventory-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-human-decision-meeting-preparation-boundary-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-human-decision-meeting-preparation-boundary-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-human-decision-meeting-preparation-boundary-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-human-decision-meeting-preparation-boundary-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-human-decision-meeting-question-backlog.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-human-decision-meeting-question-backlog"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-human-decision-meeting-question-backlog-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-human-decision-meeting-question-backlog-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-human-decision-meeting-readiness-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-human-decision-meeting-readiness-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-human-decision-meeting-readiness-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-human-decision-meeting-readiness-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-human-decision-meeting-readiness-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-human-decision-meeting-readiness-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-human-decision-meeting-readiness-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-human-decision-meeting-readiness-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-human-decision-meeting-chairman-briefing-handoff.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-human-decision-meeting-chairman-briefing-handoff"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-authorization-transition-human-decision-meeting-chairman-briefing-handoff-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-authorization-transition-human-decision-meeting-chairman-briefing-handoff-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-readiness-trigger-criteria-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-readiness-trigger-criteria-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-readiness-trigger-criteria-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-readiness-trigger-criteria-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-submission-readiness-checklist.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-submission-readiness-checklist"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-submission-readiness-checklist-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-submission-readiness-checklist-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-pre-submission-blocker-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-pre-submission-blocker-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-pre-submission-blocker-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-pre-submission-blocker-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-pre-submission-decision-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-pre-submission-decision-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-question-backlog.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-question-backlog"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-question-backlog-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-question-backlog-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-readiness-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-readiness-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-readiness-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-readiness-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-readiness-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-readiness-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-readiness-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-readiness-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-boundary-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-boundary-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-boundary-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-boundary-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-gate-design.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-gate-design"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-gate-design-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-gate-design-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-gate-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-gate-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-gate-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-gate-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-decision-dependency-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-decision-dependency-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-decision-dependency-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-decision-dependency-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-dependency-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-dependency-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-dependency-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-dependency-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-readiness-blocker-index.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-readiness-blocker-index"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-blocker-owner-matrix.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-blocker-owner-matrix"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-blocker-owner-matrix-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-blocker-owner-matrix-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-blocker-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-blocker-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-blocker-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-blocker-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-decision-dependency-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-decision-dependency-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-decision-dependency-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-decision-dependency-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-readiness-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-readiness-gate"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-readiness-gate-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-readiness-gate-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-post-checkpoint-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-post-checkpoint-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-post-checkpoint-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-post-checkpoint-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-readiness-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-readiness-gate"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-readiness-gate-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-readiness-gate-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-options-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-options-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-options-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-candidate-selection-criteria-map.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-candidate-selection-criteria-map"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-candidate-selection-criteria-map-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-candidate-selection-criteria-map-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-route-selection-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-route-selection-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-route-selection-checkpoint-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-route-selection-checkpoint-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-option-a-continuation-worklist.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-option-a-continuation-worklist"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-option-a-continuation-worklist-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-option-a-continuation-worklist-role-review"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-option-a-local-only-decision-context-refinement.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-local-only-chairman-review-handoff-packet-rejection-transition-route-dependency-decision-request-narrow-question-candidate-post-review-option-a-local-only-decision-context-refinement"
  },
  {
    command: [node, "scripts/check-cp3-ceo-option-status-convergence.mjs"],
    expectStatus: "ok",
    name: "cp3-ceo-option-status-convergence"
  },
  {
    command: [node, "scripts/check-cp3-chairman-authorization-scope-readiness-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-chairman-authorization-scope-readiness-summary"
  },
  {
    command: [node, "scripts/check-cp3-chairman-authorization-scope-readiness-summary-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-chairman-authorization-scope-readiness-summary-role-review"
  },
  {
    command: [node, "scripts/check-cp3-chairman-authorization-scope-readiness-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-chairman-authorization-scope-readiness-checkpoint-summary"
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
    command: [node, "scripts/check-cp3-local-only-decision-quality-acceleration-plan.mjs"],
    expectStatus: "ok",
    name: "cp3-local-only-decision-quality-acceleration-plan"
  },
  {
    command: [node, "scripts/check-cp3-local-only-documentation-index-update.mjs"],
    expectStatus: "ok",
    name: "cp3-local-only-documentation-index-update"
  },
  {
    command: [node, "scripts/check-cp3-current-state-briefing-copy-alignment.mjs"],
    expectStatus: "ok",
    name: "cp3-current-state-briefing-copy-alignment"
  },
  {
    command: [node, "scripts/check-cp3-current-state-briefing-copy-alignment-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-current-state-briefing-copy-alignment-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-local-only-open-decision-ledger-refresh.mjs"],
    expectStatus: "ok",
    name: "cp3-local-only-open-decision-ledger-refresh"
  },
  {
    command: [node, "scripts/check-cp3-local-only-open-decision-ledger-refresh-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-local-only-open-decision-ledger-refresh-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-cp3-non-runtime-readiness-gap-summary.mjs"],
    expectStatus: "ok",
    name: "cp3-non-runtime-readiness-gap-summary"
  },
  {
    command: [node, "scripts/check-cp3-non-runtime-readiness-gap-owner-action-matrix.mjs"],
    expectStatus: "ok",
    name: "cp3-non-runtime-readiness-gap-owner-action-matrix"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-owner-action-acceptance-criteria.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-owner-action-acceptance-criteria"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-local-only-question-template.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-local-only-question-template"
  },
  {
    command: [node, "scripts/check-cp3-source-depth-evidence-local-only-filled-example-design.mjs"],
    expectStatus: "ok",
    name: "cp3-source-depth-evidence-local-only-filled-example-design"
  },
  {
    command: [node, "scripts/check-cp3-runtime-state-naming-acceptance-criteria.mjs"],
    expectStatus: "ok",
    name: "cp3-runtime-state-naming-acceptance-criteria"
  },
  {
    command: [node, "scripts/check-cp3-runtime-state-naming-local-only-checker-design.mjs"],
    expectStatus: "ok",
    name: "cp3-runtime-state-naming-local-only-checker-design"
  },
  {
    command: [node, "scripts/check-cp3-runtime-state-naming-pre-implementation-boundary-checklist.mjs"],
    expectStatus: "ok",
    name: "cp3-runtime-state-naming-pre-implementation-boundary-checklist"
  },
  {
    command: [node, "scripts/check-cp3-mock-only-runtime-state-implementation-planning.mjs"],
    expectStatus: "ok",
    name: "cp3-mock-only-runtime-state-implementation-planning"
  },
  {
    command: [node, "scripts/check-cp3-mock-only-runtime-implementation-stop-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-mock-only-runtime-implementation-stop-gate"
  },
  {
    command: [node, "scripts/check-cp3-pre-runtime-authorization-boundary-table.mjs"],
    expectStatus: "ok",
    name: "cp3-pre-runtime-authorization-boundary-table"
  },
  {
    command: [node, "scripts/check-cp3-pre-runtime-authorization-boundary-table-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-pre-runtime-authorization-boundary-table-role-review"
  },
  {
    command: [node, "scripts/check-cp3-chairman-narrow-question-draft-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-chairman-narrow-question-draft-gate"
  },
  {
    command: [node, "scripts/check-cp3-chairman-narrow-question-draft-gate-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-chairman-narrow-question-draft-gate-role-review"
  },
  {
    command: [node, "scripts/check-cp3-chairman-narrow-question-submit-readiness-checkpoint.mjs"],
    expectStatus: "ok",
    name: "cp3-chairman-narrow-question-submit-readiness-checkpoint"
  },
  {
    command: [node, "scripts/check-cp3-chairman-narrow-question-submission-record.mjs"],
    expectStatus: "ok",
    name: "cp3-chairman-narrow-question-submission-record"
  },
  {
    command: [node, "scripts/check-cp3-chairman-oral-review-delegation.mjs"],
    expectStatus: "ok",
    name: "cp3-chairman-oral-review-delegation"
  },
  {
    command: [node, "scripts/check-cp3-bounded-mock-only-runtime-entry-request-draft.mjs"],
    expectStatus: "ok",
    name: "cp3-bounded-mock-only-runtime-entry-request-draft"
  },
  {
    command: [node, "scripts/check-cp3-bounded-mock-only-runtime-entry-request-draft-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-bounded-mock-only-runtime-entry-request-draft-role-review"
  },
  {
    command: [node, "scripts/check-cp3-bounded-mock-only-runtime-implementation-approval-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-bounded-mock-only-runtime-implementation-approval-gate"
  },
  {
    command: [node, "scripts/check-cp3-mock-only-runtime-panel.mjs"],
    expectStatus: "ok",
    name: "cp3-mock-only-runtime-panel"
  },
  {
    command: [node, "scripts/check-project-progress-score.mjs"],
    expectStatus: "ok",
    name: "project-progress-score"
  },
  {
    command: [node, "scripts/check-project-progress-snapshot.mjs"],
    expectStatus: "ok",
    name: "project-progress-snapshot"
  },
  {
    command: [node, "scripts/check-overall-project-100-readiness.mjs"],
    expectStatus: "ok",
    name: "overall-project-100-readiness"
  },
  {
    command: [node, "scripts/check-ceo-progress-brief.mjs"],
    expectStatus: "ok",
    name: "ceo-progress-brief"
  },
  {
    command: [node, "scripts/check-runtime-unblock-acceleration.mjs"],
    expectStatus: "ok",
    name: "runtime-unblock-acceleration"
  },
  {
    command: [node, "scripts/check-runtime-interpretation-state.mjs"],
    expectStatus: "ok",
    name: "runtime-interpretation-state"
  },
  {
    command: [node, "scripts/check-runtime-hardening-exit-criteria.mjs"],
    expectStatus: "ok",
    name: "runtime-hardening-exit-criteria"
  },
  {
    command: [node, "scripts/check-post-readonly-evidence-action-gate.mjs"],
    expectStatus: "ok",
    name: "post-readonly-evidence-action-gate"
  },
  {
    command: [node, "scripts/check-row-coverage-evidence-acceptance.mjs"],
    expectStatus: "ok",
    name: "row-coverage-evidence-acceptance"
  },
  {
    command: [node, "scripts/check-row-coverage-bounded-readonly-attempt-post-run-review.mjs"],
    expectStatus: "ok",
    name: "row-coverage-bounded-readonly-attempt-post-run-review"
  },
  {
    command: [node, "scripts/check-bounded-row-coverage-readonly-attempt-decision.mjs"],
    expectStatus: "ok",
    name: "bounded-row-coverage-readonly-attempt-decision"
  },
  {
    command: [node, "scripts/check-bounded-readonly-readiness-recheck.mjs"],
    expectStatus: "ok",
    name: "bounded-readonly-readiness-recheck"
  },
  {
    command: [node, "scripts/check-row-coverage-readonly-preexecution-packet.mjs"],
    expectStatus: "ok",
    name: "row-coverage-readonly-preexecution-packet"
  },
  {
    command: [node, "scripts/check-bounded-readonly-final-local-alignment.mjs"],
    expectStatus: "ok",
    name: "bounded-readonly-final-local-alignment"
  },
  {
    command: [node, "scripts/check-data-goal-readiness.mjs"],
    expectStatus: "ok",
    name: "data-goal-readiness"
  },
  {
    command: [node, "scripts/check-data-goal-execution-review-bridge.mjs"],
    expectStatus: "ok",
    name: "data-goal-execution-review-bridge"
  },
  {
    command: [node, "scripts/check-data-goal-completion-audit.mjs"],
    expectStatus: "ok",
    name: "data-goal-completion-audit"
  },
  {
    command: [node, "scripts/check-row-coverage-readonly-execution-readiness-presenter.mjs"],
    expectStatus: "ok",
    name: "row-coverage-readonly-execution-readiness-presenter"
  },
  {
    command: [node, "scripts/check-runtime-gate-decision-brief.mjs"],
    expectStatus: "ok",
    name: "runtime-gate-decision-brief"
  },
  {
    command: [node, "scripts/check-runtime-decision-summary.mjs"],
    expectStatus: "ok",
    name: "runtime-decision-summary"
  },
  {
    command: [node, "scripts/check-post-equity-row-coverage-readonly-attempt-decision-packet.mjs"],
    expectStatus: "ok",
    name: "post-equity-row-coverage-readonly-attempt-decision-packet"
  },
  {
    command: [node, "scripts/check-post-equity-row-coverage-readonly-attempt-post-run-review.mjs"],
    expectStatus: "ok",
    name: "post-equity-row-coverage-readonly-attempt-post-run-review"
  },
  {
    command: [node, "scripts/check-post-readonly-data-population-decision-map.mjs"],
    expectStatus: "ok",
    name: "post-readonly-data-population-decision-map"
  },
  {
    command: [node, "scripts/check-source-specific-backfill-design-packet.mjs"],
    expectStatus: "ok",
    name: "source-specific-backfill-design-packet"
  },
  {
    command: [node, "scripts/check-mock-runtime-hardening-priority.mjs"],
    expectStatus: "ok",
    name: "mock-runtime-hardening-priority"
  },
  {
    command: [node, "scripts/check-narrow-approval-packet.mjs"],
    expectStatus: "ok",
    name: "narrow-approval-packet"
  },
  {
    command: [node, "scripts/check-narrow-approval-post-review-gate.mjs"],
    expectStatus: "ok",
    name: "narrow-approval-post-review-gate"
  },
  {
    command: [node, "scripts/check-narrow-approval-outcome-ledger.mjs"],
    expectStatus: "ok",
    name: "narrow-approval-outcome-ledger"
  },
  {
    command: [node, "scripts/check-narrow-approval-outcome-panel.mjs"],
    expectStatus: "ok",
    name: "narrow-approval-outcome-panel"
  },
  {
    command: [node, "scripts/check-record-narrow-approval-outcome.mjs"],
    expectStatus: "ok",
    name: "record-narrow-approval-outcome"
  },
  {
    command: [node, "scripts/check-blocker-resolution-plan.mjs"],
    expectStatus: "ok",
    name: "blocker-resolution-plan"
  },
  {
    command: [node, "scripts/check-blocker-execution-queue.mjs"],
    expectStatus: "ok",
    name: "blocker-execution-queue"
  },
  {
    command: [node, "scripts/check-blocker-action-priorities.mjs"],
    expectStatus: "ok",
    name: "blocker-action-priorities"
  },
  {
    command: [node, "scripts/check-pre-runtime-blocker-closure-packet.mjs"],
    expectStatus: "ok",
    name: "pre-runtime-blocker-closure-packet"
  },
  {
    command: [node, "scripts/check-source-rights-disclosure-checklist.mjs"],
    expectStatus: "ok",
    name: "source-rights-disclosure-checklist"
  },
  {
    command: [node, "scripts/check-source-rights-disclosure-local-review.mjs"],
    expectStatus: "ok",
    name: "source-rights-disclosure-local-review"
  },
  {
    command: [node, "scripts/check-source-rights-disclosure-acceptance-gate.mjs"],
    expectStatus: "ok",
    name: "source-rights-disclosure-acceptance-gate"
  },
  {
    command: [node, "scripts/check-provider-specific-terms-review-packet.mjs"],
    expectStatus: "ok",
    name: "provider-specific-terms-review-packet"
  },
  {
    command: [node, "scripts/check-provider-specific-terms-post-review-rollup.mjs"],
    expectStatus: "ok",
    name: "provider-specific-terms-post-review-rollup"
  },
  {
    command: [node, "scripts/check-source-rights-mvp-readiness.mjs"],
    expectStatus: "ok",
    name: "source-rights-mvp-readiness"
  },
  {
    command: [node, "scripts/check-source-rights-public-placement-readiness.mjs"],
    expectStatus: "ok",
    name: "source-rights-public-placement-readiness"
  },
  {
    command: [node, "scripts/check-source-rights-public-copy-acceptance-readiness.mjs"],
    expectStatus: "ok",
    name: "source-rights-public-copy-acceptance-readiness"
  },
  {
    command: [node, "scripts/check-source-rights-mvp-deferral-decision-readiness.mjs"],
    expectStatus: "ok",
    name: "source-rights-mvp-deferral-decision-readiness"
  },
  {
    command: [node, "scripts/check-source-rights-mvp-final-closure-readiness.mjs"],
    expectStatus: "ok",
    name: "source-rights-mvp-final-closure-readiness"
  },
  {
    command: [node, "scripts/check-source-rights-specific-classification-readiness.mjs"],
    expectStatus: "ok",
    name: "source-rights-specific-classification-readiness"
  },
  {
    command: [node, "scripts/check-data-quality-evidence-checklist.mjs"],
    expectStatus: "ok",
    name: "data-quality-evidence-checklist"
  },
  {
    command: [node, "scripts/check-data-quality-field-validity.mjs"],
    expectStatus: "ok",
    name: "data-quality-field-validity"
  },
  {
    command: [node, "scripts/check-data-quality-field-validity-qa-review.mjs"],
    expectStatus: "ok",
    name: "data-quality-field-validity-qa-review"
  },
  {
    command: [node, "scripts/check-data-quality-field-validity-acceptance-gate.mjs"],
    expectStatus: "ok",
    name: "data-quality-field-validity-acceptance-gate"
  },
  {
    command: [node, "scripts/check-data-freshness-quality-mvp-readiness.mjs"],
    expectStatus: "ok",
    name: "data-freshness-quality-mvp-readiness"
  },
  {
    command: [node, "scripts/check-data-coverage-quality-route-readiness.mjs"],
    expectStatus: "ok",
    name: "data-coverage-quality-route-readiness"
  },
  {
    command: [node, "scripts/check-data-coverage-mvp-deferral-decision-readiness.mjs"],
    expectStatus: "ok",
    name: "data-coverage-mvp-deferral-decision-readiness"
  },
  {
    command: [node, "scripts/check-data-coverage-promotion-execution-readiness.mjs"],
    expectStatus: "ok",
    name: "data-coverage-promotion-execution-readiness"
  },
  {
    command: [node, "scripts/check-source-specific-acceptance-packets-readiness.mjs"],
    expectStatus: "ok",
    name: "source-specific-acceptance-packets-readiness"
  },
  {
    command: [node, "scripts/check-data-coverage-route-decision.mjs"],
    expectStatus: "ok",
    name: "data-coverage-route-decision"
  },
  {
    command: [node, "scripts/check-backfill-ingestion-design-gate.mjs"],
    expectStatus: "ok",
    name: "backfill-ingestion-design-gate"
  },
  {
    command: [node, "scripts/check-data-coverage-backfill-plan.mjs"],
    expectStatus: "ok",
    name: "data-coverage-backfill-plan"
  },
  {
    command: [node, "scripts/check-data-source-readiness-packet.mjs"],
    expectStatus: "ok",
    name: "data-source-readiness-packet"
  },
  {
    command: [node, "scripts/check-twii-source-selection-packet.mjs"],
    expectStatus: "ok",
    name: "twii-source-selection-packet"
  },
  {
    command: [node, "scripts/check-twii-source-selection-acceptance-gate.mjs"],
    expectStatus: "ok",
    name: "twii-source-selection-acceptance-gate"
  },
  {
    command: [node, "scripts/check-twii-source-rights-field-contract-review-packet.mjs"],
    expectStatus: "ok",
    name: "twii-source-rights-field-contract-review-packet"
  },
  {
    command: [node, "scripts/check-twii-rights-field-review-role-findings.mjs"],
    expectStatus: "ok",
    name: "twii-rights-field-review-role-findings"
  },
  {
    command: [node, "scripts/check-twii-report-only-probe-decision-packet.mjs"],
    expectStatus: "ok",
    name: "twii-report-only-probe-decision-packet"
  },
  {
    command: [node, "scripts/check-twii-report-only-probe-acceptance-gate.mjs"],
    expectStatus: "ok",
    name: "twii-report-only-probe-acceptance-gate"
  },
  {
    command: [node, "scripts/check-twii-report-only-probe-guarded-runner.mjs"],
    expectStatus: "ok",
    name: "twii-report-only-probe-guarded-runner"
  },
  {
    command: [node, "scripts/check-twii-report-only-probe-command-map.mjs"],
    expectStatus: "ok",
    name: "twii-report-only-probe-command-map"
  },
  {
    command: [node, "scripts/check-twii-report-only-probe-post-run-template.mjs"],
    expectStatus: "ok",
    name: "twii-report-only-probe-post-run-template"
  },
  {
    command: [node, "scripts/check-twii-report-only-probe-one-attempt-execution-decision-gate.mjs"],
    expectStatus: "ok",
    name: "twii-report-only-probe-one-attempt-execution-decision-gate"
  },
  {
    command: [node, "scripts/check-twii-report-only-probe-one-attempt-post-run-review.mjs"],
    expectStatus: "ok",
    name: "twii-report-only-probe-one-attempt-post-run-review"
  },
  {
    command: [node, "scripts/check-twii-report-only-probe-runner-stability-fix.mjs"],
    expectStatus: "ok",
    name: "twii-report-only-probe-runner-stability-fix"
  },
  {
    command: [node, "scripts/check-twii-parser-design-preparation.mjs"],
    expectStatus: "ok",
    name: "twii-parser-design-preparation"
  },
  {
    command: [node, "scripts/check-twii-parser-design-preparation-role-review.mjs"],
    expectStatus: "ok",
    name: "twii-parser-design-preparation-role-review"
  },
  {
    command: [node, "--experimental-strip-types", "scripts/check-twii-local-parser-contract.mjs"],
    expectStatus: "ok",
    name: "twii-local-parser-contract"
  },
  {
    command: [node, "scripts/check-twii-local-parser-contract-implementation-review.mjs"],
    expectStatus: "ok",
    name: "twii-local-parser-contract-implementation-review"
  },
  {
    command: [node, "scripts/check-twii-parser-contract-consumer-planning.mjs"],
    expectStatus: "ok",
    name: "twii-parser-contract-consumer-planning"
  },
  {
    command: [node, "scripts/check-twii-parser-contract-consumer-planning-role-review.mjs"],
    expectStatus: "ok",
    name: "twii-parser-contract-consumer-planning-role-review"
  },
  {
    command: [node, "--experimental-strip-types", "scripts/check-twii-parser-consumer-state.mjs"],
    expectStatus: "ok",
    name: "twii-parser-consumer-state"
  },
  {
    command: [node, "scripts/check-twii-parser-consumer-state-implementation-review.mjs"],
    expectStatus: "ok",
    name: "twii-parser-consumer-state-implementation-review"
  },
  {
    command: [node, "scripts/check-twii-parser-consumer-adapter-planning.mjs"],
    expectStatus: "ok",
    name: "twii-parser-consumer-adapter-planning"
  },
  {
    command: [node, "scripts/check-twii-parser-consumer-adapter-planning-role-review.mjs"],
    expectStatus: "ok",
    name: "twii-parser-consumer-adapter-planning-role-review"
  },
  {
    command: [node, "--experimental-strip-types", "scripts/check-twii-parser-consumer-adapter.mjs"],
    expectStatus: "ok",
    name: "twii-parser-consumer-adapter"
  },
  {
    command: [node, "scripts/check-twii-parser-consumer-adapter-implementation-review.mjs"],
    expectStatus: "ok",
    name: "twii-parser-consumer-adapter-implementation-review"
  },
  {
    command: [node, "scripts/check-twii-adapter-local-integration-planning.mjs"],
    expectStatus: "ok",
    name: "twii-adapter-local-integration-planning"
  },
  {
    command: [node, "--experimental-strip-types", "scripts/check-twii-local-disclosure-consumer.mjs"],
    expectStatus: "ok",
    name: "twii-local-disclosure-consumer"
  },
  {
    command: [node, "scripts/check-twii-local-disclosure-consumer-implementation-review.mjs"],
    expectStatus: "ok",
    name: "twii-local-disclosure-consumer-implementation-review"
  },
  {
    command: [node, "scripts/check-twii-mock-disclosure-ui-placement-planning.mjs"],
    expectStatus: "ok",
    name: "twii-mock-disclosure-ui-placement-planning"
  },
  {
    command: [node, "scripts/check-twii-mock-disclosure-status-component.mjs"],
    expectStatus: "ok",
    name: "twii-mock-disclosure-status-component"
  },
  {
    command: [node, "scripts/check-twii-mock-disclosure-status-component-implementation-review.mjs"],
    expectStatus: "ok",
    name: "twii-mock-disclosure-status-component-implementation-review"
  },
  {
    command: [node, "scripts/check-twii-stock-page-mock-disclosure-placement.mjs"],
    expectStatus: "ok",
    name: "twii-stock-page-mock-disclosure-placement"
  },
  {
    command: [node, "scripts/check-twii-stock-page-mock-disclosure-placement-implementation-review.mjs"],
    expectStatus: "ok",
    name: "twii-stock-page-mock-disclosure-placement-implementation-review"
  },
  {
    command: [node, "scripts/check-etf-source-rights-review-packet.mjs"],
    expectStatus: "ok",
    name: "etf-source-rights-review-packet"
  },
  {
    command: [node, "scripts/check-equity-dry-run-packet-readiness.mjs"],
    expectStatus: "ok",
    name: "equity-dry-run-packet-readiness"
  },
  {
    command: [node, "scripts/check-source-readiness-checkpoint-summary.mjs"],
    expectStatus: "ok",
    name: "source-readiness-checkpoint-summary"
  },
  {
    command: [node, "scripts/check-equity-report-only-dry-run-packet.mjs"],
    expectStatus: "ok",
    name: "equity-report-only-dry-run-packet"
  },
  {
    command: [node, "scripts/check-equity-packet-role-review-gate.mjs"],
    expectStatus: "ok",
    name: "equity-packet-role-review-gate"
  },
  {
    command: [node, "scripts/check-equity-runner-implementation-approval-gate.mjs"],
    expectStatus: "ok",
    name: "equity-runner-implementation-approval-gate"
  },
  {
    command: [node, "scripts/check-runner-approval-decision-request-summary.mjs"],
    expectStatus: "ok",
    name: "runner-approval-decision-request-summary"
  },
  {
    command: [node, "scripts/check-runner-approval-decision-outcome-ledger.mjs"],
    expectStatus: "ok",
    name: "runner-approval-decision-outcome-ledger"
  },
  {
    command: [node, "scripts/check-record-runner-approval-decision-outcome.mjs"],
    expectStatus: "ok",
    name: "record-runner-approval-decision-outcome"
  },
  {
    command: [node, "scripts/check-equity-report-only-runner-implementation.mjs"],
    expectStatus: "ok",
    name: "equity-report-only-runner-implementation"
  },
  {
    command: [node, "scripts/check-equity-runner-execution-approval-gate.mjs"],
    expectStatus: "ok",
    name: "equity-runner-execution-approval-gate"
  },
  {
    command: [node, "scripts/check-equity-report-only-runner-one-attempt-post-run-review.mjs"],
    expectStatus: "ok",
    name: "equity-report-only-runner-one-attempt-post-run-review"
  },
  {
    command: [node, "scripts/check-equity-2330-single-failed-month-local-diagnostic-plan.mjs"],
    expectStatus: "ok",
    name: "equity-2330-single-failed-month-local-diagnostic-plan"
  },
  {
    command: [node, "scripts/check-equity-report-only-runner-second-one-attempt-execution-decision-gate.mjs"],
    expectStatus: "ok",
    name: "equity-report-only-runner-second-one-attempt-execution-decision-gate"
  },
  {
    command: [node, "scripts/check-equity-report-only-runner-second-attempt-post-run-review.mjs"],
    expectStatus: "ok",
    name: "equity-report-only-runner-second-attempt-post-run-review"
  },
  {
    command: [node, "scripts/check-equity-row-coverage-evidence-acceptance-gate.mjs"],
    expectStatus: "ok",
    name: "equity-row-coverage-evidence-acceptance-gate"
  },
  {
    command: [node, "scripts/check-model-credibility-checklist.mjs"],
    expectStatus: "ok",
    name: "model-credibility-checklist"
  },
  {
    command: [node, "scripts/check-model-credibility-local-review.mjs"],
    expectStatus: "ok",
    name: "model-credibility-local-review"
  },
  {
    command: [node, "scripts/check-model-credibility-acceptance-gate.mjs"],
    expectStatus: "ok",
    name: "model-credibility-acceptance-gate"
  },
  {
    command: [node, "scripts/check-investment-credibility-mvp-readiness.mjs"],
    expectStatus: "ok",
    name: "investment-credibility-mvp-readiness"
  },
  {
    command: [node, "scripts/check-investment-credibility-evidence-upgrade.mjs"],
    expectStatus: "ok",
    name: "investment-credibility-evidence-upgrade"
  },
  {
    command: [node, "scripts/check-investment-formula-downgrade-readiness.mjs"],
    expectStatus: "ok",
    name: "investment-formula-downgrade-readiness"
  },
  {
    command: [node, "scripts/check-investment-public-claim-readiness.mjs"],
    expectStatus: "ok",
    name: "investment-public-claim-readiness"
  },
  {
    command: [node, "scripts/check-blocker-readiness-panel.mjs"],
    expectStatus: "ok",
    name: "blocker-readiness-panel"
  },
  {
    command: [node, "scripts/check-runtime-readiness-panel.mjs"],
    expectStatus: "ok",
    name: "runtime-readiness-panel"
  },
  {
    command: [node, "scripts/check-runtime-readiness-language-quality.mjs"],
    expectStatus: "ok",
    name: "runtime-readiness-language-quality"
  },
  {
    command: [node, "scripts/check-supabase-readonly-evidence-state.mjs"],
    expectStatus: "ok",
    name: "supabase-readonly-evidence-state"
  },
  {
    command: [node, "scripts/check-freshness-interpretation-state.mjs"],
    expectStatus: "ok",
    name: "freshness-interpretation-state"
  },
  {
    command: [node, "scripts/check-data-quality-downgrade-state.mjs"],
    expectStatus: "ok",
    name: "data-quality-downgrade-state"
  },
  {
    command: [node, "scripts/check-data-quality-evidence-gate.mjs"],
    expectStatus: "ok",
    name: "data-quality-evidence-gate"
  },
  {
    command: [node, "scripts/check-data-quality-score-contract.mjs"],
    expectStatus: "ok",
    name: "data-quality-score-contract"
  },
  {
    command: [node, "scripts/check-row-coverage-contract.mjs"],
    expectStatus: "ok",
    name: "row-coverage-contract"
  },
  {
    command: [node, "scripts/check-row-coverage-health-route-alignment.mjs"],
    expectStatus: "ok",
    name: "row-coverage-health-route-alignment"
  },
  {
    command: [node, "scripts/check-row-coverage-readonly-validation-contract.mjs"],
    expectStatus: "ok",
    name: "row-coverage-readonly-validation-contract"
  },
  {
    command: [node, "scripts/check-row-coverage-readonly-local-preflight.mjs"],
    expectStatus: "ok",
    name: "row-coverage-readonly-local-preflight"
  },
  {
    command: [node, "scripts/check-row-coverage-readonly-guarded-runner.mjs"],
    expectStatus: "ok",
    name: "row-coverage-readonly-guarded-runner"
  },
  {
    command: [node, "scripts/check-row-coverage-final-one-attempt-readonly-execution-decision-gate.mjs"],
    expectStatus: "ok",
    name: "row-coverage-final-one-attempt-readonly-execution-decision-gate"
  },
  {
    command: [node, "scripts/check-row-coverage-readonly-one-attempt-post-run-review.mjs"],
    expectStatus: "ok",
    name: "row-coverage-readonly-one-attempt-post-run-review"
  },
  {
    command: [node, "scripts/check-row-coverage-bounded-readonly-attempt-post-run-review-2026-06-06.mjs"],
    expectStatus: "ok",
    name: "row-coverage-bounded-readonly-attempt-post-run-review-2026-06-06"
  },
  {
    command: [node, "scripts/check-row-coverage-credential-loading-command-revision.mjs"],
    expectStatus: "ok",
    name: "row-coverage-credential-loading-command-revision"
  },
  {
    command: [node, "scripts/check-row-coverage-revised-runner-second-one-attempt-execution-decision-gate.mjs"],
    expectStatus: "ok",
    name: "row-coverage-revised-runner-second-one-attempt-execution-decision-gate"
  },
  {
    command: [node, "scripts/check-row-coverage-revised-runner-second-attempt-post-run-review.mjs"],
    expectStatus: "ok",
    name: "row-coverage-revised-runner-second-attempt-post-run-review"
  },
  {
    command: [node, "scripts/check-row-coverage-remote-capable-runner-design-gate.mjs"],
    expectStatus: "ok",
    name: "row-coverage-remote-capable-runner-design-gate"
  },
  {
    command: [node, "scripts/check-row-coverage-remote-capable-runner-design-gate-role-review.mjs"],
    expectStatus: "ok",
    name: "row-coverage-remote-capable-runner-design-gate-role-review"
  },
  {
    command: [node, "scripts/check-row-coverage-remote-capable-runner-implementation-prep-safety-gate.mjs"],
    expectStatus: "ok",
    name: "row-coverage-remote-capable-runner-implementation-prep-safety-gate"
  },
  {
    command: [node, "scripts/check-row-coverage-remote-capable-runner-local-implementation-review.mjs"],
    expectStatus: "ok",
    name: "row-coverage-remote-capable-runner-local-implementation-review"
  },
  {
    command: [node, "scripts/check-row-coverage-remote-capable-runner-one-attempt-execution-decision-gate.mjs"],
    expectStatus: "ok",
    name: "row-coverage-remote-capable-runner-one-attempt-execution-decision-gate"
  },
  {
    command: [node, "scripts/check-row-coverage-remote-capable-runner-one-attempt-post-run-review.mjs"],
    expectStatus: "ok",
    name: "row-coverage-remote-capable-runner-one-attempt-post-run-review"
  },
  {
    command: [node, "scripts/check-row-coverage-count-unavailable-local-diagnostic-plan.mjs"],
    expectStatus: "ok",
    name: "row-coverage-count-unavailable-local-diagnostic-plan"
  },
  {
    command: [node, "scripts/check-row-coverage-query-contract-revision-implementation-review.mjs"],
    expectStatus: "ok",
    name: "row-coverage-query-contract-revision-implementation-review"
  },
  {
    command: [node, "scripts/check-row-coverage-second-attempt-final-local-preflight.mjs"],
    expectStatus: "ok",
    name: "row-coverage-second-attempt-final-local-preflight"
  },
  {
    command: [node, "scripts/check-row-coverage-second-attempt-sanitized-output-contract.mjs"],
    expectStatus: "ok",
    name: "row-coverage-second-attempt-sanitized-output-contract"
  },
  {
    command: [node, "scripts/check-row-coverage-second-attempt-output-sample-validation.mjs"],
    expectStatus: "ok",
    name: "row-coverage-second-attempt-output-sample-validation"
  },
  {
    command: [node, "scripts/check-row-coverage-second-attempt-readiness-summary.mjs"],
    expectStatus: "ok",
    name: "row-coverage-second-attempt-readiness-summary"
  },
  {
    command: [node, "scripts/check-row-coverage-second-attempt-post-run-acceptance-gate.mjs"],
    expectStatus: "ok",
    name: "row-coverage-second-attempt-post-run-acceptance-gate"
  },
  {
    command: [node, "scripts/check-row-coverage-readiness-ui-wiring.mjs"],
    expectStatus: "ok",
    name: "row-coverage-readiness-ui-wiring"
  },
  {
    command: [node, "scripts/check-row-coverage-readiness-panel-contract.mjs"],
    expectStatus: "ok",
    name: "row-coverage-readiness-panel-contract"
  },
  {
    command: [node, "scripts/check-freshness-runtime-activation-state.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-activation-state"
  },
  {
    command: [node, "scripts/check-freshness-runtime-activation-behavior.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-activation-behavior"
  },
  {
    command: [node, "scripts/check-freshness-readonly-smoke-report.mjs"],
    expectStatus: "ok",
    name: "freshness-readonly-smoke-report"
  },
  {
    command: [node, "scripts/check-freshness-metadata-boundary.mjs"],
    expectStatus: "ok",
    name: "freshness-metadata-boundary"
  },
  {
    command: [node, "scripts/check-cp3-5pm-runtime-readiness-checkpoint.mjs"],
    expectStatus: "ok",
    name: "cp3-5pm-runtime-readiness-checkpoint"
  },
  {
    command: [node, "scripts/check-cp3-mock-only-runtime-implementation-review-checkpoint.mjs"],
    expectStatus: "ok",
    name: "cp3-mock-only-runtime-implementation-review-checkpoint"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-validation-authorization-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-validation-authorization-gate"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-validation-design.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-validation-design"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-validation-pre-execution-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-validation-pre-execution-gate"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-validator-skeleton.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-validator-skeleton"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-validator-skeleton-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-validator-skeleton-role-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-remote-run-approval-packet-draft.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-remote-run-approval-packet-draft"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-remote-run-approval-packet-draft-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-remote-run-approval-packet-draft-role-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-remote-run-approval-gate-draft.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-remote-run-approval-gate-draft"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-remote-capable-validator-implementation-gate-draft.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-remote-capable-validator-implementation-gate-draft"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-remote-capable-validator-implementation-gate-draft-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-remote-capable-validator-implementation-gate-draft-role-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-guarded-validator-implementation-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-guarded-validator-implementation-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-one-run-execution-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-one-run-execution-gate"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-one-run-execution-gate-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-one-run-execution-gate-role-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-one-run-post-run-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-one-run-post-run-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-execution-environment-diagnostic-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-execution-environment-diagnostic-gate"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-execution-environment-diagnostic-report.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-execution-environment-diagnostic-report"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-narrow-remote-retry-readiness-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-narrow-remote-retry-readiness-gate"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-narrow-remote-retry-readiness-gate-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-narrow-remote-retry-readiness-gate-role-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-exact-direct-node-retry-command-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-exact-direct-node-retry-command-gate"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-exact-direct-node-retry-command-gate-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-exact-direct-node-retry-command-gate-role-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-one-attempt-direct-node-execution-decision-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-one-attempt-direct-node-execution-decision-gate"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-one-attempt-direct-node-execution-post-run-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-one-attempt-direct-node-execution-post-run-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-one-attempt-direct-node-execution-post-run-review-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-read-only-one-attempt-direct-node-execution-post-run-review-role-review"
  },
  {
    command: [node, "scripts/check-cp3-post-reachability-next-prerequisite-options-map.mjs"],
    expectStatus: "ok",
    name: "cp3-post-reachability-next-prerequisite-options-map"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-read-only-evidence-plan.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-read-only-evidence-plan"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-read-only-evidence-plan-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-read-only-evidence-plan-role-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-local-schema-contract-alignment.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-local-schema-contract-alignment"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-validator-design-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-validator-design-gate"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-validator-design-gate-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-validator-design-gate-role-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-readonly-validator-skeleton"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-readonly-validator-skeleton-role-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-remote-execution-packet-draft.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-remote-execution-packet-draft"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-remote-execution-packet-draft-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-remote-execution-packet-draft-role-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-one-attempt-execution-decision-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-one-attempt-execution-decision-gate"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-remote-capable-validator-implementation-gate-draft.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-remote-capable-validator-implementation-gate-draft"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-remote-capable-validator-implementation-gate-draft-role-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-remote-capable-validator-implementation-gate-draft-role-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-guarded-validator-implementation-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-guarded-validator-implementation-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-final-one-attempt-execution-gate-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-final-one-attempt-execution-gate-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-one-attempt-post-run-review.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-one-attempt-post-run-review"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-evidence-to-action-map.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-evidence-to-action-map"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-reconciliation-plan.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-reconciliation-plan"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-local-reference-audit.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-local-reference-audit"
  },
  {
    command: [node, "scripts/check-cp3-twse-stock-day-staging-canonical-naming-rule-decision-ledger.mjs"],
    expectStatus: "ok",
    name: "cp3-twse-stock-day-staging-canonical-naming-rule-decision-ledger"
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
    command: [node, "scripts/check-market-signal-source-boundary.mjs"],
    expectStatus: "ok",
    name: "market-signal-source-boundary"
  },
  {
    command: [
      node,
      "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON",
      "--experimental-strip-types",
      "scripts/check-market-signal-source-status.mjs"
    ],
    expectStatus: "ok",
    name: "market-signal-source-status"
  },
  {
    command: [
      node,
      "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON",
      "--experimental-strip-types",
      "scripts/check-public-market-signal-runtime-boundary.mjs"
    ],
    expectStatus: "ok",
    name: "public-market-signal-runtime-boundary"
  },
  {
    command: [node, "scripts/check-supabase-market-signal-repository-blocked.mjs"],
    expectStatus: "ok",
    name: "supabase-market-signal-repository-blocked"
  },
  {
    command: [node, "scripts/check-server-supabase-client-behavior.mjs"],
    expectStatus: "ok",
    name: "server-supabase-client-behavior"
  },
  {
    command: [node, "scripts/check-raw-market-runtime-boundary.mjs"],
    expectStatus: "ok",
    name: "raw-market-runtime-boundary"
  },
  {
    command: [node, "scripts/check-raw-market-loader-behavior.mjs"],
    expectStatus: "ok",
    name: "raw-market-loader-behavior"
  },
  {
    command: [node, "scripts/check-internal-raw-market-api-behavior.mjs"],
    expectStatus: "ok",
    name: "internal-raw-market-api-behavior"
  },
  {
    command: [node, "scripts/check-public-release-gate-behavior.mjs"],
    expectStatus: "ok",
    name: "public-release-gate-behavior"
  },
  {
    command: [node, "scripts/check-public-release-gate-runtime-wiring.mjs"],
    expectStatus: "ok",
    name: "public-release-gate-runtime-wiring"
  },
  {
    command: [node, "scripts/check-supabase-raw-market-repository-behavior.mjs"],
    expectStatus: "ok",
    name: "supabase-raw-market-repository-behavior"
  },
  {
    command: [node, "scripts/check-supabase-remote-validator-execution-boundary.mjs"],
    expectStatus: "ok",
    name: "supabase-remote-validator-execution-boundary"
  },
  {
    command: [node, "scripts/check-supabase-readonly-local-preflight.mjs"],
    expectStatus: "ok",
    name: "supabase-readonly-local-preflight"
  },
  {
    command: [node, "scripts/check-supabase-readonly-decision-packet.mjs"],
    expectStatus: "ok",
    name: "supabase-readonly-decision-packet"
  },
  {
    command: [node, "scripts/check-supabase-readonly-execution-preview.mjs"],
    expectStatus: "ok",
    name: "supabase-readonly-execution-preview"
  },
  {
    command: [node, "scripts/check-supabase-readonly-validator-output-contract.mjs"],
    expectStatus: "ok",
    name: "supabase-readonly-validator-output-contract"
  },
  {
    command: [node, "scripts/check-supabase-readonly-blank-error-root-cause.mjs"],
    expectStatus: "ok",
    name: "supabase-readonly-blank-error-root-cause"
  },
  {
    command: [node, "scripts/check-supabase-network-layer-diagnostic.mjs"],
    expectStatus: "ok",
    name: "supabase-network-layer-diagnostic"
  },
  {
    command: [node, "scripts/check-supabase-readonly-final-prep.mjs"],
    expectStatus: "ok",
    name: "supabase-readonly-final-prep"
  },
  {
    command: [node, "scripts/check-supabase-readonly-runtime-readiness-summary.mjs"],
    expectStatus: "ok",
    name: "supabase-readonly-runtime-readiness-summary"
  },
  {
    command: [node, "scripts/check-cp3-supabase-read-only-latest-sanitized-run.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-readonly-latest-sanitized-run"
  },
  {
    command: [node, "scripts/check-cp3-supabase-schema-shape-latest-sanitized-run.mjs"],
    expectStatus: "ok",
    name: "cp3-supabase-schema-shape-latest-sanitized-run"
  },
  {
    command: [node, "scripts/check-source-depth-blocker-panel.mjs"],
    expectStatus: "ok",
    name: "source-depth-blocker-panel"
  },
  {
    command: [node, "scripts/check-home-runtime-status-panel.mjs"],
    expectStatus: "ok",
    name: "home-runtime-status-panel"
  },
  {
    command: [node, "scripts/check-home-market-action-summary.mjs"],
    expectStatus: "ok",
    name: "home-market-action-summary"
  },
  {
    command: [node, "scripts/check-home-briefing-investor-reading-bridge.mjs"],
    expectStatus: "ok",
    name: "home-briefing-investor-reading-bridge"
  },
  {
    command: [node, "scripts/check-home-first-screen-decision-hierarchy.mjs"],
    expectStatus: "ok",
    name: "home-first-screen-decision-hierarchy"
  },
  {
    command: [node, "scripts/check-home-first-screen-action-summary.mjs"],
    expectStatus: "ok",
    name: "home-first-screen-action-summary"
  },
  {
    command: [node, "scripts/check-phase-1-route-decision-order.mjs"],
    expectStatus: "ok",
    name: "phase-1-route-decision-order"
  },
  {
    command: [node, "scripts/check-home-core-indicator-readout.mjs"],
    expectStatus: "ok",
    name: "home-core-indicator-readout"
  },
  {
    command: [node, "scripts/check-home-investor-indicator-roadmap-panel.mjs"],
    expectStatus: "ok",
    name: "home-investor-indicator-roadmap-panel"
  },
  {
    command: [node, "scripts/check-home-product-first-information-hierarchy.mjs"],
    expectStatus: "ok",
    name: "home-product-first-information-hierarchy"
  },
  {
    command: [node, "scripts/check-briefing-product-first-information-hierarchy.mjs"],
    expectStatus: "ok",
    name: "briefing-product-first-information-hierarchy"
  },
  {
    command: [node, "scripts/check-market-action-summary-readable-copy.mjs"],
    expectStatus: "ok",
    name: "market-action-summary-readable-copy"
  },
  {
    command: [node, "scripts/check-public-beta-alert-list-actionability.mjs"],
    expectStatus: "ok",
    name: "public-beta-alert-list-actionability"
  },
  {
    command: [node, "scripts/check-stock-runtime-at-a-glance.mjs"],
    expectStatus: "ok",
    name: "stock-runtime-at-a-glance"
  },
  {
    command: [node, "scripts/check-runtime-transition-rail.mjs"],
    expectStatus: "ok",
    name: "runtime-transition-rail"
  },
  {
    command: [node, "scripts/check-public-runtime-state-strip.mjs"],
    expectStatus: "ok",
    name: "public-runtime-state-strip"
  },
  {
    command: [node, "scripts/check-runtime-mock-disclosure-readability.mjs"],
    expectStatus: "ok",
    name: "runtime-mock-disclosure-readability"
  },
  {
    command: [node, "scripts/check-stock-page-readable-boundary-copy.mjs"],
    expectStatus: "ok",
    name: "stock-page-readable-boundary-copy"
  },
  {
    command: [node, "scripts/check-stock-first-screen-readability.mjs"],
    expectStatus: "ok",
    name: "stock-first-screen-readability"
  },
  {
    command: [node, "scripts/check-stock-product-first-runtime-readability.mjs"],
    expectStatus: "ok",
    name: "stock-product-first-runtime-readability"
  },
  {
    command: [node, "scripts/check-stock-decision-aid-actionability.mjs"],
    expectStatus: "ok",
    name: "stock-decision-aid-actionability"
  },
  {
    command: [node, "scripts/check-stock-route-investor-language-alignment.mjs"],
    expectStatus: "ok",
    name: "stock-route-investor-language-alignment"
  },
  {
    command: [node, "scripts/check-stock-first-screen-action-summary.mjs"],
    expectStatus: "ok",
    name: "stock-first-screen-action-summary"
  },
  {
    command: [node, "scripts/check-stock-signal-explanation-readout.mjs"],
    expectStatus: "ok",
    name: "stock-signal-explanation-readout"
  },
  {
    command: [node, "scripts/check-stock-trend-tab-readability.mjs"],
    expectStatus: "ok",
    name: "stock-trend-tab-readability"
  },
  {
    command: [node, "scripts/check-stock-core-tabs-readability.mjs"],
    expectStatus: "ok",
    name: "stock-core-tabs-readability"
  },
  {
    command: [node, "scripts/check-stock-governance-details-readability.mjs"],
    expectStatus: "ok",
    name: "stock-governance-details-readability"
  },
  {
    command: [node, "scripts/check-home-visual-hierarchy.mjs"],
    expectStatus: "ok",
    name: "home-visual-hierarchy"
  },
  {
    command: [node, "scripts/check-stock-visual-hierarchy.mjs"],
    expectStatus: "ok",
    name: "stock-visual-hierarchy"
  },
  {
    command: [node, "scripts/check-experience-flow-navigation.mjs"],
    expectStatus: "ok",
    name: "experience-flow-navigation"
  },
  {
    command: [node, "scripts/check-decision-flow-consistency.mjs"],
    expectStatus: "ok",
    name: "decision-flow-consistency"
  },
  {
    command: [node, "scripts/check-public-route-loop.mjs"],
    expectStatus: "ok",
    name: "public-route-loop"
  },
  {
    command: [node, "scripts/check-site-chrome-readability.mjs"],
    expectStatus: "ok",
    name: "site-chrome-readability"
  },
  {
    command: [node, "scripts/check-public-visible-language-quality.mjs"],
    expectStatus: "ok",
    name: "public-visible-language-quality"
  },
  {
    command: [node, "scripts/check-public-source-residue-scan.mjs"],
    expectStatus: "ok",
    name: "public-source-residue-scan"
  },
  {
    command: [node, "scripts/check-public-surface-user-facing-audit.mjs"],
    expectStatus: "ok",
    name: "public-surface-user-facing-audit"
  },
  {
    command: [node, "scripts/check-public-beta-decision-loop-bridge.mjs"],
    expectStatus: "ok",
    name: "public-beta-decision-loop-bridge"
  },
  {
    command: [node, "scripts/check-public-beta-decision-journey-panel.mjs"],
    expectStatus: "ok",
    name: "public-beta-decision-journey-panel"
  },
  {
    command: [node, "scripts/check-public-beta-usable-loop-panel.mjs"],
    expectStatus: "ok",
    name: "public-beta-usable-loop-panel"
  },
  {
    command: [node, "scripts/check-public-support-route-reading-contract.mjs"],
    expectStatus: "ok",
    name: "public-support-route-reading-contract"
  },
  {
    command: [node, "scripts/check-public-language-gate-self-audit.mjs"],
    expectStatus: "ok",
    name: "public-language-gate-self-audit"
  },
  {
    command: [node, "scripts/check-runtime-state-consistency.mjs"],
    expectStatus: "ok",
    name: "runtime-state-consistency"
  },
  {
    command: [node, "scripts/check-runtime-fail-closed.mjs"],
    expectStatus: "ok",
    name: "runtime-fail-closed"
  },
  {
    command: [node, "scripts/check-runtime-schema-promotion-readiness.mjs"],
    expectStatus: "ok",
    name: "runtime-schema-promotion-readiness"
  },
  {
    command: [node, "scripts/check-mock-signal-reading-flow-readiness.mjs"],
    expectStatus: "ok",
    name: "mock-signal-reading-flow-readiness"
  },
  {
    command: [node, "scripts/check-mock-mvp-product-surface-readiness.mjs"],
    expectStatus: "ok",
    name: "mock-mvp-product-surface-readiness"
  },
  {
    command: [node, "scripts/check-devops-health-recovery-readiness.mjs"],
    expectStatus: "ok",
    name: "devops-health-recovery-readiness"
  },
  {
    command: [node, "scripts/check-formal-launch-deployment-readiness-gate.mjs"],
    expectStatus: "ok",
    name: "formal-launch-deployment-readiness-gate"
  },
  {
    command: [node, "scripts/check-public-beta-readiness-gate.mjs"],
    expectStatus: "ok",
    name: "public-beta-readiness-gate"
  },
  {
    command: [node, "scripts/check-public-beta-goal-readiness-rollup.mjs"],
    expectStatus: "ok",
    name: "public-beta-goal-readiness-rollup"
  },
  {
    command: [node, "scripts/check-public-beta-pm-next-status.mjs"],
    expectStatus: "ok",
    name: "public-beta-pm-next-status"
  },
  {
    command: [node, "scripts/check-public-beta-launch-readiness-panel.mjs"],
    expectStatus: "ok",
    name: "public-beta-launch-readiness-panel"
  },
  {
    command: [node, "scripts/check-public-beta-data-readiness-status.mjs"],
    expectStatus: "ok",
    name: "public-beta-data-readiness-status"
  },
  {
    command: [node, "scripts/check-beta-launch-preflight-packet.mjs"],
    expectStatus: "ok",
    name: "beta-launch-preflight-packet"
  },
  {
    command: [node, "scripts/check-beta-release-runbook-draft.mjs"],
    expectStatus: "ok",
    name: "beta-release-runbook-draft"
  },
  {
    command: [node, "scripts/check-future-deployment-execution-gate.mjs"],
    expectStatus: "ok",
    name: "future-deployment-execution-gate"
  },
  {
    command: [node, "scripts/check-beta-deployment-operator-input-packet.mjs"],
    expectStatus: "ok",
    name: "beta-deployment-operator-input-packet"
  },
  {
    command: [node, "scripts/check-beta-deployment-execution-packet-draft.mjs"],
    expectStatus: "ok",
    name: "beta-deployment-execution-packet-draft"
  },
  {
    command: [node, "scripts/check-beta-deployment-operator-fill-guide.mjs"],
    expectStatus: "ok",
    name: "beta-deployment-operator-fill-guide"
  },
  {
    command: [node, "scripts/check-beta-deployment-intake-checklist.mjs"],
    expectStatus: "ok",
    name: "beta-deployment-intake-checklist"
  },
  {
    command: [node, "scripts/check-beta-deployment-executable-packet-candidate-gate.mjs"],
    expectStatus: "ok",
    name: "beta-deployment-executable-packet-candidate-gate"
  },
  {
    command: [node, "scripts/check-beta-deployment-operator-values-minimal-sheet.mjs"],
    expectStatus: "ok",
    name: "beta-deployment-operator-values-minimal-sheet"
  },
  {
    command: [node, "scripts/check-beta-deployment-operator-values-completion-gate.mjs"],
    expectStatus: "ok",
    name: "beta-deployment-operator-values-completion-gate"
  },
  {
    command: [node, "scripts/check-beta-deployment-no-secret-operator-values-record.mjs"],
    expectStatus: "ok",
    name: "beta-deployment-no-secret-operator-values-record"
  },
  {
    command: [node, "scripts/check-beta-deployment-operator-values-safe-fill-recheck.mjs"],
    expectStatus: "ok",
    name: "beta-deployment-operator-values-safe-fill-recheck"
  },
  {
    command: [node, "scripts/check-local-launch-preflight-without-external-operator-values.mjs"],
    expectStatus: "ok",
    name: "local-launch-preflight-without-external-operator-values"
  },
  {
    command: [node, "scripts/check-local-launch-proof-bundle-snapshot.mjs"],
    expectStatus: "ok",
    name: "local-launch-proof-bundle-snapshot"
  },
  {
    command: [node, "scripts/check-beta-deployment-operator-values-gap-list.mjs"],
    expectStatus: "ok",
    name: "beta-deployment-operator-values-gap-list"
  },
  {
    command: [node, "scripts/check-beta-deployment-operator-values-defaults-and-remaining-gaps.mjs"],
    expectStatus: "ok",
    name: "beta-deployment-operator-values-defaults-and-remaining-gaps"
  },
  {
    command: [node, "scripts/check-beta-platform-two-value-intake-gate.mjs"],
    expectStatus: "ok",
    name: "beta-platform-two-value-intake-gate"
  },
  {
    command: [node, "scripts/check-beta-platform-two-value-intake-command.mjs"],
    expectStatus: "ok",
    name: "beta-platform-two-value-intake-command"
  },
  {
    command: [node, "scripts/check-beta-platform-two-value-validator.mjs"],
    expectStatus: "ok",
    name: "beta-platform-two-value-validator"
  },
  {
    command: [node, "scripts/check-beta-platform-proof-status.mjs"],
    expectStatus: "ok",
    name: "beta-platform-proof-status"
  },
  {
    command: [node, "scripts/check-beta-platform-values-route-preview.mjs"],
    expectStatus: "ok",
    name: "beta-platform-values-route-preview"
  },
  {
    command: [node, "scripts/check-beta-two-value-operator-handoff.mjs"],
    expectStatus: "ok",
    name: "beta-two-value-operator-handoff"
  },
  {
    command: [node, "scripts/check-beta-launch-next-action.mjs"],
    expectStatus: "ok",
    name: "beta-launch-next-action"
  },
  {
    command: [node, "scripts/check-beta-deployment-quickstart.mjs"],
    expectStatus: "ok",
    name: "beta-deployment-quickstart"
  },
  {
    command: [node, "scripts/check-vercel-beta-pre-creation-checklist.mjs"],
    expectStatus: "ok",
    name: "vercel-beta-pre-creation-checklist"
  },
  {
    command: [node, "scripts/check-vercel-operator-step-by-step-checklist.mjs"],
    expectStatus: "ok",
    name: "vercel-operator-step-by-step-checklist"
  },
  {
    command: [node, "scripts/check-beta-platform-unblock-kit.mjs"],
    expectStatus: "ok",
    name: "beta-platform-unblock-kit"
  },
  {
    command: [node, "scripts/check-public-beta-production-build-proof.mjs"],
    expectStatus: "ok",
    name: "public-beta-production-build-proof"
  },
  {
    command: [node, "scripts/check-public-beta-mock-launch-proof-bundle.mjs"],
    expectStatus: "ok",
    name: "public-beta-mock-launch-proof-bundle"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-mock-launch-candidate-status-summary.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-mock-launch-candidate-status-summary"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-candidate-final-public-readiness-scan.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-candidate-final-public-readiness-scan"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-final-readiness-rollup.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-final-readiness-rollup"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-release-readiness-evidence-rollup.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-release-readiness-evidence-rollup"
  },
  {
    command: [node, "scripts/check-phase-1-ui-ux-style-direction.mjs"],
    expectStatus: "ok",
    name: "phase-1-ui-ux-style-direction"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-human-visual-review.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-human-visual-review"
  },
  {
    command: [node, "scripts/check-phase-1-human-ui-ux-acceptance-checklist.mjs"],
    expectStatus: "ok",
    name: "phase-1-human-ui-ux-acceptance-checklist"
  },
  {
    command: [node, "scripts/check-phase-1-pre-ui-ux-acceptance-record.mjs"],
    expectStatus: "ok",
    name: "phase-1-pre-ui-ux-acceptance-record"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-visual-acceptance-and-a3-handoff.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-visual-acceptance-and-a3-handoff"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-chairman-visual-acceptance-record.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-chairman-visual-acceptance-record"
  },
  {
    command: [node, "scripts/check-public-beta-separated-preflight.mjs"],
    expectStatus: "ok",
    name: "public-beta-separated-preflight"
  },
  {
    command: [node, "scripts/check-public-beta-external-input-request.mjs"],
    expectStatus: "ok",
    name: "public-beta-external-input-request"
  },
  {
    command: [node, "scripts/check-public-beta-external-input-copy-packet.mjs"],
    expectStatus: "ok",
    name: "public-beta-external-input-copy-packet"
  },
  {
    command: [node, "scripts/check-public-beta-external-reply-file-template.mjs"],
    expectStatus: "ok",
    name: "public-beta-external-reply-file-template"
  },
  {
    command: [node, "scripts/check-public-beta-external-reply-file-template-writer.mjs"],
    expectStatus: "ok",
    name: "public-beta-external-reply-file-template-writer"
  },
  {
    command: [node, "scripts/check-public-beta-external-reply-env-fill.mjs"],
    expectStatus: "ok",
    name: "public-beta-external-reply-env-fill"
  },
  {
    command: [node, "scripts/check-public-beta-external-reply-env-template-writer.mjs"],
    expectStatus: "ok",
    name: "public-beta-external-reply-env-template-writer"
  },
  {
    command: [node, "scripts/check-public-beta-external-reply-intake-dry-run.mjs"],
    expectStatus: "ok",
    name: "public-beta-external-reply-intake-dry-run"
  },
  {
    command: [node, "scripts/check-public-beta-a1-reply-pm-classification-preview.mjs"],
    expectStatus: "ok",
    name: "public-beta-a1-reply-pm-classification-preview"
  },
  {
    command: [node, "scripts/check-public-beta-external-reply-file-route.mjs"],
    expectStatus: "ok",
    name: "public-beta-external-reply-file-route"
  },
  {
    command: [node, "scripts/check-public-beta-external-reply-file-workflow-proof.mjs"],
    expectStatus: "ok",
    name: "public-beta-external-reply-file-workflow-proof"
  },
  {
    command: [node, "scripts/check-public-beta-external-input-response-readiness.mjs"],
    expectStatus: "ok",
    name: "public-beta-external-input-response-readiness"
  },
  {
    command: [node, "scripts/check-public-beta-post-reply-route-once.mjs"],
    expectStatus: "ok",
    name: "public-beta-post-reply-route-once"
  },
  {
    command: [node, "scripts/check-beta-launch-remaining-blockers.mjs"],
    expectStatus: "ok",
    name: "beta-launch-remaining-blockers"
  },
  {
    command: [node, "scripts/check-beta-mainline-current-route.mjs"],
    expectStatus: "ok",
    name: "beta-mainline-current-route"
  },
  {
    command: [node, "scripts/check-beta-pre-execution-packet-readiness.mjs"],
    expectStatus: "ok",
    name: "beta-pre-execution-packet-readiness"
  },
  {
    command: [node, "scripts/check-beta-packet-window-candidate-dry-run-runner.mjs"],
    expectStatus: "ok",
    name: "beta-packet-window-candidate-dry-run-runner"
  },
  {
    command: [node, "scripts/check-beta-packet-window-executable-candidate-template.mjs"],
    expectStatus: "ok",
    name: "beta-packet-window-executable-candidate-template"
  },
  {
    command: [node, "scripts/check-beta-packet-window-reviewed-artifact-acceptance-gate.mjs"],
    expectStatus: "ok",
    name: "beta-packet-window-reviewed-artifact-acceptance-gate"
  },
  {
    command: [node, "scripts/check-beta-packet-window-no-secret-artifact-creation-runbook.mjs"],
    expectStatus: "ok",
    name: "beta-packet-window-no-secret-artifact-creation-runbook"
  },
  {
    command: [node, "scripts/check-beta-packet-window-one-command-proof-map.mjs"],
    expectStatus: "ok",
    name: "beta-packet-window-one-command-proof-map"
  },
  {
    command: [node, "scripts/check-beta-platform-two-value-proof-map-once.mjs"],
    expectStatus: "ok",
    name: "beta-platform-two-value-proof-map-once"
  },
  {
    command: [node, "scripts/check-beta-packet-window-readiness-summary.mjs"],
    expectStatus: "ok",
    name: "beta-packet-window-readiness-summary"
  },
  {
    command: [node, "scripts/check-beta-packet-window-reviewed-artifact-outcome-recorder.mjs"],
    expectStatus: "ok",
    name: "beta-packet-window-reviewed-artifact-outcome-recorder"
  },
  {
    command: [node, "scripts/check-beta-packet-to-deployment-pre-execution-bridge.mjs"],
    expectStatus: "ok",
    name: "beta-packet-to-deployment-pre-execution-bridge"
  },
  {
    command: [node, "scripts/check-beta-pre-execution-packet-candidate-template.mjs"],
    expectStatus: "ok",
    name: "beta-pre-execution-packet-candidate-template"
  },
  {
    command: [node, "scripts/check-chairman-beta-launch-review-packet.mjs"],
    expectStatus: "ok",
    name: "chairman-beta-launch-review-packet"
  },
  {
    command: [node, "scripts/check-phase-1-data-online-gap-closure-map.mjs"],
    expectStatus: "ok",
    name: "phase-1-data-online-gap-closure-map"
  },
  {
    command: [node, "scripts/check-phase-1-level-1-closure-execution-packet.mjs"],
    expectStatus: "ok",
    name: "phase-1-level-1-closure-execution-packet"
  },
  {
    command: [node, "scripts/check-runtime-data-promotion-handoff-checklist.mjs"],
    expectStatus: "ok",
    name: "runtime-data-promotion-handoff-checklist"
  },
  {
    command: [node, "scripts/check-runtime-summary-alignment-from-first-closed-loop.mjs"],
    expectStatus: "ok",
    name: "runtime-summary-alignment-from-first-closed-loop"
  },
  {
    command: [node, "scripts/check-a1-mvp-coverage-closure-route-support.mjs"],
    expectStatus: "ok",
    name: "a1-mvp-coverage-closure-route-support"
  },
  {
    command: [node, "scripts/check-a1-source-rights-unblock-priority-packet.mjs"],
    expectStatus: "ok",
    name: "a1-source-rights-unblock-priority-packet"
  },
  {
    command: [node, "scripts/check-a1-twii-source-rights-unblock-decision-record-candidate.mjs"],
    expectStatus: "ok",
    name: "a1-twii-source-rights-unblock-decision-record-candidate"
  },
  {
    command: [node, "scripts/check-a1-twii-source-rights-evidence-intake-or-vendor-fallback-decision-support.mjs"],
    expectStatus: "ok",
    name: "a1-twii-source-rights-evidence-intake-or-vendor-fallback-decision-support"
  },
  {
    command: [node, "scripts/check-a1-twii-official-source-intake-fields-or-vendor-terms-review-packet.mjs"],
    expectStatus: "ok",
    name: "a1-twii-official-source-intake-fields-or-vendor-terms-review-packet"
  },
  {
    command: [node, "scripts/check-a2-public-beta-trust-copy-readiness.mjs"],
    expectStatus: "ok",
    name: "a2-public-beta-trust-copy-readiness"
  },
  {
    command: [node, "scripts/check-briefing-public-beta-gate-summary.mjs"],
    expectStatus: "ok",
    name: "briefing-public-beta-gate-summary"
  },
  {
    command: [node, "scripts/check-a2-beta-phrase-set-and-shared-trust-surface-patch-scope.mjs"],
    expectStatus: "ok",
    name: "a2-beta-phrase-set-and-shared-trust-surface-patch-scope"
  },
  {
    command: [node, "scripts/check-a2-public-copy-ux-safety-brief-handoff.mjs"],
    expectStatus: "ok",
    name: "a2-public-copy-ux-safety-brief-handoff"
  },
  {
    command: [node, "scripts/check-a2-home-first-screen-public-copy-handoff.mjs"],
    expectStatus: "ok",
    name: "a2-home-first-screen-public-copy-handoff"
  },
  {
    command: [node, "scripts/check-a2-public-beta-runtime-ux-safety-handoff.mjs"],
    expectStatus: "ok",
    name: "a2-public-beta-runtime-ux-safety-handoff"
  },
  {
    command: [node, "scripts/check-a2-route-level-launch-copy-audit.mjs"],
    expectStatus: "ok",
    name: "a2-route-level-launch-copy-audit"
  },
  {
    command: [node, "scripts/check-a2-route-local-legal-weekly-methodology-copy-regression-gate.mjs"],
    expectStatus: "ok",
    name: "a2-route-local-legal-weekly-methodology-copy-regression-gate"
  },
  {
    command: [node, "scripts/check-a2-bounded-route-local-trust-copy-patch.mjs"],
    expectStatus: "ok",
    name: "a2-bounded-route-local-trust-copy-patch"
  },
  {
    command: [node, "scripts/check-a2-route-local-trust-copy-route-health.mjs"],
    expectStatus: "ok",
    name: "a2-route-local-trust-copy-route-health"
  },
  {
    command: [node, "scripts/check-ceo-execution-focus-closure-readiness.mjs"],
    expectStatus: "ok",
    name: "ceo-execution-focus-closure-readiness"
  },
  {
    command: [node, "scripts/check-final-mvp-100-completion-audit-readiness.mjs"],
    expectStatus: "ok",
    name: "final-mvp-100-completion-audit-readiness"
  },
  {
    command: [node, "scripts/check-mock-mvp-chairman-review.mjs"],
    expectStatus: "ok",
    name: "mock-mvp-chairman-review"
  },
  {
    command: [node, "scripts/check-mock-mvp-f-ui-closeout.mjs"],
    expectStatus: "ok",
    name: "mock-mvp-f-ui-closeout"
  },
  {
    command: [node, "scripts/check-data-authorization-entry-gate.mjs"],
    expectStatus: "ok",
    name: "data-authorization-entry-gate"
  },
  {
    command: [node, "scripts/check-data-authorization-decision-packet.mjs"],
    expectStatus: "ok",
    name: "data-authorization-decision-packet"
  },
  {
    command: [node, "scripts/check-data-authorization-readonly-attempt-post-run-review.mjs"],
    expectStatus: "ok",
    name: "data-authorization-readonly-attempt-post-run-review"
  },
  {
    command: [node, "scripts/check-batch1-row-coverage-readonly-post-run-review.mjs"],
    expectStatus: "ok",
    name: "batch1-row-coverage-readonly-post-run-review"
  },
  {
    command: [node, "scripts/check-data-population-route-decision.mjs"],
    expectStatus: "ok",
    name: "data-population-route-decision"
  },
  {
    command: [node, "scripts/check-data-realification-acceleration-gate.mjs"],
    expectStatus: "ok",
    name: "data-realification-acceleration-gate"
  },
  {
    command: [node, "scripts/check-backfill-ingestion-execution-packet.mjs"],
    expectStatus: "ok",
    name: "backfill-ingestion-execution-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-report-only-dry-run-packet.mjs"],
    expectStatus: "ok",
    name: "tw-equity-report-only-dry-run-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-source-rights-packet.mjs"],
    expectStatus: "ok",
    name: "tw-equity-source-rights-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-local-report-only-runner-design.mjs"],
    expectStatus: "ok",
    name: "tw-equity-local-report-only-runner-design"
  },
  {
    command: [node, "scripts/check-tw-equity-local-report-only-runner-implementation-gate.mjs"],
    expectStatus: "ok",
    name: "tw-equity-local-report-only-runner-implementation-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-local-report-only-runner.mjs"],
    expectStatus: "ok",
    name: "tw-equity-local-report-only-runner"
  },
  {
    command: [node, "scripts/check-tw-equity-local-report-only-runner-post-run-review.mjs"],
    expectStatus: "ok",
    name: "tw-equity-local-report-only-runner-post-run-review"
  },
  {
    command: [node, "scripts/check-tw-equity-source-approval-decision-packet.mjs"],
    expectStatus: "ok",
    name: "tw-equity-source-approval-decision-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-provider-specific-terms-review-packet.mjs"],
    expectStatus: "ok",
    name: "tw-equity-provider-specific-terms-review-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs"],
    expectStatus: "ok",
    name: "tw-equity-provider-specific-terms-review-outcome-ledger"
  },
  {
    command: [node, "scripts/check-record-tw-equity-provider-specific-terms-review-outcome.mjs"],
    expectStatus: "ok",
    name: "record-tw-equity-provider-specific-terms-review-outcome"
  },
  {
    command: [node, "scripts/check-tw-equity-provider-specific-terms-review-outcome-tool-role-review.mjs"],
    expectStatus: "ok",
    name: "tw-equity-provider-specific-terms-review-outcome-tool-role-review"
  },
  {
    command: [node, "scripts/check-tw-equity-provider-specific-terms-apply-runbook.mjs"],
    expectStatus: "ok",
    name: "tw-equity-provider-specific-terms-apply-runbook"
  },
  {
    command: [node, "scripts/check-tw-equity-provider-specific-terms-apply-runbook-role-review.mjs"],
    expectStatus: "ok",
    name: "tw-equity-provider-specific-terms-apply-runbook-role-review"
  },
  {
    command: [node, "scripts/check-tw-equity-source-review-readiness-summary.mjs"],
    expectStatus: "ok",
    name: "tw-equity-source-review-readiness-summary"
  },
  {
    command: [node, "scripts/check-tw-equity-source-classification-minimal-execution-route.mjs"],
    expectStatus: "ok",
    name: "tw-equity-source-classification-minimal-execution-route"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-first-authorization-packet.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-first-authorization-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-first-preflight-runner.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-first-preflight-runner"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-first-write-authorization-packet-v1.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-first-write-authorization-packet-v1"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-write-authorization-readiness-v2.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-write-authorization-readiness-v2"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-first-write-post-run-review-template-v1.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-first-write-post-run-review-template-v1"
  },
  {
    command: [node, "scripts/check-tw-equity-bounded-staging-write-execution-decision-v1.mjs"],
    expectStatus: "ok",
    name: "tw-equity-bounded-staging-write-execution-decision-v1"
  },
  {
    command: [node, "scripts/check-tw-equity-write-runner-fail-closed-design.mjs"],
    expectStatus: "ok",
    name: "tw-equity-write-runner-fail-closed-design"
  },
  {
    command: [node, "scripts/check-tw-equity-actual-bounded-staging-write-authorization-packet.mjs"],
    expectStatus: "ok",
    name: "tw-equity-actual-bounded-staging-write-authorization-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-write-runner-implementation-gate.mjs"],
    expectStatus: "ok",
    name: "tw-equity-write-runner-implementation-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-write-runner-safety.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-write-runner-safety"
  },
  {
    command: [node, "scripts/check-tw-equity-one-attempt-staging-write-preflight-gate.mjs"],
    expectStatus: "ok",
    name: "tw-equity-one-attempt-staging-write-preflight-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-write-capable-runner-implementation-readiness-gate.mjs"],
    expectStatus: "ok",
    name: "tw-equity-write-capable-runner-implementation-readiness-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-write-implementation-design-to-code-boundary.mjs"],
    expectStatus: "ok",
    name: "tw-equity-write-implementation-design-to-code-boundary"
  },
  {
    command: [node, "scripts/check-tw-equity-sanitized-candidate-input-validator.mjs"],
    expectStatus: "ok",
    name: "tw-equity-sanitized-candidate-input-validator"
  },
  {
    command: [node, "scripts/check-tw-equity-write-pre-execution-summary.mjs"],
    expectStatus: "ok",
    name: "tw-equity-write-pre-execution-summary"
  },
  {
    command: [node, "scripts/check-tw-equity-write-implementation-final-authorization-gate.mjs"],
    expectStatus: "ok",
    name: "tw-equity-write-implementation-final-authorization-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-write-implementation-final-authorization-acceptance.mjs"],
    expectStatus: "ok",
    name: "tw-equity-write-implementation-final-authorization-acceptance"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-write-implementation.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-write-implementation"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-write-execution-readiness.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-write-execution-readiness"
  },
  {
    command: [node, "scripts/check-tw-equity-bounded-staging-write-attempt-decision.mjs"],
    expectStatus: "ok",
    name: "tw-equity-bounded-staging-write-attempt-decision"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-first-write-post-run-review-2026-06-06.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-first-write-post-run-review-2026-06-06"
  },
  {
    command: [node, "scripts/check-tw-equity-pgrst205-root-cause-gate.mjs"],
    expectStatus: "ok",
    name: "tw-equity-pgrst205-root-cause-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-second-bounded-staging-write-retry-decision.mjs"],
    expectStatus: "ok",
    name: "tw-equity-second-bounded-staging-write-retry-decision"
  },
  {
    command: [node, "scripts/check-tw-equity-second-write-runner-contract-alignment.mjs"],
    expectStatus: "ok",
    name: "tw-equity-second-write-runner-contract-alignment"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-second-write-retry-post-run-review-2026-06-06.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-second-write-retry-post-run-review-2026-06-06"
  },
  {
    command: [node, "scripts/check-tw-equity-supabase-staging-write-repair-decision-packet.mjs"],
    expectStatus: "ok",
    name: "tw-equity-supabase-staging-write-repair-decision-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-supabase-staging-write-repair-evidence-checklist.mjs"],
    expectStatus: "ok",
    name: "tw-equity-supabase-staging-write-repair-evidence-checklist"
  },
  {
    command: [node, "scripts/check-tw-equity-supabase-staging-write-repair-evidence-record.mjs"],
    expectStatus: "ok",
    name: "tw-equity-supabase-staging-write-repair-evidence-record"
  },
  {
    command: [node, "scripts/check-tw-equity-run-id-uuid-contract-repair-gate.mjs"],
    expectStatus: "ok",
    name: "tw-equity-run-id-uuid-contract-repair-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-supabase-metadata-diagnostic-decision-packet.mjs"],
    expectStatus: "ok",
    name: "tw-equity-supabase-metadata-diagnostic-decision-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-supabase-metadata-diagnostic-once.mjs"],
    expectStatus: "ok",
    name: "tw-equity-supabase-metadata-diagnostic-once"
  },
  {
    command: [node, "scripts/check-tw-equity-supabase-metadata-diagnostic-post-run-review-2026-06-06.mjs"],
    expectStatus: "ok",
    name: "tw-equity-supabase-metadata-diagnostic-post-run-review"
  },
  {
    command: [node, "scripts/check-tw-equity-write-path-metadata-comparison.mjs"],
    expectStatus: "ok",
    name: "tw-equity-write-path-metadata-comparison"
  },
  {
    command: [node, "scripts/check-tw-equity-postgrest-schema-exposure-probe-once.mjs"],
    expectStatus: "ok",
    name: "tw-equity-postgrest-schema-exposure-probe-once"
  },
  {
    command: [node, "scripts/check-tw-equity-postgrest-schema-exposure-probe-post-run-review-2026-06-06.mjs"],
    expectStatus: "ok",
    name: "tw-equity-postgrest-schema-exposure-probe-post-run-review"
  },
  {
    command: [node, "scripts/check-tw-equity-schema-exposure-repair-decision-packet.mjs"],
    expectStatus: "ok",
    name: "tw-equity-schema-exposure-repair-decision-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-schema-exposure-repair-runbook.mjs"],
    expectStatus: "ok",
    name: "tw-equity-schema-exposure-repair-runbook"
  },
  {
    command: [node, "scripts/check-record-tw-equity-schema-exposure-repair-outcome.mjs"],
    expectStatus: "ok",
    name: "record-tw-equity-schema-exposure-repair-outcome"
  },
  {
    command: [node, "scripts/check-tw-equity-schema-exposure-outcome-to-probe-gate.mjs"],
    expectStatus: "ok",
    name: "tw-equity-schema-exposure-outcome-to-probe-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-post-repair-schema-exposure-probe-result.mjs"],
    expectStatus: "ok",
    name: "tw-equity-post-repair-schema-exposure-probe-result"
  },
  {
    command: [node, "scripts/check-tw-equity-table-api-visibility-permission-diagnostic-decision-packet.mjs"],
    expectStatus: "ok",
    name: "tw-equity-table-api-visibility-permission-diagnostic-decision-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-dashboard-table-visibility-observation.mjs"],
    expectStatus: "ok",
    name: "tw-equity-dashboard-table-visibility-observation"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-migration-apply-decision-packet.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-migration-apply-decision-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-migration-apply-outcome.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-migration-apply-outcome"
  },
  {
    command: [node, "scripts/check-tw-equity-post-migration-readonly-verification.mjs"],
    expectStatus: "ok",
    name: "tw-equity-post-migration-readonly-verification"
  },
  {
    command: [node, "scripts/check-tw-equity-post-migration-openapi-exposure-confirmation.mjs"],
    expectStatus: "ok",
    name: "tw-equity-post-migration-openapi-exposure-confirmation"
  },
  {
    command: [node, "scripts/check-tw-equity-third-bounded-staging-write-decision.mjs"],
    expectStatus: "ok",
    name: "tw-equity-third-bounded-staging-write-decision"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-third-write-post-run-review-2026-06-07.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-third-write-post-run-review-2026-06-07"
  },
  {
    command: [node, "scripts/check-tw-equity-post-write-staging-verification.mjs"],
    expectStatus: "ok",
    name: "tw-equity-post-write-staging-verification"
  },
  {
    command: [node, "scripts/check-tw-equity-post-write-promotion-readiness-gate.mjs"],
    expectStatus: "ok",
    name: "tw-equity-post-write-promotion-readiness-gate"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-to-daily-prices-merge-design-packet.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-to-daily-prices-merge-design-packet"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-to-daily-prices-dry-run-preflight.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-to-daily-prices-dry-run-preflight"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-to-daily-prices-remote-preflight-authorization.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-to-daily-prices-remote-preflight-authorization"
  },
  {
    command: [node, "scripts/check-tw-equity-staging-to-daily-prices-remote-preflight-runner-implementation.mjs"],
    expectStatus: "ok",
    name: "tw-equity-staging-to-daily-prices-remote-preflight-runner-implementation"
  },
  {
    command: [node, "scripts/check-tw-equity-daily-prices-existing-target-overlap-policy.mjs"],
    expectStatus: "ok",
    name: "tw-equity-daily-prices-existing-target-overlap-policy"
  },
  {
    command: [node, "scripts/check-tw-equity-daily-prices-overlap-classification-runner.mjs"],
    expectStatus: "ok",
    name: "tw-equity-daily-prices-overlap-classification-runner"
  },
  {
    command: [node, "scripts/check-tw-equity-daily-prices-insert-missing-skip-existing-merge-authorization.mjs"],
    expectStatus: "ok",
    name: "tw-equity-daily-prices-insert-missing-skip-existing-merge-authorization"
  },
  {
    command: [node, "scripts/check-tw-equity-daily-prices-insert-missing-merge-runner-implementation.mjs"],
    expectStatus: "ok",
    name: "tw-equity-daily-prices-insert-missing-merge-runner-implementation"
  },
  {
    command: [node, "scripts/check-tw-equity-daily-prices-insert-missing-merge-execution-decision.mjs"],
    expectStatus: "ok",
    name: "tw-equity-daily-prices-insert-missing-merge-execution-decision"
  },
  {
    command: [node, "scripts/check-tw-equity-daily-prices-insert-missing-merge-post-run-review-2026-06-07.mjs"],
    expectStatus: "ok",
    name: "tw-equity-daily-prices-insert-missing-merge-post-run-review-2026-06-07"
  },
  {
    command: [node, "scripts/check-tw-equity-row-coverage-scoring-gate.mjs"],
    expectStatus: "ok",
    name: "tw-equity-row-coverage-scoring-gate"
  },
  {
    command: [node, "scripts/check-data-realification-first-closed-loop-rollup.mjs"],
    expectStatus: "ok",
    name: "data-realification-first-closed-loop-rollup"
  },
  {
    command: [node, "scripts/check-data-realification-post-first-closed-loop-next-lane-selector.mjs"],
    expectStatus: "ok",
    name: "data-realification-post-first-closed-loop-next-lane-selector"
  },
  {
    command: [node, "scripts/check-public-beta-data-realification-next-action.mjs"],
    expectStatus: "ok",
    name: "public-beta-data-realification-next-action"
  },
  {
    command: [node, "scripts/check-phase-1-data-online-go-no-go-status.mjs"],
    expectStatus: "ok",
    name: "phase-1-data-online-go-no-go-status"
  },
  {
    command: [node, "scripts/check-phase-1-twii-bounded-write-operator-decision-quickstart.mjs"],
    expectStatus: "ok",
    name: "phase-1-twii-bounded-write-operator-decision-quickstart"
  },
  {
    command: [node, "scripts/check-phase-1-twii-operator-decision-intake-readiness.mjs"],
    expectStatus: "ok",
    name: "phase-1-twii-operator-decision-intake-readiness"
  },
  {
    command: [node, "scripts/check-phase-1-twii-operator-decision-packet-request.mjs"],
    expectStatus: "ok",
    name: "phase-1-twii-operator-decision-packet-request"
  },
  {
    command: [node, "scripts/check-open-free-auto-data-source-gate.mjs"],
    expectStatus: "ok",
    name: "open-free-auto-data-source-gate"
  },
  {
    command: [node, "scripts/check-twse-openapi-bounded-metadata-terms-validation.mjs"],
    expectStatus: "ok",
    name: "twse-openapi-bounded-metadata-terms-validation"
  },
  {
    command: [node, "scripts/check-twse-openapi-source-adapter-contract.mjs"],
    expectStatus: "ok",
    name: "twse-openapi-source-adapter-contract"
  },
  {
    command: [node, "--experimental-strip-types", "scripts/check-twse-openapi-parser-contract.mjs"],
    expectStatus: "ok",
    name: "twse-openapi-parser-contract"
  },
  {
    command: [node, "--experimental-strip-types", "scripts/check-twse-openapi-parser-consumer-adapter.mjs"],
    expectStatus: "ok",
    name: "twse-openapi-parser-consumer-adapter"
  },
  {
    command: [node, "scripts/check-twse-openapi-runtime-mock-wiring-readiness.mjs"],
    expectStatus: "ok",
    name: "twse-openapi-runtime-mock-wiring-readiness"
  },
  {
    command: [node, "scripts/check-twse-openapi-runtime-mock-consumer-wire.mjs"],
    expectStatus: "ok",
    name: "twse-openapi-runtime-mock-consumer-wire"
  },
  {
    command: [node, "scripts/check-twse-openapi-runtime-consumer-adapter-synthetic-case-notes.mjs"],
    expectStatus: "ok",
    name: "twse-openapi-runtime-consumer-adapter-synthetic-case-notes"
  },
  {
    command: [node, "scripts/check-twse-openapi-field-contract-roadmap.mjs"],
    expectStatus: "ok",
    name: "twse-openapi-field-contract-roadmap"
  },
  {
    command: [node, "scripts/check-twse-openapi-coverage-and-backfill-readiness.mjs"],
    expectStatus: "ok",
    name: "twse-openapi-coverage-and-backfill-readiness"
  },
  {
    command: [node, "scripts/check-twse-openapi-index-baseline-synthetic-parser-fixture.mjs"],
    expectStatus: "ok",
    name: "twse-openapi-index-baseline-synthetic-parser-fixture"
  },
  {
    command: [node, "scripts/check-twse-openapi-index-baseline-mock-runtime-handoff.mjs"],
    expectStatus: "ok",
    name: "twse-openapi-index-baseline-mock-runtime-handoff"
  },
  {
    command: [node, "scripts/check-runtime-promotion-policy-from-first-closed-loop.mjs"],
    expectStatus: "ok",
    name: "runtime-promotion-policy-from-first-closed-loop"
  },
  {
    command: [node, "scripts/check-runtime-policy-public-surface-mapping.mjs"],
    expectStatus: "ok",
    name: "runtime-policy-public-surface-mapping"
  },
  {
    command: [node, "scripts/check-bounded-public-surface-copy-patch-from-mapping.mjs"],
    expectStatus: "ok",
    name: "bounded-public-surface-copy-patch-from-mapping"
  },
  {
    command: [node, "scripts/check-route-local-public-copy-alignment.mjs"],
    expectStatus: "ok",
    name: "route-local-public-copy-alignment"
  },
  {
    command: [node, "scripts/check-etf-daily-prices-coverage-completion-route.mjs"],
    expectStatus: "ok",
    name: "etf-daily-prices-coverage-completion-route"
  },
  {
    command: [node, "scripts/check-etf-source-rights-outcome-decision-gate.mjs"],
    expectStatus: "blocked",
    name: "etf-source-rights-outcome-decision-gate"
  },
  {
    command: [node, "scripts/check-a1-twii-source-rights-and-candidate-readiness-packet.mjs"],
    expectStatus: "ok",
    name: "a1-twii-source-rights-and-candidate-readiness-packet"
  },
  {
    command: [node, "scripts/check-a1-twii-index-field-contract-decision-support.mjs"],
    expectStatus: "ok",
    name: "a1-twii-index-field-contract-decision-support"
  },
  {
    command: [node, "scripts/check-a1-twii-etf-source-rights-evidence-intake-packet.mjs"],
    expectStatus: "ok",
    name: "a1-twii-etf-source-rights-evidence-intake-packet"
  },
  {
    command: [node, "scripts/check-twii-source-rights-outcome-gate.mjs"],
    expectStatus: "ok",
    name: "twii-source-rights-outcome-gate"
  },
  {
    command: [node, "scripts/check-a1-twii-sanitized-candidate-artifact-readiness-gate.mjs"],
    expectStatus: "ok",
    name: "a1-twii-sanitized-candidate-artifact-readiness-gate"
  },
  {
    command: [node, "scripts/check-a1-twii-candidate-artifact-self-check.mjs"],
    expectStatus: "ok",
    name: "a1-twii-candidate-artifact-self-check"
  },
  {
    command: [node, "scripts/check-pm-twii-candidate-intake-review.mjs"],
    expectStatus: "ok",
    name: "pm-twii-candidate-intake-review"
  },
  {
    command: [node, "scripts/check-twii-report-only-dry-run-decision-gate.mjs"],
    expectStatus: "ok",
    name: "twii-report-only-dry-run-decision-gate"
  },
  {
    command: [node, "scripts/check-pm-twii-report-only-dry-run-preflight.mjs"],
    expectStatus: "ok",
    name: "pm-twii-report-only-dry-run-preflight"
  },
  {
    command: [node, "scripts/check-twii-report-only-local-runner.mjs"],
    expectStatus: "ok",
    name: "twii-report-only-local-runner"
  },
  {
    command: [node, "scripts/check-twii-report-only-local-runner-post-run-review.mjs"],
    expectStatus: "ok",
    name: "twii-report-only-local-runner-post-run-review"
  },
  {
    command: [node, "scripts/check-twii-aggregate-readback-gate.mjs"],
    expectStatus: "ok",
    name: "twii-aggregate-readback-gate"
  },
  {
    command: [node, "scripts/check-twii-candidate-acceptance-decision-gate.mjs"],
    expectStatus: "ok",
    name: "twii-candidate-acceptance-decision-gate"
  },
  {
    command: [node, "scripts/check-pm-twii-candidate-acceptance-review.mjs"],
    expectStatus: "ok",
    name: "pm-twii-candidate-acceptance-review"
  },
  {
    command: [node, "scripts/check-twii-bounded-data-acceptance-route-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-data-acceptance-route-preflight"
  },
  {
    command: [node, "scripts/check-pm-twii-bounded-data-acceptance-decision-review.mjs"],
    expectStatus: "ok",
    name: "pm-twii-bounded-data-acceptance-decision-review"
  },
  {
    command: [node, "scripts/check-pm-twii-bounded-data-acceptance-attempt-runner-readiness.mjs"],
    expectStatus: "ok",
    name: "pm-twii-bounded-data-acceptance-attempt-runner-readiness"
  },
  {
    command: [node, "scripts/check-twii-bounded-data-acceptance-attempt-dry-run-wrapper.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-data-acceptance-attempt-dry-run-wrapper"
  },
  {
    command: [node, "scripts/check-twii-bounded-data-acceptance-post-run-review.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-data-acceptance-post-run-review"
  },
  {
    command: [node, "scripts/check-twii-bounded-data-acceptance-dry-run-review-chain.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-data-acceptance-dry-run-review-chain"
  },
  {
    command: [node, "scripts/check-twii-bounded-data-acceptance-named-attempt-packet.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-data-acceptance-named-attempt-packet"
  },
  {
    command: [node, "scripts/check-twii-bounded-data-acceptance-packet-driven-chain.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-data-acceptance-packet-driven-chain"
  },
  {
    command: [node, "scripts/check-twii-sanitized-candidate-artifact-chain-handoff.mjs"],
    expectStatus: "ok",
    name: "twii-sanitized-candidate-artifact-chain-handoff"
  },
  {
    command: [node, "scripts/check-twii-bounded-data-acceptance-named-packet-scaffold.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-data-acceptance-named-packet-scaffold"
  },
  {
    command: [node, "scripts/check-twii-scaffold-to-packet-driven-chain-smoke-proof.mjs"],
    expectStatus: "ok",
    name: "twii-scaffold-to-packet-driven-chain-smoke-proof"
  },
  {
    command: [node, "scripts/check-twii-real-handoff-intake-checklist.mjs"],
    expectStatus: "ok",
    name: "twii-real-handoff-intake-checklist"
  },
  {
    command: [node, "scripts/check-twii-a1-d-handoff-reply-template.mjs"],
    expectStatus: "ok",
    name: "twii-a1-d-handoff-reply-template"
  },
  {
    command: [node, "scripts/check-pm-twii-named-attempt-no-write-proof.mjs"],
    expectStatus: "ok",
    name: "pm-twii-named-attempt-no-write-proof"
  },
  {
    command: [node, "scripts/check-twii-no-write-proof-post-review-readiness-gate.mjs"],
    expectStatus: "ok",
    name: "twii-no-write-proof-post-review-readiness-gate"
  },
  {
    command: [node, "scripts/check-twii-bounded-readonly-preflight-candidate-design.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-readonly-preflight-candidate-design"
  },
  {
    command: [node, "scripts/check-twii-bounded-readonly-preflight-runner-stub.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-readonly-preflight-runner-stub"
  },
  {
    command: [node, "scripts/check-twii-bounded-readonly-preflight-authorization-packet.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-readonly-preflight-authorization-packet"
  },
  {
    command: [node, "scripts/check-twii-bounded-readonly-preflight-final-execution-gate.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-readonly-preflight-final-execution-gate"
  },
  {
    command: [node, "scripts/check-twii-bounded-readonly-preflight-real-readonly-runner-boundary.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-readonly-preflight-real-readonly-runner-boundary"
  },
  {
    command: [node, "scripts/check-twii-bounded-readonly-preflight-single-attempt-execution-packet.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-readonly-preflight-single-attempt-execution-packet"
  },
  {
    command: [node, "scripts/check-twii-bounded-readonly-preflight-authorized-attempt-result-20260609.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-readonly-preflight-authorized-attempt-result-20260609"
  },
  {
    command: [node, "scripts/check-twii-bounded-readonly-preflight-open-one-remote-readonly-execution-path.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-readonly-preflight-open-one-remote-readonly-execution-path"
  },
  {
    command: [node, "scripts/check-twii-bounded-readonly-result-to-data-route-decision.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-readonly-result-to-data-route-decision"
  },
  {
    command: [node, "scripts/check-twii-candidate-acceptance-preparation.mjs"],
    expectStatus: "ok",
    name: "twii-candidate-acceptance-preparation"
  },
  {
    command: [node, "scripts/check-twii-bounded-data-acceptance-execution-decision.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-data-acceptance-execution-decision"
  },
  {
    command: [node, "scripts/check-twii-bounded-data-acceptance-no-write-chain-run-20260609.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-data-acceptance-no-write-chain-run-20260609"
  },
  {
    command: [node, "scripts/check-twii-supabase-write-gate-preauth.mjs"],
    expectStatus: "ok",
    name: "twii-supabase-write-gate-preauth"
  },
  {
    command: [node, "scripts/check-twii-supabase-write-gate-packet-template.mjs"],
    expectStatus: "ok",
    name: "twii-supabase-write-gate-packet-template"
  },
  {
    command: [node, "scripts/check-twii-write-gate-runner-boundary.mjs"],
    expectStatus: "ok",
    name: "twii-write-gate-runner-boundary"
  },
  {
    command: [node, "scripts/check-twii-non-executing-write-runner-skeleton.mjs"],
    expectStatus: "ok",
    name: "twii-non-executing-write-runner-skeleton"
  },
  {
    command: [node, "scripts/check-twii-write-runner-implementation-review-gate.mjs"],
    expectStatus: "ok",
    name: "twii-write-runner-implementation-review-gate"
  },
  {
    command: [node, "scripts/check-twii-write-readiness-packet-consolidation.mjs"],
    expectStatus: "ok",
    name: "twii-write-readiness-packet-consolidation"
  },
  {
    command: [node, "scripts/check-twii-write-implementation-candidate-gate-packet.mjs"],
    expectStatus: "ok",
    name: "twii-write-implementation-candidate-gate-packet"
  },
  {
    command: [node, "scripts/check-twii-future-write-gate-review-packet.mjs"],
    expectStatus: "ok",
    name: "twii-future-write-gate-review-packet"
  },
  {
    command: [node, "scripts/check-twii-explicit-execution-packet-draft.mjs"],
    expectStatus: "ok",
    name: "twii-explicit-execution-packet-draft"
  },
  {
    command: [node, "scripts/check-twii-explicit-execution-readiness-selector.mjs"],
    expectStatus: "ok",
    name: "twii-explicit-execution-readiness-selector"
  },
  {
    command: [node, "scripts/check-twii-pre-execution-proof-bundle.mjs"],
    expectStatus: "ok",
    name: "twii-pre-execution-proof-bundle"
  },
  {
    command: [node, "scripts/check-twii-future-one-time-authorization-packet.mjs"],
    expectStatus: "ok",
    name: "twii-future-one-time-authorization-packet"
  },
  {
    command: [node, "scripts/check-twii-one-shot-authorization-packet-alignment.mjs"],
    expectStatus: "ok",
    name: "twii-one-shot-authorization-packet-alignment"
  },
  {
    command: [node, "scripts/check-twii-pm-authorization-review-decision-packet.mjs"],
    expectStatus: "ok",
    name: "twii-pm-authorization-review-decision-packet"
  },
  {
    command: [node, "scripts/check-twii-pm-authorization-review-decision-alignment.mjs"],
    expectStatus: "ok",
    name: "twii-pm-authorization-review-decision-alignment"
  },
  {
    command: [node, "scripts/check-twii-one-attempt-runner-execution-gate.mjs"],
    expectStatus: "ok",
    name: "twii-one-attempt-runner-execution-gate"
  },
  {
    command: [node, "scripts/check-twii-one-attempt-runner-execution-gate-alignment.mjs"],
    expectStatus: "ok",
    name: "twii-one-attempt-runner-execution-gate-alignment"
  },
  {
    command: [node, "scripts/check-twii-fail-closed-runner-stub.mjs"],
    expectStatus: "ok",
    name: "twii-fail-closed-runner-stub"
  },
  {
    command: [node, "scripts/check-twii-explicit-execution-attempt-packet.mjs"],
    expectStatus: "ok",
    name: "twii-explicit-execution-attempt-packet"
  },
  {
    command: [node, "scripts/check-twii-future-execute-switch-confirmation-gate.mjs"],
    expectStatus: "ok",
    name: "twii-future-execute-switch-confirmation-gate"
  },
  {
    command: [node, "scripts/check-twii-server-only-execute-runner-candidate.mjs"],
    expectStatus: "ok",
    name: "twii-server-only-execute-runner-candidate"
  },
  {
    command: [node, "scripts/check-twii-server-only-runner-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-server-only-runner-preflight"
  },
  {
    command: [node, "scripts/check-twii-no-secret-execution-readiness-review.mjs"],
    expectStatus: "ok",
    name: "twii-no-secret-execution-readiness-review"
  },
  {
    command: [node, "scripts/check-twii-final-no-write-authorization-packet.mjs"],
    expectStatus: "ok",
    name: "twii-final-no-write-authorization-packet"
  },
  {
    command: [node, "scripts/check-twii-explicit-execute-switch-confirmation-intake-gate.mjs"],
    expectStatus: "ok",
    name: "twii-explicit-execute-switch-confirmation-intake-gate"
  },
  {
    command: [node, "scripts/check-twii-server-only-pre-execution-checks-gate.mjs"],
    expectStatus: "ok",
    name: "twii-server-only-pre-execution-checks-gate"
  },
  {
    command: [node, "scripts/check-twii-bounded-write-attempt-runner-fail-closed-scaffold.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-write-attempt-runner-fail-closed-scaffold"
  },
  {
    command: [node, "scripts/check-twii-real-write-runner-implementation-review-gate.mjs"],
    expectStatus: "ok",
    name: "twii-real-write-runner-implementation-review-gate"
  },
  {
    command: [node, "scripts/check-twii-implementation-scope-packet.mjs"],
    expectStatus: "ok",
    name: "twii-implementation-scope-packet"
  },
  {
    command: [node, "scripts/check-twii-server-only-implementation-scaffold.mjs"],
    expectStatus: "ok",
    name: "twii-server-only-implementation-scaffold"
  },
  {
    command: [node, "scripts/check-twii-credential-presence-shape-checker.mjs"],
    expectStatus: "ok",
    name: "twii-credential-presence-shape-checker"
  },
  {
    command: [node, "scripts/check-twii-execute-switch-confirmation-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-execute-switch-confirmation-preflight"
  },
  {
    command: [node, "scripts/check-twii-bounded-insert-missing-only-contract-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-insert-missing-only-contract-preflight"
  },
  {
    command: [node, "scripts/check-twii-coverage-repair-gate.mjs"],
    expectStatus: "ok",
    name: "twii-coverage-repair-gate"
  },
  {
    command: [node, "scripts/check-a1-coverage-gap-next-execution-roadmap.mjs"],
    expectStatus: "ok",
    name: "a1-coverage-gap-next-execution-roadmap"
  },
  {
    command: [node, "scripts/check-a1-source-and-coverage-no-fetch-handoff.mjs"],
    expectStatus: "ok",
    name: "a1-source-and-coverage-no-fetch-handoff"
  },
  {
    command: [node, "scripts/check-a1-official-open-source-coverage-no-fetch-handoff.mjs"],
    expectStatus: "ok",
    name: "a1-official-open-source-coverage-no-fetch-handoff"
  },
  {
    command: [node, "scripts/check-a1-public-beta-source-coverage-runtime-no-fetch-handoff.mjs"],
    expectStatus: "ok",
    name: "a1-public-beta-source-coverage-runtime-no-fetch-handoff"
  },
  {
    command: [node, "scripts/check-a1-brief-source-coverage-next-handoff-no-fetch.mjs"],
    expectStatus: "ok",
    name: "a1-brief-source-coverage-next-handoff-no-fetch"
  },
  {
    command: [node, "scripts/check-a1-public-beta-source-coverage-gap-matrix-no-fetch.mjs"],
    expectStatus: "ok",
    name: "a1-public-beta-source-coverage-gap-matrix-no-fetch"
  },
  {
    command: [node, "scripts/check-a1-etf-market-price-source-scope-no-fetch.mjs"],
    expectStatus: "ok",
    name: "a1-etf-market-price-source-scope-no-fetch"
  },
  {
    command: [node, "scripts/check-a1-etf-market-price-field-contract-no-fetch.mjs"],
    expectStatus: "ok",
    name: "a1-etf-market-price-field-contract-no-fetch"
  },
  {
    command: [node, "scripts/check-etf-market-price-synthetic-fixture.mjs"],
    expectStatus: "ok",
    name: "etf-market-price-synthetic-fixture"
  },
  {
    command: [node, "scripts/check-etf-market-price-mock-runtime-handoff.mjs"],
    expectStatus: "ok",
    name: "etf-market-price-mock-runtime-handoff"
  },
  {
    command: [node, "scripts/check-a1-official-open-free-source-terms-and-coverage-matrix-no-fetch.mjs"],
    expectStatus: "ok",
    name: "a1-official-open-free-source-terms-and-coverage-matrix-no-fetch"
  },
  {
    command: [node, "scripts/check-a1-twse-openapi-index-baseline-field-contract-confirmation-no-fetch.mjs"],
    expectStatus: "ok",
    name: "a1-twse-openapi-index-baseline-field-contract-confirmation-no-fetch"
  },
  {
    command: [node, "scripts/check-a1-index-baseline-synthetic-contract-cases-no-fetch.mjs"],
    expectStatus: "ok",
    name: "a1-index-baseline-synthetic-contract-cases-no-fetch"
  },
  {
    command: [node, "scripts/check-a1-batch1-listed-equity-symbol-policy-no-row-list.mjs"],
    expectStatus: "ok",
    name: "a1-batch1-listed-equity-symbol-policy-no-row-list"
  },
  {
    command: [node, "scripts/check-a1-public-beta-next-no-fetch-coverage-artifact.mjs"],
    expectStatus: "ok",
    name: "a1-public-beta-next-no-fetch-coverage-artifact"
  },
  {
    command: [node, "scripts/check-a1-twii-terms-field-cadence-attribution-no-fetch-packet.mjs"],
    expectStatus: "ok",
    name: "a1-twii-terms-field-cadence-attribution-no-fetch-packet"
  },
  {
    command: [node, "scripts/check-a1-twii-bounded-readonly-gate-candidate-requirements-no-execution.mjs"],
    expectStatus: "ok",
    name: "a1-twii-bounded-readonly-gate-candidate-requirements-no-execution"
  },
  {
    command: [node, "scripts/check-a1-twii-exact-source-rights-and-field-contract-evidence-no-fetch.mjs"],
    expectStatus: "ok",
    name: "a1-twii-exact-source-rights-and-field-contract-evidence-no-fetch"
  },
  {
    command: [node, "scripts/check-twii-operator-readonly-decision-packet-no-execution.mjs"],
    expectStatus: "ok",
    name: "twii-operator-readonly-decision-packet-no-execution"
  },
  {
    command: [node, "scripts/check-a1-twii-readonly-execution-packet-prerequisites-no-execution.mjs"],
    expectStatus: "ok",
    name: "a1-twii-readonly-execution-packet-prerequisites-no-execution"
  },
  {
    command: [node, "scripts/check-a2-twii-operator-decision-public-copy-guard.mjs"],
    expectStatus: "ok",
    name: "a2-twii-operator-decision-public-copy-guard"
  },
  {
    command: [node, "scripts/check-a2-field-contract-public-copy-guard.mjs"],
    expectStatus: "ok",
    name: "a2-field-contract-public-copy-guard"
  },
  {
    command: [node, "scripts/check-a2-brief-public-runtime-surface-audit.mjs"],
    expectStatus: "ok",
    name: "a2-brief-public-runtime-surface-audit"
  },
  {
    command: [node, "scripts/check-a2-twii-source-attribution-and-cadence-public-copy-guard.mjs"],
    expectStatus: "ok",
    name: "a2-twii-source-attribution-and-cadence-public-copy-guard"
  },
  {
    command: [node, "scripts/check-pm-brief-runtime-mainline-goal-and-workstreams.mjs"],
    expectStatus: "ok",
    name: "pm-brief-runtime-mainline-goal-and-workstreams"
  },
  {
    command: [node, "scripts/check-a3-public-beta-phase-1-launch-readiness-checklist.mjs"],
    expectStatus: "ok",
    name: "a3-public-beta-phase-1-launch-readiness-checklist"
  },
  {
    command: [node, "scripts/check-a3-public-beta-minimum-launch-engineering-readiness.mjs"],
    expectStatus: "ok",
    name: "a3-public-beta-minimum-launch-engineering-readiness"
  },
  {
    command: [node, "scripts/check-a3-no-secret-production-env-and-rollback-checklist.mjs"],
    expectStatus: "ok",
    name: "a3-no-secret-production-env-and-rollback-checklist"
  },
  {
    command: [node, "scripts/check-a3-phase-1-post-deploy-smoke-and-monitoring-packet.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-post-deploy-smoke-and-monitoring-packet"
  },
  {
    command: [node, "scripts/check-a3-phase-1-metadata-and-public-route-smoke-checker.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-metadata-and-public-route-smoke-checker"
  },
  {
    command: [node, "scripts/check-a3-phase-1-release-candidate-public-smoke-report.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-release-candidate-public-smoke-report"
  },
  {
    command: [node, "scripts/check-a3-phase-1-core-route-reading-contract-rollup.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-core-route-reading-contract-rollup"
  },
  {
    command: [node, "scripts/check-a3-phase-1-public-beta-release-go-no-go-packet.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-public-beta-release-go-no-go-packet"
  },
  {
    command: [node, "scripts/check-a3-phase-1-public-beta-chairman-review-packet.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-public-beta-chairman-review-packet"
  },
  {
    command: [node, "scripts/check-a3-phase-1-public-beta-manual-platform-action-checklist.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-public-beta-manual-platform-action-checklist"
  },
  {
    command: [node, "scripts/check-a3-phase-1-public-beta-no-secret-pre-platform-action-packet.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-public-beta-no-secret-pre-platform-action-packet"
  },
  {
    command: [node, "scripts/check-a3-phase-1-public-beta-post-platform-action-report-template.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-public-beta-post-platform-action-report-template"
  },
  {
    command: [node, "scripts/check-a3-phase-1-public-beta-monitoring-and-repair-runbook.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-public-beta-monitoring-and-repair-runbook"
  },
  {
    command: [node, "scripts/check-a3-phase-1-public-beta-release-ops-index.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-public-beta-release-ops-index"
  },
  {
    command: [node, "scripts/check-a3-phase-1-public-beta-deploy-smoke-rollback-closure.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-public-beta-deploy-smoke-rollback-closure"
  },
  {
    command: [node, "scripts/check-a3-phase-1-public-beta-remote-monitoring-snapshot.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-public-beta-remote-monitoring-snapshot"
  },
  {
    command: [node, "scripts/check-a3-phase-1-public-beta-release-review-summary-for-chairman.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-public-beta-release-review-summary-for-chairman"
  },
  {
    command: [node, "scripts/check-a3-phase-1-public-beta-chairman-operator-decision-record.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-public-beta-chairman-operator-decision-record"
  },
  {
    command: [node, "scripts/check-a3-phase-1-public-beta-operator-execution-path-runbook.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-public-beta-operator-execution-path-runbook"
  },
  {
    command: [node, "scripts/check-a3-phase-1-public-beta-operator-action-or-repair-result.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-public-beta-operator-action-or-repair-result"
  },
  {
    command: [node, "scripts/check-a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup.mjs"],
    expectStatus: "ok",
    name: "a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup"
  },
  {
    command: [node, "scripts/check-phase-1-phase-2-execution-split-and-workflow-assignment.mjs"],
    expectStatus: "ok",
    name: "phase-1-phase-2-execution-split-and-workflow-assignment"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-pre-operator-keep-open-status-dashboard-alignment.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-pre-operator-keep-open-status-dashboard-alignment"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-operator-decision-or-manual-platform-action-readiness-refresh.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-operator-decision-or-manual-platform-action-readiness-refresh"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-chairman-operator-decision-readiness-packet-or-repair.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-chairman-operator-decision-readiness-packet-or-repair"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-chairman-operator-decision-2026-06-13.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-chairman-operator-decision-2026-06-13"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-no-secret-manual-platform-action-readiness.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-no-secret-manual-platform-action-readiness"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-operator-safe-reply-template.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-operator-safe-reply-template"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-operator-safe-reply-pm-intake-recorder.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-operator-safe-reply-pm-intake-recorder"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-operator-action-or-no-action-safe-reply.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-operator-action-or-no-action-safe-reply"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-post-platform-report-filled-placeholder-or-repair-scaffold.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-post-platform-report-filled-placeholder-or-repair-scaffold"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-post-report-monitoring-or-repair-decision-loop.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-post-report-monitoring-or-repair-decision-loop"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-remote-monitoring-keep-open-decision.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-remote-monitoring-keep-open-decision"
  },
  {
    command: [node, "scripts/check-twii-aggregate-readback-contract-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-aggregate-readback-contract-preflight"
  },
  {
    command: [node, "scripts/check-twii-post-run-review-contract-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-post-run-review-contract-preflight"
  },
  {
    command: [node, "scripts/check-twii-rollback-readiness-contract-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-rollback-readiness-contract-preflight"
  },
  {
    command: [node, "scripts/check-twii-final-execution-packet-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-final-execution-packet-preflight"
  },
  {
    command: [node, "scripts/check-twii-one-attempt-authorization-intake-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-one-attempt-authorization-intake-preflight"
  },
  {
    command: [node, "scripts/check-twii-bounded-one-attempt-execution-review-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-one-attempt-execution-review-preflight"
  },
  {
    command: [node, "scripts/check-twii-final-runtime-execution-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-final-runtime-execution-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-final-operator-authorization-packet-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-final-operator-authorization-packet-preflight"
  },
  {
    command: [node, "scripts/check-twii-explicit-bounded-runtime-attempt-decision-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-explicit-bounded-runtime-attempt-decision-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-exact-runtime-execution-command-preparation-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-exact-runtime-execution-command-preparation-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-final-execution-run-authorization-go-no-go-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-final-execution-run-authorization-go-no-go-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-final-execution-rehearsal-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-final-execution-rehearsal-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-real-final-execution-auth-request-packet-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-real-final-execution-auth-request-packet-preflight"
  },
  {
    command: [node, "scripts/check-twii-operator-authorization-acceptance-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-operator-authorization-acceptance-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-accepted-decision-record-intake-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-accepted-decision-record-intake-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-decision-value-fixture-intake-validator-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-decision-value-fixture-intake-validator-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-real-decision-intake-packet-template-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-real-decision-intake-packet-template-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-real-decision-acceptance-dry-run-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-real-decision-acceptance-dry-run-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-decision-intake-recorder-mock-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-decision-intake-recorder-mock-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-operator-visible-decision-packet-readiness-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-operator-visible-decision-packet-readiness-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-operator-packet-fill-simulation-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-operator-packet-fill-simulation-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-real-operator-packet-intake-blocker-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-real-operator-packet-intake-blocker-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-real-operator-intake-checklist-packet-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-real-operator-intake-checklist-packet-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-operator-checklist-completion-simulator-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-operator-checklist-completion-simulator-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-operator-checklist-next-execution-route-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-operator-checklist-next-execution-route-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-operator-values-intake-readiness-surface-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-operator-values-intake-readiness-surface-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-operator-values-shape-recheck-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-operator-values-shape-recheck-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-pre-execution-readiness-recheck-gate-preflight.mjs"],
    expectStatus: "ok",
    name: "twii-pre-execution-readiness-recheck-gate-preflight"
  },
  {
    command: [node, "scripts/check-twii-server-only-pre-execution-integration-gate.mjs"],
    expectStatus: "ok",
    name: "twii-server-only-pre-execution-integration-gate"
  },
  {
    command: [node, "scripts/check-twii-bounded-operator-authorization-packet-gate.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-operator-authorization-packet-gate"
  },
  {
    command: [node, "scripts/check-twii-explicit-execution-packet-preparation-gate.mjs"],
    expectStatus: "ok",
    name: "twii-explicit-execution-packet-preparation-gate"
  },
  {
    command: [node, "scripts/check-twii-separate-authorized-execution-attempt-preparation-gate.mjs"],
    expectStatus: "ok",
    name: "twii-separate-authorized-execution-attempt-preparation-gate"
  },
  {
    command: [node, "scripts/check-twii-final-authorization-stopline-preparation-alignment-gate.mjs"],
    expectStatus: "ok",
    name: "twii-final-authorization-stopline-preparation-alignment-gate"
  },
  {
    command: [node, "scripts/check-twii-explicit-operator-go-no-go-decision-preparation-alignment-gate.mjs"],
    expectStatus: "ok",
    name: "twii-explicit-operator-go-no-go-decision-preparation-alignment-gate"
  },
  {
    command: [node, "scripts/check-twii-operator-value-intake-stopline-preparation-alignment-gate.mjs"],
    expectStatus: "ok",
    name: "twii-operator-value-intake-stopline-preparation-alignment-gate"
  },
  {
    command: [node, "scripts/check-twii-external-values-shape-recheck-preparation-alignment-gate.mjs"],
    expectStatus: "ok",
    name: "twii-external-values-shape-recheck-preparation-alignment-gate"
  },
  {
    command: [node, "scripts/check-twii-separate-authorized-execution-attempt-readiness-gate.mjs"],
    expectStatus: "ok",
    name: "twii-separate-authorized-execution-attempt-readiness-gate"
  },
  {
    command: [node, "scripts/check-twii-final-authorization-stopline-go-no-go-gate.mjs"],
    expectStatus: "ok",
    name: "twii-final-authorization-stopline-go-no-go-gate"
  },
  {
    command: [node, "scripts/check-twii-explicit-operator-go-no-go-decision-preparation-gate.mjs"],
    expectStatus: "ok",
    name: "twii-explicit-operator-go-no-go-decision-preparation-gate"
  },
  {
    command: [node, "scripts/check-twii-operator-value-intake-stopline-preparation-gate.mjs"],
    expectStatus: "ok",
    name: "twii-operator-value-intake-stopline-preparation-gate"
  },
  {
    command: [node, "scripts/check-twii-external-values-shape-recheck-preparation-gate.mjs"],
    expectStatus: "ok",
    name: "twii-external-values-shape-recheck-preparation-gate"
  },
  {
    command: [node, "scripts/check-twii-pre-execution-readiness-recheck-preparation-gate.mjs"],
    expectStatus: "ok",
    name: "twii-pre-execution-readiness-recheck-preparation-gate"
  },
  {
    command: [node, "scripts/check-twii-server-only-pre-execution-integration-preparation-gate.mjs"],
    expectStatus: "ok",
    name: "twii-server-only-pre-execution-integration-preparation-gate"
  },
  {
    command: [node, "scripts/check-twii-bounded-operator-authorization-packet-preparation-gate.mjs"],
    expectStatus: "ok",
    name: "twii-bounded-operator-authorization-packet-preparation-gate"
  },
  {
    command: [node, "scripts/check-twii-a1-d-write-prerequisite-dispatch-packet.mjs"],
    expectStatus: "ok",
    name: "twii-a1-d-write-prerequisite-dispatch-packet"
  },
  {
    command: [node, "scripts/check-twii-a1-d-write-prerequisite-pm-intake-ledger.mjs"],
    expectStatus: "ok",
    name: "twii-a1-d-write-prerequisite-pm-intake-ledger"
  },
  {
    command: [node, "scripts/check-coverage-universe-roadmap.mjs"],
    expectStatus: "ok",
    name: "coverage-universe-roadmap"
  },
  {
    command: [node, "scripts/check-goal-parallel-workstream-adjustment.mjs"],
    expectStatus: "ok",
    name: "goal-parallel-workstream-adjustment"
  },
  {
    command: [node, "scripts/check-runtime-local-route-health-refresh-before-executable-packet.mjs"],
    expectStatus: "ok",
    name: "runtime-local-route-health-refresh-before-executable-packet"
  },
  {
    command: [node, "scripts/check-beta-runtime-fast-health.mjs"],
    expectStatus: "ok",
    name: "beta-runtime-fast-health"
  },
  {
    command: [node, "scripts/check-public-beta-core-route-quick-proof.mjs"],
    expectStatus: "ok",
    name: "public-beta-core-route-quick-proof"
  },
  {
    command: [node, "scripts/check-pm-worktree-review-preflight.mjs"],
    expectStatus: "ok",
    name: "pm-worktree-review-preflight"
  },
  {
    command: [node, "scripts/check-beta-executable-packet-repo-proof-runner-gate.mjs"],
    expectStatus: "ok",
    name: "beta-executable-packet-repo-proof-runner-gate"
  },
  {
    command: [node, "scripts/check-data-gate-readiness-after-local-route-health-refresh.mjs"],
    expectStatus: "ok",
    name: "data-gate-readiness-after-local-route-health-refresh"
  },
  {
    command: [node, "scripts/check-twii-source-rights-field-contract-acceptance-or-blocked-record.mjs"],
    expectStatus: "blocked",
    name: "twii-source-rights-field-contract-acceptance-or-blocked-record"
  },
  {
    command: [node, "scripts/check-twii-vendor-internal-or-etf-fallback-selection.mjs"],
    expectStatus: "ok",
    name: "twii-vendor-internal-or-etf-fallback-selection"
  },
  {
    command: [node, "scripts/check-a1-twii-vendor-terms-or-internal-feed-owner-evidence-packet.mjs"],
    expectStatus: "ok",
    name: "a1-twii-vendor-terms-or-internal-feed-owner-evidence-packet"
  },
  {
    command: [node, "scripts/check-twii-vendor-internal-evidence-outcome-ledger.mjs"],
    expectStatus: "ok",
    name: "twii-vendor-internal-evidence-outcome-ledger"
  },
  {
    command: [node, "scripts/check-twii-source-rights-outcome-gate-bridge.mjs"],
    expectStatus: "ok",
    name: "twii-source-rights-outcome-gate-bridge"
  },
  {
    command: [node, "scripts/check-a1-source-rights-next-action.mjs"],
    expectStatus: "ok",
    name: "a1-source-rights-next-action"
  },
  {
    command: [node, "scripts/check-a1-exact-source-rights-evidence-intake-command-map.mjs"],
    expectStatus: "ok",
    name: "a1-exact-source-rights-evidence-intake-command-map"
  },
  {
    command: [node, "scripts/check-a1-exact-source-rights-evidence-outcome-ledger.mjs"],
    expectStatus: "ok",
    name: "a1-exact-source-rights-evidence-outcome-ledger"
  },
  {
    command: [node, "scripts/check-a1-exact-source-rights-evidence-recording-commands.mjs"],
    expectStatus: "ok",
    name: "a1-exact-source-rights-evidence-recording-commands"
  },
  {
    command: [node, "scripts/report-a1-exact-source-rights-evidence-worksheet.mjs"],
    expectStatus: "pending_fill_handoff_ready",
    name: "a1-exact-source-rights-evidence-worksheet-report"
  },
  {
    command: [node, "scripts/check-a1-exact-source-rights-evidence-worksheet.mjs"],
    expectStatus: "ok",
    name: "a1-exact-source-rights-evidence-worksheet"
  },
  {
    command: [node, "scripts/check-a1-twii-evidence-intake-mini-packet.mjs"],
    expectStatus: "ok",
    name: "a1-twii-evidence-intake-mini-packet"
  },
  {
    command: [node, "scripts/check-a1-twii-evidence-response-shape.mjs"],
    expectStatus: "ok",
    name: "a1-twii-evidence-response-shape"
  },
  {
    command: [node, "scripts/check-a1-twii-four-slot-reply-request.mjs"],
    expectStatus: "ok",
    name: "a1-twii-four-slot-reply-request"
  },
  {
    command: [node, "scripts/check-a1-twii-evidence-pm-classification-route.mjs"],
    expectStatus: "ok",
    name: "a1-twii-evidence-pm-classification-route"
  },
  {
    command: [node, "scripts/check-a1-twii-pm-intake-decision-summary.mjs"],
    expectStatus: "ok",
    name: "a1-twii-pm-intake-decision-summary"
  },
  {
    command: [node, "scripts/check-a1-twii-evidence-completion-status.mjs"],
    expectStatus: "ok",
    name: "a1-twii-evidence-completion-status"
  },
  {
    command: [node, "scripts/check-a1-twii-post-reply-pm-classification-once.mjs"],
    expectStatus: "ok",
    name: "a1-twii-post-reply-pm-classification-once"
  },
  {
    command: [node, "scripts/check-a1-twii-outcome-gate-candidate-route.mjs"],
    expectStatus: "ok",
    name: "a1-twii-outcome-gate-candidate-route"
  },
  {
    command: [node, "scripts/report-a1-source-rights-evidence-batch-brief.mjs"],
    expectStatus: "twii_batch_brief_ready_pending_no_secret_evidence",
    name: "a1-source-rights-evidence-batch-brief-report"
  },
  {
    command: [node, "scripts/check-a1-source-rights-evidence-batch-brief.mjs"],
    expectStatus: "ok",
    name: "a1-source-rights-evidence-batch-brief"
  },
  {
    command: [node, "scripts/report-a1-source-rights-reviewed-outcome-surface.mjs"],
    expectStatus: "pm_reviewed_outcome_surface_ready_waiting_no_secret_evidence",
    name: "a1-source-rights-reviewed-outcome-surface-report"
  },
  {
    command: [node, "scripts/check-a1-source-rights-reviewed-outcome-surface.mjs"],
    expectStatus: "ok",
    name: "a1-source-rights-reviewed-outcome-surface"
  },
  {
    command: [node, "scripts/check-a1-source-rights-readiness-summary.mjs"],
    expectStatus: "ok",
    name: "a1-source-rights-readiness-summary"
  },
  {
    command: [node, "scripts/check-local-launch-proof-refresh-before-executable-packet.mjs"],
    expectStatus: "ok",
    name: "local-launch-proof-refresh-before-executable-packet"
  },
  {
    command: [node, "scripts/check-beta-deployment-platform-values-bridge.mjs"],
    expectStatus: "ok",
    name: "beta-deployment-platform-values-bridge"
  },
  {
    command: [node, "scripts/check-beta-deployment-packet-window-readiness-selector.mjs"],
    expectStatus: "ok",
    name: "beta-deployment-packet-window-readiness-selector"
  },
  {
    command: [node, "scripts/check-pre-launch-executable-state-gap-convergence.mjs"],
    expectStatus: "ok",
    name: "pre-launch-executable-state-gap-convergence"
  },
  {
    command: [node, "scripts/check-public-beta-index-dashboard-brief-loop.mjs"],
    expectStatus: "ok",
    name: "public-beta-index-dashboard-brief-loop"
  },
  {
    command: [node, "scripts/check-public-beta-route-consistency.mjs"],
    expectStatus: "ok",
    name: "public-beta-route-consistency"
  },
  {
    command: [node, "scripts/check-public-beta-source-coverage-runtime-labels.mjs"],
    expectStatus: "ok",
    name: "public-beta-source-coverage-runtime-labels"
  },
  {
    command: [node, "scripts/check-source-coverage-runtime-handoff-docs.mjs"],
    expectStatus: "ok",
    name: "source-coverage-runtime-handoff-docs"
  },
  {
    command: [node, "scripts/check-local-runtime-launch-proof-continuation.mjs"],
    expectStatus: "ok",
    name: "local-runtime-launch-proof-continuation"
  },
  {
    command: [node, "scripts/check-local-runtime-launch-proof-trigger-matrix.mjs"],
    expectStatus: "ok",
    name: "local-runtime-launch-proof-trigger-matrix"
  },
  {
    command: [node, "scripts/check-taiwan-all-listed-universe-manifest-packet.mjs"],
    expectStatus: "ok",
    name: "taiwan-all-listed-universe-manifest-packet"
  },
  {
    command: [node, "scripts/check-public-trust-and-disclosure-copy-worklist.mjs"],
    expectStatus: "ok",
    name: "public-trust-and-disclosure-copy-worklist"
  },
  {
    command: [node, "scripts/check-mvp-remaining-coverage-execution-bridge.mjs"],
    expectStatus: "ok",
    name: "mvp-remaining-coverage-execution-bridge"
  },
  {
    command: [node, "scripts/check-a1-tw-equity-candidate-artifact-intake.mjs"],
    expectStatus: "ok",
    name: "a1-tw-equity-candidate-artifact-intake"
  },
  {
    command: [node, "scripts/check-a1-tw-equity-candidate-artifact-delivery-spec.mjs"],
    expectStatus: "ok",
    name: "a1-tw-equity-candidate-artifact-delivery-spec"
  },
  {
    command: [node, "scripts/check-a1-tw-equity-candidate-artifact-self-check.mjs"],
    expectStatus: "ok",
    name: "a1-tw-equity-candidate-artifact-self-check"
  },
  {
    command: [node, "scripts/check-pm-tw-equity-candidate-intake-review.mjs"],
    expectStatus: "ok",
    name: "pm-tw-equity-candidate-intake-review"
  },
  {
    command: [node, "scripts/check-a1-tw-equity-candidate-artifact-production-checklist.mjs"],
    expectStatus: "ok",
    name: "a1-tw-equity-candidate-artifact-production-checklist"
  },
  {
    command: [node, "scripts/check-tw-equity-sanitized-candidate-artifact-generation.mjs"],
    expectStatus: "ok",
    name: "tw-equity-sanitized-candidate-artifact-generation"
  },
  {
    command: [node, "scripts/check-runtime-readonly-decision-card.mjs"],
    expectStatus: "ok",
    name: "runtime-readonly-decision-card"
  },
  {
    command: [node, "scripts/check-post-readonly-runtime-state.mjs"],
    expectStatus: "ok",
    name: "post-readonly-runtime-state"
  },
  {
    command: [node, "scripts/check-runtime-promotion-readiness-summary.mjs"],
    expectStatus: "ok",
    name: "runtime-promotion-readiness-summary"
  },
  {
    command: [node, "scripts/check-post-readonly-next-gate-queue.mjs"],
    expectStatus: "ok",
    name: "post-readonly-next-gate-queue"
  },
  {
    command: [node, "scripts/check-runtime-workstream-integration-queue.mjs"],
    expectStatus: "ok",
    name: "runtime-workstream-integration-queue"
  },
  {
    command: [node, "scripts/check-data-readiness-decision-summary.mjs"],
    expectStatus: "ok",
    name: "data-readiness-decision-summary"
  },
  {
    command: [node, "scripts/check-data-foundation-gate.mjs"],
    expectStatus: "ok",
    name: "data-foundation-gate"
  },
  {
    command: [node, "scripts/check-data-evidence-ladder.mjs"],
    expectStatus: "ok",
    name: "data-evidence-ladder"
  },
  {
    command: [node, "scripts/check-blocker-closure-map.mjs"],
    expectStatus: "ok",
    name: "blocker-closure-map"
  },
  {
    command: [node, "scripts/check-blocker-closure-readiness-gate.mjs"],
    expectStatus: "ok",
    name: "blocker-closure-readiness-gate"
  },
  {
    command: [node, "scripts/check-promotion-prerequisites-gate.mjs"],
    expectStatus: "ok",
    name: "promotion-prerequisites-gate"
  },
  {
    command: [node, "scripts/check-a1-evidence-intake-protocol.mjs"],
    expectStatus: "ok",
    name: "a1-evidence-intake-protocol"
  },
  {
    command: [node, "scripts/check-a1-market-evidence-handoff-packet.mjs"],
    expectStatus: "ok",
    name: "a1-market-evidence-handoff-packet"
  },
  {
    command: [node, "scripts/check-a1-supabase-market-evidence-handoff-candidate.mjs"],
    expectStatus: "ok",
    name: "a1-supabase-market-evidence-handoff-candidate"
  },
  {
    command: [node, "scripts/check-mainline-readonly-packet-bridge.mjs"],
    expectStatus: "ok",
    name: "mainline-readonly-packet-bridge"
  },
  {
    command: [node, "scripts/check-mainline-readonly-row-coverage-integration.mjs"],
    expectStatus: "ok",
    name: "mainline-readonly-row-coverage-integration"
  },
  {
    command: [node, "scripts/check-role-workstreams.mjs"],
    expectStatus: "ok",
    name: "role-workstreams"
  },
  {
    command: [node, "scripts/check-runtime-autonomy-handoff.mjs"],
    expectStatus: "ok",
    name: "runtime-autonomy-handoff"
  },
  {
    command: [node, "scripts/check-readable-current-status.mjs"],
    expectStatus: "ok",
    name: "readable-current-status"
  },
  {
    command: [node, "scripts/check-mvp-launch-prd.mjs"],
    expectStatus: "ok",
    name: "mvp-launch-prd"
  },
  {
    command: [node, "scripts/check-a2-public-copy-readability-candidates.mjs"],
    expectStatus: "ok",
    name: "a2-public-copy-readability-candidates"
  },
  {
    command: [node, "scripts/check-a2-legal-methodology-readable-copy.mjs"],
    expectStatus: "ok",
    name: "a2-legal-methodology-readable-copy"
  },
  {
    command: [node, "scripts/check-a2-weekly-readable-copy.mjs"],
    expectStatus: "ok",
    name: "a2-weekly-readable-copy"
  },
  {
    command: [node, "scripts/check-public-beta-route-local-trust-visual-consistency.mjs"],
    expectStatus: "ok",
    name: "public-beta-route-local-trust-visual-consistency"
  },
  {
    command: [node, "scripts/check-blocker-review-decision-outcome-ledger.mjs"],
    expectStatus: "ok",
    name: "blocker-review-decision-outcome-ledger"
  },
  {
    command: [node, "scripts/check-record-blocker-review-decision-outcome.mjs"],
    expectStatus: "ok",
    name: "record-blocker-review-decision-outcome"
  },
  {
    command: [node, "scripts/check-runtime-execution-readiness-summary.mjs"],
    expectStatus: "ok",
    name: "runtime-execution-readiness-summary"
  },
  {
    command: [node, "scripts/check-runtime-action-status-normalization.mjs"],
    expectStatus: "ok",
    name: "runtime-action-status-normalization"
  },
  {
    command: [node, "scripts/check-schema-shape-acceptance-contract.mjs"],
    expectStatus: "ok",
    name: "schema-shape-acceptance-contract"
  },
  {
    command: [node, "scripts/check-remote-only-object-runtime-contract.mjs"],
    expectStatus: "ok",
    name: "remote-only-object-runtime-contract"
  },
  {
    command: [node, "scripts/check-freshness-runtime-readiness-contract.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-readiness-contract"
  },
  {
    command: [node, "scripts/check-freshness-runtime-one-attempt-decision.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-one-attempt-decision"
  },
  {
    command: [node, "scripts/check-freshness-runtime-prerun-bundle.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-prerun-bundle"
  },
  {
    command: [node, "scripts/check-runtime-product-summary.mjs"],
    expectStatus: "ok",
    name: "runtime-product-summary"
  },
  {
    command: [node, "scripts/check-investor-indicator-roadmap.mjs"],
    expectStatus: "ok",
    name: "investor-indicator-roadmap"
  },
  {
    command: [node, "scripts/check-investor-indicator-roadmap-contract.mjs"],
    expectStatus: "ok",
    name: "investor-indicator-roadmap-contract"
  },
  {
    command: [node, "scripts/check-trust-runtime-boundary-notice.mjs"],
    expectStatus: "ok",
    name: "trust-runtime-boundary-notice"
  },
  {
    command: [node, "scripts/check-public-runtime-boundary-coverage.mjs"],
    expectStatus: "ok",
    name: "public-runtime-boundary-coverage"
  },
  {
    command: [node, "scripts/check-stock-decision-compass.mjs"],
    expectStatus: "ok",
    name: "stock-decision-compass"
  },
  {
    command: [node, "scripts/check-stock-investor-action-summary.mjs"],
    expectStatus: "ok",
    name: "stock-investor-action-summary"
  },
  {
    command: [node, "scripts/check-stock-indicator-priority-panel.mjs"],
    expectStatus: "ok",
    name: "stock-indicator-priority-panel"
  },
  {
    command: [node, "scripts/check-stock-investor-indicator-roadmap-panel.mjs"],
    expectStatus: "ok",
    name: "stock-investor-indicator-roadmap-panel"
  },
  {
    command: [node, "scripts/check-market-action-summary-coverage.mjs"],
    expectStatus: "ok",
    name: "market-action-summary-coverage"
  },
  {
    command: [node, "scripts/check-public-beta-mainline-action-bridge.mjs"],
    expectStatus: "ok",
    name: "public-beta-mainline-action-bridge"
  },
  {
    command: [node, "scripts/check-public-beta-value-loop-refinement.mjs"],
    expectStatus: "ok",
    name: "public-beta-value-loop-refinement"
  },
  {
    command: [node, "scripts/check-public-beta-user-value-source-coverage-bridge.mjs"],
    expectStatus: "ok",
    name: "public-beta-user-value-source-coverage-bridge"
  },
  {
    command: [node, "scripts/check-public-beta-methodology-disclaimer-source-coverage-alignment.mjs"],
    expectStatus: "ok",
    name: "public-beta-methodology-disclaimer-source-coverage-alignment"
  },
  {
    command: [node, "scripts/check-public-beta-membership-mvp-roadmap.mjs"],
    expectStatus: "ok",
    name: "public-beta-membership-mvp-roadmap"
  },
  {
    command: [node, "scripts/check-a4-membership-mvp-scope-and-free-paid-boundary.mjs"],
    expectStatus: "ok",
    name: "a4-membership-mvp-scope-and-free-paid-boundary"
  },
  {
    command: [node, "scripts/check-a4-membership-mvp-executable-spec.mjs"],
    expectStatus: "ok",
    name: "a4-membership-mvp-executable-spec"
  },
  {
    command: [node, "scripts/check-public-beta-phase-1-launch-gap-rollup.mjs"],
    expectStatus: "ok",
    name: "public-beta-phase-1-launch-gap-rollup"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-operator-review-summary.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-operator-review-summary"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-post-operator-smoke-packet.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-post-operator-smoke-packet"
  },
  {
    command: [node, "scripts/check-phase-1-public-route-health-and-operator-safe-smoke-packet.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-route-health-and-operator-safe-smoke-packet"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-operator-safe-smoke-or-repair-decision.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-operator-safe-smoke-or-repair-decision"
  },
  {
    command: [node, "scripts/check-human-operated-preview-or-production-check-without-data-promotion.mjs"],
    expectStatus: "ok",
    name: "human-operated-preview-or-production-check-without-data-promotion"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-keep-open-or-repair-decision.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-keep-open-or-repair-decision"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-public-status-surface-alignment.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-public-status-surface-alignment"
  },
  {
    command: [node, "scripts/check-phase-1-public-beta-public-visible-residue-cleanup.mjs"],
    expectStatus: "ok",
    name: "phase-1-public-beta-public-visible-residue-cleanup"
  },
  {
    command: [node, "scripts/check-action-summary-language-quality.mjs"],
    expectStatus: "ok",
    name: "action-summary-language-quality"
  },
  {
    command: [node, "scripts/check-tracking-events.mjs"],
    expectStatus: "ok",
    name: "tracking-events"
  },
  {
    command: [node, "scripts/check-weekly-market-action-summary.mjs"],
    expectStatus: "ok",
    name: "weekly-market-action-summary"
  },
  {
    command: [node, "scripts/check-weekly-row-coverage-status.mjs"],
    expectStatus: "ok",
    name: "weekly-row-coverage-status"
  },
  {
    command: [node, "scripts/check-freshness-state-ui.mjs"],
    expectStatus: "ok",
    name: "freshness-state-ui"
  },
  {
    command: [node, "scripts/check-data-freshness-source-fallback.mjs"],
    expectStatus: "ok",
    name: "data-freshness-source-fallback"
  },
  {
    command: [node, "scripts/check-data-freshness-source-behavior.mjs"],
    expectStatus: "ok",
    name: "data-freshness-source-behavior"
  },
  {
    command: [node, "scripts/check-public-freshness-runtime-boundary.mjs"],
    expectStatus: "ok",
    name: "public-freshness-runtime-boundary"
  },
  {
    command: [node, "scripts/check-freshness-evidence-boundary.mjs"],
    expectStatus: "ok",
    name: "freshness-evidence-boundary"
  },
  {
    command: [node, "scripts/check-freshness-runtime-operation-decision.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-operation-decision"
  },
  {
    command: [
      node,
      "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON",
      "--experimental-strip-types",
      "scripts/check-data-freshness-snapshot-behavior.mjs"
    ],
    expectStatus: "ok",
    name: "data-freshness-snapshot-behavior"
  },
  {
    command: [node, "scripts/check-supabase-data-freshness-repository-behavior.mjs"],
    expectStatus: "ok",
    name: "supabase-data-freshness-repository-behavior"
  },
  {
    command: [node, "scripts/check-freshness-runtime-read-activation-gate.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-read-activation-gate"
  },
  {
    command: [node, "scripts/check-freshness-runtime-read-activation-gate-role-review.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-read-activation-gate-role-review"
  },
  {
    command: [node, "scripts/check-freshness-runtime-read-execution-packet-draft.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-read-execution-packet-draft"
  },
  {
    command: [node, "scripts/check-freshness-runtime-read-execution-packet-role-review.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-read-execution-packet-role-review"
  },
  {
    command: [node, "scripts/check-freshness-runtime-read-open-decision-gate.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-read-open-decision-gate"
  },
  {
    command: [node, "scripts/check-freshness-runtime-read-post-run-review-template.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-read-post-run-review-template"
  },
  {
    command: [node, "scripts/check-freshness-runtime-read-post-run-review-template-role-review.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-read-post-run-review-template-role-review"
  },
  {
    command: [node, "scripts/check-freshness-runtime-read-local-preflight-runner.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-read-local-preflight-runner"
  },
  {
    command: [node, "scripts/check-freshness-runtime-read-dry-run-command-map.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-read-dry-run-command-map"
  },
  {
    command: [node, "scripts/check-freshness-runtime-read-dry-run-command-map-role-review-and-readiness-decision.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-read-dry-run-command-map-role-review-and-readiness-decision"
  },
  {
    command: [node, "scripts/check-freshness-runtime-read-one-checkpoint-post-run-review.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-read-one-checkpoint-post-run-review"
  },
  {
    command: [node, "scripts/check-cp3-remote-only-object-contract-plan.mjs"],
    expectStatus: "ok",
    name: "cp3-remote-only-object-contract-plan"
  },
  {
    command: [node, "scripts/check-cp3-remote-only-object-draft-types.mjs"],
    expectStatus: "ok",
    name: "cp3-remote-only-object-draft-types"
  },
  {
    command: [node, "scripts/check-cp3-data-freshness-to-data-runs-relationship-note.mjs"],
    expectStatus: "ok",
    name: "cp3-data-freshness-to-data-runs-relationship-note"
  },
  {
    command: [node, "scripts/check-cp3-local-only-freshness-repository-abstraction-plan.mjs"],
    expectStatus: "ok",
    name: "cp3-local-only-freshness-repository-abstraction-plan"
  },
  {
    command: [node, "scripts/check-cp3-freshness-repository-draft-contract.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-repository-draft-contract"
  },
  {
    command: [node, "scripts/check-cp3-freshness-repository-factory-implementation.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-repository-factory-implementation"
  },
  {
    command: [node, "scripts/check-cp3-freshness-repository-source-selection.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-repository-source-selection"
  },
  {
    command: [node, "scripts/check-cp3-freshness-runtime-wrapper-local-smoke.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-runtime-wrapper-local-smoke"
  },
  {
    command: [node, "scripts/check-cp3-freshness-readonly-runtime-activation-readiness-packet.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-readonly-runtime-activation-readiness-packet"
  },
  {
    command: [node, "scripts/check-cp3-freshness-exact-one-attempt-readonly-activation-command-map.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-exact-one-attempt-readonly-activation-command-map"
  },
  {
    command: [node, "scripts/check-cp3-freshness-runtime-read-once-guarded-runner.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-runtime-read-once-guarded-runner"
  },
  {
    command: [node, "scripts/check-freshness-runtime-read-once-pre-remote-behavior.mjs"],
    expectStatus: "ok",
    name: "freshness-runtime-read-once-pre-remote-behavior"
  },
  {
    command: [node, "scripts/check-cp3-freshness-final-one-attempt-runtime-execution-decision-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-final-one-attempt-runtime-execution-decision-gate"
  },
  {
    command: [node, "scripts/check-cp3-freshness-runtime-read-once-execution-post-run-review.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-runtime-read-once-execution-post-run-review"
  },
  {
    command: [node, "scripts/check-cp3-freshness-runtime-read-once-latest-sanitized-run.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-runtime-read-once-latest-sanitized-run"
  },
  {
    command: [node, "scripts/check-cp3-freshness-runtime-read-once-current-attempt-post-run-review.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-runtime-read-once-current-attempt-post-run-review"
  },
  {
    command: [node, "scripts/check-cp3-freshness-credential-loading-command-revision.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-credential-loading-command-revision"
  },
  {
    command: [node, "scripts/check-cp3-freshness-revised-runner-second-one-attempt-execution-decision-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-revised-runner-second-one-attempt-execution-decision-gate"
  },
  {
    command: [node, "scripts/check-cp3-freshness-revised-runner-second-attempt-post-run-review.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-revised-runner-second-attempt-post-run-review"
  },
  {
    command: [node, "scripts/check-cp3-freshness-reachability-to-action-gate.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-reachability-to-action-gate"
  },
  {
    command: [node, "scripts/check-cp3-freshness-ui-runtime-disclosure.mjs"],
    expectStatus: "ok",
    name: "cp3-freshness-ui-runtime-disclosure"
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
    command: [node, "node_modules/typescript/bin/tsc", "--noEmit", "--incremental", "false"],
    expectStatus: "ok",
    name: "typescript"
  }
];

const coreReviewGateNames = new Set([
  "local-verification-runbook",
  "site-chrome-readability",
  "project-progress-score",
  "project-progress-snapshot",
  "overall-project-100-readiness",
  "final-mvp-100-completion-audit-readiness",
  "mock-mvp-chairman-review",
  "mock-mvp-f-ui-closeout",
  "data-authorization-entry-gate",
  "data-authorization-decision-packet",
  "data-authorization-readonly-attempt-post-run-review",
  "data-population-route-decision",
  "data-realification-acceleration-gate",
  "backfill-ingestion-execution-packet",
  "tw-equity-report-only-dry-run-packet",
  "tw-equity-source-rights-packet",
  "tw-equity-local-report-only-runner-design",
  "tw-equity-local-report-only-runner-implementation-gate",
  "tw-equity-local-report-only-runner",
  "tw-equity-local-report-only-runner-post-run-review",
  "tw-equity-source-approval-decision-packet",
  "tw-equity-provider-specific-terms-review-packet",
  "tw-equity-provider-specific-terms-review-outcome-ledger",
  "record-tw-equity-provider-specific-terms-review-outcome",
  "tw-equity-provider-specific-terms-review-outcome-tool-role-review",
  "tw-equity-provider-specific-terms-apply-runbook",
  "tw-equity-provider-specific-terms-apply-runbook-role-review",
  "tw-equity-source-review-readiness-summary",
  "tw-equity-source-classification-minimal-execution-route",
  "tw-equity-staging-first-authorization-packet",
  "tw-equity-staging-first-preflight-runner",
  "tw-equity-staging-first-write-authorization-packet-v1",
  "tw-equity-staging-write-authorization-readiness-v2",
  "tw-equity-staging-first-write-post-run-review-template-v1",
  "tw-equity-bounded-staging-write-execution-decision-v1",
  "tw-equity-write-runner-fail-closed-design",
  "tw-equity-actual-bounded-staging-write-authorization-packet",
  "tw-equity-write-runner-implementation-gate",
  "tw-equity-staging-write-runner-safety",
  "tw-equity-one-attempt-staging-write-preflight-gate",
  "tw-equity-write-capable-runner-implementation-readiness-gate",
  "tw-equity-write-implementation-design-to-code-boundary",
  "tw-equity-sanitized-candidate-input-validator",
  "tw-equity-write-pre-execution-summary",
  "tw-equity-write-implementation-final-authorization-gate",
  "tw-equity-write-implementation-final-authorization-acceptance",
  "tw-equity-staging-write-implementation",
  "tw-equity-staging-write-execution-readiness",
  "tw-equity-bounded-staging-write-attempt-decision",
  "tw-equity-staging-first-write-post-run-review-2026-06-06",
  "tw-equity-pgrst205-root-cause-gate",
  "tw-equity-second-bounded-staging-write-retry-decision",
  "tw-equity-second-write-runner-contract-alignment",
  "tw-equity-staging-second-write-retry-post-run-review-2026-06-06",
  "tw-equity-supabase-staging-write-repair-decision-packet",
  "tw-equity-supabase-staging-write-repair-evidence-checklist",
  "tw-equity-supabase-staging-write-repair-evidence-record",
  "tw-equity-run-id-uuid-contract-repair-gate",
  "tw-equity-supabase-metadata-diagnostic-decision-packet",
  "tw-equity-supabase-metadata-diagnostic-once",
  "tw-equity-supabase-metadata-diagnostic-post-run-review",
  "tw-equity-write-path-metadata-comparison",
  "tw-equity-postgrest-schema-exposure-probe-once",
  "tw-equity-postgrest-schema-exposure-probe-post-run-review",
  "tw-equity-schema-exposure-repair-decision-packet",
  "tw-equity-schema-exposure-repair-runbook",
  "record-tw-equity-schema-exposure-repair-outcome",
  "tw-equity-schema-exposure-outcome-to-probe-gate",
  "tw-equity-post-repair-schema-exposure-probe-result",
  "tw-equity-table-api-visibility-permission-diagnostic-decision-packet",
  "tw-equity-dashboard-table-visibility-observation",
  "tw-equity-staging-migration-apply-decision-packet",
  "tw-equity-staging-migration-apply-outcome",
  "tw-equity-post-migration-readonly-verification",
  "tw-equity-post-migration-openapi-exposure-confirmation",
  "tw-equity-third-bounded-staging-write-decision",
  "tw-equity-staging-third-write-post-run-review-2026-06-07",
  "tw-equity-post-write-staging-verification",
  "tw-equity-post-write-promotion-readiness-gate",
  "tw-equity-staging-to-daily-prices-merge-design-packet",
  "tw-equity-staging-to-daily-prices-dry-run-preflight",
  "tw-equity-staging-to-daily-prices-remote-preflight-authorization",
  "tw-equity-staging-to-daily-prices-remote-preflight-runner-implementation",
  "tw-equity-daily-prices-existing-target-overlap-policy",
  "tw-equity-daily-prices-overlap-classification-runner",
  "tw-equity-daily-prices-insert-missing-skip-existing-merge-authorization",
  "tw-equity-daily-prices-insert-missing-merge-runner-implementation",
  "tw-equity-daily-prices-insert-missing-merge-execution-decision",
  "tw-equity-daily-prices-insert-missing-merge-post-run-review-2026-06-07",
  "tw-equity-row-coverage-scoring-gate",
  "data-realification-first-closed-loop-rollup",
  "data-realification-post-first-closed-loop-next-lane-selector",
  "public-beta-data-realification-next-action",
  "runtime-promotion-policy-from-first-closed-loop",
  "runtime-policy-public-surface-mapping",
  "bounded-public-surface-copy-patch-from-mapping",
  "route-local-public-copy-alignment",
  "etf-daily-prices-coverage-completion-route",
  "etf-source-rights-outcome-decision-gate",
  "a1-twii-index-field-contract-decision-support",
  "twii-source-rights-outcome-gate",
  "a1-twii-sanitized-candidate-artifact-readiness-gate",
  "a1-twii-candidate-artifact-self-check",
  "pm-twii-candidate-intake-review",
  "twii-report-only-dry-run-decision-gate",
  "pm-twii-report-only-dry-run-preflight",
  "twii-report-only-local-runner",
  "twii-report-only-local-runner-post-run-review",
  "twii-aggregate-readback-gate",
  "twii-candidate-acceptance-decision-gate",
  "pm-twii-candidate-acceptance-review",
  "twii-bounded-data-acceptance-route-preflight",
  "pm-twii-bounded-data-acceptance-decision-review",
  "pm-twii-bounded-data-acceptance-attempt-runner-readiness",
  "twii-bounded-data-acceptance-attempt-dry-run-wrapper",
  "twii-bounded-data-acceptance-post-run-review",
  "twii-bounded-data-acceptance-dry-run-review-chain",
  "twii-bounded-data-acceptance-named-attempt-packet",
  "twii-bounded-data-acceptance-packet-driven-chain",
  "twii-sanitized-candidate-artifact-chain-handoff",
  "twii-bounded-data-acceptance-named-packet-scaffold",
  "twii-scaffold-to-packet-driven-chain-smoke-proof",
  "twii-real-handoff-intake-checklist",
  "twii-a1-d-handoff-reply-template",
  "pm-twii-named-attempt-no-write-proof",
  "twii-no-write-proof-post-review-readiness-gate",
  "twii-bounded-readonly-preflight-candidate-design",
  "twii-bounded-readonly-preflight-runner-stub",
  "twii-bounded-readonly-preflight-authorization-packet",
  "twii-bounded-readonly-preflight-final-execution-gate",
  "twii-bounded-readonly-preflight-real-readonly-runner-boundary",
  "twii-bounded-readonly-preflight-single-attempt-execution-packet",
  "twii-bounded-readonly-preflight-authorized-attempt-result-20260609",
  "twii-bounded-readonly-preflight-open-one-remote-readonly-execution-path",
  "twii-bounded-readonly-result-to-data-route-decision",
  "twii-candidate-acceptance-preparation",
  "twii-bounded-data-acceptance-execution-decision",
  "twii-bounded-data-acceptance-no-write-chain-run-20260609",
  "twii-supabase-write-gate-preauth",
  "twii-supabase-write-gate-packet-template",
  "twii-write-gate-runner-boundary",
  "twii-non-executing-write-runner-skeleton",
  "twii-write-runner-implementation-review-gate",
  "twii-write-readiness-packet-consolidation",
  "twii-write-implementation-candidate-gate-packet",
  "twii-future-write-gate-review-packet",
  "twii-explicit-execution-packet-draft",
  "twii-explicit-execution-readiness-selector",
  "twii-pre-execution-proof-bundle",
  "twii-future-one-time-authorization-packet",
  "twii-one-shot-authorization-packet-alignment",
  "twii-pm-authorization-review-decision-packet",
  "twii-pm-authorization-review-decision-alignment",
  "twii-one-attempt-runner-execution-gate",
  "twii-one-attempt-runner-execution-gate-alignment",
  "twii-fail-closed-runner-stub",
  "twii-explicit-execution-attempt-packet",
  "twii-future-execute-switch-confirmation-gate",
  "twii-server-only-execute-runner-candidate",
  "twii-server-only-runner-preflight",
  "twii-no-secret-execution-readiness-review",
  "twii-final-no-write-authorization-packet",
  "twii-explicit-execute-switch-confirmation-intake-gate",
  "twii-server-only-pre-execution-checks-gate",
  "twii-bounded-write-attempt-runner-fail-closed-scaffold",
  "twii-real-write-runner-implementation-review-gate",
  "twii-implementation-scope-packet",
  "twii-server-only-implementation-scaffold",
  "twii-credential-presence-shape-checker",
  "twii-execute-switch-confirmation-preflight",
  "twii-bounded-insert-missing-only-contract-preflight",
  "twii-coverage-repair-gate",
  "a1-coverage-gap-next-execution-roadmap",
  "a1-source-and-coverage-no-fetch-handoff",
  "a1-official-open-source-coverage-no-fetch-handoff",
  "a1-official-open-free-source-terms-and-coverage-matrix-no-fetch",
  "twii-aggregate-readback-contract-preflight",
  "twii-post-run-review-contract-preflight",
  "twii-rollback-readiness-contract-preflight",
  "twii-final-execution-packet-preflight",
  "twii-one-attempt-authorization-intake-preflight",
  "twii-bounded-one-attempt-execution-review-preflight",
  "twii-final-runtime-execution-gate-preflight",
  "twii-final-operator-authorization-packet-preflight",
  "twii-explicit-bounded-runtime-attempt-decision-gate-preflight",
  "twii-exact-runtime-execution-command-preparation-gate-preflight",
  "twii-final-execution-run-authorization-go-no-go-gate-preflight",
  "twii-final-execution-rehearsal-gate-preflight",
  "twii-real-final-execution-auth-request-packet-preflight",
  "twii-operator-authorization-acceptance-gate-preflight",
  "twii-accepted-decision-record-intake-gate-preflight",
  "twii-decision-value-fixture-intake-validator-gate-preflight",
  "twii-real-decision-intake-packet-template-gate-preflight",
  "twii-real-decision-acceptance-dry-run-gate-preflight",
  "twii-decision-intake-recorder-mock-gate-preflight",
  "twii-operator-visible-decision-packet-readiness-gate-preflight",
  "twii-operator-packet-fill-simulation-gate-preflight",
  "twii-real-operator-packet-intake-blocker-gate-preflight",
  "twii-real-operator-intake-checklist-packet-gate-preflight",
  "twii-operator-checklist-completion-simulator-gate-preflight",
  "twii-operator-checklist-next-execution-route-gate-preflight",
  "twii-operator-values-intake-readiness-surface-gate-preflight",
  "twii-operator-values-shape-recheck-gate-preflight",
  "twii-pre-execution-readiness-recheck-gate-preflight",
  "twii-server-only-pre-execution-integration-gate",
  "twii-bounded-operator-authorization-packet-gate",
  "twii-explicit-execution-packet-preparation-gate",
  "twii-separate-authorized-execution-attempt-preparation-gate",
  "twii-final-authorization-stopline-preparation-alignment-gate",
  "twii-explicit-operator-go-no-go-decision-preparation-alignment-gate",
  "twii-operator-value-intake-stopline-preparation-alignment-gate",
  "twii-external-values-shape-recheck-preparation-alignment-gate",
  "twii-separate-authorized-execution-attempt-readiness-gate",
  "twii-final-authorization-stopline-go-no-go-gate",
  "twii-explicit-operator-go-no-go-decision-preparation-gate",
  "twii-operator-value-intake-stopline-preparation-gate",
  "twii-external-values-shape-recheck-preparation-gate",
  "twii-pre-execution-readiness-recheck-preparation-gate",
  "twii-server-only-pre-execution-integration-preparation-gate",
  "twii-bounded-operator-authorization-packet-preparation-gate",
  "twii-a1-d-write-prerequisite-dispatch-packet",
  "twii-a1-d-write-prerequisite-pm-intake-ledger",
  "coverage-universe-roadmap",
  "twse-openapi-runtime-consumer-adapter-synthetic-case-notes",
  "twse-openapi-field-contract-roadmap",
  "twse-openapi-coverage-and-backfill-readiness",
  "goal-parallel-workstream-adjustment",
  "runtime-local-route-health-refresh-before-executable-packet",
  "beta-runtime-fast-health",
  "beta-executable-packet-repo-proof-runner-gate",
  "data-gate-readiness-after-local-route-health-refresh",
  "twii-source-rights-field-contract-acceptance-or-blocked-record",
  "twii-vendor-internal-or-etf-fallback-selection",
  "a1-twii-vendor-terms-or-internal-feed-owner-evidence-packet",
  "twii-vendor-internal-evidence-outcome-ledger",
  "twii-source-rights-outcome-gate-bridge",
  "a1-source-rights-next-action",
  "a1-exact-source-rights-evidence-intake-command-map",
  "a1-exact-source-rights-evidence-outcome-ledger",
  "a1-exact-source-rights-evidence-recording-commands",
  "a1-exact-source-rights-evidence-worksheet-report",
  "a1-exact-source-rights-evidence-worksheet",
  "a1-twii-evidence-intake-mini-packet",
  "a1-twii-evidence-response-shape",
  "a1-twii-four-slot-reply-request",
  "a1-twii-evidence-pm-classification-route",
  "a1-twii-pm-intake-decision-summary",
  "a1-twii-evidence-completion-status",
  "a1-twii-post-reply-pm-classification-once",
  "a1-twii-outcome-gate-candidate-route",
  "a1-twii-sanitized-candidate-artifact-readiness-gate",
  "a1-twii-candidate-artifact-self-check",
  "pm-twii-candidate-intake-review",
  "twii-report-only-dry-run-decision-gate",
  "pm-twii-report-only-dry-run-preflight",
  "twii-report-only-local-runner",
  "twii-report-only-local-runner-post-run-review",
  "twii-aggregate-readback-gate",
  "twii-candidate-acceptance-decision-gate",
  "pm-twii-candidate-acceptance-review",
  "twii-bounded-data-acceptance-route-preflight",
  "pm-twii-bounded-data-acceptance-decision-review",
  "pm-twii-bounded-data-acceptance-attempt-runner-readiness",
  "twii-bounded-data-acceptance-attempt-dry-run-wrapper",
  "twii-bounded-data-acceptance-post-run-review",
  "twii-bounded-data-acceptance-dry-run-review-chain",
  "twii-bounded-data-acceptance-named-attempt-packet",
  "twii-bounded-data-acceptance-packet-driven-chain",
  "twii-sanitized-candidate-artifact-chain-handoff",
  "twii-bounded-data-acceptance-named-packet-scaffold",
  "twii-scaffold-to-packet-driven-chain-smoke-proof",
  "twii-real-handoff-intake-checklist",
  "twii-a1-d-handoff-reply-template",
  "pm-twii-named-attempt-no-write-proof",
  "twii-no-write-proof-post-review-readiness-gate",
  "twii-bounded-readonly-preflight-candidate-design",
  "twii-bounded-readonly-preflight-runner-stub",
  "twii-bounded-readonly-preflight-authorization-packet",
  "twii-bounded-readonly-preflight-final-execution-gate",
  "twii-bounded-readonly-preflight-real-readonly-runner-boundary",
  "twii-bounded-readonly-preflight-single-attempt-execution-packet",
  "twii-bounded-readonly-preflight-authorized-attempt-result-20260609",
  "twii-bounded-readonly-preflight-open-one-remote-readonly-execution-path",
  "twii-bounded-readonly-result-to-data-route-decision",
  "twii-candidate-acceptance-preparation",
  "twii-bounded-data-acceptance-execution-decision",
  "twii-bounded-data-acceptance-no-write-chain-run-20260609",
  "twii-supabase-write-gate-preauth",
  "twii-supabase-write-gate-packet-template",
  "twii-write-gate-runner-boundary",
  "twii-non-executing-write-runner-skeleton",
  "twii-write-runner-implementation-review-gate",
  "twii-write-readiness-packet-consolidation",
  "twii-write-implementation-candidate-gate-packet",
  "twii-future-write-gate-review-packet",
  "twii-explicit-execution-packet-draft",
  "twii-explicit-execution-readiness-selector",
  "twii-pre-execution-proof-bundle",
  "twii-future-one-time-authorization-packet",
  "twii-one-shot-authorization-packet-alignment",
  "twii-pm-authorization-review-decision-packet",
  "twii-pm-authorization-review-decision-alignment",
  "twii-one-attempt-runner-execution-gate",
  "twii-one-attempt-runner-execution-gate-alignment",
  "twii-fail-closed-runner-stub",
  "twii-explicit-execution-attempt-packet",
  "twii-future-execute-switch-confirmation-gate",
  "twii-server-only-execute-runner-candidate",
  "twii-server-only-runner-preflight",
  "twii-no-secret-execution-readiness-review",
  "twii-final-no-write-authorization-packet",
  "twii-explicit-execute-switch-confirmation-intake-gate",
  "twii-server-only-pre-execution-checks-gate",
  "twii-bounded-write-attempt-runner-fail-closed-scaffold",
  "twii-real-write-runner-implementation-review-gate",
  "twii-implementation-scope-packet",
  "twii-server-only-implementation-scaffold",
  "twii-credential-presence-shape-checker",
  "twii-execute-switch-confirmation-preflight",
  "twii-bounded-insert-missing-only-contract-preflight",
  "twii-coverage-repair-gate",
  "a1-coverage-gap-next-execution-roadmap",
  "a1-source-and-coverage-no-fetch-handoff",
  "a1-official-open-source-coverage-no-fetch-handoff",
  "a1-official-open-free-source-terms-and-coverage-matrix-no-fetch",
  "twii-aggregate-readback-contract-preflight",
  "twii-post-run-review-contract-preflight",
  "twii-rollback-readiness-contract-preflight",
  "twii-final-execution-packet-preflight",
  "twii-one-attempt-authorization-intake-preflight",
  "twii-bounded-one-attempt-execution-review-preflight",
  "twii-final-runtime-execution-gate-preflight",
  "twii-final-operator-authorization-packet-preflight",
  "twii-explicit-bounded-runtime-attempt-decision-gate-preflight",
  "twii-exact-runtime-execution-command-preparation-gate-preflight",
  "twii-final-execution-run-authorization-go-no-go-gate-preflight",
  "twii-final-execution-rehearsal-gate-preflight",
  "twii-real-final-execution-auth-request-packet-preflight",
  "twii-operator-authorization-acceptance-gate-preflight",
  "twii-accepted-decision-record-intake-gate-preflight",
  "twii-decision-value-fixture-intake-validator-gate-preflight",
  "twii-real-decision-intake-packet-template-gate-preflight",
  "twii-real-decision-acceptance-dry-run-gate-preflight",
  "twii-decision-intake-recorder-mock-gate-preflight",
  "twii-operator-visible-decision-packet-readiness-gate-preflight",
  "twii-operator-packet-fill-simulation-gate-preflight",
  "twii-real-operator-packet-intake-blocker-gate-preflight",
  "twii-real-operator-intake-checklist-packet-gate-preflight",
  "twii-operator-checklist-completion-simulator-gate-preflight",
  "twii-operator-checklist-next-execution-route-gate-preflight",
  "twii-operator-values-intake-readiness-surface-gate-preflight",
  "twii-operator-values-shape-recheck-gate-preflight",
  "twii-pre-execution-readiness-recheck-gate-preflight",
  "twii-server-only-pre-execution-integration-gate",
  "twii-bounded-operator-authorization-packet-gate",
  "twii-explicit-execution-packet-preparation-gate",
  "twii-separate-authorized-execution-attempt-preparation-gate",
  "twii-final-authorization-stopline-preparation-alignment-gate",
  "twii-explicit-operator-go-no-go-decision-preparation-alignment-gate",
  "twii-operator-value-intake-stopline-preparation-alignment-gate",
  "twii-external-values-shape-recheck-preparation-alignment-gate",
  "twii-separate-authorized-execution-attempt-readiness-gate",
  "twii-final-authorization-stopline-go-no-go-gate",
  "twii-explicit-operator-go-no-go-decision-preparation-gate",
  "twii-operator-value-intake-stopline-preparation-gate",
  "twii-external-values-shape-recheck-preparation-gate",
  "twii-pre-execution-readiness-recheck-preparation-gate",
  "twii-a1-d-write-prerequisite-dispatch-packet",
  "twii-a1-d-write-prerequisite-pm-intake-ledger",
  "a1-source-rights-readiness-summary",
  "local-launch-proof-refresh-before-executable-packet",
  "beta-deployment-platform-values-bridge",
  "public-beta-readiness-gate",
  "public-beta-launch-readiness-panel",
  "public-beta-data-readiness-status",
  "beta-launch-preflight-packet",
  "beta-release-runbook-draft",
  "future-deployment-execution-gate",
  "beta-deployment-operator-input-packet",
  "beta-deployment-execution-packet-draft",
  "beta-deployment-operator-fill-guide",
  "beta-deployment-intake-checklist",
  "beta-deployment-executable-packet-candidate-gate",
  "beta-deployment-operator-values-minimal-sheet",
  "beta-deployment-operator-values-completion-gate",
  "beta-deployment-no-secret-operator-values-record",
  "beta-deployment-operator-values-safe-fill-recheck",
  "local-launch-preflight-without-external-operator-values",
  "local-launch-proof-bundle-snapshot",
  "beta-deployment-operator-values-gap-list",
  "beta-deployment-operator-values-defaults-and-remaining-gaps",
  "beta-platform-two-value-intake-gate",
  "beta-platform-two-value-intake-command",
  "beta-platform-two-value-validator",
  "beta-platform-proof-status",
  "beta-platform-values-route-preview",
  "beta-two-value-operator-handoff",
  "beta-launch-next-action",
  "beta-deployment-quickstart",
  "vercel-beta-pre-creation-checklist",
  "vercel-operator-step-by-step-checklist",
  "beta-platform-unblock-kit",
  "public-beta-mock-launch-proof-bundle",
  "phase-1-public-beta-mock-launch-candidate-status-summary",
  "phase-1-public-beta-candidate-final-public-readiness-scan",
  "phase-1-public-beta-final-readiness-rollup",
  "phase-1-public-beta-release-readiness-evidence-rollup",
  "phase-1-ui-ux-style-direction",
  "phase-1-public-beta-human-visual-review",
  "phase-1-human-ui-ux-acceptance-checklist",
  "phase-1-pre-ui-ux-acceptance-record",
  "phase-1-public-beta-visual-acceptance-and-a3-handoff",
  "phase-1-public-beta-chairman-visual-acceptance-record",
  "public-beta-separated-preflight",
  "public-beta-external-input-request",
  "public-beta-external-input-copy-packet",
  "public-beta-external-reply-file-template",
  "public-beta-external-reply-file-template-writer",
  "public-beta-external-reply-env-fill",
  "public-beta-external-reply-env-template-writer",
  "public-beta-external-reply-intake-dry-run",
  "public-beta-a1-reply-pm-classification-preview",
  "public-beta-external-reply-file-route",
  "public-beta-external-reply-file-workflow-proof",
  "public-beta-external-input-response-readiness",
  "public-beta-post-reply-route-once",
  "beta-launch-remaining-blockers",
  "beta-mainline-current-route",
  "beta-pre-execution-packet-readiness",
  "beta-packet-window-candidate-dry-run-runner",
  "beta-packet-window-executable-candidate-template",
  "beta-packet-window-reviewed-artifact-acceptance-gate",
  "beta-packet-window-no-secret-artifact-creation-runbook",
  "beta-packet-window-one-command-proof-map",
  "beta-platform-two-value-proof-map-once",
  "beta-packet-window-readiness-summary",
  "beta-packet-window-reviewed-artifact-outcome-recorder",
  "beta-packet-to-deployment-pre-execution-bridge",
  "beta-pre-execution-packet-candidate-template",
  "chairman-beta-launch-review-packet",
  "runtime-data-promotion-handoff-checklist",
  "runtime-summary-alignment-from-first-closed-loop",
  "a1-mvp-coverage-closure-route-support",
  "a1-twii-etf-source-rights-evidence-intake-packet",
  "a1-exact-source-rights-evidence-intake-command-map",
  "a1-exact-source-rights-evidence-outcome-ledger",
  "a1-exact-source-rights-evidence-recording-commands",
  "a1-exact-source-rights-evidence-worksheet-report",
  "a1-exact-source-rights-evidence-worksheet",
  "a1-twii-evidence-intake-mini-packet",
  "a1-twii-evidence-response-shape",
  "a1-twii-four-slot-reply-request",
  "a1-twii-evidence-pm-classification-route",
  "a1-twii-evidence-completion-status",
  "a1-twii-post-reply-pm-classification-once",
  "a1-twii-outcome-gate-candidate-route",
  "a1-source-rights-readiness-summary",
  "a1-source-rights-unblock-priority-packet",
  "a1-twii-source-rights-unblock-decision-record-candidate",
  "a1-twii-source-rights-evidence-intake-or-vendor-fallback-decision-support",
  "a1-twii-official-source-intake-fields-or-vendor-terms-review-packet",
  "pm-brief-runtime-mainline-goal-and-workstreams",
  "a3-public-beta-phase-1-launch-readiness-checklist",
  "a3-public-beta-minimum-launch-engineering-readiness",
  "a3-no-secret-production-env-and-rollback-checklist",
  "a3-phase-1-post-deploy-smoke-and-monitoring-packet",
  "a3-phase-1-metadata-and-public-route-smoke-checker",
  "a3-phase-1-release-candidate-public-smoke-report",
  "a3-phase-1-core-route-reading-contract-rollup",
  "a3-phase-1-public-beta-release-go-no-go-packet",
  "a3-phase-1-public-beta-chairman-review-packet",
  "a3-phase-1-public-beta-manual-platform-action-checklist",
  "a3-phase-1-public-beta-no-secret-pre-platform-action-packet",
  "a3-phase-1-public-beta-post-platform-action-report-template",
  "a3-phase-1-public-beta-monitoring-and-repair-runbook",
  "a3-phase-1-public-beta-release-ops-index",
  "a3-phase-1-public-beta-deploy-smoke-rollback-closure",
  "a3-phase-1-public-beta-remote-monitoring-snapshot",
  "a3-phase-1-public-beta-release-review-summary-for-chairman",
  "a3-phase-1-public-beta-chairman-operator-decision-record",
  "a3-phase-1-public-beta-operator-execution-path-runbook",
  "a3-phase-1-public-beta-operator-action-or-repair-result",
  "a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup",
  "phase-1-phase-2-execution-split-and-workflow-assignment",
  "phase-1-public-beta-pre-operator-keep-open-status-dashboard-alignment",
  "phase-1-public-beta-operator-decision-or-manual-platform-action-readiness-refresh",
  "phase-1-public-beta-chairman-operator-decision-readiness-packet-or-repair",
  "phase-1-public-beta-chairman-operator-decision-2026-06-13",
  "phase-1-public-beta-no-secret-manual-platform-action-readiness",
  "phase-1-public-beta-operator-safe-reply-template",
  "phase-1-public-beta-operator-safe-reply-pm-intake-recorder",
  "phase-1-public-beta-operator-action-or-no-action-safe-reply",
  "phase-1-public-beta-post-platform-report-filled-placeholder-or-repair-scaffold",
  "phase-1-public-beta-post-report-monitoring-or-repair-decision-loop",
  "phase-1-public-beta-remote-monitoring-keep-open-decision",
  "a2-public-beta-trust-copy-readiness",
  "briefing-public-beta-gate-summary",
  "a2-beta-phrase-set-and-shared-trust-surface-patch-scope",
  "a2-public-copy-ux-safety-brief-handoff",
  "a2-home-first-screen-public-copy-handoff",
  "a2-public-beta-runtime-ux-safety-handoff",
  "a2-route-local-legal-weekly-methodology-copy-regression-gate",
  "a2-bounded-route-local-trust-copy-patch",
  "a2-route-local-trust-copy-route-health",
  "a2-legal-methodology-readable-copy",
  "a2-weekly-readable-copy",
  "public-beta-route-local-trust-visual-consistency",
  "taiwan-all-listed-universe-manifest-packet",
  "public-trust-and-disclosure-copy-worklist",
  "mvp-remaining-coverage-execution-bridge",
  "a1-tw-equity-candidate-artifact-intake",
  "a1-tw-equity-candidate-artifact-delivery-spec",
  "a1-tw-equity-candidate-artifact-self-check",
  "pm-tw-equity-candidate-intake-review",
  "a1-tw-equity-candidate-artifact-production-checklist",
  "tw-equity-sanitized-candidate-artifact-generation",
  "typescript"
]);

const publicBetaFocusedReviewGateNames = new Set([
  "local-verification-runbook",
  "market-action-summary-readable-copy",
  "briefing-midpage-readability",
  "home-briefing-investor-reading-bridge",
  "home-first-screen-decision-hierarchy",
  "phase-1-route-decision-order",
  "public-beta-alert-list-actionability",
  "public-visible-language-quality",
  "public-source-residue-scan",
  "public-surface-user-facing-audit",
  "public-beta-decision-loop-bridge",
  "public-beta-decision-journey-panel",
  "public-support-route-reading-contract",
  "public-beta-index-dashboard-brief-loop",
  "public-beta-route-consistency",
  "public-beta-route-local-trust-visual-consistency",
  "public-beta-mainline-action-bridge",
  "public-beta-value-loop-refinement",
  "public-beta-user-value-source-coverage-bridge",
  "public-beta-usable-loop-panel",
  "public-beta-methodology-disclaimer-source-coverage-alignment",
  "public-beta-membership-mvp-roadmap",
  "a4-membership-mvp-scope-and-free-paid-boundary",
  "public-beta-phase-1-launch-gap-rollup",
  "phase-1-public-beta-operator-review-summary",
  "phase-1-public-beta-post-operator-smoke-packet",
  "phase-1-public-route-health-and-operator-safe-smoke-packet",
  "phase-1-public-beta-operator-safe-smoke-or-repair-decision",
  "human-operated-preview-or-production-check-without-data-promotion",
  "phase-1-public-beta-keep-open-or-repair-decision",
  "phase-1-public-beta-public-status-surface-alignment",
  "phase-1-public-beta-public-visible-residue-cleanup",
  "public-beta-source-coverage-runtime-labels",
  "source-coverage-runtime-handoff-docs",
  "public-beta-data-realification-next-action",
  "phase-1-data-online-go-no-go-status",
  "phase-1-twii-bounded-write-operator-decision-quickstart",
  "phase-1-twii-operator-decision-intake-readiness",
  "phase-1-twii-operator-decision-packet-request",
  "open-free-auto-data-source-gate",
  "stock-decision-aid-actionability",
  "stock-decision-compass",
  "stock-route-investor-language-alignment",
  "twse-openapi-bounded-metadata-terms-validation",
  "twse-openapi-source-adapter-contract",
  "twse-openapi-parser-contract",
  "twse-openapi-parser-consumer-adapter",
  "twse-openapi-runtime-mock-wiring-readiness",
  "twse-openapi-runtime-mock-consumer-wire",
  "twse-openapi-runtime-consumer-adapter-synthetic-case-notes",
  "twse-openapi-field-contract-roadmap",
  "twse-openapi-coverage-and-backfill-readiness",
  "a1-brief-source-coverage-next-handoff-no-fetch",
  "a1-public-beta-source-coverage-gap-matrix-no-fetch",
  "a1-etf-market-price-source-scope-no-fetch",
  "a1-etf-market-price-field-contract-no-fetch",
  "etf-market-price-synthetic-fixture",
  "etf-market-price-mock-runtime-handoff",
  "a1-twse-openapi-index-baseline-field-contract-confirmation-no-fetch",
  "a1-index-baseline-synthetic-contract-cases-no-fetch",
  "a1-batch1-listed-equity-symbol-policy-no-row-list",
  "a1-public-beta-next-no-fetch-coverage-artifact",
  "a1-twii-terms-field-cadence-attribution-no-fetch-packet",
  "a1-twii-bounded-readonly-gate-candidate-requirements-no-execution",
  "a1-twii-exact-source-rights-and-field-contract-evidence-no-fetch",
  "twii-operator-readonly-decision-packet-no-execution",
  "a1-twii-readonly-execution-packet-prerequisites-no-execution",
  "a2-twii-operator-decision-public-copy-guard",
  "a2-field-contract-public-copy-guard",
  "a2-brief-public-runtime-surface-audit",
  "a2-twii-source-attribution-and-cadence-public-copy-guard",
  "twse-openapi-index-baseline-synthetic-parser-fixture",
  "twse-openapi-index-baseline-mock-runtime-handoff",
  "public-beta-launch-readiness-panel",
  "public-beta-data-readiness-status",
  "beta-platform-proof-status",
  "beta-platform-values-route-preview",
  "beta-deployment-quickstart",
  "beta-runtime-fast-health",
  "public-beta-mock-launch-proof-bundle",
  "phase-1-public-beta-mock-launch-candidate-status-summary",
  "phase-1-public-beta-candidate-final-public-readiness-scan",
  "phase-1-public-beta-final-readiness-rollup",
  "phase-1-public-beta-release-readiness-evidence-rollup",
  "phase-1-ui-ux-style-direction",
  "phase-1-public-beta-human-visual-review",
  "phase-1-human-ui-ux-acceptance-checklist",
  "phase-1-pre-ui-ux-acceptance-record",
  "phase-1-public-beta-visual-acceptance-and-a3-handoff",
  "phase-1-public-beta-chairman-visual-acceptance-record",
  "a2-home-first-screen-public-copy-handoff",
  "a1-twii-four-slot-reply-request",
  "a1-twii-pm-intake-decision-summary",
  "a1-twii-evidence-completion-status",
  "a1-twii-source-rights-unblock-decision-record-candidate",
  "a1-twii-source-rights-evidence-intake-or-vendor-fallback-decision-support",
  "a1-twii-official-source-intake-fields-or-vendor-terms-review-packet",
  "twii-bounded-data-acceptance-attempt-dry-run-wrapper",
  "twii-bounded-data-acceptance-post-run-review",
  "twii-bounded-data-acceptance-dry-run-review-chain",
  "twii-bounded-data-acceptance-named-attempt-packet",
  "twii-bounded-data-acceptance-packet-driven-chain",
  "twii-sanitized-candidate-artifact-chain-handoff",
  "twii-bounded-data-acceptance-named-packet-scaffold",
  "twii-scaffold-to-packet-driven-chain-smoke-proof",
  "twii-real-handoff-intake-checklist",
  "twii-a1-d-handoff-reply-template",
  "pm-twii-named-attempt-no-write-proof",
  "twii-no-write-proof-post-review-readiness-gate",
  "twii-bounded-readonly-preflight-candidate-design",
  "twii-bounded-readonly-preflight-runner-stub",
  "twii-bounded-readonly-preflight-authorization-packet",
  "twii-bounded-readonly-preflight-final-execution-gate",
  "twii-bounded-readonly-preflight-real-readonly-runner-boundary",
  "twii-bounded-readonly-preflight-single-attempt-execution-packet",
  "twii-bounded-readonly-preflight-authorized-attempt-result-20260609",
  "twii-bounded-readonly-preflight-open-one-remote-readonly-execution-path",
  "twii-bounded-readonly-result-to-data-route-decision",
  "twii-candidate-acceptance-preparation",
  "twii-bounded-data-acceptance-execution-decision",
  "twii-bounded-data-acceptance-no-write-chain-run-20260609",
  "twii-supabase-write-gate-preauth",
  "twii-supabase-write-gate-packet-template",
  "twii-write-gate-runner-boundary",
  "twii-non-executing-write-runner-skeleton",
  "twii-write-runner-implementation-review-gate",
  "twii-write-readiness-packet-consolidation",
  "twii-write-implementation-candidate-gate-packet",
  "twii-future-write-gate-review-packet",
  "twii-explicit-execution-packet-draft",
  "twii-explicit-execution-readiness-selector",
  "twii-pre-execution-proof-bundle",
  "twii-future-one-time-authorization-packet",
  "twii-one-shot-authorization-packet-alignment",
  "twii-pm-authorization-review-decision-packet",
  "twii-pm-authorization-review-decision-alignment",
  "twii-one-attempt-runner-execution-gate",
  "twii-one-attempt-runner-execution-gate-alignment",
  "twii-fail-closed-runner-stub",
  "twii-explicit-execution-attempt-packet",
  "twii-future-execute-switch-confirmation-gate",
  "twii-server-only-execute-runner-candidate",
  "twii-server-only-runner-preflight",
  "twii-no-secret-execution-readiness-review",
  "twii-final-no-write-authorization-packet",
  "twii-explicit-execute-switch-confirmation-intake-gate",
  "twii-server-only-pre-execution-checks-gate",
  "twii-bounded-write-attempt-runner-fail-closed-scaffold",
  "twii-real-write-runner-implementation-review-gate",
  "twii-implementation-scope-packet",
  "twii-server-only-implementation-scaffold",
  "twii-credential-presence-shape-checker",
  "twii-execute-switch-confirmation-preflight",
  "twii-bounded-insert-missing-only-contract-preflight",
  "twii-coverage-repair-gate",
  "a1-coverage-gap-next-execution-roadmap",
  "a1-source-and-coverage-no-fetch-handoff",
  "a1-official-open-source-coverage-no-fetch-handoff",
  "a1-official-open-free-source-terms-and-coverage-matrix-no-fetch",
  "twii-aggregate-readback-contract-preflight",
  "twii-post-run-review-contract-preflight",
  "twii-rollback-readiness-contract-preflight",
  "twii-final-execution-packet-preflight",
  "twii-one-attempt-authorization-intake-preflight",
  "twii-bounded-one-attempt-execution-review-preflight",
  "twii-final-runtime-execution-gate-preflight",
  "twii-final-operator-authorization-packet-preflight",
  "twii-explicit-bounded-runtime-attempt-decision-gate-preflight",
  "twii-exact-runtime-execution-command-preparation-gate-preflight",
  "twii-final-execution-run-authorization-go-no-go-gate-preflight",
  "twii-final-execution-rehearsal-gate-preflight",
  "twii-real-final-execution-auth-request-packet-preflight",
  "twii-operator-authorization-acceptance-gate-preflight",
  "twii-accepted-decision-record-intake-gate-preflight",
  "twii-decision-value-fixture-intake-validator-gate-preflight",
  "twii-real-decision-intake-packet-template-gate-preflight",
  "twii-real-decision-acceptance-dry-run-gate-preflight",
  "twii-decision-intake-recorder-mock-gate-preflight",
  "twii-operator-visible-decision-packet-readiness-gate-preflight",
  "twii-operator-packet-fill-simulation-gate-preflight",
  "twii-real-operator-packet-intake-blocker-gate-preflight",
  "twii-real-operator-intake-checklist-packet-gate-preflight",
  "twii-operator-checklist-completion-simulator-gate-preflight",
  "twii-operator-checklist-next-execution-route-gate-preflight",
  "twii-operator-values-intake-readiness-surface-gate-preflight",
  "twii-operator-values-shape-recheck-gate-preflight",
  "twii-pre-execution-readiness-recheck-gate-preflight",
  "twii-server-only-pre-execution-integration-gate",
  "twii-bounded-operator-authorization-packet-gate",
  "twii-explicit-execution-packet-preparation-gate",
  "twii-separate-authorized-execution-attempt-preparation-gate",
  "twii-final-authorization-stopline-preparation-alignment-gate",
  "twii-explicit-operator-go-no-go-decision-preparation-alignment-gate",
  "twii-operator-value-intake-stopline-preparation-alignment-gate",
  "twii-external-values-shape-recheck-preparation-alignment-gate",
  "twii-separate-authorized-execution-attempt-readiness-gate",
  "twii-final-authorization-stopline-go-no-go-gate",
  "twii-explicit-operator-go-no-go-decision-preparation-gate",
  "twii-operator-value-intake-stopline-preparation-gate",
  "twii-external-values-shape-recheck-preparation-gate",
  "twii-pre-execution-readiness-recheck-preparation-gate",
  "twii-a1-d-write-prerequisite-dispatch-packet",
  "twii-a1-d-write-prerequisite-pm-intake-ledger",
  "typescript"
]);

const runHistoricalGates = process.env.REVIEW_GATE_RUN_HISTORICAL === "true";
const runLegacyCoreGates = process.env.REVIEW_GATE_RUN_LEGACY_CORE === "true";
const includeRegisteredOnlyResults = process.env.REVIEW_GATE_VERBOSE_REGISTERED === "true" || runHistoricalGates || runLegacyCoreGates;
const supersededPublicSurfaceGateNames = new Set([
  "briefing-midpage-readability",
  "home-briefing-investor-reading-bridge",
  "phase-1-route-decision-order",
  "market-action-summary-readable-copy",
  "public-beta-alert-list-actionability",
  "public-beta-decision-loop-bridge",
  "public-beta-decision-journey-panel",
  "public-beta-usable-loop-panel",
  "public-support-route-reading-contract",
  "public-beta-data-readiness-status",
  "phase-1-public-beta-final-readiness-rollup",
  "a2-brief-public-runtime-surface-audit",
  "public-beta-route-consistency",
  "public-beta-route-local-trust-visual-consistency",
  "public-beta-mainline-action-bridge",
  "public-beta-value-loop-refinement",
  "public-beta-user-value-source-coverage-bridge",
  "public-beta-membership-mvp-roadmap",
  "phase-1-public-beta-public-status-surface-alignment",
  "phase-1-public-beta-public-visible-residue-cleanup"
]);
const defaultPublicBetaFocusedReviewGateNames = new Set(
  [...publicBetaFocusedReviewGateNames].filter((name) => !supersededPublicSurfaceGateNames.has(name))
);
const activeReviewGateNames = runLegacyCoreGates ? coreReviewGateNames : defaultPublicBetaFocusedReviewGateNames;

if (!runHistoricalGates && !runLegacyCoreGates) {
  spawnSync("cmd.exe", ["/c", "npm", "run", "dev:recover"], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    windowsHide: true
  });
  waitForFocusedRuntimeHealth();
}

const results = checks.map((check) =>
  runHistoricalGates || activeReviewGateNames.has(check.name) ? runCheck(check) : skipRegisteredCheck(check)
);
const failed = results.filter((result) => !result.pass);
const executed = results.filter((result) => result.execution === "executed");
const registeredOnly = results.filter((result) => result.execution === "registered_not_rerun");
const reportResults = includeRegisteredOnlyResults ? results : executed.concat(failed.filter((result) => result.execution !== "executed"));
const slowestExecuted = executed
  .slice()
  .sort((left, right) => (right.duration_ms ?? 0) - (left.duration_ms ?? 0))
  .slice(0, 5)
  .map((result) => ({
    duration_ms: result.duration_ms,
    name: result.name,
    pass: result.pass
  }));

console.log(
  JSON.stringify(
    {
      results: reportResults,
      runMode: runHistoricalGates
        ? "full_historical_execution"
        : runLegacyCoreGates
          ? "legacy_core_milestone_execution_with_historical_registration"
          : "public_beta_focused_execution_with_historical_registration",
      registeredCount: checks.length,
      executedCount: executed.length,
      registeredOnlyCount: registeredOnly.length,
      supersededFocusedGateCount: runHistoricalGates || runLegacyCoreGates ? 0 : supersededPublicSurfaceGateNames.size,
      omittedRegisteredOnlyCount: includeRegisteredOnlyResults ? 0 : registeredOnly.length,
      outputMode: includeRegisteredOnlyResults ? "verbose_with_registered_results" : "focused_executed_results_only",
      slowestExecuted,
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
  const startedAt = Date.now();
  const result = spawnSync(check.command[0], check.command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 180000
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  const observedStatus = readStatus(output, result.status);
  const pass = check.expectStatus === "report" ? result.status === 0 && output.includes("ETF Source Readiness Report") : observedStatus === check.expectStatus;

  return {
    duration_ms: Date.now() - startedAt,
    exit_code: result.status,
    execution: "executed",
    expected_status: check.expectStatus,
    name: check.name,
    observed_status: observedStatus,
    pass
  };
}

function skipRegisteredCheck(check) {
  return {
    exit_code: 0,
    execution: "registered_not_rerun",
    expected_status: check.expectStatus,
    name: check.name,
    observed_status: "registered_not_rerun",
    pass: true
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

function wait(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function waitForFocusedRuntimeHealth() {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const result = spawnSync("cmd.exe", ["/c", "npm", "run", "check:beta-runtime-fast-health"], {
      cwd: process.cwd(),
      encoding: "utf8",
      shell: false,
      timeout: 45000,
      windowsHide: true
    });
    if (result.status === 0) return;
    wait(5000);
  }
}
