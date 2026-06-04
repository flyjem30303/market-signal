import fs from "node:fs";

const contractPath = "src/lib/investor-indicator-roadmap.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [contractPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [contractPath, "InvestorIndicatorRoadmap"],
  [contractPath, "InvestorIndicatorFamily"],
  [contractPath, "InvestorIndicatorStatus"],
  [contractPath, "mock-readable"],
  [contractPath, "design-only"],
  [contractPath, "blocked-until-real-data"],
  [contractPath, "Market temperature"],
  [contractPath, "Stock health"],
  [contractPath, "Risk signal"],
  [contractPath, "Change detection"],
  [contractPath, "Watch-next guidance"],
  [contractPath, "Confidence level"],
  [contractPath, "publicDataSource: \"mock\""],
  [contractPath, "scoreSource: \"mock\""],
  [contractPath, "Investor indicators are a mock roadmap only"],
  [contractPath, "cannot be treated as real market data"],
  [contractPath, "real scoring"],
  [contractPath, "Watch-next guidance can describe what to observe next"],
  [contractPath, "Confidence level is design-only"],
  [contractPath, "runtimeDataFoundation: 70"],
  [contractPath, "productReadabilityAndWording: 20"],
  [contractPath, "futureIndicatorDesignNotes: 10"],
  [contractPath, "getInvestorIndicatorRoadmap"],
  [packagePath, "\"check:investor-indicator-roadmap-contract\""],
  [reviewGatePath, "check-investor-indicator-roadmap-contract.mjs"]
];

const forbidden = [
  [contractPath, "@supabase/supabase-js"],
  [contractPath, "createClient"],
  [contractPath, "fetch("],
  [contractPath, ".from(\""],
  [contractPath, ".from('"],
  [contractPath, "process.env"],
  [contractPath, "scoreSource: \"real\""],
  [contractPath, "publicDataSource: \"supabase\""],
  [contractPath, "buy recommendation"],
  [contractPath, "sell recommendation"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const mojibakePattern = /[\uE000-\uF8FF\uFFFD]|[嚗餅銝蝡舫摰祇雿輻閮踹]{2,}|\?{2,}/u;

if (mojibakePattern.test(read(contractPath))) {
  blocked.push(`${contractPath}: mojibake-like text`);
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
