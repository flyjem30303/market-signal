const platformLines = [
  "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>",
  "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"
];

const slotIds = [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
];

const templateLines = [
  ...platformLines,
  "",
  ...slotIds.flatMap((id) => [
    `evidenceSlotId: ${id}`,
    "sourceReferenceLabel: <no-secret label>",
    "safeEvidenceSummary: <one to three sentences; no copied contract text, credentials, private links, source extracts, raw market data, row payloads, or stock-id payloads>",
    "remainingRisk: <one to two sentences; smallest blocker or execution risk>",
    ""
  ])
];

const scratchReplyFilePath = "tmp\\\\public-beta-external-reply.txt";
const writerCommand = "cmd.exe /c npm run write:public-beta-external-reply-file-template";
const routeCommand = "cmd.exe /c npm run report:public-beta-external-reply-file-route";
const dryRunCommand = "cmd.exe /c npm run report:public-beta-external-reply-intake-dry-run";
const workflowProofCommand = "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof";

const report = {
  status: "public_beta_external_reply_file_template_ready",
  ok: true,
  mode: "public_beta_external_reply_file_template",
  purpose:
    "Provide the smallest local text-file template PM/A1 can fill before running the no-secret external reply route. This prints placeholders only; it does not read env values, store values, approve evidence, deploy, run SQL, or touch Supabase.",
  copyableTemplate: {
    lineCount: templateLines.length,
    lines: templateLines,
    placeholdersOnly: true,
    valueEchoed: false,
    fileTextEchoed: false
  },
  localFileWorkflow: {
    saveAs: `local scratch file outside Git, for example ${scratchReplyFilePath}`,
    writerCommand,
    defaultOutputPath: scratchReplyFilePath,
    setEnvExample: `$env:PUBLIC_BETA_EXTERNAL_REPLY_PATH='${scratchReplyFilePath}'`,
    routeCommand,
    dryRunCommand,
    completeReplyNextCommand: workflowProofCommand,
    lowerLevelPostReplyCommand: "cmd.exe /c npm run run:public-beta-post-reply-route-once",
    fallbackCommand: "cmd.exe /c npm run report:public-beta-external-input-copy-packet"
  },
  requiredBlocks: [
    {
      id: "beta_platform_two_values",
      owner: "PM or hosting operator",
      requiredLines: platformLines
    },
    {
      id: "a1_twii_four_slot_no_secret_evidence",
      owner: "A1 Data / Supabase / Market Evidence",
      requiredSlotIds: slotIds,
      requiredPerSlot: ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]
    }
  ],
  safety: {
    deploymentAuthorized: false,
    evidenceRecorded: false,
    hostingMutated: false,
    marketDataFetched: false,
    rawPayloadPrinted: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sourceRightsApproved: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    valuesStored: false
  },
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  stopLines: [
    "Fill placeholders only with public hosting values and no-secret A1 summaries.",
    "Do not paste secrets, Supabase keys, Supabase project URL, copied contract text, raw payloads, row payloads, or stock-id payloads.",
    "Keep the reply file local and outside Git.",
    "Run the reply-file route first after filling the local file.",
    "Use response-readiness and the post-reply runner only through the workflow proof unless debugging.",
    "publicDataSource remains mock and scoreSource remains mock."
  ]
};

console.log(JSON.stringify(report, null, 2));
