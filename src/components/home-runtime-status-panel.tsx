import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";

type HomeRuntimeStatusPanelProps = {
  selectedSymbol: string;
};

export function HomeRuntimeStatusPanel({ selectedSymbol }: HomeRuntimeStatusPanelProps) {
  const readiness = getRuntimeReadinessSummary();
  const sourceDepth = getSourceDepthBlockerSummary();

  return (
    <section className="home-runtime-status-panel" aria-label="首頁 runtime 狀態摘要">
      <div>
        <p className="eyebrow">Runtime Status</p>
        <h2>目前仍以 mock-only runtime 推進</h2>
        <p>
          首頁先給使用者可瀏覽的產品入口，同時明確揭露目前沒有啟用 Supabase 真實讀取、
          沒有 SQL 動作，也沒有將 scoreSource 升級為 real。
        </p>
      </div>
      <article className="readying">
        <span>Runtime readiness</span>
        <strong>{readiness.score}%</strong>
        <p>{readiness.status}</p>
      </article>
      <article className="blocked">
        <span>Source depth</span>
        <strong>{sourceDepth.sourceDepthState}</strong>
        <p>scoreSource: {sourceDepth.scoreSource}</p>
      </article>
      <nav>
        <a href={`/stocks/${selectedSymbol}`}>查看目前標的</a>
        <a href="/briefing">查看 CEO/PM 摘要</a>
      </nav>
    </section>
  );
}
