import type { TwiiLocalDisclosureConsumerOutput } from "@/lib/twii-local-disclosure-consumer";

type TwiiMockDisclosureStatusProps = {
  disclosure: TwiiLocalDisclosureConsumerOutput;
  label?: string;
};

const statusLabels: Record<TwiiLocalDisclosureConsumerOutput["disclosureStatus"], string> = {
  mock_blocked_by_parser_contract: "Parser contract blocked",
  mock_not_runtime_ready: "Not runtime-ready",
  mock_ready_for_review: "Ready for internal review",
  mock_waiting_for_rights: "Waiting for rights review",
  mock_waiting_for_staging_schema: "Waiting for staging schema"
};

export function TwiiMockDisclosureStatus({
  disclosure,
  label = "TWII mock disclosure"
}: TwiiMockDisclosureStatusProps) {
  return (
    <section className="twii-mock-disclosure-status readying" aria-label={label}>
      <div>
        <p className="eyebrow">TWII Mock Disclosure</p>
        <h2>{statusLabels[disclosure.disclosureStatus]}</h2>
        <p>{disclosure.safeSummary}</p>
      </div>
      <article className="blocked">
        <span>Runtime activation</span>
        <strong>{disclosure.canUseSupabaseRuntime ? "enabled" : "off"}</strong>
        <p>Public source {disclosure.publicDataSource}; score source {disclosure.scoreSource}.</p>
      </article>
      <article className="blocked">
        <span>Public claim</span>
        <strong>{disclosure.canClaimTwiiCoverage ? "allowed" : "blocked"}</strong>
        <p>Real score display {disclosure.canShowRealScore ? "allowed" : "blocked"}.</p>
      </article>
    </section>
  );
}
