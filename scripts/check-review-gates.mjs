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
    command: [node, "scripts/check-briefing-boundary-disclosure.mjs"],
    expectStatus: "ok",
    name: "briefing-boundary-disclosure"
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
    command: [node, "scripts/check-stock-decision-compass.mjs"],
    expectStatus: "ok",
    name: "stock-decision-compass"
  },
  {
    command: [node, "scripts/check-tracking-events.mjs"],
    expectStatus: "ok",
    name: "tracking-events"
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
