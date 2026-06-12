import fs from "node:fs";

const problems = [];
const libPath = "src/lib/twse-openapi-runtime-mock-wiring-readiness.ts";
const componentPath = "src/components/twse-openapi-runtime-mock-wiring-status.tsx";
const homePath = "src/components/home-runtime-status-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const rolePath = "docs/ROLE_WORKSTREAMS.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const lib = read(libPath);
const component = read(componentPath);
const home = read(homePath);
const css = read(cssPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const roles = read(rolePath);
const reviewGate = read(reviewGatePath);

for (const [filePath, source, phrase] of [
  [libPath, lib, "TwseOpenApiRuntimeMockWiringReadiness"],
  [libPath, lib, "twse_openapi_runtime_mock_consumer_wiring_readiness"],
  [libPath, lib, "TWSE OpenAPI 管線已進入 runtime mock 接線準備"],
  [libPath, lib, "publicDataSource: \"mock\""],
  [libPath, lib, "scoreSource: \"mock\""],
  [libPath, lib, "rawMarketDataFetch: false"],
  [libPath, lib, "sqlExecution: false"],
  [libPath, lib, "supabaseWrite: false"],
  [libPath, lib, "real promotion"],
  [libPath, lib, "資料線獨立補齊"],
  [componentPath, component, "TwseOpenApiRuntimeMockWiringStatus"],
  [componentPath, component, "TWSE OpenAPI runtime mock wiring status"],
  [componentPath, component, "Current boundary"],
  [componentPath, component, "Next mainline route"],
  [componentPath, component, "rawMarketDataFetch=false, sqlExecution=false, supabaseWrite=false"],
  [homePath, home, "import { TwseOpenApiRuntimeMockWiringStatus }"],
  [homePath, home, "<TwseOpenApiRuntimeMockWiringStatus />"],
  [cssPath, css, ".twse-openapi-runtime-mock-wiring-status"],
  [cssPath, css, ".twse-openapi-runtime-mock-wiring-steps"],
  [statusPath, status, "Latest TWSE OpenAPI runtime mock wiring readiness slice"],
  [rolePath, roles, "twse_openapi_runtime_mock_consumer_wiring_readiness"],
  [reviewGatePath, reviewGate, "scripts/check-twse-openapi-runtime-mock-wiring-readiness.mjs"],
  [reviewGatePath, reviewGate, "name: \"twse-openapi-runtime-mock-wiring-readiness\""]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["check:twse-openapi-runtime-mock-wiring-readiness"] !==
  "node scripts/check-twse-openapi-runtime-mock-wiring-readiness.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-runtime-mock-wiring-readiness script`);
}

for (const [filePath, source] of [
  [libPath, lib],
  [componentPath, component],
  [homePath, home]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
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
      guardedStatus: "twse_openapi_runtime_mock_consumer_wiring_readiness",
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }

  return fs.readFileSync(filePath, "utf8");
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
