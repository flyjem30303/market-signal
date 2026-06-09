import { getPublicBetaLaunchReadinessSummary } from "@/lib/public-beta-launch-readiness";

type PublicBetaLaunchReadinessPanelProps = {
  compact?: boolean;
};

export function PublicBetaLaunchReadinessPanel({ compact = false }: PublicBetaLaunchReadinessPanelProps) {
  const summary = getPublicBetaLaunchReadinessSummary();

  return (
    <section
      aria-label="Public Beta launch readiness"
      className={compact ? "public-beta-launch-readiness compact" : "public-beta-launch-readiness"}
    >
      <div className="public-beta-launch-readiness-head">
        <div>
          <p className="eyebrow">Public Beta Readiness</p>
          <h2>{summary.headline}</h2>
          <p>{summary.subhead}</p>
        </div>
        <div
          aria-label={`Public Beta pre-launch executable progress ${summary.completionPercent}%`}
          className="public-beta-launch-readiness-score"
        >
          <strong>{summary.completionPercent}%</strong>
          <span>pre-launch executable</span>
          <small>commit {summary.asOfCommit}</small>
        </div>
      </div>

      <div className="public-beta-operational-goal" aria-label="Operational GOAL v3 execution first">
        <article>
          <span>{summary.operationalGoalGuide.title}</span>
          <strong>{summary.operationalGoalGuide.status}</strong>
          <p>{summary.operationalGoalGuide.executionRule}</p>
          <p>{summary.operationalGoalGuide.verificationRule}</p>
        </article>
        <article>
          <span>Current hard blockers</span>
          <ul>
            {summary.operationalGoalGuide.blockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="public-beta-launch-readiness-grid">
        {summary.items.map((item) => (
          <article className={item.tone} key={item.id}>
            <span>{item.label}</span>
            <strong>{item.status}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="public-beta-hard-blocker-actions" aria-label="Public Beta remaining hard blocker actions">
        <div>
          <span>Remaining hard blockers</span>
          <strong>2 blocker groups: 2 platform lines + 4 A1 evidence slots</strong>
        </div>
        {summary.hardBlockerActions.map((action) => (
          <article key={action.id}>
            <span>{action.title}</span>
            <strong>{action.status}</strong>
            <p>{action.nextProof}</p>
            <div className="public-beta-hard-blocker-inputs">
              {action.requiredInput.map((item) => (
                <code key={item}>{item}</code>
              ))}
            </div>
            <ol>
              {action.commands.map((command) => (
                <li key={command}>
                  <code>{command}</code>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>

      <div className="public-beta-external-input-request" aria-label="Public Beta external input request">
        <article>
          <span>{summary.externalInputRequestGuide.title}</span>
          <strong>{summary.externalInputRequestGuide.status}</strong>
          <p>{summary.externalInputRequestGuide.description}</p>
          <code>{summary.externalInputRequestGuide.command}</code>
          <small>After reply</small>
          <code>{summary.externalInputRequestGuide.afterReplyCommand}</code>
        </article>
        <article>
          <span>Current executable step</span>
          <strong>{summary.externalInputRequestGuide.afterReplyNextExecutableStep.lane}</strong>
          <p>{summary.externalInputRequestGuide.afterReplyNextExecutableStep.reason}</p>
          <code>{summary.externalInputRequestGuide.afterReplyNextExecutableStep.command}</code>
        </article>
        <article>
          <span>External reply dry-run intake</span>
          <strong>{summary.externalInputRequestGuide.replyIntakeDryRun.requiredEnvVar}</strong>
          <p>{summary.externalInputRequestGuide.replyIntakeDryRun.purpose}</p>
          <small>Reply file template</small>
          <code>{summary.externalInputRequestGuide.replyIntakeDryRun.templateCommand}</code>
          <small>Reply file route</small>
          <code>{summary.externalInputRequestGuide.replyIntakeDryRun.routeCommand}</code>
          <code>{summary.externalInputRequestGuide.replyIntakeDryRun.command}</code>
          <small>A1 PM preview</small>
          <code>{summary.externalInputRequestGuide.replyIntakeDryRun.a1PmPreviewCommand}</code>
          <small>Workflow proof</small>
          <code>{summary.externalInputRequestGuide.replyIntakeDryRun.workflowProofCommand}</code>
          <small>Complete reply next command</small>
          <code>{summary.externalInputRequestGuide.replyIntakeDryRun.completeReplyNextCommand}</code>
          <small>Unsafe or incomplete reply fallback</small>
          <code>{summary.externalInputRequestGuide.replyIntakeDryRun.unsafeReplyFallbackCommand}</code>
          <div className="public-beta-hard-blocker-inputs">
            <code>fileTextEchoed={String(summary.externalInputRequestGuide.replyIntakeDryRun.fileTextEchoed)}</code>
            <code>valueEchoed={String(summary.externalInputRequestGuide.replyIntakeDryRun.valueEchoed)}</code>
          </div>
        </article>
        <article>
          <span>Request blocks</span>
          <ul>
            {summary.externalInputRequestGuide.requestBlocks.map((block) => (
              <li key={block}>{block}</li>
            ))}
          </ul>
        </article>
        <article>
          <span>A1 fail-fast policy</span>
          <strong>{summary.externalInputRequestGuide.a1FailFastPolicy.status}</strong>
          <p>{summary.externalInputRequestGuide.a1FailFastPolicy.rule}</p>
          <div className="public-beta-hard-blocker-inputs">
            {summary.externalInputRequestGuide.a1FailFastPolicy.skippedUntilEvidencePresent.map((step) => (
              <code key={step}>{step}</code>
            ))}
          </div>
          <small>Pending next command</small>
          <code>{summary.externalInputRequestGuide.a1FailFastPolicy.pendingNextCommand}</code>
        </article>
        <article>
          <span>{summary.externalInputRequestGuide.missingOnlyReplyPacket.title}</span>
          <strong>{summary.externalInputRequestGuide.missingOnlyReplyPacket.blockCount} missing reply blocks</strong>
          <p>{summary.externalInputRequestGuide.missingOnlyReplyPacket.status}</p>
          {summary.externalInputRequestGuide.missingOnlyReplyPacket.blocks.map((block) => (
            <div className="public-beta-missing-reply-block" key={block.id}>
              <small>{block.owner}</small>
              <strong>{block.title}</strong>
              <div className="public-beta-reply-template">
                {block.lines.map((line) => (
                  <code key={line}>{line}</code>
                ))}
              </div>
            </div>
          ))}
          <small>After any reply</small>
          <code>{summary.externalInputRequestGuide.missingOnlyReplyPacket.afterAnyReplyFirstCommand}</code>
        </article>
        <article>
          <span>{summary.externalInputRequestGuide.oneScreenReplyPacket.title}</span>
          <strong>{summary.externalInputRequestGuide.oneScreenReplyPacket.platformBlock.title}</strong>
          <p>{summary.externalInputRequestGuide.oneScreenReplyPacket.purpose}</p>
          <small>{summary.externalInputRequestGuide.oneScreenReplyPacket.platformBlock.owner}</small>
          <div className="public-beta-reply-template" aria-label="Public Beta one-screen platform reply block">
            {summary.externalInputRequestGuide.oneScreenReplyPacket.platformBlock.lines.map((line) => (
              <code key={line}>{line}</code>
            ))}
          </div>
          <small>Platform after-reply</small>
          {summary.externalInputRequestGuide.oneScreenReplyPacket.platformBlock.afterReply.map((command) => (
            <code key={command}>{command}</code>
          ))}
          <strong>{summary.externalInputRequestGuide.oneScreenReplyPacket.a1Block.title}</strong>
          <small>{summary.externalInputRequestGuide.oneScreenReplyPacket.a1Block.owner}</small>
          <ul>
            {summary.externalInputRequestGuide.oneScreenReplyPacket.a1Block.pendingSlotIds.map((slot) => (
              <li key={slot}>{slot}</li>
            ))}
          </ul>
          <div className="public-beta-reply-template" aria-label="Public Beta one-screen A1 reply block">
            {summary.externalInputRequestGuide.oneScreenReplyPacket.a1Block.lines.map((line, index) => (
              <code key={`${index}-${line || "blank-line"}`}>{line || "<blank line>"}</code>
            ))}
          </div>
          <small>A1 required per slot</small>
          <div className="public-beta-hard-blocker-inputs">
            {summary.externalInputRequestGuide.oneScreenReplyPacket.a1Block.requiredPerSlot.map((field) => (
              <code key={field}>{field}</code>
            ))}
          </div>
          <small>A1 after-reply</small>
          {summary.externalInputRequestGuide.oneScreenReplyPacket.a1Block.afterReply.map((command) => (
            <code key={command}>{command}</code>
          ))}
          <p>{summary.externalInputRequestGuide.oneScreenReplyPacket.a1Block.failFastRule}</p>
          <small>Complete when</small>
          <ul>
            {summary.externalInputRequestGuide.oneScreenReplyPacket.completeWhen.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <span>Single reply checklist</span>
          <strong>2 platform lines + 4 A1 slots</strong>
          <div className="public-beta-reply-template" aria-label="Public Beta single reply checklist">
            {summary.externalInputRequestGuide.replyChecklist.platformLines.map((line) => (
              <code key={line}>{line}</code>
            ))}
          </div>
          <ul>
            {summary.externalInputRequestGuide.replyChecklist.a1SlotIds.map((slot) => (
              <li key={slot}>{slot}</li>
            ))}
          </ul>
          <small>After any reply</small>
          <code>{summary.externalInputRequestGuide.replyChecklist.afterAnyReplyFirstCommand}</code>
        </article>
        <article>
          <span>{summary.externalInputRequestGuide.replyPacketContract.title}</span>
          <strong>{summary.externalInputRequestGuide.replyPacketContract.status}</strong>
          <ul>
            {summary.externalInputRequestGuide.replyPacketContract.completeReplyRequires.map((item) => (
              <li key={item.blockId}>
                {item.blockId}: {item.completionRule}
              </li>
            ))}
          </ul>
          <small>Forbidden content</small>
          <div className="public-beta-hard-blocker-inputs">
            {summary.externalInputRequestGuide.replyPacketContract.forbiddenContent.map((item) => (
              <code key={item}>{item}</code>
            ))}
          </div>
          <small>Still not allowed</small>
          <div className="public-beta-hard-blocker-inputs">
            {summary.externalInputRequestGuide.replyPacketContract.stillNotAllowed.map((item) => (
              <code key={item}>{item}</code>
            ))}
          </div>
          <small>After any reply</small>
          <code>{summary.externalInputRequestGuide.replyPacketContract.firstCommandAfterAnyReply}</code>
          <small>Shape-safe one-runner</small>
          <code>{summary.externalInputRequestGuide.replyPacketContract.oneRunnerAfterShapeSafeReply}</code>
          <small>A1 evidence one-runner</small>
          <code>{summary.externalInputRequestGuide.replyPacketContract.a1OneRunnerAfterEvidenceReply}</code>
        </article>
      </div>

      <div className="public-beta-mock-launch-proof-bundle" aria-label="Public Beta mock launch proof bundle">
        <article>
          <span>{summary.mockLaunchProofBundle.title}</span>
          <strong>{summary.mockLaunchProofBundle.status}</strong>
          <p>{summary.mockLaunchProofBundle.hardStop}</p>
          <ol>
            {summary.mockLaunchProofBundle.commands.map((command) => (
              <li key={command}>
                <code>{command}</code>
              </li>
            ))}
          </ol>
        </article>
      </div>

      <div className="public-beta-platform-values-guide">
        <article>
          <span>{summary.platformValueGuide.title}</span>
          <strong>{summary.platformValueGuide.fields.join(" / ")}</strong>
          <p>{summary.platformValueGuide.sourceHint}</p>
          <div className="public-beta-reply-template" aria-label="Beta platform value reply format">
            {summary.platformValueGuide.replyTemplate.map((line) => (
              <code key={line}>{line}</code>
            ))}
          </div>
          <code>{summary.platformValueGuide.commandAfterFill}</code>
        </article>
        <article>
          <span>After validation</span>
          <ol className="public-beta-platform-after-validation">
            {summary.platformValueGuide.afterValidation.map((command) => (
              <li key={command}>
                <code>{command}</code>
              </li>
            ))}
          </ol>
        </article>
        <article>
          <span>Allowed values</span>
          <ul>
            {summary.platformValueGuide.allowed.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <span>Blocked values</span>
          <ul>
            {summary.platformValueGuide.blocked.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="public-beta-worktree-guide">
        <article>
          <span>{summary.worktreeGuide.title}</span>
          <strong>{summary.worktreeGuide.status}</strong>
          <p>
            PM classified {summary.worktreeGuide.acceptedCount} Beta readiness changes, excluded{" "}
            {summary.worktreeGuide.excludedCount} launch-packet tracking item, and left{" "}
            {summary.worktreeGuide.unresolvedCount} unresolved worktree items.
          </p>
          <code>{summary.worktreeGuide.command}</code>
        </article>
        <article>
          <span>Next route</span>
          <strong>{summary.worktreeGuide.nextRoute}</strong>
          <p>{summary.worktreeGuide.backupBlocker}</p>
        </article>
      </div>

      <div className="public-beta-a1-mini-packet-guide">
        <article>
          <span>{summary.a1MiniPacketGuide.title}</span>
          <strong>{summary.a1MiniPacketGuide.status}</strong>
          <p>{summary.a1MiniPacketGuide.packetPath}</p>
          <code>{summary.a1MiniPacketGuide.commandAfterFill}</code>
        </article>
        <article>
          <span>TWII slots</span>
          <ul>
            {summary.a1MiniPacketGuide.slotIds.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <span>Required output</span>
          <ul>
            {summary.a1MiniPacketGuide.fields.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="public-beta-a1-task-board">
        {summary.a1MiniPacketGuide.tasks.map((task) => (
          <article key={task.id}>
            <span>{task.id}</span>
            <strong>{task.status}</strong>
            <p>{task.pmQuestion}</p>
            <small>{task.requiredOutput.join(" / ")}</small>
          </article>
        ))}
      </div>

      <div className="public-beta-a1-narrow-request">
        <article>
          <span>A1 reply format</span>
          <strong data-mode="four_slot_no_secret_reply">{summary.a1MiniPacketGuide.mode}</strong>
          <div className="public-beta-a1-reply-shape" aria-label="A1 TWII no-secret evidence reply format">
            {summary.a1MiniPacketGuide.replyShape.map((line) => (
              <code key={line}>{line}</code>
            ))}
          </div>
        </article>
        <article>
          <span>PM review rule</span>
          <strong>{summary.a1MiniPacketGuide.pmReviewRule}</strong>
          <ul>
            {summary.a1MiniPacketGuide.afterA1Reply.map((command) => (
              <li key={command}>
                <code>{command}</code>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="public-beta-a1-fast-triage" aria-label="A1 TWII PM fast triage packet">
        <article>
          <span>{summary.a1MiniPacketGuide.fastTriagePacket.title}</span>
          <strong>{summary.a1MiniPacketGuide.fastTriagePacket.status}</strong>
          <p>{summary.a1MiniPacketGuide.fastTriagePacket.completionRule}</p>
          <code>{summary.a1MiniPacketGuide.fastTriagePacket.firstCommand}</code>
        </article>
        <article>
          <span>Dry-run slot triage</span>
          <strong>{summary.a1MiniPacketGuide.fastTriagePacket.slotCount} slots / dry-run only</strong>
          <ul>
            {summary.a1MiniPacketGuide.fastTriagePacket.requiredDecisionPerSlot.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <small>After any dry-run</small>
          <code>{summary.a1MiniPacketGuide.fastTriagePacket.afterAnyDryRun}</code>
        </article>
        <article>
          <span>Still not allowed</span>
          <ul>
            {summary.a1MiniPacketGuide.fastTriagePacket.stillNotAllowed.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="public-beta-a1-bounded-repair" aria-label="A1 bounded repair request">
        <article>
          <span>{summary.a1MiniPacketGuide.boundedRepairRequest.title}</span>
          <strong>{summary.a1MiniPacketGuide.boundedRepairRequest.status}</strong>
          <p>Smallest no-secret repairs for A1 before PM classification.</p>
          <code>{summary.a1MiniPacketGuide.boundedRepairRequest.command}</code>
        </article>
        {summary.a1MiniPacketGuide.boundedRepairRequest.repairRequests.map((item) => (
          <article key={item.evidenceSlotId}>
            <span>{item.evidenceSlotId}</span>
            <strong>{item.currentDraftClassification}</strong>
            <p>{item.requestedSafeEvidenceSummary}</p>
            <small>{item.requestedSourceReferenceLabel}</small>
            <p>{item.requestedRemainingRisk}</p>
          </article>
        ))}
      </div>

      <div className="public-beta-a1-classification-quick-map" aria-label="A1 PM classification quick map">
        <article>
          <span>{summary.a1MiniPacketGuide.pmClassificationQuickMap.title}</span>
          <strong>{summary.a1MiniPacketGuide.pmClassificationQuickMap.status}</strong>
          <p>{summary.a1MiniPacketGuide.pmClassificationQuickMap.classificationOptions.join(" / ")}</p>
          <small>First guard</small>
          <code>{summary.a1MiniPacketGuide.pmClassificationQuickMap.firstGuardCommand}</code>
          <small>After any dry-run</small>
          <code>{summary.a1MiniPacketGuide.pmClassificationQuickMap.afterAnyDryRunCommand}</code>
        </article>
        {Object.entries(summary.a1MiniPacketGuide.pmClassificationQuickMap.rules).map(([option, rule]) => (
          <article key={option}>
            <span>{option}</span>
            <p>{rule}</p>
          </article>
        ))}
        <article>
          <span>Still not allowed</span>
          <ul>
            {summary.a1MiniPacketGuide.pmClassificationQuickMap.stillNotAllowed.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="public-beta-a1-classification-queue" aria-label="A1 TWII PM classification queue">
        <article>
          <span>A1 PM classification queue</span>
          <strong>{summary.a1MiniPacketGuide.status}</strong>
          <p>{summary.a1MiniPacketGuide.pmQueueRule}</p>
        </article>
        {summary.a1MiniPacketGuide.pmClassificationQueue.map((item) => (
          <article key={item.evidenceSlotId}>
            <span>{item.evidenceSlotId}</span>
            <strong>{item.pmClassificationOptions.join(" / ")}</strong>
            <p>{item.currentRemainingRisk}</p>
            <code>{item.firstPmCommandAfterReply}</code>
            <code>{item.oneRunnerCommandAfterReply}</code>
            <code>{item.secondPmCommandAfterReply}</code>
            <code>{item.thirdPmCommandAfterReply}</code>
          </article>
        ))}
      </div>

      <div className="public-beta-data-readiness-guide">
        <article>
          <span>{summary.dataReadinessGuide.title}</span>
          <strong>{summary.dataReadinessGuide.readonlyStatus}</strong>
          <p>{summary.dataReadinessGuide.coverage}</p>
          <code>{summary.dataReadinessGuide.nextCommand}</code>
        </article>
        <article>
          <span>Source-rights and ingestion</span>
          <strong>{summary.dataReadinessGuide.sourceRightsStatus}</strong>
          <p>{summary.dataReadinessGuide.ingestionStatus}</p>
        </article>
      </div>

      <div className="public-beta-launch-readiness-route">
        <article>
          <span>Current blockers</span>
          <ul>
            {summary.blockedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <span>Next PM command</span>
          <code>{summary.nextCommand}</code>
          <p>{summary.nextDecision}</p>
        </article>
        <article>
          <span>Runtime boundary</span>
          <strong>
            publicDataSource={summary.runtimeBoundary.publicDataSource} / scoreSource={summary.runtimeBoundary.scoreSource}
          </strong>
          <p>{summary.stopLine}</p>
        </article>
      </div>
    </section>
  );
}
