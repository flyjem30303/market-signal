import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-public-route-user-facing-residue-gate.json";
const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

console.log(
  JSON.stringify(
    {
      status: artifact.status,
      gateMode: artifact.gateMode,
      gateDecision: artifact.gateDecision,
      targetRoutes: artifact.targetRoutes,
      checkedRouteFiles: artifact.routeSurfaceFiles.length,
      internalOnlyComponents: artifact.internalOnlyComponents,
      publicVisibleResidueAllowed: artifact.publicVisibleResidueAllowed,
      developerWorkflowCopyAllowed: artifact.developerWorkflowCopyAllowed,
      forbiddenVisibleResidueExamples: artifact.forbiddenVisibleResidueExamples,
      nextRoute: artifact.nextRoute,
      safety: artifact.safety
    },
    null,
    2
  )
);
