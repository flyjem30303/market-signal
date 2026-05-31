import { spawnSync } from "node:child_process";

const preflight = runPreflight();
const warningCount = preflight.boundaries?.filter((boundary) => boundary.status === "warning").length ?? 0;
const blocked =
  preflight.status !== "ready_for_guarded_readonly_decision" ||
  preflight.connectionAttempted !== false ||
  preflight.sqlExecuted !== false ||
  preflight.mutations !== false ||
  preflight.secretsPrinted !== false ||
  preflight.rowPayloadsPrinted !== false ||
  preflight.boundaries?.some((boundary) => boundary.status !== "ok");

const decision = blocked ? "hold" : "proceed_to_ceo_review";
const recommendedWorkMix = blocked
  ? { runtime: 80, supabaseReadonly: 20 }
  : { runtime: 60, supabaseReadonly: 40 };

console.log(
  JSON.stringify(
    {
      decision,
      mode: "supabase_readonly_decision_packet",
      nextRemoteCommand: blocked ? null : preflight.nextRemoteCommand,
      preflightStatus: preflight.status,
      recommendedWorkMix,
      requiredHumanStep: blocked ? "PM fixes local blockers before any remote run" : "CEO reviews one guarded read-only run",
      safety: {
        connectionAttempted: false,
        mutations: false,
        publicClaimsChanged: false,
        rowPayloadsPrinted: false,
        scoreSourceRealEnabled: false,
        secretsPrinted: false,
        sqlExecuted: false
      },
      stopConditions: [
        "missing required Supabase env",
        "NEXT_PUBLIC_DATA_SOURCE is not mock",
        "Supabase read switch is enabled without a one-run gate",
        "any request to write Supabase, run SQL, ingest market rows, or set scoreSource=real"
      ],
      status: blocked ? "blocked" : "ready_for_ceo_decision",
      warningCount
    },
    null,
    2
  )
);

if (blocked) {
  process.exitCode = 1;
}

function runPreflight() {
  const result = spawnSync(process.execPath, ["scripts/report-supabase-readonly-local-preflight.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  const jsonStart = output.indexOf("{");
  const jsonEnd = output.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd <= jsonStart) {
    throw new Error("Supabase readonly preflight did not return JSON.");
  }

  return JSON.parse(output.slice(jsonStart, jsonEnd + 1));
}
