import fs from "node:fs";
import type { Metadata } from "next";
import { assertInternalDiagnosticsAccess } from "@/lib/internal-diagnostics";
import {
  buildEtfSourceReadinessSummary,
  type EtfDueDiligence,
  type EtfSourceGate
} from "@/lib/etf-source-readiness";

type EtfSourceReadinessPageProps = {
  searchParams: {
    token?: string;
  };
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Internal ETF Source Readiness"
};

export default function EtfSourceReadinessPage({ searchParams }: EtfSourceReadinessPageProps) {
  assertInternalDiagnosticsAccess(searchParams.token);

  const sourceGate = readJson<EtfSourceGate>("data/source-gates/etf-source-gate.json");
  const dueDiligence = readJson<EtfDueDiligence>("data/source-gates/etf-source-due-diligence.json");
  const summary = buildEtfSourceReadinessSummary({ dueDiligence, sourceGate });

  return (
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">Internal Diagnostics</p>
        <h1>ETF Source Readiness</h1>
        <p>No ETF source is approved. ETF ingestion, ETF scoring, and public ETF interpretation remain blocked.</p>
      </section>

      <section className="content-grid">
        <article className="panel">
          <p className="panel-label">CEO Gate</p>
          <h2>{summary.status.toUpperCase()}</h2>
          <KeyValue label="Approved source" value={sourceGate.approved_source ?? "none"} />
          <KeyValue label="Priority candidate" value={dueDiligence.priority_candidate} />
          <KeyValue label="Coverage gaps" value={String(summary.candidateCoverageGaps.length)} />
        </article>

        <article className="panel">
          <p className="panel-label">Blockers</p>
          <h2>Role-Owned Checks</h2>
          <BlockerList label="Ingestion" blockers={summary.ingestionBlockers} />
          <BlockerList label="Scoring" blockers={summary.scoringBlockers} />
          <BlockerList label="Public release" blockers={summary.publicReleaseBlockers} />
        </article>
      </section>

      <section className="panel">
        <p className="panel-label">Candidate Scores</p>
        <h2>Source Priority</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Score</th>
              <th>Coverage</th>
              <th>Automation</th>
              <th>License</th>
            </tr>
          </thead>
          <tbody>
            {summary.candidateScores.map((candidate) => (
              <tr key={candidate.name}>
                <td>{candidate.name}</td>
                <td>{candidate.readiness_score}</td>
                <td>{candidate.field_coverage_ratio}</td>
                <td>{candidate.automation_status ?? "unknown"}</td>
                <td>{candidate.license_status ?? "unknown"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="content-grid">
        <article className="panel">
          <p className="panel-label">Coverage Gaps</p>
          <h2>Missing Fields</h2>
          <ul>
            {summary.candidateCoverageGaps.map((gap) => (
              <li key={gap}>{gap}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <p className="panel-label">Next Allowed Work</p>
          <h2>Research Only</h2>
          <ul>
            <li>Confirm machine-readable TWSE / ETFortune endpoints.</li>
            <li>Review TWSE / ETFortune usage and redistribution terms.</li>
            <li>Map missing ETF fields to official, issuer, or vendor sources.</li>
            <li>Keep public release blocked until the CEO checkpoint changes.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}

function readJson<T>(path: string): T {
  return JSON.parse(fs.readFileSync(path, "utf8")) as T;
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value || "none"}</strong>
    </div>
  );
}

function BlockerList({ blockers, label }: { blockers: string[]; label: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <ul>
        {blockers.map((blocker) => (
          <li key={blocker}>{blocker}</li>
        ))}
      </ul>
    </div>
  );
}
