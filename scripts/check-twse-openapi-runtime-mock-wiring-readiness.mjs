import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const sourcePaths = [
  "src/lib/twse-openapi-runtime-mock-wiring-readiness.ts",
  "src/lib/twse-openapi-runtime-mock-consumer-wire.ts",
  "src/lib/twse-openapi-runtime-market-mood.ts",
  "src/components/dashboard-shell.tsx"
];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:twse-openapi-runtime-mock-wiring-readiness"] ===
      "node scripts/check-twse-openapi-runtime-mock-wiring-readiness.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-twse-openapi-runtime-mock-wiring-readiness.mjs") &&
      reviewGate.includes('"twse-openapi-runtime-mock-wiring-readiness"')
  }
];

const sourceResults = sourcePaths.map(checkSource);
const status = registration.every((item) => item.pass) && sourceResults.every((item) => item.pass) ? "ok" : "blocked";

console.log(JSON.stringify({ registration, sourceResults, status }, null, 2));

if (status !== "ok") process.exitCode = 1;

function checkSource(path) {
  const source = fs.existsSync(path) ? fs.readFileSync(path, "utf8") : "";
  const missing = source.length === 0 ? ["file exists"] : [];
  const forbiddenHits = forbiddenPatterns().filter((pattern) => pattern.test(source)).map(String);
  const markerHits = findHardMojibakeMarkers(source);
  return {
    forbiddenHits,
    markerHits,
    missing,
    pass: missing.length === 0 && forbiddenHits.length === 0 && markerHits.length === 0,
    path
  };
}

function forbiddenPatterns() {
  return [
    /\bfetch\s*\(/u,
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /SUPABASE_SERVICE_ROLE_KEY/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource:\s*"supabase"/u,
    /scoreSource:\s*"real"/u,
    /rawMarketDataFetch:\s*true/u,
    /sqlExecution:\s*true/u,
    /supabaseWrite:\s*true/u
  ];
}

function findHardMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
