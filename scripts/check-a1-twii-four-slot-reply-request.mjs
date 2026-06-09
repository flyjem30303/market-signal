import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-a1-twii-four-slot-reply-request.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const requiredSlots = [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
];
const requiredFields = [
  "evidenceSlotId",
  "sourceReferenceLabel",
  "safeEvidenceSummary",
  "remainingRisk"
];

const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(reportRun.stdout ?? "");
const source = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);

expect(reportRun.status === 0, "report should exit 0");
expect(report?.mode === "a1_twii_four_slot_reply_request", "report mode mismatch");
expect(report?.status === "a1_twii_four_slot_reply_request_ready", "report should be ready while TWII slots are pending");
expect(report?.counts?.required === 4, "required count should be 4");
expect(report?.counts?.pending === 4, "pending count should currently be 4");
expect(report?.runtimeBoundary?.publicDataSource === "mock", "publicDataSource must remain mock");
expect(report?.runtimeBoundary?.scoreSource === "mock", "scoreSource must remain mock");
expect(report?.safety?.applyCommandEmitted === false, "applyCommandEmitted must be false");
expect(report?.safety?.evidenceRecorded === false, "evidenceRecorded must be false");
expect(report?.safety?.marketDataFetched === false, "marketDataFetched must be false");
expect(report?.safety?.sqlExecuted === false, "sqlExecuted must be false");
expect(report?.safety?.supabaseReadsEnabled === false, "supabaseReadsEnabled must be false");
expect(report?.safety?.supabaseWritesEnabled === false, "supabaseWritesEnabled must be false");
expect(
  report?.pmClassificationQuickMap?.status === "ready_for_pm_after_a1_no_secret_reply",
  "pmClassificationQuickMap should be ready for PM after A1 no-secret reply"
);
expect(
  report?.pmClassificationQuickMap?.firstGuardCommand === "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
  "pmClassificationQuickMap should start with the A1 response-shape guard"
);
expect(
  report?.pmClassificationQuickMap?.afterAnyDryRunCommand === "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
  "pmClassificationQuickMap should rerun readiness after any dry-run"
);
expect(
  report?.localEvidenceCandidateDraft?.status === "a1_twii_local_evidence_candidate_draft_ready_for_pm_classification",
  "localEvidenceCandidateDraft should be ready for PM classification"
);
expect(
  report?.localEvidenceCandidateDraft?.command === "cmd.exe /c npm run report:a1-twii-local-evidence-candidate-draft",
  "localEvidenceCandidateDraft should expose the local draft report command"
);
expect(report?.localEvidenceCandidateDraft?.candidateSlotCount === 4, "localEvidenceCandidateDraft should contain four slots");
expect(
  report?.localEvidenceCandidateDraft?.rule ===
    "Use the local draft only as a PM classification aid; it does not record evidence, approve source rights, or open TWII execution.",
  "localEvidenceCandidateDraft must keep the classification-aid boundary"
);
expect(
  report?.localEvidenceBoundedRepairRequest?.status === "a1_twii_local_evidence_bounded_repair_request_ready",
  "localEvidenceBoundedRepairRequest should be ready"
);
expect(
  report?.localEvidenceBoundedRepairRequest?.command ===
    "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request",
  "localEvidenceBoundedRepairRequest should expose the bounded repair request command"
);
expect(
  report?.localEvidenceBoundedRepairRequest?.repairRequestCount === 4,
  "localEvidenceBoundedRepairRequest should contain four repair requests"
);
expect(
  report?.localEvidenceBoundedRepairRequest?.rule ===
    "Use the bounded repair request only to ask A1 for the smallest no-secret fixes needed for PM classification.",
  "localEvidenceBoundedRepairRequest must keep the bounded repair boundary"
);
for (const id of requiredSlots) {
  const draft = report?.localEvidenceCandidateDraft?.suggestedPmClassifications?.find((item) => item.evidenceSlotId === id);
  expect(Boolean(draft), `localEvidenceCandidateDraft missing suggested classification for ${id}`);
  expect(
    ["needs_bounded_repair", "blocked"].includes(draft?.suggestedPmClassification),
    `localEvidenceCandidateDraft ${id} should suggest only repair/block`
  );
  expect(draft?.nextGateCandidate !== "twii_source_rights_outcome_gate", `${id} draft must not open outcome gate directly`);
}

for (const id of requiredSlots) {
  const slot = report?.slots?.find((item) => item.id === id);
  expect(Boolean(slot), `missing slot ${id}`);
  expect(report?.requestForA1?.pendingSlotIds?.includes(id), `missing pending request for ${id}`);
  expect(JSON.stringify(report?.requestForA1?.copyableReplyTemplate ?? []).includes(`evidenceSlotId: ${id}`), `template missing ${id}`);
}

for (const field of requiredFields) {
  expect(report?.requestForA1?.requiredFields?.includes(field), `missing required field ${field}`);
}

for (const option of ["accepted", "rejected", "needs_bounded_repair", "blocked"]) {
  expect(
    report?.pmClassificationQuickMap?.classificationOptions?.includes(option),
    `pmClassificationQuickMap missing classification option ${option}`
  );
  expect(Boolean(report?.pmClassificationQuickMap?.rules?.[option]), `pmClassificationQuickMap missing rule ${option}`);
}

for (const boundary of [
  "do_not_emit_apply_command",
  "do_not_record_evidence_from_this_report",
  "do_not_approve_source_rights_from_this_report",
  "do_not_award_row_coverage_from_this_report",
  "do_not_fetch_market_data_from_this_report"
]) {
  expect(
    report?.pmClassificationQuickMap?.stillNotAllowed?.includes(boundary),
    `pmClassificationQuickMap.stillNotAllowed missing ${boundary}`
  );
}

for (const command of [
  "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
  "cmd.exe /c npm run report:a1-twii-local-evidence-candidate-draft",
  "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request",
  "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
  "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
  "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
  "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface",
  "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
]) {
  expect(report?.pmAfterA1Reply?.includes(command), `missing PM after-reply command ${command}`);
}
expect(
  report?.pmAfterA1ReplyFirstCommand === "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
  "report should expose response-readiness as the first PM after-reply command"
);
expect(
  report?.pmAfterA1ReplyOneRunnerCommand === "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
  "report should expose the A1 post-reply one-runner command"
);
const responseReadinessIndex =
  report?.pmAfterA1Reply?.indexOf("cmd.exe /c npm run report:public-beta-external-input-response-readiness") ?? -1;
const oneRunnerIndex =
  report?.pmAfterA1Reply?.indexOf("cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once") ?? -1;
expect(
  responseReadinessIndex >= 0 && oneRunnerIndex > responseReadinessIndex,
  "A1 after-reply route should run response-readiness before the A1 one-runner"
);

for (const phrase of [
  "pmClassificationQuickMap",
  "localEvidenceCandidateDraft",
  "localEvidenceBoundedRepairRequest",
  "a1_twii_local_evidence_candidate_draft_ready_for_pm_classification",
  "a1_twii_local_evidence_bounded_repair_request_ready",
  "Use the local draft only as a PM classification aid",
  "Use the bounded repair request only to ask A1 for the smallest no-secret fixes needed for PM classification.",
  "ready_for_pm_after_a1_no_secret_reply",
  "Use only when the slot answer is complete, no-secret, responsive",
  "Use when one narrow no-secret clarification can repair the slot",
  "do_not_fetch_market_data_from_this_report"
]) {
  expect(source.includes(phrase), `${reportPath} missing source phrase ${phrase}`);
}

expect(
  pkg.scripts?.["report:a1-twii-four-slot-reply-request"] ===
    "node scripts/report-a1-twii-four-slot-reply-request.mjs",
  `${packagePath} missing report:a1-twii-four-slot-reply-request`
);
expect(
  pkg.scripts?.["check:a1-twii-four-slot-reply-request"] ===
    "node scripts/check-a1-twii-four-slot-reply-request.mjs",
  `${packagePath} missing check:a1-twii-four-slot-reply-request`
);
expect(reviewGate.includes("name: \"a1-twii-four-slot-reply-request\""), "review gate missing a1-twii-four-slot-reply-request");
expect(status.includes("Latest A1 TWII four-slot reply request slice"), "PROJECT_STATUS missing latest A1 four-slot status");

for (const text of [source, reportRun.stdout]) {
  for (const pattern of forbiddenPatterns()) {
    expect(!pattern.test(text), `forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "a1_twii_four_slot_reply_request_ready",
      pendingSlots: requiredSlots,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(filePath, "utf8");
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

function expect(pass, message) {
  if (!pass) problems.push(message);
}

function forbiddenPatterns() {
  return [
    /record:a1-exact-source-rights-evidence-outcome[\s\S]*--apply/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\bfetch\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /https:\/\/[a-z0-9-]+\.supabase\.co/iu,
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u
  ];
}
