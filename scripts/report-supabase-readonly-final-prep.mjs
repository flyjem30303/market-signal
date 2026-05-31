import { spawnSync } from "node:child_process";

const reports = [
  {
    mode: "supabase_readonly_local_preflight",
    script: "scripts/report-supabase-readonly-local-preflight.mjs"
  },
  {
    mode: "supabase_readonly_decision_packet",
    script: "scripts/report-supabase-readonly-decision.mjs"
  },
  {
    mode: "supabase_readonly_execution_preview",
    script: "scripts/report-supabase-readonly-execution-preview.mjs"
  }
];

const outputs = Object.fromEntries(
  reports.map((report) => [report.mode, runLocalReport(report.script)])
);

const preflight = outputs.supabase_readonly_local_preflight;
const decision = outputs.supabase_readonly_decision_packet;
const preview = outputs.supabase_readonly_execution_preview;
const readyForChairmanOralReview =
  preflight.json?.status === "ready_for_guarded_readonly_decision" &&
  decision.json?.status === "ready_for_ceo_decision" &&
  preview.json?.status === "ready_for_manual_ceo_run";

console.log(
  JSON.stringify(
    {
      automatedRemoteRun: false,
      decision: readyForChairmanOralReview ? "ready_for_ceo_oral_review" : "hold",
      exactCommandPreview: preview.json?.exactCommandPreview ?? null,
      filesWritten: false,
      gateName: "Supabase readonly final prep",
      mode: "supabase_readonly_final_prep",
      nextHumanStep: readyForChairmanOralReview
        ? "CEO gives oral summary and asks Chairman to approve exactly one manual read-only attempt"
        : "PM fixes local blockers before CEO asks for a manual read-only attempt",
      postRunReviewTarget: preview.json?.postRunReviewTarget ?? null,
      readiness: {
        decision: decision.json?.status ?? "unavailable",
        executionPreview: preview.json?.status ?? "unavailable",
        preflight: preflight.json?.status ?? "unavailable"
      },
      remoteValidatorExecuted: false,
      requiredConfirmation: preview.json?.requiredConfirmation ?? "CP3_SUPABASE_READONLY_REMOTE_VALIDATE",
      safety: {
        connectionAttempted: false,
        mutations: false,
        rowPayloadsPrinted: false,
        scoreSourceRealEnabled: false,
        secretsPrinted: false,
        sqlExecuted: false
      },
      status: readyForChairmanOralReview ? "ready_for_ceo_oral_review" : "blocked",
      stopConditions: [
        ...(decision.json?.stopConditions ?? []),
        ...(preview.json?.stopConditions ?? [])
      ],
      subreports: outputs,
      willRunRemoteValidator: false
    },
    null,
    2
  )
);

function runLocalReport(script) {
  const result = spawnSync(process.execPath, [script], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  const json = parseJson(output);

  return {
    exitCode: result.status,
    json,
    script,
    status: json?.status ?? "unavailable"
  };
}

function parseJson(output) {
  const jsonStart = output.indexOf("{");
  const jsonEnd = output.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd <= jsonStart) {
    return null;
  }

  return JSON.parse(output.slice(jsonStart, jsonEnd + 1));
}
