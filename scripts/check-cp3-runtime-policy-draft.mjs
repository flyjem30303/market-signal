import fs from "node:fs";
import path from "node:path";

const policyPath = "src/lib/cp3-runtime-policy.draft.ts";
const forbiddenRoots = ["src/app", "src/components"];
const requiredPhrases = [
  "export type Cp3RuntimeState",
  "scoreSource: Cp3ScoreSource",
  "modelApprovalState: Cp3ModelApprovalState",
  "sourceRightsState: Cp3ApprovalState",
  "claimApprovalState: Cp3ApprovalState",
  "canDisplayPublicRealScore",
  "state.scoreSource === \"real\"",
  "getPublicDisplayState",
  "return \"mock\""
];

function walkFiles(root) {
  if (!fs.existsSync(root)) return [];
  const out = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(fullPath));
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      out.push(fullPath);
    }
  }
  return out;
}

const policy = fs.existsSync(policyPath) ? fs.readFileSync(policyPath, "utf8") : "";
const missing = requiredPhrases.filter((phrase) => !policy.includes(phrase));
const forbiddenImports = forbiddenRoots
  .flatMap(walkFiles)
  .filter((file) => fs.readFileSync(file, "utf8").includes("cp3-runtime-policy.draft"));

console.log(
  JSON.stringify(
    {
      forbiddenImports,
      missing,
      policy: policyPath,
      status: missing.length === 0 && forbiddenImports.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbiddenImports.length > 0) {
  process.exitCode = 1;
}
