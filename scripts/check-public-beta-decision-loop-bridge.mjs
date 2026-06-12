import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const componentPath = "src/components/public-beta-decision-loop-bridge.tsx";
const libPath = "src/lib/public-beta-decision-loop-bridge.ts";
const dashboardPath = "src/components/dashboard-shell.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredPhrases = [
  "30 秒市場氛圍，3 分鐘行動判斷",
  "先看市場氛圍",
  "再看成因與時間",
  "最後看資料邊界",
  "publicDataSource=mock",
  "scoreSource=mock",
  "目前不是即時真實資料",
  "不提供買賣建議"
];

const forbiddenPublicPhrases = [
  "Current hard blockers",
  "Remaining hard blockers",
  "External reply dry-run intake",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
  "cmd.exe /c npm run",
  "readonly-attempt",
  "post-run",
  "preflight",
  "packet",
  "operator",
  "publicDataSource=supabase approved",
  "scoreSource=real approved"
];

const sourceFiles = [
  {
    path: libPath,
    required: [...requiredPhrases, "PublicBetaDecisionLoopContext", "home", "briefing", "stock"]
  },
  {
    path: componentPath,
    required: ["PublicBetaDecisionLoopBridge", "public-beta-decision-loop-bridge", "TrackedLink"]
  },
  {
    path: dashboardPath,
    allowLegacyProcessTerms: true,
    required: [
      'context="home"',
      'context="stock"',
      "PublicBetaDecisionLoopBridge"
    ]
  },
  {
    path: briefingPath,
    required: ['context="briefing"', "PublicBetaDecisionLoopBridge"]
  }
];

const pages = ["/", "/briefing", "/stocks/2330"];

const sourceResults = sourceFiles.map((file) => {
  const source = fs.readFileSync(file.path, "utf8");
  const forbiddenHits = file.allowLegacyProcessTerms ? [] : forbiddenPublicPhrases.filter((phrase) => source.includes(phrase));
  return {
    forbiddenHits,
    markerHits: findMojibakeMarkers(source),
    missing: file.required.filter((phrase) => !source.includes(phrase)),
    pass:
      findMojibakeMarkers(source).length === 0 &&
      file.required.every((phrase) => source.includes(phrase)) &&
      forbiddenHits.length === 0,
    path: file.path
  };
});

const pageResults = await Promise.all(
  pages.map(async (path) => {
    const response = await fetch(`${baseUrl}${path}`);
    const html = await response.text();
    const text = normalizeVisibleText(html);
    const missing = requiredPhrases.filter((phrase) => !text.includes(phrase));
    const forbiddenHits = forbiddenPublicPhrases.filter((phrase) => text.includes(phrase));
    const markerHits = findMojibakeMarkers(text);

    return {
      forbiddenHits,
      markerHits,
      missing,
      pass: response.status === 200 && missing.length === 0 && forbiddenHits.length === 0 && markerHits.length === 0,
      path,
      status: response.status
    };
  })
);

const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const registration = [
  {
    file: packagePath,
    pass: packageJson.includes('"check:public-beta-decision-loop-bridge"')
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("check-public-beta-decision-loop-bridge.mjs") &&
      reviewGate.includes('"public-beta-decision-loop-bridge"')
  }
];

const output = {
  pageResults,
  registration,
  sourceResults,
  status:
    sourceResults.every((item) => item.pass) &&
    pageResults.every((item) => item.pass) &&
    registration.every((item) => item.pass)
      ? "ok"
      : "blocked"
};

console.log(JSON.stringify(output, null, 2));

if (output.status !== "ok") process.exitCode = 1;

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
