import fs from "node:fs";

const roadmapPath = "docs/INVESTOR_INDICATOR_ROADMAP.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [roadmapPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [roadmapPath, "The site should become an investor decision-support product"],
  [roadmapPath, "must not be fully implemented before the runtime, data, and source-depth foundation is ready"],
  [roadmapPath, "product-direction guard, not a runtime implementation approval"],
  [roadmapPath, "C's professional investment-advisor assessment"],
  [roadmapPath, "market condition, stock health, risk, change, and what to watch next"],
  [roadmapPath, "Health score and risk score are attractive only when users can see why the light changed"],
  [roadmapPath, "Market temperature"],
  [roadmapPath, "Stock health"],
  [roadmapPath, "Risk signal"],
  [roadmapPath, "Change detection"],
  [roadmapPath, "Watch-next guidance"],
  [roadmapPath, "Confidence level"],
  [roadmapPath, "Keep `publicDataSource=mock`"],
  [roadmapPath, "Keep `scoreSource=mock`"],
  [roadmapPath, "Do not set `scoreSource=real`"],
  [roadmapPath, "Do not present real market-data claims"],
  [roadmapPath, "Do not implement real investor signals, real advice, or real trading recommendations"],
  [roadmapPath, "This roadmap must not slow the project with a new long governance track"],
  [roadmapPath, "Runtime/data foundation: 70%"],
  [roadmapPath, "Product readability and indicator wording alignment: 20%"],
  [roadmapPath, "Future indicator design notes: 10%"],
  [packagePath, "\"check:investor-indicator-roadmap\": \"node scripts/check-investor-indicator-roadmap.mjs\""],
  [reviewGatePath, "scripts/check-investor-indicator-roadmap.mjs"]
];

const forbidden = [
  [roadmapPath, "scoreSource=real approved"],
  [roadmapPath, "publicDataSource=supabase approved"],
  [roadmapPath, "buy recommendation"],
  [roadmapPath, "sell recommendation"],
  [roadmapPath, "run SQL approved"],
  [roadmapPath, "write Supabase approved"],
  [roadmapPath, "may run SQL"],
  [roadmapPath, "may write Supabase"],
  [roadmapPath, "full indicator implementation now"],
  [roadmapPath, "real investor signals approved"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

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
