import fs from "node:fs";
import path from "node:path";

const tokenPath = "src/lib/cp3-ui-copy-tokens.draft.ts";
const forbiddenRoots = ["src/app", "src/components"];
const requiredPhrases = [
  "export type Cp3UiCopyState",
  "export const cp3UiCopyTokensDraft",
  "mock",
  "internal_review",
  "partial",
  "stale",
  "unavailable",
  "approved",
  "not investment advice",
  "Do not describe as real, validated, or source-backed.",
  "Do not use in public copy or launch claims.",
  "Do not claim daily updated real model output.",
  "Public wording still must match the approved claim packet."
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

const tokens = fs.existsSync(tokenPath) ? fs.readFileSync(tokenPath, "utf8") : "";
const missing = requiredPhrases.filter((phrase) => !tokens.includes(phrase));
const forbiddenImports = forbiddenRoots
  .flatMap(walkFiles)
  .filter((file) => fs.readFileSync(file, "utf8").includes("cp3-ui-copy-tokens.draft"));

console.log(
  JSON.stringify(
    {
      forbiddenImports,
      missing,
      tokens: tokenPath,
      status: missing.length === 0 && forbiddenImports.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbiddenImports.length > 0) {
  process.exitCode = 1;
}

