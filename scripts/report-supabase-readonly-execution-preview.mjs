import { spawnSync } from "node:child_process";

const decision = runDecisionPacket();
const ready = decision.status === "ready_for_ceo_decision" && decision.decision === "proceed_to_ceo_review";

console.log(
  JSON.stringify(
    {
      approvalStatus: ready ? "ready_for_manual_ceo_run" : "hold",
      exactCommandPreview: ready
        ? "$env:SUPABASE_READONLY_VALIDATE_CONFIRMATION='CP3_SUPABASE_READONLY_REMOTE_VALIDATE'; npm run db:readonly-validate"
        : null,
      mode: "supabase_readonly_execution_preview",
      nextRemoteCommand: ready ? decision.nextRemoteCommand : null,
      preflightStatus: decision.preflightStatus,
      requiredConfirmation: "CP3_SUPABASE_READONLY_REMOTE_VALIDATE",
      safety: {
        automatedRemoteRun: false,
        connectionAttempted: false,
        mutations: false,
        rowPayloadsPrinted: false,
        scoreSourceRealEnabled: false,
        secretsPrinted: false,
        sqlExecuted: false
      },
      status: ready ? "ready_for_manual_ceo_run" : "blocked",
      stopConditions: [
        "do not run this preview as approval",
        "do not run if the command differs from npm run db:readonly-validate",
        "do not run if confirmation is not process-scoped",
        "do not run if any write, SQL, ingestion, or scoreSource=real request is bundled"
      ],
      willRunRemoteValidator: false
    },
    null,
    2
  )
);

if (!ready) {
  process.exitCode = 1;
}

function runDecisionPacket() {
  const result = spawnSync(process.execPath, ["scripts/report-supabase-readonly-decision.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  const jsonStart = output.indexOf("{");
  const jsonEnd = output.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd <= jsonStart) {
    throw new Error("Supabase readonly decision packet did not return JSON.");
  }

  return JSON.parse(output.slice(jsonStart, jsonEnd + 1));
}
