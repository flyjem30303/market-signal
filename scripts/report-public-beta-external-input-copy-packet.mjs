import { spawnSync } from "node:child_process";

const source = runJson(["cmd.exe", "/c", "npm", "run", "report:public-beta-external-input-request"]);
const sourceReport = source.json ?? {};
const packet = sourceReport.pmOneScreenReplyPacket ?? {};
const replyFileRouteCommand = "cmd.exe /c npm run report:public-beta-external-reply-file-route";
const responseReadinessCommand = "cmd.exe /c npm run report:public-beta-external-input-response-readiness";
const postReplyOneRunnerCommand = "cmd.exe /c npm run run:public-beta-post-reply-route-once";

const report = {
  status: "public_beta_external_input_copy_packet_ready",
  ok: true,
  mode: "copyable_no_secret_external_input_packet",
  purpose:
    "Output only the smallest no-secret PM/A1 reply packet needed to unblock the public Beta post-reply route.",
  sourceCommand: "cmd.exe /c npm run report:public-beta-external-input-request",
  replyPacket: {
    title: "PM one-screen reply packet",
    platformBlock: packet.platformBlock ?? {
      title: "Block 1 - Beta platform two values",
      owner: "PM or hosting operator",
      lines: [
        "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>",
        "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"
      ],
      afterReply: [
        replyFileRouteCommand,
        responseReadinessCommand,
        postReplyOneRunnerCommand
      ]
    },
    a1Block: packet.a1Block ?? {
      title: "Block 2 - A1 TWII four-slot no-secret evidence",
      owner: "A1 Data / Supabase / Market Evidence",
      pendingSlotIds: [
        "vendor-terms-evidence",
        "internal-feed-owner-evidence",
        "field-contract-evidence",
        "asset-mapping-evidence"
      ],
      requiredPerSlot: ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"],
      lines: [],
      afterReply: [
        replyFileRouteCommand,
        responseReadinessCommand,
        "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once"
      ],
      failFastRule:
        "If any A1 TWII slot is still missing, the one-runner stops after response-readiness and returns to report:a1-twii-four-slot-reply-request."
    },
    completeWhen: Array.isArray(packet.completeWhen)
      ? packet.completeWhen
      : [
        "both beta platform lines are filled with safe non-secret values",
        "all four A1 TWII slot summaries are provided in no-secret shape",
        "response-readiness passes before the post-reply runner"
      ]
  },
  nextCommands: [
    replyFileRouteCommand,
    responseReadinessCommand,
    postReplyOneRunnerCommand,
    "cmd.exe /c npm run report:beta-mainline-current-route"
  ],
  replyRouteContract: {
    firstCommandAfterReplyFile: replyFileRouteCommand,
    fallbackResponseReadinessCommand: responseReadinessCommand,
    proofRunnerAfterCompleteSafeReply: "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof",
    lowerLevelPostReplyOneRunner: postReplyOneRunnerCommand,
    rule:
      "PM uses the reply-file route first; response-readiness and the post-reply one-runner stay available as lower-level proof steps."
  },
  stopLines: [
    "No platform values are read from env or printed by this report.",
    "No values are stored by this report.",
    "No A1 evidence is recorded by this report.",
    "No source-rights approval is granted by this report.",
    "No deployment is authorized by this report.",
    "No hosting resource is created or mutated by this report.",
    "No SQL is executed by this report.",
    "No Supabase connection, read, or write is executed by this report.",
    "No raw market data is fetched, stored, ingested, or committed by this report.",
    "publicDataSource remains mock and scoreSource remains mock."
  ],
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  safety: {
    deploymentAuthorized: false,
    evidenceRecorded: false,
    hostingMutated: false,
    marketDataFetched: false,
    rawPayloadPrinted: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    valuesStored: false
  },
  sourceReports: {
    publicBetaExternalInputRequest: commandStatus(source)
  }
};

console.log(JSON.stringify(report, null, 2));

function runJson(command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, BETA_PLATFORM_VALUES_SKIP_DOTENV: "1" },
    timeout: 420000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    json: parseJson(result.stdout ?? ""),
    stderr: (result.stderr ?? "").trim()
  };
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return null;
  }
}

function commandStatus(run) {
  return {
    exitCode: run.exitCode,
    parsedJson: Boolean(run.json),
    stderrPrinted: run.stderr.length > 0
  };
}
