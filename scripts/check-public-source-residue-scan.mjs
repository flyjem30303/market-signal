import fs from "node:fs";
import path from "node:path";

const roots = [
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/briefing/page.tsx",
  "src/app/weekly/page.tsx",
  "src/app/membership/page.tsx",
  "src/app/methodology/page.tsx",
  "src/app/disclaimer/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/stocks/[symbol]/page.tsx",
  "src/components/commercial-slot.tsx",
  "src/components/dashboard-shell.tsx",
  "src/components/data-freshness-strip.tsx",
  "src/components/page-view-tracker.tsx",
  "src/components/site-nav.tsx",
  "src/components/stock-seo-content.tsx",
  "src/components/tracked-link.tsx",
  "src/lib/assets.ts",
  "src/lib/data-freshness.ts",
  "src/lib/signal-model.ts"
];

const allowedExtensions = new Set([".ts", ".tsx"]);
const forbiddenFragments = [
  "cmd.exe",
  "npm run",
  "pre-launch",
  "hard blocker",
  "REQUEST BLOCKS",
  "EXTERNAL REPLY",
  "workflow proof",
  "dry-run",
  "PUBLIC_BETA",
  "BETA_",
  "candidateArtifactPath",
  "source_row_hash",
  "Runtime Status",
  "Data Readiness",
  "promotion gate",
  "real-data promotion"
];

const files = roots.flatMap((root) => collectFiles(root)).sort();
const fileResults = files.map((file) => {
  const source = fs.readFileSync(file, "utf8");
  const mojibakeHits = findMojibakeMarkers(source);
  const forbiddenHits = forbiddenFragments.filter((fragment) => source.includes(fragment));
  return {
    file,
    forbiddenHits,
    mojibakeHits,
    pass: forbiddenHits.length === 0 && mojibakeHits.length === 0
  };
});

const blocked = fileResults.filter((result) => !result.pass);
const registrationResults = checkRegistration();
const blockedRegistration = registrationResults.filter((result) => !result.pass);
const status = blocked.length === 0 && blockedRegistration.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      checkedFiles: files.length,
      blocked,
      blockedRegistration,
      status
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

function collectFiles(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return allowedExtensions.has(path.extname(target)) ? [target] : [];

  return fs
    .readdirSync(target, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(target, entry.name);
      if (entry.isDirectory()) return collectFiles(fullPath);
      if (!allowedExtensions.has(path.extname(entry.name))) return [];
      return [fullPath];
    });
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-codepoint");
  if (/[\u0080-\u009F]/u.test(text)) markers.push("control-codepoint");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}

function checkRegistration() {
  const packageJson = fs.readFileSync("package.json", "utf8");
  const reviewGate = fs.readFileSync("scripts/check-review-gates.mjs", "utf8");

  return [
    {
      check: "package script registered",
      pass: packageJson.includes('"check:public-source-residue-scan"')
    },
    {
      check: "review gate command registered",
      pass: reviewGate.includes("scripts/check-public-source-residue-scan.mjs")
    },
    {
      check: "focused gate registered",
      pass: reviewGate.includes('"public-source-residue-scan"')
    }
  ];
}
