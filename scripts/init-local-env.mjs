import fs from "node:fs";

const sourcePath = ".env.example";
const targetPath = ".env.local";

if (!fs.existsSync(sourcePath)) {
  throw new Error(`Missing ${sourcePath}`);
}

if (fs.existsSync(targetPath)) {
  console.log(JSON.stringify({ file: targetPath, status: "exists", overwritten: false }, null, 2));
  process.exit(0);
}

const template = fs.readFileSync(sourcePath, "utf8");
fs.writeFileSync(targetPath, template);

console.log(
  JSON.stringify(
    {
      file: targetPath,
      next_step: "Fill Supabase URL, anon key, and service role key. Keep NEXT_PUBLIC_DATA_SOURCE=mock.",
      overwritten: false,
      status: "created"
    },
    null,
    2
  )
);
