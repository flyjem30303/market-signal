import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const helperPath = "src/lib/a1-evidence-intake-protocol.ts";
const snapshotPath = "scripts/report-project-progress-snapshot.mjs";
const briefPath = "scripts/report-ceo-progress-brief.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const { getA1EvidenceIntakeProtocol } = loadTsModule(helperPath);
const protocol = getA1EvidenceIntakeProtocol();
const files = new Map(
  [helperPath, snapshotPath, briefPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);
const missing = [];
const blocked = [];

for (const [file, phrases] of [
  [
    helperPath,
    [
      "A1EvidenceIntakeProtocol",
      "getA1EvidenceIntakeProtocol",
      "a1_evidence_intake_protocol",
      "Data Evidence Lead",
      "accepted_for_mainline_review",
      "blocked_from_promotion",
      "getPromotionPrerequisitesGate",
      "local_promotion_prerequisites_gate",
      "check-promotion-prerequisites-gate.mjs",
      "check-review-gates.mjs",
      "npm.cmd' run build",
      "npm.cmd' run dev:recover",
      "check-localhost-full-health.mjs",
      "never in parallel with localhost health",
      "publicDataSource=supabase",
      "scoreSource=real",
      "does not run SQL"
    ]
  ],
  [
    snapshotPath,
    [
      "getA1EvidenceIntakeProtocol",
      "a1EvidenceIntake",
      "acceptanceDecision",
      "verificationOrder"
    ]
  ],
  [briefPath, ["A1 intake:", "A1 verification:"]],
  [packagePath, ["\"check:a1-evidence-intake-protocol\": \"node scripts/check-a1-evidence-intake-protocol.mjs\""]],
  [reviewGatePath, ["scripts/check-a1-evidence-intake-protocol.mjs", "a1-evidence-intake-protocol"]]
]) {
  for (const phrase of phrases) {
    if (!read(file).includes(phrase)) missing.push(`${file}: ${phrase}`);
  }
}

if (protocol.mode !== "a1_evidence_intake_protocol") missing.push("protocol mode");
if (protocol.a1Role !== "Data Evidence Lead") missing.push("A1 role");
if (protocol.acceptanceDecision !== "accepted_for_mainline_review") {
  blocked.push(`unexpected acceptanceDecision ${protocol.acceptanceDecision}`);
}
if (protocol.publicDataSource !== "mock" || protocol.scoreSource !== "mock") {
  blocked.push("protocol must keep publicDataSource and scoreSource mock");
}
if (protocol.verificationOrder.length !== 6) {
  missing.push(`expected 6 verification steps, got ${protocol.verificationOrder.length}`);
}
for (const [index, item] of protocol.verificationOrder.entries()) {
  if (item.order !== index + 1) blocked.push(`verification order gap at ${item.id}`);
}
for (const id of [
  "a1-promotion-prerequisites",
  "mainline-intake-protocol",
  "aggregate-review-gate",
  "production-build",
  "dev-recovery-after-build",
  "localhost-health-after-recovery"
]) {
  if (!protocol.verificationOrder.some((item) => item.id === id)) missing.push(`verification step ${id}`);
}
for (const promotion of [
  "publicDataSource=supabase",
  "scoreSource=real",
  "row coverage points",
  "data-quality score lift",
  "readonly attempt execution"
]) {
  if (!protocol.blockedPromotions.includes(promotion)) missing.push(`blocked promotion ${promotion}`);
}

const snapshot = JSON.parse(runNode("scripts/report-project-progress-snapshot.mjs"));
if (snapshot.a1EvidenceIntake?.acceptanceDecision !== "accepted_for_mainline_review") {
  blocked.push("snapshot missing accepted A1 intake decision");
}
if (snapshot.a1EvidenceIntake?.publicDataSource !== "mock" || snapshot.a1EvidenceIntake?.scoreSource !== "mock") {
  blocked.push("snapshot A1 intake safety must stay mock");
}

for (const file of [helperPath]) {
  for (const pattern of [
    /@supabase\/supabase-js/,
    /createClient/,
    /fetch\(/,
    /\.from\(/,
    /\.insert\(/,
    /\.update\(/,
    /\.delete\(/,
    /\.upsert\(/,
    /process\.env/,
    /publicDataSource:\s*"supabase"/,
    /scoreSource:\s*"real"/,
    /canSetScoreSourceReal:\s*true/,
    /canPromotePublicDataSource:\s*true/
  ]) {
    if (pattern.test(read(file))) blocked.push(`${file}: forbidden source pattern ${String(pattern)}`);
  }
}

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}

function runNode(file) {
  const run = Module.createRequire(import.meta.url)("node:child_process").spawnSync(process.execPath, [file], {
    cwd: root,
    encoding: "utf8",
    shell: false
  });
  if (run.status !== 0) throw new Error(`${file} failed: ${run.stderr}`);
  return run.stdout;
}

function loadTsModule(relativePath, cache = new Map()) {
  const absolutePath = path.join(root, relativePath);
  const normalizedPath = path.normalize(relativePath);

  if (cache.has(normalizedPath)) {
    return cache.get(normalizedPath).exports;
  }

  const module = { exports: {} };
  cache.set(normalizedPath, module);
  const sourceText = fs.readFileSync(absolutePath, "utf8");
  const transpiled = ts.transpileModule(sourceText, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    },
    fileName: absolutePath
  }).outputText;
  const execute = new Function("require", "exports", "module", "__filename", "__dirname", transpiled);
  execute(createLocalRequire(relativePath, cache), module.exports, module, absolutePath, path.dirname(absolutePath));
  return module.exports;
}

function createLocalRequire(fromRelativePath, cache) {
  const nativeRequire = Module.createRequire(path.join(root, fromRelativePath));

  return function localRequire(specifier) {
    if (specifier.startsWith("@/")) return loadTsModule(`src/${specifier.slice(2)}.ts`, cache);
    if (specifier.startsWith(".")) {
      const baseDirectory = path.dirname(fromRelativePath);
      return loadTsModule(path.normalize(path.join(baseDirectory, `${specifier}.ts`)), cache);
    }
    return nativeRequire(specifier);
  };
}
