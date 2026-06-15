import fs from "node:fs";
import path from "node:path";

const replyPath = "tmp/phase-1-final-operator-boolean-reply.json";
const problems = [];
const args = new Set(process.argv.slice(2));
const write = args.has("--write");
const force = args.has("--force");

const template = {
  executeSwitchPresent: false,
  confirmationPhrasePresent: false
};

validateTemplate();

if (write && problems.length === 0) {
  fs.mkdirSync(path.dirname(replyPath), { recursive: true });
  if (fs.existsSync(replyPath) && !force) {
    problems.push(`${replyPath} already exists; use --force to overwrite the safe boolean template`);
  } else {
    fs.writeFileSync(replyPath, `${JSON.stringify(template, null, 2)}\n`, "utf8");
  }
}

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_final_operator_boolean_reply_template_ready"
        : "phase_1_final_operator_boolean_reply_template_blocked",
      mode: write ? "write_template" : "preview_template",
      replyPath,
      wroteFile: write && ok,
      template,
      allowedFields: ["executeSwitchPresent", "confirmationPhrasePresent"],
      forbiddenFieldPolicy: "value_fields_and_payload_fields_are_not_emitted_by_this_generator",
      writeGateExecutableNow: false,
      dataOnlineDecision: "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
      publicDataSource: "mock",
      scoreSource: "mock",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateTemplate() {
  const keys = Object.keys(template);
  const allowed = new Set(["executeSwitchPresent", "confirmationPhrasePresent"]);
  for (const key of keys) {
    if (!allowed.has(key)) problems.push(`template contains forbidden field ${key}`);
    if (typeof template[key] !== "boolean") problems.push(`template.${key} must be boolean`);
  }
}
