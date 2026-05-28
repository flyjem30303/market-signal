import fs from "node:fs";

const path = "data/source-gates/etf-mis-validation-plan.json";
const requiredStatuses = new Set(["open", "in_review", "approved", "blocked"]);
const requiredOwners = new Set(["A", "B", "C", "D", "E", "F"]);
const requiredEndpointIds = new Set(["mis-all-etf", "mis-etf-category-otc"]);

const plan = JSON.parse(fs.readFileSync(path, "utf8"));
const endpoints = plan.candidate_endpoints ?? [];
const checks = plan.checks ?? [];
const invalidEndpoints = endpoints.filter((endpoint) => !requiredEndpointIds.has(endpoint.id) || !endpoint.url || !endpoint.status);
const invalidChecks = checks.filter(
  (check) =>
    !check.id ||
    !requiredOwners.has(check.owner_role) ||
    !requiredStatuses.has(check.status) ||
    !check.required_for ||
    !Array.isArray(check.evidence_required) ||
    check.evidence_required.length === 0
);
const openChecks = checks.filter((check) => check.status !== "approved");
const adapterBlockers = openChecks.filter((check) => check.required_for === "adapter-design").map((check) => check.id);
const ingestionBlockers = openChecks.filter((check) => check.required_for === "ingestion").map((check) => check.id);
const status = invalidEndpoints.length === 0 && invalidChecks.length === 0 && openChecks.length === 0 ? "ok" : "not_ready";

console.log(
  JSON.stringify(
    {
      adapter_blockers: adapterBlockers,
      decision: plan.decision,
      endpoint_count: endpoints.length,
      ingestion_blockers: ingestionBlockers,
      invalid_checks: invalidChecks.map((check) => check.id ?? "(missing-id)"),
      invalid_endpoints: invalidEndpoints.map((endpoint) => endpoint.id ?? "(missing-id)"),
      open_checks: openChecks.map((check) => check.id),
      source_surface: plan.source_surface,
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exitCode = 1;
}
