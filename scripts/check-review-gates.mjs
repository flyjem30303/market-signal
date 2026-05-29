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
