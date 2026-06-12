import fs from "node:fs";

const modulePath = "src/lib/twse-openapi-runtime-mock-consumer-wire.ts";
const moodPath = "src/lib/twse-openapi-runtime-market-mood.ts";
const componentPath = "src/components/twse-openapi-runtime-mock-consumer-wire-card.tsx";
const parentComponentPath = "src/components/twse-openapi-runtime-mock-wiring-status.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];

const moduleSource = read(modulePath);
const moodSource = read(moodPath);
const componentSource = read(componentPath);
const parentComponentSource = read(parentComponentPath);
const packageJson = JSON.parse(read(packagePath));
const reviewGateSource = read(reviewGatePath);

for (const [filePath, source, phrase] of [
  [modulePath, moduleSource, "getTwseOpenApiRuntimeMockConsumerWireSummary"],
  [modulePath, moduleSource, "parseTwseOpenApiSyntheticRows"],
  [modulePath, moduleSource, "buildTwseOpenApiRuntimeHandoff"],
  [modulePath, moduleSource, "isTwseOpenApiRuntimeHandoffReady"],
  [modulePath, moduleSource, "synthetic_runtime_wire_only"],
  [modulePath, moduleSource, "twse_openapi_runtime_mock_consumer_wire"],
  [modulePath, moduleSource, "publicDataSource: \"mock\""],
  [modulePath, moduleSource, "scoreSource: \"mock\""],
  [modulePath, moduleSource, "rawMarketDataFetch: false"],
  [modulePath, moduleSource, "sqlExecution: false"],
  [modulePath, moduleSource, "supabaseWrite: false"],
  [moodPath, moodSource, "getTwseOpenApiRuntimeMarketMood"],
  [moodPath, moodSource, "市場氛圍"],
  [moodPath, moodSource, "不提供買賣建議"],
  [moodPath, moodSource, "publicDataSource"],
  [moodPath, moodSource, "scoreSource"],
  [componentPath, componentSource, "TwseOpenApiRuntimeMockConsumerWireCard"],
  [componentPath, componentSource, "市場氛圍示範"],
  [componentPath, componentSource, "資料邊界"],
  [componentPath, componentSource, "fetch=false；sql=false；write=false"],
  [parentComponentPath, parentComponentSource, "import { TwseOpenApiRuntimeMockConsumerWireCard }"],
  [parentComponentPath, parentComponentSource, "<TwseOpenApiRuntimeMockConsumerWireCard />"],
  [reviewGatePath, reviewGateSource, "scripts/check-twse-openapi-runtime-mock-consumer-wire.mjs"],
  [reviewGatePath, reviewGateSource, "twse-openapi-runtime-mock-consumer-wire"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  packageJson.scripts?.["check:twse-openapi-runtime-mock-consumer-wire"] !==
  "node scripts/check-twse-openapi-runtime-mock-consumer-wire.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-runtime-mock-consumer-wire script`);
}

for (const [filePath, source] of [
  [modulePath, moduleSource],
  [moodPath, moodSource],
  [componentPath, componentSource],
  [parentComponentPath, parentComponentSource]
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
      guardedStatus: "twse_openapi_runtime_mock_consumer_wire",
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
