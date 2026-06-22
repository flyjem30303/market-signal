import fs from "node:fs";
import path from "node:path";

const WORKFLOW_PATH = path.join(".github", "workflows", "daily-after-close-update.yml");

const workflowText = fs.readFileSync(WORKFLOW_PATH, "utf8").replace(/\r\n/g, "\n");

const requiredSnippets = [
  {
    id: "manual_dispatch_has_write_enabled_input",
    snippet: "write_enabled:",
    reason: "Manual workflow runs must expose the no-write/write selector."
  },
  {
    id: "manual_dispatch_defaults_to_no_write",
    snippet: 'default: "false"',
    reason: "Manual observation runs must default to no-write."
  },
  {
    id: "main_push_does_not_trigger_daily_workflow",
    snippet: "push:",
    reason: "Daily market-data workflow must not run on main pushes; code integration should not trigger freshness gates.",
    forbidden: true
  },
  {
    id: "scheduled_runs_keep_write_path",
    snippet: '[ "${{ github.event_name }}" = "schedule" ]',
    reason: "Scheduled weekday after-close runs must continue to write daily prices and scores."
  },
  {
    id: "manual_write_requires_explicit_true",
    snippet: '[ "${{ github.event_name }}" = "workflow_dispatch" ] && [ "${{ inputs.write_enabled }}" = "true" ]',
    reason: "Manual workflow_dispatch must write only when explicitly enabled."
  },
  {
    id: "write_command_still_present",
    snippet: "node scripts/run-daily-after-close-update.mjs --write",
    reason: "Scheduled weekday after-close runs must continue to write daily prices and scores."
  },
  {
    id: "no_write_observation_branch",
    snippet: "else\n            node scripts/run-daily-after-close-update.mjs",
    reason: "Main push and default manual observation runs must execute the no-write update path."
  },
  {
    id: "supabase_freshness_gate",
    snippet: "node scripts/check-supabase-freshness.mjs",
    reason: "Daily workflow must verify Supabase freshness after update."
  },
  {
    id: "core_symbol_freshness_gate",
    snippet: "node scripts/check-phase-1-1-core-symbol-freshness.mjs",
    reason: "Daily workflow must verify TWII, 2330, 0050, and 006208 freshness."
  },
  {
    id: "listed_equity_adjusted_coverage_gate",
    snippet: "node scripts/check-phase-1-1-listed-equity-coverage-rollup.mjs",
    reason: "Daily workflow must verify adjusted listed-equity coverage."
  },
  {
    id: "metadata_maintenance_candidate_report",
    snippet: "node scripts/check-phase-1-1-listed-equity-metadata-maintenance-candidates.mjs",
    reason: "Daily workflow must report no-write active-listing maintenance candidates."
  }
];

const failures = requiredSnippets
  .filter((requirement) =>
    requirement.forbidden ? workflowText.includes(requirement.snippet) : !workflowText.includes(requirement.snippet)
  )
  .map(({ id, reason, snippet, forbidden }) => ({ id, reason, snippet, forbidden: Boolean(forbidden) }));

const result = {
  checkedFile: WORKFLOW_PATH,
  failures,
  requiredCount: requiredSnippets.length,
  status: failures.length === 0 ? "ok" : "action_required"
};

console.log(JSON.stringify(result, null, 2));

if (failures.length > 0) {
  process.exitCode = 1;
}
