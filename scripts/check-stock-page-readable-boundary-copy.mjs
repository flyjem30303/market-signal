import fs from "node:fs";

const pagePath = "src/app/stocks/[symbol]/page.tsx";
const seoPath = "src/components/stock-seo-content.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [pagePath, seoPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [pagePath, "Mock signal"],
  [pagePath, "mock-only runtime"],
  [pagePath, "not real market data"],
  [pagePath, "real score-source evidence"],
  [pagePath, "Mock health score"],
  [pagePath, "Mock pullback risk score"],
  [pagePath, "Data quality state"],
  [seoPath, "Stock Signal Summary"],
  [seoPath, "mock-only runtime view"],
  [seoPath, "not real market-data evidence"],
  [seoPath, "What currently looks strongest"],
  [seoPath, "What currently needs caution"],
  [seoPath, "Latest mock news context"],
  [seoPath, "Backtest context"],
  [seoPath, "Reading boundary"],
  [seoPath, "Public data source remains mock"],
  [seoPath, "score source remains mock"],
  [seoPath, "real score-source mode is blocked"],
  [packagePath, "\"check:stock-page-readable-boundary-copy\": \"node scripts/check-stock-page-readable-boundary-copy.mjs\""],
  [reviewGatePath, "scripts/check-stock-page-readable-boundary-copy.mjs"]
];

const forbidden = [
  [pagePath, "scoreSource=real approved"],
  [pagePath, "publicDataSource=supabase"],
  [pagePath, "createClient"],
  [pagePath, "fetch("],
  [seoPath, "scoreSource=real approved"],
  [seoPath, "publicDataSource=supabase"],
  [seoPath, "investment recommendation approved"],
  [seoPath, "createClient"],
  [seoPath, "fetch("]
];

const mojibakePattern = /[\uFFFD\uF000-\uF8FF]/u;
const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

for (const file of [pagePath, seoPath]) {
  if (mojibakePattern.test(read(file))) {
    blocked.push(`${file}: contains replacement/private-use mojibake characters`);
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
