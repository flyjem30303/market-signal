import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const pages = [
  {
    path: "/",
    required: ["Runtime", "mock", "Freshness metadata only explains data recency", "scoreSource", "Indicator Roadmap"]
  },
  {
    path: "/stocks/2330",
    required: ["Runtime", "mock", "Freshness metadata only explains data recency", "scoreSource", "Indicator Roadmap"]
  },
  {
    path: "/briefing",
    required: ["PM project progress", "Runtime", "mock", "Freshness metadata only explains data recency", "scoreSource"]
  },
  {
    path: "/weekly",
    required: ["Runtime", "mock", "Freshness metadata only explains data recency", "scoreSource"]
  },
  {
    path: "/methodology",
    required: ["Runtime", "mock", "Freshness metadata only explains data recency", "scoreSource"]
  }
];

const mojibakeFragments = ["�", "銝", "嚗", "蝣", "摰", "璅", "鞈", "撣", "憸", "隞", "砍", "靘", "甇", "蝬", "脣", "蝺"];
const forbiddenText = ["Internal Server Error", "ERR_CONNECTION_REFUSED", "scoreSource=real approved"];

const results = [];

for (const page of pages) {
  const url = `${baseUrl}${page.path}`;
  const response = await fetch(url);
  const html = await response.text();
  const text = normalizeVisibleText(html);
  const markerHits = mojibakeFragments.filter((fragment) => text.includes(fragment));
  const forbiddenHits = forbiddenText.filter((fragment) => text.includes(fragment));
  const missing = page.required.filter((phrase) => !text.includes(phrase));

  results.push({
    forbiddenHits,
    markerHits,
    missing,
    pass: response.status === 200 && markerHits.length === 0 && forbiddenHits.length === 0 && missing.length === 0,
    path: page.path,
    status: response.status
  });
}

const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const registration = [
  {
    file: packagePath,
    pass: packageJson.includes('"check:public-visible-language-quality": "node scripts/check-public-visible-language-quality.mjs"')
  },
  {
    file: reviewGatePath,
    pass: reviewGate.includes("scripts/check-public-visible-language-quality.mjs")
  }
];

const failed = results.filter((result) => !result.pass);
const registrationFailed = registration.filter((result) => !result.pass);

console.log(
  JSON.stringify(
    {
      registration,
      results,
      status: failed.length === 0 && registrationFailed.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (failed.length > 0 || registrationFailed.length > 0) {
  process.exitCode = 1;
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}
