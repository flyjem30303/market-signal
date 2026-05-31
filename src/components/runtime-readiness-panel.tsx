import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getSupabaseReadonlyDecision } from "@/lib/supabase-readonly-decision";
import { getSupabaseReadonlyLocalPreflight } from "@/lib/supabase-readonly-local-preflight";

export function RuntimeReadinessPanel() {
  const readiness = getRuntimeReadinessSummary();
  const preflight = getSupabaseReadonlyLocalPreflight();
  const decision = getSupabaseReadonlyDecision(preflight);

  return (
    <section className={`runtime-readiness-panel ${readiness.status}`} aria-label="Runtime readiness">
      <div className="runtime-readiness-summary">
        <p className="eyebrow">Runtime Readiness</p>
        <h2>{readiness.headline}</h2>
        <p>{readiness.nextDecision}</p>
      </div>
      <div className="runtime-readiness-score" aria-label={`Runtime readiness ${readiness.score}%`}>
        <span style={{ ["--progress" as string]: `${readiness.score}%` }} />
        <b>{readiness.score}%</b>
        <small>bounded readiness</small>
      </div>
      <div className="runtime-readiness-command">
        <article>
          <span>Local preflight</span>
          <code>{readiness.localPreflightCommand}</code>
          <p>{readiness.localPreflightState}</p>
        </article>
        <article>
          <span>Next guarded decision</span>
          <code>{readiness.nextRemoteCommand}</code>
          <p>只有 CEO 開 gate 後才可執行；目前不在自動 review gate 內執行。</p>
        </article>
      </div>
      <div className="runtime-preflight-status">
        <article
          aria-label={`Runtime ${decision.recommendedWorkMix.runtime}% / Supabase readonly ${decision.recommendedWorkMix.supabaseReadonly}%`}
          className={decision.status === "blocked" ? "blocked" : "readying"}
        >
          <span>CEO decision packet</span>
          <strong>{decision.decision}</strong>
          <p>
            Runtime {decision.recommendedWorkMix.runtime}% / Supabase readonly{" "}
            {decision.recommendedWorkMix.supabaseReadonly}%. {decision.requiredHumanStep}.
          </p>
        </article>
        <article className={preflight.status === "blocked" ? "blocked" : "readying"}>
          <span>Local preflight status</span>
          <strong>{preflight.status === "blocked" ? "blocked" : "ready for guarded decision"}</strong>
          <p>
            {preflight.status === "blocked"
              ? `缺少 ${preflight.missingEnv.length} 個必要設定，遠端唯讀驗證仍不可開。`
              : "必要設定存在，安全開關維持 disabled；CEO 可另開一次受控唯讀遠端驗證。"}
          </p>
        </article>
        {preflight.boundaries.map((boundary) => (
          <article className={boundary.status} key={boundary.name}>
            <span>{boundary.name}</span>
            <strong>{boundary.observed}</strong>
            <p>expected: {boundary.expected}</p>
          </article>
        ))}
      </div>
      <div className="runtime-readiness-lanes">
        {readiness.lanes.map((lane) => (
          <article className={lane.state} key={lane.label}>
            <header>
              <span>{lane.owner}</span>
              <b>{lane.current}%</b>
            </header>
            <strong>{lane.label}</strong>
            <i style={{ ["--progress" as string]: `${lane.current}%` }} />
            <p>{lane.nextAction}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
