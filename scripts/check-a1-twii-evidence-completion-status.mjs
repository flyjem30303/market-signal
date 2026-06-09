import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-a1-twii-evidence-completion-status.mjs";
const outcomePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const beforeOutcomeFile = fs.readFileSync(outcomePath, "utf8");
const reportRun = run(["node", reportPath]);
const report = parseJson(reportRun.stdout);

expect(reportRun.exitCode === 0, "report should exit 0");
expect(report?.status === "blocked_waiting_a1_twii_four_slot_no_secret_evidence", "current A1 TWII status should wait for four no-secret slots");
expect(report?.mode === "a1_twii_evidence_completion_status", "report mode should be stable");
expect(report?.counts?.required === 4, "required count should be 4");
expect(report?.counts?.accepted === 0, "accepted count should currently be 0");
expect(report?.counts?.pending === 4, "pending count should currently be 4");
expect(report?.slotIds?.required?.length === 4, "slotIds.required should expose four TWII slots");
expect(report?.slotIds?.pending?.length === 4, "slotIds.pending should expose four pending TWII slots");
expect(report?.slotIds?.accepted?.length === 0, "slotIds.accepted should be empty while evidence is pending");
expect(report?.runtimeBoundary?.publicDataSource === "mock", "publicDataSource must remain mock");
expect(report?.runtimeBoundary?.scoreSource === "mock", "scoreSource must remain mock");
expect(
  report?.nextAction === "ask_a1_for_only_the_pending_no_secret_slot_summaries",
  "pending route should ask A1 only for no-secret slot summaries"
);

const requiredSlots = [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
];
const expectedCurrentStatuses = {
  "vendor-terms-evidence": "needs_bounded_repair",
  "internal-feed-owner-evidence": "needs_bounded_repair",
  "field-contract-evidence": "needs_bounded_repair",
  "asset-mapping-evidence": "needs_bounded_repair"
};
const requiredFields = [
  "evidenceSlotId",
  "sourceReferenceLabel",
  "safeEvidenceSummary",
  "remainingRisk"
];
const acceptedFixtureRun = runAcceptedFixtureScenario();
const acceptedFixtureReport = parseJson(acceptedFixtureRun.stdout);

for (const id of requiredSlots) {
  const slot = report?.slots?.find((item) => item.id === id);
  expect(Boolean(slot), `missing slot ${id}`);
  expect(slot?.status === expectedCurrentStatuses[id], `${id} should be ${expectedCurrentStatuses[id]}`);
  expect(report?.slotIds?.pending?.includes(id), `slotIds.pending missing ${id}`);
  for (const field of requiredFields) {
    expect(slot?.requiredFields?.includes(field), `${id} missing field ${field}`);
  }
  const queueItem = report?.pmClassificationQueue?.find((item) => item.evidenceSlotId === id);
  expect(Boolean(queueItem), `pmClassificationQueue missing ${id}`);
  expect(queueItem?.currentStatus === expectedCurrentStatuses[id], `${id} queue item should be ${expectedCurrentStatuses[id]}`);
  expect(
    queueItem?.oneRunnerCommandAfterReply === "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
    `${id} queue item should expose the one-runner command after reply`
  );
  expect(
    queueItem?.firstPmCommandAfterReply === "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
    `${id} queue item should run response-readiness first`
  );
  expect(
    queueItem?.secondPmCommandAfterReply === "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
    `${id} queue item should run shape guard after the one-runner`
  );
  expect(
    queueItem?.thirdPmCommandAfterReply === "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
    `${id} queue item should route to PM classification after shape guard`
  );
  for (const option of ["accepted", "rejected", "needs_bounded_repair", "blocked"]) {
    expect(queueItem?.pmClassificationOptions?.includes(option), `${id} queue item missing option ${option}`);
  }
}

expect(
  report?.pmQueueRule ===
    "PM may classify only pending queue slots after response-readiness and the no-secret shape guard pass; prefer the one-runner command after A1 replies; this report never emits apply commands.",
  "pmQueueRule should keep PM classification after response-readiness, shape guard, and no-apply"
);

const expectedPendingCommands = [
  "cmd.exe /c npm run report:a1-twii-four-slot-reply-request"
];
expect(
  JSON.stringify(report?.nextCommands ?? []) === JSON.stringify(expectedPendingCommands),
  "pending A1 completion route should expose only the A1 four-slot reply request before evidence exists"
);
for (const command of [
  "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
  "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
  "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
  "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface",
  "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
]) {
  expect(!report?.nextCommands?.includes(command), `pending nextCommands must not expose post-reply command before evidence exists: ${command}`);
}
expect(acceptedFixtureRun.exitCode === 0, "accepted fixture scenario should exit 0");
expect(
  acceptedFixtureReport?.status === "a1_twii_four_slot_evidence_ready_for_outcome_gate_route",
  "accepted fixture scenario should route to A1 TWII outcome gate candidate"
);
expect(acceptedFixtureReport?.counts?.accepted === 4, "accepted fixture scenario should count four accepted slots");
expect(acceptedFixtureReport?.counts?.pending === 0, "accepted fixture scenario should have zero pending slots");
expect(
  JSON.stringify(acceptedFixtureReport?.nextCommands ?? []) ===
    JSON.stringify([
      "cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route",
      "cmd.exe /c npm run report:a1-source-rights-next-action"
    ]),
  "accepted fixture scenario should expose the outcome-gate route commands only"
);
expect(
  fs.readFileSync(outcomePath, "utf8") === beforeOutcomeFile,
  "accepted fixture scenario must not modify the real A1 outcome ledger"
);

const source = fs.readFileSync(reportPath, "utf8");
for (const phrase of [
  "A1_TWII_EVIDENCE_COMPLETION_OUTCOME_PATH",
  "No A1 evidence is recorded by this report.",
  "No --apply command is emitted by this report.",
  "pmClassificationQueue",
  "pmOneRunnerCommand",
  "pmQueueRule",
  "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
  "No source-rights approval is granted by this report.",
  "No SQL is executed by this report.",
  "No Supabase connection, read, or write is executed by this report.",
  "No raw market data is fetched, stored, ingested, or committed by this report."
]) {
  expect(source.includes(phrase), `source missing stop line: ${phrase}`);
}

for (const output of [reportRun.stdout, source]) {
  for (const pattern of forbiddenPatterns()) {
    expect(!pattern.test(output), `forbidden pattern ${String(pattern)}`);
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
      guardedStatus: "a1_twii_evidence_completion_status_ready",
      requiredSlots,
      accepted: report.counts.accepted,
      pending: report.counts.pending,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function run(command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: process.env,
    timeout: 120000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? ""
  };
}

function runAcceptedFixtureScenario() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "a1-twii-completion-"));
  const fixturePath = path.join(tempDir, "accepted-outcomes.json");
  fs.writeFileSync(
    fixturePath,
    JSON.stringify(
      {
        outcomes: [
          ...requiredSlots.map((id) => ({
            classification: "accepted",
            id,
            lane: "TWII",
            nextGateCandidate: "twii_source_rights_outcome_gate",
            pmQuestionResolved: true,
            recordedAt: "fixture-only",
            recordedBy: "checker_fixture",
            remainingRisk: "Fixture-only accepted state for route validation.",
            safeEvidenceSummary: "Fixture-only no-secret summary.",
            sourceReferenceLabel: "fixture-only-label"
          })),
          {
            classification: "pending",
            id: "etf-legal-use-evidence",
            lane: "ETF",
            nextGateCandidate: "blocked",
            pmQuestionResolved: false,
            recordedAt: null,
            recordedBy: "not_recorded",
            remainingRisk: "Fixture keeps ETF outside this TWII route validation.",
            safeEvidenceSummary: "Fixture ETF placeholder.",
            sourceReferenceLabel: "not_recorded"
          }
        ]
      },
      null,
      2
    )
  );

  const result = spawnSync("node", [reportPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      A1_TWII_EVIDENCE_COMPLETION_OUTCOME_PATH: fixturePath
    },
    timeout: 120000,
    windowsHide: true
  });

  fs.rmSync(tempDir, { force: true, recursive: true });

  return {
    exitCode: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? ""
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

function expect(pass, message) {
  if (!pass) problems.push(message);
}

function forbiddenPatterns() {
  return [
    /record:a1-exact-source-rights-evidence-outcome[\s\S]*--apply/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u,
    /raw market payload/iu
  ];
}
