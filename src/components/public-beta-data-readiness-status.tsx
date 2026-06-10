import { getPublicBetaDataReadinessStatus } from "@/lib/public-beta-data-readiness-status";

export function PublicBetaDataReadinessStatus() {
  const status = getPublicBetaDataReadinessStatus();

  return (
    <section className="public-beta-data-readiness-status" aria-label="Public Beta data readiness status">
      <div className="public-beta-data-readiness-status-main">
        <p className="eyebrow">Data Readiness</p>
        <h2>{status.headline}</h2>
        <p>{status.summary}</p>
        <p>{status.stopLine}</p>
      </div>
      <article className="readying">
        <span>Row coverage</span>
        <strong>{status.rowCoverage.label}</strong>
        <p>
          Accepted evidence {status.rowCoverage.acceptedRows}/{status.rowCoverage.targetRows}; not a full coverage claim.
        </p>
      </article>
      <article className="readying">
        <span>TWII prerequisites</span>
        <strong>
          {status.twiiPrerequisites.acceptedSlots}/{status.twiiPrerequisites.totalSlots} accepted for gate prep
        </strong>
        <p>{status.twiiPrerequisites.nextAction}</p>
      </article>
      <article className="active">
        <span>Runtime boundary</span>
        <strong>
          {status.publicDataSource} / {status.scoreSource}
        </strong>
        <p>Public Beta remains mock until a separate promotion gate accepts real data and real score.</p>
      </article>
      <div className="public-beta-data-readiness-lanes">
        {status.lanes.map((lane) => (
          <article className={lane.status} key={lane.id}>
            <span>{lane.label}</span>
            <strong>{lane.status}</strong>
            <p>{lane.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
