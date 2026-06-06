import fs from "node:fs";
import { spawn, spawnSync } from "node:child_process";

const node = process.execPath;
const baseUrl = process.env.LOCALHOST_HEALTH_BASE_URL ?? "http://localhost:3000";
const shouldManageServer = process.env.LOCALHOST_HEALTH_MANAGE_SERVER !== "false";
const checks = [
  {
    command: [node, "scripts/check-localhost-health-config.mjs"],
    name: "localhost-health-config"
  },
  {
    command: [node, "scripts/check-localhost-health.mjs"],
    name: "localhost-health"
  },
  {
    command: [node, "scripts/check-localhost-content-health.mjs"],
    name: "localhost-content-health"
  },
  {
    command: [node, "scripts/check-row-coverage-health-route-alignment.mjs"],
    name: "row-coverage-health-route-alignment"
  },
  {
    command: [node, "scripts/check-project-progress-snapshot.mjs"],
    name: "project-progress-snapshot"
  },
  {
    command: [node, "scripts/check-overall-project-100-readiness.mjs"],
    name: "overall-project-100-readiness"
  },
  {
    command: [node, "scripts/check-runtime-schema-promotion-readiness.mjs"],
    name: "runtime-schema-promotion-readiness"
  },
  {
    command: [node, "scripts/check-mock-signal-reading-flow-readiness.mjs"],
    name: "mock-signal-reading-flow-readiness"
  },
  {
    command: [node, "scripts/check-mock-mvp-product-surface-readiness.mjs"],
    name: "mock-mvp-product-surface-readiness"
  },
  {
    command: [node, "scripts/check-devops-health-recovery-readiness.mjs"],
    name: "devops-health-recovery-readiness"
  },
  {
    command: [node, "scripts/check-ceo-execution-focus-closure-readiness.mjs"],
    name: "ceo-execution-focus-closure-readiness"
  },
  {
    command: [node, "scripts/check-final-mvp-100-completion-audit-readiness.mjs"],
    name: "final-mvp-100-completion-audit-readiness"
  },
  {
    command: [node, "scripts/check-mock-mvp-chairman-review.mjs"],
    name: "mock-mvp-chairman-review"
  },
  {
    command: [node, "scripts/check-mock-mvp-f-ui-closeout.mjs"],
    name: "mock-mvp-f-ui-closeout"
  },
  {
    command: [node, "scripts/check-data-authorization-entry-gate.mjs"],
    name: "data-authorization-entry-gate"
  },
  {
    command: [node, "scripts/check-data-authorization-decision-packet.mjs"],
    name: "data-authorization-decision-packet"
  },
  {
    command: [node, "scripts/check-data-authorization-readonly-attempt-post-run-review.mjs"],
    name: "data-authorization-readonly-attempt-post-run-review"
  },
  {
    command: [node, "scripts/check-data-population-route-decision.mjs"],
    name: "data-population-route-decision"
  },
  {
    command: [node, "scripts/check-backfill-ingestion-execution-packet.mjs"],
    name: "backfill-ingestion-execution-packet"
  },
  {
    command: [node, "scripts/check-ceo-progress-brief.mjs"],
    name: "ceo-progress-brief"
  },
  {
    command: [node, "scripts/check-narrow-approval-packet.mjs"],
    name: "narrow-approval-packet"
  },
  {
    command: [node, "scripts/check-narrow-approval-post-review-gate.mjs"],
    name: "narrow-approval-post-review-gate"
  },
  {
    command: [node, "scripts/check-narrow-approval-outcome-ledger.mjs"],
    name: "narrow-approval-outcome-ledger"
  },
  {
    command: [node, "scripts/check-narrow-approval-outcome-panel.mjs"],
    name: "narrow-approval-outcome-panel"
  },
  {
    command: [node, "scripts/check-record-narrow-approval-outcome.mjs"],
    name: "record-narrow-approval-outcome"
  },
  {
    command: [node, "scripts/check-blocker-resolution-plan.mjs"],
    name: "blocker-resolution-plan"
  },
  {
    command: [node, "scripts/check-blocker-execution-queue.mjs"],
    name: "blocker-execution-queue"
  },
  {
    command: [node, "scripts/check-blocker-action-priorities.mjs"],
    name: "blocker-action-priorities"
  },
  {
    command: [node, "scripts/check-pre-runtime-blocker-closure-packet.mjs"],
    name: "pre-runtime-blocker-closure-packet"
  },
  {
    command: [node, "scripts/check-data-quality-evidence-checklist.mjs"],
    name: "data-quality-evidence-checklist"
  },
  {
    command: [node, "scripts/check-data-quality-field-validity.mjs"],
    name: "data-quality-field-validity"
  },
  {
    command: [node, "scripts/check-data-quality-field-validity-qa-review.mjs"],
    name: "data-quality-field-validity-qa-review"
  },
  {
    command: [node, "scripts/check-data-quality-field-validity-acceptance-gate.mjs"],
    name: "data-quality-field-validity-acceptance-gate"
  },
  {
    command: [node, "scripts/check-data-freshness-quality-mvp-readiness.mjs"],
    name: "data-freshness-quality-mvp-readiness"
  },
  {
    command: [node, "scripts/check-data-coverage-quality-route-readiness.mjs"],
    name: "data-coverage-quality-route-readiness"
  },
  {
    command: [node, "scripts/check-data-coverage-mvp-deferral-decision-readiness.mjs"],
    name: "data-coverage-mvp-deferral-decision-readiness"
  },
  {
    command: [node, "scripts/check-data-coverage-promotion-execution-readiness.mjs"],
    name: "data-coverage-promotion-execution-readiness"
  },
  {
    command: [node, "scripts/check-source-specific-acceptance-packets-readiness.mjs"],
    name: "source-specific-acceptance-packets-readiness"
  },
  {
    command: [node, "scripts/check-promotion-prerequisites-gate.mjs"],
    name: "promotion-prerequisites-gate"
  },
  {
    command: [node, "scripts/check-source-rights-disclosure-checklist.mjs"],
    name: "source-rights-disclosure-checklist"
  },
  {
    command: [node, "scripts/check-source-rights-disclosure-local-review.mjs"],
    name: "source-rights-disclosure-local-review"
  },
  {
    command: [node, "scripts/check-source-rights-disclosure-acceptance-gate.mjs"],
    name: "source-rights-disclosure-acceptance-gate"
  },
  {
    command: [node, "scripts/check-provider-specific-terms-review-packet.mjs"],
    name: "provider-specific-terms-review-packet"
  },
  {
    command: [node, "scripts/check-provider-specific-terms-post-review-rollup.mjs"],
    name: "provider-specific-terms-post-review-rollup"
  },
  {
    command: [node, "scripts/check-source-rights-mvp-readiness.mjs"],
    name: "source-rights-mvp-readiness"
  },
  {
    command: [node, "scripts/check-source-rights-public-placement-readiness.mjs"],
    name: "source-rights-public-placement-readiness"
  },
  {
    command: [node, "scripts/check-source-rights-public-copy-acceptance-readiness.mjs"],
    name: "source-rights-public-copy-acceptance-readiness"
  },
  {
    command: [node, "scripts/check-source-rights-mvp-deferral-decision-readiness.mjs"],
    name: "source-rights-mvp-deferral-decision-readiness"
  },
  {
    command: [node, "scripts/check-source-rights-mvp-final-closure-readiness.mjs"],
    name: "source-rights-mvp-final-closure-readiness"
  },
  {
    command: [node, "scripts/check-source-rights-specific-classification-readiness.mjs"],
    name: "source-rights-specific-classification-readiness"
  },
  {
    command: [node, "scripts/check-bounded-readonly-final-local-alignment.mjs"],
    name: "bounded-readonly-final-local-alignment"
  },
  {
    command: [node, "scripts/check-data-goal-readiness.mjs"],
    name: "data-goal-readiness"
  },
  {
    command: [node, "scripts/check-data-goal-execution-review-bridge.mjs"],
    name: "data-goal-execution-review-bridge"
  },
  {
    command: [node, "scripts/check-data-goal-completion-audit.mjs"],
    name: "data-goal-completion-audit"
  },
  {
    command: [node, "scripts/check-mvp-launch-prd.mjs"],
    name: "mvp-launch-prd"
  },
  {
    command: [node, "scripts/check-model-credibility-checklist.mjs"],
    name: "model-credibility-checklist"
  },
  {
    command: [node, "scripts/check-model-credibility-local-review.mjs"],
    name: "model-credibility-local-review"
  },
  {
    command: [node, "scripts/check-model-credibility-acceptance-gate.mjs"],
    name: "model-credibility-acceptance-gate"
  },
  {
    command: [node, "scripts/check-investment-credibility-mvp-readiness.mjs"],
    name: "investment-credibility-mvp-readiness"
  },
  {
    command: [node, "scripts/check-investment-credibility-evidence-upgrade.mjs"],
    name: "investment-credibility-evidence-upgrade"
  },
  {
    command: [node, "scripts/check-investment-formula-downgrade-readiness.mjs"],
    name: "investment-formula-downgrade-readiness"
  },
  {
    command: [node, "scripts/check-investment-public-claim-readiness.mjs"],
    name: "investment-public-claim-readiness"
  },
  {
    command: [node, "scripts/check-blocker-readiness-panel.mjs"],
    name: "blocker-readiness-panel"
  },
  {
    command: [node, "scripts/check-next-dev-recovery-tools.mjs"],
    name: "next-dev-recovery-tools"
  }
];

const managedServer = shouldManageServer && !(await canFetchRoot()) ? await startTemporaryServer() : null;

try {
  const results = checks.map((check) => {
    const result = spawnSync(check.command[0], check.command.slice(1), {
      cwd: process.cwd(),
      encoding: "utf8"
    });

    return {
      name: check.name,
      ok: result.status === 0,
      statusCode: result.status,
      stderr: result.stderr.trim(),
      stdout: result.stdout.trim()
    };
  });

  const failed = results.filter((result) => !result.ok);

  console.log(
    JSON.stringify(
      {
        managedServer: managedServer
          ? {
              command: managedServer.commandLabel,
              started: true
            }
          : {
              started: false
            },
        results: results.map((result) => ({
          name: result.name,
          ok: result.ok,
          statusCode: result.statusCode
        })),
        status: failed.length === 0 ? "ok" : "blocked"
      },
      null,
      2
    )
  );

  if (failed.length > 0) {
    for (const result of failed) {
      console.error(`\n[${result.name}] stdout\n${result.stdout}`);
      console.error(`\n[${result.name}] stderr\n${result.stderr}`);
    }
    process.exitCode = 1;
  }
} finally {
  if (managedServer) {
    managedServer.child.kill();
  }
}

async function startTemporaryServer() {
  const hasProductionBuild = fs.existsSync(".next/BUILD_ID");
  const args = hasProductionBuild
    ? ["node_modules/next/dist/bin/next", "start", "--hostname", "localhost", "--port", "3000"]
    : ["node_modules/next/dist/bin/next", "dev", "--hostname", "localhost", "--port", "3000"];
  const child = spawn(node, args, {
    cwd: process.cwd(),
    env: normalizeEnv(process.env),
    stdio: "ignore",
    windowsHide: true
  });

  const ready = await waitForRoot();
  if (!ready) {
    child.kill();
    throw new Error("temporary localhost server did not become ready");
  }

  return {
    child,
    commandLabel: hasProductionBuild ? "next start" : "next dev"
  };
}

async function waitForRoot() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    if (await canFetchRoot()) return true;
    await delay(1000);
  }

  return false;
}

async function canFetchRoot() {
  try {
    const response = await fetch(new URL("/", baseUrl), { cache: "no-store" });
    return response.status === 200;
  } catch {
    return false;
  }
}

function normalizeEnv(env) {
  const next = { ...env };
  if (next.Path && next.PATH) {
    delete next.PATH;
  }
  return next;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
