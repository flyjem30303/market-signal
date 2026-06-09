import fs from "node:fs";

const replyPath = process.env.PUBLIC_BETA_EXTERNAL_REPLY_PATH ?? "";
const workflowProofCommand = "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof";
const sourceText = replyPath && fs.existsSync(replyPath) ? fs.readFileSync(replyPath, "utf8") : "";
const hasReplyFile = sourceText.length > 0;

const platform = parsePlatform(sourceText);
const a1 = parseA1(sourceText);
const platformResult = validatePlatform(platform);
const a1Result = validateA1(a1);
const unsafe = findUnsafe(sourceText);

const platformReady = hasReplyFile && platformResult.ok && unsafe.length === 0;
const a1Ready = hasReplyFile && a1Result.ok && unsafe.length === 0;
const status = !hasReplyFile
  ? "blocked_waiting_external_reply_file"
  : unsafe.length > 0
    ? "rejected_unsafe_external_reply_shape"
    : platformReady && a1Ready
      ? "external_reply_shape_ready_for_post_reply_one_runner"
      : platformReady
        ? "platform_reply_shape_ready_a1_reply_pending"
        : a1Ready
          ? "a1_reply_shape_ready_platform_reply_pending"
          : "blocked_external_reply_shape_incomplete";

const report = {
  status,
  ok: status === "external_reply_shape_ready_for_post_reply_one_runner",
  mode: "public_beta_external_reply_intake_dry_run",
  purpose:
    "Dry-run parse a local no-secret PM/A1 reply file and decide whether the public Beta post-reply route can run. This does not store values, print values, record evidence, approve rights, deploy, run SQL, or touch Supabase.",
  input: {
    pathProvided: Boolean(replyPath),
    fileFound: hasReplyFile,
    fileTextEchoed: false,
    valueEchoed: false,
    requiredEnvVar: "PUBLIC_BETA_EXTERNAL_REPLY_PATH"
  },
  platformTwoValues: {
    ok: platformReady,
    provided: {
      hostingProjectName: Boolean(platform.hostingProjectName),
      temporaryBetaUrl: Boolean(platform.temporaryBetaUrl)
    },
    provider: platformResult.provider,
    problemCount: platformResult.problems.length,
    problems: platformResult.problems
  },
  a1TwiiFourSlotEvidence: {
    ok: a1Ready,
    acceptedShapeSlotCount: a1Result.acceptedShapeSlotCount,
    pendingSlotIds: a1Result.pendingSlotIds,
    rejectedSlotIds: a1Result.rejectedSlotIds,
    requiredPerSlot: ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"],
    slotSummariesEchoed: false
  },
  unsafeShape: {
    ok: unsafe.length === 0,
    problemCount: unsafe.length,
    problems: unsafe
  },
  nextExecutableStep: chooseNext({ a1Ready, hasReplyFile, platformReady, unsafe }),
  nextCommands: chooseNextCommands({ a1Ready, hasReplyFile, platformReady, unsafe }),
  safety: safety(),
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  stopLines: [
    "This report does not print or store platform values.",
    "This report does not echo the reply file text.",
    "This report does not record A1 evidence.",
    "This report does not approve source rights.",
    "This report does not deploy or mutate hosting resources.",
    "This report does not execute SQL or connect to Supabase.",
    "This report does not fetch, store, ingest, or commit raw market data.",
    "publicDataSource remains mock and scoreSource remains mock."
  ]
};

console.log(JSON.stringify(report, null, 2));

function parsePlatform(text) {
  return {
    hostingProjectName: matchLine(text, "BETA_HOSTING_PROJECT_NAME"),
    temporaryBetaUrl: matchLine(text, "BETA_TEMPORARY_URL")
  };
}

function parseA1(text) {
  const slots = new Map();
  let current = null;

  for (const rawLine of text.split(/\r?\n/u)) {
    const line = rawLine.trim();
    const slotMatch = /^evidenceSlotId:\s*([a-z0-9-]+)\s*$/iu.exec(line);
    if (slotMatch) {
      current = slotMatch[1];
      if (!slots.has(current)) slots.set(current, {});
      continue;
    }
    if (!current || !line.includes(":")) continue;
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim();
    const value = rest.join(":").trim();
    if (!value) continue;
    const slot = slots.get(current) ?? {};
    if (key === "sourceReferenceLabel") slot.sourceReferenceLabel = value;
    if (key === "safeEvidenceSummary") slot.safeEvidenceSummary = value;
    if (key === "remainingRisk") slot.remainingRisk = value;
    slots.set(current, slot);
  }

  return slots;
}

function matchLine(text, key) {
  const pattern = new RegExp(`^${key}=([^\\r\\n]+)$`, "imu");
  const match = pattern.exec(text);
  return match?.[1]?.trim() ?? "";
}

function validatePlatform(platform) {
  const problems = [];
  if (!platform.hostingProjectName) problems.push("BETA_HOSTING_PROJECT_NAME missing");
  if (!platform.temporaryBetaUrl) problems.push("BETA_TEMPORARY_URL missing");
  if (platform.hostingProjectName) validateProjectName(platform.hostingProjectName, problems);
  if (platform.temporaryBetaUrl) validateTemporaryUrl(platform.temporaryBetaUrl, problems);
  return {
    ok: problems.length === 0,
    problems,
    provider: platform.temporaryBetaUrl ? classifyProvider(platform.temporaryBetaUrl) : "pending"
  };
}

function validateProjectName(value, problems) {
  if (value.length < 3 || value.length > 64) problems.push("hosting project name must be 3-64 characters");
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/u.test(value)) {
    problems.push("hosting project name must use lowercase letters, numbers, and hyphens, and start/end with a letter or number");
  }
  if (/(http|token|secret|key|password|dashboard|invite)/iu.test(value)) {
    problems.push("hosting project name contains unsafe word");
  }
}

function validateTemporaryUrl(value, problems) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    problems.push("temporary Beta URL must be a valid URL");
    return;
  }

  if (parsed.protocol !== "https:") problems.push("temporary Beta URL must use https");
  if (parsed.username || parsed.password) problems.push("temporary Beta URL must not include username or password");
  if (parsed.search) problems.push("temporary Beta URL must not include query string");
  if (parsed.hash) problems.push("temporary Beta URL must not include hash");
  if (!parsed.hostname.includes(".")) problems.push("temporary Beta URL hostname must be public-like and contain a dot");
  if (parsed.pathname !== "/" && parsed.pathname !== "") problems.push("temporary Beta URL path must be empty or /");
  if (/(localhost|127\.0\.0\.1|dashboard|token|secret|key|password|invite|supabase\.co)/iu.test(parsed.hostname)) {
    problems.push("temporary Beta URL hostname contains unsafe or non-public word");
  }
}

function validateA1(slots) {
  const required = [
    "vendor-terms-evidence",
    "internal-feed-owner-evidence",
    "field-contract-evidence",
    "asset-mapping-evidence"
  ];
  const pendingSlotIds = [];
  const rejectedSlotIds = [];

  for (const id of required) {
    const slot = slots.get(id);
    if (!slot) {
      pendingSlotIds.push(id);
      continue;
    }
    const missing = ["sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"].filter(
      (field) => !slot[field] || isPlaceholderValue(slot[field])
    );
    const unsafeFields = Object.values(slot).filter((value) => findUnsafe(String(value)).length > 0);
    if (missing.length > 0) pendingSlotIds.push(id);
    if (unsafeFields.length > 0) rejectedSlotIds.push(id);
  }

  return {
    acceptedShapeSlotCount: required.length - new Set([...pendingSlotIds, ...rejectedSlotIds]).size,
    ok: pendingSlotIds.length === 0 && rejectedSlotIds.length === 0,
    pendingSlotIds,
    rejectedSlotIds
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
  return [...new Set(findings)];
}

function classifyProvider(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return "invalid";
  }
  if (parsed.hostname.endsWith(".vercel.app")) return "vercel";
  if (parsed.hostname.endsWith(".netlify.app")) return "netlify";
  if (parsed.hostname.endsWith(".pages.dev")) return "cloudflare-pages";
  return "other-public-host";
}

function chooseNext({ a1Ready, hasReplyFile, platformReady, unsafe }) {
  if (!hasReplyFile || unsafe.length > 0) {
    return {
      lane: "external_input_copy_packet",
      command: "cmd.exe /c npm run report:public-beta-external-input-copy-packet",
      reason: "A safe local reply file is still missing or rejected; return to the smallest no-secret copy packet."
    };
  }
  if (platformReady && a1Ready) {
    return {
      lane: "external_reply_file_workflow_proof",
      command: workflowProofCommand,
      reason:
        "The local reply file has safe platform shape and all four A1 no-secret slots; run the workflow proof so the reply file can bridge into the post-reply one-runner without storing values."
    };
  }
  return {
    lane: "external_input_copy_packet",
    command: "cmd.exe /c npm run report:public-beta-external-input-copy-packet",
    reason: "At least one external reply block is still incomplete; use the copy packet to repair only missing fields."
  };
}

function chooseNextCommands({ a1Ready, hasReplyFile, platformReady, unsafe }) {
  if (hasReplyFile && unsafe.length === 0 && platformReady && a1Ready) {
    return [
      workflowProofCommand,
      "cmd.exe /c npm run report:beta-mainline-current-route"
    ];
  }
  return [
    "cmd.exe /c npm run report:public-beta-external-input-copy-packet",
    "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
  ];
}

function safety() {
  return {
    deploymentAuthorized: false,
    evidenceRecorded: false,
    hostingMutated: false,
    marketDataFetched: false,
    rawPayloadPrinted: false,
    replyTextEchoed: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sourceRightsApproved: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    valuesStored: false
  };
}
