import fs from "node:fs";

const replyPath = process.env.PUBLIC_BETA_EXTERNAL_REPLY_PATH ?? "";
const sourceText = replyPath && fs.existsSync(replyPath) ? fs.readFileSync(replyPath, "utf8") : "";
const hasReplyFile = sourceText.length > 0;
const slots = parseA1(sourceText);
const requiredSlotIds = [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
];
const requiredFields = ["sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"];

const slotPreviews = requiredSlotIds.map((id) => previewSlot(id, slots.get(id)));
const reviewableCount = slotPreviews.filter((slot) => slot.pmPreview === "reviewable_no_secret_shape").length;
const repairCount = slotPreviews.filter((slot) => slot.pmPreview === "needs_bounded_repair").length;
const rejectedCount = slotPreviews.filter((slot) => slot.pmPreview === "rejected_unsafe_shape").length;
const missingCount = slotPreviews.filter((slot) => slot.pmPreview === "missing_slot").length;
const allReviewable = reviewableCount === requiredSlotIds.length;

const status = !hasReplyFile
  ? "blocked_waiting_external_reply_file"
  : rejectedCount > 0
    ? "a1_reply_pm_preview_rejected_unsafe_shape"
    : allReviewable
      ? "a1_reply_pm_preview_ready_for_workflow_proof"
      : "a1_reply_pm_preview_needs_bounded_repair";

const report = {
  status,
  ok: true,
  mode: "public_beta_a1_reply_pm_classification_preview",
  purpose:
    "Preview whether the A1 four-slot section in the local no-secret external reply file is PM-reviewable before workflow proof or outcome-gate work. This does not echo slot text, store evidence, approve source rights, run SQL, touch Supabase, or fetch market data.",
  input: {
    pathProvided: Boolean(replyPath),
    fileFound: hasReplyFile,
    fileTextEchoed: false,
    requiredEnvVar: "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
    slotTextEchoed: false,
    valueEchoed: false
  },
  counts: {
    missing: missingCount,
    needsBoundedRepair: repairCount,
    rejectedUnsafeShape: rejectedCount,
    required: requiredSlotIds.length,
    reviewableNoSecretShape: reviewableCount
  },
  slotPreviews,
  pmClassificationGuidance: {
    ifAllReviewable: "Run the external reply file workflow proof, then open the separate PM outcome-gate route only after proof passes.",
    ifNeedsBoundedRepair: "Ask A1 to repair only the missing fields shown for each slot; do not reopen broad governance.",
    ifRejectedUnsafeShape: "Return to the copy packet and replace unsafe copied text, raw payload references, private links, secrets, or Supabase URLs.",
    classificationOptions: ["accepted", "rejected", "needs_bounded_repair", "blocked"],
    outcomeGateReminder:
      "A reviewable shape is not an accepted source-rights decision; acceptance still requires a separate PM-reviewed outcome gate."
  },
  nextExecutableStep: chooseNext({ allReviewable, hasReplyFile, rejectedCount }),
  nextCommands: chooseNextCommands({ allReviewable, hasReplyFile, rejectedCount }),
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  safety: {
    deploymentAuthorized: false,
    evidenceRecorded: false,
    marketDataFetched: false,
    rawPayloadPrinted: false,
    rowCoverageAwarded: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    slotTextEchoed: false,
    sourceRightsApproved: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    valuesStored: false
  },
  stopLines: [
    "This preview does not echo A1 slot summaries or source labels.",
    "This preview does not record evidence.",
    "This preview does not approve source rights.",
    "This preview does not execute SQL or connect to Supabase.",
    "This preview does not fetch, store, ingest, or commit raw market data.",
    "publicDataSource remains mock and scoreSource remains mock."
  ]
};

console.log(JSON.stringify(report, null, 2));

function parseA1(text) {
  const parsedSlots = new Map();
  let current = null;

  for (const rawLine of text.split(/\r?\n/u)) {
    const line = rawLine.trim();
    const slotMatch = /^evidenceSlotId:\s*([a-z0-9-]+)\s*$/iu.exec(line);
    if (slotMatch) {
      current = slotMatch[1];
      if (!parsedSlots.has(current)) parsedSlots.set(current, {});
      continue;
    }
    if (!current || !line.includes(":")) continue;
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim();
    const value = rest.join(":").trim();
    if (!value) continue;
    const slot = parsedSlots.get(current) ?? {};
    if (key === "sourceReferenceLabel") slot.sourceReferenceLabel = value;
    if (key === "safeEvidenceSummary") slot.safeEvidenceSummary = value;
    if (key === "remainingRisk") slot.remainingRisk = value;
    parsedSlots.set(current, slot);
  }

  return parsedSlots;
}

function previewSlot(id, slot) {
  if (!slot) {
    return {
      evidenceSlotId: id,
      fieldTextEchoed: false,
      missingFields: requiredFields,
      pmPreview: "missing_slot",
      problemLabels: ["slot-missing"],
      suggestedPmClassification: "blocked"
    };
  }

  const missingFields = requiredFields.filter((field) => !slot[field] || isPlaceholderValue(slot[field]));
  const unsafeLabels = [...new Set(Object.values(slot).flatMap((value) => findUnsafe(String(value))))];
  const pmPreview =
    unsafeLabels.length > 0
      ? "rejected_unsafe_shape"
      : missingFields.length > 0
        ? "needs_bounded_repair"
        : "reviewable_no_secret_shape";
  const suggestedPmClassification =
    pmPreview === "reviewable_no_secret_shape"
      ? "accepted"
      : pmPreview === "needs_bounded_repair"
        ? "needs_bounded_repair"
        : "rejected";

  return {
    evidenceSlotId: id,
    fieldTextEchoed: false,
    missingFields,
    pmPreview,
    problemLabels: unsafeLabels,
    suggestedPmClassification
  };
}

function isPlaceholderValue(value) {
  return /^<[^>]+>$/u.test(String(value).trim());
}

function findUnsafe(text) {
  const findings = [];
  const checks = [
    [/NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/iu, "supabase-url-env"],
    [/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/iu, "supabase-anon-key"],
    [/SUPABASE_SERVICE_ROLE_KEY\s*=/iu, "supabase-service-role-key"],
    [/\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu, "supabase-key-looking-token"],
    [/https:\/\/[a-z0-9-]+\.supabase\.co/iu, "supabase-project-url"],
    [/\braw payload\b/iu, "raw-payload"],
    [/\brow payload\b/iu, "row-payload"],
    [/\bstock-id payload\b|\bstock id payload\b/iu, "stock-id-payload"],
    [/\bservice role\b/iu, "service-role-text"],
    [/\bprivate key\b/iu, "private-key-text"],
    [/\bpassword\b/iu, "password-text"]
  ];
  for (const [pattern, label] of checks) {
    if (pattern.test(text)) findings.push(label);
  }
  return findings;
}

function chooseNext({ allReviewable, hasReplyFile, rejectedCount }) {
  if (!hasReplyFile || rejectedCount > 0) {
    return {
      command: "cmd.exe /c npm run report:public-beta-external-input-copy-packet",
      lane: "external_input_copy_packet",
      reason: "A safe A1 reply file is missing or unsafe; return to the smallest no-secret copy packet."
    };
  }
  if (allReviewable) {
    return {
      command: "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof",
      lane: "external_reply_file_workflow_proof",
      reason: "All four A1 slots have reviewable no-secret shape; prove the full reply-file bridge before any outcome-gate work."
    };
  }
  return {
    command: "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
    lane: "a1_bounded_repair",
    reason: "At least one slot is missing a required no-secret field; request only bounded repairs."
  };
}

function chooseNextCommands({ allReviewable, hasReplyFile, rejectedCount }) {
  if (!hasReplyFile || rejectedCount > 0) {
    return ["cmd.exe /c npm run report:public-beta-external-input-copy-packet"];
  }
  if (allReviewable) {
    return [
      "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof",
      "cmd.exe /c npm run report:a1-twii-pm-intake-decision-summary"
    ];
  }
  return [
    "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
    "cmd.exe /c npm run report:public-beta-external-reply-file-template"
  ];
}
