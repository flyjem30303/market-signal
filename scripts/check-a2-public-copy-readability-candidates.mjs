import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-a2-public-copy-readability-candidates.mjs";
const checkPath = "scripts/check-a2-public-copy-readability-candidates.mjs";
const forbiddenExecutableReportTokens = [
  "node:child_process",
  "node:http",
  "node:https",
  "node:net",
  "node:tls",
  "process.env",
  "await fetch",
  "globalThis.fetch"
];
const requiredSourceTokens = [
  "src/app",
  "src/components",
  "src/app/disclaimer/page.tsx",
  "src/app/methodology/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/terms/page.tsx",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "supabaseWritesEnabled: false",
  "rawPayloadPrinted: false",
  "mojibakeOrPrivateUse",
  "internalTerms",
  "boundaryInsufficient",
  "firstScreen",
  "urgentFirstScreenCandidates"
];

const missing = [];
const blocked = [];

for (const file of [reportPath, checkPath]) {
  if (!fs.existsSync(file)) {
    missing.push(`${file}: file exists`);
  }
}

const reportSource = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
for (const token of forbiddenExecutableReportTokens) {
  if (reportSource.includes(token)) blocked.push(`${reportPath}: executable/network/env token ${token}`);
}

for (const token of requiredSourceTokens) {
  if (!reportSource.includes(token)) missing.push(`${reportPath}: ${token}`);
}

const result = spawnSync(process.execPath, [reportPath], {
  encoding: "utf8",
  maxBuffer: 1024 * 1024 * 10
});

if (result.status !== 0) {
  blocked.push(`${reportPath}: exited with status ${result.status}`);
}

let report = null;
try {
  report = JSON.parse(result.stdout);
} catch {
  blocked.push(`${reportPath}: stdout is not valid JSON`);
}

if (report) {
  if (report.mode !== "a2_public_copy_readability_candidates") missing.push("report.mode");
  if (report.safety?.publicDataSource !== "mock") blocked.push("report.safety.publicDataSource must remain mock");
  if (report.safety?.scoreSource !== "mock") blocked.push("report.safety.scoreSource must remain mock");
  for (const key of ["connectionAttempted", "ingestionStarted", "rawPayloadPrinted", "secretsPrinted", "sqlExecuted", "supabaseWritesEnabled"]) {
    if (report.safety?.[key] !== false) blocked.push(`report.safety.${key} must be false`);
  }

  for (const section of ["mojibakeOrPrivateUse", "internalTerms", "boundaryInsufficient", "firstScreen"]) {
    if (!Array.isArray(report.candidates?.[section])) missing.push(`report.candidates.${section}`);
  }

  const urgentFirstScreenCandidates = (report.candidates?.firstScreen ?? []).filter(
    (candidate) => candidate.priority === "P0" || candidate.priority === "P1"
  );
  if (report.summary?.urgentFirstScreenCandidates !== urgentFirstScreenCandidates.length) {
    blocked.push("report.summary.urgentFirstScreenCandidates must match P0/P1 first-screen candidate count");
  }
  if (urgentFirstScreenCandidates.length > 0) {
    blocked.push(
      `report.candidates.firstScreen has urgent public-copy candidates: ${urgentFirstScreenCandidates
        .map((candidate) => `${candidate.file}:${candidate.priority}`)
        .join(", ")}`
    );
  }

  if (!Array.isArray(report.worklist) || report.worklist.length === 0) {
    missing.push("report.worklist");
  }

  const scannedRoots = report.scope?.roots ?? [];
  if (!scannedRoots.includes("src/app") || !scannedRoots.includes("src/components")) {
    missing.push("report.scope.roots src/app + src/components");
  }
}

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      reportSummary: report?.summary ?? null,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
