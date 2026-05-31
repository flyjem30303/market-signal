import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reviewGatePath = "scripts/check-review-gates.mjs";
const packagePath = "package.json";
const remoteValidators = [
  {
    confirmationName: "SUPABASE_READONLY_VALIDATE_CONFIRMATION",
    confirmationValue: "CP3_SUPABASE_READONLY_REMOTE_VALIDATE",
    file: "scripts/validate-supabase-readonly.mjs",
    localWriteAllowed: false,
    requiredMode: "read_only_remote_validation"
  },
  {
    confirmationName: "SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION",
    confirmationValue: "CP3_SUPABASE_SCHEMA_SHAPE_READONLY_REMOTE_VALIDATE",
    file: "scripts/validate-supabase-schema-shape-readonly.mjs",
    localWriteAllowed: false,
    requiredMode: "schema_shape_readonly_remote_validation"
  },
  {
    confirmationName: "TWSE_STOCK_DAY_STAGING_READONLY_CONFIRMATION",
    confirmationValue: "TWSE_STOCK_DAY_STAGING_READONLY",
    file: "scripts/validate-supabase-twse-stock-day-staging-readonly.mjs",
    localWriteAllowed: true,
    requiredMode: "read-only validation"
  }
];

const findings = [];
const reviewGate = read(reviewGatePath);
const packageJson = JSON.parse(read(packagePath));

for (const validator of remoteValidators) {
  const source = read(validator.file);
  const normalized = source.toLowerCase();
  const confirmationIndex = source.indexOf(validator.confirmationValue);
  const missingEnvReason =
    source.includes("missing_supabase_environment") ? "missing_supabase_environment" : "missing_required_environment";
  const missingEnvIndex = source.indexOf(missingEnvReason);
  const supabaseImportIndex = source.indexOf('await import("@supabase/supabase-js")');
  const createClientIndex = source.indexOf("createClient(");

  requireToken(validator.file, source, validator.confirmationName);
  requireToken(validator.file, source, validator.confirmationValue);
  requireToken(validator.file, source, missingEnvReason);
  requireToken(validator.file, source, validator.requiredMode);
  requireToken(validator.file, source, "persistSession: false");
  requireToken(validator.file, source, "head: true");

  if (!(confirmationIndex >= 0 && missingEnvIndex >= 0 && supabaseImportIndex > confirmationIndex && supabaseImportIndex > missingEnvIndex)) {
    findings.push({
      file: validator.file,
      issue: "Supabase SDK must load only after explicit confirmation and environment guards"
    });
  }

  if (!(supabaseImportIndex >= 0 && createClientIndex > supabaseImportIndex)) {
    findings.push({
      file: validator.file,
      issue: "createClient must occur after lazy Supabase SDK import"
    });
  }

  for (const forbidden of [".insert(", ".upsert(", ".update(", ".delete(", ".rpc(", "insert into", "delete from", "truncate", "drop table", "alter table"]) {
    if (normalized.includes(forbidden)) {
      findings.push({ file: validator.file, issue: `forbidden mutation token: ${forbidden}` });
    }
  }

  const writesLocalFile = normalized.includes("writefilesync") || normalized.includes("appendfilesync");
  if (writesLocalFile && !validator.localWriteAllowed) {
    findings.push({ file: validator.file, issue: "generic remote validator must not write local output files" });
  }

  if (writesLocalFile && validator.localWriteAllowed && !source.includes("CP3_TWSE_STOCK_DAY_STAGING_READ_ONLY_VALIDATION_DRAFT_OUTPUT.md")) {
    findings.push({ file: validator.file, issue: "local output write must be limited to the reviewed draft output report" });
  }

  for (const secretPattern of [/console\.\w+\([^)]*process\.env/s, /JSON\.stringify\([^)]*process\.env/s, /process\.env\[[^\]]+\]\.slice/s, /process\.env\[[^\]]+\]\.length/s]) {
    if (secretPattern.test(source)) {
      findings.push({ file: validator.file, issue: `possible secret output: ${secretPattern}` });
    }
  }

  if (reviewGate.includes(validator.file)) {
    findings.push({
      file: reviewGatePath,
      issue: `review gate must not execute remote validator directly: ${validator.file}`
    });
  }
}

const scripts = packageJson.scripts ?? {};
for (const [name, command] of Object.entries(scripts)) {
  if (!String(command).includes("validate-supabase")) continue;

  if (!name.startsWith("db:")) {
    findings.push({
      file: packagePath,
      issue: `remote validator npm script must be db-scoped, got ${name}`
    });
  }
}

console.log(
  JSON.stringify(
    {
      findings,
      remoteValidators: remoteValidators.map((validator) => validator.file),
      status: findings.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (findings.length > 0) {
  process.exit(1);
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function requireToken(file, source, token) {
  if (!source.includes(token)) {
    findings.push({ file, issue: `missing required token: ${token}` });
  }
}
