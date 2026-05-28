import { spawnSync } from "node:child_process";
import type { Metadata } from "next";
import { assertInternalDiagnosticsAccess } from "@/lib/internal-diagnostics";

type Cp3DryRunPageProps = {
  searchParams: {
    symbol?: string;
    token?: string;
  };
};

type DryRunReport = {
  dry_run?: {
    composite_score?: number;
    data_quality_grade?: string;
    data_quality_score?: number;
    health_score?: number;
    missing_module_flags?: string[];
    model_version?: string;
    public_eligible?: boolean;
    risk_score?: number;
    scoreSource?: string;
    score_date?: string;
    signal?: string;
    stale_data_flags?: string[];
    symbol?: string;
    warnings?: string[];
  };
  source?: {
    file?: string;
    persistence?: string;
    writes?: string[];
  };
  status?: string;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Internal CP3 Dry Run"
};

export default function Cp3DryRunPage({ searchParams }: Cp3DryRunPageProps) {
  assertInternalDiagnosticsAccess(searchParams.token);

  const symbol = searchParams.symbol ?? "2330";
  const report = runDryRunReport(symbol);
  const dryRun = report.data?.dry_run;
  const source = report.data?.source;

  return (
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">Internal Diagnostics</p>
        <h1>CP3 Taiwan Stock Dry Run</h1>
        <p>
          Internal-only dry-run report. It reads seed SQL, writes nothing, keeps scoreSource as mock, and remains
          public-ineligible.
        </p>
      </section>

      <section className="content-grid">
        <article className="panel">
          <p className="panel-label">Target</p>
          <h2>{dryRun?.symbol ?? symbol}</h2>
          <KeyValue label="Status" value={report.status} />
          <KeyValue label="Score date" value={dryRun?.score_date ?? "-"} />
          <KeyValue label="Model version" value={dryRun?.model_version ?? "-"} />
          <KeyValue label="Score source" value={dryRun?.scoreSource ?? "-"} />
          <KeyValue label="Public eligible" value={String(dryRun?.public_eligible ?? false)} />
          <KeyValue label="Persistence" value={source?.persistence ?? "none"} />
        </article>

        <article className="panel">
          <p className="panel-label">Dry-Run Scores</p>
          <h2>{dryRun?.signal ?? "Unavailable"}</h2>
          <KeyValue label="Health" value={String(dryRun?.health_score ?? "-")} />
          <KeyValue label="Risk" value={String(dryRun?.risk_score ?? "-")} />
          <KeyValue label="Composite" value={String(dryRun?.composite_score ?? "-")} />
          <KeyValue label="Data quality" value={`${dryRun?.data_quality_grade ?? "-"} / ${dryRun?.data_quality_score ?? "-"}`} />
        </article>
      </section>

      <section className="content-grid">
        <ListPanel items={dryRun?.missing_module_flags ?? []} label="Missing Modules" />
        <ListPanel items={dryRun?.stale_data_flags ?? []} label="Stale / Data Flags" />
        <ListPanel items={dryRun?.warnings ?? []} label="Warnings" />
        <ListPanel items={source?.writes ?? []} label="Writes" fallback="No writes" />
      </section>
    </main>
  );
}

function runDryRunReport(symbol: string): { data: DryRunReport | null; status: string } {
  const result = spawnSync(process.execPath, ["scripts/report-cp3-tw-stock-dry-run.mjs", symbol], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  if (result.status !== 0) {
    return { data: null, status: "blocked" };
  }

  return { data: JSON.parse(result.stdout) as DryRunReport, status: "ok" };
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ListPanel({ fallback = "None", items, label }: { fallback?: string; items: string[]; label: string }) {
  return (
    <article className="panel">
      <p className="panel-label">{label}</p>
      <h2>{items.length ? `${items.length} items` : fallback}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
