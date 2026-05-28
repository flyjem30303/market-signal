import fs from "node:fs";

const path = "data/source-gates/etf-source-due-diligence.json";
const requiredStatuses = new Set(["open", "in_review", "approved", "blocked"]);
const requiredOwners = new Set(["A", "B", "C", "D", "E", "F"]);

const plan = JSON.parse(fs.readFileSync(path, "utf8"));
const checks = plan.checks ?? [];
const invalidChecks = checks.filter(
  (check) =>
    !check.id ||
    !requiredOwners.has(check.owner_role) ||
    !requiredStatuses.has(check.status) ||
    !Array.isArray(check.evidence_required) ||
    check.evidence_required.length === 0
);
const openChecks = checks.filter((check) => check.status !== "approved");
const ingestionBlockers = openChecks.filter((check) => check.required_for === "ingestion").map((check) => check.id);
const scoringBlockers = openChecks.filter((check) => check.required_for === "scoring").map((check) => check.id);
const publicReleaseBlockers = openChecks.filter((check) => check.required_for === "public-release").map((check) => check.id);
const status = invalidChecks.length === 0 && openChecks.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      decision: plan.decision,
      invalid_checks: invalidChecks.map((check) => check.id ?? "(missing-id)"),
      ingestion_blockers: ingestionBlockers,
      open_checks: openChecks.map((check) => check.id),
      priority_candidate: plan.priority_candidate,
      public_release_blockers: publicReleaseBlockers,
      scoring_blockers: scoringBlockers,
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exitCode = 1;
}
