import fs from "node:fs";
import { spawnSync } from "node:child_process";

const generatorPath = "scripts/write-phase-1-final-operator-boolean-reply-template.mjs";
const intakePath = "scripts/check-phase-1-final-operator-boolean-reply-intake.mjs";
const docPath = "docs/PHASE_1_FINAL_OPERATOR_BOOLEAN_REPLY_INTAKE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const generatorSource = readText(generatorPath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const preview = runJson(generatorPath, "template preview", []);
const intake = runJson(intakePath, "reply intake", []);

validateGenerator();
validatePreview();
validateDoc();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_final_operator_boolean_reply_template_ready"
        : "phase_1_final_operator_boolean_reply_template_blocked",
      generatorPath,
      replyPath: preview.replyPath ?? null,
      templateMode: preview.mode ?? null,
      wroteFileDuringCheck: preview.wroteFile ?? null,
      intakeStatus: intake.acceptedOperatorReplyStatus ?? null,
      writeGateExecutableNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateGenerator() {
  for (const token of [
    "executeSwitchPresent",
    "confirmationPhrasePresent",
    "writeGateExecutableNow",
    "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
    "publicDataSource",
    "scoreSource",
    "--write",
    "--force"
  ]) {
    if (!generatorSource.includes(token)) problems.push(`${generatorPath} missing ${token}`);
  }
}

function validatePreview() {
  expect(preview.status, "ok", "preview status");
  expect(preview.guardedStatus, "phase_1_final_operator_boolean_reply_template_ready", "preview guarded status");
  expect(preview.mode, "preview_template", "preview mode");
  expect(preview.wroteFile, false, "preview wroteFile");
  expect(preview.template?.executeSwitchPresent, false, "template executeSwitchPresent");
  expect(preview.template?.confirmationPhrasePresent, false, "template confirmationPhrasePresent");
  expect(preview.writeGateExecutableNow, false, "preview writeGateExecutableNow");
  expect(preview.publicDataSource, "mock", "preview publicDataSource");
  expect(preview.scoreSource, "mock", "preview scoreSource");
  expect(intake.status, "ok", "intake status");
}

function validateDoc() {
  for (const token of [
    "write:phase-1-final-operator-boolean-reply-template",
    "check:phase-1-final-operator-boolean-reply-template",
    "tmp/phase-1-final-operator-boolean-reply.json",
    "executeSwitchPresent",
    "confirmationPhrasePresent",
    "false/false",
    "does not authorize execution"
  ]) {
    if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
  }
}

function validateRegistration() {
  if (
    packageJson.scripts?.["write:phase-1-final-operator-boolean-reply-template"] !==
    "node scripts/write-phase-1-final-operator-boolean-reply-template.mjs --write"
  ) {
    problems.push("package.json missing write:phase-1-final-operator-boolean-reply-template");
  }
  if (
    packageJson.scripts?.["check:phase-1-final-operator-boolean-reply-template"] !==
    "node scripts/check-phase-1-final-operator-boolean-reply-template.mjs"
  ) {
    problems.push("package.json missing check:phase-1-final-operator-boolean-reply-template");
  }
  if (!reviewGate.includes("scripts/check-phase-1-final-operator-boolean-reply-template.mjs")) {
    problems.push("review gate missing final operator boolean reply template checker");
  }
  if (!reviewGate.includes('"phase-1-final-operator-boolean-reply-template"')) {
    problems.push("focused review gate missing final operator boolean reply template checker");
  }
}

function validateBoundaries() {
  const forbiddenPatterns = [
    /sb_secret_/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
    /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
    /https:\/\/[a-z0-9.-]+supabase/iu,
    /executeSwitchValue/u,
    /confirmationPhraseValue/u,
    /operatorDecisionValue/u,
    /credentialValue/u,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /writeGateExecutableNow"\s*:\s*true/u
  ];
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(generatorSource)) problems.push(`${generatorPath} contains forbidden pattern ${pattern}`);
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}

function runJson(filePath, label, args = []) {
  const run = spawnSync(process.execPath, [filePath, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) {
    problems.push(`${label} exited ${run.status}`);
    return {};
  }
  return parseJson(run.stdout, label);
}
