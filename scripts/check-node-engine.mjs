const requiredMajor = 20;
const actual = process.versions.node;
const actualMajor = Number.parseInt(actual.split(".")[0] ?? "", 10);
const status = actualMajor === requiredMajor ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "node_engine_20_required_for_next_build",
      required: `${requiredMajor}.x`,
      actual,
      reason:
        status === "ok"
          ? null
          : "Next production build artifacts must be generated with the project Node engine."
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;
